import { canvasElementsAtom } from "@/store/canvasElements";
import { canvasMousePositionSelector } from "@/store/canvasState";
import { focusedElementIDAtom, focusedElementSelector } from "@/store/focusedElement";
import { mouseStateAtom } from "@/store/mouseState";
import { toolbarStateAtom } from "@/store/toolbarState";
import { CanvasElement } from "@/types/CanvasElement";
import { UseToolOperation } from "@/types/CanvasElementTools";
import { useCallback } from "react";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";

export const useRectangleOperation: UseToolOperation = () => {
  const canvasMousePosition = useRecoilValue(canvasMousePositionSelector);
  const mouseState = useRecoilValue(mouseStateAtom);
  const [canvasElements, setCanvasElements] = useRecoilState(canvasElementsAtom);
  const setFocusedElementID = useSetRecoilState(focusedElementIDAtom);
  const focusedElement = useRecoilValue(focusedElementSelector);
  const toolbar = useRecoilValue(toolbarStateAtom);

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (e.button !== 0) return;

      const id = new Date().getTime().toString();
      const element: CanvasElement = {
        id,
        type: "rectangle",
        width: 0,
        height: 0,
        x: canvasMousePosition.x,
        y: canvasMousePosition.y,
      };
      setCanvasElements([...canvasElements, element]);
      setFocusedElementID(id);
    },
    [
      canvasElements,
      canvasMousePosition.x,
      canvasMousePosition.y,
      setCanvasElements,
      setFocusedElementID,
    ]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (mouseState.buttonClicked.left) {
        setCanvasElements(
          canvasElements.map((element) => {
            if (element.id !== focusedElement?.id) return element;

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
      focusedElement?.id,
      mouseState.buttonClicked.left,
      setCanvasElements,
    ]
  );

  const onMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const currentElement = canvasElements.find((element) => element.id === focusedElement?.id);
      if (!currentElement) return;

      if (currentElement.height === 0 || currentElement.width === 0) {
        setCanvasElements(canvasElements.filter((element) => element.id !== focusedElement?.id));
      }
    },
    [canvasElements, focusedElement?.id, setCanvasElements]
  );

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
};
