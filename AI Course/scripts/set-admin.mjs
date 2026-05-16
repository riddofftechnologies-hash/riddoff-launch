/**
 * One-time script: promotes a Firebase user to admin role.
 * Usage: node scripts/set-admin.mjs <email> <password>
 * Example: node scripts/set-admin.mjs system@riddoff.com "Riddoff@Admin2024"
 */

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { readFileSync } from "fs";
import { resolve } from "path";

// ─── Load .env.local ──────────────────────────────────────────────────────────

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  const lines = readFileSync(envPath, "utf-8").split("\n");
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    env[key] = val;
  }
  return env;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const [email, password] = process.argv.slice(2);

if (!email || !password) {
  console.error("Usage: node scripts/set-admin.mjs <email> <password>");
  process.exit(1);
}

const env = loadEnv();

const app = initializeApp({
  apiKey:            env.VITE_FIREBASE_API_KEY,
  authDomain:        env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             env.VITE_FIREBASE_APP_ID,
});

const auth = getAuth(app);
const db   = getFirestore(app);

async function main() {
  console.log(`Signing in as ${email}…`);
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const { uid, displayName } = cred.user;

  console.log(`Signed in — uid: ${uid}`);

  await setDoc(doc(db, "users", uid), {
    displayName: displayName ?? email.split("@")[0],
    email,
    role: "admin",
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  });

  console.log(`✓  users/${uid} → role: "admin"`);
  console.log(`   You can now log in to /admin as ${email}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err.message ?? err);
  process.exit(1);
});
