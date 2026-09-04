import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import {
  CARRIER_AIR_CONDITIONER_CAMERA_PRESETS,
  carrierAirConditionerCameraForViewport,
} from "./carrierAirConditionerCamera";
import {
  buildCarrierAirConditionerModel,
  updateCarrierAirConditionerKinematics,
} from "./carrierAirConditionerModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

function projectedObjectBounds(object: THREE.Object3D, camera: THREE.PerspectiveCamera) {
  object.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(object);
  const frame = {
    minX: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  };

  for (const x of [bounds.min.x, bounds.max.x]) {
    for (const y of [bounds.min.y, bounds.max.y]) {
      for (const z of [bounds.min.z, bounds.max.z]) {
        const projected = new THREE.Vector3(x, y, z).project(camera);
        frame.minX = Math.min(frame.minX, projected.x);
        frame.maxX = Math.max(frame.maxX, projected.x);
        frame.minY = Math.min(frame.minY, projected.y);
        frame.maxY = Math.max(frame.maxY, projected.y);
      }
    }
  }
  return frame;
}

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
      expect((rail.geometry as THREE.BoxGeometry).parameters.height).toBeCloseTo(0.12, 10);
    }
    expect(materials.droplet.opacity).toBe(state.animation.dropletDisplayOpacity);
    expect(nodes.separatorPlates.filter((plate) => plate.visible)).toHaveLength(
      state.animation.activeSeparatorPlateCount,
    );
  });

  test("keeps the complete air-handler and blower-casing envelope inside the exact 320px phone canvas", () => {
    const model = buildCarrierAirConditionerModel();
    try {
      const desktop = carrierAirConditionerCameraForViewport("iso", 1216, 460);
      const tablet = carrierAirConditionerCameraForViewport("iso", 718, 460);
      expect(desktop).toEqual(CARRIER_AIR_CONDITIONER_CAMERA_PRESETS.iso);
      expect(tablet).toEqual(desktop);

      // V26's 320px browser viewport produces a 286 × 380px studio canvas.
      // Exercise both source-facing visual states: primary maximum carries the
      // full wet spray, while claim inversion removes its wet front.
      const canvasWidth = 286;
      const canvasHeight = 380;
      const view = carrierAirConditionerCameraForViewport("iso", canvasWidth, canvasHeight);
      const camera = new THREE.PerspectiveCamera(44, canvasWidth / canvasHeight, 0.1, 1000);
      camera.position.set(...view.pos);
      camera.lookAt(...view.target);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();

      for (const [stateName, sprayRatePct] of [
        ["primary control maximum", 100],
        ["claim-inverted", 0],
      ] as const) {
        const state = FrankenSimEngine.stepCarrierAirConditioner({
          airflowCfm: 30000,
          sprayRatePct,
          separatorFaces: 12,
        });
        for (const cutawayMode of [true, false]) {
          updateCarrierAirConditionerKinematics(
            model.nodes,
            model.materials,
            0.4,
            state.animation,
            cutawayMode,
            true,
          );
          model.root.updateMatrixWorld(true);

          const apparatus = projectedObjectBounds(model.root, camera);
          const blowerCasing = projectedObjectBounds(model.nodes.fanHousing, camera);

          expect(apparatus.minX, `${stateName} ${cutawayMode} left edge`).toBeGreaterThan(-0.78);
          expect(apparatus.maxX, `${stateName} ${cutawayMode} blower edge`).toBeLessThan(0.86);
          expect(apparatus.minY, `${stateName} ${cutawayMode} lower edge`).toBeGreaterThan(-0.6);
          expect(apparatus.maxY, `${stateName} ${cutawayMode} upper edge`).toBeLessThan(0.4);
          expect(
            ((apparatus.maxX - apparatus.minX) * canvasWidth) / 2,
            `${stateName} ${cutawayMode} horizontal readability`,
          ).toBeGreaterThan(205);
          expect(
            ((apparatus.maxY - apparatus.minY) * canvasHeight) / 2,
            `${stateName} ${cutawayMode} vertical readability`,
          ).toBeGreaterThan(145);
          expect(
            blowerCasing.maxX,
            `${stateName} ${cutawayMode} blower casing right edge`,
          ).toBeLessThan(0.86);
        }
      }
    } finally {
      model.dispose();
    }
  });

  test("reselects only the overview for a desktop-to-phone resize", () => {
    const source = readFileSync(
      join(VISUALS_DIRECTORY, "three", "CarrierAirConditioner3D.tsx"),
      "utf8",
    );
    expect(carrierAirConditionerCameraForViewport("iso", 1216, 460)).toEqual(
      CARRIER_AIR_CONDITIONER_CAMERA_PRESETS.iso,
    );
    expect(carrierAirConditionerCameraForViewport("iso", 286, 380)).not.toEqual(
      CARRIER_AIR_CONDITIONER_CAMERA_PRESETS.iso,
    );
    expect(carrierAirConditionerCameraForViewport("fan", 286, 380)).toEqual(
      CARRIER_AIR_CONDITIONER_CAMERA_PRESETS.fan,
    );
    expect(source).toContain('if (activeCamera !== "iso") return;');
    expect(source).toContain('window.addEventListener("resize", reselectResponsiveOverview)');
    expect(source).toContain(
      'window.addEventListener("orientationchange", reselectResponsiveOverview)',
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
