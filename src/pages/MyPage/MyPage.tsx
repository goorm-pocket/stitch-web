import styled from "styled-components";
import { ProfileStitchedBox } from "../../shared/ui/StitchedBox";

const MyPage = () => {
  return (
    <Container>
      <ProfileContainer></ProfileContainer>
    </Container>
  );
};

export default MyPage;

const Container = styled.main`
  display: flex;
  flex-direction: column;
  width: 900px;
  padding: 16px 32px;
`;

const ProfileContainer = styled(ProfileStitchedBox)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 125px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 32px;
`;
