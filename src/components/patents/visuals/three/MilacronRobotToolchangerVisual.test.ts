import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import {
  MILACRON_ROBOT_TOOLCHANGER_DEFAULTS,
  stepMilacronRobotToolchanger,
} from "@/physics/milacronRobotToolchangerKernel";
import {
  buildMilacronRobotToolchangerModel,
  MILACRON_EXHIBIT_FLOOR_Y,
} from "./milacronRobotToolchangerModel";

const ROOT = process.cwd();
const source = (path: string) => readFileSync(join(ROOT, path), "utf8");

describe("US 4,512,709 toolchanger visual source contract", () => {
  test("uses the shared source-bounded engagement kernel on both visual faces", () => {
    const twoD = source("src/components/patents/visuals/MilacronRobotToolchangerSim.tsx");
    const threeD = source("src/components/patents/visuals/three/MilacronRobotToolchanger3D.tsx");
    const model = source("src/components/patents/visuals/three/milacronRobotToolchangerModel.ts");
    expect(twoD).toContain("usePatentPhysics(PATENT_ID)");
    expect(twoD).toContain("stepMilacronRobotToolchanger(params)");
    expect(threeD).toContain("usePatentPhysics(PATENT_ID)");
    expect(threeD).toContain("useFrankenSimPhysics");
    expect(threeD).toContain("isRefused: true");
    expect(threeD).toContain("createThreeStudioScene");
    expect(threeD).toContain("MILACRON_FRANKENSIM_JOINT_OWNER");
    expect(threeD).toContain("MILACRON_FRANKENSIM_CONTACT_OWNER");
    expect(model).toContain("Normalized display positions");
    expect(model).not.toContain("Math.random");
    expect(model).not.toContain("GLTFLoader");
  });

  test("mates the registered base to the front plate without interpenetration", () => {
    const model = buildMilacronRobotToolchangerModel();
    try {
      model.updateState(stepMilacronRobotToolchanger(MILACRON_ROBOT_TOOLCHANGER_DEFAULTS));
      model.root.updateMatrixWorld(true);
      const frontPlate = model.root.getObjectByName("Front plate 26 and central opening 30");
      const toolBase = model.root.getObjectByName("Common tool base 18 face plate");
      expect(frontPlate).toBeInstanceOf(THREE.Mesh);
      expect(toolBase).toBeInstanceOf(THREE.Mesh);
      if (!(frontPlate instanceof THREE.Mesh) || !(toolBase instanceof THREE.Mesh)) {
        throw new Error("Milacron mating plates are missing.");
      }
      const frontBounds = new THREE.Box3().setFromObject(frontPlate);
      const baseBounds = new THREE.Box3().setFromObject(toolBase);
      expect(baseBounds.min.z).toBeCloseTo(frontBounds.max.z, 8);
      const centerRay = new THREE.Raycaster(
        new THREE.Vector3(0, 0, 2),
        new THREE.Vector3(0, 0, -1),
      );
      expect(centerRay.intersectObject(frontPlate, false)).toHaveLength(0);

      model.updateState(
        stepMilacronRobotToolchanger({
          ...MILACRON_ROBOT_TOOLCHANGER_DEFAULTS,
          registrationFraction: 0,
          lockingSlideFraction: 0,
        }),
      );
      model.root.updateMatrixWorld(true);
      expect(new THREE.Box3().setFromObject(toolBase).min.z).toBeGreaterThan(frontBounds.max.z);
    } finally {
      model.dispose();
    }
  });

  test("models aperture 34 and slot 40 as true openings that never cut through stem 37", () => {
    const model = buildMilacronRobotToolchangerModel();
    try {
      const aperture = model.root.getObjectByName("Slide aperture 34 clear opening");
      const clearanceSlot = model.root.getObjectByName("Claim 4 stem clearance slot 40");
      const stem = model.root.getObjectByName("Retention member 32 and T-member 35 stem");
      const slide = model.root.getObjectByName("Locking slide 33 physical body");
      expect(aperture).toBeInstanceOf(THREE.Object3D);
      expect(clearanceSlot).toBeInstanceOf(THREE.Object3D);
      expect(stem).toBeInstanceOf(THREE.Mesh);
      expect(slide).toBeInstanceOf(THREE.Mesh);
      if (!(stem instanceof THREE.Mesh) || !(slide instanceof THREE.Mesh)) {
        throw new Error("Milacron slide frame is incomplete.");
      }

      for (const lockingSlideFraction of [0, 1]) {
        model.updateState(
          stepMilacronRobotToolchanger({
            ...MILACRON_ROBOT_TOOLCHANGER_DEFAULTS,
            lockingSlideFraction,
          }),
        );
        model.root.updateMatrixWorld(true);
        const stemCenter = new THREE.Box3().setFromObject(stem).getCenter(new THREE.Vector3());
        const ray = new THREE.Raycaster(
          new THREE.Vector3(stemCenter.x, stemCenter.y, 1),
          new THREE.Vector3(0, 0, -1),
        );
        expect(ray.intersectObject(slide, false)).toHaveLength(0);
      }
    } finally {
      model.dispose();
    }
  });

  test("makes the Claim 4 selection swap the actual retention geometry", () => {
    const model = buildMilacronRobotToolchangerModel();
    try {
      const crossbar = model.root.getObjectByName("T-member 35 crossbar 38 and display ramp 39");
      const genericHead = model.root.getObjectByName("Generic Claim 3 retention-member head");
      const upperRamp = model.root.getObjectByName("Bifurcated slide ramp surface 41 upper fork");
      expect(crossbar).toBeInstanceOf(THREE.Mesh);
      expect(genericHead).toBeInstanceOf(THREE.Mesh);
      expect(upperRamp).toBeInstanceOf(THREE.Mesh);

      model.updateState(stepMilacronRobotToolchanger(MILACRON_ROBOT_TOOLCHANGER_DEFAULTS));
      expect(crossbar?.visible).toBe(true);
      expect(upperRamp?.visible).toBe(true);
      expect(genericHead?.visible).toBe(false);

      model.updateState(
        stepMilacronRobotToolchanger({
          ...MILACRON_ROBOT_TOOLCHANGER_DEFAULTS,
          claimFourTMember: 0,
        }),
      );
      expect(crossbar?.visible).toBe(false);
      expect(upperRamp?.visible).toBe(false);
      expect(genericHead?.visible).toBe(true);
    } finally {
      model.dispose();
    }
  });

  test("aligns both locating pins with real open bushing bores along the approach axis", () => {
    const model = buildMilacronRobotToolchangerModel();
    try {
      model.updateState(stepMilacronRobotToolchanger(MILACRON_ROBOT_TOOLCHANGER_DEFAULTS));
      model.root.updateMatrixWorld(true);
      const pairs = [
        ["Cylindrical locating pin 43", "Hardened shouldered bushing 42 for cylindrical pin 43"],
        ["Diamond-section locating pin 44", "Hardened shouldered bushing 42 for diamond pin 44"],
      ] as const;

      for (const [pinName, bushingName] of pairs) {
        const pin = model.root.getObjectByName(pinName);
        const bushing = model.root.getObjectByName(bushingName);
        expect(pin).toBeInstanceOf(THREE.Mesh);
        expect(bushing).toBeInstanceOf(THREE.Mesh);
        if (!(pin instanceof THREE.Mesh) || !(bushing instanceof THREE.Mesh)) {
          throw new Error(`Missing locating pair ${pinName}.`);
        }
        const pinAxis = new THREE.Vector3(0, 1, 0).applyQuaternion(
          pin.getWorldQuaternion(new THREE.Quaternion()),
        );
        expect(Math.abs(pinAxis.x)).toBeLessThan(1e-8);
        expect(Math.abs(pinAxis.y)).toBeLessThan(1e-8);
        expect(Math.abs(pinAxis.z)).toBeCloseTo(1, 8);

        const pinCenter = pin.getWorldPosition(new THREE.Vector3());
        const bushingCenter = bushing.getWorldPosition(new THREE.Vector3());
        expect(bushingCenter.x).toBeCloseTo(pinCenter.x, 8);
        expect(bushingCenter.y).toBeCloseTo(pinCenter.y, 8);
        const boreRay = new THREE.Raycaster(
          new THREE.Vector3(bushingCenter.x, bushingCenter.y, 1),
          new THREE.Vector3(0, 0, -1),
        );
        expect(boreRay.intersectObject(bushing, false)).toHaveLength(0);
      }
    } finally {
      model.dispose();
    }
  });

  test("connects the robot wrist and tool rack to the exhibit floor", () => {
    const model = buildMilacronRobotToolchangerModel();
    try {
      model.root.updateMatrixWorld(true);
      const robotSupport = model.root.getObjectByName(
        "Normalized robot support column to exhibit floor",
      );
      const rackFoot = model.root.getObjectByName("Tool rack 20 floor foot");
      const robotFlange = model.root.getObjectByName("Normalized robot end-effector flange");
      const rearPlate = model.root.getObjectByName("Rear plate 27");
      expect(robotSupport).toBeInstanceOf(THREE.Mesh);
      expect(rackFoot).toBeInstanceOf(THREE.Mesh);
      expect(robotFlange).toBeInstanceOf(THREE.Mesh);
      expect(rearPlate).toBeInstanceOf(THREE.Mesh);
      if (
        !(robotSupport instanceof THREE.Mesh) ||
        !(rackFoot instanceof THREE.Mesh) ||
        !(robotFlange instanceof THREE.Mesh) ||
        !(rearPlate instanceof THREE.Mesh)
      ) {
        throw new Error("Milacron support chain is incomplete.");
      }
      expect(new THREE.Box3().setFromObject(robotSupport).min.y).toBeCloseTo(
        MILACRON_EXHIBIT_FLOOR_Y,
        7,
      );
      expect(new THREE.Box3().setFromObject(rackFoot).min.y).toBeCloseTo(
        MILACRON_EXHIBIT_FLOOR_Y,
        7,
      );
      expect(new THREE.Box3().setFromObject(robotFlange).max.z).toBeCloseTo(
        new THREE.Box3().setFromObject(rearPlate).min.z,
        7,
      );
    } finally {
      model.dispose();
    }
  });

  test("keeps cylinder 47, rod 46, yoke 45, and slide 33 physically connected", () => {
    const model = buildMilacronRobotToolchangerModel();
    try {
      const cylinder = model.root.getObjectByName("Actuator cylinder 47");
      const rod = model.root.getObjectByName("Piston rod 46 and adapter 66");
      const yoke = model.root.getObjectByName("Yoke block 45 rigidly affixed to slide 33");
      expect(cylinder).toBeInstanceOf(THREE.Mesh);
      expect(rod).toBeInstanceOf(THREE.Mesh);
      expect(yoke).toBeInstanceOf(THREE.Mesh);
      if (
        !(cylinder instanceof THREE.Mesh) ||
        !(rod instanceof THREE.Mesh) ||
        !(yoke instanceof THREE.Mesh)
      ) {
        throw new Error("Milacron actuator chain is incomplete.");
      }

      for (const lockingSlideFraction of [0, 0.5, 1]) {
        model.updateState(
          stepMilacronRobotToolchanger({
            ...MILACRON_ROBOT_TOOLCHANGER_DEFAULTS,
            lockingSlideFraction,
          }),
        );
        model.root.updateMatrixWorld(true);
        const cylinderBounds = new THREE.Box3().setFromObject(cylinder);
        const rodBounds = new THREE.Box3().setFromObject(rod);
        const yokeBounds = new THREE.Box3().setFromObject(yoke);
        expect(rodBounds.min.x).toBeCloseTo(cylinderBounds.max.x, 7);
        expect(rodBounds.intersectsBox(yokeBounds)).toBe(true);
      }
    } finally {
      model.dispose();
    }
  });

  test("rigidly attaches a visible tool to every common base instead of parking loose disks", () => {
    const model = buildMilacronRobotToolchangerModel();
    try {
      model.updateState(stepMilacronRobotToolchanger(MILACRON_ROBOT_TOOLCHANGER_DEFAULTS));
      model.root.updateMatrixWorld(true);
      const base = model.root.getObjectByName("Common tool base 18 face plate");
      const collar = model.root.getObjectByName("Tool 19 mounting collar");
      expect(base).toBeInstanceOf(THREE.Mesh);
      expect(collar).toBeInstanceOf(THREE.Mesh);
      if (!(base instanceof THREE.Mesh) || !(collar instanceof THREE.Mesh)) {
        throw new Error("Attached Milacron tool is incomplete.");
      }
      expect(new THREE.Box3().setFromObject(collar).min.z).toBeCloseTo(
        new THREE.Box3().setFromObject(base).max.z,
        7,
      );

      for (const index of [1, 2, 3]) {
        const parkedBase = model.root.getObjectByName(`Rack common base 18 ${index}`);
        const parkedBody = model.root.getObjectByName(`Rack tool 19 body ${index}`);
        expect(parkedBase).toBeInstanceOf(THREE.Mesh);
        expect(parkedBody).toBeInstanceOf(THREE.Mesh);
        if (!(parkedBase instanceof THREE.Mesh) || !(parkedBody instanceof THREE.Mesh)) {
          throw new Error(`Rack tool ${index} is incomplete.`);
        }
        expect(new THREE.Box3().setFromObject(parkedBody).min.z).toBeCloseTo(
          new THREE.Box3().setFromObject(parkedBase).max.z,
          7,
        );
      }
    } finally {
      model.dispose();
    }
  });

  test("provides an explicit lock cutaway without making the source plate disappear in other views", () => {
    const model = buildMilacronRobotToolchangerModel();
    try {
      const basePlate = model.root.getObjectByName("Common tool base 18 face plate");
      expect(basePlate).toBeInstanceOf(THREE.Mesh);
      if (!(basePlate instanceof THREE.Mesh)) throw new Error("Milacron tool base is missing.");
      const baseMaterial = basePlate.material;
      expect(baseMaterial).toBeInstanceOf(THREE.MeshStandardMaterial);
      if (!(baseMaterial instanceof THREE.MeshStandardMaterial)) {
        throw new Error("Milacron tool base material is not inspectable.");
      }

      model.setInspectionMode("lock");
      expect(baseMaterial.transparent).toBe(true);
      expect(baseMaterial.opacity).toBeCloseTo(0.18, 8);
      expect(basePlate.userData.isDiagrammaticLockCutaway).toBe(true);

      model.setInspectionMode("adapter");
      expect(baseMaterial.transparent).toBe(false);
      expect(baseMaterial.opacity).toBe(1);
      expect(basePlate.userData.isDiagrammaticLockCutaway).toBe(false);
    } finally {
      model.dispose();
    }
  });

  test("keeps the phone canvas clear by placing controls after it", () => {
    const threeD = source("src/components/patents/visuals/three/MilacronRobotToolchanger3D.tsx");
    const canvasIndex = threeD.indexOf("ref={containerRef}");
    const controlsIndex = threeD.indexOf('data-mobile-layout="controls-below-canvas"');

    expect(canvasIndex).toBeGreaterThan(-1);
    expect(controlsIndex).toBeGreaterThan(canvasIndex);
    expect(threeD).toContain("hidden items-start justify-between");
    expect(threeD).toContain("hidden rounded-xl");
    expect(threeD).toContain('updateParam("claimFourTMember"');
    expect(threeD).toContain('container.clientWidth < 640 ? "lock" : "adapter"');
    expect(threeD).toContain("Lock inspection uses a transparent cutaway");
  });
});
