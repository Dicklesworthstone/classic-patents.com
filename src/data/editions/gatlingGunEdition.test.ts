import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  gatlingGunArchivalEdition,
  gatlingGunParallelReadings,
} from "@/data/editions/gatlingGunEdition";
import { gatlingGunPatent } from "@/data/patents/gatling-gun";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";

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

  test("uses the complete primary drawing sheet for every figure citation", () => {
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
    expect(references[0]?.figurePreviews).toContainEqual(
      expect.objectContaining({
        src: "/patents/figures/us-36836-gatling-gun/source-sheet-1-v1.png",
        width: 2320,
        height: 3408,
      }),
    );
    expect(references[5]?.figurePreviews).toContainEqual(
      expect.objectContaining({
        src: "/patents/figures/us-36836-gatling-gun/source-sheet-1-v1.png",
        width: 2320,
        height: 3408,
      }),
    );
    expect(references[6]?.figurePreviews).toContainEqual(
      expect.objectContaining({
        src: "/patents/figures/us-36836-gatling-gun/source-sheet-1-v1.png",
        width: 2320,
        height: 3408,
      }),
    );
  });

  test("uses manually declared preview records without scan-sheet framing", () => {
    const source = readFileSync(`${process.cwd()}/src/data/editions/gatlingGunEdition.ts`, "utf8");
    expect(source).not.toContain("Object.fromEntries(");
    expect(source).not.toContain("Array.from({ length: 7 }");
    expect(JSON.stringify(gatlingGunArchivalEdition)).not.toContain("first sheet of the pinned");
  });

  test("does not leave a source figure citation stranded in a plain text node", () => {
    const bareFigureCitation = /\bFig(?:s)?\.\s*\d+/i;

    for (const block of gatlingGunArchivalEdition.blocks) {
      if (!("inlines" in block)) continue;
      for (const inline of block.inlines) {
        if (inline.kind === "text") {
          expect(inline.text).not.toMatch(bareFigureCitation);
        }
      }
    }
  });

  test("has a non-lossy local companion for every and only authored source paragraph", () => {
    const translatedBlocks = gatlingGunArchivalEdition.blocks
      .map((block, index) => ({ block, index }))
      .filter(({ block }) => block.kind === "paragraph");

    expect(
      Object.keys(gatlingGunParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(translatedBlocks.map(({ index }) => index));

    for (const { index } of translatedBlocks) {
      const companion = gatlingGunParallelReadings[index];
      expect(companion.length).toBeGreaterThan(0);
      expect(companion.every((paragraph) => paragraph.trim().length > 40)).toBe(true);
    }
  });

  test("pins every authored source block to a reviewed three-sheet ledger", () => {
    const asset = gatlingGunPatent.originalTextAsset;
    expect(asset).toMatchObject({
      url: "/patents/transcripts/us-36836-gatling-gun-reviewed.txt",
      pageCount: 3,
      kind: "reviewed-transcription",
      reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
      reviewedAt: "2026-08-18",
      sourcePdfSha256: "1eb10666b48d84d2e2be3e09168c6f4f224e531428f7f7c39fdf70ff60d0683f",
    });
    if (!asset?.sourcePdfSha256) {
      throw new Error("Gatling reviewed transcript asset or source digest is missing.");
    }

    const transcript = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(transcript, asset.pageCount)).toEqual({ valid: true });
    const sourcePdf = readFileSync(`${process.cwd()}/public${gatlingGunPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(sourcePdf).digest("hex")).toBe(asset.sourcePdfSha256);

    const normalizedTranscript = transcript
      .replace(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm, "")
      .replace(/\s+/g, " ")
      .trim();
    const textualBlocks = gatlingGunArchivalEdition.blocks.filter(
      (block) => block.kind === "masthead" || block.kind === "paragraph" || block.kind === "claim",
    );
    for (const block of textualBlocks) {
      const sourceText =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.inlines.map((inline) => inline.text).join("");
      expect(normalizedTranscript).toContain(sourceText.replace(/\s+/g, " ").trim());
    }
  });
});
