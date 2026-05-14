import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/firestore";
import type { FirestoreTestimonial } from "@/types/firestore";

const KEY = "testimonials";

export function useTestimonials() {
  return useQuery({
    queryKey: [KEY],
    queryFn: () => getTestimonials<FirestoreTestimonial>(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<FirestoreTestimonial, "id">) =>
      createTestimonial(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FirestoreTestimonial> }) =>
      updateTestimonial(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTestimonial(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
