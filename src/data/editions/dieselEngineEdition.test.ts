import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { dieselEnginePatent } from "@/data/patents/diesel-engine";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  dieselEngineArchivalEdition,
  dieselEngineParallelReadings,
  dieselManualClaimText,
} from "./dieselEngineEdition";

describe("US 542,846 manual source edition", () => {
  test("pins the actual ten-page facsimile and source identity", () => {
    expect(dieselEnginePatent.archivalEdition).toBe(dieselEngineArchivalEdition);
    expect(dieselEnginePatent.title).toBe("Method of and Apparatus for Converting Heat into Work");
    expect(dieselEnginePatent.filingDate).toBe("1892-08-26");
    expect(validateCuratedSpecificationEdition(dieselEngineArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${dieselEnginePatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      dieselEngineArchivalEdition.sourcePdfSha256,
    );
  });

  test("keeps all three printed claims bound to their authored nodes", () => {
    expect(dieselEnginePatent.claims.map((item) => item.number)).toEqual([1, 2, 3]);
    expect(dieselEnginePatent.claims.map((item) => item.originalText)).toEqual([
      dieselManualClaimText(1),
      dieselManualClaimText(2),
      dieselManualClaimText(3),
    ]);
    expect(
      dieselEnginePatent.claims.every((item) => item.plainEnglish.split(/\s+/).length > 30),
    ).toBe(true);
  });

  test("uses authored local figure crops and term nodes", () => {
    const editionSource = readFileSync(
      resolve(process.cwd(), "src/data/editions/dieselEngineEdition.ts"),
      "utf8",
    );
    expect(editionSource).not.toContain("SOURCE_FIGURE_CITATIONS");
    expect(editionSource).not.toMatch(/indexOf\s*\(/);
    expect(editionSource).not.toMatch(/replace\s*\(/);
    expect(editionSource).not.toMatch(/\.split\s*\(/);
    const references = dieselEngineArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    for (const reference of references) {
      for (const source of reference.figurePreviews ?? []) {
        expect(existsSync(resolve(process.cwd(), "public", source.src.slice(1)))).toBe(true);
      }
    }
    expect(references.length).toBeGreaterThan(5);
    const terms = dieselEngineArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "term" }> =>
              inline.kind === "term",
          )
        : [],
    );
    expect(terms.map((term) => term.text)).toContain("neutral gas or vapor");
    expect(terms.every((term) => term.definition.length > 80)).toBe(true);
    for (const block of dieselEngineArchivalEdition.blocks) {
      const inlines =
        block.kind === "figure-sheet" ? block.description : "inlines" in block ? block.inlines : [];
      for (const inline of inlines) {
        if (inline.kind === "text") {
          expect(inline.text).not.toMatch(/\bFig(?:s)?\.\s*\d/);
        }
      }
    }
    for (let figure = 1; figure <= 10; figure += 1) {
      expect(
        existsSync(
          resolve(
            process.cwd(),
            "public",
            `patents/figures/us-542846-diesel-engine/fig-${figure}-source-crop-v1.png`,
          ),
        ),
      ).toBe(true);
    }
    expect(dieselEngineParallelReadings).toBeDefined();
  });

  test("publishes a reviewed-transcription ledger with the correct ordered markers", () => {
    const asset = dieselEnginePatent.originalTextAsset;
    if (!asset) throw new Error("Diesel reviewed transcript asset is missing.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 10)).toEqual({ valid: true });
    expect(ledger).toContain(dieselManualClaimText(1));
    expect(ledger).toContain(dieselManualClaimText(2));
    expect(ledger).toContain(dieselManualClaimText(3));
    expect(JSON.stringify(dieselEngineArchivalEdition)).not.toContain("SOURCE PDF PAGE");
    const sourceBlocks = dieselEngineArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof dieselEngineArchivalEdition.blocks)[number],
        { kind: "paragraph" | "claim" }
      > => block.kind === "paragraph" || block.kind === "claim",
    );
    for (const block of sourceBlocks) {
      expect(ledger.replace(/\s+/g, " ")).toContain(
        block.inlines
          .map((inline) => inline.text)
          .join("")
          .replace(/\s+/g, " "),
      );
    }
  });

  test("pairs every source paragraph with a concrete, source-specific companion", () => {
    const paragraphIndexes = dieselEngineArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(dieselEngineParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(paragraphIndexes);
    for (const index of paragraphIndexes) {
      expect(dieselEngineParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(80);
      expect(dieselEngineParallelReadings[index]?.join(" ")).not.toContain("source paragraph");
    }
  });
});
