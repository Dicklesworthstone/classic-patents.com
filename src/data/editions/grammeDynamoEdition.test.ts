import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  grammeDynamoArchivalEdition,
  grammeDynamoParallelReadings,
} from "@/data/editions/grammeDynamoEdition";
import { grammeDynamoPatent } from "@/data/patents/gramme-dynamo";

describe("grammeDynamoArchivalEdition", () => {
  test("is a continuous manual edition of the complete nine-page primary facsimile", () => {
    expect(validateCuratedSpecificationEdition(grammeDynamoArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(grammeDynamoArchivalEdition.completeFacsimileReviewed).toBe(true);
    expect(grammeDynamoArchivalEdition.sourcePdfSha256).toBe(
      "b7ffe0d2354ea69f50616261005f1265fcbab643824f0293b91fc3d2b6523895",
    );
    expect(
      grammeDynamoArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((claim) => claim.number),
    ).toEqual([1, 2, 3]);
  });

  test("preserves the four source sheets and gives every cited figure its own checked source crop", () => {
    const sheets = grammeDynamoArchivalEdition.blocks.filter(
      (block) => block.kind === "figure-sheet",
    );
    expect(sheets.map((sheet) => sheet.figureLabel)).toEqual([
      "DRAWING SHEET 1",
      "DRAWING SHEET 2",
      "DRAWING SHEET 3",
      "DRAWING SHEET 4",
    ]);

    const figureReferences = grammeDynamoArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });

    const publicText = JSON.stringify(grammeDynamoArchivalEdition.blocks);
    for (const figure of ["Fig. 1", "Fig. 4", "Fig. 7", "Fig. 10", "Fig. 12", "Fig. 14"]) {
      expect(publicText).toContain(figure);
    }
    const expectedCropFiles = Array.from({ length: 14 }, (_, index) => `fig-${index + 1}.png`);
    expectedCropFiles[2] = "fig-3-source-crop-v2.png";
    expectedCropFiles[6] = "fig-7-source-crop.png";
    expectedCropFiles[11] = "fig-12-source-crop-v3.png";
    expectedCropFiles[12] = "fig-13-source-crop-v3.png";
    expectedCropFiles[13] = "fig-14-source-crop-v5.png";
    expectedCropFiles.push("fig-14-label-source-crop-v4.png");
    for (const cropFile of expectedCropFiles) {
      expect(publicText).toContain(`/patents/figures/us-120057-gramme-dynamo/${cropFile}`);
    }
    for (const reference of figureReferences) {
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toStartWith("/patents/figures/us-120057-gramme-dynamo/fig-");
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }

    const figure14Previews = figureReferences
      .filter((reference) => /Fig\. 14/.test(reference.text))
      .flatMap((reference) => reference.figurePreviews ?? []);
    expect(figure14Previews).toContainEqual({
      src: "/patents/figures/us-120057-gramme-dynamo/fig-14-source-crop-v5.png",
      alt: "Upright source-facsimile apparatus crop of Fig. 14 from US 120,057, with the complete printed figure label and no witness block.",
      width: 1500,
      height: 930,
    });
    expect(figure14Previews).toContainEqual({
      src: "/patents/figures/us-120057-gramme-dynamo/fig-14-label-source-crop-v4.png",
      alt: "Upright source-facsimile crop of the printed Fig. 14 label from US 120,057.",
      width: 180,
      height: 100,
    });
  });

  test("does not leave a source figure citation stranded in a plain text node", () => {
    const bareFigureCitation = /\bFig(?:s)?\.\s*\d+|\bFigure\s+\d+/i;

    for (const block of grammeDynamoArchivalEdition.blocks) {
      if (!("inlines" in block)) continue;
      for (const inline of block.inlines) {
        if (inline.kind === "text") {
          expect(inline.text).not.toMatch(bareFigureCitation);
        }
      }
    }
  });

  test("pins the record to the reviewed transcription, all claims, and both named inventors", () => {
    expect(grammeDynamoPatent.archivalEdition).toBe(grammeDynamoArchivalEdition);
    expect(grammeDynamoPatent.originalTextAsset).toMatchObject({
      url: "/patents/transcripts/us-120057-gramme-dynamo-reviewed.txt",
      pageCount: 9,
      kind: "reviewed-transcription",
      sourcePdfSha256: grammeDynamoArchivalEdition.sourcePdfSha256,
    });
    expect(grammeDynamoPatent.inventors).toEqual([
      "Zénobe Théophile Gramme",
      "Eardley Louis Charles d’Ivernois",
    ]);
    expect(grammeDynamoPatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3]);
  });

  test("keeps the reviewed text asset complete through the three printed claims and witnesses", async () => {
    const transcript = await Bun.file(
      "public/patents/transcripts/us-120057-gramme-dynamo-reviewed.txt",
    ).text();

    expect(transcript).toContain("1. The employment, in magneto-electric machines");
    expect(transcript).toContain(
      "2. The arrangements described for allowing of giving rise to alternate or opposite",
    );
    expect(transcript).toContain("3. The general arrangement and combination of parts");
    expect(transcript).toContain("AUGUSTE MEDARD.");
  });

  test("exports literal, patent-local non-lossy readings for every authored source paragraph", () => {
    const paragraphIndexes = grammeDynamoArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    const companionIndexes = Object.keys(grammeDynamoParallelReadings)
      .map(Number)
      .sort((left, right) => left - right);

    expect(companionIndexes).toEqual(paragraphIndexes);
    for (const reading of Object.values(grammeDynamoParallelReadings)) {
      expect(reading).toHaveLength(1);
      expect(reading[0]).not.toContain("$\\");
      expect(reading[0].trim().length).toBeGreaterThan(80);
    }
    expect(grammeDynamoParallelReadings[49][0]).toContain("Fig. 11");
    expect(grammeDynamoParallelReadings[51][0]).toContain("first to beginning of third");
    expect(grammeDynamoParallelReadings[59][0]).toContain("inside or outside");
  });
});
