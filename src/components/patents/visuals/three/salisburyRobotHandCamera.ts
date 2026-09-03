export type SalisburyRobotHandCameraPreset = "overview" | "wrist" | "pulleys" | "cables";

type CameraView = {
  position: [number, number, number];
  target: [number, number, number];
};

const CAMERA_PRESETS: Record<SalisburyRobotHandCameraPreset, CameraView> = {
  // The overview must contain the fully raised default pose as well as the
  // flatter high-T1 pose. A closer view cropped the upper fingertip covers on
  // a 16:9 desktop canvas even though the narrow-phone camera was safe.
  overview: { position: [6, 3.7, 8], target: [0, -0.5, 0] },
  wrist: { position: [2.7, 0.2, 3.2], target: [0, -0.35, 0] },
  pulleys: { position: [2.0, 2.0, 2.4], target: [0, 0.75, 0] },
  cables: { position: [3.4, -0.5, 3.3], target: [0, -1.0, 0] },
};

const PHONE_OVERVIEW: CameraView = {
  // This fit was checked against the articulated drive, palm, and all three
  // fingertips in the 252 × 460 px narrow-phone canvas. It deliberately
  // favors the complete connected hand over a clipped close-up of one digit.
  position: [7.3, 4.2, 9.8],
  target: [0, -0.35, 0.1],
};

export function salisburyRobotHandCameraForViewport(
  preset: SalisburyRobotHandCameraPreset,
  viewportWidth: number,
): CameraView {
  if (preset === "overview" && viewportWidth < 640) return PHONE_OVERVIEW;
  return CAMERA_PRESETS[preset];
}
