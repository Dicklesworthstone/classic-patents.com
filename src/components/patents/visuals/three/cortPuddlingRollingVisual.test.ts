import { describe, expect, test } from "bun:test";
import * as THREE from "three";
import {
  CORT_ACTIVE_BILLET_HEIGHT_M,
  CORT_ROLL_CENTER_SEPARATION_M,
  CORT_ROLL_PASS_RADII_M,
} from "@/physics/cortKernel";
import { ENERGY_CHANNEL_OMISSION_REASONS, energyChannelsFor } from "@/physics/energyChannels";
import { cortPuddlingRollingViewForViewport } from "./cortPuddlingRollingCamera";
import {
  buildCortPuddlingRollingModel,
  CORT_ROLL_DRIVE_GEAR_PITCH_RADIUS_M,
  CORT_ROLL_DRIVE_GEAR_ROOT_RADIUS_M,
  CORT_ROLL_DRIVE_GEAR_TEETH,
  CORT_ROLL_DRIVE_GEAR_TOOTH_DEPTH_M,
} from "./cortPuddlingRollingModel";

describe("Henry Cort Puddling & Grooved Rolling 3D WebGL Model", () => {
  test("builds complete procedural 3D model hierarchy", () => {
    const model = buildCortPuddlingRollingModel();
    expect(model.root).toBeDefined();
    expect(model.furnaceGroup).toBeDefined();
    expect(model.roofGroup).toBeDefined();
    expect(model.rabbleGroup).toBeDefined();
    expect(model.puddleBallMesh).toBeDefined();
    expect(model.topRollGroup).toBeDefined();
    expect(model.bottomRollGroup).toBeDefined();
    expect(model.topRollDriveGear).toBeDefined();
    expect(model.bottomRollDriveGear).toBeDefined();
    expect(model.billetMesh).toBeDefined();
    model.dispose();
  });

  test("toggles cutaway roof visibility", () => {
    const model = buildCortPuddlingRollingModel();
    model.setCutaway(true);
    expect(model.roofGroup.visible).toBe(false);

    model.setCutaway(false);
    expect(model.roofGroup.visible).toBe(true);
    model.dispose();
  });

  test("maintains unlabelled presentation without invented callout sprites", () => {
    const model = buildCortPuddlingRollingModel();
    let spriteCount = 0;
    model.root.traverse((obj) => {
      if (obj instanceof THREE.Sprite) spriteCount++;
    });
    expect(spriteCount).toBe(0);
    model.dispose();
  });

  test("animates rolls and rabble deterministically without errors", () => {
    const model = buildCortPuddlingRollingModel();
    const phases = {
      rabbleCycleRad: 0.5,
      topRollRad: -3.14,
      bottomRollRad: 3.14,
      billetTravelM: 0.2,
    };
    model.updateAnimation(phases, 1.0, true);
    expect(model.topRollGroup.rotation.x).toBeCloseTo(-3.14, 2);
    expect(model.bottomRollGroup.rotation.x).toBeCloseTo(3.14, 2);

    // Step animation at t = 2.0s
    const phases2 = {
      rabbleCycleRad: 1.0,
      topRollRad: -6.28,
      bottomRollRad: 6.28,
      billetTravelM: 0.4,
    };
    model.updateAnimation(phases2, 2.0, false);
    expect(model.topRollGroup.rotation.x).toBeCloseTo(-6.28, 2);
    model.dispose();
  });

  test("builds actual recessed pass bands on continuous supported roll cores", () => {
    const model = buildCortPuddlingRollingModel();
    const named: Record<string, THREE.Object3D[]> = {};
    model.root.traverse((object) => {
      if (!object.name) return;
      const objectsWithName = named[object.name] ?? [];
      objectsWithName.push(object);
      named[object.name] = objectsWithName;
    });

    expect(named["continuous-roll-core"]).toHaveLength(2);
    expect(named["full-radius-roll-shoulder"]).toHaveLength(10);
    for (let pass = 1; pass <= 4; pass++) {
      expect(named[`recessed-working-pass-${pass}`]).toHaveLength(2);
    }
    expect(named["left-supported-roll-journal"]).toHaveLength(2);
    expect(named["right-supported-roll-journal"]).toHaveLength(2);
    expect(named["left-roll-bearing-stand"]).toHaveLength(1);
    expect(named["right-roll-bearing-stand"]).toHaveLength(1);
    expect(named["rolling-mill-bedplate"]).toHaveLength(1);
    expect(named["top-roll-drive-shaft-extension"]).toHaveLength(1);
    expect(named["bottom-roll-drive-shaft-extension"]).toHaveLength(1);
    expect(named["attached-off-scene-lineshaft-input-coupling"]).toHaveLength(1);

    expect(CORT_ROLL_DRIVE_GEAR_PITCH_RADIUS_M * 2).toBeCloseTo(CORT_ROLL_CENTER_SEPARATION_M, 12);
    const driveGearAddendumRadius =
      CORT_ROLL_DRIVE_GEAR_PITCH_RADIUS_M + CORT_ROLL_DRIVE_GEAR_TOOTH_DEPTH_M / 2;
    expect(CORT_ROLL_DRIVE_GEAR_ROOT_RADIUS_M + driveGearAddendumRadius).toBeCloseTo(
      CORT_ROLL_CENTER_SEPARATION_M,
      12,
    );
    expect(model.topRollDriveGear.children).toHaveLength(CORT_ROLL_DRIVE_GEAR_TEETH + 1);
    expect(model.bottomRollDriveGear.children).toHaveLength(CORT_ROLL_DRIVE_GEAR_TEETH + 1);
    expect(model.root.getObjectsByProperty("name", "normalized-roll-drive-root-disc")).toHaveLength(
      2,
    );
    expect(model.root.getObjectsByProperty("name", "normalized-roll-drive-tooth")).toHaveLength(
      CORT_ROLL_DRIVE_GEAR_TEETH * 2,
    );

    const firstPassGap =
      model.topRollGroup.position.y -
      model.bottomRollGroup.position.y -
      2 * CORT_ROLL_PASS_RADII_M[0];
    const billetHeight = (model.billetMesh.geometry as THREE.BoxGeometry).parameters.height;
    expect(model.topRollGroup.position.y - model.bottomRollGroup.position.y).toBeCloseTo(
      CORT_ROLL_CENTER_SEPARATION_M,
      12,
    );
    expect(firstPassGap).toBeCloseTo(CORT_ACTIVE_BILLET_HEIGHT_M, 12);
    expect(billetHeight).toBeCloseTo(firstPassGap, 12);
    model.dispose();
  });

  test("keeps the rabble anchored to the working door and makes particles replay-pure", () => {
    const model = buildCortPuddlingRollingModel();
    const door = model.root.getObjectByName("supported-working-door-frame");
    expect(door).toBeDefined();
    expect(model.rabbleGroup.name).toBe("door-pivoted-rabble");
    expect(model.rabbleGroup.position.x).toBeCloseTo(door?.position.x ?? Number.NaN, 12);
    expect(model.rabbleGroup.position.z).toBeCloseTo(door?.position.z ?? Number.NaN, 12);

    const phases = {
      rabbleCycleRad: 0.6,
      topRollRad: -1.2,
      bottomRollRad: 1.2,
      billetTravelM: 0.5,
    };
    model.updateAnimation(phases, 1.25, true);
    const first = Array.from(
      (model.sparkParticles.geometry.getAttribute("position") as THREE.BufferAttribute)
        .array as Float32Array,
    );
    model.updateAnimation({ ...phases, billetTravelM: 0.8 }, 2.5, true);
    model.updateAnimation(phases, 1.25, true);
    const replay = Array.from(
      (model.sparkParticles.geometry.getAttribute("position") as THREE.BufferAttribute)
        .array as Float32Array,
    );
    expect(replay).toEqual(first);
    model.dispose();
  });

  test("3D mill omega drains the kernel instead of a leftover 30 RPM sticker", async () => {
    const threeSource = await Bun.file(
      new URL("./CortPuddlingRolling3D.tsx", import.meta.url),
    ).text();
    expect(threeSource).not.toContain("(30 * 2 * Math.PI) / 60");
    expect(threeSource).toContain("stepCortPuddlingRolling");
    expect(threeSource).toContain("getCortTapeFrame");
    expect(threeSource).toContain("useLiveSimParams");
    const modelSource = await Bun.file(
      new URL("./cortPuddlingRollingModel.ts", import.meta.url),
    ).text();
    expect(modelSource).not.toContain("(15 * 2 * Math.PI) / 60");
    expect(modelSource).not.toContain("timeSec * 5");
    expect(modelSource).not.toContain("timeSec * 10)");
    expect(modelSource).toContain("CortKinematicPhases");
  });

  test("keeps the full furnace-stack envelope inside the overview framing", async () => {
    const cameraSource = await Bun.file(
      new URL("./cortPuddlingRollingCamera.ts", import.meta.url),
    ).text();
    expect(cameraSource).toContain("iso: { pos: [0, 4.4, 10.6], target: [0, 1.35, 0] }");
    expect(cameraSource).toContain("3.6-unit stack");
  });

  test("re-centres only the phone overview so the furnace and mill remain one process", async () => {
    const distance = (view: ReturnType<typeof cortPuddlingRollingViewForViewport>) =>
      Math.hypot(
        view.pos[0] - view.target[0],
        view.pos[1] - view.target[1],
        view.pos[2] - view.target[2],
      );
    const desktopOverview = cortPuddlingRollingViewForViewport("iso", 1200);
    const phoneOverview = cortPuddlingRollingViewForViewport("iso", 375);
    expect(distance(phoneOverview) / distance(desktopOverview)).toBeCloseTo(1.2254, 3);
    expect(phoneOverview).toEqual({
      pos: [-0.7, 5.5, 13],
      target: [-0.7, 1.8, 0],
    });
    expect(cortPuddlingRollingViewForViewport("hearth", 375)).toEqual(
      cortPuddlingRollingViewForViewport("hearth", 1200),
    );
    expect(cortPuddlingRollingViewForViewport("drive", 375)).toEqual({
      pos: [5.0, 1.8, 2.4],
      target: [3.0, 1.05, 0],
    });

    const threeSource = await Bun.file(
      new URL("./CortPuddlingRolling3D.tsx", import.meta.url),
    ).text();
    expect(threeSource).toContain("cortPuddlingRollingViewForViewport");
    expect(threeSource).toContain('aria-label="Cort process camera view"');
    expect(threeSource).toContain('window.addEventListener("resize", restoreResponsiveView)');
  });

  test("properly cleans up WebGL geometries and materials on disposal", () => {
    const model = buildCortPuddlingRollingModel();
    let meshCount = 0;
    model.root.traverse((obj) => {
      if (obj instanceof THREE.Mesh) meshCount++;
    });
    expect(meshCount).toBeGreaterThan(15);
    expect(() => model.dispose()).not.toThrow();
  });

  test("shares a route-owned tape and refuses unsupported source power", async () => {
    const dispatcher = await Bun.file(new URL("../index.tsx", import.meta.url)).text();
    const owner = await Bun.file(
      new URL("../PatentPhysicsRuntimeOwner.tsx", import.meta.url),
    ).text();
    const studio = await Bun.file(new URL("./CortPuddlingRolling3D.tsx", import.meta.url)).text();
    const diagram = await Bun.file(
      new URL("../CortPuddlingRollingSim.tsx", import.meta.url),
    ).text();

    expect(dispatcher).toContain("<CortPhysicsRuntimeOwner patentId={patentId} />");
    expect(owner).toContain("createCortTransportUpdater");
    expect(studio).not.toContain("globalTransportBus.registerUpdater");
    expect(studio).not.toContain("createStudioClock");
    expect(studio).not.toContain("PortHamiltonianEnergyStrip");
    expect(studio).not.toContain("Pins Off");
    expect(diagram).toContain("getCortTapeFrame");
    expect(diagram).not.toContain("Coal Grate (A)");
    expect(energyChannelsFor("gb-1420-cort-puddling-rolling", {})).toEqual([]);
    expect(ENERGY_CHANNEL_OMISSION_REASONS["gb-1420-cort-puddling-rolling"]).toContain(
      "no furnace dimensions",
    );
  });
});
