import { defineConfig } from "react-doctor/api";

/**
 * Pedagogical 2D/3D patent instruments keep scene construction, physics, and
 * HUD controls in one file on purpose. GPU resources created in those scenes
 * are released by ThreeStudioScene.dispose(), which traverses every mesh,
 * line, and points object and disposes geometry, materials, and textures.
 */
export default defineConfig({
  ignore: {
    overrides: [
      {
        files: [
          "src/components/patents/DualProjectionViewer.tsx",
          "src/components/patents/InteractiveDiagramViewer.tsx",
          "src/components/patents/visuals/**/*.tsx",
        ],
        rules: ["react-doctor/no-giant-component"],
      },
      {
        files: ["src/components/patents/visuals/three/**/*.tsx"],
        rules: [
          "react-doctor/three-require-owned-material-cleanup",
          "react-doctor/three-require-owned-geometry-cleanup",
        ],
      },
    ],
  },
});
