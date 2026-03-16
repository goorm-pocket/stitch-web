import { useState, useRef } from "react";
import styled from "styled-components";
import { StitchedBox } from "../../shared/ui/StitchedBox";
import ImageUploadIcon from "../../assets/upload-icon.svg";
import ImageIcon from "../../assets/Image-icon.svg";
import EmojiIcon from "../../assets/Emoji-icon.svg";
import EmojiPicker from "emoji-picker-react";
import { Theme, type EmojiClickData } from "emoji-picker-react";

type MarkType = "image" | "emoji";
type VisibilityType = "FRIENDS" | "PRIVATE";

//글자수 제한
const MAX_LENGTH = 500;
//이미지 제한
const MAX_IMAGES = 10;

export default function CreatePocketPost() {
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [story, setStory] = useState("");
  const [markType, setMarkType] = useState<MarkType>("emoji");
  const [selectedEmoji, setSelectedEmoji] = useState("📍"); //나중에 디폴트 이모지 넣기
  const [markImage, setMarkImage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [visibility, setVisibility] = useState<VisibilityType>("FRIENDS");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const markInputRef = useRef<HTMLInputElement>(null);

  // 이모지 선택 핸들러
  const onEmojiClick = (emojiData: EmojiClickData) => {
    setSelectedEmoji(emojiData.emoji);
    setShowEmojiPicker(false);
    setMarkType("emoji");
  };

  // 버블 전용 이미지 업로드
  const handleMarkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setMarkImage(reader.result as string);
      setMarkType("image");

      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  //공개 범위 선택 토글
  const toggleVisibility = () => {
    setVisibility((prev) => (prev === "FRIENDS" ? "PRIVATE" : "FRIENDS"));
  };

  //이미지 선택
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > MAX_IMAGES) {
      alert(`사진은 최대 ${MAX_IMAGES}장까지 업로드 가능합니다.`);
      return;
    }

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

  //이미지 삭제 기능
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (story.length > MAX_LENGTH) {
      alert("글자 수는 500자를 초과할 수 없습니다.");
      return;
    }

    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));
    formData.append("story", story);
    formData.append("markType", markType);
    formData.append("visibility", visibility);

    // TODO: 서버 전송 로직 (fetch/axios)
    console.log("전송 데이터:", Object.fromEntries(formData));
    alert("성공적으로 발행되었습니다!");
  };

  return (
    <Container>
      <HeaderSection>
        <Title>Create New Pocket Post</Title>
        <SubTitle>주머니 속 일상의 조각을 기록해보세요.</SubTitle>
      </HeaderSection>
      <Card>
        <MarkContainer>
          <SectionTitle>Bubble Icon</SectionTitle>
          <MarkSettingArea>
            <MarkPreviewCircle>
              {markType === "image" && markImage ? (
                <img src={markImage} alt="mark" />
              ) : (
                <span className="emoji-display">{selectedEmoji}</span>
              )}
            </MarkPreviewCircle>
            <MarkButtons>
              <MarkButton
                $active={markType === "emoji"}
                onClick={() => {
                  setMarkType("emoji");
                  setShowEmojiPicker(true);
                }}
              >
                <MarkIcon as={EmojiIcon} />
                Emoji Icon
              </MarkButton>
              <MarkButton
                $active={markType === "image"}
                onClick={() => {
                  setMarkType("image");
                  markInputRef.current?.click();
                }}
              >
                <MarkIcon as={ImageIcon} />
                Image Icon
              </MarkButton>
            </MarkButtons>
            {showEmojiPicker && (
              <EmojiPickerWrapper>
                <div className="overlay" onClick={() => setShowEmojiPicker(false)} />
                <EmojiPicker onEmojiClick={onEmojiClick} autoFocusSearch={false} />
              </EmojiPickerWrapper>
            )}
          </MarkSettingArea>

          <input
            type="file"
            ref={markInputRef}
            onChange={handleMarkImageUpload}
            accept="image/*"
            hidden
          />
        </MarkContainer>
      </Card>

      <Card>
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
                  <DeleteButton onClick={() => removeImage(index)}>×</DeleteButton>
                </PreviewItem>
              ))}

              {previewUrls.length < MAX_IMAGES && (
                <AddMoreButton onClick={() => fileInputRef.current?.click()}>
                  <UploadIcon as={ImageUploadIcon}></UploadIcon>
                  <span>Add More</span>
                </AddMoreButton>
              )}
            </PreviewGrid>
          ) : (
            <UploadBox onClick={() => fileInputRef.current?.click()} hasImage={false}>
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
      </Card>

      <Card>
        <SectionTitle>POCKET STORY</SectionTitle>
        <LengthCount isMax={story.length >= MAX_LENGTH}>
          {story.length} / {MAX_LENGTH}
        </LengthCount>
        <StoryBox
          placeholder="Tell the story behind this pocket..."
          value={story}
          onChange={(e) => setStory(e.target.value)}
        />
      </Card>

      <PublishButton onClick={handleSubmit}>Publish to Pocket</PublishButton>
    </Container>
  );
}

