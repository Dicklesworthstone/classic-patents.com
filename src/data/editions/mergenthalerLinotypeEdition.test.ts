import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { mergenthalerLinotypePatent } from "../patents/mergenthaler-linotype";
import {
  mergenthalerLinotypeArchivalEdition,
  mergenthalerLinotypeClaims,
  mergenthalerLinotypeParallelReadings,
} from "./mergenthalerLinotypeEdition";

const publicFile = (url: string) => join(process.cwd(), "public", url.replace(/^\//, ""));

describe("US 313,224 Mergenthaler Linotype staged archival edition", () => {
  test("keeps the p1–17 drawing/crop boundary fail-closed", () => {
    expect(mergenthalerLinotypePatent.archivalEdition).toBeUndefined();
    expect(mergenthalerLinotypePatent.originalTextAsset).toBeDefined();
    expect(mergenthalerLinotypePatent.originalTextAsset?.kind).toBe("source-pdf-text-layer");
  });

  test("pins the 35-page facsimile but keeps the unaccepted staged edition invalid", () => {
    expect(mergenthalerLinotypePatent.archivalEdition).toBeUndefined();
    expect(mergenthalerLinotypeArchivalEdition.completeFacsimileReviewed).toBe(false);
    expect(validateCuratedSpecificationEdition(mergenthalerLinotypeArchivalEdition)).toEqual({
      valid: false,
      errors: ["The archival edition must attest that the complete facsimile was reviewed."],
    });
    const pdf = readFileSync(publicFile(mergenthalerLinotypePatent.originalPdfUrl));
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      mergenthalerLinotypeArchivalEdition.sourcePdfSha256,
    );
    if (mergenthalerLinotypePatent.originalTextAsset?.kind === "reviewed-transcription")
      expect(mergenthalerLinotypePatent.originalTextAsset).toMatchObject({
        kind: "reviewed-transcription",
        pageCount: 35,
        url: "/patents/transcripts/us-313224-mergenthaler-linotype-reviewed.txt",
      });
  });

  test("uses all 70 exact printed claims", () => {
    expect(mergenthalerLinotypePatent.claims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 70 }, (_, index) => index + 1),
    );
    expect(mergenthalerLinotypePatent.claims.every((claim) => claim.isIndependent)).toBe(true);
    expect(mergenthalerLinotypeClaims).toHaveLength(70);
    expect(mergenthalerLinotypePatent.stats).toMatchObject({
      totalClaims: 70,
      independentClaims: 70,
    });
    for (const claim of mergenthalerLinotypeClaims) {
      const block = mergenthalerLinotypeArchivalEdition.blocks.find(
        (candidate) => candidate.kind === "claim" && candidate.number === claim.number,
      );
      expect(block?.kind).toBe("claim");
      if (block?.kind === "claim") {
        expect(claim.originalText).toBe(block.inlines.map((inline) => inline.text).join(""));
      }
    }
  });

  test("pairs every prose paragraph with an authored parallel reading", () => {
    const explainableBlocks = mergenthalerLinotypeArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(mergenthalerLinotypeParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(explainableBlocks);
    for (const index of explainableBlocks) {
      expect(mergenthalerLinotypeParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(
        30,
      );
    }
  });

  test("makes source drawing sheets available as local crops", () => {
    const references = mergenthalerLinotypeArchivalEdition.blocks.flatMap((block) =>
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
        expect(preview.src).toStartWith("/patents/figures/us-313224-mergenthaler-linotype/");
        expect(existsSync(publicFile(preview.src))).toBe(true);
      }
    }
  });

  test("keeps any reviewed-ledger binding conditional on future source acceptance", () => {
    expect(mergenthalerLinotypePatent.archivalEdition).toBeUndefined();
    if (mergenthalerLinotypePatent.originalTextAsset?.kind === "reviewed-transcription") {
      const asset = mergenthalerLinotypePatent.originalTextAsset;
      const ledger = readFileSync(publicFile(asset.url), "utf8");
      expect(validateReviewedTranscription(ledger, 35)).toEqual({ valid: true });
    }
  });
});
