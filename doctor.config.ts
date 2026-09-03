import { defineConfig } from "react-doctor/api";

/**
 * Pedagogical 2D/3D patent instruments keep scene construction, physics, and
 * HUD controls in one file on purpose. GPU resources created in those scenes
 * are released by ThreeStudioScene.dispose(), which traverses every mesh,
 * line, and points object and disposes geometry, materials, and textures.
 */
export default defineConfig({
  ignore: {
    // Audit-runner build directories contain emitted bundles, not source. They
    // are re-created by the visual harness and must never count as a second,
    // stale copy of a React diagnostic.
    files: [".next*/**"],
    overrides: [
      {
        files: [
          "src/components/patents/DualProjectionViewer.tsx",
          "src/components/patents/InteractiveDiagramViewer.tsx",
          "src/components/patents/visuals/**/*.tsx",
        ],
        rules: [
          "react-doctor/no-giant-component",
          // These deliberately own a deterministic rAF/tape lifecycle so
          // off-screen visibility gating and fixed-step physics stay coupled.
          "react-doctor/three-prefer-set-animation-loop",
          "react-doctor/no-high-complexity-react-function",
        ],
      },
      {
        files: ["src/components/patents/visuals/three/**/*.tsx"],
        rules: [
          "react-doctor/three-require-owned-material-cleanup",
          "react-doctor/three-require-owned-geometry-cleanup",
        ],
      },
      {
        // These render-only test harnesses intentionally capture a callback
        // without triggering client interaction or an effect lifecycle.
        files: [
          "src/components/patents/visuals/three/useLiveSimParams.test.tsx",
          "src/components/patents/visuals/three/usePatentAudio.test.tsx",
          "src/physics/useFrankenSimPhysics.test.tsx",
        ],
        rules: ["react-doctor/no-prop-callback-in-render"],
      },
      {
        // KaTeX is the sole HTML producer here. Its narrow trust callback and
        // regression tests reject URLs and image/html-bearing commands.
        files: ["src/components/ui/LatexRenderer.tsx"],
        rules: ["react-doctor/dangerous-html-sink"],
      },
    ],
  },
});
