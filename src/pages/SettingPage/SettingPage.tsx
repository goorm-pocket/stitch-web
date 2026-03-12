import styled from "styled-components";
import NotificationIcon from "@/assets/settings/notification-icon.svg";
import FriendRequestIcon from "@/assets/settings/friend-request-icon.svg";
import FriendAcceptIcon from "@/assets/settings/friend-accept-icon.svg";
import CommentIcon from "@/assets/settings/comment-icon.svg";
import MentionIcon from "@/assets/settings/mention-icon.svg";
import LikeIcon from "@/assets/settings/like-icon.svg";
import RecapIcon from "@/assets/settings/recap-icon.svg";

import PrivacyIcon from "@/assets/settings/privacy-icon.svg";
import NameIcon from "@/assets/settings/name-icon.svg";
import BirthIcon from "@/assets/settings/birthday-icon.svg";
import AgeIcon from "@/assets/settings/age-icon.svg";

import {
  useGetNotificationSettingsQuery,
  useGetPrivacySettingsQuery,
} from "@/shared/hooks/useAuth";
import type { NotificationSettings, PrivacySettings } from "@/shared/types/user.type";
import type { ReactNode } from "react";

const SettingPage = () => {
  const notificationItems: {
    key: Exclude<keyof NotificationSettings, "pushEnabled">;
    label: string;
    icon: ReactNode;
  }[] = [
    { key: "friendRequest", label: "Friend Request", icon: <FriendRequestIcon /> },
    { key: "friendAccepted", label: "Friend Acceptance", icon: <FriendAcceptIcon /> },
    { key: "comment", label: "Comment", icon: <CommentIcon /> },
    { key: "mention", label: "Mention", icon: <MentionIcon /> },
    { key: "postLike", label: "Post Like", icon: <LikeIcon /> },
    { key: "weeklyRecap", label: "Weekly Recap", icon: <RecapIcon /> },
  ];

  const privacyItems: {
    key: Exclude<keyof PrivacySettings, "isPublic">;
    label: string;
    icon: ReactNode;
  }[] = [
    { key: "namePublic", label: "Real Name", icon: <NameIcon /> },
    { key: "birthPublic", label: "Birth Date", icon: <BirthIcon /> },
    { key: "agePublic", label: "Age Visibility", icon: <AgeIcon /> },
  ];

  // 알람 설정 데이터
  const { data: notificationStatesData } = useGetNotificationSettingsQuery();

  const notificationStates = notificationStatesData?.notificationSettings;
  const notificationEnabled = notificationStates?.pushEnabled ?? false;

  // 개인 정보 설정 데이터
  const { data: privacyStatesData } = useGetPrivacySettingsQuery();

  const privacyStates = privacyStatesData?.privacySettings;
  const privacyEnabled = privacyStates?.isPublic ?? false;

  return (
    <Container>
      <SettingsSection>
        <SectionHeader>
          <NotificationIcon />
          <div>Notification Settings</div>
          <SectionToggle checked={notificationEnabled} />
        </SectionHeader>

        <SectionList $active={notificationEnabled}>
          {notificationItems.map((item) => (
            <SectionItem key={item.key}>
              <SectionLeft>
                {item.icon}
                <div>{item.label}</div>
              </SectionLeft>

              <SectionToggle disabled={!notificationEnabled} />
            </SectionItem>
          ))}
        </SectionList>
      </SettingsSection>

      <SettingsSection>
        <SectionHeader>
          <PrivacyIcon />
          <div>Privacy Settings</div>
          <SectionToggle checked={privacyEnabled} />
        </SectionHeader>

        <SectionList $active={privacyEnabled}>
          {privacyItems.map((item) => (
            <SectionItem key={item.key}>
              <SectionLeft>
                {item.icon}
                <div>{item.label}</div>
              </SectionLeft>

              <SectionToggle disabled={!privacyEnabled} />
            </SectionItem>
          ))}
        </SectionList>
      </SettingsSection>
      <ActionSection>
        <LogoutButton>Logout</LogoutButton>
        <DeleteButton>Delete Account</DeleteButton>
      </ActionSection>
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
  overflow: hidden;
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

const SectionList = styled.div<{ $active: boolean }>`
  opacity: ${({ $active }) => ($active ? 1 : 0.45)};
  pointer-events: ${({ $active }) => ($active ? "auto" : "none")};
  transition:
    opacity 0.2s ease,
    filter 0.2s ease;
`;

const SectionItem = styled.div`
  display: flex;
  align-items: center;
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

const SectionToggle = styled.input.attrs({ type: "checkbox" })`
  margin-left: auto;
  position: relative;
  appearance: none;
  -webkit-appearance: none;
  width: 44px;
  height: 24px;
  border-radius: 999px;
  border: none;
  outline: none;
  background: ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: background 0.2s ease;

  &:checked {
    background: ${({ theme }) => theme.colors.primary};
  }

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
    transform: translateX(0);
  }

  &:checked::after {
    transform: translateX(20px);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
`;

const LogoutButton = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text_primary};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
`;

const DeleteButton = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #fee2e2;
  color: #b91c1c;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #fecaca;
  }
`;
