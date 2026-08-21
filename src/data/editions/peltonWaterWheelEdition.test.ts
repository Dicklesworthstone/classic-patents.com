import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { peltonWaterWheelPatent } from "@/data/patents/pelton-water-wheel";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionEditorialIntegrity,
} from "@/data/patents/sourceTextValidation";
import type { CuratedSpecificationEdition } from "@/types/patent";
import {
  peltonWaterWheelArchivalEdition,
  peltonWaterWheelParallelReadings,
} from "./peltonWaterWheelEdition";

const normalized = (value: string) => value.replace(/\s+/g, " ").trim();

describe("US 233,692 manual source edition", () => {
  test("pins the three-sheet facsimile and the source's one printed claim", () => {
    // Public binding is intentionally fail-closed until clean source-coordinate
    // crops replace the neighboring-matter research artifacts.
    expect(peltonWaterWheelPatent.archivalEdition).toBeUndefined();
    expect(peltonWaterWheelPatent.originalTextAsset).toMatchObject({
      url: "/patents/transcripts/us-233692-pelton-water-wheel-reviewed.txt",
      pageCount: 3,
      kind: "reviewed-transcription",
      sourcePdfSha256: "b81019c0239af3ab932bd477970c1a414a91f765a68b28f9b22444e4f95c597c",
    });
    const candidateValidation = validateCuratedSpecificationEdition(
      peltonWaterWheelArchivalEdition as unknown as CuratedSpecificationEdition,
    );
    expect(candidateValidation.valid).toBeFalse();
    expect(candidateValidation.errors).toContain(
      "The archival edition lacks an explicit full-facsimile review attestation.",
    );
    const pdf = readFileSync(
      `${process.cwd()}/public/patents/pdfs/us-233692-pelton-water-wheel.pdf`,
    );
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      peltonWaterWheelArchivalEdition.sourcePdfSha256,
    );
    expect(peltonWaterWheelPatent.claims.map((claim) => claim.number)).toEqual([1]);
    expect(peltonWaterWheelPatent.claims[0]?.isIndependent).toBe(true);
  });

  test("keeps all authored source blocks in its review ledger", () => {
    const asset = peltonWaterWheelPatent.originalTextAsset;
    if (!asset) throw new Error("US 233,692 is missing its reviewed source ledger.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 3)).toEqual({ valid: true });
    expect(validateReviewedTranscriptionEditorialIntegrity(ledger, 3)).toEqual({ valid: true });
    const normalizedLedger = normalized(
      ledger.replace(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm, ""),
    );
    for (const block of peltonWaterWheelArchivalEdition.blocks) {
      if (block.kind !== "masthead" && block.kind !== "paragraph" && block.kind !== "claim") {
        continue;
      }
      const source =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.inlines.map((inline) => inline.text).join("");
      expect(normalizedLedger).toContain(normalized(source));
    }
  });

  test("pairs every paragraph with a companion and every printed figure with a semantic ref", () => {
    const paragraphIndexes = peltonWaterWheelArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(peltonWaterWheelParallelReadings)
        .map(Number)
        .sort((left, right) => left - right),
    ).toEqual(paragraphIndexes);

    const references = peltonWaterWheelArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });
    for (const number of [1, 2, 3, 4]) {
      expect(
        references.some(
          (reference) =>
            reference.text.toLowerCase().includes(`fig. ${number}`) ||
            reference.text.toLowerCase().includes(`figure ${number}`),
        ),
      ).toBe(true);
    }
    expect(references.every((reference) => !reference.figurePreviews)).toBe(true);
  });

  test("removes invented numeric turbine claims and the fabricated second claim", () => {
    const visibleData = JSON.stringify({
      summary: peltonWaterWheelPatent.summary,
      originalText: peltonWaterWheelPatent.originalText,
      plainEnglish: peltonWaterWheelPatent.plainEnglishExplanation,
      claims: peltonWaterWheelPatent.claims,
      drawings: peltonWaterWheelPatent.drawings,
      sourceFace: peltonWaterWheelArchivalEdition.blocks,
    });
    expect(visibleData).not.toContain("170-degree");
    expect(visibleData).not.toContain("over 90 percent");
    expect(visibleData).not.toContain("half the speed");
    expect(visibleData).not.toContain("Emergency Jet Deflector");
    expect(visibleData).not.toContain("needle nozzle");
    expect(visibleData).not.toContain("$\\");
    expect(visibleData).toContain("single printed claim");
    expect(visibleData).toContain("bucket-front b");
  });
});
