import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS } from "@/data/editions/archivalFigureAcceptance";
import { FIGURE_OCCURRENCE_SOURCE_LOCATORS } from "@/data/editions/figureOccurrenceSourceLocators";
import {
  completeArchivalEditionForViewer,
  evaluateArchivalPublicationState,
} from "@/data/editions/publicationApproval";
import { edisonBulbPatent } from "@/data/patents/edison-lightbulb";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  edisonLightbulbArchivalEdition,
  edisonLightbulbParallelReadings,
} from "./edisonLightbulbEdition";

const normalized = (value: string) => value.replace(/\s+/g, " ").trim();

describe("US 223,898 manual source edition", () => {
  test("pins the complete four-sheet facsimile, all claims, and its review ledger", () => {
    expect(edisonBulbPatent.archivalEdition).toBe(edisonLightbulbArchivalEdition);
    expect(edisonBulbPatent.originalTextAsset).toMatchObject({
      url: "/patents/transcripts/us-223898-edison-lightbulb-reviewed.txt",
      pageCount: 4,
      kind: "reviewed-transcription",
      sourcePdfSha256: "70c46d7c8624b1e471dffd1175b0f34e70b4b05b6a9adede43c198fe71abc054",
    });
    expect(validateCuratedSpecificationEdition(edisonLightbulbArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public/patents/pdfs/us-223898-edison-lightbulb.pdf`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      edisonLightbulbArchivalEdition.sourcePdfSha256,
    );
    expect(edisonBulbPatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3, 4]);
    expect(edisonBulbPatent.claims.every((claim) => claim.isIndependent)).toBe(true);
  });

  test("keeps every source paragraph and claim in the reviewed ledger", () => {
    const asset = edisonBulbPatent.originalTextAsset;
    if (!asset) throw new Error("US 223,898 is missing its reviewed source ledger.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 4)).toEqual({ valid: true });
    const normalizedLedger = normalized(
      ledger.replace(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm, ""),
    );

    for (const block of edisonLightbulbArchivalEdition.blocks) {
      if (block.kind !== "masthead" && block.kind !== "paragraph" && block.kind !== "claim") {
        continue;
      }
      const source =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.inlines.map((inline) => inline.text).join("");
      expect(normalizedLedger).toContain(normalized(source));
    }

    const authoredClaims = edisonLightbulbArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof edisonLightbulbArchivalEdition.blocks)[number],
        { kind: "claim" }
      > => block.kind === "claim",
    );
    expect(edisonBulbPatent.claims.map((claim) => claim.originalText)).toEqual(
      authoredClaims.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
  });

  test("pairs every source paragraph with a non-lossy reading and every figure with a complete local sheet", () => {
    const paragraphIndexes = edisonLightbulbArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(edisonLightbulbParallelReadings)
        .map(Number)
        .sort((left, right) => left - right),
    ).toEqual(paragraphIndexes);

    const figureReferences = edisonLightbulbArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "figure-sheet") {
        return block.description.filter(
          (inline): inline is Extract<(typeof block.description)[number], { kind: "reference" }> =>
            inline.kind === "reference" && inline.referenceType === "figure",
        );
      }
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });
    for (const number of [1, 2, 3]) {
      expect(
        figureReferences.some((reference) =>
          reference.figurePreviews?.some((preview) => preview.alt.includes(`Fig. ${number}`)),
        ),
      ).toBe(true);
    }
    expect(figureReferences).toHaveLength(6);
    for (const reference of figureReferences) {
      for (const preview of reference.figurePreviews ?? []) {
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
        expect(preview).toMatchObject({
          src: "/patents/figures/us-223898-edison-lightbulb/source-sheet-1-v1.png",
          width: 2320,
          height: 3408,
        });
        expect(preview.alt).toContain("Complete upright source drawing sheet 1 of 1");
      }
    }
    const sourceSheet = resolve(
      process.cwd(),
      "public/patents/figures/us-223898-edison-lightbulb/source-sheet-1-v1.png",
    );
    const sourceSheetBytes = readFileSync(sourceSheet);
    expect(createHash("sha256").update(sourceSheetBytes).digest("hex")).toBe(
      "6a6bb2965a4b3b68d964cf7ebe6885e2037876e80661bdd7d99b7f0398e0053c",
    );
    expect({
      width: sourceSheetBytes.readUInt32BE(16),
      height: sourceSheetBytes.readUInt32BE(20),
    }).toEqual({ width: 2320, height: 3408 });
    for (const legacyCrop of [
      "fig-1-source-crop-v4.png",
      "fig-2-source-crop-v6.png",
      "fig-3-source-crop-v3.png",
    ]) {
      expect(
        existsSync(
          resolve(process.cwd(), "public/patents/figures/us-223898-edison-lightbulb", legacyCrop),
        ),
      ).toBe(true);
    }
  });

  test("accepts all six source citations internally without gating the source edition", () => {
    const patentId = edisonBulbPatent.id;
    const decision = evaluateArchivalPublicationState(edisonBulbPatent);
    expect(decision.isPublished).toBe(true);
    expect(decision.reasonCode).toBe("ACCEPTED");
    expect(decision.figureManifest).toMatchObject({
      requiredFigureCount: 6,
      acceptedFigureCount: 6,
    });
    expect(decision.figureManifest.figures.every((figure) => figure.status === "accepted")).toBe(
      true,
    );
    expect(completeArchivalEditionForViewer(edisonBulbPatent)).toBe(edisonLightbulbArchivalEdition);
    expect(
      (ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS as Record<string, unknown>)[patentId],
    ).toMatchObject({
      sourcePdfSha256: edisonLightbulbArchivalEdition.sourcePdfSha256,
      reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
      reviewedAt: "2026-09-03",
      acceptedOccurrenceCount: 6,
      assets: {
        "/patents/figures/us-223898-edison-lightbulb/source-sheet-1-v1.png": {
          sha256: "6a6bb2965a4b3b68d964cf7ebe6885e2037876e80661bdd7d99b7f0398e0053c",
          width: 2320,
          height: 3408,
        },
      },
    });
    const locators = (FIGURE_OCCURRENCE_SOURCE_LOCATORS as Record<string, readonly unknown[]>)[
      patentId
    ];
    expect(locators).toHaveLength(6);
    for (const locator of locators ?? []) {
      expect(locator).toMatchObject({
        activeAsset: "/patents/figures/us-223898-edison-lightbulb/source-sheet-1-v1.png",
        sourcePdfPage: 1,
        sourceRaster: { width: 2320, height: 3408 },
        sourceRectPixels: { x: 0, y: 0, width: 2320, height: 3408 },
      });
    }
  });

  test("removes invented operating data and a fabricated fourth claim from visitor-facing data", () => {
    const visibleData = JSON.stringify({
      summary: edisonBulbPatent.summary,
      originalText: edisonBulbPatent.originalText,
      plainEnglish: edisonBulbPatent.plainEnglishExplanation,
      claims: edisonBulbPatent.claims,
      drawings: edisonBulbPatent.drawings,
      sourceFace: edisonLightbulbArchivalEdition.blocks,
    });
    expect(visibleData).not.toContain("Sprengel");
    expect(visibleData).not.toContain("bamboo");
    expect(visibleData).not.toContain("2,200");
    expect(visibleData).not.toContain("10^{-6}");
    expect(visibleData).not.toContain("coal-tar");
    expect(visibleData).not.toContain("$\\");
    expect(visibleData).toContain("one-millionth of an atmosphere");
    expect(visibleData).toContain("15th day of March, 1883");
  });
});
