import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { maimanRubyLaserPatent } from "@/data/patents/maiman-ruby-laser";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionEditorialIntegrity,
} from "@/data/patents/sourceTextValidation";
import type { CuratedSpecificationBlock } from "@/types/patent";
import {
  maimanRubyLaserArchivalEdition,
  maimanRubyLaserParallelReadings,
  manualMaimanClaimText,
} from "./maimanRubyLaserEdition";

const EXPECTED_PDF_SHA256 = "3222cc08d6662719dba7566e07f96f3d1687dda40d6fe213ac9993ceb1ba03e6";

const FIGURE_CROPS = [
  {
    fig: 1,
    file: "fig-1-source-crop-v1.png",
    width: 1720,
    height: 1020,
    sha256: "1ca7bdd3af4a741f6b0119c99a21484e03ee0fc95d147971b737953d65f7a698",
  },
  {
    fig: 2,
    file: "fig-2-source-crop-v1.png",
    width: 1720,
    height: 500,
    sha256: "59dc20786735665312ea45a26080d36accb1f94823175715d188fdf76fd1133a",
  },
  {
    fig: 3,
    file: "fig-3-source-crop-v1.png",
    width: 1720,
    height: 680,
    sha256: "79a8280830b5ed17fb4c37b863c7b0fa8779c0b7c2cc2c27aa6adff169e0330a",
  },
  {
    fig: 4,
    file: "fig-4-source-crop-v1.png",
    width: 1720,
    height: 650,
    sha256: "80e1a49819d1d2b50299cc30ff4b5974963d6e3972a626c7d56eef4a671b7cf2",
  },
  {
    fig: 5,
    file: "fig-5-source-crop-v1.png",
    width: 1720,
    height: 450,
    sha256: "f4ebdc5169827558f563173836b46e49ddb2497af9a4678735cb788369c2ad1a",
  },
  {
    fig: 6,
    file: "fig-6-source-crop-v1.png",
    width: 1720,
    height: 490,
    sha256: "1e930a5a0776f0a2eebf96cc5c88efc84ff818e287388788e39d53f7bdf1d31d",
  },
  {
    fig: 7,
    file: "fig-7-source-crop-v1.png",
    width: 1720,
    height: 580,
    sha256: "003a9d6eb1210d7df56f1dce186d7bc6f6145a143245ed1858f6db642be7608d",
  },
  {
    fig: 8,
    file: "fig-8-source-crop-v1.png",
    width: 1720,
    height: 750,
    sha256: "39ecdba81e80078599a33d000d4308ab7bb3a6be659e86810c91b0fcc21ba6af",
  },
  {
    fig: 9,
    file: "fig-9-source-crop-v1.png",
    width: 1720,
    height: 700,
    sha256: "f9f71f634467ab53556ca988d98ed57f61331325c0e03317b58bfef8d458d039",
  },
  {
    fig: 10,
    file: "fig-10-source-crop-v1.png",
    width: 900,
    height: 650,
    sha256: "9edc2f27fe7c4b6f908dca9ab2f445deefc7b14948dbb3839e5ade5c3eaac040",
  },
  {
    fig: 11,
    file: "fig-11-source-crop-v1.png",
    width: 900,
    height: 650,
    sha256: "aa912a2224fcadce4119895d417cd681e97896d552d12f2580b3eb6a0b136158",
  },
  {
    fig: 12,
    file: "fig-12-source-crop-v1.png",
    width: 1720,
    height: 620,
    sha256: "319caa9d9bf277699fb09203faae3ca2e0eaff18066a908aaa7979f5fdf3a03b",
  },
  {
    fig: 13,
    file: "fig-13-source-crop-v1.png",
    width: 1720,
    height: 620,
    sha256: "1e7a2f25bd634a673e686340f158ee6dc88646be7896b1ec75bd817001297f0c",
  },
  {
    fig: 14,
    file: "fig-14-source-crop-v1.png",
    width: 1720,
    height: 350,
    sha256: "e63993a90d05242c881dbdc56ab0d3f30ad694f90c49f2b470a19bfd1b9c2060",
  },
  {
    fig: 15,
    file: "fig-15-source-crop-v1.png",
    width: 1720,
    height: 560,
    sha256: "4c19bbb24f682f5fa14e2ec07c04406343685cac48e3c318ed2af097890636b3",
  },
  {
    fig: 16,
    file: "fig-16-source-crop-v1.png",
    width: 1720,
    height: 650,
    sha256: "694b12ca0087abd6e3c1ec5e2207a22aa38122d11178f269f578f56eea7cf18a",
  },
  {
    fig: 17,
    file: "fig-17-source-crop-v1.png",
    width: 1720,
    height: 550,
    sha256: "c7300dff55f1639d3eae834b16b95be97d949ba4487af985a5cf1cc879e7687a",
  },
  {
    fig: 18,
    file: "fig-18-source-crop-v1.png",
    width: 1800,
    height: 900,
    sha256: "f61c38a89da7888c802b7a9ccaceab0cfe44b8ec835c9f6512359f6df9db0b98",
  },
] as const;

