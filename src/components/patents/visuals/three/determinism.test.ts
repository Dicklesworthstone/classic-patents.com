import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const WRIGHT_FLYER_3D_SOURCE = join(
  process.cwd(),
  "src/components/patents/visuals/three/WrightFlyer3D.tsx",
);
const WRIGHT_FLYER_AIRFRAME_SOURCE = join(
  process.cwd(),
  "src/components/patents/visuals/three/wrightFlyerAirframe.ts",
);
const MCCORMICK_REAPER_2D_SOURCE = join(
  process.cwd(),
  "src/components/patents/visuals/McCormickReaperSim.tsx",
);
const MCCORMICK_REAPER_3D_SOURCE = join(
  process.cwd(),
  "src/components/patents/visuals/three/McCormickReaper3D.tsx",
);

describe("Wright Flyer replay boundary", () => {
  test("does not seed or advance the exemplar's physical visual with ambient randomness or a private clock", () => {
    const sources = [
      readFileSync(WRIGHT_FLYER_3D_SOURCE, "utf8"),
      readFileSync(WRIGHT_FLYER_AIRFRAME_SOURCE, "utf8"),
    ];

    for (const source of sources) {
      expect(source).not.toContain("Math.random");
      expect(source).not.toContain("new THREE.Clock");
    }
  });
});

describe("McCormick Reaper replay boundary", () => {
  test("does not derive its figure layout or motion from ambient randomness or wall-clock time", () => {
    const sources = [
      readFileSync(MCCORMICK_REAPER_2D_SOURCE, "utf8"),
      readFileSync(MCCORMICK_REAPER_3D_SOURCE, "utf8"),
    ];

    for (const source of sources) {
      expect(source).not.toContain("Math.random");
      expect(source).not.toContain("new THREE.Clock");
      expect(source).not.toContain("performance.now");
    }
  });
});

describe("per-patent Three.js replay boundary", () => {
  test("does not permit an exemplar patent renderer to seed its visual state from randomness or a private clock", () => {
    const directory = join(process.cwd(), "src/components/patents/visuals/three");
    const exemplarFiles = ["WrightFlyer3D.tsx", "McCormickReaper3D.tsx"];
    const violations = exemplarFiles.flatMap((file) => {
      const source = readFileSync(join(directory, file), "utf8");
      const forbidden = ["Math.random", "new THREE.Clock", "performance.now"].filter((token) =>
        source.includes(token),
      );
      return forbidden.map((token) => `${file}: ${token}`);
    });

    expect(violations).toEqual([]);
  });
});
