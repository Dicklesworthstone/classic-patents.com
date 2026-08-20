import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { teslaCoil593138Patent } from "@/data/patents/tesla-coil-593138";
import {
  teslaCoil593138ArchivalEdition,
  teslaCoil593138ParallelReadings,
} from "./teslaCoil593138Edition";

describe("US 593,138 Electrical Transformer manual source edition", () => {
  test("pins the reviewed four-page facsimile and its four exact claim nodes", () => {
    expect(validateCuratedSpecificationEdition(teslaCoil593138ArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(teslaCoil593138ArchivalEdition.sourcePdfSha256).toBe(
      "393b0a9cee0baa191c5cf8fac0f65738b9d77ce5318e74324b4792aaf17ddf44",
    );
    const pdf = readFileSync(`${process.cwd()}/public${teslaCoil593138Patent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      teslaCoil593138ArchivalEdition.sourcePdfSha256,
    );
    expect(
      teslaCoil593138ArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.number),
    ).toEqual([1, 2, 3, 4]);
  });

  test("binds the canonical record and its exact claim text to the authored edition", () => {
    expect(teslaCoil593138Patent.id).toBe("us-593138-tesla-coil");
    expect(teslaCoil593138Patent.patentNumber).toBe("US 593,138");
    expect(teslaCoil593138Patent.archivalEdition).toBe(teslaCoil593138ArchivalEdition);
    expect(teslaCoil593138Patent.filingDate).toBe("1897-03-20");
    expect(teslaCoil593138Patent.stats).toEqual({ totalClaims: 4, independentClaims: 4 });
    const editionClaims = teslaCoil593138ArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof teslaCoil593138ArchivalEdition.blocks)[number],
        { kind: "claim" }
      > => block.kind === "claim",
    );
    expect(teslaCoil593138Patent.claims.map((claim) => claim.originalText)).toEqual(
      editionClaims.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
    for (const claim of teslaCoil593138Patent.claims) {
      expect(claim.plainEnglish.split(/\s+/).length).toBeGreaterThan(30);
      expect(claim.keyInnovations.length).toBeGreaterThan(0);
    }
  });

  test("makes every figure citation an explicit local source-derived preview", () => {
    const references = teslaCoil593138ArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : block.kind === "figure-sheet"
          ? block.description.filter(
              (
                inline,
              ): inline is Extract<(typeof block.description)[number], { kind: "reference" }> =>
                inline.kind === "reference" && inline.referenceType === "figure",
            )
          : [],
    );
    expect(references.length).toBeGreaterThanOrEqual(7);
    const previewSources = new Set<string>();
    for (const reference of references) {
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toMatch(
          /^\/patents\/figures\/us-593138-tesla-coil\/fig-[1-2]-source-crop-v2\.png$|^\/patents\/figures\/us-593138-tesla-coil\/fig-3-source-crop-v3\.png$/,
        );
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
        previewSources.add(preview.src);
      }
    }
    expect([...previewSources].sort()).toEqual([
      "/patents/figures/us-593138-tesla-coil/fig-1-source-crop-v2.png",
      "/patents/figures/us-593138-tesla-coil/fig-2-source-crop-v2.png",
      "/patents/figures/us-593138-tesla-coil/fig-3-source-crop-v3.png",
    ]);
  });

  test("covers every source paragraph with a non-lossy local companion and preserves the review ledger", () => {
    for (const [index, block] of teslaCoil593138ArchivalEdition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      const reading = teslaCoil593138ParallelReadings[index];
      expect(reading?.join(" ").trim().length).toBeGreaterThan(40);
    }
    const serialized = JSON.stringify(teslaCoil593138ArchivalEdition);
    expect(serialized).not.toContain("source-pdf-text-layer");
    expect(serialized).not.toContain("raw HTML");
    const provenance = readFileSync(
      resolve(process.cwd(), "docs/provenance/us-593138-tesla-coil.md"),
      "utf8",
    );
    expect(provenance).toContain("Two complete visual passes");
    expect(provenance).toContain("Claims 1–4");
    expect(provenance).toContain("fig-3-source-crop-v3.png");
  });
});
