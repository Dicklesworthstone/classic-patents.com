import { describe, expect, test } from "bun:test";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { daVinciArchivalEdition, daVinciParallelReadings } from "@/data/editions/daVinciEdition";

describe("daVinciArchivalEdition", () => {
  test("is a valid, complete manual edition of US 6,331,181", () => {
    const result = validateCuratedSpecificationEdition(daVinciArchivalEdition);
    expect(result).toEqual({
      valid: true,
      errors: [],
    });
    expect(daVinciArchivalEdition.blocks.some((b) => b.kind === "claim")).toBe(true);
    expect(Object.keys(daVinciParallelReadings).length).toBeGreaterThan(0);
  });
});
