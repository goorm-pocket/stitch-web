import { getNotifications } from "../api/notification";
import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { readNotification } from "@/shared/api/notification";

export function useGetNotificationsInfiniteQuery(size = 10) {
  return useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) =>
      getNotifications({
        cursor: pageParam ?? null,
        size,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
  });
}

export function useReadNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => readNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
