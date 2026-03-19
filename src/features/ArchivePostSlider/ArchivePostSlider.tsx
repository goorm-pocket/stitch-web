import { useMemo, useState } from "react";
import styled from "styled-components";
import PostForm from "../PostForm/PostForm";
import { useGetPostByIdQuery } from "@/shared/hooks/usePost";

interface ArchivePostSliderProps {
  selectedDate: string | null;
  postIds: string[];
  onClose: () => void;
  onPostClick: (postId: string) => void;
}

const ArchivePostSlider = ({
  selectedDate,
  postIds,
  onClose,
  onPostClick,
}: ArchivePostSliderProps) => {
  const [currentIdx, setCurrendIdx] = useState<number>(0);
  const currentPostId = postIds[currentIdx];
  const { data: post } = useGetPostByIdQuery({ postId: currentPostId });
  console.log(post);

  const title = useMemo(() => {
    if (!selectedDate) return "";
    return `${selectedDate}`;
  }, [selectedDate]);

  const handlePrev = () => {
    const idx = currentIdx - 1 > 0 ? currentIdx - 1 : 0;
    setCurrendIdx(idx);
  };

  const handleNext = () => {
    const idx = currentIdx + 1 < postIds.length - 1 ? currentIdx + 1 : postIds.length - 1;
    setCurrendIdx(idx);
  };

  return (
    <Overlay onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{title}</Title>

          <HeaderRight>
            {postIds.length > 1 && (
              <ArrowGroup>
                <ArrowButton type="button" onClick={handlePrev}>
                  ‹
                </ArrowButton>
                <ArrowButton type="button" onClick={handleNext}>
                  ›
                </ArrowButton>
              </ArrowGroup>
            )}

            <CloseButton type="button" onClick={onClose}>
              ✕
            </CloseButton>
          </HeaderRight>
        </Header>
        {postIds.length === 0 ? (
          <EmptyBox>
            <EmptyTitle>No posts for this date</EmptyTitle>
            <EmptyText>해당 날짜에 작성된 게시글이 없습니다.</EmptyText>
          </EmptyBox>
        ) : (
          <SliderViewport>
            <PostCard onClick={() => onPostClick(currentPostId)}>
              {post && <PostForm post={post} />}
            </PostCard>
          </SliderViewport>
        )}
      </Panel>
    </Overlay>
  );
};

export default ArchivePostSlider;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px;
  background: rgba(71, 85, 105, 0.35);
  backdrop-filter: blur(6px);
`;

const Panel = styled.section`
  width: min(1100px, 100%);
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.header`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ArrowGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ArrowButton = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  background: white;
  color: ${({ theme }) => theme.colors.icon};
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  display: flex;
  align-items: center;
  justify-content: center;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
    border-color: ${({ theme }) => theme.colors.sub};
  }

  &:active {
    transform: scale(0.96);
  }
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;

  border: none;
  border-radius: 999px;

  background: ${({ theme }) => theme.colors.hover};
  color: ${({ theme }) => theme.colors.icon};

  font-size: 22px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.sub};
  }
`;

const SliderViewport = styled.div`
  /* flex: 1; */
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 16px;
  overflow: hidden;
`;

const PostCard = styled.div`
  width: min(720px, 100%);

  display: flex;
  flex-direction: column;

  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 24px;
  background: white;

  overflow: hidden;
  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    width: 100%;
    border-radius: 16px;
  }
`;

const EmptyBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
`;

const EmptyTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text_primary};
`;

const EmptyText = styled.p`
  margin: 0;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text_secondary};
`;
