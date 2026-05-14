import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import type { CourseDoc } from "@/types/course";

const COL = "courses";

export async function fetchAllCourses(): Promise<CourseDoc[]> {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CourseDoc));
}

export async function fetchPublishedCourses(): Promise<CourseDoc[]> {
  const q = query(
    collection(db, COL),
    where("published", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CourseDoc));
}

export async function fetchCourseById(id: string): Promise<CourseDoc | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as CourseDoc;
}

export async function createCourse(
  data: Omit<CourseDoc, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const docRef = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateCourse(id: string, data: Partial<CourseDoc>): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCourse(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

export async function uploadCourseImage(file: File, courseId: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const storageRef = ref(storage, `courses/${courseId}/cover.${ext}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
