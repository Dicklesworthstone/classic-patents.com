import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const STUDIOS = [
  ["CarlsonElectrophotography3D.tsx", "animate", "animFrameRef"],
  ["DieselEngine3D.tsx", "renderLoop", "animRef"],
  ["FessendenWireless3D.tsx", "animate", "animFrameRef"],
  ["HaberAmmonia3D.tsx", "animate", "animFrameRef"],
  ["HewittMercuryLamp3D.tsx", "animate", "animFrameRef"],
  ["KilbyIntegratedCircuit3D.tsx", "animate", "animFrameRef"],
  ["LandPolaroid3D.tsx", "animate", "animFrameRef"],
  ["TownesLaser3D.tsx", "animate", "animFrameRef"],
] as const;

describe("Three.js visible-frame lifecycle", () => {
  for (const [fileName, loopName, frameRef] of STUDIOS) {
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
          `${frameRef}\\.current = requestAnimationFrame\\(${loopName}\\);\\s*if \\(!studio\\.isVisible\\(\\)\\) \\{`,
        ),
      );
    });
  }
});
