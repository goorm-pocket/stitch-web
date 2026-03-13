import {
  SectionHeader,
  SectionItem,
  SectionLeft,
  SectionList,
  SectionToggle,
  SettingsSection,
} from "../setting.styled";
import type { NotificationKey, NotificationSettings } from "@/shared/types/user.type";
import type { ReactNode } from "react";

import NotificationIcon from "@/assets/settings/notification-icon.svg";
import FriendRequestIcon from "@/assets/settings/friend-request-icon.svg";
import FriendAcceptIcon from "@/assets/settings/friend-accept-icon.svg";
import CommentIcon from "@/assets/settings/comment-icon.svg";
import MentionIcon from "@/assets/settings/mention-icon.svg";
import LikeIcon from "@/assets/settings/like-icon.svg";
import RecapIcon from "@/assets/settings/recap-icon.svg";
import {
  useGetNotificationSettingsQuery,
  usePatchNotificationSettingsMutation,
} from "@/shared/hooks/useUser";

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

const NotificationSection = () => {
  // 알람 설정 데이터
  const { data: notificationStatesData } = useGetNotificationSettingsQuery();
  const { mutate: patchNotificationSettings } = usePatchNotificationSettingsMutation();

  const notificationStates = notificationStatesData?.notificationSettings;
  const notificationEnabled = notificationStates?.pushEnabled ?? false;

  const handleToggle = async (notification: NotificationKey) => {
    if (!notificationStates) return;

    const toggle = !notificationStates[notification];
    await patchNotificationSettings({ notificationSettings: { [notification]: toggle } });
  };

  return (
    <SettingsSection>
      <SectionHeader>
        <NotificationIcon />
        <div>Notification Settings</div>
        <SectionToggle checked={notificationEnabled} onChange={() => handleToggle("pushEnabled")} />
      </SectionHeader>

      <SectionList $active={notificationEnabled}>
        {notificationItems.map((item) => (
          <SectionItem key={item.key}>
            <SectionLeft>
              {item.icon}
              <div>{item.label}</div>
            </SectionLeft>

            <SectionToggle
              disabled={!notificationEnabled}
              checked={notificationStates ? notificationStates[item.key] : false}
              onChange={() => handleToggle(item.key)}
            />
          </SectionItem>
        ))}
      </SectionList>
    </SettingsSection>
  );
};

export default NotificationSection;
