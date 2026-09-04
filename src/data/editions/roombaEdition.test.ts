import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { roombaArchivalEdition, roombaParallelReadings } from "@/data/editions/roombaEdition";
import { manualClaimText, roombaPatent } from "@/data/patents/roomba";
import { ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS } from "./archivalFigureAcceptance";
import { FIGURE_OCCURRENCE_SOURCE_LOCATORS } from "./figureOccurrenceSourceLocators";
import {
  completeArchivalEditionForViewer,
  evaluateArchivalPublicationState,
} from "./publicationApproval";
import {
  evaluateReviewedLedgerTextEvidence,
  literalLedgerSectionsForEdition,
} from "./reviewedLedgerPublicationEvidence";

const PINNED_SHA256 = "66133fab282d46a32c5e5228d9207bcce1d2b49db90d627325592964fe4d5a3e";

describe("US 6,594,844 iRobot Roomba Archival Edition Contract", () => {
  test("is a valid, complete manual edition of US 6,594,844", () => {
    const result = validateCuratedSpecificationEdition(roombaArchivalEdition);
    expect(result).toEqual({
      valid: true,
      errors: [],
    });
    expect(roombaPatent.archivalEdition).toBe(roombaArchivalEdition);
    expect(roombaPatent.originalTextAsset).toBeDefined();
    expect(roombaPatent.inventors).toEqual(["Joseph L. Jones"]);
    expect(roombaPatent.filingDate).toBe("2001-01-24");
  });

  test("pinned PDF SHA-256 matches archival edition", () => {
    expect(roombaArchivalEdition.sourcePdfSha256).toBe(PINNED_SHA256);
    const pdfPath = path.join(process.cwd(), "public", "patents", "pdfs", "us-6594844-roomba.pdf");
    expect(fs.existsSync(pdfPath)).toBe(true);
    const diskSha = createHash("sha256").update(fs.readFileSync(pdfPath)).digest("hex");
    expect(diskSha).toBe(PINNED_SHA256);
  });

  test("contains all 20 printed claims exactly matching manual claim text", () => {
    const claims = roombaArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claims.length).toBe(20);

    for (let i = 1; i <= 20; i++) {
      const claim = claims.find((c) => c.number === i);
      expect(claim).toBeDefined();
      expect(roombaPatent.claims.find((candidate) => candidate.number === i)?.originalText).toBe(
        manualClaimText(i),
      );
    }
  });

  test("all figure preview assets exist on disk with exact pixel dimensions", () => {
    const figurePreviews = roombaArchivalEdition.blocks.flatMap((block) => {
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

    expect(new Set(figurePreviews.map((preview) => preview.src))).toEqual(
      new Set(["/patents/figures/us-6594844-roomba/source-sheet-1-v1.png"]),
    );
    for (const legacyCrop of ["fig-1", "fig-2", "fig-3"] as const) {
      expect(
        fs.existsSync(
          path.join(
            process.cwd(),
            "public",
            "patents",
            "figures",
            "us-6594844-roomba",
            `${legacyCrop}-source-crop-v1.png`,
          ),
        ),
      ).toBe(true);
    }
  });

  test("accepts all four active citations against one complete source sheet without withholding text", () => {
    const patentId = roombaPatent.id;
    const sourceSheet = "/patents/figures/us-6594844-roomba/source-sheet-1-v1.png";
    const attestation = ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[patentId];
    expect(attestation).toMatchObject({
      sourcePdfSha256: PINNED_SHA256,
      reviewer: "Classic Patents editorial agent (GPT-5.6); independent source-pixel review",
      reviewedAt: "2026-09-03",
      acceptanceBasis: "independent-figure-review",
      acceptedOccurrenceCount: 4,
      assets: {
        [sourceSheet]: {
          sha256: "94e6a12462932936aee2df4b36939da798c1ac878058111621758a0ba7bc627b",
          width: 2320,
          height: 3408,
        },
      },
    });
    expect(
      createHash("sha256")
        .update(fs.readFileSync(path.join(process.cwd(), "public", sourceSheet)))
        .digest("hex"),
    ).toBe(attestation.assets[sourceSheet]?.sha256);

    const locators = FIGURE_OCCURRENCE_SOURCE_LOCATORS[patentId];
    expect(locators.map((locator) => locator.occurrenceKey)).toEqual([
      "edition-block-12-group-0-inline-1",
      "edition-block-12-group-0-inline-3",
      "edition-block-12-group-0-inline-5",
      "edition-block-16-group-0-inline-1",
    ]);
    for (const locator of locators) {
      expect(locator).toMatchObject({
        activeAsset: sourceSheet,
        sourcePdfPage: 2,
        sourceRaster: { width: 2320, height: 3408 },
        sourceRectPixels: { x: 0, y: 0, width: 2320, height: 3408 },
        normalizedSourceRect: { x: 0, y: 0, width: 1, height: 1 },
        reviewer: attestation.reviewer,
        reviewedAt: attestation.reviewedAt,
        evidenceReference:
          "docs/provenance/us-6594844-roomba.md#source-sheet-acceptance-2026-09-03",
      });
    }

    const decision = evaluateArchivalPublicationState(roombaPatent);
    expect(decision.figureManifest).toMatchObject({
      requiredFigureCount: 4,
      acceptedFigureCount: 4,
    });
    expect(completeArchivalEditionForViewer(roombaPatent, decision)).toBe(roombaArchivalEdition);
  });

  test("reviewed transcript ledger exists and contains page markers", () => {
    const transcriptPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "transcripts",
      "us-6594844-roomba-reviewed.txt",
    );
    expect(fs.existsSync(transcriptPath)).toBe(true);
    const content = fs.readFileSync(transcriptPath, "utf-8");
    const matches = content.match(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF 26 ---/g);
    expect(matches).toBeDefined();
    expect(matches?.length).toBe(26);
  });

  test("pins every authored source section to the reviewed ledger", () => {
    const transcriptPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "transcripts",
      "us-6594844-roomba-reviewed.txt",
    );
    const transcript = fs.readFileSync(transcriptPath, "utf-8");
    const evidence = evaluateReviewedLedgerTextEvidence(roombaPatent, transcript);

    expect(literalLedgerSectionsForEdition(roombaArchivalEdition)).toHaveLength(45);
    expect(evidence).toMatchObject({
      status: "verified",
      valid: true,
      authoredSectionCount: 45,
      coveredSectionCount: 45,
      coverageFraction: 1,
      missingSectionIndexes: [],
      missingClaimNumbers: [],
      error: null,
    });

    for (const [index, block] of roombaArchivalEdition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      const reading = roombaParallelReadings[index];
      expect(reading?.join(" ").trim().length).toBeGreaterThan(40);
    }
  });
});