const SOURCE_SHEETS = [
  {
    sourcePdfPage: 1,
    file: "sheet-1-01.png",
    sha256: "d1a4ce060e2cfa1ef093df3baf853ed837299f16438090893754c5f7216ef898",
  },
  {
    sourcePdfPage: 2,
    file: "sheet-2-02.png",
    sha256: "95eceb8df7e723a6f90ee38f32a940a437c626ba31776d525340f03f897c9e7e",
  },
  {
    sourcePdfPage: 3,
    file: "sheet-3-03.png",
    sha256: "15f1b618e64fa04356a907364539be06f00057a6baa5c923d75c6e75d2d81117",
  },
  {
    sourcePdfPage: 4,
    file: "sheet-4-04.png",
    sha256: "6e29ba1d4bfc34b9e9fb1956e03a9a5c2085e183ebc96f1c4cfd0cc76fbcaf33",
  },
  {
    sourcePdfPage: 5,
    file: "sheet-5-05.png",
    sha256: "ae8ede41e4731be156d91c4f7444765250419ccc92ea88abbf63d53779c5a779",
  },
] as const;

const SOURCE_PDF_PAGE_BY_FIGURE = {
  1: 1,
  2: 1,
  3: 1,
  4: 2,
  5: 2,
  6: 2,
  7: 2,
  8: 3,
  9: 3,
  10: 3,
  11: 3,
  12: 4,
  13: 4,
  14: 4,
  15: 4,
  16: 5,
  17: 5,
  18: 5,
} as const;

const ACTIVE_FIGURE_OCCURRENCE_PAGES = {
  "edition-block-2-group-0-inline-1": 1,
  "edition-block-2-group-0-inline-3": 1,
  "edition-block-2-group-0-inline-5": 1,
  "edition-block-3-group-0-inline-1": 2,
  "edition-block-3-group-0-inline-3": 2,
  "edition-block-3-group-0-inline-5": 2,
  "edition-block-3-group-0-inline-7": 2,
  "edition-block-4-group-0-inline-1": 3,
  "edition-block-4-group-0-inline-3": 3,
  "edition-block-4-group-0-inline-5": 3,
  "edition-block-4-group-0-inline-7": 3,
  "edition-block-5-group-0-inline-1": 4,
  "edition-block-5-group-0-inline-3": 4,
  "edition-block-5-group-0-inline-5": 4,
  "edition-block-5-group-0-inline-7": 4,
  "edition-block-6-group-0-inline-1": 5,
  "edition-block-6-group-0-inline-3": 5,
  "edition-block-6-group-0-inline-5": 5,
  "edition-block-17-group-0-inline-1": 1,
  "edition-block-17-group-0-inline-3": 1,
  "edition-block-17-group-0-inline-5": 1,
  "edition-block-17-group-0-inline-7": 2,
  "edition-block-17-group-0-inline-9": 2,
  "edition-block-17-group-0-inline-11": 2,
  "edition-block-17-group-0-inline-13": 2,
  "edition-block-17-group-0-inline-15": 2,
  "edition-block-17-group-0-inline-17": 3,
  "edition-block-17-group-0-inline-19": 3,
  "edition-block-17-group-0-inline-21": 3,
  "edition-block-17-group-0-inline-23": 3,
  "edition-block-17-group-0-inline-25": 4,
  "edition-block-17-group-0-inline-27": 4,
  "edition-block-17-group-0-inline-29": 4,
  "edition-block-17-group-0-inline-31": 4,
  "edition-block-17-group-0-inline-33": 5,
  "edition-block-17-group-0-inline-35": 5,
  "edition-block-17-group-0-inline-37": 5,
  "edition-block-20-group-0-inline-1": 1,
  "edition-block-22-group-0-inline-1": 1,
  "edition-block-23-group-0-inline-0": 1,
  "edition-block-24-group-0-inline-1": 2,
  "edition-block-25-group-0-inline-1": 2,
  "edition-block-26-group-0-inline-0": 2,
  "edition-block-26-group-0-inline-2": 2,
  "edition-block-27-group-0-inline-0": 3,
  "edition-block-28-group-0-inline-0": 3,
  "edition-block-29-group-0-inline-0": 3,
  "edition-block-29-group-0-inline-2": 3,
  "edition-block-30-group-0-inline-0": 4,
  "edition-block-31-group-0-inline-0": 4,
  "edition-block-32-group-0-inline-0": 4,
  "edition-block-32-group-0-inline-2": 4,
  "edition-block-32-group-0-inline-4": 4,
  "edition-block-32-group-0-inline-6": 4,
  "edition-block-33-group-0-inline-0": 5,
  "edition-block-33-group-0-inline-2": 5,
  "edition-block-33-group-0-inline-4": 5,
  "edition-block-33-group-0-inline-6": 5,
  "edition-block-34-group-0-inline-1": 5,
} as const;

