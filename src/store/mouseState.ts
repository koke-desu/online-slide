import { atom } from "recoil";

type MouseState = {
  position: {
    clientX: number;
    clientY: number;
  };
  isClicked: boolean;
};

export const mouseStateAtom = atom({
  key: "mouseState",
  default: {
    position: {
      clientX: 0,
      clientY: 0,
    },
    isClicked: false,
  },
  effects: [
    ({ setSelf }) => {
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
      const handleMouseDown = (e: MouseEvent) => {
        setSelf((state) => ({
          ...(state as MouseState),
          isClicked: true,
        }));
      };
      const handleMouseUp = (e: MouseEvent) => {
        setSelf((state) => ({
          ...(state as MouseState),
          isClicked: false,
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
