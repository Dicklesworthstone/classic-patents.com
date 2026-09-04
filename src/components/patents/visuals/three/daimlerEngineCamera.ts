export type DaimlerEngineCameraPreset =
  | "iso"
  | "motor"
  | "coupling"
  | "reverse"
  | "cooling"
  | "reservoirs"
  | "steering";

export type DaimlerEngineCameraView = {
  pos: [number, number, number];
  target: [number, number, number];
};

export const DAIMLER_ENGINE_CAMERA_PRESETS: Record<
  DaimlerEngineCameraPreset,
  DaimlerEngineCameraView
> = {
  iso: { pos: [10.5, 6.2, 11.5], target: [1, -0.25, 0] },
  motor: { pos: [2.7, 2.7, 5.4], target: [0, 0.25, 0] },
  coupling: { pos: [4.2, 4.2, 4.8], target: [1.45, -0.15, 0] },
  reverse: { pos: [4.5, 4.0, 5.1], target: [1.72, -0.15, 0] },
  cooling: { pos: [-0.5, 3.3, 6.5], target: [0, 0.45, 0.4] },
  reservoirs: { pos: [1.4, 2.6, 6.8], target: [0.5, 0, 0] },
  steering: { pos: [8.6, 3.4, 5.8], target: [4.6, -0.2, 0.5] },
};

const DESKTOP_STUDIO_MIN_WIDTH_PX = 1024;

// The V25 desktop receipt put the complete connected installation at only
// about 372 px wide, with its shaft and rudder emerging beneath the lower
// right telemetry card. This closer, right-aimed overview uses the open
// center lane between the two lower HUD cards: the actual shaft, astern
// train, and rudder remain observable instead of being masked by UI. It is
// intentionally an overview-only desktop adjustment; every inspection and
// compact/tablet pose remains the established source-oriented camera.
const DESKTOP_CAMERA_PRESETS: Partial<Record<DaimlerEngineCameraPreset, DaimlerEngineCameraView>> =
  {
    iso: { pos: [10.5, 4.25, 7.6], target: [4.25, 0, 0] },
  };

export function daimlerEngineCameraForViewport(
  preset: DaimlerEngineCameraPreset,
  viewportWidth: number,
): DaimlerEngineCameraView {
  if (preset === "iso" && viewportWidth >= DESKTOP_STUDIO_MIN_WIDTH_PX) {
    return DESKTOP_CAMERA_PRESETS.iso ?? DAIMLER_ENGINE_CAMERA_PRESETS.iso;
  }
  return DAIMLER_ENGINE_CAMERA_PRESETS[preset];
}
