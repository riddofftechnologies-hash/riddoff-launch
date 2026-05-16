import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPaths, getPathById, createPath, updatePath, deletePath } from "@/lib/firestore";
import type { FirestorePath } from "@/types/firestore";

const KEY = "paths";

export function usePaths() {
  return useQuery({
    queryKey: [KEY],
    queryFn: async () => {
      const docs = await getPaths<FirestorePath>();
      return docs as (FirestorePath & { id: string })[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePath(id: string | undefined) {
  return useQuery({
    queryKey: [KEY, id],
    queryFn: async () => {
      if (!id) return null;
      return (await getPathById<FirestorePath>(id)) as (FirestorePath & { id: string }) | null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePath() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FirestorePath }) => createPath(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdatePath() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FirestorePath> }) => updatePath(id, data),
    onSuccess: (_r, { id }) => qc.invalidateQueries({ queryKey: [KEY, id] }),
  });
}

export function useDeletePath() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePath(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
