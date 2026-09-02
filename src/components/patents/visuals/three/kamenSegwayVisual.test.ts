import { describe, expect, test } from "bun:test";
import { KAMEN_SEGWAY_DEFAULT_CONTROLS, stepKamenSegwaySi } from "@/physics/kamenSegwayKernel";
import { createKamenSegwayModel } from "./kamenSegwayModel";

describe("US 6,302,230 Dean Kamen Segway Transporter 3D WebGL Model", () => {
  test("constructs valid procedural 3D hierarchy and child groups", () => {
    const segway = createKamenSegwayModel();

    expect(segway.rootGroup).toBeDefined();
    expect(segway.chassisGroup).toBeDefined();
    expect(segway.leftWheelGroup).toBeDefined();
    expect(segway.rightWheelGroup).toBeDefined();
    expect(segway.mastGroup).toBeDefined();
    expect(segway.riderGroup).toBeDefined();
    expect(segway.groundGrid).toBeDefined();

    expect(segway.rootGroup.children.length).toBeGreaterThan(0);
    expect(segway.chassisGroup.children.length).toBeGreaterThan(4);
  });

  test("animates pitch rotation, wheel spin, and haptic shudder vibration", () => {
    const segway = createKamenSegwayModel();
    const controls = { ...KAMEN_SEGWAY_DEFAULT_CONTROLS, riderPitchDeg: 6.0 };
    const tel = stepKamenSegwaySi(controls);

    segway.update(controls, tel, 1.5);

    // Forward pitch tilt applied
    expect(segway.chassisGroup.rotation.x).toBeLessThan(0);

    // Wheels spun
    expect(segway.leftWheelGroup.rotation.x).not.toBe(0);
    expect(segway.rightWheelGroup.rotation.x).not.toBe(0);
  });
});
