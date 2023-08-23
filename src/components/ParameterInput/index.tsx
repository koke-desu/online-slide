import React, { useEffect, useState } from "react";
type Props = {
  value: number;
  onSubmit: (value: number) => void;
  label: string;
};

const ParameterInput: React.FC<Props> = ({ value, onSubmit, label }) => {
  const [inputValue, setInputValue] = useState<number>(value);
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <form
      onSubmit={(e) => {
        onSubmit(inputValue);
        e.preventDefault();
      }}
    >
      <label className="flex px-2 py-1 gap-2 border border-gray-200 rounded-md">
        <span className=" text-gray-600">{label}</span>
        <input
          className="outline-none w-full text-black"
          value={inputValue}
          onChange={(e) => {
            setInputValue(Number(e.target.value));
          }}
          type="number"
        />
      </label>
    </form>
  );
};
export default ParameterInput;
