import { CanvasElement } from "@/types/CanvasElement";
import { atom, selector } from "recoil";
import { canvasElementsAtom } from "./canvasElements";

export const selectedElementIDAtom = atom<null | CanvasElement["id"]>({
  key: "selectedElement",
  default: null,
});

export const selectedElementSelector = selector({
  key: "selectedElementSelector",
  get: ({ get }) => {
    const selectedElementID = get(selectedElementIDAtom);
    const elements = get(canvasElementsAtom);
    return elements.find((element) => element.id === selectedElementID) || null;
  },
});
