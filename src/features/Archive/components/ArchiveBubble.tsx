import styled from "styled-components";
import type { CalendarMarker } from "../../../shared/types/post.type";

const ArchiveBubble = ({ markers }: { markers: CalendarMarker[] }) => {
  const titleMarker = markers[0];
  const isEmoji = titleMarker.markerType === "EMOJI";

  return (
    <Container $isEmoji={isEmoji}>
      {isEmoji ? titleMarker.markerEmoji : <Image src={titleMarker.markerImageUrl as string} />}
    </Container>
  );
};

export default ArchiveBubble;

const Container = styled.div<{ $isEmoji: boolean }>`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 40%;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: ${({ $isEmoji }) => ($isEmoji ? "clamp(14px, 3vw, 30px)" : "0")};
  line-height: 1;

  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
`;

const Image = styled.img`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;
`;
