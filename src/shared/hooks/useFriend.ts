import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFriends, getSentFriends, sendFriendRequest } from "../api/friend";

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

export function useGetSentFriendsQuery() {
  return useQuery({
    queryKey: ["friends-sent"],
    queryFn: getSentFriends,
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
