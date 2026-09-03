export type OtisCameraPreset =
  | "overview"
  | "safety"
  | "drive"
  | "interlock"
  | "counterpoise"
  | "top";

export const OTIS_CAMERA_PRESETS: Record<
  OtisCameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: { pos: [10.8, 7.2, 12.8], target: [0, 0.1, 0] },
  safety: { pos: [6.3, 2.8, 6.2], target: [2.25, 1.25, 0] },
  drive: { pos: [-8.6, 3.1, 6.4], target: [-3.2, 0, 0] },
  interlock: { pos: [-5.7, 1.0, 5.1], target: [-2.2, -0.3, 0.4] },
  counterpoise: { pos: [8.0, 3.6, 5.8], target: [4.35, 0.2, 0] },
  top: { pos: [0, 13.6, 0.1], target: [0, 0, 0] },
};

const NARROW_VIEWPORT_MAX_WIDTH_PX = 480;
const OTIS_DESKTOP_OVERVIEW_RADIUS = 13;
const OTIS_NARROW_OVERVIEW_RADIUS = 22;

export function otisOverviewRadiusForViewport(viewportWidthPx: number): number {
  return viewportWidthPx < NARROW_VIEWPORT_MAX_WIDTH_PX
    ? OTIS_NARROW_OVERVIEW_RADIUS
    : OTIS_DESKTOP_OVERVIEW_RADIUS;
}
