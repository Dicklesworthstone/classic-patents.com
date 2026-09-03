export const BAER_ODYSSEY_CAMERA_VIEWS = {
  overview: {
    position: [0, 3.25, 5.65] as [number, number, number],
    target: [0, 0.72, 1.05] as [number, number, number],
  },
  tvScreen: {
    position: [0, 1.05, 2.35] as [number, number, number],
    target: [0, 0.83, 0.56] as [number, number, number],
  },
  consoleControls: {
    position: [0, 1.15, 3.2] as [number, number, number],
    target: [0, 0.1, 1.8] as [number, number, number],
  },
  player1: {
    position: [-1.1, 0.85, 3.05] as [number, number, number],
    target: [-1.1, 0.1, 2.2] as [number, number, number],
  },
} as const;

export type BaerOdysseyCameraView = keyof typeof BAER_ODYSSEY_CAMERA_VIEWS;

export function baerViewForViewport(
  view: BaerOdysseyCameraView,
  viewportWidth: number,
): { position: [number, number, number]; target: [number, number, number] } {
  const config = BAER_ODYSSEY_CAMERA_VIEWS[view];
  if (viewportWidth >= 640) return config;
  const multiplier = view === "overview" ? 1.55 : 1.35;
  return {
    position: [
      config.target[0] + (config.position[0] - config.target[0]) * multiplier,
      config.target[1] + (config.position[1] - config.target[1]) * multiplier,
      config.target[2] + (config.position[2] - config.target[2]) * multiplier,
    ],
    target: config.target,
  };
}