const MarkSettingArea = styled.div`
  display: flex;
  align-items: center;
  background: #f9fafb;
  border-radius: 16px;
  border: 2px dashed #d1d5db;
  margin-top: 25px;
  gap: 30px;
  position: relative;
  background: ${({ theme }) => theme.colors.background};
  padding: 20px;
  border-radius: 12px;
`;

const MarkPreviewCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: white;
  border: 3px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .emoji-display {
    font-size: 50px;
  }
`;

const EmojiPickerWrapper = styled.div`
  position: absolute;
  top: 60px;
  left: 130px;
  z-index: 100;

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
`;

const Container = styled.div`
  width: 1000px;
  margin: 0 auto;
  padding: 10px 0px;
`;

const HeaderSection = styled.div`
  margin-bottom: 50px;
  padding-left: 10px;
  text-align: left;
`;

const SubContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const VisibilityToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ToggleLabel = styled.span<{ $active: boolean }>`
  font-size: 13px;
  font-weight: 700;
  color: ${(props) => (props.$active ? props.theme.colors.text_primary : "#adb5bd")};
  transition: color 0.3s ease;
`;

const ToggleSwitch = styled.div<{ $active: boolean }>`
  width: 50px;
  height: 26px;
  background-color: ${(props) => (props.$active ? props.theme.colors.primary : "#e5e7eb")};
  border-radius: 20px;
  padding: 3px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
`;

const ToggleHandle = styled.div<{ $active: boolean }>`
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${(props) => (props.$active ? "translateX(24px)" : "translateX(0)")};
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text_primary};
  margin-bottom: 8px;
`;

const SubTitle = styled.p`
  color: ${({ theme }) => theme.colors.text_secondary};
  font-size: 16px;
`;

const Card = styled.section`
  width: 100%;
  background: #ffffff;
  border: 2px dashed ${({ theme }) => theme.colors.border3};
  border-radius: 16px;
  padding: 20px 25px 25px 25px;
  margin-bottom: 50px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.text_primary};
  text-transform: uppercase;
`;

const UploadBoxContainer = styled.div`
  width: 100%;
  height: 400px; /* 섹션 전체 높이 고정 */
  background: #f9fafb;
  border-radius: 16px;
  border: 2px dashed #d1d5db;
  overflow: hidden; /* 내부 요소가 넘치면 가림 */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UploadBox = styled.div<{ hasImage: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background: #f3f4f6;
  }
`;

const PreviewGrid = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 20px;
  padding: 20px;
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
  flex: 0 0 350px; /* 미리보기 사진의 가로 크기 크게 고정 */
  height: 300px;
  background: #eee;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  padding: 7px;
  object-fit: contain;
  border-radius: 12px;
  border: 1px dashed ${({ theme }) => theme.colors.border3};
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 7px;
  right: 7px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
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

const AddMoreButton = styled.div`
  flex: 0 0 200px;
  height: 300px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #adb5bd;
  cursor: pointer;
  background: white;
  &:hover {
    background: #f3f4f6;
  }
`;

const UploadIcon = styled.div`
  color: currentColor;
`;
const UploadText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-top: 12px;
`;
const UploadSub = styled.div`
  font-size: 13px;
  color: #9ca3af;
  margin-top: 4px;
`;

const MarkContainer = styled.div``;

const MarkLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 20px;
`;

const MarkButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-start;
`;

const MarkIcon = styled.div`
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
`;

//transient prop ($) 사용으로 DOM에 active 속성이 전달되지 않도록 함
const MarkButton = styled.button<{ $active: boolean }>`
  width: 160px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 12px;
  border-radius: 12px;
  border: 1px solid ${(props) => (props.$active ? props.theme.colors.primary : "#e5e7eb")};
  cursor: pointer;

  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  transition: all 0.2s;
  background: ${(props) => (props.$active ? "#f0f7ff" : props.theme.colors.background)};
  color: ${(props) => (props.$active ? "#6f95b5" : "#4b5563")};

  &:hover {
    background: #f9fafb;
  }
`;

const LengthCount = styled.span<{ isMax: boolean }>`
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${(props) => (props.isMax ? "#ff4d4d" : props.theme.colors.text_secondary)};
  font-weight: ${(props) => (props.isMax ? "700" : "400")};
`;

const StoryBox = styled.textarea`
  width: 100%;
  height: 300px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 20px;
  margin-top: 5px;
  font-size: 17px;
  line-height: 1.8;
  resize: none;
  outline: none;
  box-sizing: border-box;
  &:focus {
    border-color: ${({ theme }) => theme.colors.border3};
  }
`;

const PublishButton = styled(StitchedBox)`
  width: 100%;
  height: 60px;
  margin: 20px 0;

  color: white;
  font-size: 18px;
  font-weight: bold;

  border-radius: 16px;

  cursor: pointer;
  transition: transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  &:active {
    transform: scale(0.9);
  }
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
`;
