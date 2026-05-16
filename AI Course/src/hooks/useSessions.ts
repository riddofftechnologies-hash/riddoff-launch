import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSessionsByCohort, createSession, updateSession, deleteSession } from "@/lib/firestore";
import type { FirestoreSession } from "@/types/firestore";

type SessionDoc = FirestoreSession & { id: string };

const KEY = "sessions";

export function useSessionsByCohort(cohortId: string | null) {
  return useQuery<SessionDoc[]>({
    queryKey: [KEY, cohortId],
    queryFn: () => getSessionsByCohort<FirestoreSession>(cohortId!) as Promise<SessionDoc[]>,
    enabled: !!cohortId,
    staleTime: 60 * 1000,
  });
}

export function useCreateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<FirestoreSession, "id">) => createSession(data),
    onSuccess: (_r, data) => qc.invalidateQueries({ queryKey: [KEY, data.cohortId] }),
  });
}

export function useUpdateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; cohortId: string; data: Partial<FirestoreSession> }) =>
      updateSession(id, data),
    onSuccess: (_r, { cohortId }) => qc.invalidateQueries({ queryKey: [KEY, cohortId] }),
  });
}

export function useDeleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; cohortId: string }) => deleteSession(id),
    onSuccess: (_r, { cohortId }) => qc.invalidateQueries({ queryKey: [KEY, cohortId] }),
  });
}
