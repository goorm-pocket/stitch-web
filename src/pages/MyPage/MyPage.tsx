import styled from "styled-components";
import SettingsIcon from "../../assets/setting-icon.svg";
import { useNavigate } from "react-router";
import { ProfileStitchedBox } from "../../shared/ui/StitchedBox";

const MyPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <ProfileContainer>
        <SettingButton onClick={() => navigate("/setting")}>
          <SettingIcon as={SettingsIcon} />
          Settings
        </SettingButton>
      </ProfileContainer>
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
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 30px;
  margin-bottom: 32px;
`;

const SettingButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: ${({ theme }) => theme.colors.sub};
  border: none;
  border-radius: 8px;

  color: white;
  font-size: 12px;

  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
`;

const SettingIcon = styled.svg`
  color: currentColor;
  margin-right: 5px;
`;
