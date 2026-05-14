#!/usr/bin/env node
/**
 * scripts/gcp-setup.mjs
 *
 * End-to-end GCP + Firebase setup via Google Cloud & Firebase SDKs.
 * Zero manual console steps.
 *
 *  Step  1 — Create GCP project              (Resource Manager API v3)
 *  Step  2 — Enable required GCP/Firebase APIs (Service Usage API v1)
 *  Step  3 — Add Firebase to the project      (Firebase Management API v1beta1)
 *  Step  4 — Set Firestore default location
 *  Step  5 — Register Firebase Web App & write SDK config → .env
 *  Step  6 — Create Firestore (default) database
 *  Step  7 — Deploy Firestore security rules  (Firebase Rules API v1)
 *  Step  8 — Enable email/password sign-in    (Identity Toolkit Admin API v2)
 *  Step  9 — Create admin Firebase Auth user  (Firebase Admin SDK)
 *  Step 10 — Seed all bootcamp/course data    (Firebase Admin SDK)
 *
 * Prerequisites:
 *   1. gcloud auth application-default login   ← one-time; sets up ADC
 *      OR set GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
 *   2. npm install  (googleapis, firebase-admin already in devDependencies)
 */

import { google } from "googleapis";
import { readFileSync, writeFileSync } from "fs";
import { createInterface } from "readline";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Firebase Admin SDK
import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const RULES_PATH = resolve(ROOT, "firestore.rules");
const ENV_PATH = resolve(ROOT, ".env");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Prompts ──────────────────────────────────────────────────────────────────

// ─── Parse CLI args ───────────────────────────────────────────────────────────
// Supports: --project=X --name=X --location=X --email=X
// Password is always prompted interactively for security.

