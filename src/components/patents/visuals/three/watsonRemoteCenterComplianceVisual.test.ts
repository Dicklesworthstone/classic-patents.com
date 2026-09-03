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
import {
  buildWatsonRemoteCenterComplianceModel,
  deriveWatsonRemoteCenterExhibitGeometry,
} from "./watsonRemoteCenterComplianceModel";

function meshEndpoints(mesh: THREE.Mesh): [THREE.Vector3, THREE.Vector3] {
  mesh.updateMatrixWorld(true);
  const center = mesh.getWorldPosition(new THREE.Vector3());
  const axis = new THREE.Vector3(0, 1, 0).applyQuaternion(
    mesh.getWorldQuaternion(new THREE.Quaternion()),
  );
  const halfLength = mesh.getWorldScale(new THREE.Vector3()).y / 2;
  return [
    center.clone().addScaledVector(axis, -halfLength),
    center.clone().addScaledVector(axis, halfLength),
  ];
}

function flexureTermini(group: THREE.Group): THREE.Vector3[] {
  return group.children.flatMap((child) =>
    child instanceof THREE.Mesh ? meshEndpoints(child) : [],
  );
}

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
    expect(first.refusal.reason).toContain("fs-solid::Rod");
  });

  test("orders Figure 4 translation before Figure 5 remote-center rotation", () => {
    const start = stepWatsonRemoteCenterComplianceTopology({
      lateralContactFraction: 0,
      axisMismatchFraction: 0.8,
    });
    const translation = stepWatsonRemoteCenterComplianceTopology({
      lateralContactFraction: 0.25,
      axisMismatchFraction: 0.8,
    });
    const contact = stepWatsonRemoteCenterComplianceTopology({
      lateralContactFraction: 0.5,
      axisMismatchFraction: 0.8,
    });
    const rotation = stepWatsonRemoteCenterComplianceTopology({
      lateralContactFraction: 0.75,
      axisMismatchFraction: 0.8,
    });
    const aligned = stepWatsonRemoteCenterComplianceTopology({
      lateralContactFraction: 1,
      axisMismatchFraction: 0.8,
    });

    expect([start.translationPhase, start.rotationPhase]).toEqual([0, 0]);
    expect([translation.translationPhase, translation.rotationPhase]).toEqual([0.5, 0]);
    expect([contact.translationPhase, contact.rotationPhase]).toEqual([1, 0]);
    expect([rotation.translationPhase, rotation.rotationPhase]).toEqual([1, 0.5]);
    expect([aligned.translationPhase, aligned.rotationPhase]).toEqual([1, 1]);
    expect(start.remainingAxisMismatch).toBe(0.8);
    expect(contact.remainingAxisMismatch).toBe(0.8);
    expect(rotation.remainingAxisMismatch).toBeCloseTo(0.4, 12);
    expect(aligned.remainingAxisMismatch).toBe(0);
  });

  test("makes Claim 1's remote pivot preserve contact while a local wrist sweeps the tip", () => {
    const controls = { lateralContactFraction: 0.72, axisMismatchFraction: 0.7 };
    const remote = stepWatsonRemoteCenterComplianceTopology({
      ...controls,
      remoteCenterTopology: 1,
    });
    const local = stepWatsonRemoteCenterComplianceTopology({
      ...controls,
      remoteCenterTopology: 0,
    });
    const remoteGeometry = deriveWatsonRemoteCenterExhibitGeometry(remote);
    const localGeometry = deriveWatsonRemoteCenterExhibitGeometry(local);
    expect(remote.remoteCenterProjection).toBe(1);
    expect(local.remoteCenterProjection).toBe(0);
    expect(remote.translationPhase).toBe(local.translationPhase);
    expect(remoteGeometry.tipContactGap).toBeLessThan(1e-12);
    expect(remoteGeometry.remoteCenterToTipGap).toBeLessThan(1e-12);
    expect(localGeometry.tipContactGap).toBeGreaterThan(0.1);
    expect(localGeometry.remoteCenterToTipGap).toBeCloseTo(1.91, 12);
    expect(local.activeClaim).toBeNull();
    expect(local.antiTwistConstraint).toBe(false);
  });

  test("connects both necked flexure sets through the exact Claim 1 member chain", () => {
    const model = buildWatsonRemoteCenterComplianceModel();
    try {
      model.updatePose(stepWatsonRemoteCenterComplianceTopology({}));
      model.root.updateMatrixWorld(true);

      const fixedLip = model.root.getObjectByName("fixed machine lip 54");
      const ring = model.root.getObjectByName("intermediate ring 22");
      const plateGroup = model.root.getObjectByName("second member plate 20 and operator rod 16");
      const plate = model.root.getObjectByName("operator plate 20");
      const rod = model.root.getObjectByName("operator rod 16");
      expect(fixedLip).toBeInstanceOf(THREE.Mesh);
      expect(ring).toBeInstanceOf(THREE.Group);
      expect(plateGroup).toBeInstanceOf(THREE.Group);
      expect(plate).toBeInstanceOf(THREE.Mesh);
      expect(rod?.parent).toBe(plateGroup);
      if (!fixedLip || !ring || !plate) throw new Error("Watson member chain is incomplete.");

      const lipBounds = new THREE.Box3().setFromObject(fixedLip).expandByScalar(0.035);
      const ringBounds = new THREE.Box3().setFromObject(ring).expandByScalar(0.035);
      const plateBounds = new THREE.Box3().setFromObject(plate).expandByScalar(0.035);
      for (const number of [56, 58, 60]) {
        const flexure = model.root.getObjectByName(`translational flexure ${number}`);
        expect(flexure).toBeInstanceOf(THREE.Group);
        if (!(flexure instanceof THREE.Group)) throw new Error(`Missing flexure ${number}.`);
        expect(flexure.children).toHaveLength(3);
        const termini = flexureTermini(flexure);
        expect(termini.some((point) => lipBounds.containsPoint(point))).toBe(true);
        expect(termini.some((point) => ringBounds.containsPoint(point))).toBe(true);
      }
      for (const number of [24, 26, 28]) {
        const flexure = model.root.getObjectByName(`rotational flexure ${number}`);
        const guide = model.root.getObjectByName(
          `virtual radius through rotational flexure ${number}`,
        );
        expect(flexure).toBeInstanceOf(THREE.Group);
        expect(guide).toBeInstanceOf(THREE.Line);
        if (!(flexure instanceof THREE.Group)) throw new Error(`Missing flexure ${number}.`);
        expect(flexure.children).toHaveLength(3);
        const termini = flexureTermini(flexure);
        expect(termini.some((point) => ringBounds.containsPoint(point))).toBe(true);
        expect(termini.some((point) => plateBounds.containsPoint(point))).toBe(true);
      }
    } finally {
      expect(() => model.dispose()).not.toThrow();
    }
  });

  test("connects Claim 2's bellows between fixed machine 18 and the moving plate", () => {
    const model = buildWatsonRemoteCenterComplianceModel();
    try {
      model.updatePose(stepWatsonRemoteCenterComplianceTopology({ antiTwistConstraint: 1 }));
      model.root.updateMatrixWorld(true);
      const topCap = model.root.getObjectByName("fixed machine portion 18 top cap");
      const plate = model.root.getObjectByName("operator plate 20");
      const bellows = model.root.getObjectByName(
        "bellows 90 and support wire 94, claim 2 torque-resistant means",
      );
      const sleeve = model.root.getObjectByName("bellows 90 flexible casing 92");
      expect(bellows?.visible).toBe(true);
      expect(bellows?.children.filter((child) => child.name.includes("convolution"))).toHaveLength(
        7,
      );
      expect(sleeve).toBeInstanceOf(THREE.Mesh);
      if (!(sleeve instanceof THREE.Mesh) || !topCap || !plate) {
        throw new Error("Watson bellows attachment path is incomplete.");
      }
      const endpoints = meshEndpoints(sleeve);
      const topBounds = new THREE.Box3().setFromObject(topCap).expandByScalar(0.04);
      const plateBounds = new THREE.Box3().setFromObject(plate).expandByScalar(0.04);
      expect(endpoints.some((point) => topBounds.containsPoint(point))).toBe(true);
      expect(endpoints.some((point) => plateBounds.containsPoint(point))).toBe(true);

      model.updatePose(stepWatsonRemoteCenterComplianceTopology({ antiTwistConstraint: 0 }));
      expect(bellows?.visible).toBe(false);
    } finally {
      model.dispose();
    }
  });

  test("keeps workpiece 73 fixed while free end 52 reaches the genuinely open chamfer", () => {
    const model = buildWatsonRemoteCenterComplianceModel();
    try {
      const hole = model.root.getObjectByName("fixed open chamfered hole 71 and chamfer 75");
      const workpiece = model.root.getObjectByName("fixed workpiece 73 with through-hole 71");
      const toolTip = model.root.getObjectByName("rod 16 contact point at free end 52");
      expect(hole).toBeInstanceOf(THREE.Mesh);
      expect(workpiece).toBeInstanceOf(THREE.Group);
      expect(toolTip).toBeInstanceOf(THREE.Object3D);
      if (!(hole instanceof THREE.Mesh) || !workpiece || !toolTip) {
        throw new Error("Watson tool/hole geometry is missing.");
      }
      expect((hole.geometry as THREE.CylinderGeometry).parameters.openEnded).toBe(true);
      expect(
        workpiece.children.filter((child) => child.name.startsWith("workpiece 73 ")),
      ).toHaveLength(4);
      const workpiecePosition = workpiece.position.clone();
      const contactGap = () => {
        model.root.updateMatrixWorld(true);
        const tip = toolTip.getWorldPosition(new THREE.Vector3());
        const mouth = new THREE.Vector3(workpiece.position.x, -1.79, workpiece.position.z);
        return tip.distanceTo(mouth);
      };
      model.updatePose(
        stepWatsonRemoteCenterComplianceTopology({
          lateralContactFraction: 0,
          axisMismatchFraction: 0.5,
        }),
      );
      const initialGap = contactGap();
      model.updatePose(
        stepWatsonRemoteCenterComplianceTopology({
          lateralContactFraction: 1,
          axisMismatchFraction: 0.5,
        }),
      );
      const seatedGap = contactGap();
      expect(seatedGap).toBeLessThan(initialGap);
      expect(seatedGap).toBeLessThan(1e-12);
      expect(workpiece.position).toEqual(workpiecePosition);
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
    expect(registry.engineMethod).toContain("fs-solid::Rod");
    expect(registry.engineMethod).toContain("no WASM/SI solve");

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

  test("keeps tablet controls below, not over, the RCC model canvas", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/patents/visuals/three/WatsonRemoteCenterCompliance3D.tsx",
      ),
      "utf8",
    );
    expect(source).toContain("min-h-[740px] sm:min-h-0 lg:grid lg:min-h-[540px]");
    expect(source).toContain("relative h-[390px] sm:h-[540px] lg:col-start-1 lg:row-start-1");
    expect(source).toContain('ref={containerRef} className="absolute inset-0"');
    expect(source).toContain("max-h-[340px]");
    expect(source).toContain('data-testid="watson-rcc-controls"');
    // At tablet widths, the 540 px canvas is a complete visual surface and
    // all live controls follow it in normal flow. Desktop reuses the compact
    // overlay grid cell; portrait retains its explicitly reserved lower space.
    expect(source).toContain("sm:static sm:mx-5 sm:my-5 sm:max-h-none");
    expect(source).toContain(
      "lg:col-start-1 lg:row-start-1 lg:z-10 lg:mx-5 lg:my-0 lg:mb-5 lg:self-end",
    );
    expect(source).not.toContain("sm:inset-0");
    expect(source).toContain('view === "overview" ? 1.4 : 1.22');
    expect(source).toContain('data-testid="watson-rcc-three"');
    expect(source).toContain("data-tip-contact-gap");
    expect(source).toContain("data-remote-center-tip-gap");
    expect(source).toContain("fs-solid::Rod");
  });
});
