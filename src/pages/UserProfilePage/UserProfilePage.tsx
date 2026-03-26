import styled from "styled-components";
import Archive from "../../features/Archive/Archive";
import SettingsIcon from "../../assets/setting-icon.svg";
import { useNavigate } from "react-router";
import { ProfileStitchedBox } from "../../shared/ui/StitchedBox";
import { useGetProfileQuery } from "@/shared/hooks/useUser";

const UserProfilePage = () => {
  const { data: profile } = useGetProfileQuery();
  const navigate = useNavigate();

  return (
    <Container>
      <ProfileContainer>
        <Left>
          <Avator src={profile?.profileImageUrl} />
          <ProfileTextBox>
            <ProfileName>{profile?.nickname}</ProfileName>
            <ProfileDescription>{profile?.realName}</ProfileDescription>
            <BadgeContainer>
              <Badge>
                <BadgeNumber>1.2k</BadgeNumber>
                <span>FRIENDS</span>
              </Badge>
              <Badge>
                <BadgeNumber>48</BadgeNumber>
                <span>POCKET</span>
              </Badge>
            </BadgeContainer>
          </ProfileTextBox>
        </Left>

        <Right>
          <SettingButton onClick={() => navigate("/setting")}>
            <SettingIcon as={SettingsIcon} />
            Settings
          </SettingButton>
        </Right>
      </ProfileContainer>
      <Archive />
    </Container>
  );
};

export default UserProfilePage;

const Container = styled.main`
  display: flex;
  flex-direction: column;
  width: 900px;
  padding: 12px 28px;
  gap: 24px;
`;

const ProfileContainer = styled(ProfileStitchedBox)`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
  height: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 30px;
  margin-bottom: 32px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
`;

const Avator = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid ${({ theme }) => theme.colors.border};
  object-fit: cover;
`;

const ProfileTextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProfileName = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const ProfileDescription = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text_secondary};
  margin: 0;
  margin-bottom: 10px;
`;

const BadgeContainer = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 10px;
`;

const Badge = styled.div`
  background: ${({ theme }) => theme.colors.sub};
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text_secondary};
  font-weight: bold;
`;

const BadgeNumber = styled.span`
  color: ${({ theme }) => theme.colors.primary};

  &::after {
    content: " ";
  }
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
