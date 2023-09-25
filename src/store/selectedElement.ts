import { CanvasElement } from "@/types/CanvasElement";
import { atom, selector } from "recoil";
import { canvasElementsAtom } from "./canvasElements";
import { OperateObject } from "@/types/OperateObject";
import { canvasStateAtom } from "./canvasState";

export const selectedElementIDAtom = atom<null | CanvasElement["id"][]>({
  key: "selectedElement",
  default: null,
});

export const selectedElementSelector = selector({
  key: "selectedElementSelector",
  get: ({ get }) => {
    const selectedElementID = get(selectedElementIDAtom);
    const elements = get(canvasElementsAtom);

    if (!selectedElementID) return null;
    return elements.filter((element) => selectedElementID.includes(element.id));
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

    if (!Array.isArray(selectedElement)) {
      return formatRectangleOperateObjects(selectedElement, lineWidth, vertexSize);
    }

    const x = Math.min(...selectedElement.map((element) => element.x));
    const y = Math.min(...selectedElement.map((element) => element.y));
    const width = Math.max(...selectedElement.map((element) => element.x + element.width)) - x;
    const height = Math.max(...selectedElement.map((element) => element.y + element.height)) - y;
    return formatRectangleOperateObjects({ width, height, x, y }, lineWidth, vertexSize);
  },
});

const formatRectangleOperateObjects = (
  { width, height, x, y }: { width: number; height: number; x: number; y: number },

  lineWidth: number,
  vertexSize: number
): OperateObject[] => {
  return [
    {
      type: "resize_left",
      width: lineWidth,
      height: height,
      x: x,
      y: y,
    },
    {
      type: "resize_right",
      width: lineWidth,
      height: height,
      x: x + width - lineWidth,
      y: y,
    },
    {
      type: "resize_top",
      width: width,
      height: lineWidth,
      x: x,
      y: y,
    },
    {
      type: "resize_bottom",
      width: width,
      height: lineWidth,
      x: x,
      y: y + height - lineWidth,
    },
    {
      type: "resize_left_top",
      width: vertexSize,
      height: vertexSize,
      x: x,
      y: y,
    },
    {
      type: "resize_left_bottom",
      width: vertexSize,
      height: vertexSize,
      x: x,
      y: y + height - vertexSize,
    },
    {
      type: "resize_right_top",
      width: vertexSize,
      height: vertexSize,
      x: x + width - vertexSize,
      y: y,
    },
    {
      type: "resize_right_bottom",
      width: vertexSize,
      height: vertexSize,
      x: x + width - vertexSize,
      y: y + height - vertexSize,
    },
  ];
};
