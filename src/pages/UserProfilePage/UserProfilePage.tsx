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

            <StatsRow>
              <StatItem>
                <StatNumber>{profile?.friendCount || 0}</StatNumber>
                <StatLabel>&nbsp;FRIENDS</StatLabel>
              </StatItem>

              <StatItem>
                <StatNumber>{profile?.postCount || 0}</StatNumber>
                <StatLabel>&nbsp;POCKET</StatLabel>
              </StatItem>
            </StatsRow>
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
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: ${({ theme }) => theme.space.md};
    min-height: auto;
    margin-bottom: ${({ theme }) => theme.space.xl};
    padding: 18px 16px;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xxxl};

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;
    align-items: center;
    gap: ${({ theme }) => theme.space.md};
    min-width: 0;
  }
`;

const Avator = styled.img`
  width: 120px;
  height: 120px;
  border-radius: ${({ theme }) => theme.radii.round};
  border: 4px solid ${({ theme }) => theme.colors.border};
  object-fit: cover;

  @media (max-width: 768px) {
    width: 84px;
    height: 84px;
    border-width: 3px;
    flex-shrink: 0;
  }
`;

const ProfileTextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  align-items: flex-start;
`;

const ProfileName = styled.div`
  font-size: clamp(24px, 5vw, 28px);
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text_primary};

  @media (max-width: 768px) {
    font-size: 20px;
    line-height: 1.15;
  }
`;

const ProfileDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.text_secondary};
  margin: 0;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSize.xs};
    margin-bottom: 6px;
  }
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  min-height: 20px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const StatItem = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  padding: 6px 10px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.sub};

  @media (max-width: 768px) {
    padding: 5px 9px;
    border-radius: 7px;
  }
`;

const StatNumber = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 700;
  line-height: 1;
`;

const StatLabel = styled.span`
  color: ${({ theme }) => theme.colors.text_secondary};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 700;
  letter-spacing: 0.04em;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;
