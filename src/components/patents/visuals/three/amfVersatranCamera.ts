export const AMF_VERSATRAN_CAMERA_VIEWS = {
  overview: {
    position: [4.9, 3.1, 5.8] as [number, number, number],
    target: [0, -0.1, 0] as [number, number, number],
  },
  wrist: {
    position: [4.2, 1.8, 2.5] as [number, number, number],
    target: [1.05, 0.15, 0] as [number, number, number],
  },
  programming: {
    position: [3.8, 2.0, -4.5] as [number, number, number],
    target: [0.15, -0.35, -0.45] as [number, number, number],
  },
} as const;

export type AmfVersatranCameraView = keyof typeof AMF_VERSATRAN_CAMERA_VIEWS;

const PHONE_OVERVIEW_TARGET = [0, 0.15, 0] as [number, number, number];

export function amfVersatranViewForViewport(
  view: AmfVersatranCameraView,
  viewportWidth: number,
): { position: [number, number, number]; target: [number, number, number] } {
  const config = AMF_VERSATRAN_CAMERA_VIEWS[view];
  const phoneOverview = viewportWidth < 480 && view === "overview";
  // Phone portrait needs the manipulator legible, not a distant pedestal.
  // Keep enough margin for the full normalized source topology without moving
  // it under the fixed desktop HUD cards.
  const multiplier = phoneOverview ? 1.3 : viewportWidth < 480 ? 1.25 : 1;
  const target = phoneOverview ? PHONE_OVERVIEW_TARGET : config.target;
  return {
    position: [
      target[0] + (config.position[0] - config.target[0]) * multiplier,
      target[1] + (config.position[1] - config.target[1]) * multiplier,
      target[2] + (config.position[2] - config.target[2]) * multiplier,
    ],
    target,
  };
}
