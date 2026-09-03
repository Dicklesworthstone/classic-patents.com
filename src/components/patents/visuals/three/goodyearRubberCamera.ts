export type GoodyearRubberCameraPreset =
  | "iso"
  | "chains"
  | "bridges"
  | "clamps"
  | "stress_vectors"
  | "top";

export type GoodyearRubberCameraView = {
  pos: [number, number, number];
  target: [number, number, number];
};

export const GOODYEAR_RUBBER_CAMERA_PRESETS: Record<
  GoodyearRubberCameraPreset,
  GoodyearRubberCameraView
> = {
  iso: { pos: [6, 4, 7], target: [0, 0, 0] },
  chains: { pos: [0, 1.5, 3.5], target: [0, 0, 0] },
  bridges: { pos: [1.2, 0.8, 2.0], target: [0.5, 0, 0] },
  clamps: { pos: [4.5, 1.5, 3.0], target: [2.5, 0, 0] },
  stress_vectors: { pos: [0, 5.0, 4.0], target: [0, 0, 0] },
  top: { pos: [0, 9.0, 0.1], target: [0, 0, 0] },
};

const DESKTOP_STUDIO_MIN_WIDTH_PX = 1024;
const TABLET_STUDIO_MIN_WIDTH_PX = 600;
const PHONE_375_STUDIO_MIN_WIDTH_PX = 320;

// The prior oblique overview lets the full tensile-test frame and stretched
// polymer network run through the right and lower edge of the wide desktop
// canvas. On a desktop card, use a higher, nearly front-on overview: it holds
// the complete supported λ range inside the canvas while retaining depth in
// the clamps, sulfur bridges, and chains. Compact layouts intentionally keep
// their established composition.
const DESKTOP_CAMERA_PRESETS: Partial<
  Record<GoodyearRubberCameraPreset, GoodyearRubberCameraView>
> = {
  iso: { pos: [2, 7, 18], target: [2, -1.7, 0] },
};

// A tablet canvas is substantially narrower than the desktop card. The desktop
// overview therefore still crops the complete tensile-frame envelope here. A
// centered, elevated view keeps the apparatus legible as one process while
// retaining a real three-dimensional view of the rail, clamps, bridges, and
// chains. Phone widths remain on the established compact composition.
const TABLET_CAMERA_PRESETS: Partial<Record<GoodyearRubberCameraPreset, GoodyearRubberCameraView>> =
  {
    iso: { pos: [0, 10.5, 25], target: [0, -2.1, 0] },
  };

// The 341 px canvas produced by the 375 px phone viewport has enough horizontal
// room for a closer overview. The previous crop-safe pose made the actual
// specimen, polymer chains, and sulfur bridges needlessly small. This reframe
// raises the complete default and primary-control state clear of the phone HUD
// while retaining 25+ px horizontal clearance at the supported λ = 2.5 limit.
// It is intentionally limited to the overview; the authored inspection presets
// remain unchanged.
const PHONE_375_CAMERA_PRESETS: Partial<
  Record<GoodyearRubberCameraPreset, GoodyearRubberCameraView>
> = {
  iso: { pos: [24.5, 15, 29], target: [1, 5, 0] },
};

// The narrower 286 px canvas cannot take the closer 375 px composition at the
// supported maximum extension without clipping a tensile grip. A higher
// oblique pose instead foreshortens the tensile axis: it enlarges the default
// polymer network while preserving the complete λ = 2.5 apparatus and the
// phone control clearances.
const PHONE_CAMERA_PRESETS: Partial<Record<GoodyearRubberCameraPreset, GoodyearRubberCameraView>> =
  {
    iso: { pos: [26, 25, 25], target: [1, 5, 0] },
  };

export function goodyearRubberCameraForViewport(
  preset: GoodyearRubberCameraPreset,
  viewportWidth: number,
): GoodyearRubberCameraView {
  if (viewportWidth >= DESKTOP_STUDIO_MIN_WIDTH_PX) {
    return DESKTOP_CAMERA_PRESETS[preset] ?? GOODYEAR_RUBBER_CAMERA_PRESETS[preset];
  }
  if (viewportWidth >= TABLET_STUDIO_MIN_WIDTH_PX) {
    return TABLET_CAMERA_PRESETS[preset] ?? GOODYEAR_RUBBER_CAMERA_PRESETS[preset];
  }
  if (viewportWidth >= PHONE_375_STUDIO_MIN_WIDTH_PX) {
    return PHONE_375_CAMERA_PRESETS[preset] ?? GOODYEAR_RUBBER_CAMERA_PRESETS[preset];
  }
  return PHONE_CAMERA_PRESETS[preset] ?? GOODYEAR_RUBBER_CAMERA_PRESETS[preset];
}
