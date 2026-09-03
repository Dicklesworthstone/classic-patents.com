import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepRobotEndEffector } from "@/physics/robotEndEffectorKernel";
import { buildRobotEndEffectorModel } from "./robotEndEffectorModel";

describe("US 4,765,668 Slocum Robot End Effector 3D Visual Boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const model = buildRobotEndEffectorModel();
    expect(model.root).toBeInstanceOf(THREE.Group);

    // Verify all named historical organs exist in procedural hierarchy
    const organNames: string[] = [];
    model.root.traverse((child) => {
      if (child.name) organNames.push(child.name);
    });

    expect(organNames.some((n) => n.includes("Frame 12"))).toBe(true);
    expect(organNames.some((n) => n.includes("Central web 28"))).toBe(true);
    expect(organNames.some((n) => n.includes("Upper cylinder 26"))).toBe(true);
    expect(organNames.some((n) => n.includes("Lower cylinder 30"))).toBe(true);

    model.dispose();
  });

  test("articulates symmetric hand movement and dovetail finger retraction", () => {
    const model = buildRobotEndEffectorModel();

    const stateClosed = stepRobotEndEffector({
      jawOpeningFraction: 0.1,
      fingerChangeFraction: 0,
      frameRotationDeg: 0,
    });
    model.updateState(stateClosed);

    const stateOpen = stepRobotEndEffector({
      jawOpeningFraction: 0.9,
      fingerChangeFraction: 0.8,
      frameRotationDeg: 90,
    });
    model.updateState(stateOpen);

    expect(stateOpen.jawOpeningM).toBeGreaterThan(stateClosed.jawOpeningM);
    expect(stateOpen.perHandOffsetM).toBeGreaterThan(stateClosed.perHandOffsetM);
    expect(stateOpen.fingerRetainedFraction).toBeLessThan(stateClosed.fingerRetainedFraction);

    model.dispose();
  });

  test("confirms typed refusal of unprinted physical contact and dynamics", () => {
    const state = stepRobotEndEffector({});
    expect(state.sourceBoundary.isRefused).toBe(true);
    expect(state.sourceBoundary.note).toContain("US 4,765,668");
  });

  test("keeps the phone canvas clear by placing controls after it", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/RobotEndEffector3D.tsx"),
      "utf8",
    );
    const canvasIndex = source.indexOf("ref={containerRef}");
    const controlsIndex = source.indexOf('data-mobile-layout="controls-below-canvas"');

    expect(canvasIndex).toBeGreaterThan(-1);
    expect(controlsIndex).toBeGreaterThan(canvasIndex);
    expect(source).toContain("hidden items-start justify-between");
    expect(source).toContain("hidden rounded-xl");
  });
});
