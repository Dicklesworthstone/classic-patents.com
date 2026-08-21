import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  davenportElectricMotorArchivalEdition,
  davenportElectricMotorParallelReadings,
} from "@/data/editions/davenportElectricMotorEdition";
import { davenportElectricMotorPatent } from "@/data/patents/davenport-electric-motor";
import {
  validateReviewedTranscriptionEditorialIntegrity,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";

function readPngDimensions(bytes: Buffer): { width: number; height: number } {
  expect(bytes.subarray(1, 4).toString("ascii")).toBe("PNG");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

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
    expect(publicText).not.toContain("drawing-sheet-preview.png");
    expect(davenportElectricMotorPatent.filingDate).toBeNull();
    expect(davenportElectricMotorPatent.drawings[0]?.figureNumber).toBe("Unnumbered drawing sheet");
    expect(
      davenportElectricMotorPatent.drawings[0]?.callouts.map((callout) => callout.label),
    ).toEqual(["A", "B, C", "D–I", "K, L", "M–P, Q", "R, V", "S, T"]);
    expect(davenportElectricMotorPatent.stats?.patentWarYears).toBeUndefined();
    expect(davenportElectricMotorPatent.stats?.impactScore).toBeUndefined();
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
    const expectedPreviews = [
      {
        src: "/patents/figures/us-132-davenport-electric-motor/drawing-view-1-source-crop-v2.png",
        width: 1080,
        height: 560,
        sha256: "c1e0f4d53c41e80b1e0b9ddd69007f3e92fded589313d7cf9d64aadcffceb86e",
      },
      {
        src: "/patents/figures/us-132-davenport-electric-motor/drawing-view-2-source-crop-v2.png",
        width: 730,
        height: 500,
        sha256: "ec1cb8b8f44380320e08ab84eb7f94dd09b4dd637e18400a4469c55a6063e2be",
      },
      {
        src: "/patents/figures/us-132-davenport-electric-motor/drawing-view-3-source-crop-v2.png",
        width: 630,
        height: 500,
        sha256: "a2bccbe0bcca8234fd10b67636552128d1d4cd2f9812d325a0bc72cb759bc7d9",
      },
    ] as const;
    const drawingReference = davenportElectricMotorArchivalEdition.blocks
      .flatMap((block) => ("inlines" in block ? block.inlines : []))
      .find((inline) => inline.kind === "reference" && inline.referenceType === "figure");
    expect(drawingReference?.kind).toBe("reference");
    if (drawingReference?.kind !== "reference") {
      throw new Error("US 132 is missing its authored drawing reference.");
    }
    expect(drawingReference.figurePreviews).toEqual(
      expectedPreviews.map(({ sha256: _sha256, ...preview }) => expect.objectContaining(preview)),
    );
    for (const expected of expectedPreviews) {
      const path = join(process.cwd(), "public", expected.src.slice(1));
      expect(existsSync(path)).toBe(true);
      const bytes = readFileSync(path);
      expect(readPngDimensions(bytes)).toEqual({
        width: expected.width,
        height: expected.height,
      });
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(expected.sha256);
    }
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
    expect(validateReviewedTranscriptionEditorialIntegrity(ledger, 3)).toEqual({ valid: true });
    expect(ledger).not.toContain("Drawing sheet:");
    expect(ledger).toContain("A, B, C, D, E, F, G, H, I, K, L, M, N, O, P, Q, R, S, T, V");
    expect(ledger).toContain("not confidently legible in the supplied scan");
  });
});
