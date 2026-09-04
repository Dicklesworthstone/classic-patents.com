export type HopkinsPotashCameraPreset =
  | "iso"
  | "furnace"
  | "leaching"
  | "settling"
  | "crystallizer"
  | "fluxing"
  | "top";

const CAMERA_PRESETS: Record<
  HopkinsPotashCameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [4.6, 3.0, 4.8], target: [0.1, 0.7, 0] },
  furnace: { pos: [-1.8, 1.5, 2.7], target: [-1.8, 0.65, 0] },
  leaching: { pos: [-0.65, 1.4, 2.3], target: [-0.65, 0.58, 0] },
  settling: { pos: [0.32, 1.55, 2.75], target: [0.32, 0.48, 0] },
  crystallizer: { pos: [1.25, 1.4, 2.2], target: [1.25, 0.52, 0] },
  fluxing: { pos: [2.18, 1.3, 2.1], target: [2.18, 0.5, 0] },
  top: { pos: [0, 6.0, 0.1], target: [0, 0, 0] },
};

const PHONE_OVERVIEW = {
  // Pull back along the same oblique reading axis so the complete supported
  // foundation—from the furnace through optional fluxing—fits at 320 px.
  pos: [5.9, 4.0, 6.4] as [number, number, number],
  target: [0.1, 0.75, 0] as [number, number, number],
};

export function hopkinsPotashViewForViewport(
  preset: HopkinsPotashCameraPreset,
  viewportWidth: number,
): { pos: [number, number, number]; target: [number, number, number] } {
  const view = viewportWidth < 480 && preset === "iso" ? PHONE_OVERVIEW : CAMERA_PRESETS[preset];
  return {
    pos: [...view.pos] as [number, number, number],
    target: [...view.target] as [number, number, number],
  };
}
