import {
  PopoverAlignments,
  PopoverPositions,
  PopoverPlacementAlignment,
  PopoverPlacementName,
  PopoverDimensions,
  PopoverPlacementPosition,
} from "./types";

const VIEWPORT_SAFE_MARGIN = 10;
const ARROW_SIZE = 20;

export function getViewportWidth(): number {
  return Math.max(
    window.document.documentElement.clientWidth || 0,
    window.innerWidth || 0,
  );
}

export function getViewportHeight(): number {
  return Math.max(
    window.document.documentElement.clientHeight || 0,
    window.innerHeight || 0,
  );
}

function getPlacementName(
  position: PopoverPlacementPosition,
  alignment: PopoverPlacementAlignment,
): PopoverPlacementName {
  return alignment === PopoverAlignments.CENTER
    ? (`${position}` as PopoverPlacementName)
    : (`${position}-${alignment}` as PopoverPlacementName);
}

function getPlacementPosition(
  placement: PopoverPlacementName,
): PopoverPlacementPosition {
  const position = placement.split("-")[0];
  switch (position) {
    case PopoverPositions.BOTTOM:
    case PopoverPositions.LEFT:
    case PopoverPositions.RIGHT:
    case PopoverPositions.TOP:
      return position;
    default:
      break;
  }
  return PopoverPositions.TOP;
}

function getPlacementAlignment(
  placement: PopoverPlacementName,
): PopoverPlacementAlignment {
  const alignment = placement.split("-")[1];
  switch (alignment) {
    case PopoverAlignments.START:
    case PopoverAlignments.END:
      return alignment;
    default:
      break;
  }
  return PopoverAlignments.CENTER;
}

function getOverlayDimensionsForPlacement(
  hostRect: DOMRect,
  overlayRect: DOMRect,
  placement: PopoverPlacementName,
): PopoverDimensions {
  return {
    placement,
    left: getOverlayLeft(hostRect, overlayRect, placement),
    top: getOverlayTop(hostRect, overlayRect, placement),
    width: overlayRect.width,
    height: overlayRect.height,
  };
}

function getOverlayTop(
  hostRect: DOMRect,
  overlayRect: DOMRect,
  placement: PopoverPlacementName,
): number {
  const position = getPlacementPosition(placement);
  const alignment = getPlacementAlignment(placement);
  switch (position) {
    case PopoverPositions.LEFT:
    case PopoverPositions.RIGHT:
      switch (alignment) {
        case PopoverAlignments.START:
          return hostRect.top;
        case PopoverAlignments.END:
          return hostRect.top + hostRect.height - overlayRect.height;
        case PopoverAlignments.CENTER:
        default:
          return hostRect.top + 0.5 * (hostRect.height - overlayRect.height);
      }
    case PopoverPositions.TOP:
      return hostRect.top - overlayRect.height - ARROW_SIZE;
    case PopoverPositions.BOTTOM:
    default:
      return hostRect.top + hostRect.height + ARROW_SIZE;
  }
}

function getOverlayLeft(
  hostRect: DOMRect,
  overlayRect: DOMRect,
  placement: PopoverPlacementName,
): number {
  const position = getPlacementPosition(placement);
  const alignment = getPlacementAlignment(placement);
  switch (position) {
    case PopoverPositions.LEFT:
      return hostRect.left - overlayRect.width - ARROW_SIZE;
    case PopoverPositions.RIGHT:
      return hostRect.left + hostRect.width + ARROW_SIZE;
    case PopoverPositions.TOP:
    case PopoverPositions.BOTTOM:
    default:
      switch (alignment) {
        case PopoverAlignments.START:
          return hostRect.left;
        case PopoverAlignments.END:
          return hostRect.left + hostRect.width - overlayRect.width;
        case PopoverAlignments.CENTER:
        default:
          return hostRect.left + 0.5 * (hostRect.width - overlayRect.width);
      }
  }
}

/**
 * Calculates the corrected popup placement for top and bottom position.
 *
 * @param hostRect
 * @param overlayRect
 * @param placement
 */
