import { useQuery } from "@tanstack/react-query";
import { getCalendar, getPostById } from "../api/post";

export function useGetPostByIdQuery({ postId }: { postId: string }) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById({ postId }),
    enabled: !!postId,
  });
}

export function useGetCalendarQuery({ year, month }: { year: number; month: number }) {
  return useQuery({
    queryKey: ["calendar", "me", { year, month }],
    queryFn: () => getCalendar({ year, month }),
    enabled: !!year && !!month,
  });
}
