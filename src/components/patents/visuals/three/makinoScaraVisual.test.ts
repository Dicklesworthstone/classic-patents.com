import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { applySharedClaimConstraintModifications } from "@/physics/claimConstraints";
import {
  MAKINO_EXHIBIT_BASE_SPAN,
  MAKINO_EXHIBIT_LINK_LENGTH,
  MAKINO_EXHIBIT_OFFSET_FOLLOWER_LENGTH,
  MAKINO_FRANKENSIM_BOUNDARY,
  MAKINO_FRANKENSIM_OWNER,
  measureMakinoScaraInvariants,
  readMakinoScaraControls,
  stepMakinoScaraTopology,
} from "@/physics/makinoScaraKernel";
import { makinoScaraFloorForViewport, makinoScaraViewForViewport } from "./makinoScaraCamera";
import {
  buildMakinoScaraModel,
  MAKINO_SCARA_BASE_BOTTOM_LOCAL_Y,
  MAKINO_SCARA_MODEL_FLOOR_Y,
  MAKINO_SCARA_MODEL_ROOT_Y,
} from "./makinoScaraModel";

const THREE_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals", "three");

function projectedPhonePlinthBounds(viewportWidth: number, viewportHeight: number) {
  const cameraView = makinoScaraViewForViewport("overview", viewportWidth);
  const floorPlan = makinoScaraFloorForViewport(viewportWidth);
  const camera = new THREE.PerspectiveCamera(42, viewportWidth / viewportHeight, 0.1, 100);
  camera.position.fromArray(cameraView.position);
  camera.lookAt(...cameraView.target);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);

  const projected = Array.from({ length: 128 }, (_, index) => {
    const angle = (index / 128) * Math.PI * 2;
    return new THREE.Vector3(
      floorPlan.centerX + Math.cos(angle) * floorPlan.radius,
      MAKINO_SCARA_MODEL_FLOOR_Y,
      Math.sin(angle) * floorPlan.radius,
    ).project(camera);
  });
  return {
    minX: Math.min(...projected.map((point) => point.x)),
    maxX: Math.max(...projected.map((point) => point.x)),
    minY: Math.min(...projected.map((point) => point.y)),
    maxY: Math.max(...projected.map((point) => point.y)),
  };
}

