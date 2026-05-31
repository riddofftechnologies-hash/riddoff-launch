import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWaitlistEntries,
  updateWaitlistEntry,
  deleteWaitlistEntry,
  type WaitlistEntry,
} from "@/lib/firestore";

const KEY = "waitlist";

export function useWaitlist() {
  return useQuery({
    queryKey: [KEY],
    queryFn: () => getWaitlistEntries<WaitlistEntry>(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useUpdateWaitlistEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WaitlistEntry> }) =>
      updateWaitlistEntry(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteWaitlistEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteWaitlistEntry(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
