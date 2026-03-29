import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { StitchedBox } from "../../shared/ui/StitchedBox";
import Cropper, { type Area } from "react-easy-crop";
import ImageUploadIcon from "../../assets/upload-icon.svg";
import ImageIcon from "../../assets/Image-icon.svg";
import EmojiIcon from "../../assets/Emoji-icon.svg";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import { useCreatePostMutation } from "../../shared/hooks/usePost";
import { getCroppedImg } from "./imageCrop";
import { useGetProfileQuery } from "@/shared/hooks/useUser";
import { MultiplePresignedUrls, SinglePresignedUrl, uploadFileToS3 } from "@/shared/api/uploads";

type MarkType = "image" | "emoji";
type VisibilityType = "FRIENDS" | "PRIVATE";
type UploadItem = {
  uploadUrl: string;
  key: string;
};

//글자수 제한
const MAX_LENGTH = 500;
//이미지 제한
const MAX_IMAGES = 10;

export default function CreatePocketPost() {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [story, setStory] = useState("");
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [markType, setMarkType] = useState<MarkType>("emoji");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [markImage, setMarkImage] = useState<string | null>(null);
  const [savedMarkIsRound, setSavedMarkIsRound] = useState(true);
  const [visibility, setVisibility] = useState<VisibilityType>("FRIENDS");

  const [cropImage, setCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isRoundCrop, setIsRoundCrop] = useState(true);

  const { mutate: createPost } = useCreatePostMutation();

  //사용자 정보 조회
  const { data: profileData } = useGetProfileQuery();
  useEffect(() => {
    if (!profileData?.userId) {
      return;
    }
    if (profileData) {
      console.log("모달 정보 조회", profileData);
    }
  }, [profileData]);
  //디폴트 이모지
  const [selectedEmoji, setSelectedEmoji] = useState(profileData?.profileEmoji ?? "");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const markInputRef = useRef<HTMLInputElement>(null);

  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  const handleSubmit = async () => {
    if (!profileData?.userId) {
      setFormMessage("사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    if (story.length > MAX_LENGTH) {
      setFormMessage(`글자 수는 ${MAX_LENGTH}자를 초과할 수 없습니다.`);
      return;
    }

    if (!story.trim() && images.length === 0) {
      setFormMessage("내용 또는 사진을 최소 하나 이상 포함해야 합니다.");
      return;
    }

    setFormMessage(null);

    try {
      let markerKey = undefined;
      let postImageKeys: string[] = [];

      if (markType === "image" && markImage) {
        const blob = dataURLtoBlob(markImage);
        const singleRes = await SinglePresignedUrl(profileData.userId, {
          uploadType: "TEMP_POST_MARKER",
          contentType: blob.type,
          fileExtension: blob.type.split("/")[1],
          fileSize: blob.size,
        });

        if (singleRes.uploadUrl) {
          await uploadFileToS3(singleRes.uploadUrl, blob);
          markerKey = singleRes.key;
        }
      }

      if (images.length > 0) {
        const multipleRes = await MultiplePresignedUrls(profileData.userId, {
          uploadType: "TEMP_POST_IMAGE",
          files: images.map((file, idx) => ({
            clientFileId: `file-${idx}`,
            contentType: file.type,
            fileExtension: file.name.split(".").pop() || "png",
            fileSize: file.size,
          })),
        });

        if (multipleRes.uploads) {
          //S3에 업로드
          await Promise.all(
            multipleRes.uploads.map((u: UploadItem, idx: number) =>
              uploadFileToS3(u.uploadUrl, images[idx]),
            ),
          );
          //key 추출
          postImageKeys = multipleRes.uploads.map((u: UploadItem) => u.key);
        }
      }

      createPost(
        {
          content: story || undefined,
          visibility,
          markerType: markType === "emoji" ? "EMOJI" : "IMAGE",
          markerEmoji: markType === "emoji" ? selectedEmoji : undefined,
          markerImageKey: markerKey,
          imageKeys: postImageKeys,
        },
        {
          onSuccess: () => {
            navigate("/pocket");
          },
          onError: () => setFormMessage("포스트 생성 중 오류가 발생했습니다."),
        },
      );
    } catch (error) {
      console.error("Upload Error:", error);
      setFormMessage("이미지 처리 중 오류가 발생했습니다.");
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setSelectedEmoji(emojiData.emoji);
    setShowEmojiPicker(false);
    setMarkType("emoji");
    setSavedMarkIsRound(true);
  };

  const handleMarkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const saveCroppedImage = async () => {
    if (cropImage && croppedAreaPixels) {
      const croppedResult = await getCroppedImg(cropImage, croppedAreaPixels, isRoundCrop);
      setMarkImage(croppedResult);
      setSavedMarkIsRound(isRoundCrop);
      setMarkType("image");
      setCropImage(null);
    }
  };

  //공개 범위
  const toggleVisibility = () => {
    setVisibility((prev) => (prev === "FRIENDS" ? "PRIVATE" : "FRIENDS"));
  };

  //이미지 업로드
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > MAX_IMAGES) {
      setFormMessage(`사진은 최대 ${MAX_IMAGES}장까지 업로드 가능합니다.`);
      return;
    }

    setFormMessage(null);
    const newImages = [...images, ...files];
    setImages(newImages);

    //미리보기 URL 생성 및 추가
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Container>
      <HeaderSection>
        <Title>Create New Pocket Post</Title>
        <SubTitle>주머니 속 일상의 조각을 기록해보세요.</SubTitle>
      </HeaderSection>
      <Box>
        <MarkContainer>
          <SectionTitle>Bubble Icon</SectionTitle>
          <MarkSettings>
            <MarkPreview $isRound={markType === "image" ? savedMarkIsRound : true}>
              {markType === "image" && markImage ? (
                <img src={markImage} alt="mark" />
              ) : (
                <span className="emoji-display">{selectedEmoji}</span>
              )}
            </MarkPreview>
            <MarkButtons>
              <MarkBtn
                $active={markType === "emoji"}
                onClick={() => {
                  setMarkType("emoji");
                  setShowEmojiPicker(true);
                }}
              >
                <MarkIcon as={EmojiIcon} />
                Emoji Icon
              </MarkBtn>
              <MarkBtn $active={markType === "image"} onClick={() => markInputRef.current?.click()}>
                <MarkIcon as={ImageIcon} />
                Image Icon
              </MarkBtn>
            </MarkButtons>
            {showEmojiPicker && (
              <EmojiPickerWrapper>
                <div className="overlay" onClick={() => setShowEmojiPicker(false)} />
                <EmojiPicker onEmojiClick={onEmojiClick} autoFocusSearch={false} />
              </EmojiPickerWrapper>
            )}
            {cropImage && (
              <CropModal>
                <CropContainer>
                  <CropView>
                    <Cropper
                      image={cropImage}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape={isRoundCrop ? "round" : "rect"}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  </CropView>

                  <ControlBottom>
                    <ShapeButtons>
                      <ShapeBtn $active={isRoundCrop} onClick={() => setIsRoundCrop(true)}>
                        Circle
                      </ShapeBtn>
                      <ShapeBtn $active={!isRoundCrop} onClick={() => setIsRoundCrop(false)}>
                        Square
                      </ShapeBtn>
                    </ShapeButtons>

                    <ActionButtons>
                      <CancelBtn
                        onClick={() => {
                          setCropImage(null);
                          setIsRoundCrop(true);
                        }}
                      >
                        Cancel
                      </CancelBtn>
                      <SaveBtn onClick={saveCroppedImage}>Apply</SaveBtn>
                    </ActionButtons>
                  </ControlBottom>
                </CropContainer>
              </CropModal>
            )}
          </MarkSettings>

          <input
            type="file"
            ref={markInputRef}
            onChange={handleMarkImageUpload}
            accept="image/*"
            hidden
          />
        </MarkContainer>
      </Box>

      <Box>
        <SubContainer>
          <SectionTitle>POCKET IMAGE</SectionTitle>

          <VisibilityToggle>
            <ToggleLabel $active={visibility === "FRIENDS"}>Friends</ToggleLabel>
            <ToggleSwitch onClick={toggleVisibility} $active={visibility === "PRIVATE"}>
              <ToggleHandle $active={visibility === "PRIVATE"} />
            </ToggleSwitch>
            <ToggleLabel $active={visibility === "PRIVATE"}>Private</ToggleLabel>
          </VisibilityToggle>
        </SubContainer>

        <UploadBoxContainer>
          {previewUrls.length > 0 ? (
            <PreviewGrid>
              {previewUrls.map((url, index) => (
                <PreviewItem key={index}>
                  <PreviewImage src={url} alt={`preview-${index}`} />
                  <DeleteBtn onClick={() => removeImage(index)}>×</DeleteBtn>
                </PreviewItem>
              ))}

              {previewUrls.length < MAX_IMAGES && (
                <AddMoreBtn onClick={() => fileInputRef.current?.click()}>
                  <UploadIcon as={ImageUploadIcon}></UploadIcon>
                  <span>Add More</span>
                </AddMoreBtn>
              )}
            </PreviewGrid>
          ) : (
            <UploadBox onClick={() => fileInputRef.current?.click()} $hasImage={false}>
              <UploadIcon as={ImageUploadIcon}></UploadIcon>
              <UploadText>Upload photos (Max 10)</UploadText>
              <UploadSub>Drag and drop or click to browse files</UploadSub>
            </UploadBox>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            hidden
          />
        </UploadBoxContainer>
      </Box>

      <Box>
        <SectionTitle>POCKET STORY</SectionTitle>
        <LengthCount $isMax={story.length >= MAX_LENGTH}>
          {story.length} / {MAX_LENGTH}
        </LengthCount>
        <StoryBox
          $hasError={story.length > MAX_LENGTH}
          placeholder="Tell the story behind this pocket..."
          value={story}
          onChange={(e) => {
            setStory(e.target.value);
            if (formMessage) {
              setFormMessage(null);
            }
          }}
        />
      </Box>
      {formMessage && <FormMessage>{formMessage}</FormMessage>}
      <PublishBtn onClick={handleSubmit}>Publish to Pocket</PublishBtn>
    </Container>
  );
}

const Container = styled.div`
  width: min(100%, 1000px);
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.md} 0 ${({ theme }) => theme.space.xxxl};
`;

const Box = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border: 2px dashed ${({ theme }) => theme.colors.border3};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: clamp(18px, 3vw, 25px);
  margin-bottom: 40px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  box-sizing: border-box;
`;

const HeaderSection = styled.div`
  margin-bottom: clamp(32px, 6vw, 50px);
  text-align: left;

  @media (max-width: 768px) {
    margin-bottom: 32px;
    padding-left: 0;
  }
`;

const FormMessage = styled.div`
  margin: 0 0 20px;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid rgba(255, 107, 107, 0.35);
  background: #fff5f5;
  color: #e03131;
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 600;
`;

const Title = styled.h1`
  font-size: clamp(28px, 7vw, 36px);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text_primary};
  margin-bottom: 8px;
`;

const SubTitle = styled.p`
  color: ${({ theme }) => theme.colors.text_secondary};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

//Bubble Icon
const MarkContainer = styled.div``;

const MarkSettings = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 2px dashed ${({ theme }) => theme.colors.border};
  margin-top: 25px;
  gap: clamp(16px, 4vw, 30px);
  position: relative;
  padding: ${({ theme }) => theme.space.xl};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }
