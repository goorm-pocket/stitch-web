import type { ApiResponse } from "../types/common.type";
import { apiClient } from "./axios";
import type { MarkerType, PostVisibility } from "../types/post.type";
import type { Calendar, Post } from "../types/post.type";

export interface CreatePostReq {
  content?: string;
  visibility: PostVisibility; // "PUBLIC" | "FRIENDS" | "PRIVATE"
  markerType: MarkerType; // "EMOJI" | "IMAGE"
  markerEmoji?: string;
  markerImageKey?: string;
  imageKeys?: string[];
}

export interface CreatePostRes {
  postId: string;
}

export async function createPost(body: CreatePostReq): Promise<CreatePostRes> {
  const res = await apiClient.post<ApiResponse<CreatePostRes>>("/api/v1/posts", body);
  return res.data.data;
}

export async function deletePost({ postId }: { postId: string }) {
  const res = await apiClient.delete(`/api/v1/posts/${postId}`);
  return res.data.data;
}

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

interface GetCalendarByIdRes {
  userId: string;
  year: number;
  month: number;
  calendar: Calendar[];
}

export async function getCalendarById({
  year,
  month,
  userId,
}: {
  year: number;
  month: number;
  userId: string;
}): Promise<GetCalendarByIdRes> {
  const res = await apiClient.get(`/api/v1/posts/calendar/${userId}`, { params: { year, month } });
  return res.data.data;
}

export async function createPostLike({ postId }: { postId: string }) {
  const res = await apiClient.post(`/api/v1/posts/${postId}/likes`);
  return res.data.data;
}

export async function deletePostLike({ postId }: { postId: string }) {
  const res = await apiClient.delete(`/api/v1/posts/${postId}/likes`);
  return res.data.data;
}
