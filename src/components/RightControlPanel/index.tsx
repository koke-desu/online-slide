"use client";
import { canvasElementsAtom } from "@/store/canvasElements";
import { selectedElementSelector } from "@/store/selectedElement";
import { CanvasElement } from "@/types/CanvasElement";
import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ParameterInput from "../ParameterInput";
import ColorInput from "../ColorInput";
type Props = {};

const RightControlPanel: React.FC<Props> = ({}) => {
  const selectedElement = useRecoilValue(selectedElementSelector);
  // 複数選択時は各パラメータが完全に同じなら表示、違うならnull
  const viewParams: { [K in keyof CanvasElement]: CanvasElement[K] | null } = {} as any;
  if (selectedElement) {
    const keys = Object.keys(selectedElement[0]) as (keyof CanvasElement)[];
    for (const key of keys) {
      const val: any = selectedElement[0][key];
      if (selectedElement.every((el) => el[key] === val)) {
        viewParams[key] = val;
      } else {
        viewParams[key] = null;
      }
    }
  }

  const [inputElement, setInputElement] = useState<CanvasElement | CanvasElement[] | null>(
    selectedElement ? { ...selectedElement } : null
  );
  const setElements = useSetRecoilState(canvasElementsAtom);

  useEffect(() => {
    setInputElement(selectedElement ? { ...selectedElement } : null);
  }, [selectedElement]);

  const updateElement = (val: Partial<{ [key in keyof CanvasElement]: CanvasElement[key] }>) => {
    if (!selectedElement) return;

    setElements((elements) =>
      elements.map((element) => {
        if (selectedElement.findIndex((el) => el.id === element.id) !== -1) {
          return { ...element, ...val };
        }
        return element;
      })
    );
  };

  if (!selectedElement || !inputElement || !viewParams)
    return <div className="w-60 h-full absolute top-0 right-0 bg-white z-10 flex flex-col"></div>;

  return (
    <div className="w-60 h-full absolute top-0 right-0 bg-white z-10 flex flex-col">
      <div className="w-full p-4 grid grid-cols-2 gap-2">
        <ParameterInput
          value={viewParams.x}
          onSubmit={(val) => updateElement({ x: val })}
          label="X"
        />
        <ParameterInput
          value={viewParams.y}
          onSubmit={(val) => updateElement({ y: val })}
          label="Y"
        />
        <ParameterInput
          value={viewParams.width}
          onSubmit={(val) => updateElement({ width: val })}
          label="W"
        />
        <ParameterInput
          value={viewParams.height}
          onSubmit={(val) => updateElement({ height: val })}
          label="H"
        />
      </div>
      <div className="w-full p-4">
        <ColorInput value={viewParams.fill} onChange={(color) => updateElement({ fill: color })} />
      </div>
    </div>
  );
};
export default RightControlPanel;

//
