import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  readDaVinciInterfaceControls,
  resolveDaVinciInterfaceTopology,
} from "@/physics/daVinciInterfaceTopology";

const ROOT = process.cwd();

describe("US 6,331,181 source-bounded tool-interface visual", () => {
  test("only admits the ready topology when all disclosed interface records are present", () => {
    const ready = resolveDaVinciInterfaceTopology(
      readDaVinciInterfaceControls({
        compatibilitySignalPresent: 1,
        calibrationRecordAvailable: 1,
        engagementSignalPresent: 1,
      }),
    );
    expect(ready.processorCanConfigureTool).toBe(true);
    expect(ready.status).toBe("ready");

    expect(
      resolveDaVinciInterfaceTopology(
        readDaVinciInterfaceControls({
          compatibilitySignalPresent: 0,
          calibrationRecordAvailable: 1,
          engagementSignalPresent: 1,
        }),
      ).status,
    ).toBe("incompatible");
    expect(
      resolveDaVinciInterfaceTopology(
        readDaVinciInterfaceControls({
          compatibilitySignalPresent: 1,
          calibrationRecordAvailable: 0,
          engagementSignalPresent: 1,
        }),
      ).status,
    ).toBe("calibration-record-missing");
    expect(
      resolveDaVinciInterfaceTopology(
        readDaVinciInterfaceControls({
          compatibilitySignalPresent: 1,
          calibrationRecordAvailable: 1,
          engagementSignalPresent: 0,
        }),
      ).status,
    ).toBe("engagement-unconfirmed");
  });

  test("public dispatcher uses the source-bounded 2D and 3D visual, not the legacy contact simulator", () => {
    const dispatcher = readFileSync(
      join(ROOT, "src", "components", "patents", "visuals", "index.tsx"),
      "utf8",
    );
    expect(dispatcher).toContain("DaVinciInterfaceSim");
    expect(dispatcher).toContain("DaVinciInterface3D");
    expect(dispatcher).not.toContain('import("./DaVinciSim")');
    expect(dispatcher).not.toContain('import("./three/DaVinci3D")');
  });

  test("withholds unsupported clinical contact and SI performance telemetry", () => {
    const visual = readFileSync(
      join(ROOT, "src", "components", "patents", "visuals", "three", "DaVinciInterface3D.tsx"),
      "utf8",
    );
    const topology = readFileSync(
      join(ROOT, "src", "physics", "daVinciInterfaceTopology.ts"),
      "utf8",
    );

    expect(visual).toContain("isRefused: true");
    expect(visual).toContain("not quantitative arm, contact, force, or speed data");
    expect(visual).not.toContain("contactForceN");
    expect(visual).not.toContain("tipVelocity");
    expect(topology).not.toContain("CUP_MASS_KG");
    expect(topology).not.toContain("CONTACT_STIFFNESS");
  });
});
