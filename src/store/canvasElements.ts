import { CanvasElement } from "@/types/CanvasElement";
import { atom } from "recoil";

export const canvasElementsAtom = atom<CanvasElement[]>({
  key: "elements",
  default: [],
});
