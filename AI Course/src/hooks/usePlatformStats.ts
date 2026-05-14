import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlatformStats, updatePlatformStats } from "@/lib/firestore";
import type { FirestorePlatformStats } from "@/types/firestore";

const KEY = "platform_stats";

export function usePlatformStats() {
  return useQuery({
    queryKey: [KEY],
    queryFn: () => getPlatformStats<FirestorePlatformStats>(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useUpdatePlatformStats() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FirestorePlatformStats) => updatePlatformStats(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
