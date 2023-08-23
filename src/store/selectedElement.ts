import { CanvasElement } from "@/types/CanvasElement";
import { atom, selector } from "recoil";
import { canvasElementsAtom } from "./canvasElements";
import { OperateObject } from "@/types/OperateObject";
import { canvasStateAtom } from "./canvasState";

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

export const operateObjectSelector = selector({
  key: "operateObjectSelector",
  get: ({ get }): OperateObject[] => {
    const selectedElement = get(selectedElementSelector);
    const canvasState = get(canvasStateAtom);
    if (!selectedElement) return [];

    const vertexSize = 5 * (1 / canvasState.scale);
    const lineWidth = 3 * (1 / canvasState.scale);

    return [
      {
        type: "resize_left",
        width: lineWidth,
        height: selectedElement.height,
        x: selectedElement.x,
        y: selectedElement.y,
      },
      {
        type: "resize_right",
        width: lineWidth,
        height: selectedElement.height,
        x: selectedElement.x + selectedElement.width - lineWidth,
        y: selectedElement.y,
      },
      {
        type: "resize_top",
        width: selectedElement.width,
        height: lineWidth,
        x: selectedElement.x,
        y: selectedElement.y,
      },
      {
        type: "resize_bottom",
        width: selectedElement.width,
        height: lineWidth,
        x: selectedElement.x,
        y: selectedElement.y + selectedElement.height - lineWidth,
      },
      {
        type: "resize_left_top",
        width: vertexSize,
        height: vertexSize,
        x: selectedElement.x,
        y: selectedElement.y,
      },
      {
        type: "resize_left_bottom",
        width: vertexSize,
        height: vertexSize,
        x: selectedElement.x,
        y: selectedElement.y + selectedElement.height - vertexSize,
      },
      {
        type: "resize_right_top",
        width: vertexSize,
        height: vertexSize,
        x: selectedElement.x + selectedElement.width - vertexSize,
        y: selectedElement.y,
      },
      {
        type: "resize_right_bottom",
        width: vertexSize,
        height: vertexSize,
        x: selectedElement.x + selectedElement.width - vertexSize,
        y: selectedElement.y + selectedElement.height - vertexSize,
      },
    ];
  },
});
