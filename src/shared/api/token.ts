import type { ApiResponse } from "../types/common.type";
import { apiClient } from "./axios";

export type PushPlatform = "ANDROID" | "IOS" | "WEB";

export interface RegisterPushTokenReq {
  token: string;
  platform: PushPlatform;
  deviceId?: string;
}

export interface DeactivatePushTokenReq {
  deviceId: string;
}

export async function registerPushToken(body: RegisterPushTokenReq): Promise<void> {
  await apiClient.post<ApiResponse<null>>("/api/v1/push-tokens", body);
}

export async function deactivatePushToken(body: DeactivatePushTokenReq): Promise<void> {
  await apiClient.patch<ApiResponse<null>>("/api/v1/push-tokens/deactivate", body);
}
