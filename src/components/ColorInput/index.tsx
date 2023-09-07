import { ElementColor } from "@/types/CanvasElement";
import React from "react";
import ParameterInput from "../ParameterInput";
type Props = {
  value: ElementColor;
  onChange: (color: ElementColor) => void;
};

const ColorInput: React.FC<Props> = ({ value, onChange }) => {
  const hex = value.toHex();

  return (
    <div className="w-full flex">
      <input
        type="color"
        value={hex}
        onChange={(e) => {
          onChange(new ElementColor(e.target.value));
        }}
      />
      <ParameterInput
        value={hex}
        onSubmit={(val) => {
          onChange(new ElementColor(val));
        }}
      />
    </div>
  );
};
export default ColorInput;
