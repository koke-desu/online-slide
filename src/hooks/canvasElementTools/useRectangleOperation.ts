import { canvasElementsAtom } from "@/store/canvasElements";
import { canvasMousePositionSelector } from "@/store/canvasState";
import { selectedElementIDAtom, selectedElementSelector } from "@/store/selectedElement";
import { mouseStateAtom } from "@/store/mouseState";
import { CanvasElement, ElementColor } from "@/types/CanvasElement";
import { UseToolOperation } from "@/types/CanvasElementTools";
import { useCallback } from "react";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";

export const useRectangleOperation: UseToolOperation = () => {
  const canvasMousePosition = useRecoilValue(canvasMousePositionSelector);
  const mouseState = useRecoilValue(mouseStateAtom);
  const [canvasElements, setCanvasElements] = useRecoilState(canvasElementsAtom);
  const setSelectedElementID = useSetRecoilState(selectedElementIDAtom);
  const selectedElement = useRecoilValue(selectedElementSelector);

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (e.button !== 0) return;

      const id = new Date().getTime().toString();
      const element: CanvasElement = {
        id,
        element_type: "Rectangle",
        width: 0,
        height: 0,
        x: canvasMousePosition.x,
        y: canvasMousePosition.y,
        fill: new ElementColor("#444444"),
        stroke: {
          color: new ElementColor("#000000"),
          width: 0,
        },
      };
      setCanvasElements([...canvasElements, element]);
      setSelectedElementID([id]);
    },
    [
      canvasElements,
      canvasMousePosition.x,
      canvasMousePosition.y,
      setCanvasElements,
      setSelectedElementID,
    ]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (mouseState.buttonClicked.left) {
        if (!selectedElement) return;
        setCanvasElements(
          canvasElements.map((element) => {
            if (!selectedElement.some((val) => val.id === element.id)) return element;

            const { x, y } = canvasMousePosition;

            return {
              ...element,
              width: x - element.x,
              height: y - element.y,
            };
          })
        );
      }
    },
    [
      canvasElements,
      canvasMousePosition,
      mouseState.buttonClicked.left,
      selectedElement,
      setCanvasElements,
    ]
  );

  const onMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!selectedElement) return;

      const currentElement = canvasElements.find((element) => element.id === selectedElement[0].id);
      if (!currentElement) return;

      if (currentElement.height === 0 || currentElement.width === 0) {
        setCanvasElements(canvasElements.filter((element) => element.id !== selectedElement[0].id));
      }
    },
    [canvasElements, selectedElement, setCanvasElements]
  );

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
};
