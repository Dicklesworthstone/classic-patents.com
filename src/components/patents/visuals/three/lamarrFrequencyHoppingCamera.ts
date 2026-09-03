export type LamarrCameraPreset = "iso" | "roll" | "waterfall" | "escapement" | "torpedo" | "top";

const CAMERA_PRESETS: Record<
  LamarrCameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [8, 5.5, 9.5], target: [0, 0, 0] },
  roll: { pos: [-2.5, 1.5, 3.5], target: [-1.5, 0, 0] },
  waterfall: { pos: [0, 2.5, 4.5], target: [0, 0, 0] },
  escapement: { pos: [2.0, 1.0, 3.0], target: [1.5, 0, 0] },
  torpedo: { pos: [4.0, 1.5, 3.5], target: [2.5, 0, 0] },
  top: { pos: [0, 9.0, 0.1], target: [0, 0, 0] },
};

export function lamarrViewForViewport(preset: LamarrCameraPreset, viewportWidth: number) {
  const config = CAMERA_PRESETS[preset];
  const multiplier =
    viewportWidth < 480 ? (preset === "iso" ? 1.55 : 1.3) : viewportWidth < 900 ? 1.15 : 1;
  return {
    pos: [
      config.target[0] + (config.pos[0] - config.target[0]) * multiplier,
      config.target[1] + (config.pos[1] - config.target[1]) * multiplier,
      config.target[2] + (config.pos[2] - config.target[2]) * multiplier,
    ] as [number, number, number],
    target: config.target,
  };
}
