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

  return (
    <Container
      $read={read}
      $ownerType={ownerType}
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
}>`
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50%;
  overflow: hidden;
  background: white;
  user-select: none;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid
    ${({ theme, $read, $ownerType }) => {
      if (!$read) return theme.colors.primary;
      if ($ownerType === "ME") return theme.colors.sub;
      return theme.colors.border;
    }};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);

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
`;

const Emoji = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(20px, 3vw, 32px);
  line-height: 1;
  pointer-events: none;
  user-select: none;
`;
