import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
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

  test("preserves the four source sheets and gives every cited figure its own checked source crop", async () => {
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
    expectedCropFiles[0] = "fig-1-source-crop-v3.png";
    expectedCropFiles[1] = "fig-2-source-crop-v3.png";
    expectedCropFiles[2] = "fig-3-source-crop-v2.png";
    expectedCropFiles[3] = "fig-4-source-crop-v2.png";
    expectedCropFiles[4] = "fig-5-source-crop-v3.png";
    expectedCropFiles[5] = "fig-6-source-crop-v2.png";
    expectedCropFiles[6] = "fig-7-source-crop.png";
    expectedCropFiles[7] = "fig-8-source-crop-v3.png";
    expectedCropFiles[8] = "fig-9.png";
    expectedCropFiles[9] = "fig-10-source-crop-v3.png";
    expectedCropFiles[10] = "fig-11-source-crop-v3.png";
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

    const acceptedCropProof = [
      [
        "fig-1-source-crop-v3.png",
        315,
        435,
        "833c51a8bd14b98018483346bfa0c6410605760b53abfe9c3fee3f3d2c165ac9",
      ],
      [
        "fig-2-source-crop-v3.png",
        225,
        450,
        "3ea81d59b9d4a959dc9b1f53bd6abc3de4654860920cebfdde2572be3a44773e",
      ],
      [
        "fig-5-source-crop-v3.png",
        1220,
        385,
        "a21bf1960c8007c94d494026c7dd752de4d911877e9a0de249ea1dbeb2874b3c",
      ],
      [
        "fig-8-source-crop-v3.png",
        945,
        440,
        "07c45fc62e6e4747ea3cfff29c517fcfdf27c861b0965006c0fec3e4f3b47c1a",
      ],
      [
        "fig-10-source-crop-v3.png",
        320,
        600,
        "c447d92e8c711e3c607dd114859faebc6408ec871a5a0eb3603c4e6fd63a695d",
      ],
      [
        "fig-11-source-crop-v3.png",
        450,
        450,
        "7866ed1c0d216575176f617b1b3645b9d469ae55e04af510bbae7ad4f82b45e7",
      ],
    ] as const;
    for (const [filename, width, height, sha256] of acceptedCropProof) {
      const preview = figureReferences
        .flatMap((reference) => reference.figurePreviews ?? [])
        .find((candidate) => candidate.src.endsWith(filename));
      expect(preview).toMatchObject({
        src: `/patents/figures/us-120057-gramme-dynamo/${filename}`,
        width,
        height,
      });
      const bytes = new Uint8Array(
        await Bun.file(resolve(process.cwd(), "public", preview?.src.slice(1) ?? "")).arrayBuffer(),
      );
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(sha256);
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

  test("keeps canonical claim text sourced from explicit edition blocks", () => {
    const editionClaims = grammeDynamoArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<(typeof grammeDynamoArchivalEdition.blocks)[number], { kind: "claim" }> =>
        block.kind === "claim",
    );
    const editionClaimNumbers = editionClaims.map((claim) => claim.number);
    const canonicalClaims = grammeDynamoPatent.claims;

    expect(editionClaimNumbers).toEqual([1, 2, 3]);
    expect(new Set(editionClaimNumbers).size).toBe(editionClaimNumbers.length);
    expect(canonicalClaims.map((claim) => claim.number)).toEqual(editionClaimNumbers);
    expect(canonicalClaims.map((claim) => claim.originalText)).toEqual(
      editionClaims.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
    expect(grammeDynamoPatent.stats).toEqual({ totalClaims: 3, independentClaims: 3 });
    expect(grammeDynamoPatent.stats?.totalClaims).toBe(canonicalClaims.length);
    expect(grammeDynamoPatent.stats?.independentClaims).toBe(
      canonicalClaims.filter((claim) => claim.isIndependent).length,
    );
    const includedClaimNumbers = new Set(canonicalClaims.map((claim) => claim.number));
    for (const claim of canonicalClaims) {
      for (const dependency of claim.dependsOn ?? []) {
        expect(includedClaimNumbers.has(dependency)).toBe(true);
      }
    }

    const canonicalRecordSource = readFileSync(
      resolve(process.cwd(), "src/data/patents/gramme-dynamo.ts"),
      "utf8",
    );
    expect(canonicalRecordSource).toContain("function manualClaimText");
    expect(canonicalRecordSource).toContain("grammeDynamoArchivalEdition.blocks.find");
    expect(canonicalRecordSource).not.toContain("const MANUALLY_REVIEWED_CLAIM_TEXT");
    for (const claimNumber of editionClaimNumbers) {
      expect(canonicalRecordSource).toContain(`originalText: manualClaimText(${claimNumber}),`);
    }
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