export const calculateVerticalPopoverDimensions = (
  hostRect: DOMRect,
  overlayRect: DOMRect,
  placement: PopoverPlacementName,
): PopoverDimensions => {
  const viewportHeight = getViewportHeight();
  const viewportWidth = getViewportWidth();
  const SAFE_TOP = VIEWPORT_SAFE_MARGIN;
  const SAFE_BOTTOM = viewportHeight - VIEWPORT_SAFE_MARGIN;
  const SAFE_LEFT = VIEWPORT_SAFE_MARGIN;
  const SAFE_RIGHT = viewportWidth - VIEWPORT_SAFE_MARGIN;

  let position: PopoverPlacementPosition = getPlacementPosition(placement);
  let alignment: PopoverPlacementAlignment = getPlacementAlignment(placement);
  let dimensions: PopoverDimensions = getOverlayDimensionsForPlacement(
    hostRect,
    overlayRect,
    placement,
  );

  if (position === PopoverPositions.TOP && dimensions.top < SAFE_TOP) {
    position = PopoverPositions.BOTTOM;
  } else if (
    position === PopoverPositions.BOTTOM &&
    dimensions.top + dimensions.height > SAFE_BOTTOM
  ) {
    position = PopoverPositions.TOP;
  }

  if (alignment === PopoverAlignments.END && dimensions.left < SAFE_LEFT) {
    alignment = PopoverAlignments.CENTER;
  }
  if (
    alignment === PopoverAlignments.START &&
    dimensions.left + dimensions.width > SAFE_RIGHT
  ) {
    alignment = PopoverAlignments.CENTER;
  }

  const fixedPlacement = getPlacementName(position, alignment);
  return getOverlayDimensionsForPlacement(
    hostRect,
    overlayRect,
    fixedPlacement,
  );
};

/**
 * Calculates the corrected popup placement for left and right position.
 *
 * @param hostRect
 * @param overlayRect
 * @param placement
 */
export const calculateHorizontalPopoverDimensions = (
  hostRect: DOMRect,
  overlayRect: DOMRect,
  placement: PopoverPlacementName,
): PopoverDimensions => {
  const viewportWidth = getViewportWidth();
  const viewportHeight = getViewportHeight();
  const SAFE_TOP = VIEWPORT_SAFE_MARGIN;
  const SAFE_BOTTOM = viewportHeight - VIEWPORT_SAFE_MARGIN;
  const SAFE_LEFT = VIEWPORT_SAFE_MARGIN;
  const SAFE_RIGHT = viewportWidth - VIEWPORT_SAFE_MARGIN;

  let position: PopoverPlacementPosition = getPlacementPosition(placement);
  let alignment: PopoverPlacementAlignment = getPlacementAlignment(placement);

  let fixedPlacement: PopoverPlacementName = placement;
  let dimensions: PopoverDimensions = getOverlayDimensionsForPlacement(
    hostRect,
    overlayRect,
    placement,
  );

  // 1: left fallback strategy
  if (position === PopoverPositions.LEFT && dimensions.left < SAFE_LEFT) {
    if (
      hostRect.left + hostRect.width + ARROW_SIZE + dimensions.width <=
      SAFE_RIGHT
    ) {
      position = PopoverPositions.RIGHT;
    } else {
      position = PopoverPositions.BOTTOM;
      alignment = PopoverAlignments.CENTER;
    }
    fixedPlacement = getPlacementName(position, alignment);
    dimensions = getOverlayDimensionsForPlacement(
      hostRect,
      overlayRect,
      fixedPlacement,
    );
    position = getPlacementPosition(fixedPlacement);
    alignment = getPlacementAlignment(fixedPlacement);
  }

  // 2: right fallback strategy
  if (
    position === PopoverPositions.RIGHT &&
    dimensions.left + overlayRect.width > SAFE_RIGHT
  ) {
    if (hostRect.left - dimensions.width - ARROW_SIZE >= SAFE_LEFT) {
      position = PopoverPositions.LEFT;
    } else {
      position = PopoverPositions.BOTTOM;
      alignment = PopoverAlignments.CENTER;
    }
    fixedPlacement = getPlacementName(position, alignment);
    dimensions = getOverlayDimensionsForPlacement(
      hostRect,
      overlayRect,
      fixedPlacement,
    );
    position = getPlacementPosition(fixedPlacement);
    alignment = getPlacementAlignment(fixedPlacement);
  }

  if (alignment === PopoverAlignments.END && dimensions.top < SAFE_TOP) {
    alignment = PopoverAlignments.CENTER;
  }
  if (
    alignment === PopoverAlignments.START &&
    dimensions.top + dimensions.height > SAFE_BOTTOM
  ) {
    alignment = PopoverAlignments.CENTER;
  }

  fixedPlacement = getPlacementName(position, alignment);
  return getOverlayDimensionsForPlacement(
    hostRect,
    overlayRect,
    fixedPlacement,
  );
};

