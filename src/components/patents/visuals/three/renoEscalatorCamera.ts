export type RenoCameraPreset =
  | "iso"
  | "comb_plates"
  | "cleated_deck"
  | "handrail"
  | "top_drive"
  | "top";

export const RENO_CAMERA_PRESETS: Record<
  RenoCameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [9.5, 6.5, 10.5], target: [0, 0, 0] },
  comb_plates: { pos: [7.3, 4.1, 5.3], target: [5.0, 2.1, 0] },
  cleated_deck: { pos: [4.5, 5.4, 9.5], target: [0, -0.2, 0] },
  handrail: { pos: [-5.5, 4.8, 8.0], target: [-1.0, 0.8, 1.2] },
  top_drive: { pos: [8.0, 4.0, 7.0], target: [5.2, 2.8, 0] },
  top: { pos: [0, 14.0, 0.1], target: [0, 0, 0] },
};
