export type HallAluminiumCameraPreset = "overview" | "anodes" | "molten_bath" | "siphon_tap";

const CAMERA_PRESETS: Record<
  HallAluminiumCameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: { pos: [0, 4.0, 6.2], target: [0, 0, 0] },
  anodes: { pos: [0, 2.0, 2.6], target: [0, 0.5, 0] },
  molten_bath: { pos: [0, 0.9, 3.2], target: [0, -0.2, 0] },
  siphon_tap: { pos: [2.6, 0.6, 2.2], target: [1.8, -0.5, 0] },
};

export function hallViewForViewport(preset: HallAluminiumCameraPreset, viewportWidth: number) {
  const config = CAMERA_PRESETS[preset];
  const multiplier =
    viewportWidth < 480
      ? preset === "overview"
        ? 1.65
        : 1.35
      : viewportWidth < 900
        ? preset === "overview"
          ? 1.25
          : 1.12
        : 1;
  return {
    pos: [
      config.target[0] + (config.pos[0] - config.target[0]) * multiplier,
      config.target[1] + (config.pos[1] - config.target[1]) * multiplier,
      config.target[2] + (config.pos[2] - config.target[2]) * multiplier,
    ] as [number, number, number],
    target: config.target,
  };
}
