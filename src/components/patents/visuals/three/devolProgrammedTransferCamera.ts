type DevolCameraView = {
  position: [number, number, number];
  target: [number, number, number];
};

/**
 * Keep the full carriage and its long telescoping head in the first frame.
 * The tablet pose is intentionally wider than the desktop inspection view:
 * it keeps the gripper in-frame without changing the exhibit's motion.
 */
export function devolCameraForViewport(viewportWidth: number): DevolCameraView {
  if (viewportWidth < 640) {
    return { position: [7.8, 4.7, 8.4], target: [1.5, 0.95, 0] };
  }
  if (viewportWidth < 1024) {
    return { position: [6.3, 3.75, 6.7], target: [0.65, 0.95, 0] };
  }
  return { position: [5.3, 3.25, 5.6], target: [0.65, 0.95, 0] };
}
