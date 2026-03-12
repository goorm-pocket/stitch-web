import styled from "styled-components";
import NotificationIcon from "@/assets/settings/notification-icon.svg";
import FriendRequestIcon from "@/assets/settings/friend-request-icon.svg";
import FriendAcceptIcon from "@/assets/settings/friend-accept-icon.svg";
import CommentIcon from "@/assets/settings/comment-icon.svg";
import MentionIcon from "@/assets/settings/mention-icon.svg";
import LikeIcon from "@/assets/settings/like-icon.svg";
import RecapIcon from "@/assets/settings/recap-icon.svg";

const SettingPage = () => {
  const notificationItems = [
    { key: "friendRequest", label: "Friend Request", icon: <FriendRequestIcon /> },
    { key: "friendAccept", label: "Friend Acceptance", icon: <FriendAcceptIcon /> },
    { key: "comment", label: "Comment", icon: <CommentIcon /> },
    { key: "mention", label: "Mention", icon: <MentionIcon /> },
    { key: "like", label: "Like", icon: <LikeIcon /> },
    { key: "weeklyRecap", label: "Weekly Recap", icon: <RecapIcon /> },
  ];

  return (
    <Container>
      <SettingsSection>
        <SectionHeader>
          <NotificationIcon />
          <div>Notification Settings</div>
          <SectionToggle $active={true}></SectionToggle>
        </SectionHeader>
        <SectionList>
          {notificationItems.map((item) => (
            <SectionItem key={item.key}>
              <SectionLeft>
                {item.icon}
                <div>{item.label}</div>
              </SectionLeft>
              <SectionToggle $active={false} />
            </SectionItem>
          ))}
        </SectionList>
      </SettingsSection>
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

const SettingsSection = styled.section`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.sub};
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.header`
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  padding: 18px;
  gap: 12px;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const SectionList = styled.div``;

const SectionItem = styled.div`
  display: flex;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  padding: 16px 18px 16px 30px;
`;

const SectionLeft = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text_primary};
  gap: 12px;
`;

const SectionToggle = styled.div<{ $active: boolean }>`
  margin-left: auto;
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 999px;
  background: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  cursor: pointer;
  transition: background 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    transition: transform 0.2s ease;
    transform: ${({ $active }) => ($active ? "translateX(20px)" : "translateX(0)")};
  }
`;
