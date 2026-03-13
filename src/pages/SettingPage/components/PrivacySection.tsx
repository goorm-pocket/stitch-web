import PrivacyIcon from "@/assets/settings/privacy-icon.svg";
import NameIcon from "@/assets/settings/name-icon.svg";
import BirthIcon from "@/assets/settings/birthday-icon.svg";
import AgeIcon from "@/assets/settings/age-icon.svg";
import type { PrivacyKey, PrivacySettings } from "@/shared/types/user.type";
import type { ReactNode } from "react";

import {
  SectionHeader,
  SectionItem,
  SectionLeft,
  SectionList,
  SectionToggle,
  SettingsSection,
} from "../setting.styled";
import {
  useGetPrivacySettingsQuery,
  usePatchPrivacySettingsMutation,
} from "@/shared/hooks/useUser";

const privacyItems: {
  key: Exclude<keyof PrivacySettings, "isPublic">;
  label: string;
  icon: ReactNode;
}[] = [
  { key: "namePublic", label: "Real Name", icon: <NameIcon /> },
  { key: "birthPublic", label: "Birth Date", icon: <BirthIcon /> },
  { key: "agePublic", label: "Age Visibility", icon: <AgeIcon /> },
];

const PrivacySection = () => {
  // 개인 정보 설정 데이터
  const { data: privacyStatesData } = useGetPrivacySettingsQuery();
  const { mutate: patchPrivacySettings } = usePatchPrivacySettingsMutation();

  const privacyStates = privacyStatesData?.privacySettings;
  const privacyEnabled = privacyStates?.isPublic ?? false;

  const handleToggle = async (privacy: PrivacyKey) => {
    if (!privacyStates) return;

    const toggle = !privacyStates[privacy];
    await patchPrivacySettings({ privacySettings: { [privacy]: toggle } });
  };

  return (
    <SettingsSection>
      <SectionHeader>
        <PrivacyIcon />
        <div>Privacy Settings</div>
        <SectionToggle checked={privacyEnabled} onChange={() => handleToggle("isPublic")} />
      </SectionHeader>

      <SectionList $active={privacyEnabled}>
        {privacyItems.map((item) => (
          <SectionItem key={item.key}>
            <SectionLeft>
              {item.icon}
              <div>{item.label}</div>
            </SectionLeft>

            <SectionToggle disabled={!privacyEnabled} onChange={() => handleToggle(item.key)} />
          </SectionItem>
        ))}
      </SectionList>
    </SettingsSection>
  );
};

export default PrivacySection;
