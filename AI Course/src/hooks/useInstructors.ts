import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInstructors,
  getInstructorBySlug,
  createInstructor,
  updateInstructor,
  deleteInstructor,
  nameToSlug,
} from "@/lib/firestore";
import type { FirestoreInstructor } from "@/types/firestore";

const KEY = "instructors";

export function useInstructors() {
  return useQuery({
    queryKey: [KEY],
    queryFn: () => getInstructors<FirestoreInstructor>(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useInstructor(name: string | undefined) {
  const slug = name ? nameToSlug(name) : undefined;
  return useQuery({
    queryKey: [KEY, slug],
    queryFn: async () => {
      if (!slug) return null;
      return getInstructorBySlug(slug) as Promise<(FirestoreInstructor & { id: string }) | null>;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateInstructor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, data }: { name: string; data: Omit<FirestoreInstructor, "name"> }) =>
      createInstructor(nameToSlug(name), { ...data, name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateInstructor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, data }: { name: string; data: Partial<FirestoreInstructor> }) =>
      updateInstructor(nameToSlug(name), data),
    onSuccess: (_r, { name }) =>
      qc.invalidateQueries({ queryKey: [KEY, nameToSlug(name)] }),
  });
}

export function useDeleteInstructor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => deleteInstructor(nameToSlug(name)),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
