import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPost,
  createPostLike,
  deletePost,
  deletePostLike,
  getCalendarById,
} from "../api/post";
import { useQuery } from "@tanstack/react-query";
import { getCalendar, getPostById } from "../api/post";

export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

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

export function useGetCalendarByIdQuery({
  year,
  month,
  userId,
}: {
  year: number;
  month: number;
  userId: string;
}) {
  return useQuery({
    queryKey: ["calendar", "me", { year, month, userId }],
    queryFn: () => getCalendarById({ year, month, userId }),
    enabled: !!year && !!month && !!userId,
  });
}

export function useCreatePostLikeMutation({ postId }: { postId: string }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPostLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board"] });
      queryClient.invalidateQueries({ queryKey: ["recap-board"] });
    },
  });
}

export function useDeletePostLikeMutation({ postId }: { postId: string }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePostLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
}
