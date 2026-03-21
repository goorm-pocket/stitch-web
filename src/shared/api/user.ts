import type { MyProfile, NotificationSettings, PrivacySettings, Profile } from "../types/user.type";
import type { ApiResponse } from "../types/common.type";
import type { ApiResponse } from "../types/common.type";
import type {
  MyProfile,
  NotificationSettings,
  PrivacySettings,
  Profile,
  SearchUser,
} from "../types/user.type";
import { apiClient } from "./axios";

export async function getProfileById({ userId }: { userId: string }): Promise<Profile> {
  const res = await apiClient.get<Profile>(`/api/v1/users/${userId}/profile`);
  return res.data;
}

export async function withdrawAccount() {
  const res = await apiClient.delete("/api/v1/users/me");
  return res.data;
}

interface GetNotificationSettingsRes {
  userId: string;
  notificationSettings: NotificationSettings;
}

export async function getNotificationSettings(): Promise<GetNotificationSettingsRes> {
  const res = await apiClient.get<ApiResponse<GetNotificationSettingsRes>>(
    "/api/v1/users/me/notification-settings",
  );
  return res.data.data;
}

interface PatchNotificationSettingsRes {
  userId: string;
  notificationSettings: NotificationSettings;
}

export async function patchNotificationSettings({
  notificationSettings,
}: {
  notificationSettings: Partial<NotificationSettings>;
}): Promise<PatchNotificationSettingsRes> {
  const res = await apiClient.patch<ApiResponse<PatchNotificationSettingsRes>>(
    "/api/v1/users/me/notification-settings",
    notificationSettings,
  );
  return res.data.data;
}

interface GetPrivacySettingsRes {
  userId: string;
  privacySettings: PrivacySettings;
  updatedAt: string;
}

export async function getPrivacySettings(): Promise<GetPrivacySettingsRes> {
  const res = await apiClient.get<ApiResponse<GetPrivacySettingsRes>>(
    "/api/v1/users/me/privacy-settings",
  );
  return res.data.data;
}

interface PatchPrivacySettingsRes {
  userId: string;
  privacySettings: PrivacySettings;
  updatedAt: string;
}

export async function patchPrivacySettings({
  privacySettings,
}: {
  privacySettings: Partial<PrivacySettings>;
}): Promise<PatchPrivacySettingsRes> {
  const res = await apiClient.patch<ApiResponse<GetPrivacySettingsRes>>(
    "/api/v1/users/me/privacy-settings",
    privacySettings,
  );
  return res.data.data;
}

export async function getProfile(): Promise<MyProfile> {
  const res = await apiClient.get<ApiResponse<MyProfile>>("/api/v1/users/me/profile");
  return res.data.data;
}

// profile 중 realName, birth, gender 만 수정
export async function patchPrivateProfile({
  profile,
}: {
  profile: Partial<Pick<MyProfile, "realName" | "birth" | "gender">>;
}) {
  const res = await apiClient.patch("/api/v1/users/me/private-profile", profile);
  return res.data;
}

interface PatchProfileReq {
  nickname?: string;
  realName?: string;
  profileImageKey?: string;
  profileEmoji?: string;
  birth?: string;
  isPublic?: boolean;
  namePublic?: boolean;
  birthPublic?: boolean;
  agePublic?: boolean;
}

export async function patchProfile({ profile }: { profile: PatchProfileReq }) {
  const res = await apiClient.patch<ApiResponse<MyProfile>>("/api/v1/users/me/profile", profile);
  return res.data.data;
}

interface SetupProfileReq {
  nickname: string;
  realName: string;
  birth?: string;
  profileImageKey?: string;
  profileEmoji?: string;
  isPublic: boolean;
  namePublic: boolean;
  birthPublic: boolean;
  agePublic: boolean;
}

export async function setupProfile({ profile }: { profile: SetupProfileReq }) {
  const res = await apiClient.patch<ApiResponse<MyProfile>>(
    "/api/v1/users/me/profile/setup",
    profile,
  );
  return res.data.data;
}

interface GetProfileByNameRes {
  items: SearchUser[];
  nextCursor?: string;
  hasNext: boolean;
}

export async function getProfileByName({
  query,
  cursor,
}: {
  query: string;
  cursor?: string | null;
}): Promise<GetProfileByNameRes> {
  const res = await apiClient.get<ApiResponse<GetProfileByNameRes>>(`/api/v1/users/search`, {
    params: {
      query,
      cursor: cursor ?? undefined,
      size: 10,
    },
  });

  return res.data.data;
}
