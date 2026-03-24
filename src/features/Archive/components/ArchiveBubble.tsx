import styled from "styled-components";
import type { CalendarMarker } from "../../../shared/types/post.type";

const ArchiveBubble = ({ markers }: { markers: CalendarMarker[] }) => {
  const visibleMarkers = markers.slice(0, 3);

  return (
    <Container>
      {visibleMarkers.map((marker, index) => {
        const isEmoji = marker.markerType === "EMOJI";

        return (
          <BubbleItem key={index} $index={index}>
            {isEmoji ? (
              <Emoji $index={index}>{marker.markerEmoji}</Emoji>
            ) : (
              <Image src={marker.markerImageUrl as string} />
            )}
          </BubbleItem>
        );
      })}
    </Container>
  );
};

export default ArchiveBubble;

/* ================== styled ================== */

const Container = styled.div`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 40%;
`;

/**
 * index 기준:
 * 0 → 중앙 (크게)
 * 1 → 왼쪽 (작게)
 * 2 → 오른쪽 (작게)
 */
const BubbleItem = styled.div<{ $index: number }>`
  position: absolute;
  border-radius: 50%;
  background: white;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);

  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $index }) => {
    if ($index === 0) {
      return `
        width: 100%;
        height: 100%;
        z-index: 3;
      `;
    }

    if ($index === 1) {
      return `
        width: 70%;
        height: 70%;
        left: -40%;
        top: 25%;
        z-index: 2;
        opacity: 0.9;
      `;
    }

    if ($index === 2) {
      return `
        width: 70%;
        height: 70%;
        right: -40%;
        top: 25%;
        z-index: 1;
        opacity: 0.9;
      `;
    }
  }}
`;

const Image = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Emoji = styled.div<{ $index: number }>`
  line-height: 1;

  ${({ $index }) =>
    $index === 0 ? `font-size: clamp(14px, 3vw, 30px);` : `font-size: clamp(10px, 2.2vw, 20px);`}
`;
