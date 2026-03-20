import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotificationSettings,
  getPrivacySettings,
  getProfileByName,
  getProfile,
  patchNotificationSettings,
  patchPrivacySettings,
  withdrawAccount,
} from "../api/user";

export function useGetProfileQuery() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
}

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
