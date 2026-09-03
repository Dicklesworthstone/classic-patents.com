export const METCALFE_ETHERNET_CAMERA_VIEWS = {
  overview: {
    position: [0, 3.2, 5.8] as [number, number, number],
    target: [0, 1.0, 0] as [number, number, number],
  },
  alto1: {
    position: [-2.0, 1.8, 2.2] as [number, number, number],
    target: [-2.0, 1.3, 0.3] as [number, number, number],
  },
  coaxTap: {
    position: [-0.5, 1.0, 0.8] as [number, number, number],
    target: [-0.5, 0.4, -0.5] as [number, number, number],
  },
  alto2: {
    position: [2.0, 1.8, 2.2] as [number, number, number],
    target: [2.0, 1.3, 0.3] as [number, number, number],
  },
} as const;

export type MetcalfeEthernetCameraView = keyof typeof METCALFE_ETHERNET_CAMERA_VIEWS;

export function metcalfeViewForViewport(
  view: MetcalfeEthernetCameraView,
  viewportWidth: number,
): { position: [number, number, number]; target: [number, number, number] } {
  const config = METCALFE_ETHERNET_CAMERA_VIEWS[view];
  if (viewportWidth >= 640) return config;
  const multiplier = view === "overview" ? 1.95 : 1.5;
  return {
    position: [
      config.target[0] + (config.position[0] - config.target[0]) * multiplier,
      config.target[1] + (config.position[1] - config.target[1]) * multiplier,
      config.target[2] + (config.position[2] - config.target[2]) * multiplier,
    ],
    target: config.target,
  };
}
