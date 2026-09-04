import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  completeArchivalEditionForViewer,
  evaluateArchivalPublicationState,
} from "@/data/editions/publicationApproval";
import { mccormickReaperPatent } from "../patents/mccormick-reaper";
import {
  validateReviewedTranscriptionEditorialIntegrity,
  validateReviewedTranscriptionPageAnchors,
} from "../patents/sourceTextValidation";
import { ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS } from "./archivalFigureAcceptance";
import { FIGURE_OCCURRENCE_SOURCE_LOCATORS } from "./figureOccurrenceSourceLocators";
import {
  mccormickReaperArchivalEdition,
  mccormickReaperParallelReadings,
} from "./mccormickReaperEdition";
import { evaluateReviewedLedgerTextEvidence } from "./reviewedLedgerPublicationEvidence";

const servedFigureUrl = "/patents/figures/us-x8277-mccormick-reaper/source-sheet-1-v1.png";
const servedFigurePath = join(process.cwd(), "public", servedFigureUrl.replace(/^\//, ""));
const servedFigureSha256 = "ccaf8f0f56d335c1a980cc81e8c336066eb43a33af00f4e0522376b0b034e4d5";

function pngDimensions(path: string): { width: number; height: number } {
  const bytes = readFileSync(path);
  expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

describe("mccormickReaperArchivalEdition", () => {
  test("pins the entire three-sheet facsimile in a continuous manual edition", () => {
    expect(validateCuratedSpecificationEdition(mccormickReaperArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(mccormickReaperArchivalEdition.sourcePdfSha256).toBe(
      "24712ca3e966994d72716ccca6df6ef9a1fb3751b30fe34bfeb549ab6ba7f400",
    );
    expect(mccormickReaperArchivalEdition.completeFacsimileReviewed).toBe(true);

    const claims = mccormickReaperArchivalEdition.blocks.filter((block) => block.kind === "claim");
    expect(claims.map((claim) => claim.number)).toEqual([1, 2]);
  });

  test("keeps scan-page metadata and OCR output out of visitor-facing nodes", () => {
    const publicText = JSON.stringify(mccormickReaperArchivalEdition.blocks);
    expect(publicText).not.toContain("--- SOURCE PDF PAGE");
    expect(publicText).not.toContain("OCR");
    expect(publicText).not.toContain("Application filed April 19");
  });

  test("pins the complete served source drawing sheet, digest, and semantic mapping", () => {
    expect(existsSync(servedFigurePath)).toBe(true);
    expect(createHash("sha256").update(readFileSync(servedFigurePath)).digest("hex")).toBe(
      servedFigureSha256,
    );
    expect(pngDimensions(servedFigurePath)).toEqual({ width: 2320, height: 3408 });

    const preview = mccormickReaperArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "figure-sheet") {
        const inlines = Array.isArray(block.description) ? block.description : [];
        return inlines.flatMap((inline) =>
          inline.kind === "reference" ? (inline.figurePreviews ?? []) : [],
        );
      }
      if ("inlines" in block && Array.isArray(block.inlines)) {
        return block.inlines.flatMap((inline) =>
          inline.kind === "reference" ? (inline.figurePreviews ?? []) : [],
        );
      }
      return [];
    })[0];
    expect(preview).toMatchObject({
      src: servedFigureUrl,
      width: 2320,
      height: 3408,
    });
    expect(preview?.height).toBeGreaterThan(preview?.width ?? 0);

    const figureSheet = mccormickReaperArchivalEdition.blocks.find(
      (block) => block.kind === "figure-sheet",
    );
    expect(figureSheet?.kind).toBe("figure-sheet");
    if (figureSheet?.kind !== "figure-sheet") throw new Error("McCormick figure sheet is missing.");
    const figureReference = figureSheet.description.find((inline) => inline.kind === "reference");
    expect(figureReference).toMatchObject({
      kind: "reference",
      referenceType: "figure",
      text: "The single drawing sheet",
      figurePreviews: [{ src: servedFigureUrl }],
    });

    const drawing = mccormickReaperPatent.drawings.find(
      (candidate) => candidate.figureNumber === "Unnumbered drawing sheet",
    );
    expect(drawing?.svgType).toBe("mccormick-reaper");
    expect(drawing?.callouts.map((callout) => callout.label)).toEqual([
      "A",
      "B",
      "D",
      "L",
      "W",
      "T",
    ]);
    expect(drawing?.callouts.map((callout) => callout.element)).toEqual([
      "Platform",
      "Tongue",
      "Cross-bar",
      "Divider",
      "Reel",
      "Cutter",
    ]);

    for (const preservedHistoricalAsset of [
      "public/patents/figures/us-x8277-mccormick-reaper-drawing-preview-v2.png",
      "public/patents/figures/us-x8277-mccormick-reaper/drawing-preview-v2.png",
      "public/patents/figures/us-x8277-mccormick-reaper-drawing-preview.png",
      "public/patents/figures/us-x8277-mccormick-reaper/drawing-preview.png",
    ]) {
      expect(existsSync(join(process.cwd(), preservedHistoricalAsset))).toBe(true);
    }

    const acceptance = ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS["us-x8277-mccormick-reaper"];
    expect(acceptance).toMatchObject({
      sourcePdfSha256: mccormickReaperArchivalEdition.sourcePdfSha256,
      reviewer: "Classic Patents editorial agent (GPT-5.6); independent source-pixel review",
      reviewedAt: "2026-09-03",
      acceptanceBasis: "independent-figure-review",
      acceptedOccurrenceCount: 1,
      assets: {
        [servedFigureUrl]: { sha256: servedFigureSha256, width: 2320, height: 3408 },
      },
    });
    expect(FIGURE_OCCURRENCE_SOURCE_LOCATORS["us-x8277-mccormick-reaper"]).toEqual([
      expect.objectContaining({
        occurrenceKey: "edition-block-1-group-0-inline-1",
        activeAsset: servedFigureUrl,
        sourcePdfPage: 1,
        sourceRaster: { width: 2320, height: 3408 },
        sourceRectPixels: { x: 0, y: 0, width: 2320, height: 3408 },
        normalizedSourceRect: { x: 0, y: 0, width: 1, height: 1 },
        reviewer: "Classic Patents editorial agent (GPT-5.6); independent source-pixel review",
        reviewedAt: "2026-09-03",
        evidenceReference:
          "docs/provenance/us-x8277-mccormick-reaper.md#source-sheet-acceptance-2026-09-03",
      }),
    ]);
  });

  test("provides a non-lossy companion reading for every rendered paragraph block only", () => {
    const paragraphIndexes = [2, 3, 4, 5, 6, 7, 8, 12, 13, 14];
    expect(Object.keys(mccormickReaperParallelReadings).map(Number)).toEqual(paragraphIndexes);

    for (const index of paragraphIndexes) {
      expect(mccormickReaperParallelReadings[index]).toBeDefined();
      expect(mccormickReaperParallelReadings[index][0].length).toBeGreaterThan(30);
    }
  });

  test("derives all printed claims dynamically from edition without duplicate strings", () => {
    expect(mccormickReaperPatent.claims.length).toBe(2);
    const editionClaims = mccormickReaperArchivalEdition.blocks.filter(
      (b): b is Extract<typeof b, { kind: "claim" }> => b.kind === "claim",
    );
    expect(editionClaims.length).toBe(2);

    for (let i = 0; i < 2; i++) {
      const editionBlock = editionClaims[i];
      const expectedText = editionBlock.inlines.map((inl) => inl.text).join("");
      expect(mccormickReaperPatent.claims[i].originalText).toBe(expectedText);
    }
  });

  test("binds canonical reviewed ledger with complete ordered page markers", () => {
    const sourceAsset = mccormickReaperPatent.originalTextAsset;
    expect(sourceAsset).toBeDefined();
    expect(sourceAsset?.url).toBe("/patents/transcripts/us-x8277-mccormick-reaper-reviewed.txt");
    const ledgerPath = join(process.cwd(), `public${sourceAsset?.url}`);
    expect(existsSync(ledgerPath)).toBe(true);
    const ledger = readFileSync(ledgerPath, "utf8");
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 3 ---");
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 2 OF 3 ---");
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 3 OF 3 ---");
    expect(ledger).toContain("CYRUS H. McCORMICK");
  });

  test("keeps the physical source-sheet order and both claims auditable without gating the reader", () => {
    const sourceAsset = mccormickReaperPatent.originalTextAsset;
    if (!sourceAsset) throw new Error("US X8277 is missing its reviewed transcription asset.");
    const ledger = readFileSync(join(process.cwd(), `public${sourceAsset.url}`), "utf8");
    const pages = ledger.split(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/m).slice(1);

    expect(validateReviewedTranscriptionPageAnchors(ledger, 3, sourceAsset.pageAnchors)).toEqual({
      valid: true,
    });
    expect(validateReviewedTranscriptionEditorialIntegrity(ledger, 3)).toEqual({ valid: true });
    expect(pages).toHaveLength(3);
    expect(pages[0]).toContain("C. H. McCORMICK.\nREAPER.\nPatented June 21, 1834.");
    expect(pages[0]).not.toContain("UNITED STATES PATENT OFFICE.");
    expect(pages[1]).toContain("UNITED STATES PATENT OFFICE.");
    expect(pages[1]).toContain("suspends it to the desired height.");
    expect(pages[1]).not.toContain("My claim is for the arrangement");
    expect(pages[2]).toContain("My claim is for the arrangement of the several parts");
    expect(pages[2]).toContain("I also claim the method of gathering and bringing the grain back");

    expect(evaluateReviewedLedgerTextEvidence(mccormickReaperPatent, ledger)).toMatchObject({
      status: "verified",
      valid: true,
      authoredSectionCount: 16,
      coveredSectionCount: 16,
      coverageFraction: 1,
      missingSectionIndexes: [],
      missingClaimNumbers: [],
    });

    const strictDecision = evaluateArchivalPublicationState(mccormickReaperPatent);
    expect(strictDecision.reasonCode).toBe("ACCEPTED");
    expect(strictDecision.isPublished).toBe(true);
    expect(strictDecision.state.evidence.ledgerContent.valid).toBe(true);
    expect(strictDecision.figureManifest).toMatchObject({
      requiredFigureCount: 1,
      acceptedFigureCount: 1,
    });
    expect(completeArchivalEditionForViewer(mccormickReaperPatent)).toBe(
      mccormickReaperArchivalEdition,
    );
  });

  test("provides valid provenance classifications for all McCormick reaper controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-x8277-mccormick-reaper"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({ forwardSpeedMph: 2.5 });
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("registers explicit energy channel omission reason and returns empty channels", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-x8277-mccormick-reaper"]).toBeDefined();
    expect(energyChannelsFor("us-x8277-mccormick-reaper", {})).toEqual([]);
  });
});
