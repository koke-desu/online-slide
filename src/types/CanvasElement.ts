export const elementTypes = ["rectangle", "circle", "line"] as const;
export type ElementType = (typeof elementTypes)[number];

export type CanvasElement = {
  id: string;
  type: ElementType;
  width: number;
  height: number;
  x: number;
  y: number;
};
