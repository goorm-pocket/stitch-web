import ProfileModal from "@/features/ProfileModal/ProfileModal";
import { useNavigate } from "react-router";
import styled from "styled-components";

const ProfileSettingPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <ProfileModal onClose={() => navigate("/pocket", { replace: true })} isInitial isPage />
    </Container>
  );
};

export default ProfileSettingPage;

const Container = styled.main`
  width: 100%;
  min-height: calc(100vh - 120px);
  padding: 40px 20px 80px;
  box-sizing: border-box;
`;
