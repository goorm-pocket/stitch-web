import { useEffect, useState } from "react";
import { connectNotificationSSE } from "@/shared/api/notification";
import type { Notification } from "@/shared/types/notification.type";

export function useNotificationSSE() {
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
  }, []);

  return { liveNotifications };
}
