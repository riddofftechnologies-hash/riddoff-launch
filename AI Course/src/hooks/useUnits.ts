import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUnits, getUnitById, createUnit, updateUnit, deleteUnit } from "@/lib/firestore";
import type { FirestoreUnit } from "@/types/firestore";

const KEY = "units";

export function useUnits() {
  return useQuery({
    queryKey: [KEY],
    queryFn: async () => {
      const docs = await getUnits<FirestoreUnit>();
      return docs as (FirestoreUnit & { id: string })[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUnit(id: string | undefined) {
  return useQuery({
    queryKey: [KEY, id],
    queryFn: async () => {
      if (!id) return null;
      return (await getUnitById<FirestoreUnit>(id)) as (FirestoreUnit & { id: string }) | null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FirestoreUnit }) => createUnit(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FirestoreUnit> }) => updateUnit(id, data),
    onSuccess: (_r, { id }) => qc.invalidateQueries({ queryKey: [KEY, id] }),
  });
}

export function useDeleteUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUnit(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
