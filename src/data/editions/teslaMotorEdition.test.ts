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
    const singularPreviewSource = {
      "Fig. 1": "/patents/figures/us-381968-tesla-motor/fig-1-source-crop-v2.png",
      "Fig. 2": "/patents/figures/us-381968-tesla-motor/fig-2-source-crop-v2.png",
      "Fig. 3": "/patents/figures/us-381968-tesla-motor/fig-3-source-crop-v3.png",
      "Fig. 4": "/patents/figures/us-381968-tesla-motor/fig-4-source-crop-v2.png",
      "Fig. 5": "/patents/figures/us-381968-tesla-motor/fig-5-source-crop-v2.png",
      "Fig. 6": "/patents/figures/us-381968-tesla-motor/fig-6-source-crop-v2.png",
      "Fig. 7": "/patents/figures/us-381968-tesla-motor/fig-7-source-crop-v2.png",
      "Fig. 8": "/patents/figures/us-381968-tesla-motor/fig-8-source-crop-v2.png",
      "Fig. 1a": "/patents/figures/us-381968-tesla-motor/fig-1a-source-crop-v2.png",
      "Fig. 2a": "/patents/figures/us-381968-tesla-motor/fig-2a-source-crop-v2.png",
      "Fig. 3a": "/patents/figures/us-381968-tesla-motor/fig-3a-source-crop-v2.png",
      "Fig. 4a": "/patents/figures/us-381968-tesla-motor/fig-4a-source-crop-v3.png",
      "Fig. 5a": "/patents/figures/us-381968-tesla-motor/fig-5a-source-crop-v3.png",
      "Fig. 6a": "/patents/figures/us-381968-tesla-motor/fig-6a-source-crop-v3.png",
      "Fig. 7a": "/patents/figures/us-381968-tesla-motor/fig-7a-source-crop-v2.png",
      "Fig. 8a": "/patents/figures/us-381968-tesla-motor/fig-8a-source-crop-v2.png",
      "Fig. 9": "/patents/figures/us-381968-tesla-motor/fig-9-source-crop-v1.png",
      "Fig. 10": "/patents/figures/us-381968-tesla-motor/fig-10-source-crop-v2.png",
      "Fig. 11": "/patents/figures/us-381968-tesla-motor/fig-11-source-crop-v2.png",
      "Fig. 12": "/patents/figures/us-381968-tesla-motor/fig-12-source-crop-v2.png",
      "Fig. 13": "/patents/figures/us-381968-tesla-motor/fig-13-source-crop-v2.png",
      "Fig. 14": "/patents/figures/us-381968-tesla-motor/fig-14-source-crop-v2.png",
      "Fig. 15": "/patents/figures/us-381968-tesla-motor/fig-15-source-crop-v2.png",
      "Fig. 16": "/patents/figures/us-381968-tesla-motor/fig-16-source-crop-v2.png",
      "Fig. 17": "/patents/figures/us-381968-tesla-motor/fig-17-source-crop-v1.png",
      "Fig. 18": "/patents/figures/us-381968-tesla-motor/fig-18-source-crop-v1.png",
      "Fig. 19": "/patents/figures/us-381968-tesla-motor/fig-19-source-crop-v1.png",
    } as const;
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
      const figureLabel = reference.label.match(/crop for (.+) in US 381,968$/)?.[1];
      if (figureLabel && Object.hasOwn(singularPreviewSource, figureLabel)) {
        expect(reference.figurePreviews).toHaveLength(1);
        expect(reference.figurePreviews?.[0]?.src).toBe(
          singularPreviewSource[figureLabel as keyof typeof singularPreviewSource],
        );
      }
    }
    expect([...previewSources].sort()).toEqual([
      "/patents/figures/us-381968-tesla-motor/fig-1-source-crop-v2.png",
      "/patents/figures/us-381968-tesla-motor/fig-10-source-crop-v2.png",
      "/patents/figures/us-381968-tesla-motor/fig-11-source-crop-v2.png",
      "/patents/figures/us-381968-tesla-motor/fig-12-source-crop-v2.png",
      "/patents/figures/us-381968-tesla-motor/fig-13-source-crop-v2.png",
      "/patents/figures/us-381968-tesla-motor/fig-14-source-crop-v2.png",
      "/patents/figures/us-381968-tesla-motor/fig-15-source-crop-v2.png",
      "/patents/figures/us-381968-tesla-motor/fig-16-source-crop-v2.png",
      "/patents/figures/us-381968-tesla-motor/fig-17-source-crop-v1.png",
      "/patents/figures/us-381968-tesla-motor/fig-18-source-crop-v1.png",
      "/patents/figures/us-381968-tesla-motor/fig-19-source-crop-v1.png",
      "/patents/figures/us-381968-tesla-motor/fig-1a-source-crop-v2.png",
      "/patents/figures/us-381968-tesla-motor/fig-2-source-crop-v2.png",
      "/patents/figures/us-381968-tesla-motor/fig-2a-source-crop-v2.png",
      "/patents/figures/us-381968-tesla-motor/fig-3-source-crop-v3.png",
      "/patents/figures/us-381968-tesla-motor/fig-3a-source-crop-v2.png",
      "/patents/figures/us-381968-tesla-motor/fig-4-source-crop-v2.png",
      "/patents/figures/us-381968-tesla-motor/fig-4a-source-crop-v3.png",
      "/patents/figures/us-381968-tesla-motor/fig-5-source-crop-v2.png",
      "/patents/figures/us-381968-tesla-motor/fig-5a-source-crop-v3.png",
      "/patents/figures/us-381968-tesla-motor/fig-6-source-crop-v2.png",
      "/patents/figures/us-381968-tesla-motor/fig-6a-source-crop-v3.png",
      "/patents/figures/us-381968-tesla-motor/fig-7-source-crop-v2.png",
      "/patents/figures/us-381968-tesla-motor/fig-7a-source-crop-v2.png",
      "/patents/figures/us-381968-tesla-motor/fig-8-source-crop-v2.png",
      "/patents/figures/us-381968-tesla-motor/fig-8a-source-crop-v2.png",
      "/patents/figures/us-381968-tesla-motor/fig-9-source-crop-v1.png",
    ]);
  });

  test("makes historical technical terms explicit authored annotations", () => {
    const terms = teslaMotorArchivalEdition.blocks.flatMap((block) => {
      const inlines =
        "inlines" in block ? block.inlines : block.kind === "figure-sheet" ? block.description : [];
      return inlines.filter(
        (inline): inline is Extract<(typeof inlines)[number], { kind: "term" }> =>
          inline.kind === "term",
      );
    });
    expect(terms.map((term) => term.text)).toEqual([
      "collector rings",
      "independent circuits",
      "lines of force",
      "armature",
      "commutator",
      "annulus",
      "shunts",
      "multiple arc",
      "magnetizing-coils",
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
