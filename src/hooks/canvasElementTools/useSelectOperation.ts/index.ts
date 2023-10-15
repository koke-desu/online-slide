import { canvasElementsAtom } from "@/store/canvasElements";
import { canvasMousePositionSelector } from "@/store/canvasState";
import {
  operateObjectSelector,
  selectedElementIDAtom,
  selectedElementSelector,
} from "@/store/selectedElement";
import { mouseStateAtom } from "@/store/mouseState";
import { UseToolOperation } from "@/types/CanvasElementTools";
import { OperateObjectType } from "@/types/OperateObject";
import { useCallback, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { keyboardStateAtom } from "@/store/keyboardState";

export const useSelectOperation: UseToolOperation = () => {
  const canvasMousePosition = useRecoilValue(canvasMousePositionSelector);
  const mouseState = useRecoilValue(mouseStateAtom);
  const [canvasElements, setCanvasElements] = useRecoilState(canvasElementsAtom);
  const [selectedElementID, setSelectedElementID] = useRecoilState(selectedElementIDAtom);
  const selectedElement = useRecoilValue(selectedElementSelector);
  const [currentOperate, setCurrentOperate] = useState<OperateObjectType | "move">("move");
  const operateObjects = useRecoilValue(operateObjectSelector);
  const keyboardState = useRecoilValue(keyboardStateAtom);
  const [mouseDownPosition, setMouseDownPosition] = useState({ x: 0, y: 0 });
  const [isUnselecting, setIsUnselecting] = useState(false);
  const isMultiSelected = selectedElementID?.length || 0 > 1;

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (e.button !== 0) return;

      const { x, y } = canvasMousePosition;
      setMouseDownPosition({ x, y });

      if (selectedElement) {
        // 当たり判定補正
        const hitJudge = 10; // 10px分当たり判定を広める
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

      for (let element of canvasElements) {
        if (x < element.x || element.x + element.width < x) continue;
        if (y < element.y || element.y + element.height < y) continue;
        if (!keyboardState.Shift && !selectedElementID?.includes(element.id)) {
          setSelectedElementID([element.id]);
          return;
        }

        if (!selectedElementID) {
          setSelectedElementID([element.id]);
          return;
        }

        if (selectedElementID.includes(element.id)) {
          setIsUnselecting(true);
          return;
        }

        setSelectedElementID([...selectedElementID, element.id]);
        return;
      }

      if (isMultiSelected) {
        setIsUnselecting(true);
        return;
      }

      setSelectedElementID(null);
    },
    [
      canvasMousePosition,
      selectedElement,
      isMultiSelected,
      setSelectedElementID,
      operateObjects,
      canvasElements,
      keyboardState.Shift,
      selectedElementID,
    ]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (mouseState.buttonClicked.left) {
        if (selectedElement) {
          if (currentOperate === "move") {
            setCanvasElements(
              canvasElements.map((element) => {
                if (!selectedElementID?.includes(element.id)) return element;

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
                if (!selectedElementID?.includes(element.id)) return element;

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
                if (!selectedElementID?.includes(element.id)) return element;

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
                if (!selectedElementID?.includes(element.id)) return element;

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
                if (!selectedElementID?.includes(element.id)) return element;

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
      mouseState.buttonClicked.left,
      selectedElement,
      currentOperate,
      setCanvasElements,
      canvasElements,
      selectedElementID,
    ]
  );

  const onMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { x, y } = canvasMousePosition;
      if (mouseState.buttonClicked.left && isUnselecting) {
        if (x !== mouseDownPosition.x || y !== mouseDownPosition.y) return;
        for (let element of canvasElements) {
          if (
            element.x < x &&
            x < element.x + element.width &&
            element.y < y &&
            y < element.y + element.height
          ) {
            setSelectedElementID((elements) => {
              const newElements = elements?.filter((id) => id !== element.id);
              return newElements?.length ? newElements : null;
            });
            return;
          }
        }
        setSelectedElementID(null);
      }

      setCurrentOperate("move");
      setMouseDownPosition({ x: 0, y: 0 });
      setIsUnselecting(false);
    },
    [
      canvasElements,
      canvasMousePosition,
      isUnselecting,
      mouseDownPosition.x,
      mouseDownPosition.y,
      mouseState.buttonClicked.left,
      setSelectedElementID,
    ]
  );

  return { onMouseDown, onMouseMove, onMouseUp };
};
