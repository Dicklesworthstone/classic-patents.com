export type DieselEngineCameraPreset =
  | "iso"
  | "cylinder"
  | "injector"
  | "crosshead"
  | "compressor"
  | "flywheel";

type DieselEngineCameraView = {
  pos: [number, number, number];
  target: [number, number, number];
};

const CAMERA_PRESETS: Record<DieselEngineCameraPreset, DieselEngineCameraView> = {
  iso: { pos: [7.5, 3.2, 7.5], target: [-0.2, -0.2, 0] },
  cylinder: { pos: [0.1, 2.4, 3.4], target: [0, 2.0, 0] },
  injector: { pos: [0.1, 4.4, 2.2], target: [0, 3.8, 0] },
  crosshead: { pos: [0.1, -0.4, 3.0], target: [0, -0.6, 0] },
  compressor: { pos: [-3.6, 0.6, -1.8], target: [-1.0, -0.2, -0.8] },
  flywheel: { pos: [4.5, -0.8, 3.8], target: [0, -1.6, 1.6] },
};

/**
 * A portrait canvas has far less horizontal field of view than the desktop
 * studio. Pull the overview back only there, retaining a useful close-up of
 * Cylinder C on a tablet while keeping the flywheel inside a phone frame.
 */
export function dieselCameraPresetForViewport(
  preset: DieselEngineCameraPreset,
  viewportWidth: number,
): DieselEngineCameraView {
  const config = CAMERA_PRESETS[preset];
  if (preset !== "iso" || viewportWidth >= 640) return config;

  const distanceMultiplier = viewportWidth < 260 ? 1.34 : 1.28;
  return {
    pos: [
      config.target[0] + (config.pos[0] - config.target[0]) * distanceMultiplier,
      config.target[1] + (config.pos[1] - config.target[1]) * distanceMultiplier,
      config.target[2] + (config.pos[2] - config.target[2]) * distanceMultiplier,
    ],
    target: config.target,
  };
}
