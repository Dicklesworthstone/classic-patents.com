export type GatlingGunCameraPreset = "iso" | "barrels" | "breech_cam" | "hopper" | "crank" | "top";

export type GatlingGunCameraView = {
  pos: [number, number, number];
  target: [number, number, number];
};

export const GATLING_GUN_CAMERA_PRESETS: Record<GatlingGunCameraPreset, GatlingGunCameraView> = {
  iso: { pos: [9.0, 5.0, 10.0], target: [0, 0, 0] },
  barrels: { pos: [4.5, 1.2, 3.8], target: [2.4, 0.4, 0] },
  breech_cam: { pos: [-2.0, 1.8, 3.2], target: [-0.8, 0.4, 0] },
  hopper: { pos: [-0.8, 3.8, 2.2], target: [-0.6, 1.4, 0] },
  crank: { pos: [-3.6, 1.2, 2.8], target: [-2.4, 0.4, 0.85] },
  top: { pos: [0, 11.0, 0.1], target: [0, 0, 0] },
};

// V26's actual 320px viewport has a 286 × 380px Three.js canvas. The normal
// overview crops the forward barrel cluster there because the narrow portrait
// horizontal FOV cannot contain its full rotating source-model envelope. Only
// this narrow portrait overview moves back; the desktop, tablet, and close
// inspection views retain their existing compositions.
const NARROW_PHONE_CANVAS_MAX_WIDTH_PX = 320;
const NARROW_PHONE_ISO: GatlingGunCameraView = {
  pos: [12.5, 6.7, 13.5],
  target: [0.5, 0.3, 0],
};

export function gatlingGunCameraForViewport(
  preset: GatlingGunCameraPreset,
  viewportWidth: number,
  viewportHeight = Math.max(1, viewportWidth / 1.6),
): GatlingGunCameraView {
  const view = GATLING_GUN_CAMERA_PRESETS[preset];
  const isNarrowPhonePortrait =
    preset === "iso" &&
    viewportWidth > 0 &&
    viewportWidth <= NARROW_PHONE_CANVAS_MAX_WIDTH_PX &&
    viewportHeight > viewportWidth;

  return isNarrowPhonePortrait ? NARROW_PHONE_ISO : view;
}
