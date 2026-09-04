export type FessendenWirelessCameraPreset =
  | "isometric"
  | "alternator"
  | "cageAntenna"
  | "liquidBarretter";

export type FessendenWirelessCameraView = {
  pos: [number, number, number];
  target: [number, number, number];
};

export const FESSENDEN_WIRELESS_CAMERA_PRESETS: Record<
  FessendenWirelessCameraPreset,
  FessendenWirelessCameraView
> = {
  isometric: { pos: [3.5, 3.0, 4.5], target: [0, 1.2, 0] },
  alternator: { pos: [-1.8, 1.2, 2.0], target: [-1.8, 0.4, 0] },
  cageAntenna: { pos: [0.5, 2.2, 2.5], target: [0.5, 1.8, 0] },
  liquidBarretter: { pos: [2.0, 0.8, 1.2], target: [1.9, 0.3, 0] },
};

const DESKTOP_STUDIO_MIN_WIDTH_PX = 1024;

// The original overview was composed for a taller card. At the real 1216 ×
// 460 desktop canvas, its narrow vertical field put the cage aerial through
// the upper chrome and drove the workbench legs below the canvas. This wider
// desktop-only isometric pose keeps the complete claimed bench apparatus in
// the open band between the controls while retaining a useful oblique view of
// the alternator, tuning coil, cage, and liquid detector. Inspection presets
// and compact layouts deliberately retain their authored close compositions.
const DESKTOP_CAMERA_PRESETS: Partial<
  Record<FessendenWirelessCameraPreset, FessendenWirelessCameraView>
> = {
  isometric: { pos: [4.5, 5.5, 14.4], target: [0, -0.5, 0] },
};

export function fessendenWirelessCameraForViewport(
  preset: FessendenWirelessCameraPreset,
  viewportWidth: number,
): FessendenWirelessCameraView {
  if (viewportWidth >= DESKTOP_STUDIO_MIN_WIDTH_PX) {
    return DESKTOP_CAMERA_PRESETS[preset] ?? FESSENDEN_WIRELESS_CAMERA_PRESETS[preset];
  }
  return FESSENDEN_WIRELESS_CAMERA_PRESETS[preset];
}
