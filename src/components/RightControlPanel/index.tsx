"use client";
import React from "react";
type Props = {};

const RightControlPanel: React.FC<Props> = ({}) => {
  return (
    <div className="w-60 h-full absolute top-0 right-0 bg-white z-10 flex flex-col">
      <div className="w-full p-4 grid grid-cols-2 gap-2">
        <label className="flex px-2 py-1 gap-2 border border-gray-200 rounded-md">
          <span className=" text-gray-600">X</span>
          <input className="outline-none w-full" />
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
