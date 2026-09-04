export type CarrierAirConditionerCameraPreset = "iso" | "spray" | "plates" | "fan";

export type CarrierAirConditionerCameraView = {
  pos: [number, number, number];
  target: [number, number, number];
};

export const CARRIER_AIR_CONDITIONER_CAMERA_PRESETS: Record<
  CarrierAirConditionerCameraPreset,
  CarrierAirConditionerCameraView
> = {
  iso: { pos: [9.5, 3.8, 9.5], target: [-0.25, 0, 0] },
  spray: { pos: [-3.4, 2.1, 4.1], target: [-2.3, 0.2, 0] },
  plates: { pos: [0.2, 2.6, 4.5], target: [-0.5, 0.2, 0] },
  fan: { pos: [4.2, 1.8, 3.6], target: [2.4, 0.3, 0] },
};

// A 320px browser viewport yields a 286 × 380px studio canvas. At that
// portrait aspect the normal overview cuts off the fan scroll casing. This
// is the only composition widened: desktop/tablet and close-inspection views
// retain their established source-reading frames.
const NARROW_PHONE_CANVAS_MAX_WIDTH_PX = 320;
const NARROW_PHONE_ISO: CarrierAirConditionerCameraView = {
  pos: [13.0, 5.5, 13.0],
  target: [0, 0, 0],
};

export function carrierAirConditionerCameraForViewport(
  preset: CarrierAirConditionerCameraPreset,
  viewportWidth: number,
  viewportHeight = Math.max(1, viewportWidth / 1.6),
): CarrierAirConditionerCameraView {
  const view = CARRIER_AIR_CONDITIONER_CAMERA_PRESETS[preset];
  const isNarrowPhonePortrait =
    preset === "iso" &&
    viewportWidth > 0 &&
    viewportWidth <= NARROW_PHONE_CANVAS_MAX_WIDTH_PX &&
    viewportHeight > viewportWidth;

  return isNarrowPhonePortrait ? NARROW_PHONE_ISO : view;
}
