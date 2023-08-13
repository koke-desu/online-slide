import { elementTypes } from "./CanvasElement";

export const canvasElementTools = [...elementTypes, "select"];
export type CanvasElementTool = (typeof canvasElementTools)[number];

export type UseToolOperation = () => {
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
};
