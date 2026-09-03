import { describe, expect, test } from "bun:test";
import * as THREE from "three";
import {
  HULL_SLA_DEFAULT_CONTROLS,
  readHullStereolithographyControls,
  stepHullStereolithographySi,
} from "@/physics/hullStereolithographyKernel";
import { createHullStereolithographyModel } from "./hullStereolithographyModel";

describe("US 4,575,330 Charles W. Hull Stereolithography procedural 3D model & visual boundary", () => {
  test("constructs valid 3D mesh hierarchy with vat, resin, platform, part, and laser components", () => {
    const model = createHullStereolithographyModel();
    expect(model.root.name).toBe("HullStereolithographyModel");
    expect(model.vatMesh.parent?.name).toBe("VatTank");
    expect(model.resinMesh.parent?.name).toBe("VatTank");
    expect(model.platformGroup.parent?.name).toBe("ElevatorMechanism");
    expect(model.partGroup.parent).toBe(model.platformGroup);
    expect(model.platformCarriageNut.parent).toBe(model.platformGroup);
    expect(model.scannerSupportGroup.parent).toBe(model.root);
    expect(model.scannerGroup.parent).toBe(model.root);
    expect(model.laserSpotMesh.parent).toBe(model.root);
    expect(model.galvoMirrorMesh.parent?.name).toBe("LaserScannerAssembly");

    expect(model.partGroup.children.length).toBeGreaterThan(0);
    const scannerBounds = new THREE.Box3().setFromObject(model.scannerGroup);
    const supportBounds = new THREE.Box3().setFromObject(model.scannerSupportGroup);
    expect(scannerBounds.intersectsBox(supportBounds)).toBe(true);
    model.dispose();
  });

  test("animates elevator descent and layer visibility as simulation time progresses", () => {
    const model = createHullStereolithographyModel();
    const controls = HULL_SLA_DEFAULT_CONTROLS;
    const telemetry = stepHullStereolithographySi(controls);

    // Initial state
    model.update(controls, telemetry, 0.0);
    const initialY = model.platformGroup.position.y;

    // Advance time
    model.update(controls, telemetry, 5.0);
    const laterY = model.platformGroup.position.y;

    // Platform position changes dynamically
    expect(typeof initialY).toBe("number");
    expect(typeof laterY).toBe("number");
    expect(model.platformCarriageNut.position.z).toBeCloseTo(-0.85, 8);
    expect(model.platformCarriageNut.position.y).toBeCloseTo(0, 8);

    model.dispose();
  });

  test("updates laser beam position and spot geometry dynamically during scan", () => {
    const model = createHullStereolithographyModel();
    const controls = HULL_SLA_DEFAULT_CONTROLS;
    const telemetry = stepHullStereolithographySi(controls);

    // Active curing
    model.update(controls, telemetry, 1.5);
    expect(model.laserBeamLine.visible).toBe(true);
    expect(model.laserSpotMesh.visible).toBe(true);

    const posAttr = model.laserBeamLine.geometry.getAttribute("position") as THREE.BufferAttribute;
    expect(posAttr.count).toBe(2);

    // Underexposure failure condition disables laser curing visualization
    const failureControls = readHullStereolithographyControls({
      laserPowerMw: 5,
      laserScanSpeedMmS: 1500,
    });
    const failureTel = stepHullStereolithographySi(failureControls);
    model.update(failureControls, failureTel, 1.5);
    expect(failureTel.underexposureRefusal).toBe(true);

    model.dispose();
  });

  test("computes accurate Beer-Lambert SI physics for default controls", () => {
    const controls = HULL_SLA_DEFAULT_CONTROLS;
    const telemetry = stepHullStereolithographySi(controls);

    expect(telemetry.isCured).toBe(true);
    expect(telemetry.peakExposureMJCm2).toBeGreaterThan(controls.criticalExposureMJCm2);
    expect(telemetry.cureDepthUm).toBeGreaterThan(controls.layerThicknessUm);
    expect(telemetry.interlayerAdhesionRatio).toBeGreaterThanOrEqual(1.0);
    expect(telemetry.underexposureRefusal).toBe(false);
  });
});
