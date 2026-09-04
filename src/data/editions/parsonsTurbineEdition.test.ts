import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { evaluateArchivalPublicationState } from "@/data/editions/publicationApproval";
import { parsonsTurbinePatent } from "@/data/patents/parsons-turbine";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  parsonsTurbineArchivalEdition,
  parsonsTurbineParallelReadings,
} from "./parsonsTurbineEdition";

const joinInlines = (inlines: readonly { text: string }[]) =>
  inlines.map((inline) => inline.text).join("");
const normalize = (value: string) => value.replace(/\s+/g, " ").trim();

describe("US 608,969 manual source edition", () => {
  test("pins the seven-page Marine Steam-Turbine facsimile and source identity", () => {
    expect(parsonsTurbinePatent.archivalEdition).toBe(parsonsTurbineArchivalEdition);
    expect(parsonsTurbinePatent.title).toBe("Marine Steam-Turbine");
    expect(parsonsTurbinePatent.filingDate).toBe("1898-03-04");
    expect(parsonsTurbineArchivalEdition.sourcePdfSha256).toBe(
      "fafd0884e61225ee7f93d0a88c81229cbbb4984e48869c204af58cb6af64b991",
    );
    expect(validateCuratedSpecificationEdition(parsonsTurbineArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${parsonsTurbinePatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      parsonsTurbineArchivalEdition.sourcePdfSha256,
    );
  });

  test("keeps all three printed claims exact and source-bound", () => {
    const authoredClaims = parsonsTurbineArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof parsonsTurbineArchivalEdition.blocks)[number],
        { kind: "claim" }
      > => block.kind === "claim",
    );
    expect(authoredClaims.map((claim) => claim.number)).toEqual([1, 2, 3]);
    expect(parsonsTurbinePatent.claims.map((claim) => claim.originalText)).toEqual(
      authoredClaims.map((claim) => joinInlines(claim.inlines)),
    );
    expect(parsonsTurbinePatent.claims.every((claim) => claim.isIndependent)).toBe(true);
    expect(parsonsTurbinePatent.stats).toEqual({ totalClaims: 3, independentClaims: 3 });
    for (const claim of parsonsTurbinePatent.claims) {
      expect(claim.plainEnglish.split(/\s+/).length).toBeGreaterThan(25);
    }
  });

  test("uses complete, exact source sheets for every authored drawing reference", () => {
    const references = parsonsTurbineArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    const sources = new Set<string>();
    for (const reference of references) {
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toStartWith("/patents/figures/us-608969-parsons-turbine/");
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
        expect(preview).toMatchObject({ width: 2320, height: 3408 });
        expect(preview.alt).toContain("Complete unmodified source drawing sheet");
        sources.add(preview.src);
      }
    }
    expect([...sources].sort()).toEqual([
      "/patents/figures/us-608969-parsons-turbine/source-sheet-1-v1.png",
      "/patents/figures/us-608969-parsons-turbine/source-sheet-2-v1.png",
      "/patents/figures/us-608969-parsons-turbine/source-sheet-3-v1.png",
    ]);

    for (const legacyCrop of [
      "fig-1-source-crop-v1.png",
      "fig-2-source-crop-v1.png",
      "fig-3-source-crop-v1.png",
    ]) {
      expect(
        existsSync(
          resolve(process.cwd(), "public/patents/figures/us-608969-parsons-turbine", legacyCrop),
        ),
      ).toBe(true);
    }
  });

  test("makes the selected historical vacuum condition an authored annotation", () => {
    const terms = parsonsTurbineArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "term" }> =>
              inline.kind === "term",
          )
        : [],
    );
    expect(terms.map((item) => item.text)).toEqual(["vacuum"]);
    expect(terms[0]?.definition.length).toBeGreaterThan(80);
  });

  test("pairs every prose block with a source-bounded companion", () => {
    const paragraphIndexes = parsonsTurbineArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(parsonsTurbineParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(paragraphIndexes);
    for (const index of paragraphIndexes) {
      expect(parsonsTurbineParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(40);
    }
  });

  test("keeps all published prose and claims inside the reviewed seven-page ledger", () => {
    const asset = parsonsTurbinePatent.originalTextAsset;
    expect(asset).toMatchObject({
      url: "/patents/transcripts/us-608969-parsons-turbine-reviewed.txt",
      pageCount: 7,
      kind: "reviewed-transcription",
      sourcePdfSha256: parsonsTurbineArchivalEdition.sourcePdfSha256,
    });
    if (!asset) throw new Error("Parsons reviewed transcription asset is missing.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 7)).toEqual({ valid: true });
    for (const block of parsonsTurbineArchivalEdition.blocks) {
      if (block.kind === "paragraph" || block.kind === "claim") {
        expect(normalize(ledger)).toContain(normalize(joinInlines(block.inlines)));
      }
    }
    expect(JSON.stringify(parsonsTurbineArchivalEdition)).not.toContain("SOURCE PDF PAGE");
    expect(JSON.stringify(parsonsTurbineArchivalEdition)).not.toContain("source-pdf-text-layer");
  });

  test("provides valid provenance classifications for all Parsons controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-608969-parsons-turbine"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({ routing: 0, reversing: 0, throttle: 1 });
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("registers explicit energy channel omission reason for US 608,969", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-608969-parsons-turbine"]).toBeDefined();
    expect(energyChannelsFor("us-608969-parsons-turbine", {})).toEqual([]);
  });

  test("accepts all seven source citations against full-sheet source-pixel evidence", () => {
    const decision = evaluateArchivalPublicationState(parsonsTurbinePatent);
    expect(decision.isPublished).toBe(true);
    expect(decision.reasonCode).toBe("ACCEPTED");
    expect(decision.figureManifest).toMatchObject({
      requiredFigureCount: 7,
      acceptedFigureCount: 7,
    });
    expect(decision.figureManifest.figures.every((figure) => figure.status === "accepted")).toBe(
      true,
    );
  });
});
