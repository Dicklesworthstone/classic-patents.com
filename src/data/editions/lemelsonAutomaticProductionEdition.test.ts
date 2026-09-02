import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { lemelsonAutomaticProductionPatent } from "@/data/patents/lemelson-automatic-production";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";
import {
  lemelsonAutomaticProductionArchivalEdition,
  lemelsonAutomaticProductionParallelReadings,
} from "./lemelsonAutomaticProductionEdition";

describe("US 3,313,014 manual source edition", () => {
  test("pins the reviewed 15-page facsimile and all 21 printed claims", () => {
    expect(validateCuratedSpecificationEdition(lemelsonAutomaticProductionArchivalEdition)).toEqual(
      { valid: true, errors: [] },
    );
    const pdf = readFileSync(
      `${process.cwd()}/public${lemelsonAutomaticProductionPatent.originalPdfUrl}`,
    );
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      lemelsonAutomaticProductionArchivalEdition.sourcePdfSha256,
    );
    expect(lemelsonAutomaticProductionPatent.claims.map((item) => item.number)).toEqual(
      Array.from({ length: 21 }, (_, index) => index + 1),
    );
    expect(lemelsonAutomaticProductionPatent.stats).toMatchObject({
      totalClaims: 21,
      independentClaims: 13,
    });
  });

  test("reads every legal claim dynamically from the manual edition", () => {
    const editionClaims = claims(lemelsonAutomaticProductionArchivalEdition);
    expect(lemelsonAutomaticProductionPatent.claims.map((item) => item.originalText)).toEqual(
      editionClaims.map((item) => item.inlines.map((inline) => inline.text).join("")),
    );
    expect(
      lemelsonAutomaticProductionPatent.claims.every(
        (item) => item.plainEnglish.split(/\s+/).length > 30,
      ),
    ).toBe(true);
    expect(lemelsonAutomaticProductionPatent.claims[2]?.dependsOn).toEqual([2]);
    expect(lemelsonAutomaticProductionPatent.claims[19]?.dependsOn).toEqual([19]);
  });

  test("binds drawing crops, term notes, readings, and every ledger anchor", () => {
    const inlines = lemelsonAutomaticProductionArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block ? block.inlines : block.kind === "figure-sheet" ? block.description : [],
    );
    const references = inlines.filter((inline) => inline.kind === "reference");
    expect(references.length).toBeGreaterThanOrEqual(15);
    for (const reference of references) {
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      for (const preview of reference.figurePreviews ?? []) {
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }
    const terms = inlines.filter(
      (inline): inline is Extract<(typeof inlines)[number], { kind: "term" }> =>
        inline.kind === "term",
    );
    expect(terms.map((term) => term.text)).toEqual([
      "work-in-process",
      "prepositioning",
      "multi-circuit timer",
    ]);
    expect(terms.every((term) => term.definition.length > 80)).toBe(true);

    const paragraphIndexes = lemelsonAutomaticProductionArchivalEdition.blocks.flatMap(
      (block, index) => (block.kind === "paragraph" ? [index] : []),
    );
    expect(
      Object.keys(lemelsonAutomaticProductionParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(paragraphIndexes);
    for (const index of paragraphIndexes) {
      expect(lemelsonAutomaticProductionParallelReadings[index]?.join(" ").length).toBeGreaterThan(
        40,
      );
    }

    const asset = lemelsonAutomaticProductionPatent.originalTextAsset;
    if (!asset) throw new Error("Lemelson automatic-production reviewed ledger is missing.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 15)).toEqual({ valid: true });
    expect(validateReviewedTranscriptionPageAnchors(ledger, 15, asset.pageAnchors ?? [])).toEqual({
      valid: true,
    });
    for (const block of lemelsonAutomaticProductionArchivalEdition.blocks) {
      if (block.kind !== "paragraph" && block.kind !== "claim") continue;
      expect(ledger).toContain(block.inlines.map((inline) => inline.text).join(""));
    }
  });

  test("keeps the historical record free of an unsupported patent-war narrative", () => {
    expect(lemelsonAutomaticProductionPatent.historicalContext.patentWars).toEqual([]);
  });

  test("provides valid provenance classifications for all Automatic Production controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-3313014-lemelson-automatic-production"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("wires claim 1 and claim 7 constraints in claimConstraints", () => {
    const { applyClaimConstraintModifications } = require("@/physics/claimConstraints");
    const r1 = applyClaimConstraintModifications(
      "us-3313014-lemelson-automatic-production",
      {},
      { 1: false, 7: true },
    );
    expect(r1.modifiedParams.markerSensed).toBe(0);
    expect(r1.refusalWarning).toContain("STATION SENSING COLLAPSE");

    const r7 = applyClaimConstraintModifications(
      "us-3313014-lemelson-automatic-production",
      {},
      { 1: true, 7: false },
    );
    expect(r7.modifiedParams.contactsEngaged).toBe(0);
    expect(r7.refusalWarning).toContain("PORTABLE CONTROLLER DISCONNECTED");
  });
});

function claims(edition: typeof lemelsonAutomaticProductionArchivalEdition) {
  return edition.blocks.filter(
    (block): block is Extract<(typeof edition.blocks)[number], { kind: "claim" }> =>
      block.kind === "claim",
  );
}
