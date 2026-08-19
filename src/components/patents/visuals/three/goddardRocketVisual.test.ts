import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 1,102,653 Robert H. Goddard Rocket visual simulation", () => {
  test("routes Goddard Rocket to its 3D WebGL simulator and 2D vector simulator", () => {
    const dispatcherSource = readFileSync(join(VISUALS_DIRECTORY, "index.tsx"), "utf8");

    expect(dispatcherSource).toContain('case "us-1102653-goddard-rocket":');
    expect(dispatcherSource).toContain("GoddardRocket3D");
    expect(dispatcherSource).toContain("GoddardRocketSim");
  });

  test("builds and updates the 3D procedural rocket propulsion model", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three/goddardRocketModel.ts"),
      "utf8",
    );

    expect(modelSource).toContain("buildGoddardRocketModel");
    expect(modelSource).toContain("updateGoddardRocketKinematics");
  });
});
