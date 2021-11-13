export type PopoverPlacementName =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

export enum PopoverPositions {
  BOTTOM = "bottom",
  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
}

export type PopoverPlacementPosition =
  | PopoverPositions.BOTTOM
  | PopoverPositions.LEFT
  | PopoverPositions.RIGHT
  | PopoverPositions.TOP;

export enum PopoverAlignments {
  CENTER = "center",
  END = "end",
  START = "start",
}

export type PopoverPlacementAlignment =
  | PopoverAlignments.CENTER
  | PopoverAlignments.END
  | PopoverAlignments.START;

export interface PopoverDimensions {
  left: number;
  top: number;
  width: number;
  height: number;
  placement: PopoverPlacementName;
}

export interface PopoverOptions {
  safeMargin: number;
  viewportWidth: number;
  viewportHeight: number;
  offsetFromTarget: number;
}
