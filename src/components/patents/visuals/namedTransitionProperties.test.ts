import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const SOURCES = [
  [
    "BaekelandBakeliteSim.tsx",
    ["transition-[stroke,stroke-width,stroke-dasharray]", "transition-[width,background-color]"],
  ],
  [
    "ColtRevolverSim.tsx",
    [
      "transition-[background-color,color,opacity]",
      "transition-[background-color,transform]",
      "transition-[background-color,color,border-color,transform]",
    ],
  ],
  ["MaimanRubyLaserSim.tsx", ["transition-[background-color,opacity]"]],
  ["PageRankSim.tsx", ["transition-[background-color,color]"]],
] as const;

describe("named visual transition properties", () => {
  test("keeps the React Doctor transition-all targets scoped to changing properties", () => {
    for (const [fileName, transitionClasses] of SOURCES) {
      const source = readFileSync(
        join(process.cwd(), "src/components/patents/visuals", fileName),
        "utf8",
      );

      expect(source).not.toContain("transition-all");
      for (const transitionClass of transitionClasses) {
        expect(source).toContain(transitionClass);
      }
    }
  });
});
