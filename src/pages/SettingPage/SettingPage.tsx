import styled from "styled-components";

import NotificationSection from "./components/NotificationSection";
import PrivacySection from "./components/PrivacySection";
import ActionSection from "./components/ActionSection";

const SettingPage = () => {
  return (
    <Container>
      <NotificationSection />
      <PrivacySection />
      <ActionSection />
    </Container>
  );
};

export default SettingPage;

const Container = styled.main`
  display: flex;
  flex-direction: column;
  width: min(${({ theme }) => theme.layout.contentWidth}, 100%);
  padding: ${({ theme }) => theme.space.xl} 0 ${({ theme }) => theme.space.xxxl};
  gap: ${({ theme }) => theme.space.xxl};

  @media (max-width: 640px) {
    width: calc(100% - 8px);
    padding: 12px 0 ${({ theme }) => theme.space.xl};
    gap: ${({ theme }) => theme.space.lg};
  }
`;
