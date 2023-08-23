import { OperateObject } from "@/types/OperateObject";
import { atom } from "recoil";

export const operateObjectsAtom = atom<OperateObject[]>({
  key: "operateObject",
  default: [],
});
