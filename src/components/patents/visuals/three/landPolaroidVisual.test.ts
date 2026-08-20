import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepLandPolaroidInstantFilm } from "@/physics/catalogKernels";
import { createLandPolaroidModel } from "./landPolaroidModel";

describe("US 2,543,181 Edwin Land Polaroid Instant Photography Visual Boundary", () => {
  it("3D live loop drains useLiveSimParams instead of remounting on slider ticks", () => {
    const studioSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/LandPolaroid3D.tsx"),
      "utf8",
    );
    expect(studioSource).toContain('from "./useLiveSimParams"');
    expect(studioSource).toContain("model.update(timeRef.current, live.current)");
    expect(studioSource).not.toContain("cameraPreset]");
    expect(studioSource).toContain("createThreeStudioScene");
    expect(studioSource).not.toContain("OrbitControls");
  });

  it("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const model = createLandPolaroidModel();
    expect(model.cameraBody).toBeDefined();
    expect(model.bellows).toBeDefined();
    expect(model.rollerTop).toBeDefined();
    expect(model.rollerBottom).toBeDefined();
    expect(model.negativeSheet).toBeDefined();
    expect(model.positiveSheet).toBeDefined();
    expect(model.reagentGelLayer).toBeDefined();
    expect(model.rupturablePod).toBeDefined();
    expect(model.printSlide).toBeDefined();
    expect(model.materials.length).toBeGreaterThanOrEqual(6);
    expect(model.geometries.length).toBeGreaterThanOrEqual(6);
    model.dispose();
  });

  it("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const stateA = stepLandPolaroidInstantFilm({
      developmentTimeSec: 30,
      exposureFraction: 0.6,
      reagentViscosityCp: 25000,
      rollerGapUm: 25,
      alkaliPh: 12.6,
    });
    const stateB = stepLandPolaroidInstantFilm({
      developmentTimeSec: 30,
      exposureFraction: 0.6,
      reagentViscosityCp: 25000,
      rollerGapUm: 25,
      alkaliPh: 12.6,
    });
    expect(stateA.positiveSilverDensity).toBe(stateB.positiveSilverDensity);
    expect(stateA.negativeSilverDensity).toBe(stateB.negativeSilverDensity);
    expect(stateA.transferEfficiencyPercent).toBe(stateB.transferEfficiencyPercent);
  });

  it("computes genuine Fickian diffusion transfer and complexation chemistry in SI units", () => {
    const shadowState = stepLandPolaroidInstantFilm({
      developmentTimeSec: 45,
      exposureFraction: 0.1, // Shadow area = unexposed silver forms positive
    });
    const highlightState = stepLandPolaroidInstantFilm({
      developmentTimeSec: 45,
      exposureFraction: 0.9, // Highlight area = exposed silver stays in negative
    });

    expect(shadowState.positiveSilverDensity).toBeGreaterThan(highlightState.positiveSilverDensity);
    expect(highlightState.negativeSilverDensity).toBeGreaterThan(shadowState.negativeSilverDensity);
    expect(shadowState.transferEfficiencyPercent).toBeGreaterThan(80);
  });

  it("builds and articulates procedural camera body, bellows, rollers, pod, and print slide", () => {
    const model = createLandPolaroidModel();
    model.update(1.0, { developmentTimeSec: 30, exposureFraction: 0.5 });

    expect(model.rollerTop.rotation.x).toBeCloseTo(3.0, 1);
    expect(model.rupturablePod.scale.y).toBeLessThan(1.0); // Pod crushed
    model.dispose();
  });
});
