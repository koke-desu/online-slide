export const elementTypes = ["Rectangle", "Circle", "Line"] as const;
export type ElementType = (typeof elementTypes)[number];

export type CanvasElement = {
  id: string;
  element_type: ElementType;
  width: number;
  height: number;
  x: number;
  y: number;
  fill: ElementColor;
  stroke: {
    color: ElementColor;
    width: number;
  };
};

export class ElementColor {
  r = 0;
  g = 0;
  b = 0;
  a = 100;

  constructor(
    rgba: string | { r: number; g: number; b: number; a: number } = { r: 0, g: 0, b: 0, a: 100 }
  ) {
    if (typeof rgba === "string") {
      this.fromHex(rgba);
      return;
    }

    this.r = rgba.r;
    this.g = rgba.g;
    this.b = rgba.b;
    this.a = rgba.a;
  }

  private toHexString = (value: number) => {
    const str = value.toString(16);
    return str.length === 1 ? "0" + str : str;
  };

  toHex() {
    const { r, g, b } = this;
    return "#" + this.toHexString(r) + this.toHexString(g) + this.toHexString(b);
  }

  fromHex(hex: string) {
    this.r = parseInt(hex.slice(1, 3), 16);
    this.g = parseInt(hex.slice(3, 5), 16);
    this.b = parseInt(hex.slice(5, 7), 16);
  }
}
