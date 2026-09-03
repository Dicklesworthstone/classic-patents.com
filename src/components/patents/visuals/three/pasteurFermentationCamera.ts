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

export const PASTEUR_FERMENTATION_CAMERA_PRESETS: Record<
  PasteurFermentationCameraPreset,
  PasteurFermentationCameraView
> = {
  // The original [10, 7, 11] -> [0, 0, 0] overview puts Pipe E and its
  // ceiling-hanger envelope above the top edge of the 1216 x 460 desktop
  // canvas. This deliberately modest pullback and raised focus retains the
  // vessel as the visual subject while keeping the complete source-labeled
  // water, gas, and exit apparatus in frame.
  iso: { pos: [11, 7.5, 12], target: [0, 0.8, 0] },
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
