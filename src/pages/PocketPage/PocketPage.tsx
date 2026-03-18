import styled from "styled-components";
import Pocket from "../../features/Pocket/Pocket";
import { useNavigate } from "react-router-dom";

const PocketPage = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <TitleContainer>
        <Title>Your Pocket</Title>
        <Subtitle>Discover what&apos;s tucked away in your space today.</Subtitle>
      </TitleContainer>

      <Pocket />

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
  width: 900px;
  padding: 16px 32px;
  gap: 24px;
`;

const TitleContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 52px;
  font-weight: 800;
  line-height: 1.1;
  color: #1e293b;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #64748b;
  margin-bottom: 0;
`;

const PluseButton = styled.button`
  position: fixed;
  bottom: 120px;
  right: 60px;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.sub};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease-in-out;
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
    background-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const PlusIcon = styled.span`
  font-size: 32px;
  font-weight: 400;
  margin-bottom: 4px;
`;
