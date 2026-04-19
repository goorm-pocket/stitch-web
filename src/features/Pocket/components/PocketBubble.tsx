import { memo } from "react";
import styled from "styled-components";
import type { PocketBubbleType } from "../../../shared/types/post.type";

type PocketBubbleProps = {
  item: PocketBubbleType;
  size: number;
  registerElement: (postId: string, element: HTMLDivElement | null) => void;
  onPointerDown: (id: string, e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (id: string, e: React.PointerEvent<HTMLDivElement>) => void;
};

const PocketBubble = ({
  item,
  size,
  registerElement,
  onPointerDown,
  onPointerUp,
}: PocketBubbleProps) => {
  const { postId, representative, read, ownerType } = item;
  const hasImage = representative.type === "IMAGE";

  return (
    <Container
      ref={(element) => registerElement(postId, element)}
      $read={read}
      $ownerType={ownerType}
      $hasImage={hasImage}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        visibility: "hidden",
      }}
      onPointerDown={(e) => onPointerDown(postId, e)}
      onPointerUp={(e) => onPointerUp(postId, e)}
    >
      {representative.type === "IMAGE" ? (
        <BubbleImage src={representative.value} alt={`bubble-${postId}`} draggable={false} />
      ) : (
        <Emoji>{representative.value}</Emoji>
      )}
    </Container>
  );
};

export default memo(
  PocketBubble,
  (prev, next) => prev.item === next.item && prev.size === next.size,
);

const Container = styled.div<{
  $read: boolean;
  $ownerType: "ME" | "FRIEND";
  $hasImage: boolean;
}>`
  position: absolute;
  left: 0;
  top: 0;
  border-radius: ${({ $hasImage }) => ($hasImage ? "0" : "50%")};
  overflow: ${({ $hasImage }) => ($hasImage ? "visible" : "hidden")};
  background: ${({ $hasImage }) => ($hasImage ? "transparent" : "white")};
  user-select: none;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ $hasImage, theme }) => ($hasImage ? "none" : theme.shadows.sm)};
  &:active {
    cursor: grabbing;
  }
  filter: ${({ $read }) => ($read ? "grayscale(100%)" : "none")};
  opacity: ${({ $read }) => ($read ? 0.6 : 1)};
`;

const BubbleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
`;

const Emoji = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(20px, 8vw, 60px);
  pointer-events: none;
  user-select: none;
`;
