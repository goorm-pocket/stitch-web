import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotificationSettings,
  getPrivacySettings,
  patchNotificationSettings,
  patchPrivacySettings,
  withdrawAccount,
  getProfile,
  patchProfile,
  patchPrivateProfile,
  setupProfile,
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

export function usePatchPrivacySettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchPrivacySettings,
    onSuccess: (data) => {
      queryClient.setQueryData(["privacy-settings"], data);
    },
  });
}

export function useWithdrawAccountMutation() {
  return useMutation({
    mutationFn: withdrawAccount,
  });
}

export function useGetProfileQuery() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile,
    select: (res: any) => res,
  });
}

//신규 프로필 생성
export function useSetupProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setupProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

//프로필 수정
export function usePatchProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchProfile,
    onSuccess: () => {
      //queryClient.setQueryData(["user-profile"], data);
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

//민감 정보(실명, 생일)
export function usepatchPrivateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchPrivateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
