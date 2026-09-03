export const CLAVEL_DELTA_ROBOT_CAMERA_VIEWS = {
  overview: {
    // Keep the complete normalized exhibit in frame at every declared arm
    // endpoint: the supported base reaches lower than the movable member,
    // while an Arm 1 extreme moves the outer closure toward the camera edge.
    // This remains a study view, but has enough breathing room that a range
    // control cannot turn a claimed part into a clipped silhouette.
    position: [4.8, 2.3, 5.5] as [number, number, number],
    target: [0, -0.35, 0] as [number, number, number],
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
  // The procedural exhibit includes the fixed-world gantry as well as the
  // source-labelled linkage. The overview must contain that whole connected
  // support envelope at the Arm 1 endpoint, not merely the relaxed pose. A
  // 320 px page gives the canvas roughly 288 px of inner width, so it needs a
  // second, deliberately wider safe frame. Detail views retain their prior
  // closer phone multiplier because they intentionally inspect one feature.
  const multiplier =
    view === "overview"
      ? viewportWidth < 320
        ? 1.48
        : viewportWidth < 480
          ? 1.28
          : 1.15
      : viewportWidth < 480
        ? 1.15
        : 1;
  return {
    position: config.position.map(
      (coordinate, index) =>
        config.target[index] + (coordinate - config.target[index]) * multiplier,
    ) as [number, number, number],
    target: [...config.target] as [number, number, number],
  };
}
