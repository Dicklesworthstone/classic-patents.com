import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as THREE from "three";
import { stepHallAluminium } from "@/physics/catalogKernels";
import { hallViewForViewport } from "./HallAluminium3D";
import {
  createHallAluminiumModel,
  HALL_CELL_GEOMETRY,
  updateHallAluminiumVisual,
} from "./hallAluminiumModel";

describe("US 400,766 Charles Martin Hall Aluminium Smelting Visual Boundary", () => {
  const rootDir = process.cwd();

  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      resolve(rootDir, "src/components/patents/visuals/three/hallAluminiumModel.ts"),
      "utf8",
    );
    const componentSource = readFileSync(
      resolve(rootDir, "src/components/patents/visuals/three/HallAluminium3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).not.toContain("GLTFLoader");
    expect(componentSource).not.toContain(".gltf");
    expect(componentSource).not.toContain(".glb");
    expect(componentSource).not.toContain("GLTFLoader");
    expect(componentSource).toContain("controls.setView");
    expect(componentSource).not.toContain("camera.position.set");
    expect(componentSource).toContain('data-testid="hall-cell-source-boundary"');
    expect(componentSource).toContain("normalized modern Hall–Héroult teaching scenario");
    expect(componentSource).toContain("useState<boolean>(true)");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      resolve(rootDir, "src/components/patents/visuals/three/hallAluminiumModel.ts"),
      "utf8",
    );

    expect(modelSource).not.toContain("Date.now()");
    expect(modelSource).not.toContain("performance.now()");
    expect(modelSource).not.toContain("elapsedSeconds * 3");
    expect(modelSource).not.toContain("elapsedSeconds * 1.5");
    expect(modelSource).toContain("bubbleSwayOmegaRadPerS");
    expect(modelSource).toContain("anodePulseOmegaRadPerS");
  });

  test("computes genuine Faraday electrolysis, cell voltage, and production rate in SI units", () => {
    const nominal = stepHallAluminium({
      currentAmperes: 300000,
      bathTemperatureCelsius: 960,
      aluminaConcentrationPct: 5.5,
    });

    expect(nominal.currentAmperes).toBe(300000);
    expect(nominal.aluminiumProductionRateKgPerHour).toBeGreaterThan(90);
    expect(nominal.aluminiumProductionRateKgPerHour).toBeLessThan(110);
    expect(nominal.currentEfficiencyPct).toBeGreaterThanOrEqual(90);
    expect(nominal.totalCellVoltage).toBeGreaterThanOrEqual(4.0);
    expect(nominal.totalCellVoltage).toBeLessThanOrEqual(5.0);
    expect(nominal.liquidAluminiumDensityGPerCm3).toBeGreaterThan(nominal.moltenBathDensityGPerCm3);
  });

  test("builds and articulates procedural pot shell, cathode, cryolite bath, metal pad, and anodes", () => {
    const model = createHallAluminiumModel();
    expect(model.root.children.length).toBeGreaterThanOrEqual(8);
    expect(model.potShell).toBeDefined();
    expect(model.carbonCathode).toBeDefined();
    expect(model.cryoliteBath).toBeDefined();
    expect(model.aluminiumPad).toBeDefined();
    expect(model.anodeBlocks.length).toBe(4);
    expect(model.bubbleParticles).toBeDefined();

    // Verify initial positions
    expect(model.aluminiumPad.position.y).toBeLessThan(model.cryoliteBath.position.y);

    // Update with telemetry
    updateHallAluminiumVisual(
      model,
      {
        currentAmperes: 300000,
        bathTemperatureCelsius: 960,
        totalCellVoltage: 4.43,
        aluminiumProductionRateKgPerHour: 94.6,
      },
      1.5,
      1 / 60,
    );

    expect(model.anodeAssembly.position.y).toBeDefined();
    model.dispose();
  });

  test("builds a genuinely open nested vessel instead of overlapping solid boxes", () => {
    const model = createHallAluminiumModel();
    try {
      expect(model.potShell).toBeInstanceOf(THREE.Group);
      expect(model.refractoryInsulation).toBeInstanceOf(THREE.Group);
      expect(model.carbonCathode).toBeInstanceOf(THREE.Group);

      for (const layer of [
        model.potShellPanels,
        model.refractoryPanels,
        model.carbonCathodePanels,
      ]) {
        expect(Object.values(layer)).toHaveLength(5);
        for (const panel of Object.values(layer)) expect(panel).toBeInstanceOf(THREE.Mesh);
      }

      const bounds = (object: THREE.Object3D) => {
        model.root.updateMatrixWorld(true);
        return new THREE.Box3().setFromObject(object);
      };
      const carbonFloor = bounds(model.carbonCathodePanels.floor);
      const aluminium = bounds(model.aluminiumPad);
      const bath = bounds(model.cryoliteBath);

      expect(carbonFloor.max.y).toBeCloseTo(HALL_CELL_GEOMETRY.cavityBottomY, 8);
      expect(aluminium.min.y).toBeCloseTo(carbonFloor.max.y, 8);
      expect(aluminium.max.y).toBeCloseTo(HALL_CELL_GEOMETRY.aluminiumTopY, 8);
      expect(bath.min.y).toBeCloseTo(aluminium.max.y, 7);
      expect(bath.max.y).toBeCloseTo(HALL_CELL_GEOMETRY.bathTopY, 7);

      for (const anode of model.anodeBlocks) {
        const anodeBounds = bounds(anode);
        expect(anodeBounds.min.y).toBeCloseTo(HALL_CELL_GEOMETRY.anodeBottomY, 7);
        expect(anodeBounds.min.y).toBeGreaterThan(aluminium.max.y);
        expect(anodeBounds.min.y).toBeLessThan(bath.max.y);
      }
    } finally {
      model.dispose();
    }
  });

  test("opens only the observer-facing wall for a legible, structurally honest cutaway", () => {
    const model = createHallAluminiumModel();
    try {
      model.setCutaway?.(true);
      for (const layer of [
        model.potShellPanels,
        model.refractoryPanels,
        model.carbonCathodePanels,
      ]) {
        expect(layer.front.visible).toBe(false);
        expect(layer.back.visible).toBe(true);
        expect(layer.left.visible).toBe(true);
        expect(layer.right.visible).toBe(true);
        expect(layer.floor.visible).toBe(true);
      }

      model.setCutaway?.(false);
      for (const layer of [
        model.potShellPanels,
        model.refractoryPanels,
        model.carbonCathodePanels,
      ]) {
        for (const panel of Object.values(layer)) expect(panel.visible).toBe(true);
      }
    } finally {
      model.dispose();
    }
  });

  test("uses frame-rate-independent bubble transport and responsive overview framing", () => {
    const runForTwoSeconds = (fps: number) => {
      const model = createHallAluminiumModel();
      for (let frame = 1; frame <= fps * 2; frame += 1) {
        updateHallAluminiumVisual(
          model,
          {
            currentAmperes: 300000,
            bathTemperatureCelsius: 960,
            totalCellVoltage: 4.43,
            aluminiumProductionRateKgPerHour: 94.6,
          },
          frame / fps,
          1 / fps,
        );
      }
      const positions = Array.from(
        model.bubbleParticles.geometry.attributes.position.array as Float32Array,
      );
      model.dispose();
      return positions;
    };

    const at30Fps = runForTwoSeconds(30);
    const at120Fps = runForTwoSeconds(120);
    expect(at30Fps).toHaveLength(at120Fps.length);
    for (let index = 0; index < at30Fps.length; index += 1) {
      expect(at30Fps[index]).toBeCloseTo(at120Fps[index], 4);
    }

    const desktop = hallViewForViewport("overview", 1200);
    const tablet = hallViewForViewport("overview", 768);
    const phone = hallViewForViewport("overview", 320);
    const distance = (view: typeof desktop) => Math.hypot(...view.pos);
    expect(distance(tablet) / distance(desktop)).toBeCloseTo(1.25, 8);
    expect(distance(phone) / distance(desktop)).toBeCloseTo(1.65, 8);
  });
});
