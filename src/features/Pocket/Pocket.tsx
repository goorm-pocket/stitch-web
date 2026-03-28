import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PocketBubble from "./components/PocketBubble";
import { useReadBoardPostMutation } from "../../shared/hooks/useBoard";
import PostModal from "../PostModal/PostModal";
import { usePocketSize } from "./hooks/usePocketSize";
import { usePocketMatter } from "./hooks/usePocketMatter";
import type { PocketBubbleType } from "@/shared/types/post.type";
import { useNavigate } from "react-router";

const MAX_TILT = 1;
const MAX_ROTATION = 4;
const WEBVIEW_TILT_SMOOTHING = 0.2;
const WEBVIEW_ROTATION_SMOOTHING = 0.24;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

interface PocketProps {
  board?: { items: PocketBubbleType[] };
  mode?: "BOARD" | "RECAP";
}

const Pocket = ({ board, mode = "BOARD" }: PocketProps) => {
  const navigate = useNavigate();
  const [motion, setMotion] = useState({
    tilt: { x: 0, y: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  });

  useEffect(() => {
    const applyMotion = (rawData: unknown) => {
      if (!rawData || typeof rawData !== "object") return;

      const message = rawData as {
        type?: string;
        payload?: {
          tilt?: { x?: number; y?: number };
          rotation?: { x?: number; y?: number; z?: number };
          x?: number;
          y?: number;
        };
      };

      if (message.type === "DEVICE_MOTION" && message.payload) {
        const nextTiltX = clamp(message.payload.tilt?.x ?? 0, -MAX_TILT, MAX_TILT);
        const nextTiltY = clamp(message.payload.tilt?.y ?? 0, -MAX_TILT, MAX_TILT);
        const nextRotationX = clamp(message.payload.rotation?.x ?? 0, -MAX_ROTATION, MAX_ROTATION);
        const nextRotationY = clamp(message.payload.rotation?.y ?? 0, -MAX_ROTATION, MAX_ROTATION);
        const nextRotationZ = clamp(message.payload.rotation?.z ?? 0, -MAX_ROTATION, MAX_ROTATION);

        setMotion((prev) => ({
          tilt: {
            x: prev.tilt.x + (nextTiltX - prev.tilt.x) * WEBVIEW_TILT_SMOOTHING,
            y: prev.tilt.y + (nextTiltY - prev.tilt.y) * WEBVIEW_TILT_SMOOTHING,
          },
          rotation: {
            x: prev.rotation.x + (nextRotationX - prev.rotation.x) * WEBVIEW_ROTATION_SMOOTHING,
            y: prev.rotation.y + (nextRotationY - prev.rotation.y) * WEBVIEW_ROTATION_SMOOTHING,
            z: prev.rotation.z + (nextRotationZ - prev.rotation.z) * WEBVIEW_ROTATION_SMOOTHING,
          },
        }));

        return;
      }

      if (message.type !== "TILT" || !message.payload) return;

      const nextX = clamp(message.payload.x ?? 0, -MAX_TILT, MAX_TILT);
      const nextY = clamp(message.payload.y ?? 0, -MAX_TILT, MAX_TILT);

      setMotion((prev) => ({
        tilt: {
          x: prev.tilt.x + (nextX - prev.tilt.x) * WEBVIEW_TILT_SMOOTHING,
          y: prev.tilt.y + (nextY - prev.tilt.y) * WEBVIEW_TILT_SMOOTHING,
        },
        rotation: prev.rotation,
      }));
    };

    const handleMessage = (event: MessageEvent) => {
      try {
        const rawData = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        applyMotion(rawData);
      } catch {
        // Ignore non-bridge messages.
      }
    };

    const handleCustomMotion = (event: Event) => {
      applyMotion((event as CustomEvent).detail);
    };

    window.addEventListener("message", handleMessage);
    document.addEventListener("message", handleMessage as EventListener);
    window.addEventListener("stitch:device-motion", handleCustomMotion as EventListener);

    applyMotion(
      (window as Window & { __STITCH_DEVICE_MOTION__?: unknown }).__STITCH_DEVICE_MOTION__,
    );

    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("message", handleMessage as EventListener);
      window.removeEventListener("stitch:device-motion", handleCustomMotion as EventListener);
    };
  }, []);
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
    motion,
  });

  const handleClickPost = async (id: string) => {
    if (!id) return;
    if (mode == "BOARD") {
      await readBoardPost({ postId: id });
    }

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
