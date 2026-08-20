import { describe, expect, test } from "bun:test";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { eInkArchivalEdition, eInkParallelReadings } from "@/data/editions/eInkEdition";

describe("eInkArchivalEdition", () => {
  test("is a valid, complete manual edition of US 6,120,588", () => {
    const result = validateCuratedSpecificationEdition(eInkArchivalEdition);
    expect(result).toEqual({
      valid: true,
      errors: [],
    });
    expect(eInkArchivalEdition.blocks.some((b) => b.kind === "claim")).toBe(true);
    expect(Object.keys(eInkParallelReadings).length).toBeGreaterThan(0);
  });
});
