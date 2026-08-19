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
