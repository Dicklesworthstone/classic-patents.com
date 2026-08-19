import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { noyceIcPatent } from "@/data/patents/noyce-ic";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { noyceIcArchivalEdition, noyceIcParallelReadings } from "./noyceIcEdition";

describe("US 2,981,877 manual source edition", () => {
  test("pins the eight-page facsimile and all ten printed claims", () => {
    expect(noyceIcPatent.archivalEdition).toBe(noyceIcArchivalEdition);
    expect(validateCuratedSpecificationEdition(noyceIcArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public/patents/pdfs/us-2981877-noyce-ic.pdf`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      noyceIcArchivalEdition.sourcePdfSha256,
    );
    expect(noyceIcPatent.claims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 10 }, (_, index) => index + 1),
    );
    expect(noyceIcPatent.claims.find((claim) => claim.number === 8)?.dependsOn).toEqual([7]);
    expect(noyceIcPatent.stats).toMatchObject({ totalClaims: 10, independentClaims: 9 });
  });

  test("has a complete review locator ledger and no source-PDF text-layer publication", () => {
    const asset = noyceIcPatent.originalTextAsset;
    expect(asset).toMatchObject({
      url: "/patents/transcripts/us-2981877-noyce-ic-reviewed.txt",
      kind: "reviewed-transcription",
      pageCount: 8,
      sourcePdfSha256: noyceIcArchivalEdition.sourcePdfSha256,
    });
    if (!asset) throw new Error("Missing Noyce review ledger.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 8)).toEqual({ valid: true });
    expect(JSON.stringify(noyceIcPatent.archivalEdition)).not.toContain("source-pdf-text-layer");
  });

  test("preserves the printed drawing-sheet formal matter and labels rather than editorial summaries", () => {
    const ledger = readFileSync(
      `${process.cwd()}/public/patents/transcripts/us-2981877-noyce-ic-reviewed.txt`,
      "utf8",
    );
    for (const printedLine of [
      "R. N. NOYCE                         2,981,877",
      "SEMICONDUCTOR DEVICE-AND-LEAD STRUCTURE",
      "Filed July 30, 1959                                                     3 Sheets-Sheet 1",
      "FIG. 1",
      "FIG. 2",
      "FIG. 3",
      "FIG. 4",
      "FIG. 5",
      "FIG. 6",
      "FIG. 7",
      "~ OXIDE INSULATION ~",
      "INVENTOR.",
      "ROBERT N. NOYCE",
      "JEFFERS & KELLS",
      "ATTORNEYS",
    ]) {
      expect(ledger).toContain(printedLine);
    }
    expect(ledger).not.toContain("Drawing sheet 1 of 3:");
  });

  test("uses the source-form masthead, authored specialized-term occurrences, and claim-specific decoders", () => {
    const masthead = noyceIcArchivalEdition.blocks.find((block) => block.kind === "masthead");
    expect(masthead).toMatchObject({
      lines: [
        "UNITED STATES PATENT OFFICE",
        "2,981,877.",
        "SEMICONDUCTOR DEVICE-AND-LEAD STRUCTURE.",
        "Robert N. Noyce, Los Altos, Calif., assignor to Fairchild Semiconductor Corporation, Mountain View, Calif., a corporation of Delaware.",
        "Filed July 30, 1959, Ser. No. 830,507. 10 Claims. (Cl. 317-235.) Patented Apr. 25, 1961.",
      ],
    });
    const serializedEdition = JSON.stringify(noyceIcArchivalEdition);
    for (const term of [
      "dished junctions",
      "extrinsic semiconductor",
      "high-resistivity regions",
      "photoengraving techniques",
      "C-shaped, metal strip",
      "shunt capacitance",
      "reverse-bias junction 18",
      "parallel strips",
    ]) {
      expect(serializedEdition).toContain(`"text":"${term}"`);
    }
    expect(new Set(noyceIcPatent.claims.map((claim) => claim.plainEnglish)).size).toBe(10);
    for (const claim of noyceIcPatent.claims) {
      expect(claim.plainEnglish.length).toBeGreaterThan(180);
      expect(claim.keyInnovations.length).toBeGreaterThanOrEqual(3);
      expect(claim.plainEnglish).not.toMatch(/^Claim \d+ keeps the source's named/);
    }
    expect(noyceIcPatent.claims[5]?.plainEnglish).toContain("reverse-biases");
    expect(noyceIcPatent.claims[7]?.plainEnglish).toContain("C-shaped");
    expect(noyceIcPatent.claims[9]?.plainEnglish).toContain("parallel metal-strip");
  });

  test("pairs each source paragraph explicitly and gives every source figure a local crop", () => {
    const paragraphIndexes = noyceIcArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(noyceIcParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(paragraphIndexes);
    for (const reading of Object.values(noyceIcParallelReadings)) {
      expect(reading.join(" ").trim().length).toBeGreaterThan(80);
    }
    const figures = noyceIcArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });
    for (const number of [1, 2, 3, 4, 5, 6, 7]) {
      expect(
        figures.some((reference) =>
          reference.figurePreviews?.some((preview) => preview.alt.includes(`Fig. ${number}`)),
        ),
      ).toBe(true);
    }
    for (const reference of figures) {
      for (const preview of reference.figurePreviews ?? []) {
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }
  });

  test("uses explicitly authored canonical drawing records", () => {
    const editionSource = readFileSync(
      resolve(process.cwd(), "src/data/editions/noyceIcEdition.ts"),
      "utf8",
    );
    expect(editionSource).not.toContain("drawings: [1, 2, 3, 4, 5, 6, 7].map");
    expect(noyceIcPatent.drawings.map((drawing) => drawing.figureNumber)).toEqual([
      "Fig. 1",
      "Fig. 2",
      "Fig. 3",
      "Fig. 4",
      "Fig. 5",
      "Fig. 6",
      "Fig. 7",
    ]);
    expect(noyceIcPatent.drawings.map((drawing) => drawing.title)).not.toContain("Source Fig. 1");
  });

  test("does not leak the superseded speculative catalogue reconstruction", () => {
    expect(noyceIcPatent.shortTitle).toBe("Oxide-insulated semiconductor leads");
    expect(noyceIcPatent.historicalContext.patentWars).toEqual([]);
    const visitorCopy = JSON.stringify({
      summary: noyceIcPatent.summary,
      heroQuote: noyceIcPatent.heroQuote,
      plainEnglishExplanation: noyceIcPatent.plainEnglishExplanation,
      historicalContext: noyceIcPatent.historicalContext,
      tags: noyceIcPatent.tags,
    });
    for (const unsupportedLegacyClaim of [
      "Tyranny of Numbers",
      "Noyce v. Kilby",
      "million transistors",
      "gigahertz",
      "1,000°C",
      "Nobel Prize",
    ]) {
      expect(visitorCopy).not.toContain(unsupportedLegacyClaim);
    }
    expect(visitorCopy).toContain("surface-reaching P-N junction");
    expect(visitorCopy).toContain("reverse-biased junctions 18 and 22");
  });
});
