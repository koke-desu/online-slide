import { canvasElementsAtom } from "@/store/canvasElements";
import { canvasMousePositionSelector } from "@/store/canvasState";
import { focusedElementIDAtom, focusedElementSelector } from "@/store/focusedElement";
import { mouseStateAtom } from "@/store/mouseState";
import { toolbarStateAtom } from "@/store/toolbarState";
import { UseToolOperation } from "@/types/CanvasElementTools";
import { useCallback } from "react";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";

export const useSelectOperation: UseToolOperation = () => {
  const canvasMousePosition = useRecoilValue(canvasMousePositionSelector);
  const mouseState = useRecoilValue(mouseStateAtom);
  const [canvasElements, setCanvasElements] = useRecoilState(canvasElementsAtom);
  const setFocusedElementID = useSetRecoilState(focusedElementIDAtom);
  const focusedElement = useRecoilValue(focusedElementSelector);
  const toolbar = useRecoilValue(toolbarStateAtom);

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (e.button !== 0) return;
      const { x, y } = canvasMousePosition;
      for (let element of canvasElements) {
        // 先頭の要素以外が選択できない？？？
        if (x < element.x || element.x + element.width < x) continue;
        if (y < element.y || element.y + element.height < y) continue;
        setFocusedElementID(element.id);
        return;
      }

      setFocusedElementID(null);
    },
    [canvasElements, canvasMousePosition, setFocusedElementID]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (mouseState.buttonClicked.left) {
        if (toolbar.selectedTool === "select" && focusedElement) {
          setCanvasElements(
            canvasElements.map((element) => {
              if (element.id !== focusedElement?.id) return element;

              return {
                ...element,
                x: element.x + e.movementX,
                y: element.y + e.movementY,
              };
            })
          );
          return;
        }
      }
    },
    [
      canvasElements,
      focusedElement,
      mouseState.buttonClicked.left,
      setCanvasElements,
      toolbar.selectedTool,
    ]
  );

  const onMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {}, []);

  return { onMouseDown, onMouseMove, onMouseUp };
};
