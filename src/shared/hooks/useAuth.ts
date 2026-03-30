import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMe, logout, oauthLogin } from "../api/auth";

export function useOauthLoginMutation() {
  return useMutation({
    mutationFn: oauthLogin,
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user-profile"] });
    },
  });
}

export function useFetchMeQuery() {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
  });
}
