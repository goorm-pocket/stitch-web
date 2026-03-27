import styled from "styled-components";
import { StitchedBox } from "../../shared/ui/StitchedBox";
import { useEffect } from "react";

const HomePage = () => {
  const handleKakaoLogin = () => {
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

  return (
    <Container>
      <TitleContainer>
        <Description>주머니 속 일상의 조각</Description>
        <Title>Stitch</Title>
      </TitleContainer>
      <ImageContainer></ImageContainer>
      <ButtonContainer>
        <LoginButton onClick={handleKakaoLogin}>Login with Kakao</LoginButton>
      </ButtonContainer>
    </Container>
  );
};

export default HomePage;

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 900px;
  min-height: 80vh;
  padding: 60px 32px;
  margin: 0 auto;
`;

const TitleContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
  margin-top: 40px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: clamp(60px, 10vw, 120px);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text_primary};
  margin: 0;
  letter-spacing: -2px;
`;

const Description = styled.p`
  font-size: 20px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text_secondary};
  opacity: 0.8;
  margin: 0;
`;

//나중에 이미지 삽입
const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 200px;
`;

const ButtonContainer = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 56px;
  margin-bottom: 60px;
`;

const LoginButton = styled(StitchedBox)`
  flex: 1;
  height: 64px;
  max-width: 280px;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 16px;

  color: white;
  font-size: 20px;
  font-weight: bold;

  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.05);
  }
`;
