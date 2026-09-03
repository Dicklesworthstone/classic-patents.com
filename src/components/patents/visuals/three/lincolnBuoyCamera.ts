export type LincolnBuoyCameraPreset =
  | "iso"
  | "bellows_chambers"
  | "pilothouse"
  | "paddlewheel"
  | "keel"
  | "top";

const CAMERA_PRESETS: Record<
  LincolnBuoyCameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [14, 12.2, 16], target: [0, 2.2, 0] },
  bellows_chambers: { pos: [0, -0.8, 6.5], target: [0, -0.5, 0] },
  pilothouse: { pos: [-5.5, 5.0, 5.0], target: [-3.2, 3.5, 0] },
  paddlewheel: { pos: [8.5, 1.2, 3.5], target: [6.8, 0, 0] },
  keel: { pos: [0, -4.5, 8.5], target: [0, -1.0, 0] },
  top: { pos: [0, 13.0, 0.1], target: [0, 0, 0] },
};

export function lincolnBuoyViewForViewport(preset: LincolnBuoyCameraPreset, viewportWidth: number) {
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
