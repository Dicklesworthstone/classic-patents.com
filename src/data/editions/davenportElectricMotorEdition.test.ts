import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  davenportElectricMotorArchivalEdition,
  davenportElectricMotorParallelReadings,
} from "@/data/editions/davenportElectricMotorEdition";
import { davenportElectricMotorPatent } from "@/data/patents/davenport-electric-motor";
import { validateReviewedTranscriptionPageAnchors } from "@/data/patents/sourceTextValidation";

describe("davenportElectricMotorArchivalEdition", () => {
  test("is a complete manual edition pinned to the US 132 facsimile", () => {
    expect(validateCuratedSpecificationEdition(davenportElectricMotorArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(davenportElectricMotorArchivalEdition.sourcePdfSha256).toBe(
      "9147fc5c9d6565aa765198b42e900c90c5c0fe550b9162fe62727f86a5071960",
    );
    expect(
      davenportElectricMotorArchivalEdition.blocks.filter((block) => block.kind === "claim"),
    ).toHaveLength(1);
  });

  test("keeps the drawing sheet and scan pagination out of continuous prose", () => {
    const publicText = JSON.stringify(davenportElectricMotorArchivalEdition.blocks);
    expect(publicText).not.toContain("--- SOURCE PDF PAGE");
    expect(publicText).not.toContain("PAGE 2 OF 3");
    expect(publicText).toContain("drawing-sheet-preview.png");
  });

  test("keeps the sole printed claim and its local drawing evidence explicit", () => {
    const claim = davenportElectricMotorArchivalEdition.blocks.find(
      (block) => block.kind === "claim",
    );
    expect(claim?.kind).toBe("claim");
    if (claim?.kind !== "claim") throw new Error("US 132 is missing its sole printed claim.");
    expect(claim.inlines.map((inline) => inline.text).join("")).toBe(
      "Applying magnetic and electro-magnetic power as a moving principle for machinery in the manner above described, or in any other substantially the same in principle.",
    );
    expect(davenportElectricMotorPatent.claims[0]?.originalText).toBe(
      claim.inlines.map((inline) => inline.text).join(""),
    );
    expect(
      existsSync(
        join(
          process.cwd(),
          "public/patents/figures/us-132-davenport-electric-motor/drawing-sheet-preview.png",
        ),
      ),
    ).toBe(true);
    expect(
      readFileSync(
        join(process.cwd(), "docs/provenance/us-132-davenport-electric-motor.md"),
        "utf8",
      ),
    ).toContain("9147fc5c9d6565aa765198b42e900c90c5c0fe550b9162fe62727f86a5071960");
  });

  test("fails closed when the authored formal claim is removed", () => {
    expect(
      validateCuratedSpecificationEdition({
        ...davenportElectricMotorArchivalEdition,
        blocks: davenportElectricMotorArchivalEdition.blocks.filter(
          (block) => block.kind !== "claim",
        ),
      }).valid,
    ).toBe(false);
  });

  test("exports renderer-compatible readings for every authored source paragraph only", () => {
    const sourceBlocks = davenportElectricMotorArchivalEdition.blocks
      .map((block, sourceBlockIndex) => ({ block, sourceBlockIndex }))
      .filter(({ block }) => block.kind === "paragraph");

    const readingIndexes = Object.keys(davenportElectricMotorParallelReadings)
      .map(Number)
      .sort((left, right) => left - right);

    expect(readingIndexes).toHaveLength(sourceBlocks.length);
    expect(readingIndexes).toEqual(sourceBlocks.map(({ sourceBlockIndex }) => sourceBlockIndex));
    expect(
      Object.values(davenportElectricMotorParallelReadings).every(
        (reading) => Array.isArray(reading) && reading.length > 0 && reading.join(" ").length > 80,
      ),
    ).toBe(true);
    expect(davenportElectricMotorParallelReadings[14]).toBeUndefined();
  });

  test("keeps all three visual facsimile pages aligned to their reviewed-ledger sections", () => {
    const sourceAsset = davenportElectricMotorPatent.originalTextAsset;
    if (!sourceAsset) throw new Error("US 132 is missing its reviewed transcription asset.");
    const ledger = readFileSync(
      join(process.cwd(), "public/patents/transcripts/us-132-davenport-electric-motor.txt"),
      "utf8",
    );
    expect(validateReviewedTranscriptionPageAnchors(ledger, 3, sourceAsset.pageAnchors)).toEqual({
      valid: true,
    });
  });
});
