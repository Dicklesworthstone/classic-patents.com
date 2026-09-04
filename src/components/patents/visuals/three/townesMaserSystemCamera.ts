export type TownesMaserSystemCameraPreset =
  | "system"
  | "generator"
  | "modeSelector"
  | "amplifier"
  | "detector";

export type TownesMaserSystemCameraView = {
  readonly pos: [number, number, number];
  readonly target: [number, number, number];
};

export const TOWNES_MASER_DESKTOP_CAMERA_PRESETS: Record<
  TownesMaserSystemCameraPreset,
  TownesMaserSystemCameraView
> = {
  system: { pos: [-0.4, 3.55, 10.1], target: [-0.4, 0, 0] },
  generator: { pos: [-4.1, 2.4, 5.2], target: [-4.1, 0, 0] },
  modeSelector: { pos: [-1.95, 1.35, 3.4], target: [-1.95, 0, 0] },
  amplifier: { pos: [0.15, 2.4, 5.2], target: [0.15, 0, 0] },
  detector: { pos: [3.05, 1.6, 4.1], target: [2.7, 0, 0] },
};

const COMPACT_PHONE_MAX_WIDTH_PX = 480;

// The 320 px phone audit has a 286 x 410 px studio. Its prior system camera
// displayed the entire train only 72 px tall, leaving the resonators and
// optical path too small to read. This oblique overview preserves the full
// apparatus with the source-facing order intact while using 162 px vertically.
const COMPACT_SYSTEM_VIEW: TownesMaserSystemCameraView = {
  pos: [11.6, 12, 14],
  target: [-0.4, 0, 0],
};

export const TOWNES_COMPACT_SYSTEM_SAFE_ZONE = {
  viewportWidth: 286,
  viewportHeight: 410,
  minX: -0.78,
  maxX: 0.9,
  minY: -0.5,
  maxY: 0.34,
  minimumGeneratorWidthPx: 48,
  minimumAmplifierWidthPx: 54,
  minimumDetectorWidthPx: 29,
  minimumModeSelectorWidthPx: 26,
  minimumActiveBeamPathWidthPx: 110,
} as const;

function isPortraitPhoneViewport(viewportWidth: number, viewportHeight: number) {
  return viewportWidth <= COMPACT_PHONE_MAX_WIDTH_PX && viewportHeight > viewportWidth;
}

export function townesMaserSystemCameraForViewport(
  preset: TownesMaserSystemCameraPreset,
  viewportWidth: number,
  viewportHeight: number,
): TownesMaserSystemCameraView {
  return preset === "system" && isPortraitPhoneViewport(viewportWidth, viewportHeight)
    ? COMPACT_SYSTEM_VIEW
    : TOWNES_MASER_DESKTOP_CAMERA_PRESETS[preset];
}
