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

  test("binds every explicit source-figure occurrence to its own local crop", () => {
    const figureReferences = thomsonWeldingArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });
    const expectedFiguresByReference: Readonly<Record<string, readonly number[]>> = {
      "Figure 1": [1],
      "Fig. 1": [1],
      "Fig. 2": [2],
      "Fig. 3": [3],
      "Fig. 4": [4],
      "Fig. 5": [5],
      "Fig. 6": [6],
      "Fig. 7": [7],
      "Fig. 8": [8],
      "Fig. 9": [9],
      "Figs. 10, 11, 12, 13, 14, and 15": [10, 11, 12, 13, 14, 15],
      "Fig. 10": [10],
      "Fig. 11": [11],
      "Fig. 12": [12],
      "Fig. 13": [13],
      "Fig. 14": [14],
      "Fig. 15": [15],
      "Fig. 16": [16],
      "Fig. 17": [17],
      "Fig. 18": [18],
    };

    for (const reference of figureReferences) {
      const expectedFigures = expectedFiguresByReference[reference.text];
      expect(expectedFigures).toBeDefined();
      const previews = reference.figurePreviews ?? [];
      expect(previews.map((preview) => preview.src)).toEqual(
        expectedFigures.map(
          (figureNumber) =>
            `/patents/figures/us-347140-thomson-welding/figure-${figureNumber}-source-crop-v1.png`,
        ),
      );
      for (const preview of previews) {
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
        expect(preview.width).toBeGreaterThan(0);
        expect(preview.height).toBeGreaterThan(0);
      }
    }

    expect(
      [...new Set(figureReferences.flatMap((reference) => reference.figurePreviews ?? []))].map(
        (preview) => preview.src,
      ),
    ).toEqual(
      Array.from(
        { length: 18 },
        (_, index) =>
          `/patents/figures/us-347140-thomson-welding/figure-${index + 1}-source-crop-v1.png`,
      ),
    );
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
