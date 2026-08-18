import { describe, expect, test } from "bun:test";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  hollerithTabulatingArchivalEdition,
  hollerithTabulatingPage9ParallelReadings,
  hollerithTabulatingPages7To9ParallelReadings,
  hollerithTabulatingPages10To14ParallelReadings,
  hollerithTabulatingSignatureParallelReading,
} from "@/data/editions/hollerithTabulatingEdition";

describe("hollerithTabulatingArchivalEdition", () => {
  test("keeps the full manual source sequence and all printed claims", () => {
    expect(validateCuratedSpecificationEdition(hollerithTabulatingArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const claims = hollerithTabulatingArchivalEdition.blocks.filter(
      (block) => block.kind === "claim",
    );
    expect(claims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 21 }, (_, index) => index + 1),
    );
    const execution = hollerithTabulatingArchivalEdition.blocks.at(-1);
    expect(execution?.kind).toBe("paragraph");
    expect(
      execution?.kind === "paragraph" && execution.inlines.map((inline) => inline.text).join(""),
    ).toContain("Witnesses: JOHN R. FLOYD, EDWARD N. HILL.");
  });

  test("gives every authored specification paragraph a direct companion", () => {
    const paragraphs = hollerithTabulatingArchivalEdition.blocks
      .map((block, index) => ({ block, index }))
      .filter(({ block }) => block.kind === "paragraph");
    const companions = {
      ...hollerithTabulatingPages7To9ParallelReadings,
      ...hollerithTabulatingPage9ParallelReadings,
      ...hollerithTabulatingPages10To14ParallelReadings,
      ...hollerithTabulatingSignatureParallelReading,
    };
    for (const { index } of paragraphs) {
      expect(companions[index]?.join(" ").length).toBeGreaterThan(40);
    }
  });
});
