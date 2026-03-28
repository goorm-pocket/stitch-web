import styled from "styled-components";
import type { PocketBubbleType } from "../../../shared/types/post.type";

type PocketBubbleProps = {
  item: PocketBubbleType;
  size: number;
  x: number;
  y: number;
  angle: number;
  onPointerDown: (id: string, e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (id: string, e: React.PointerEvent<HTMLDivElement>) => void;
};

const PocketBubble = ({
  item,
  size,
  x,
  y,
  angle,
  onPointerDown,
  onPointerUp,
}: PocketBubbleProps) => {
  const { postId, representative, read, ownerType } = item;
  const hasImage = representative.type === "IMAGE";

  return (
    <Container
      $read={read}
      $ownerType={ownerType}
      $hasImage={hasImage}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(${x - size / 2}px, ${y - size / 2}px) rotate(${angle}rad)`,
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

export default PocketBubble;

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
  border: ${({ $hasImage, theme, $read, $ownerType }) => {
    if ($hasImage) return "none";
    const color = !$read
      ? theme.colors.primary
      : $ownerType === "ME"
        ? theme.colors.sub
        : theme.colors.border;
    return `2px solid ${color}`;
  }};
  box-shadow: ${({ $hasImage }) => ($hasImage ? "none" : "0 4px 12px rgba(0, 0, 0, 0.12)")};

  &:active {
    cursor: grabbing;
  }
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
  font-size: clamp(20px, 7vw, 50px);
  pointer-events: none;
  user-select: none;
`;
