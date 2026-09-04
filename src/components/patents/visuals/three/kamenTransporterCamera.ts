export type KamenTransporterCameraPreset = "overview" | "side" | "balance" | "stairs";

export type KamenTransporterCameraView = {
  pos: [number, number, number];
  target: [number, number, number];
};

export type KamenTransporterOverviewState = "climb" | "transition";

export const KAMEN_TRANSPORTER_CAMERA_PRESETS: Record<
  KamenTransporterCameraPreset,
  KamenTransporterCameraView
> = {
  overview: { pos: [1.8, 1.5, 2.2], target: [0.1, 0.58, 0] },
  side: { pos: [0, 0.65, 2.8], target: [0.1, 0.58, 0] },
  balance: { pos: [1.3, 1.2, 1.7], target: [0, 0.62, 0] },
  stairs: { pos: [1.6, 1.45, 2.25], target: [0.18, 0.58, 0] },
};

// The exact 320px reader viewport gives this studio a 286 × 380px canvas.
// Its desktop overview cuts off the high control mast and transfer terrain.
// Widen only that overview; the dedicated balance/stair close readings and
// all wider viewports preserve their established compositions.
const NARROW_PHONE_CANVAS_MAX_WIDTH_PX = 320;
const NARROW_PHONE_OVERVIEW: KamenTransporterCameraView = {
  pos: [3.2, 2.2, 3.9],
  target: [0.1, 0.62, 0],
};

const DESKTOP_STAIR_OVERVIEW: KamenTransporterCameraView = {
  // Figure 42C's climb pose and Figure 38's transition pose lift the mast
  // above the normal-balance envelope. Pull straight back along the overview
  // sightline rather than moving the source-derived apparatus or clipping its
  // handle at the top of a short desktop canvas.
  pos: [2.14, 1.684, 2.64],
  target: [0.1, 0.58, 0],
};

function needsDesktopStairOverview(
  preset: KamenTransporterCameraPreset,
  viewportWidth: number,
  topologyState: string | undefined,
): topologyState is KamenTransporterOverviewState {
  return (
    preset === "overview" &&
    viewportWidth >= 880 &&
    (topologyState === "climb" || topologyState === "transition")
  );
}

export function kamenTransporterCameraForViewport(
  preset: KamenTransporterCameraPreset,
  viewportWidth: number,
  viewportHeight = Math.max(1, viewportWidth / 1.6),
  topologyState?: string,
): KamenTransporterCameraView {
  const view = KAMEN_TRANSPORTER_CAMERA_PRESETS[preset];
  const isNarrowPhonePortrait =
    preset === "overview" &&
    viewportWidth > 0 &&
    viewportWidth <= NARROW_PHONE_CANVAS_MAX_WIDTH_PX &&
    viewportHeight > viewportWidth;

  if (isNarrowPhonePortrait) return NARROW_PHONE_OVERVIEW;
  return needsDesktopStairOverview(preset, viewportWidth, topologyState)
    ? DESKTOP_STAIR_OVERVIEW
    : view;
}
