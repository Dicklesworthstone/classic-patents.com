export type WozniakAppleCameraPreset = "iso" | "cpu" | "ram_matrix" | "slots" | "top";

export type WozniakAppleCameraView = {
  pos: [number, number, number];
  target: [number, number, number];
};

export const WOZNIAK_APPLE_CAMERA_PRESETS: Record<
  WozniakAppleCameraPreset,
  WozniakAppleCameraView
> = {
  iso: { pos: [0, 8.0, 9.5], target: [0, 0, 0] },
  cpu: { pos: [-2.5, 3.5, 4.0], target: [-1.2, 0, 0] },
  ram_matrix: { pos: [2.5, 3.5, 4.0], target: [1.2, 0, 0] },
  slots: { pos: [0, 4.0, 5.0], target: [0, 0, 1.5] },
  top: { pos: [0, 11.0, 0.1], target: [0, 0, 0] },
};

// The exact 320px reader viewport leaves a 286 × 380px studio canvas. The
// original desktop overview clips the Apple II's wide motherboard and chassis
// there. Pull back only this narrow portrait overview so the board remains
// legible within its chassis; desktop/tablet and inspection views are intact.
const NARROW_PHONE_CANVAS_MAX_WIDTH_PX = 320;
const NARROW_PHONE_ISO: WozniakAppleCameraView = {
  pos: [0, 18.0, 26.0],
  target: [0, -0.8, 0],
};

export function wozniakAppleCameraForViewport(
  preset: WozniakAppleCameraPreset,
  viewportWidth: number,
  viewportHeight = Math.max(1, viewportWidth / 1.6),
): WozniakAppleCameraView {
  const view = WOZNIAK_APPLE_CAMERA_PRESETS[preset];
  const isNarrowPhonePortrait =
    preset === "iso" &&
    viewportWidth > 0 &&
    viewportWidth <= NARROW_PHONE_CANVAS_MAX_WIDTH_PX &&
    viewportHeight > viewportWidth;

  return isNarrowPhonePortrait ? NARROW_PHONE_ISO : view;
}
