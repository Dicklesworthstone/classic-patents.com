import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  hollerithTabulatingArchivalEdition,
  hollerithTabulatingClaimText,
  hollerithTabulatingFigureCrops,
  hollerithTabulatingPage9ParallelReadings,
  hollerithTabulatingPages7To9ParallelReadings,
  hollerithTabulatingPages10To14ParallelReadings,
  hollerithTabulatingSignatureParallelReading,
} from "@/data/editions/hollerithTabulatingEdition";
import { hollerithTabulatingPatent } from "@/data/patents/hollerith-tabulating";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";

describe("hollerithTabulatingArchivalEdition", () => {
  test("keeps the full manual source sequence and all printed claims", () => {
    expect(validateCuratedSpecificationEdition(hollerithTabulatingArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const claims = hollerithTabulatingArchivalEdition.blocks.filter(
      (block) => block.kind === "claim",
    );
    expect(claims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 21 }, (_, index) => index + 1),
    );
    const execution = hollerithTabulatingArchivalEdition.blocks.at(-1);
    expect(execution?.kind).toBe("paragraph");
    expect(
      execution?.kind === "paragraph" && execution.inlines.map((inline) => inline.text).join(""),
    ).toContain("Witnesses: JOHN R. FLOYD, EDWARD N. HILL.");
    if (hollerithTabulatingPatent.archivalEdition) {
      expect(hollerithTabulatingPatent.archivalEdition).toBe(hollerithTabulatingArchivalEdition);
    }
    expect(hollerithTabulatingPatent.claims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 21 }, (_, index) => index + 1),
    );
    expect(hollerithTabulatingPatent.claims.map((claim) => claim.originalText)).toEqual(
      Array.from({ length: 21 }, (_, index) => hollerithTabulatingClaimText(index + 1)),
    );
  });

  test("gives every authored specification paragraph a direct companion", () => {
    const paragraphs = hollerithTabulatingArchivalEdition.blocks
      .map((block, index) => ({ block, index }))
      .filter(({ block }) => block.kind === "paragraph");
    const companions = {
      ...hollerithTabulatingPages7To9ParallelReadings,
      ...hollerithTabulatingPage9ParallelReadings,
      ...hollerithTabulatingPages10To14ParallelReadings,
      ...hollerithTabulatingSignatureParallelReading,
    };
    for (const { index } of paragraphs) {
      expect(companions[index]?.join(" ").length).toBeGreaterThan(40);
    }
  });

  test("pins the facsimile, literal reviewed ledger, and every source block together", () => {
    const pdf = readFileSync(`${process.cwd()}/public${hollerithTabulatingPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      hollerithTabulatingArchivalEdition.sourcePdfSha256,
    );

    const asset = hollerithTabulatingPatent.originalTextAsset;
    if (asset) {
      expect(asset).toMatchObject({
        url: "/patents/transcripts/us-395781-hollerith-tabulating-reviewed.txt",
        pageCount: 17,
        kind: "reviewed-transcription",
        sourcePdfSha256: hollerithTabulatingArchivalEdition.sourcePdfSha256,
      });
    }

    const ledger = readFileSync(
      `${process.cwd()}/public/patents/transcripts/us-395781-hollerith-tabulating-reviewed.txt`,
      "utf8",
    );
    expect(validateReviewedTranscription(ledger, 17)).toEqual({ valid: true });
    const continuousLedger = ledger
      .replace(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF 17 ---/g, "")
      .replace(/\s+/g, " ");
    for (const block of hollerithTabulatingArchivalEdition.blocks) {
      if (
        block.kind !== "masthead" &&
        block.kind !== "heading" &&
        block.kind !== "paragraph" &&
        block.kind !== "claim"
      ) {
        continue;
      }
      const sourceText =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.kind === "heading"
            ? block.text
            : block.inlines.map((inline) => inline.text).join("");
      expect(continuousLedger).toContain(sourceText.replace(/\s+/g, " "));
    }
  });

  test("records the actual six drawing sheets and renders every cited figure locally", () => {
    const ledger = readFileSync(
      `${process.cwd()}/public/patents/transcripts/us-395781-hollerith-tabulating-reviewed.txt`,
      "utf8",
    );
    const expectedSheets = [
      ["Sheet 1", "Fig. 1."],
      ["Sheet 2", "Fig. 2.", "Fig. 4."],
      ["Sheet 3", "Fig. 3.", "Fig. 5.", "Fig. 6.", "Fig. 7."],
      ["Sheet 4", "Fig. 8.", "Fig. 9."],
      ["Sheet 5", "Fig. 10.", "Fig. 11.", "Fig. 12.", "Fig. 13."],
      ["Sheet 6", "Fig. 14.", "Fig. 15.", "Fig. 16.", "Fig. 17."],
    ];
    for (const sheet of expectedSheets) for (const text of sheet) expect(ledger).toContain(text);
    expect(ledger).toContain("Chas. R. Bun.");
    expect(ledger).toContain("Thomas Durant.");
    expect(ledger).not.toContain("[Drawing Sheet");

    for (const crops of Object.values(hollerithTabulatingFigureCrops)) {
      expect(crops).toHaveLength(1);
      const crop = crops[0];
      expect(existsSync(resolve(process.cwd(), "public", crop.src.slice(1)))).toBe(true);
      expect(crop.width).toBeGreaterThan(300);
      expect(crop.height).toBeGreaterThan(300);
    }

    expect(hollerithTabulatingFigureCrops["Fig. 6"][0]).toMatchObject({
      src: "/patents/figures/us-395781-hollerith-tabulating/fig-6-source-crop-v4.png",
      width: 800,
      height: 900,
    });
  });

  test("keeps every authored figure occurrence bound to an existing source preview", () => {
    const figureReferences = hollerithTabulatingArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline) => inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    expect(figureReferences.length).toBeGreaterThan(15);
    for (const reference of figureReferences) {
      expect(reference.figurePreviews?.length ?? 0).toBeGreaterThan(0);
      for (const preview of reference.figurePreviews ?? []) {
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }
  });

  test("keeps the repaired claim ranges on pages 15 through 17", () => {
    const ledger = readFileSync(
      `${process.cwd()}/public/patents/transcripts/us-395781-hollerith-tabulating-reviewed.txt`,
      "utf8",
    );
    const page = (number: number) => {
      const marker = `--- REVIEWED TRANSCRIPTION PAGE ${number} OF 17 ---`;
      const start = ledger.indexOf(marker);
      const next = ledger.indexOf(`--- REVIEWED TRANSCRIPTION PAGE ${number + 1} OF 17 ---`);
      return ledger.slice(start, next < 0 ? ledger.length : next);
    };
    expect(
      page(15)
        .match(/^\d+\./gm)
        ?.map(Number),
    ).toEqual([1, 2, 3, 4, 5, 6]);
    expect(
      page(16)
        .match(/^\d+\./gm)
        ?.map(Number),
    ).toEqual([7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
    expect(
      page(17)
        .match(/^\d+\./gm)
        ?.map(Number),
    ).toEqual([18, 19, 20, 21]);
  });

  test("uses specific term annotations rather than leaving period language unexplained", () => {
    const terms = hollerithTabulatingArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block ? block.inlines.filter((inline) => inline.kind === "term") : [],
    );
    expect(terms.map((term) => term.text)).toEqual(
      expect.arrayContaining([
        "circuit-actuating index-points",
        "index-points",
        "record-card",
        "sorting-box",
        "mercury-contacts",
        "primary",
        "secondary",
      ]),
    );
    for (const term of terms) expect(term.definition.length).toBeGreaterThan(80);
  });
});
