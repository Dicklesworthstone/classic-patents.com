import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const THREE_VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals/three");
const FORBIDDEN_AMBIENT_STATE_SOURCES = [
  "Math.random",
  "new THREE.Clock",
  "performance.now",
] as const;

function allThreeVisualFiles(): string[] {
  return readdirSync(THREE_VISUALS_DIRECTORY).filter(
    (file) => file.endsWith("3D.tsx") || file.endsWith("Model.ts"),
  );
}

describe("per-patent Three.js replay contract", () => {
  test("checks all patent 3D renderers and models for deterministic time boundaries", () => {
    const files = allThreeVisualFiles();
    expect(files.length).toBeGreaterThan(60);

    const violations = files.flatMap((file) => {
      const source = readFileSync(join(THREE_VISUALS_DIRECTORY, file), "utf8");
      return FORBIDDEN_AMBIENT_STATE_SOURCES.filter((token) => source.includes(token)).map(
        (token) => `${file}: ${token}`,
      );
    });

    expect(violations).toEqual([]);
  });
});
