export const LEMELSON_ADJUSTABLE_MANIPULATOR_CAMERA_VIEWS = {
  overview: {
    // The first read has to show the complete rail-to-jaw load path, but the
    // old distant overview reduced the claimed wrist and gripping jaw to a
    // few pixels against the gantry. This remains wide enough for both
    // supports while making the articulated end effector inspectable.
    position: [4.9, 3.0, 5.4] as [number, number, number],
    target: [0, 1.15, 0] as [number, number, number],
  },
  gantry: {
    position: [0.0, 3.8, 4.5] as [number, number, number],
    target: [0, 2.0, 0] as [number, number, number],
  },
  wrist: {
    position: [2.5, 0.8, 2.5] as [number, number, number],
    target: [0.5, 0.2, 0] as [number, number, number],
  },
} as const;

export type LemelsonAdjustableManipulatorCameraView =
  keyof typeof LEMELSON_ADJUSTABLE_MANIPULATOR_CAMERA_VIEWS;

type CameraView = {
  position: [number, number, number];
  target: [number, number, number];
};

const PHONE_OVERVIEW: CameraView = {
  // A portrait canvas cannot show the seven-unit overhead rail edge-on. This
  // side-biased full-apparatus view keeps the rail, carriage, and suspended
  // wrist in one frame instead of clipping both gantry supports.
  position: [12.8, 7.0, 5.8],
  target: [0, 1.0, 0],
};

const TABLET_OVERVIEW: CameraView = {
  position: [7.4, 4.6, 8.0],
  target: [0, 1.0, 0],
};

const PHONE_WRIST: CameraView = {
  position: [1.9, 0.65, 2.0],
  target: [0.33, -0.3, 0],
};

export function lemelsonAdjustableManipulatorViewForViewport(
  view: LemelsonAdjustableManipulatorCameraView,
  viewportWidth: number,
): CameraView {
  if (view === "overview") {
    if (viewportWidth < 480) return PHONE_OVERVIEW;
    if (viewportWidth < 880) return TABLET_OVERVIEW;
    return LEMELSON_ADJUSTABLE_MANIPULATOR_CAMERA_VIEWS.overview;
  }
  if (viewportWidth >= 880) return LEMELSON_ADJUSTABLE_MANIPULATOR_CAMERA_VIEWS[view];
  if (view === "wrist") return PHONE_WRIST;
  return {
    position: [0, 5.7, 7.0],
    target: LEMELSON_ADJUSTABLE_MANIPULATOR_CAMERA_VIEWS.gantry.target,
  };
}
