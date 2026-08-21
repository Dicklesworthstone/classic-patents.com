import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { fermiReactorPatent } from "../patents/fermi-reactor";
import {
  fermiReactorArchivalEdition,
  fermiReactorClaims,
  fermiReactorParallelReadings,
} from "./fermiReactorEdition";

const publicFile = (url: string) => join(process.cwd(), "public", url.replace(/^\//, ""));

describe("US 2,708,656 Fermi/Szilard manual archival edition", () => {
  test("publishes valid manual archival edition and originalTextAsset", () => {
    expect(fermiReactorPatent.archivalEdition).toBe(
      fermiReactorArchivalEdition as unknown as CuratedSpecificationEdition,
    );
    expect(fermiReactorPatent.originalTextAsset).toBeDefined();
  });

  test("pins the 58-page facsimile and retains a structurally valid staged edition", () => {
    if (fermiReactorPatent.archivalEdition)
      expect(fermiReactorPatent.archivalEdition).toBe(
        fermiReactorArchivalEdition as unknown as CuratedSpecificationEdition,
      );
    expect(
      validateCuratedSpecificationEdition(
        fermiReactorArchivalEdition as unknown as CuratedSpecificationEdition,
      ),
    ).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = publicFile(fermiReactorPatent.originalPdfUrl);
    expect(createHash("sha256").update(readFileSync(pdf)).digest("hex")).toBe(
      fermiReactorArchivalEdition.sourcePdfSha256,
    );
    if (fermiReactorPatent.originalTextAsset?.kind === "reviewed-transcription")
      expect(fermiReactorPatent.originalTextAsset).toMatchObject({
        kind: "reviewed-transcription",
        pageCount: 58,
        sourcePdfSha256: fermiReactorArchivalEdition.sourcePdfSha256,
      });
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
    const sourceFaceText = fermiReactorArchivalEdition.blocks
      .filter((block) => block.kind === "paragraph")
      .flatMap((block) => (block.kind === "paragraph" ? block.inlines : []))
      .map((inline) => inline.text)
      .join(" ");
    expect(sourceFaceText).toContain("safety-rod apertures 40");
    expect(sourceFaceText).toContain("boron fluoride");
    expect(sourceFaceText).toContain("saturation values A0");
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
        fermiReactorArchivalEdition.blocks.some(
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
    const sourceFaceText = fermiReactorArchivalEdition.blocks
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
        fermiReactorArchivalEdition.blocks.some(
          (block) =>
            "inlines" in block &&
            block.inlines.some((inline) => inline.kind === "term" && inline.text === expectedTerm),
        ),
      ).toBe(true);
    }
  });

  test("pairs every prose paragraph with an authored parallel reading", () => {
    const explainableBlocks = fermiReactorArchivalEdition.blocks.flatMap((block, index) =>
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
    const references = fermiReactorArchivalEdition.blocks.flatMap((block) =>
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
  });
});
