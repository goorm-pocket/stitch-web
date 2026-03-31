import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment, getComments, getReplyComments } from "../api/comment";

export function useGetCommentsQuery({ postId }: { postId: string }) {
  return useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam }) => getComments({ postId, pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext) return undefined;
      return lastPage.nextCursor;
    },
    enabled: !!postId,
  });
}

export function useCreateCommentMutation({ postId }: { postId: string }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["reply-comments"],
      });
    },
  });
}

export function useGetReplyCommentsQuery({ commentId }: { commentId: string }) {
  return useInfiniteQuery({
    queryKey: ["reply-comments", commentId],
    queryFn: ({ pageParam }) => getReplyComments({ commentId, pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext) return undefined;
      return lastPage.nextCursor;
    },
    enabled: !!commentId,
  });
}

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["reply-comments"] });
    },
  });
}
