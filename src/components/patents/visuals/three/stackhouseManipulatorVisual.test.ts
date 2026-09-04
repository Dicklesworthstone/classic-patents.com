import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  Box3,
  type CylinderGeometry,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  type Object3D,
  PerspectiveCamera,
  Vector3,
} from "three";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import {
  readStackhouseSourceControls,
  STACKHOUSE_SOURCE_DEFAULT_CONTROLS,
  stepStackhouseSourceTopology,
} from "@/physics/stackhouseSourceKernel";
import { PATENT_PHYSICS_REGISTRY } from "@/physics/telemetryData";
import { stackhouseSourceCameraForViewport } from "./stackhouseSourceCamera";
import { buildStackhouseSourceModel } from "./stackhouseSourceModel";

function projectedBounds(object: Object3D, viewportWidth: number, viewportHeight: number) {
  object.updateMatrixWorld(true);
  const bounds = new Box3().setFromObject(object);
  const view = stackhouseSourceCameraForViewport("overview", viewportWidth);
  const camera = new PerspectiveCamera(42, viewportWidth / viewportHeight, 0.1, 1000);
  camera.position.set(...view.position);
  camera.lookAt(...view.target);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();

  const corners = [bounds.min.x, bounds.max.x].flatMap((x) =>
    [bounds.min.y, bounds.max.y].flatMap((y) =>
      [bounds.min.z, bounds.max.z].map((z) => new Vector3(x, y, z).project(camera)),
    ),
  );

  return {
    minX: Math.min(...corners.map((corner) => corner.x)),
    maxX: Math.max(...corners.map((corner) => corner.x)),
    minY: Math.min(...corners.map((corner) => corner.y)),
    maxY: Math.max(...corners.map((corner) => corner.y)),
  };
}

/**
 * Box corners are intentionally too conservative for this articulated model:
 * a corner may combine the motor plate from one side with the tool from another
 * even though no drawn part occupies that point. Project the actual rendered
 * mesh vertices so framing tests measure the exhibit a visitor can see.
 */
function projectedMeshBounds(object: Object3D, viewportWidth: number, viewportHeight: number) {
  object.updateMatrixWorld(true);
  const view = stackhouseSourceCameraForViewport("overview", viewportWidth);
  const camera = new PerspectiveCamera(42, viewportWidth / viewportHeight, 0.1, 1000);
  camera.position.set(...view.position);
  camera.lookAt(...view.target);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();

  const projected: Vector3[] = [];
  object.traverse((candidate) => {
    if (!(candidate instanceof Mesh)) return;
    const positions = candidate.geometry.getAttribute("position");
    if (!positions) return;

    const matrices: readonly Matrix4[] =
      candidate instanceof InstancedMesh
        ? Array.from({ length: candidate.count }, (_, index) => {
            const instance = new Matrix4();
            candidate.getMatrixAt(index, instance);
            return new Matrix4().multiplyMatrices(candidate.matrixWorld, instance);
          })
        : [candidate.matrixWorld];

    for (const matrix of matrices) {
      for (let index = 0; index < positions.count; index += 1) {
        projected.push(
          new Vector3(positions.getX(index), positions.getY(index), positions.getZ(index))
            .applyMatrix4(matrix)
            .project(camera),
        );
      }
    }
  });

  return {
    minX: Math.min(...projected.map((point) => point.x)),
    maxX: Math.max(...projected.map((point) => point.x)),
    minY: Math.min(...projected.map((point) => point.y)),
    maxY: Math.max(...projected.map((point) => point.y)),
  };
}

