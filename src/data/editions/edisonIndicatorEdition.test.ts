import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { edisonIndicatorPatent } from "@/data/patents/edison-indicator";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  edisonIndicatorArchivalEdition,
  edisonIndicatorClaimText,
  edisonIndicatorParallelReadings,
} from "./edisonIndicatorEdition";

const EXPECTED_FIGURE_PREVIEWS = {
  "Figure 1": {
    src: "/patents/figures/us-307031-edison-indicator/fig-1-source-crop-v2.png",
    width: 1740,
    height: 1120,
  },
  "Fig. 2": {
    src: "/patents/figures/us-307031-edison-indicator/fig-2-source-crop-v2.png",
    width: 1750,
    height: 360,
  },
  "Fig. 3": {
    src: "/patents/figures/us-307031-edison-indicator/fig-3-source-crop-v3.png",
    width: 1080,
    height: 480,
  },
  "Fig. 4": {
    src: "/patents/figures/us-307031-edison-indicator/fig-4-source-crop-v2.png",
    width: 340,
    height: 500,
  },
} as const;

function pngDimensions(path: string): { width: number; height: number } {
  const bytes = readFileSync(path);
  expect(bytes.subarray(1, 4).toString("ascii")).toBe("PNG");
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

describe("US 307,031 Thomas Edison Electrical Indicator Archival Edition", () => {
  const root = process.cwd();
  const ledgerPath = join(
    root,
    "public/patents/transcripts/us-307031-edison-indicator-reviewed.txt",
  );

  it("links the published archival edition and reviewed transcript", () => {
    expect(edisonIndicatorPatent.archivalEdition).toBeDefined();
    expect(edisonIndicatorPatent.originalTextAsset).toBeDefined();
  });
  const pdfPath = join(root, "public/patents/pdfs/us-307031-edison-indicator.pdf");

  it("satisfies the curated archival edition contract", () => {
    expect(existsSync(ledgerPath)).toBe(true);
    expect(existsSync(pdfPath)).toBe(true);

    const ledgerText = readFileSync(ledgerPath, "utf8");
    const editionResult = validateCuratedSpecificationEdition(edisonIndicatorArchivalEdition);
    expect(editionResult.valid).toBe(true);
    expect(editionResult.errors).toEqual([]);

    const ledgerResult = validateReviewedTranscription(ledgerText, 3);
    expect(ledgerResult.valid).toBe(true);

    expect(edisonIndicatorArchivalEdition.sourcePdfSha256).toBe(
      "f36bc6aa879d42a3f495a9bda05871bb6181aa1979e6baa03b258c42d6a30c13",
    );
  });

  it("contains all 8 printed claims with authentic source text", () => {
    const claimBlocks = edisonIndicatorArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claimBlocks.length).toBe(8);

    for (let i = 1; i <= 8; i++) {
      const claimText = edisonIndicatorClaimText(i);
      expect(claimText).toBeTruthy();
      expect(claimText.length).toBeGreaterThan(30);
      expect(claimText.startsWith(`${i}.`)).toBe(true);
    }
  });

  it("provides non-empty parallel readings for every paragraph block", () => {
    edisonIndicatorArchivalEdition.blocks.forEach((block, index) => {
      if (block.kind === "paragraph") {
        const readings = edisonIndicatorParallelReadings[index];
        expect(readings).toBeDefined();
        expect(readings.length).toBeGreaterThan(0);
        expect(readings[0].length).toBeGreaterThan(20);
      }
    });
  });

  it("maps every Figure occurrence to its exact clean source crop", () => {
    const figureReferences = edisonIndicatorArchivalEdition.blocks
      .flatMap((block) => (block.kind === "paragraph" ? block.inlines : []))
      .filter((inline) => inline.kind === "reference" && inline.referenceType === "figure");

    expect(figureReferences).toHaveLength(6);
    for (const reference of figureReferences) {
      if (reference.kind !== "reference") continue;
      const expected =
        EXPECTED_FIGURE_PREVIEWS[reference.text as keyof typeof EXPECTED_FIGURE_PREVIEWS];
      expect(expected).toBeDefined();
      expect(reference.figurePreviews).toHaveLength(1);

      const [preview] = reference.figurePreviews ?? [];
      expect(preview).toEqual(expect.objectContaining(expected));

      const fullPath = join(root, "public", preview.src.replace(/^\//, ""));
      expect(existsSync(fullPath)).toBe(true);
      expect(pngDimensions(fullPath)).toEqual({
        width: expected.width,
        height: expected.height,
      });
    }
  });
});
