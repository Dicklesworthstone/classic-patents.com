import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { energyChannelsFor } from "@/physics/energyChannels";
import {
  NOYCE_PLANAR_LEAD_DEFAULT_CONTROLS,
  stepNoycePlanarLeadTopology,
} from "@/physics/noycePlanarLeadKernel";
import { specClausesFor } from "@/physics/specClauses";
import { buildNoyceSourceLeadModel } from "./noyceSourceLeadModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 2,981,877 Noyce Planar IC visual simulation", () => {
  test("routes Noyce IC to its 3D WebGL simulator and 2D vector simulator", () => {
    const dispatcherSource = readFileSync(join(VISUALS_DIRECTORY, "index.tsx"), "utf8");
    expect(dispatcherSource).toContain('case "us-2981877-noyce-ic":');
    expect(dispatcherSource).toContain("NoycePlanarIC3D");
    expect(dispatcherSource).toContain("NoycePlanarICSim");
  });

  test("routes the 3D face to the source-shaped Figure 1/2 model", () => {
    const dispatcherSource = readFileSync(join(VISUALS_DIRECTORY, "index.tsx"), "utf8");
    expect(dispatcherSource).toContain('import("./three/NoyceSourceLead3D")');

    const componentSource = readFileSync(
      join(VISUALS_DIRECTORY, "three/NoyceSourceLead3D.tsx"),
      "utf8",
    );
    expect(componentSource).toContain("buildNoyceSourceLeadModel");
    expect(componentSource).toContain("stepNoycePlanarLeadTopology");
    expect(componentSource).toContain(
      "propagation delay, maximum frequency, and power are therefore refused",
    );
    for (const retiredDisplay of [
      "computeNoyceDepletionField",
      "clockFrequencyMhz",
      "propDelayNs",
      "wire bond",
      "lead frame",
    ]) {
      expect(componentSource).not.toContain(retiredDisplay);
    }
  });

  test("keeps every Figure 1/2 organ supported, embedded, or electrically attached", () => {
    const model = buildNoyceSourceLeadModel();
    model.update(stepNoycePlanarLeadTopology(NOYCE_PLANAR_LEAD_DEFAULT_CONTROLS), false);
    model.root.updateMatrixWorld(true);

    const names: string[] = [];
    model.root.traverse((part) => names.push(part.name.toLowerCase()));
    for (const anachronism of ["dip package", "lead frame", "wire bond", "clock pulse"]) {
      expect(names.some((name) => name.includes(anachronism))).toBe(false);
    }

    const bounds = (part: THREE.Object3D) => new THREE.Box3().setFromObject(part);
    expect(bounds(model.emitterLead).intersectsBox(bounds(model.emitterContact))).toBe(true);
    expect(bounds(model.baseLead).intersectsBox(bounds(model.baseContact))).toBe(true);
    expect(bounds(model.backsideContact).intersectsBox(bounds(model.semiconductorBody))).toBe(true);
    for (const embeddedRegion of [model.collectorRegion, model.baseRegion, model.emitterRegion]) {
      expect(bounds(model.semiconductorBody).containsBox(bounds(embeddedRegion))).toBe(true);
    }

    const foundation = model.root.getObjectByName(
      "museum foundation supporting semiconductor body",
    );
    expect(foundation).toBeDefined();
    expect(bounds(foundation as THREE.Object3D).intersectsBox(bounds(model.backsideContact))).toBe(
      true,
    );
    model.dispose();
  });

  test("makes Claim 1 inversion visible without fabricating electrical performance", () => {
    const model = buildNoyceSourceLeadModel();
    const held = stepNoycePlanarLeadTopology(NOYCE_PLANAR_LEAD_DEFAULT_CONTROLS);
    model.update(held, false);
    const bridgeSupport = model.root.getObjectByName("oxide bridge beneath emitter lead 7");
    expect(bridgeSupport?.visible).toBe(true);
    expect(model.emitterLead.visible).toBe(true);

    const withheld = stepNoycePlanarLeadTopology({ claim1OxideBridgePresent: 0 });
    model.update(withheld, false);
    expect(bridgeSupport?.visible).toBe(false);
    expect(model.emitterLead.visible).toBe(true);
    expect(withheld.quantitativeElectricalPerformanceAvailable).toBe(false);
    expect(energyChannelsFor("us-2981877-noyce-ic", {})).toEqual([]);
    expect(specClausesFor("us-2981877-noyce-ic", { claim1OxideBridgePresent: 0 })[0]).toMatchObject(
      {
        active: false,
        tone: "broken",
      },
    );
    model.dispose();
  });
});
