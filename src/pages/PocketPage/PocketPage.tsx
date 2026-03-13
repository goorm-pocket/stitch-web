import styled from "styled-components";
import Pocket from "../../features/Pocket/Pocket";

const PocketPage = () => {
  return (
    <Container>
      <TitleContainer>
        <Title>Your Digital Pocket</Title>
        <Subtitle>Discover what&apos;s tucked away in your space today.</Subtitle>
      </TitleContainer>

      <Pocket />
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
  gap: 32px;
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
`;
