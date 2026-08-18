import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "@/physics/engine";
import {
  buildCarrierAirConditionerModel,
  updateCarrierAirConditionerKinematics,
} from "./carrierAirConditionerModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 808,897 Willis Carrier Air Conditioning visual & psychrometrics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
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
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "CarrierAirConditioner3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "carrierAirConditionerModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for psychrometric process observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "CarrierAirConditioner3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "spray_chamber",
      "baffle_plates",
      "blower_fan",
      "pump_sump",
      "dampers",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("cutawayMode");
    expect(threeSource).toContain("Eliminator Baffles");
  });

  test("computes genuine Carrier psychrometric dew-point air conditioning in reproducible SI units", () => {
    const result = FrankenSimEngine.stepCarrierAirConditioner({
      inletTempC: 28,
      inletRhPct: 65,
      sprayWaterTempC: 12.5,
      reheatTempC: 20,
    });

    expect(result.dewPointInC).toBeGreaterThan(15);
    expect(result.isDehumidifying).toBe(true);
    expect(result.moistureRemovedGPerKg).toBeGreaterThan(0);
    expect(result.finalRhPct).toBeGreaterThan(40);
  });

  test("builds and articulates procedural spray washer and blower fan correctly", () => {
    const { root, nodes, materials } = buildCarrierAirConditionerModel();
    expect(root.children.length).toBeGreaterThan(4);
    expect(nodes.freshAirDamperLouvers.length).toBe(5);
    expect(nodes.sprayNozzles.length).toBe(24);

    // Initial state
    const initialFanRot = nodes.blowerFanRotor.rotation.z;
    updateCarrierAirConditionerKinematics(nodes, materials, 0.1, 15000, 12.5, true, true);
    const updatedFanRot = nodes.blowerFanRotor.rotation.z;

    expect(updatedFanRot).not.toBe(initialFanRot);
    expect(nodes.solidCasingMesh.visible).toBe(false);
    expect(materials.mistParticle.opacity).toBeGreaterThan(0);
  });
});
