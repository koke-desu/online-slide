"use client";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
type Props = {};

type Element = { id: string; type: "rect"; width: number; height: number; x: number; y: number };

const MainCanvas: React.FC<Props> = ({}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [elements, setElements] = useState<Element[]>([]);
  const [currentElementId, setCurrentElementId] = useState("");
  const [scale, setScale] = useState(1);

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsMouseDown(true);
    const id = new Date().getTime().toString();
    const element: Element = {
      id,
      type: "rect",
      width: 0,
      height: 0,
      x: e.clientX,
      y: e.clientY,
    };
    setElements([...elements, element]);
    setCurrentElementId(id);
  };

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    console.log("mouse up");
    setIsMouseDown(false);

    const currentElement = elements.find((element) => element.id === currentElementId);
    if (!currentElement) return;
    if (currentElement.height === 0 || currentElement.width === 0) {
      setElements(elements.filter((element) => element.id !== currentElementId));
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMouseDown) return;

    setElements(
      elements.map((element) => {
        if (element.id !== currentElementId) return element;
        return {
          ...element,
          width: e.clientX - element.x,
          height: e.clientY - element.y,
        };
      })
    );
  };

  useEffect(() => {
    const render = () => {
      const context = canvasRef.current?.getContext("2d");
      if (!context) return;

      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      context.scale(scale, scale);
      elements.forEach((element) => {
        context.fillStyle = "red";
        context.fillRect(element.x, element.y, element.width, element.height);
      });

      // 描画の拡大率をもとに戻す
      context.scale(1 / scale, 1 / scale);
    };

    render();

    const interval = setInterval(() => {
      console.log("update");
      render();
    }, 1000 / 30);
    return () => {
      clearInterval(interval);
    };
  }, [elements, scale]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;

      e.preventDefault();
      setScale((scale) => {
        const scrollAmount = e.deltaY;
        const scaleAmount = 0.1;
        const newScale = scale + (scrollAmount > 0 ? -scaleAmount : scaleAmount);

        if (newScale >= 0.01 && newScale <= 10) {
          return newScale;
        }

        return scale;
      });
    };
    document.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      document.removeEventListener("wheel", onWheel);
    };
  }, [scale]);

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
        height={window.innerHeight}
        width={window.innerWidth}
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
