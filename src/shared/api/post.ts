import type { ApiResponse } from "../types/common.type";
import type { Calendar, Post } from "../types/post.type";
import { apiClient } from "./axios";

export async function getPostById({ postId }: { postId: string }): Promise<Post> {
  const res = await apiClient.get<ApiResponse<Post>>(`/api/v1/posts/${postId}`);
  return res.data.data;
}

interface GetCalendarRes {
  userId: string;
  year: number;
  month: number;
  calendar: Calendar[];
}

export async function getCalendar({
  year,
  month,
}: {
  year: number;
  month: number;
}): Promise<GetCalendarRes> {
  const res = await apiClient.get("/api/v1/posts/calendar/me", { params: { year, month } });
  return res.data.data;
}
