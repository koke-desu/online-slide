import { atom } from "recoil";

export type CanvasElement = {
  id: string;
  type: "rect";
  width: number;
  height: number;
  x: number;
  y: number;
};
export const canvasElementsAtom = atom<CanvasElement[]>({
  key: "elements",
  default: [],
});
