import type { Comment } from "../types/comment.type";
import type { ApiResponse } from "../types/common.type";
import { apiClient } from "./axios";

interface getCommentsRes {
  comments: Comment[];
  hasNext: boolean;
  nextCursor: string | null;
}

export async function getComments({
  postId,
  pageParam,
}: {
  postId: string;
  pageParam?: string | null;
}): Promise<getCommentsRes> {
  const res = await apiClient.get<ApiResponse<getCommentsRes>>(`/api/v1/posts/${postId}/comments`, {
    params: {
      cursor: pageParam ?? undefined,
    },
  });
  return (
    res.data.data || {
      comments: [],
      hasNext: false,
      nextCursor: null,
    }
  );
}
