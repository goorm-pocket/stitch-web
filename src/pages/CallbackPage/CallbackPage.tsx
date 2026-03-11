import { useEffect } from "react";
import { useOauthLoginMutation } from "../../shared/hooks/useAuth";

const CallbackPage = () => {
  const { mutate: oauthLogin } = useOauthLoginMutation();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const provider = params.get("state");

    if (!code || !provider) return;

    oauthLogin({ provider, code });
  }, [oauthLogin]);
  return <div>로딩 스피너</div>;
};

export default CallbackPage;