function parseArgs() {
  const args = {};
  for (const arg of process.argv.slice(2)) {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    if (key) args[key] = rest.join("=");
  }
  return args;
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((r) => rl.question(q, r));

async function collectConfig() {
  const cli = parseArgs();

  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║   Riddoff — GCP + Firebase Automated Setup   ║");
  console.log("╚══════════════════════════════════════════════╝\n");

  // Use CLI arg if provided, otherwise prompt
  const projectId = cli.project ||
    (await ask("  GCP Project ID  (globally unique, e.g. riddoff-ai-2025) : ")).trim();

  const displayName = cli.name ||
    (await ask("  Display name    [Riddoff AI Course]                     : ")).trim() ||
    "Riddoff AI Course";

  const location = cli.location ||
    (await ask("  Firestore loc   [us-central]                            : ")).trim() ||
    "us-central";

  const adminEmail = cli.email ||
    (await ask("  Admin email                                              : ")).trim();

  // Password is always prompted — never passed via CLI arg
  const adminPass = (await ask("  Admin password  (≥ 6 chars)                             : ")).trim();

  rl.close();
  console.log();

  if (!projectId || !adminEmail || !adminPass)
    throw new Error("Project ID, admin email, and password are all required.");
  if (adminPass.length < 6) throw new Error("Password must be at least 6 characters.");

  // Echo resolved config (except password)
  console.log("  Project   :", projectId);
  console.log("  Name      :", displayName);
  console.log("  Location  :", location);
  console.log("  Admin     :", adminEmail);
  console.log();

  return { projectId, displayName, location, adminEmail, adminPass };
}

// ─── Logging helpers ──────────────────────────────────────────────────────────

const step = (n, total, msg) => console.log(`\n[${n}/${total}] ${msg}`);
const ok = (msg) => console.log(`       ✅  ${msg}`);
const skip = (msg) => console.log(`       ⏭   ${msg}`);
const warn = (msg) => console.log(`       ⚠️   ${msg}`);

// ─── Pre-flight: enable all needed APIs on quota project ─────────────────────
// Every googleapis call is billed/quoted to the quota project in ADC.
// Each API used by this script must be enabled there FIRST or we get 403s.

const QUOTA_PROJECT_APIS = [
  "cloudresourcemanager.googleapis.com",
  "firebase.googleapis.com",
  "firestore.googleapis.com",
  "firebaserules.googleapis.com",
  "identitytoolkit.googleapis.com",
  "serviceusage.googleapis.com",
];

async function ensureQuotaProjectApis(authClient) {
  const adcPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ??
    (process.platform === "win32"
      ? `${process.env.APPDATA}\\gcloud\\application_default_credentials.json`
      : `${process.env.HOME}/.config/gcloud/application_default_credentials.json`);

  let quotaProject;
  try {
    const adc = JSON.parse(readFileSync(adcPath, "utf8"));
    quotaProject = adc.quota_project_id;
  } catch {
    warn("Could not read ADC credentials file — skipping quota project API pre-enable.");
    return;
  }

  if (!quotaProject) {
    warn("No quota_project_id in ADC — skipping quota project API pre-enable.");
    return;
  }

  console.log(`\n[pre] Enabling required APIs on quota project "${quotaProject}"…`);
  const su = google.serviceusage({ version: "v1", auth: authClient });

  try {
    const { data: op } = await su.services.batchEnable({
      parent: `projects/${quotaProject}`,
      requestBody: { serviceIds: QUOTA_PROJECT_APIS },
    });
    if (op?.name) {
      await waitForOp(authClient, op.name, "https://serviceusage.googleapis.com/v1");
    }
    ok(`APIs enabled on quota project: ${QUOTA_PROJECT_APIS.join(", ")}`);
    await sleep(5000); // propagation delay
  } catch (e) {
    if (String(e.message).includes("already enabled")) {
      skip("APIs already enabled on quota project.");
    } else {
      warn(`Could not enable APIs on quota project: ${e.message}`);
      warn(`If later steps fail, run:\n  gcloud services enable ${QUOTA_PROJECT_APIS.join(" ")} --project=${quotaProject}`);
    }
  }
}

// ─── Generic long-running operation poller ────────────────────────────────────
// Each Google API returns an LRO with a `name` field.
// We poll the canonical REST endpoint until `done` is true.

async function waitForOp(authClient, opName, serviceBase) {
  // opName may look like "operations/abc", "projects/.../operations/abc", etc.
  const url = opName.startsWith("http") ? opName : `${serviceBase}/${opName}`;
  process.stdout.write("       waiting");
  for (let i = 0; i < 60; i++) {
    const { data } = await authClient.request({ url, method: "GET" });
    if (data.done) {
      process.stdout.write(" ✅\n");
      if (data.error) throw new Error(`Operation failed: ${JSON.stringify(data.error)}`);
      return data;
    }
    process.stdout.write(".");
    await sleep(5000);
  }
  throw new Error("Operation timed out after 5 minutes.");
}

// ─── Step 1 — Create GCP project ─────────────────────────────────────────────

async function createProject(authClient, { projectId, displayName }) {
  step(1, 10, `Creating GCP project "${projectId}"…`);
  const crm = google.cloudresourcemanager({ version: "v3", auth: authClient });

  try {
    const existing = await crm.projects
      .get({ name: `projects/${projectId}` })
      .catch(() => null);
    if (existing?.data?.projectId) {
      skip("Project already exists.");
      return;
    }

    const { data: op } = await crm.projects.create({
      requestBody: { projectId, displayName },
    });
    await waitForOp(
      authClient,
      op.name,
      "https://cloudresourcemanager.googleapis.com/v3"
    );
    ok(`Project created: ${projectId}`);
  } catch (e) {
    if (String(e.message).includes("cloudresourcemanager.googleapis.com")) {
      const quotaProject = await getQuotaProject();
      console.error(`
  ❌  Cloud Resource Manager API is not enabled on your quota project.

      Fix (takes ~30 seconds — just click Enable in your browser):
      https://console.developers.google.com/apis/api/cloudresourcemanager.googleapis.com/overview?project=${quotaProject}

      Then re-run: node scripts/gcp-setup.mjs --project=${projectId} --name="Riddoff AI Course" --location=us-central --email=system@riddoff.com
`);
      process.exit(1);
    }
    throw e;
  }
}

function getQuotaProject() {
  try {
    const adcPath =
      process.env.GOOGLE_APPLICATION_CREDENTIALS ??
      (process.platform === "win32"
        ? `${process.env.APPDATA}\\gcloud\\application_default_credentials.json`
        : `${process.env.HOME}/.config/gcloud/application_default_credentials.json`);
    const adc = JSON.parse(readFileSync(adcPath, "utf8"));
    return adc.quota_project_id ?? "your-quota-project";
  } catch {
    return "your-quota-project";
  }
}

// ─── Step 2 — Enable APIs ─────────────────────────────────────────────────────

const REQUIRED_APIS = [
  "firebase.googleapis.com",
  "firestore.googleapis.com",
  "firebaserules.googleapis.com",
  "identitytoolkit.googleapis.com",
];

async function enableApis(authClient, projectId) {
  step(2, 10, "Enabling required APIs…");
  const su = google.serviceusage({ version: "v1", auth: authClient });

  const { data: op } = await su.services.batchEnable({
    parent: `projects/${projectId}`,
    requestBody: { serviceIds: REQUIRED_APIS },
  });
  await waitForOp(authClient, op.name, "https://serviceusage.googleapis.com/v1");
  ok(`APIs enabled: ${REQUIRED_APIS.join(", ")}`);

  // Short delay — newly enabled APIs take a moment to propagate
  await sleep(6000);
}

// ─── IAM: grant Firebase Admin role to the calling user ──────────────────────
// The user who created the project is already roles/owner, but sometimes the
// Firebase Management API enforces roles/firebase.admin explicitly.

async function grantCallerFirebaseAdmin(authClient, projectId) {
  let userEmail;
  try {
    const oauth2 = google.oauth2({ version: "v2", auth: authClient });
    const { data } = await oauth2.userinfo.get();
    userEmail = data.email;
  } catch {
    warn("Could not determine caller email — skipping IAM pre-grant.");
    return;
  }

  console.log(`\n[pre3] Ensuring roles/firebase.admin for ${userEmail} on ${projectId}…`);
  try {
    const crm = google.cloudresourcemanager({ version: "v1", auth: authClient });
    const { data: policy } = await crm.projects.getIamPolicy({
      resource: projectId,
      requestBody: {},
    });

    policy.bindings = policy.bindings ?? [];
    const member = `user:${userEmail}`;
    const binding = policy.bindings.find((b) => b.role === "roles/firebase.admin");

    if (binding?.members?.includes(member)) {
      skip(`${userEmail} already has roles/firebase.admin.`);
      return;
    }

    if (binding) {
      binding.members.push(member);
    } else {
      policy.bindings.push({ role: "roles/firebase.admin", members: [member] });
    }

    await crm.projects.setIamPolicy({ resource: projectId, requestBody: { policy } });
    ok(`Granted roles/firebase.admin to ${userEmail}`);
    await sleep(15000); // wait for IAM propagation
  } catch (e) {
    warn(`Could not grant Firebase Admin role: ${e.message}`);
  }
}

// ─── Step 3 — Add Firebase to project ────────────────────────────────────────

async function addFirebase(authClient, projectId) {
  step(3, 10, "Adding Firebase resources to the project…");
  const fb = google.firebase({ version: "v1beta1", auth: authClient });

  const proj = await fb.projects
    .get({ name: `projects/${projectId}` })
    .catch(() => null);
  if (proj?.data?.projectId) {
    skip("Firebase already provisioned on this project.");
    return;
  }

  // Retry up to 3 times — IAM / API propagation can be slow
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { data: op } = await fb.projects.addFirebase({
        project: `projects/${projectId}`,
        requestBody: {},
      });
      await waitForOp(authClient, op.name, "https://firebase.googleapis.com/v1beta1");
      ok("Firebase resources provisioned.");
      await sleep(4000);
      return;
    } catch (e) {
      lastErr = e;
      const msg = String(e.message ?? e);
      // Only retry on permission / propagation errors
      if (!msg.includes("permission") && !msg.includes("403") && !msg.includes("propagat")) {
        throw e;
      }
      if (attempt < 3) {
        warn(`Attempt ${attempt}/3 failed (${msg.slice(0, 80)}). Retrying in 20s…`);
        await sleep(20000);
      }
    }
  }
  // All retries exhausted — print diagnostics
  const quota = getQuotaProject();
  console.error(`
  ❌  Could not add Firebase to "${projectId}" after 3 attempts.
      Error: ${lastErr?.message ?? lastErr}

      This usually means the calling Google account lacks roles/firebase.admin.
      Fix: open this URL and click Enable, then re-run the script:
      https://console.firebase.google.com/        (sign in, then click "Add project" — you should see "${projectId}" offered)
      OR grant roles manually:
        gcloud projects add-iam-policy-binding ${projectId} \\
          --member="user:<YOUR_GOOGLE_ACCOUNT>" \\
          --role="roles/firebase.admin"
`);
  process.exit(1);
}

