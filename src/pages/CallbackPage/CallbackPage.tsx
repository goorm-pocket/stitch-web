import { useEffect } from "react";
import { useOauthLoginMutation } from "../../shared/hooks/useAuth";
import { useNavigate } from "react-router";
import { fetchMe } from "@/shared/api/auth";
import { getProfile } from "@/shared/api/user";
import { useQueryClient } from "@tanstack/react-query";

const CallbackPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync: oauthLogin } = useOauthLoginMutation();

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const provider = params.get("state");

        if (!code || !provider) {
          navigate("/");
          return;
        }

        await oauthLogin({ provider, code });

        //프로필 초기 세팅 페이지로 이동
        const me = await fetchMe();
        queryClient.setQueryData(["me"], me);

        const profile = await getProfile();
        queryClient.setQueryData(["user-profile"], profile);

        const isProfileIncomplete = !profile.nickname || !profile.realName || !profile.profileEmoji;

        if (me.status === "PRE_REGISTRED" || isProfileIncomplete) {
          navigate("/profilesetting", { replace: true });
          return;
        }

        navigate("/pocket", { replace: true });
      } catch (err) {
        console.error("OAuth login failed:", err);
        navigate("/");
      }
    };

    run();
  }, [oauthLogin, navigate, queryClient]);
  return <div>로딩 스피너</div>;
};

export default CallbackPage;
