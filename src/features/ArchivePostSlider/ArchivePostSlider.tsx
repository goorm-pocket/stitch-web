import { useMemo, useRef } from "react";
import styled from "styled-components";
import PostForm from "../PostForm/PostForm";
import type { Post } from "../../shared/types/post.type";

interface ArchivePostSliderProps {
  open: boolean;
  selectedDate: string | null;
  posts: Post[];
  onClose: () => void;
  onPostClick: (postId: string) => void;
}

const ArchivePostSlider = ({
  open,
  selectedDate,
  posts,
  onClose,
  onPostClick,
}: ArchivePostSliderProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const title = useMemo(() => {
    if (!selectedDate) return "";
    return `${selectedDate}`;
  }, [selectedDate]);

  const handlePrev = () => {
    if (!trackRef.current) return;

    const track = trackRef.current;
    const firstSlide = track.firstElementChild as HTMLDivElement | null;
    if (!firstSlide) return;

    const gap = 20;
    const slideWidth = firstSlide.getBoundingClientRect().width + gap;

    track.scrollBy({ left: -slideWidth, behavior: "smooth" });
  };

  const handleNext = () => {
    if (!trackRef.current) return;

    const track = trackRef.current;
    const firstSlide = track.firstElementChild as HTMLDivElement | null;
    if (!firstSlide) return;

    const gap = 20;
    const slideWidth = firstSlide.getBoundingClientRect().width + gap;

    track.scrollBy({ left: slideWidth, behavior: "smooth" });
  };

  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{title}</Title>

          <HeaderRight>
            {posts.length > 1 && (
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

        {posts.length === 0 ? (
          <EmptyBox>
            <EmptyTitle>No posts for this date</EmptyTitle>
            <EmptyText>해당 날짜에 작성된 게시글이 없습니다.</EmptyText>
          </EmptyBox>
        ) : (
          <Track ref={trackRef}>
            {posts.map((post) => (
              <Slide key={post.post_id}>
                <PostCard
                  type="button"
                  onClick={() => onPostClick(post.post_id)}
                  aria-label={`Open post ${post.post_id}`}
                >
                  <PostForm post={post} />
                </PostCard>
              </Slide>
            ))}
          </Track>
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
  height: min(78vh, 760px);
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

const Track = styled.div`
  flex: 1;
  display: flex;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;

  padding-block: 24px;
  padding-inline: max(24px, calc((100% - 820px) / 2));

  scroll-snap-type: x mandatory;
  scroll-snap-stop: always;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.sub};
    border-radius: 999px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const Slide = styled.div`
  flex: 0 0 min(820px, calc(100vw - 96px));
  scroll-snap-align: center;
  display: flex;
`;

const PostCard = styled.button`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
  text-align: left;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: ${({ theme }) => theme.colors.hover};
    border-color: ${({ theme }) => theme.colors.sub};
  }

  &:active {
    transform: translateY(0);
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
