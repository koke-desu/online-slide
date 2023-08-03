import { CanvasElement } from "@/types/CanvasElement";
import { atom } from "recoil";

type FocusedElement = CanvasElement | null;
export const focusedElementAtom = atom<FocusedElement>({
  key: "focusedElement",
  default: null,
});
