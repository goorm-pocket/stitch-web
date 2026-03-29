import styled from "styled-components";
import type { PocketBubbleType } from "../../../shared/types/post.type";

type PocketBubbleProps = {
  item: PocketBubbleType;
  size: number;
  x: number;
  y: number;
  angle: number;
  onMouseDown: (id: string, e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: (id: string, e: React.MouseEvent<HTMLDivElement>) => void;
};

const PocketBubble = ({
  item,
  size,
  x,
  y,
  angle,
  onMouseDown,
  onMouseUp,
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
      onMouseDown={(e) => onMouseDown(postId, e)}
      onMouseUp={(e) => onMouseUp(postId, e)}
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
  border-radius: ${({ $hasImage, theme }) => ($hasImage ? "0" : theme.radii.round)};
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
  box-shadow: ${({ $hasImage, theme }) => ($hasImage ? "none" : theme.shadows.sm)};
  transition:
    box-shadow ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing},
    transform ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};

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
