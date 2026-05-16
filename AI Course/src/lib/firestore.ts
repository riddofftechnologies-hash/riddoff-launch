import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  QueryConstraint,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

// ─── Generic helpers ──────────────────────────────────────────────────────────

export async function getAll<T>(
  col: string,
  ...constraints: QueryConstraint[]
): Promise<(T & { id: string })[]> {
  console.log(`[Firestore] getAll("${col}") — start`);
  try {
    const q = constraints.length
      ? query(collection(db, col), ...constraints)
      : collection(db, col);
    const snap = await getDocs(q);
    console.log(`[Firestore] getAll("${col}") — got ${snap.docs.length} docs`);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
  } catch (err) {
    console.error(`[Firestore] getAll("${col}") — ERROR:`, err);
    throw err;
  }
}

export async function getById<T>(
  col: string,
  id: string
): Promise<(T & { id: string }) | null> {
  const snap = await getDoc(doc(db, col, id));
  return snap.exists() ? { id: snap.id, ...(snap.data() as T) } : null;
}

export async function create<T extends object>(
  col: string,
  data: T
): Promise<string> {
  const ref = await addDoc(collection(db, col), data);
  return ref.id;
}

export async function createWithId<T extends object>(
  col: string,
  id: string,
  data: T
): Promise<void> {
  await setDoc(doc(db, col, id), data);
}

export async function update<T extends object>(
  col: string,
  id: string,
  data: Partial<T>
): Promise<void> {
  await updateDoc(doc(db, col, id), data as Record<string, unknown>);
}

export async function remove(col: string, id: string): Promise<void> {
  await deleteDoc(doc(db, col, id));
}

// ─── Collection-specific functions ───────────────────────────────────────────

export const COLLECTIONS = {
  // Catalog
  BOOTCAMPS: "bootcamps",
  COURSES: "courses",
  INSTRUCTORS: "instructors",
  TESTIMONIALS: "testimonials",
  REVIEWS: "reviews",
  PLATFORM_STATS: "platform_stats",
  // Cohort business
  USERS: "users",
  COHORTS: "cohorts",
  PAYMENTS: "payments",
  ENROLLMENTS: "enrollments",
  SESSIONS: "sessions",
  ATTENDANCE: "attendance",
  ASSIGNMENTS: "assignments",
  SUBMISSIONS: "submissions",
  RESIDENCY_SCORES: "residency_scores",
  RESIDENCY_DECISIONS: "residency_decisions",
  CERTIFICATES: "certificates",
  LESSON_PROGRESS: "lesson_progress",
  SKILLS: "skills",
  STUDENT_SKILLS: "student_skills",
  FAQS: "faqs",
  // Learning paths
  PATHS: "paths",
  UNITS: "units",
} as const;

// Bootcamps
export const getBootcamps = () =>
  getAll(COLLECTIONS.BOOTCAMPS, orderBy("enrolledCount", "desc"));

export const getBootcampById = (id: string) =>
  getById(COLLECTIONS.BOOTCAMPS, id);

export const createBootcamp = (id: string, data: object) =>
  createWithId(COLLECTIONS.BOOTCAMPS, id, data);

export const updateBootcamp = (id: string, data: object) =>
  update(COLLECTIONS.BOOTCAMPS, id, data);

export const deleteBootcamp = (id: string) =>
  remove(COLLECTIONS.BOOTCAMPS, id);

// Courses
export const getCourses = () =>
  getAll(COLLECTIONS.COURSES, orderBy("enrolledCount", "desc"));

export const getCourseById = (id: string) =>
  getById(COLLECTIONS.COURSES, id);

export const createCourse = (id: string, data: object) =>
  createWithId(COLLECTIONS.COURSES, id, data);

export const updateCourse = (id: string, data: object) =>
  update(COLLECTIONS.COURSES, id, data);

export const deleteCourse = (id: string) =>
  remove(COLLECTIONS.COURSES, id);

// Instructors (keyed by name slug)
export const getInstructors = <T>() => getAll<T>(COLLECTIONS.INSTRUCTORS);

export const getInstructorBySlug = (slug: string) =>
  getById(COLLECTIONS.INSTRUCTORS, slug);

export const createInstructor = (slug: string, data: object) =>
  createWithId(COLLECTIONS.INSTRUCTORS, slug, data);

export const updateInstructor = (slug: string, data: object) =>
  update(COLLECTIONS.INSTRUCTORS, slug, data);

export const deleteInstructor = (slug: string) =>
  remove(COLLECTIONS.INSTRUCTORS, slug);

// Testimonials
export const getTestimonials = <T>() => getAll<T>(COLLECTIONS.TESTIMONIALS);

