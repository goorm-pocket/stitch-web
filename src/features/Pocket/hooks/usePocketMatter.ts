import type { PocketBubbleType } from "@/shared/types/post.type";
import { useEffect, useRef } from "react";
import { createPocketBodies } from "../utils/createPocketBodies";
import Matter from "matter-js";
import { createPocketWalls } from "../utils/createPocketWalls";
import type { BodyMap } from "../types/matter.type";

interface UsePocketMatterParams {
  sceneRef: React.RefObject<HTMLDivElement | null>;
  items: PocketBubbleType[];
  width: number;
  height: number;
  itemSize: number;
  wallThickness: number;
  motion: {
    gravity: {
      x: number;
      y: number;
      z: number;
    };
    rotation: {
      x: number;
      y: number;
      z: number;
    };
  };
}

export function usePocketMatter({
  sceneRef,
  items,
  width,
  height,
  itemSize,
  wallThickness,
  motion,
}: UsePocketMatterParams) {
  const runnerRef = useRef<Matter.Runner | null>(null); // 공들 계속 움직히게 함
  const animationRef = useRef<number | null>(null); // 화면 업데이트 타이머
  const bodyMapRef = useRef<BodyMap>({}); // bubble들의 Ref
  const engineRef = useRef<Matter.Engine | null>(null);
  const elementMapRef = useRef<Record<string, HTMLDivElement | null>>({});

  const applyBodyTransform = (postId: string) => {
    const body = bodyMapRef.current[postId];
    const element = elementMapRef.current[postId];
    if (!body || !element) return;

    const radius = body.circleRadius ?? 0;
    element.style.transform = `translate(${body.position.x - radius}px, ${
      body.position.y - radius
    }px) rotate(${body.angle}rad)`;
    element.style.visibility = "visible";
  };

  const registerBubbleElement = (postId: string, element: HTMLDivElement | null) => {
    elementMapRef.current[postId] = element;

    if (!element) {
      delete elementMapRef.current[postId];
      return;
    }

    element.style.willChange = "transform";
    applyBodyTransform(postId);
  };

  useEffect(() => {
    if (!sceneRef.current || width === 0 || height === 0 || items.length === 0) return;
    bodyMapRef.current = {};

    const engine = Matter.Engine.create();
    engineRef.current = engine;
    engine.gravity.scale = 0.0015;
    engine.gravity.x = 0;
    engine.gravity.y = 1;

    // pocket 생성
    const world = engine.world;

    // 벽 생성
    const walls = createPocketWalls({ width, height, wallThickness });

    Matter.World.add(world, walls); // world에 벽 넣기

    const bodies = createPocketBodies({
      items,
      width,
      height,
      itemSize,
      bodyMapRef,
    });

    Matter.World.add(world, bodies);

    // 엔진 안에서 마우스 이벤트를 추적
    const mouse = Matter.Mouse.create(sceneRef.current);

    // 마우스와 물리 엔진을 끈으로 연결
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.05, // 얼마나 잘 붙어있는지
        render: { visible: false }, // 끈 보이게 할지
      },
    });
    Matter.World.add(world, mouseConstraint);

    // 물리 엔진을 계속 실행시키는 루프 생성
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);
    const updatePositions = () => {
      items.forEach((item) => {
        applyBodyTransform(item.postId);
      });

      animationRef.current = requestAnimationFrame(updatePositions);
    };

    updatePositions();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      Matter.Runner.stop(runner);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
      engineRef.current = null;
    };
  }, [sceneRef, items, width, height, itemSize, wallThickness]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const gravityX = motion.gravity.x;
    const gravityY = motion.gravity.y;
    const gravityLength = Math.hypot(gravityX, gravityY);

    if (gravityLength > 0.01) {
      engine.gravity.x = (gravityX / gravityLength) * 2.2;
      engine.gravity.y = (gravityY / gravityLength) * 2.2;
    } else {
      engine.gravity.x = 0;
      engine.gravity.y = 0;
    }

    const force = {
      x: motion.rotation.y * 0.00012,
      y: motion.rotation.x * 0.00012,
    };

    Object.values(bodyMapRef.current).forEach((body) => {
      Matter.Body.applyForce(body, body.position, force);
      Matter.Body.setAngularVelocity(body, body.angularVelocity + motion.rotation.z * 0.002);
    });
  }, [motion]);

  return {
    registerBubbleElement,
  };
}
