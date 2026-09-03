import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as THREE from "three";
import { InteractiveDiagramViewer } from "@/components/patents/InteractiveDiagramViewer";
import { salisburyRobotHandPatent } from "@/data/patents/salisbury-robot-hand";
import {
  SALISBURY_HAND_DEFAULT_CONTROLS,
  stepSalisburyRobotHandSi,
} from "@/physics/salisburyRobotHandKernel";
import { salisburyRobotHandCameraForViewport } from "./salisburyRobotHandCamera";
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

  test("builds palm 20 from connected angular member 22 and terminal member 24", () => {
    const model = buildSalisburyRobotHandModel();
    model.rootGroup.updateMatrixWorld(true);
    const wristPlate = model.rootGroup.getObjectByName("wrist-terminal-plate") as THREE.Object3D;
    const palm = model.rootGroup.getObjectByName("palm-20") as THREE.Object3D;
    const angular = model.rootGroup.getObjectByName("palm angular member 22") as THREE.Object3D;
    const terminal = model.rootGroup.getObjectByName("palm terminal member 24") as THREE.Object3D;
    expect(wristPlate).toBeDefined();
    expect(palm).toBe(model.palmGroup);
    expect(angular.parent).toBe(model.palmGroup);
    expect(terminal.parent).toBe(model.palmGroup);
    expect(
      new THREE.Box3()
        .setFromObject(wristPlate)
        .intersectsBox(new THREE.Box3().setFromObject(palm)),
    ).toBe(true);
    expect(
      new THREE.Box3()
        .setFromObject(angular)
        .intersectsBox(new THREE.Box3().setFromObject(terminal)),
    ).toBe(true);
    model.dispose();
  });

  test("stacks all four source-numbered Axis-1 sheaves contiguously on one pin", () => {
    const model = buildSalisburyRobotHandModel();
    for (let fingerIndex = 1; fingerIndex <= 3; fingerIndex++) {
      const labels = ["30′", "30″", "30‴", "30⁗"];
      const pulleys = labels.map(
        (label) =>
          model.rootGroup.getObjectByName(
            `finger-${fingerIndex}-Axis-1-pulley-${label}`,
          ) as THREE.Mesh,
      );
      const pin = model.rootGroup.getObjectByName(
        `finger-${fingerIndex}-Axis-1-pin-36`,
      ) as THREE.Mesh;
      expect(pulleys.every(Boolean)).toBe(true);
      expect(pin).toBeDefined();
      expect(new Set(pulleys.map((pulley) => pulley.position.x))).toEqual(new Set([0]));
      expect(new Set(pulleys.map((pulley) => pulley.position.z))).toEqual(new Set([0]));
      expect(pulleys.map((pulley) => pulley.position.y)).toEqual([-0.12, -0.04, 0.04, 0.12]);
      for (const pulley of pulleys) {
        expect(
          new THREE.Box3().setFromObject(pin).intersectsBox(new THREE.Box3().setFromObject(pulley)),
        ).toBe(true);
      }
    }
    model.dispose();
  });

  test("seats elongated resilient covers on every distal joint instead of floating spheres", () => {
    const model = buildSalisburyRobotHandModel();
    model.rootGroup.updateMatrixWorld(true);
    for (let fingerIndex = 1; fingerIndex <= 3; fingerIndex++) {
      const cover = model.rootGroup.getObjectByName(
        `finger-${fingerIndex}-resilient-tip-cover-48`,
      ) as THREE.Mesh;
      expect(cover.geometry.type).toBe("CapsuleGeometry");
      expect(
        new THREE.Box3()
          .setFromObject(cover)
          .intersectsBox(new THREE.Box3().setFromObject(model.fingers[fingerIndex - 1].distalLink)),
      ).toBe(true);
    }
    model.dispose();
  });

  test("makes both claim predicates mechanically visible without corrupting raw tensions", () => {
    const model = buildSalisburyRobotHandModel();
    const fixed = stepSalisburyRobotHandSi(SALISBURY_HAND_DEFAULT_CONTROLS);
    updateSalisburyRobotHandModel(model, fixed);
    expect(model.fingers.every((finger) => finger.root.visible)).toBe(true);
    expect(model.fingers.every((finger) => finger.firstIdlerLock.visible)).toBe(true);
    expect(model.fingers.every((finger) => !finger.firstIdlerFreeMarker.visible)).toBe(true);

    const released = stepSalisburyRobotHandSi({
      ...SALISBURY_HAND_DEFAULT_CONTROLS,
      firstIdlerFixed: false,
    });
    updateSalisburyRobotHandModel(model, released);
    expect(model.fingers.every((finger) => !finger.firstIdlerLock.visible)).toBe(true);
    expect(model.fingers.every((finger) => finger.firstIdlerFreeMarker.visible)).toBe(true);

    const withheld = stepSalisburyRobotHandSi({
      ...SALISBURY_HAND_DEFAULT_CONTROLS,
      claim1RoutingPresent: false,
    });
    updateSalisburyRobotHandModel(model, withheld);
    expect(model.sourceTopologyObjects.every((object) => !object.visible)).toBe(true);
    expect(model.rootGroup.userData.claim1RoutingPresent).toBe(false);
    expect(model.rootGroup.userData.activeJointCoordinates).toBe(0);
    expect(model.rootGroup.userData.activeCableEndCount).toBe(0);
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

  test("gives the hand a full-height phone viewport and a compact camera selector", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/SalisburyRobotHand3D.tsx"),
      "utf8",
    );

    expect(source).toContain('id="salisbury-camera-view"');
    expect(source).toContain("sm:hidden");
    expect(source).toContain("min-h-[320px]");
    expect(source).toContain("sm:min-h-0 sm:aspect-video");
    expect(source).toContain("salisburyRobotHandCameraForViewport");
  });

  test("keeps both public faces on the shared claim-constrained source-law bus", () => {
    const threeDimensional = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/SalisburyRobotHand3D.tsx"),
      "utf8",
    );
    const twoDimensional = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/SalisburyRobotHandSim.tsx"),
      "utf8",
    );
    for (const source of [threeDimensional, twoDimensional]) {
      expect(source).toContain("effectiveParams");
      expect(source).toContain("claimConstraintStateParamId");
      expect(source).toContain("data-salisbury-routing=");
      expect(source).toContain("data-salisbury-idler=");
      expect(source).toContain("data-salisbury-runtime-source=");
      expect(source).toContain("idlerState = !tel.claim1RoutingProbe");
      expect(source).toContain("data-salisbury-contact-boundary=");
      expect(source).not.toContain("setClaimStates");
    }
    expect(threeDimensional).toContain(
      "const tel = FrankenSimEngine.stepSalisburyRobotHand(controls)",
    );
    expect(threeDimensional).toContain(
      "must re-run it once the validated WASM function is installed",
    );
  });

  test("uses cumulative serial forward kinematics for the opposing thumb projection", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/SalisburyRobotHandSim.tsx"),
      "utf8",
    );
    expect(source).toContain("const projectChain =");
    expect(source).toContain("const thirdAngle = secondAngle + axis3Delta");
    expect(source).toContain("const finger3 = projectChain(");
    expect(source).not.toContain("f3_tipX = f3_j3X");
  });

  test("fits the remote drive, palm, and all three articulated digits inside phone and desktop overview frames", () => {
    const model = buildSalisburyRobotHandModel();
    try {
      updateSalisburyRobotHandModel(
        model,
        stepSalisburyRobotHandSi(SALISBURY_HAND_DEFAULT_CONTROLS),
      );
      model.rootGroup.updateMatrixWorld(true);
      const phone = salisburyRobotHandCameraForViewport("overview", 252);
      const desktop = salisburyRobotHandCameraForViewport("overview", 1024);
      expect(phone).toEqual({ position: [7.3, 4.2, 9.8], target: [0, -0.35, 0.1] });
      expect(desktop).toEqual({ position: [6, 3.7, 8], target: [0, -0.5, 0] });

      const assertOverviewFit = (view: typeof phone, aspect: number, verticalLimit: number) => {
        const bounds = new THREE.Box3().setFromObject(model.rootGroup);
        const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
        camera.position.fromArray(view.position);
        camera.lookAt(...view.target);
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld(true);
        const projected: THREE.Vector3[] = [];
        for (const x of [bounds.min.x, bounds.max.x]) {
          for (const y of [bounds.min.y, bounds.max.y]) {
            for (const z of [bounds.min.z, bounds.max.z]) {
              projected.push(new THREE.Vector3(x, y, z).project(camera));
            }
          }
        }
        expect(Math.min(...projected.map((point) => point.x))).toBeGreaterThanOrEqual(-0.95);
        expect(Math.max(...projected.map((point) => point.x))).toBeLessThanOrEqual(0.95);
        expect(Math.min(...projected.map((point) => point.y))).toBeGreaterThanOrEqual(
          -verticalLimit,
        );
        expect(Math.max(...projected.map((point) => point.y))).toBeLessThanOrEqual(verticalLimit);
      };

      assertOverviewFit(phone, 252 / 460, 0.85);
      assertOverviewFit(desktop, 1180 / 665, 0.9);
    } finally {
      model.dispose();
    }
  });
});
