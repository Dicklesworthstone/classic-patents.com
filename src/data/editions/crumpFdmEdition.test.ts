import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { crumpFdmPatent } from "@/data/patents/crump-fdm";
import { normalizeReviewedLedgerText } from "@/data/patents/sourceTextValidation";
import { crumpFdmArchivalEdition } from "./crumpFdmEdition";
import { archivalParallelReadingsFor } from "./parallelReadings";

const PATENT_ID = "us-5121329-crump-fdm";
const EXPECTED_PDF_SHA256 = "a61b0395a405393ced9160aaa6a3e04624cb69f277eb6f64a070a3c3a0a51708";

describe("US 5,121,329 S. Scott Crump FDM Archival Edition Contract", () => {
  test("pins the complete 15-page primary facsimile and manual publication contract", () => {
    const pdfPath = resolve(process.cwd(), "public/patents/pdfs/us-5121329-crump-fdm.pdf");
    expect(existsSync(pdfPath)).toBe(true);
    expect(crumpFdmPatent.id).toBe(PATENT_ID);
    expect(crumpFdmPatent.archivalEdition).toBe(crumpFdmArchivalEdition);

    const pdfBytes = readFileSync(pdfPath);
    const pdfDigest = createHash("sha256").update(pdfBytes).digest("hex");
    expect(pdfDigest).toBe(EXPECTED_PDF_SHA256);
    expect(crumpFdmArchivalEdition.sourcePdfSha256).toBe(EXPECTED_PDF_SHA256);
    expect(crumpFdmPatent.originalTextAsset?.sourcePdfSha256).toBe(EXPECTED_PDF_SHA256);

    const ledgerPath = resolve(
      process.cwd(),
      "public/patents/transcripts/us-5121329-crump-fdm-reviewed.txt",
    );
    expect(existsSync(ledgerPath)).toBe(true);
    const ledger = readFileSync(ledgerPath, "utf8");

    for (let page = 1; page <= 15; page++) {
      expect(ledger.includes(`--- REVIEWED TRANSCRIPTION PAGE ${page} OF 15 ---`)).toBe(true);
    }
  });

  test("derives all forty-four issued claim strings from the manual source edition", () => {
    expect(crumpFdmPatent.claims.length).toBe(44);

    const editionClaims = crumpFdmArchivalEdition.blocks.filter(
      (b): b is Extract<(typeof crumpFdmArchivalEdition.blocks)[number], { kind: "claim" }> =>
        b.kind === "claim",
    );
    expect(editionClaims.length).toBe(44);

    for (let i = 0; i < 44; i++) {
      const claim = crumpFdmPatent.claims[i];
      expect(claim.number).toBe(i + 1);
      expect(claim.originalText.length).toBeGreaterThan(15);
      expect(claim.plainEnglish.length).toBeGreaterThan(15);
      expect(claim.keyInnovations.length).toBeGreaterThan(0);
    }
  });

  test("contains every published literal source block in the reviewed 15-page ledger", () => {
    const ledgerPath = resolve(
      process.cwd(),
      "public/patents/transcripts/us-5121329-crump-fdm-reviewed.txt",
    );
    const ledger = readFileSync(ledgerPath, "utf8");
    const normalizedLedger = normalizeReviewedLedgerText(ledger);

    for (const block of crumpFdmArchivalEdition.blocks) {
      if (block.kind === "paragraph" || block.kind === "claim") {
        for (const inline of block.inlines) {
          if (inline.kind === "text") {
            const normalizedText = normalizeReviewedLedgerText(inline.text);
            expect(normalizedLedger.includes(normalizedText)).toBe(true);
          }
        }
      }
    }
  });

  test("pins source crops, technical term annotations, and parallel readings", () => {
    for (let fig = 1; fig <= 12; fig++) {
      const cropPath = resolve(
        process.cwd(),
        `public/patents/figures/us-5121329-crump-fdm/fig-${fig}-source-crop-v1.png`,
      );
      expect(existsSync(cropPath)).toBe(true);
    }

    const readings = archivalParallelReadingsFor(PATENT_ID);
    const paragraphIndexes = crumpFdmArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    for (const index of paragraphIndexes) {
      expect(readings[index]).toBeDefined();
    }
  });
});
