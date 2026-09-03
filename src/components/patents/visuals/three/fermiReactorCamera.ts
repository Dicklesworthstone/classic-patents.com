export type FermiReactorCameraPreset =
  | "iso"
  | "control_rods"
  | "graphite_core"
  | "enclosure"
  | "detector"
  | "top";

export const FERMI_REACTOR_CAMERA_PRESETS: Record<
  FermiReactorCameraPreset,
  { label: string; pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { label: "Figures 7–8 Assembly", pos: [15, 8, 18], target: [0.8, -0.7, 0] },
  control_rods: {
    label: "Supported Absorber Guides",
    pos: [12.5, 2.8, 7],
    target: [4.3, -0.15, 0],
  },
  graphite_core: { label: "Claim 1 Rod Lattice", pos: [6.8, 1.5, 7], target: [0, -0.8, 0] },
  enclosure: { label: "Source Enclosure", pos: [8.5, 7.5, 10], target: [0, -0.4, 0] },
  detector: { label: "Ionization Chamber", pos: [-8.8, 1, 5], target: [-4, -0.5, 0.8] },
  top: { label: "Top Opening 20", pos: [0, 13, 0.1], target: [0, -0.7, 0] },
};

export function fermiReactorViewForViewport(preset: FermiReactorCameraPreset, width: number) {
  const base = FERMI_REACTOR_CAMERA_PRESETS[preset];
  const scale = width <= 420 ? 1.28 : width <= 760 ? 1.15 : 1;
  return {
    pos: base.pos.map(
      (coordinate, index) => base.target[index] + (coordinate - base.target[index]) * scale,
    ) as [number, number, number],
    target: base.target,
  };
}
