import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { carlsonElectrophotographyPatent } from "@/data/patents/carlson-electrophotography";
import {
  carlsonElectrophotographyArchivalEdition,
  carlsonElectrophotographyParallelReadings,
  manualCarlsonClaimText,
} from "./carlsonElectrophotographyEdition";
import { evaluateReviewedLedgerTextEvidence } from "./reviewedLedgerPublicationEvidence";

describe("US 2,297,691 Chester F. Carlson Electrophotography Archival Edition Publication Contract", () => {
  const rootDir = process.cwd();
  const pdfPath = join(rootDir, "public/patents/pdfs/us-2297691-carlson-electrophotography.pdf");
  const transcriptPath = join(
    rootDir,
    "public/patents/transcripts/us-2297691-carlson-electrophotography-reviewed.txt",
  );

  test("pins a complete direct review of the ten-page facsimile", () => {
    expect(carlsonElectrophotographyPatent.archivalEdition).toBe(
      carlsonElectrophotographyArchivalEdition,
    );
    expect(carlsonElectrophotographyArchivalEdition.completeFacsimileReviewed).toBe(true);
    expect(validateCuratedSpecificationEdition(carlsonElectrophotographyArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
  });

  test("matches the cryptographic SHA-256 digest of the pinned 10-page USPTO facsimile PDF", () => {
    expect(existsSync(pdfPath)).toBe(true);
    const buffer = readFileSync(pdfPath);
    const computedDigest = createHash("sha256").update(buffer).digest("hex");

    expect(carlsonElectrophotographyArchivalEdition.sourcePdfSha256).toBe(
      "5b521a7f4b7fad3c258cc3b5bbbae2d593a28f03641e78938ec73e3fdbab8422",
    );
    expect(computedDigest).toBe(carlsonElectrophotographyArchivalEdition.sourcePdfSha256);
  });

  test("keeps the complete page-marked ten-page reviewed ledger", () => {
    expect(existsSync(transcriptPath)).toBe(true);
    const transcript = readFileSync(transcriptPath, "utf-8");

    for (let page = 1; page <= 10; page++) {
      expect(transcript).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${page} OF 10 ---`);
    }
    expect(transcript).toContain("CHESTER F. CARLSON.");
  });

  test("proves literal coverage of every authored source section and printed claim", () => {
    const evidence = evaluateReviewedLedgerTextEvidence(
      carlsonElectrophotographyPatent,
      readFileSync(transcriptPath, "utf8"),
    );

    expect(evidence).toEqual(
      expect.objectContaining({
        status: "verified",
        valid: true,
        authoredSectionCount: 120,
        coveredSectionCount: 120,
        coverageFraction: 1,
        missingSectionIndexes: [],
        missingClaimNumbers: [],
        error: null,
      }),
    );
  });

  test("binds all active figure citations to the complete digest-pinned source sheet", () => {
    const sourceSheet =
      "/patents/figures/us-2297691-carlson-electrophotography/source-sheet-1-v1.png";
    const occurrences = carlsonElectrophotographyArchivalEdition.blocks.flatMap(
      (block, blockIndex) => {
        const inlines =
          block.kind === "figure-sheet"
            ? block.description
            : block.kind === "paragraph" || block.kind === "claim"
              ? block.inlines
              : [];
        return inlines.flatMap((inline, inlineIndex) =>
          inline.kind === "reference" && inline.referenceType === "figure"
            ? [
                {
                  occurrenceKey: `edition-block-${blockIndex}-group-0-inline-${inlineIndex}`,
                  text: inline.text,
                  preview: inline.figurePreviews?.[0],
                },
              ]
            : [],
        );
      },
    );

    expect(occurrences.map((occurrence) => occurrence.occurrenceKey)).toEqual([
      "edition-block-6-group-0-inline-1",
      "edition-block-6-group-0-inline-3",
      "edition-block-6-group-0-inline-5",
      "edition-block-6-group-0-inline-7",
      "edition-block-6-group-0-inline-9",
      "edition-block-6-group-0-inline-11",
      "edition-block-6-group-0-inline-13",
      "edition-block-6-group-0-inline-15",
      "edition-block-10-group-0-inline-0",
      "edition-block-20-group-0-inline-1",
      "edition-block-22-group-0-inline-1",
      "edition-block-22-group-0-inline-3",
      "edition-block-24-group-0-inline-0",
      "edition-block-25-group-0-inline-0",
      "edition-block-28-group-0-inline-1",
      "edition-block-28-group-0-inline-3",
      "edition-block-28-group-0-inline-5",
      "edition-block-31-group-0-inline-1",
      "edition-block-33-group-0-inline-1",
      "edition-block-35-group-0-inline-1",
      "edition-block-35-group-0-inline-3",
      "edition-block-36-group-0-inline-0",
      "edition-block-38-group-0-inline-1",
      "edition-block-38-group-0-inline-3",
      "edition-block-39-group-0-inline-0",
      "edition-block-42-group-0-inline-1",
      "edition-block-43-group-0-inline-1",
      "edition-block-46-group-0-inline-1",
      "edition-block-51-group-0-inline-1",
      "edition-block-74-group-0-inline-0",
    ]);
    expect(occurrences).toHaveLength(30);
    for (const occurrence of occurrences) {
      expect(occurrence.preview).toEqual(
        expect.objectContaining({
          src: sourceSheet,
          width: 2320,
          height: 3408,
          alt: expect.stringContaining("Complete unmodified source drawing sheet 1 of 1"),
        }),
      );
    }

    const sourceSheetPath = join(rootDir, "public", sourceSheet);
    expect(existsSync(sourceSheetPath)).toBe(true);
    expect(createHash("sha256").update(readFileSync(sourceSheetPath)).digest("hex")).toBe(
      "995bf0d92d185edd7719ee76acf6d1db94b3ff4cc06ac787c6cf2534db747fa7",
    );
    for (const legacyAsset of [
      "fig-1-source-crop-v1.png",
      "fig-2-source-crop-v1.png",
      "fig-3-source-crop-v1.png",
      "fig-4-source-crop-v1.png",
      "fig-5-source-crop-v1.png",
      "fig-6-source-crop-v1.png",
      "fig-7-source-crop-v1.png",
      "fig-8-source-crop-v1.png",
      "fig-9-source-crop-v1.png",
      "fig-10-source-crop-v1.png",
    ]) {
      expect(
        existsSync(
          join(
            rootDir,
            "public/patents/figures/us-2297691-carlson-electrophotography",
            legacyAsset,
          ),
        ),
      ).toBe(true);
    }

    const provenance = readFileSync(
      join(rootDir, "docs/provenance/us-2297691-carlson-electrophotography.md"),
      "utf8",
    );
    expect(provenance).toContain("## Source-sheet acceptance (2026-09-03)");
    expect(provenance).toContain("All 30");
    expect(provenance).toContain(
      "995bf0d92d185edd7719ee76acf6d1db94b3ff4cc06ac787c6cf2534db747fa7",
    );
  });

  test("exposes all 27 printed claims via dynamic single-source lookup", () => {
    for (let c = 1; c <= 27; c++) {
      const textVal = manualCarlsonClaimText(c);
      expect(textVal).toBeDefined();
      expect(textVal.length).toBeGreaterThan(30);
    }
  });

  test("validates parallel readings map covers the archival paragraph blocks", () => {
    const paragraphIndexes = carlsonElectrophotographyArchivalEdition.blocks
      .map((block, idx) => (block.kind === "paragraph" ? idx : null))
      .filter((idx): idx is number => idx !== null);

    for (const idx of paragraphIndexes) {
      const readings = carlsonElectrophotographyParallelReadings[idx];
      expect(readings).toBeDefined();
      expect(readings?.length).toBeGreaterThan(0);
      expect(readings?.[0].trim().length).toBeGreaterThan(40);
    }
  });

  test("provides valid provenance classifications for all Carlson controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-2297691-carlson-electrophotography"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });
});
