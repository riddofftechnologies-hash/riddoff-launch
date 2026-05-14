import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReviewsByCourse, createReview, deleteReview } from "@/lib/firestore";
import type { FirestoreReview } from "@/types/firestore";

const KEY = "reviews";

export function useReviews(courseId: string | undefined) {
  return useQuery({
    queryKey: [KEY, courseId],
    queryFn: () =>
      courseId
        ? getReviewsByCourse<FirestoreReview>(courseId)
        : Promise.resolve([]),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<FirestoreReview, "id">) =>
      createReview({ ...data, createdAt: Date.now() }),
    onSuccess: (_r, data) =>
      qc.invalidateQueries({ queryKey: [KEY, data.courseId] }),
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, courseId }: { id: string; courseId: string }) =>
      deleteReview(id),
    onSuccess: (_r, { courseId }) =>
      qc.invalidateQueries({ queryKey: [KEY, courseId] }),
  });
}
