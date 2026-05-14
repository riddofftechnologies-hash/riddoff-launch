import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export interface InstructorDoc {
  id: string;
  name: string;
  title: string;
  bio: string;
  courses: number;
  learners: number;
  photoUrl?: string;
}

const COL = "instructors";

export async function fetchAllInstructors(): Promise<InstructorDoc[]> {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as InstructorDoc));
}

export async function createInstructor(
  data: Omit<InstructorDoc, "id">
): Promise<string> {
  const docRef = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateInstructor(
  id: string,
  data: Partial<Omit<InstructorDoc, "id">>
): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteInstructor(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

export async function uploadInstructorPhoto(file: File, instructorId: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const storageRef = ref(storage, `instructors/${instructorId}/photo.${ext}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
