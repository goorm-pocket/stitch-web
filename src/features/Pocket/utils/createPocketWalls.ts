import Matter from "matter-js";

interface CreatePocketWallsParams {
  width: number;
  height: number;
  wallThickness: number; // 벽 실제 UI와 선과의 거리
}

export function createPocketWalls({ width, height, wallThickness }: CreatePocketWallsParams) {
  const offset = 30;

  const leftWall = Matter.Bodies.rectangle(
    offset - wallThickness / 2,
    height / 2,
    wallThickness,
    height,
    { isStatic: true },
  );

  const rightWall = Matter.Bodies.rectangle(
    width - offset + wallThickness / 2,
    height / 2,
    wallThickness,
    height,
    { isStatic: true },
  );

  const topWall = Matter.Bodies.rectangle(
    width / 2,
    offset - wallThickness / 2,
    width - offset * 2 + wallThickness * 2,
    wallThickness,
    { isStatic: true },
  );

  const bottomWall = Matter.Bodies.rectangle(
    width / 2,
    height - offset + wallThickness / 2,
    width - offset * 2 + wallThickness * 2,
    wallThickness,
    { isStatic: true },
  );

  return [leftWall, rightWall, topWall, bottomWall];
}
