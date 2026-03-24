import type { Profile } from "./user.type";

export type FriendState = "ACCEPTED" | "SENT" | "RECEIVED";

export interface Friend {
  friendId: string;
  friendedAt: string;
  user: Profile;
  status: "ACCEPTED" | "SENT" | "RECEIVED" | null;
}

export interface FriendRequest {
  friendId: string;
  status: "REQUESTED" | "ACCEPTED";
  requesterId: string;
  receiverId: string;
  requestedAt: string;
}
