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
  post_id: string;

  author: PostAuthor;

  content: string | null;
  visibility: PostVisibility;

  like_count: number;
  liked_by_me: boolean;

  created_at: string;
  updated_at: string;

  editable_until: string;
  is_editable: boolean;

  marker_type: Marker;
  marker_emoji: string | null;
  marker_image_url: string | null;

  images: PostImage[];
}

export interface PostAuthor {
  user_id: string;
  nickname: string;
  profile_image_url: string | null;
}

export interface PostImage {
  image_url?: string;
}

export type PostVisibility = "PUBLIC" | "FRIENDS" | "PRIVATE";

export type Marker = "EMOJI" | "IMAGE";
