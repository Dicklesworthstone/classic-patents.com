export type GliddenBarbedWireCameraPreset =
  | "iso"
  | "barb_lock"
  | "twisting_helix"
  | "takeup_drum"
  | "feed_spools"
  | "top";

export type GliddenBarbedWireCameraView = {
  readonly pos: [number, number, number];
  readonly target: [number, number, number];
};

export const GLIDDEN_BARBED_WIRE_CAMERA_PRESETS: Record<
  GliddenBarbedWireCameraPreset,
  GliddenBarbedWireCameraView
> = {
  iso: { pos: [9.5, 6.5, 10.5], target: [0, 0, 0] },
  barb_lock: { pos: [0, 1.2, 3.2], target: [0, 0.4, 0] },
  twisting_helix: { pos: [-2.5, 1.8, 3.5], target: [-1.0, 0, 0] },
  takeup_drum: { pos: [3.5, 2.0, 4.0], target: [2.2, 0, 0] },
  feed_spools: { pos: [-4.8, 2.0, 3.2], target: [-3.8, 0, -1.2] },
  top: { pos: [0, 11.5, 0.1], target: [0, 0, 0] },
};

const NARROW_PHONE_CANVAS_MAX_WIDTH_PX = 320;
const COMPACT_PHONE_MAX_WIDTH_PX = 480;

// A 320 px phone renders this studio in a 286 × 380 px canvas. The desktop
// overview projects its full bench from -1.13 to +1.41 NDC there: the feed
// support and take-up reel are therefore genuinely cropped, not merely close
// to the edge. Pulling only the overview back keeps both source Fig. 1 working
// ends in view; its detail presets remain deliberately close inspection views.
const COMPACT_ISOMETRIC_DISTANCE_MULTIPLIER = 1.65;
const CLAIM_FOCUS_ISOMETRIC_DISTANCE_MULTIPLIER = 1.2;

export const GLIDDEN_COMPACT_ISOMETRIC_SAFE_ZONE = {
  viewportWidth: 286,
  viewportHeight: 380,
  minX: -0.75,
  maxX: 0.85,
  minY: -0.75,
  maxY: 0.33,
} as const;

function isPortraitPhoneViewport(viewportWidth: number, viewportHeight: number) {
  return (
    viewportWidth > 0 &&
    viewportWidth <= COMPACT_PHONE_MAX_WIDTH_PX &&
    viewportHeight > viewportWidth
  );
}

/** 375 px portrait readers show only the printed-claim wire assembly, not workshop props. */
export function isGliddenCompactClaimViewport(viewportWidth: number, viewportHeight: number) {
  return (
    isPortraitPhoneViewport(viewportWidth, viewportHeight) &&
    viewportWidth > NARROW_PHONE_CANVAS_MAX_WIDTH_PX
  );
}

function pullCameraBack(
  view: GliddenBarbedWireCameraView,
  multiplier: number,
): GliddenBarbedWireCameraView {
  return {
    pos: view.pos.map(
      (coordinate, index) =>
        Math.round((view.target[index] + (coordinate - view.target[index]) * multiplier) * 10000) /
        10000,
    ) as [number, number, number],
    target: [...view.target] as [number, number, number],
  };
}

export function gliddenBarbedWireCameraForViewport(
  preset: GliddenBarbedWireCameraPreset,
  viewportWidth: number,
  viewportHeight: number,
): GliddenBarbedWireCameraView {
  const view = GLIDDEN_BARBED_WIRE_CAMERA_PRESETS[preset];
  if (preset !== "iso" || !isPortraitPhoneViewport(viewportWidth, viewportHeight)) return view;
  return pullCameraBack(
    view,
    isGliddenCompactClaimViewport(viewportWidth, viewportHeight)
      ? CLAIM_FOCUS_ISOMETRIC_DISTANCE_MULTIPLIER
      : COMPACT_ISOMETRIC_DISTANCE_MULTIPLIER,
  );
}
