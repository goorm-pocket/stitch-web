export const handleKakaoLogin = () => {
  const clientId = import.meta.env.VITE_KAKAO_OAUTH_KEY;
  const redirectUri = import.meta.env.VITE_REDIRECTION_URL;

  const kakaoUrl =
    `https://kauth.kakao.com/oauth/authorize` +
    `?client_id=${clientId}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code` +
    `&state=kakao`;

  window.location.href = kakaoUrl;
};
