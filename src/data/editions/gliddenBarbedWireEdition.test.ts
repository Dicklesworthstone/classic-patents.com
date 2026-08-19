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
    for (const reference of figureReferences) {
      for (const preview of reference.figurePreviews ?? []) {
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }
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
