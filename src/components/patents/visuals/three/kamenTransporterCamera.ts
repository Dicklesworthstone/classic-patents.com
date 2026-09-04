export type KamenTransporterCameraPreset = "overview" | "side" | "balance" | "stairs";

export type KamenTransporterCameraView = {
  pos: [number, number, number];
  target: [number, number, number];
};

export const KAMEN_TRANSPORTER_CAMERA_PRESETS: Record<
  KamenTransporterCameraPreset,
  KamenTransporterCameraView
> = {
  overview: { pos: [1.8, 1.5, 2.2], target: [0.1, 0.58, 0] },
  side: { pos: [0, 0.65, 2.8], target: [0.1, 0.58, 0] },
  balance: { pos: [1.3, 1.2, 1.7], target: [0, 0.62, 0] },
  stairs: { pos: [1.6, 1.45, 2.25], target: [0.18, 0.58, 0] },
};

// The exact 320px reader viewport gives this studio a 286 × 380px canvas.
// Its desktop overview cuts off the high control mast and transfer terrain.
// Widen only that overview; the dedicated balance/stair close readings and
// all wider viewports preserve their established compositions.
const NARROW_PHONE_CANVAS_MAX_WIDTH_PX = 320;
const NARROW_PHONE_OVERVIEW: KamenTransporterCameraView = {
  pos: [3.2, 2.2, 3.9],
  target: [0.1, 0.62, 0],
};

export function kamenTransporterCameraForViewport(
  preset: KamenTransporterCameraPreset,
  viewportWidth: number,
  viewportHeight = Math.max(1, viewportWidth / 1.6),
): KamenTransporterCameraView {
  const view = KAMEN_TRANSPORTER_CAMERA_PRESETS[preset];
  const isNarrowPhonePortrait =
    preset === "overview" &&
    viewportWidth > 0 &&
    viewportWidth <= NARROW_PHONE_CANVAS_MAX_WIDTH_PX &&
    viewportHeight > viewportWidth;

  return isNarrowPhonePortrait ? NARROW_PHONE_OVERVIEW : view;
}
