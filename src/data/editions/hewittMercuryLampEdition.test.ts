import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { CuratedSpecificationInline } from "@/types/patent";
import { hewittMercuryLampPatent } from "../patents/hewitt-mercury-lamp";
import {
  hewittMercuryLampArchivalEdition,
  hewittMercuryLampParallelReadings,
  manualHewittClaimText,
} from "./hewittMercuryLampEdition";
import { evaluateReviewedLedgerTextEvidence } from "./reviewedLedgerPublicationEvidence";

const COMPLETE_SOURCE_SHEETS = {
  1: {
    src: "/patents/figures/us-682690-hewitt-mercury-lamp/sheet-01.png",
    sha256: "5d54d50eee4fccb26abf2dd91ff91845d2313f823f570ec73c53824f00c14087",
    width: 1160,
    height: 1704,
  },
  2: {
    src: "/patents/figures/us-682690-hewitt-mercury-lamp/sheet-02.png",
    sha256: "576ae1326f6d3b075a0157b04fb3c5c51b37564f695249d26f7a98dd65d39aab",
    width: 1160,
    height: 1704,
  },
} as const;

describe("US 682,690 Peter Cooper Hewitt Electric Lamp Archival Edition Publication Contract", () => {
  const rootDir = process.cwd();
  const pdfPath = join(rootDir, "public/patents/pdfs/us-682690-hewitt-mercury-lamp.pdf");
  const transcriptPath = join(
    rootDir,
    "public/patents/transcripts/us-682690-hewitt-mercury-lamp-reviewed.txt",
  );
  const completeSourceSheetPaths = Object.values(COMPLETE_SOURCE_SHEETS).map(({ src }) =>
    join(rootDir, "public", src),
  );

  test("publishes the verified archival edition in the catalog record", () => {
    expect(hewittMercuryLampPatent.archivalEdition).toBe(hewittMercuryLampArchivalEdition);
    expect(hewittMercuryLampPatent.originalTextAsset).toBeDefined();
  });

  test("pins the immutable source PDF and matches SHA-256 digest", () => {
    expect(existsSync(pdfPath)).toBe(true);
    const buffer = readFileSync(pdfPath);
    const hash = createHash("sha256").update(buffer).digest("hex");
    expect(hash).toBe("bd849330e1ed6e530d0654413016c7e77eda792d0519628ca1bae5747065c74d");
    expect(hewittMercuryLampArchivalEdition.sourcePdfSha256).toBe(hash);
  });

  test("binds each active figure citation to a complete primary-source drawing sheet", () => {
    const figureReferences = hewittMercuryLampArchivalEdition.blocks.flatMap((block) => {
      if (block.kind !== "paragraph" && block.kind !== "claim") return [];
      return block.inlines.filter(
        (inline): inline is Extract<CuratedSpecificationInline, { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });

    expect(figureReferences).toHaveLength(3);
    const [sheetOne, sheetTwo] = Object.values(COMPLETE_SOURCE_SHEETS);
    expect(figureReferences.map((reference) => reference.figurePreviews?.[0])).toEqual([
      expect.objectContaining({
        src: sheetOne.src,
        width: sheetOne.width,
        height: sheetOne.height,
      }),
      expect.objectContaining({
        src: sheetOne.src,
        width: sheetOne.width,
        height: sheetOne.height,
      }),
      expect.objectContaining({
        src: sheetTwo.src,
        width: sheetTwo.width,
        height: sheetTwo.height,
      }),
    ]);

    for (const [index, sourceSheet] of Object.values(COMPLETE_SOURCE_SHEETS).entries()) {
      const path = completeSourceSheetPaths[index];
      expect(path).toBeDefined();
      expect(existsSync(path)).toBe(true);
      expect(createHash("sha256").update(readFileSync(path)).digest("hex")).toBe(
        sourceSheet.sha256,
      );
    }
  });

  test("confirms reviewed transcript ledger exists and contains page markers", () => {
    expect(existsSync(transcriptPath)).toBe(true);
    const transcript = readFileSync(transcriptPath, "utf-8");
    expect(transcript).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 13 ---");
    expect(transcript).toContain("682,690");
    expect(transcript).toContain("PETER COOPER HEWITT");
  });

  test("pins the complete edition to literal primary-source ledger text", () => {
    const evidence = evaluateReviewedLedgerTextEvidence(
      hewittMercuryLampPatent,
      readFileSync(transcriptPath, "utf-8"),
    );
    expect(evidence).toMatchObject({
      status: "verified",
      valid: true,
      authoredSectionCount: 45,
      coveredSectionCount: 45,
      coverageFraction: 1,
      missingSectionIndexes: [],
      missingClaimNumbers: [],
    });
  });

  test("exposes all printed claims via dynamic single-source lookup", () => {
    for (let c = 1; c <= 31; c++) {
      const claimText = manualHewittClaimText(c);
      expect(claimText.length).toBeGreaterThan(20);
    }
  });

  test("validates parallel readings map covers the archival paragraph blocks", () => {
    const paragraphBlocks = hewittMercuryLampArchivalEdition.blocks
      .map((b, idx) => ({ b, idx }))
      .filter(({ b }) => b.kind === "paragraph");

    for (const { idx } of paragraphBlocks) {
      const readings = hewittMercuryLampParallelReadings[idx];
      expect(readings).toBeDefined();
      expect(readings?.length).toBeGreaterThan(0);
      expect(readings?.[0]?.length).toBeGreaterThan(25);
    }
  });

  test("provides valid provenance classifications for all Hewitt controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-682690-hewitt-mercury-lamp"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("records a complete-facsimile review without making source reading conditional on it", () => {
    expect(hewittMercuryLampArchivalEdition.completeFacsimileReviewed).toBe(true);
  });
});
