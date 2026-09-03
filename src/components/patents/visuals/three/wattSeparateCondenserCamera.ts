export type WattSeparateCondenserCameraPreset =
  | "iso"
  | "cylinder"
  | "condenser"
  | "beam"
  | "boiler";

export interface WattSeparateCondenserCameraView {
  pos: [number, number, number];
  target: [number, number, number];
}

const CAMERA_PRESETS: Record<WattSeparateCondenserCameraPreset, WattSeparateCondenserCameraView> = {
  // The masonry support wall is historically real, but from the positive-X
  // side it sits directly between the visitor and Watt's cylinder/condenser.
  // Start from the open machinery side so the separate-condenser topology is
  // legible before a visitor needs a camera preset.
  iso: { pos: [-9, 7, 12], target: [-0.5, 3.5, 0] },
  cylinder: { pos: [-2.5, 3.4, 5.2], target: [-2.5, 2.6, 0] },
  condenser: { pos: [-2.5, 1.8, 4.2], target: [-2.5, 0.8, 0] },
  beam: { pos: [0.2, 7.2, 6.5], target: [0, 4.8, 0] },
  boiler: { pos: [-5.5, 2.8, 5.0], target: [-5.5, 1.5, 0] },
};

function scaledOverview(view: WattSeparateCondenserCameraView, factor: number) {
  return {
    pos: view.pos.map(
      (coordinate, index) => view.target[index] + (coordinate - view.target[index]) * factor,
    ) as [number, number, number],
    target: [...view.target] as [number, number, number],
  };
}

/**
 * A phone's portrait canvas is much narrower than the desktop studio. Preserve
 * the detail presets, but pull the overview back far enough to keep the boiler,
 * cylinder, wall, walking beam, and separate condenser in one readable frame.
 */
export function wattSeparateCondenserCameraForViewport(
  preset: WattSeparateCondenserCameraPreset,
  viewportWidth: number,
): WattSeparateCondenserCameraView {
  const view = CAMERA_PRESETS[preset];
  if (preset !== "iso" || viewportWidth >= 640) {
    return { pos: [...view.pos], target: [...view.target] };
  }

  // The 320 px route has a 288 px canvas after the page gutter. Its full
  // engine-house bounds need more clearance than the 375 px route.
  return scaledOverview(view, viewportWidth < 340 ? 1.85 : 1.65);
}
