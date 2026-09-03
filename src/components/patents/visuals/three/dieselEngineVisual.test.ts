import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { dieselCameraPresetForViewport } from "./dieselEngineCamera";
import { buildDieselEngineModel, updateDieselEngineKinematics } from "./dieselEngineModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 542,846 Diesel source-bounded visual", () => {
  test("keeps the overview close on tablet and backs it away only for narrow canvases", () => {
    const tablet = dieselCameraPresetForViewport("iso", 644);
    const phone = dieselCameraPresetForViewport("iso", 228);

    expect(Math.hypot(...phone.pos)).toBeGreaterThan(Math.hypot(...tablet.pos));
    expect(phone.target).toEqual(tablet.target);
  });

  test("keeps the 3D route source-bounded and free of later-engine assets", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DieselEngine3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "dieselEngineModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(threeSource).toContain("held");
    expect(modelSource).toContain("CylinderC");
    expect(modelSource).toContain("AdmissionPlugD");
    expect(modelSource).toContain("AirReservoirL");
    expect(modelSource).toContain("AnnularSpaceS");
    for (const forbidden of ["Augsburg", "80-bar", "10-foot", "poppet", "blast-air"]) {
      expect(modelSource.toLowerCase()).not.toContain(forbidden.toLowerCase());
    }
  });

  test("uses deterministic named-organ pose without synthetic telemetry", () => {
    const { root, nodes } = buildDieselEngineModel();
    expect(root.children.length).toBeGreaterThan(5);

    updateDieselEngineKinematics(nodes, 0, true);
    const initial = nodes.plungerP.position.x;
    expect(nodes.annularSpaceS.visible).toBe(true);
    expect(nodes.cylinderLinerSolid.visible).toBe(false);
    expect(nodes.cylinderLinerCutaway.visible).toBe(true);
    expect(nodes.cylinderJacketSolid.visible).toBe(false);
    expect(nodes.cylinderJacketCutaway.visible).toBe(true);
    expect(nodes.cylinderHeadSolid.visible).toBe(false);
    expect(nodes.cylinderHeadCutaway.visible).toBe(true);

    updateDieselEngineKinematics(nodes, Math.PI / 2, false);
    expect(nodes.plungerP.position.x).not.toBe(initial);
    expect(nodes.annularSpaceS.visible).toBe(false);
    expect(nodes.cylinderLinerSolid.visible).toBe(true);
    expect(nodes.cylinderLinerCutaway.visible).toBe(false);
    expect(nodes.cylinderJacketSolid.visible).toBe(true);
    expect(nodes.cylinderJacketCutaway.visible).toBe(false);
    expect(nodes.cylinderHeadSolid.visible).toBe(true);
    expect(nodes.cylinderHeadCutaway.visible).toBe(false);
  });
});
