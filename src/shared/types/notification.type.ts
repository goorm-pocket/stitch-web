export type NotificationType =
  | "FRIEND_REQUEST"
  | "FRIEND_ACCEPTED"
  | "POST_LIKE"
  | "COMMENTED"
  | "MENTIONED"
  | "WEEKLY_RECAP";

export interface NotificationSender {
  userId: string;
  nickname: string;
  profileImageUrl: string | null;
  profileEmoji: string | null;
}

export interface Notification {
  notificationId: string;
  type: NotificationType;

  targetId: string | null;

  title: string;
  content: string;

  readAt: string | null;
  sender: NotificationSender | null;

  createdAt: string;
}
