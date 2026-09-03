import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const STUDIOS = [
  ["CarlsonElectrophotography3D.tsx", "animate", "animFrameRef", true],
  ["DieselEngine3D.tsx", "renderLoop", "animRef", true],
  ["FessendenWireless3D.tsx", "animate", "animFrameRef", true],
  ["HaberAmmonia3D.tsx", "animate", "animFrameRef", true],
  ["HewittMercuryLamp3D.tsx", "animate", "animFrameRef", true],
  ["KilbySourceCircuit3D.tsx", "animate", "frameRef", true],
  ["LandPolaroid3D.tsx", "animate", "animFrameRef", true],
  ["MaximMachineGun3D.tsx", "animate", "reqId", false],
  ["SalisburyRobotHand3D.tsx", "renderLoop", "animId", false],
  ["SundbackZipper3D.tsx", "renderLoop", "animId", false],
  ["TownesMaserSystem3D.tsx", "animate", "animFrameRef", true],
] as const;

const LIVE_REF_SYNCS = [
  ["MestralVelcro3D.tsx", ["liveControlsRef.current = controls;", "liveTelRef.current = tel;"]],
  [
    "StackhouseManipulator3D.tsx",
    ["liveControlsRef.current = controls;", "liveTelRef.current = tel;"],
  ],
  ["SalisburyRobotHand3D.tsx", ["liveTelRef.current = tel;"]],
  ["SundbackZipper3D.tsx", ["liveControlsRef.current = controls;", "liveTelRef.current = tel;"]],
] as const;

describe("Three.js visible-frame lifecycle", () => {
  for (const [fileName, loopName, frameRef, isRef] of STUDIOS) {
    test(`${fileName} schedules its next frame before the visibility early return`, () => {
      const source = readFileSync(
        join(process.cwd(), "src/components/patents/visuals/three", fileName),
        "utf8",
      );
      const loopStart = source.indexOf(`const ${loopName} =`);
      const loopEnd = source.indexOf("return () =>", loopStart);
      const loop = source.slice(loopStart, loopEnd);

      expect(loopStart).toBeGreaterThanOrEqual(0);
      expect(loopEnd).toBeGreaterThan(loopStart);
      expect(loop).toMatch(
        new RegExp(
          `${frameRef}${isRef ? "\\.current" : ""} = requestAnimationFrame\\(${loopName}\\);\\s*if \\(!studio\\.isVisible\\(\\)\\)(?:\\s*\\{|\\s*return;)`,
        ),
      );
    });
  }

  test("Sikorsky's animation-loop callback skips simulation and rendering while offscreen", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three", "SikorskyHelicopter3D.tsx"),
      "utf8",
    );
    const loopStart = source.indexOf("const loop =");
    const loopEnd = source.indexOf("renderer.setAnimationLoop(loop);", loopStart);
    const loop = source.slice(loopStart, loopEnd);

    expect(loopStart).toBeGreaterThanOrEqual(0);
    expect(loopEnd).toBeGreaterThan(loopStart);
    expect(loop.indexOf("if (!studio.isVisible()) return;")).toBeGreaterThanOrEqual(0);
    expect(loop.indexOf("if (!studio.isVisible()) return;")).toBeLessThan(
      loop.indexOf("clock.pump"),
    );
    expect(loop.indexOf("clock.pump")).toBeLessThan(loop.indexOf("renderer.render"));
  });

  for (const [fileName, assignments] of LIVE_REF_SYNCS) {
    test(`${fileName} synchronizes animation-loop refs before paint`, () => {
      const source = readFileSync(
        join(process.cwd(), "src/components/patents/visuals/three", fileName),
        "utf8",
      );
      const firstAssignment = source.indexOf(assignments[0]);
      const layoutEffect = source.lastIndexOf("useLayoutEffect(() => {", firstAssignment);
      const passiveEffect = source.lastIndexOf("useEffect(() => {", firstAssignment);

      expect(firstAssignment).toBeGreaterThanOrEqual(0);
      expect(layoutEffect).toBeGreaterThan(passiveEffect);
      for (const assignment of assignments) {
        expect(source.indexOf(assignment, layoutEffect)).toBeGreaterThanOrEqual(layoutEffect);
      }
    });
  }
});
