import { describe, expect, test } from "bun:test";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { nobelDynamitePatent } from "@/data/patents/nobel-dynamite";
import {
  nobelDynamiteArchivalEdition,
  nobelDynamiteParallelReadings,
} from "./nobelDynamiteEdition";

describe("nobelDynamiteArchivalEdition", () => {
  test("pins the complete two-page primary facsimile as authored semantic nodes", () => {
    expect(validateCuratedSpecificationEdition(nobelDynamiteArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(nobelDynamiteArchivalEdition.sourcePdfSha256).toBe(
      "06f67c50087092ed0c6110cef12d6aadc6a087747b876e516cece34288cf8b55",
    );
    expect(nobelDynamiteArchivalEdition.completeFacsimileReviewed).toBe(true);
  });

  test("keeps the sole printed claim in the archival edition and canonical record", () => {
    const claims = nobelDynamiteArchivalEdition.blocks.filter((block) => block.kind === "claim");
    expect(claims.map((claim) => claim.number)).toEqual([1]);
    expect(claims[0]?.inlines.map((inline) => inline.text).join("")).toBe(
      "The composition of matter, made substantially of the ingredients and in the manner and for the purposes set forth.",
    );
    expect(nobelDynamitePatent.archivalEdition).toBe(nobelDynamiteArchivalEdition);
    expect(nobelDynamitePatent.claims.map((claim) => claim.number)).toEqual([1]);
    expect(nobelDynamitePatent.claims[0]?.originalText).toBe(
      claims[0]?.inlines.map((inline) => inline.text).join(""),
    );
  });

  test("records the facsimile limitation in the archival edition", () => {
    expect(nobelDynamitePatent.drawings).toEqual([]);
    expect(nobelDynamiteArchivalEdition.blocks.some((block) => block.kind === "figure-sheet")).toBe(
      false,
    );
    expect(JSON.stringify(nobelDynamiteArchivalEdition.blocks)).not.toContain("Fig. 1");
  });

  test("gives every rendered source paragraph a non-lossy companion without claim keys", () => {
    const paragraphIndexes = nobelDynamiteArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(Object.keys(nobelDynamiteParallelReadings).map(Number)).toEqual(paragraphIndexes);
    for (const index of paragraphIndexes) {
      expect(nobelDynamiteParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(40);
    }
    expect(nobelDynamiteParallelReadings[36]).toBeUndefined();
  });

  test("contains authored historical-term definitions and no raw OCR publication markers", () => {
    const publicText = JSON.stringify(nobelDynamiteArchivalEdition.blocks);
    expect(publicText).toContain('"kind":"term"');
    expect(publicText).toContain("infusoria");
    expect(publicText).not.toContain("--- SOURCE PDF PAGE");
    expect(publicText).not.toContain("OCR");
  });
});
