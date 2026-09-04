import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { lincolnBuoyPatent } from "@/data/patents/lincoln-buoy";
import { lincolnBuoyArchivalEdition, lincolnBuoyParallelReadings } from "./lincolnBuoyEdition";

describe("lincolnBuoyArchivalEdition", () => {
  test("pins the corrected three-page Lincoln facsimile with explicit authored nodes", () => {
    expect(validateCuratedSpecificationEdition(lincolnBuoyArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(lincolnBuoyArchivalEdition.sourcePdfSha256).toBe(
      "0663103c4dc8e15ae66d7829ace7916bd4025bd1751afb8710fca8d3fdbf53be",
    );
    expect(lincolnBuoyArchivalEdition.completeFacsimileReviewed).toBe(true);
  });

  test("retains the sole source-exact claim and no invented second claim", () => {
    const claims = lincolnBuoyArchivalEdition.blocks.filter((block) => block.kind === "claim");
    expect(claims.map((claim) => claim.number)).toEqual([1]);
    expect(lincolnBuoyPatent.claims.map((claim) => claim.number)).toEqual([1]);
    const sourceClaim = claims[0]?.inlines.map((inline) => inline.text).join("");
    expect(sourceClaim).toContain("series of ropes and pullies");
    expect(lincolnBuoyPatent.claims[0]?.originalText).toBe(sourceClaim);
    expect(
      readFileSync(
        resolve(process.cwd(), "public/patents/transcripts/us-6469-lincoln-buoy.txt"),
        "utf8",
      ),
    ).toContain(sourceClaim);
  });

  test("uses only the corrected identity and local source asset", () => {
    expect(lincolnBuoyPatent.id).toBe("us-6469-lincoln-buoy");
    expect(lincolnBuoyPatent.originalPdfUrl).toBe("/patents/pdfs/us-6469-lincoln-buoy.pdf");
    expect(lincolnBuoyPatent.originalTextAsset?.url).toBe(
      "/patents/transcripts/us-6469-lincoln-buoy-reviewed.txt",
    );
    expect(existsSync(resolve(process.cwd(), "public/patents/pdfs/us-6469-lincoln-buoy.pdf"))).toBe(
      true,
    );
    const reviewedTxt = readFileSync(
      resolve(process.cwd(), "public/patents/transcripts/us-6469-lincoln-buoy-reviewed.txt"),
      "utf8",
    );
    expect(reviewedTxt).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 3 ---");
    expect(reviewedTxt).toContain("--- REVIEWED TRANSCRIPTION PAGE 2 OF 3 ---");
    expect(reviewedTxt).toContain("--- REVIEWED TRANSCRIPTION PAGE 3 OF 3 ---");
    expect(reviewedTxt).toContain("A. LINCOLN.");
  });

  test("binds all ten authored figure occurrences to the complete source drawing sheet", () => {
    const sourceSheet = "/patents/figures/us-6469-lincoln-buoy/source-sheet-1-v1.png";
    const sourceSheetPath = resolve(process.cwd(), "public", sourceSheet.replace(/^\//, ""));
    const sourceSheetBytes = readFileSync(sourceSheetPath);
    expect(createHash("sha256").update(sourceSheetBytes).digest("hex")).toBe(
      "56bd69ba57f894c068b46ac83bb58d251f5c1e853966168bfaf8004638ef6add",
    );
    expect(sourceSheetBytes.readUInt32BE(16)).toBe(2320);
    expect(sourceSheetBytes.readUInt32BE(20)).toBe(3408);

    const references = lincolnBuoyArchivalEdition.blocks.flatMap((block, blockIndex) =>
      "inlines" in block
        ? block.inlines.flatMap((inline, inlineIndex) =>
            inline.kind === "reference" && inline.referenceType === "figure"
              ? [
                  {
                    inline,
                    occurrenceKey: `edition-block-${blockIndex}-group-0-inline-${inlineIndex}`,
                  },
                ]
              : [],
          )
        : [],
    );
    expect(references.map((reference) => reference.occurrenceKey)).toEqual([
      "edition-block-7-group-0-inline-0",
      "edition-block-7-group-0-inline-2",
      "edition-block-7-group-0-inline-4",
      "edition-block-9-group-0-inline-1",
      "edition-block-10-group-0-inline-1",
      "edition-block-11-group-0-inline-1",
      "edition-block-12-group-0-inline-1",
      "edition-block-12-group-0-inline-3",
      "edition-block-12-group-0-inline-5",
      "edition-block-13-group-0-inline-1",
    ]);

    const previews = references.flatMap((reference) => reference.inline.figurePreviews ?? []);
    expect(previews).toHaveLength(12);
    for (const preview of previews) {
      expect(preview).toMatchObject({ src: sourceSheet, width: 2320, height: 3408 });
      expect(preview.alt).toContain("Complete source drawing sheet 1 of 1");
    }

    for (const legacyAsset of [
      "us-6469-lincoln-buoy-fig-1-hover.png",
      "us-6469-lincoln-buoy-fig-2-hover.png",
      "us-6469-lincoln-buoy-fig-3-hover.png",
      "us-6469-lincoln-buoy-fig-1-preview.png",
      "us-6469-lincoln-buoy-fig-2-preview.png",
      "us-6469-lincoln-buoy-fig-3-preview.png",
    ]) {
      expect(existsSync(resolve(process.cwd(), "public/patents/figures", legacyAsset))).toBe(true);
    }
  });

  test("does not leave a figure citation stranded in a plain text node", () => {
    const bareFigureCitation = /\bFig(?:s)?\.\s*\d+/i;

    for (const block of lincolnBuoyArchivalEdition.blocks) {
      if (!("inlines" in block)) continue;
      for (const inline of block.inlines) {
        if (inline.kind === "text") {
          expect(inline.text).not.toMatch(bareFigureCitation);
        }
      }
    }
  });

  test("gives every authored prose paragraph a non-lossy local companion", () => {
    for (const [index, block] of lincolnBuoyArchivalEdition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      expect(lincolnBuoyParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(40);
    }
  });

  test("accepts all source-sheet figure evidence while retaining the verified ledger", () => {
    const { evaluateArchivalPublicationState } = require("./publicationApproval");
    const decision = evaluateArchivalPublicationState(lincolnBuoyPatent);
    expect(decision.isPublished).toBe(true);
    expect(decision.reasonCode).toBe("ACCEPTED");
    expect(decision.state.evidence.ledgerContent.valid).toBe(true);
    expect(decision.state.evidence.ledgerContent.status).toBe("verified");
  });
});
