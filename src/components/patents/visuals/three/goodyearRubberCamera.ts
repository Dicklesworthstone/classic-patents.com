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

// On the 286 px and 341 px phone canvases, the inherited close isometric view
// cut off the stretched specimen and its tensile grips. This wider low-angle
// overview contains the complete supported apparatus even at λ = 2.5 while
// keeping it beneath the phone's camera and claim controls. It is intentionally
// limited to the overview; the authored inspection presets remain unchanged.
const PHONE_CAMERA_PRESETS: Partial<Record<GoodyearRubberCameraPreset, GoodyearRubberCameraView>> =
  {
    iso: { pos: [30, 20, 35], target: [0, 8, 0] },
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
  return PHONE_CAMERA_PRESETS[preset] ?? GOODYEAR_RUBBER_CAMERA_PRESETS[preset];
}
