import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import type { CuratedSpecificationBlock, CuratedSpecificationEdition } from "@/types/patent";
import { fermiReactorPatent } from "../patents/fermi-reactor";
import {
  fermiReactorArchivalEdition,
  fermiReactorClaims,
  fermiReactorParallelReadings,
} from "./fermiReactorEdition";

const publicFile = (url: string) => join(process.cwd(), "public", url.replace(/^\//, ""));
const editionBlocks: readonly CuratedSpecificationBlock[] = fermiReactorArchivalEdition.blocks;

describe("US 2,708,656 Fermi/Szilard manual archival edition", () => {
  test("serves the bound edition in the canonical record", () => {
    expect(Boolean(fermiReactorArchivalEdition.completeFacsimileReviewed)).toBe(false);
    // Owner recalibration (2026-08-22): complete original texts publish even
    // with minor imperfections; holds are reserved for fabricated content.
    expect(fermiReactorPatent.archivalEdition).toBe(fermiReactorArchivalEdition);
    expect(fermiReactorPatent.originalTextAsset).toBeDefined();
    const validation = validateCuratedSpecificationEdition(
      fermiReactorArchivalEdition as unknown as CuratedSpecificationEdition,
    );
    expect(validation.valid).toBe(true);
    expect(validation.errors).toEqual([]);
  });

  test("pins the source PDF digest of the published text asset", () => {
    const pdf = publicFile(fermiReactorPatent.originalPdfUrl);
    expect(createHash("sha256").update(readFileSync(pdf)).digest("hex")).toBe(
      fermiReactorArchivalEdition.sourcePdfSha256,
    );
    expect(fermiReactorPatent.originalTextAsset).toBeDefined();
    expect(fermiReactorPatent.archivalEdition).toBe(fermiReactorArchivalEdition);
  });

  test("uses the eight exact printed claims, all independent", () => {
    expect(fermiReactorPatent.claims.map((claim) => claim.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8,
    ]);
    expect(fermiReactorPatent.claims.every((claim) => claim.isIndependent)).toBe(true);
    expect(fermiReactorClaims).toHaveLength(8);
    expect(fermiReactorPatent.stats).toMatchObject({ totalClaims: 8, independentClaims: 8 });
  });

  test("pins the bounded reviewed ledger reconciliation for PDF pages 36–38", () => {
    const ledger = readFileSync(
      publicFile("/patents/transcripts/us-2708656-fermi-reactor-reviewed.txt"),
      "utf8",
    );
    for (const page of [36, 37, 38]) {
      expect(ledger).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${page} OF 58 ---`);
    }
    expect(ledger).toContain("One side of the reactor side wall 11");
    expect(ledger).toContain("The uranium-bearing rows are spaced by rows of dead graphite");
    expect(ledger).toContain("At least from the halfway point of construction");
    const sourceFaceText = editionBlocks
      .filter((block) => block.kind === "paragraph")
      .flatMap((block) => (block.kind === "paragraph" ? block.inlines : []))
      .map((inline) => inline.text)
      .join(" ");
    expect(sourceFaceText).toContain("safety-rod apertures 40");
    expect(sourceFaceText).toContain("boron fluoride");
    expect(sourceFaceText).toContain("saturation values");
    for (const expectedTerm of [
      "SOLID MODERATOR",
      "shielding",
      "vault space",
      "pile",
      "cubic lattice",
      "Ionization chamber",
      "boron fluoride",
      "convergent",
      "indium-foil measurements",
      "saturation values",
    ]) {
      expect(
        editionBlocks.some(
          (block) =>
            "inlines" in block &&
            block.inlines.some((inline) => inline.kind === "term" && inline.text === expectedTerm),
        ),
      ).toBe(true);
    }
  });

  test("pins the bounded reviewed ledger reconciliation for PDF pages 39–41", () => {
    const ledger = readFileSync(
      publicFile("/patents/transcripts/us-2708656-fermi-reactor-reviewed.txt"),
      "utf8",
    );
    for (const page of [39, 40, 41]) {
      expect(ledger).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${page} OF 58 ---`);
    }
    expect(ledger).toContain(
      "The reactor is capable of operation at an output as high as 10,000 kilowatts",
    );
    expect(ledger).toContain("The neutron-density distribution in a spherical reactor");
    expect(ledger).toContain("BERYLLIUM METAL, DENSITY 1.85 GM./CM.3");
    const sourceFaceText = editionBlocks
      .filter((block) => block.kind === "paragraph")
      .flatMap((block) => (block.kind === "paragraph" ? block.inlines : []))
      .map((inline) => inline.text)
      .join(" ");
    expect(sourceFaceText).toContain("flattened rotational ellipsoid");
    expect(sourceFaceText).toContain("liquid-moderator structure");
    expect(sourceFaceText).toContain("unit-cell ratios");
    for (const expectedTerm of [
      "conductively cooled",
      "saturation activity",
      "flattened rotational ellipsoid",
      "effective radius",
      "neutron-density distribution",
      "cosine curve",
      "D2O reactor",
      "critical size",
      "liquid-moderator structure",
      "irradiation well",
      "Diphenyl",
      "seed portion",
      "resonance capture",
      "unit-cell ratios",
    ]) {
      expect(
        editionBlocks.some(
          (block) =>
            "inlines" in block &&
            block.inlines.some((inline) => inline.kind === "term" && inline.text === expectedTerm),
        ),
      ).toBe(true);
    }
  });

  test("pins the bounded reviewed ledger reconciliation for PDF pages 42–44", () => {
    const ledger = readFileSync(
      publicFile("/patents/transcripts/us-2708656-fermi-reactor-reviewed.txt"),
      "utf8",
    );
    for (const page of [42, 43, 44]) {
      expect(ledger).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${page} OF 58 ---`);
    }
    expect(ledger).toContain("The curves account for resonance and moderator losses only");
    expect(ledger).toContain("REDUCTION OF NEUTRON LOSSES DUE TO IMPURITIES IN THE MATERIALS");
    expect(ledger).toContain(
      "The resulting danger sum is expressed as an equivalent boron absorption",
    );
    const sourceFaceText = editionBlocks
      .filter((block) => block.kind === "paragraph")
      .flatMap((block) => (block.kind === "paragraph" ? block.inlines : []))
      .map((inline) => inline.text)
      .join(" ");
    expect(sourceFaceText).toContain("neutronic purity");
    expect(sourceFaceText).toContain("water extractions");
    expect(sourceFaceText).toContain("equivalent boron absorption");
    for (const expectedTerm of [
      "impurity losses",
      "neutronic purity",
      "ether solution",
      "water extraction",
      "water extractions",
      "neutron detector",
      "equivalent boron absorption",
      "absorption ratio",
      "shotgun test",
    ]) {
      expect(
        editionBlocks.some(
          (block) =>
            "inlines" in block &&
            block.inlines.some((inline) => inline.kind === "term" && inline.text === expectedTerm),
        ),
      ).toBe(true);
    }
  });

  test("pins the bounded reviewed ledger reconciliation for PDF pages 45–47", () => {
    const ledger = readFileSync(
      publicFile("/patents/transcripts/us-2708656-fermi-reactor-reviewed.txt"),
      "utf8",
    );
    for (const page of [45, 46, 47]) {
      expect(ledger).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${page} OF 58 ---`);
    }
    expect(ledger).toContain("EFFECT OF A COOLING SYSTEM IN A NEUTRONIC REACTOR");
    expect(ledger).toContain("AN ILLUSTRATIVE GAS-COOLED NEUTRONIC REACTOR");
    expect(ledger).toContain(
      "With about one per cent of fission neutrons delayed for a mean time of about five seconds",
    );
    expect(ledger).toContain(
      "After loading, the fan is started and the control rod withdrawn until the desired power",
    );
    const sourceFaceText = editionBlocks
      .filter((block) => block.kind === "paragraph")
      .flatMap((block) => (block.kind === "paragraph" ? block.inlines : []))
      .map((inline) => inline.text)
      .join(" ");
    expect(sourceFaceText).toContain("conductively cooled");
    expect(sourceFaceText).toContain("aluminum-jacketed uranium slugs");
    expect(sourceFaceText).toContain("Loading apertures");
    expect(sourceFaceText).toContain("delayed neutron emission");
    const figureLabels = editionBlocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.flatMap((inline) =>
            inline.kind === "reference" && inline.referenceType === "figure" ? [inline.text] : [],
          )
        : [],
    );
    for (const expectedFigureLabel of [
      "Figs. 31 through 36",
      "Figs. 31 and 32",
      "Fig. 34",
      "Fig. 32",
      "Figs. 31 and 35",
    ]) {
      expect(figureLabels).toContain(expectedFigureLabel);
    }
    for (const expectedTerm of [
      "conductively cooled",
      "coolant",
      "fission fragments",
      "heat-exchange relation",
      "Air cooling",
      "gas-cooled structure",
      "air channels",
      "reproduction ratio",
      "aluminum-jacketed",
      "sizing die",
      "fission neutrons delayed",
      "Control rod",
      "rack and pinion",
      "Loading apertures",
      "charging tube",
      "delayed neutron emission",
    ]) {
      expect(
        editionBlocks.some(
          (block) =>
            "inlines" in block &&
            block.inlines.some((inline) => inline.kind === "term" && inline.text === expectedTerm),
        ),
      ).toBe(true);
    }
  });

  test("pins the bounded reviewed ledger reconciliation for PDF pages 48–50", () => {
    const ledger = readFileSync(
      publicFile("/patents/transcripts/us-2708656-fermi-reactor-reviewed.txt"),
      "utf8",
    );
    for (const page of [48, 49, 50]) {
      expect(ledger).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${page} OF 58 ---`);
    }
    expect(ledger).toContain("AN ILLUSTRATIVE LIQUID-COOLED NEUTRONIC REACTOR");
    expect(ledger).toContain(
      "For one liquid-cooled uranium-graphite example designed for continuous operation at about 100,000 kilowatts",
    );
    expect(ledger).toContain(
      "When reactors are constructed of concentric layers, the average K can be calculated",
    );
    expect(ledger).toContain("The curves in Fig. 40 permit calculation of the overall K");
    const sourceFaceText = editionBlocks
      .filter((block) => block.kind === "paragraph")
      .flatMap((block) => (block.kind === "paragraph" ? block.inlines : []))
      .map((inline) => inline.text)
      .join(" ");
    for (const expectedSourceText of [
      "coffin chamber",
      "liquid coolant",
      "fluid-tight steel casing",
      "coolant annulus",
      "liquid annulus",
      "parasitic impurities",
      "D2O-moderated central portion",
      "concentric layers",
      "statistical weight",
      "migration length",
      "relaxation distance",
      "exponential pile",
      "critical size",
    ]) {
      expect(sourceFaceText).toContain(expectedSourceText);
    }
    const figureLabels = editionBlocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.flatMap((inline) =>
            inline.kind === "reference" && inline.referenceType === "figure" ? [inline.text] : [],
          )
        : [],
    );
    for (const expectedFigureLabel of ["Figs. 37, 38, and 39", "Fig. 39", "Fig. 40"]) {
      expect(figureLabels).toContain(expectedFigureLabel);
    }
    for (const expectedTerm of [
      "coffin chamber",
      "lead shield",
      "under water",
      "Liquid cooling",
      "liquid coolant",
      "fluid-tight steel casing",
      "coolant annulus",
      "liquid annulus",
      "danger sum",
      "parasitic impurities",
      "D2O-moderated central portion",
      "concentric layers",
      "statistical weight",
      "migration length",
      "relaxation distance",
      "exponential pile",
      "critical radius",
      "critical size",
    ]) {
      expect(
        editionBlocks.some(
          (block) =>
            "inlines" in block &&
            block.inlines.some((inline) => inline.kind === "term" && inline.text === expectedTerm),
        ),
      ).toBe(true);
    }
    for (const paragraphIndex of [73, 74, 75, 76, 77, 78, 79, 81, 82, 83, 84, 85]) {
      expect(fermiReactorParallelReadings[paragraphIndex]?.join(" ").length).toBeGreaterThan(40);
    }
  });

  test("pairs every prose paragraph with an authored parallel reading", () => {
    const explainableBlocks = editionBlocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(fermiReactorParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(explainableBlocks);
    for (const index of explainableBlocks) {
      expect(fermiReactorParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(30);
    }
  });

  test("makes source drawing sheets available as local crops", () => {
    const references = editionBlocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.filter(
            (inline) => inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    expect(references.length).toBeGreaterThan(0);
    for (const reference of references) {
      if (reference.kind !== "reference" || reference.referenceType !== "figure") continue;
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toStartWith("/patents/figures/us-2708656-fermi-reactor/");
        expect(existsSync(publicFile(preview.src))).toBe(true);
      }
    }
  });

  test("validates reviewed transcription ledger with 58-page markers", () => {
    const ledger = readFileSync(
      publicFile("/patents/transcripts/us-2708656-fermi-reactor-reviewed.txt"),
      "utf8",
    );
    expect(validateReviewedTranscription(ledger, 58)).toEqual({ valid: true });
    expect(fermiReactorPatent.originalTextAsset).toBeDefined();
    expect(fermiReactorPatent.archivalEdition).toBe(fermiReactorArchivalEdition);
  });
});
