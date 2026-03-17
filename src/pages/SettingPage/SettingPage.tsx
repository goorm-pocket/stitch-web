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
  width: 900px;
  padding: 12px 28px;
  gap: 24px;
`;
