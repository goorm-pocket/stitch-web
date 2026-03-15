import { useState, useRef } from "react";
import styled from "styled-components";
import { StitchedBox } from "../../shared/ui/StitchedBox";
import ImageUploadIcon from "../../assets/upload-icon.svg";
import ImageIcon from "../../assets/Image-icon.svg";
import EmojiIcon from "../../assets/Emoji-icon.svg";

// 타입 정의: 선택 가능한 디스플레이 타입
type DisplayType = "image" | "emoji";

export default function CreatePocketPost() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 이미지 미리보기 추가
  const [story, setStory] = useState("");
  const [displayType, setDisplayType] = useState<DisplayType>("image");

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("story", story);
    formData.append("displayType", displayType);

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
        <SectionTitle>POCKET IMAGE</SectionTitle>

        {/* 이미지 업로드 영역: 클릭 시 input 트리거 */}
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
  max-width: 900px;
  margin: 0 auto;
  padding: 40px;
`;

const HeaderSection = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_primary};
  margin-bottom: 8px;
`;

const SubTitle = styled.p`
  color: ${({ theme }) => theme.colors.text_secondary};
  font-size: 16px;
  margin-bottom: 30px;
`;

const Card = styled.section`
  background: #ffffff;
  border: 2px dashed ${({ theme }) => theme.colors.border3};
  border-radius: 14px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.text_primary};
  margin-bottom: 20px;
  text-transform: uppercase;
`;

const UploadBox = styled.div<{ hasImage: boolean }>`
  border: 2px dashed ${(props) => (props.hasImage ? "transparent" : "#d1d5db")};
  border-radius: 16px;
  padding: ${(props) => (props.hasImage ? "0" : "40px 20px")};
  text-align: center;
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
  height: 250px;
  object-fit: cover;
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
`;

const PreIcon = styled.div`
  margin-right: 5px;
  color: currentColor;
`;

// transient prop ($) 사용으로 DOM에 active 속성이 전달되지 않도록 함
const PrefButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid ${(props) => (props.$active ? props.theme.colors.primary : "#e5e7eb")};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  background: ${(props) => (props.$active ? "#f0f7ff" : props.theme.colors.background)};
  color: ${(props) => (props.$active ? "#6f95b5" : "#4b5563")};

  &:hover {
    background: #f9fafb;
  }
`;

const StoryBox = styled.textarea`
  width: 100%;
  height: 150px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 10px;
  border: 1px solid #dfe5ec;
  padding: 15px;
  font-size: 15px;
  line-height: 1.6;
  resize: none;
  outline: none;
  &:focus {
    border-color: #6f95b5;
  }
`;

const PublishButton = styled(StitchedBox)`
  width: 100%;
  padding: 18px;

  color: white;
  font-size: 18px;
  font-weight: bold;

  border-radius: 16px;
  border: none;

  cursor: pointer;
  transition: transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  &:active {
    transform: scale(0.98);
  }
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
`;
