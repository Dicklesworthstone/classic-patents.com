import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { ottoEnginePatent } from "@/data/patents/otto-engine";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { ottoEngineArchivalEdition, ottoEngineParallelReadings } from "./ottoEngineEdition";

const normalized = (value: string) => value.replace(/\s+/g, " ").trim();

describe("US 194,047 manual source edition", () => {
  test("pins the complete eight-sheet facsimile, six claims, and documented filing date", () => {
    expect(ottoEnginePatent.archivalEdition).toBe(ottoEngineArchivalEdition);
    expect(ottoEnginePatent.originalTextAsset).toMatchObject({
      url: "/patents/transcripts/us-194047-otto-engine-reviewed.txt",
      pageCount: 8,
      kind: "reviewed-transcription",
      sourcePdfSha256: "ad6cfd50e5aaca4dbf9dcb594eb53dc1e619339314f50fdd49a6b4f34eb30baf",
    });
    expect(ottoEnginePatent.filingDate).toBe("1876-07-13");
    expect(validateCuratedSpecificationEdition(ottoEngineArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public/patents/pdfs/us-194047-otto-engine.pdf`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      ottoEngineArchivalEdition.sourcePdfSha256,
    );
    expect(ottoEnginePatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(ottoEnginePatent.claims.every((claim) => claim.isIndependent)).toBe(true);
  });

  test("keeps every published source paragraph and claim in the reviewed ledger", () => {
    const asset = ottoEnginePatent.originalTextAsset;
    if (!asset) throw new Error("US 194,047 is missing its reviewed source ledger.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 8)).toEqual({ valid: true });
    const normalizedLedger = normalized(
      ledger.replace(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm, ""),
    );

    for (const block of ottoEngineArchivalEdition.blocks) {
      if (block.kind !== "masthead" && block.kind !== "paragraph" && block.kind !== "claim")
        continue;
      const source =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.inlines.map((inline) => inline.text).join("");
      expect(normalizedLedger).toContain(normalized(source));
    }

    const authoredClaims = ottoEngineArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<(typeof ottoEngineArchivalEdition.blocks)[number], { kind: "claim" }> =>
        block.kind === "claim",
    );
    expect(ottoEnginePatent.claims.map((claim) => claim.originalText)).toEqual(
      authoredClaims.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
  });

  test("pairs every source paragraph with a non-lossy reading and every figure with a local crop", () => {
    const paragraphIndexes = ottoEngineArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(ottoEngineParallelReadings)
        .map(Number)
        .sort((left, right) => left - right),
    ).toEqual(paragraphIndexes);

    const figureReferences = ottoEngineArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });
    for (const number of Array.from({ length: 13 }, (_, index) => index + 1)) {
      expect(
        figureReferences.some((reference) =>
          reference.figurePreviews?.some((preview) => preview.alt.includes(`Fig. ${number}`)),
        ),
      ).toBe(true);
    }
    for (const reference of figureReferences) {
      for (const preview of reference.figurePreviews ?? []) {
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }
  });

  test("uses an upright source-faithful Fig. 10 crop from the rotated drawing sheet", () => {
    const fig10 = ottoEngineArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" &&
          inline.referenceType === "figure" &&
          inline.text === "Fig. 10",
      );
    });

    expect(fig10.length).toBeGreaterThan(0);
    for (const reference of fig10) {
      expect(reference.figurePreviews).toContainEqual(
        expect.objectContaining({
          src: "/patents/figures/us-194047-otto-engine/fig-10-source-crop-v2.png",
          width: 750,
          height: 320,
        }),
      );
    }
  });

  test("removes the invented generic Otto-cycle account from visitor-facing data", () => {
    const visibleData = JSON.stringify({
      filingDate: ottoEnginePatent.filingDate,
      summary: ottoEnginePatent.summary,
      originalText: ottoEnginePatent.originalText,
      plainEnglish: ottoEnginePatent.plainEnglishExplanation,
      claims: ottoEnginePatent.claims,
      drawings: ottoEnginePatent.drawings,
      sourceFace: ottoEngineArchivalEdition.blocks,
    });
    expect(visibleData).not.toContain("Application filed March 24, 1877");
    expect(visibleData).not.toContain("barely $4");
    expect(visibleData).not.toContain("30\\text");
    expect(visibleData).not.toContain("2:1 Geared Half-Speed Camshaft / Slide-Valve Drive");
    expect(visibleData).not.toContain("$\\");
    expect(visibleData).toContain("six printed claims");
    expect(visibleData).toContain("increasingly dispersed");
  });
});
