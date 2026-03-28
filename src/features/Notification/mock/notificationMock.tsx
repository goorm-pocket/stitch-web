import type { NotificationListResponse } from "@/shared/types/notification.type";

export const notificationMock: NotificationListResponse = {
  items: [
    {
      notificationId: "550e8400-e29b-41d4-a716-446655440001",
      type: "FRIEND_REQUEST",
      targetId: "8d4d3c32-1d21-4fd7-bc1d-0f2c0b5d9911",
      title: "새로운 친구 요청",
      content: "연두하트님이 친구 요청을 보냈어요.",
      readAt: null,
      sender: {
        userId: "7f1d7c6b-7d44-4fc5-a5a7-5c4c4e8c6d10",
        nickname: "연두하트",
        profileImageUrl: "https://cdn.example.com/profile/7f1d7c6b.png",
        profileEmoji: "🌱",
      },
      createdAt: "2026-03-06T21:30:00Z",
    },
    {
      notificationId: "550e8400-e29b-41d4-a716-446655440002",
      type: "WEEKLY_RECAP",
      targetId: null,
      title: "지난 주 리캡이 도착했어요",
      content: "지난 주 기록을 한눈에 확인해보세요.",
      readAt: "2026-03-05T10:00:00Z",
      sender: null,
      createdAt: "2026-03-05T09:00:00Z",
    },
    {
      notificationId: "550e8400-e29b-41d4-a716-446655440003",
      type: "FRIEND_REQUEST",
      targetId: "8d4d3c32-1d21-4fd7-bc1d-0f2c0b5d9922",
      title: "새로운 친구 요청",
      content: "포근구름님이 친구 요청을 보냈어요.",
      readAt: null,
      sender: {
        userId: "7f1d7c6b-7d44-4fc5-a5a7-5c4c4e8c6d11",
        nickname: "포근구름",
        profileImageUrl: null,
        profileEmoji: "☁️",
      },
      createdAt: "2026-03-06T18:10:00Z",
    },
  ],
  nextCursor: "eyJjcmVhdGVkQXQiOiIyMDI2LTAzLTA1VDA5OjAwOjAwWiIsImlkIjoiNTUwZTg0MDAifQ==",
  hasNext: true,
};