describe("Stackhouse source-bounded connected wrist", () => {
  test("nests every distal assembly under the physical shaft that carries it", () => {
    const model = buildStackhouseSourceModel();
    expect(model.fixedForearmGroup.parent).toBe(model.root);
    expect(model.forearmRollGroup.parent).toBe(model.root);
    expect(model.intermediateInputGroup.parent).toBe(model.root);
    expect(model.innerInputGroup.parent).toBe(model.root);
    expect(model.firstObliqueTiltGroup.parent).toBe(model.forearmRollGroup);
    expect(model.intermediateRollGroup.parent).toBe(model.firstObliqueTiltGroup);
    expect(model.internalDriveGroup.parent).toBe(model.firstObliqueTiltGroup);
    expect(model.secondObliqueTiltGroup.parent).toBe(model.intermediateRollGroup);
    expect(model.toolRollGroup.parent).toBe(model.secondObliqueTiltGroup);
    expect(model.toolFlangeMesh.parent).toBe(model.toolRollGroup);
    expect(model.toolTipMesh.parent).toBe(model.toolRollGroup);
    model.dispose();
  });

  test("connects all three elbow motors through spur gears to their concentric shafts", () => {
    const model = buildStackhouseSourceModel();
    try {
      expect(model.motorRotorGroups).toHaveLength(3);
      for (let index = 0; index < 3; index += 1) {
        const letter = ["a", "c", "b"][index];
        const shaftNumber = [15, 16, 19][index];
        const motor = model.root.getObjectByName(`HydraulicMotor9${letter}`);
        const rotor = model.root.getObjectByName(`HydraulicMotor9${letter}Rotor`);
        const pinion = model.root.getObjectByName(`Motor9${letter}SpurPinion`);
        const driven = model.root.getObjectByName(`ForearmShaft${shaftNumber}DrivenSpurGear`);
        expect(motor).toBeInstanceOf(Mesh);
        expect(rotor).toBe(model.motorRotorGroups[index]);
        expect(pinion).toBeInstanceOf(Mesh);
        expect(driven).toBeInstanceOf(Mesh);
        expect(
          new Box3()
            .setFromObject(pinion?.parent ?? (pinion as Mesh))
            .intersectsBox(new Box3().setFromObject(driven?.parent ?? (driven as Mesh))),
        ).toBe(true);
      }

      const centersBefore = model.motorRotorGroups.map((rotor) =>
        rotor.getWorldPosition(new Vector3()).clone(),
      );
      const moved = stepStackhouseSourceTopology({
        forearmRollDeg: 80,
        intermediateRollDeg: -65,
        toolRollDeg: 110,
      });
      model.update(moved, readStackhouseSourceControls(moved));
      model.motorRotorGroups.forEach((rotor, index) => {
        expect(rotor.getWorldPosition(new Vector3()).distanceTo(centersBefore[index])).toBeLessThan(
          1e-12,
        );
      });
    } finally {
      model.dispose();
    }
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
        const gear = model.root.getObjectByName(name);
        expect(gear).toBeInstanceOf(Mesh);
        const teeth = model.root.getObjectByName(`${name} teeth`);
        expect(teeth).toBeInstanceOf(InstancedMesh);
        expect((teeth as InstancedMesh).count).toBeGreaterThan(10);
      }

      expect(model.bevelGearMeshes).toHaveLength(6);

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
          .setFromObject(model.terminalHousingMesh)
          .intersectsBox(new Box3().setFromObject(terminalShaft as Mesh)),
      ).toBe(true);
      expect(model.wristBearingMeshes).toHaveLength(4);
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
    expect(Math.hypot(...a.axisBDirection)).toBeCloseTo(1, 10);
    expect(Math.hypot(...a.axisCDirection)).toBeCloseTo(1, 10);
    expect(a.axisCDirection).toEqual(a.toolDirection);
    expect(a.rotationDeterminant).toBeCloseTo(1, 12);
    expect(a.rotationOrthonormalityError).toBeLessThan(1e-12);
    expect(a.jointOwner).toContain("fs-mbd revolute-joint");
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

  test("gives the desktop overview useful source-geometry scale without entering either HUD lane", () => {
    const model = buildStackhouseSourceModel();
    try {
      const desktop = stackhouseSourceCameraForViewport("overview", 1180);
      const tablet = stackhouseSourceCameraForViewport("overview", 684);
      const phone = stackhouseSourceCameraForViewport("overview", 375);

      expect(desktop).toEqual({
        position: [1.05, 2.75, -0.48],
        target: [-0.1, -0.4, -0.48],
      });
      expect(tablet).toEqual({
        position: [2.275, 1.515, 2.354],
        target: [0, -0.5, -0.48],
      });
      expect(phone.target).toEqual([0, -0.14, -0.48]);
      expect(phone.position[0]).toBeCloseTo(3.325, 12);
      expect(phone.position[1]).toBeCloseTo(2.121, 12);
      expect(phone.position[2]).toBeCloseTo(3.662, 12);

      for (const params of [
        {},
        { forearmRollDeg: 180 },
        { forearmRollDeg: 180, singleIntersection: 0 },
      ]) {
        const controls = readStackhouseSourceControls(params);
        model.update(stepStackhouseSourceTopology(controls), controls);
        const frame = projectedMeshBounds(model.root, 1180, 518);

        // Top-left source identity reaches to roughly NDC x=-0.25/y=0.72;
        // the bottom-right source boundary begins near x=0.42/y=-0.63.
        // Keep the physical exhibit in the unobscured central field.
        expect(frame.minX).toBeGreaterThan(-0.55);
        expect(frame.maxX).toBeLessThan(0.7);
        expect(frame.minY).toBeGreaterThan(-0.62);
        expect(frame.maxY).toBeLessThan(0.72);
        expect(frame.maxX - frame.minX).toBeGreaterThan(1);
        expect(frame.maxY - frame.minY).toBeGreaterThan(1);
      }

      const tabletControls = readStackhouseSourceControls({});
      model.update(stepStackhouseSourceTopology(tabletControls), tabletControls);
      const tabletWholeModel = projectedBounds(model.root, 684, 520);
      const tabletEndEffector = projectedBounds(model.toolRollGroup, 684, 520);
      expect(tabletWholeModel.minX).toBeGreaterThan(-0.9);
      expect(tabletWholeModel.maxX).toBeLessThan(0.9);
      expect(tabletWholeModel.minY).toBeGreaterThan(-0.9);
      expect(tabletWholeModel.maxY).toBeLessThan(0.85);
      expect(tabletEndEffector.minY).toBeGreaterThan(-0.8);
      expect(tabletEndEffector.maxY).toBeLessThan(0.8);
    } finally {
      model.dispose();
    }
  });

  test("propagates each selected joint through the corresponding supported shaft path", () => {
    const model = buildStackhouseSourceModel();
    try {
      const pose = stepStackhouseSourceTopology({
        forearmRollDeg: 35,
        intermediateRollDeg: -70,
        toolRollDeg: 115,
      });
      model.update(pose, readStackhouseSourceControls(pose));
      expect(model.forearmRollGroup.rotation.z).toBeCloseTo(pose.thetaARad, 12);
      expect(model.intermediateInputGroup.rotation.z).toBeCloseTo(-pose.thetaBRad, 12);
      expect(model.intermediateRollGroup.rotation.z).toBeCloseTo(pose.thetaBRad, 12);
      expect(model.innerInputGroup.rotation.z).toBeCloseTo(pose.thetaCRad, 12);
      expect(model.internalDriveGroup.rotation.z).toBeCloseTo(-pose.thetaCRad, 12);
      expect(model.toolRollGroup.rotation.z).toBeCloseTo(pose.thetaCRad, 12);
      expect(model.motorRotorGroups[0].rotation.z).toBeCloseTo(-2 * pose.thetaARad, 12);
      expect(model.motorRotorGroups[1].rotation.z).toBeCloseTo(2 * pose.thetaBRad, 12);
      expect(model.motorRotorGroups[2].rotation.z).toBeCloseTo(-2 * pose.thetaCRad, 12);
    } finally {
      model.dispose();
    }
  });

  test("publishes only the source-bounded registry seat and teaching equation", () => {
    const registry = PATENT_PHYSICS_REGISTRY["us-4068536-stackhouse-manipulator"];
    const equations = ALL_COLORIZED_EQUATIONS["us-4068536-stackhouse-manipulator"];
    expect(registry.engineMethod).toContain("fs-mbd revolute-joint forward kinematics");
    expect(registry.engineMethod).toContain("no Stackhouse WASM export");
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

  test("gives the public wrist a full-height phone viewport and moves its title below the canvas", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/StackhouseSourceBounded3D.tsx"),
      "utf8",
    );

    expect(source).toContain('data-mobile-layout="source-title-below-canvas"');
    expect(source).toContain("min-h-[430px]");
    expect(source).toContain("sm:min-h-[520px]");
    expect(source).toContain("stackhouseSourceCameraForViewport");
  });

  test("uses one shared telemetry control surface instead of duplicating six sliders", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/StackhouseSourceBounded3D.tsx"),
      "utf8",
    );
    expect(source.match(/<PhysicsTelemetryBadge/g)).toHaveLength(1);
    expect(source).not.toContain('type="range"');
    expect(source).toContain('data-testid="stackhouse-intersection-toggle"');
    expect(source).toMatch(/partially\s+translucent/);
  });
});
