import type { Profile } from "./user.type";

export interface Friend {
  friendId: string;
  friendedAt: string;
  user: Profile;
}
