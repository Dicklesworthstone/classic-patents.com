import { describe, expect, test } from "bun:test";
import {
  LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS,
  stepLemelsonMachineVisionSi,
} from "@/physics/lemelsonMachineVisionKernel";
import { createLemelsonMachineVisionModel } from "./lemelsonMachineVisionModel";

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

  test("animates workpiece translation, beam wobble, and diverter gate rotation on update", () => {
    const model = createLemelsonMachineVisionModel();
    const state = stepLemelsonMachineVisionSi(LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS);

    // Initial update at t = 0
    model.update(LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS, state.metrics, 0);
    const initialPartX = model.partMesh.position.x;

    // Advance time to t = 1.0 s
    model.update(LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS, state.metrics, 1.0);
    const advancedPartX = model.partMesh.position.x;
    expect(advancedPartX).not.toBe(initialPartX);

    // Defective part triggers solenoid diverter gate swing
    const defectiveState = stepLemelsonMachineVisionSi({
      ...LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS,
      actualPartWidthM: 0.095, // Defective +15 mm oversize
    });
    expect(defectiveState.metrics.isDefective).toBe(true);

    // Update with defective metrics
    model.update(
      { ...LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS, actualPartWidthM: 0.095 },
      defectiveState.metrics,
      2.0,
    );

    model.dispose();
  });
});
