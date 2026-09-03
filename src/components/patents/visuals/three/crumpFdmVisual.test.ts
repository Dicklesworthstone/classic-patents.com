import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { CRUMP_FDM_DEFAULT_CONTROLS, stepCrumpFdmSi } from "@/physics/crumpFdmKernel";
import { crumpViewForViewport } from "./crumpFdmCamera";
import { createCrumpFdmModel } from "./crumpFdmModel";

describe("US 5,121,329 Crump FDM Procedural 3D Visual Model", () => {
  test("uses a phone camera and normal-flow telemetry without covering the model", () => {
    const desktop = crumpViewForViewport("isometric", 1200);
    const phone = crumpViewForViewport("isometric", 320);
    const distance = (view: typeof desktop) =>
      Math.hypot(
        view.position[0] - view.target[0],
        view.position[1] - view.target[1],
        view.position[2] - view.target[2],
      );
    expect(distance(phone) / distance(desktop)).toBeCloseTo(1.45, 8);

    const source = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/CrumpFdm3D.tsx"),
      "utf8",
    );
    const canvas = source.indexOf("ref={containerRef}");
    const mobileTelemetry = source.indexOf('data-mobile-layout="telemetry-after-canvas"');
    expect(mobileTelemetry).toBeGreaterThan(canvas);
    expect(source).toContain('id="crump-3d-camera-view"');
    expect(source).toContain("min-h-[360px]");
    expect(source).toContain("sm:hidden");
  });

  test("instantiates complete 3D hierarchy and scene meshes", () => {
    const model = createCrumpFdmModel();
    expect(model.root).toBeDefined();
    expect(model.root.name).toBe("CrumpFdmApparatus");
    expect(model.gantryGroup).toBeDefined();
    expect(model.xBridgeGroup).toBeDefined();
    expect(model.carriageGroup).toBeDefined();
    expect(model.bedGroup).toBeDefined();
    expect(model.zLiftSupportGroup.parent).toBe(model.root);
    expect(model.partGroup).toBeDefined();
    expect(model.nozzleMesh).toBeDefined();
    expect(model.planarNozzleLandMesh).toBeDefined();
    expect(model.roundedOutletMesh).toBeDefined();
    expect(model.heaterBlockMesh).toBeDefined();
    expect(model.heaterCoilGroup.children).toHaveLength(3);
    expect(model.driveRollerMesh).toBeDefined();
    expect(model.pinchRollerMesh).toBeDefined();
    expect(model.activeBeadMesh).toBeDefined();
    expect(model.flattenedRoadMesh).toBeDefined();
    expect(model.unshearedBeadMesh).toBeDefined();
    expect(model.filamentLine).toBeDefined();
    expect(model.filamentSegmentMeshes).toHaveLength(3);
    expect(model.filamentGuideMesh.parent).toBe(model.root);
    expect(model.spoolGroup.parent).toBe(model.root);
    expect(model.spoolSupportGroup.parent).toBe(model.root);
    expect(model.filamentLine.parent).toBe(model.root);
    expect(model.filamentSegmentMeshes.every((segment) => segment.parent === model.root)).toBe(
      true,
    );

    // Verify scene graph nesting
    expect(model.xBridgeGroup.parent).toBe(model.gantryGroup);
    expect(model.carriageGroup.parent).toBe(model.xBridgeGroup);
    expect(model.bedGroup.children.includes(model.partGroup)).toBe(true);
    expect(model.root.children.includes(model.bedGroup)).toBe(true);
    expect(model.root.children.includes(model.gantryGroup)).toBe(true);

    model.dispose();
  });

  test("animates kinematics and updates mesh state based on SI telemetry", () => {
    const model = createCrumpFdmModel();
    const tel = stepCrumpFdmSi(CRUMP_FDM_DEFAULT_CONTROLS);

    // Initial update at t = 0
    model.update(CRUMP_FDM_DEFAULT_CONTROLS, tel, 0);
    expect(model.activeBeadMesh.visible).toBe(true);
    const initialX = model.carriageGroup.position.x;
    const initialDriveOrientation = model.driveRollerMesh.quaternion.clone();

    // Step to t = 1.0s
    model.update(CRUMP_FDM_DEFAULT_CONTROLS, tel, 1.0);
    expect(model.carriageGroup.position.x).not.toBe(initialX);
    expect(Math.hypot(model.carriageGroup.position.x, model.xBridgeGroup.position.z)).toBeCloseTo(
      0.31,
      8,
    );
    expect(model.driveRollerMesh.quaternion.angleTo(initialDriveOrientation)).toBeGreaterThan(0.01);
    const driveAxis = new THREE.Vector3(0, 1, 0).applyQuaternion(model.driveRollerMesh.quaternion);
    expect(Math.abs(driveAxis.z)).toBeCloseTo(1, 8);

    const path = model.filamentLine.geometry.getAttribute("position");
    expect(path.getX(0)).toBeCloseTo(0, 6);
    expect(path.getY(0)).toBeCloseTo(2.84, 6);
    expect(path.getZ(0)).toBeCloseTo(0.36, 6);
    expect(path.getX(2)).toBeCloseTo(model.carriageGroup.position.x, 6);
    expect(path.getZ(2)).toBeCloseTo(model.xBridgeGroup.position.z + 0.12, 6);

    const frontRail = model.root.getObjectByName("Moving X rail front");
    const rearRail = model.root.getObjectByName("Moving X rail rear");
    const fixedLeftRail = model.root.getObjectByName("Fixed Y rail left");
    const fixedRightRail = model.root.getObjectByName("Fixed Y rail right");
    const leftBearing = model.root.getObjectByName("X-bridge Y-rail bearing left");
    const rightBearing = model.root.getObjectByName("X-bridge Y-rail bearing right");
    expect(frontRail?.parent).toBe(model.xBridgeGroup);
    expect(rearRail?.parent).toBe(model.xBridgeGroup);
    expect(leftBearing?.parent).toBe(model.xBridgeGroup);
    expect(rightBearing?.parent).toBe(model.xBridgeGroup);

    const bounds = (object: THREE.Object3D | undefined) => {
      if (!object) throw new Error("Expected named FDM support object to exist.");
      return new THREE.Box3().setFromObject(object);
    };
    expect(bounds(leftBearing).intersectsBox(bounds(fixedLeftRail))).toBe(true);
    expect(bounds(rightBearing).intersectsBox(bounds(fixedRightRail))).toBe(true);
    expect(bounds(leftBearing).intersectsBox(bounds(frontRail))).toBe(true);
    expect(bounds(leftBearing).intersectsBox(bounds(rearRail))).toBe(true);

    const articleReceivingBasePlate = model.root.getObjectByName("Article-receiving base plate 10");
    for (const side of ["left", "right"]) {
      const screw = model.root.getObjectByName(`Build-platform Z lead screw ${side}`);
      const nut = model.root.getObjectByName(`Build-platform Z carriage nut ${side}`);
      const baseBearing = model.root.getObjectByName(`Z lead-screw base bearing ${side}`);
      expect(bounds(nut).intersectsBox(bounds(screw))).toBe(true);
      expect(bounds(nut).intersectsBox(bounds(articleReceivingBasePlate))).toBe(true);
      expect(bounds(baseBearing).intersectsBox(bounds(screw))).toBe(true);
    }

    const spoolAxle = model.root.getObjectByName("Filament spool axle");
    const topCrown = model.root.getObjectByName("Chassis top crown");
    for (const side of ["left", "right"]) {
      const yoke = model.root.getObjectByName(`Spool axle yoke ${side}`);
      expect(bounds(yoke).intersectsBox(bounds(spoolAxle))).toBe(true);
      expect(bounds(yoke).intersectsBox(bounds(topCrown))).toBe(true);
    }

    model.root.updateMatrixWorld(true);
    for (let index = 0; index < model.filamentSegmentMeshes.length; index += 1) {
      const segment = model.filamentSegmentMeshes[index];
      const start = new THREE.Vector3(0, -0.5, 0).applyMatrix4(segment.matrixWorld);
      const end = new THREE.Vector3(0, 0.5, 0).applyMatrix4(segment.matrixWorld);
      expect(start.x).toBeCloseTo(path.getX(index), 6);
      expect(start.y).toBeCloseTo(path.getY(index), 6);
      expect(start.z).toBeCloseTo(path.getZ(index), 6);
      expect(end.x).toBeCloseTo(path.getX(index + 1), 6);
      expect(end.y).toBeCloseTo(path.getY(index + 1), 6);
      expect(end.z).toBeCloseTo(path.getZ(index + 1), 6);
    }

    model.root.updateMatrixWorld(true);
    const nozzleLandBounds = new THREE.Box3().setFromObject(model.planarNozzleLandMesh);
    const partBounds = new THREE.Box3().setFromObject(model.partGroup);
    const activeBeadBounds = new THREE.Box3().setFromObject(model.activeBeadMesh);
    // The visible bridge must meet the actual planar-land bottom and the actual
    // current-layer top, not a duplicated approximation of either coordinate.
    expect(activeBeadBounds.max.y).toBeCloseTo(nozzleLandBounds.min.y, 8);
    expect(activeBeadBounds.min.y).toBeCloseTo(partBounds.max.y, 8);
    expect(nozzleLandBounds.min.y - partBounds.max.y).toBeCloseTo(
      CRUMP_FDM_DEFAULT_CONTROLS.layerHeightMm * 0.1,
      8,
    );
    expect(model.flattenedRoadMesh.visible).toBe(true);
    expect(model.unshearedBeadMesh.visible).toBe(false);

    // Test refusal / inactive extrusion hides bead
    const stoppedTel = { ...tel, isExtruding: false };
    model.update(CRUMP_FDM_DEFAULT_CONTROLS, stoppedTel, 2.0);
    expect(model.activeBeadMesh.visible).toBe(false);

    model.dispose();
  });

  test("renders a flat Claim 39 outlet and distinct, non-fabricated claim comparisons", () => {
    const model = createCrumpFdmModel();
    const defaultTelemetry = stepCrumpFdmSi(CRUMP_FDM_DEFAULT_CONTROLS);
    model.update(CRUMP_FDM_DEFAULT_CONTROLS, defaultTelemetry, 0.5);

    expect(model.nozzleMesh.geometry.type).toBe("CylinderGeometry");
    expect(model.planarNozzleLandMesh.geometry.type).toBe("CylinderGeometry");
    expect(model.planarNozzleLandMesh.visible).toBe(true);
    expect(model.roundedOutletMesh.visible).toBe(false);
    expect(model.heaterBlockMesh.visible).toBe(true);
    expect(model.heaterCoilGroup.visible).toBe(true);
    expect(model.gantryGroup.visible).toBe(true);

    const claim39Controls = {
      ...CRUMP_FDM_DEFAULT_CONTROLS,
      claim39PlanarNozzleEnabled: 0,
    };
    model.update(claim39Controls, stepCrumpFdmSi(claim39Controls), 0.5);
    expect(model.planarNozzleLandMesh.visible).toBe(false);
    expect(model.roundedOutletMesh.visible).toBe(true);
    expect(model.flattenedRoadMesh.visible).toBe(false);
    expect(model.unshearedBeadMesh.visible).toBe(true);
    expect(model.activeBeadMesh.visible).toBe(true);
    model.root.updateMatrixWorld(true);
    const unshearedBounds = new THREE.Box3().setFromObject(model.unshearedBeadMesh);
    const partBounds = new THREE.Box3().setFromObject(model.partGroup);
    const roundedOutletBounds = new THREE.Box3().setFromObject(model.roundedOutletMesh);
    expect(unshearedBounds.min.y).toBeCloseTo(partBounds.max.y, 3);
    expect(unshearedBounds.max.y).toBeCloseTo(roundedOutletBounds.min.y, 3);

    const claim2Controls = { ...CRUMP_FDM_DEFAULT_CONTROLS, claim2HeatingEnabled: 0 };
    model.update(claim2Controls, stepCrumpFdmSi(claim2Controls), 0.5);
    expect(model.gantryGroup.visible).toBe(true);
    expect(model.heaterBlockMesh.visible).toBe(false);
    expect(model.heaterCoilGroup.visible).toBe(false);
    expect(model.activeBeadMesh.visible).toBe(false);

    const claim1Controls = { ...CRUMP_FDM_DEFAULT_CONTROLS, claim1ApparatusEnabled: 0 };
    model.update(claim1Controls, stepCrumpFdmSi(claim1Controls), 0.5);
    expect(model.gantryGroup.visible).toBe(false);
    expect(model.bedGroup.visible).toBe(false);
    expect(model.zLiftSupportGroup.visible).toBe(false);
    expect(model.spoolGroup.visible).toBe(false);
    expect(model.spoolSupportGroup.visible).toBe(false);
    expect(model.filamentLine.visible).toBe(false);
    expect(model.root.getObjectByName("ChassisFrame")?.visible).not.toBe(false);

    model.dispose();
  });

  test("labels the Figure 5 feed path and avoids invented heated-bed semantics", () => {
    const model = createCrumpFdmModel();
    expect(model.root.getObjectByName("Drive roller 134")).toBe(model.driveRollerMesh);
    expect(model.root.getObjectByName("Idler roller 136")).toBe(model.pinchRollerMesh);
    expect(model.root.getObjectByName("Article-receiving base plate 10")).toBeDefined();
    expect(model.root.getObjectByName("Heated build plate")).toBeUndefined();
    expect(model.root.getObjectByName("Claim 39 substantially planar nozzle bottom")).toBe(
      model.planarNozzleLandMesh,
    );
    model.dispose();
  });
});
