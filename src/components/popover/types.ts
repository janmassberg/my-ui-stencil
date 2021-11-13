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

export type PopoverPlacementPosition = "top" | "bottom" | "left" | "right";

export type PopoverPlacementAlignment = "start" | "end" | "center";

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
