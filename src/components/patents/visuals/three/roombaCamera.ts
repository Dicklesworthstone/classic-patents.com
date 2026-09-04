import { ROOMBA_STUDIO_FLOOR_Y } from "./RoombaModel";

export type RoombaCameraPreset = "iso" | "robot_chassis" | "cleaning_path" | "top";

export type RoombaCameraView = {
  readonly pos: [number, number, number];
  readonly target: [number, number, number];
};

export const ROOMBA_CAMERA_PRESETS: Record<RoombaCameraPreset, RoombaCameraView> = {
  iso: {
    pos: [0, 3.2 + ROOMBA_STUDIO_FLOOR_Y, 3.2],
    target: [0, ROOMBA_STUDIO_FLOOR_Y, 0],
  },
  robot_chassis: {
    pos: [0, 1.2 + ROOMBA_STUDIO_FLOOR_Y, 1.5],
    target: [0, ROOMBA_STUDIO_FLOOR_Y, 0],
  },
  cleaning_path: {
    pos: [2.5, 3.5 + ROOMBA_STUDIO_FLOOR_Y, 2.5],
    target: [0, ROOMBA_STUDIO_FLOOR_Y, 0],
  },
  top: {
    pos: [0, 5.5 + ROOMBA_STUDIO_FLOOR_Y, 0.01],
    target: [0, ROOMBA_STUDIO_FLOOR_Y, 0],
  },
};

const DESKTOP_STUDIO_MIN_WIDTH_PX = 900;

// The original room-wide isometric view made the 0.35 m chassis only about
// 45 px across in a desktop canvas. This closer diagonal keeps the complete
// chassis, Claim 1 optical assembly, wheels, and brush legible while placing
// the moving robot in the clear center lane between the bottom HUD cards. The
// room-scale cleaning spiral remains available through its dedicated preset.
const DESKTOP_TEACHING_ISOMETRIC: RoombaCameraView = {
  pos: [0.55, ROOMBA_STUDIO_FLOOR_Y + 0.36, 0.5],
  target: [0.05, ROOMBA_STUDIO_FLOOR_Y - 0.05, 0],
};

export function roombaCameraViewForViewport(
  preset: RoombaCameraPreset,
  viewportWidth: number,
): RoombaCameraView {
  const selected =
    preset === "iso" && viewportWidth >= DESKTOP_STUDIO_MIN_WIDTH_PX
      ? DESKTOP_TEACHING_ISOMETRIC
      : ROOMBA_CAMERA_PRESETS[preset];

  return {
    pos: [...selected.pos] as [number, number, number],
    target: [...selected.target] as [number, number, number],
  };
}
