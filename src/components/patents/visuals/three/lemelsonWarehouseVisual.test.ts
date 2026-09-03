import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type * as THREE from "three";
import { stepLemelsonWarehouseTopology } from "@/physics/lemelsonWarehouseKernel";
import { buildLemelsonWarehouseModel } from "./lemelsonWarehouseModel";

describe("US 3,119,501 automatic warehousing visual", () => {
  test("uses one deterministic normalized carrier sequence", () => {
    const first = stepLemelsonWarehouseTopology({
      railAddressFraction: 0.4,
      levelAddressFraction: 0.5,
      shuttleExtensionFraction: 0.3,
      automaticAddressing: 1,
    });
    expect(
      stepLemelsonWarehouseTopology({
        railAddressFraction: 0.4,
        levelAddressFraction: 0.5,
        shuttleExtensionFraction: 0.3,
        automaticAddressing: 1,
      }),
    ).toEqual(first);
    expect(first.addressState).toBe("bay transfer");
    expect(first.activeClaim).toBe(2);
    expect(first.refusal.refused).toBe(true);
  });

  test("builds and updates a procedural Three.js model without external assets", () => {
    const model = buildLemelsonWarehouseModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    const pose = stepLemelsonWarehouseTopology({
      railAddressFraction: 1,
      levelAddressFraction: 1,
      shuttleExtensionFraction: 1,
    });
    expect(() => model.updatePose(pose)).not.toThrow();
    const carrier = model.root.getObjectByName("self-propelled carrier, elevator, and shuttle");
    const scanner = model.root.getObjectByName("photoelectric / marker scanning relay display");
    const lift = model.root.getObjectByName("vertically movable carrier platform");
    const shuttle = model.root.getObjectByName("connected transverse shuttle beam");
    const fixture = model.root.getObjectByName("laterally extending article fixture");
    expect(scanner?.parent).toBe(carrier);
    expect(shuttle?.parent).toBe(lift);
    expect(fixture?.parent).toBe(lift);
    expect((shuttle as THREE.Mesh).scale.z).toBeGreaterThan(0);
    expect(
      (fixture?.position.z ?? 0) -
        ((shuttle?.position.z ?? 0) + (shuttle as THREE.Mesh).scale.z / 2),
    ).toBeCloseTo(0, 8);
    expect(carrier?.position.x).toBeCloseTo(2.2, 8);
    expect(model.root.getObjectByName("storage bay 1-3")?.position.x).toBeCloseTo(2.2, 8);
    expect(() => model.dispose()).not.toThrow();
  });

  test("routes the historical schematic through the same normalized pose", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/InteractiveDiagramViewer.tsx"),
      "utf8",
    );
    expect(source).toContain("stepLemelsonWarehouseTopology(params ?? {})");
    expect(source).not.toContain("params?.targetBayX");
    expect(source).not.toContain("params?.targetShelfZ");
    expect(source).not.toContain("Relay: Pulses OK");
  });

  test("mounts mode-stable claim probes and visible source-bound failures on both faces", () => {
    const simSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/LemelsonAutomaticWarehousingSim.tsx"),
      "utf8",
    );
    const studioSource = readFileSync(
      join(
        process.cwd(),
        "src/components/patents/visuals/three/LemelsonAutomaticWarehousing3D.tsx",
      ),
      "utf8",
    );

    for (const source of [simSource, studioSource]) {
      expect(source).toContain("ClaimConstraintToggle");
      expect(source).toContain("claimConstraintStateParamId");
      expect(source).toContain("effectiveParams");
      expect(source).toContain('role="status"');
    }
    expect(studioSource).toContain("useLiveSimParams(effectiveParams)");
    expect(studioSource).not.toContain("liveParams.current = effectiveParams");
    expect(studioSource).toContain("claimConstraintResult.refusalWarning");
    expect(studioSource).toContain('data-mobile-layout="controls-below-canvas"');
    expect(studioSource).toContain("min-h-[430px] sm:min-h-[540px]");
    expect(studioSource).toContain('view === "overview" ? 1.45 : 1.25');
  });
});
