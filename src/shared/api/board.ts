import type { ApiResponse } from "../types/common.type";
import type { PocketBubbleType } from "../types/post.type";
import { apiClient } from "./axios";

interface GetBoardProps {
  platform: "WEB" | "APP";
}

interface GetBoardRes {
  items: PocketBubbleType[];
}

export async function getBoard({ platform }: GetBoardProps): Promise<GetBoardRes> {
  const res = await apiClient.get<ApiResponse<GetBoardRes>>("/api/v1/boards", {
    params: { platform },
  });
  return res.data.data;
}

interface GetRecapBoardProps {
  weekStartDate?: string;
}

interface GetRecapBoardRes {
  items: PocketBubbleType[];
  summary: string;
  weekEndDate: string;
  weekStartDate: string;
}

export async function getRecapBoard({
  weekStartDate,
}: GetRecapBoardProps): Promise<GetRecapBoardRes> {
  const res = await apiClient.get<ApiResponse<GetRecapBoardRes>>("/api/v1/boards/recaps/weekly", {
    params: { weekStartDate },
  });
  return res.data.data;
}

export async function readBoardPost({ postId }: { postId: string }) {
  const res = await apiClient.patch(`/api/v1/boards/posts/${postId}/read`);
  return res.data.data;
}
