import type { ApiResponse } from "../types/common.type";
import type { Post } from "../types/post.type";
import { apiClient } from "./axios";

export async function getPostById({ postId }: { postId: string }): Promise<Post> {
  const res = await apiClient.get<ApiResponse<Post>>(`/api/v1/posts/${postId}`);
  return res.data.data;
}
