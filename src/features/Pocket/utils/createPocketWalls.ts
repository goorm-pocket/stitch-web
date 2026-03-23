import Matter from "matter-js";

interface CreatePocketWallsParams {
  width: number;
  height: number;
  wallThickness: number; // 벽 실제 UI와 선과의 거리
}

export function createPocketWalls({ width, height, wallThickness }: CreatePocketWallsParams) {
  const leftWall = Matter.Bodies.rectangle(wallThickness / 2, height / 2, wallThickness, height, {
    isStatic: true,
  });
  const rightWall = Matter.Bodies.rectangle(
    width - wallThickness / 2,
    height / 2,
    wallThickness,
    height,
    { isStatic: true }, // 고정된 위치라는 뜻
  );

  const topWall = Matter.Bodies.rectangle(width / 2, wallThickness / 2, width, wallThickness, {
    isStatic: true,
  });

  const bottomWall = Matter.Bodies.rectangle(
    width / 2,
    height - wallThickness / 2,
    width,
    wallThickness,
    { isStatic: true },
  );

  return [leftWall, rightWall, topWall, bottomWall];
}
