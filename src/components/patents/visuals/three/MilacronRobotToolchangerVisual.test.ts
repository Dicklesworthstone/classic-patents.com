import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import {
  MILACRON_ROBOT_TOOLCHANGER_DEFAULTS,
  stepMilacronRobotToolchanger,
} from "@/physics/milacronRobotToolchangerKernel";
import { buildMilacronRobotToolchangerModel } from "./milacronRobotToolchangerModel";

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
        }),
      );
      model.root.updateMatrixWorld(true);
      expect(new THREE.Box3().setFromObject(toolBase).min.z).toBeGreaterThan(frontBounds.max.z);
    } finally {
      model.dispose();
    }
  });

  test("models aperture 34 as a true opening that admits the stem before the slide locks", () => {
    const model = buildMilacronRobotToolchangerModel();
    try {
      const aperture = model.root.getObjectByName("Slide aperture 34 clear opening");
      const stem = model.root.getObjectByName("Retention member 32 and T-member 35 stem");
      const rails = ["left", "right", "top", "bottom"].map((side) =>
        model.root.getObjectByName(
          side === "top" || side === "bottom"
            ? `Locking slide 33 ${side} aperture bridge`
            : `Locking slide 33 ${side} rail`,
        ),
      );
      expect(aperture).toBeInstanceOf(THREE.Object3D);
      expect(stem).toBeInstanceOf(THREE.Mesh);
      expect(rails.every((rail) => rail instanceof THREE.Mesh)).toBe(true);
      if (!(stem instanceof THREE.Mesh) || rails.some((rail) => !(rail instanceof THREE.Mesh))) {
        throw new Error("Milacron slide frame is incomplete.");
      }

      model.updateState(
        stepMilacronRobotToolchanger({
          ...MILACRON_ROBOT_TOOLCHANGER_DEFAULTS,
          lockingSlideFraction: 0,
        }),
      );
      model.root.updateMatrixWorld(true);
      const openStemBounds = new THREE.Box3().setFromObject(stem);
      expect(
        rails.some((rail) =>
          new THREE.Box3().setFromObject(rail as THREE.Mesh).intersectsBox(openStemBounds),
        ),
      ).toBe(false);

      model.updateState(stepMilacronRobotToolchanger(MILACRON_ROBOT_TOOLCHANGER_DEFAULTS));
      model.root.updateMatrixWorld(true);
      const lockedStemBounds = new THREE.Box3().setFromObject(stem);
      expect(
        rails.some((rail) =>
          new THREE.Box3().setFromObject(rail as THREE.Mesh).intersectsBox(lockedStemBounds),
        ),
      ).toBe(true);
    } finally {
      model.dispose();
    }
  });

  test("makes the Claim 4 selection swap the actual retention geometry", () => {
    const model = buildMilacronRobotToolchangerModel();
    try {
      const crossbar = model.root.getObjectByName("T-member 35 crossbar 38 and display ramp 39");
      const genericHead = model.root.getObjectByName("Generic Claim 3 retention-member head");
      const leftRamp = model.root.getObjectByName("Slide ramp surface 41 left");
      expect(crossbar).toBeInstanceOf(THREE.Mesh);
      expect(genericHead).toBeInstanceOf(THREE.Mesh);
      expect(leftRamp).toBeInstanceOf(THREE.Mesh);

      model.updateState(stepMilacronRobotToolchanger(MILACRON_ROBOT_TOOLCHANGER_DEFAULTS));
      expect(crossbar?.visible).toBe(true);
      expect(leftRamp?.visible).toBe(true);
      expect(genericHead?.visible).toBe(false);

      model.updateState(
        stepMilacronRobotToolchanger({
          ...MILACRON_ROBOT_TOOLCHANGER_DEFAULTS,
          claimFourTMember: 0,
        }),
      );
      expect(crossbar?.visible).toBe(false);
      expect(leftRamp?.visible).toBe(false);
      expect(genericHead?.visible).toBe(true);
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
