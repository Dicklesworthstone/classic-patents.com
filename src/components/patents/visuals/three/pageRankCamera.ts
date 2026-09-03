export type PageRankCameraPreset = "iso" | "graph_network" | "central_node" | "top";

type CameraView = { pos: [number, number, number]; target: [number, number, number] };

export const PAGE_RANK_CAMERA_PRESETS: Record<PageRankCameraPreset, CameraView> = {
  iso: { pos: [0, 0, 8.5], target: [0, 0, 0] },
  graph_network: { pos: [5.0, 3.5, 6.5], target: [0, 0, 0] },
  central_node: { pos: [1.8, 1.2, 3.2], target: [0, 0, 0] },
  top: { pos: [0, 10.0, 0.01], target: [0, 0, 0] },
};

const DESKTOP_ISO: CameraView = { pos: [0, 0.7, 12], target: [0, 0.7, 0] };
const TABLET_ISO: CameraView = { pos: [0, 0.5, 10.8], target: [0, 0.5, 0] };
// The finite link-grid dais is part of the teaching model. At a 286 px phone
// canvas it needs a visible rim on every side, not a decorative edge crop.
const PHONE_ISO: CameraView = { pos: [0, 0.8, 17], target: [0, 0.8, 0] };

/**
 * The graph rotates and its ranked document nodes grow. Keep the full
 * three-document topology in frame at desktop, tablet, and phone widths while
 * preserving the authored close-ups.
 */
export function pageRankCameraForViewport(
  preset: PageRankCameraPreset,
  viewportWidth: number,
): CameraView {
  if (preset === "iso" && viewportWidth < 640) return PHONE_ISO;
  if (preset === "iso" && viewportWidth < 1024) return TABLET_ISO;
  if (preset === "iso" && viewportWidth >= 1024) return DESKTOP_ISO;
  return PAGE_RANK_CAMERA_PRESETS[preset];
}
