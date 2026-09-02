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

  test("binds every source-figure occurrence to an accepted local crop", () => {
    const figureReferences = thomsonWeldingArchivalEdition.blocks.flatMap((block) => {
      const inlines =
        block.kind === "paragraph" || block.kind === "claim"
          ? block.inlines
          : block.kind === "figure-sheet"
            ? block.description
            : [];
      return inlines.filter(
        (inline): inline is Extract<(typeof inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });
    const figureRoot = "/patents/figures/us-347140-thomson-welding";
    const sourceSheetOne = `${figureRoot}/fig-1-source-crop-v1.png`;
    const sourceSheetTwo = `${figureRoot}/fig-2-source-crop-v1.png`;
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
      "Figs. 1 through 9": [1, 2, 3, 4, 5, 6, 7, 8, 9],
      "Figs. 10, 11, 12, 13, 14, and 15": [10, 11, 12, 13, 14, 15],
      "Figs. 10 through 18": [10, 11, 12, 13, 14, 15, 16, 17, 18],
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
      const expectedPaths =
        reference.text === "Figs. 1 through 9"
          ? [sourceSheetOne]
          : reference.text === "Figs. 10 through 18"
            ? [sourceSheetTwo]
            : expectedFigures.map((figureNumber) => {
                if ([1, 3, 8, 9].includes(figureNumber)) return sourceSheetOne;
                const version = [5, 6].includes(figureNumber)
                  ? 6
                  : [2, 12, 13, 15].includes(figureNumber)
                    ? 5
                    : [11, 14].includes(figureNumber)
                      ? 4
                      : [4, 10].includes(figureNumber)
                        ? 2
                        : 1;
                return `${figureRoot}/figure-${figureNumber}-source-crop-v${version}.png`;
              });
      expect(previews.map((preview) => preview.src)).toEqual(expectedPaths);
      for (const preview of previews) {
        const previewPath = resolve(process.cwd(), "public", preview.src.slice(1));
        expect(existsSync(previewPath)).toBe(true);
        const png = readFileSync(previewPath);
        expect(png.subarray(1, 4).toString("ascii")).toBe("PNG");
        expect(preview.width).toBe(png.readUInt32BE(16));
        expect(preview.height).toBe(png.readUInt32BE(20));
      }
    }

    expect(
      [
        ...new Set(
          figureReferences.flatMap(
            (reference) => reference.figurePreviews?.map((preview) => preview.src) ?? [],
          ),
        ),
      ].sort(),
    ).toEqual(
      [
        sourceSheetOne,
        sourceSheetTwo,
        `${figureRoot}/figure-2-source-crop-v5.png`,
        `${figureRoot}/figure-4-source-crop-v2.png`,
        `${figureRoot}/figure-5-source-crop-v6.png`,
        `${figureRoot}/figure-6-source-crop-v6.png`,
        `${figureRoot}/figure-7-source-crop-v1.png`,
        `${figureRoot}/figure-10-source-crop-v2.png`,
        `${figureRoot}/figure-11-source-crop-v4.png`,
        `${figureRoot}/figure-12-source-crop-v5.png`,
        `${figureRoot}/figure-13-source-crop-v5.png`,
        `${figureRoot}/figure-14-source-crop-v4.png`,
        `${figureRoot}/figure-15-source-crop-v5.png`,
        `${figureRoot}/figure-16-source-crop-v1.png`,
        `${figureRoot}/figure-17-source-crop-v1.png`,
        `${figureRoot}/figure-18-source-crop-v1.png`,
      ].sort(),
    );
  });

  test("binds the canonical record to the manual claims and reviewed transcript", () => {
    expect(thomsonWeldingPatent.archivalEdition).toBe(thomsonWeldingArchivalEdition);
    expect(thomsonWeldingPatent.filingDate).toBe("1886-03-29");
    expect(thomsonWeldingPatent.stats).toMatchObject({ totalClaims: 8, independentClaims: 8 });
    const openingParagraphs = thomsonWeldingArchivalEdition.blocks
      .filter((block) => block.kind === "paragraph")
      .slice(0, 2)
      .map((block) => block.inlines.map((inline) => inline.text).join(""))
      .join("\n\n");
    expect(thomsonWeldingPatent.originalText).toBe(openingParagraphs);
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
