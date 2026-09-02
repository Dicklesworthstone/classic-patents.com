import { describe, expect, test } from "bun:test";
import { CRUMP_FDM_DEFAULT_CONTROLS, stepCrumpFdmSi } from "@/physics/crumpFdmKernel";
import { createCrumpFdmModel } from "./crumpFdmModel";

describe("US 5,121,329 Crump FDM Procedural 3D Visual Model", () => {
  test("instantiates complete 3D hierarchy and scene meshes", () => {
    const model = createCrumpFdmModel();
    expect(model.root).toBeDefined();
    expect(model.root.name).toBe("CrumpFdmApparatus");
    expect(model.gantryGroup).toBeDefined();
    expect(model.carriageGroup).toBeDefined();
    expect(model.bedGroup).toBeDefined();
    expect(model.partGroup).toBeDefined();
    expect(model.nozzleMesh).toBeDefined();
    expect(model.heaterBlockMesh).toBeDefined();
    expect(model.driveRollerMesh).toBeDefined();
    expect(model.pinchRollerMesh).toBeDefined();
    expect(model.activeBeadMesh).toBeDefined();
    expect(model.filamentLine).toBeDefined();

    // Verify scene graph nesting
    expect(model.gantryGroup.children.includes(model.carriageGroup)).toBe(true);
    expect(model.bedGroup.children.includes(model.partGroup)).toBe(true);
    expect(model.root.children.includes(model.bedGroup)).toBe(true);
    expect(model.root.children.includes(model.gantryGroup)).toBe(true);

    model.dispose();
  });

  test("animates kinematics and updates mesh state based on SI telemetry", () => {
    const model = createCrumpFdmModel();
    const tel = stepCrumpFdmSi(CRUMP_FDM_DEFAULT_CONTROLS);

    // Initial update at t = 0
    model.update(CRUMP_FDM_DEFAULT_CONTROLS, tel, 0);
    expect(model.activeBeadMesh.visible).toBe(true);
    const initialX = model.carriageGroup.position.x;
    const initialDriveRot = model.driveRollerMesh.rotation.z;

    // Step to t = 1.0s
    model.update(CRUMP_FDM_DEFAULT_CONTROLS, tel, 1.0);
    expect(model.carriageGroup.position.x).not.toBe(initialX);
    expect(model.driveRollerMesh.rotation.z).not.toBe(initialDriveRot);

    // Test refusal / inactive extrusion hides bead
    const stoppedTel = { ...tel, isExtruding: false };
    model.update(CRUMP_FDM_DEFAULT_CONTROLS, stoppedTel, 2.0);
    expect(model.activeBeadMesh.visible).toBe(false);

    model.dispose();
  });
});
