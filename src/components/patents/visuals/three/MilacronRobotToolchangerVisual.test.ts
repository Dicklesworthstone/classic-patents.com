import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const source = (path: string) => readFileSync(join(ROOT, path), "utf8");

describe("US 4,512,709 toolchanger visual source contract", () => {
  test("uses the shared source-bounded engagement kernel on both visual faces", () => {
    const twoD = source("src/components/patents/visuals/MilacronRobotToolchangerSim.tsx");
    const threeD = source("src/components/patents/visuals/three/MilacronRobotToolchanger3D.tsx");
    const model = source("src/components/patents/visuals/three/milacronRobotToolchangerModel.ts");
    expect(twoD).toContain("usePatentPhysics(PATENT_ID)");
    expect(twoD).toContain("stepMilacronRobotToolchanger(params)");
    expect(threeD).toContain("usePatentPhysics(PATENT_ID)");
    expect(threeD).toContain("useFrankenSimPhysics");
    expect(threeD).toContain("isRefused: true");
    expect(threeD).toContain("createThreeStudioScene");
    expect(model).toContain("Normalized display positions");
    expect(model).not.toContain("Math.random");
    expect(model).not.toContain("GLTFLoader");
  });

  test("keeps the phone canvas clear by placing controls after it", () => {
    const threeD = source("src/components/patents/visuals/three/MilacronRobotToolchanger3D.tsx");
    const canvasIndex = threeD.indexOf("ref={containerRef}");
    const controlsIndex = threeD.indexOf('data-mobile-layout="controls-below-canvas"');

    expect(canvasIndex).toBeGreaterThan(-1);
    expect(controlsIndex).toBeGreaterThan(canvasIndex);
    expect(threeD).toContain("hidden items-start justify-between");
    expect(threeD).toContain("hidden rounded-xl");
  });
});
