import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import * as THREE from "three";
import {
  HULL_SLA_DEFAULT_CONTROLS,
  stepHullStereolithographySi,
} from "@/physics/hullStereolithographyKernel";
import {
  createHullStereolithographyModel,
  HULL_RECOAT_DISPLAY_TRAVEL,
  HULL_RESIN_SURFACE_Y,
} from "./hullStereolithographyModel";

function bounds(object: THREE.Object3D): THREE.Box3 {
  object.updateWorldMatrix(true, true);
  return new THREE.Box3().setFromObject(object);
}

describe("US 4,575,330 source-bounded procedural 3D apparatus", () => {
  test("constructs one continuously supported apparatus hierarchy", () => {
    const model = createHullStereolithographyModel();

    expect(model.root.name).toBe("HullStereolithographyModel");
    expect(model.vatBaseMesh.parent?.name).toBe("Container 21");
    expect(model.resinMesh.parent?.name).toBe("Container 21");
    expect(model.partGroup.parent).toBe(model.platformGroup);
    expect(model.platformCarriageNut.parent).toBe(model.platformGroup);
    expect(model.scannerGroup.parent).toBe(model.scannerSupportGroup);
    expect(model.plotterXCarriage.parent).toBe(model.scannerSupportGroup);
    expect(model.lensCarriageGroup.parent).toBe(model.plotterXCarriage);
    expect(model.fiberLine.parent).toBe(model.root);
    expect(model.uvBeamLine.parent).toBe(model.root);
    expect(model.laminaMeshes).toHaveLength(12);

    const floorBounds = bounds(model.floorMesh);
    const vatBounds = bounds(model.vatBaseMesh);
    expect(vatBounds.min.y - floorBounds.max.y).toBeCloseTo(0, 8);

    const platformBracket = model.platformGroup.getObjectByName(
      "Continuous platform-to-carriage bracket",
    );
    expect(platformBracket).toBeDefined();
    expect(
      bounds(platformBracket as THREE.Object3D).intersectsBox(bounds(model.platformCarriageNut)),
    ).toBe(true);

    model.dispose();
  });

  test("keeps all visible laminae touching and the stack seated on platform 29", () => {
    const model = createHullStereolithographyModel();
    const controls = { ...HULL_SLA_DEFAULT_CONTROLS, displayLaminaCount: 9 };
    const state = stepHullStereolithographySi(controls);
    model.update(controls, state);
    model.root.updateMatrixWorld(true);

    expect(model.laminaMeshes.filter((lamina) => lamina.visible)).toHaveLength(9);
    const platformBounds = bounds(model.platformGroup.children[0]);
    const firstBounds = bounds(model.laminaMeshes[0]);
    expect(firstBounds.min.y - platformBounds.max.y).toBeCloseTo(0, 8);

    for (let index = 1; index < 9; index++) {
      const lower = bounds(model.laminaMeshes[index - 1]);
      const upper = bounds(model.laminaMeshes[index]);
      expect(upper.min.y - lower.max.y).toBeCloseTo(0, 8);
    }
    expect(bounds(model.laminaMeshes[8]).max.y).toBeCloseTo(HULL_RESIN_SURFACE_Y, 8);

    model.dispose();
  });

  test("moves the platform, carriage, bracket, and attached object as one prismatic assembly", () => {
    const model = createHullStereolithographyModel();
    const workingControls = { ...HULL_SLA_DEFAULT_CONTROLS, displayLaminaCount: 6 };
    const workingState = stepHullStereolithographySi(workingControls);
    model.update(workingControls, workingState, 0);
    model.root.updateMatrixWorld(true);
    const workingY = model.platformGroup.position.y;
    const workingTop = bounds(model.laminaMeshes[5]).max.y;

    const recoatControls = {
      ...workingControls,
      shutterRequestedOpen: 1,
      recoatExcursionFraction: 1,
    };
    const recoatState = stepHullStereolithographySi(recoatControls);
    model.update(recoatControls, recoatState, 10);
    model.root.updateMatrixWorld(true);

    expect(model.platformGroup.position.y).toBeCloseTo(workingY - HULL_RECOAT_DISPLAY_TRAVEL, 8);
    expect(bounds(model.laminaMeshes[5]).max.y).toBeCloseTo(
      workingTop - HULL_RECOAT_DISPLAY_TRAVEL,
      8,
    );
    expect(bounds(model.platformCarriageNut).intersectsBox(bounds(model.elevatorLeadScrew))).toBe(
      true,
    );
    expect(model.uvBeamLine.visible).toBe(false);
    expect(model.uvSpotMesh.visible).toBe(false);
    expect(model.activeLaminaMesh.visible).toBe(false);

    model.dispose();
  });

  test("moves the connected plotter carriage and light path to the selected surface coordinate", () => {
    const model = createHullStereolithographyModel();
    const controls = {
      ...HULL_SLA_DEFAULT_CONTROLS,
      scanXFraction: 1,
      scanZFraction: -1,
      recoatExcursionFraction: 0,
      shutterRequestedOpen: 1,
    };
    const state = stepHullStereolithographySi(controls);
    model.update(controls, state);
    model.root.updateMatrixWorld(true);

    expect(model.plotterXCarriage.position.x).toBeCloseTo(0.72, 8);
    expect(model.lensCarriageGroup.position.z).toBeCloseTo(-0.58, 8);
    expect(model.uvSpotMesh.position.x).toBeCloseTo(0.72, 8);
    expect(model.uvSpotMesh.position.y).toBeCloseTo(HULL_RESIN_SURFACE_Y + 0.006, 8);
    expect(model.uvSpotMesh.position.z).toBeCloseTo(-0.58, 8);
    expect(model.uvBeamLine.visible).toBe(true);

    const beam = model.uvBeamLine.geometry.getAttribute("position") as THREE.BufferAttribute;
    expect(beam.getX(0)).toBeCloseTo(beam.getX(1), 8);
    expect(beam.getZ(0)).toBeCloseTo(beam.getZ(1), 8);
    expect(beam.getY(1)).toBeCloseTo(HULL_RESIN_SURFACE_Y + 0.012, 6);

    const fiber = model.fiberLine.geometry.getAttribute("position") as THREE.BufferAttribute;
    expect(fiber.getX(4)).toBeCloseTo(0.72, 6);
    expect(fiber.getZ(4)).toBeCloseTo(-0.58, 6);

    model.dispose();
  });

  test("does not invent autonomous platform bobbing or a time-driven scan", () => {
    const model = createHullStereolithographyModel();
    const controls = HULL_SLA_DEFAULT_CONTROLS;
    const state = stepHullStereolithographySi(controls);
    model.update(controls, state, 0);
    const platformY = model.platformGroup.position.y;
    const spot = model.uvSpotMesh.position.clone();

    model.update(controls, state, 100);
    expect(model.platformGroup.position.y).toBeCloseTo(platformY, 10);
    expect(model.uvSpotMesh.position.distanceTo(spot)).toBeCloseTo(0, 10);

    model.dispose();
  });

  test("both visual faces consume shared claim-constrained controls", () => {
    const twoDimensionalSource = readFileSync(
      new URL("../HullStereolithographySim.tsx", import.meta.url),
      "utf8",
    );
    const threeDimensionalSource = readFileSync(
      new URL("./HullStereolithography3D.tsx", import.meta.url),
      "utf8",
    );

    for (const source of [twoDimensionalSource, threeDimensionalSource]) {
      expect(source).toContain("claimConstraintStateParamId");
      expect(source).toContain("effectiveParams");
      expect(source).toContain("claimConstraintResult.activeFailures");
      expect(source).toContain("onToggleClaim");
    }
    expect(threeDimensionalSource).toContain("useLiveSimParams(effectiveParams)");
  });

  test("offers an exact accessible reset that restores the shared apparatus baseline", () => {
    const threeDimensionalSource = readFileSync(
      new URL("./HullStereolithography3D.tsx", import.meta.url),
      "utf8",
    );

    expect(threeDimensionalSource).toContain("const handleReset = () => {");
    expect(threeDimensionalSource).toContain("resetParams();");
    expect(threeDimensionalSource).toContain('handlePresetChange("isometric");');
    expect(threeDimensionalSource).toContain('aria-label="Reset"');
    expect(threeDimensionalSource).toContain("onClick={handleReset}");
  });

  test("keeps the apparatus and every named tab clear of the sticky museum masthead", () => {
    const twoDimensionalSource = readFileSync(
      new URL("../HullStereolithographySim.tsx", import.meta.url),
      "utf8",
    );
    const threeDimensionalSource = readFileSync(
      new URL("./HullStereolithography3D.tsx", import.meta.url),
      "utf8",
    );

    for (const source of [twoDimensionalSource, threeDimensionalSource]) {
      expect(source).toContain("scroll-mt-24");
      expect(source).toContain("flex-wrap");
      expect(source).not.toContain("overflow-x-auto");
      expect(source).toContain("aria-label={label}");
    }

    expect(threeDimensionalSource).toContain("md:grid-cols-[minmax(0,1.2fr)_minmax(17rem,1fr)]");
    expect(threeDimensionalSource).toContain('["top", "Working surface", "Surface"]');
    expect(twoDimensionalSource).toContain('["sequence", "Figs. 1–2 sequence", "Sequence"]');
  });

  test("stacks provenance and refusal cards through the tablet breakpoint", () => {
    const threeDimensionalSource = readFileSync(
      new URL("./HullStereolithography3D.tsx", import.meta.url),
      "utf8",
    );
    const cardsStart = threeDimensionalSource.indexOf("Printed preferred source card");
    const cardsEnd = threeDimensionalSource.indexOf(
      "claimConstraintResult.activeFailures",
      cardsStart,
    );
    const sourceAndBoundaryCards = threeDimensionalSource.slice(cardsStart - 400, cardsEnd);

    expect(sourceAndBoundaryCards).toContain('className="grid gap-3 lg:grid-cols-2"');
    expect(sourceAndBoundaryCards).not.toContain("md:grid-cols-2");
  });
});
