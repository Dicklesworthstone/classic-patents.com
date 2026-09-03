export type MakinoScaraCameraView = "overview" | "plan" | "tool";

type CameraView = {
  position: [number, number, number];
  target: [number, number, number];
};

export const MAKINO_SCARA_CAMERA_VIEWS: Record<MakinoScaraCameraView, CameraView> = {
  overview: {
    // Frame the actual four-bar linkage rather than the decorative studio
    // floor. The lower vantage also keeps the two coaxial drive layers legible.
    position: [2.9, -1.67, 3.4],
    target: [0, -3.52, 0],
  },
  plan: {
    position: [0, 5.43, 0.01],
    target: [0, -3.55, 0],
  },
  tool: {
    position: [1.9, -1.72, 2.55],
    target: [0.15, -3.47, 0.25],
  },
};

const PHONE_OVERVIEW: CameraView = {
  // Preserve a complete, inspectable four-bar closure while leaving a real
  // margin around its finite presentation plinth at 320 px. The plinth itself
  // adapts below, keeping the claimed mechanism at a legible inspection size.
  position: [3.4, -1.8, 4.8],
  target: [0.75, -3.65, 0],
};

const DESKTOP_STUDIO_FLOOR = { radius: 2.8, centerX: 0 };
const PHONE_STUDIO_FLOOR = { radius: 1.4, centerX: 0.75 };

/**
 * The dark circular plinth is a bounded exhibit object, not an infinite
 * ground plane. On a portrait canvas it follows the camera's shifted
 * inspection target and contracts just enough to retain a visible edge.
 */
export function makinoScaraFloorForViewport(viewportWidth: number) {
  return viewportWidth < 480 ? PHONE_STUDIO_FLOOR : DESKTOP_STUDIO_FLOOR;
}

function scaleViewFromTarget(view: CameraView, multiplier: number): CameraView {
  return {
    position: [
      view.target[0] + (view.position[0] - view.target[0]) * multiplier,
      view.target[1] + (view.position[1] - view.target[1]) * multiplier,
      view.target[2] + (view.position[2] - view.target[2]) * multiplier,
    ],
    target: view.target,
  };
}

/**
 * A portrait canvas has a much narrower horizontal field of view than the
 * museum's desktop studio. Pull the camera back responsively instead of
 * clipping the two outer pivots or shrinking the physical model itself.
 */
export function makinoScaraViewForViewport(
  view: MakinoScaraCameraView,
  viewportWidth: number,
): CameraView {
  if (view === "overview" && viewportWidth < 480) return PHONE_OVERVIEW;
  if (viewportWidth >= 880) return MAKINO_SCARA_CAMERA_VIEWS[view];
  const multiplier = viewportWidth < 480 ? 1.42 : view === "overview" ? 1.12 : 1.06;
  return scaleViewFromTarget(MAKINO_SCARA_CAMERA_VIEWS[view], multiplier);
}