// ─── Step 4 — Finalize default resource location ─────────────────────────────

async function finalizeLocation(authClient, projectId, location) {
  step(4, 10, `Setting default resource location → ${location}…`);
  const fb = google.firebase({ version: "v1beta1", auth: authClient });

  try {
    const { data: op } = await fb.projects.defaultLocation.finalize({
      parent: `projects/${projectId}`,
      requestBody: { locationId: location },
    });
    await waitForOp(authClient, op.name, "https://firebase.googleapis.com/v1beta1");
    ok(`Default location set: ${location}`);
  } catch (e) {
    if (String(e.message).includes("already been finalized") || e.code === 409) {
      skip("Default location already finalized.");
    } else {
      throw e;
    }
  }
}

// ─── Step 5 — Register Web App + write .env ───────────────────────────────────

async function setupWebApp(authClient, projectId) {
  step(5, 10, "Registering Firebase Web App & writing .env…");
  const fb = google.firebase({ version: "v1beta1", auth: authClient });

  // Re-use an existing web app if one already exists
  const list = await fb.projects.webApps.list({ parent: `projects/${projectId}` });
  let appName = list.data.apps?.[0]?.name;

  if (!appName) {
    const { data: op } = await fb.projects.webApps.create({
      parent: `projects/${projectId}`,
      requestBody: { displayName: "Riddoff Web" },
    });
    await waitForOp(authClient, op.name, "https://firebase.googleapis.com/v1beta1");
    const list2 = await fb.projects.webApps.list({ parent: `projects/${projectId}` });
    appName = list2.data.apps?.[0]?.name;
  }

  if (!appName) throw new Error("Could not find or create Firebase Web App.");

  const { data: cfg } = await fb.projects.webApps.getConfig({
    name: `${appName}/config`,
  });

  const envLines = [
    `VITE_FIREBASE_API_KEY=${cfg.apiKey}`,
    `VITE_FIREBASE_AUTH_DOMAIN=${cfg.authDomain}`,
    `VITE_FIREBASE_PROJECT_ID=${cfg.projectId}`,
    `VITE_FIREBASE_STORAGE_BUCKET=${cfg.storageBucket ?? ""}`,
    `VITE_FIREBASE_MESSAGING_SENDER_ID=${cfg.messagingSenderId}`,
    `VITE_FIREBASE_APP_ID=${cfg.appId}`,
  ].join("\n");

  writeFileSync(ENV_PATH, envLines, "utf8");
  ok(`.env written with Firebase SDK config.`);
  return cfg;
}

