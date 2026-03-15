import { useState, useRef } from "react";
import styled from "styled-components";
import { StitchedBox } from "../../shared/ui/StitchedBox";
import ImageUploadIcon from "../../assets/upload-icon.svg";
import ImageIcon from "../../assets/Image-icon.svg";
import EmojiIcon from "../../assets/Emoji-icon.svg";

type DisplayType = "image" | "emoji";
type VisibilityType = "FRIENDS" | "PRIVATE";

export default function CreatePocketPost() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 이미지 미리보기 추가
  const [story, setStory] = useState("");
  const [displayType, setDisplayType] = useState<DisplayType>("image");

  const fileInputRef = useRef<HTMLInputElement>(null);

  //공개 범위 설정
  const [visibility, setVisibility] = useState<VisibilityType>("FRIENDS");

  //글자수 제한
  const MAX_LENGTH = 500;

  //공개 범위 선택 토글
  const toggleVisibility = () => {
    setVisibility((prev) => (prev === "FRIENDS" ? "PRIVATE" : "FRIENDS"));
  };

  // 이미지 선택 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);

    // 미리보기 URL 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (story.length > MAX_LENGTH) {
      alert("글자 수는 500자를 초과할 수 없습니다.");
      return;
    }

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("story", story);
    formData.append("displayType", displayType);
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

        <UploadBox onClick={() => fileInputRef.current?.click()} hasImage={!!previewUrl}>
          {previewUrl ? (
            <PreviewImage src={previewUrl} alt="Preview" />
          ) : (
            <>
              <UploadIcon as={ImageUploadIcon}></UploadIcon>
              <UploadText>Upload high-res photo</UploadText>
              <UploadSub>Drag and drop or click to browse files</UploadSub>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            hidden
          />
        </UploadBox>

        <Preference>
          <PrefLabel>Bubble Icon</PrefLabel>
          <PrefButtons>
            <PrefButton $active={displayType === "image"} onClick={() => setDisplayType("image")}>
              <PreIcon as={ImageIcon} />
              Image Icon
            </PrefButton>
            <PrefButton $active={displayType === "emoji"} onClick={() => setDisplayType("emoji")}>
              <PreIcon as={EmojiIcon} />
              Emoji Icon
            </PrefButton>
          </PrefButtons>
        </Preference>
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
  margin-bottom: 20px;
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
  margin-bottom: 30px;
`;

const Card = styled.section`
  width: 100%;
  background: #ffffff;
  border: 2px dashed ${({ theme }) => theme.colors.border3};
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 50px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.text_primary};
  margin-bottom: 15px;
  text-transform: uppercase;
`;

const UploadBox = styled.div<{ hasImage: boolean }>`
  width: 100%;
  height: ${(props) => (props.hasImage ? "auto" : "450px")};
  border: 2px dashed ${(props) => (props.hasImage ? "transparent" : "#d1d5db")};
  border-radius: 16px;
  min-height: ${(props) => (props.hasImage ? "auto" : "250px")};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  background: #f9fafb;

  &:hover {
    border-color: #9fb6cc;
    background: #f3f4f6;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 600px;
  object-fit: fit;
  display: block;
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

const Preference = styled.div`
  margin-top: 24px;
`;
const PrefLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
`;

const PrefButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-start;
`;

const PreIcon = styled.div`
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
`;

// transient prop ($) 사용으로 DOM에 active 속성이 전달되지 않도록 함
const PrefButton = styled.button<{ $active: boolean }>`
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
