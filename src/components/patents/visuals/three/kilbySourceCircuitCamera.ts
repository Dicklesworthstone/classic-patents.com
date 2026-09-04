export type KilbySourceCircuitCameraPreset =
  | "figure6a"
  | "wires70"
  | "etchedSlot"
  | "integralRegions";

export type KilbySourceCircuitCameraView = {
  label: string;
  pos: [number, number, number];
  target: [number, number, number];
};

export const KILBY_SOURCE_CIRCUIT_CAMERA_PRESETS: Record<
  KilbySourceCircuitCameraPreset,
  KilbySourceCircuitCameraView
> = {
  figure6a: {
    label: "Fig. 6a Construction",
    pos: [8.7, 7.8, 10.6],
    target: [0, 0.2, 0],
  },
  wires70: {
    label: "Wires 70",
    pos: [1.5, 4.2, 7.4],
    target: [0, 0.35, -0.1],
  },
  etchedSlot: {
    label: "Etched Slot",
    pos: [0, 3.2, 5.2],
    target: [0, 0.25, 1.05],
  },
  integralRegions: {
    label: "Integral Regions",
    pos: [-1.5, 6.8, 3.8],
    target: [0, 0.2, -0.1],
  },
};

// V26's 320px browser viewport provides a 286 × 380px studio canvas. The
// desktop Fig. 6a diagonal makes the source wafer a wide, shallow strip at
// that portrait aspect. This reader-facing overview aligns more of the wafer
// length with the canvas height, keeping the etched regions and Wire 70 arches
// large enough to inspect without cropping their Kovar-lead envelope.
const NARROW_PHONE_CANVAS_MAX_WIDTH_PX = 320;
const NARROW_PHONE_FIGURE_6A: KilbySourceCircuitCameraView = {
  label: "Fig. 6a Construction",
  pos: [14, 15, 12],
  target: [0, 0.25, 0],
};

export function kilbySourceCircuitCameraForViewport(
  preset: KilbySourceCircuitCameraPreset,
  viewportWidth: number,
  viewportHeight = Math.max(1, viewportWidth / 1.6),
): KilbySourceCircuitCameraView {
  const isNarrowPhonePortrait =
    preset === "figure6a" &&
    viewportWidth > 0 &&
    viewportWidth <= NARROW_PHONE_CANVAS_MAX_WIDTH_PX &&
    viewportHeight > viewportWidth;

  return isNarrowPhonePortrait
    ? NARROW_PHONE_FIGURE_6A
    : KILBY_SOURCE_CIRCUIT_CAMERA_PRESETS[preset];
}
