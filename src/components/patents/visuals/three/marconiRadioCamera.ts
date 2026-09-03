export type MarconiCameraPreset =
  | "iso"
  | "full_system"
  | "receiver"
  | "spark_gap"
  | "induction_coil"
  | "aerial_monopole"
  | "morse_key"
  | "top";

const CAMERA_PRESETS: Record<
  MarconiCameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [13, 8.5, 15.5], target: [1.8, 0.8, 0] },
  full_system: { pos: [14.2, 9.2, 17], target: [1.8, 0.7, 0] },
  receiver: { pos: [10.2, 1.4, 5.8], target: [6.5, -1.6, 0] },
  spark_gap: { pos: [0, -0.8, 3.8], target: [0, -1.8, 0] },
  induction_coil: { pos: [0, -1.2, -4.5], target: [0, -2.1, -1.8] },
  aerial_monopole: { pos: [-3.5, 3.5, 6.5], target: [-3.5, 2.5, 0] },
  morse_key: { pos: [3.0, -1.5, 2.5], target: [3.0, -2.4, -0.5] },
  top: { pos: [0, 13.5, 0.1], target: [0, 0, 0] },
};

export function marconiViewForViewport(preset: MarconiCameraPreset, viewportWidth: number) {
  const config = CAMERA_PRESETS[preset];
  const multiplier = viewportWidth < 480 ? 1.35 : viewportWidth < 900 ? 1.08 : 1;
  return {
    pos: [
      config.target[0] + (config.pos[0] - config.target[0]) * multiplier,
      config.target[1] + (config.pos[1] - config.target[1]) * multiplier,
      config.target[2] + (config.pos[2] - config.target[2]) * multiplier,
    ] as [number, number, number],
    target: config.target,
  };
}
