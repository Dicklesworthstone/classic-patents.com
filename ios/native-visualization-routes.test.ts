import { describe, expect, test } from "bun:test";
import { parseSourceVisualizationRoutes } from "./native-visualization-routes";

describe("parseSourceVisualizationRoutes", () => {
  test("ignores switch and default indentation and preserves fallthrough aliases", () => {
    const source = `
      switch ( patentId ) {
        case "first-id":
        case "legacy-id":
          return renderMode === "3d-physics" ? <FirstMachine3D /> : <FirstMachineSim />;
        case "second-id":
          return renderMode === "3d-physics" ? (
            <SecondMachine3D />
          ) : (
            <SecondMachineSim />
          );
              default:
          return null;
      }
    `;

    expect(Object.fromEntries(parseSourceVisualizationRoutes(source))).toEqual({
      "first-id": {
        kind: "model",
        spatialComponent: "FirstMachine3D",
        vectorComponent: "FirstMachineSim",
      },
      "legacy-id": {
        kind: "model",
        spatialComponent: "FirstMachine3D",
        vectorComponent: "FirstMachineSim",
      },
      "second-id": {
        kind: "model",
        spatialComponent: "SecondMachine3D",
        vectorComponent: "SecondMachineSim",
      },
    });
  });

  test("distinguishes intentionally source-bound PDF-only routes from broken model routes", () => {
    const routes = parseSourceVisualizationRoutes(`
      switch (patentId) {
        case "facsimile-id":
          return <SourceVisualUnavailable patentId={patentId} />;
        case "modeled-id":
          return renderMode === "3d-physics" ? <ModeledMachine3D /> : <ModeledMachineSim />;
        default:
          return null;
      }
    `);

    expect(routes.get("facsimile-id")).toEqual({
      kind: "source-bound-pdf-only",
      sourceBoundary:
        "The public record is limited to the pinned facsimile and checked claim reading. No reviewed transcription, archival edition, model, controls, quantitative metrics, or USDZ asset is shipped in the native app.",
    });
    expect(routes.get("modeled-id")).toEqual({
      kind: "model",
      spatialComponent: "ModeledMachine3D",
      vectorComponent: "ModeledMachineSim",
    });
  });

  test("fails closed when a case has no complete visual pair", () => {
    expect(() =>
      parseSourceVisualizationRoutes(`
        switch (patentId) {
          case "incomplete-id":
            return <OnlyOne3D />;
          default:
            return null;
        }
      `),
    ).toThrow("Patent visual routes have no component pair: incomplete-id");
  });
});
