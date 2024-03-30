import { atom } from "recoil";

export const windowSizeAtom = atom({
  key: "windowSize",
  default: {
    width: 0,
    height: 0,
  },
});
