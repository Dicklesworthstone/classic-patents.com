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
    expect(mergenthalerLinotypePatent.originalTextAsset?.kind).toBe("reviewed-transcription");
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

  test("keeps 70 staged claim nodes internally synchronized without asserting facsimile acceptance", () => {
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

  test("records the known figure-preview deficit and validates every attached crop", () => {
    const references = mergenthalerLinotypeArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline) => inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    const referencesWithPreviews = references.filter(
      (reference) =>
        reference.kind === "reference" &&
        reference.referenceType === "figure" &&
        (reference.figurePreviews?.length ?? 0) > 0,
    );
    const uniquePreviewPaths = new Set(
      referencesWithPreviews.flatMap((reference) =>
        reference.kind === "reference"
          ? (reference.figurePreviews ?? []).map((preview) => preview.src)
          : [],
      ),
    );
    expect(references).toHaveLength(36);
    expect(referencesWithPreviews).toHaveLength(9);
    expect(references.length - referencesWithPreviews.length).toBe(27);
    expect(uniquePreviewPaths.size).toBe(3);
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

  test("records the actual seventeen drawing-sheet headers without invented shared descriptions", () => {
    const ledger = readFileSync(
      publicFile("/patents/transcripts/us-313224-mergenthaler-linotype-reviewed.txt"),
      "utf8",
    );
    for (let page = 1; page <= 17; page++) {
      expect(ledger).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${page} OF 35 ---`);
      expect(ledger).toContain(`17 Sheets—Sheet ${page}.`);
    }
    expect(ledger).not.toContain("13 Sheets-Sheet");
    expect(ledger).not.toContain("Drawing Sheet 1 of 13 illustrating");
    expect(ledger).not.toContain("Application filed February 12, 1884");
  });

  test("uses the directly reviewed opening rather than the later-machine staging copy", () => {
    const masthead = mergenthalerLinotypeArchivalEdition.blocks[0];
    const opening = mergenthalerLinotypeArchivalEdition.blocks[2];
    expect(masthead).toMatchObject({
      kind: "masthead",
      lines: expect.arrayContaining([
        "Application filed August 30, 1884. (No model.)",
        "OTTMAR MERGENTHALER, OF BALTIMORE, MARYLAND, ASSIGNOR TO THE NATIONAL TYPOGRAPHIC COMPANY, OF WEST VIRGINIA",
      ]),
    });
    expect(opening).toMatchObject({
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: expect.stringContaining("To all whom it may concern"),
        },
      ],
    });
    const stagedText = JSON.stringify(mergenthalerLinotypeArchivalEdition.blocks.slice(0, 11));
    expect(stagedText).not.toContain("Application filed February 12, 1884");
    expect(stagedText).not.toContain("Wedge Spacebands");
    expect(stagedText).not.toContain("mold wheel rotates");
  });
});
