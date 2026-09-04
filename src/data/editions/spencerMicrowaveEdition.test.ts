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
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { spencerMicrowavePatent } from "@/data/patents/spencer-microwave";
import {
  spencerMicrowaveArchivalEdition,
  spencerMicrowaveParallelReadings,
} from "./spencerMicrowaveEdition";

const normalized = (value: string) => value.replace(/\s+/g, " ").trim();

describe("US 2,495,429 manual source edition", () => {
  test("pins the reviewed three-sheet facsimile and all six printed claims", () => {
    expect(spencerMicrowavePatent.archivalEdition).toBe(spencerMicrowaveArchivalEdition);
    expect(validateCuratedSpecificationEdition(spencerMicrowaveArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(
      `${process.cwd()}/public/patents/pdfs/us-2495429-spencer-microwave.pdf`,
    );
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      spencerMicrowaveArchivalEdition.sourcePdfSha256,
    );
    expect(spencerMicrowavePatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(spencerMicrowavePatent.claims.every((claim) => claim.isIndependent)).toBe(true);
  });

  test("keeps the authored source and every claim in its page-complete review ledger", () => {
    const asset = spencerMicrowavePatent.originalTextAsset;
    if (!asset) throw new Error("US 2,495,429 is missing its reviewed source ledger.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 3)).toEqual({ valid: true });
    const normalizedLedger = normalized(
      ledger.replace(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm, ""),
    );

    for (const block of spencerMicrowaveArchivalEdition.blocks) {
      if (block.kind !== "masthead" && block.kind !== "paragraph" && block.kind !== "claim") {
        continue;
      }
      const source =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.inlines.map((inline) => inline.text).join("");
      expect(normalizedLedger).toContain(normalized(source));
    }

    const authoredClaims = spencerMicrowaveArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof spencerMicrowaveArchivalEdition.blocks)[number],
        { kind: "claim" }
      > => block.kind === "claim",
    );
    expect(spencerMicrowavePatent.claims.map((claim) => claim.originalText)).toEqual(
      authoredClaims.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
  });

  test("covers every source paragraph and uses a complete local source sheet at its sole figure citation", () => {
    const paragraphIndexes = spencerMicrowaveArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(spencerMicrowaveParallelReadings)
        .map(Number)
        .sort((left, right) => left - right),
    ).toEqual(paragraphIndexes);

    const figureReferences = spencerMicrowaveArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });
    expect(figureReferences).toHaveLength(1);
    const preview = figureReferences[0]?.figurePreviews?.[0];
    expect(preview?.src).toBe(
      "/patents/figures/us-2495429-spencer-microwave/drawing-sheet-source-v1.png",
    );
    expect(preview).toMatchObject({
      width: 2320,
      height: 3408,
      alt: expect.stringContaining("Complete source drawing sheet 1 of 1"),
    });
    expect(existsSync(resolve(process.cwd(), "public", preview?.src.slice(1) ?? ""))).toBe(true);
    expect(
      existsSync(
        resolve(
          process.cwd(),
          "public/patents/figures/us-2495429-spencer-microwave/fig-1-source-crop-v1.png",
        ),
      ),
    ).toBe(true);
  });

  test("accepts the complete source-sheet evidence while keeping the source edition available", () => {
    const patentId = spencerMicrowavePatent.id;
    const decision = evaluateArchivalPublicationState(spencerMicrowavePatent);
    expect(decision.isPublished).toBe(true);
    expect(decision.reasonCode).toBe("ACCEPTED");
    expect(decision.figureManifest).toMatchObject({
      requiredFigureCount: 1,
      acceptedFigureCount: 1,
    });
    expect(completeArchivalEditionForViewer(spencerMicrowavePatent)).toBe(
      spencerMicrowaveArchivalEdition,
    );

    const attestation = (ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS as Record<string, any>)[patentId];
    expect(attestation).toMatchObject({
      sourcePdfSha256: spencerMicrowaveArchivalEdition.sourcePdfSha256,
      reviewedAt: "2026-09-03",
      acceptedOccurrenceCount: 1,
      assets: {
        "/patents/figures/us-2495429-spencer-microwave/drawing-sheet-source-v1.png": {
          sha256: "ab3aef1cd0afe66a2fa7f728bfedd51f0caaa7d1c80da36932e0a897841bd826",
          width: 2320,
          height: 3408,
        },
      },
    });
    expect((FIGURE_OCCURRENCE_SOURCE_LOCATORS as Record<string, any>)[patentId]).toEqual([
      expect.objectContaining({
        occurrenceKey: "edition-block-6-group-0-inline-1",
        activeAsset: "/patents/figures/us-2495429-spencer-microwave/drawing-sheet-source-v1.png",
        sourcePdfPage: 1,
        sourceRaster: { width: 2320, height: 3408 },
        sourceRectPixels: { x: 0, y: 0, width: 2320, height: 3408 },
      }),
    ]);
  });

  test("does not carry fabricated preamble, door hardware, or unprinted operating claims into visitor-facing data", () => {
    const visibleData = JSON.stringify({
      originalText: spencerMicrowavePatent.originalText,
      plainEnglish: spencerMicrowavePatent.plainEnglishExplanation,
      claims: spencerMicrowavePatent.claims,
      sourceFace: spencerMicrowaveArchivalEdition.blocks,
    });
    expect(visibleData).not.toContain("To all whom it may concern");
    expect(visibleData).not.toContain("Quarter-Wave RF Choke");
    expect(visibleData).not.toContain("turntable");
    expect(visibleData).not.toContain("$\\");
    expect(visibleData).toContain("2 kw.-sec.");
    expect(visibleData).toContain("72,000 kw.-sec.");
  });
});
