import styled from "styled-components";
import Pocket from "../../features/Pocket/Pocket";
import { useEffect, useState } from "react";
import { useFetchMeQuery } from "../../shared/hooks/useAuth";
import ProfileModal from "@/features/ProfileModal/ProfileModal";
import { useGetProfileQuery } from "@/shared/hooks/useUser";

const PocketPage = () => {
  const { data: me, isLoading: isMeLoading } = useFetchMeQuery();
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();
  const [profileModal, setProfileModal] = useState(false);

  useEffect(() => {
    // 로딩 중에는 판단을 보류합니다.
    if (isMeLoading || isProfileLoading) return;

    if (me) {
      // 필수 데이터 존재 여부 확인 (이 값이 모두 있어야 '완성'으로 간주)
      const hasRequiredInfo = !!(profile?.nickname && profile?.realName && profile?.profileEmoji);

      // 약관 동의가 안 되었거나, 필수 정보가 하나라도 없는 경우에만 띄움
      if (!me.isAgreed || !hasRequiredInfo) {
        setProfileModal(true);
      }
    }
  }, [me, profile, isMeLoading, isProfileLoading]);

  return (
    <Container>
      {profileModal && (
        <ProfileModal onClose={() => setProfileModal(false)} isInitial={!me?.isAgreed} />
      )}
      <TitleContainer>
        <Title>Your Pocket</Title>
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
