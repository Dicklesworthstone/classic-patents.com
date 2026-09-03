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
const COMPACT_VIEW_DISTANCE_MULTIPLIER = 1.9;

// The desktop and tablet overview must show the entire source-described path,
// including End Effector 11 below the wrist. The close-up presets deliberately
// keep their original framing for inspection of a particular shaft or joint.
const FITTED_OVERVIEW: StackhouseSourceCameraView = {
  position: [2.275, 1.515, 2.354],
  target: [0, -0.5, -0.48],
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

  return preset === "overview" ? FITTED_OVERVIEW : selected;
}
