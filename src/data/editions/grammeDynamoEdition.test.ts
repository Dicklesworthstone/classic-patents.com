import { describe, expect, test } from "bun:test";
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

  test("preserves the fourteen real figures as four source-sheet references with checked previews", () => {
    const sheets = grammeDynamoArchivalEdition.blocks.filter(
      (block) => block.kind === "figure-sheet",
    );
    expect(sheets.map((sheet) => sheet.figureLabel)).toEqual([
      "DRAWING SHEET 1",
      "DRAWING SHEET 2",
      "DRAWING SHEET 3",
      "DRAWING SHEET 4",
    ]);

    const publicText = JSON.stringify(grammeDynamoArchivalEdition.blocks);
    for (const figure of ["Fig. 1", "Fig. 4", "Fig. 7", "Fig. 10", "Fig. 12", "Fig. 14"]) {
      expect(publicText).toContain(figure);
    }
    for (const sheet of [1, 2, 3, 4]) {
      expect(publicText).toContain(
        `/patents/figures/us-120057-gramme-dynamo/drawing-sheet-${sheet}.png`,
      );
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