// ─── Step 6 — Create Firestore database ──────────────────────────────────────

async function createFirestoreDatabase(authClient, projectId, location) {
  step(6, 10, "Creating Firestore (default) database…");
  const fs = google.firestore({ version: "v1", auth: authClient });
  const dbPath = `projects/${projectId}/databases/(default)`;

  const existing = await fs.projects.databases.get({ name: dbPath }).catch(() => null);
  if (existing?.data?.name) {
    skip("Firestore database already exists.");
    return;
  }

  try {
    const { data: op } = await fs.projects.databases.create({
      parent: `projects/${projectId}`,
      databaseId: "(default)",
      requestBody: {
        type: "FIRESTORE_NATIVE",
        locationId: location,
      },
    });
    await waitForOp(authClient, op.name, "https://firestore.googleapis.com/v1");
    ok("Firestore database created.");
  } catch (e) {
    if (String(e.message).includes("already exists")) {
      skip("Firestore database already exists.");
    } else {
      throw e;
    }
  }
}

// ─── Step 7 — Deploy Firestore security rules ─────────────────────────────────

async function deployFirestoreRules(authClient, projectId) {
  step(7, 10, "Deploying Firestore security rules…");
  const rulesApi = google.firebaserules({ version: "v1", auth: authClient });
  const rulesSource = readFileSync(RULES_PATH, "utf8");

  // Create a new ruleset
  const { data: ruleset } = await rulesApi.projects.rulesets.create({
    name: `projects/${projectId}`,
    requestBody: {
      source: { files: [{ name: "firestore.rules", content: rulesSource }] },
    },
  });

  // Point the cloud.firestore release to this ruleset
  const releaseName = `projects/${projectId}/releases/cloud.firestore`;
  try {
    // Update if release already exists
    await rulesApi.projects.releases.patch({
      name: releaseName,
      requestBody: { name: releaseName, rulesetName: ruleset.name },
    });
  } catch {
    // Create if it doesn't exist
    await rulesApi.projects.releases.create({
      name: `projects/${projectId}`,
      requestBody: { name: releaseName, rulesetName: ruleset.name },
    });
  }
  ok("Security rules deployed.");
}

// ─── Step 8 — Enable email/password sign-in ───────────────────────────────────

async function enableEmailAuth(authClient, projectId) {
  step(8, 10, "Enabling email/password sign-in…");
  const idtk = google.identitytoolkit({ version: "v2", auth: authClient });

  try {
    await idtk.projects.updateConfig({
      name: `projects/${projectId}/config`,
      updateMask: "signIn.email.enabled,signIn.email.passwordRequired",
      requestBody: {
        signIn: { email: { enabled: true, passwordRequired: true } },
      },
    });
    ok("Email/password sign-in enabled.");
  } catch (e) {
    warn(
      `Could not enable via API (${e.message}). ` +
        "Enable it manually: Firebase Console → Authentication → Sign-in method → Email/Password."
    );
  }
}

// ─── Step 9 — Create admin user ───────────────────────────────────────────────

