import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Box3, type CylinderGeometry, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import {
  readStackhouseSourceControls,
  STACKHOUSE_SOURCE_DEFAULT_CONTROLS,
  stepStackhouseSourceTopology,
} from "@/physics/stackhouseSourceKernel";
import { PATENT_PHYSICS_REGISTRY } from "@/physics/telemetryData";
import { buildStackhouseSourceModel } from "./stackhouseSourceModel";

describe("Stackhouse source-bounded connected wrist", () => {
  test("nests every distal assembly under the physical shaft that carries it", () => {
    const model = buildStackhouseSourceModel();
    expect(model.fixedForearmGroup.parent).toBe(model.root);
    expect(model.forearmRollGroup.parent).toBe(model.root);
    expect(model.firstObliqueTiltGroup.parent).toBe(model.forearmRollGroup);
    expect(model.intermediateRollGroup.parent).toBe(model.firstObliqueTiltGroup);
    expect(model.secondObliqueTiltGroup.parent).toBe(model.intermediateRollGroup);
    expect(model.toolRollGroup.parent).toBe(model.secondObliqueTiltGroup);
    expect(model.toolFlangeMesh.parent).toBe(model.toolRollGroup);
    expect(model.toolTipMesh.parent).toBe(model.toolRollGroup);
    model.dispose();
  });

  test("exposes both concentric shaft sets through source-honest cutaway shells", () => {
    const model = buildStackhouseSourceModel();
    try {
      const housing = model.root.getObjectByName("ForearmSection6");
      const forearmShafts = [
        "OuterForearmShaft15",
        "IntermediateForearmShaft16",
        "InnerForearmShaft19",
      ].map((name) => model.root.getObjectByName(name));
      const housingShaft = model.root.getObjectByName("RotatableHousingShaft14a");
      const internalShaft = model.root.getObjectByName("InternalDriveShaft23");

      expect(housing).toBeInstanceOf(Mesh);
      expect(forearmShafts.every((shaft) => shaft instanceof Mesh)).toBe(true);
      expect(housingShaft).toBeInstanceOf(Mesh);
      expect(internalShaft).toBeInstanceOf(Mesh);
      if (!(housing instanceof Mesh) || !(housing.material instanceof MeshStandardMaterial)) {
        throw new Error("Stackhouse cutaway housing is missing.");
      }
      expect(housing.material.transparent).toBe(true);
      expect(housing.material.opacity).toBeLessThan(0.5);
      expect((housing.geometry as CylinderGeometry).parameters.openEnded).toBe(true);
      expect((housing.geometry as CylinderGeometry).parameters.thetaLength).toBeLessThan(
        Math.PI * 2,
      );

      model.update(
        stepStackhouseSourceTopology(STACKHOUSE_SOURCE_DEFAULT_CONTROLS),
        STACKHOUSE_SOURCE_DEFAULT_CONTROLS,
      );
      model.root.updateMatrixWorld(true);
      expect(
        new Box3()
          .setFromObject(housingShaft as Mesh)
          .intersectsBox(new Box3().setFromObject(internalShaft as Mesh)),
      ).toBe(true);
    } finally {
      model.dispose();
    }
  });

  test("includes all three disclosed bevel paths and keeps the terminal stack connected", () => {
    const model = buildStackhouseSourceModel();
    try {
      for (const name of [
        "BevelGear17 on intermediate forearm shaft 16",
        "BevelGear18 on housing shaft 14a",
        "BevelGear21 on inner forearm shaft 20",
        "BevelGear22 on internal shaft 23",
        "BevelGear24 on internal shaft 23",
        "BevelGear25 on terminal shaft 26",
      ]) {
        expect(model.root.getObjectByName(name)).toBeInstanceOf(Mesh);
      }

      model.update(
        stepStackhouseSourceTopology(STACKHOUSE_SOURCE_DEFAULT_CONTROLS),
        STACKHOUSE_SOURCE_DEFAULT_CONTROLS,
      );
      model.root.updateMatrixWorld(true);
      const terminalShaft = model.root.getObjectByName("TerminalShaft26");
      expect(terminalShaft).toBeInstanceOf(Mesh);
      expect(
        new Box3()
          .setFromObject(terminalShaft as Mesh)
          .intersectsBox(new Box3().setFromObject(model.toolFlangeMesh)),
      ).toBe(true);
      expect(
        new Box3()
          .setFromObject(model.toolFlangeMesh)
          .intersectsBox(new Box3().setFromObject(model.toolTipMesh)),
      ).toBe(true);
    } finally {
      model.dispose();
    }
  });

  test("produces a deterministic unit direction and explicit quantitative refusal", () => {
    const a = stepStackhouseSourceTopology(STACKHOUSE_SOURCE_DEFAULT_CONTROLS);
    const b = stepStackhouseSourceTopology(STACKHOUSE_SOURCE_DEFAULT_CONTROLS);
    expect(a).toEqual(b);
    expect(Math.hypot(...a.toolDirection)).toBeCloseTo(1, 10);
    expect(a.refusal.refused).toBe(true);
    expect(a.refusal.reason).toContain("omits exact angles");
  });

  test("keeps selected display obliquities inside the printed numerical boundary", () => {
    const controls = readStackhouseSourceControls({
      firstObliqueAngleDeg: 12,
      secondObliqueAngleDeg: 120,
    });
    expect(controls.firstObliqueAngleDeg).toBe(46);
    expect(controls.secondObliqueAngleDeg).toBe(80);
    expect(stepStackhouseSourceTopology(controls).coverageState).toContain("exceed 45°");
  });

  test("keeps preferred axes at P and physically bridges the offset contrast", () => {
    const model = buildStackhouseSourceModel();
    const exact = stepStackhouseSourceTopology({ singleIntersection: 1 });
    model.update(exact, readStackhouseSourceControls(exact));
    const pointP = model.pointPMarkerMesh.getWorldPosition(new Vector3());
    const terminalOrigin = model.secondObliqueTiltGroup.getWorldPosition(new Vector3());
    expect(pointP.distanceTo(terminalOrigin)).toBeLessThan(1e-9);
    expect(model.offsetBridgeMesh.visible).toBe(false);

    const offset = stepStackhouseSourceTopology({ singleIntersection: 0 });
    model.update(offset, readStackhouseSourceControls(offset));
    const offsetOrigin = model.secondObliqueTiltGroup.getWorldPosition(new Vector3());
    expect(pointP.distanceTo(offsetOrigin)).toBeCloseTo(offset.terminalAxisOffset, 8);
    expect(model.offsetBridgeMesh.visible).toBe(true);
    expect(model.offsetBridgeMesh.parent).toBe(model.intermediateRollGroup);
    expect(() => model.dispose()).not.toThrow();
  });

  test("publishes only the source-bounded registry seat and teaching equation", () => {
    const registry = PATENT_PHYSICS_REGISTRY["us-4068536-stackhouse-manipulator"];
    const equations = ALL_COLORIZED_EQUATIONS["us-4068536-stackhouse-manipulator"];
    expect(registry.engineMethod).toContain("normalized host geometry");
    expect(JSON.stringify(registry)).not.toContain("mechanicalPowerWatts");
    expect(equations).toHaveLength(1);
    expect(equations[0].rawLatex).toContain(">45^\\circ");
    expect(JSON.stringify(equations)).not.toContain("0.5 |\\sin");
    expect(JSON.stringify(equations)).not.toContain("claimRef");
  });

  test("keeps the historical schematic off the withdrawn 45-degree draft", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/InteractiveDiagramViewer.tsx"),
      "utf8",
    );
    expect(source).toContain("stepStackhouseSourceTopology(params ?? {})");
    expect(source).not.toContain("45° Intermediate Housing 28");
    expect(source).not.toContain("Center 36");
    expect(source).not.toContain("Tool 46");
  });

  test("gives the wrist a full-height phone viewport and a compact camera selector", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/StackhouseManipulator3D.tsx"),
      "utf8",
    );

    expect(source).toContain('id="stackhouse-camera-view"');
    expect(source).toContain("sm:hidden");
    expect(source).toContain("min-h-[320px]");
    expect(source).toContain("sm:min-h-0 sm:aspect-video");
  });

  test("keeps the source-bounded telemetry inspector stacked until a true wide viewport", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/StackhouseSourceBounded3D.tsx"),
      "utf8",
    );
    expect(source).toContain("2xl:grid-cols-[minmax(0,2fr)_minmax(24rem,1fr)]");
    expect(source).toContain("partially translucent museum cutaways");
    expect(source).not.toContain("xl:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]");
  });
});
