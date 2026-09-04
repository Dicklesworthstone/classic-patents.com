export type DaVinciInterfaceCameraPreset = "overview" | "processor" | "tool";

export const DA_VINCI_INTERFACE_CAMERA_PRESETS: Record<
  DaVinciInterfaceCameraPreset,
  { label: string; pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: {
    label: "Interface overview",
    pos: [5.4, 3.2, 7.2],
    target: [0, 0, 0],
  },
  processor: {
    label: "Processor boundary",
    pos: [-3.8, 1.8, 3.7],
    target: [-1.4, 0.2, 0],
  },
  tool: {
    label: "Tool-side memory",
    pos: [4.25, 1.8, 3.35],
    target: [1.2, 0.18, 0],
  },
};

/**
 * Preserve the complete processor-to-tool path in narrow portrait canvases.
 * Distances are scene-camera framing only; they do not imply patent scale.
 */
export function daVinciInterfaceViewForViewport(
  preset: DaVinciInterfaceCameraPreset,
  viewportWidth: number,
) {
  const config = DA_VINCI_INTERFACE_CAMERA_PRESETS[preset];
  const multiplier = viewportWidth < 480 ? 1.55 : viewportWidth < 900 ? 1.3 : 1;
  return {
    label: config.label,
    pos: [
      config.target[0] + (config.pos[0] - config.target[0]) * multiplier,
      config.target[1] + (config.pos[1] - config.target[1]) * multiplier,
      config.target[2] + (config.pos[2] - config.target[2]) * multiplier,
    ] as [number, number, number],
    target: config.target,
  };
}
