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
