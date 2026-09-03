import { describe, expect, test } from "bun:test";
import * as THREE from "three";
import { buildKwolekKevlarModel } from "./kwolekKevlarModel";
import { buildRenoEscalatorModel } from "./renoEscalatorModel";
import { buildSholesTypewriterModel } from "./sholesTypewriterModel";
import { buildWrightFlyerAirframe } from "./wrightFlyerAirframe";

function modelComplexity(root: THREE.Object3D) {
  let renderUnits = 0;
  let representedParts = 0;
  let triangles = 0;
  root.traverse((candidate) => {
    if (!(candidate instanceof THREE.Mesh)) return;
    const instanceCount = candidate instanceof THREE.InstancedMesh ? candidate.count : 1;
    const primitiveTriangleCount =
      (candidate.geometry.index?.count ?? candidate.geometry.getAttribute("position").count) / 3;
    renderUnits += 1;
    representedParts += instanceCount;
    triangles += primitiveTriangleCount * instanceCount;
  });
  return { renderUnits, representedParts, triangles };
}

describe("production Three.js draw-unit budgets", () => {
  test("keeps the four previously over-budget models below the structural draw-unit ceiling", () => {
    const wright = buildWrightFlyerAirframe();
    const reno = buildRenoEscalatorModel();
    const sholes = buildSholesTypewriterModel();
    const kevlar = buildKwolekKevlarModel();

    const complexity = {
      wright: modelComplexity(wright.group),
      reno: modelComplexity(reno.root),
      sholes: modelComplexity(sholes.rootGroup),
      kevlar: modelComplexity(kevlar.root),
    };

    // At <=120 render units, the shared studio's one visible pass plus its
    // selective shadow pass has enough headroom under the production E2E
    // ceiling of 250 renderer calls.
    for (const result of Object.values(complexity)) {
      expect(result.renderUnits).toBeLessThanOrEqual(120);
    }

    // Consolidation must not be confused with deleting explanatory detail.
    // These floors lock the underlying geometry/instance content that makes
    // each mechanism legible at its close-up camera presets.
    expect(complexity.wright.triangles).toBeGreaterThan(35_000);
    expect(complexity.reno.triangles).toBeGreaterThan(7_000);
    expect(complexity.sholes.representedParts).toBeGreaterThan(240);
    expect(complexity.sholes.triangles).toBeGreaterThan(23_000);
    expect(complexity.kevlar.representedParts).toBeGreaterThan(150);
    expect(complexity.kevlar.triangles).toBeGreaterThan(27_000);

    reno.dispose();
    sholes.dispose();
    kevlar.dispose();
    for (const texture of wright.textures) texture.dispose();
  });
});
