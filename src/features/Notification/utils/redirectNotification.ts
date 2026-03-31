import type { Notification } from "@/shared/types/notification.type";

export function getNotificationRedirectUrl(notification: Notification): string | null {
  console.log(notification);
  switch (notification.type) {
    case "FRIEND_REQUEST":
      return `/friend`;

    case "FRIEND_ACCEPTED":
      return `/friend`;

    case "POST_LIKE":
      return `/posts/${notification.target?.postId || notification.route?.postId}`;

    case "COMMENTED":
      return `/posts/${notification.target?.postId || notification.route?.postId}`;

    case "MENTIONED":
      return `/posts/${notification.target?.postId || notification.route?.postId}`;

    case "WEEKLY_RECAP":
      return `/recap`;

    case "BIRTHDAY":
      return null;

    default:
      return null;
  }
}
