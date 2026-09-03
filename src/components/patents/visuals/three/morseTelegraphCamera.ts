export type MorseCameraPreset =
  | "iso"
  | "key_lever"
  | "electromagnet_relay"
  | "paper_tape_register"
  | "sounding_anvil"
  | "top";

const CAMERA_PRESETS: Record<
  MorseCameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [11, 8, 13], target: [0, 0, 0] },
  key_lever: { pos: [-3.5, 2.5, 4.5], target: [-3.5, -0.8, 0] },
  electromagnet_relay: { pos: [3.5, 2.0, 4.0], target: [3.5, -0.8, 0] },
  paper_tape_register: { pos: [2.0, 3.5, 3.5], target: [1.5, 0.5, 0] },
  sounding_anvil: { pos: [3.5, 3.0, 2.0], target: [3.5, 0.2, 0] },
  top: { pos: [0, 11.5, 0.1], target: [0, 0, 0] },
};

const MORSE_NARROW_VIEWPORT_MAX_WIDTH_PX = 480;

export function morseCameraPresetForViewport(
  preset: MorseCameraPreset,
  viewportWidth: number,
): { pos: [number, number, number]; target: [number, number, number] } {
  if (preset === "iso" && viewportWidth < MORSE_NARROW_VIEWPORT_MAX_WIDTH_PX) {
    // The complete baseboard spans almost fourteen studio units. Give a
    // portrait viewport enough radius to show its key, sounder, and register.
    return { pos: [15, 11, 20], target: [0, -0.5, 0] };
  }
  return CAMERA_PRESETS[preset];
}
