import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { wozniakApplePatent } from "@/data/patents/wozniak-apple";
import { wozniakAppleArchivalEdition, wozniakAppleParallelReadings } from "./wozniakAppleEdition";

describe("US 4,136,359 manual source edition", () => {
  test("pins the complete seven-page facsimile and its eight printed claims", () => {
    expect(validateCuratedSpecificationEdition(wozniakAppleArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(
      resolve(process.cwd(), "public", wozniakApplePatent.originalPdfUrl.slice(1)),
    );
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      "7467256de38125790a5f1b5e4904060e8ec6aa92f33288ccc8f1ea0acb7c3fc0",
    );
    expect(wozniakApplePatent.originalTextAsset).toMatchObject({
      kind: "reviewed-transcription",
      pageCount: 7,
      sourcePdfSha256: "7467256de38125790a5f1b5e4904060e8ec6aa92f33288ccc8f1ea0acb7c3fc0",
    });
    expect(
      wozniakAppleArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.number),
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test("derives every canonical claim from the manually reviewed source node", () => {
    expect(wozniakApplePatent.archivalEdition).toBe(wozniakAppleArchivalEdition);
    expect(wozniakApplePatent.stats).toEqual({ totalClaims: 8, independentClaims: 2 });
    const sourceClaims = wozniakAppleArchivalEdition.blocks
      .filter(
        (
          block,
        ): block is Extract<
          (typeof wozniakAppleArchivalEdition.blocks)[number],
          { kind: "claim" }
        > => block.kind === "claim",
      )
      .map((block) => block.inlines.map((inline) => inline.text).join(""));
    expect(wozniakApplePatent.claims.map((claim) => claim.originalText)).toEqual(sourceClaims);
    expect(
      wozniakApplePatent.claims.filter((claim) => claim.isIndependent).map((claim) => claim.number),
    ).toEqual([1, 5]);
    expect(
      wozniakApplePatent.claims.map((claim) => claim.plainEnglish.split(/\s+/).length),
    ).toEqual(expect.arrayContaining([expect.any(Number)]));
    for (const claim of wozniakApplePatent.claims) {
      expect(claim.plainEnglish.split(/\s+/).length).toBeGreaterThanOrEqual(30);
      expect(claim.keyInnovations.length).toBeGreaterThan(0);
    }
  });

  test("renders every authored figure citation with its local source crop", () => {
    const references = wozniakAppleArchivalEdition.blocks.flatMap((block) =>
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
    expect(references.length).toBeGreaterThanOrEqual(20);
    const sources = new Set<string>();
    for (const reference of references) {
      expect(reference.figurePreviews?.length).toBe(1);
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toMatch(
          /^\/patents\/figures\/us-4136359-wozniak-apple\/fig-[1-4]-source-crop-v[12]\.png$/,
        );
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
        sources.add(preview.src);
      }
    }
    expect([...sources].sort()).toEqual([
      "/patents/figures/us-4136359-wozniak-apple/fig-1-source-crop-v1.png",
      "/patents/figures/us-4136359-wozniak-apple/fig-2-source-crop-v1.png",
      "/patents/figures/us-4136359-wozniak-apple/fig-3-source-crop-v2.png",
      "/patents/figures/us-4136359-wozniak-apple/fig-4-source-crop-v1.png",
    ]);
  });

  test("keeps the source reading, non-lossy companions, and audited ledger together", () => {
    const sourceParagraphIndexes = wozniakAppleArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(wozniakAppleParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(sourceParagraphIndexes);
    for (const [index, block] of wozniakAppleArchivalEdition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      const sourceWords = block.inlines
        .map((inline) => inline.text)
        .join(" ")
        .trim()
        .split(/\s+/).length;
      const companionWords =
        wozniakAppleParallelReadings[index]?.join(" ").trim().split(/\s+/).length ?? 0;
      expect(companionWords).toBeGreaterThan(20);
      if (sourceWords >= 100) expect(companionWords / sourceWords).toBeGreaterThanOrEqual(0.3);
    }
    const ledger = readFileSync(
      resolve(process.cwd(), "public/patents/transcripts/us-4136359-wozniak-apple-reviewed.txt"),
      "utf8",
    );
    for (let page = 1; page <= 7; page += 1) {
      expect(ledger).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${page} OF 7 ---`);
    }
    expect(ledger).toContain("The apparatus defined by claim 7");
    expect(ledger).toContain("Color data for the presently preferred embodiment");
  });

  test("accepts the complete review with all 30 figure occurrences and locators", () => {
    const { evaluateArchivalPublicationState } = require("./publicationApproval");
    const decision = evaluateArchivalPublicationState(wozniakApplePatent);
    expect(decision.isPublished).toBe(true);
    expect(decision.state.kind).toBe("accepted");
    expect(decision.reasonCode).toBe("ACCEPTED");
    expect(decision.figureManifest.acceptedFigureCount).toBe(30);
  });
});
