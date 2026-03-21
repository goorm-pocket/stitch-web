import type { ApiResponse } from "../types/common.type";
import type { Friend, FriendRequest } from "../types/friend.type";
import { apiClient } from "./axios";

interface GetFriendsRes {
  items: Friend[];
}

export async function getFriends(): Promise<GetFriendsRes> {
  const res = await apiClient.get<ApiResponse<GetFriendsRes>>("/api/v1/friends");
  return res.data.data;
}

export async function sendFriendRequest({ userId }: { userId: string }): Promise<FriendRequest> {
  const res = await apiClient.post<ApiResponse<FriendRequest>>(
    `/api/v1/friends/requests/${userId}`,
  );
  return res.data.data;
}

export async function getSentRequests(): Promise<GetFriendsRes> {
  const res = await apiClient.get<ApiResponse<GetFriendsRes>>("/api/v1/friends/requests/sent");
  return res.data.data;
}

export async function getReceivedRequests(): Promise<GetFriendsRes> {
  const res = await apiClient.get<ApiResponse<GetFriendsRes>>("/api/v1/friends/requests/received");
  return res.data.data;
}
