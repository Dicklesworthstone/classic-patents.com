import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { peltonWaterWheelPatent } from "@/data/patents/pelton-water-wheel";
import {
  normalizeLiteralSourceText,
  normalizeReviewedLedgerText,
  validateReviewedTranscription,
  validateReviewedTranscriptionEditorialIntegrity,
} from "@/data/patents/sourceTextValidation";
import type { CuratedSpecificationInline } from "@/types/patent";
import { ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS } from "./archivalFigureAcceptance";
import { FIGURE_OCCURRENCE_SOURCE_LOCATORS } from "./figureOccurrenceSourceLocators";
import {
  peltonWaterWheelArchivalEdition,
  peltonWaterWheelClaimText,
  peltonWaterWheelParallelReadings,
} from "./peltonWaterWheelEdition";
import {
  completeArchivalEditionForViewer,
  evaluateArchivalPublicationState,
} from "./publicationApproval";

const normalized = (value: string) => normalizeLiteralSourceText(value);

describe("US 233,692 manual source edition", () => {
  test("pins the three-sheet facsimile and the source's one printed claim", () => {
    expect(peltonWaterWheelPatent.archivalEdition).toBe(peltonWaterWheelArchivalEdition);
    expect(peltonWaterWheelPatent.originalTextAsset).toMatchObject({
      url: "/patents/transcripts/us-233692-pelton-water-wheel-reviewed.txt",
      pageCount: 3,
      kind: "reviewed-transcription",
      sourcePdfSha256: "b81019c0239af3ab932bd477970c1a414a91f765a68b28f9b22444e4f95c597c",
    });
    expect(validateCuratedSpecificationEdition(peltonWaterWheelArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(peltonWaterWheelArchivalEdition.completeFacsimileReviewed).toBe(true);
    const pdf = readFileSync(
      `${process.cwd()}/public/patents/pdfs/us-233692-pelton-water-wheel.pdf`,
    );
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      peltonWaterWheelArchivalEdition.sourcePdfSha256,
    );
    expect(peltonWaterWheelPatent.claims.map((claim) => claim.number)).toEqual([1]);
    expect(peltonWaterWheelPatent.claims[0]?.isIndependent).toBe(true);
    expect(peltonWaterWheelPatent.claims[0]?.originalText).toBe(peltonWaterWheelClaimText(1));
  });

  test("keeps all authored source blocks in its review ledger", () => {
    const asset = peltonWaterWheelPatent.originalTextAsset;
    if (!asset) throw new Error("US 233,692 is missing its reviewed source ledger.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 3)).toEqual({ valid: true });
    expect(validateReviewedTranscriptionEditorialIntegrity(ledger, 3)).toEqual({ valid: true });
    const normalizedLedger = normalized(normalizeReviewedLedgerText(ledger));
    for (const block of peltonWaterWheelArchivalEdition.blocks) {
      if (block.kind !== "masthead" && block.kind !== "paragraph" && block.kind !== "claim") {
        continue;
      }
      const source =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.inlines.map((inline) => inline.text).join("");
      expect(normalizedLedger).toContain(normalized(source));
    }
  });

  test("pairs every paragraph with a companion and every printed figure with a source-sheet ref", () => {
    const paragraphIndexes = peltonWaterWheelArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(peltonWaterWheelParallelReadings)
        .map(Number)
        .sort((left, right) => left - right),
    ).toEqual(paragraphIndexes);

    const references = peltonWaterWheelArchivalEdition.blocks.flatMap((block) => {
      let inlines: readonly CuratedSpecificationInline[] = [];
      if (block.kind === "figure-sheet") {
        inlines = Array.isArray(block.description) ? block.description : [];
      } else if ("inlines" in block && Array.isArray(block.inlines)) {
        inlines = block.inlines;
      }
      return inlines.filter(
        (inline): inline is Extract<CuratedSpecificationInline, { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });
    for (const number of [1, 2, 3, 4]) {
      expect(
        references.some(
          (reference) =>
            reference.text.toLowerCase().includes(`fig. ${number}`) ||
            reference.text.toLowerCase().includes(`figure ${number}`),
        ),
      ).toBe(true);
    }
    expect(references).toHaveLength(8);
    for (const reference of references) {
      expect(reference.figurePreviews).toEqual([
        expect.objectContaining({
          src: "/patents/figures/us-233692-pelton-water-wheel/source-sheet-1-v1.png",
          width: 2320,
          height: 3408,
        }),
      ]);
    }
  });

  test("binds every cited figure to the complete, digest-pinned drawing sheet", () => {
    const patentId = "us-233692-pelton-water-wheel";
    const asset = "/patents/figures/us-233692-pelton-water-wheel/source-sheet-1-v1.png";
    const attestation = ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[patentId];
    expect(attestation).toMatchObject({
      sourcePdfSha256: peltonWaterWheelArchivalEdition.sourcePdfSha256,
      reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
      reviewedAt: "2026-09-03",
      acceptanceBasis: "independent-figure-review",
      acceptedOccurrenceCount: 8,
      assets: {
        [asset]: {
          sha256: "a1766af4b2a4d72bef0a3578fda56c8c5949060ec8a0fa4554d227db9546c512",
          width: 2320,
          height: 3408,
        },
      },
    });
    const assetPath = resolve(process.cwd(), "public", asset.slice(1));
    expect(existsSync(assetPath)).toBe(true);
    expect(createHash("sha256").update(readFileSync(assetPath)).digest("hex")).toBe(
      attestation.assets[asset]?.sha256,
    );

    const locators = FIGURE_OCCURRENCE_SOURCE_LOCATORS[patentId];
    expect(locators).toHaveLength(8);
    for (const locator of locators) {
      expect(locator).toMatchObject({
        activeAsset: asset,
        sourcePdfPage: 1,
        sourceRaster: { width: 2320, height: 3408 },
        sourceRectPixels: { x: 0, y: 0, width: 2320, height: 3408 },
        normalizedSourceRect: { x: 0, y: 0, width: 1, height: 1 },
        reviewer: attestation.reviewer,
        reviewedAt: attestation.reviewedAt,
        evidenceReference:
          "docs/provenance/us-233692-pelton-water-wheel.md#source-sheet-acceptance-2026-09-03",
      });
    }
    for (const legacyCrop of [
      "fig-1-source-crop-v1.png",
      "fig-1-source-crop-v2.png",
      "fig-2-source-crop-v1.png",
      "fig-2-source-crop-v2.png",
      "fig-2-source-crop-v3.png",
      "fig-3-source-crop-v1.png",
      "fig-3-source-crop-v2.png",
      "fig-4-source-crop-v1.png",
      "fig-4-source-crop-v2.png",
    ]) {
      expect(
        existsSync(
          resolve(process.cwd(), "public/patents/figures/us-233692-pelton-water-wheel", legacyCrop),
        ),
      ).toBe(true);
    }
  });

  test("keeps the drawing-sheet formal matter in the candidate edition", () => {
    const sheet = peltonWaterWheelArchivalEdition.blocks.find(
      (block) => block.kind === "figure-sheet",
    );
    expect(sheet?.kind).toBe("figure-sheet");
    const sheetText =
      sheet?.kind === "figure-sheet" ? sheet.description.map((inline) => inline.text).join("") : "";
    for (const printedLine of [
      "No Model.",
      "L. A. Pelton.",
      "Water Wheel.",
      "No. 233,692.",
      "Patented Oct. 26, 1880.",
      "Witnesses: Frank A. Brooks. Geo. H. Strong.",
      "Inventor: Lester A. Pelton.",
      "N. Peters, Photo-Lithographer, Washington, D. C.",
    ]) {
      expect(sheetText).toContain(printedLine);
    }
    const ledger = readFileSync(
      `${process.cwd()}/public/patents/transcripts/us-233692-pelton-water-wheel-reviewed.txt`,
      "utf8",
    );
    const normalizedLedger = normalized(ledger);
    for (const printedLine of [
      "No Model.",
      "Water Wheel.",
      "No. 233,692. Patented Oct. 26, 1880.",
      "Witnesses: Frank A. Brooks.",
      "Geo. H. Strong.",
      "Inventor: Lester A. Pelton.",
      "N. Peters, Photo-Lithographer, Washington, D. C.",
    ]) {
      expect(normalizedLedger).toContain(normalized(printedLine));
    }
  });

  test("keeps the claim introduction on its actual facsimile sheets", () => {
    const ledger = readFileSync(
      `${process.cwd()}/public/patents/transcripts/us-233692-pelton-water-wheel-reviewed.txt`,
      "utf8",
    );
    const pages = ledger.split(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/m).slice(1);
    expect(pages[1]).toContain("Having thus described my invention, what");
    expect(pages[1]).not.toContain("I claim as new, and desire to secure");
    expect(pages[2]).toStartWith("\n2                         233,692\n\nI claim as new");
  });

  test("removes invented numeric turbine claims and the fabricated second claim", () => {
    const visibleData = JSON.stringify({
      summary: peltonWaterWheelPatent.summary,
      originalText: peltonWaterWheelPatent.originalText,
      plainEnglish: peltonWaterWheelPatent.plainEnglishExplanation,
      claims: peltonWaterWheelPatent.claims,
      drawings: peltonWaterWheelPatent.drawings,
      sourceFace: peltonWaterWheelArchivalEdition.blocks,
    });
    expect(visibleData).not.toContain("170-degree");
    expect(visibleData).not.toContain("over 90 percent");
    expect(visibleData).not.toContain("half the speed");
    expect(visibleData).not.toContain("Emergency Jet Deflector");
    expect(visibleData).not.toContain("needle nozzle");
    expect(visibleData).not.toContain("$\\");
    expect(visibleData).toContain("single printed claim");
    expect(visibleData).toContain("bucket-front b");
  });

  test("provides valid provenance classifications for all Pelton controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-233692-pelton-water-wheel"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("registers explicit energy channel omission reason for US 233,692", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-233692-pelton-water-wheel"]).toBeDefined();
    expect(energyChannelsFor("us-233692-pelton-water-wheel", {})).toEqual([]);
  });

  test("accepts the internal source packet without changing source-reader availability", () => {
    const decision = evaluateArchivalPublicationState(peltonWaterWheelPatent);
    expect(decision.isPublished).toBe(true);
    expect(decision.state.kind).toBe("accepted");
    expect(decision.reasonCode).toBe("ACCEPTED");
    expect(decision.figureManifest).toMatchObject({
      requiredFigureCount: 8,
      acceptedFigureCount: 8,
    });
    expect(completeArchivalEditionForViewer(peltonWaterWheelPatent)).toBe(
      peltonWaterWheelArchivalEdition,
    );
  });
});
