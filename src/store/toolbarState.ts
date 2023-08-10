import { atom } from "recoil";

export const Tools = ["select", "rectangle", "circle", "line"] as const;

type ToolbarState = {
  selectedTool: (typeof Tools)[number];
};

export const toolbarStateAtom = atom<ToolbarState>({
  key: "toolbarState",
  default: {
    selectedTool: "select",
  },
});
