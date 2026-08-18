import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { wrightFlyerArchivalEdition } from "@/data/editions/wrightFlyerEdition";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { wrightFlyerPatent } from "@/data/patents/wright-flyer";

describe("wrightFlyerArchivalEdition", () => {
  test("is a complete, continuous manual edition of the pinned facsimile", () => {
    expect(validateCuratedSpecificationEdition(wrightFlyerArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(wrightFlyerArchivalEdition.sourcePdfSha256).toBe(
      "678bea5d81cb4e90a15c998bc932d2cf01bc87cfc3fcc53f0ecbdbdc70097966",
    );
    expect(wrightFlyerArchivalEdition.completeFacsimileReviewed).toBe(true);

    const claims = wrightFlyerArchivalEdition.blocks.filter((block) => block.kind === "claim");
    expect(claims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 18 }, (_, index) => index + 1),
    );
  });

  test("keeps source-sheet pagination out of the continuous reading experience", () => {
    const publicText = JSON.stringify(wrightFlyerArchivalEdition.blocks);
    expect(publicText).not.toContain("--- REVIEWED TRANSCRIPTION PAGE");
    expect(publicText).not.toContain("3 SHEETS—SHEET");
    expect(publicText).not.toContain("Drawing sheet");
  });

  test("declares every source-figure preview at its authored occurrence", () => {
    const source = readFileSync(`${process.cwd()}/src/data/editions/wrightFlyerEdition.ts`, "utf8");

    expect(source).not.toContain("figureNumbers.map");
    expect(source).not.toContain("figurePreviews: figureNumbers");
    expect(source).toContain(
      'figureReference("Figs. 4 and 5", WRIGHT_FIGURE_PREVIEWS[4], WRIGHT_FIGURE_PREVIEWS[5])',
    );
  });

  test("preserves the simultaneous warp linkage in printed claim 2", () => {
    const claim2 = wrightFlyerArchivalEdition.blocks.find(
      (block) => block.kind === "claim" && block.number === 2,
    );
    expect(
      claim2?.kind === "claim" && claim2.inlines.map((inline) => inline.text).join(""),
    ).toContain("means for simultaneously imparting such movement");
  });

  test("pins every handwritten source block to the reviewed ten-page ledger", () => {
    const asset = wrightFlyerPatent.originalTextAsset;
    expect(asset).toMatchObject({
      url: "/patents/transcripts/us-821393-wright-flyer-reviewed.txt",
      pageCount: 10,
      kind: "reviewed-transcription",
      reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
      reviewedAt: "2026-08-18",
      sourcePdfSha256: "678bea5d81cb4e90a15c998bc932d2cf01bc87cfc3fcc53f0ecbdbdc70097966",
    });
    if (!asset?.sourcePdfSha256) {
      throw new Error("Wright reviewed transcript asset or source digest is missing.");
    }

    const transcript = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(transcript, asset.pageCount)).toEqual({ valid: true });
    const sourcePdf = readFileSync(`${process.cwd()}/public${wrightFlyerPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(sourcePdf).digest("hex")).toBe(asset.sourcePdfSha256);

    const normalizedTranscript = transcript
      .replace(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm, "")
      .replace(/\s+/g, " ")
      .trim();
    const textualBlocks = wrightFlyerArchivalEdition.blocks.filter(
      (block) => block.kind === "masthead" || block.kind === "paragraph" || block.kind === "claim",
    );
    for (const block of textualBlocks) {
      const sourceText =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.inlines.map((inline) => inline.text).join("");
      expect(normalizedTranscript).toContain(sourceText.replace(/\s+/g, " ").trim());
    }
  });
});