export const createTestimonial = (data: object) =>
  create(COLLECTIONS.TESTIMONIALS, data);

export const updateTestimonial = (id: string, data: object) =>
  update(COLLECTIONS.TESTIMONIALS, id, data);

export const deleteTestimonial = (id: string) =>
  remove(COLLECTIONS.TESTIMONIALS, id);

// Reviews (per course)
export const getReviewsByCourse = <T>(courseId: string) =>
  getAll<T>(COLLECTIONS.REVIEWS, orderBy("rating", "desc"));

export const createReview = (data: object) =>
  create(COLLECTIONS.REVIEWS, data);

export const deleteReview = (id: string) =>
  remove(COLLECTIONS.REVIEWS, id);

// Platform stats
export const getPlatformStats = <T>() =>
  getById<T>(COLLECTIONS.PLATFORM_STATS, "main");

export const updatePlatformStats = (data: object) =>
  createWithId(COLLECTIONS.PLATFORM_STATS, "main", data);

// ─── Users ────────────────────────────────────────────────────────────────────

export const getUserProfile = <T>(uid: string) => getById<T>(COLLECTIONS.USERS, uid);

export const createUserProfile = (uid: string, data: object) =>
  createWithId(COLLECTIONS.USERS, uid, data);

export const updateUserProfile = (uid: string, data: object) =>
  update(COLLECTIONS.USERS, uid, data);

// ─── Cohorts ─────────────────────────────────────────────────────────────────

export const getCohorts = <T>() =>
  getAll<T>(COLLECTIONS.COHORTS, orderBy("startDate", "desc"));

export const getCohortById = <T>(id: string) => getById<T>(COLLECTIONS.COHORTS, id);

export const getCohortsByCourse = <T>(courseId: string) =>
  getAll<T>(COLLECTIONS.COHORTS, where("courseId", "==", courseId), orderBy("startDate", "desc"));

export const createCohort = (id: string, data: object) =>
  createWithId(COLLECTIONS.COHORTS, id, data);

export const updateCohort = (id: string, data: object) =>
  update(COLLECTIONS.COHORTS, id, data);

export const deleteCohort = (id: string) => remove(COLLECTIONS.COHORTS, id);

// ─── Payments ─────────────────────────────────────────────────────────────────

export const createPayment = (data: object) => create(COLLECTIONS.PAYMENTS, data);

export const getPaymentById = <T>(id: string) => getById<T>(COLLECTIONS.PAYMENTS, id);

export const getPaymentsByUser = <T>(userId: string) =>
  getAll<T>(COLLECTIONS.PAYMENTS, where("userId", "==", userId), orderBy("createdAt", "desc"));

export const updatePayment = (id: string, data: object) =>
  update(COLLECTIONS.PAYMENTS, id, data);

// ─── Enrollments ──────────────────────────────────────────────────────────────
// Doc ID: {uid}_{cohortId} — one doc per student per cohort run.

export async function enrollUserInCohort(
  userId: string,
  cohortId: string,
  courseId: string,
  paymentId: string,
  meta: { displayName: string; email: string; courseTitle: string; cohortName: string }
): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.ENROLLMENTS, `${userId}_${cohortId}`), {
    userId,
    cohortId,
    courseId,
    paymentId,
    status: "active",
    progress: 0,
    enrolledAt: new Date().toISOString(),
    ...meta,
  });
}

export async function isEnrolledInCohort(userId: string, cohortId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, COLLECTIONS.ENROLLMENTS, `${userId}_${cohortId}`));
  return snap.exists();
}

export async function isEnrolledInAnyCohort(userId: string, courseId: string): Promise<boolean> {
  const q = query(
    collection(db, COLLECTIONS.ENROLLMENTS),
    where("userId", "==", userId),
    where("courseId", "==", courseId)
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

export const getEnrollmentsByUser = <T>(userId: string) =>
  getAll<T>(COLLECTIONS.ENROLLMENTS, where("userId", "==", userId), orderBy("enrolledAt", "desc"));

export const getEnrollmentsByCohort = <T>(cohortId: string) =>
  getAll<T>(COLLECTIONS.ENROLLMENTS, where("cohortId", "==", cohortId), orderBy("enrolledAt", "desc"));

export const updateEnrollment = (userId: string, cohortId: string, data: object) =>
  update(COLLECTIONS.ENROLLMENTS, `${userId}_${cohortId}`, data);

// Legacy — used by useEnrollment until cohort selection UI is built.
// Keys on courseId, sets cohortId = courseId as placeholder.
export async function enrollUser(
  userId: string,
  courseId: string,
  courseTitle: string,
  courseType: string
): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.ENROLLMENTS, `${userId}_${courseId}`), {
    userId,
    cohortId: courseId,
    courseId,
    paymentId: "legacy",
    courseTitle,
    courseType,
    status: "active",
    progress: 0,
    enrolledAt: new Date().toISOString(),
  });
}

