export type ColtRevolverCameraPreset =
  | "iso"
  | "cylinder"
  | "lockwork"
  | "sightline"
  | "loading_lever"
  | "top";

type ColtRevolverCameraView = {
  pos: [number, number, number];
  target: [number, number, number];
};

const CAMERA_PRESETS: Record<ColtRevolverCameraPreset, ColtRevolverCameraView> = {
  // Center the long Paterson on its actual grip-to-muzzle envelope. This is
  // deliberately closer than the old overview so its octagonal barrel,
  // engraved cylinder, and walnut grip read as inspectable parts on desktop.
  iso: { pos: [6.1, 3.2, 13.3], target: [3.7, -0.6, 0] },
  cylinder: { pos: [0.0, 1.8, 4.2], target: [0.0, 0.2, 0] },
  lockwork: { pos: [-2.2, 0.8, 3.8], target: [-1.8, -0.4, 0] },
  sightline: { pos: [-5.2, 1.38, 0.0], target: [6.0, 1.25, 0.0] },
  loading_lever: { pos: [3.2, -1.8, 4.5], target: [2.0, -0.4, 0] },
  top: { pos: [1.2, 9.5, 0.05], target: [1.2, 0.0, 0] },
};

const TABLET_ISO_TARGET: ColtRevolverCameraView["target"] = [3.15, -0.5, 0];

// The real narrow-phone canvas is 286 × 420 px. A side-profile fit turns the
// complete Paterson into a thin, left-weighted strip there, so use a moderate
// muzzle-side inspection angle with a slight visual-mass correction toward
// the walnut grip. The full grip-to-muzzle envelope remains inside the field.
const PHONE_PORTRAIT_ISO_TARGET: ColtRevolverCameraView["target"] = [3.65, -0.6, -0.9];
const PHONE_PORTRAIT_ISO_OFFSET: ColtRevolverCameraView["pos"] = [18.36, 8.64, 12.96];
const PHONE_PORTRAIT_REFERENCE_ASPECT = 286 / 420;

// The 341 × 420 px V11 phone canvas has enough horizontal field to show the
// whole arm, but its denser grip and cylinder still read left-heavy when it
// inherits the 320 px target. Shift the focal point toward the grip and step
// back just enough to retain the muzzle-to-grip silhouette with clear margins.
const PHONE_WIDE_PORTRAIT_ISO_TARGET: ColtRevolverCameraView["target"] = [2.2, -0.6, -0.9];
const PHONE_WIDE_PORTRAIT_DISTANCE_MULTIPLIER = 1.2;

/**
 * Keep the desktop overview close enough to inspect finish and engraving,
 * then pull only that overview back by actual canvas aspect ratio. A width
 * breakpoint alone crops the long revolver on portrait tablets.
 */
export function coltRevolverCameraForViewport(
  preset: ColtRevolverCameraPreset,
  viewportWidth: number,
  viewportHeight = Math.max(1, viewportWidth / 1.6),
): ColtRevolverCameraView {
  const config = CAMERA_PRESETS[preset];
  if (preset !== "iso") return config;

  const viewportAspect = viewportWidth / Math.max(viewportHeight, 1);
  if (viewportWidth < 640 && viewportAspect < 1) {
    const isWidePhonePortrait = viewportWidth >= 330 && viewportWidth < 400;
    const target = isWidePhonePortrait ? PHONE_WIDE_PORTRAIT_ISO_TARGET : PHONE_PORTRAIT_ISO_TARGET;
    // Preserve the same composed screen occupancy from 320 px through 375 px
    // phones instead of leaving the additional width as empty sky. The 375 px
    // canvas gets its own mass-balanced target above, rather than inheriting a
    // 320 px composition that leaves too much open field beyond the muzzle.
    const distanceScale = Math.min(1, PHONE_PORTRAIT_REFERENCE_ASPECT / viewportAspect);
    const distanceMultiplier = isWidePhonePortrait ? PHONE_WIDE_PORTRAIT_DISTANCE_MULTIPLIER : 1;
    return {
      pos: [
        target[0] + PHONE_PORTRAIT_ISO_OFFSET[0] * distanceScale * distanceMultiplier,
        target[1] + PHONE_PORTRAIT_ISO_OFFSET[1] * distanceScale * distanceMultiplier,
        target[2] + PHONE_PORTRAIT_ISO_OFFSET[2] * distanceScale * distanceMultiplier,
      ],
      target,
    };
  }

  const isTabletOverview = viewportWidth >= 640 && viewportWidth < 1024;
  const target = isTabletOverview ? TABLET_ISO_TARGET : config.target;
  const overviewDistanceMultiplier = isTabletOverview
    ? 1.55
    : viewportAspect < 0.6
      ? 3.4
      : viewportAspect < 0.9
        ? 2.5
        : viewportAspect < 1.25
          ? 2.1
          : viewportAspect < 1.7
            ? 1.75
            : viewportAspect < 2
              ? 1.3
              : 1;
  return {
    pos: [
      target[0] + (config.pos[0] - config.target[0]) * overviewDistanceMultiplier,
      target[1] + (config.pos[1] - config.target[1]) * overviewDistanceMultiplier,
      target[2] + (config.pos[2] - config.target[2]) * overviewDistanceMultiplier,
    ],
    target,
  };
}
