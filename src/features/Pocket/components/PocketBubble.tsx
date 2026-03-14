import styled from "styled-components";

type PocketBubbleProps = {
  id: number;
  image: string;
  size: number;
  x: number;
  y: number;
  angle: number;
  onMouseDown: (id: number, e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: (id: number, e: React.MouseEvent<HTMLDivElement>) => void;
};

const PocketBubble = ({
  id,
  image,
  size,
  x,
  y,
  angle,
  onMouseDown,
  onMouseUp,
}: PocketBubbleProps) => {
  return (
    <Container
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(${x - size / 2}px, ${y - size / 2}px) rotate(${angle}rad)`,
      }}
      onMouseDown={(e) => onMouseDown(id, e)}
      onMouseUp={(e) => onMouseUp(id, e)}
    >
      <BubbleImage src={image} alt={`avatar-${id}`} draggable={false} />
    </Container>
  );
};

export default PocketBubble;

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50%;
  overflow: hidden;
  cursor: grab;
  user-select: none;
  touch-action: none;
`;

const BubbleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
`;