`;

const MarkPreview = styled.div<{ $isRound: boolean }>`
  width: 100px;
  height: 100px;
  border-radius: ${(props) => (props.$isRound ? props.theme.radii.round : "0")};
  background: ${({ theme }) => theme.colors.surface};
  border: 3px solid ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  transition: border-radius ${({ theme }) => `${theme.motion.base} ${theme.motion.easing}`};

  .emoji-display {
    font-size: 50px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MarkButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-start;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const MarkBtn = styled.button<{ $active: boolean }>`
  width: 160px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid
    ${(props) => (props.$active ? props.theme.colors.primary : props.theme.colors.border)};
  cursor: pointer;

  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 500;
  line-height: 1;
  transition: all ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};
  background: ${(props) => (props.$active ? "#f0f7ff" : props.theme.colors.surface)};
  color: ${(props) => (props.$active ? "#6f95b5" : "#4b5563")};

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const MarkIcon = styled.div`
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
`;

const EmojiPickerWrapper = styled.div`
  position: absolute;
  top: 60px;
  left: 130px;
  z-index: 100;
  box-shadow: ${({ theme }) => theme.shadows.md};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;

  @media (max-width: 768px) {
    left: 0;
    top: 120px;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
`;

const CropModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.overlay};
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const CropContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  width: 580px;
  max-width: 100%;
  max-height: 90vh;
  padding: 30px;
  border-radius: ${({ theme }) => theme.radii.lg};
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const CropView = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  background: #333;
  border-radius: ${({ theme }) => theme.radii.xs};
  overflow: hidden;
  flex-shrink: 0;

  @media (max-width: 480px) {
    height: 280px;
  }
`;

const ControlBottom = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.space.md};
  margin-top: ${({ theme }) => theme.space.xl};
  padding: ${({ theme }) => theme.space.md};
  background: #f1f3f5;
  border-radius: ${({ theme }) => theme.radii.xs};

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ShapeButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ShapeBtn = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 700;
  background: ${(props) => (props.$active ? props.theme.colors.primary : "white")};
  color: ${(props) => (props.$active ? "white" : props.theme.colors.text_primary)};
  border: 1px solid
    ${(props) => (props.$active ? props.theme.colors.primary : props.theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.xl};
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};
  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: flex-end;
  border-top: 1px solid #eee;
  padding-top: 15px;

  @media (max-width: 480px) {
    justify-content: stretch;
  }
`;

const CancelBtn = styled.button`
  background: #adb5bd;
  color: white;
  padding: 10px 24px;
  border-radius: ${({ theme }) => theme.radii.xs};
  border: none;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #868e96;
  }
