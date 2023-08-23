import { canvasElementsAtom } from "@/store/canvasElements";
import { canvasMousePositionSelector, canvasStateAtom } from "@/store/canvasState";
import {
  operateObjectSelector,
  selectedElementIDAtom,
  selectedElementSelector,
} from "@/store/selectedElement";
import { mouseStateAtom } from "@/store/mouseState";
import { UseToolOperation } from "@/types/CanvasElementTools";
import { OperateObjectType } from "@/types/OperateObject";
import { useCallback, useEffect, useState } from "react";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";

export const useSelectOperation: UseToolOperation = () => {
  const canvasMousePosition = useRecoilValue(canvasMousePositionSelector);
  const mouseState = useRecoilValue(mouseStateAtom);
  const [canvasElements, setCanvasElements] = useRecoilState(canvasElementsAtom);
  const setSelectedElementID = useSetRecoilState(selectedElementIDAtom);
  const selectedElement = useRecoilValue(selectedElementSelector);
  const [currentOperate, setCurrentOperate] = useState<OperateObjectType | "move">("move");
  const operateObjects = useRecoilValue(operateObjectSelector);

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (selectedElement) {
        // 当たり判定補正
        const hitJudge = 10; // 10px分当たり判定を広める
        const { x, y } = canvasMousePosition;
        operateObjects.forEach((operateObject) => {
          if (
            operateObject.x - hitJudge < x &&
            x < operateObject.x + operateObject.width + hitJudge &&
            operateObject.y - hitJudge < y &&
            y < operateObject.y + operateObject.height + hitJudge
          ) {
            setCurrentOperate(operateObject.type);
          }
        });
      }

      if (e.button !== 0) return;
      const { x, y } = canvasMousePosition;
      for (let element of canvasElements) {
        if (x < element.x || element.x + element.width < x) continue;
        if (y < element.y || element.y + element.height < y) continue;
        setSelectedElementID(element.id);
        return;
      }

      setSelectedElementID(null);
    },
    [canvasElements, canvasMousePosition, selectedElement, operateObjects, setSelectedElementID]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (mouseState.buttonClicked.left) {
        if (selectedElement) {
          if (currentOperate === "move") {
            setCanvasElements(
              canvasElements.map((element) => {
                if (element.id !== selectedElement?.id) return element;

                return {
                  ...element,
                  x: element.x + e.movementX,
                  y: element.y + e.movementY,
                };
              })
            );
          }
          if (currentOperate === "resize_left") {
            setCanvasElements(
              canvasElements.map((element) => {
                if (element.id !== selectedElement?.id) return element;

                return {
                  ...element,
                  width: element.width - e.movementX,
                  x: element.x + e.movementX,
                };
              })
            );
          }
          if (currentOperate === "resize_right") {
            setCanvasElements(
              canvasElements.map((element) => {
                if (element.id !== selectedElement?.id) return element;

                return {
                  ...element,
                  width: element.width + e.movementX,
                };
              })
            );
          }
          if (currentOperate === "resize_top") {
            setCanvasElements(
              canvasElements.map((element) => {
                if (element.id !== selectedElement?.id) return element;

                return {
                  ...element,
                  height: element.height - e.movementY,
                  y: element.y + e.movementY,
                };
              })
            );
          }
          if (currentOperate === "resize_bottom") {
            setCanvasElements(
              canvasElements.map((element) => {
                if (element.id !== selectedElement?.id) return element;

                return {
                  ...element,
                  height: element.height + e.movementY,
                };
              })
            );
          }
        }
      }
    },
    [
      canvasElements,
      currentOperate,
      selectedElement,
      mouseState.buttonClicked.left,
      setCanvasElements,
    ]
  );

  const onMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setCurrentOperate("move");
  }, []);

  return { onMouseDown, onMouseMove, onMouseUp };
};
