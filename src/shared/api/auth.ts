import { apiClient } from "./axios";

interface OauthLoginRes {
  userId: string;
  status: string;
  needProfileSetup: boolean; // 프로필 초기 설정 필요 여부
}

export async function oauthLogin({
  provider,
  code,
}: {
  provider: string;
  code: string;
}): Promise<OauthLoginRes> {
  const res = await apiClient.post<OauthLoginRes>(`/api/v1/auth/${provider}/login`, {
    authorizationCode: code,
    redirectUri: import.meta.env.VITE_REDIRECTION_URL,
  });
  return res.data;
}

export async function logout() {
  const res = await apiClient.post("/api/v1/auth/logout");
  return res.data;
}

interface fetchMeRes {
  userId: string;
  nickname: string;
  systemRole: "USER" | "ADMIN" | "GUEST";
  profileUrl: string;
  isAgreed: boolean;
}

export async function fetchMe(): Promise<fetchMeRes> {
  const res = await apiClient.get<fetchMeRes>("/api/v1/auth/me");
  return res.data;
}
