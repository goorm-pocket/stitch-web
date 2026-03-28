import styled from "styled-components";
import { Suspense, useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { Theme, type EmojiClickData } from "emoji-picker-react";
import {
  useSuspenseGetProfileQuery, // Suspense 기반 프로필 조회 훅
  usePatchProfileMutation,
  useSetupProfileMutation,
  usePatchPrivateProfileMutation,
} from "@/shared/hooks/useUser";
import { SinglePresignedUrl, uploadFileToS3 } from "@/shared/api/uploads";

const S3_BASE_URL = "https://pocket-stitch-media-dev.s3.ap-northeast-2.amazonaws.com/"; //나중에 분리

//입력 데이터
interface FormData {
  nickname: string;
  realName: string;
  birth: string;
  profileImageUrl: string | null;
  profileEmoji: string | null;
}

// 서버 응답 폼
const mapProfileToUI = (data: {
  nickname?: string | null;
  realName?: string | null;
  birth?: string | null;
  profileImageUrl?: string | null;
  profileEmoji?: string | null;
}) => {
  const key = data.profileImageUrl || "";
  const profileFullUrl = key && !key.startsWith("http") ? `${S3_BASE_URL}${key}` : key;

  return {
    formData: {
      nickname: data.nickname || "",
      realName: data.realName || "",
      birth: data.birth || "",
      profileImageUrl: key,
      profileEmoji: data.profileEmoji || "",
    },
    profileImageKey: key,
    profileImg: profileFullUrl,
    emojiContent: data.profileEmoji || null,
  };
};

const ProfileModalContent = ({
  onClose,
  isInitial,
  isPage,
}: {
  onClose: () => void;
  isInitial?: boolean;
  isPage?: boolean;
}) => {
  //API
  const { data: profileData } = useSuspenseGetProfileQuery();
  const { mutateAsync: setupProfileMutate } = useSetupProfileMutation();
  const { mutateAsync: patchProfileMutate } = usePatchProfileMutation();
  const { mutateAsync: patchPrivateProfileMutate } = usePatchPrivateProfileMutation();
  const initialUI = mapProfileToUI(profileData); // 조회 데이터를 초기 UI 상태로 변환

  //조회, 수정 모드
  const [isEditing, setIsEditing] = useState(isInitial);
  //복구 데이터
  const [initialData] = useState<FormData>(initialUI.formData);
  const [formData, setFormData] = useState<FormData>(initialUI.formData);

  //화면 표시용
  const [profileImg, setProfileImg] = useState<string | null>(initialUI.profileImg);
  //S3 key
  const [profileImageKey, setProfileImageKey] = useState<string>(initialUI.profileImageKey);
  //실제 파일
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const [emojiContent, setEmojiContent] = useState<string | null>(initialUI.emojiContent);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  //날짜&필수값
  const today = new Date().toISOString().split("T")[0];
  const isFormValid =
    formData.nickname.trim() !== "" && formData.realName.trim() !== "" && emojiContent !== null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "emoji") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "photo") {
          setProfileFile(file);
          setProfileImg(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setEmojiContent(emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const isEmojiText = (content: string | null) => {
    if (!content) return false;
    return !content.startsWith("data:image");
  };

  const handleSave = async () => {
    const userId = profileData?.userId;
    if (!isFormValid) return;

    try {
      if (!userId) {
        return;
      }

      let finalProfileKey = profileImageKey;

      //새 이미지 업로드
      if (profileFile) {
        const presignedData = await SinglePresignedUrl(userId, {
          uploadType: "PROFILE_IMAGE",
          contentType: profileFile.type,
          fileExtension: profileFile.name.split(".").pop() || "jpg",
          fileSize: profileFile.size,
        });

        if (presignedData?.uploadUrl && presignedData?.key) {
          await uploadFileToS3(presignedData.uploadUrl, profileFile);

          finalProfileKey = presignedData.key;

          setProfileImageKey(presignedData.key);
          setProfileImg(`${S3_BASE_URL}${presignedData.key}`);
        }
      }

      const publicPayload = {
        nickname: formData.nickname,
        profileImageKey: finalProfileKey,
        profileEmoji: emojiContent || undefined,
        isPublic: true,
        namePublic: true,
        birthPublic: false,
        agePublic: false,
      };

      const privatePayload = {
        realName: formData.realName,
        birth: formData.birth || undefined,
      };

      if (isInitial) {
        await setupProfileMutate({
          profile: { ...publicPayload, ...privatePayload },
        });

        await patchPrivateProfileMutate({ profile: privatePayload });
      } else {
        await Promise.all([
          patchProfileMutate({ profile: publicPayload }),
          patchPrivateProfileMutate({ profile: privatePayload }),
        ]);
      }

      setIsEditing(false);
      onClose();
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  const handleCancel = () => {
    if (initialData) {
      setFormData(initialData);

      const key = initialData.profileImageUrl || "";
      setProfileImageKey(key);

      const fullUrl = key && !key.startsWith("http") ? `${S3_BASE_URL}${key}` : key;

      setProfileImg(fullUrl);
      setEmojiContent(initialData.profileEmoji);
    }

    setIsEditing(false);
    setShowEmojiPicker(false);
  };

  return (
    <ModalOverlay $isPage={isPage}>
      <ModalContainer $isPage={isPage}>
        {!isPage && <CloseBtn onClick={onClose}>&times;</CloseBtn>}

        <TitleContainer>
          <Title>Profile Settings</Title>
          <Description>
            {isPage ? "필수 프로필 정보를 입력한 뒤 STITCH를 이용할 수 있어요." : " "}
          </Description>
        </TitleContainer>

        <Box>
          <SectionTitle>1. Profile Customization</SectionTitle>

          <AppearanceBox>
            <CustomBox
              onClick={() => {
                if (isEditing) {
                  if (photoInputRef.current) photoInputRef.current.value = "";
                  photoInputRef.current?.click();
                }
              }}
              $isEditing={isEditing}
            >
              <input
                type="file"
                ref={photoInputRef}
                onChange={(e) => handleFileChange(e, "photo")}
                accept="image/*"
                style={{ display: "none" }}
              />
              <PickerCircle>
                {profileImg ? <PreviewImg src={profileImg} /> : <PlusIcon>+</PlusIcon>}
              </PickerCircle>
              <LabelText>PROFILE</LabelText>
            </CustomBox>

            <CustomBox $isEditing={isEditing} $isError={isEditing && !emojiContent}>
              <PickerCircle $isError={isEditing && !emojiContent}>
                {emojiContent ? (
                  isEmojiText(emojiContent) ? (
                    <EmojiDisplay>{emojiContent}</EmojiDisplay>
                  ) : (
                    <PreviewImg src={emojiContent} />
                  )
                ) : (
                  <PlusIcon>+</PlusIcon>
                )}
              </PickerCircle>

              <LabelText>Bubble (Required)</LabelText>

              <Buttons>
                <MiniBtn onClick={() => setShowEmojiPicker(!showEmojiPicker)} disabled={!isEditing}>
                  Emoji
                </MiniBtn>
              </Buttons>

              {isEditing && showEmojiPicker && (
                <PickerWrapper ref={emojiPickerRef}>
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    width={320}
                    height={400}
                    theme={Theme.LIGHT}
                    searchDisabled={false}
                    autoFocusSearch={false}
                  />
                </PickerWrapper>
              )}
            </CustomBox>
          </AppearanceBox>

          <SectionTitle>2. Personal Information</SectionTitle>
          <InputGrid>
            <InputWrapper>
              <label>Nickname (Required)</label>
              <StyledInput
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                disabled={!isEditing}
                $isError={isEditing && formData.nickname.trim() === ""}
                placeholder="e.g. SpaceExplorer"
              />
            </InputWrapper>
            <InputWrapper>
              <label>Real Name (Required)</label>
              <StyledInput
                name="realName"
                value={formData.realName}
                onChange={handleInputChange}
                disabled={!isEditing}
                $isError={isEditing && formData.realName.trim() === ""}
                placeholder="Enter your full name"
              />
            </InputWrapper>
          </InputGrid>

          <InputWrapper style={{ marginTop: "20px" }}>
            <label>Date of Birth (Optional)</label>
            <StyledInput
              name="birth"
              type="date"
              value={formData.birth}
              onChange={handleInputChange}
              disabled={!isEditing}
              max={today}
            />
          </InputWrapper>
        </Box>

        <ButtonWrapper>
          {!isEditing ? (
            <EditBtn onClick={() => setIsEditing(true)}>Edit Profile</EditBtn>
          ) : (
            <>
              <CancelBtn
                onClick={handleCancel}
                disabled={isInitial && !isFormValid}
                style={{ opacity: isInitial && !isFormValid ? 0.5 : 1 }}
              >
                Cancel
              </CancelBtn>
              <SaveBtn disabled={!isFormValid} onClick={handleSave}>
                Save Profile
              </SaveBtn>
            </>
          )}
        </ButtonWrapper>
      </ModalContainer>
    </ModalOverlay>
  );
};

const ProfileModal = ({
  onClose,
  isInitial,
  isPage,
}: {
  onClose: () => void;
  isInitial?: boolean;
  isPage?: boolean;
}) => {
  return (
    <Suspense fallback={<ProfileModalFallback isPage={isPage} />}>
      <ProfileModalContent onClose={onClose} isInitial={isInitial} isPage={isPage} />
    </Suspense>
  );
};

export default ProfileModal;

const ProfileModalFallback = ({ isPage }: { isPage?: boolean }) => {
  return (
    <ModalOverlay $isPage={isPage}>
      <LoadingModalContainer $isPage={isPage}>
        <TitleContainer>
          <Title>Profile Settings</Title>
          <Description>프로필 정보를 불러오는 중입니다.</Description>
        </TitleContainer>
      </LoadingModalContainer>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div<{ $isPage?: boolean }>`
  position: ${(props) => (props.$isPage ? "static" : "fixed")};
  top: 0;
  left: 0;
  width: 100%;
  min-height: ${(props) => (props.$isPage ? "auto" : "100vh")};
  background: ${(props) => (props.$isPage ? "transparent" : "rgba(0, 0, 0, 0.5)")};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div<{ $isPage?: boolean }>`
  background: white;
  width: ${(props) => (props.$isPage ? "min(720px, 100%)" : "580px")};
  max-height: ${(props) => (props.$isPage ? "none" : "90vh")};
  padding: 40px;
  border-radius: 16px;
  position: relative;
  box-shadow: ${(props) =>
    props.$isPage ? "0 10px 25px -5px rgba(0, 0, 0, 0.08)" : "0 20px 40px rgba(0, 0, 0, 0.2)"};
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }
`;

const LoadingModalContainer = styled(ModalContainer)`
  min-height: 220px;
  justify-content: center;
`;

const TitleContainer = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: #212529;
`;

const Description = styled.p`
  font-size: 14px;
  color: #868e96;
  margin-top: 4px;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 28px;
  color: #ccc;
  cursor: pointer;
  &:hover {
    color: #333;
  }
`;

const Box = styled.div`
  flex: 1;
`;

const SectionTitle = styled.div`
  background: ${({ theme }) => theme.colors.border};
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text_primary};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;

const AppearanceBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 32px;
`;

const CustomBox = styled.div<{ $isEditing?: boolean; $isError?: boolean }>`
  position: relative;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 20px;
  width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  cursor: ${(props) => (props.$isEditing ? "pointer" : "default")};
  transition: all 0.2s ease;

  border: 1px solid ${(props) => (props.$isError ? "#ff6b6b" : "transparent")};

  &:hover {
    background: ${(props) => (props.$isEditing ? "#e9ecef" : "#f8f9fa")};
  }
`;

const PickerCircle = styled.div<{ $shape?: "round" | "rect"; $isError?: boolean }>`
  width: 130px;
  height: 130px;

  border-radius: ${(props) => (props.$shape === "rect" ? "0" : "50%")};

  border: 2px dashed "#dee2e6";
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: border-radius 0.3s ease;
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlusIcon = styled.span`
  font-size: 28px;
  color: #adb5bd;
  font-weight: 300;
`;

const EmojiDisplay = styled.span`
  font-size: 44px;
  line-height: 1;
`;

const LabelText = styled.span`
  font-size: 10px;
  font-weight: 800;
  color: #adb5bd;
  text-align: center;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  label {
    font-size: 13px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text_secondary};
  }
`;

const StyledInput = styled.input<{ $isError?: boolean }>`
  padding: 14px;
  border: 1px solid ${(props) => (props.$isError ? "#ff6b6b" : "#dee2e6")};
  border-radius: 10px;
  font-size: 14px;
  background: ${(props) => (props.disabled ? "#f8f9fa" : "white")};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$isError ? "#ff6b6b" : "#748ffc")};
    box-shadow: ${(props) => (props.$isError ? "0 0 0 3px rgba(255, 107, 107, 0.1)" : "none")};
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
`;

const EditBtn = styled.button`
  padding: 12px 28px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
`;

const SaveBtn = styled.button`
  padding: 12px 28px;
  background: ${(props) => (props.disabled ? "#e9ecef" : props.theme.colors.primary)};
  color: ${(props) => (props.disabled ? "#adb5bd" : "white")};
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

const CancelBtn = styled.button`
  background: none;
  border: none;
  color: #868e96;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    color: #495057;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
  z-index: 10px;
`;

const MiniBtn = styled.button`
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 700;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  color: #495057;
  cursor: pointer;
  &:hover {
    background: #f1f3f5;
  }

  &:disabled {
    cursor: not-allowed;
    background: #f1f3f5;
    color: #ced4da;
    border-color: #e9ecef;
  }
`;

const PickerWrapper = styled.div`
  position: fixed;
  top: 70%;
  left: 40%;
  transform: translate(-50%, -50%);

  z-index: 10000;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  background: white;
  border-radius: 8px;
  line-height: 0;
`;
