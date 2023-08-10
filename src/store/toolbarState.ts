import { ElementType, elementTypes } from "@/types/CanvasElement";
import { atom } from "recoil";

export const tools = [...elementTypes, "select"];

type ToolbarState = {
  selectedTool: (typeof tools)[number];
};

export const toolbarStateAtom = atom<ToolbarState>({
  key: "toolbarState",
  default: {
    selectedTool: "select",
  },
});
