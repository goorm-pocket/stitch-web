import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotifications } from "../api/notification";

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
