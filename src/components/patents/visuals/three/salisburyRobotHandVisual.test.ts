import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as THREE from "three";
import { InteractiveDiagramViewer } from "@/components/patents/InteractiveDiagramViewer";
import { salisburyRobotHandPatent } from "@/data/patents/salisbury-robot-hand";
import {
  SALISBURY_HAND_DEFAULT_CONTROLS,
  stepSalisburyRobotHandSi,
} from "@/physics/salisburyRobotHandKernel";
import {
  buildSalisburyRobotHandModel,
  updateSalisburyRobotHandModel,
} from "./salisburyRobotHandModel";

describe("US 4,921,293 Salisbury & Ruoff Multi-Fingered Robotic Hand visual & kinematics boundary", () => {
  test("builds one connected procedural arm, wrist, palm, and three-digit hierarchy", () => {
    const model = buildSalisburyRobotHandModel();
    expect(model.forearmGroup.parent).toBe(model.rootGroup);
    expect(model.wristGroup.parent).toBe(model.forearmGroup);
    expect(model.palmGroup.parent).toBe(model.wristGroup);
    expect(model.fingers.length).toBe(3);
    expect(model.cableBundles.length).toBe(3);
    expect(model.actuatorSpools.length).toBe(12);
    expect(model.tensionSensors.length).toBe(12);
    for (const bundle of model.cableBundles) {
      expect(bundle.geometry.getAttribute("position").count).toBe(16);
    }
    for (const finger of model.fingers) {
      expect(finger.root.parent).toBe(model.palmGroup);
      expect(finger.yawLink.parent).toBe(finger.root);
      expect(finger.proximalLink.parent).toBe(finger.yawLink);
      expect(finger.distalLink.parent).toBe(finger.proximalLink);
      expect(finger.fingertipMesh.parent).toBe(finger.distalLink);
      expect(finger.pulleys.length).toBe(6);
      expect(finger.tendonLines.parent).toBe(model.rootGroup);
      expect(finger.tendonLines.geometry.getAttribute("position").count).toBe(24);
    }
    expect(model.materials.aluminiumChassis).toBeDefined();
    expect(model.materials.fingertipElastomer).toBeDefined();
    model.dispose();
  });

  test("keeps every solid interface and cable endpoint physically seated", () => {
    const model = buildSalisburyRobotHandModel();
    updateSalisburyRobotHandModel(model, stepSalisburyRobotHandSi(SALISBURY_HAND_DEFAULT_CONTROLS));

    const boxFor = (name: string) => {
      const object = model.rootGroup.getObjectByName(name);
      expect(object).toBeDefined();
      return new THREE.Box3().setFromObject(object as THREE.Object3D);
    };
    expect(boxFor("remote-actuator-drive").intersectsBox(boxFor("robot-arm-12"))).toBe(true);
    expect(boxFor("robot-arm-12").intersectsBox(boxFor("wrist-axis-16-yoke"))).toBe(true);
    expect(boxFor("wrist-terminal-plate").intersectsBox(boxFor("palm-20"))).toBe(true);
    for (let fingerIndex = 0; fingerIndex < 3; fingerIndex++) {
      expect(
        boxFor("palm-20").intersectsBox(boxFor(`finger-${fingerIndex + 1}-axis-1-housing`)),
      ).toBe(true);

      const external = model.cableBundles[fingerIndex].geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      const internal = model.fingers[fingerIndex].tendonLines.geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      for (let cableIndex = 0; cableIndex < 4; cableIndex++) {
        const externalStart = new THREE.Vector3().fromBufferAttribute(external, cableIndex * 4);
        const externalEnd = new THREE.Vector3().fromBufferAttribute(external, cableIndex * 4 + 3);
        const internalStart = new THREE.Vector3().fromBufferAttribute(internal, cableIndex * 6);
        const spoolTop = model.actuatorSpools[fingerIndex * 4 + cableIndex]
          .getWorldPosition(new THREE.Vector3())
          .add(new THREE.Vector3(0, 0.12, 0));
        const sensorTop = model.tensionSensors[fingerIndex * 4 + cableIndex]
          .getWorldPosition(new THREE.Vector3())
          .add(new THREE.Vector3(0, 0.06, 0));

        expect(externalStart.distanceTo(spoolTop)).toBeLessThan(1e-6);
        expect(externalEnd.distanceTo(sensorTop)).toBeLessThan(1e-6);
        expect(externalEnd.distanceTo(internalStart)).toBeLessThan(1e-6);
      }
    }
    model.dispose();
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const model = buildSalisburyRobotHandModel();
    const tel1 = stepSalisburyRobotHandSi(SALISBURY_HAND_DEFAULT_CONTROLS);
    const tel2 = stepSalisburyRobotHandSi(SALISBURY_HAND_DEFAULT_CONTROLS);

    updateSalisburyRobotHandModel(model, tel1);
    const rot1 = model.fingers[0].proximalLink.rotation.x;
    const route1 = Array.from(model.fingers[0].tendonLines.geometry.getAttribute("position").array);

    updateSalisburyRobotHandModel(model, tel2);
    const rot2 = model.fingers[0].proximalLink.rotation.x;
    const route2 = Array.from(model.fingers[0].tendonLines.geometry.getAttribute("position").array);

    expect(rot1).toBe(rot2);
    expect(route1).toEqual(route2);
    expect(route2.every((coordinate) => Number.isFinite(coordinate))).toBe(true);
    model.dispose();
  });

  test("moves the connected joint hierarchy and rewrites every attached cable segment", () => {
    const model = buildSalisburyRobotHandModel();
    const base = stepSalisburyRobotHandSi(SALISBURY_HAND_DEFAULT_CONTROLS);
    updateSalisburyRobotHandModel(model, base);
    const before = Array.from(model.fingers[0].tendonLines.geometry.getAttribute("position").array);

    const changed = stepSalisburyRobotHandSi({
      ...SALISBURY_HAND_DEFAULT_CONTROLS,
      tensionT1N: 36,
      tensionT2N: 8,
      tensionT3N: 24,
      tensionT4N: 4,
    });
    updateSalisburyRobotHandModel(model, changed);
    const after = Array.from(model.fingers[0].tendonLines.geometry.getAttribute("position").array);

    expect(after).not.toEqual(before);
    expect(after.every((coordinate) => Number.isFinite(coordinate))).toBe(true);
    expect(model.fingers[0].proximalLink.rotation.x).not.toBe(0);
    expect(model.fingers[0].distalLink.rotation.x).not.toBe(0);
    model.dispose();
  });

  test("keeps unsupported contact dynamics outside the model contract", () => {
    const telemetry = stepSalisburyRobotHandSi(SALISBURY_HAND_DEFAULT_CONTROLS);
    expect(telemetry.historicalDynamicsAvailable).toBe(false);
    expect(telemetry.historicalDynamicsRefusal).toContain("contact modulus");
    expect(telemetry.historicalDynamicsRefusal).toContain("force closure");
  });

  test("renders all seven source-figure schematics from the same live source-law state", () => {
    expect(salisburyRobotHandPatent.drawings).toHaveLength(7);

    for (const drawing of salisburyRobotHandPatent.drawings) {
      const figureNumber = Number.parseInt(drawing.figureNumber.match(/\d+/)?.[0] ?? "0", 10);
      const html = renderToStaticMarkup(
        React.createElement(InteractiveDiagramViewer, {
          drawings: [drawing],
          patentId: salisburyRobotHandPatent.id,
          patentNumber: salisburyRobotHandPatent.patentNumber,
        }),
      );
      expect(html).not.toContain("NaN");
      expect(html).not.toContain("undefined");

      if ([3, 6, 7].includes(figureNumber)) {
        expect(html).toContain("FOUR CONNECTED CABLE ENDS");
        expect(html).toContain("no historic dimensions");
      } else if ([4, 5].includes(figureNumber)) {
        expect(html).toContain("SENSOR");
        expect(html).toContain("no calibration curve");
      } else {
        expect(html).toContain("CONNECTED ARM, WRIST, PALM, AND THREE DIGITS");
        expect(html).toContain("REMOTE DRIVE 35");
      }
    }
  });
});
