export type EdisonIndicatorCameraPreset = "overview" | "bulb" | "galvanometer" | "regulation";

type EdisonIndicatorCameraView = {
  pos: [number, number, number];
  target: [number, number, number];
};

export const EDISON_INDICATOR_CAMERA_PRESETS: Record<
  EdisonIndicatorCameraPreset,
  EdisonIndicatorCameraView
> = {
  overview: { pos: [0, 2.2, 3.8], target: [0, 0.9, 0] },
  bulb: { pos: [-1.1, 1.2, 2.0], target: [-1.1, 1.15, 0] },
  galvanometer: { pos: [1.0, 1.3, 2.0], target: [1.0, 1.25, 0] },
  regulation: { pos: [1.0, 1.9, 1.4], target: [1.0, 1.8, 0] },
};

const COMPACT_STUDIO_MAX_WIDTH_PX = 640;
const TABLET_STUDIO_MAX_WIDTH_PX = 1024;
const NARROW_PHONE_MAX_WIDTH_PX = 360;

// The wide desktop card otherwise clips the regulator's top post while the
// baseboard has almost no lower clearance. Pull only the overview back; the
// inspection presets intentionally retain their close framing.
const DESKTOP_CAMERA_PRESETS: Partial<
  Record<EdisonIndicatorCameraPreset, EdisonIndicatorCameraView>
> = {
  overview: { pos: [0, 2.6, 5.0], target: [0, 0.9, 0] },
};

// The portrait phone needs a broad overview to retain the lamp-to-indicator
// circuit relationship. Keep that composition unchanged on compact screens.
const MOBILE_CAMERA_PRESETS: Partial<
  Record<EdisonIndicatorCameraPreset, EdisonIndicatorCameraView>
> = {
  overview: { pos: [0, 2.6, 8.0], target: [0, 0.9, 0] },
};

// At 320 px the mahogany baseboard touches both canvas edges despite the
// regular phone view fitting at 375 px. This slightly wider composition keeps
// the complete physical instrument visible without changing the 375 px view.
const NARROW_PHONE_CAMERA_PRESETS: Partial<
  Record<EdisonIndicatorCameraPreset, EdisonIndicatorCameraView>
> = {
  overview: { pos: [0, 3.0, 9.5], target: [0, 0.9, 0] },
};

// A 720 px tablet canvas is both narrower and taller than the desktop card.
// Pull only the default overview back enough to include the galvanometer's
// torsion post and the complete baseboard without weakening the close-up views.
const TABLET_CAMERA_PRESETS: Partial<
  Record<EdisonIndicatorCameraPreset, EdisonIndicatorCameraView>
> = {
  overview: { pos: [0, 2.4, 5.4], target: [0, 1.0, 0] },
};

export function edisonIndicatorCameraForViewport(
  preset: EdisonIndicatorCameraPreset,
  viewportWidth: number,
): EdisonIndicatorCameraView {
  if (viewportWidth > 0 && viewportWidth <= NARROW_PHONE_MAX_WIDTH_PX) {
    return (
      NARROW_PHONE_CAMERA_PRESETS[preset] ??
      MOBILE_CAMERA_PRESETS[preset] ??
      EDISON_INDICATOR_CAMERA_PRESETS[preset]
    );
  }
  if (viewportWidth <= COMPACT_STUDIO_MAX_WIDTH_PX) {
    return MOBILE_CAMERA_PRESETS[preset] ?? EDISON_INDICATOR_CAMERA_PRESETS[preset];
  }
  if (viewportWidth < TABLET_STUDIO_MAX_WIDTH_PX) {
    return TABLET_CAMERA_PRESETS[preset] ?? EDISON_INDICATOR_CAMERA_PRESETS[preset];
  }
  return DESKTOP_CAMERA_PRESETS[preset] ?? EDISON_INDICATOR_CAMERA_PRESETS[preset];
}
