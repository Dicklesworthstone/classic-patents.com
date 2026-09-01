import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { readMakinoScaraControls, stepMakinoScaraTopology } from "@/physics/makinoScaraKernel";
import { buildMakinoScaraModel } from "./makinoScaraModel";

const THREE_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals", "three");

describe("US 4,341,502 Makino Assembly Robot visual boundary", () => {
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
    expect(first.positionLaw).toContain("normalized exhibit coordinates only");
    expect(stepMakinoScaraTopology({ topologyVariant: 2 }).independentClaim).toBe(3);
    expect(stepMakinoScaraTopology({ topologyVariant: 3 }).independentClaim).toBe(6);
    expect(stepMakinoScaraTopology({ topologyVariant: 3 }).yLinkHub).not.toBeNull();
  });

  test("builds a procedural four-link model and makes the claim-six Y link observable", () => {
    const model = buildMakinoScaraModel();
    const yLink = model.root.getObjectByName("Claim 6 Y-shaped link mechanism 14");
    const tool = model.root.getObjectByName("Assembly tool 9");

    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.root.getObjectByName("First link 4")).toBeDefined();
    expect(model.root.getObjectByName("Fourth link 5")).toBeDefined();
    expect(tool).toBeDefined();
    expect(yLink).toBeDefined();

    model.updatePose(stepMakinoScaraTopology({ topologyVariant: 1 }));
    expect(yLink?.visible).toBe(false);
    model.updatePose(stepMakinoScaraTopology({ topologyVariant: 3, toolAttitudeDeg: 28 }));
    expect(yLink?.visible).toBe(true);
    expect(tool?.rotation.y).toBeCloseTo((-28 * Math.PI) / 180, 8);
    model.dispose();
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
    expect(studioSource).toContain("useFrankenSimPhysics");
    expect(studioSource).toContain("isRefused: true");
    expect(studioSource).not.toContain("Math.random");
    expect(studioSource).not.toContain("performance.now()");
    expect(simSource).toContain("usePatentPhysics");
    expect(simSource).toContain("normalized exhibit geometry");
  });
});
