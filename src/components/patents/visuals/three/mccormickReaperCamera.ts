export type McCormickReaperCameraPreset =
  | "iso"
  | "sickle_guards"
  | "grain_reel"
  | "platform"
  | "drive_wheel"
  | "transmission"
  | "top";

export type McCormickReaperCameraView = {
  pos: [number, number, number];
  target: [number, number, number];
};

export const MCCORMICK_REAPER_CAMERA_PRESETS: Record<
  McCormickReaperCameraPreset,
  McCormickReaperCameraView
> = {
  iso: { pos: [10.5, 7.0, 11.0], target: [0, 0, 0] },
  sickle_guards: { pos: [-1.0, 1.0, 4.5], target: [-0.5, -0.6, 1.8] },
  grain_reel: { pos: [2.8, 3.8, 4.0], target: [0, 1.2, 0] },
  platform: { pos: [0, 5.0, 0], target: [0, -0.5, -0.5] },
  drive_wheel: { pos: [-5.0, 1.2, 3.2], target: [-3.2, 0.4, 0] },
  transmission: { pos: [7.4, 2.6, 5.3], target: [3.1, 0.15, 0.85] },
  top: { pos: [0, 13.0, 0.1], target: [0, 0, 0] },
};

const DESKTOP_STUDIO_MIN_WIDTH_PX = 1024;

// The V21 desktop ISO view pushed the reaper's long forward envelope through
// the canvas floor. This is deliberately an overview-only desktop correction:
// it keeps the complete draft tongue, cutter assembly, and reel inside the
// 1214 × 460 audit surface while leaving every inspection preset and compact
// layout at their established poses.
const DESKTOP_CAMERA_PRESETS: Partial<
  Record<McCormickReaperCameraPreset, McCormickReaperCameraView>
> = {
  iso: { pos: [11.7, 7.8, 12.3], target: [0, -0.5, 0] },
};

// The desktop View rail occupies the first 68 px of the 460 px audit canvas.
// Retain a genuine visual buffer below it rather than merely avoiding a one-
// pixel crop. The lower buffer keeps the forward machinery visibly above the
// canvas boundary and control region.
export const MCCORMICK_DESKTOP_VIEW_RAIL_BOTTOM_PX = 68;
export const MCCORMICK_DESKTOP_VIEW_RAIL_CLEARANCE_PX = 20;
export const MCCORMICK_DESKTOP_SAFE_TOP_PX =
  MCCORMICK_DESKTOP_VIEW_RAIL_BOTTOM_PX + MCCORMICK_DESKTOP_VIEW_RAIL_CLEARANCE_PX;
export const MCCORMICK_DESKTOP_LOWER_CLEARANCE_PX = 24;

export function mccormickReaperCameraForViewport(
  preset: McCormickReaperCameraPreset,
  viewportWidth: number,
): McCormickReaperCameraView {
  if (preset === "iso" && viewportWidth >= DESKTOP_STUDIO_MIN_WIDTH_PX) {
    return DESKTOP_CAMERA_PRESETS.iso ?? MCCORMICK_REAPER_CAMERA_PRESETS.iso;
  }
  return MCCORMICK_REAPER_CAMERA_PRESETS[preset];
}
