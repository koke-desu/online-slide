import { atom } from "recoil";

type KeyboardState = {
  Shift?: boolean;
  Control?: boolean;
  Alt?: boolean;
};

export const keyboardStateAtom = atom<KeyboardState>({
  key: "keyboardState",
  default: {},
  effects: [
    ({ setSelf }) => {
      if (typeof window === "undefined") return;

      const downHandler = (e: KeyboardEvent) => {
        setSelf((state) => ({
          ...state,
          [e.key]: true,
        }));
      };
      const upHandler = (e: KeyboardEvent) => {
        setSelf((state) => ({
          ...state,
          [e.key]: false,
        }));
      };

      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);

      return () => {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      };
    },
  ],
});
