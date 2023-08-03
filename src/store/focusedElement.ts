import { atom } from "recoil";
import { CanvasElement } from "./canvasElements";

type FocusedElement = CanvasElement | null;
export const focusedElementAtom = atom<FocusedElement>({
  key: "focusedElement",
  default: null,
});
