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
        spatialComponent: "FirstMachine3D",
        vectorComponent: "FirstMachineSim",
      },
      "legacy-id": {
        spatialComponent: "FirstMachine3D",
        vectorComponent: "FirstMachineSim",
      },
      "second-id": {
        spatialComponent: "SecondMachine3D",
        vectorComponent: "SecondMachineSim",
      },
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
