/**
 * Firestore Seed Script
 * Seeds all mock data into Firestore.
 *
 * Setup:
 *   1. npm install -g firebase-tools (or use npx)
 *   2. Download service account key from Firebase Console →
 *      Project Settings → Service accounts → Generate new private key
 *   3. Save the key as service-account-key.json in the project root
 *   4. npm install firebase-admin --save-dev
 *   5. node scripts/seed.mjs
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  readFileSync(resolve(__dirname, "../service-account-key.json"), "utf8")
);

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// ─── Data ─────────────────────────────────────────────────────────────────────

const bootcamps = [
  {
    id: "ai-dropshipping-empire",
    title: "AI Dropshipping Empire",
    sector: "E-commerce & Retail",
    tagline: "Build an AI agent that sources, prices, and sells products across 5 marketplaces in 14 hours.",
    description: "Automate product discovery and pricing. Deploy live seller across multiple marketplaces.",
    fullDescription: "In this intensive 14-hour bootcamp, you'll build a production-ready AI agent that automates the entire dropshipping workflow. Learn to scrape product data, implement dynamic pricing algorithms, and deploy across Shopify, Amazon, eBay, and other major marketplaces. By the end, you'll have a live agent generating revenue.",
    hours: 14, priceLow: 1999, seats: 35,
    image: "/assets/fp1.png", instructor: "Rahul Menon",
    outcomes: ["Live dropshipping agent", "Multi-marketplace deployment", "Revenue-generating system"],
    syllabus: ["Data scraping with Python", "AI pricing engine", "Multi-platform APIs", "Real-time monitoring dashboard"],
    level: "Intermediate", reviewCount: 1204, enrolledCount: 12340,
  },
  {
    id: "ai-underwriting-engine",
    title: "AI Underwriting Engine",
    sector: "Fintech & Banking",
    tagline: "Build a credit scoring AI that ingests PDFs, pulls APIs, and makes lending decisions in real time.",
    description: "Process loan applications with AI-driven risk assessment. Integrate documents and APIs seamlessly.",
    fullDescription: "Learn to build a production credit scoring system that banks use daily. You'll integrate document parsing, API calls to bureaus, and ML models to make lending decisions in milliseconds. Real case studies from fintech companies.",
    hours: 14, priceLow: 2499, seats: 30,
    image: "/assets/fp2.png", instructor: "Aishwarya Krishnan",
    outcomes: ["Credit scoring model", "Document processing pipeline", "API integration suite"],
    syllabus: ["PDF parsing", "Bureau APIs", "Risk modeling", "Compliance checks"],
    level: "Advanced", reviewCount: 892, enrolledCount: 8920,
  },
  {
    id: "ai-patient-triage-system",
    title: "AI Patient Triage System",
    sector: "Healthcare & Biotech",
    tagline: "Build a multi-stage triage AI that reads medical notes, flags high-risk patients, and routes them to specialists.",
    description: "Analyze medical records and prioritize urgent cases. Route patients to appropriate specialists.",
    fullDescription: "Healthcare AI at scale. Build systems that hospitals deploy to prioritize patient care. Learn NLP for medical notes, risk stratification, and integration with hospital systems.",
    hours: 14, priceLow: 2799, seats: 25,
    image: "/assets/fp3.png", instructor: "Dr. Priya Nambiar",
    outcomes: ["Triage algorithm", "Risk prediction model", "Hospital integration"],
    syllabus: ["Medical NLP", "Clinical data", "Risk scoring", "HIPAA compliance"],
    level: "Advanced", reviewCount: 756, enrolledCount: 7560,
  },
  {
    id: "ai-contract-analyzer",
    title: "AI Contract Analyzer",
    sector: "Legal Tech",
    tagline: "Build an AI that reads contracts, flags risks, and extracts terms automatically for in-house legal teams.",
    description: "Extract contract terms and identify legal risks. Automate document review for legal teams.",
    fullDescription: "Legal automation is a $10B market. Learn to extract clauses, identify risks, and flag unusual terms. Real contracts from venture deals and enterprise agreements.",
    hours: 14, priceLow: 2299, seats: 28,
    image: "/assets/fp4.png", instructor: "Vikram Suresh",
    outcomes: ["Term extraction engine", "Risk flagging system", "Contract analysis dashboard"],
    syllabus: ["Document parsing", "Legal entity recognition", "Risk patterns", "Integration APIs"],
    level: "Intermediate", reviewCount: 1043, enrolledCount: 10430,
  },
  {
    id: "ai-carbon-footprint-tracker",
    title: "AI Carbon Footprint Tracker",
    sector: "Climate & Sustainability",
    tagline: "Build an AI that ingests supply chain data and auto-calculates carbon footprints for enterprises.",
    description: "Track supply chain emissions automatically. Calculate carbon impact across operations.",
    fullDescription: "ESG reporting is mandatory now. Build systems that calculate carbon footprints across supply chains using AI. Real data from Fortune 500 companies.",
    hours: 14, priceLow: 2599, seats: 32,
    image: "/assets/fp5.png", instructor: "Meera Pillai",
    outcomes: ["Carbon calculator", "Supply chain dashboard", "ESG reporting module"],
    syllabus: ["Supply chain data", "Emission factors", "Scope 1-3 tracking", "Reporting standards"],
    level: "Intermediate", reviewCount: 634, enrolledCount: 6340,
  },
  {
    id: "ai-quality-inspector",
    title: "AI Quality Inspector",
    sector: "Manufacturing",
    tagline: "Build a vision AI that detects defects in real-time on factory floors using live camera feeds.",
    description: "Detect manufacturing defects in real-time. Deploy computer vision on factory floors.",
    fullDescription: "Computer vision on the production line. Detect defects faster than human inspectors, reduce waste, and improve quality. Real manufacturing data included.",
    hours: 14, priceLow: 1699, seats: 25,
    image: "/assets/fp6.png", instructor: "Anand Rajan",
    outcomes: ["Defect detection model", "Camera system integration", "Real-time alerts"],
    syllabus: ["Object detection", "Real-time processing", "Edge deployment", "Model optimization"],
    level: "Intermediate", reviewCount: 987, enrolledCount: 9870,
  },
];

const courses = [
  {
    id: "ai-fundamentals-bootcamp",
    title: "AI Fundamentals Bootcamp",
    category: "Foundations",
    tagline: "Master the foundations of modern AI: LLMs, embeddings, fine-tuning, and prompt engineering.",
    description: "Learn LLMs, embeddings, and prompt engineering. Foundation for all AI work.",
    fullDescription: "Start here. Learn LLMs from first principles, understand embeddings, master prompt engineering, and set up your dev environment. 16 hours of content, 4 weeks to complete.",
    hours: 16, weeks: 4, priceLow: 1999,
    image: "/assets/fp7.png", instructor: "Sanjay Iyer",
    outcomes: ["LLM fundamentals", "Prompt engineering skills", "Dev environment setup"],
    syllabus: ["LLM architectures", "Embeddings & vectors", "Fine-tuning techniques", "API integrations"],
    level: "Beginner", reviewCount: 4521, enrolledCount: 45210,
  },
  {
    id: "rag-systems-masterclass",
    title: "RAG Systems Masterclass",
    category: "LLM & RAG",
    tagline: "Build production RAG systems: semantic search, chunking strategies, and reranking.",
    description: "Master semantic search, chunking, and reranking. Build production RAG systems.",
    fullDescription: "RAG (Retrieval-Augmented Generation) powers ChatGPT plugins. Learn advanced retrieval, chunking strategies, and reranking to build systems that actually work.",
    hours: 12, weeks: 3, priceLow: 2499,
    image: "/assets/fp8.png", instructor: "Deepa Varma",
    outcomes: ["Production RAG system", "Semantic search setup", "Reranking implementation"],
    syllabus: ["Vector databases", "Chunking strategies", "Semantic search", "Evaluation metrics"],
    level: "Intermediate", reviewCount: 2876, enrolledCount: 28760,
  },
  {
    id: "ai-agents-orchestration",
    title: "AI Agents & Orchestration",
    category: "Agents & Orchestration",
    tagline: "Build multi-agent systems: ReAct, tool calling, agent workflows, and error handling.",
    description: "Build multi-agent systems with ReAct and tool calling. Handle errors gracefully.",
    fullDescription: "Multi-agent systems are the future. Learn ReAct framework, tool calling, error recovery, and orchestration patterns. Build a 5-agent system by end of course.",
    hours: 14, weeks: 4, priceLow: 2799,
    image: "/assets/fp9.png", instructor: "Karthik Nair",
    outcomes: ["Multi-agent system", "Tool-use implementation", "Error handling"],
    syllabus: ["ReAct framework", "Tool calling", "Agent communication", "Monitoring agents"],
    level: "Advanced", reviewCount: 1987, enrolledCount: 19870,
  },
  {
    id: "computer-vision-production",
    title: "Computer Vision for Production",
    category: "Computer Vision",
    tagline: "Build production computer vision systems: detection, segmentation, and deployment.",
    description: "Learn detection and segmentation. Deploy vision models to production.",
    fullDescription: "From notebooks to production. Learn YOLO, segmentation, model optimization, and deployment on edge devices. Real computer vision projects.",
    hours: 18, weeks: 5, priceLow: 2299,
    image: "/assets/fp10.png", instructor: "Divya Krishnan",
    outcomes: ["Detection system", "Segmentation model", "Edge deployment"],
    syllabus: ["Object detection", "Segmentation", "Model compression", "Deployment options"],
    level: "Intermediate", reviewCount: 2134, enrolledCount: 21340,
  },
  {
    id: "mlops-model-deployment",
    title: "MLOps & Model Deployment",
    category: "MLOps & Deployment",
    tagline: "Ship ML models to production: orchestration, monitoring, serving, and scaling.",
    description: "Orchestrate, monitor, and scale ML models. Ship to production confidently.",
    fullDescription: "MLOps is the new ops. Learn containerization, orchestration with Kubernetes, model serving, monitoring, and scaling. Real DevOps patterns.",
    hours: 16, weeks: 4, priceLow: 2599,
    image: "/assets/fp11.png", instructor: "Arjun Menon",
    outcomes: ["Containerized model", "K8s deployment", "Monitoring setup"],
    syllabus: ["Docker & containers", "Kubernetes basics", "Model serving", "CI/CD for ML"],
    level: "Intermediate", reviewCount: 1765, enrolledCount: 17650,
  },
  {
    id: "ai-ecommerce-search-recommendations",
    title: "AI for E-commerce: Search & Recommendations",
    category: "Industry Applications",
    tagline: "Build AI systems for e-commerce: semantic search, personalization, and pricing.",
    description: "Build semantic search and recommendation engines. Personalize user experiences.",
    fullDescription: "E-commerce AI powers Shopify, Amazon, and Alibaba. Learn semantic search, personalization algorithms, and dynamic pricing.",
    hours: 10, weeks: 3, priceLow: 1699,
    image: "/assets/fp12.png", instructor: "Nithya Suresh",
    outcomes: ["Search system", "Recommendation engine", "Personalization"],
    syllabus: ["Semantic search", "Collaborative filtering", "Content-based rec", "Pricing algorithms"],
    level: "Beginner", reviewCount: 3210, enrolledCount: 32100,
  },
];

const instructors = [
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

const testimonials = [
  { name: "Priya Menon", role: "ML Engineer at Infosys", initials: "PM", quote: "The RAG Systems Masterclass was exactly what I needed. I deployed my first production RAG system within a week of completing it.", order: 1 },
  { name: "Arjun Nair", role: "Data Scientist at HDFC Bank", initials: "AN", quote: "The AI Underwriting bootcamp was intense but the TA support was incredible. I had a working credit scoring model by Sunday evening.", order: 2 },
  { name: "Kavya Sharma", role: "Software Engineer at Wipro", initials: "KS", quote: "I went from zero AI knowledge to deploying a multi-agent system in 4 weeks. The course structure is much better than anything else I tried.", order: 3 },
];

const reviews = [
  { courseId: "rag-systems-masterclass", name: "Arun K.", rating: 5, text: "Incredibly practical. I built and deployed the project during the course itself — something no other course I've taken has managed.", createdAt: Date.now() },
  { courseId: "rag-systems-masterclass", name: "Sneha M.", rating: 5, text: "Best AI course I've taken. The instructor explains complex concepts in plain terms and the TA support is fast and helpful.", createdAt: Date.now() },
  { courseId: "rag-systems-masterclass", name: "Rohan P.", rating: 4, text: "Great content and pacing. The hands-on projects are what make this stand out — you're actually building, not just watching slides.", createdAt: Date.now() },
];

const platformStats = {
  learners: "50,500+",
  avgRating: "4.7",
  programs: "12",
  hiringPartners: "28",
  partners: ["Google", "Microsoft", "Amazon", "Meta", "IBM", "Deloitte"],
};

// ─── Seed ─────────────────────────────────────────────────────────────────────

function nameToSlug(name) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

async function seed() {
  console.log("🌱 Seeding Firestore...\n");

  // Bootcamps
  for (const { id, ...data } of bootcamps) {
    await db.collection("bootcamps").doc(id).set(data);
    console.log(`  ✓ bootcamps/${id}`);
  }

  // Courses
  for (const { id, ...data } of courses) {
    await db.collection("courses").doc(id).set(data);
    console.log(`  ✓ courses/${id}`);
  }

  // Instructors
  for (const instructor of instructors) {
    const slug = nameToSlug(instructor.name);
    await db.collection("instructors").doc(slug).set(instructor);
    console.log(`  ✓ instructors/${slug}`);
  }

  // Testimonials
  for (const t of testimonials) {
    await db.collection("testimonials").add(t);
    console.log(`  ✓ testimonials/${t.name}`);
  }

  // Reviews
  for (const r of reviews) {
    await db.collection("reviews").add(r);
    console.log(`  ✓ reviews/${r.courseId}/${r.name}`);
  }

  // Platform stats
  await db.collection("platform_stats").doc("main").set(platformStats);
  console.log(`  ✓ platform_stats/main`);

  console.log("\n✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
