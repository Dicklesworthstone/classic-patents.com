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
import { evaluateArchivalPublicationState, patentForSourceReader } from "./publicationApproval";

const EXPECTED_FIGURE_PREVIEWS = {
  "Figure 1": {
    src: "/patents/figures/us-307031-edison-indicator/source-sheet-1-v1.png",
    width: 2320,
    height: 3408,
  },
  "Fig. 2": {
    src: "/patents/figures/us-307031-edison-indicator/source-sheet-1-v1.png",
    width: 2320,
    height: 3408,
  },
  "Fig. 3": {
    src: "/patents/figures/us-307031-edison-indicator/source-sheet-1-v1.png",
    width: 2320,
    height: 3408,
  },
  "Fig. 4": {
    src: "/patents/figures/us-307031-edison-indicator/source-sheet-1-v1.png",
    width: 2320,
    height: 3408,
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

  it("keeps every canonical claim synchronized with the explicit edition nodes", () => {
    expect(edisonIndicatorPatent.claims).toHaveLength(8);
    const ledgerText = readFileSync(ledgerPath, "utf8");

    for (const claim of edisonIndicatorPatent.claims) {
      expect(claim.originalText).toBe(edisonIndicatorClaimText(claim.number));
      expect(ledgerText).toContain(claim.originalText);
      expect(claim.plainEnglish.trim().split(/\s+/).length).toBeGreaterThanOrEqual(30);
      expect(claim.keyInnovations.length).toBeGreaterThan(0);
      expect(new Set(claim.keyInnovations).size).toBe(claim.keyInnovations.length);
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

  it("maps every Figure occurrence to its exact, unmodified source sheet", () => {
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

  it("provides valid provenance classifications for all Edison Indicator controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-307031-edison-indicator"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  it("registers explicit energy channel omission reason for Edison Indicator", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-307031-edison-indicator"]).toBeDefined();
    expect(energyChannelsFor("us-307031-edison-indicator", {})).toEqual([]);
  });

  it("accepts all independently reviewed figure occurrences without gating the source reader", () => {
    const decision = evaluateArchivalPublicationState(edisonIndicatorPatent);
    expect(decision.isPublished).toBe(true);
    expect(decision.state.kind).toBe("accepted");
    expect(decision.reasonCode).toBe("ACCEPTED");

    const readerPatent = patentForSourceReader(edisonIndicatorPatent, decision);
    expect(readerPatent.archivalEdition).toBe(edisonIndicatorArchivalEdition);
  });
});
