import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepRobotEndEffector } from "@/physics/robotEndEffectorKernel";
import { buildRobotEndEffectorModel } from "./robotEndEffectorModel";

function requiredObject(root: THREE.Object3D, name: string): THREE.Object3D {
  const object = root.getObjectByName(name);
  expect(object).toBeDefined();
  if (!object) throw new Error(`Expected model object ${name}.`);
  return object;
}

function worldBounds(object: THREE.Object3D): THREE.Box3 {
  object.updateWorldMatrix(true, true);
  return new THREE.Box3().setFromObject(object);
}

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
    expect(organNames).toContain("Upper hand 14");
    expect(organNames).toContain("Upper hand 16");
    expect(organNames).toContain("Lower hand 18");
    expect(organNames).toContain("Lower hand 20");
    expect(organNames).toContain("Removable dovetail finger 22");
    expect(organNames).toContain("Removable dovetail finger 23");
    expect(organNames).toContain("Removable dovetail finger 24");
    expect(organNames).toContain("Removable dovetail finger 25");

    model.dispose();
  });

  test("orients the two hand pairs in opposite transverse directions as printed in Fig. 1", () => {
    const model = buildRobotEndEffectorModel();
    model.updateState(stepRobotEndEffector({ jawOpeningFraction: 0.52, frameRotationDeg: 0 }));
    model.root.updateMatrixWorld(true);
    const upper22 = requiredObject(model.root, "Outward grasping portion 104 for finger 22");
    const upper23 = requiredObject(model.root, "Outward grasping portion 104 for finger 23");
    const lower24 = requiredObject(model.root, "Outward grasping portion 104 for finger 24");
    const lower25 = requiredObject(model.root, "Outward grasping portion 104 for finger 25");
    expect(upper22.getWorldPosition(new THREE.Vector3()).y).toBeGreaterThan(0);
    expect(upper23.getWorldPosition(new THREE.Vector3()).y).toBeGreaterThan(0);
    expect(lower24.getWorldPosition(new THREE.Vector3()).y).toBeLessThan(0);
    expect(lower25.getWorldPosition(new THREE.Vector3()).y).toBeLessThan(0);
    model.dispose();
  });

  test("meshes two non-interpenetrating gear trains at a common module and shafts them to both screws", () => {
    const model = buildRobotEndEffectorModel();
    const state = stepRobotEndEffector({ jawOpeningFraction: 0.71 });
    model.updateState(state);
    model.root.updateMatrixWorld(true);
    for (const side of ["Upper", "Lower"] as const) {
      const motorGear = requiredObject(model.root, `${side} motor spur gear 66`);
      const screwGear = requiredObject(model.root, `${side} ball-screw spur gear 68`);
      const motorCenter = motorGear.getWorldPosition(new THREE.Vector3());
      const screwCenter = screwGear.getWorldPosition(new THREE.Vector3());
      const motorRadius = Number(motorGear.userData.pitchRadius);
      const screwRadius = Number(screwGear.userData.pitchRadius);
      const centerDistance = motorCenter.distanceTo(screwCenter);
      expect(centerDistance).toBeCloseTo(motorRadius + screwRadius, 8);
      expect(
        Number(screwGear.userData.toothCount) / Number(motorGear.userData.toothCount),
      ).toBeCloseTo(screwRadius / motorRadius, 3);
      expect(motorGear.rotation.x).toBeCloseTo(state.motorRevolutions * 2 * Math.PI, 8);
      expect(screwGear.rotation.x).toBeCloseTo(-state.screwAngleRad, 8);
      const shaft = requiredObject(
        model.root,
        side === "Upper" ? "Upper screw-gear shaft 70" : "Lower screw-gear shaft 70",
      );
      const plate = requiredObject(model.root, "End plate 48");
      const screw = requiredObject(
        model.root,
        side === "Upper" ? "Upper ball screw 40" : "Lower ball screw 40",
      );
      expect(worldBounds(shaft).intersectsBox(worldBounds(screwGear))).toBe(true);
      expect(worldBounds(shaft).intersectsBox(worldBounds(plate))).toBe(true);
      expect(worldBounds(shaft).intersectsBox(worldBounds(screw))).toBe(true);
      expect(screw.rotation.x).toBeCloseTo(screwGear.rotation.x, 8);
    }
    model.dispose();
  });

  test("rotates encoder pegs with gear 66 while proximity switch 74 stays on the end plate", () => {
    const model = buildRobotEndEffectorModel();
    const pegs = requiredObject(model.root, "Rotating eight-peg encoder 72");
    const firstPeg = requiredObject(model.root, "Encoder peg 72 · 1");
    const proximitySwitch = requiredObject(model.root, "Inductive proximity switch 74");
    model.root.updateMatrixWorld(true);
    expect(worldBounds(firstPeg).max.y).toBeCloseTo(worldBounds(proximitySwitch).min.y, 7);
    const initialSwitchRotation = proximitySwitch.rotation.clone();
    const state = stepRobotEndEffector({ jawOpeningFraction: 0.87 });
    model.updateState(state);
    expect(pegs.rotation.x).toBeCloseTo(state.motorRevolutions * 2 * Math.PI, 8);
    expect(proximitySwitch.rotation.x).toBe(initialSwitchRotation.x);
    expect(proximitySwitch.rotation.y).toBe(initialSwitchRotation.y);
    expect(proximitySwitch.rotation.z).toBe(initialSwitchRotation.z);
    expect(pegs.children).toHaveLength(8);
    model.dispose();
  });

  test("keeps withdrawing fingers dovetail-engaged until they disappear into the unshown fixture", () => {
    const model = buildRobotEndEffectorModel();
    const hand14 = requiredObject(model.root, "Upper hand 14");
    const handBody = requiredObject(hand14, "Sliding hand body");
    const finger22 = requiredObject(model.root, "Removable dovetail finger 22");
    model.updateState(stepRobotEndEffector({ fingerChangeFraction: 0 }));
    model.root.updateMatrixWorld(true);
    const seatedX = finger22.position.x;
    expect(worldBounds(handBody).intersectsBox(worldBounds(finger22))).toBe(true);
    model.updateState(stepRobotEndEffector({ fingerChangeFraction: 0.9 }));
    model.root.updateMatrixWorld(true);
    expect(finger22.position.x).toBeLessThan(seatedX);
    expect(worldBounds(handBody).intersectsBox(worldBounds(finger22))).toBe(true);
    expect(finger22.visible).toBe(true);
    model.updateState(stepRobotEndEffector({ fingerChangeFraction: 1 }));
    expect(finger22.visible).toBe(false);
    model.dispose();
  });

  test("supports the rotational connector on a floor-contacting exhibit stand", () => {
    const model = buildRobotEndEffectorModel();
    model.updateState(stepRobotEndEffector({ frameRotationDeg: 135 }));
    model.root.updateMatrixWorld(true);
    const assembly = requiredObject(model.root, "Connector-mounted rotating gripper assembly 10");
    const endPlate = requiredObject(model.root, "End plate 46");
    const connector = requiredObject(model.root, "Robot connector 130 rotational fitting");
    const post = requiredObject(
      model.root,
      "Exhibit wrist support for connector 130 — not claimed robot geometry",
    );
    const foot = requiredObject(model.root, "Exhibit wrist support floor foot");
    expect(assembly.rotation.x).toBeCloseTo((135 * Math.PI) / 180, 8);
    expect(worldBounds(endPlate).intersectsBox(worldBounds(connector))).toBe(true);
    expect(worldBounds(connector).min.y).toBeCloseTo(worldBounds(post).max.y, 7);
    expect(worldBounds(post).min.y).toBeCloseTo(worldBounds(foot).max.y, 7);
    expect(worldBounds(foot).min.y).toBeCloseTo(-1.7, 7);
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

  test("makes the grip request visibly responsive without presenting it as contact force", () => {
    const model = buildRobotEndEffectorModel();
    const leftIndicator = requiredObject(
      model.root,
      "Left requested grip command indicator — not contact force",
    );
    const rightIndicator = requiredObject(
      model.root,
      "Right requested grip command indicator — not contact force",
    );

    model.updateState(stepRobotEndEffector({ gripForceSetpointN: 0 }));
    const zeroScale = leftIndicator.scale.x;
    model.updateState(stepRobotEndEffector({ gripForceSetpointN: 2000 }));

    expect(leftIndicator.scale.x).toBeGreaterThan(zeroScale);
    expect(leftIndicator.userData.requestedGripForceN).toBe(2000);
    expect(rightIndicator.userData.requestedGripForceN).toBe(2000);
    expect(leftIndicator.userData.isContactForce).toBe(false);
    expect(rightIndicator.userData.isContactForce).toBe(false);
    expect(leftIndicator.position.x).toBeLessThan(0);
    expect(rightIndicator.position.x).toBeGreaterThan(0);
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
    expect(source).toContain('viewForViewport("perspective", container.clientWidth)');
    expect(source).toContain("floor.position.y = -1.7");
    expect(source).toContain("Finger change is axial dovetail withdrawal");
    expect(source).toContain("command only");
    expect(source).toContain("they are not force vectors or achieved contact force");
  });
});
