"use client";
import { tools, toolbarStateAtom } from "@/store/toolbarState";
import React from "react";
import { useRecoilState } from "recoil";
type Props = {};

const HeadToolbar: React.FC<Props> = ({}) => {
  const [toolbar, setToolbar] = useRecoilState(toolbarStateAtom);

  return (
    <div className="h-12 w-full bg-gray-700">
      <div className="h-full w-full flex items-center gap-4 px-4">
        {tools.map((tool) => (
          <button
            key={tool}
            className={`px-4 py-1 ${tool === toolbar.selectedTool ? "bg-white" : ""}`}
            onClick={() => {
              setToolbar({
                ...toolbar,
                selectedTool: tool,
              });
            }}
          >
            {tool}
          </button>
        ))}
      </div>
    </div>
  );
};
export default HeadToolbar;
