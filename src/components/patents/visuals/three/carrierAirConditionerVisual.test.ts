import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { BoxGeometry } from "three";
import { FrankenSimEngine } from "@/physics/engine";
import {
  buildCarrierAirConditionerModel,
  updateCarrierAirConditionerKinematics,
} from "./carrierAirConditionerModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 808,897 Carrier wet air washer visual boundary", () => {
  test("uses procedural Three.js geometry with no external model", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "CarrierAirConditioner3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "carrierAirConditionerModel.ts"),
      "utf8",
    );
    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildCarrierAirConditionerModel");
    expect(modelSource).toContain("updateCarrierAirConditionerKinematics");
    for (const forbidden of ["dewPoint", "reheat", "chilled", "thermostat", "psychrometric"]) {
      expect(threeSource.toLowerCase()).not.toContain(forbidden);
      expect(modelSource.toLowerCase()).not.toContain(forbidden);
    }
  });

  test("keeps the source-named step bounded to spray, wet film, particles, droplets, and flow", () => {
    const result = FrankenSimEngine.stepCarrierAirConditioner({
      airflowCfm: 15000,
      sprayRatePct: 60,
      separatorFaces: 6,
    });
    expect(result.wetFilmCoveragePct).toBeGreaterThan(0);
    expect(result.particleCapturePct).toBeGreaterThan(0);
    expect(result.dropletSeparationPct).toBeGreaterThan(0);
    expect(result.pressureDropPa).toBeGreaterThan(0);
    expect(result.animation).toEqual({
      fanDisplayAngularVelocityRadPerSec: 2.5,
      dropletDisplayAdvectionUnitsPerSec: 1.8,
      dropletDisplayOpacity: 0.5786,
      activeSeparatorPlateCount: 3,
    });
    expect("dewPointInC" in result).toBe(false);
    expect("finalRhPct" in result).toBe(false);
    expect("coolingWatts" in result).toBe(false);
  });

  test("builds distinct source parts and advances deterministic air droplets", () => {
    const { root, nodes, materials } = buildCarrierAirConditionerModel();
    expect(root.children.length).toBeGreaterThan(5);
    expect(nodes.sprayNozzles.length).toBe(5);
    const initialRotation = nodes.fanRotor.rotation.z;
    const state = FrankenSimEngine.stepCarrierAirConditioner({
      airflowCfm: 15000,
      sprayRatePct: 60,
      separatorFaces: 6,
    });
    updateCarrierAirConditionerKinematics(nodes, materials, 0.1, state.animation, true, true);
    expect(nodes.fanRotor.rotation.z).toBeCloseTo(initialRotation - 0.25, 10);
    expect(nodes.solidCasingMesh.visible).toBe(false);
    expect(nodes.cutawayCasingGroup.visible).toBe(true);
    expect(nodes.cutawayRoofRails).toHaveLength(4);
    for (const rail of nodes.cutawayRoofRails) {
      expect(rail.geometry.type).toBe("BoxGeometry");
      expect((rail.geometry as BoxGeometry).parameters.height).toBeCloseTo(0.12, 10);
    }
    expect(materials.droplet.opacity).toBe(state.animation.dropletDisplayOpacity);
    expect(nodes.separatorPlates.filter((plate) => plate.visible)).toHaveLength(
      state.animation.activeSeparatorPlateCount,
    );
  });

  test("forbids raw control formulas in the renderer update boundary", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "carrierAirConditionerModel.ts"),
      "utf8",
    );
    const updateSource = modelSource.slice(
      modelSource.indexOf("export function updateCarrierAirConditionerKinematics"),
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "CarrierAirConditioner3D.tsx"),
      "utf8",
    );

    expect(updateSource).not.toContain("airflowCfm");
    expect(updateSource).not.toContain("sprayRatePct");
    expect(updateSource).not.toContain("separatorFaces");
    expect(threeSource).toContain("animation: carrier.animation");
  });
});
