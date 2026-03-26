import styled from "styled-components";
import Pocket from "../../features/Pocket/Pocket";

const RecapPage = () => {
  return (
    <Container>
      <TitleContainer>
        <Title>Recap</Title>
        <Subtitle>Look back on what you’ve collected.</Subtitle>
      </TitleContainer>

      <Pocket />
    </Container>
  );
};

export default RecapPage;

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
