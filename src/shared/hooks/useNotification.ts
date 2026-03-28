import {
  allReadNotification,
  getNotifications,
  getUnreadNotificationCount,
} from "../api/notification";
import { useMutation, useQueryClient, useInfiniteQuery, useQuery } from "@tanstack/react-query";
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
      queryClient.invalidateQueries({ queryKey: ["unread-notification-count"] });
    },
  });
}

export function useAllReadNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: allReadNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notification-count"] });
    },
  });
}

export function useGetUnreadNotificationCountQuery() {
  return useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: getUnreadNotificationCount,
  });
}
