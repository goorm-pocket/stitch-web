import styled from "styled-components";
import Archive from "../../features/Archive/Archive";
import { useParams } from "react-router";
import { ProfileStitchedBox } from "../../shared/ui/StitchedBox";
import { useGetProfileByIdQuery } from "@/shared/hooks/useUser";

const UserProfilePage = () => {
  const params = useParams();
  const { id } = params;

  const { data: profile } = useGetProfileByIdQuery({ userId: id as string });

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
      </ProfileContainer>
      <Archive userId={profile?.userId} />
    </Container>
  );
};

export default UserProfilePage;

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
    min-height: auto;
  }
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
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text_secondary};
  font-weight: bold;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BadgeNumber = styled.span`
  color: ${({ theme }) => theme.colors.primary};

  &::after {
    content: " ";
  }
`;
