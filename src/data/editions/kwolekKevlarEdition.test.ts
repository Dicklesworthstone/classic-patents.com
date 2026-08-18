import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { kwolekKevlarPatent } from "@/data/patents/kwolek-kevlar";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  kwolekKevlarArchivalEdition,
  kwolekKevlarClaims,
  kwolekKevlarParallelReadings,
} from "./kwolekKevlarEdition";

describe("US 3,671,542 Stephanie Kwolek Kevlar manual archival edition", () => {
  test("pins the complete 58-page facsimile and its two printed claims", () => {
    expect(kwolekKevlarPatent.archivalEdition).toBe(kwolekKevlarArchivalEdition);
    expect(validateCuratedSpecificationEdition(kwolekKevlarArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(kwolekKevlarArchivalEdition.sourcePdfSha256).toBe(
      "7a2b753cf8d6f329d5fad750dc2de510f723876cac6aa41a4076f0343a7a62c4",
    );
    const pdf = readFileSync(`${process.cwd()}/public${kwolekKevlarPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      kwolekKevlarArchivalEdition.sourcePdfSha256,
    );
    expect(kwolekKevlarPatent.claims.map((claim) => claim.number)).toEqual([1, 2]);
    expect(kwolekKevlarClaims).toHaveLength(2);
    expect(kwolekKevlarPatent.stats).toMatchObject({
      totalClaims: 2,
      independentClaims: 1,
    });
  });

  test("makes all nine source drawing sheets available as local crops", () => {
    const references = kwolekKevlarArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline) => inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    expect(references.length).toBeGreaterThan(0);
    for (const reference of references) {
      if (reference.kind !== "reference" || reference.referenceType !== "figure") continue;
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toStartWith("/patents/figures/us-3671542-kwolek-kevlar/");
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }
  });

  test("pairs every prose paragraph with an authored parallel reading", () => {
    const explainableBlocks = kwolekKevlarArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(kwolekKevlarParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(explainableBlocks);
    for (const index of explainableBlocks) {
      expect(kwolekKevlarParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(30);
    }
  });

  test("publishes a reviewed ledger and validates source text", () => {
    const asset = kwolekKevlarPatent.originalTextAsset;
    expect(asset).toMatchObject({
      url: "/patents/transcripts/us-3671542-kwolek-kevlar-reviewed.txt",
      pageCount: 58,
      kind: "reviewed-transcription",
      sourcePdfSha256: kwolekKevlarArchivalEdition.sourcePdfSha256,
    });
    if (!asset) throw new Error("Kwolek Kevlar reviewed transcript asset is missing.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 58)).toEqual({ valid: true });
  });
});
