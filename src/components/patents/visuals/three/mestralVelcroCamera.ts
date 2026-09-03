const MESTRAL_NARROW_VIEWPORT_MAX_WIDTH_PX = 480;
const MESTRAL_320_CANVAS_MAX_WIDTH_PX = 320;

const DESKTOP_OVERVIEW = {
  cameraPos: [4.5, 0.7, 9.5] as [number, number, number],
  targetPos: [0, -2.7, 0] as [number, number, number],
};

const PHONE_OVERVIEW = {
  cameraPos: [8.6, 2.4, 20.2] as [number, number, number],
  targetPos: [0, -1.9, 0] as [number, number, number],
};

function scaledPhoneOverview(factor: number) {
  return {
    cameraPos: PHONE_OVERVIEW.cameraPos.map(
      (coordinate, index) =>
        PHONE_OVERVIEW.targetPos[index] + (coordinate - PHONE_OVERVIEW.targetPos[index]) * factor,
    ) as [number, number, number],
    targetPos: [...PHONE_OVERVIEW.targetPos] as [number, number, number],
  };
}

export function mestralOverviewCameraForViewport(viewportWidth: number): {
  cameraPos: [number, number, number];
  targetPos: [number, number, number];
} {
  if (viewportWidth < MESTRAL_NARROW_VIEWPORT_MAX_WIDTH_PX) {
    // A 10-unit tape needs a wider initial radius on a portrait canvas. This
    // frames the engaged field and the rising peel flap as one mechanism.
    // The 320 px route leaves a 286 px canvas after its document gutter, so it
    // gets additional clearance for the full lower backing plate.
    return scaledPhoneOverview(viewportWidth < MESTRAL_320_CANVAS_MAX_WIDTH_PX ? 1.4 : 1.25);
  }
  return {
    cameraPos: [...DESKTOP_OVERVIEW.cameraPos],
    targetPos: [...DESKTOP_OVERVIEW.targetPos],
  };
}
