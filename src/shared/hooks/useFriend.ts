import { useInfiniteQuery } from "@tanstack/react-query";
import { getFriends } from "../api/friend";

export function useGetFriendsQuery() {
  return useInfiniteQuery({
    queryKey: ["friends"],
    queryFn: ({ pageParam }) => getFriends({ pageParam }),

    initialPageParam: null as string | null,

    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext) return undefined;
      return lastPage.nextCursor;
    },
  });
}
