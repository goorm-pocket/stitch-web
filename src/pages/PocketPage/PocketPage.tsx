import styled from "styled-components";
import Pocket from "../../features/Pocket/Pocket";
import { useEffect, useState } from "react";
import { useFetchMeQuery } from "../../shared/hooks/useAuth";
import ProfileModal from "@/features/ProfileModal/ProfileModal";

const PocketPage = () => {
  const { data: me, isLoading } = useFetchMeQuery(); // 5번: 인증 선확인
  const [profileModal, setProfileModal] = useState(false);

  useEffect(() => {
    // 1번: 최초 로그인 시(설정 필요 시) 또는 수동 오픈
    if (me && !me.isAgreed) {
      // 가입 승인/설정 미완료 시 예시
      setProfileModal(true);
    }
  }, [me]);

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
