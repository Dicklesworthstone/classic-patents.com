import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const SOURCES = [
  ["ArkwrightWaterFrameSim.tsx", "[onscreenRef]);"],
  ["CorlissEngineSim.tsx", ", onscreenRef]);"],
  ["DavenportMotorSim.tsx", ", onscreenRef]);"],
  ["DeLavalSeparatorSim.tsx", ", onscreenRef]);"],
] as const;

describe("offscreen animation gates", () => {
  test("keeps visibility live without treating mutable ref contents as effect dependencies", () => {
    for (const [fileName, stableDependency] of SOURCES) {
      const source = readFileSync(
        join(process.cwd(), "src/components/patents/visuals", fileName),
        "utf8",
      );

      expect(source).toContain("useOffscreenGate");
      expect(source).toContain("onscreenRef.current");
      expect(source).not.toContain("onscreenRef.current]);");
      expect(source).toContain(stableDependency);
    }
  });
});