async function createAdminUser(projectId, adminEmail, adminPass) {
  step(9, 10, `Creating admin user (${adminEmail})…`);

  // Initialize Firebase Admin SDK using ADC
  if (!getApps().length) {
    initializeApp({ credential: applicationDefault(), projectId });
  }
  const fbAuth = getAuth();

  const existing = await fbAuth.getUserByEmail(adminEmail).catch(() => null);
  if (existing) {
    skip(`User ${adminEmail} already exists.`);
    return;
  }
  await fbAuth.createUser({ email: adminEmail, password: adminPass });
  ok(`Admin user created: ${adminEmail}`);
}

// ─── Step 10 — Seed Firestore ─────────────────────────────────────────────────

const BOOTCAMPS = [
  { id: "ai-dropshipping-empire", title: "AI Dropshipping Empire", sector: "E-commerce & Retail", tagline: "Build an AI agent that sources, prices, and sells products across 5 marketplaces in 14 hours.", description: "Automate product discovery and pricing. Deploy live seller across multiple marketplaces.", fullDescription: "In this intensive 14-hour bootcamp, you'll build a production-ready AI agent that automates the entire dropshipping workflow. Learn to scrape product data, implement dynamic pricing algorithms, and deploy across Shopify, Amazon, eBay, and other major marketplaces.", hours: 14, priceLow: 1999, seats: 35, image: "/assets/fp1.png", instructor: "Rahul Menon", outcomes: ["Live dropshipping agent", "Multi-marketplace deployment", "Revenue-generating system"], syllabus: ["Data scraping with Python", "AI pricing engine", "Multi-platform APIs", "Real-time monitoring dashboard"], level: "Intermediate", reviewCount: 1204, enrolledCount: 12340 },
  { id: "ai-underwriting-engine", title: "AI Underwriting Engine", sector: "Fintech & Banking", tagline: "Build a credit scoring AI that ingests PDFs, pulls APIs, and makes lending decisions in real time.", description: "Process loan applications with AI-driven risk assessment.", fullDescription: "Learn to build a production credit scoring system that banks use daily. You'll integrate document parsing, API calls to bureaus, and ML models to make lending decisions in milliseconds.", hours: 14, priceLow: 2499, seats: 30, image: "/assets/fp2.png", instructor: "Aishwarya Krishnan", outcomes: ["Credit scoring model", "Document processing pipeline", "API integration suite"], syllabus: ["PDF parsing", "Bureau APIs", "Risk modeling", "Compliance checks"], level: "Advanced", reviewCount: 892, enrolledCount: 8920 },
  { id: "ai-patient-triage-system", title: "AI Patient Triage System", sector: "Healthcare & Biotech", tagline: "Build a multi-stage triage AI that reads medical notes, flags high-risk patients, and routes them to specialists.", description: "Analyze medical records and prioritize urgent cases.", fullDescription: "Healthcare AI at scale. Build systems that hospitals deploy to prioritize patient care. Learn NLP for medical notes, risk stratification, and integration with hospital systems.", hours: 14, priceLow: 2799, seats: 25, image: "/assets/fp3.png", instructor: "Dr. Priya Nambiar", outcomes: ["Triage algorithm", "Risk prediction model", "Hospital integration"], syllabus: ["Medical NLP", "Clinical data", "Risk scoring", "HIPAA compliance"], level: "Advanced", reviewCount: 756, enrolledCount: 7560 },
  { id: "ai-contract-analyzer", title: "AI Contract Analyzer", sector: "Legal Tech", tagline: "Build an AI that reads contracts, flags risks, and extracts terms automatically.", description: "Extract contract terms and identify legal risks. Automate document review.", fullDescription: "Legal automation is a $10B market. Learn to extract clauses, identify risks, and flag unusual terms. Real contracts from venture deals and enterprise agreements.", hours: 14, priceLow: 2299, seats: 28, image: "/assets/fp4.png", instructor: "Vikram Suresh", outcomes: ["Term extraction engine", "Risk flagging system", "Contract analysis dashboard"], syllabus: ["Document parsing", "Legal entity recognition", "Risk patterns", "Integration APIs"], level: "Intermediate", reviewCount: 1043, enrolledCount: 10430 },
  { id: "ai-carbon-footprint-tracker", title: "AI Carbon Footprint Tracker", sector: "Climate & Sustainability", tagline: "Build an AI that ingests supply chain data and auto-calculates carbon footprints.", description: "Track supply chain emissions automatically. Calculate carbon impact.", fullDescription: "ESG reporting is mandatory now. Build systems that calculate carbon footprints across supply chains using AI. Real data from Fortune 500 companies.", hours: 14, priceLow: 2599, seats: 32, image: "/assets/fp5.png", instructor: "Meera Pillai", outcomes: ["Carbon calculator", "Supply chain dashboard", "ESG reporting module"], syllabus: ["Supply chain data", "Emission factors", "Scope 1-3 tracking", "Reporting standards"], level: "Intermediate", reviewCount: 634, enrolledCount: 6340 },
  { id: "ai-quality-inspector", title: "AI Quality Inspector", sector: "Manufacturing", tagline: "Build a vision AI that detects defects in real-time on factory floors using live camera feeds.", description: "Detect manufacturing defects in real-time. Deploy computer vision on factory floors.", fullDescription: "Computer vision on the production line. Detect defects faster than human inspectors, reduce waste, and improve quality. Real manufacturing data included.", hours: 14, priceLow: 1699, seats: 25, image: "/assets/fp6.png", instructor: "Anand Rajan", outcomes: ["Defect detection model", "Camera system integration", "Real-time alerts"], syllabus: ["Object detection", "Real-time processing", "Edge deployment", "Model optimization"], level: "Intermediate", reviewCount: 987, enrolledCount: 9870 },
];

