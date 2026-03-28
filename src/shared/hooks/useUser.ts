import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotificationSettings,
  getPrivacySettings,
  getProfileByName,
  getProfile,
  patchNotificationSettings,
  patchPrivacySettings,
  withdrawAccount,
  patchProfile,
  patchPrivateProfile,
  setupProfile,
  getProfileById,
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
    select: (res) => res,
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
export function usePatchPrivateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchPrivateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useGetProfileByNameQuery({ query }: { query: string }) {
  return useInfiniteQuery({
    queryKey: ["profile", query],

    queryFn: ({ pageParam }) =>
      getProfileByName({
        query,
        cursor: pageParam,
      }),

    initialPageParam: null as string | null,

    enabled: !!query,

    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext) return undefined;
      return lastPage.nextCursor;
    },
  });
}

export function useGetProfileByIdQuery({ userId }: { userId: string }) {
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => getProfileById({ userId }),
    enabled: !!userId,
  });
}
