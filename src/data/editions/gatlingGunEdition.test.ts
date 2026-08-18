import { describe, expect, test } from "bun:test";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  gatlingGunArchivalEdition,
  gatlingGunParallelReadings,
} from "@/data/editions/gatlingGunEdition";
import { gatlingGunPatent } from "@/data/patents/gatling-gun";

describe("gatlingGunArchivalEdition", () => {
  test("pins the reviewed three-sheet facsimile and presents its five claims", () => {
    expect(validateCuratedSpecificationEdition(gatlingGunArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(gatlingGunArchivalEdition.sourcePdfSha256).toBe(
      "1eb10666b48d84d2e2be3e09168c6f4f224e531428f7f7c39fdf70ff60d0683f",
    );
    expect(gatlingGunArchivalEdition.completeFacsimileReviewed).toBe(true);
    expect(
      gatlingGunArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((claim) => claim.number),
    ).toEqual([1, 2, 3, 4, 5]);
  });

  test("keeps exact catalogue claims synchronized to the authored source nodes", () => {
    const sourceClaims = gatlingGunArchivalEdition.blocks.filter((block) => block.kind === "claim");
    expect(
      sourceClaims.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    ).toEqual(gatlingGunPatent.claims.map((claim) => claim.originalText));
  });

  test("uses explicit local figure previews rather than a PDF-page fallback", () => {
    const figureSheet = gatlingGunArchivalEdition.blocks.find(
      (block) => block.kind === "figure-sheet",
    );
    if (figureSheet?.kind !== "figure-sheet") throw new Error("missing figure sheet");
    const references = figureSheet.description.filter((inline) => inline.kind === "reference");
    expect(references.map((reference) => reference.href)).toEqual([
      "#figure-1",
      "#figure-2",
      "#figure-3",
      "#figure-4",
      "#figure-5",
      "#figure-6",
      "#figure-7",
    ]);
    expect(
      references.every((reference) => reference.figurePreviews?.[0]?.src.includes("gatling-gun")),
    ).toBe(true);
    expect(
      references.every((reference) => {
        const preview = reference.figurePreviews?.[0];
        return (preview?.width ?? 0) > 0 && (preview?.height ?? 0) > 0;
      }),
    ).toBe(true);
  });

  test("has a non-lossy local companion for every authored source paragraph and claim", () => {
    const translatedBlocks = gatlingGunArchivalEdition.blocks
      .map((block, index) => ({ block, index }))
      .filter(({ block }) => block.kind === "paragraph" || block.kind === "claim");

    expect(
      Object.keys(gatlingGunParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(translatedBlocks.map(({ index }) => index));

    for (const { block, index } of translatedBlocks) {
      const companion = gatlingGunParallelReadings[index];
      expect(companion.length).toBeGreaterThan(0);
      expect(companion.every((paragraph) => paragraph.trim().length > 40)).toBe(true);
      if (block.kind === "claim") {
        expect(companion.join(" ")).toContain(`Claim ${block.number}`);
      }
    }
  });
});
