import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotificationSettings,
  getPrivacySettings,
  patchNotificationSettings,
} from "../api/user";

export function useGetNotificationSettingsQuery() {
  return useQuery({
    queryKey: ["notifications-settings"],
    queryFn: getNotificationSettings,
  });
}

export function usePatchNotificationSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchNotificationSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(["notifications-settings"], data);
    },
  });
}

export function useGetPrivacySettingsQuery() {
  return useQuery({
    queryKey: ["privacy-settings"],
    queryFn: getPrivacySettings,
  });
}
