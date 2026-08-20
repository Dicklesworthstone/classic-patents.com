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

  test("physics step updates model without throwing in voice and quiet states", () => {
    const model = createBellPhotophoneModel();

    // 1. Voice active at 213m (historic Franklin School test)
    const voiceState = stepBellPhotophone({
      voiceSplDb: 80,
      transmissionDistanceM: 213,
      solarIrradianceWPerM2: 1000,
    });
    expect(voiceState.concentratedPowerMw).toBeGreaterThan(0.5);
    expect(voiceState.seleniumOperatingResistanceKOhms).toBeLessThan(180);
    expect(voiceState.audioSignalCurrentUa).toBeGreaterThan(1.0);
    expect(voiceState.reproducedAudioSplDb).toBeGreaterThan(40);
    expect(() => model.update(voiceState, 0.5)).not.toThrow();

    // 2. Quiet beam (whisper / low voice)
    const quietState = stepBellPhotophone({
      voiceSplDb: 50,
      transmissionDistanceM: 50,
      solarIrradianceWPerM2: 800,
    });
    expect(quietState.modulationDepth).toBeLessThan(0.2);
    expect(() => model.update(quietState, 1.0)).not.toThrow();

    model.dispose();
  });

  test("calculates authentic physical inverse-square optics and selenium photoconductance", () => {
    const stateNear = stepBellPhotophone({ transmissionDistanceM: 20 });
    const stateFar = stepBellPhotophone({ transmissionDistanceM: 200 });

    // Concentrated power at 20m must be higher than at 200m due to beam spreading
    expect(stateNear.concentratedPowerMw).toBeGreaterThan(stateFar.concentratedPowerMw);
    // Operating resistance at 20m should be lower (more light = higher conductance)
    expect(stateNear.seleniumOperatingResistanceKOhms).toBeLessThan(
      stateFar.seleniumOperatingResistanceKOhms,
    );
  });
});
