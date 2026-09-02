import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { lemelsonAutomaticWarehousingPatent } from "@/data/patents/lemelson-automatic-warehousing";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";
import {
  lemelsonAutomaticWarehousingArchivalEdition,
  lemelsonAutomaticWarehousingParallelReadings,
} from "./lemelsonAutomaticWarehousingEdition";

describe("US 3,119,501 manual source edition", () => {
  test("pins the reviewed eight-page facsimile and all printed claims", () => {
    expect(
      validateCuratedSpecificationEdition(lemelsonAutomaticWarehousingArchivalEdition),
    ).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(
      `${process.cwd()}/public${lemelsonAutomaticWarehousingPatent.originalPdfUrl}`,
    );
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      lemelsonAutomaticWarehousingArchivalEdition.sourcePdfSha256,
    );
    expect(lemelsonAutomaticWarehousingPatent.claims.map((item) => item.number)).toEqual([
      1, 2, 3, 4, 5, 6,
    ]);
    expect(lemelsonAutomaticWarehousingPatent.stats).toMatchObject({
      totalClaims: 6,
      independentClaims: 5,
    });
  });

  test("reads every legal claim from the manual edition", () => {
    const editionClaims = claims(lemelsonAutomaticWarehousingArchivalEdition);
    expect(lemelsonAutomaticWarehousingPatent.claims.map((item) => item.originalText)).toEqual(
      editionClaims.map((item) => item.inlines.map((inline) => inline.text).join("")),
    );
    expect(
      lemelsonAutomaticWarehousingPatent.claims.map(
        (item) => item.plainEnglish.split(/\s+/).length > 30,
      ),
    ).toEqual([true, true, true, true, true, true]);
    expect(lemelsonAutomaticWarehousingPatent.claims[5]?.dependsOn).toEqual([2]);
  });

  test("binds source crops, term notes, readings, and ledger anchors", () => {
    const inlines = lemelsonAutomaticWarehousingArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block ? block.inlines : block.kind === "figure-sheet" ? block.description : [],
    );
    const figures = inlines.filter((inline) => inline.kind === "reference");
    expect(figures).not.toHaveLength(0);
    for (const reference of figures) {
      for (const preview of reference.figurePreviews ?? []) {
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }
    const terms = inlines.filter(
      (inline): inline is Extract<(typeof inlines)[number], { kind: "term" }> =>
        inline.kind === "term",
    );
    expect(terms.map((item) => item.text)).toEqual([
      "photo-electric scanner",
      "limit switch scanning means",
      "predetermining controller or counter-relay",
    ]);
    expect(terms.every((item) => item.definition.length > 80)).toBe(true);
    const paragraphIndexes = lemelsonAutomaticWarehousingArchivalEdition.blocks.flatMap(
      (block, index) => (block.kind === "paragraph" ? [index] : []),
    );
    expect(
      Object.keys(lemelsonAutomaticWarehousingParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(paragraphIndexes);
    for (const index of paragraphIndexes) {
      expect(lemelsonAutomaticWarehousingParallelReadings[index]?.join(" ").length).toBeGreaterThan(
        40,
      );
    }
    const asset = lemelsonAutomaticWarehousingPatent.originalTextAsset;
    if (!asset) throw new Error("Lemelson reviewed ledger is missing.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 8)).toEqual({ valid: true });
    expect(validateReviewedTranscriptionPageAnchors(ledger, 8, asset.pageAnchors ?? [])).toEqual({
      valid: true,
    });
    for (const block of lemelsonAutomaticWarehousingArchivalEdition.blocks) {
      if (block.kind !== "paragraph" && block.kind !== "claim") continue;
      expect(ledger).toContain(block.inlines.map((inline) => inline.text).join(""));
    }
  });

  test("provides valid provenance classifications for all Lemelson automatic warehousing controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-3119501-lemelson-automatic-warehousing"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("registers explicit energy channel omission reason for Lemelson automatic warehousing", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(
      ENERGY_CHANNEL_OMISSION_REASONS["us-3119501-lemelson-automatic-warehousing"],
    ).toBeDefined();
    expect(energyChannelsFor("us-3119501-lemelson-automatic-warehousing", {})).toEqual([]);
  });
});

function claims(edition: typeof lemelsonAutomaticWarehousingArchivalEdition) {
  return edition.blocks.filter(
    (block): block is Extract<(typeof edition.blocks)[number], { kind: "claim" }> =>
      block.kind === "claim",
  );
}
