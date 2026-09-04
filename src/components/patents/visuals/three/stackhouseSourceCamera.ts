export type StackhouseSourceCameraPreset = "overview" | "shafts" | "pointP" | "tool";

export type StackhouseSourceCameraView = {
  readonly position: [number, number, number];
  readonly target: [number, number, number];
};

const SOURCE_VIEWS: Record<StackhouseSourceCameraPreset, StackhouseSourceCameraView> = {
  overview: {
    position: [1.75, 1.05, 1.7],
    target: [0, -0.14, -0.48],
  },
  shafts: {
    position: [2.4, 0.72, -1.8],
    target: [0, 0, -0.88],
  },
  pointP: {
    position: [1.45, 0.95, 1.3],
    target: [0, 0, 0.05],
  },
  tool: {
    position: [2.35, 1.55, 2.85],
    target: [0.12, 0.04, 0.52],
  },
};

const COMPACT_STUDIO_MAX_WIDTH_PX = 640;
const DESKTOP_STUDIO_MIN_WIDTH_PX = 900;
const COMPACT_VIEW_DISTANCE_MULTIPLIER = 1.9;

// Tablet keeps the deliberately conservative full-path fit. Its shorter canvas
// must retain the whole wrist, including End Effector 11 below the shafts.
const TABLET_OVERVIEW: StackhouseSourceCameraView = {
  position: [2.275, 1.515, 2.354],
  target: [0, -0.5, -0.48],
};

// A desktop canvas has the room to look more across the forearm instead of
// down its length. That makes the concentric shafts, bevel train, point P, and
// terminal tool materially legible in the overview while retaining clear lanes
// for the top-left source card and bottom-right refusal card.
const DESKTOP_OVERVIEW: StackhouseSourceCameraView = {
  position: [1.05, 2.75, -0.48],
  target: [-0.1, -0.4, -0.48],
};

function pullCameraBack(
  view: StackhouseSourceCameraView,
  multiplier: number,
): StackhouseSourceCameraView {
  return {
    ...view,
    position: [
      view.target[0] + (view.position[0] - view.target[0]) * multiplier,
      view.target[1] + (view.position[1] - view.target[1]) * multiplier,
      view.target[2] + (view.position[2] - view.target[2]) * multiplier,
    ],
  };
}

export function stackhouseSourceCameraForViewport(
  preset: StackhouseSourceCameraPreset,
  viewportWidth: number,
): StackhouseSourceCameraView {
  const selected = SOURCE_VIEWS[preset];

  if (viewportWidth < COMPACT_STUDIO_MAX_WIDTH_PX) {
    // Preserve the already-safe portrait composition across every inspection mode.
    return pullCameraBack(selected, COMPACT_VIEW_DISTANCE_MULTIPLIER);
  }

  if (preset !== "overview") return selected;

  return viewportWidth >= DESKTOP_STUDIO_MIN_WIDTH_PX ? DESKTOP_OVERVIEW : TABLET_OVERVIEW;
}
