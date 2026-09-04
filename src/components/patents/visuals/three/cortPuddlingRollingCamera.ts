export type CortPuddlingRollingCameraPreset =
  | "iso"
  | "furnace"
  | "hearth"
  | "mill"
  | "grooves"
  | "drive";

const CAMERA_PRESETS: Record<
  CortPuddlingRollingCameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  // The 3.6-unit stack is part of the overview, not an expendable edge
  // detail. Keep its full envelope inside the studio frame above the furnace
  // and mill rather than letting the canvas crop it at the top edge.
  iso: { pos: [0, 4.4, 10.6], target: [0, 1.35, 0] },
  furnace: { pos: [-2.8, 2.2, 3.8], target: [-2.8, 1.2, 0] },
  hearth: { pos: [-2.5, 1.8, 1.6], target: [-2.5, 0.9, 0] },
  mill: { pos: [2.0, 1.8, 3.6], target: [2.0, 1.1, 0] },
  grooves: { pos: [2.0, 1.3, 1.8], target: [2.0, 1.0, 0] },
  drive: { pos: [5.0, 1.8, 2.4], target: [3.0, 1.05, 0] },
};

const PHONE_OVERVIEW = {
  // The actual process bounds run from the furnace at x=-4.6 to the mill at
  // x=3.2. Centre that envelope, not the world origin, in portrait framing.
  pos: [-0.7, 5.5, 13.0] as [number, number, number],
  target: [-0.7, 1.8, 0] as [number, number, number],
};

/** Keep the complete furnace-to-mill process visible in the narrow overview. */
export function cortPuddlingRollingViewForViewport(
  preset: CortPuddlingRollingCameraPreset,
  viewportWidth: number,
): { pos: [number, number, number]; target: [number, number, number] } {
  const config = CAMERA_PRESETS[preset];
  if (viewportWidth < 480 && preset === "iso") return PHONE_OVERVIEW;
  const target = [...config.target] as [number, number, number];
  return {
    pos: [...config.pos] as [number, number, number],
    target,
  };
}
