export const CLAVEL_DELTA_ROBOT_CAMERA_VIEWS = {
  overview: {
    // A closer, centered study view makes both bars in each parallel leg and
    // the movable member readable before a visitor selects a detail view.
    position: [4.8, 2.5, 5.5] as [number, number, number],
    target: [0, -0.15, 0] as [number, number, number],
  },
  platform: {
    position: [2.1, 0.3, 2.7] as [number, number, number],
    target: [0, -0.78, 0] as [number, number, number],
  },
  base: {
    position: [0.05, 4.1, 0.1] as [number, number, number],
    target: [0, 0.2, 0] as [number, number, number],
  },
} as const;

export type ClavelDeltaRobotCameraView = keyof typeof CLAVEL_DELTA_ROBOT_CAMERA_VIEWS;

export function clavelDeltaRobotViewForViewport(
  view: ClavelDeltaRobotCameraView,
  viewportWidth: number,
) {
  const config = CLAVEL_DELTA_ROBOT_CAMERA_VIEWS[view];
  // The closer desktop overview uses more of the visual field. Pull it back
  // on a phone so the complete three-leg closure stays inside a portrait
  // canvas rather than clipping the outer actuators.
  const multiplier = viewportWidth < 480 ? 1.15 : 1;
  return {
    position: config.position.map(
      (coordinate, index) =>
        config.target[index] + (coordinate - config.target[index]) * multiplier,
    ) as [number, number, number],
    target: [...config.target] as [number, number, number],
  };
}
