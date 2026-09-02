import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type * as THREE from "three";
import { applyClaimConstraintModifications } from "@/physics/claimConstraints";
import { stepKamenInjectionMechanism } from "@/physics/kamenInjectionKernel";
import { buildKamenInjectionModel } from "./kamenInjectionModel";

describe("US 3,858,581 medication injection device visual", () => {
  test("is a deterministic nonclinical mechanism exhibit", () => {
    const first = stepKamenInjectionMechanism({
      leadScrewTurnFraction: 0.7,
      counterTargetFraction: 0.6,
      motorCircuitClosed: 1,
      reliefPathShown: 0,
    });
    expect(
      stepKamenInjectionMechanism({
        leadScrewTurnFraction: 0.7,
        counterTargetFraction: 0.6,
        motorCircuitClosed: 1,
        reliefPathShown: 0,
      }),
    ).toEqual(first);
    expect(first.motorState).toBe("counter reached");
    expect(first.activeClaim).toBe(4);
    expect(first.refusal.reason).toContain("dose");
  });
  test("opening the motor circuit holds the selected screw, follower, and counter pose", () => {
    const stopped = stepKamenInjectionMechanism({
      leadScrewTurnFraction: 0.73,
      counterTargetFraction: 0.6,
      motorCircuitClosed: 0,
    });
    expect(stopped.motorState).toBe("open");
    expect(stopped.plungerPosition).toBeCloseTo(0.73, 8);
    expect(stopped.pulseProgress).toBeCloseTo(0.6, 8);
  });

  test("renders the shared Claim 1 probe and confines its inversion to the nonclinical topology", () => {
    const constrained = applyClaimConstraintModifications(
      "us-3858581-kamen-medication-injection-device",
      { motorCircuitClosed: 1 },
      { 1: false },
    );
    expect(constrained.modifiedParams.motorCircuitClosed).toBe(0);
    expect(constrained.refusalWarning).toContain("NONCLINICAL MECHANISM REFUSAL");

    for (const relativePath of [
      "src/components/patents/visuals/KamenMedicationInjectionSim.tsx",
      "src/components/patents/visuals/three/KamenMedicationInjection3D.tsx",
    ]) {
      const source = readFileSync(join(process.cwd(), relativePath), "utf8");
      expect(source).toContain("ClaimConstraintToggle");
      expect(source).toContain("claimConstraintStateParamId");
      expect(source).toContain("effectiveParams");
    }
  });
  test("builds and updates a procedural Three.js mechanism without external assets", () => {
    const model = buildKamenInjectionModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    const body = model.root.getObjectByName("case and longitudinal device housing") as THREE.Mesh;
    const plunger = model.root.getObjectByName("follower and plunger") as THREE.Group;
    const supports = model.root.children.filter(
      (child) => child.name === "museum display support, not a patent part",
    );
    const stopped = stepKamenInjectionMechanism({
      leadScrewTurnFraction: 0.73,
      motorCircuitClosed: 0,
      reliefPathShown: 1,
    });
    model.updatePose(stopped);
    expect(body).toBeDefined();
    expect(supports).toHaveLength(2);
    expect(supports.every((support) => support.position.y === -0.9)).toBe(true);
    expect(plunger.position.x).toBeCloseTo(-0.8 + 0.73 * 2.1, 8);
    expect(model.root.getObjectByName("illustrative clutch or relief arrangement")?.visible).toBe(
      true,
    );
    expect(() => model.dispose()).not.toThrow();
  });

  test("routes authored drawing sheets through the nonclinical shared kernel", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/InteractiveDiagramViewer.tsx"),
      "utf8",
    );
    expect(source).toContain('"kamen-injection-device": true');
    expect(source).toContain("stepKamenInjectionMechanism(params ?? {})");
    expect(source).toContain("dose, flow, pressure, and outcome refused");
  });
});
