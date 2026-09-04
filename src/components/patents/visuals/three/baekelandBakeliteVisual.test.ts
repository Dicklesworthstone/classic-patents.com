import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepBaekelandBakelite } from "@/physics/catalogKernels";
import { buildBaekelandBakeliteModel } from "./baekelandBakeliteModel";

describe("US 942,699 Leo Hendrik Baekeland Bakelite visual & polymer mechanics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/baekelandBakeliteModel.ts"),
      "utf8",
    );
    const studioSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/BaekelandBakelite3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).not.toContain("GLTFLoader");
    expect(studioSource).not.toContain(".gltf");
    expect(studioSource).not.toContain(".glb");
    expect(modelSource).not.toContain("timeSec * 0.2");
    expect(modelSource).toContain("networkDisplayOmegaRadPerS");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/baekelandBakeliteModel.ts"),
      "utf8",
    );
    expect(modelSource).not.toContain("Math.random(");
    expect(modelSource).not.toContain("Date.now(");
  });

  test("exposes authentic camera presets and cutaway mode for autoclave inspection", () => {
    const studioSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/BaekelandBakelite3D.tsx"),
      "utf8",
    );
    expect(studioSource).toContain('"iso"');
    expect(studioSource).toContain('"autoclave"');
    expect(studioSource).toContain('"mold"');
    expect(studioSource).toContain('"molecular"');
    expect(studioSource).toContain('"gauges"');
    expect(studioSource).toContain("setCutaway");
    expect(studioSource).toContain("controls.setView");
    expect(studioSource).not.toContain("camera.position.set");
    expect(studioSource).toContain("claimConstraintStateParamId");
    expect(studioSource).toContain("effectivePressPsi");
    expect(studioSource).not.toContain("setClaimStates");
  });

  test("computes genuine step-growth polycondensation kinetics, gel point, and autoclave pressure in SI units", () => {
    // Unpressurized cure (foamy defect)
    const unpressurized = stepBaekelandBakelite(130, 10, 1.5, 60, 45);
    expect(unpressurized.isFoamingSuppressed).toBe(false);
    expect(unpressurized.voidPorosityPct).toBeGreaterThan(15);
    expect(unpressurized.tensileStrengthMpa).toBeLessThan(30);

    // Standard pressurized autoclave cure (dense C-stage Bakelite)
    const pressurized = stepBaekelandBakelite(130, 75, 1.5, 60, 45);
    expect(pressurized.isFoamingSuppressed).toBe(true);
    expect(pressurized.voidPorosityPct).toBeLessThan(2);
    expect(pressurized.conversionP).toBeGreaterThanOrEqual(0.85);
    expect(pressurized.resinStage).toBe("C-stage (Bakelite Thermoset)");
    expect(pressurized.tensileStrengthMpa).toBeGreaterThanOrEqual(55);
    expect(pressurized.dielectricBreakdownKvPerMm).toBeGreaterThanOrEqual(12);

    // Short/Low-temperature cure (A-stage resole liquid)
    const lowCure = stepBaekelandBakelite(60, 50, 0.5, 15, 0);
    expect(lowCure.conversionP).toBeLessThan(0.667);
    expect(lowCure.isGelled).toBe(false);
    expect(lowCure.resinStage).toBe("A-stage (Resole Liquid)");
    expect(pressurized.networkDisplayOmegaRadPerS).toBe(0);
    expect(lowCure.networkDisplayOmegaRadPerS).toBe(0.2);
  });

  test("builds and articulates procedural autoclave shell, steam jacket, mold ram, and molecular crosslinks correctly", () => {
    const model = buildBaekelandBakeliteModel();
    expect(model.rootGroup).toBeDefined();
    expect(model.nodes.autoclaveShell).toBeDefined();
    expect(model.nodes.ramGroup).toBeDefined();
    expect(model.nodes.bakeliteSpecimen).toBeDefined();
    expect(model.nodes.molecularNetworkGroup).toBeDefined();

    // Test cutaway toggle
    model.setCutaway(true);
    expect(model.nodes.autoclaveShell.visible).toBe(false);
    expect(model.nodes.cutawayShell.visible).toBe(true);

    model.setCutaway(false);
    expect(model.nodes.autoclaveShell.visible).toBe(true);
    expect(model.nodes.cutawayShell.visible).toBe(false);

    // Test dynamic update
    model.update(
      {
        curingTempC: 140,
        autoclavePressurePsi: 80,
        catalystPct: 2.0,
        curingTimeMin: 75,
        fillerPct: 50,
      },
      1.5,
    );
    expect(model.materials.bakeliteResin.color.getHex()).toBe(0x5c2b0e); // C-stage unfoamed color
    expect(model.nodes.molecularNetworkGroup.rotation.y).toBe(0);

    model.update(
      {
        curingTempC: 140,
        autoclavePressurePsi: 0,
        catalystPct: 2.0,
        curingTimeMin: 75,
        fillerPct: 50,
      },
      1.6,
    );
    expect(model.nodes.bubbleParticlesGroup.visible).toBe(true);
    expect(model.nodes.pressureNeedle.rotation.z).toBeCloseTo(0.75 * Math.PI, 8);
  });

  test("keeps the editorial molecular interpretation inside the molded specimen and mounts both gauges to the vessel", () => {
    const model = buildBaekelandBakeliteModel();
    model.rootGroup.updateMatrixWorld(true);

    const boundsFor = (object: THREE.Object3D) => new THREE.Box3().setFromObject(object);
    const specimenBounds = boundsFor(model.nodes.bakeliteSpecimen);
    const networkBounds = boundsFor(model.nodes.molecularNetworkGroup);
    const jacketBounds = boundsFor(model.nodes.steamJacket);
    const headerBounds = boundsFor(model.nodes.gaugeManifoldHeader);
    const pressureStemBounds = boundsFor(model.nodes.pressureGaugeStem);
    const pressureGaugeBounds = boundsFor(model.nodes.pressureGaugeBody);
    const temperatureStemBounds = boundsFor(model.nodes.temperatureGaugeStem);
    const temperatureGaugeBounds = boundsFor(model.nodes.temperatureGaugeBody);

    // The display-scale crosslink motif is a cured-resin interpretation, not
    // another object suspended over the pressure vessel.
    expect(model.nodes.molecularNetworkGroup.parent).toBe(model.nodes.moldGroup);
    expect(specimenBounds.containsBox(networkBounds)).toBe(true);

    // Each dial joins the vessel crown through the common header and a stem;
    // there is no visible air gap between autoclave, manifold, and instrument.
    expect(headerBounds.min.y).toBeLessThanOrEqual(jacketBounds.max.y + 0.001);
    expect(pressureStemBounds.min.y).toBeLessThanOrEqual(headerBounds.max.y + 0.001);
    expect(pressureStemBounds.max.y).toBeGreaterThanOrEqual(pressureGaugeBounds.min.y - 0.001);
    expect(temperatureStemBounds.min.y).toBeLessThanOrEqual(headerBounds.max.y + 0.001);
    expect(temperatureStemBounds.max.y).toBeGreaterThanOrEqual(
      temperatureGaugeBounds.min.y - 0.001,
    );
  });

  test("derives all printed claims dynamically from edition without duplicate strings", () => {
    const { baekelandBakelitePatent } = require("@/data/patents/baekeland-bakelite");
    const {
      baekelandBakeliteArchivalEdition,
    } = require("@/data/editions/baekelandBakeliteEdition");
    expect(baekelandBakelitePatent.claims.length).toBe(5);
    const editionClaims = baekelandBakeliteArchivalEdition.blocks.filter(
      (b: any) => b.kind === "claim",
    );
    expect(editionClaims.length).toBe(5);
    for (let i = 0; i < 5; i++) {
      const editionBlock = editionClaims[i];
      expect(editionBlock).toBeDefined();
      const expectedText = editionBlock.inlines.map((inl: any) => inl.text).join("");
      expect(baekelandBakelitePatent.claims[i].originalText).toBe(expectedText);
    }
  });

  test("registers explicit energy channel omission reason", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-942699-baekeland-bakelite"]).toBeDefined();
    expect(energyChannelsFor("us-942699-baekeland-bakelite", {})).toEqual([]);
  });
});
