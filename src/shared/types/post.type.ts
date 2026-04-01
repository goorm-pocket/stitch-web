export interface CalendarMarker {
  postId: string;
  markerType: "EMOJI" | "IMAGE";
  markerEmoji: string | null;
  markerImageUrl: string | null;
  visibility: "FRIENDS" | "PRIVATE";
  order: number; // 해당 날짜 내 정렬 순서
}

export interface Calendar {
  date: string;
  hasPost: boolean;
  postCount: number;
  isAllPrivate: boolean;
  markers: CalendarMarker[];
  hasMultiplePosts: boolean; // postCount가 2 이상인지
}

export interface PocketBubbleType {
  postId: string;
  userId: string;
  ownerType: "ME" | "FRIEND";
  representative: {
    type: "IMAGE" | "IMOGI";
    value: string;
  };
  createdAt: string;
  exposedAt: string;
  read: boolean;
}

export interface Post {
  postId: string;

  author: PostAuthor;

  content: string | null;
  visibility: PostVisibility;

  likeCount: number;
  likedByMe: boolean;

  createdAt: string;
  updatedAt: string;

  editableUntil: string;
  isEditable: boolean;

  markerType: MarkerType;
  markerEmoji: string | null;
  markerImageUrl: string | null;

  images: PostImage[];
}

export interface PostAuthor {
  userId: string;
  nickname: string;
  profileImageUrl: string | null;
}

export interface PostImage {
  imageId?: string;
  orderIndex?: number;
  imageKey?: string;
  imageUrl?: string;
}

export type PostVisibility = "PUBLIC" | "FRIENDS" | "PRIVATE";

export type MarkerType = "EMOJI" | "IMAGE";
