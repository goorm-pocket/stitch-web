import type { ApiResponse } from "../types/common.type";
import type { PocketBubbleType } from "../types/post.type";
import { apiClient } from "./axios";

interface getBoardProps {
  platform: "WEB" | "APP";
}

interface getBoardRes {
  items: PocketBubbleType[];
}

export async function getBoard({ platform }: getBoardProps): Promise<getBoardRes> {
  const res = await apiClient.get<ApiResponse<getBoardRes>>("/api/v1/boards", {
    params: { platform },
  });
  return res.data.data;
}

export async function readBoardPost({ postId }: { postId: string }) {
  const res = await apiClient.patch(`/api/v1/boards/posts/${postId}/read`);
  return res.data.data;
}
