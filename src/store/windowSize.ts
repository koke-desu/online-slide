import { atom } from "recoil";

export const windowSizeAtom = atom({
  key: "windowSize",
  default: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  effects: [
    ({ setSelf }) => {
      if (typeof window === "undefined") return;
      const handler = () => {
        setSelf({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      window.addEventListener("resize", handler);
      return () => {
        window.removeEventListener("resize", handler);
      };
    },
  ],
});
