export type MergenthalerLinotypeCameraPreset =
  | "iso"
  | "matrix_magazine"
  | "casting_pot"
  | "spaceband_justifier"
  | "keyboard"
  | "top";

type CameraView = { pos: [number, number, number]; target: [number, number, number] };

export const MERGENTHALER_LINOTYPE_CAMERA_PRESETS: Record<
  MergenthalerLinotypeCameraPreset,
  CameraView
> = {
  // The first desktop frame must read as a machine, rather than a small silhouette
  // in an empty studio. Aim a little above the plinth so the complete linecaster
  // remains clear of the view controls while its working organs are inspectable.
  iso: { pos: [9.2, 7.1, 10.5], target: [0, 0.8, 0] },
  matrix_magazine: { pos: [0, 4.2, 3.8], target: [0, 2.2, 0] },
  casting_pot: { pos: [-2.8, 0.5, 3.5], target: [-1.5, -0.4, 0] },
  spaceband_justifier: { pos: [0, 0.8, 3.2], target: [0, 0.2, 0] },
  keyboard: { pos: [0, 1.2, 3.4], target: [0, -0.6, 1.4] },
  top: { pos: [0, 14.0, 0.1], target: [0, 0, 0] },
};

const TABLET_ISO: CameraView = { pos: [9.2, 6.7, 10.6], target: [0, 1, 0] };
const PHONE_ISO: CameraView = { pos: [10, 7.2, 11.5], target: [0, 1, 0] };

/** Keep the full linecaster readable on touch canvases without changing inspection close-ups. */
export function linotypeCameraForViewport(
  preset: MergenthalerLinotypeCameraPreset,
  viewportWidth: number,
): CameraView {
  if (preset !== "iso") return MERGENTHALER_LINOTYPE_CAMERA_PRESETS[preset];
  if (viewportWidth < 640) return PHONE_ISO;
  if (viewportWidth < 1024) return TABLET_ISO;
  return MERGENTHALER_LINOTYPE_CAMERA_PRESETS.iso;
}
