"use client";
import React, { useEffect, useRef, useState } from "react";
type Props = {};

const MainCanvas: React.FC<Props> = ({}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentMouse, setCurrentMouse] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [downMouse, setDownMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;

    context.fillStyle = "red";
    context.fillRect(100, 100, 300, 300);
  }, []);

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    console.log("mouse down");
    setIsMouseDown(true);
    setDownMouse({ x: e.clientX, y: e.clientY });
  };

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    console.log("mouse up");
    setIsMouseDown(false);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    console.log("mouse move");
    setCurrentMouse({ x: e.clientX, y: e.clientY });

    if (!isMouseDown) return;
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    context.rect(
      downMouse.x,
      downMouse.y,
      currentMouse.x - downMouse.x,
      currentMouse.y - downMouse.y
    );
  };

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
