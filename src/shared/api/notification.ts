import { apiClient } from "@/shared/api/axios";
import type { ApiResponse } from "../types/common.type";
import type { Notification } from "../types/notification.type";

export interface NotificationListResponse {
  items: Notification[];
  nextCursor: string | null;
  hasNext: boolean;
}

export async function getNotifications({
  cursor,
  size = 10,
}: {
  cursor?: string | null;
  size?: number;
}): Promise<NotificationListResponse> {
  const res = await apiClient.get<ApiResponse<NotificationListResponse>>("/api/v1/notifications", {
    params: {
      size,
      ...(cursor ? { cursor } : {}),
    },
  });

  return res.data.data;
}

export const connectNotificationSSE = () => {
  const es = new EventSource(`${import.meta.env.VITE_API_BASE_URL}api/v1/notifications/subscribe`, {
    withCredentials: true,
  });

  es.onmessage = (e) => console.log(e.data);

  return es;
};

interface ReadNotificationRes {
  notificationId: string;
  readAt: string | null;
}

export async function readNotification(notificationId: string): Promise<ReadNotificationRes> {
  const res = await apiClient.patch<ApiResponse<ReadNotificationRes>>(
    `/api/v1/notifications/${notificationId}/read`,
  );

  return res.data.data;
}

export async function allReadNotification() {
  const res = await apiClient.patch("/api/v1/notifications/read-all");
  return res.data.data;
}

interface GetUnreadNotificationCountRes {
  unreadCount: number;
  checkedAt: string;
}

export async function getUnreadNotificationCount(): Promise<GetUnreadNotificationCountRes> {
  const res = await apiClient.get<ApiResponse<GetUnreadNotificationCountRes>>(
    "/api/v1/notifications/unread-count",
  );
  return res.data.data;
}
