export interface PositionMap {
  [postId: string]: {
    x: number;
    y: number;
    angle: number;
  };
}

export interface BodyMap {
  [postId: string]: Matter.Body;
}
