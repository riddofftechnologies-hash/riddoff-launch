/**
 * One-time backfill: fills in displayName / email / courseTitle / cohortName
 * on enrollment docs that were created by the legacy enrollUser() path
 * (before those denormalized fields were being written).
 *
 * Source of truth:
 *   - displayName, email      ← users/{userId}
 *   - courseTitle, cohortName ← courses/{courseId}.title
 *
 * Must be run by an admin user — firestore.rules only lets admins update
 * arbitrary enrollment fields.
 *
 * Usage: node scripts/backfill-enrollment-names.mjs <adminEmail> <adminPassword>
 * Example: node scripts/backfill-enrollment-names.mjs system@riddoff.com "Riddoff@Admin2024"
 */

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
} from "firebase/firestore";
import { readFileSync } from "fs";
import { resolve } from "path";

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

const [adminEmail, adminPassword] = process.argv.slice(2);
if (!adminEmail || !adminPassword) {
  console.error("Usage: node scripts/backfill-enrollment-names.mjs <adminEmail> <adminPassword>");
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

const userCache = new Map();
const courseCache = new Map();

async function getUser(uid) {
  if (userCache.has(uid)) return userCache.get(uid);
  const snap = await getDoc(doc(db, "users", uid));
  const data = snap.exists() ? snap.data() : null;
  userCache.set(uid, data);
  return data;
}

async function getCourse(courseId) {
  if (courseCache.has(courseId)) return courseCache.get(courseId);
  const snap = await getDoc(doc(db, "courses", courseId));
  const data = snap.exists() ? snap.data() : null;
  courseCache.set(courseId, data);
  return data;
}

async function main() {
  console.log(`Signing in as ${adminEmail}…`);
  await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
  console.log("Signed in.\n");

  const snap = await getDocs(collection(db, "enrollments"));
  console.log(`Found ${snap.size} enrollment docs.\n`);

  let patched = 0;
  let skipped = 0;
  let orphaned = 0;

  for (const enrollment of snap.docs) {
    const data = enrollment.data();
    const patch = {};

    const needsName  = !data.displayName;
    const needsEmail = !data.email;
    const needsCourseTitle = !data.courseTitle;
    const needsCohortName  = !data.cohortName;

    if (!needsName && !needsEmail && !needsCourseTitle && !needsCohortName) {
      skipped++;
      continue;
    }

    if (needsName || needsEmail) {
      const userDoc = data.userId ? await getUser(data.userId) : null;
      if (!userDoc) {
        console.warn(`  ⚠ ${enrollment.id} — user ${data.userId} not found; skipping name/email`);
        orphaned++;
      } else {
        if (needsName)  patch.displayName = userDoc.displayName || userDoc.email?.split("@")[0] || "";
        if (needsEmail) patch.email       = userDoc.email || "";
      }
    }

    if (needsCourseTitle || needsCohortName) {
      const courseDoc = data.courseId ? await getCourse(data.courseId) : null;
      if (courseDoc?.title) {
        if (needsCourseTitle) patch.courseTitle = courseDoc.title;
        if (needsCohortName)  patch.cohortName  = courseDoc.title;
      }
    }

    if (Object.keys(patch).length === 0) {
      skipped++;
      continue;
    }

    await updateDoc(doc(db, "enrollments", enrollment.id), patch);
    patched++;
    console.log(`  ✓ ${enrollment.id} ← ${Object.keys(patch).join(", ")}`);
  }

  console.log(`\nDone. Patched: ${patched}, already complete: ${skipped}, orphaned users: ${orphaned}.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err.message ?? err);
  process.exit(1);
});
