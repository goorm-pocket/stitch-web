import type { ApiResponse } from "../types/common.type";
import type { Friend, FriendRequest } from "../types/friend.type";
import { apiClient } from "./axios";

interface GetFriendsRes {
  items: Friend[];
  nextCursor: string | null;
  hasNext: boolean;
}

export async function getFriends({
  pageParam,
}: {
  pageParam?: string | null;
}): Promise<GetFriendsRes> {
  const res = await apiClient.get<ApiResponse<GetFriendsRes>>("/api/v1/friends", {
    params: {
      size: 10,
      cursor: pageParam ?? undefined,
    },
  });
  return (
    res.data.data || {
      items: [],
      nextCursor: null,
      hasNext: false,
    }
  );
}

export async function sendFriendRequest({ userId }: { userId: string }): Promise<FriendRequest> {
  const res = await apiClient.post<ApiResponse<FriendRequest>>(
    `/api/v1/friends/requests/${userId}`,
  );
  return res.data.data;
}

export async function getSentRequests() {
  const res = await apiClient.get("/api/v1/friends/requests/sent");
  return res.data.data;
}

export async function getReceivedRequests() {
  const res = await apiClient.get("/api/v1/friends/requests/received");
  return res.data.data;
}
