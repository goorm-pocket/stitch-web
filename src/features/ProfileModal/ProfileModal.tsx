import styled from "styled-components";
import { useState, useEffect, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import EmojiPicker from "emoji-picker-react";
import { Theme, type EmojiClickData } from "emoji-picker-react";

interface ProfileModalProps {
  onClose: () => void;
}

interface ProfileData {
  nickname: string;
  realName: string;
  birth: string;
  profileImg: string | null;
  emojiContent: string | null;
}

const ProfileModal = ({ onClose }: ProfileModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [savedData, setSavedData] = useState<ProfileData>({
    nickname: "xode114kr1",
    realName: "신윤호",
    birth: "",
    profileImg: null,
    emojiContent: null,
  });

  const [formData, setFormData] = useState<ProfileData>(savedData);

  const [profileImg, setProfileImg] = useState<string | null>(savedData.profileImg);
  const [emojiContent, setEmojiContent] = useState<string | null>(savedData.emojiContent);
  const [emojiImg, setEmojiImg] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  //Crop
  const [imageToCrop, setImageToCrop] = useState<{ url: string; type: "photo" | "emoji" } | null>(
    null,
  );
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  //오늘 날짜
  const today = new Date().toISOString().split("T")[0];

  const photoInputRef = useRef<HTMLInputElement>(null);
  const emojiInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "emoji") => {
    const file = e.target.files?.[0];
    if (file) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "photo") setImageToCrop({ url: reader.result as string, type });
        else setImageToCrop({ url: reader.result as string, type: "emoji" });
      };
      reader.readAsDataURL(file);
    }
  };

  // 크롭 완료 핸들러
  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // 잘린 이미지를 생성하는 함수 (Canvas 활용)
  const getCroppedImg = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;

    const image = new Image();
    image.src = imageToCrop.url;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const { width, height, x, y } = croppedAreaPixels;
    canvas.width = width;
    canvas.height = height;

    ctx?.drawImage(image, x, y, width, height, 0, 0, width, height);

    const base64Image = canvas.toDataURL("image/jpeg");

    if (imageToCrop.type === "photo") {
      setProfileImg(base64Image);
    } else {
      // 이 부분을 setEmojiImg 대신 setEmojiContent로 변경!
      setEmojiContent(base64Image);
    }

    setImageToCrop(null); // 크롭 창 닫기
  };

  useEffect(() => {
    setProfileImg(savedData.profileImg);
    setEmojiContent(savedData.emojiContent);
  }, [savedData]);

  // --- 핸들러 수정 ---

  // [취소 버튼 클릭 시]
  const handleCancel = () => {
    // 원본 데이터(savedData)로 폼과 이미지 상태를 모두 덮어씌웁니다.
    setFormData(savedData); // 이제 타입이 일치하므로 에러가 나지 않습니다.
    setProfileImg(savedData.profileImg);
    setEmojiContent(savedData.emojiContent);

    setIsEditing(false);
    setShowEmojiPicker(false);
  };

  const handleSave = () => {
    if (isFormValid) {
      const newData: ProfileData = {
        ...formData,
        profileImg, // 현재 수정된 이미지 상태값 반영
        emojiContent, // 현재 수정된 이모지 상태값 반영
      };
      setSavedData(newData); // 원본을 새 데이터로 교체
      alert("프로필이 저장되었습니다!");
      setIsEditing(false);
    }
  };

  useEffect(() => {
    const handleClickOustside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOustside);
    return () => {
      document.removeEventListener("mousedown", handleClickOustside);
    };
  }, [showEmojiPicker]);

  // 이모지 클릭 핸들러
  const onEmojiClick = (emojiData: EmojiClickData) => {
    setEmojiContent(emojiData.emoji); // 선택한 이모지 저장
    setShowEmojiPicker(false); // 픽커 닫기
  };

  const handleEmojiFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 상태 초기화
      setCrop({ x: 0, y: 0 });
      setZoom(1);

      const reader = new FileReader();
      reader.onload = () => {
        // emoji 타입으로 크롭 오버레이를 띄웁니다.
        setImageToCrop({ url: reader.result as string, type: "emoji" });
      };
      reader.readAsDataURL(file);
    }
  };

  // 텍스트인지 이미지인지 판별
  const isEmojiText = (content: string | null) => {
    if (!content) return false;
    return !content.startsWith("data:image"); // data 주소가 아니면 텍스트로 간주
  };

  //Required
  const isFormValid =
    formData.nickname?.trim() !== "" && formData.realName?.trim() !== "" && emojiContent !== null;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <ModalContainer>
      {imageToCrop && (
        <CropOverlay>
          <CropContainer>
            <Cropper
              image={imageToCrop.url}
              crop={crop}
              zoom={zoom}
              aspect={1} // 1:1 비율 고정
              cropShape="round" // 원형 가이드라인
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </CropContainer>
          <CropButtonWrapper>
            <CancelButton onClick={() => setImageToCrop(null)}>Cancel</CancelButton>
            <EditModeButton onClick={getCroppedImg}>Save</EditModeButton>
          </CropButtonWrapper>
        </CropOverlay>
      )}

      <CloseButton onClick={onClose}>&times;</CloseButton>

      <TitleContainer>
        <ModalTitle>Profile Settings</ModalTitle>
        <Description> </Description>
      </TitleContainer>

      <ModalBody>
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

          {/* 이모지/사진 섹션 */}
          <CustomBox
            $isEditing={isEditing}
            $isError={isEditing && !emojiContent} // 수정 중인데 내용이 없으면 에러
          >
            <input
              type="file"
              ref={emojiInputRef}
              onChange={handleEmojiFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />

            <PickerCircle>
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

            <ButtonGroup>
              <MiniButton
                onClick={() => {
                  if (emojiInputRef.current) emojiInputRef.current.value = ""; // 초기화 추가
                  emojiInputRef.current?.click();
                }}
                disabled={!isEditing}
              >
                Image
              </MiniButton>
              <MiniButton
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={!isEditing}
              >
                Emoji
              </MiniButton>
            </ButtonGroup>

            {/* 이모지 픽커 팝업 (isEditing일 때만 팝업 가능) */}
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

        {/* 2. Personal Information Section */}
        <SectionTitle>2. Personal Information</SectionTitle>
        <InputGrid>
          <InputWrapper>
            <label>Nickname (Required)</label>
            <StyledInput
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
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
              onChange={handleChange}
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
            onChange={handleChange}
            disabled={!isEditing}
            max={today}
          />
        </InputWrapper>
      </ModalBody>

      <ButtonWrapper>
        {!isEditing ? (
          // 수정 모드가 아닐 때 보여줄 '수정하기' 버튼
          <EditModeButton onClick={() => setIsEditing(true)}>Edit Profile</EditModeButton>
        ) : (
          <>
            <CancelButton onClick={handleCancel}>Cancel</CancelButton>
            <SaveButton disabled={!isFormValid} onClick={handleSave}>
              Save Profile
            </SaveButton>
          </>
        )}
      </ButtonWrapper>
    </ModalContainer>
  );
};

