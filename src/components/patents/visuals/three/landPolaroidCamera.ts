export type LandPolaroidCameraPreset = "overview" | "rollers" | "pod" | "layers";

export const LAND_POLAROID_CAMERA_PRESETS: Record<
  LandPolaroidCameraPreset,
  { label: string; pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: {
    label: "Claimed Product Assembly",
    pos: [6.6, 5.1, 7.4],
    target: [0, 0.85, 0.4],
  },
  rollers: {
    label: "Supported Roller Nip",
    pos: [4.3, 2.7, 2.6],
    target: [0, 1, 0],
  },
  pod: {
    label: "Container 218",
    pos: [4, 2.4, -2.7],
    target: [0, 0.95, -0.45],
  },
  layers: {
    label: "Transfer Layers",
    pos: [4.2, 2.8, 5.6],
    target: [0, 1, 1.65],
  },
};

export function landPolaroidViewForViewport(preset: LandPolaroidCameraPreset, width: number) {
  const base = LAND_POLAROID_CAMERA_PRESETS[preset];
  const scale = width <= 420 ? 1.65 : width <= 760 ? 1.28 : 1;
  const pos = base.pos.map(
    (coordinate, index) => base.target[index] + (coordinate - base.target[index]) * scale,
  ) as [number, number, number];
  return { pos, target: base.target };
}
