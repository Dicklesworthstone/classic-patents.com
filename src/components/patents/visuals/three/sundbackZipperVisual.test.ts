import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  SUNDBACK_ZIPPER_DEFAULT_CONTROLS,
  stepSundbackZipperSi,
} from "@/physics/sundbackZipperKernel";
import { buildSundbackZipperModel, updateSundbackZipperKinematics } from "./sundbackZipperModel";

describe("US 1,219,881 Gideon Sundback Separable Fastener visual & kinematics boundary", () => {
  test("puts the full telemetry panel after the model on constrained screens", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/SundbackZipper3D.tsx"),
      "utf8",
    );
    const canvas = source.indexOf("ref={containerRef}");
    const mobileTelemetry = source.indexOf('data-mobile-layout="telemetry-after-canvas"');
    expect(mobileTelemetry).toBeGreaterThan(canvas);
    expect(source).toContain("hidden lg:block");
    expect(source).toContain("overflow-x-auto");
    expect(source).toContain("shrink-0");
    expect(source).toContain('data-audit-primary-control="true"');
  });

  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const model = buildSundbackZipperModel();
    expect(model.rootGroup).toBeDefined();
    expect(model.leftTeeth.length).toBeGreaterThan(20);
    expect(model.rightTeeth.length).toBeGreaterThan(20);
    expect(model.materials.brassScoop).toBeDefined();
    expect(model.materials.sliderMetal).toBeDefined();
    model.dispose();
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const model = buildSundbackZipperModel();
    const tel1 = stepSundbackZipperSi(SUNDBACK_ZIPPER_DEFAULT_CONTROLS);
    const tel2 = stepSundbackZipperSi(SUNDBACK_ZIPPER_DEFAULT_CONTROLS);

    updateSundbackZipperKinematics(model, tel1, 0);
    const pos1 = model.sliderGroup.position.clone();

    updateSundbackZipperKinematics(model, tel2, 0);
    const pos2 = model.sliderGroup.position.clone();

    expect(pos1.x).toBe(pos2.x);
    expect(pos1.y).toBe(pos2.y);
    expect(pos1.z).toBe(pos2.z);
    model.dispose();
  });

  test("computes genuine cam normal force, burst resistance, and tape strain in SI units", () => {
    const telClosed = stepSundbackZipperSi({
      ...SUNDBACK_ZIPPER_DEFAULT_CONTROLS,
      sliderPositionPct: 100,
      lateralTensionN: 50,
      staggerAligned: true,
    });
    expect(telClosed.isLocked).toBe(true);
    expect(telClosed.burstResistanceN).toBeGreaterThan(150);
    expect(telClosed.wedgeNormalForceN).toBeGreaterThan(10);
    expect(telClosed.tapeStrainPct).toBeGreaterThan(0);

    // Refusal under excessive lateral load
    const telBurst = stepSundbackZipperSi({
      ...SUNDBACK_ZIPPER_DEFAULT_CONTROLS,
      sliderPositionPct: 5,
      lateralTensionN: 180,
      staggerAligned: true,
    });
    expect(telBurst.burstRefusal).toBe(true);
    expect(telBurst.refusalReason).toContain("Chain rupture");
  });

  test("articulates procedural scoops and slider kinematics faithfully", () => {
    const model = buildSundbackZipperModel();
    const tel = stepSundbackZipperSi(SUNDBACK_ZIPPER_DEFAULT_CONTROLS);

    updateSundbackZipperKinematics(model, tel, 30);
    expect(model.sliderGroup.position.y).toBeDefined();
    expect(model.chainGroup.rotation.y).toBeGreaterThan(0);
    model.dispose();
  });

  test("derives all 11 printed claims dynamically from edition without duplicate strings", () => {
    const { sundbackZipperPatent } = require("@/data/patents/sundback-zipper");
    const { sundbackZipperArchivalEdition } = require("@/data/editions/sundbackZipperEdition");
    expect(sundbackZipperPatent.claims.length).toBe(11);
    const editionClaims = sundbackZipperArchivalEdition.blocks.filter(
      (b: any) => b.kind === "claim",
    );
    expect(editionClaims.length).toBe(11);

    for (const claim of sundbackZipperPatent.claims) {
      const editionBlock = editionClaims.find((c: any) => c.number === claim.number);
      expect(editionBlock).toBeDefined();
      const expectedText = editionBlock.inlines.map((inl: any) => inl.text).join("");
      expect(claim.originalText).toBe(expectedText);
    }
  });

  test("provides valid provenance classifications for all Sundback controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-1219881-sundback-zipper"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({ sliderPositionPct: 50 });
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("binds energy output to honest omission reason without synthetic wattage", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(energyChannelsFor("us-1219881-sundback-zipper", {})).toEqual([]);
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-1219881-sundback-zipper"]).toContain(
      "supplies no continuous slider pull velocity",
    );
  });
});
