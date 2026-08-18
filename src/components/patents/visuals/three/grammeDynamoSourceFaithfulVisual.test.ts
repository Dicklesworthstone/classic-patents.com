import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepGrammeDynamo } from "@/physics/catalogKernels";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 120,057 Gramme source-faithful visual boundary", () => {
  test("uses printed joined bobbins and collecting rubbers instead of a fabricated rated machine", () => {
    const twoDimensional = readFileSync(join(VISUALS_DIRECTORY, "GrammeDynamoSim.tsx"), "utf8");
    const threeDimensional = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GrammeDynamo3D.tsx"),
      "utf8",
    );

    expect(twoDimensional).toContain("printedJunctionCount = 36");
    expect(twoDimensional).toContain("Collecting rubber S");
    expect(twoDimensional).not.toContain("Smooth DC Commutation");
    expect(twoDimensional).not.toContain("Generated DC Voltage");
    expect(twoDimensional).not.toContain("+ Brush");
    expect(threeDimensional).toContain("Junction conductors C rotate with the ring");
    expect(threeDimensional).toContain("Stationary collecting rubbers");
    expect(threeDimensional).toContain("no historical rpm, volts, amperes, or watts");
  });

  test("does not seed the Gramme display from ambient randomness or a private clock", () => {
    const threeDimensional = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GrammeDynamo3D.tsx"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeDimensional).not.toContain(forbidden);
    }
  });

  test("returns reproducible relative indicators rather than fabricated volts, amps, or watts", () => {
    expect(stepGrammeDynamo({ shaftRate: 1 })).toMatchObject({
      shaftRate: 1,
      printedJunctionCount: 36,
      inducedEmfIndex: 100,
      collectionContinuityPct: 97.2,
    });
    expect(stepGrammeDynamo({ shaftRate: 1.6 }).inducedEmfIndex).toBe(160);
  });
});