export default ProfileModal;

const CropOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  z-index: 10;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const CropContainer = styled.div`
  position: relative;
  width: 100%;
  height: 550px;
  background: #333;
  border-radius: 8px;
`;

const CropButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: auto;
`;

const ModalContainer = styled.div`
  background: white;
  width: 580px;
  padding: 40px;
  border-radius: 16px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
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

const TitleContainer = styled.div`
  margin-bottom: 32px;
`;

const ModalTitle = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: #212529;
`;

const Description = styled.p`
  font-size: 14px;
  color: #868e96;
  margin-top: 4px;
`;

const ModalBody = styled.div`
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

const CustomBox = styled.div<{ $isEditing: boolean; $isError?: boolean }>`
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

  /* 에러 상태일 때 테두리 추가 */
  border: 1px solid ${(props) => (props.$isError ? "#ff6b6b" : "transparent")};

  &:hover {
    background: ${(props) => (props.$isEditing ? "#e9ecef" : "#f8f9fa")};
  }
`;

const PickerCircle = styled.div`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 2px dashed "#dee2e6";
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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

const LabelText = styled.span`
  font-size: 10px;
  font-weight: 800;
  color: #adb5bd;
  text-align: center;
`;

const PickerWrapper = styled.div`
  position: absolute;
  top: 95%;
  left: 100px;
  transform: translateX(-50%);
  margin-top: 8px;
  z-index: 100;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
`;

const EmojiDisplay = styled.span`
  font-size: 44px;
  line-height: 1;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  z-index: 10px;
`;

const MiniButton = styled.button`
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
  /* 비활성화 상태 스타일 */
  &:disabled {
    cursor: not-allowed;
    background: #f1f3f5;
    color: #ced4da;
    border-color: #e9ecef;
  }
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

const EditModeButton = styled.button`
  padding: 12px 28px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
`;

const SaveButton = styled.button`
  padding: 12px 28px;
  background: ${(props) => (props.disabled ? "#e9ecef" : props.theme.colors.primary)};
  color: ${(props) => (props.disabled ? "#adb5bd" : "white")};
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  color: #868e96;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    color: #495057;
  }
`;
