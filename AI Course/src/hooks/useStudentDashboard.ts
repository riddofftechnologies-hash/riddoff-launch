import { useQuery } from "@tanstack/react-query";
import { where } from "firebase/firestore";
import {
  getAll,
  COLLECTIONS,
  getWaitlistEntryByEmail,
  type WaitlistEntry,
} from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
import type {
  FirestoreEnrollment,
  FirestoreSession,
  FirestoreCertificate,
  FirestoreSubmission,
} from "@/types/firestore";

type WithId<T> = T & { id: string };

// Helper: extract a millis timestamp from an unknown date-shaped value.
function ts(v: unknown): number {
  if (!v) return 0;
  if (typeof v === "string" || typeof v === "number") return new Date(v).getTime();
  if (v instanceof Date) return v.getTime();
  if (typeof v === "object" && v && "toMillis" in v && typeof (v as { toMillis: unknown }).toMillis === "function") {
    return (v as { toMillis: () => number }).toMillis();
  }
  if (typeof v === "object" && v && "seconds" in v) {
    return (v as { seconds: number }).seconds * 1000;
  }
  return 0;
}

/**
 * Enrollments for the currently signed-in user. Returns [] if signed-out.
 * Sorted client-side by enrolledAt desc to avoid the composite-index requirement.
 */
export function useMyEnrollments() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-enrollments", user?.uid],
    queryFn: async () => {
      const rows = await getAll<FirestoreEnrollment>(
        COLLECTIONS.ENROLLMENTS,
        where("userId", "==", user!.uid)
      );
      return (rows as WithId<FirestoreEnrollment>[]).sort(
        (a, b) => ts(b.enrolledAt) - ts(a.enrolledAt)
      );
    },
    enabled: !!user,
    staleTime: 60 * 1000,
  });
}

/**
 * Certificates earned by the current user.
 * No orderBy — only one where, single-field index is automatic.
 */
export function useMyCertificates() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-certificates", user?.uid],
    queryFn: async () => {
      const rows = await getAll<FirestoreCertificate>(
        COLLECTIONS.CERTIFICATES,
        where("userId", "==", user!.uid)
      );
      return (rows as WithId<FirestoreCertificate>[]).sort(
        (a, b) => ts(b.issueDate) - ts(a.issueDate)
      );
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Project submissions by the current user.
 * Client-side sort by submittedAt desc — avoids composite-index requirement.
 */
export function useMySubmissions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-submissions", user?.uid],
    queryFn: async () => {
      const rows = await getAll<FirestoreSubmission>(
        COLLECTIONS.SUBMISSIONS,
        where("userId", "==", user!.uid)
      );
      return (rows as WithId<FirestoreSubmission>[]).sort(
        (a, b) => ts(b.submittedAt) - ts(a.submittedAt)
      );
    },
    enabled: !!user,
    staleTime: 60 * 1000,
  });
}

/**
 * All sessions across cohorts the user is enrolled in.
 * Client-side sort + future-filter.
 */
export function useMySessions() {
  const { user } = useAuth();
  const enrollments = useMyEnrollments();
  const cohortIds = (enrollments.data ?? []).map((e) => e.cohortId).filter(Boolean);

  return useQuery({
    queryKey: ["my-sessions", user?.uid, cohortIds.join(",")],
    queryFn: async () => {
      if (cohortIds.length === 0) return [] as WithId<FirestoreSession>[];
      // Firestore "in" caps at 30. Practically a student has ≤ a handful of cohorts.
      const chunked = cohortIds.slice(0, 30);
      const sessions = await getAll<FirestoreSession>(
        COLLECTIONS.SESSIONS,
        where("cohortId", "in", chunked)
      );
      return (sessions as WithId<FirestoreSession>[]).sort(
        (a, b) => ts(a.scheduledAt) - ts(b.scheduledAt)
      );
    },
    enabled: !!user && enrollments.isSuccess,
    staleTime: 60 * 1000,
  });
}

/**
 * The signed-in user's own waitlist entry (if they joined the waitlist with the
 * same email they signed up with). Returns null if no match.
 */
export function useMyWaitlistEntry() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-waitlist", user?.email],
    queryFn: () => getWaitlistEntryByEmail<WaitlistEntry>(user!.email!),
    enabled: !!user?.email,
    staleTime: 5 * 60 * 1000,
  });
}
