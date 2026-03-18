import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../api/post";

export function useGetPostByIdQuery({ postId }: { postId: string }) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById({ postId }),
    enabled: !!postId,
  });
}
