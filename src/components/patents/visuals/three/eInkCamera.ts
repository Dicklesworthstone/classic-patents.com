export type EInkCameraPreset = "iso" | "microcapsule" | "electrodes" | "top";

const CAMERA_PRESETS: Record<
  EInkCameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [4.8, 3.2, 5.4], target: [0, -0.1, 0] },
  microcapsule: { pos: [2.5, 1.8, 3.4], target: [0, 0, 0] },
  electrodes: { pos: [4.4, 3.6, 4.9], target: [0, 0, 0] },
  top: { pos: [0, 6.0, 0.01], target: [0, 0, 0] },
};

export function eInkViewForViewport(preset: EInkCameraPreset, viewportWidth: number) {
  const config = CAMERA_PRESETS[preset];
  const multiplier = viewportWidth < 480 ? (preset === "iso" ? 1.2 : 1.12) : 1;
  return {
    pos: config.pos.map(
      (coordinate, index) =>
        config.target[index] + (coordinate - config.target[index]) * multiplier,
    ) as [number, number, number],
    target: [...config.target] as [number, number, number],
  };
}
