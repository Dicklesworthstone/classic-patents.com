import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { applyClaimConstraintModifications } from "@/physics/claimConstraints";
import {
  INITIAL_KAMEN_INJECTION_STATE,
  KAMEN_INJECTION_DEFAULT_CONTROLS,
  readKamenInjectionControls,
  stepKamenInjectionMechanism,
} from "@/physics/kamenInjectionKernel";
import { buildKamenInjectionModel } from "./kamenInjectionModel";

describe("US 3,858,581 medication injection device visual", () => {
  test("stops the connected screw/follower exactly on the selected integer pulse", () => {
    const controls = readKamenInjectionControls({
      ...KAMEN_INJECTION_DEFAULT_CONTROLS,
      displayTurnsPerSecond: 12,
      selectedPulseCount: 7,
    });
    const frame = stepKamenInjectionMechanism(INITIAL_KAMEN_INJECTION_STATE, controls, 1);
    expect(frame.state.leadScrewTurns).toBeCloseTo(1.2, 12);
    expect(frame.metrics.cyclePulseCount).toBe(1);
    let state = frame.state;
    for (let index = 0; index < 60; index += 1) {
      state = stepKamenInjectionMechanism(state, controls, 1 / 60).state;
    }
    const terminal = stepKamenInjectionMechanism(state, controls, 0);
    expect(terminal.state.leadScrewTurns).toBeCloseTo(7, 9);
    expect(terminal.metrics.cyclePulseCount).toBe(7);
    expect(terminal.state.controlPhase).toBe("motor-off");
    expect(terminal.metrics.refusal.reason).toContain("dose calibration");
  });

  test("withholds only the counted loop when Claim 1 is inverted", () => {
    const constrained = applyClaimConstraintModifications(
      "us-3858581-kamen-medication-injection-device",
      { running: 1, clutchEngaged: 1, claim1PulseLoopPresent: 1 },
      { 1: false },
    );
    expect(constrained.modifiedParams.claim1PulseLoopPresent).toBe(0);
    expect(constrained.modifiedParams.running).toBe(1);
    expect(constrained.refusalWarning).toContain("NONCLINICAL MECHANISM REFUSAL");

    const controls = readKamenInjectionControls(constrained.modifiedParams);
    const frame = stepKamenInjectionMechanism(INITIAL_KAMEN_INJECTION_STATE, controls, 0.1);
    expect(frame.metrics.phase).toBe("pulse loop withheld");
    expect(frame.state.leadScrewTurns).toBeGreaterThan(0);
    expect(frame.metrics.cyclePulseCount).toBe(0);

    for (const relativePath of [
      "src/components/patents/visuals/KamenMedicationInjectionSourceSim.tsx",
      "src/components/patents/visuals/three/KamenMedicationInjection3D.tsx",
    ]) {
      const source = readFileSync(join(process.cwd(), relativePath), "utf8");
      expect(source).toContain("ClaimConstraintToggle");
      expect(source).toContain("claimConstraintStateParamId");
      expect(source).toContain("effectiveParams");
    }
  });

  test("builds a source-connected Three.js apparatus without floating display props", () => {
    const model = buildKamenInjectionModel();
    const requiredParts = [
      "case base 34",
      "powering motor 24",
      "driving clutch half 136",
      "driven clutch half 136",
      "uniform-pitch lead screw 22 core",
      "threaded follower member 20",
      "anti-rotation body element 40",
      "pushing head 16",
      "syringe plunger rod 14",
      "transparent syringe barrel 12",
      "L-shaped syringe clamp 54",
      "patient connection tubing 15",
      "radial striker 80 mounted on lead screw",
      "pulse-emitting switch 84",
      "printed circuit board 86",
      "counter control 124 to motor-off switch 126 conductor",
      "compression spring 138 in clutch 136",
    ];
    for (const name of requiredParts) expect(model.root.getObjectByName(name)).toBeDefined();
    expect(model.root.getObjectByName("museum display support, not a patent part")).toBeUndefined();

    const frame = stepKamenInjectionMechanism(
      INITIAL_KAMEN_INJECTION_STATE,
      readKamenInjectionControls(KAMEN_INJECTION_DEFAULT_CONTROLS),
      0.1,
    );
    model.updateFrame(frame);
    model.root.updateMatrixWorld(true);
    const follower = model.root.getObjectByName(
      "connected follower 18 and syringe plunger 14",
    ) as THREE.Group;
    expect(follower.position.x).toBeGreaterThan(-1.02);
    const plungerBox = new THREE.Box3().setFromObject(
      model.root.getObjectByName("syringe plunger rod 14") as THREE.Object3D,
    );
    const headBox = new THREE.Box3().setFromObject(
      model.root.getObjectByName("pushing head 16") as THREE.Object3D,
    );
    expect(plungerBox.intersectsBox(headBox)).toBe(true);

    const barrelBox = new THREE.Box3().setFromObject(
      model.root.getObjectByName("transparent syringe barrel 12") as THREE.Object3D,
    );
    const clampBox = new THREE.Box3().setFromObject(
      model.root.getObjectByName("L-shaped syringe clamp 54") as THREE.Object3D,
    );
    expect(barrelBox.intersectsBox(clampBox)).toBe(true);

    const drivingHalf = model.root.getObjectByName("driving clutch half 136") as THREE.Object3D;
    const drivenHalf = model.root.getObjectByName("driven clutch half 136") as THREE.Object3D;
    expect(
      new THREE.Box3()
        .setFromObject(drivingHalf)
        .intersectsBox(new THREE.Box3().setFromObject(drivenHalf)),
    ).toBe(true);
    const released = stepKamenInjectionMechanism(
      frame.state,
      readKamenInjectionControls({ ...KAMEN_INJECTION_DEFAULT_CONTROLS, clutchEngaged: false }),
      0.1,
    );
    model.updateFrame(released);
    model.root.updateMatrixWorld(true);
    expect(
      new THREE.Box3()
        .setFromObject(drivingHalf)
        .intersectsBox(new THREE.Box3().setFromObject(drivenHalf)),
    ).toBe(false);
    expect(
      (model.root.getObjectByName("axially compressible clutch spring assembly") as THREE.Group)
        .scale.x,
    ).toBeCloseTo(0.55, 12);
    expect(() => model.dispose()).not.toThrow();
  });

  test("routes both visual faces through one persistent source-tape owner", () => {
    const dispatcher = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/index.tsx"),
      "utf8",
    );
    const owner = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/PatentPhysicsRuntimeOwner.tsx"),
      "utf8",
    );
    expect(dispatcher).toContain("KamenInjectionPhysicsRuntimeOwner");
    expect(dispatcher).toContain("KamenMedicationInjectionSourceSim");
    expect(owner).toContain("createKamenInjectionTransportUpdater");
    expect(owner).toContain('"TS_FALLBACK"');

    const source = readFileSync(
      join(process.cwd(), "src/components/patents/InteractiveDiagramViewer.tsx"),
      "utf8",
    );
    expect(source).toContain('"kamen-injection-device": true');
    expect(source).toContain("readKamenInjectionTapeFrame(controls)");
    expect(source).toContain("dose, flow, pressure, and outcome refused");
  });

  test("moves the source title below the canvas on a narrow phone instead of covering the motor", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/KamenMedicationInjection3D.tsx"),
      "utf8",
    );

    expect(source).toContain('data-mobile-layout="source-title-below-canvas"');
    expect(source).toContain("top-5 left-5 hidden");
    expect(source).toContain("sm:block");
    expect(source.indexOf('data-mobile-layout="source-title-below-canvas"')).toBeGreaterThan(
      source.indexOf("ref={containerRef}"),
    );
  });
});
