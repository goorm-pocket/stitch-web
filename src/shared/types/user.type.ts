export interface Profile {
  userId: string;
  nickname: string;
  realName: string;
  profileImageUrl?: string;
  profileEmoji?: string;
  birth?: string;
  age?: number;
  isPublic: boolean;
  isMine: boolean;
}

export interface MyProfile extends Profile {
  status: string;
  email?: string;
  gender?: "MALE" | "FEMAIL" | "UNKNOWN";
  createAt: string;
  updateAt: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  friendRequest: boolean;
  friendAccepted: boolean;
  comment: boolean;
  mention: boolean;
  postLike: boolean;
  weeklyRecap: boolean;
}

export interface PrivacySettings {
  isPublic: boolean;
  namePublic: boolean;
  birthPublic: boolean;
  agePublic: boolean;
}
