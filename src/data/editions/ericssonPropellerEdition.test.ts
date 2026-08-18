import { describe, expect, test } from "bun:test";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { ericssonPropellerArchivalEdition } from "@/data/editions/ericssonPropellerEdition";

describe("ericssonPropellerArchivalEdition", () => {
  test("is an explicit, continuous edition of the pinned US 588 facsimile", () => {
    expect(validateCuratedSpecificationEdition(ericssonPropellerArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(ericssonPropellerArchivalEdition.sourcePdfSha256).toBe(
      "40582250d44f6558cf9a438801e312a469ccb83b6755ebc813943fba54c3ea9a",
    );
    expect(
      ericssonPropellerArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.number),
    ).toEqual([1, 2, 3]);
  });

  test("contains no scan-page ledger or raw OCR payload", () => {
    const publicText = JSON.stringify(ericssonPropellerArchivalEdition.blocks);
    expect(publicText).not.toContain("SOURCE PDF PAGE");
    expect(publicText).not.toContain("---");
    expect(publicText).toContain("JAMES M. CURLEY");
    expect(publicText).toContain("JOSEPH MARQUETTE");
  });
});
