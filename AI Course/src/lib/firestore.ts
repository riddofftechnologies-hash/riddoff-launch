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
  QueryConstraint,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

// ─── Generic helpers ──────────────────────────────────────────────────────────

export async function getAll<T>(
  col: string,
  ...constraints: QueryConstraint[]
): Promise<(T & { id: string })[]> {
  const q = constraints.length
    ? query(collection(db, col), ...constraints)
    : collection(db, col);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
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
  BOOTCAMPS: "bootcamps",
  COURSES: "courses",
  INSTRUCTORS: "instructors",
  TESTIMONIALS: "testimonials",
  REVIEWS: "reviews",
  PLATFORM_STATS: "platform_stats",
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
