import { apiClient } from "./axios";

export async function oauthLogin({
  provider,
  code,
}: {
  provider: string | null;
  code: string | null;
}) {
  if (!code || !provider) return;
  const res = await apiClient.post(`/api/v1/auth/${provider}/login`, {
    authorizationCode: code,
    redirectUri: import.meta.env.VITE_REDIRECTION_URL,
  });
  return res.data;
}
