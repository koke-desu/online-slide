import React, { useEffect, useState } from "react";
type Props<T extends string | number> = {
  value: T | null;
  onSubmit: (value: T) => void;
  label?: string;
};

const ParameterInput = <T extends string | number>(props: Props<T>) => {
  const { value, onSubmit, label } = props;
  const [inputValue, setInputValue] = useState(value);
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <form
      onSubmit={(e) => {
        onSubmit(inputValue as T);
        e.preventDefault();
      }}
    >
      <label className="flex px-2 py-1 gap-2 border border-gray-200 rounded-md">
        <span className=" text-gray-600">{label}</span>
        <input
          className="outline-none w-full text-black"
          value={inputValue === null ? "mixed" : inputValue}
          onChange={(e) => {
            if (typeof value === "string") setInputValue(e.target.value as unknown as T);
            if (typeof value === "number") setInputValue(Number(e.target.value) as unknown as T);
          }}
          type={typeof value === "string" ? "text" : "number"}
        />
      </label>
    </form>
  );
};
export default ParameterInput;
