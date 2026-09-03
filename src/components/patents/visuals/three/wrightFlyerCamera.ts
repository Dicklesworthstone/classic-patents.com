export type WrightFlyerCameraPreset =
  | "iso"
  | "wing_warp"
  | "canard"
  | "rudder"
  | "engine_props"
  | "top";

const CAMERA_PRESETS: Record<
  WrightFlyerCameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [7.6, 3.2, 8.4], target: [0, 0.15, 0] },
  wing_warp: { pos: [-6.5, 1.8, 4.2], target: [-4.5, 0.2, 0] },
  canard: { pos: [0, 1.2, 5.5], target: [0, 0.4, 2.5] },
  rudder: { pos: [0, 1.4, -6.0], target: [0, 0.4, -2.5] },
  engine_props: { pos: [2.8, 1.2, -1.8], target: [0, 0.2, -0.5] },
  top: { pos: [0, 13.5, 0.1], target: [0, 0, 0] },
};

/**
 * A 375 px viewport is much taller than it is wide. The full 14.15 m wing
 * envelope therefore needs a wider inspection radius than the desktop ISO
 * composition. Detail presets intentionally retain their closer framing.
 */
export function wrightFlyerViewForViewport(
  preset: WrightFlyerCameraPreset,
  viewportWidth: number,
): { pos: [number, number, number]; target: [number, number, number] } {
  const config = CAMERA_PRESETS[preset];
  // The full span has to remain legible before a visitor chooses a close-up.
  // A tablet canvas is substantially narrower than desktop but still uses the
  // same high-detail ISO composition, so it needs its own fit distance rather
  // than falling through to the desktop camera.
  const viewportScale =
    viewportWidth < 480
      ? preset === "iso"
        ? 2.2
        : preset === "top"
          ? 1.85
          : 1
      : viewportWidth < 960 && preset === "iso"
        ? 1.6
        : 1;
  const target = [...config.target] as [number, number, number];

  return {
    pos: [
      target[0] + (config.pos[0] - config.target[0]) * viewportScale,
      target[1] + (config.pos[1] - config.target[1]) * viewportScale,
      target[2] + (config.pos[2] - config.target[2]) * viewportScale,
    ],
    target,
  };
}
