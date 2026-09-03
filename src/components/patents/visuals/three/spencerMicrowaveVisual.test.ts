import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { spencerViewForViewport } from "./spencerMicrowaveCamera";
import {
  buildSpencerMicrowaveModel,
  updateSpencerMicrowaveKinematics,
} from "./spencerMicrowaveModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 2,495,429 Percy Spencer Microwave Cavity Magnetron visual & RF physics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "spencerMicrowaveModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "SpencerMicrowave3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).toContain("buildSpencerMicrowaveModel");
    expect(modelSource).toContain("updateSpencerMicrowaveKinematics");
    expect(modelSource).not.toContain("mode-strapping");
    expect(threeSource).not.toContain("Strapping Rings");
    expect(threeSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain("delta * 4.5");
    expect(modelSource).toContain("spokeDisplayOmegaRadPerS");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "spencerMicrowaveModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "SpencerMicrowave3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and UI overlay for microwave magnetron inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "SpencerMicrowave3D.tsx"),
      "utf8",
    );
    const cameraSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "spencerMicrowaveCamera.ts"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "cavity_resonator",
      "electron_spokes",
      "waveguide_launch",
      "transformer",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }
    expect(threeSource).toContain("isCutaway");

    const desktop = spencerViewForViewport("iso", 1200);
    const tablet = spencerViewForViewport("iso", 768);
    const phone = spencerViewForViewport("iso", 320);
    const distance = (view: typeof desktop) =>
      Math.hypot(
        view.pos[0] - view.target[0],
        view.pos[1] - view.target[1],
        view.pos[2] - view.target[2],
      );
    expect(distance(tablet) / distance(desktop)).toBeCloseTo(1.55, 8);
    expect(distance(phone) / distance(desktop)).toBeCloseTo(2.15, 8);
    expect(threeSource).toContain("Source-bounded energy path");
    expect(threeSource).toContain("SPENCER_3D_SOURCE_BOUNDARY");
    expect(cameraSource).toContain("modern illustrative scenario only");
    expect(threeSource).toContain("refusal: { isRefused: true");
    expect(threeSource).not.toContain("refusal: { isRefused: false }");
    expect(threeSource).not.toContain("em: {");
    expect(threeSource).toContain("Modern-scenario frequency:");
    expect(threeSource).toContain("Illustrative modern magnetron scenario");
    expect(threeSource).toContain('updateParam("rfPowerSetting", active ? 1 : 0)');
    expect(threeSource).not.toContain('updateParam("rfPowerSetting", active ? 800 : 0)');
    expect(threeSource).not.toContain('label="RF Power Rating"');
    expect(threeSource).not.toContain('paramKey="anodeVoltage"');
    expect(threeSource).not.toContain("PortHamiltonianEnergyStrip");
    expect(threeSource).toContain("fieldPlane.visible = Boolean(p.isOscillating)");
  });

  test("keeps the disclosed modern magnetron scenario deterministic and outside the source receipt", () => {
    const result = FrankenSimEngine.stepSpencerMicrowave(2.2, 1450, 800);
    expect(result.hullCutoffGauss).toBeGreaterThan(500);
    expect(result.isOscillating).toBe(true);
    expect(result.microwaveFreqMhz).toBeGreaterThan(2000);
    expect(result.dielectricLossWattsPerDm3).toBeGreaterThan(100);
    expect(result.anodeKv).toBe(2.2);
    expect(result.microwaveFreqHz).toBe(2450e6);
    expect(result.electricFieldVpm).toBeCloseTo(220000, 0);
  });

  test("builds and articulates procedural copper anode block, resonant cavities, cathode rod, and electron spokes correctly", () => {
    const model = buildSpencerMicrowaveModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.magnetronGroup).toBeDefined();
    expect(model.anodeOuter).toBeDefined();
    expect(model.cathodeMesh).toBeDefined();
    expect(model.spokePoints).toBeDefined();
    const guides: THREE.Object3D[] = [];
    model.root.traverse((node) => {
      if (node.name.startsWith("Oscillator coupling guide 2")) guides.push(node);
    });
    expect(guides).toHaveLength(2);
    expect(guides.map((guide) => guide.name).sort()).toEqual([
      "Oscillator coupling guide 26",
      "Oscillator coupling guide 27",
    ]);
    model.root.updateMatrixWorld(true);
    const guidePorts = guides
      .map((guide) => guide.getWorldPosition(new THREE.Vector3()))
      .sort((a, b) => a.z - b.z);
    expect(guidePorts[0].x).toBeCloseTo(-1.623, 8);
    expect(guidePorts[0].z).toBeCloseTo(-2, 8);
    expect(guidePorts[1].x).toBeCloseTo(-1.623, 8);
    expect(guidePorts[1].z).toBeCloseTo(2, 8);
    expect(model.spokePointSets).toHaveLength(2);
    expect(model.root.getObjectByName("Oscillator source 10")).toBeDefined();
    expect(model.root.getObjectByName("Oscillator source 11")).toBeDefined();

    // Test kinematics update & cutaway
    updateSpencerMicrowaveKinematics(model, 1 / 60, true, 4.5, 0.547, true, true);
    expect(model.spokePointSets.every((spokes) => spokes.visible)).toBe(true);
    expect(model.spokePointSets[0].rotation.y).toBeCloseTo(model.spokePointSets[1].rotation.y, 10);
    expect(model.spokePoints.rotation.y).toBeGreaterThan(0);
    expect(model.materials.copperAnodeMat.opacity).toBe(0.35);
    updateSpencerMicrowaveKinematics(model, 1 / 60, false, 4.5, 0.547, true, true);
    expect(model.spokePointSets.every((spokes) => !spokes.visible)).toBe(true);

    model.dispose();
  });

  test("builds one physically connected source-numbered path from transformer to oscillators, guide, and transverse conveyor", () => {
    const model = buildSpencerMicrowaveModel();
    try {
      model.root.updateMatrixWorld(true);
      expect(model.transformerAssembly.name).toBe("Transformer 18");
      expect(model.transformerAssembly.children.length).toBeGreaterThanOrEqual(14);
      expect(model.commonWaveguide.name).toBe("Common hollow wave guide 23");
      expect(model.commonWaveguide.children).toHaveLength(4);
      expect(model.conveyorAssembly.name).toBe("Transversely-moving conveyor system 28");
      expect(model.foodLoad.parent).toBe(model.conveyorAssembly);
      expect(model.coaxialLines.map((line) => line.name)).toEqual([
        "Coaxial transmission line 24",
        "Coaxial transmission line 25",
      ]);
      expect(model.electricalConductors.map((line) => line.name)).toEqual([
        "Transformer conductor 15",
        "Transformer conductor 16",
        "Cathode conductor 20",
        "Cathode conductor 21",
        "Center-tap conductor 22",
        "Power line 19 upper external boundary",
        "Power line 19 lower external boundary",
      ]);

      const guideBounds = new THREE.Box3().setFromObject(model.commonWaveguide);
      const conveyorBelt = model.root.getObjectByName("Conveyor belt 28");
      expect(conveyorBelt).toBeDefined();
      if (!conveyorBelt) throw new Error("Conveyor belt 28 is missing.");
      const conveyorSize = new THREE.Box3()
        .setFromObject(conveyorBelt)
        .getSize(new THREE.Vector3());
      expect(conveyorSize.z).toBeGreaterThan(conveyorSize.x * 3);
      expect(guideBounds.max.x).toBeGreaterThan(new THREE.Box3().setFromObject(conveyorBelt).min.x);

      for (let index = 0; index < model.coaxialLines.length; index += 1) {
        const tube = model.coaxialLines[index];
        const path = (tube.geometry as THREE.TubeGeometry).parameters.path;
        const start = path.getPoint(0);
        const end = path.getPoint(1);
        expect(start.x).toBeCloseTo(-1.623, 8);
        expect(start.z).toBeCloseTo(index === 0 ? -2 : 2, 8);
        expect(end.x).toBeCloseTo(guideBounds.min.x, 8);
        expect(end.y).toBeGreaterThan(guideBounds.min.y);
        expect(end.y).toBeLessThan(guideBounds.max.y);
      }

      const foundation = model.root.getObjectByName("Spencer apparatus foundation");
      expect(foundation).toBeDefined();
      if (!foundation) throw new Error("Spencer apparatus foundation is missing.");
      const foundationTop = new THREE.Box3().setFromObject(foundation).max.y;
      for (const supportName of [
        "Oscillator 10 support",
        "Oscillator 11 support",
        "Wave guide 23 support A",
        "Wave guide 23 support B",
        "Wave guide 23 support C",
        "Wave guide 23 support D",
      ]) {
        const support = model.root.getObjectByName(supportName);
        expect(support).toBeDefined();
        if (!support) throw new Error(`${supportName} is missing.`);
        expect(new THREE.Box3().setFromObject(support).min.y).toBeCloseTo(foundationTop, 7);
      }
      expect(new THREE.Box3().setFromObject(model.transformerAssembly).min.y).toBeCloseTo(
        foundationTop,
        7,
      );
    } finally {
      model.dispose();
    }
  });

  test("moves the food load along conveyor 28 deterministically without moving the apparatus", () => {
    const advance = (fps: number) => {
      const model = buildSpencerMicrowaveModel();
      for (let frame = 0; frame < fps * 2; frame += 1) {
        updateSpencerMicrowaveKinematics(model, 1 / fps, true, 4.5, 0.8, true, true);
      }
      const result = {
        foodZ: model.foodLoad.position.z,
        guidePosition: model.commonWaveguide.position.clone(),
      };
      model.dispose();
      return result;
    };
    const at30 = advance(30);
    const at120 = advance(120);
    expect(at30.foodZ).toBeCloseTo(at120.foodZ, 10);
    expect(at30.guidePosition).toEqual(at120.guidePosition);
  });

  test("derives all 6 printed claims dynamically from edition without duplicate strings", () => {
    const { spencerMicrowavePatent } = require("@/data/patents/spencer-microwave");
    const { spencerMicrowaveArchivalEdition } = require("@/data/editions/spencerMicrowaveEdition");
    expect(spencerMicrowavePatent.claims.length).toBe(6);
    const editionClaims = spencerMicrowaveArchivalEdition.blocks.filter(
      (b: any) => b.kind === "claim",
    );
    expect(editionClaims.length).toBe(6);

    for (const claim of spencerMicrowavePatent.claims) {
      const editionBlock = editionClaims.find((c: any) => c.number === claim.number);
      expect(editionBlock).toBeDefined();
      const expectedText = editionBlock.inlines.map((inl: any) => inl.text).join("");
      expect(claim.originalText).toBe(expectedText);
    }
  });

  test("provides valid provenance classifications for all Spencer controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-2495429-spencer-microwave"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({ rfPowerSetting: 1 });
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("binds energy output to honest omission reason without synthetic wattage", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(energyChannelsFor("us-2495429-spencer-microwave", {})).toEqual([]);
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-2495429-spencer-microwave"]).toContain(
      "supplies no continuous electrical power input",
    );
  });
});
