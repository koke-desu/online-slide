export const operateObjectTypes = [
  "resize_left",
  "resize_right",
  "resize_top",
  "resize_bottom",
  "resize_left_top",
  "resize_left_bottom",
  "resize_right_top",
  "resize_right_bottom",
  "round_left_top",
  "round_left_bottom",
  "round_right_top",
  "round_right_bottom",
] as const;
export type OperateObjectType = (typeof operateObjectTypes)[number];

export type OperateObject = {
  type: OperateObjectType;
  width: number;
  height: number;
  x: number;
  y: number;
};