const COURSES = [
  { id: "ai-fundamentals-bootcamp", title: "AI Fundamentals Bootcamp", category: "Foundations", tagline: "Master the foundations of modern AI: LLMs, embeddings, fine-tuning, and prompt engineering.", description: "Learn LLMs, embeddings, and prompt engineering. Foundation for all AI work.", fullDescription: "Start here. Learn LLMs from first principles, understand embeddings, master prompt engineering, and set up your dev environment. 16 hours of content, 4 weeks to complete.", hours: 16, weeks: 4, priceLow: 1999, image: "/assets/fp7.png", instructor: "Sanjay Iyer", outcomes: ["LLM fundamentals", "Prompt engineering skills", "Dev environment setup"], syllabus: ["LLM architectures", "Embeddings & vectors", "Fine-tuning techniques", "API integrations"], level: "Beginner", reviewCount: 4521, enrolledCount: 45210 },
  { id: "rag-systems-masterclass", title: "RAG Systems Masterclass", category: "LLM & RAG", tagline: "Build production RAG systems: semantic search, chunking strategies, and reranking.", description: "Master semantic search, chunking, and reranking. Build production RAG systems.", fullDescription: "RAG (Retrieval-Augmented Generation) powers ChatGPT plugins. Learn advanced retrieval, chunking strategies, and reranking to build systems that actually work.", hours: 12, weeks: 3, priceLow: 2499, image: "/assets/fp8.png", instructor: "Deepa Varma", outcomes: ["Production RAG system", "Semantic search setup", "Reranking implementation"], syllabus: ["Vector databases", "Chunking strategies", "Semantic search", "Evaluation metrics"], level: "Intermediate", reviewCount: 2876, enrolledCount: 28760 },
  { id: "ai-agents-orchestration", title: "AI Agents & Orchestration", category: "Agents & Orchestration", tagline: "Build multi-agent systems: ReAct, tool calling, agent workflows, and error handling.", description: "Build multi-agent systems with ReAct and tool calling. Handle errors gracefully.", fullDescription: "Multi-agent systems are the future. Learn ReAct framework, tool calling, error recovery, and orchestration patterns. Build a 5-agent system by end of course.", hours: 14, weeks: 4, priceLow: 2799, image: "/assets/fp9.png", instructor: "Karthik Nair", outcomes: ["Multi-agent system", "Tool-use implementation", "Error handling"], syllabus: ["ReAct framework", "Tool calling", "Agent communication", "Monitoring agents"], level: "Advanced", reviewCount: 1987, enrolledCount: 19870 },
  { id: "computer-vision-production", title: "Computer Vision for Production", category: "Computer Vision", tagline: "Build production computer vision systems: detection, segmentation, and deployment.", description: "Learn detection and segmentation. Deploy vision models to production.", fullDescription: "From notebooks to production. Learn YOLO, segmentation, model optimization, and deployment on edge devices. Real computer vision projects.", hours: 18, weeks: 5, priceLow: 2299, image: "/assets/fp10.png", instructor: "Divya Krishnan", outcomes: ["Detection system", "Segmentation model", "Edge deployment"], syllabus: ["Object detection", "Segmentation", "Model compression", "Deployment options"], level: "Intermediate", reviewCount: 2134, enrolledCount: 21340 },
  { id: "mlops-model-deployment", title: "MLOps & Model Deployment", category: "MLOps & Deployment", tagline: "Ship ML models to production: orchestration, monitoring, serving, and scaling.", description: "Orchestrate, monitor, and scale ML models. Ship to production confidently.", fullDescription: "MLOps is the new ops. Learn containerization, orchestration with Kubernetes, model serving, monitoring, and scaling. Real DevOps patterns.", hours: 16, weeks: 4, priceLow: 2599, image: "/assets/fp11.png", instructor: "Arjun Menon", outcomes: ["Containerized model", "K8s deployment", "Monitoring setup"], syllabus: ["Docker & containers", "Kubernetes basics", "Model serving", "CI/CD for ML"], level: "Intermediate", reviewCount: 1765, enrolledCount: 17650 },
  { id: "ai-ecommerce-search-recommendations", title: "AI for E-commerce: Search & Recommendations", category: "Industry Applications", tagline: "Build AI systems for e-commerce: semantic search, personalization, and pricing.", description: "Build semantic search and recommendation engines. Personalize user experiences.", fullDescription: "E-commerce AI powers Shopify, Amazon, and Alibaba. Learn semantic search, personalization algorithms, and dynamic pricing.", hours: 10, weeks: 3, priceLow: 1699, image: "/assets/fp12.png", instructor: "Nithya Suresh", outcomes: ["Search system", "Recommendation engine", "Personalization"], syllabus: ["Semantic search", "Collaborative filtering", "Content-based rec", "Pricing algorithms"], level: "Beginner", reviewCount: 3210, enrolledCount: 32100 },
];

