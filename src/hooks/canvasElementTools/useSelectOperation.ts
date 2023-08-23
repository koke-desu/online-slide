import { canvasElementsAtom } from "@/store/canvasElements";
import { canvasMousePositionSelector, canvasStateAtom } from "@/store/canvasState";
import { focusedElementIDAtom, focusedElementSelector } from "@/store/focusedElement";
import { mouseStateAtom } from "@/store/mouseState";
import { operateObjectsAtom } from "@/store/operateObject";
import { UseToolOperation } from "@/types/CanvasElementTools";
import { OperateObjectType } from "@/types/OperateObject";
import { useCallback, useEffect, useState } from "react";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";

export const useSelectOperation: UseToolOperation = () => {
  const canvasMousePosition = useRecoilValue(canvasMousePositionSelector);
  const mouseState = useRecoilValue(mouseStateAtom);
  const [canvasElements, setCanvasElements] = useRecoilState(canvasElementsAtom);
  const setFocusedElementID = useSetRecoilState(focusedElementIDAtom);
  const focusedElement = useRecoilValue(focusedElementSelector);
  const [operateObjects, setOperateObjects] = useRecoilState(operateObjectsAtom);
  const [currentOperate, setCurrentOperate] = useState<OperateObjectType | "move">("move");
  const canvasState = useRecoilValue(canvasStateAtom);

  useEffect(() => {
    if (!focusedElement) return;

    const vertexSize = 5 * (1 / canvasState.scale);
    const lineWidth = 3 * (1 / canvasState.scale);
    setOperateObjects([
      {
        type: "resize_left",
        width: lineWidth,
        height: focusedElement.height,
        x: focusedElement.x,
        y: focusedElement.y,
      },
      {
        type: "resize_right",
        width: lineWidth,
        height: focusedElement.height,
        x: focusedElement.x + focusedElement.width - lineWidth,
        y: focusedElement.y,
      },
      {
        type: "resize_top",
        width: focusedElement.width,
        height: lineWidth,
        x: focusedElement.x,
        y: focusedElement.y,
      },
      {
        type: "resize_bottom",
        width: focusedElement.width,
        height: lineWidth,
        x: focusedElement.x,
        y: focusedElement.y + focusedElement.height - lineWidth,
      },
      {
        type: "resize_left_top",
        width: vertexSize,
        height: vertexSize,
        x: focusedElement.x,
        y: focusedElement.y,
      },
      {
        type: "resize_left_bottom",
        width: vertexSize,
        height: vertexSize,
        x: focusedElement.x,
        y: focusedElement.y + focusedElement.height - vertexSize,
      },
      {
        type: "resize_right_top",
        width: vertexSize,
        height: vertexSize,
        x: focusedElement.x + focusedElement.width - vertexSize,
        y: focusedElement.y,
      },
      {
        type: "resize_right_bottom",
        width: vertexSize,
        height: vertexSize,
        x: focusedElement.x + focusedElement.width - vertexSize,
        y: focusedElement.y + focusedElement.height - vertexSize,
      },
    ]);
  }, [canvasState.scale, focusedElement, setOperateObjects]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (focusedElement) {
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
        setFocusedElementID(element.id);
        return;
      }

      setFocusedElementID(null);
    },
    [canvasElements, canvasMousePosition, focusedElement, operateObjects, setFocusedElementID]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (mouseState.buttonClicked.left) {
        if (focusedElement) {
          if (currentOperate === "move") {
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
          }
          if (currentOperate === "resize_left") {
            setCanvasElements(
              canvasElements.map((element) => {
                if (element.id !== focusedElement?.id) return element;

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
                if (element.id !== focusedElement?.id) return element;

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
                if (element.id !== focusedElement?.id) return element;

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
                if (element.id !== focusedElement?.id) return element;

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
      focusedElement,
      mouseState.buttonClicked.left,
      setCanvasElements,
    ]
  );

  const onMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setCurrentOperate("move");
  }, []);

  return { onMouseDown, onMouseMove, onMouseUp };
};
