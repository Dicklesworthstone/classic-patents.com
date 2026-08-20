import { describe, expect, test } from "bun:test";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { multiTouchArchivalEdition, multiTouchParallelReadings } from "./multiTouchEdition";

describe("multiTouchArchivalEdition", () => {
  test("is a valid, complete manual edition of US 7,479,949", () => {
    const result = validateCuratedSpecificationEdition(multiTouchArchivalEdition);
    expect(result).toEqual({
      valid: true,
      errors: [],
    });
    expect(multiTouchArchivalEdition.blocks.some((b) => b.kind === "claim")).toBe(true);
    expect(Object.keys(multiTouchParallelReadings).length).toBeGreaterThan(0);
  });
});
