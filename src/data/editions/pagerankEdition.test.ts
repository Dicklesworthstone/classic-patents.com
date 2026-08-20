import { describe, expect, test } from "bun:test";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { pagerankArchivalEdition, pagerankParallelReadings } from "@/data/editions/pagerankEdition";

describe("pagerankArchivalEdition", () => {
  test("is a valid, complete manual edition of US 6,285,999", () => {
    const result = validateCuratedSpecificationEdition(pagerankArchivalEdition);
    expect(result).toEqual({
      valid: true,
      errors: [],
    });
    expect(pagerankArchivalEdition.blocks.some((b) => b.kind === "claim")).toBe(true);
    expect(Object.keys(pagerankParallelReadings).length).toBeGreaterThan(0);
  });
});
