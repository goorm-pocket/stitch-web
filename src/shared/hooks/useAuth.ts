import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchMe, logout, oauthLogin } from "../api/auth";

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
    retry: false,
  });
}
