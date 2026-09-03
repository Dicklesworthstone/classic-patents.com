import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { PATENT_PHYSICS_REGISTRY } from "@/physics/telemetryData";
import {
  readWatsonRemoteCenterComplianceControls,
  stepWatsonRemoteCenterComplianceTopology,
} from "@/physics/watsonRemoteCenterComplianceKernel";
import { buildWatsonRemoteCenterComplianceModel } from "./watsonRemoteCenterComplianceModel";

describe("US 4,098,001 remote-center compliance visual", () => {
  test("uses a deterministic source-bounded topology pose rather than invented SI performance", () => {
    const controls = readWatsonRemoteCenterComplianceControls({
      lateralContactFraction: 0.7,
      axisMismatchFraction: 0.5,
      remoteCenterTopology: 1,
      antiTwistConstraint: 1,
    });
    const first = stepWatsonRemoteCenterComplianceTopology(controls);
    const second = stepWatsonRemoteCenterComplianceTopology(controls);
    expect(first).toEqual(second);
    expect(first.remoteCenterTopology).toBe(true);
    expect(first.activeClaim).toBe(2);
    expect(first.translationOffset).toBeGreaterThan(0);
    expect(first.refusal.refused).toBe(true);
    expect(first.refusal.reason).toContain("no dimensions");
  });

  test("makes claim 1 visibly change the remote-center projection", () => {
    const remote = stepWatsonRemoteCenterComplianceTopology({ remoteCenterTopology: 1 });
    const local = stepWatsonRemoteCenterComplianceTopology({ remoteCenterTopology: 0 });
    expect(remote.remoteCenterProjection).toBe(1);
    expect(local.remoteCenterProjection).toBe(0);
    expect(remote.translationOffset).toBeGreaterThan(local.translationOffset);
    expect(local.activeClaim).toBeNull();
    expect(local.antiTwistConstraint).toBe(false);
  });

  test("keeps every physical flexure tethered between members while virtual radii remain guides", () => {
    const model = buildWatsonRemoteCenterComplianceModel();
    model.updatePose(stepWatsonRemoteCenterComplianceTopology({}));
    model.root.updateMatrixWorld(true);

    const ring = model.root.getObjectByName("intermediate ring 22");
    const plate = model.root.getObjectByName("plate 20 and rod 16");
    const remoteCenter = model.root.getObjectByName("remote center 50");
    const toolTip = model.root.getObjectByName("rod 16 free end 52");
    const radialFlexures = [24, 26, 28].map((number) =>
      model.root.getObjectByName(`rotational flexure ${number}`),
    );
    const virtualGuides = [24, 26, 28].map((number) =>
      model.root.getObjectByName(`virtual radius through rotational flexure ${number}`),
    );

    expect(model.root.children.length).toBeGreaterThan(0);
    expect(ring?.position.x).toBeCloseTo(plate?.position.x ?? Number.NaN, 8);
    expect(radialFlexures.every((item) => item instanceof THREE.Mesh)).toBe(true);
    expect(radialFlexures.every((item) => (item?.scale.y ?? 99) < 1.2)).toBe(true);
    expect(virtualGuides.every((item) => item instanceof THREE.Line)).toBe(true);
    expect(
      remoteCenter
        ?.getWorldPosition(new THREE.Vector3())
        .distanceTo(
          toolTip?.getWorldPosition(new THREE.Vector3()) ?? new THREE.Vector3(99, 99, 99),
        ),
    ).toBeLessThan(0.001);
    expect(() => model.dispose()).not.toThrow();
  });

  test("grounds an open workpiece hole and moves the rod into its reachable mouth", () => {
    const model = buildWatsonRemoteCenterComplianceModel();
    try {
      const hole = model.root.getObjectByName("fixed open chamfered hole 71");
      const workpieceBase = model.root.getObjectByName("fixed workpiece support for hole 71");
      const toolTip = model.root.getObjectByName("rod 16 free end 52");
      expect(hole).toBeInstanceOf(THREE.Mesh);
      expect(workpieceBase).toBeInstanceOf(THREE.Mesh);
      expect(toolTip).toBeInstanceOf(THREE.Mesh);
      if (!(hole instanceof THREE.Mesh) || !(toolTip instanceof THREE.Mesh)) {
        throw new Error("Watson tool/hole geometry is missing.");
      }
      expect((hole.geometry as THREE.CylinderGeometry).parameters.openEnded).toBe(true);

      const holeCenter = hole.getWorldPosition(new THREE.Vector3());
      const radialGap = () => {
        model.root.updateMatrixWorld(true);
        const tip = toolTip.getWorldPosition(new THREE.Vector3());
        return Math.hypot(tip.x - holeCenter.x, tip.z - holeCenter.z);
      };
      model.updatePose(
        stepWatsonRemoteCenterComplianceTopology({
          lateralContactFraction: 0,
          axisMismatchFraction: 0.5,
        }),
      );
      const initialGap = radialGap();
      model.updatePose(
        stepWatsonRemoteCenterComplianceTopology({
          lateralContactFraction: 1,
          axisMismatchFraction: 0.5,
        }),
      );
      const seatedGap = radialGap();
      expect(seatedGap).toBeLessThan(initialGap);
      expect(seatedGap).toBeLessThan(0.35);
      expect(hole.getWorldPosition(new THREE.Vector3())).toEqual(holeCenter);
      expect(
        new THREE.Box3()
          .setFromObject(hole)
          .intersectsBox(new THREE.Box3().setFromObject(workpieceBase as THREE.Object3D)),
      ).toBe(true);
    } finally {
      model.dispose();
    }
  });

  test("publishes normalized controls and an explicit SI refusal on every shared surface", () => {
    const registry = PATENT_PHYSICS_REGISTRY["us-4098001-watson-rcc"];
    expect(registry.controls.map((control) => control.id)).toEqual([
      "lateralContactFraction",
      "axisMismatchFraction",
      "remoteCenterTopology",
      "antiTwistConstraint",
    ]);
    expect(registry.computeMetrics({}).some((metric) => metric.value === "REFUSED")).toBe(true);
    expect(registry.governingEquation).not.toContain("C_{xx}");

    const equations = ALL_COLORIZED_EQUATIONS["us-4098001-watson-rcc"];
    expect(equations).toHaveLength(1);
    expect(JSON.stringify(equations)).not.toMatch(/0\.40|0\.022|25\\,?\\mu|12\\text/);
    expect(equations[0].pedagogicalNote).toContain("deliberately refused");
  });

  test("routes authored drawing sheets through the same remote-center pose", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/InteractiveDiagramViewer.tsx"),
      "utf8",
    );
    expect(source).toContain('"watson-remote-center-compliance": true');
    expect(source).toContain("stepWatsonRemoteCenterComplianceTopology(params ?? {})");
    expect(source).toContain("remote center 50");
  });

  test("reserves a usable portrait model viewport above scrollable controls", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/patents/visuals/three/WatsonRemoteCenterCompliance3D.tsx",
      ),
      "utf8",
    );
    expect(source).toContain("min-h-[740px] sm:min-h-[540px]");
    expect(source).toContain("bottom-[350px] sm:inset-0");
    expect(source).toContain("max-h-[340px]");
    expect(source).toContain('view === "overview" ? 1.4 : 1.22');
  });
});
