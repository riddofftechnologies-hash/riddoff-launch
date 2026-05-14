import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/lib/firestore";
import type { Course } from "@/types/course";
import type { FirestoreCourse } from "@/types/firestore";

const KEY = "courses";

export function useCourses() {
  return useQuery({
    queryKey: [KEY],
    queryFn: async () => {
      const docs = await getCourses();
      return docs as (FirestoreCourse & { id: string })[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCourse(id: string | undefined) {
  return useQuery({
    queryKey: [KEY, id],
    queryFn: async () => {
      if (!id) return null;
      return (await getCourseById(id)) as (FirestoreCourse & { id: string }) | null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FirestoreCourse }) =>
      createCourse(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FirestoreCourse> }) =>
      updateCourse(id, data),
    onSuccess: (_r, { id }) =>
      qc.invalidateQueries({ queryKey: [KEY, id] }),
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function toCourse(doc: FirestoreCourse & { id: string }): Course {
  return doc as unknown as Course;
}
