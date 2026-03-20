import { useInfiniteQuery } from "@tanstack/react-query";
import { getComments } from "../api/comment";

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
