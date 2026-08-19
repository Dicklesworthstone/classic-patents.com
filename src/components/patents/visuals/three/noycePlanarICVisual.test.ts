import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 2,981,877 Noyce Planar IC visual simulation", () => {
  test("routes Noyce IC to its 3D WebGL simulator and 2D vector simulator", () => {
    const dispatcherSource = readFileSync(join(VISUALS_DIRECTORY, "index.tsx"), "utf8");
    expect(dispatcherSource).toContain('case "us-2981877-noyce-ic":');
    expect(dispatcherSource).toContain("NoycePlanarIC3D");
    expect(dispatcherSource).toContain("NoycePlanarICSim");
  });

  test("builds and updates the 3D procedural monolithic planar IC model", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three/noycePlanarICModel.ts"),
      "utf8",
    );
    expect(modelSource).toContain("buildNoycePlanarICModel");
    expect(modelSource).toContain("updateNoycePlanarIcKinematics");
    expect(modelSource).toContain("siliconSubstrate");
    expect(modelSource).toContain("siliconDioxide");
    expect(modelSource).toContain("aluminumMetal");
  });
});
