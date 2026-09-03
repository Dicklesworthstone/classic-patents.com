export type EdisonPhonographCameraPreset =
  | "iso"
  | "stylus_groove"
  | "tinfoil_cylinder"
  | "speaking_tube"
  | "illustrative_drive"
  | "top";

export type EdisonPhonographCameraView = {
  pos: [number, number, number];
  target: [number, number, number];
};

export const EDISON_PHONOGRAPH_CAMERA_PRESETS: Record<
  EdisonPhonographCameraPreset,
  EdisonPhonographCameraView
> = {
  iso: { pos: [9.5, 7.0, 11.0], target: [0, 0, 0] },
  stylus_groove: { pos: [0, 2.2, 3.2], target: [0, 1.2, 0.8] },
  tinfoil_cylinder: { pos: [-1.8, 1.8, 3.8], target: [-0.4, 0.8, 0] },
  speaking_tube: { pos: [2.8, 3.0, 4.0], target: [0, 1.8, 1.8] },
  illustrative_drive: { pos: [-4.5, 2.0, 3.5], target: [-3.5, 0.5, 0] },
  top: { pos: [0, 12.0, 0.1], target: [0, 0, 0] },
};

const PHONE_STUDIO_MAX_WIDTH_PX = 480;

// The common overview at the 320/375 px breakpoints let the wide mouth of the
// illustrative speaking tube leave the left edge of the portrait canvas. Pull
// only that overview back and raise its target enough to retain the cylinder,
// horn, and drive as one readable mechanism. Inspection presets deliberately
// preserve their close source-reading compositions.
const PHONE_CAMERA_PRESETS: Partial<
  Record<EdisonPhonographCameraPreset, EdisonPhonographCameraView>
> = {
  iso: { pos: [15, 10, 17], target: [0.1, 0.4, 0.5] },
};

export function edisonPhonographCameraForViewport(
  preset: EdisonPhonographCameraPreset,
  viewportWidth: number,
): EdisonPhonographCameraView {
  if (viewportWidth > 0 && viewportWidth <= PHONE_STUDIO_MAX_WIDTH_PX) {
    return PHONE_CAMERA_PRESETS[preset] ?? EDISON_PHONOGRAPH_CAMERA_PRESETS[preset];
  }
  return EDISON_PHONOGRAPH_CAMERA_PRESETS[preset];
}
