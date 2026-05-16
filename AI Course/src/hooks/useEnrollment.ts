import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { enrollUser, isUserEnrolled } from "@/lib/firestore";
import type { ItemType } from "@/types/course";

export function useEnrollment(courseId: string, courseTitle: string, courseType: ItemType) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const enrolledQuery = useQuery({
    queryKey: ["enrollment", user?.uid, courseId],
    queryFn: () => isUserEnrolled(user!.uid, courseId),
    enabled: !!user && !!courseId,
  });

  const enrollMutation = useMutation({
    mutationFn: () => enrollUser(user!.uid, courseId, courseTitle, courseType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", user?.uid, courseId] });
    },
  });

  return {
    enrolled: enrolledQuery.data ?? false,
    enrolling: enrollMutation.isPending,
    enroll: enrollMutation.mutate,
  };
}
