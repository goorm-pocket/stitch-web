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

interface CreateComment {
  postId: string;
  content: string;
  parentId?: string;
}

export async function createComment({ postId, content, parentId }: CreateComment) {
  const res = await apiClient.post(`/api/v1/posts/${postId}/comments`, { content, parentId });
  return res.data.data;
}

interface getReplyCommentsRes {
  comments: Comment[];
  hasNext: boolean;
  nextCursor: string | null;
}

export async function getReplyComments({
  commentId,
  pageParam,
}: {
  commentId: string;
  pageParam?: string | null;
}): Promise<getReplyCommentsRes> {
  const res = await apiClient.get<ApiResponse<getReplyCommentsRes>>(
    `/api/v1/comments/${commentId}/replies`,
    {
      params: {
        cursor: pageParam ?? undefined,
      },
    },
  );
  return res.data.data;
}
