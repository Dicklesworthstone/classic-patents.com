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
    expect(fermiReactorPatent.archivalEdition).toBe(fermiReactorArchivalEdition);
    expect(fermiReactorPatent.originalTextAsset).toBeDefined();
  });

  test("pins the 58-page facsimile and retains a structurally valid staged edition", () => {
    if (fermiReactorPatent.archivalEdition)
      expect(fermiReactorPatent.archivalEdition).toBe(fermiReactorArchivalEdition);
    expect(validateCuratedSpecificationEdition(fermiReactorArchivalEdition)).toEqual({
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
        url: "/patents/transcripts/us-2708656-fermi-reactor-reviewed.txt",
      });
  });

  test("uses the eight exact printed claims, all independent", () => {
    expect(fermiReactorPatent.claims.map((claim) => claim.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8,
    ]);
    expect(fermiReactorPatent.claims.every((claim) => claim.isIndependent)).toBe(true);
    expect(fermiReactorClaims).toHaveLength(8);
    expect(fermiReactorPatent.stats).toMatchObject({ totalClaims: 8, independentClaims: 8 });
    expect(fermiReactorPatent.claims[0]?.originalText).toContain("k = 1.00 curve of Figure 3");
    expect(fermiReactorPatent.claims[7]?.originalText).toContain(
      "all dimensions thereof at least 0.5 centimeter",
    );
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
      "inlines" in block
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