function readPngDimensions(bytes: Buffer): { width: number; height: number } {
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

describe("US 3,353,115 Theodore H. Maiman Ruby Laser Archival Edition Contract", () => {
  test("pins the immutable facsimile PDF with matching lowercase SHA-256", () => {
    const pdfPath = join(process.cwd(), "public/patents/pdfs/us-3353115-maiman-ruby-laser.pdf");
    expect(existsSync(pdfPath)).toBe(true);

    const pdfBytes = readFileSync(pdfPath);
    const pdfSha256 = createHash("sha256").update(pdfBytes).digest("hex");
    expect(pdfSha256).toBe(EXPECTED_PDF_SHA256);
    expect(maimanRubyLaserPatent.originalTextAsset?.sourcePdfSha256).toBe(EXPECTED_PDF_SHA256);
    expect(maimanRubyLaserArchivalEdition.sourcePdfSha256).toBe(EXPECTED_PDF_SHA256);
  });

  test("retains all 18 legacy figure crops on disk with exact dimensions and digests", () => {
    const figDir = join(process.cwd(), "public/patents/figures/us-3353115-maiman-ruby-laser");
    for (const crop of FIGURE_CROPS) {
      const cropPath = join(figDir, crop.file);
      expect(existsSync(cropPath)).toBe(true);
      const bytes = readFileSync(cropPath);
      const sha = createHash("sha256").update(bytes).digest("hex");
      expect(sha).toBe(crop.sha256);
      const dims = readPngDimensions(bytes);
      expect(dims.width).toBe(crop.width);
      expect(dims.height).toBe(crop.height);
    }
  });

  test("binds every active figure occurrence to its complete primary drawing sheet", () => {
    const occurrences: {
      occurrenceKey: string;
      figureNumber: number;
      referenceText: string;
      preview: { src: string; alt: string; width: number; height: number } | undefined;
    }[] = [];

    maimanRubyLaserArchivalEdition.blocks.forEach((block, blockIndex) => {
      const inlineGroups =
        block.kind === "figure-sheet"
          ? [block.description]
          : block.kind === "paragraph" || block.kind === "claim"
            ? [block.inlines]
            : [];
      inlineGroups.forEach((inlines, groupIndex) => {
        inlines.forEach((inline, inlineIndex) => {
          if (inline.kind !== "reference" || inline.referenceType !== "figure") return;
          const figureNumber = Number(inline.href?.match(/^#figure-(\d+)$/)?.[1]);
          occurrences.push({
            occurrenceKey: `edition-block-${blockIndex}-group-${groupIndex}-inline-${inlineIndex}`,
            figureNumber,
            referenceText: inline.text,
            preview: inline.figurePreviews?.[0],
          });
        });
      });
    });

    expect(occurrences).toHaveLength(59);
    expect(
      Object.fromEntries(
        occurrences.map(({ occurrenceKey, figureNumber }) => [
          occurrenceKey,
          figureNumber
            ? SOURCE_PDF_PAGE_BY_FIGURE[figureNumber as keyof typeof SOURCE_PDF_PAGE_BY_FIGURE]
            : undefined,
        ]),
      ),
    ).toEqual(ACTIVE_FIGURE_OCCURRENCE_PAGES);

    for (const occurrence of occurrences) {
      const sourcePdfPage =
        SOURCE_PDF_PAGE_BY_FIGURE[
          occurrence.figureNumber as keyof typeof SOURCE_PDF_PAGE_BY_FIGURE
        ];
      const sourceSheet = SOURCE_SHEETS.find((sheet) => sheet.sourcePdfPage === sourcePdfPage);
      expect(sourceSheet).toBeDefined();
      expect(occurrence.preview).toEqual({
        src: `/patents/figures/us-3353115-maiman-ruby-laser/${sourceSheet?.file}`,
        alt: `${occurrence.referenceText}, complete primary drawing sheet ${sourcePdfPage} from US 3,353,115`,
        width: 2320,
        height: 3408,
      });
    }

    for (const sourceSheet of SOURCE_SHEETS) {
      const sourceSheetPath = join(
        process.cwd(),
        "public/patents/figures/us-3353115-maiman-ruby-laser",
        sourceSheet.file,
      );
      expect(existsSync(sourceSheetPath)).toBe(true);
      const bytes = readFileSync(sourceSheetPath);
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(sourceSheet.sha256);
      expect(readPngDimensions(bytes)).toEqual({ width: 2320, height: 3408 });
    }
  });

  test("passes full structural validation for the curated specification edition", () => {
    expect(validateCuratedSpecificationEdition(maimanRubyLaserArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
  });

  test("verifies reviewed transcript ledger with 10-page markers and editorial integrity", () => {
    const ledgerPath = join(
      process.cwd(),
      "public/patents/transcripts/us-3353115-maiman-ruby-laser-reviewed.txt",
    );
    expect(existsSync(ledgerPath)).toBe(true);

    const ledgerText = readFileSync(ledgerPath, "utf8");
    expect(validateReviewedTranscription(ledgerText, 10)).toEqual({ valid: true });
    expect(validateReviewedTranscriptionEditorialIntegrity(ledgerText, 10)).toEqual({
      valid: true,
    });
  });

  test("derives all 2 printed claims dynamically from the manual edition", () => {
    const claim1 = manualMaimanClaimText(1);
    const claim2 = manualMaimanClaimText(2);

    expect(claim1).toContain("A three energy level laser comprising: a ruby having atoms");
    expect(claim1).toContain("population inversion");
    expect(claim1).toContain("interferometer means");
    expect(claim2).toContain(
      "A three energy level ruby laser system, comprising: a ruby having atoms",
    );
    expect(claim2).toContain("radiationless energy transition");
    expect(claim2).toContain("regenerative optical path");

    expect(maimanRubyLaserPatent.claims).toHaveLength(2);
    expect(maimanRubyLaserPatent.claims[0].originalText).toBe(claim1);
    expect(maimanRubyLaserPatent.claims[1].originalText).toBe(claim2);
  });

  test("binds each paragraph to a non-lossy parallel reading", () => {
    const paragraphIndices: number[] = [];
    maimanRubyLaserArchivalEdition.blocks.forEach(
      (block: CuratedSpecificationBlock, idx: number) => {
        if (block.kind === "paragraph") {
          paragraphIndices.push(idx);
        }
      },
    );

    for (const idx of paragraphIndices) {
      const readings = maimanRubyLaserParallelReadings[idx];
      expect(readings).toBeDefined();
      expect(Array.isArray(readings)).toBe(true);
      expect(readings.length).toBeGreaterThan(0);
      for (const r of readings) {
        expect(r.trim().length).toBeGreaterThan(20);
      }
    }
  });

  test("provides valid provenance classifications for all Maiman controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-3353115-maiman-ruby-laser"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("keeps a remaining ledger audit distinct from completed figure acceptance", () => {
    const { evaluateArchivalPublicationState } = require("./publicationApproval");
    const decision = evaluateArchivalPublicationState(maimanRubyLaserPatent);
    expect(decision.isPublished).toBe(false);
    expect(decision.state.kind).toBe("held");
    expect(decision.reasonCode).toBe("LEDGER_CONTENT_COVERAGE_INCOMPLETE");
  });
});
