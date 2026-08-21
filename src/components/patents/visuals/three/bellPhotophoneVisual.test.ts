import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepBellPhotophone } from "@/physics/bellPhotophoneKernel";
import { createBellPhotophoneModel } from "./bellPhotophoneModel";

describe("Alexander Graham Bell Photophone 3D Model & Physics Visual Test Suite", () => {
  test("2D and 3D sliders share the patent physics bus", () => {
    const threeSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/BellPhotophone3D.tsx"),
      "utf8",
    );
    const simSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/BellPhotophoneSim.tsx"),
      "utf8",
    );
    expect(threeSource).toContain('usePatentPhysics("us-235199-bell-photophone")');
    expect(simSource).toContain('usePatentPhysics("us-235199-bell-photophone")');
    expect(threeSource).not.toContain("setVoiceSplDb");
    expect(simSource).not.toContain("setTransmissionDistanceM");
    expect(threeSource).not.toContain("[cameraPreset, live]");
    expect(threeSource).toContain("controls.setView");
  });

  test("creates valid Three.js model hierarchy with transmitter, beam, and receiver dish", () => {
    const model = createBellPhotophoneModel();
    expect(model.group).toBeDefined();
    expect(model.transmitterGroup).toBeDefined();
    expect(model.receiverGroup).toBeDefined();
    expect(model.beamMesh).toBeDefined();
    expect(model.diaphragmMesh).toBeDefined();
    expect(model.seleniumCellGroup).toBeDefined();
    expect(model.telephoneGroup).toBeDefined();
    expect(model.materials.length).toBeGreaterThan(4);
    expect(model.geometries.length).toBeGreaterThan(10);

    model.dispose();
  });

  test("qualitative source state updates the model without claiming a measured voice level", () => {
    const model = createBellPhotophoneModel();

    const varyingBeam = stepBellPhotophone({ beamVariationActive: true });
    expect(varyingBeam.evidenceStatus).toBe("qualitative-source-schematic");
    expect(varyingBeam.beamVariationActive).toBe(true);
    expect(() => model.update(varyingBeam, 0.5)).not.toThrow();

    const staticBeam = stepBellPhotophone({ beamVariationActive: false });
    expect(staticBeam.beamVariationActive).toBe(false);
    expect(() => model.update(staticBeam, 1.0)).not.toThrow();

    model.dispose();
  });

  test("does not turn unsupported legacy numeric inputs into source measurements", () => {
    const state = stepBellPhotophone({
      voiceSplDb: 80,
      transmissionDistanceM: 213,
      solarIrradianceWPerM2: 1000,
    });

    expect(state.evidenceStatus).toBe("qualitative-source-schematic");
    expect(state.concentratedPowerMw).toBe(0);
    expect(state.seleniumOperatingResistanceKOhms).toBe(0);
    expect(state.audioSignalCurrentUa).toBe(0);
  });
});
