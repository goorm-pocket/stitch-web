import styled from "styled-components";
import Archive from "../../features/Archive/Archive";
import SettingsIcon from "../../assets/setting-icon.svg";
import { useNavigate } from "react-router";
import { ProfileStitchedBox } from "../../shared/ui/StitchedBox";
import { useGetProfileQuery } from "@/shared/hooks/useUser";

const MyPage = () => {
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
                <BadgeNumber>{profile?.friendCount}</BadgeNumber>
                <span>FRIENDS</span>
              </Badge>
              <Badge>
                <BadgeNumber>{profile?.postCount}</BadgeNumber>
                <span>POCKET</span>
              </Badge>
            </BadgeContainer>
          </ProfileTextBox>
        </Left>

        <SettingButton onClick={() => navigate("/setting")}>
          <SettingIcon as={SettingsIcon} />
          Settings
        </SettingButton>
      </ProfileContainer>
      <RecapButton onClick={() => navigate("/recap")}>
        <RecapTitle>My Recap</RecapTitle>
        <RecapSubtitle>See your recent highlights</RecapSubtitle>
      </RecapButton>
      <Archive />
    </Container>
  );
};

export default MyPage;

const Container = styled.main`
  display: flex;
  flex-direction: column;
  width: min(${({ theme }) => theme.layout.contentWidth}, 100%);
  padding: ${({ theme }) => theme.space.md} 0 ${({ theme }) => theme.space.xxxl};
  gap: ${({ theme }) => theme.space.xxl};
`;

const ProfileContainer = styled(ProfileStitchedBox)`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
  min-height: 200px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: clamp(20px, 4vw, 30px);
  margin-bottom: ${({ theme }) => theme.space.xxxl};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.space.xl};
    min-height: auto;
  }
`;

const RecapButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.space.xl};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 2px dashed ${({ theme }) => theme.colors.border3};
  background: ${({ theme }) => theme.colors.background};

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space.xs};

  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.xs};
  }
`;

const RecapTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const RecapSubtitle = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text_secondary};
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xxxl};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.space.lg};
  }
`;

const Avator = styled.img`
  width: 120px;
  height: 120px;
  border-radius: ${({ theme }) => theme.radii.round};
  border: 4px solid ${({ theme }) => theme.colors.border};
  object-fit: cover;
`;

const ProfileTextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProfileName = styled.div`
  font-size: clamp(24px, 5vw, 28px);
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const ProfileDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.text_secondary};
  margin: 0;
  margin-bottom: 10px;
`;

const BadgeContainer = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 10px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Badge = styled.div`
  background: ${({ theme }) => theme.colors.sub};
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${({ theme }) => theme.fontSize.sm};
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
  border-radius: ${({ theme }) => theme.radii.xs};

  color: white;
  font-size: ${({ theme }) => theme.fontSize.xs};

  box-shadow: ${({ theme }) => theme.shadows.xs};
  cursor: pointer;

  padding: ${({ theme }) => theme.space.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
  }
`;

const SettingIcon = styled.svg`
  color: currentColor;
  margin-right: 5px;
`;
