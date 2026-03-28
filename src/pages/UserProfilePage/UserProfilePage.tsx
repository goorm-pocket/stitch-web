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
