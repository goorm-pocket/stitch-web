export type NotificationType =
  | "FRIEND_REQUEST"
  | "FRIEND_ACCEPTED"
  | "POST_LIKE"
  | "COMMENTED"
  | "MENTIONED"
  | "WEEKLY_RECAP"
  | "BIRTHDAY";

export interface NotificationSender {
  userId: string;
  nickname: string;
  profileImageUrl: string | null;
  profileEmoji: string | null;
}

export interface Notification {
  notificationId: string;
  type: NotificationType;

  target: NotificationTarget;
  route: NotificationRoute;

  title: string;
  content: string;

  readAt: string | null;
  sender: NotificationSender | null;

  createdAt: string;
}

export interface NotificationTarget {
  userId: string | null;
  postId: string | null;
  commentId: string | null;
}

export interface NotificationRoute {
  userId: string | null;
  postId: string | null;
  commentId: string | null;
}
