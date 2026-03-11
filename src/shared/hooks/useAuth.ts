import { useMutation } from "@tanstack/react-query";
import { oauthLogin } from "../api/auth";

export function useOauthLoginMutation() {
  return useMutation({
    mutationFn: oauthLogin,
  });
}
