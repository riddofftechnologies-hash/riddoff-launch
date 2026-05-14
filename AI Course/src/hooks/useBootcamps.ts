import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBootcamps,
  getBootcampById,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
} from "@/lib/firestore";
import type { Bootcamp } from "@/types/course";
import type { FirestoreBootcamp } from "@/types/firestore";

const KEY = "bootcamps";

export function useBootcamps() {
  return useQuery({
    queryKey: [KEY],
    queryFn: async () => {
      const docs = await getBootcamps();
      return docs as (FirestoreBootcamp & { id: string })[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBootcamp(id: string | undefined) {
  return useQuery({
    queryKey: [KEY, id],
    queryFn: async () => {
      if (!id) return null;
      return (await getBootcampById(id)) as (FirestoreBootcamp & { id: string }) | null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateBootcamp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FirestoreBootcamp }) =>
      createBootcamp(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateBootcamp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FirestoreBootcamp> }) =>
      updateBootcamp(id, data),
    onSuccess: (_r, { id }) =>
      qc.invalidateQueries({ queryKey: [KEY, id] }),
  });
}

export function useDeleteBootcamp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBootcamp(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

// Adapt Firestore doc to the app's Bootcamp type (image is already a URL path)
export function toBootcamp(doc: FirestoreBootcamp & { id: string }): Bootcamp {
  return doc as unknown as Bootcamp;
}
