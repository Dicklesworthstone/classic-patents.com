import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 1,102,653 Robert H. Goddard source-visual boundary", () => {
  test("dispatches a source-figure guide instead of the unrelated liquid-rocket modules", () => {
    const dispatcherSource = readFileSync(join(VISUALS_DIRECTORY, "index.tsx"), "utf8");

    expect(dispatcherSource).toContain("import { GoddardRocketSourceVisual }");
    expect(dispatcherSource).toContain(
      'case "us-1102653-goddard-rocket":\n            return <GoddardRocketSourceVisual />',
    );
    expect(dispatcherSource).not.toContain("GoddardRocket3D /> : <GoddardRocketSim");
  });

  test("uses the verified Figure 1 source crop and only apparatus relations printed in the grant", () => {
    const sourceGuide = readFileSync(
      join(VISUALS_DIRECTORY, "GoddardRocketSourceVisual.tsx"),
      "utf8",
    );

    expect(sourceGuide).toContain("us-1102653-goddard-rocket-fig-1.png");
    expect(sourceGuide).toContain("not less than three");
    expect(sourceGuide).toContain("explosive disks");
    expect(sourceGuide).toContain("gyroscopically held recording instrument");
    for (const unsupportedAssertion of [
      "de Laval",
      "Liquid Oxygen",
      "turbopump",
      "specific impulse",
      "supersonic",
    ]) {
      expect(sourceGuide).not.toContain(unsupportedAssertion);
    }
  });

  test("keeps selection keyboard-operable and connected to the shared source-focus parameter", () => {
    const sourceGuide = readFileSync(
      join(VISUALS_DIRECTORY, "GoddardRocketSourceVisual.tsx"),
      "utf8",
    );

    expect(sourceGuide).toContain('usePatentPhysics("us-1102653-goddard-rocket")');
    expect(sourceGuide).toContain('updateParam("sourceFocus", index + 1)');
    expect(sourceGuide).toContain("aria-pressed");
    expect(sourceGuide).toContain("focus-visible:outline");
  });
});