/**
 * Adjusts the horizontal alignment of top/bottom placements to fit in viewport.
 *
 * @param dimensions
 */
export const fixPopoverDimensionsHorizontally = (
  dimensions: PopoverDimensions,
): PopoverDimensions => {
  const viewportWidth = getViewportWidth();
  const SAFE_LEFT = VIEWPORT_SAFE_MARGIN;
  const SAFE_RIGHT = viewportWidth - VIEWPORT_SAFE_MARGIN;
  const fixedDimensions: PopoverDimensions = {
    ...dimensions,
  };
  if (fixedDimensions.left < SAFE_LEFT) {
    fixedDimensions.left = SAFE_LEFT;
  } else if (fixedDimensions.left + fixedDimensions.width > SAFE_RIGHT) {
    fixedDimensions.left = Math.max(
      SAFE_LEFT,
      SAFE_RIGHT - fixedDimensions.width,
    );
  }
  return fixedDimensions;
};

/**
 * Adjusts the vertical alignment of left/right placements to fit in viewport.
 *
 * @param dimensions
 */
export const fixPopoverDimensionsVertically = (
  dimensions: PopoverDimensions,
): PopoverDimensions => {
  const viewportHeight = getViewportHeight();
  const SAFE_TOP = VIEWPORT_SAFE_MARGIN;
  const SAFE_BOTTOM = viewportHeight - VIEWPORT_SAFE_MARGIN;
  const fixedDimensions: PopoverDimensions = {
    ...dimensions,
  };
  if (fixedDimensions.top < SAFE_TOP) {
    fixedDimensions.top = SAFE_TOP;
  } else if (fixedDimensions.top + fixedDimensions.height > SAFE_BOTTOM) {
    fixedDimensions.top = Math.max(
      SAFE_TOP,
      SAFE_BOTTOM - fixedDimensions.height,
    );
  }
  return fixedDimensions;
};

export const calculatePopoverDimensions = (
  hostRect: DOMRect,
  overlayRect: DOMRect,
  placement: PopoverPlacementName,
): PopoverDimensions => {
  let position: PopoverPlacementPosition = getPlacementPosition(placement);
  let dimensions: PopoverDimensions;
  let fixedPlacement: PopoverPlacementName = placement;
  if (
    position === PopoverPositions.LEFT ||
    position === PopoverPositions.RIGHT
  ) {
    dimensions = calculateHorizontalPopoverDimensions(
      hostRect,
      overlayRect,
      placement,
    );
    fixedPlacement = dimensions.placement;
    position = getPlacementPosition(fixedPlacement);
  }
  if (
    position === PopoverPositions.TOP ||
    position === PopoverPositions.BOTTOM
  ) {
    dimensions = calculateVerticalPopoverDimensions(
      hostRect,
      overlayRect,
      fixedPlacement,
    );
  }
  switch (position) {
    case PopoverPositions.LEFT:
    case PopoverPositions.RIGHT:
      return fixPopoverDimensionsVertically(dimensions);
    case PopoverPositions.TOP:
    case PopoverPositions.BOTTOM:
    default:
      return fixPopoverDimensionsHorizontally(dimensions);
  }
};