`;

const SaveBtn = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 10px 24px;
  border-radius: ${({ theme }) => theme.radii.xs};
  border: none;
  font-weight: bold;
  cursor: pointer;
`;

//Pocket Image
const SubContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const VisibilityToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ToggleLabel = styled.span<{ $active: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 700;
  color: ${(props) => (props.$active ? props.theme.colors.text_primary : "#adb5bd")};
  transition: color ${({ theme }) => theme.motion.base} ${({ theme }) => theme.motion.easing};
`;

const ToggleSwitch = styled.div<{ $active: boolean }>`
  width: 50px;
  height: 26px;
  background-color: ${(props) => (props.$active ? props.theme.colors.primary : "#e5e7eb")};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 3px;
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.base} ${({ theme }) => theme.motion.easing};
  position: relative;
  display: flex;
  align-items: center;
`;

const ToggleHandle = styled.div<{ $active: boolean }>`
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.round};
  box-shadow: ${({ theme }) => theme.shadows.xs};
  transition: all ${({ theme }) => theme.motion.base} ${({ theme }) => theme.motion.easing};
  transform: ${(props) => (props.$active ? "translateX(24px)" : "translateX(0)")};
`;

const UploadBoxContainer = styled.div`
  width: 100%;
  height: 400px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 2px dashed ${({ theme }) => theme.colors.border};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    height: 320px;
  }
