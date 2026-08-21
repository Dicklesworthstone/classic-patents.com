import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { teslaTeleautomatonPatent } from "@/data/patents/tesla-teleautomaton";
import {
  teslaTeleautomatonArchivalEdition,
  teslaTeleautomatonParallelReadings,
} from "./teslaTeleautomatonEdition";

describe("US 613,809 Nikola Tesla Teleautomaton manual archival edition", () => {
  test("pins the thirteen-page source candidate and keeps it withheld after figure QC rejection", () => {
    expect(teslaTeleautomatonPatent.archivalEdition).toBeUndefined();
    expect(teslaTeleautomatonPatent.originalTextAsset).toBeUndefined();
    expect(teslaTeleautomatonArchivalEdition.sourcePdfSha256).toBe(
      "b92da6bad46cca996f7ecc99a16a87bdd38d12b3e04a0fce11cc5f033aed849b",
    );
    expect(validateCuratedSpecificationEdition(teslaTeleautomatonArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${teslaTeleautomatonPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      teslaTeleautomatonArchivalEdition.sourcePdfSha256,
    );
    expect(teslaTeleautomatonPatent.claims.map((claim) => claim.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
    ]);
  });

  test("makes all ten source drawings available as local crops", () => {
    const references = teslaTeleautomatonArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    expect(references).not.toHaveLength(0);
    for (const reference of references) {
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toStartWith("/patents/figures/us-613809-tesla-teleautomaton/");
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }

    const figureNineReferences = references.filter((reference) => reference.text === "Fig. 9");
    expect(figureNineReferences.length).toBeGreaterThan(0);
    for (const reference of figureNineReferences) {
      expect(reference.figurePreviews).toContainEqual(
        expect.objectContaining({
          src: "/patents/figures/us-613809-tesla-teleautomaton/fig-9-source-crop-v3.png",
          width: 1600,
          height: 1300,
        }),
      );
    }
  });

  test("pairs every prose paragraph with an authored parallel reading", () => {
    const explainableBlocks = teslaTeleautomatonArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(teslaTeleautomatonParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(explainableBlocks);
    for (const index of explainableBlocks) {
      expect(teslaTeleautomatonParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(
        30,
      );
    }
  });

  test("retains and validates the unbound reviewed-ledger candidate", () => {
    const ledger = readFileSync(
      `${process.cwd()}/public/patents/transcripts/us-613809-tesla-teleautomaton-reviewed.txt`,
      "utf8",
    );
    expect(validateReviewedTranscription(ledger, 13)).toEqual({ valid: true });
  });
});
