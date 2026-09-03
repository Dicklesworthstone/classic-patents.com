import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import {
  MESTRAL_VELCRO_DEFAULTS,
  MESTRAL_VELCRO_SOURCE_BOUNDARY,
  readMestralVelcroControls,
  stepMestralVelcroSi,
} from "@/physics/mestralVelcroKernel";
import {
  getEffectivePatentPhysicsParams,
  getPatentPhysicsParams,
  resetPatentPhysicsParams,
  setPatentPhysicsParam,
} from "@/physics/usePatentPhysics";
import { mestralOverviewCameraForViewport } from "./mestralVelcroCamera";
import { createMestralVelcroModel } from "./mestralVelcroModel";

function positionAttribute(mesh: THREE.Mesh | undefined): THREE.BufferAttribute {
  if (!mesh) throw new Error("Expected a hook mesh.");
  return mesh.geometry.getAttribute("position") as THREE.BufferAttribute;
}

describe("Mestral Velcro 3D Procedural Model", () => {
  test("widens the initial overview enough to show the tape and peel flap on a phone", () => {
    expect(mestralOverviewCameraForViewport(342)).toEqual({
      cameraPos: [10.75, 3.475, 25.25],
      targetPos: [0, -1.9, 0],
    });
    expect(mestralOverviewCameraForViewport(768)).toEqual({
      cameraPos: [4.5, 0.7, 9.5],
      targetPos: [0, -2.7, 0],
    });
  });

  test("projects the full hooked fabric, backing plate, and peel clamp inside 320 px and 375 px phone frames", () => {
    const model = createMestralVelcroModel();
    model.update(MESTRAL_VELCRO_DEFAULTS, stepMestralVelcroSi(MESTRAL_VELCRO_DEFAULTS));
    model.rootGroup.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(model.rootGroup);
    for (const viewportWidth of [286, 342]) {
      const cameraView = mestralOverviewCameraForViewport(viewportWidth);
      const camera = new THREE.PerspectiveCamera(42, viewportWidth / 480, 0.1, 1000);
      camera.position.set(...cameraView.cameraPos);
      camera.lookAt(...cameraView.targetPos);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld(true);

      const projected = [bounds.min.x, bounds.max.x].flatMap((x) =>
        [bounds.min.y, bounds.max.y].flatMap((y) =>
          [bounds.min.z, bounds.max.z].map((z) => new THREE.Vector3(x, y, z).project(camera)),
        ),
      );
      expect(Math.min(...projected.map((point) => point.x))).toBeGreaterThan(-0.9);
      expect(Math.max(...projected.map((point) => point.x))).toBeLessThan(0.9);
      expect(Math.min(...projected.map((point) => point.y))).toBeGreaterThan(-0.9);
      expect(Math.max(...projected.map((point) => point.y))).toBeLessThan(0.9);
    }
    model.dispose();
  });

  test("builds the source Figure 2 as two hook faces, not an invented loop face", () => {
    const model = createMestralVelcroModel();
    expect(model.rootGroup).toBeDefined();
    expect(model.rootGroup.name).toBe("mestral-velcro-root");
    expect(model.lowerTapeGroup.children.length).toBeGreaterThan(10);
    expect(model.upperTapeGroup.children.length).toBeGreaterThan(10);
    expect(model.lowerHookMeshes.length).toBe(80);
    expect(model.upperHookMeshes.length).toBe(80);
    expect(model.lowerStraightStrands.length).toBe(16);
    expect(model.upperStraightStrands.length).toBe(16);

    // Update model with default SI physics telemetry
    const tel = stepMestralVelcroSi(MESTRAL_VELCRO_DEFAULTS);
    expect(() => model.update(MESTRAL_VELCRO_DEFAULTS, tel)).not.toThrow();

    expect(model.upperTapeGroup.position.y).toBeCloseTo(1.2, 6);
    for (const mesh of [...model.lowerHookMeshes, ...model.upperHookMeshes]) {
      expect(Number.isFinite(mesh.position.x)).toBe(true);
      expect(Number.isFinite(mesh.position.y)).toBe(true);
      expect(Number.isFinite(mesh.position.z)).toBe(true);
    }

    const lowerBounds = new THREE.Box3().setFromBufferAttribute(
      positionAttribute(model.lowerHookMeshes[0]),
    );
    const upperBounds = new THREE.Box3().setFromBufferAttribute(
      positionAttribute(model.upperHookMeshes[0]),
    );
    expect(lowerBounds.max.x - lowerBounds.min.x).toBeGreaterThan(
      lowerBounds.max.z - lowerBounds.min.z,
    );
    expect(upperBounds.max.z - upperBounds.min.z).toBeGreaterThan(
      upperBounds.max.x - upperBounds.min.x,
    );

    // Clean disposal
    expect(() => model.dispose()).not.toThrow();
  });

  test("keeps every backing section connected across the peel-angle sweep", () => {
    const model = createMestralVelcroModel();
    const angles = [30, 60, 90, 120, 150];

    for (const angle of angles) {
      const controls = { ...MESTRAL_VELCRO_DEFAULTS, peelAngleDeg: angle };
      const tel = stepMestralVelcroSi(controls);
      expect(() => model.update(controls, tel)).not.toThrow();
      model.rootGroup.updateMatrixWorld(true);
      const centers = model.upperTapeSections.map((section) =>
        section.getWorldPosition(new THREE.Vector3()),
      );
      for (let index = 1; index < centers.length; index++) {
        const previous = centers[index - 1];
        const current = centers[index];
        expect(previous).toBeDefined();
        expect(current).toBeDefined();
        if (!previous || !current) throw new Error("Expected consecutive backing sections.");
        expect(current.distanceTo(previous)).toBeLessThanOrEqual(0.601);
      }
    }

    model.dispose();
  });

  test("makes diameter, hook height, and pile population visibly parametric", () => {
    const model = createMestralVelcroModel();
    const low = {
      ...MESTRAL_VELCRO_DEFAULTS,
      filamentDiameterMm: 0.1,
      hookLengthMm: 1,
      hookDensityPerCm2: 20,
    };
    model.update(low, stepMestralVelcroSi(low));
    const lowBounds = new THREE.Box3().setFromBufferAttribute(
      positionAttribute(model.lowerHookMeshes[0]),
    );
    expect(model.lowerHookMeshes.filter((hook) => hook.visible)).toHaveLength(16);

    const high = {
      ...MESTRAL_VELCRO_DEFAULTS,
      filamentDiameterMm: 0.35,
      hookLengthMm: 3,
      hookDensityPerCm2: 120,
    };
    model.update(high, stepMestralVelcroSi(high));
    const highBounds = new THREE.Box3().setFromBufferAttribute(
      positionAttribute(model.lowerHookMeshes[0]),
    );
    expect(model.lowerHookMeshes.filter((hook) => hook.visible)).toHaveLength(80);
    expect(highBounds.max.y - highBounds.min.y).toBeGreaterThan(lowBounds.max.y - lowBounds.min.y);
    expect(highBounds.max.z - highBounds.min.z).toBeGreaterThan(lowBounds.max.z - lowBounds.min.z);
    model.dispose();
  });

  test("keeps upper hooks and the applied-traction clamp attached while the peel front advances", () => {
    const model = createMestralVelcroModel();
    const earlyControls = { ...MESTRAL_VELCRO_DEFAULTS, peelProgress: 0.05 };
    const lateControls = { ...MESTRAL_VELCRO_DEFAULTS, peelProgress: 0.95 };
    const rightHandSection = model.upperTapeSections.at(-1);
    expect(rightHandSection).toBeDefined();
    if (!rightHandSection)
      throw new Error("Expected the source-view upper fabric to have sections.");
    const hookOnRightHandSection = model.upperHookMeshes.find(
      (hook) => hook.parent === rightHandSection,
    );

    expect(hookOnRightHandSection).toBeDefined();
    expect(model.peelClampGroup.parent).toBe(rightHandSection);
    expect(model.tractionArrowGroup.parent).toBe(model.peelClampGroup);

    model.update(earlyControls, stepMestralVelcroSi(earlyControls));
    const earlyDetachedHeight = rightHandSection?.position.y ?? 0;

    model.update(lateControls, stepMestralVelcroSi(lateControls));
    expect(rightHandSection?.position.y).toBeGreaterThan(earlyDetachedHeight);
    expect(rightHandSection?.rotation.z).toBeGreaterThan(0);
    expect(hookOnRightHandSection?.position.y).toBe(0);

    model.rootGroup.updateMatrixWorld(true);
    const sectionWorld = rightHandSection?.getWorldPosition(new THREE.Vector3());
    const clampWorld = model.peelClampGroup.getWorldPosition(new THREE.Vector3());
    expect(clampWorld.distanceTo(sectionWorld ?? new THREE.Vector3())).toBeLessThan(1);

    const supportBounds = new THREE.Box3().setFromObject(model.supportPlateMesh);
    expect(supportBounds.min.y).toBeCloseTo(-4.5, 6);
    model.dispose();
  });

  test("shares peel-front and claim constraints through the canonical patent bus", () => {
    const patentId = "us-2717437-mestral-velcro";
    resetPatentPhysicsParams(patentId);

    try {
      setPatentPhysicsParam(patentId, "peelProgress", 0.72);
      expect(getPatentPhysicsParams(patentId).peelProgress).toBe(0.72);

      const activeControls = readMestralVelcroControls(getEffectivePatentPhysicsParams(patentId));
      expect(activeControls.peelProgress).toBe(0.72);
      expect(activeControls.thermalSettingPresent).toBe(1);

      setPatentPhysicsParam(patentId, claimConstraintStateParamId(1), 0);
      expect(getPatentPhysicsParams(patentId).thermalSettingPresent).toBeUndefined();

      const constrainedControls = readMestralVelcroControls(
        getEffectivePatentPhysicsParams(patentId),
      );
      expect(constrainedControls.peelProgress).toBe(0.72);
      expect(constrainedControls.thermalSettingPresent).toBe(0);
      expect(stepMestralVelcroSi(constrainedControls).hookInterengagementAvailable).toBe(false);
    } finally {
      resetPatentPhysicsParams(patentId);
    }
  });

  test("keeps both Velcro faces on the effective bus controls rather than private peel or claim state", () => {
    const twoDSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/MestralVelcroSim.tsx"),
      "utf8",
    );
    const threeDSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/MestralVelcro3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/mestralVelcroModel.ts"),
      "utf8",
    );
    const kernelSource = readFileSync(
      join(process.cwd(), "src/physics/mestralVelcroKernel.ts"),
      "utf8",
    );

    for (const source of [twoDSource, threeDSource]) {
      expect(source).toContain("effectiveParams");
      expect(source).toContain("claimConstraintStateParamId");
      expect(source).not.toContain("interactivePeelProgress");
      expect(source).not.toContain("setClaimStates");
    }
    expect(threeDSource).not.toContain("useState<number>");
    expect(modelSource).toContain("tel.peelProgress");
    expect(modelSource).not.toContain("baseLoopGeo");
    expect(modelSource).not.toContain("loopMeshes");
    expect(threeDSource).not.toContain("PortHamiltonianEnergyStrip");
    expect(twoDSource).not.toContain("PortHamiltonianEnergyStrip");
    expect(kernelSource).not.toContain("NYLON_MODULUS");
    expect(kernelSource).not.toContain("Kendall");
    expect(kernelSource).not.toContain("singleHookReleaseForceN");
  });

  test("uses the responsive overview for both initial mount and Perspective reset", () => {
    const threeDSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/MestralVelcro3D.tsx"),
      "utf8",
    );
    expect(threeDSource).toContain(
      "mestralOverviewCameraForViewport(containerRef.current.clientWidth)",
    );
    expect(threeDSource).toContain(
      "mestralOverviewCameraForViewport(\n            containerRef.current?.clientWidth ?? 1024,\n          )",
    );
  });

  test("derives all printed claims dynamically from edition without duplicate strings", () => {
    const { mestralVelcroPatent } = require("@/data/patents/mestral-velcro");
    const { mestralVelcroArchivalEdition } = require("@/data/editions/mestralVelcroEdition");
    expect(mestralVelcroPatent.claims.length).toBeGreaterThan(0);
    const editionClaims = mestralVelcroArchivalEdition.blocks.filter(
      (b: any) => b.kind === "claim",
    );
    expect(editionClaims.length).toBe(mestralVelcroPatent.claims.length);

    for (const claim of mestralVelcroPatent.claims) {
      const editionBlock = editionClaims.find((c: any) => c.number === claim.number);
      expect(editionBlock).toBeDefined();
      const expectedText = editionBlock.inlines.map((inl: any) => inl.text).join("");
      expect(claim.originalText).toBe(expectedText);
    }
  });

  test("provides valid provenance classifications for all Mestral controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-2717437-mestral-velcro"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics(MESTRAL_VELCRO_DEFAULTS);
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("refuses an energy ledger because the grant cannot close one", () => {
    const {
      ENERGY_CHANNEL_OMISSION_REASONS,
      energyChannelsFor,
    } = require("@/physics/energyChannels");
    const channels = energyChannelsFor("us-2717437-mestral-velcro", MESTRAL_VELCRO_DEFAULTS);
    expect(channels).toEqual([]);
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-2717437-mestral-velcro"]).toContain(
      "force-displacement curve",
    );
  });

  test("wires claim 1 and claim 3 to binary source topology, not fake material values", () => {
    const { applyClaimConstraintModifications } = require("@/physics/claimConstraints");
    const { readMestralVelcroControls } = require("@/physics/mestralVelcroKernel");

    const res1 = applyClaimConstraintModifications(
      "us-2717437-mestral-velcro",
      {},
      { 1: false, 3: true },
    );
    expect(res1.modifiedParams.thermalSettingPresent).toBe(0);
    expect(res1.refusalWarning).toContain("SOURCE BOUNDARY");

    const tel1 = stepMestralVelcroSi(readMestralVelcroControls(res1.modifiedParams));
    expect(tel1.thermalSettingPresent).toBe(false);
    expect(tel1.quantitativeFasteningAvailable).toBe(false);

    const model = createMestralVelcroModel();
    model.update(MESTRAL_VELCRO_DEFAULTS, stepMestralVelcroSi(MESTRAL_VELCRO_DEFAULTS));
    const hookedBounds = new THREE.Box3().setFromBufferAttribute(
      positionAttribute(model.lowerHookMeshes[0]),
    );
    const constrainedControls = readMestralVelcroControls(res1.modifiedParams);
    model.update(constrainedControls, tel1);
    const straightBounds = new THREE.Box3().setFromBufferAttribute(
      positionAttribute(model.lowerHookMeshes[0]),
    );
    expect(straightBounds.max.x - straightBounds.min.x).toBeLessThan(
      hookedBounds.max.x - hookedBounds.min.x,
    );

    const res3 = applyClaimConstraintModifications(
      "us-2717437-mestral-velcro",
      {},
      { 1: true, 3: false },
    );
    expect(res3.modifiedParams.hookPilePresent).toBe(0);
    expect(res3.refusalWarning).toContain("SOURCE BOUNDARY");
    model.dispose();
  });

  test("clamps hostile inputs and exposes only exact geometry plus typed refusals", () => {
    const controls = readMestralVelcroControls({
      filamentDiameterMm: Number.NaN,
      hookLengthMm: Number.POSITIVE_INFINITY,
      hookDensityPerCm2: -500,
      peelAngleDeg: 500,
      peelProgress: -2,
    });
    expect(controls.filamentDiameterMm).toBe(MESTRAL_VELCRO_DEFAULTS.filamentDiameterMm);
    expect(controls.hookLengthMm).toBe(MESTRAL_VELCRO_DEFAULTS.hookLengthMm);
    expect(controls.hookDensityPerCm2).toBe(20);
    expect(controls.peelAngleDeg).toBe(160);
    expect(controls.peelProgress).toBe(0.05);

    const tel = stepMestralVelcroSi(controls);
    const diameterM = controls.filamentDiameterMm * 1e-3;
    expect(tel.circularSectionSecondMomentM4).toBeCloseTo((Math.PI * diameterM ** 4) / 64, 24);
    expect(tel.relativeBendingGeometryIndex).toBeCloseTo(1, 10);
    expect(tel.quantitativeFasteningAvailable).toBe(false);
    expect(tel.quantitativeEnergyAvailable).toBe(false);
    expect(tel.sourceBoundary).toBe(MESTRAL_VELCRO_SOURCE_BOUNDARY);
  });
});
