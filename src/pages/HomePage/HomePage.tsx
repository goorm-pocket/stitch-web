import styled from "styled-components";
import { StitchedBox } from "../../shared/ui/StitchedBox";
import { handleKakaoLogin } from "@/shared/utils/login";

const HomePage = () => {
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
  max-width: ${({ theme }) => theme.layout.contentWidth};
  min-height: 80vh;
  padding: clamp(36px, 8vw, 60px) 0;
  margin: 0 auto;
`;

const TitleContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
  margin: 40px 0;
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
  font-size: clamp(16px, 3vw, 20px);
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
  margin-bottom: clamp(36px, 8vw, 60px);
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
  border-radius: ${({ theme }) => theme.radii.lg};

  color: white;
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: bold;

  box-shadow: ${({ theme }) => theme.shadows.sm};
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.05);
  }
`;
