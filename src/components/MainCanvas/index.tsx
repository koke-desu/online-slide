"use client";
import { useRectangleOperation } from "@/hooks/canvasElementTools/useRectangleOperation";
import { useSelectOperation } from "@/hooks/canvasElementTools/useSelectOperation";
import { canvasElementsAtom } from "@/store/canvasElements";
import { canvasMousePositionSelector, canvasStateAtom } from "@/store/canvasState";
import { focusedElementIDAtom } from "@/store/focusedElement";
import { mouseStateAtom } from "@/store/mouseState";
import { operateObjectsAtom } from "@/store/operateObject";
import { toolbarStateAtom } from "@/store/toolbarState";
import { windowSizeAtom } from "@/store/windowSize";
import Head from "next/head";
import React, { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
type Props = {};

const MainCanvas: React.FC<Props> = ({}) => {
  const windowSize = useRecoilValue(windowSizeAtom);
  const [canvasState, setCanvasState] = useRecoilState(canvasStateAtom);
  const mouseState = useRecoilValue(mouseStateAtom);
  const [canvasElements, setCanvasElements] = useRecoilState(canvasElementsAtom);
  const toolbar = useRecoilValue(toolbarStateAtom);
  const rectangleOperation = useRectangleOperation();
  const selectOperation = useSelectOperation();
  const focusedElementID = useRecoilValue(focusedElementIDAtom);
  const operateObjects = useRecoilValue(operateObjectsAtom);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (toolbar.selectedTool === "select") {
      selectOperation.onMouseDown(e);
    }
    if (toolbar.selectedTool === "rectangle") {
      rectangleOperation.onMouseDown(e);
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (toolbar.selectedTool === "select") {
      selectOperation.onMouseMove(e);
    }
    if (toolbar.selectedTool === "rectangle") {
      rectangleOperation.onMouseMove(e);
    }

    if (mouseState.buttonClicked.wheel) {
      setCanvasState((canvasState) => ({
        ...canvasState,
        translate: {
          x: canvasState.translate.x + e.movementX,
          y: canvasState.translate.y + e.movementY,
        },
      }));
    }
  };

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (toolbar.selectedTool === "select") {
      selectOperation.onMouseUp(e);
    }
  };

  useEffect(() => {
    setCanvasState((canvasState) => ({
      ...canvasState,
      ctx: canvasRef.current?.getContext("2d") || null,
    }));
  }, [setCanvasState]);

  useEffect(() => {
    const render = () => {
      const context = canvasRef.current?.getContext("2d");
      if (!context) return;

      // 初期化
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // キャンバスを拡大・移動
      const { scale } = canvasState;
      context.translate(canvasState.translate.x, canvasState.translate.y);
      context.scale(scale, scale);

      // 要素を描画
      canvasElements.forEach((element) => {
        context.fillStyle = "red";
        if (element.type === "rectangle") {
          context.fillRect(element.x, element.y, element.width, element.height);
        }
        // if (element.id === focusedElementID) {
        //   context.strokeStyle = "blue";
        //   context.lineWidth = 3 * (1 / scale);
        //   context.strokeRect(element.x, element.y, element.width, element.height);
        //   context.lineWidth = 2 * (1 / scale);
        //   context.fillStyle = "white";
        //   // 頂点に四角を描画
        //   const vertexes = [
        //     { x: element.x, y: element.y },
        //     { x: element.x + element.width, y: element.y },
        //     { x: element.x, y: element.y + element.height },
        //     { x: element.x + element.width, y: element.y + element.height },
        //   ];
        //   const vertexSize = 5 * (1 / scale);
        //   vertexes.forEach((vertex) => {
        //     context.fillRect(
        //       vertex.x - vertexSize / 2,
        //       vertex.y - vertexSize / 2,
        //       vertexSize,
        //       vertexSize
        //     );
        //     context.strokeRect(
        //       vertex.x - vertexSize / 2,
        //       vertex.y - vertexSize / 2,
        //       vertexSize,
        //       vertexSize
        //     );
        //   });
        // }
      });
      // エレメントの操作用UIを描画
      operateObjects.forEach((operateObject) => {
        if (
          ["resize_left", "resize_right", "resize_top", "resize_bottom"].includes(
            operateObject.type
          )
        ) {
          context.fillStyle = "blue";
          context.fillRect(
            operateObject.x,
            operateObject.y,
            operateObject.width,
            operateObject.height
          );
        }

        if (
          [
            "resize_left_top",
            "resize_right_top",
            "resize_left_bottom",
            "resize_right_bottom",
          ].includes(operateObject.type)
        ) {
          context.fillStyle = "white";
          context.fillRect(
            operateObject.x,
            operateObject.y,
            operateObject.width,
            operateObject.height
          );
          context.lineWidth = 2 * (1 / scale);
          context.strokeStyle = "blue";
          context.strokeRect(
            operateObject.x,
            operateObject.y,
            operateObject.width,
            operateObject.height
          );
        }
      });

      // 描画の状態をもとに戻す
      context.scale(1 / scale, 1 / scale);
      context.translate(-canvasState.translate.x, -canvasState.translate.y);
    };

    render();

    const interval = setInterval(() => {
      // console.log("update");
      render();
    }, 1000 / 30);
    return () => {
      clearInterval(interval);
    };
  }, [canvasElements, canvasState, focusedElementID, operateObjects]);

  return (
    <>
      <Head>
        <title>Canvas</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        ></meta>
      </Head>
      <canvas
        height={windowSize.height}
        width={windowSize.width}
        ref={canvasRef}
        className="absolute top-0 left-0 z-0 bg-gray-200"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      ></canvas>
    </>
  );
};
export default MainCanvas;
