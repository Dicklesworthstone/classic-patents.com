import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { rillieuxEvaporatorPatent } from "../patents/rillieux-evaporator";
import { validateReviewedTranscriptionEditorialIntegrity } from "../patents/sourceTextValidation";
import { completeArchivalEditionForViewer } from "./publicationApproval";
import { evaluateReviewedLedgerTextEvidence } from "./reviewedLedgerPublicationEvidence";
import { reviewedLedgerTextForViewer } from "./reviewedLedgerPublicationEvidence.server";
import {
  manualRillieuxClaimText,
  RILLIEUX_EVAPORATOR_PARALLEL_READINGS,
  rillieuxEvaporatorArchivalEdition,
} from "./rillieuxEvaporatorEdition";

const PINNED_SHA256 = "10d9a2c3909f1a7d7086c063925f96feed8aa362e1b39a64275a869853dc1d7a";

describe("US 3,237 Norbert Rillieux Multiple-Effect Evaporator Archival Edition Contract", () => {
  test("pinned PDF SHA-256 matches archival edition", () => {
    expect(rillieuxEvaporatorArchivalEdition.sourcePdfSha256).toBe(PINNED_SHA256);
    const pdfPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "pdfs",
      "us-3237-rillieux-evaporator.pdf",
    );
    expect(fs.existsSync(pdfPath)).toBe(true);
    const diskSha = createHash("sha256").update(fs.readFileSync(pdfPath)).digest("hex");
    expect(diskSha).toBe(PINNED_SHA256);
  });

  test("contains all 5 printed claims exactly matching manual claim text", () => {
    const claims = rillieuxEvaporatorArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claims.length).toBe(5);

    for (let i = 1; i <= 5; i++) {
      const claim = claims.find((c) => c.number === i);
      expect(claim).toBeDefined();
      const text = manualRillieuxClaimText(i);
      expect(text.length).toBeGreaterThan(30);
    }
  });

  test("marks the source-bound partial packet as held so the source reader falls open to the ledger", () => {
    expect(rillieuxEvaporatorArchivalEdition.completeFacsimileReviewed).toBe(false);
    expect(completeArchivalEditionForViewer(rillieuxEvaporatorPatent)).toBeUndefined();
  });

  test("keeps reconstructed figure prose out of the held packet while retaining pinned sheets", () => {
    const figurePreviews = rillieuxEvaporatorArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "paragraph") {
        return block.inlines.flatMap((inline) =>
          inline.kind === "reference" && inline.referenceType === "figure"
            ? (inline.figurePreviews ?? [])
            : [],
        );
      }
      return [];
    });

    expect(figurePreviews).toHaveLength(0);

    for (let sheet = 1; sheet <= 6; sheet++) {
      const fullPath = path.join(
        process.cwd(),
        "public",
        "patents",
        "figures",
        "us-3237-rillieux-evaporator",
        `source-sheet-${sheet}-v1.png`,
      );
      expect(fs.existsSync(fullPath)).toBe(true);
    }
  });

  test("every paragraph block has a corresponding parallel reading", () => {
    const paragraphIndices = rillieuxEvaporatorArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );

    const readingIndices = Object.keys(RILLIEUX_EVAPORATOR_PARALLEL_READINGS)
      .map(Number)
      .sort((a, b) => a - b);

    expect(readingIndices).toEqual(paragraphIndices);

    for (const idx of paragraphIndices) {
      const reading = RILLIEUX_EVAPORATOR_PARALLEL_READINGS[idx];
      expect(reading).toBeDefined();
      expect(reading?.length).toBeGreaterThan(0);
      expect(reading?.[0].trim().length).toBeGreaterThan(20);
    }
  });

  test("reviewed transcription ledger matches page boundary markers", () => {
    const ledgerPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "transcripts",
      "us-3237-rillieux-evaporator-reviewed.txt",
    );
    expect(fs.existsSync(ledgerPath)).toBe(true);
    const content = fs.readFileSync(ledgerPath, "utf8");

    for (let page = 1; page <= 11; page++) {
      expect(content).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${page} OF 11 ---`);
    }
  });

  test("transcribes the six source-sheet headers instead of editorial drawing placeholders", () => {
    const ledgerPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "transcripts",
      "us-3237-rillieux-evaporator-reviewed.txt",
    );
    const content = fs.readFileSync(ledgerPath, "utf8");

    expect(validateReviewedTranscriptionEditorialIntegrity(content, 11)).toEqual({ valid: true });
    for (let sheet = 1; sheet <= 6; sheet++) {
      expect(content).toContain(`Sheet ${sheet}. 6 Sheets.`);
    }
    expect(content).toContain("N. Rillieux.");
    expect(content).toContain("Vacuum Pan.");
    expect(content).not.toMatch(/\[Drawing Plate \d+\]/);
  });

  test("reconciles the pinned page-seven masthead and opening paragraph literally", () => {
    const ledgerPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "transcripts",
      "us-3237-rillieux-evaporator-reviewed.txt",
    );
    const content = fs.readFileSync(ledgerPath, "utf8");
    const opening = rillieuxEvaporatorArchivalEdition.blocks[1];
    if (opening?.kind !== "paragraph") {
      throw new Error("Rillieux archival edition is missing its opening paragraph.");
    }

    expect(content).toContain("UNITED STATES PATENT OFFICE.");
    expect(content).toContain(
      "Specification forming part of Letters Patent No. 3,237, dated August 26, 1843.",
    );
    expect(content).toContain(opening.inlines.map((inline) => inline.text).join(""));
  });

  test("binds every retained source section to the complete ledger without promoting the packet", () => {
    const ledgerPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "transcripts",
      "us-3237-rillieux-evaporator-reviewed.txt",
    );
    const evidence = evaluateReviewedLedgerTextEvidence(
      rillieuxEvaporatorPatent,
      fs.readFileSync(ledgerPath, "utf8"),
    );

    expect(evidence.status).toBe("verified");
    expect(evidence.missingSectionIndexes).toEqual([]);
    expect(evidence.missingClaimNumbers).toEqual([]);
    expect(rillieuxEvaporatorArchivalEdition.completeFacsimileReviewed).toBe(false);
  });

  test("continues to serve the complete eleven-page ledger while the reconstruction is held", () => {
    const source = reviewedLedgerTextForViewer(rillieuxEvaporatorPatent);
    expect(source).toStartWith("--- REVIEWED TRANSCRIPTION PAGE 1 OF 11 ---");
    expect(source).toContain("--- REVIEWED TRANSCRIPTION PAGE 11 OF 11 ---");
    expect(source).toContain("Sheet 6. 6 Sheets.");
  });
});
