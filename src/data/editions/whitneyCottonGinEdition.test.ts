import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "../archivalEditionValidation";
import { whitneyCottonGinPatent } from "../patents/whitney-cotton-gin";
import { whitneyCottonGinArchivalEdition } from "./whitneyCottonGinEdition";
import { whitneyCottonGinParallelReadings } from "./whitneyCottonGinParallelReading";

describe("US X72 Whitney cotton-gin manual edition", () => {
  test("is a complete reviewed no-formal-claims edition", () => {
    expect(validateCuratedSpecificationEdition(whitneyCottonGinArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(whitneyCottonGinArchivalEdition.claimStatus?.kind).toBe("no-formal-claims-in-facsimile");
    expect(whitneyCottonGinPatent.claims).toEqual([]);
    expect(whitneyCottonGinPatent.stats).toMatchObject({
      totalClaims: 0,
      independentClaims: 0,
    });
  });

  test("has a direct non-lossy companion for every source paragraph", () => {
    for (const [index, block] of whitneyCottonGinArchivalEdition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      const companion = whitneyCottonGinParallelReadings[index];
      expect(companion, `missing companion reading for block ${index}`).toBeDefined();
      expect(companion?.join(" ").trim().length).toBeGreaterThan(20);
    }
  });

  test("rejects removal of the evidence-backed no-claims state", () => {
    const withoutAttestation = { ...whitneyCottonGinArchivalEdition, claimStatus: undefined };
    expect(validateCuratedSpecificationEdition(withoutAttestation).valid).toBe(false);
  });

  test("does not leave source figure citations stranded in plain text nodes", () => {
    const bareFigureCitation = /\bFig(?:s)?\.\s*\d+/i;

    for (const block of whitneyCottonGinArchivalEdition.blocks) {
      if (!("inlines" in block)) continue;
      for (const inline of block.inlines) {
        if (inline.kind === "text") {
          expect(inline.text).not.toMatch(bareFigureCitation);
        }
      }
    }
  });

  test("binds the source's Fig. 10 citation to the actual curved breastwork crop", () => {
    const figureTen = whitneyCottonGinArchivalEdition.blocks.flatMap((block) => {
      if (block.kind !== "paragraph" && block.kind !== "claim" && block.kind !== "figure-sheet") {
        return [];
      }
      const inlines = block.kind === "figure-sheet" ? block.description : block.inlines;
      return inlines.filter(
        (inline): inline is Extract<typeof inline, { kind: "reference" }> =>
          inline.kind === "reference" &&
          inline.referenceType === "figure" &&
          inline.text === "Fig. 10",
      );
    });
    expect(figureTen).toHaveLength(1);
    const first = figureTen[0];
    const preview = first && first.kind === "reference" ? first.figurePreviews?.[0] : undefined;
    expect(preview).toMatchObject({
      src: "/patents/figures/us-x72-whitney-cotton-gin-fig-10-preview-v2.png",
      width: 520,
      height: 900,
    });
    const path = resolve(process.cwd(), "public", preview?.src.slice(1) ?? "");
    expect(existsSync(path)).toBe(true);
    const png = readFileSync(path);
    expect(png.readUInt32BE(16)).toBe(520);
    expect(png.readUInt32BE(20)).toBe(900);
  });
});
