export type SpencerCameraPreset =
  | "iso"
  | "cavity_resonator"
  | "electron_spokes"
  | "waveguide_launch"
  | "transformer"
  | "top";

const CAMERA_PRESETS: Record<
  SpencerCameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [9, 6.5, 9], target: [-1.4, -0.4, 0] },
  cavity_resonator: { pos: [1, 3.2, -6.5], target: [-3.2, -0.1, -2] },
  electron_spokes: { pos: [-3.1, 4, -2], target: [-3.2, -0.1, -2] },
  waveguide_launch: { pos: [4.7, 3.2, 6.5], target: [0.9, -0.05, 0] },
  transformer: { pos: [-10, 2.4, 4.5], target: [-6, -0.84, 0] },
  top: { pos: [-1.4, 12, 0.1], target: [-1.4, -0.4, 0] },
};

export const SPENCER_3D_SOURCE_BOUNDARY =
  "US 2,495,429 establishes the connected dual-oscillator treatment path and a wavelength region, but supplies no tube voltage, magnetic field, RF power, or quantitative magnetron model. The displayed numerical operating point is a modern illustrative scenario only.";

export function spencerViewForViewport(preset: SpencerCameraPreset, viewportWidth: number) {
  const config = CAMERA_PRESETS[preset];
  const multiplier =
    viewportWidth < 480 ? (preset === "iso" ? 2.15 : 1.5) : viewportWidth < 900 ? 1.55 : 1;
  return {
    pos: [
      config.target[0] + (config.pos[0] - config.target[0]) * multiplier,
      config.target[1] + (config.pos[1] - config.target[1]) * multiplier,
      config.target[2] + (config.pos[2] - config.target[2]) * multiplier,
    ] as [number, number, number],
    target: config.target,
  };
}
