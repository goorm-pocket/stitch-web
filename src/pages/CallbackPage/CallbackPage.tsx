import { useEffect } from "react";
import { useOauthLoginMutation } from "../../shared/hooks/useAuth";
import { useNavigate } from "react-router";
import { sendToApp } from "@/shared/webview/webview";

const CallbackPage = () => {
  const navigate = useNavigate();
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

        // 🔥 로그인 요청
        await oauthLogin({ provider, code });

        navigate("/pocket");
      } catch (err) {
        console.error("OAuth login failed:", err);
        navigate("/");
      }
    };

    run();
  }, [oauthLogin, navigate]);
  return <div>로딩 스피너</div>;
};

export default CallbackPage;
