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
  padding: ${({ theme }) => theme.space.md} 0 ${({ theme }) => theme.space.xxxl};
  gap: ${({ theme }) => theme.space.xxl};

  @media (max-width: 640px) {
    padding: ${({ theme }) => theme.space.sm} 0 ${({ theme }) => theme.space.xxl};
    gap: ${({ theme }) => theme.space.xl};
  }
`;
