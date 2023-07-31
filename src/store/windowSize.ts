import { atom } from "recoil";

export const windowSizeState = atom({
  key: "windowSize",
  default: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
});
