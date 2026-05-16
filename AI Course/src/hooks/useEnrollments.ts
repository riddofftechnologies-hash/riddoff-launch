import { useQuery } from "@tanstack/react-query";
import { orderBy, where } from "firebase/firestore";
import { getAll, COLLECTIONS } from "@/lib/firestore";
import type { FirestoreEnrollment } from "@/types/firestore";

type EnrollmentDoc = FirestoreEnrollment & { id: string };

export function useAllEnrollments() {
  return useQuery({
    queryKey: ["enrollments"],
    queryFn: () =>
      getAll<FirestoreEnrollment>(COLLECTIONS.ENROLLMENTS, orderBy("enrolledAt", "desc")) as Promise<EnrollmentDoc[]>,
    staleTime: 60 * 1000,
  });
}

export function useEnrollmentsByCohort(cohortId: string | null) {
  return useQuery({
    queryKey: ["enrollments", "cohort", cohortId],
    queryFn: () =>
      getAll<FirestoreEnrollment>(
        COLLECTIONS.ENROLLMENTS,
        where("cohortId", "==", cohortId),
        orderBy("enrolledAt", "desc")
      ) as Promise<EnrollmentDoc[]>,
    enabled: !!cohortId,
    staleTime: 60 * 1000,
  });
}

export function useEnrollmentsByCourse(courseId: string | null) {
  return useQuery({
    queryKey: ["enrollments", "course", courseId],
    queryFn: () =>
      getAll<FirestoreEnrollment>(
        COLLECTIONS.ENROLLMENTS,
        where("courseId", "==", courseId),
        orderBy("enrolledAt", "desc")
      ) as Promise<EnrollmentDoc[]>,
    enabled: !!courseId,
    staleTime: 60 * 1000,
  });
}
