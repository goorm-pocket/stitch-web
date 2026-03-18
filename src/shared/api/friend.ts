import type { ApiResponse } from "../types/common.type";
import type { Friend } from "../types/friend.type";
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
  return res.data.data;
}
