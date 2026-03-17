import { useEffect, useMemo, useRef, useState } from "react";
import Matter from "matter-js";
import styled from "styled-components";
import PocketBubble from "./components/PocketBubble";
import { useGetBoardQuery } from "../../shared/hooks/useBoard";
import type { PocketBubbleType } from "../../shared/types/post.type";
import PostModal from "../PostModal/PostModal";

const SAMPLE_ITEMS: PocketBubbleType[] = [
  {
    postId: "1",
    userId: "user1",
    ownerType: "FRIEND",
    representative: {
      type: "IMAGE",
      value: "https://i.pravatar.cc/100?img=1",
    },
    createdAt: "2026-03-14T10:00:00Z",
    exposedAt: "2026-03-14T10:00:00Z",
    read: false,
  },
  {
    postId: "2",
    userId: "user2",
    ownerType: "FRIEND",
    representative: {
      type: "IMAGE",
      value: "https://i.pravatar.cc/100?img=2",
    },
    createdAt: "2026-03-14T10:00:00Z",
    exposedAt: "2026-03-14T10:00:00Z",
    read: false,
  },
  {
    postId: "3",
    userId: "user3",
    ownerType: "ME",
    representative: {
      type: "IMOGI",
      value: "😊",
    },
    createdAt: "2026-03-14T10:00:00Z",
    exposedAt: "2026-03-14T10:00:00Z",
    read: true,
  },
  {
    postId: "4",
    userId: "user4",
    ownerType: "FRIEND",
    representative: {
      type: "IMAGE",
      value: "https://i.pravatar.cc/100?img=4",
    },
    createdAt: "2026-03-14T10:00:00Z",
    exposedAt: "2026-03-14T10:00:00Z",
    read: false,
  },
  {
    postId: "5",
    userId: "user5",
    ownerType: "FRIEND",
    representative: {
      type: "IMOGI",
      value: "🔥",
    },
    createdAt: "2026-03-14T10:00:00Z",
    exposedAt: "2026-03-14T10:00:00Z",
    read: false,
  },
  {
    postId: "6",
    userId: "user6",
    ownerType: "FRIEND",
    representative: {
      type: "IMAGE",
      value: "https://i.pravatar.cc/100?img=6",
    },
    createdAt: "2026-03-14T10:00:00Z",
    exposedAt: "2026-03-14T10:00:00Z",
    read: true,
  },
  {
    postId: "7",
    userId: "user7",
    ownerType: "FRIEND",
    representative: {
      type: "IMOGI",
      value: "🎉",
    },
    createdAt: "2026-03-14T10:00:00Z",
    exposedAt: "2026-03-14T10:00:00Z",
    read: false,
  },
  {
    postId: "8",
    userId: "user8",
    ownerType: "FRIEND",
    representative: {
      type: "IMAGE",
      value: "https://i.pravatar.cc/100?img=8",
    },
    createdAt: "2026-03-14T10:00:00Z",
    exposedAt: "2026-03-14T10:00:00Z",
    read: false,
  },
  {
    postId: "9",
    userId: "user9",
    ownerType: "FRIEND",
    representative: {
      type: "IMOGI",
      value: "😎",
    },
    createdAt: "2026-03-14T10:00:00Z",
    exposedAt: "2026-03-14T10:00:00Z",
    read: false,
  },
  {
    postId: "10",
    userId: "user10",
    ownerType: "FRIEND",
    representative: {
      type: "IMAGE",
      value: "https://i.pravatar.cc/100?img=10",
    },
    createdAt: "2026-03-14T10:00:00Z",
    exposedAt: "2026-03-14T10:00:00Z",
    read: true,
  },
];

type BodyMap = Record<string, Matter.Body>;
type PositionMap = Record<string, { x: number; y: number; angle: number }>;

const Pocket = () => {
  const { data: board } = useGetBoardQuery("WEB");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const animationRef = useRef<number | null>(null);
  const bodyMapRef = useRef<BodyMap>({});

  const clickStartRef = useRef<{
    id: string | null;
    x: number;
    y: number;
  }>({
    id: null,
    x: 0,
    y: 0,
  });

  const [positions, setPositions] = useState<PositionMap>({});
  const [size, setSize] = useState({ width: 0, height: 0 });

  const items = useMemo(() => {
    return board?.items?.length ? board.items : SAMPLE_ITEMS;
  }, [board]);

  const itemSize = Math.min(size.width * 0.2, 65);
  const wallThickness = 20;

  useEffect(() => {
    if (!wrapperRef.current) return;

    const updateSize = () => {
      if (!wrapperRef.current) return;

      const nextWidth = wrapperRef.current.clientWidth;
      const nextHeight = nextWidth * 1.08;

      setSize({
        width: nextWidth,
        height: nextHeight,
      });
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(wrapperRef.current);
    window.addEventListener("resize", updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current || size.width === 0 || size.height === 0 || items.length === 0) return;

    bodyMapRef.current = {};

    const engine = Matter.Engine.create();
    engine.gravity.y = 3;

    const world = engine.world;

    const leftWall = Matter.Bodies.rectangle(
      wallThickness / 2,
      size.height / 2,
      wallThickness,
      size.height,
      { isStatic: true },
    );

    const rightWall = Matter.Bodies.rectangle(
      size.width - wallThickness / 2,
      size.height / 2,
      wallThickness,
      size.height,
      { isStatic: true },
    );

    const topWall = Matter.Bodies.rectangle(
      size.width / 2,
      wallThickness / 2,
      size.width,
      wallThickness,
      { isStatic: true },
    );

    const bottomWall = Matter.Bodies.rectangle(
      size.width / 2,
      size.height - wallThickness / 2,
      size.width,
      wallThickness,
      { isStatic: true },
    );

    Matter.World.add(world, [leftWall, rightWall, topWall, bottomWall]);

    const bodies = items.map((item, index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);

      const x = size.width * (0.22 + col * 0.15);
      const y = size.height * (0.14 + row * 0.13);

      const body = Matter.Bodies.circle(x, y, itemSize / 2, {
        restitution: 0.7,
        friction: 0.02,
        frictionAir: 0.07,
        density: 0.002,
      });

      bodyMapRef.current[item.postId] = body;
      return body;
    });

    Matter.World.add(world, bodies);

    const mouse = Matter.Mouse.create(sceneRef.current);

    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.15,
        render: { visible: false },
      },
    });

    Matter.World.add(world, mouseConstraint);

    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    const updatePositions = () => {
      const next: PositionMap = {};

      items.forEach((item) => {
        const body = bodyMapRef.current[item.postId];
        if (!body) return;

        next[item.postId] = {
          x: body.position.x,
          y: body.position.y,
          angle: body.angle,
        };
      });

      setPositions(next);
      animationRef.current = requestAnimationFrame(updatePositions);
    };

    updatePositions();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      Matter.Runner.stop(runner);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
    };
  }, [items, size.width, size.height, itemSize]);

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
      setIsModalOpen(true);
      setSelectedPostId(id);
    }

    clickStartRef.current = { id: null, x: 0, y: 0 };
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
        <PostModal onClose={() => setIsModalOpen(false)} postId={selectedPostId} />
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
