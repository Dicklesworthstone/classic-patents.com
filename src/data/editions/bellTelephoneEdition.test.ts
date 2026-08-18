import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { bellTelephonePatent } from "@/data/patents/bell-telephone";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  bellTelephoneArchivalEdition,
  bellTelephoneParallelReadings,
} from "./bellTelephoneEdition";

const normalized = (value: string) => value.replace(/\s+/g, " ").trim();

describe("US 174,465 manual source edition", () => {
  test("pins the complete six-page facsimile and the five printed claims", () => {
    expect(bellTelephonePatent.archivalEdition).toBe(bellTelephoneArchivalEdition);
    expect(bellTelephonePatent.originalTextAsset).toMatchObject({
      url: "/patents/transcripts/us-174465-bell-telephone-reviewed.txt",
      pageCount: 6,
      kind: "reviewed-transcription",
      sourcePdfSha256: "cb1a0fa7bd871937575e240adf904fa3ea8f462b3bfceb4e7cbbb0811909a8e9",
    });
    expect(validateCuratedSpecificationEdition(bellTelephoneArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public/patents/pdfs/us-174465-bell-telephone.pdf`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      bellTelephoneArchivalEdition.sourcePdfSha256,
    );
    expect(bellTelephonePatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3, 4, 5]);
    expect(bellTelephonePatent.claims.every((claim) => claim.isIndependent)).toBe(true);
  });

  test("keeps every published source paragraph and claim in the reviewed ledger", () => {
    const asset = bellTelephonePatent.originalTextAsset;
    if (!asset) throw new Error("US 174,465 is missing its reviewed source ledger.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 6)).toEqual({ valid: true });
    const normalizedLedger = normalized(
      ledger.replace(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm, ""),
    );

    for (const block of bellTelephoneArchivalEdition.blocks) {
      if (block.kind !== "masthead" && block.kind !== "paragraph" && block.kind !== "claim")
        continue;
      const source =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.inlines.map((inline) => inline.text).join("");
      expect(normalizedLedger).toContain(normalized(source));
    }

    const authoredClaims = bellTelephoneArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof bellTelephoneArchivalEdition.blocks)[number],
        { kind: "claim" }
      > => block.kind === "claim",
    );
    expect(bellTelephonePatent.claims.map((claim) => claim.originalText)).toEqual(
      authoredClaims.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
  });

  test("pairs every source paragraph with a non-lossy explanation and every figure with a local crop", () => {
    const paragraphIndexes = bellTelephoneArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(bellTelephoneParallelReadings)
        .map(Number)
        .sort((left, right) => left - right),
    ).toEqual(paragraphIndexes);

    const figureReferences = bellTelephoneArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });
    for (const number of [1, 2, 3, 4, 5, 6, 7]) {
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

  test("removes the invented liquid-transmitter reading from the public record", () => {
    const visibleData = JSON.stringify({
      summary: bellTelephonePatent.summary,
      originalText: bellTelephonePatent.originalText,
      plainEnglish: bellTelephonePatent.plainEnglishExplanation,
      drawings: bellTelephonePatent.drawings,
      sourceFace: bellTelephoneArchivalEdition.blocks,
    });
    expect(visibleData).not.toContain("Variable Resistance Liquid Transmitter");
    expect(visibleData).not.toContain("platinum needle dipping");
    expect(visibleData).not.toContain("Heaviside Transmission Line");
    expect(visibleData).not.toContain("$\\");
  });
});
