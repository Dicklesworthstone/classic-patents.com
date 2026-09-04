import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { hopkinsPotashPatent } from "@/data/patents/hopkins-potash";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { HOPKINS_PARALLEL_READINGS, hopkinsPotashArchivalEdition } from "./hopkinsPotashEdition";

describe("US Patent 1 [X1] Samuel Hopkins Potash manual source edition", () => {
  test("pins the single-page parchment facsimile, grant date, and operative claim", () => {
    expect(hopkinsPotashPatent.archivalEdition).toBe(hopkinsPotashArchivalEdition);
    expect(hopkinsPotashPatent.grantDate).toBe("1790-07-31");
    expect(hopkinsPotashArchivalEdition.sourcePdfSha256).toBe(
      "d4cdaf8e4f5cf9fc841df0a98adca8341b5c513e4f328f013f50fc914509777e",
    );
    expect(validateCuratedSpecificationEdition(hopkinsPotashArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${hopkinsPotashPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      hopkinsPotashArchivalEdition.sourcePdfSha256,
    );
    expect(hopkinsPotashPatent.claims).toEqual([]);
    expect(hopkinsPotashPatent.archivalEdition?.claimStatus).toEqual({
      kind: "no-formal-claims-in-facsimile",
      evidence:
        "The original 1790 Hopkins patent predates the 1836 Patent Act statutory requirement for formal numbered claims; the grant recites the complete process in the narrative specification.",
    });
    expect(hopkinsPotashPatent.stats).toMatchObject({ totalClaims: 0, independentClaims: 0 });
  });

  test("verifies no formal claims in 1790 facsimile", () => {
    const authoredClaims = hopkinsPotashArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof hopkinsPotashArchivalEdition.blocks)[number],
        { kind: "claim" }
      > => block.kind === "claim",
    );
    expect(authoredClaims).toHaveLength(0);
    expect(hopkinsPotashPatent.claims).toHaveLength(0);
  });

  test("records the source-true absence of technical drawings", () => {
    expect(hopkinsPotashPatent.drawings).toEqual([]);
    expect(hopkinsPotashArchivalEdition.blocks.some((block) => block.kind === "figure-sheet")).toBe(
      false,
    );
  });

  test("verifies reviewed transcription ledger integrity", () => {
    const ledgerPath = resolve(
      `${process.cwd()}/public${hopkinsPotashPatent.originalTextAsset?.url}`,
    );
    expect(existsSync(ledgerPath)).toBe(true);
    const ledgerText = readFileSync(ledgerPath, "utf-8");
    const result = validateReviewedTranscription(ledgerText, 1);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
    expect(ledgerText).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 1 ---");
    expect(ledgerText).toContain("Whereas Samuel Hopkins of the City of Philadelphia");
    expect(ledgerText).toContain("G. WASHINGTON");
    expect(ledgerText).toContain("Edm. Randolph");
    expect(ledgerText).not.toContain("TH: JEFFERSON");
  });

  test("provides complete parallel readings covering all edition paragraph blocks", () => {
    const paragraphIndexes = hopkinsPotashArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    for (const index of paragraphIndexes) {
      expect(HOPKINS_PARALLEL_READINGS[index]).toBeDefined();
      expect(HOPKINS_PARALLEL_READINGS[index][0].length).toBeGreaterThan(20);
    }
  });

  test("accepts the source-true parchment edition without withholding it from the reader", () => {
    const {
      evaluateArchivalPublicationState,
      patentForSourceReader,
    } = require("./publicationApproval");
    const decision = evaluateArchivalPublicationState(hopkinsPotashPatent);
    expect(decision.isPublished).toBe(true);
    expect(patentForSourceReader(hopkinsPotashPatent).archivalEdition).toBe(
      hopkinsPotashArchivalEdition,
    );
  });
});
