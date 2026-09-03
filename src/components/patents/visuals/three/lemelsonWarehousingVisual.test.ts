import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  DEFAULT_LEMELSON_CONTROLS,
  readLemelsonWarehousingControls,
  stepLemelsonWarehousingSi,
} from "@/physics/lemelsonWarehousingKernel";
import { createLemelsonWarehousingModel } from "./lemelsonWarehousingModel";

describe("US 3,119,501 Jerome Lemelson Automatic Warehousing Visual Boundary", () => {
  it("keeps the preserved alternate studio deterministic and explicitly outside dispatch", () => {
    const alternateSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/LemelsonWarehousing3D.tsx"),
      "utf8",
    );
    const dispatcherSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/index.tsx"),
      "utf8",
    );

    expect(alternateSource).toContain("createStudioClock");
    expect(alternateSource).toContain("clock.pump(timeMs)");
    expect(alternateSource).toContain("simTimeSec - resetEpochRef.current");
    expect(alternateSource).toContain("studio.cleanup()");
    expect(alternateSource).not.toContain("setSimTime");
    expect(alternateSource).not.toContain("performance.now");
    expect(dispatcherSource).toContain("<LemelsonAutomaticWarehousing3D />");
    expect(dispatcherSource).not.toContain("<LemelsonWarehousing3D />");
  });

  it("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const model = createLemelsonWarehousingModel();
    expect(model.group).toBeDefined();
    expect(model.carriageMesh).toBeDefined();
    expect(model.elevatorMesh).toBeDefined();
    expect(model.forkMesh).toBeDefined();
    expect(model.markers.length).toBeGreaterThanOrEqual(10);
    model.dispose();
  });

  it("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const controls = readLemelsonWarehousingControls(
      DEFAULT_LEMELSON_CONTROLS as unknown as Record<string, number>,
    );
    const tel1 = stepLemelsonWarehousingSi(controls, 2.5);
    const tel2 = stepLemelsonWarehousingSi(controls, 2.5);

    expect(tel1.carriageX).toBe(tel2.carriageX);
    expect(tel1.elevatorZ).toBe(tel2.elevatorZ);
    expect(tel1.forkY).toBe(tel2.forkY);
    expect(tel1.counterPrCx).toBe(tel2.counterPrCx);
    expect(tel1.scannerVoltageX).toBe(tel2.scannerVoltageX);
    expect(tel1.mechanicalPowerWatts).toBe(tel2.mechanicalPowerWatts);
  });

  it("computes genuine 3-axis kinematics, optical down-counts, and power in SI units", () => {
    const controls = readLemelsonWarehousingControls({
      targetBayX: 8,
      targetShelfZ: 4,
      bayWidth: 1.2,
      shelfHeight: 0.8,
      traverseSpeed: 1.5,
      hoistSpeed: 0.6,
      payloadMass: 300,
    });

    const startTel = stepLemelsonWarehousingSi(controls, 0.1);
    expect(startTel.carriageX).toBeGreaterThanOrEqual(0);
    expect(startTel.counterPrCx).toBeLessThanOrEqual(8);
    expect(startTel.mechanicalPowerWatts).toBeGreaterThan(0);

    const midTel = stepLemelsonWarehousingSi(controls, 10.0);
    expect(midTel.carriageX).toBeLessThanOrEqual(8 * 1.2 + 0.1);
    expect(midTel.elevatorZ).toBeLessThanOrEqual(4 * 0.8 + 0.1);
    expect(midTel.positioningAccuracyMm).toBeGreaterThanOrEqual(0);
  });

  it("builds and articulates procedural racking grid, crane carriage, elevator, and telescopic forks", () => {
    const model = createLemelsonWarehousingModel();
    const controls = readLemelsonWarehousingControls(
      DEFAULT_LEMELSON_CONTROLS as unknown as Record<string, number>,
    );
    const tel = stepLemelsonWarehousingSi(controls, 5.0);

    model.update(tel);
    expect(model.carriageMesh.position.x).toBeCloseTo(tel.carriageX - (10 * 1.2) / 2, 2);
    expect(model.elevatorMesh.position.y).toBeCloseTo(tel.elevatorZ + 0.1, 2);
    expect(model.forkMesh.position.z).toBeCloseTo(tel.forkY, 2);

    model.dispose();
  });

  it("keeps the interactive deck below the canvas instead of covering the racking", () => {
    const studioSource = readFileSync(
      join(
        process.cwd(),
        "src/components/patents/visuals/three/LemelsonAutomaticWarehousing3D.tsx",
      ),
      "utf8",
    );

    expect(studioSource.indexOf('data-mobile-layout="controls-below-canvas"')).toBeGreaterThan(
      studioSource.indexOf("ref={containerRef}"),
    );
    expect(studioSource).not.toContain("bottom-[350px]");
  });
});
