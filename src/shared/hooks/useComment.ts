import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, getComments } from "../api/comment";

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

export function useCreateCommentMutation({ postId }: { postId: string; parentId?: string }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
    },
  });
}
