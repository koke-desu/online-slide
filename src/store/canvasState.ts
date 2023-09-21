import { atom, selector } from "recoil";
import { mouseStateAtom } from "./mouseState";

// ページのヘッダーの高さ。Canvasがこれに被らないように表示されているので、考慮する必要あり。
const HEADER_HEIGHT = 48;

type CanvasState = {
  ctx: CanvasRenderingContext2D | null;
  scale: number;
  translate: { x: number; y: number };
};

export const canvasStateAtom = atom<CanvasState>({
  key: "canvasState",
  default: {
    ctx: null,
    scale: 1,
    translate: { x: 0, y: 0 },
  },
  effects: [
    ({ setSelf }) => {
      if (typeof document === "undefined") return;

      const onWheel = (e: WheelEvent) => {
        if (!e.ctrlKey) return;

        e.preventDefault();
        setSelf((_) => {
          const state = _ as CanvasState;
          const scrollAmount = e.deltaY;
          const scaleAmount = 0.1;
          const newScale = state.scale + (scrollAmount > 0 ? -scaleAmount : scaleAmount);

          if (newScale >= 0.01 && newScale <= 10) {
            return { ...state, scale: newScale };
          }

          return { ...state, scale: newScale };
        });
      };

      document.addEventListener("wheel", onWheel, { passive: false });

      return () => {
        document.removeEventListener("wheel", onWheel);
      };
    },
  ],
});

export const canvasMousePositionSelector = selector({
  key: "canvasMousePosition",
  get: ({ get }) => {
    const { scale, translate } = get(canvasStateAtom);
    const {
      position: { clientX, clientY },
    } = get(mouseStateAtom);

    return {
      x: (clientX - translate.x) / scale,
      y: (clientY - translate.y - HEADER_HEIGHT) / scale,
    };
  },
});
