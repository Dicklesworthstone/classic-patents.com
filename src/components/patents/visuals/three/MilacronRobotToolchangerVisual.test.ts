import { describe, expect, test } from "bun:test";
import * as THREE from "three";
import {
  MILACRON_TOOLCHANGER_DEFAULT_CONTROLS,
  readMilacronToolchangerControls,
  stepMilacronRobotToolchangerSi,
} from "@/physics/milacronRobotToolchangerKernel";
import { createMilacronRobotToolchangerModel } from "./milacronRobotToolchangerModel";

describe("US 4,512,709 Cincinnati Milacron Robot Toolchanger procedural 3D model & visual boundary", () => {
  test("constructs valid 3D mesh hierarchy with adapter, tool base, slide, pins, and tool head", () => {
    const model = createMilacronRobotToolchangerModel();
    expect(model.root.name).toBe("MilacronRobotToolchangerModel");
    expect(model.adapterGroup.name).toBe("AdapterMasterUnit");
    expect(model.toolBaseGroup.name).toBe("ToolBaseAssembly");
    expect(model.lockingSlideMesh.parent).toBe(model.adapterGroup);
    expect(model.cylindricalPinMesh.parent).toBe(model.adapterGroup);
    expect(model.diamondPinMesh.parent).toBe(model.adapterGroup);
    expect(model.tMemberMesh.parent?.name).toBe("TMemberRetentionLug");
    expect(model.toolHeadMesh.parent?.name).toBe("IndustrialToolHead");

    model.dispose();
  });

  test("translates tool base and locking slide dynamically during update loop", () => {
    const model = createMilacronRobotToolchangerModel();
    const controls = MILACRON_TOOLCHANGER_DEFAULT_CONTROLS;
    const tel = stepMilacronRobotToolchangerSi(controls);

    // Initial state
    model.update(controls, tel, 0.0);
    const z0 = model.toolBaseGroup.position.z;
    const y0 = model.lockingSlideMesh.position.y;

    // Advance gap and stroke
    const movedControls = readMilacronToolchangerControls({
      dockingGapMm: 4.0,
      slideStrokeMm: 0.0,
    });
    const movedTel = stepMilacronRobotToolchangerSi(movedControls);
    model.update(movedControls, movedTel, 1.0);

    const z1 = model.toolBaseGroup.position.z;
    const y1 = model.lockingSlideMesh.position.y;

    expect(z1).toBeGreaterThan(z0);
    expect(y1).toBeLessThan(y0);

    model.dispose();
  });

  test("computes accurate SI clamping mechanics for default controls", () => {
    const tel = stepMilacronRobotToolchangerSi(MILACRON_TOOLCHANGER_DEFAULT_CONTROLS);

    expect(tel.actuatorThrustN).toBeGreaterThan(400);
    expect(tel.clampingForceN).toBeGreaterThan(1000);
    expect(tel.isLocked).toBe(true);
    expect(tel.isSelfLocking).toBe(true);
    expect(tel.positionalRepeatabilityMm).toBeLessThanOrEqual(0.025);
  });
});
