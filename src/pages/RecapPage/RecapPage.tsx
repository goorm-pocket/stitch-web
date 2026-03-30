import styled from "styled-components";
import Pocket from "../../features/Pocket/Pocket";
import { useGetRecapBoardQuery } from "@/shared/hooks/useBoard";

const RecapPage = () => {
  const date = new Date().toISOString().slice(0, 10);
  const { data: board } = useGetRecapBoardQuery(date);

  return (
    <Container>
      <TitleContainer>
        <Title>Recap</Title>
        <Subtitle>{board?.summary}</Subtitle>
      </TitleContainer>

      <Pocket board={board} mode="RECAP" />
    </Container>
  );
};

export default RecapPage;

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(${({ theme }) => theme.layout.contentWidth}, 100%);
  padding: ${({ theme }) => theme.space.lg} 0 ${({ theme }) => theme.space.xxxl};
  gap: ${({ theme }) => theme.space.xxl};
`;

const TitleContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(36px, 8vw, 52px);
  font-weight: 800;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.text_secondary};
  margin-bottom: 0;
`;
