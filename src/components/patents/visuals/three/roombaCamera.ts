import { ROOMBA_STUDIO_FLOOR_Y } from "./RoombaModel";

export type RoombaCameraPreset = "iso" | "robot_chassis" | "cleaning_path" | "top";

export type RoombaCameraView = {
  readonly pos: [number, number, number];
  readonly target: [number, number, number];
};

/**
 * The shared navigation tape expresses its floor position as display X/Y;
 * Three.js uses X/Z for that same plane.  Keeping this small presentation
 * receipt here lets the desktop teaching camera follow the already-stepped
 * machine without owning or altering its physics state.
 */
export type RoombaCameraFocus = {
  readonly x: number;
  readonly z: number;
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

export function isRoombaDesktopTeachingIsometric(
  preset: RoombaCameraPreset,
  viewportWidth: number,
): boolean {
  return preset === "iso" && viewportWidth >= DESKTOP_STUDIO_MIN_WIDTH_PX;
}

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
  focus?: RoombaCameraFocus,
): RoombaCameraView {
  const usesDesktopTeachingIso = isRoombaDesktopTeachingIsometric(preset, viewportWidth);
  const selected = usesDesktopTeachingIso
    ? DESKTOP_TEACHING_ISOMETRIC
    : ROOMBA_CAMERA_PRESETS[preset];
  const followX = usesDesktopTeachingIso ? (focus?.x ?? 0) : 0;
  const followZ = usesDesktopTeachingIso ? (focus?.z ?? 0) : 0;

  const roundCoord = (n: number) => Math.round(n * 1e6) / 1e6;

  return {
    pos: [
      roundCoord(selected.pos[0] + followX),
      selected.pos[1],
      roundCoord(selected.pos[2] + followZ),
    ],
    target: [
      roundCoord(selected.target[0] + followX),
      selected.target[1],
      roundCoord(selected.target[2] + followZ),
    ],
  };
}
