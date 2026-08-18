import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { teslaMotorPatent } from "@/data/patents/tesla-motor";
import { teslaMotorArchivalEdition, teslaMotorParallelReadings } from "./teslaMotorEdition";

describe("US 381,968 manual source edition", () => {
  test("pins the nine-page Tesla facsimile, filing date, and all four printed claims", () => {
    expect(teslaMotorPatent.archivalEdition).toBe(teslaMotorArchivalEdition);
    expect(teslaMotorPatent.filingDate).toBe("1887-10-12");
    expect(teslaMotorArchivalEdition.sourcePdfSha256).toBe(
      "cffd7ff061b05feef92c2d6ef4d767c7b7e8c6b4e0d10cc9be3fbd51841dce12",
    );
    expect(validateCuratedSpecificationEdition(teslaMotorArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${teslaMotorPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      teslaMotorArchivalEdition.sourcePdfSha256,
    );
    expect(teslaMotorPatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3, 4]);
    expect(teslaMotorPatent.claims.every((claim) => claim.isIndependent)).toBe(true);
    expect(teslaMotorPatent.stats).toMatchObject({ totalClaims: 4, independentClaims: 4 });
  });

  test("keeps the typed legal claims exactly synchronized with the public decoders", () => {
    const authoredClaims = teslaMotorArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<(typeof teslaMotorArchivalEdition.blocks)[number], { kind: "claim" }> =>
        block.kind === "claim",
    );
    expect(teslaMotorPatent.claims.map((claim) => claim.originalText)).toEqual(
      authoredClaims.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
    for (const claim of teslaMotorPatent.claims) {
      expect(claim.plainEnglish.split(/\s+/).length).toBeGreaterThan(30);
      expect(claim.keyInnovations).not.toHaveLength(0);
    }
  });

  test("uses an authored local source crop for every printed figure citation", () => {
    const references = teslaMotorArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    expect(references).not.toHaveLength(0);
    const previewSources = new Set<string>();
    for (const reference of references) {
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toStartWith("/patents/figures/us-381968-tesla-motor/");
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
        previewSources.add(preview.src);
      }
    }
    expect([...previewSources].sort()).toEqual([
      "/patents/figures/us-381968-tesla-motor/fig-17-source-crop-v1.png",
      "/patents/figures/us-381968-tesla-motor/fig-18-source-crop-v1.png",
      "/patents/figures/us-381968-tesla-motor/fig-19-source-crop-v1.png",
      "/patents/figures/us-381968-tesla-motor/fig-9-source-crop-v1.png",
      "/patents/figures/us-381968-tesla-motor/figs-1-to-8-source-crop-v1.png",
      "/patents/figures/us-381968-tesla-motor/figs-10-to-12-source-crop-v1.png",
      "/patents/figures/us-381968-tesla-motor/figs-13-to-14-source-crop-v1.png",
      "/patents/figures/us-381968-tesla-motor/figs-15-to-16-source-crop-v1.png",
      "/patents/figures/us-381968-tesla-motor/figs-1a-to-8a-source-crop-v1.png",
    ]);
  });

  test("makes historical technical terms explicit authored annotations", () => {
    const terms = teslaMotorArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "term" }> =>
              inline.kind === "term",
          )
        : [],
    );
    expect(terms.map((term) => term.text)).toEqual([
      "independent circuits",
      "lines of force",
      "commutator",
      "annulus",
    ]);
    for (const term of terms) {
      expect(term.definition.trim().length).toBeGreaterThan(80);
    }
  });

  test("pairs every prose paragraph with a non-lossy explanation", () => {
    const explainableBlocks = teslaMotorArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(teslaMotorParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(explainableBlocks);
    for (const index of explainableBlocks) {
      expect(teslaMotorParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(40);
    }
  });

  test("keeps every published source paragraph and claim in the reviewed ledger", () => {
    const ledger = readFileSync(
      `${process.cwd()}/public/patents/transcripts/us-381968-tesla-motor-reviewed.txt`,
      "utf8",
    );
    const normalize = (value: string) =>
      value
        .replaceAll("“", '"')
        .replaceAll("”", '"')
        .replace(/[–—]/g, "-")
        .replace(/\s+/g, " ")
        .trim();
    const sourceBlocks = teslaMotorArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof teslaMotorArchivalEdition.blocks)[number],
        { kind: "paragraph" | "claim" }
      > => block.kind === "paragraph" || block.kind === "claim",
    );

    expect(sourceBlocks).not.toHaveLength(0);
    for (const block of sourceBlocks) {
      expect(normalize(ledger)).toContain(
        normalize(block.inlines.map((inline) => inline.text).join("")),
      );
    }
  });

  test("publishes a reviewed ledger and never treats the previous PDF text layer as evidence", () => {
    const asset = teslaMotorPatent.originalTextAsset;
    expect(asset).toMatchObject({
      url: "/patents/transcripts/us-381968-tesla-motor-reviewed.txt",
      pageCount: 9,
      kind: "reviewed-transcription",
      sourcePdfSha256: teslaMotorArchivalEdition.sourcePdfSha256,
    });
    if (!asset) throw new Error("Tesla reviewed transcript asset is missing.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 9)).toEqual({ valid: true });
    expect(JSON.stringify(teslaMotorArchivalEdition)).not.toContain("source-pdf-text-layer");
    expect(JSON.stringify(teslaMotorArchivalEdition)).not.toContain("Definition available");
    expect(teslaMotorPatent.originalText).not.toContain("squirrel-cage");
    expect(teslaMotorPatent.originalText).not.toContain("What I claim");
    expect(JSON.stringify(teslaMotorPatent.historicalContext.patentWars)).toBe("[]");
  });
});
