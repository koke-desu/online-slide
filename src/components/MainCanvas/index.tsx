"use client";
import React, { useEffect, useRef, useState } from "react";
type Props = {};

type Element = { id: string; type: "rect"; width: number; height: number; x: number; y: number };

const MainCanvas: React.FC<Props> = ({}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [elements, setElements] = useState<Element[]>([]);
  const [currentElementId, setCurrentElementId] = useState("");

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

  const render = () => {
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    elements.forEach((element) => {
      context.fillStyle = "red";
      context.fillRect(element.x, element.y, element.width, element.height);
    });
  };

  useEffect(() => {
    console.log("update");
    render();
  }, [elements]);

  return (
    <canvas
      height={window.innerHeight}
      width={window.innerWidth}
      ref={canvasRef}
      className="absolute top-0 left-0 z-0 bg-gray-200"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    ></canvas>
  );
};
export default MainCanvas;
