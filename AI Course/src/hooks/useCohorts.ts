import { useQuery } from "@tanstack/react-query";
import { getCohortsByInstructor } from "@/lib/firestore";
import type { FirestoreCohort } from "@/types/firestore";

type CohortDoc = FirestoreCohort & { id: string };

export function useInstructorCohorts(uid: string | undefined) {
  return useQuery<CohortDoc[]>({
    queryKey: ["cohorts", "instructor", uid],
    queryFn: () => getCohortsByInstructor<FirestoreCohort>(uid!) as Promise<CohortDoc[]>,
    enabled: !!uid,
    staleTime: 2 * 60 * 1000,
  });
}
