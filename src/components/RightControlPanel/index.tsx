"use client";
import { canvasElementsAtom } from "@/store/canvasElements";
import { selectedElementSelector } from "@/store/selectedElement";
import { CanvasElement } from "@/types/CanvasElement";
import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
type Props = {};

const RightControlPanel: React.FC<Props> = ({}) => {
  const selectedElement = useRecoilValue(selectedElementSelector);
  const [inputElement, setInputElement] = useState<CanvasElement | null>(
    selectedElement ? { ...selectedElement } : null
  );
  const setElements = useSetRecoilState(canvasElementsAtom);

  if (!selectedElement || !inputElement)
    return <div className="w-60 h-full absolute top-0 right-0 bg-white z-10 flex flex-col"></div>;

  const updateElement = () => {
    if (!selectedElement || !inputElement) return;
    setElements((elements) =>
      elements.map((element) => (element.id === inputElement.id ? inputElement : element))
    );
  };

  return (
    <div className="w-60 h-full absolute top-0 right-0 bg-white z-10 flex flex-col">
      <div className="w-full p-4 grid grid-cols-2 gap-2">
        <label className="flex px-2 py-1 gap-2 border border-gray-200 rounded-md">
          <span className=" text-gray-600">X</span>
          <input
            className="outline-none w-full"
            value={inputElement.x}
            onChange={(e) => {
              setInputElement({ ...inputElement, x: Number(e.target.value) });
            }}
            onBlur={updateElement}
          />
        </label>
        <label className="flex px-2 py-1 gap-2 border border-gray-200 rounded-md">
          <span className=" text-gray-600">Y</span>
          <input className="outline-none w-full" />
        </label>
      </div>
    </div>
  );
};
export default RightControlPanel;

//
