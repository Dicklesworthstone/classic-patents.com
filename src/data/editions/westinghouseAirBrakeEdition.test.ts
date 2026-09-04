import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { westinghouseAirBrakePatent } from "@/data/patents/westinghouse-air-brake";
import {
  westinghouseAirBrakeArchivalEdition,
  westinghouseAirBrakeParallelReadings,
} from "./westinghouseAirBrakeEdition";

const normalized = (value: string) => value.replace(/\s+/g, " ").trim();

describe("US 124,404 manual source edition", () => {
  test("pins the complete four-sheet facsimile and all five printed claims", () => {
    expect(westinghouseAirBrakePatent.archivalEdition).toBe(westinghouseAirBrakeArchivalEdition);
    expect(westinghouseAirBrakePatent.originalTextAsset).toMatchObject({
      url: "/patents/transcripts/us-124404-westinghouse-air-brake-reviewed.txt",
      pageCount: 4,
      kind: "reviewed-transcription",
      sourcePdfSha256: "4071920f448fd1c3c5d8b5d593963e629adc0b3ae91212aae23cfad3d95ed665",
    });
    expect(validateCuratedSpecificationEdition(westinghouseAirBrakeArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(
      `${process.cwd()}/public/patents/pdfs/us-124404-westinghouse-air-brake.pdf`,
    );
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      westinghouseAirBrakeArchivalEdition.sourcePdfSha256,
    );
    expect(westinghouseAirBrakePatent.filingDate).toBeNull();
    expect(westinghouseAirBrakePatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3, 4, 5]);
    expect(westinghouseAirBrakePatent.claims.every((claim) => claim.isIndependent)).toBe(true);
  });

  test("keeps every source paragraph and claim in the reviewed ledger", () => {
    const asset = westinghouseAirBrakePatent.originalTextAsset;
    if (!asset) throw new Error("US 124,404 is missing its reviewed source ledger.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 4)).toEqual({ valid: true });
    const normalizedLedger = normalized(
      ledger.replace(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm, ""),
    );

    for (const block of westinghouseAirBrakeArchivalEdition.blocks) {
      if (block.kind !== "masthead" && block.kind !== "paragraph" && block.kind !== "claim")
        continue;
      const source =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.inlines.map((inline) => inline.text).join("");
      expect(normalizedLedger).toContain(normalized(source));
    }
  });

  test("pairs each source paragraph with a non-lossy reading and every figure with its complete source sheet", () => {
    const sourceSheet = {
      src: "/patents/figures/us-124404-westinghouse-air-brake/source-sheet-1-v1.png",
      width: 2320,
      height: 3408,
    } as const;
    const sourceSheetSha256 = "7417d1ebd75e021b68f610b49d6f7af4e4ca0cf118dade6e6ca292892bb59c90";
    const paragraphIndexes = westinghouseAirBrakeArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(westinghouseAirBrakeParallelReadings)
        .map(Number)
        .sort((left, right) => left - right),
    ).toEqual(paragraphIndexes);

    const figureReferences = westinghouseAirBrakeArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });
    for (const number of [1, 2, 3, 4, 5, 6]) {
      expect(
        figureReferences.some((reference) =>
          reference.figurePreviews?.some((preview) => preview.alt.includes(`Fig. ${number}`)),
        ),
      ).toBe(true);
    }
    for (const reference of figureReferences) {
      for (const preview of reference.figurePreviews ?? []) {
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
        expect(preview).toMatchObject(sourceSheet);
      }
    }
    const bytes = readFileSync(resolve(process.cwd(), "public", sourceSheet.src.slice(1)));
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(sourceSheetSha256);
    expect(bytes.readUInt32BE(16)).toBe(sourceSheet.width);
    expect(bytes.readUInt32BE(20)).toBe(sourceSheet.height);

    const sourceParagraphInlines = westinghouseAirBrakeArchivalEdition.blocks
      .filter(
        (
          block,
        ): block is Extract<
          (typeof westinghouseAirBrakeArchivalEdition.blocks)[number],
          { kind: "paragraph" }
        > => block.kind === "paragraph",
      )
      .flatMap((block) => block.inlines);
    const figuresFiveAndSix = sourceParagraphInlines.findIndex(
      (inline) => inline.text === "Figs. 5",
    );
    expect(figuresFiveAndSix).toBeGreaterThanOrEqual(0);
    expect(
      sourceParagraphInlines
        .slice(figuresFiveAndSix, figuresFiveAndSix + 3)
        .map((inline) =>
          inline.kind === "reference" ? inline.figurePreviews?.[0]?.alt : inline.text,
        ),
    ).toEqual([
      "Complete source drawing sheet containing Figs. 1 through 6, highlighting Fig. 5, from US 124,404.",
      " and ",
      "Complete source drawing sheet containing Figs. 1 through 6, highlighting Fig. 6, from US 124,404.",
    ]);
  });

  test("removes the false triple-valve account from visitor-facing data", () => {
    const visibleData = JSON.stringify({
      summary: westinghouseAirBrakePatent.summary,
      originalText: westinghouseAirBrakePatent.originalText,
      plainEnglish: westinghouseAirBrakePatent.plainEnglishExplanation,
      claims: westinghouseAirBrakePatent.claims,
      drawings: westinghouseAirBrakePatent.drawings,
      sourceFace: westinghouseAirBrakeArchivalEdition.blocks,
    });
    expect(visibleData).not.toContain("three distinct states");
    expect(visibleData).not.toContain("automatic air brake introducing");
    expect(visibleData).not.toContain("70\\text");
    expect(visibleData).not.toContain("$\\");
    expect(visibleData).toContain("five printed claims");
  });
});
