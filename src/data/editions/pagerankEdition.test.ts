import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  pagerankArchivalEdition,
  pagerankManualClaimText,
  pagerankParallelReadings,
} from "@/data/editions/pagerankEdition";
import { pagerankPatent } from "@/data/patents/pagerank";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionLiteralCoverage,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";
import { evaluateArchivalPublicationState } from "./publicationApproval";
import {
  evaluateReviewedLedgerTextEvidence,
  literalLedgerSectionsForEdition,
} from "./reviewedLedgerPublicationEvidence";

const PINNED_SHA256 = "c2e024116b9411385aa9cb5d51d3eb34b99f59db190c2bb9298d9d6d6eeed2e4";

describe("US 6,285,999 Google PageRank Archival Edition Contract", () => {
  test("is a valid, complete manual edition of US 6,285,999", () => {
    const result = validateCuratedSpecificationEdition(pagerankArchivalEdition);
    expect(result).toEqual({
      valid: true,
      errors: [],
    });
    expect(pagerankPatent.archivalEdition).toBe(pagerankArchivalEdition);
    expect(pagerankPatent.originalTextAsset).toBeDefined();
  });

  test("pinned PDF SHA-256 matches archival edition", () => {
    expect(pagerankArchivalEdition.sourcePdfSha256).toBe(PINNED_SHA256);
    const pdfPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "pdfs",
      "us-6285999-pagerank.pdf",
    );
    expect(fs.existsSync(pdfPath)).toBe(true);
    const diskSha = createHash("sha256").update(fs.readFileSync(pdfPath)).digest("hex");
    expect(diskSha).toBe(PINNED_SHA256);
    expect(pagerankPatent.originalTextAsset?.sourcePdfSha256).toBe(PINNED_SHA256);
  });

  test("contains all 29 printed claims exactly matching manual claim text", () => {
    const claims = pagerankArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claims.length).toBe(29);

    for (let i = 1; i <= 29; i++) {
      const claim = claims.find((c) => c.number === i);
      expect(claim).toBeDefined();
      expect(pagerankManualClaimText(i)).toBe(
        claim?.inlines ? claim.inlines.map((inline) => inline.text).join("") : "",
      );
      expect(pagerankPatent.claims.find((candidate) => candidate.number === i)?.originalText).toBe(
        pagerankManualClaimText(i),
      );
    }
  });

  test("every authored paragraph has a non-lossy companion reading", () => {
    pagerankArchivalEdition.blocks.forEach((block, index) => {
      if (block.kind !== "paragraph") return;
      const reading = pagerankParallelReadings[index];
      expect(reading?.join(" ").length ?? 0).toBeGreaterThan(40);
    });
  });

  test("all figure preview assets exist on disk with exact pixel dimensions", () => {
    const figurePreviews = pagerankArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "paragraph") {
        return block.inlines.flatMap((inline) =>
          inline.kind === "reference" && inline.referenceType === "figure"
            ? (inline.figurePreviews ?? [])
            : [],
        );
      }
      return [];
    });

    expect(figurePreviews.length).toBeGreaterThanOrEqual(3);

    for (const preview of figurePreviews) {
      const relPath = preview.src.replace(/^\//, "");
      const fullPath = path.join(process.cwd(), "public", relPath);
      expect(fs.existsSync(fullPath)).toBe(true);

      const buf = fs.readFileSync(fullPath);
      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);

      expect(preview.width).toBe(width);
      expect(preview.height).toBe(height);
    }
  });

  test("reviewed transcript ledger exists and contains page markers", () => {
    const transcriptPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "transcripts",
      "us-6285999-pagerank-reviewed.txt",
    );
    expect(fs.existsSync(transcriptPath)).toBe(true);
    const content = fs.readFileSync(transcriptPath, "utf-8");
    expect(validateReviewedTranscription(content, 12)).toEqual({ valid: true });
    expect(
      validateReviewedTranscriptionPageAnchors(
        content,
        12,
        pagerankPatent.originalTextAsset?.pageAnchors,
      ),
    ).toEqual({ valid: true });
    expect(content).toContain("US 6,285,999 B1");
    expect(content).toContain("29 Claims, 3 Drawing Sheets");
    expect(content).toContain("CERTIFICATE OF CORRECTION");
    expect(content).toContain(
      "This invention was made with Government support under contract 9411306",
    );
  });

  test("pins all visitor-facing source blocks to the reviewed ledger", () => {
    const transcriptPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "transcripts",
      "us-6285999-pagerank-reviewed.txt",
    );
    const transcript = fs.readFileSync(transcriptPath, "utf8");
    const sections = literalLedgerSectionsForEdition(pagerankArchivalEdition);

    expect(validateReviewedTranscriptionLiteralCoverage(transcript, 12, sections)).toEqual({
      valid: true,
    });
    expect(evaluateReviewedLedgerTextEvidence(pagerankPatent, transcript)).toMatchObject({
      status: "verified",
      valid: true,
      authoredSectionCount: 77,
      coveredSectionCount: 77,
      coverageFraction: 1,
      missingSectionIndexes: [],
      missingClaimNumbers: [],
    });

    const corrupted = transcript.replace(
      "29. The method of claim 1",
      "29. [corrupted source section]",
    );
    expect(evaluateReviewedLedgerTextEvidence(pagerankPatent, corrupted)).toMatchObject({
      valid: false,
      status: "literal-coverage-incomplete",
      missingClaimNumbers: [29],
    });
  });

  test("accepts only locator-bound direct facsimile crops", () => {
    const decision = evaluateArchivalPublicationState(pagerankPatent);

    expect(decision.reasonCode).toBe("ACCEPTED");
    expect(decision.isPublished).toBe(true);
    expect(decision.figureManifest).toMatchObject({
      requiredFigureCount: 6,
      acceptedFigureCount: 6,
      attestation: {
        acceptanceBasis: "independent-figure-review",
        acceptedOccurrenceCount: 6,
        matchesEdition: true,
        matchesLocators: true,
      },
    });
    expect(
      decision.figureManifest.figures.map((figure) => ({
        occurrence: figure.occurrence,
        sourcePdfPage: figure.sourcePdfPage,
        sourceRaster: figure.sourceRaster,
        sourceRectPixels: figure.sourceRectPixels,
        status: figure.status,
      })),
    ).toEqual([
      {
        occurrence: "edition-block-20-group-0-inline-0",
        sourcePdfPage: 3,
        sourceRaster: { width: 2320, height: 3408 },
        sourceRectPixels: { x: 387, y: 272, width: 1681, height: 2580 },
        status: "accepted",
      },
      {
        occurrence: "edition-block-20-group-0-inline-2",
        sourcePdfPage: 4,
        sourceRaster: { width: 2320, height: 3408 },
        sourceRectPixels: { x: 302, y: 272, width: 1783, height: 2598 },
        status: "accepted",
      },
      {
        occurrence: "edition-block-20-group-0-inline-4",
        sourcePdfPage: 5,
        sourceRaster: { width: 2320, height: 3408 },
        sourceRectPixels: { x: 393, y: 272, width: 1659, height: 2859 },
        status: "accepted",
      },
      {
        occurrence: "edition-block-23-group-0-inline-1",
        sourcePdfPage: 3,
        sourceRaster: { width: 2320, height: 3408 },
        sourceRectPixels: { x: 387, y: 272, width: 1681, height: 2580 },
        status: "accepted",
      },
      {
        occurrence: "edition-block-27-group-0-inline-1",
        sourcePdfPage: 4,
        sourceRaster: { width: 2320, height: 3408 },
        sourceRectPixels: { x: 302, y: 272, width: 1783, height: 2598 },
        status: "accepted",
      },
      {
        occurrence: "edition-block-34-group-0-inline-1",
        sourcePdfPage: 5,
        sourceRaster: { width: 2320, height: 3408 },
        sourceRectPixels: { x: 393, y: 272, width: 1659, height: 2859 },
        status: "accepted",
      },
    ]);
  });
});
