import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepSholesTypewriter } from "@/physics/machineKernels";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 79,265 source-faithful visual boundary", () => {
  test("uses the printed key, type-bar, ratchet, and ribbon relation without claiming an unprinted layout", () => {
    const twoDimensional = readFileSync(join(VISUALS_DIRECTORY, "SholesTypewriterSim.tsx"), "utf8");
    const threeDimensional = readFileSync(
      join(VISUALS_DIRECTORY, "three", "SholesTypewriter3D.tsx"),
      "utf8",
    );

    expect(twoDimensional).toContain("Ratchet I / lever H");
    expect(twoDimensional).toContain("Inking ribbon");
    expect(twoDimensional).toContain("Diagrammatic subset");
    expect(twoDimensional).toContain("Demonstration cadence");
    expect(twoDimensional).toContain('updateParam("typingSpeedWpm"');
    expect(threeDimensional).toContain("Claim 1: direct key action through fingers w");
    expect(threeDimensional).toContain("Twelve bars are a diagrammatic subset");
    expect(threeDimensional).toContain("A piano-like keyboard is named in the grant");

    for (const prohibited of [
      "QWERTY",
      "THE QUICK BROWN FOX",
      "10-pitch",
      "2.54",
      "new THREE.Clock",
      "playSwitchClick",
      "Ivory Keys",
      "Rubber Platen",
    ]) {
      expect(`${twoDimensional}\n${threeDimensional}`).not.toContain(prohibited);
    }
  });

  test("returns relative display phases rather than invented pitch, angle, or rate telemetry", () => {
    expect(stepSholesTypewriter(40, 0)).toEqual({
      eventsPerSecond: 40 / 60,
      completedSteps: 0,
      keyCyclePct: 0,
      ratchetReleasePct: 0,
      displayTypebarIndex: 0,
    });
    expect(stepSholesTypewriter(40, 0.3)).toMatchObject({
      completedSteps: 0,
      displayTypebarIndex: 0,
    });
    expect(stepSholesTypewriter(40, 0.3).ratchetReleasePct).toBeGreaterThan(0);
    expect(stepSholesTypewriter(40, 0.3)).not.toHaveProperty("pitchMm");
    expect(stepSholesTypewriter(40, 0.3)).not.toHaveProperty("typebarStrikeAngleDeg");
  });
});
