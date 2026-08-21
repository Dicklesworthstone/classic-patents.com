import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { teslaTeleautomatonPatent } from "@/data/patents/tesla-teleautomaton";
import { teslaTeleautomatonArchivalEdition } from "./teslaTeleautomatonEdition";

const PINNED_SHA256 = "b92da6bad46cca996f7ecc99a16a87bdd38d12b3e04a0fce11cc5f033aed849b";

describe("US 613,809 Nikola Tesla Teleautomaton manual archival edition", () => {
  test("pins the thirteen-page source candidate and publishes valid manual edition", () => {
    expect(teslaTeleautomatonPatent.archivalEdition).toBe(teslaTeleautomatonArchivalEdition);
    expect(teslaTeleautomatonPatent.originalTextAsset).toBeDefined();
    expect(teslaTeleautomatonArchivalEdition.sourcePdfSha256).toBe(PINNED_SHA256);
    expect(validateCuratedSpecificationEdition(teslaTeleautomatonArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${teslaTeleautomatonPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(PINNED_SHA256);
    expect(teslaTeleautomatonPatent.claims.map((claim) => claim.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
    ]);
  });

  test("makes figure previews available as local crops", () => {
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
  });

  test("verifies reviewed transcription ledger", () => {
    const transcriptPath = resolve(
      process.cwd(),
      "public",
      "patents",
      "transcripts",
      "us-613809-tesla-teleautomaton-reviewed.txt",
    );
    expect(existsSync(transcriptPath)).toBe(true);
    const transcript = readFileSync(transcriptPath, "utf-8");
    const validation = validateReviewedTranscription(transcript, 13);
    expect(validation.valid).toBe(true);
  });
});
