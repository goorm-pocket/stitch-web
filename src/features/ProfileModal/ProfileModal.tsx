import styled from "styled-components";
import { useState, useEffect, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";

interface ProfileModalProps {
  onClose: () => void;
}

const ProfileModal = ({ onClose }: ProfileModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "xode114kr1",
    realName: "신윤호",
    birth: "",
  });

  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [emojiImg, setEmojiImg] = useState<string | null>(null); // 이모지 이미지 상태

  //Crop
  const [imageToCrop, setImageToCrop] = useState<{ url: string; type: "photo" | "emoji" } | null>(
    null,
  );
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const emojiInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "emoji") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "photo") setImageToCrop({ url: reader.result as string, type });
        else setEmojiImg(reader.result as string);
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
    if (imageToCrop.type === "photo") setProfileImg(base64Image);
    else setEmojiImg(base64Image);

    setImageToCrop(null); // 크롭 창 닫기
  };

  //Required
  const isFormValid = formData.nickname.trim() !== "" && formData.realName.trim() !== "";
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (isFormValid) {
      alert("프로필이 저장되었습니다!");
      setIsEditing(false);
      // 여기서 onClose()를 호출해 닫게 할 수도 있습니다.
    }
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
        <ModalTitle>Set up your profile</ModalTitle>
        <Description> </Description>
      </TitleContainer>

      <ModalBody>
        {/* 1. Appearance Section */}
        <SectionTitle>1. CUSTOMIZE YOUR APPEARANCE</SectionTitle>

        <AppearanceBox>
          {/* 프로필 사진 섹션 */}
          <CustomBox
            onClick={() => isEditing && photoInputRef.current?.click()}
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
            <LabelText>PROFILE PHOTO</LabelText>
          </CustomBox>

          {/* 이모지/사진 섹션 */}
          <CustomBox
            onClick={() => isEditing && emojiInputRef.current?.click()}
            $isEditing={isEditing}
          >
            <input
              type="file"
              ref={emojiInputRef}
              onChange={(e) => handleFileChange(e, "emoji")}
              accept="image/*"
              style={{ display: "none" }}
            />
            <PickerCircle>
              {emojiImg ? <PreviewImg src={emojiImg} /> : <PlusIcon>+</PlusIcon>}
            </PickerCircle>
            <LabelText>PICK AN EMOJI / PHOTO</LabelText>
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
          />
        </InputWrapper>
      </ModalBody>

      <ButtonWrapper>
        {!isEditing ? (
          // 수정 모드가 아닐 때 보여줄 '수정하기' 버튼
          <EditModeButton onClick={() => setIsEditing(true)}>Edit Profile</EditModeButton>
        ) : (
          <>
            <CancelButton onClick={() => setIsEditing(false)}>Cancel</CancelButton>
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
  background: #f1f3f5;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 800;
  color: #495057;
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

const CustomBox = styled.div<{ $isEditing: boolean }>`
  background: #f8f9fa; /* 연한 회색 배경 */
  border-radius: 12px;
  padding: 24px;
  width: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  cursor: ${(props) => (props.$isEditing ? "pointer" : "default")};
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$isEditing ? "#e9ecef" : "#f8f9fa")};
  }
`;

const PickerCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px dashed #dee2e6;
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
    color: #495057;
  }
`;

const StyledInput = styled.input`
  padding: 14px;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  font-size: 14px;
  background: ${(props) => (props.disabled ? "#f8f9fa" : "white")};
  transition: border-color 0.2s;
  &:focus {
    outline: none;
    border-color: #748ffc;
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
  background: #748ffc;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
`;

const SaveButton = styled.button`
  padding: 12px 28px;
  background: ${(props) => (props.disabled ? "#e9ecef" : "#748ffc")};
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
