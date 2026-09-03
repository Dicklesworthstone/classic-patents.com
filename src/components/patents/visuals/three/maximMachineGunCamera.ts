export type MaximMachineGunCameraPreset =
  | "iso"
  | "muzzle_sleeve"
  | "reversing_linkage"
  | "breech_crosshead"
  | "volute_spring"
  | "top";

type MaximMachineGunCameraView = {
  pos: [number, number, number];
  target: [number, number, number];
};

const CAMERA_PRESETS: Record<MaximMachineGunCameraPreset, MaximMachineGunCameraView> = {
  iso: { pos: [2.5, 1.8, 2.5], target: [0, 0, 0.4] },
  muzzle_sleeve: { pos: [0.8, 0.5, 1.6], target: [0, 0.1, 0.9] },
  reversing_linkage: { pos: [1.1, 0.5, 0.7], target: [0, 0.08, 0.5] },
  breech_crosshead: { pos: [-0.6, 0.6, -0.2], target: [0, 0.1, -0.1] },
  volute_spring: { pos: [0.8, 0.5, -0.3], target: [0.1, 0.1, -0.2] },
  top: { pos: [0, 3.5, 0.4], target: [0, 0, 0.4] },
};

const TABLET_ISO: MaximMachineGunCameraView = {
  pos: [1.8, 1.3, 1.85],
  target: [0, -0.05, 0.35],
};
const PHONE_ISO: MaximMachineGunCameraView = {
  pos: [1.8, 1.3, 1.95],
  target: [0, -0.05, 0.35],
};

/** Enlarge the complete gun-and-tripod default on short tablet and phone canvases. */
export function maximCameraForViewport(
  preset: MaximMachineGunCameraPreset,
  viewportWidth: number,
): MaximMachineGunCameraView {
  if (preset !== "iso") return CAMERA_PRESETS[preset];
  if (viewportWidth < 640) return PHONE_ISO;
  if (viewportWidth < 1024) return TABLET_ISO;
  return CAMERA_PRESETS.iso;
}
