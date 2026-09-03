export type PasteurFermentationCameraPreset =
  | "iso"
  | "vessel"
  | "nozzle"
  | "generator"
  | "exit_cup"
  | "top";

export type PasteurFermentationCameraView = {
  pos: [number, number, number];
  target: [number, number, number];
};

// The desktop View rail starts 16 px below the canvas edge and is 50 px high
// at the `sm` layout. Keep a small authored buffer below it so the overhead
// Pipe E hanger tips remain readable in the default, controls-max, and
// claim-inverted audit poses rather than disappearing behind the rail.
export const PASTEUR_DESKTOP_VIEW_RAIL_BOTTOM_PX = 68;
export const PASTEUR_DESKTOP_VIEW_RAIL_CLEARANCE_PX = 20;
export const PASTEUR_DESKTOP_SAFE_TOP_PX =
  PASTEUR_DESKTOP_VIEW_RAIL_BOTTOM_PX + PASTEUR_DESKTOP_VIEW_RAIL_CLEARANCE_PX;

export const PASTEUR_FERMENTATION_CAMERA_PRESETS: Record<
  PasteurFermentationCameraPreset,
  PasteurFermentationCameraView
> = {
  // The original [10, 7, 11] -> [0, 0, 0] overview put Pipe E and its
  // ceiling-hanger envelope at the canvas edge. The first pullback still
  // left those source-derived rods behind the desktop View rail. This
  // slightly higher, wider view puts the complete overhead apparatus below
  // that rail while retaining vessel A as the visual subject.
  iso: { pos: [12.5, 8.6, 13.5], target: [0, 2, 0] },
  vessel: { pos: [5.5, 2.8, 7], target: [0, 0.3, 0] },
  nozzle: { pos: [4, 5.5, 5], target: [0, 3.4, 0] },
  generator: { pos: [-7, 1.2, 5], target: [-4.2, -0.7, 0] },
  exit_cup: { pos: [6, 0.2, 5], target: [3.1, -0.8, 0] },
  top: { pos: [0, 12, 0.1], target: [0, 0, 0] },
};

const PHONE_STUDIO_MAX_WIDTH_PX = 480;

// Portrait canvases are narrow enough that the complete pipe, vessel,
// generator, and water cup need a small additional pullback. Keep every
// authored inspection preset intact; only the overview is widened.
const PHONE_CAMERA_PRESETS: Partial<
  Record<PasteurFermentationCameraPreset, PasteurFermentationCameraView>
> = {
  iso: { pos: [11.5, 7.8, 12.7], target: [0, 0.8, 0] },
};

export function pasteurFermentationCameraForViewport(
  preset: PasteurFermentationCameraPreset,
  viewportWidth: number,
): PasteurFermentationCameraView {
  if (viewportWidth > 0 && viewportWidth <= PHONE_STUDIO_MAX_WIDTH_PX) {
    return PHONE_CAMERA_PRESETS[preset] ?? PASTEUR_FERMENTATION_CAMERA_PRESETS[preset];
  }
  return PASTEUR_FERMENTATION_CAMERA_PRESETS[preset];
}
