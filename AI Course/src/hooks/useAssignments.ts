import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAssignmentsByCohort, createAssignment, updateAssignment, deleteAssignment } from "@/lib/firestore";
import type { FirestoreAssignment } from "@/types/firestore";

type AssignmentDoc = FirestoreAssignment & { id: string };

const KEY = "assignments";

export function useAssignmentsByCohort(cohortId: string | null) {
  return useQuery<AssignmentDoc[]>({
    queryKey: [KEY, cohortId],
    queryFn: () => getAssignmentsByCohort<FirestoreAssignment>(cohortId!) as Promise<AssignmentDoc[]>,
    enabled: !!cohortId,
    staleTime: 60 * 1000,
  });
}

export function useCreateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<FirestoreAssignment, "id">) => createAssignment(data),
    onSuccess: (_r, data) => qc.invalidateQueries({ queryKey: [KEY, data.cohortId] }),
  });
}

export function useUpdateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; cohortId: string; data: Partial<FirestoreAssignment> }) =>
      updateAssignment(id, data),
    onSuccess: (_r, { cohortId }) => qc.invalidateQueries({ queryKey: [KEY, cohortId] }),
  });
}

export function useDeleteAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; cohortId: string }) => deleteAssignment(id),
    onSuccess: (_r, { cohortId }) => qc.invalidateQueries({ queryKey: [KEY, cohortId] }),
  });
}
