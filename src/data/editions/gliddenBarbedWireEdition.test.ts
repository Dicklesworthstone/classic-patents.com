import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { gliddenBarbedWirePatent } from "@/data/patents/glidden-barbed-wire";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";
import {
  gliddenBarbedWireArchivalEdition,
  gliddenBarbedWireParallelReadings,
} from "./gliddenBarbedWireEdition";

const normalized = (value: string) => value.replace(/\s+/g, " ").trim();

describe("US 157,124 manual source edition", () => {
  test("pins the complete two-page facsimile and its single printed claim", () => {
    expect(gliddenBarbedWirePatent.archivalEdition).toBe(gliddenBarbedWireArchivalEdition);
    expect(gliddenBarbedWirePatent.originalTextAsset).toMatchObject({
      url: "/patents/transcripts/us-157124-glidden-barbed-wire-reviewed.txt",
      pageCount: 2,
      kind: "reviewed-transcription",
      sourcePdfSha256: "19c3874222e125ad1be8df9b1e4e59df4d7ff6452876588666a3c9ddf2cb0cc1",
    });
    expect(validateCuratedSpecificationEdition(gliddenBarbedWireArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(
      `${process.cwd()}/public/patents/pdfs/us-157124-glidden-barbed-wire.pdf`,
    );
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      gliddenBarbedWireArchivalEdition.sourcePdfSha256,
    );
    expect(gliddenBarbedWirePatent.claims.map((claim) => claim.number)).toEqual([1]);
    expect(gliddenBarbedWirePatent.claims[0]?.isIndependent).toBe(true);
  });

  test("keeps every published source paragraph and claim in the reviewed ledger", () => {
    const asset = gliddenBarbedWirePatent.originalTextAsset;
    if (!asset) throw new Error("US 157,124 is missing its reviewed source ledger.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 2)).toEqual({ valid: true });
    expect(
      validateReviewedTranscriptionPageAnchors(ledger, asset.pageCount, asset.pageAnchors),
    ).toEqual({ valid: true });
    const normalizedLedger = normalized(
      ledger.replace(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm, ""),
    );

    for (const block of gliddenBarbedWireArchivalEdition.blocks) {
      if (block.kind !== "masthead" && block.kind !== "paragraph" && block.kind !== "claim")
        continue;
      const source =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.inlines.map((inline) => inline.text).join("");
      expect(normalizedLedger).toContain(normalized(source));
    }

    const authoredClaims = gliddenBarbedWireArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof gliddenBarbedWireArchivalEdition.blocks)[number],
        { kind: "claim" }
      > => block.kind === "claim",
    );
    expect(gliddenBarbedWirePatent.claims.map((claim) => claim.originalText)).toEqual(
      authoredClaims.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
  });

  test("pairs each source paragraph with a non-lossy reading and every figure with a local crop", () => {
    const paragraphIndexes = gliddenBarbedWireArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(gliddenBarbedWireParallelReadings)
        .map(Number)
        .sort((left, right) => left - right),
    ).toEqual(paragraphIndexes);

    const figureReferences = gliddenBarbedWireArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });
    for (const number of [1, 2, 3]) {
      expect(
        figureReferences.some((reference) =>
          reference.figurePreviews?.some((preview) => preview.alt.includes(`Fig. ${number}`)),
        ),
      ).toBe(true);
    }
    expect(
      figureReferences
        .flatMap((reference) => reference.figurePreviews ?? [])
        .find((preview) => preview.alt.includes("Fig. 2")),
    ).toMatchObject({
      src: "/patents/figures/us-157124-glidden-barbed-wire/fig-2-source-crop-v2.png",
      width: 350,
      height: 190,
    });
    for (const reference of figureReferences) {
      for (const preview of reference.figurePreviews ?? []) {
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }
  });

  test("records the cloud-reviewed upright crop contract while preserving the held legacy previews", () => {
    const provenance = readFileSync(
      resolve(process.cwd(), "docs/provenance/us-157124-glidden-barbed-wire.md"),
      "utf8",
    );
    expect(provenance).toContain(
      "https://patentimages.storage.googleapis.com/2c/55/5c/a19dadfbcdf4e7/US157124-drawings-page-1.png",
    );
    expect(provenance).toContain("2320 x 3408");
    expect(provenance).toContain("all three currently served local previews are held as");
    expect(provenance).toContain("fig-1-source-crop-v1.png");
    expect(provenance).toContain("(430, 900, 720, 1900)");
    expect(provenance).toContain("fig-2-source-crop-v1.png");
    expect(provenance).toContain("(1500, 1780, 520, 520)");
    expect(provenance).toContain("fig-3-source-crop-v1.png");
    expect(provenance).toContain("(1360, 700, 700, 900)");
    expect(provenance).toContain("must preserve the cloud image's portrait orientation");

    const previewSources = gliddenBarbedWireArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.flatMap((inline) =>
        inline.kind === "reference"
          ? (inline.figurePreviews ?? []).map((preview) => preview.src)
          : [],
      );
    });
    expect(previewSources).toContain(
      "/patents/figures/us-157124-glidden-barbed-wire/fig-1-source-crop.png",
    );
    expect(previewSources).toContain(
      "/patents/figures/us-157124-glidden-barbed-wire/fig-2-source-crop-v2.png",
    );
    expect(previewSources).toContain(
      "/patents/figures/us-157124-glidden-barbed-wire/fig-3-source-crop.png",
    );
    expect(previewSources.every((src) => !src.endsWith("-v1.png"))).toBe(true);
  });

  test("keeps the source drawing-sheet header and printed z strand instead of editorial replacements", () => {
    const ledger = readFileSync(
      resolve(
        process.cwd(),
        "public/patents/transcripts/us-157124-glidden-barbed-wire-reviewed.txt",
      ),
      "utf8",
    );
    const sourceFace = JSON.stringify(gliddenBarbedWireArchivalEdition.blocks);
    const visible = JSON.stringify({
      ledger,
      sourceFace,
      claims: gliddenBarbedWirePatent.claims,
      explanation: gliddenBarbedWirePatent.plainEnglishExplanation,
    });

    expect(ledger).toContain("J. F. GLIDDEN.");
    expect(ledger).toContain("FIG. 1.");
    expect(ledger).toContain("FIG. 2.");
    expect(ledger).toContain("FIG. 3.");
    expect(ledger).not.toContain("[DRAWING SHEET]");
    expect(visible).toContain("other wire strand z");
    expect(visible).toContain("two strands, a and z");
    expect(visible).not.toContain("a′");
    expect(visible).not.toContain("a-prime");
  });

  test("keeps the single printed claim sourced from the edition block", () => {
    const claimBlock = gliddenBarbedWireArchivalEdition.blocks.find(
      (block) => block.kind === "claim" && block.number === 1,
    );
    if (!claimBlock || claimBlock.kind !== "claim") {
      throw new Error("Glidden edition is missing its printed claim block.");
    }
    expect(gliddenBarbedWirePatent.claims).toHaveLength(1);
    expect(gliddenBarbedWirePatent.claims[0]?.originalText).toBe(
      claimBlock.inlines.map((inline) => inline.text).join(""),
    );
  });

  test("keeps historical term annotations substantive and occurrence-local", () => {
    const terms = gliddenBarbedWireArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "term" }> =>
          inline.kind === "term",
      );
    });
    expect(terms.map((entry) => entry.text)).toEqual([
      "spur-wire",
      "twisting-key or head-piece",
      "twisting-key",
      "spur-wires",
    ]);
    for (const entry of terms) {
      expect(entry.definition.length).toBeGreaterThan(80);
    }
  });

  test("keeps the canonical drawing inventory aligned with the cloud source label plan", () => {
    const labelsFor = (figureNumber: string) =>
      gliddenBarbedWirePatent.drawings
        .find((drawing) => drawing.figureNumber === figureNumber)
        ?.callouts.map((callout) => callout.label)
        .sort();
    expect(labelsFor("Fig. 1")).toEqual(["A", "B", "C", "D", "b", "c"].sort());
    expect(labelsFor("Fig. 2")).toEqual(["D", "E", "a", "s", "z"].sort());
    expect(labelsFor("Fig. 3")).toEqual(["D", "E", "a", "s", "z"].sort());
    for (const drawing of gliddenBarbedWirePatent.drawings) {
      for (const callout of drawing.callouts) {
        expect(callout.x).toBeGreaterThanOrEqual(0);
        expect(callout.x).toBeLessThanOrEqual(100);
        expect(callout.y).toBeGreaterThanOrEqual(0);
        expect(callout.y).toBeLessThanOrEqual(100);
      }
    }
  });

  test("removes invented claims, materials, and dimensions from the public record", () => {
    const visibleData = JSON.stringify({
      summary: gliddenBarbedWirePatent.summary,
      originalText: gliddenBarbedWirePatent.originalText,
      plainEnglish: gliddenBarbedWirePatent.plainEnglishExplanation,
      claims: gliddenBarbedWirePatent.claims,
      drawings: gliddenBarbedWirePatent.drawings,
      sourceFace: gliddenBarbedWireArchivalEdition.blocks,
    });
    expect(visibleData).not.toContain("The twisted double-strand wire fence");
    expect(visibleData).not.toContain("12.5-gauge");
    expect(visibleData).not.toContain("50\\text");
    expect(visibleData).not.toContain("$\\");
  });
});
