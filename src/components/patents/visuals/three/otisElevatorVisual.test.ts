import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepOtisTopology } from "@/physics/otisWasm";
import {
  buildOtis1861HoistingModel,
  inspectOtis1861Connectivity,
  updateOtis1861Kinematics,
} from "./otis1861HoistingModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 31,128 Elisha Otis Safety Hoisting Apparatus visual & mechanics boundary", () => {
  test("routes pure procedural source-order 2D and 3D models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "OtisHoistingApparatus3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "otis1861HoistingModel.ts"),
      "utf8",
    );
    const twoDimensionalSource = readFileSync(
      join(VISUALS_DIRECTORY, "OtisHoistingApparatusSim.tsx"),
      "utf8",
    );

    for (const source of [threeSource, modelSource, twoDimensionalSource]) {
      expect(source).not.toContain("GLTFLoader");
      expect(source).not.toContain(".glb");
      expect(source).not.toContain(".gltf");
      expect(source).not.toContain("stepOtisElevator");
      expect(source).not.toContain("cabPayload");
      expect(source).not.toContain("pawlEngagementMs");
      expect(source).not.toContain("stoppingDistance");
      expect(source).not.toContain("hoistTensionKn");
    }
    for (const letteredOrgan of [
      "windingDrumH",
      "straightBeltO",
      "crossedBeltP",
      "shipperS",
      "handRopeT",
      "stopRopeU",
      "brakeShoeZ",
      "counterpoiseR",
    ]) {
      expect(modelSource).toContain(letteredOrgan);
    }
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "OtisHoistingApparatus3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "otis1861HoistingModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes views for every major connected subsystem", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "OtisHoistingApparatus3D.tsx"),
      "utf8",
    );

    for (const preset of ["overview", "safety", "drive", "interlock", "counterpoise", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Otis 1861 Complete Hoisting Apparatus 3D");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("cameraRef");
  });

  test("keeps every moving safety organ parented to D and every rope endpoint tethered", () => {
    const model = buildOtis1861HoistingModel();
    const intact = stepOtisTopology({
      platformPositionNormalized: 0.55,
      drivePhaseRad: 1,
      driveCommand: 1,
      ropeGIntact: true,
      stopRopePulled: false,
      claim1HookLockEnabled: true,
      claim3BrakeInterlockEnabled: true,
      claim4CounterpoiseEnabled: true,
    });
    updateOtis1861Kinematics(model, intact);
    expect(inspectOtis1861Connectivity(model)).toEqual([]);
    expect(model.nodes.gearJ.parent).toBe(model.nodes.windingDrumH);
    expect(model.nodes.gearK.parent).toBe(model.nodes.shaftI);
    expect(model.nodes.gearJ.getWorldPosition(model.nodes.gearJ.position.clone()).z).toBeCloseTo(
      model.nodes.gearK.getWorldPosition(model.nodes.gearK.position.clone()).z,
      6,
    );
    expect(model.nodes.windingDrumH.rotation.z).toBe(-model.nodes.shaftI.rotation.z);
    expect(model.nodes.lowerStopArm.parent).toBe(model.nodes.platformD);
    expect(model.nodes.armW.parent).toBe(model.nodes.brakeLinkageWXY);
    expect(model.nodes.ropeGIntact.visible).toBe(true);
    expect(model.nodes.ropeGBrokenPlatform.visible).toBe(false);
    expect(model.nodes.straightBeltO.material).toBe(model.materials.beltWorking);
    expect(model.nodes.crossedBeltP.material).toBe(model.materials.beltIdle);
    expect(model.nodes.straightBeltO.geometry.getAttribute("position").getZ(0)).toBe(0);
    expect(model.nodes.handRopeT.geometry.getAttribute("position").getZ(0)).toBeCloseTo(0.97, 6);

    const stopped = stepOtisTopology({
      platformPositionNormalized: 0.55,
      drivePhaseRad: 1,
      driveCommand: 0,
      ropeGIntact: true,
      stopRopePulled: true,
      claim1HookLockEnabled: true,
      claim3BrakeInterlockEnabled: true,
      claim4CounterpoiseEnabled: true,
    });
    updateOtis1861Kinematics(model, stopped);
    expect(model.nodes.straightBeltO.geometry.getAttribute("position").getZ(0)).toBe(-1.25);
    expect(model.nodes.crossedBeltP.geometry.getAttribute("position").getZ(0)).toBe(1.25);
    expect(model.nodes.brakeShoeZ.position.y).toBe(-0.43);

    const broken = stepOtisTopology({
      platformPositionNormalized: 0.55,
      drivePhaseRad: 1,
      driveCommand: -1,
      ropeGIntact: false,
      stopRopePulled: false,
      claim1HookLockEnabled: true,
      claim3BrakeInterlockEnabled: true,
      claim4CounterpoiseEnabled: true,
    });
    updateOtis1861Kinematics(model, broken);
    expect(inspectOtis1861Connectivity(model)).toEqual([]);
    expect(model.nodes.ropeGIntact.visible).toBe(false);
    expect(model.nodes.ropeGBrokenPlatform.visible).toBe(true);
    expect(model.nodes.ropeGBrokenDrum.visible).toBe(true);
    expect(model.nodes.leftPawlF.rotation.z).toBeLessThan(0);
    expect(model.nodes.rightPawlF.rotation.z).toBeGreaterThan(0);
    model.dispose();
  });
});