export async function isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, COLLECTIONS.ENROLLMENTS, `${userId}_${courseId}`));
  return snap.exists();
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

export const getSessionsByCohort = <T>(cohortId: string) =>
  getAll<T>(COLLECTIONS.SESSIONS, where("cohortId", "==", cohortId), orderBy("scheduledAt", "asc"));

export const createSession = (data: object) => create(COLLECTIONS.SESSIONS, data);

export const updateSession = (id: string, data: object) =>
  update(COLLECTIONS.SESSIONS, id, data);

export const deleteSession = (id: string) => remove(COLLECTIONS.SESSIONS, id);

// ─── Attendance ────────────────────────────────────────────────────────────────

export const markAttendance = (userId: string, sessionId: string, data: object) =>
  createWithId(COLLECTIONS.ATTENDANCE, `${userId}_${sessionId}`, { userId, sessionId, ...data });

export const getAttendanceByCohort = <T>(cohortId: string) =>
  getAll<T>(COLLECTIONS.ATTENDANCE, where("cohortId", "==", cohortId));

export const getUserAttendanceByCohort = <T>(userId: string, cohortId: string) =>
  getAll<T>(COLLECTIONS.ATTENDANCE, where("userId", "==", userId), where("cohortId", "==", cohortId));

// ─── Assignments ──────────────────────────────────────────────────────────────

export const getAssignmentsByCohort = <T>(cohortId: string) =>
  getAll<T>(COLLECTIONS.ASSIGNMENTS, where("cohortId", "==", cohortId), orderBy("dueDate", "asc"));

export const getPublishedAssignmentsByCohort = <T>(cohortId: string) =>
  getAll<T>(
    COLLECTIONS.ASSIGNMENTS,
    where("cohortId", "==", cohortId),
    where("published", "==", true),
    orderBy("dueDate", "asc")
  );

export const createAssignment = (data: object) => create(COLLECTIONS.ASSIGNMENTS, data);

export const updateAssignment = (id: string, data: object) =>
  update(COLLECTIONS.ASSIGNMENTS, id, data);

export const deleteAssignment = (id: string) => remove(COLLECTIONS.ASSIGNMENTS, id);

// ─── Submissions ──────────────────────────────────────────────────────────────
// Doc ID: {uid}_{assignmentId}

export const submitAssignment = (userId: string, assignmentId: string, data: object) =>
  createWithId(COLLECTIONS.SUBMISSIONS, `${userId}_${assignmentId}`, {
    userId,
    assignmentId,
    submittedAt: new Date().toISOString(),
    ...data,
  });

export const getSubmissionsByAssignment = <T>(assignmentId: string) =>
  getAll<T>(COLLECTIONS.SUBMISSIONS, where("assignmentId", "==", assignmentId), orderBy("submittedAt", "desc"));

export const getSubmissionsByUser = <T>(userId: string) =>
  getAll<T>(COLLECTIONS.SUBMISSIONS, where("userId", "==", userId), orderBy("submittedAt", "desc"));

export const gradeSubmission = (userId: string, assignmentId: string, data: object) =>
  update(COLLECTIONS.SUBMISSIONS, `${userId}_${assignmentId}`, data);

// ─── Residency scores ─────────────────────────────────────────────────────────

export const getResidencyScore = <T>(userId: string, cohortId: string) =>
  getById<T>(COLLECTIONS.RESIDENCY_SCORES, `${userId}_${cohortId}`);

export const getCohortLeaderboard = <T>(cohortId: string) =>
  getAll<T>(COLLECTIONS.RESIDENCY_SCORES, where("cohortId", "==", cohortId), orderBy("totalScore", "desc"));

export const upsertResidencyScore = (userId: string, cohortId: string, data: object) =>
  createWithId(COLLECTIONS.RESIDENCY_SCORES, `${userId}_${cohortId}`, { userId, cohortId, ...data });

// ─── Residency decisions ──────────────────────────────────────────────────────

export const getResidencyDecision = <T>(userId: string, cohortId: string) =>
  getById<T>(COLLECTIONS.RESIDENCY_DECISIONS, `${userId}_${cohortId}`);

export const upsertResidencyDecision = (userId: string, cohortId: string, data: object) =>
  createWithId(COLLECTIONS.RESIDENCY_DECISIONS, `${userId}_${cohortId}`, { userId, cohortId, ...data });

