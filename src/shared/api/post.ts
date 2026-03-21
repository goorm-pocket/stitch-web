import type { ApiResponse } from "../types/common.type";
import { apiClient } from "./axios";
import type { MarkerType, PostVisibility } from "../types/post.type";

export interface CreatePostReq {
  content?: string;
  visibility: PostVisibility; // "PUBLIC" | "FRIENDS" | "PRIVATE"
  markerType: MarkerType; // "EMOJI" | "IMAGE"
  markerEmoji?: string;
  markerImageKey?: string;
  imageKeys?: string[];
}

export interface CreatePostRes {
  postId: string;
}

export async function createPost(body: CreatePostReq): Promise<CreatePostRes> {
  const res = await apiClient.post<ApiResponse<CreatePostRes>>("/api/v1/posts", body);
  return res.data.data;
}
