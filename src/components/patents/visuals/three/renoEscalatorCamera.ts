export type RenoCameraPreset =
  | "iso"
  | "comb_plates"
  | "cleated_deck"
  | "handrail"
  | "top_drive"
  | "top";

export const RENO_CAMERA_PRESETS: Record<
  RenoCameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [9.5, 6.5, 10.5], target: [0, 0, 0] },
  comb_plates: { pos: [7.3, 4.1, 5.3], target: [5.0, 2.1, 0] },
  cleated_deck: { pos: [4.5, 5.4, 9.5], target: [0, -0.2, 0] },
  handrail: { pos: [-5.5, 4.8, 8.0], target: [-1.0, 0.8, 1.2] },
  top_drive: { pos: [8.0, 4.0, 7.0], target: [5.2, 2.8, 0] },
  top: { pos: [0, 14.0, 0.1], target: [0, 0, 0] },
};

export type RenoCameraView = (typeof RENO_CAMERA_PRESETS)[RenoCameraPreset];

// V26's exact 320px browser viewport presents a 286 × 380px studio canvas.
// The normal overview crops both the top terminal and the bottom return at
// that narrow portrait field of view. Pull only this reader-facing overview
// back around the complete source-model envelope; desktop, tablet, and close
// inspection presets remain their established source-reading compositions.
const NARROW_PHONE_CANVAS_MAX_WIDTH_PX = 320;
const NARROW_PHONE_ISO: RenoCameraView = {
  pos: [18.0, 10.0, 20.0],
  target: [0.5, 1.0, 0],
};

export function renoCameraForViewport(
  preset: RenoCameraPreset,
  viewportWidth: number,
  viewportHeight = Math.max(1, viewportWidth / 1.6),
): RenoCameraView {
  const view = RENO_CAMERA_PRESETS[preset];
  const isNarrowPhonePortrait =
    preset === "iso" &&
    viewportWidth > 0 &&
    viewportWidth <= NARROW_PHONE_CANVAS_MAX_WIDTH_PX &&
    viewportHeight > viewportWidth;

  return isNarrowPhonePortrait ? NARROW_PHONE_ISO : view;
}
