import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import {
  LEMELSON_MANIPULATOR_DEFAULT_CONTROLS,
  stepLemelsonManipulatorTopology,
} from "@/physics/lemelsonAdjustableManipulatorKernel";
import { lemelsonAdjustableManipulatorViewForViewport } from "./lemelsonAdjustableManipulatorCamera";
import { buildLemelsonAdjustableManipulatorModel } from "./lemelsonAdjustableManipulatorModel";

const ROOT = process.cwd();
const source = (path: string) => readFileSync(join(ROOT, path), "utf8");

describe("US 3,260,375 Lemelson Adjustable Manipulator procedural visual boundary", () => {
  test("fits the whole supported apparatus at phone and tablet canvas widths", () => {
    const distanceFromTarget = (camera: { position: number[]; target: number[] }) =>
      Math.hypot(
        camera.position[0] - camera.target[0],
        camera.position[1] - camera.target[1],
        camera.position[2] - camera.target[2],
      );
    const phone = lemelsonAdjustableManipulatorViewForViewport("overview", 228);
    const tablet = lemelsonAdjustableManipulatorViewForViewport("overview", 644);
    const desktop = lemelsonAdjustableManipulatorViewForViewport("overview", 1214);

    expect(distanceFromTarget(phone)).toBeGreaterThan(distanceFromTarget(tablet));
    // The desktop canvas can keep the entire gantry in frame while moving
    // close enough for the source-claimed wrist and jaw to be legible.
    expect(desktop).toEqual({ position: [4.9, 3.0, 5.4], target: [0, 1.15, 0] });
    expect(distanceFromTarget(desktop)).toBeLessThan(distanceFromTarget(tablet));
    expect(phone.target).toEqual(tablet.target);
  });

  test("builds the procedural 3D model and updates kinematics correctly", () => {
    const model = buildLemelsonAdjustableManipulatorModel();
    expect(model.root.name).toContain("US 3,260,375");

    const defaultState = stepLemelsonManipulatorTopology(LEMELSON_MANIPULATOR_DEFAULT_CONTROLS);
    model.updateState(defaultState);

    const activeState = stepLemelsonManipulatorTopology({
      ...LEMELSON_MANIPULATOR_DEFAULT_CONTROLS,
      carriagePosition: 0.8,
      columnElevation: 0.6,
      columnAzimuth: 0.5,
      wristPivot: -0.4,
      jawClosure: 0.9,
    });
    model.updateState(activeState);

    expect(model.root.children.length).toBeGreaterThan(0);
    model.dispose();
  });

  test("grounds the overhead track and tethers both source bus bars", () => {
    const model = buildLemelsonAdjustableManipulatorModel();
    try {
      model.root.updateMatrixWorld(true);
      const bounds = (name: string) => {
        const part = model.root.getObjectByName(name);
        expect(part).toBeInstanceOf(THREE.Object3D);
        return new THREE.Box3().setFromObject(part as THREE.Object3D);
      };
      const lowerFlange = bounds("Trackway 21 bottom flange");
      for (let index = 1; index <= 2; index += 1) {
        const leg = bounds(`Normalized exhibit gantry support ${index}`);
        expect(leg.max.y).toBeCloseTo(lowerFlange.min.y, 6);
        expect(leg.min.y).toBeCloseTo(-0.5, 6);
      }

      const web = bounds("Trackway 21 web");
      for (const x of [-2.5, 0, 2.5]) {
        for (const side of ["positive", "negative"] as const) {
          const standoff = bounds(`Insulated ${side} bus-bar standoff at ${x}`);
          const bus = bounds(`Power bus bar 28 ${side} side`);
          expect(standoff.intersectsBox(web)).toBe(true);
          expect(standoff.intersectsBox(bus)).toBe(true);
        }
      }
    } finally {
      model.dispose();
    }
  });

  test("keeps the complete carriage-to-jaw load path in contact", () => {
    const model = buildLemelsonAdjustableManipulatorModel();
    try {
      model.updateState(stepLemelsonManipulatorTopology(LEMELSON_MANIPULATOR_DEFAULT_CONTROLS));
      model.root.updateMatrixWorld(true);
      const intersects = (first: string, second: string) => {
        const a = model.root.getObjectByName(first);
        const b = model.root.getObjectByName(second);
        expect(a).toBeInstanceOf(THREE.Object3D);
        expect(b).toBeInstanceOf(THREE.Object3D);
        return new THREE.Box3()
          .setFromObject(a as THREE.Object3D)
          .intersectsBox(new THREE.Box3().setFromObject(b as THREE.Object3D));
      };
      expect(intersects("Carriage 22 body", "Outer guide mast 23")).toBe(true);
      expect(intersects("Outer guide mast 23", "Inner vertical member 23 prime")).toBe(true);
      expect(intersects("Inner vertical member 23 prime", "Turntable plate 43")).toBe(true);
      const turntable = model.root.getObjectByName("Turntable plate 43");
      const rotatingColumn = model.root.getObjectByName("Rotating column 23 prime a");
      const turntableBounds = new THREE.Box3().setFromObject(turntable as THREE.Object3D);
      const columnBounds = new THREE.Box3().setFromObject(rotatingColumn as THREE.Object3D);
      expect(Math.abs(turntableBounds.min.y - columnBounds.max.y)).toBeLessThan(1e-8);
      expect(intersects("Pivoting manipulator arm 35 prime", "Article-seizing base 83")).toBe(true);
      expect(intersects("Article-seizing base 83", "Seizing jaw 87a")).toBe(true);
      expect(intersects("Article-seizing base 83", "Seizing jaw 87b")).toBe(true);
    } finally {
      model.dispose();
    }
  });

  test("keeps both visual faces on the shared topology bus and records the typed refusal", () => {
    const kernel = source("src/physics/lemelsonAdjustableManipulatorKernel.ts");
    const sim2d = source("src/components/patents/visuals/LemelsonAdjustableManipulatorSim.tsx");
    const studio3d = source(
      "src/components/patents/visuals/three/LemelsonAdjustableManipulator3D.tsx",
    );
    const camera = source(
      "src/components/patents/visuals/three/lemelsonAdjustableManipulatorCamera.ts",
    );
    const telemetry = source("src/physics/telemetryData.ts");

    expect(kernel).toContain("stepLemelsonManipulatorTopology");
    expect(kernel).toContain("US 3,260,375 provides kinematic");
    expect(sim2d).toContain('const PATENT_ID = "us-3260375-lemelson-adjustable-manipulator";');
    expect(sim2d).toContain("usePatentPhysics(PATENT_ID)");
    expect(sim2d).toContain("stepLemelsonManipulatorTopology");
    expect(sim2d).toContain("ClaimConstraintToggle");
    expect(sim2d).toContain("effectiveParams");
    expect(sim2d).toContain('role="status"');
    expect(studio3d).toContain('const PATENT_ID = "us-3260375-lemelson-adjustable-manipulator";');
    expect(studio3d).toContain("usePatentPhysics(PATENT_ID)");
    expect(studio3d).toContain("createStudioClock");
    expect(studio3d).toContain("ClaimConstraintToggle");
    expect(studio3d).toContain("useLiveSimParams(effectiveParams)");
    expect(studio3d).not.toContain("liveParams.current = effectiveParams");
    expect(studio3d).toContain("claimConstraintResult.refusalWarning");
    expect(studio3d).toContain('role="status"');
    expect(studio3d).toContain('data-mobile-layout="controls-below-canvas"');
    expect(studio3d.indexOf('data-mobile-layout="controls-below-canvas"')).toBeGreaterThan(
      studio3d.indexOf("ref={containerRef}"),
    );
    expect(studio3d).not.toContain("absolute right-3 bottom-3");
    expect(camera).toContain("const PHONE_OVERVIEW");
    expect(camera).toContain("const PHONE_WRIST");
    expect(camera).toContain("const TABLET_OVERVIEW");
    expect(studio3d).toContain('const initialView = "overview"');
    expect(studio3d).toContain("lemelsonAdjustableManipulatorViewForViewport");
    expect(studio3d).toContain("data-responsive-view-deck");
    expect(telemetry).toContain('"us-3260375-lemelson-adjustable-manipulator"');
  });
});