describe("US 4,341,502 Makino Assembly Robot visual boundary", () => {
  test("centers and enlarges the complete four-bar closure in the narrow-phone overview", () => {
    const distanceFromTarget = (camera: {
      position: readonly number[];
      target: readonly number[];
    }) =>
      Math.hypot(
        camera.position[0] - camera.target[0],
        camera.position[1] - camera.target[1],
        camera.position[2] - camera.target[2],
      );
    const phone = makinoScaraViewForViewport("overview", 228);
    const tablet = makinoScaraViewForViewport("overview", 644);

    expect(phone).toEqual({
      position: [3.4, -1.8, 4.8],
      target: [0.75, -3.65, 0],
    });
    expect(distanceFromTarget(phone)).toBeGreaterThan(distanceFromTarget(tablet));

    const model = buildMakinoScaraModel();
    try {
      model.updatePose(
        stepMakinoScaraTopology({
          firstLinkAngleDeg: 32,
          fourthLinkAngleDeg: -38,
          topologyVariant: 1,
        }),
      );
      model.root.updateMatrixWorld(true);
      const closure = new THREE.Box3();
      for (const name of [
        "Motor 1 and shaft 3",
        "Motor 2 and shaft 3a",
        "First link 4",
        "Fourth link 5",
        "Second link 6",
        "Third link 7",
        "First vertical pivot shaft 8",
        "Third vertical pivot shaft 8",
        "Second vertical axis and assembly tool joint 8",
        "Assembly tool 9",
      ]) {
        const part = model.root.getObjectByName(name);
        expect(part).toBeInstanceOf(THREE.Object3D);
        closure.union(new THREE.Box3().setFromObject(part as THREE.Object3D));
      }
      const camera = new THREE.PerspectiveCamera(42, 286 / 420, 0.1, 100);
      camera.position.fromArray(phone.position);
      camera.lookAt(...phone.target);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld(true);
      const projected: THREE.Vector3[] = [];
      for (const x of [closure.min.x, closure.max.x]) {
        for (const y of [closure.min.y, closure.max.y]) {
          for (const z of [closure.min.z, closure.max.z]) {
            projected.push(new THREE.Vector3(x, y, z).project(camera));
          }
        }
      }
      const horizontal = projected.map((point) => point.x);
      expect(Math.min(...horizontal)).toBeGreaterThanOrEqual(-0.96);
      expect(Math.max(...horizontal)).toBeLessThanOrEqual(0.95);
      expect(Math.max(...horizontal) - Math.min(...horizontal)).toBeGreaterThan(1.7);
    } finally {
      model.dispose();
    }
  });

  test("keeps the finite presentation plinth inside actual 320 px and 375 px phone canvases", () => {
    expect(makinoScaraFloorForViewport(644)).toEqual({ radius: 2.8, centerX: 0 });

    for (const [viewportWidth, viewportHeight] of [
      [286, 420],
      [341, 420],
    ]) {
      const frame = projectedPhonePlinthBounds(viewportWidth, viewportHeight);
      expect(frame.minX).toBeGreaterThan(-0.94);
      expect(frame.maxX).toBeLessThan(0.94);
      expect(frame.minY).toBeGreaterThan(-0.9);
      expect(frame.maxY).toBeLessThan(0.4);
    }
  });

  test("uses a deterministic, source-bounded topology kernel rather than invented dynamics", () => {
    const controls = readMakinoScaraControls({
      firstLinkAngleDeg: 32,
      fourthLinkAngleDeg: -38,
      toolAttitudeDeg: 15,
      topologyVariant: 1,
    });
    const first = stepMakinoScaraTopology(controls);
    const replay = stepMakinoScaraTopology(controls);

    expect(first).toEqual(replay);
    expect(first.topology).toBe("claim-1-concentric");
    expect(first.independentClaim).toBe(1);
    expect(first.refusal.refused).toBe(true);
    expect(first.refusal.reason).toContain("does not state link lengths");
    expect(first.refusal.reason).toContain(MAKINO_FRANKENSIM_OWNER);
    expect(first.refusal.reason).toContain("articulated-body lane is a tree");
    expect(MAKINO_FRANKENSIM_BOUNDARY).toContain("closed-chain SI dynamics refused");
    expect(first.positionLaw).toContain("normalized exhibit coordinates only");
    expect(stepMakinoScaraTopology({ topologyVariant: 2 }).independentClaim).toBe(3);
    expect(stepMakinoScaraTopology({ topologyVariant: 3 }).independentClaim).toBe(6);
    expect(stepMakinoScaraTopology({ topologyVariant: 3 }).yLinkHub).not.toBeNull();
    expect(first.beltTransmissionAvailable).toBe(true);
    expect(stepMakinoScaraTopology({ topologyVariant: 3 }).beltTransmissionAvailable).toBe(false);
    expect(first.firstBase).toEqual(first.fourthBase);
    const subtract = (
      end: readonly [number, number],
      start: readonly [number, number],
    ): readonly [number, number] => [end[0] - start[0], end[1] - start[1]];
    const secondVector = subtract(first.tool, first.firstOuterJoint);
    const fourthVector = subtract(first.fourthOuterJoint, first.fourthBase);
    const thirdVector = subtract(first.tool, first.fourthOuterJoint);
    const firstVector = subtract(first.firstOuterJoint, first.firstBase);
    for (let axis = 0; axis < 2; axis += 1) {
      expect(secondVector[axis]).toBeCloseTo(fourthVector[axis], 12);
      expect(thirdVector[axis]).toBeCloseTo(firstVector[axis], 12);
    }
    expect(first.positionLaw).toContain("exact normalized parallelogram closure");
    expect(first.toolJoints[0]).toEqual(first.toolJoints[1]);
    expect(stepMakinoScaraTopology({ topologyVariant: 2 }).firstBase).not.toEqual(
      stepMakinoScaraTopology({ topologyVariant: 2 }).fourthBase,
    );
  });

  test("keeps every offset and Y-link member rigid instead of averaging loose endpoints", () => {
    const vector = (
      end: readonly [number, number],
      start: readonly [number, number],
    ): readonly [number, number] => [end[0] - start[0], end[1] - start[1]];
    const length = (value: readonly [number, number]) => Math.hypot(value[0], value[1]);
    const expectVector = (
      actual: readonly [number, number],
      expected: readonly [number, number],
    ) => {
      expect(actual[0]).toBeCloseTo(expected[0], 12);
      expect(actual[1]).toBeCloseTo(expected[1], 12);
    };

    for (const [firstLinkAngleDeg, fourthLinkAngleDeg] of [
      [-180, 180],
      [-70, 115],
      [0, 0],
      [32, -38],
      [180, -180],
    ] as const) {
      const offset = stepMakinoScaraTopology({
        topologyVariant: 2,
        firstLinkAngleDeg,
        fourthLinkAngleDeg,
      });
      expect(offset.toolJoints[0]).toEqual(offset.toolJoints[1]);
      expect(length(vector(offset.tool, offset.firstOuterJoint))).toBeCloseTo(
        MAKINO_EXHIBIT_OFFSET_FOLLOWER_LENGTH,
        12,
      );
      expect(length(vector(offset.tool, offset.fourthOuterJoint))).toBeCloseTo(
        MAKINO_EXHIBIT_OFFSET_FOLLOWER_LENGTH,
        12,
      );
      expect(offset.positionLaw).toContain("fixed-link circle-intersection closure");
      expect(measureMakinoScaraInvariants(offset).fixedMemberError).toBeLessThan(1e-12);
    }

    const yLink = stepMakinoScaraTopology({
      topologyVariant: 3,
      firstLinkAngleDeg: 41,
      fourthLinkAngleDeg: -23,
      toolAttitudeDeg: 87,
    });
    const [toolLeft, toolRight] = yLink.toolJoints;
    expect(yLink.yLinkHub).not.toBeNull();
    const hub = yLink.yLinkHub as readonly [number, number];
    expect(length(vector(toolRight, toolLeft))).toBeCloseTo(MAKINO_EXHIBIT_BASE_SPAN, 12);
    expect(length(vector(toolLeft, yLink.firstOuterJoint))).toBeCloseTo(
      MAKINO_EXHIBIT_LINK_LENGTH,
      12,
    );
    expect(length(vector(toolRight, yLink.fourthOuterJoint))).toBeCloseTo(
      MAKINO_EXHIBIT_LINK_LENGTH,
      12,
    );
    expectVector(vector(hub, yLink.firstOuterJoint), vector(yLink.fourthBase, yLink.firstBase));
    expectVector(vector(hub, yLink.fourthBase), vector(yLink.firstOuterJoint, yLink.firstBase));
    expectVector(vector(toolRight, hub), vector(yLink.fourthOuterJoint, yLink.fourthBase));
    expect(yLink.toolAttitudeRad).toBe(0);
    expect(measureMakinoScaraInvariants(yLink).fixedMemberError).toBeLessThan(1e-12);
  });

  test("uses the shared Claim 1 inversion to select the offset comparison topology", () => {
    const inverted = applySharedClaimConstraintModifications("us-4341502-makino-scara", {
      topologyVariant: 1,
      claim1ConstraintActive: 0,
    });
    expect(inverted.modifiedParams.topologyVariant).toBe(2);
    expect(stepMakinoScaraTopology(inverted.modifiedParams).topology).toBe("claim-3-offset");
    expect(inverted.activeFailures).toHaveLength(1);
  });

  test("builds a procedural four-link model and makes the claim-six Y link observable", () => {
    const model = buildMakinoScaraModel();
    const yLink = model.root.getObjectByName("Claim 6 Y-shaped link mechanism 14");
    const beltPath = model.root.getObjectByName("Claims 2 and 5 connected belt transmission");
    const tool = model.root.getObjectByName("Assembly tool 9");

    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.root.getObjectByName("First link 4")).toBeDefined();
    expect(model.root.getObjectByName("Fourth link 5")).toBeDefined();
    expect(tool).toBeDefined();
    expect(yLink).toBeDefined();
    expect(beltPath).toBeDefined();

    model.updatePose(stepMakinoScaraTopology({ topologyVariant: 1, toolAttitudeDeg: 28 }));
    expect(yLink?.visible).toBe(false);
    expect(beltPath?.visible).toBe(true);
    expect(tool?.rotation.y).toBeCloseTo((-28 * Math.PI) / 180, 8);
    model.updatePose(stepMakinoScaraTopology({ topologyVariant: 3, toolAttitudeDeg: 28 }));
    expect(yLink?.visible).toBe(true);
    expect(beltPath?.visible).toBe(false);
    expect(tool?.rotation.y).toBeCloseTo(0, 12);
    expect(model.root.getObjectByName("Rigid two-pivot assembly tool 13")?.visible).toBe(true);
    expect(model.root.getObjectByName("Assembly tool second pivot (Claim 6)")?.visible).toBe(true);
    model.dispose();
  });

  test("forms a continuous floor-to-base-to-shaft-to-link-to-tool load path in every topology", () => {
    const model = buildMakinoScaraModel();
    try {
      const object = (name: string) => {
        const found = model.root.getObjectByName(name);
        expect(found).toBeInstanceOf(THREE.Object3D);
        return found as THREE.Object3D;
      };
      const bounds = (name: string) => new THREE.Box3().setFromObject(object(name));

      model.updatePose(stepMakinoScaraTopology({ topologyVariant: 1 }));
      model.root.updateMatrixWorld(true);
      const motorOne = bounds("Motor 1 and shaft 3");
      const motorTwo = bounds("Motor 2 and shaft 3a");
      expect(motorOne.max.y).toBeCloseTo(motorTwo.min.y, 7);
      expect(object("Motor 1 and shaft 3").position.x).toBeCloseTo(
        object("Motor 2 and shaft 3a").position.x,
        8,
      );
      expect(object("Motor 1 and shaft 3").position.z).toBeCloseTo(
        object("Motor 2 and shaft 3a").position.z,
        8,
      );
      expect(bounds("Base 15 floor foot").min.y).toBeCloseTo(MAKINO_SCARA_MODEL_FLOOR_Y, 8);
      expect(MAKINO_SCARA_MODEL_ROOT_Y + MAKINO_SCARA_BASE_BOTTOM_LOCAL_Y).toBeCloseTo(
        MAKINO_SCARA_MODEL_FLOOR_Y,
        12,
      );
      expect(bounds("Base 15 floor foot").intersectsBox(bounds("Base 15 motor pedestal"))).toBe(
        true,
      );
      expect(bounds("Base 15 motor pedestal").intersectsBox(motorOne)).toBe(true);
      expect(bounds("Vertical output shaft 3").intersectsBox(bounds("First link 4"))).toBe(true);
      expect(bounds("Vertical output shaft 3a").intersectsBox(bounds("Fourth link 5"))).toBe(true);
      expect(
        bounds("Second vertical axis and assembly tool joint 8").intersectsBox(
          bounds("Second link 6"),
        ),
      ).toBe(true);
      expect(
        bounds("Second vertical axis and assembly tool joint 8").intersectsBox(
          bounds("Third link 7"),
        ),
      ).toBe(true);

      model.updatePose(stepMakinoScaraTopology({ topologyVariant: 2 }));
      model.root.updateMatrixWorld(true);
      expect(bounds("Motor 1 and shaft 3").min.y).toBeCloseTo(
        bounds("Motor 2 and shaft 3a").min.y,
        8,
      );
      expect(
        object("Motor 2 and shaft 3a").position.x - object("Motor 1 and shaft 3").position.x,
      ).toBeCloseTo(MAKINO_EXHIBIT_BASE_SPAN, 8);
      expect(bounds("Base 15 motor pedestal").intersectsBox(bounds("Motor 2 and shaft 3a"))).toBe(
        true,
      );
      expect(bounds("Vertical output shaft 3a").intersectsBox(bounds("Motor 2 and shaft 3a"))).toBe(
        true,
      );
      expect(bounds("Vertical output shaft 3a").intersectsBox(bounds("Fourth link 5"))).toBe(true);
    } finally {
      model.dispose();
    }
  });

  test("connects motor 10 through both belt runs to the tool axis for claims 2 and 5", () => {
    const model = buildMakinoScaraModel();
    try {
      model.updatePose(stepMakinoScaraTopology({ topologyVariant: 2, toolAttitudeDeg: 67 }));
      model.root.updateMatrixWorld(true);
      const bounds = (name: string) => {
        const found = model.root.getObjectByName(name);
        expect(found).toBeInstanceOf(THREE.Object3D);
        return new THREE.Box3().setFromObject(found as THREE.Object3D);
      };
      expect(bounds("Third motor 10").intersectsBox(bounds("Motor 1 and shaft 3"))).toBe(true);
      expect(bounds("Motor 10 pulley shaft").intersectsBox(bounds("Third motor 10"))).toBe(true);
      expect(
        bounds("Motor 10 pulley shaft").intersectsBox(bounds("First belt-supporting member")),
      ).toBe(true);
      expect(
        bounds("First belt 11 outward run").intersectsBox(bounds("First belt-supporting member")),
      ).toBe(true);
      expect(
        bounds("First belt 11 outward run").intersectsBox(bounds("Second belt-supporting member")),
      ).toBe(true);
      expect(
        bounds("Second belt 12 outward run").intersectsBox(bounds("Second belt-supporting member")),
      ).toBe(true);
      expect(
        bounds("Second belt 12 outward run").intersectsBox(bounds("Third belt-supporting member")),
      ).toBe(true);
      expect(
        bounds("Second-axis belt support shaft").intersectsBox(
          bounds("Second vertical axis and assembly tool joint 8"),
        ),
      ).toBe(true);
      expect(model.root.getObjectByName("Assembly tool 9")?.rotation.y).toBeCloseTo(
        (-67 * Math.PI) / 180,
        8,
      );
    } finally {
      model.dispose();
    }
  });

  test("keeps both visual faces procedural, shared-bus connected, and honest about the refusal", () => {
    const modelSource = readFileSync(join(THREE_DIRECTORY, "makinoScaraModel.ts"), "utf8");
    const studioSource = readFileSync(join(THREE_DIRECTORY, "MakinoScara3D.tsx"), "utf8");
    const simSource = readFileSync(
      join(process.cwd(), "src", "components", "patents", "visuals", "MakinoScaraSim.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).not.toContain("Math.random");
    expect(studioSource).toContain("usePatentPhysics");
    expect(studioSource).toContain("effectiveParams");
    expect(studioSource).toContain("claimConstraintStateParamId");
    expect(studioSource).not.toContain("useState<Record<number, boolean>>");
    expect(studioSource).toContain("useFrankenSimPhysics");
    expect(studioSource).toContain("isRefused: true");
    expect(studioSource).toContain('aria-label="Tool attitude"');
    expect(studioSource).toContain('data-testid="makino-scara-three"');
    expect(studioSource).toContain("MAKINO_FRANKENSIM_OWNER");
    expect(modelSource).toContain("Claims 2 and 5 connected belt transmission");
    expect(studioSource).not.toContain("Math.random");
    expect(studioSource).not.toContain("performance.now()");
    expect(simSource).toContain("usePatentPhysics");
    expect(simSource).toContain("effectiveParams");
    expect(simSource).toContain("claimConstraintStateParamId");
    expect(simSource).not.toContain("useState<Record<number, boolean>>");
    expect(simSource).toContain('data-makino-coaxial-base="true"');
    expect(simSource).toContain('data-makino-rigid-tool-13="true"');
    expect(simSource).toContain('disabled={pose.topology === "claim-6-y-link"}');
    expect(simSource).toContain("normalized exhibit geometry");
  });

  test("keeps the phone canvas clear by placing controls after it", () => {
    const studioSource = readFileSync(join(THREE_DIRECTORY, "MakinoScara3D.tsx"), "utf8");
    const canvasIndex = studioSource.indexOf("ref={containerRef}");
    const controlsIndex = studioSource.indexOf('data-mobile-layout="controls-below-canvas"');

    expect(canvasIndex).toBeGreaterThan(-1);
    expect(controlsIndex).toBeGreaterThan(canvasIndex);
    expect(studioSource).toContain("hidden items-start justify-between");
    expect(studioSource).toContain("makinoScaraViewForViewport");
    expect(studioSource).toContain("lg:flex");
  });
});
