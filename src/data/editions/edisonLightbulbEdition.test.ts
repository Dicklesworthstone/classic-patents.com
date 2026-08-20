import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
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

  test("pairs every source paragraph with a non-lossy reading and every figure with a local crop", () => {
    const paragraphIndexes = edisonLightbulbArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(edisonLightbulbParallelReadings)
        .map(Number)
        .sort((left, right) => left - right),
    ).toEqual(paragraphIndexes);

    const figureReferences = edisonLightbulbArchivalEdition.blocks.flatMap((block) => {
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
    const figureOnePreview = figureReferences
      .flatMap((reference) => reference.figurePreviews ?? [])
      .find((preview) => preview.alt.includes("Fig. 1"));
    expect(figureOnePreview).toMatchObject({
      src: "/patents/figures/us-223898-edison-lightbulb/fig-1-source-crop-v4.png",
      width: 600,
      height: 900,
    });
    for (const reference of figureReferences) {
      for (const preview of reference.figurePreviews ?? []) {
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
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
