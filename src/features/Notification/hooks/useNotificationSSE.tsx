import { useEffect, useRef, useState } from "react";
import { connectNotificationSSE } from "@/shared/api/notification";
import type { Notification } from "@/shared/types/notification.type";
import { useQueryClient } from "@tanstack/react-query";

export function useNotificationSSE() {
  const queryClient = useQueryClient();
  const [liveNotifications, setLiveNotifications] = useState<Notification[]>([]);
  const reconnectTimerRef = useRef<number | null>(null);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let isUnmounted = false;

    const connect = () => {
      if (isUnmounted) return;

      const es = connectNotificationSSE();
      esRef.current = es;

      const handleNotification = (e: MessageEvent) => {
        const newNotification: Notification = JSON.parse(e.data);

        setLiveNotifications((prev) => {
          const exists = prev.some(
            (item) => item.notificationId === newNotification.notificationId,
          );

          if (exists) return prev;
          return [newNotification, ...prev];
        });

        queryClient.invalidateQueries({
          queryKey: ["unread-notification-count"],
        });
      };

      const handleConnect = (e: MessageEvent) => {
        console.log("SSE connected:", e.data);
      };

      const handlePing = (e: MessageEvent) => {
        console.log("SSE ping:", e.data);
      };

      es.addEventListener("notification", handleNotification);
      es.addEventListener("connect", handleConnect);
      es.addEventListener("ping", handlePing);

      es.onerror = (e) => {
        console.error("SSE error", e);

        es.removeEventListener("notification", handleNotification);
        es.removeEventListener("connect", handleConnect);
        es.removeEventListener("ping", handlePing);
        es.close();

        if (!isUnmounted) {
          reconnectTimerRef.current = window.setTimeout(() => {
            connect();
          }, 3000);
        }
      };
    };

    connect();

    return () => {
      isUnmounted = true;

      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }

      if (esRef.current) {
        esRef.current.close();
      }
    };
  }, [queryClient]);

  return { liveNotifications };
}