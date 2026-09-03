import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import {
  buildKwolekKevlarModel,
  kwolekIllustrativeOrientationalOrder,
  kwolekIllustrativeSheetVisibility,
  poseKwolekIllustrativeOrder,
  updateKwolekKevlarKinematics,
} from "./kwolekKevlarModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 3,671,542 Stephanie Kwolek Kevlar visual & polymer physics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "kwolekKevlarModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "KwolekKevlar3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).toContain("buildKwolekKevlarModel");
    expect(modelSource).toContain("updateKwolekKevlarKinematics");
    expect(threeSource).not.toContain("useGLTF");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "kwolekKevlarModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "KwolekKevlar3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and UI overlay for polymer inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "KwolekKevlar3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "ring", "hbonds", "spinneret", "impact", "top"]) {
      expect(threeSource).toContain(preset);
    }
    expect(threeSource).toContain("isCutaway");
  });

  test("uses a continuous illustrative order guide rather than asserting a universal phase boundary", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "KwolekKevlar3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "kwolekKevlarModel.ts"),
      "utf8",
    );

    const lowOrder = kwolekIllustrativeOrientationalOrder(5, 0.3, 0);
    const justBelowFormerCutoff = kwolekIllustrativeOrientationalOrder(11.9, 0.1, 0.8);
    const justAboveFormerCutoff = kwolekIllustrativeOrientationalOrder(12, 0.1, 0.8);
    const highOrder = kwolekIllustrativeOrientationalOrder(25, 0, 1);

    expect(lowOrder).toBeLessThan(justBelowFormerCutoff);
    expect(justAboveFormerCutoff - justBelowFormerCutoff).toBeLessThan(0.01);
    expect(highOrder).toBeGreaterThan(justAboveFormerCutoff);
    expect(kwolekIllustrativeSheetVisibility(lowOrder)).toBe(0);
    expect(kwolekIllustrativeSheetVisibility(highOrder)).toBe(1);
    expect(threeSource).not.toContain("isNematicLCP");
    expect(threeSource).not.toContain("Spec Strength");
    expect(threeSource).not.toContain("Historical Patent Numeral Pins");
    expect(threeSource).toContain("do not declare a");
    expect(modelSource).toContain("kwolekIllustrativeOrientationalOrder");
    expect(modelSource).toContain("kwolekIllustrativeSheetVisibility");
  });

  test("uses the granted patent number and does not assign process illustrations to the two dope claims", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "kwolekKevlarModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "KwolekKevlar3D.tsx"),
      "utf8",
    );

    expect(threeSource).toContain("US 3,671,542");
    expect(threeSource).not.toContain("US 3,819,587");
    expect(modelSource).toContain("Optically");
    expect(modelSource).toContain("Aromatic Polyamide Dopes");
    expect(modelSource).not.toContain("Claim 1");
    expect(modelSource).not.toContain("Claim 2");
    expect(modelSource).not.toContain("gold-plated");
    expect(modelSource).not.toContain("goldNozzle");
    expect(modelSource).not.toContain("Boat-Tail");
  });

  test("computes genuine tensile strength, elastic modulus, and draw ratio scaling in SI units", () => {
    const result = FrankenSimEngine.stepKevlarContinuum(6.5, 450, 30);
    expect(result.tensileStrengthGpa).toBeGreaterThan(2.0);
    expect(result.elasticModulusGpa).toBeGreaterThan(100);
    expect(result.alignmentPct).toBeGreaterThan(80);
    expect(result.bulletDisplaySpeed).toBeCloseTo((450 / 400) * 15, 2);
    expect(result.chainWaviness).toBeCloseTo(
      (100 - result.alignmentPct) * 0.25 * (1 - 30 / 180),
      3,
    );
    expect(result.chainEndX).toBeCloseTo(350 + 30 * 0.28, 2);
    expect(result.chainWiggleAmp).toBeCloseTo(
      0.05 * (1 - result.shearAlignment) + result.thermalDisorder,
      3,
    );
    expect(result.chainWobbleAmp).toBeCloseTo(0.03 * result.thermalDisorder, 4);
    expect(result.chainWobbleOmega).toBe(2);
  });

  test("builds and articulates procedural spinneret pack, chains, and order-sensitive hydrogen-bond sheet correctly", () => {
    const model = buildKwolekKevlarModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.polymerGroup).toBeDefined();
    expect(model.spinneretPack).toBeDefined();
    expect(model.hBondsGroup).toBeDefined();
    expect(model.bulletMesh).toBeDefined();
    expect(model.bulletMesh.position.x).toBe(6.5);
    expect(model.impactWaveRms).toHaveLength(16);
    expect(model.impactWaveRms.every(Number.isFinite)).toBe(true);
    expect(model.chains.length).toBe(5);
    expect(
      model.chains.reduce(
        (count, chain) =>
          count +
          chain.group.children.filter((candidate) => candidate instanceof THREE.InstancedMesh)
            .length,
        0,
      ),
    ).toBe(20);
    expect(model.hBondsGroup.children).toHaveLength(1);
    expect(model.hBondsGroup.children[0]).toBeInstanceOf(THREE.InstancedMesh);
    expect((model.hBondsGroup.children[0] as THREE.InstancedMesh).count).toBe(20);

    const hBonds = model.hBondKinematics.mesh;
    expect(hBonds.instanceMatrix.usage).toBe(THREE.DynamicDrawUsage);
    const initialBond = new THREE.Matrix4();
    hBonds.getMatrixAt(0, initialBond);

    const kevlar = FrankenSimEngine.stepKevlarContinuum(6.5, 450, 30);
    const firstChain = model.chains[0];
    if (!firstChain) throw new Error("Kevlar model is missing its first chain.");
    firstChain.group.rotation.z = 0.25;
    firstChain.group.position.y = firstChain.baseY + 0.15;
    updateKwolekKevlarKinematics(
      model,
      0,
      false,
      true,
      kevlar.shearAlignment,
      kevlar.bulletDisplaySpeed,
    );
    const articulatedBond = new THREE.Matrix4();
    hBonds.getMatrixAt(0, articulatedBond);
    expect(Array.from(articulatedBond.elements)).not.toEqual(Array.from(initialBond.elements));

    // A low illustrative order makes the chains visibly non-parallel and fades
    // the crystalline-sheet teaching overlay rather than falsely drawing an
    // ordered bond lattice for an isotropic-style solution.
    poseKwolekIllustrativeOrder(model, 0, 0, 2, 0, 0, 2);
    updateKwolekKevlarKinematics(
      model,
      0,
      false,
      true,
      kevlar.shearAlignment,
      kevlar.bulletDisplaySpeed,
      true,
      0,
    );
    expect(model.hBondsGroup.visible).toBe(false);
    expect(model.materials.hBondMat.opacity).toBe(0);
    expect(firstChain.group.rotation.z).not.toBe(0);
    expect(firstChain.group.position.x).not.toBe(0);
    expect(model.spinneretSolidGroup.visible).toBe(false);
    expect(model.spinneretSectionGroup.visible).toBe(true);
    expect(model.materials.spinneretSteelMat.transparent).toBe(false);
    expect(model.materials.spinneretSteelMat.opacity).toBe(1);

    // Full illustrative order restores the aligned pose and makes the attached
    // crystalline-sheet overlay visible again without breaking cutaway state.
    poseKwolekIllustrativeOrder(model, 1, 0, 2, 0, 0, 2);
    updateKwolekKevlarKinematics(
      model,
      0,
      false,
      true,
      kevlar.shearAlignment,
      kevlar.bulletDisplaySpeed,
      true,
      1,
    );
    expect(model.hBondsGroup.visible).toBe(true);
    expect(model.materials.hBondMat.opacity).toBeCloseTo(0.78, 12);
    expect(firstChain.group.rotation.z).toBeCloseTo(0, 12);
    expect(firstChain.group.position.x).toBeCloseTo(0, 12);
    expect(firstChain.group.position.y).toBe(firstChain.baseY);

    const disposedMeshes: THREE.InstancedMesh[] = [];
    for (const mesh of model.instancedMeshes) {
      mesh.addEventListener("dispose", () => disposedMeshes.push(mesh));
    }

    model.dispose();
    expect(disposedMeshes).toHaveLength(model.instancedMeshes.length);
  });
});