`;

const UploadBox = styled.div<{ $hasImage: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
`;

const PreviewGrid = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: ${({ theme }) => theme.space.xl};
  padding: ${({ theme }) => theme.space.xl};
  overflow-x: auto; /* 가로 스크롤 가능하게 */
  align-items: center;

  /* 스크롤바 디자인 (선택사항) */
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 10px;
  }
`;

const PreviewItem = styled.div`
  position: relative;
  flex: 0 0 350px;
  height: 300px;
  background: #eee;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: 480px) {
    flex-basis: 240px;
    height: 220px;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  padding: 7px;
  object-fit: contain;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px dashed ${({ theme }) => theme.colors.border3};
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 7px;
  right: 7px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.round};
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const AddMoreBtn = styled.div`
  flex: 0 0 200px;
  height: 300px;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #adb5bd;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.surface};
  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }

  @media (max-width: 480px) {
    flex-basis: 160px;
    height: 220px;
  }
`;

const UploadIcon = styled.div`
  color: currentColor;
`;

const UploadText = styled.div`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 600;
  color: #374151;
  margin-top: 12px;
`;

const UploadSub = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: #9ca3af;
  margin-top: 4px;
`;

//Pocket Story
const LengthCount = styled.span<{ $isMax: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.xs};
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${(props) => (props.$isMax ? "#ff4d4d" : props.theme.colors.text_secondary)};
  font-weight: ${(props) => (props.$isMax ? "700" : "400")};
`;

const StoryBox = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  height: 300px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${(props) => (props.$hasError ? "#ff6b6b" : props.theme.colors.border)};
  padding: 20px;
  margin-top: 5px;
  font-size: 17px;
  line-height: 1.8;
  resize: none;
  outline: none;
  box-sizing: border-box;
  &:focus {
    border-color: ${(props) => (props.$hasError ? "#ff6b6b" : props.theme.colors.border3)};
    box-shadow: ${(props) =>
      props.$hasError ? "0 0 0 3px rgba(255, 107, 107, 0.1)" : props.theme.shadows.xs};
  }

  @media (max-width: 480px) {
    height: 240px;
    padding: 16px;
    font-size: 15px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.text_primary};
  text-transform: uppercase;
  margin: 0 0 ${({ theme }) => theme.space.sm};
`;

const PublishBtn = styled(StitchedBox)`
  width: 100%;
  height: 60px;
  margin: 20px 0;

  color: white;
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: bold;

  border-radius: ${({ theme }) => theme.radii.lg};

  cursor: pointer;
  transition: transform ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:active {
    transform: scale(0.98);
  }
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
`;
