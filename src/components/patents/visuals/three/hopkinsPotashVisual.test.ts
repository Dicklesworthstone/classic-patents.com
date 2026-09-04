import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import {
  createHopkinsTransportUpdater,
  getHopkinsTapeFrame,
  HOPKINS_DEFAULT_CONTROLS,
  HOPKINS_FRANKENSIM_BOUNDARY,
  HOPKINS_KERNEL_SOURCE,
  HOPKINS_SOURCE_BOUNDARY,
  HOPKINS_ZERO_PHASES,
  stepHopkinsPotash,
} from "@/physics/hopkinsPotashKernel";
import { hopkinsPotashViewForViewport } from "./hopkinsPotashCamera";
import { animateHopkinsPotashModel, buildHopkinsPotashModel } from "./hopkinsPotashModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US X1 Samuel Hopkins Potash 3D Visual & Shared Physics Contract", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "hopkinsPotashModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "HopkinsPotash3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).toContain("buildHopkinsPotashModel");
    expect(modelSource).toContain("animateHopkinsPotashModel");
    expect(threeSource).not.toContain("useGLTF");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "hopkinsPotashModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "HopkinsPotash3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
    expect(modelSource).not.toContain("const ingotMold");
    expect(modelSource).not.toContain("const potashIngot");
    expect(threeSource).not.toContain('id: "ingot"');
  });

  test("pulls back only the phone overview to keep all five operations in frame", () => {
    const distance = (view: ReturnType<typeof hopkinsPotashViewForViewport>) =>
      Math.hypot(
        view.pos[0] - view.target[0],
        view.pos[1] - view.target[1],
        view.pos[2] - view.target[2],
      );
    const desktop = hopkinsPotashViewForViewport("iso", 1200);
    const phone = hopkinsPotashViewForViewport("iso", 320);
    expect(distance(phone)).toBeGreaterThan(distance(desktop) * 1.25);
    expect(hopkinsPotashViewForViewport("settling", 320)).toEqual(
      hopkinsPotashViewForViewport("settling", 1200),
    );
  });

  test("uses the exact catalogue id and route-owned source-bounded tape", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "HopkinsPotash3D.tsx"),
      "utf8",
    );
    const dispatcher = readFileSync(join(VISUALS_DIRECTORY, "index.tsx"), "utf8");
    const owner = readFileSync(join(VISUALS_DIRECTORY, "PatentPhysicsRuntimeOwner.tsx"), "utf8");

    expect(threeSource).toContain('usePatentPhysics("us-x1-hopkins-potash")');
    expect(threeSource).toContain('useFrankenSimPhysics("us-x1-hopkins-potash"');
    expect(threeSource).not.toContain('patentId="us-1-hopkins-potash"');
    expect(threeSource).not.toContain("createStudioClock");
    expect(threeSource).not.toContain("PortHamiltonianEnergyStrip");
    expect(dispatcher).toContain("<HopkinsPhysicsRuntimeOwner patentId={patentId} />");
    expect(owner).toContain("createHopkinsTransportUpdater");
    const diagram = readFileSync(join(VISUALS_DIRECTORY, "HopkinsPotashSim.tsx"), "utf8");
    expect(diagram).toContain('aria-label="Five-operation mobile process chain"');
    expect(diagram).toContain("data-hopkins-mobile-operation={operation.number}");
    expect(HOPKINS_KERNEL_SOURCE).toBe("source-bounded-ts");
    expect(HOPKINS_FRANKENSIM_BOUNDARY).toContain(
      "reactive-transport-browser-composition-unavailable",
    );
    expect(HOPKINS_SOURCE_BOUNDARY).toContain("one-sheet letters patent");
  });

  test("builds five source-ordered operations with supported handoff paths and no invented ingot", () => {
    const model = buildHopkinsPotashModel();
    expect(model.rootGroup).toBeDefined();
    expect(model.nodes.furnaceBody).toBeDefined();
    expect(model.nodes.leachTub).toBeDefined();
    expect(model.nodes.settlingVat).toBeDefined();
    expect(model.nodes.evapPot).toBeDefined();
    expect(model.nodes.fluxingPot).toBeDefined();
    expect(model.nodes.ashBed).toBeDefined();
    expect(model.rootGroup.getObjectByName("shared-supported-process-foundation")).toBeDefined();
    expect(model.rootGroup.getObjectByName("normalized-manual-ash-transfer-trough")).toBeDefined();
    expect(
      model.rootGroup.getObjectByName("normalized-leach-to-settler-draw-off-pipe"),
    ).toBeDefined();
    expect(model.rootGroup.getObjectByName("normalized-settler-to-evaporator-pipe")).toBeDefined();
    expect(
      model.rootGroup.getObjectByName("normalized-manual-pearl-ash-transfer-tray"),
    ).toBeDefined();
    expect(model.rootGroup.getObjectByName("supported-fluxing-pot")).toBeDefined();
    expect(model.rootGroup.getObjectByName("ingotMold")).toBeUndefined();

    model.rootGroup.updateMatrixWorld(true);
    const intersects = (a: THREE.Object3D, b: THREE.Object3D) =>
      new THREE.Box3().setFromObject(a).intersectsBox(new THREE.Box3().setFromObject(b));
    expect(intersects(model.nodes.solidTransferTrough, model.nodes.furnaceGroup)).toBe(true);
    expect(intersects(model.nodes.solidTransferTrough, model.nodes.leachTub)).toBe(true);
    expect(intersects(model.nodes.leachToSettlerPipe, model.nodes.leachTub)).toBe(true);
    expect(intersects(model.nodes.leachToSettlerPipe, model.nodes.settlingVat)).toBe(true);
    expect(intersects(model.nodes.settlerToEvaporatorPipe, model.nodes.settlingVat)).toBe(true);
    expect(intersects(model.nodes.settlerToEvaporatorPipe, model.nodes.evapPot)).toBe(true);
    expect(intersects(model.nodes.pearlAshTransferTray, model.nodes.evapPot)).toBe(true);
    expect(intersects(model.nodes.pearlAshTransferTray, model.nodes.fluxingPot)).toBe(true);

    const leachPipeDirection = new THREE.Vector3(0, 1, 0).applyQuaternion(
      model.nodes.leachToSettlerPipe.quaternion,
    );
    const settlerPipeDirection = new THREE.Vector3(0, 1, 0).applyQuaternion(
      model.nodes.settlerToEvaporatorPipe.quaternion,
    );
    expect(leachPipeDirection.y).toBeLessThan(0);
    expect(settlerPipeDirection.y).toBeLessThan(0);
    expect(model.nodes.pearlAshTransferTray.rotation.z).toBeLessThan(0);

    const outputs = stepHopkinsPotash(HOPKINS_DEFAULT_CONTROLS);
    expect(() =>
      animateHopkinsPotashModel(model, outputs, HOPKINS_ZERO_PHASES, true),
    ).not.toThrow();
    expect(model.nodes.furnaceArch.visible).toBe(false);
    expect(model.nodes.leachTub.visible).toBe(true);
    expect(model.nodes.settlingVat.visible).toBe(true);
    expect(model.materials.oakWood.transparent).toBe(true);
    expect(model.materials.oakWood.opacity).toBeCloseTo(0.42, 12);
    animateHopkinsPotashModel(model, outputs, HOPKINS_ZERO_PHASES, false);
    expect(model.nodes.furnaceArch.visible).toBe(true);
    expect(model.materials.oakWood.transparent).toBe(false);
    expect(model.materials.oakWood.opacity).toBe(1);

    model.dispose();
  });

  test("computes a monotonic declared modern SI scenario without claiming source calibration", () => {
    const cold = stepHopkinsPotash({ roastTempC: 500, roastTimeHours: 1 });
    const hot = stepHopkinsPotash({ roastTempC: 850, roastTimeHours: 3 });

    expect(hot.decarbonizationPct).toBeGreaterThan(cold.decarbonizationPct);
    expect(hot.pearlAshYieldKg).toBeGreaterThan(cold.pearlAshYieldKg);
    expect(hot.pearlAshPurityPct).toBeGreaterThan(cold.pearlAshPurityPct);
    expect(hot.thermalEnergyJoules).toBeGreaterThan(0);
  });

  test("shares deterministic motion, pause, and reset across both visual faces", () => {
    let controls = { ...HOPKINS_DEFAULT_CONTROLS, isRunning: true, resetEpoch: 0 };
    const updater = createHopkinsTransportUpdater(() => controls);
    for (let tick = 0; tick < 12; tick++) updater({} as never, 1 / 60);
    const moving = getHopkinsTapeFrame();
    expect(moving?.timeSec).toBeGreaterThan(0);
    expect(moving?.phases.processCycle01).toBeGreaterThan(0);

    controls = { ...controls, isRunning: false };
    updater({} as never, 1 / 60);
    const held = getHopkinsTapeFrame();
    updater({} as never, 1 / 60);
    expect(getHopkinsTapeFrame()).toEqual(held);

    controls = { ...controls, resetEpoch: 1 };
    updater({} as never, 1 / 60);
    expect(getHopkinsTapeFrame()?.timeSec).toBe(0);
    expect(getHopkinsTapeFrame()?.phases).toEqual(HOPKINS_ZERO_PHASES);
  });

  test("connects roastTempC control directly to the pearl-ash spec clause", () => {
    const { specClausesFor } = require("@/physics/specClauses");
    const activeClauses = specClausesFor("us-x1-hopkins-potash", { roastTempC: 750 });
    const pearlAshClause = activeClauses.find((c: any) => c.id === "pearl-ash");
    expect(pearlAshClause).toBeDefined();
    expect(pearlAshClause?.active).toBe(true);

    const coldClauses = specClausesFor("us-x1-hopkins-potash", { roastTempC: 500 });
    const coldPearlAsh = coldClauses.find((c: any) => c.id === "pearl-ash");
    expect(coldPearlAsh?.active).toBe(false);
  });

  test("provides valid provenance classifications for all Hopkins controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-x1-hopkins-potash"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics(HOPKINS_DEFAULT_CONTROLS);
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("documents honest omission of unmeasured thermal power flow", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    const channels = energyChannelsFor("us-x1-hopkins-potash", HOPKINS_DEFAULT_CONTROLS);
    expect(channels.length).toBe(0);
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-x1-hopkins-potash"]).toContain(
      "The pinned US X1 letters patent supplies no furnace or vessel dimensions",
    );
  });

  test("produces distinct telemetry envelopes when furnace temperature changes", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-x1-hopkins-potash"];
    const m750 = entry.computeMetrics({ ...HOPKINS_DEFAULT_CONTROLS, roastTempC: 750 });
    const m775 = entry.computeMetrics({ ...HOPKINS_DEFAULT_CONTROLS, roastTempC: 775 });
    const m500 = entry.computeMetrics({ ...HOPKINS_DEFAULT_CONTROLS, roastTempC: 500 });

    const env750 = m750.map((m: any) => `${m.label} ${m.value}`).join("; ");
    const env775 = m775.map((m: any) => `${m.label} ${m.value}`).join("; ");
    const env500 = m500.map((m: any) => `${m.label} ${m.value}`).join("; ");

    expect(env750).not.toBe(env775);
    expect(env750).not.toBe(env500);
    expect(env775).not.toBe(env500);
  });
});
