import { atom } from "recoil";

type MouseState = {
  position: {
    clientX: number;
    clientY: number;
  };
  buttonClicked: {
    left: boolean;
    wheel: boolean;
    right: boolean;
  };
};

export const mouseStateAtom = atom({
  key: "mouseState",
  default: {
    position: {
      clientX: 0,
      clientY: 0,
    },
    buttonClicked: {
      left: false,
      wheel: false,
      right: false,
    },
  },
  effects: [
    ({ setSelf }) => {
      if (typeof window === "undefined") return;

      const handler = (e: MouseEvent) => {
        setSelf((state) => ({
          ...(state as MouseState),
          position: {
            clientX: e.clientX,
            clientY: e.clientY,
          },
        }));
      };
      window.addEventListener("mousemove", handler);
      return () => {
        window.removeEventListener("mousemove", handler);
      };
    },
    ({ setSelf }) => {
      if (typeof window === "undefined") return;

      const handleMouseDown = (e: MouseEvent) => {
        console.log(e.button);
        setSelf((state) => ({
          ...(state as MouseState),
          buttonClicked: {
            left: e.button === 0,
            wheel: e.button === 1,
            right: e.button === 2,
          },
        }));
      };
      const handleMouseUp = (e: MouseEvent) => {
        setSelf((state) => ({
          ...(state as MouseState),
          buttonClicked: {
            left: false,
            wheel: false,
            right: false,
          },
        }));
      };
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    },
  ],
});
