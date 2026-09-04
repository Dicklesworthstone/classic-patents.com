import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { noyceIcPatent } from "@/data/patents/noyce-ic";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import type { CuratedSpecificationInline } from "@/types/patent";
import {
  noyceIcArchivalEdition,
  noyceIcOriginalTextExcerpt,
  noyceIcParallelReadings,
} from "./noyceIcEdition";

const NOYCE_SOURCE_SHEETS = {
  "/patents/figures/us-2981877-noyce-ic/source-sheet-1-v1.png": {
    sha256: "5c712d83a261ef7cb40ce16f63a557d79f149a7bedc029bd8092730cb8846aef",
    width: 2320,
    height: 3408,
  },
  "/patents/figures/us-2981877-noyce-ic/source-sheet-2-v1.png": {
    sha256: "c859f8f64fb58cd725beb5914d25793a96242d8026ebb6dc4d2d007cde23e1b6",
    width: 2320,
    height: 3408,
  },
  "/patents/figures/us-2981877-noyce-ic/source-sheet-3-v1.png": {
    sha256: "3d9e2032361d8433675827cd79f6f6440efed65c6e5b1470f0b83bfade4fc99c",
    width: 2320,
    height: 3408,
  },
} as const;

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

  test("contains every literal masthead, specification, claim, and cited-reference block in the reviewed ledger", () => {
    const ledger = readFileSync(
      `${process.cwd()}/public/patents/transcripts/us-2981877-noyce-ic-reviewed.txt`,
      "utf8",
    );
    const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "");
    const ledgerText = normalize(ledger);
    const printedBlocks = noyceIcArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "masthead") return block.lines;
      if (block.kind === "paragraph" || block.kind === "claim") {
        return [block.inlines.map((inline) => inline.text).join("")];
      }
      if (block.kind === "heading") return [block.text];
      if (block.kind === "table") {
        return [
          ...block.rows.flatMap((row) =>
            row.map((cell) => cell.map((inline) => inline.text).join("")),
          ),
        ];
      }
      return [];
    });
    for (const printedBlock of printedBlocks) {
      expect(ledgerText).toContain(normalize(printedBlock));
    }
    expect(JSON.stringify(noyceIcArchivalEdition)).not.toContain("--- REVIEWED TRANSCRIPTION PAGE");
  });

  test("retains the citation headings' source punctuation", () => {
    const ledger = readFileSync(
      `${process.cwd()}/public/patents/transcripts/us-2981877-noyce-ic-reviewed.txt`,
      "utf8",
    );
    expect(ledger).toContain("References Cited in the file of this patent\nUNITED STATES PATENTS");
    expect(ledger).not.toContain("References Cited in the file of this patent:");
    expect(ledger).not.toContain("UNITED STATES PATENTS:");
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
    const shuntCapacitance = noyceIcArchivalEdition.blocks
      .flatMap((block) => ("inlines" in block ? block.inlines : []))
      .find((inline) => inline.kind === "term" && inline.text === "shunt capacitance");
    expect(shuntCapacitance?.kind).toBe("term");
    if (shuntCapacitance?.kind === "term") {
      expect(shuntCapacitance.definition.length).toBeGreaterThan(80);
      expect(shuntCapacitance.definition).toContain("lead");
      expect(shuntCapacitance.definition).toContain("semiconductor body");
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

  test("derives the catalogue opening excerpt from the authored edition and removes the stale base claim copy", () => {
    expect(noyceIcPatent.originalText).toBe(noyceIcOriginalTextExcerpt);
    expect(noyceIcPatent.originalText).toContain(
      "This invention relates to electrical circuit structures incorporating semiconductor devices.",
    );
    expect(noyceIcPatent.originalText).toContain("In brief, the present invention utilizes");
    expect(noyceIcPatent.originalText).not.toContain(
      "This catalogue excerpt is not the archival edition",
    );
    const patentSource = readFileSync(
      resolve(process.cwd(), "src/data/patents/noyce-ic.ts"),
      "utf8",
    );
    expect(patentSource).not.toMatch(/const baseNoyceIcPatent[\s\S]*?claims:\s*\[/);
    expect(patentSource).not.toContain("A semiconductor device as defined in claim 1");
  });

  test("pins every active figure citation to a complete primary drawing sheet", () => {
    const editionJson = JSON.stringify(noyceIcArchivalEdition);
    for (const [asset, expected] of Object.entries(NOYCE_SOURCE_SHEETS)) {
      const sheet = resolve(process.cwd(), "public", asset.slice(1));
      const bytes = readFileSync(sheet);
      expect(existsSync(sheet)).toBe(true);
      expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
      expect({ width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }).toEqual({
        width: expected.width,
        height: expected.height,
      });
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(expected.sha256);
      expect(editionJson).toContain(asset);
    }
    for (const legacyCrop of [
      "fig-1-source-crop-v1.png",
      "fig-1-source-crop-v2.png",
      "fig-2-source-crop-v1.png",
      "fig-2-source-crop-v2.png",
      "fig-3-source-crop-v1.png",
      "fig-3-source-crop-v2.png",
      "fig-3-source-crop-v3.png",
      "fig-4-source-crop-v1.png",
      "fig-4-source-crop-v2.png",
      "fig-4-source-crop-v3.png",
      "fig-5-source-crop-v1.png",
      "fig-5-source-crop-v2-left.png",
      "fig-5-source-crop-v2-right.png",
      "fig-6-source-crop-v1.png",
      "fig-6-source-crop-v2.png",
      "fig-7-source-crop-v1.png",
      "fig-7-source-crop-v2.png",
    ]) {
      expect(
        existsSync(
          resolve(process.cwd(), "public/patents/figures/us-2981877-noyce-ic", legacyCrop),
        ),
      ).toBe(true);
      expect(editionJson).not.toContain(legacyCrop);
    }
  });

  test("pairs each source paragraph explicitly and maps every literal figure occurrence to pinned source sheets", () => {
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
    const figureReferences = (inlines: readonly CuratedSpecificationInline[]) =>
      inlines.filter(
        (inline): inline is Extract<CuratedSpecificationInline, { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    const figures = noyceIcArchivalEdition.blocks.flatMap((block) => {
      if ("inlines" in block) return figureReferences(block.inlines);
      if (block.kind === "figure-sheet") return figureReferences(block.description);
      return [];
    });
    const literalTargets: Record<string, number> = {
      "2": 2,
      "4": 4,
      "7": 7,
      "Fig. 1": 1,
      "Fig. 2": 2,
      "Fig. 3": 3,
      "Fig. 4": 4,
      "Fig. 5": 5,
      "Fig. 6": 6,
      "Fig. 7": 7,
      "Figs. 1": 1,
      "Figs. 3": 3,
      "Figs. 6": 6,
    };
    const literalCounts = {
      "2": 4,
      "4": 7,
      "7": 1,
      "Fig. 1": 3,
      "Fig. 2": 2,
      "Fig. 3": 3,
      "Fig. 4": 2,
      "Fig. 5": 16,
      "Fig. 6": 3,
      "Fig. 7": 2,
      "Figs. 1": 4,
      "Figs. 3": 7,
      "Figs. 6": 1,
    };
    const sourceSheetByFigure: Record<number, keyof typeof NOYCE_SOURCE_SHEETS> = {
      1: "/patents/figures/us-2981877-noyce-ic/source-sheet-1-v1.png",
      2: "/patents/figures/us-2981877-noyce-ic/source-sheet-1-v1.png",
      3: "/patents/figures/us-2981877-noyce-ic/source-sheet-2-v1.png",
      4: "/patents/figures/us-2981877-noyce-ic/source-sheet-2-v1.png",
      5: "/patents/figures/us-2981877-noyce-ic/source-sheet-2-v1.png",
      6: "/patents/figures/us-2981877-noyce-ic/source-sheet-3-v1.png",
      7: "/patents/figures/us-2981877-noyce-ic/source-sheet-3-v1.png",
    };
    expect(figures).toHaveLength(55);
    expect(
      Object.fromEntries(
        Object.entries(literalCounts).map(([literal]) => [
          literal,
          figures.filter((reference) => reference.text === literal).length,
        ]),
      ),
    ).toEqual(literalCounts);
    for (const reference of figures) {
      const target = literalTargets[reference.text];
      expect(target).toBeDefined();
      expect(reference.label).toBe(
        `Open the complete primary drawing sheet for Fig. ${target} in US 2,981,877`,
      );
      expect(
        reference.figurePreviews?.map(({ src, width, height }) => ({ src, width, height })),
      ).toEqual([
        {
          src: sourceSheetByFigure[target],
          width: 2320,
          height: 3408,
        },
      ]);
    }
  });

  test("derives each published claim verbatim from the archival-edition claim node", () => {
    for (const claim of noyceIcPatent.claims) {
      const editionClaim = noyceIcArchivalEdition.blocks.find(
        (block) => block.kind === "claim" && block.number === claim.number,
      );
      expect(editionClaim?.kind).toBe("claim");
      if (editionClaim?.kind === "claim") {
        expect(claim.originalText).toBe(editionClaim.inlines.map((inline) => inline.text).join(""));
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

  test("provides valid provenance classifications for all Noyce controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-2981877-noyce-ic"];
    expect(entry).toBeDefined();
    expect(entry.controls.map((ctrl: { provenance: string }) => ctrl.provenance)).toEqual([
      "scenario-reader",
      "topology-normalized",
    ]);
    const metrics = entry.computeMetrics({});
    expect(metrics.map((metric: { provenance: string }) => metric.provenance)).toEqual([
      "scenario-reader",
      "topology-normalized",
      "refusal-bounded",
      "refusal-bounded",
    ]);
  });

  test("accepts the source edition after all direct figure-sheet evidence is pinned", () => {
    const { evaluateArchivalPublicationState } = require("./publicationApproval");
    const decision = evaluateArchivalPublicationState(noyceIcPatent);
    expect(decision.isPublished).toBe(true);
    expect(decision.state.kind).toBe("accepted");
    expect(decision.reasonCode).toBe("ACCEPTED");
  });
});
