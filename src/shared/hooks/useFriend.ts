import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptFriendRequest,
  deleteFriendRequest,
  getFriends,
  getReceivedRequests,
  getSentRequests,
  sendFriendRequest,
} from "../api/friend";

export function useGetFriendsQuery() {
  return useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });
}

export function useGetSentRequestsQuery() {
  return useQuery({
    queryKey: ["friends-sent"],
    queryFn: getSentRequests,
  });
}

export function useGetReceivedRequestsQuery() {
  return useQuery({
    queryKey: ["friends-received"],
    queryFn: getReceivedRequests,
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

export function useAcceptFriendRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptFriendRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friends-received"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useDeleteFriendRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFriendRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friends-sent"] });
      queryClient.invalidateQueries({ queryKey: ["friends-received"] });
    },
  });
}
