import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFriends, sendFriendRequest } from "../api/friend";

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

export function useSendFriendRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendFriendRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friends-sent"],
      });
    },
  });
}
