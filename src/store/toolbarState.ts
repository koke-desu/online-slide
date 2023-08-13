import { CanvasElementTool } from "@/types/CanvasElementTools";
import { atom } from "recoil";

type ToolbarState = {
  selectedTool: CanvasElementTool;
};

export const toolbarStateAtom = atom<ToolbarState>({
  key: "toolbarState",
  default: {
    selectedTool: "select",
  },
});
