import type { PocketBubbleType } from "@/shared/types/post.type";
import Matter from "matter-js";

export interface BodyMap {
  [postId: string]: Matter.Body;
}

interface CreatePocketBodiesParams {
  items: PocketBubbleType[];
  width: number;
  height: number;
  itemSize: number;
  bodyMapRef: React.MutableRefObject<BodyMap>;
}

export function createPocketBodies({
  items,
  width,
  height,
  itemSize,
  bodyMapRef,
}: CreatePocketBodiesParams) {
  return items.map((item, index) => {
    // 초기 위치 설정
    // Todo : 나중에 post들 들어오면 어떤식으로 수정할 지 생각해야할듯
    const col = index % 4;
    const row = Math.floor(index / 4);

    const jitter = () => (Math.random() - 0.5) * 20;

    const x = width * (0.22 + col * 0.15) + jitter();
    const y = height * (0.14 + row * 0.13) + jitter();

    const body = Matter.Bodies.circle(x, y, itemSize / 2, {
      restitution: 0.7, // 탄성
      friction: 0.02, // 벽이나 바닥이 얼마나 미끄러운지
      frictionAir: 0.07, // 공기 저항
      density: 0.002, // 밀도
    });

    bodyMapRef.current[item.postId] = body;
    return body;
  });
}
