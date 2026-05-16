import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubmissionsByAssignment, gradeSubmission } from "@/lib/firestore";
import type { FirestoreSubmission } from "@/types/firestore";

type SubmissionDoc = FirestoreSubmission & { id: string };

const KEY = "submissions";

export function useSubmissionsByAssignment(assignmentId: string | null) {
  return useQuery<SubmissionDoc[]>({
    queryKey: [KEY, assignmentId],
    queryFn: () => getSubmissionsByAssignment<FirestoreSubmission>(assignmentId!) as Promise<SubmissionDoc[]>,
    enabled: !!assignmentId,
    staleTime: 30 * 1000,
  });
}

export function useGradeSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      assignmentId,
      grade,
      feedback,
      gradedBy,
    }: {
      userId: string;
      assignmentId: string;
      grade: number;
      feedback: string;
      gradedBy: string;
    }) =>
      gradeSubmission(userId, assignmentId, {
        grade,
        feedback,
        gradedBy,
        gradedAt: new Date().toISOString(),
      }),
    onSuccess: (_r, { assignmentId }) => qc.invalidateQueries({ queryKey: [KEY, assignmentId] }),
  });
}