const INSTRUCTORS = [
  { name: "Rahul Menon", title: "AI Engineer & E-commerce Specialist", bio: "Rahul has 8 years of experience building e-commerce automation systems. He previously worked with Flipkart's AI team and now runs his own AI consulting practice serving D2C brands across India.", courses: 3, learners: 18400 },
  { name: "Aishwarya Krishnan", title: "Fintech AI Specialist", bio: "Aishwarya is a fintech engineer who has built credit scoring systems for NBFC clients. She holds an MTech in Machine Learning from IIT Madras and specialises in risk modelling and financial NLP.", courses: 2, learners: 11200 },
  { name: "Dr. Priya Nambiar", title: "Healthcare AI Researcher", bio: "Dr. Priya holds a PhD in Biomedical Informatics and spent 6 years at Apollo Hospitals building clinical AI tools. She is one of India's leading voices on responsible AI in healthcare.", courses: 2, learners: 9800 },
  { name: "Vikram Suresh", title: "Legal Tech Engineer", bio: "Vikram spent 5 years at a Big Four firm automating contract review workflows before founding his own legal-tech startup. He is the author of 'AI for Lawyers' — a widely read guide on LLMs in legal practice.", courses: 2, learners: 13000 },
  { name: "Meera Pillai", title: "Sustainability Data Scientist", bio: "Meera leads sustainability analytics at a Fortune 500 consulting firm. She has built ESG reporting tools used by 40+ listed companies and advises startups on climate data infrastructure.", courses: 1, learners: 7800 },
  { name: "Anand Rajan", title: "Computer Vision Engineer", bio: "Anand has deployed computer vision systems at Toyota, Tata Steel, and several tier-2 auto-component manufacturers. He is a YOLO contributor and maintains open-source tools for edge ML deployment.", courses: 3, learners: 14500 },
  { name: "Sanjay Iyer", title: "AI Educator & LLM Specialist", bio: "Sanjay has taught AI to over 45,000 students across cohort and async formats. He was previously a Research Engineer at Hugging Face and simplifies complex transformer concepts better than anyone in the space.", courses: 4, learners: 54000 },
  { name: "Deepa Varma", title: "RAG Systems Architect", bio: "Deepa has built RAG pipelines for enterprise clients in banking, insurance, and e-commerce. She is a Weaviate community ambassador and runs a popular newsletter on production retrieval systems.", courses: 2, learners: 32000 },
  { name: "Karthik Nair", title: "Multi-Agent Systems Engineer", bio: "Karthik is one of India's foremost practitioners of agentic AI, having built autonomous systems for logistics, procurement, and customer service. He is a regular speaker at AI conferences across APAC.", courses: 3, learners: 23000 },
  { name: "Divya Krishnan", title: "Computer Vision Production Specialist", bio: "Divya specialises in taking CV models from research to production. She has led computer vision teams at Ola and PhonePe, and has published three papers on model compression for edge devices.", courses: 2, learners: 26000 },
  { name: "Arjun Menon", title: "MLOps Engineer", bio: "Arjun is an MLOps practitioner who has designed CI/CD pipelines for ML teams at scale-ups and enterprises. He holds GCP and AWS ML certifications and contributes to MLflow and Kubeflow.", courses: 3, learners: 21000 },
  { name: "Nithya Suresh", title: "E-commerce AI Specialist", bio: "Nithya has built recommendation and search systems for Myntra, Nykaa, and several D2C brands. She holds an MSc in Information Retrieval and is passionate about personalisation at scale.", courses: 2, learners: 37000 },
];

