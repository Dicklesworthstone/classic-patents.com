export const CRUMP_FDM_CAMERA_VIEWS = {
  isometric: { position: [4.2, 3.6, 4.8], target: [0, 1.4, 0] },
  nozzle: { position: [0.8, 1.6, 1.2], target: [0, 1.3, 0] },
  top: { position: [0.1, 6.2, 0.1], target: [0, 1.5, 0] },
  side: { position: [5.2, 1.4, 0], target: [0, 1.4, 0] },
} as const;

export type CrumpCameraPreset = keyof typeof CRUMP_FDM_CAMERA_VIEWS;

export function crumpViewForViewport(view: CrumpCameraPreset, viewportWidth: number) {
  const config = CRUMP_FDM_CAMERA_VIEWS[view];
  const multiplier = viewportWidth < 480 ? (view === "isometric" ? 1.45 : 1.25) : 1;
  return {
    position: config.position.map(
      (coordinate, index) =>
        config.target[index] + (coordinate - config.target[index]) * multiplier,
    ) as [number, number, number],
    target: [...config.target] as [number, number, number],
  };
}
