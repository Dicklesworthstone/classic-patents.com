export type RillieuxEvaporatorCameraPreset = "overview" | "pan1" | "pan2" | "pan3" | "condenser";

export type RillieuxEvaporatorCameraView = {
  readonly label: string;
  readonly pos: [number, number, number];
  readonly target: [number, number, number];
};

export const RILLIEUX_EVAPORATOR_CAMERA_PRESETS: Record<
  RillieuxEvaporatorCameraPreset,
  RillieuxEvaporatorCameraView
> = {
  overview: {
    label: "3-Effect Cascade Overview",
    pos: [0, 8.0, 14.0],
    target: [0, 2.0, 0],
  },
  pan1: {
    label: "Effect 1 (Live Steam)",
    pos: [-4.2, 5.0, 6.0],
    target: [-4.2, 2.2, 0],
  },
  pan2: {
    label: "Effect 2 (Intermediate Vapor)",
    pos: [0, 5.0, 6.0],
    target: [0, 2.2, 0],
  },
  pan3: {
    label: "Effect 3 (Final Concentrate)",
    pos: [4.2, 5.0, 6.0],
    target: [4.2, 2.2, 0],
  },
  condenser: {
    label: "Barometric Condenser",
    pos: [7.5, 4.0, 5.5],
    target: [6.5, 2.0, 0],
  },
};

const COMPACT_STUDIO_MAX_WIDTH_PX = 640;

// A 320 px phone renders this studio in a 286 x 380 px canvas. The original
// overview projects the three-effect train from -1.97 to +1.97 NDC there, so
// it shows only fragments of the outer effects and hides the cascade links.
// Pulling back just the overview retains the purposefully close inspection
// presets while giving the complete heat-reuse path room to read.
const COMPACT_OVERVIEW_DISTANCE_MULTIPLIER = 2.2;

export const RILLIEUX_COMPACT_OVERVIEW_SAFE_ZONE = {
  viewportWidth: 286,
  viewportHeight: 380,
  minX: -0.9,
  maxX: 0.9,
  minY: -0.45,
  maxY: 0.15,
  minimumEffectWidthPx: 40,
  minimumVaporLinkWidthPx: 64,
} as const;

function pullCameraBack(
  view: RillieuxEvaporatorCameraView,
  multiplier: number,
): RillieuxEvaporatorCameraView {
  return {
    ...view,
    pos: view.pos.map(
      (coordinate, index) =>
        Math.round((view.target[index] + (coordinate - view.target[index]) * multiplier) * 10000) /
        10000,
    ) as [number, number, number],
    target: [...view.target] as [number, number, number],
  };
}

export function rillieuxEvaporatorCameraForViewport(
  preset: RillieuxEvaporatorCameraPreset,
  viewportWidth: number,
): RillieuxEvaporatorCameraView {
  const view = RILLIEUX_EVAPORATOR_CAMERA_PRESETS[preset];
  return preset === "overview" && viewportWidth < COMPACT_STUDIO_MAX_WIDTH_PX
    ? pullCameraBack(view, COMPACT_OVERVIEW_DISTANCE_MULTIPLIER)
    : view;
}