const TESTIMONIALS = [
  { name: "Priya Menon", role: "ML Engineer at Infosys", initials: "PM", quote: "The RAG Systems Masterclass was exactly what I needed. I deployed my first production RAG system within a week of completing it.", order: 1 },
  { name: "Arjun Nair", role: "Data Scientist at HDFC Bank", initials: "AN", quote: "The AI Underwriting bootcamp was intense but the TA support was incredible. I had a working credit scoring model by Sunday evening.", order: 2 },
  { name: "Kavya Sharma", role: "Software Engineer at Wipro", initials: "KS", quote: "I went from zero AI knowledge to deploying a multi-agent system in 4 weeks. The course structure is much better than anything else I tried.", order: 3 },
];

const REVIEWS = [
  { courseId: "rag-systems-masterclass", name: "Arun K.", rating: 5, text: "Incredibly practical. I built and deployed the project during the course itself." },
  { courseId: "rag-systems-masterclass", name: "Sneha M.", rating: 5, text: "Best AI course I've taken. The instructor explains complex concepts in plain terms and the TA support is fast and helpful." },
  { courseId: "rag-systems-masterclass", name: "Rohan P.", rating: 4, text: "Great content and pacing. The hands-on projects are what make this stand out." },
];

const PLATFORM_STATS = {
  learners: "50,500+", avgRating: "4.7", programs: "12", hiringPartners: "28",
  partners: ["Google", "Microsoft", "Amazon", "Meta", "IBM", "Deloitte"],
};

function nameToSlug(name) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

async function seedData() {
  step(10, 10, "Seeding Firestore collections…");
  const db = getFirestore();

  // Use batched writes (max 500 per batch)
  let batch = db.batch();
  let count = 0;

  const flush = async () => {
    if (count > 0) { await batch.commit(); batch = db.batch(); count = 0; }
  };
  const write = async (ref, data) => {
    batch.set(ref, data);
    count++;
    if (count >= 490) await flush();
  };

  for (const { id, ...data } of BOOTCAMPS) {
    await write(db.collection("bootcamps").doc(id), data);
    process.stdout.write(`       ✓ bootcamps/${id}\n`);
  }
  for (const { id, ...data } of COURSES) {
    await write(db.collection("courses").doc(id), data);
    process.stdout.write(`       ✓ courses/${id}\n`);
  }
  for (const inst of INSTRUCTORS) {
    const slug = nameToSlug(inst.name);
    await write(db.collection("instructors").doc(slug), inst);
    process.stdout.write(`       ✓ instructors/${slug}\n`);
  }
  for (const t of TESTIMONIALS) {
    await write(db.collection("testimonials").doc(), { ...t, createdAt: Date.now() });
    process.stdout.write(`       ✓ testimonials/${t.name}\n`);
  }
  for (const r of REVIEWS) {
    await write(db.collection("reviews").doc(), { ...r, createdAt: Date.now() });
    process.stdout.write(`       ✓ reviews/${r.courseId}/${r.name}\n`);
  }
  await write(db.collection("platform_stats").doc("main"), PLATFORM_STATS);

  await flush();
  ok("All collections seeded.");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const { projectId, displayName, location, adminEmail, adminPass } = await collectConfig();

  // Build authenticated Google API client (reads ADC or GOOGLE_APPLICATION_CREDENTIALS)
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const authClient = await auth.getClient();

  await ensureQuotaProjectApis(authClient);
  await createProject(authClient, { projectId, displayName });
  await grantCallerFirebaseAdmin(authClient, projectId);
  await enableApis(authClient, projectId);
  await addFirebase(authClient, projectId);
  await finalizeLocation(authClient, projectId, location);
  await setupWebApp(authClient, projectId);
  await createFirestoreDatabase(authClient, projectId, location);
  await deployFirestoreRules(authClient, projectId);
  await enableEmailAuth(authClient, projectId);
  await createAdminUser(projectId, adminEmail, adminPass);
  await seedData();

  console.log("\n╔═══════════════════════════════════════════╗");
  console.log("║              🎉  All done!                 ║");
  console.log("╚═══════════════════════════════════════════╝");
  console.log(`\n   Firebase Console : https://console.firebase.google.com/project/${projectId}`);
  console.log(`   GCP Console      : https://console.cloud.google.com/project/${projectId}`);
  console.log(`   Admin panel      : http://localhost:8080/admin`);
  console.log("\n   Next: npm run dev\n");
}

main().catch((err) => {
  console.error("\n❌  Setup failed:", err.message ?? err);
  process.exit(1);
});
