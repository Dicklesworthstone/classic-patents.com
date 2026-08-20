import { describe, expect, test } from "bun:test";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { roombaArchivalEdition, roombaParallelReadings } from "@/data/editions/roombaEdition";

describe("roombaArchivalEdition", () => {
  test("is a valid, complete manual edition of US 6,594,844", () => {
    const result = validateCuratedSpecificationEdition(roombaArchivalEdition);
    expect(result).toEqual({
      valid: true,
      errors: [],
    });
    expect(roombaArchivalEdition.blocks.some((b) => b.kind === "claim")).toBe(true);
    expect(Object.keys(roombaParallelReadings).length).toBeGreaterThan(0);
  });
});
