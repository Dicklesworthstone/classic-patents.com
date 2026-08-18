import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { thomsonWeldingPatent } from "@/data/patents/thomson-welding";
import {
  thomsonWeldingArchivalEdition,
  thomsonWeldingParallelReadings,
} from "./thomsonWeldingEdition";

describe("thomsonWeldingArchivalEdition", () => {
  test("pins the complete five-page facsimile, its two drawing sheets, and eight claims", () => {
    expect(validateCuratedSpecificationEdition(thomsonWeldingArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(thomsonWeldingArchivalEdition.sourcePdfSha256).toBe(
      "80e7bbf735c52f3ace482277f39b130c0b6a62ee8eb9290389175939ba48356c",
    );
    expect(
      thomsonWeldingArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.number),
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test("authors every printed figure reference against a local source-sheet preview", () => {
    const figureReferences = thomsonWeldingArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });
    const sourceText = figureReferences.map((reference) => reference.text).join(" ");
    for (const figureNumber of Array.from({ length: 18 }, (_, index) => index + 1)) {
      expect(sourceText).toContain(`Fig. ${figureNumber}`);
    }
    for (const reference of figureReferences) {
      const [preview] = reference.figurePreviews ?? [];
      expect(preview).toBeDefined();
      expect(existsSync(resolve(process.cwd(), "public", preview?.src.slice(1) ?? ""))).toBe(true);
    }
  });

  test("binds the canonical record to the manual claims and reviewed transcript", () => {
    expect(thomsonWeldingPatent.archivalEdition).toBe(thomsonWeldingArchivalEdition);
    expect(thomsonWeldingPatent.filingDate).toBe("1886-03-29");
    expect(thomsonWeldingPatent.stats).toMatchObject({ totalClaims: 8, independentClaims: 8 });
    expect(thomsonWeldingPatent.claims.map((claim) => claim.originalText)).toEqual(
      thomsonWeldingArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.inlines.map((inline) => inline.text).join("")),
    );

    const asset = thomsonWeldingPatent.originalTextAsset;
    if (!asset?.sourcePdfSha256) throw new Error("US 347,140 lacks a reviewed transcript receipt.");
    const transcript = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(transcript, asset.pageCount)).toEqual({ valid: true });
    const sourcePdf = readFileSync(`${process.cwd()}/public${thomsonWeldingPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(sourcePdf).digest("hex")).toBe(asset.sourcePdfSha256);

    const normalizedTranscript = transcript
      .replace(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm, "")
      .replace(/\s+/g, " ")
      .trim();
    for (const block of thomsonWeldingArchivalEdition.blocks) {
      if (block.kind !== "masthead" && block.kind !== "paragraph" && block.kind !== "claim") {
        continue;
      }
      const sourceText =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.inlines.map((inline) => inline.text).join("");
      expect(normalizedTranscript).toContain(sourceText.replace(/\s+/g, " ").trim());
    }
  });

  test("keeps an explicit non-lossy companion for every source paragraph", () => {
    const paragraphIndexes = thomsonWeldingArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(thomsonWeldingParallelReadings)
        .map(Number)
        .sort((left, right) => left - right),
    ).toEqual(paragraphIndexes);
    expect(thomsonWeldingParallelReadings[13]?.join(" ")).toContain("one fifty-thousandth");
  });
});
