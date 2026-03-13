import { useEffect, useMemo, useRef, useState } from "react";
import Matter from "matter-js";
import styled from "styled-components";

type Item = {
  id: number;
  image: string;
};

const SAMPLE_ITEMS: Item[] = [
  { id: 1, image: "https://i.pravatar.cc/100?img=1" },
  { id: 2, image: "https://i.pravatar.cc/100?img=2" },
  { id: 3, image: "https://i.pravatar.cc/100?img=3" },
  { id: 4, image: "https://i.pravatar.cc/100?img=4" },
  { id: 5, image: "https://i.pravatar.cc/100?img=5" },
  { id: 6, image: "https://i.pravatar.cc/100?img=6" },
  { id: 7, image: "https://i.pravatar.cc/100?img=7" },
  { id: 8, image: "https://i.pravatar.cc/100?img=8" },
  { id: 9, image: "https://i.pravatar.cc/100?img=9" },
  { id: 10, image: "https://i.pravatar.cc/100?img=10" },
];

type BodyMap = Record<number, Matter.Body>;
type PositionMap = Record<number, { x: number; y: number; angle: number }>;

const Pocket = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const animationRef = useRef<number | null>(null);
  const bodyMapRef = useRef<BodyMap>({});

  const clickStartRef = useRef<{
    id: number | null;
    x: number;
    y: number;
  }>({
    id: null,
    x: 0,
    y: 0,
  });

  const [positions, setPositions] = useState<PositionMap>({});
  const [size, setSize] = useState({ width: 0, height: 0 });

  const items = useMemo(() => SAMPLE_ITEMS, []);

  // pocket size에 맞게 사이즈 계산
  const itemSize = Math.min(size.width * 0.2, 65);

  // 벽이랑 item 사이
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
    if (!sceneRef.current || size.width === 0 || size.height === 0) return;

    bodyMapRef.current = {};

    const engine = Matter.Engine.create();
    engine.gravity.y = 0.7;
    engineRef.current = engine;

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
        frictionAir: 0.01,
        density: 0.002,
      });

      bodyMapRef.current[item.id] = body;
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
        const body = bodyMapRef.current[item.id];
        if (!body) return;

        next[item.id] = {
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
  }, [items, size.width, size.height, itemSize, wallThickness]);

  const handleMouseDown = (id: number, e: React.MouseEvent<HTMLDivElement>) => {
    clickStartRef.current = {
      id,
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handleMouseUp = (id: number, e: React.MouseEvent<HTMLDivElement>) => {
    const start = clickStartRef.current;
    if (start.id !== id) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 8) {
      console.log("클릭");
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
            const pos = positions[item.id];
            if (!pos) return null;

            return (
              <AvatarBubble
                key={item.id}
                style={{
                  width: `${itemSize}px`,
                  height: `${itemSize}px`,
                  transform: `translate(${pos.x - itemSize / 2}px, ${
                    pos.y - itemSize / 2
                  }px) rotate(${pos.angle}rad)`,
                }}
                onMouseDown={(e) => handleMouseDown(item.id, e)}
                onMouseUp={(e) => handleMouseUp(item.id, e)}
              >
                <AvatarImage src={item.image} alt={`avatar-${item.id}`} draggable={false} />
              </AvatarBubble>
            );
          })}
        </PocketArea>
      </PocketWrapper>
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

const AvatarBubble = styled.div`
  position: absolute;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #f8fafc;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
  cursor: grab;
  user-select: none;
  will-change: transform;

  &:active {
    cursor: grabbing;
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  -webkit-user-drag: none;
`;
