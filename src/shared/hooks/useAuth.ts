import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchMe, logout, oauthLogin } from "../api/auth";
import { getNotificationSettings, getPrivacySettings } from "../api/user";

export function useOauthLoginMutation() {
  return useMutation({
    mutationFn: oauthLogin,
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: logout,
  });
}

export function useFetchMeQuery() {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
  });
}

export function useGetNotificationSettingsQuery() {
  return useQuery({
    queryKey: ["notifications-settings"],
    queryFn: getNotificationSettings,
  });
}

export function useGetPrivacySettingsQuery() {
  return useQuery({
    queryKey: ["privacy-settings"],
    queryFn: getPrivacySettings,
  });
}
