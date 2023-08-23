import { canvasElementsAtom } from "@/store/canvasElements";
import { canvasMousePositionSelector, canvasStateAtom } from "@/store/canvasState";
import { selectedElementIDAtom, selectedElementSelector } from "@/store/selectedElement";
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
  const setSelectedElementID = useSetRecoilState(selectedElementIDAtom);
  const selectedElement = useRecoilValue(selectedElementSelector);
  const [operateObjects, setOperateObjects] = useRecoilState(operateObjectsAtom);
  const [currentOperate, setCurrentOperate] = useState<OperateObjectType | "move">("move");
  const canvasState = useRecoilValue(canvasStateAtom);

  useEffect(() => {
    if (!selectedElement) return;

    const vertexSize = 5 * (1 / canvasState.scale);
    const lineWidth = 3 * (1 / canvasState.scale);
    setOperateObjects([
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
    ]);
  }, [canvasState.scale, selectedElement, setOperateObjects]);

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
