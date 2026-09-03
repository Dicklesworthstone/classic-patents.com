export type DavenportElectricMotorCameraPreset =
  | "iso"
  | "commutator"
  | "stator_magnets"
  | "rotor"
  | "brushes"
  | "top";

export interface DavenportElectricMotorCameraView {
  pos: [number, number, number];
  target: [number, number, number];
}

const CAMERA_PRESETS: Record<DavenportElectricMotorCameraPreset, DavenportElectricMotorCameraView> =
  {
    // A high overview looks down through the brass bearing plate, which hides
    // the armature and commutator. This low lateral view keeps that plate as a
    // real structural part while exposing the claimed electromagnetic machine.
    iso: { pos: [9.5, 2.6, 10.5], target: [0, -0.25, 0] },
    commutator: { pos: [0, 2.5, 3.8], target: [0, 1.2, 0] },
    stator_magnets: { pos: [3.2, 1.5, 3.5], target: [1.5, 0, 0] },
    rotor: { pos: [0, 4.0, 1.5], target: [0, 0, 0] },
    brushes: { pos: [-1.8, 2.2, 2.5], target: [-0.5, 1.6, 0] },
    top: { pos: [0, 11.5, 0.1], target: [0, 0, 0] },
  };

function scaledOverview(view: DavenportElectricMotorCameraView, factor: number) {
  return {
    pos: view.pos.map(
      (coordinate, index) => view.target[index] + (coordinate - view.target[index]) * factor,
    ) as [number, number, number],
    target: [...view.target] as [number, number, number],
  };
}

/**
 * Keep the large circular baseboard and the elevated brass bridge in the
 * initial portrait frame. Detail presets intentionally remain close-up.
 */
export function davenportElectricMotorCameraForViewport(
  preset: DavenportElectricMotorCameraPreset,
  viewportWidth: number,
): DavenportElectricMotorCameraView {
  const view = CAMERA_PRESETS[preset];
  if (preset !== "iso" || viewportWidth >= 640) {
    return { pos: [...view.pos], target: [...view.target] };
  }

  return scaledOverview(view, viewportWidth < 340 ? 1.85 : 1.6);
}
