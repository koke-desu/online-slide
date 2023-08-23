"use client";
import { canvasElementsAtom } from "@/store/canvasElements";
import { selectedElementSelector } from "@/store/selectedElement";
import { CanvasElement } from "@/types/CanvasElement";
import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ParameterInput from "../ParameterInput";
type Props = {};

const RightControlPanel: React.FC<Props> = ({}) => {
  const selectedElement = useRecoilValue(selectedElementSelector);
  const [inputElement, setInputElement] = useState<CanvasElement | null>(
    selectedElement ? { ...selectedElement } : null
  );
  const setElements = useSetRecoilState(canvasElementsAtom);

  useEffect(() => {
    setInputElement(selectedElement ? { ...selectedElement } : null);
  }, [selectedElement]);

  if (!selectedElement || !inputElement)
    return <div className="w-60 h-full absolute top-0 right-0 bg-white z-10 flex flex-col"></div>;

  const updateElement = (val: Partial<{ [key in keyof CanvasElement]: CanvasElement[key] }>) => {
    setElements((elements) =>
      elements.map((element) => (element.id === inputElement.id ? { ...element, ...val } : element))
    );
  };

  return (
    <div className="w-60 h-full absolute top-0 right-0 bg-white z-10 flex flex-col">
      <div className="w-full p-4 grid grid-cols-2 gap-2">
        <ParameterInput
          value={selectedElement.x}
          onSubmit={(val) => updateElement({ x: val })}
          label="X"
        />
        <ParameterInput
          value={selectedElement.y}
          onSubmit={(val) => updateElement({ y: val })}
          label="Y"
        />
        <ParameterInput
          value={selectedElement.width}
          onSubmit={(val) => updateElement({ width: val })}
          label="W"
        />
        <ParameterInput
          value={selectedElement.height}
          onSubmit={(val) => updateElement({ height: val })}
          label="H"
        />
      </div>
    </div>
  );
};
export default RightControlPanel;

//
