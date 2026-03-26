import { useRef, useState } from "react";
import styled from "styled-components";
import PocketBubble from "./components/PocketBubble";
import { useReadBoardPostMutation } from "../../shared/hooks/useBoard";
import PostModal from "../PostModal/PostModal";
import { usePocketSize } from "./hooks/usePocketSize";
import { usePocketMatter } from "./hooks/usePocketMatter";
import type { PocketBubbleType } from "@/shared/types/post.type";
import { useNavigate } from "react-router";

interface PocketProps {
  board?: { items: PocketBubbleType[] };
}

const Pocket = ({ board }: PocketProps) => {
  const navigate = useNavigate();
  // Ref
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const clickStartRef = useRef<{
    id: string | null;
    x: number;
    y: number;
  }>({
    id: null,
    x: 0,
    y: 0,
  });

  // state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // mutate
  const { mutateAsync: readBoardPost } = useReadBoardPostMutation();

  const size = usePocketSize(wrapperRef);

  const items = board?.items ?? [];

  const itemSize = Math.max(size.width * 0.15, 50);
  const wallThickness = 20;

  const positions = usePocketMatter({
    sceneRef,
    items,
    width: size.width,
    height: size.height,
    itemSize,
    wallThickness,
  });

  const handleClickPost = async (id: string) => {
    if (!id) return;
    await readBoardPost({ postId: id });
    setSelectedPostId(id);
    setIsModalOpen(true);
  };

  const handleMouseDown = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    clickStartRef.current = {
      id,
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handleMouseUp = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const start = clickStartRef.current;
    if (start.id !== id) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 8) {
      handleClickPost(id);
    }

    clickStartRef.current = { id: null, x: 0, y: 0 };
  };

  const handlePostClick = (postId: string) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <Container>
      <PocketWrapper ref={wrapperRef}>
        <PocketArea
          ref={sceneRef}
          style={{
            height: size.height ? `${size.height}px` : undefined,
          }}
        >
          {items.map((item) => {
            const pos = positions[item.postId];
            if (!pos) return null;

            return (
              <PocketBubble
                key={item.postId}
                item={item}
                size={itemSize}
                x={pos.x}
                y={pos.y}
                angle={pos.angle}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
              />
            );
          })}
        </PocketArea>
      </PocketWrapper>
      {isModalOpen && selectedPostId && (
        <PostModal
          onClose={() => setIsModalOpen(false)}
          postId={selectedPostId}
          onPostClick={() => handlePostClick(selectedPostId)}
        />
      )}
    </Container>
  );
};

export default Pocket;

const Container = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 24px 16px 40px;
  }

  @media (max-width: 480px) {
    padding: 20px 12px 36px;
  }
`;

const PocketArea = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.primary};
  border-top: 6px solid ${({ theme }) => theme.colors.sub};
  border-bottom-left-radius: 56px;
  border-bottom-right-radius: 56px;

  @media (max-width: 768px) {
    border-bottom-left-radius: 46px;
    border-bottom-right-radius: 46px;
  }

  @media (max-width: 480px) {
    border-top-width: 5px;
    border-bottom-left-radius: 36px;
    border-bottom-right-radius: 36px;
  }

  &::before {
    content: "";
    position: absolute;
    inset: 8px;
    top: 0;
    border: 1px dashed ${({ theme }) => theme.colors.sub};
    border-top: none;
    border-bottom-left-radius: 56px;
    border-bottom-right-radius: 56px;
    pointer-events: none;

    @media (max-width: 768px) {
      border-bottom-left-radius: 46px;
      border-bottom-right-radius: 46px;
    }

    @media (max-width: 480px) {
      border-top-width: 5px;
      border-bottom-left-radius: 36px;
      border-bottom-right-radius: 36px;
    }
  }
`;

const PocketWrapper = styled.div`
  width: min(100%, 600px);
`;