// ─── Certificates ─────────────────────────────────────────────────────────────

export const getCertificatesByUser = <T>(userId: string) =>
  getAll<T>(COLLECTIONS.CERTIFICATES, where("userId", "==", userId));

export const createCertificate = (data: object) => create(COLLECTIONS.CERTIFICATES, data);

// ─── Lesson progress ──────────────────────────────────────────────────────────

export const markLessonComplete = (userId: string, cohortId: string, lessonId: string, courseId: string) =>
  createWithId(COLLECTIONS.LESSON_PROGRESS, `${userId}_${cohortId}_${lessonId}`, {
    userId,
    cohortId,
    courseId,
    lessonId,
    completed: true,
    completedAt: new Date().toISOString(),
  });

export const getLessonProgressByUserCohort = <T>(userId: string, cohortId: string) =>
  getAll<T>(
    COLLECTIONS.LESSON_PROGRESS,
    where("userId", "==", userId),
    where("cohortId", "==", cohortId)
  );

// ─── Skills ───────────────────────────────────────────────────────────────────

export const getSkills = <T>() => getAll<T>(COLLECTIONS.SKILLS);

export const createSkill = (data: object) => create(COLLECTIONS.SKILLS, data);

export const getStudentSkills = <T>(userId: string) =>
  getAll<T>(COLLECTIONS.STUDENT_SKILLS, where("userId", "==", userId), orderBy("earnedAt", "desc"));

export const awardSkill = (userId: string, skillId: string, data: object) =>
  createWithId(COLLECTIONS.STUDENT_SKILLS, `${userId}_${skillId}`, { userId, skillId, ...data });

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export const getGlobalFAQs = <T>() =>
  getAll<T>(COLLECTIONS.FAQS, where("published", "==", true), orderBy("order", "asc"));

export const getFAQsByCourse = <T>(courseId: string) =>
  getAll<T>(
    COLLECTIONS.FAQS,
    where("courseId", "==", courseId),
    where("published", "==", true),
    orderBy("order", "asc")
  );

export const createFAQ = (data: object) => create(COLLECTIONS.FAQS, data);

export const updateFAQ = (id: string, data: object) => update(COLLECTIONS.FAQS, id, data);

export const deleteFAQ = (id: string) => remove(COLLECTIONS.FAQS, id);

// ─── Cohorts by instructor ────────────────────────────────────────────────────

export async function getCohortsByInstructor<T>(uid: string): Promise<(T & { id: string })[]> {
  const [primary, co] = await Promise.all([
    getAll<T>(COLLECTIONS.COHORTS, where("primaryInstructorId", "==", uid)),
    getAll<T>(COLLECTIONS.COHORTS, where("coInstructorId", "==", uid)),
  ]);
  const seen = new Set<string>();
  return [...primary, ...co].filter((c) => {
    const id = (c as { id: string }).id;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

// ─── Learning Paths ───────────────────────────────────────────────────────────

export const getPaths = <T>() =>
  getAll<T>(COLLECTIONS.PATHS, orderBy("order", "asc"));

export const getPathById = <T>(id: string) => getById<T>(COLLECTIONS.PATHS, id);

export const createPath = (id: string, data: object) =>
  createWithId(COLLECTIONS.PATHS, id, data);

export const updatePath = (id: string, data: object) =>
  update(COLLECTIONS.PATHS, id, data);

export const deletePath = (id: string) => remove(COLLECTIONS.PATHS, id);

// ─── Learning Units ───────────────────────────────────────────────────────────

export const getUnits = <T>() =>
  getAll<T>(COLLECTIONS.UNITS, orderBy("order", "asc"));

export const getUnitById = <T>(id: string) => getById<T>(COLLECTIONS.UNITS, id);

export const createUnit = (id: string, data: object) =>
  createWithId(COLLECTIONS.UNITS, id, data);

export const updateUnit = (id: string, data: object) =>
  update(COLLECTIONS.UNITS, id, data);

export const deleteUnit = (id: string) => remove(COLLECTIONS.UNITS, id);

// Utility: name → slug for instructor lookup
export function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// Upload a file to Firebase Storage and return the public download URL
export async function uploadImage(file: File, storagePath: string): Promise<string> {
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// Fetch a bootcamp or course by slug ID, searching both collections
export async function getAnyItemById(id: string) {
  const bootcamp = await getBootcampById(id);
  if (bootcamp) return { ...bootcamp, _type: "bootcamp" as const };
  const course = await getCourseById(id);
  if (course) return { ...course, _type: "course" as const };
  return null;
}
