import { describe, expect, test } from "bun:test";
import {
  applySharedClaimConstraintModifications,
  CATALOG_CLAIM_CONSTRAINTS,
} from "./claimConstraints";
import { wasmSurfaceForPatent } from "./coverageManifest";
import { readCrumpFdmControls, stepCrumpFdmSi } from "./crumpFdmKernel";
import { ENERGY_CHANNEL_OMISSION_REASONS, energyChannelsFor } from "./energyChannels";
import { specClausesFor } from "./specClauses";

const PATENT_ID = "us-5121329-crump-fdm";

describe("Crump FDM claim, source, physics, and runtime integration", () => {
  test("defines separate source-faithful probes for Claims 1, 2, and 39", () => {
    const definitions = CATALOG_CLAIM_CONSTRAINTS[PATENT_ID];
    expect(definitions.map((definition) => definition.claimNumber)).toEqual([1, 2, 39]);
    expect(definitions[0].claimTitle).toContain("Relative X/Y/Z Motion");
    expect(definitions[0].activeDescription).not.toMatch(/heated|heating/i);
    expect(definitions[1].claimTitle).toContain("Heating Means");
    expect(definitions[2].invertedDescription).toContain("No unsupported strength");
    expect(JSON.stringify(definitions)).not.toMatch(/severe delamination|cold jam/i);
  });

  test("shared claim parameters modify topology predicates without corrupting raw controls", () => {
    const raw = {
      nozzleTempC: 235,
      layerHeightMm: 0.25,
      claim1ConstraintActive: 1,
      claim2ConstraintActive: 0,
      claim39ConstraintActive: 1,
    };
    const result = applySharedClaimConstraintModifications(PATENT_ID, raw);
    expect(result.modifiedParams.nozzleTempC).toBe(235);
    expect(result.modifiedParams.layerHeightMm).toBe(0.25);
    expect(result.modifiedParams.claim1ApparatusEnabled).toBe(1);
    expect(result.modifiedParams.claim2HeatingEnabled).toBe(0);
    expect(result.modifiedParams.claim39PlanarNozzleEnabled).toBe(1);

    const state = stepCrumpFdmSi(readCrumpFdmControls(result.modifiedParams));
    expect(state.claim1ApparatusPresent).toBe(true);
    expect(state.claim2HeatingMeansPresent).toBe(false);
    expect(state.claim39PlanarGapPresent).toBe(true);
    expect(state.isExtruding).toBe(false);
  });

  test("weaves the exact Figure 5 and claim phrases into bounded state predicates", () => {
    const clauses = specClausesFor(PATENT_ID, {});
    expect(clauses.map((clause) => clause.phrase)).toEqual([
      "a plurality of drive rollers 134 are provided within supply chamber 118",
      "heating means disposed in close proximity to said flow passage means",
      "planar bottom surface of said tip being maintained substantially parallel to said first layer",
      "successive layers of said material of predetermined thickness which build up on each other sequentially as they solidify",
    ]);
    expect(clauses.every((clause) => clause.active)).toBe(true);
    expect(clauses.at(-1)?.caption).toContain("does not calculate bond strength");
    expect(clauses.at(-1)?.caption).not.toMatch(/\b\d+(?:\.\d+)?\s*(?:MPa|psi)\b/);
  });

  test("ships a typed generic-WASM surface and omits fabricated energy channels", () => {
    const surface = wasmSurfaceForPatent(PATENT_ID);
    expect(surface?.kind).toBe("generic-wasm");
    expect(surface?.sourceCrate).toBe("fs-crump-wasm");
    expect(surface?.exportName).toBe("crump_fdm_step");
    expect(surface?.refusalBoundary).toBe("typed-wasm");

    expect(energyChannelsFor(PATENT_ID, {})).toEqual([]);
    expect(ENERGY_CHANNEL_OMISSION_REASONS[PATENT_ID]).toContain("no heater voltage");
    expect(ENERGY_CHANNEL_OMISSION_REASONS[PATENT_ID]).toContain("mass flow");
  });
});
