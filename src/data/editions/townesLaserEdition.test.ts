import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  manualTownesClaimText,
  townesLaserArchivalEdition,
  townesLaserParallelReadings,
} from "./townesLaserEdition";

describe("US 2,929,922 Townes & Schawlow Optical Maser / Laser Archival Edition Publication Contract", () => {
  const rootDir = process.cwd();
  const pdfPath = join(rootDir, "public/patents/pdfs/us-2929922-townes-laser.pdf");
  const transcriptPath = join(
    rootDir,
    "public/patents/transcripts/us-2929922-townes-laser-reviewed.txt",
  );

  test("passes full curated specification validation suite with zero errors", () => {
    const result = validateCuratedSpecificationEdition(townesLaserArchivalEdition);
    expect(result).toEqual({ valid: true, errors: [] });
  });

  test("matches the cryptographic SHA-256 digest of the pinned 5-page USPTO facsimile PDF", () => {
    expect(existsSync(pdfPath)).toBe(true);
    const buffer = readFileSync(pdfPath);
    const computedDigest = createHash("sha256").update(buffer).digest("hex");

    expect(townesLaserArchivalEdition.sourcePdfSha256).toBe(
      "0c67f2d45609a1d465f75530c733c7c2feffb87994fa62392cf79f7e737d9270",
    );
    expect(computedDigest).toBe(townesLaserArchivalEdition.sourcePdfSha256);
  });

  test("pins and validates the 5-page reviewed ledger transcript", () => {
    expect(existsSync(transcriptPath)).toBe(true);
    const transcript = readFileSync(transcriptPath, "utf-8");

    for (let page = 1; page <= 5; page++) {
      expect(transcript).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${page} OF 5 ---`);
    }
  });

  test("proves literal ledger coverage for all source sections and printed claims", () => {
    const { townesLaserPatent } = require("@/data/patents/townes-laser");
    const {
      reviewedLedgerPublicationEvidenceFor,
    } = require("./reviewedLedgerPublicationEvidence.server");
    const evidence = reviewedLedgerPublicationEvidenceFor(townesLaserPatent);

    expect(evidence).toMatchObject({
      status: "verified",
      valid: true,
      authoredSectionCount: 50,
      coveredSectionCount: 50,
      coverageFraction: 1,
      missingSectionIndexes: [],
      missingClaimNumbers: [],
      error: null,
    });
  });

  test("verifies all referenced source figure crops exist on disk", () => {
    const sourceSheet = {
      src: "/patents/figures/us-2929922-townes-laser/sheet-1-1.png",
      width: 2320,
      height: 3408,
      sha256: "1ea31b81c55171a0c6ced97ed94d80eedb442e4f81bb6248d1ebee8e81648283",
    } as const;
    for (const block of townesLaserArchivalEdition.blocks) {
      if (block.kind === "paragraph" || block.kind === "claim") {
        for (const inline of block.inlines) {
          if (inline.kind === "reference" && inline.figurePreviews) {
            for (const prev of inline.figurePreviews) {
              const cropPath = join(rootDir, "public", prev.src.replace(/^\//, ""));
              expect(existsSync(cropPath)).toBe(true);
              expect(prev).toMatchObject({
                src: sourceSheet.src,
                width: sourceSheet.width,
                height: sourceSheet.height,
              });
            }
          }
        }
      }
    }
    const bytes = readFileSync(join(rootDir, "public", sourceSheet.src));
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(sourceSheet.sha256);
    expect(bytes.readUInt32BE(16)).toBe(sourceSheet.width);
    expect(bytes.readUInt32BE(20)).toBe(sourceSheet.height);
  });

  test("exposes all 11 printed claims via dynamic single-source lookup", () => {
    for (let c = 1; c <= 11; c++) {
      const textVal = manualTownesClaimText(c);
      expect(textVal).toBeDefined();
      expect(textVal.length).toBeGreaterThan(30);
    }
  });

  test("validates parallel readings map covers the archival paragraph blocks", () => {
    const paragraphIndexes = townesLaserArchivalEdition.blocks
      .map((block, idx) => (block.kind === "paragraph" ? idx : null))
      .filter((idx): idx is number => idx !== null);

    for (const idx of paragraphIndexes) {
      const readings = townesLaserParallelReadings[idx];
      expect(readings).toBeDefined();
      expect(readings?.length).toBeGreaterThan(0);
      expect(readings?.[0].trim().length).toBeGreaterThan(40);
    }
  });

  test("provides valid provenance classifications for all Townes controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-2929922-townes-laser"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("accepts the complete source-sheet evidence in publication state", () => {
    const { evaluateArchivalPublicationState } = require("./publicationApproval");
    const { townesLaserPatent } = require("@/data/patents/townes-laser");
    const decision = evaluateArchivalPublicationState(townesLaserPatent);
    expect(decision.isPublished).toBe(true);
    expect(decision.state.kind).toBe("accepted");
    expect(decision.reasonCode).toBe("ACCEPTED");
    expect(decision.figureManifest).toMatchObject({
      requiredFigureCount: 11,
      acceptedFigureCount: 11,
    });
  });
});
