import { useEffect, useState } from "react";
import { connectNotificationSSE } from "@/shared/api/notification";
import type { Notification } from "@/shared/types/notification.type";
import { useQueryClient } from "@tanstack/react-query";

export function useNotificationSSE() {
  const queryClient = useQueryClient();
  const [liveNotifications, setLiveNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const es = connectNotificationSSE();

    const handleNotification = (e: MessageEvent) => {
      const newNotification: Notification = JSON.parse(e.data);

      setLiveNotifications((prev) => {
        const exists = prev.some((item) => item.notificationId === newNotification.notificationId);

        if (exists) return prev;

        return [newNotification, ...prev];
      });
      queryClient.invalidateQueries({
        queryKey: ["unread-notification-count"],
      });
    };

    es.addEventListener("notification", handleNotification);

    es.onerror = (e) => {
      console.error("SSE error", e);
      es.close();
    };

    return () => {
      es.removeEventListener("notification", handleNotification);
      es.close();
    };
  }, [queryClient]);

  return { liveNotifications };
}
