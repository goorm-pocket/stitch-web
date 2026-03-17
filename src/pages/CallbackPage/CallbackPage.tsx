import { useEffect } from "react";
import { useOauthLoginMutation } from "../../shared/hooks/useAuth";
import { useNavigate } from "react-router";

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
          navigate("/login");
          return;
        }

        await oauthLogin({ provider, code });
        navigate("/pocket");
      } catch (err) {
        console.error("OAuth login failed:", err);
        navigate("/login");
      }
    };

    run();
  }, [oauthLogin, navigate]);
  return <div>로딩 스피너</div>;
};

export default CallbackPage;
