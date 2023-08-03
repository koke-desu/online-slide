"use client";
import { CanvasElement, canvasElementsAtom } from "@/store/canvasElements";
import { canvasMousePositionSelector, canvasStateAtom } from "@/store/canvasState";
import { focusedElementAtom } from "@/store/focusedElement";
import { mouseStateAtom } from "@/store/mouseState";
import { windowSizeAtom } from "@/store/windowSize";
import Head from "next/head";
import React, { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
type Props = {};

const MainCanvas: React.FC<Props> = ({}) => {
  const windowSize = useRecoilValue(windowSizeAtom);
  const [canvasState, setCanvasState] = useRecoilState(canvasStateAtom);
  const canvasMousePosition = useRecoilValue(canvasMousePositionSelector);
  const mouseState = useRecoilValue(mouseStateAtom);
  const [canvasElements, setCanvasElements] = useRecoilState(canvasElementsAtom);
  const [focusedElement, setFocusedElement] = useRecoilState(focusedElementAtom);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = canvasMousePosition;

    const id = new Date().getTime().toString();
    const element: CanvasElement = {
      id,
      type: "rect",
      width: 0,
      height: 0,
      x,
      y,
    };
    setCanvasElements([...canvasElements, element]);
    setFocusedElement(element);
  };

  const onMouseUp = () => {
    const currentElement = canvasElements.find((element) => element.id === focusedElement?.id);
    if (!currentElement) return;

    if (currentElement.height === 0 || currentElement.width === 0) {
      setCanvasElements(canvasElements.filter((element) => element.id !== focusedElement?.id));
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!mouseState.isClicked) return;

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

      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const { scale } = canvasState;
      context.scale(scale, scale);
      canvasElements.forEach((element) => {
        context.fillStyle = "red";
        context.fillRect(element.x, element.y, element.width, element.height);
      });

      // 描画の拡大率をもとに戻す
      context.scale(1 / scale, 1 / scale);
    };

    render();

    const interval = setInterval(() => {
      // console.log("update");
      render();
    }, 1000 / 30);
    return () => {
      clearInterval(interval);
    };
  }, [canvasElements, canvasState]);

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
