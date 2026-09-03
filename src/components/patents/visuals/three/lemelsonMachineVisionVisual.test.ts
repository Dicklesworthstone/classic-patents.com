import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS,
  stepLemelsonMachineVisionTopology,
} from "@/physics/lemelsonMachineVisionKernel";
import { createLemelsonMachineVisionModel } from "./lemelsonMachineVisionModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 3,081,379 Lemelson Machine Vision 3D Procedural Model", () => {
  test("instantiates full procedural hierarchy: conveyor, camera, lamps, diverter, CRT monitor", () => {
    const model = createLemelsonMachineVisionModel();
    expect(model.root.name).toBe("LemelsonMachineVisionApparatus");
    expect(model.conveyorGroup.name).toBe("ConveyorSystem");
    expect(model.cameraGroup.name).toBe("VidiconCameraAssembly");
    expect(model.lampGroup.name).toBe("InspectionLighting");
    expect(model.diverterGroup.name).toBe("SolenoidDiverterGate");
    expect(model.crtMonitorGroup.name).toBe("OscilloscopeMonitor");

    expect(model.partMesh).toBeDefined();
    expect(model.scanConeMesh).toBeDefined();
    expect(model.diverterBladeMesh).toBeDefined();
    expect(model.oscilloscopeLine).toBeDefined();

    model.dispose();
  });

  test("reads normalized signal states without animating an invented machine cycle", () => {
    const model = createLemelsonMachineVisionModel();
    const nominalState = stepLemelsonMachineVisionTopology(
      LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS,
    );

    model.update(nominalState);
    expect(model.scanConeMesh.visible).toBe(true);
    const initialPartX = model.partMesh.position.x;
    const initialBladeRotation = model.diverterBladeMesh.rotation.y;
    const nominalPartMaterial = model.partMesh.material;

    const withheldScan = stepLemelsonMachineVisionTopology({
      ...LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS,
      scanPathEnabled: 0,
    });
    model.update(withheldScan);
    expect(model.scanConeMesh.visible).toBe(false);
    expect(model.partMesh.position.x).toBe(initialPartX);
    expect(model.diverterBladeMesh.rotation.y).toBe(initialBladeRotation);

    const referenceDifference = stepLemelsonMachineVisionTopology({
      ...LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS,
      referenceSignalMatches: 0,
    });
    model.update(referenceDifference);
    expect(referenceDifference.referenceComparison).toBe("difference");
    expect(model.partMesh.material).not.toBe(nominalPartMaterial);
    expect("metrics" in referenceDifference).toBe(false);

    model.dispose();
  });

  test("keeps both public faces on the source-bounded topology without an SI fallback", () => {
    const simSource = readFileSync(join(VISUALS_DIRECTORY, "LemelsonMachineVisionSim.tsx"), "utf8");
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "LemelsonMachineVision3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "lemelsonMachineVisionModel.ts"),
      "utf8",
    );

    for (const source of [simSource, threeSource]) {
      expect(source).toContain("stepLemelsonMachineVisionTopology");
      expect(source).not.toContain("stepLemelsonMachineVisionSi");
      expect(source).not.toContain("scanBeamVelocityMPerS");
      expect(source).not.toContain("solenoidForceN");
      expect(source).not.toContain("gateResponseTimeMs");
    }
    expect(simSource).toContain("source topology only");
    expect(threeSource).toContain("isRefused: true");
    expect(modelSource).not.toContain("simTimeSec");
    expect(modelSource).not.toContain("Math.sin");
    expect(modelSource).not.toContain("MathUtils.lerp");
  });
});
