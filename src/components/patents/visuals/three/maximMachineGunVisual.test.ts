import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { maximCameraForViewport } from "./maximMachineGunCamera";
import { buildMaximMachineGunModel, updateMaximMachineGunKinematics } from "./maximMachineGunModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 319,596 Hiram Maxim Muzzle-Gas Machine-Gun visual & mechanism boundary", () => {
  test("uses a closer complete-gun frame on tablet and phone without changing close-up presets", () => {
    const desktop = maximCameraForViewport("iso", 1280);
    const tablet = maximCameraForViewport("iso", 768);
    const phone = maximCameraForViewport("iso", 390);

    expect(tablet.pos[0]).toBeLessThan(desktop.pos[0]);
    expect(tablet.target).toEqual([0, -0.05, 0.35]);
    expect(phone).toEqual({ pos: [1.8, 1.3, 1.95], target: [0, -0.05, 0.35] });
    expect(maximCameraForViewport("muzzle_sleeve", 390)).toEqual({
      pos: [0.8, 0.5, 1.6],
      target: [0, 0.1, 0.9],
    });
  });

  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MaximMachineGun3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "maximMachineGunModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(threeSource).toContain('<div ref={containerRef} className="absolute inset-0" />');
    expect(threeSource).not.toContain('<div\n      ref={containerRef}\n      className="relative');
    expect(modelSource).toContain("buildMaximMachineGunModel");
    expect(modelSource).toContain("updateMaximMachineGunKinematics");
    expect(modelSource).not.toContain("stepMaximMachineGun({})");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MaximMachineGun3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "maximMachineGunModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for muzzle-gas mechanism observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MaximMachineGun3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "muzzle_sleeve",
      "reversing_linkage",
      "breech_crosshead",
      "volute_spring",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("cameraRef");
    expect(threeSource).toContain("Maxim Machine Gun 3D");
  });

  test("keeps the compact identity card free of the nested absolute SI-readout widget", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MaximMachineGun3D.tsx"),
      "utf8",
    );

    expect(threeSource).toContain('data-testid="maxim-identity-card"');
    expect(threeSource).toContain('data-testid="maxim-kernel-provenance"');
    expect(threeSource).not.toContain("<StudioKernelChips");
  });

  test("computes genuine muzzle-gas expansion and Scotch-yoke kinematics in SI units", () => {
    const atRest = FrankenSimEngine.stepMaximMachineGun({ cyclePhaseDeg: 0 });
    expect(atRest.sleeveForwardMm).toBe(0);
    expect(atRest.breechOpenMm).toBe(0);
    expect(atRest.leverAngleDeg).toBe(0);
    expect(atRest.springWoundPct).toBe(0);
    expect(atRest.isBreechOpen).toBe(false);

    const midStroke = FrankenSimEngine.stepMaximMachineGun({ cyclePhaseDeg: 180 });
    expect(midStroke.sleeveForwardMm).toBe(24);
    expect(midStroke.breechOpenMm).toBe(48);
    expect(midStroke.leverAngleDeg).toBe(18);
    expect(midStroke.springWoundPct).toBe(100);
    expect(midStroke.isBreechOpen).toBe(true);
    expect(midStroke.extractorState).toBe("EXTRACTING");
  });

  test("builds and articulates procedural fixed barrel, muzzle sleeve, reversing levers, and crankshaft crosshead correctly", () => {
    const model = buildMaximMachineGunModel();
    expect(model.rootGroup.children.length).toBeGreaterThan(1);
    expect(model.fixedBarrelGroup).toBeDefined();
    expect(model.muzzleSleeveGroup).toBeDefined();
    expect(model.reversingLeversGroup).toBeDefined();
    expect(model.reversingLeverPivots).toHaveLength(2);
    expect(model.operatingRodsGroup).toBeDefined();
    expect(model.crankshaftGroup).toBeDefined();
    expect(model.crossHeadBreechGroup).toBeDefined();
    expect(model.voluteSpringHousing).toBeDefined();
    expect(model.feedStarwheelsGroup).toBeDefined();
    expect(model.muzzleFlashMesh).toBeDefined();
    expect(model.tripodGroup.parent).toBe(model.rootGroup);
    expect(model.tripodLegs).toHaveLength(3);
    expect(model.tripodFeet).toHaveLength(3);

    model.tripodLegs.forEach((leg, index) => {
      const height = (leg.geometry as THREE.CylinderGeometry).parameters.height;
      const halfAxis = new THREE.Vector3(0, height / 2, 0).applyQuaternion(leg.quaternion);
      const endpointA = leg.position.clone().add(halfAxis);
      const endpointB = leg.position.clone().sub(halfAxis);
      const hubResidual = Math.min(
        endpointA.distanceTo(model.tripodHub.position),
        endpointB.distanceTo(model.tripodHub.position),
      );
      const footTop = model.tripodFeet[index].position.clone().add(new THREE.Vector3(0, 0.03, 0));
      const footResidual = Math.min(endpointA.distanceTo(footTop), endpointB.distanceTo(footTop));
      expect(hubResidual).toBeLessThan(1e-9);
      expect(footResidual).toBeLessThan(1e-9);
    });

    const maxim = FrankenSimEngine.stepMaximMachineGun({ cyclePhaseDeg: 180 });
    const { isMuzzleFlash } = updateMaximMachineGunKinematics(
      model,
      0.016,
      Math.PI,
      maxim.fireOmegaRadPerS,
      75,
      true,
      true,
    );
    expect(typeof isMuzzleFlash).toBe("boolean");
    expect(model.materials.gunmetal.transparent).toBe(true);
    expect(model.muzzleSleeveGroup.position.z).toBeGreaterThan(0.01);
    expect(model.crossHeadBreechGroup.position.z).toBeLessThan(-0.01);
    expect(model.reversingLeversGroup.rotation.x).toBe(0);
    for (const pivot of model.reversingLeverPivots) {
      expect(pivot.rotation.x).toBeLessThan(0);
      expect(pivot.getObjectByName(pivot.name.replace("Pivot", "Pin"))).toBeDefined();
    }

    model.dispose();
  });

  test("forbids legacy recoil, toggle lock, and water jacket terms across US 319,596 visuals and data", () => {
    const patentSource = readFileSync(
      join(process.cwd(), "src/data/patents/maxim-machine-gun.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "MaximMachineGun3D.tsx"),
      "utf8",
    );
    const sim2dSource = readFileSync(join(VISUALS_DIRECTORY, "MaximMachineGunSim.tsx"), "utf8");

    for (const forbidden of [
      "water_jacket",
      "waterJacket",
      "toggle_lock",
      "toggleLock",
      "short-recoil",
      "recoilStroke",
      "250-round",
      "canvas belt",
      "fusee cam",
    ]) {
      expect(patentSource.toLowerCase()).not.toContain(forbidden.toLowerCase());
      expect(threeSource.toLowerCase()).not.toContain(forbidden.toLowerCase());
      expect(sim2dSource.toLowerCase()).not.toContain(forbidden.toLowerCase());
    }
  });
});
