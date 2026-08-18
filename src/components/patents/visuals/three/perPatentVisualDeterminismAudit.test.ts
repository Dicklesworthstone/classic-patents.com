import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const THREE_VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals/three");
const FORBIDDEN_AMBIENT_STATE_SOURCES = [
  "Math.random",
  "new THREE.Clock",
  "performance.now",
] as const;

function exemplarThreeVisualFiles(): string[] {
  return ["WrightFlyer3D.tsx", "McCormickReaper3D.tsx"];
}

describe("per-patent Three.js replay contract", () => {
  test("checks exemplar patent renderers for deterministic time boundaries", () => {
    const files = exemplarThreeVisualFiles();

    const violations = files.flatMap((file) => {
      const source = readFileSync(join(THREE_VISUALS_DIRECTORY, file), "utf8");
      return FORBIDDEN_AMBIENT_STATE_SOURCES.filter((token) => source.includes(token)).map(
        (token) => `${file}: ${token}`,
      );
    });

    expect(violations).toEqual([]);
  });
});
