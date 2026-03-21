import styled from "styled-components";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Cropper from "react-easy-crop";
import EmojiPicker from "emoji-picker-react";
import { Theme, type EmojiClickData } from "emoji-picker-react";
import { getProfile, patchProfile, setupProfile } from "@/shared/api/user";
import {
  useGetProfileQuery,
  usePatchProfileMutation,
  useSetupProfileMutation,
  useGetNotificationSettingsQuery,
} from "@/shared/hooks/useUser";
import { apiClient } from "@/shared/api/axios";

type CropShape = "rect" | "round";

//입력 데이터
interface FormData {
  nickname: string;
  realName: string;
  birth: string;
  profileImg: string | null;
  emojiContent: string | null;
}

const ProfileModal = ({ onClose, isInitial }: { onClose: () => void; isInitial?: boolean }) => {
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery();
  const { mutateAsync: setupProfileMutate } = useSetupProfileMutation();
  const { mutateAsync: patchProfileMutate } = usePatchProfileMutation();

  const [isEditing, setIsEditing] = useState(isInitial); //조회, 수정 모드
  const [initialData, setInitialData] = useState<FormData | null>(null); //복구 데이터
  const [formData, setFormData] = useState<FormData>({
    nickname: "",
    realName: "",
    birth: "",
    profileImg: "",
    emojiContent: "",
  });

  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [emojiContent, setEmojiContent] = useState<string | null>(null);
  const [bubbleShape, setBubbleShape] = useState<CropShape>("round");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  //크롭 이미지 객체
  const [imageToCrop, setImageToCrop] = useState<{ url: string; type: "photo" | "emoji" } | null>(
    null,
  );
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropShape, setCropShape] = useState<CropShape>("round");

  const aspect = cropShape === "rect" ? undefined : 1;

  const photoInputRef = useRef<HTMLInputElement>(null);
  const emojiInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  //오늘 날짜
  const today = new Date().toISOString().split("T")[0];

  //Required
  const isFormValid =
    formData.nickname.trim() !== "" && formData.realName.trim() !== "" && emojiContent !== null;

  const currentCropConfig = useMemo(() => {
    if (!imageToCrop) return { aspect: 1, shape: "round" as CropShape };
    if (imageToCrop.type === "photo") return { aspect: 1, shape: "round" as CropShape };
    return { aspect: cropShape === "rect" ? undefined : 1, shape: cropShape };
  }, [imageToCrop, cropShape]);

  const updateUIWithData = (data: any) => {
    console.log("updateUIWithData", data);
    const mappedData = {
      nickname: data.nickname || "",
      realName: data.realName || "",
      birth: data.birth || data.birthDate || "",
      profileImg: data.profileImageUrl || "",
      emojiContent: data.profileEmoji || "",
    };
    setFormData(mappedData);
    setInitialData(mappedData);
    setProfileImg(mappedData.profileImg || null);
    setEmojiContent(mappedData.emojiContent || null);
  };

  //모달 정보 조회
  useEffect(() => {
    if (profileData && !isInitialized.current) {
      console.log("bbb", profileData);
      updateUIWithData(profileData);
      //console.log("ccc", updateUIWithData(profileData));
      isInitialized.current = true;
    }
  }, [profileData]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "emoji") => {
    const file = e.target.files?.[0];
    if (file) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      if (type === "photo") setCropShape("round");
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "photo") setImageToCrop({ url: reader.result as string, type });
        else setImageToCrop({ url: reader.result as string, type: "emoji" });
      };
      reader.readAsDataURL(file);
    }
  };

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
      setEmojiContent(base64Image);
      setBubbleShape(cropShape);
    }

    setImageToCrop(null); // 크롭 창 닫기
  };

  // 1. Base64를 File 객체로 변환하는 유틸리티
  const base64ToFile = (base64: string, fileName: string) => {
    const [header, data] = base64.split(",");
    const mime = header.match(/:(.*?);/)?.[1];
    const bstr = atob(data);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], fileName, { type: mime });
  };

  // 2. S3 업로드 프로세스 (Presigned URL 활용)
  const uploadToS3 = async (file: File, userId: string) => {
    // 1. 서버에 Presigned URL 요청 (명세서 기준)
    const res = await apiClient.post(
      "/api/v1/uploads/presigned-url",
      {
        uploadType: "PROFILE_IMAGE", // 명세서 예시 값
        contentType: file.type, // image/jpeg 등
        fileExtension: file.name.split(".").pop() || "jpg",
        fileSize: file.size.toString(), // 문자열로 전송
      },
      {
        params: { userId: userId }, // 쿼리 파라미터 ?userId=...
      },
    );

    const { uploadUrl, key } = res.data.data;

    // 2. S3에 직접 Binary 파일 업로드 (PUT)
    await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    // DB에 저장할 때 사용할 'key' 반환
    return key;
  };

  const handleSave = async () => {
    let userId = profileData.userId;
    if (!isFormValid) return;

    try {
      // 0. 현재 로그인한 유저 ID 확인 (Redux, Context 등에서 가져온 값)
      // 예: const userId = currentUser.id;
      if (!userId) {
        alert("로그인 정보가 없습니다.");
        return;
      }

      let finalProfileKey = profileImg;
      let finalEmojiValue = emojiContent;

      // 1. 프로필 이미지가 새로 크롭된 Base64라면 S3 업로드
      if (profileImg && profileImg.startsWith("data:image")) {
        const file = base64ToFile(profileImg, `profile_${Date.now()}.jpg`);
        finalProfileKey = await uploadToS3(file, userId);
      }

      // 2. Bubble(Emoji) 데이터 처리
      const isEmoji = isEmojiText(emojiContent);

      if (!isEmoji && emojiContent && emojiContent.startsWith("data:image")) {
        // 버블이 이미지(Base64)라면 S3 업로드
        const file = base64ToFile(emojiContent, `bubble_${Date.now()}.jpg`);
        finalEmojiValue = await uploadToS3(file, userId);
      }

      // 3. 최종 서버 페이로드 구성
      const payload: any = {
        nickname: formData.nickname,
        realName: formData.realName,
        birth: formData.birth || undefined,
        profileImageKey: finalProfileKey || undefined, // S3 Key (짧음)
        profileEmoji: finalEmojiValue || undefined, // 이모지 문자열 OR S3 Key
        isPublic: true,
        namePublic: true,
        birthPublic: false,
        agePublic: false,
      };

      // 4. 프로필 생성 또는 수정 API 호출
      const response = isInitial
        ? await setupProfileMutate({ profile: payload })
        : await patchProfileMutate({ profile: payload });

      updateUIWithData(response);
      alert(isInitial ? "설정이 완료되었습니다!" : "수정되었습니다!");
      setIsEditing(false);
      onClose();
    } catch (err: any) {
      console.error("Save Error:", err);
      // 400 에러 등이 발생했을 때 서버의 메시지를 보여주면 디버깅이 쉽습니다.
      const errorMsg = err.response?.data?.message || "저장 중 오류가 발생했습니다.";
      alert(errorMsg);
    }
  };

  const handleCancel = () => {
    if (initialData) {
      setFormData(initialData); // 백업 데이터로 복구
      setProfileImg(initialData.profileImg);
      setEmojiContent(initialData.emojiContent);
    }
    setCropShape("round");
    setIsEditing(false);
    setShowEmojiPicker(false);
  };
  if (isProfileLoading) return null;

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const isEmojiText = (content: string | null) => {
    if (!content) return false;
    return !content.startsWith("data:image");
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setEmojiContent(emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleEmojiFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop({ url: reader.result as string, type: "emoji" });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        {(!isInitial || isFormValid) && <CloseButton onClick={onClose}>&times;</CloseButton>}
        {imageToCrop && (
          <CropOverlay>
            <CropContainer>
              <Cropper
                image={imageToCrop.url}
                crop={crop}
                zoom={zoom}
                aspect={imageToCrop.type === "photo" ? 1 : aspect}
                cropShape={imageToCrop.type === "photo" ? "round" : cropShape}
                showGrid={imageToCrop.type === "photo" ? false : cropShape === "rect"}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </CropContainer>

            {/* 모양 선택 버튼 그룹 추가 */}
            {imageToCrop.type === "emoji" && (
              <ShapeSelectorWrapper>
                <ShapeButton $active={cropShape === "round"} onClick={() => setCropShape("round")}>
                  원형
                </ShapeButton>
                <ShapeButton $active={cropShape === "rect"} onClick={() => setCropShape("rect")}>
                  사각형
                </ShapeButton>
              </ShapeSelectorWrapper>
            )}

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

            <CustomBox $isEditing={isEditing} $isError={isEditing && !emojiContent}>
              <input
                type="file"
                ref={emojiInputRef}
                onChange={handleEmojiFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />

              <PickerCircle $shape={bubbleShape} $isError={isEditing && !emojiContent}>
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
            <EditModeButton onClick={() => setIsEditing(true)}>Edit Profile</EditModeButton>
          ) : (
            <>
              <CancelButton
                onClick={handleCancel}
                disabled={isInitial && !isFormValid}
                style={{ opacity: isInitial && !isFormValid ? 0.5 : 1 }}
              >
                Cancel
              </CancelButton>
              <SaveButton disabled={!isFormValid} onClick={handleSave}>
                Save Profile
              </SaveButton>
            </>
          )}
        </ButtonWrapper>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ProfileModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5); // 뒷배경 어둡게
  display: flex;
  justify-content: center; // 가로 중앙
  align-items: center; // 세로 중앙
  z-index: 999; // 페이지의 다른 요소보다 위에 위치
`;

const CropOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  z-index: 20; /* 픽커보다 높게 */
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  /* 오버레이 자체도 스크롤 가능하게 함으로써 버튼 잘림 방지 */
  overflow-y: auto;
`;

const ModalContainer = styled.div`
  background: white;
  width: 580px;
  max-height: 90vh;
  padding: 40px;
  border-radius: 16px;
  position: relative; // 내부 CloseButton 등을 배치하기 위함
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  // 브라우저 기본 스크롤바가 모달 곡선을 해치지 않게 처리
  &::-webkit-scrollbar {
    width: 8px;
  }
`;

const ShapeSelectorWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  padding: 10px;
  background: #f1f3f5;
  border-radius: 8px;
`;

const ShapeButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 700;
  background: ${(props) => (props.$active ? props.theme.colors.primary : "white")};
  color: ${(props) => (props.$active ? "white" : props.theme.colors.text_primary)};
  border: 1px solid ${(props) => (props.$active ? props.theme.colors.primary : "#dee2e6")};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }
};
`;

const CropContainer = styled.div`
  position: relative;
  width: 100%;
  /* 고정 높이 550px 대신 최소 높이를 주고 비율로 조절하거나 높이를 살짝 줄임 */
  height: 400px;
  min-height: 300px;
  background: #333;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0; /* 크기가 줄어들지 않도록 설정 */
`;

const CropButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: auto;
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

  /* 에러 상태일 때 테두리 추가 */
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

const LabelText = styled.span`
  font-size: 10px;
  font-weight: 800;
  color: #adb5bd;
  text-align: center;
`;

const PickerWrapper = styled.div`
  /* 부모인 CustomBox의 크기에 영향을 주지 않도록 고정 */
  position: fixed;
  /* 화면 중앙 근처에 띄우거나, JS로 좌표를 계산해 버튼 근처에 둡니다. */
  top: 70%;
  left: 40%;
  transform: translate(-50%, -50%);

  z-index: 10000; /* ModalOverlay보다 높게 설정 */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  background: white;
  border-radius: 8px;
  line-height: 0; /* 내부 미세 공백 제거 */
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

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
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

const EditModeButton = styled.button`
  padding: 12px 28px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
`;
