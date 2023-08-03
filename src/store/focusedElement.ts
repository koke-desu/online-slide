import { CanvasElement } from "@/types/CanvasElement";
import { atom, selector } from "recoil";
import { canvasElementsAtom } from "./canvasElements";

export const focusedElementIDAtom = atom<null | CanvasElement["id"]>({
  key: "focusedElement",
  default: null,
});

export const focusedElementSelector = selector({
  key: "focusedElementSelector",
  get: ({ get }) => {
    const focusedElementID = get(focusedElementIDAtom);
    const elements = get(canvasElementsAtom);
    return elements.find((element) => element.id === focusedElementID) || null;
  },
});
