import type { Profile } from "./user.type";

export interface Friend {
  friendId: string;
  friendedAt: string;
  user: Profile;
  status: "FRIEND" | "SENT" | "RECEIVED" | null;
}

export interface FriendRequest {
  friendId: string;
  status: "REQUESTED" | "ACCEPTED";
  requesterId: string;
  receiverId: string;
  requestedAt: string;
}
