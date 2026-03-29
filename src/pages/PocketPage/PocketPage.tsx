import styled from "styled-components";
import Pocket from "../../features/Pocket/Pocket";
import { useNavigate } from "react-router-dom";
import { useGetBoardQuery } from "@/shared/hooks/useBoard";

const PocketPage = () => {
  const navigate = useNavigate();
  const { data: board } = useGetBoardQuery("WEB");

  return (
    <Container>
      <TitleContainer>
        <Title>Your Pocket</Title>
        <Subtitle>Discover what&apos;s tucked away in your space today.</Subtitle>
      </TitleContainer>

      <Pocket board={board} mode="BOARD" />

      <PluseButton onClick={() => navigate("/createpost")}>
        <PlusIcon>+</PlusIcon>
      </PluseButton>
    </Container>
  );
};

export default PocketPage;

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(100%, ${({ theme }) => theme.layout.contentWidth});
  padding: ${({ theme }) => theme.space.md} 0 ${({ theme }) => theme.space.xxl};
  gap: 18px;

  @media (max-width: 768px) {
    gap: 14px;
  }
`;

const TitleContainer = styled.div`
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  text-align: center;

  @media (max-width: 768px) {
    gap: 14px;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(28px, 7vw, 40px);
  font-weight: 800;
  line-height: 1.1;
  color: #1e293b;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #64748b;
  margin-bottom: 0;
  text-align: center;
`;

const PluseButton = styled.button`
  position: fixed;
  bottom: calc(88px + env(safe-area-inset-bottom, 0px));
  right: 18px;
  width: 58px;
  height: 58px;
  border-radius: ${({ theme }) => theme.radii.round};
  background-color: ${({ theme }) => theme.colors.sub};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};
  z-index: 1000;

  &:hover {
    transform: translateY(-2px);
    background-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 480px) {
    width: 52px;
    height: 52px;
    right: 14px;
    bottom: calc(82px + env(safe-area-inset-bottom, 0px));
  }
`;

const PlusIcon = styled.span`
  font-size: 28px;
  font-weight: 400;
  margin-bottom: 2px;
`;
