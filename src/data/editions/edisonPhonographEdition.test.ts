import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { edisonPhonographPatent } from "@/data/patents/edison-phonograph";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  edisonPhonographArchivalEdition,
  edisonPhonographParallelReadings,
} from "./edisonPhonographEdition";

describe("edisonPhonographArchivalEdition", () => {
  test("pins the complete three-page facsimile and its four printed claims", () => {
    expect(validateCuratedSpecificationEdition(edisonPhonographArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(edisonPhonographArchivalEdition.sourcePdfSha256).toBe(
      "6ed4354f12dc944b49ac2a2a3dd8d0aaa3f263d0c5f2017b2237a37ffde00ccd",
    );
    expect(
      edisonPhonographArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((claim) => claim.number),
    ).toEqual([1, 2, 3, 4]);
  });

  test("makes every cited source figure available as a local crop, including Figs. 3 and 4", () => {
    const figureReferences = edisonPhonographArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });

    for (const figure of ["Fig. 1", "Fig. 2", "Fig. 3", "Fig. 4"]) {
      expect(
        figureReferences.some((reference) =>
          reference.figurePreviews?.some((preview) => preview.alt.includes(figure)),
        ),
      ).toBe(true);
    }
    for (const reference of figureReferences) {
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toStartWith("/patents/figures/us-200521-edison-phonograph-fig-");
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }
    const fig3Reference = figureReferences.find((reference) => reference.text === "Fig. 3");
    expect(fig3Reference?.figurePreviews?.[0]?.src).toBe(
      "/patents/figures/us-200521-edison-phonograph-fig-3-complete-source-crop-v2.png",
    );
  });

  test("preserves drawing-sheet formal matter, the claim preamble, and source-only terminology", () => {
    const asset = edisonPhonographPatent.originalTextAsset;
    if (!asset) throw new Error("US 200,521 is missing its reviewed ledger.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    const editionText = edisonPhonographArchivalEdition.blocks
      .flatMap((block) => {
        if (block.kind === "masthead") return block.lines;
        if ("inlines" in block) return [block.inlines.map((inline) => inline.text).join("")];
        if (block.kind === "figure-sheet") return [block.figureLabel, block.title];
        return [];
      })
      .join("\n");

    for (const sourceLine of [
      "T. A. EDISON.",
      "Phonograph or Speaking Machine.",
      "No. 200,521. Patented Feb. 19, 1878.",
      "Witnesses: Chas. H. Smith.",
      "Inventor: Thomas A. Edison.",
      "for Lemuel W. Serrell, atty.",
      "I claim as my invention—",
      "pin, 2",
    ]) {
      expect(ledger).toContain(sourceLine);
      expect(editionText).toContain(sourceLine);
    }
    expect(edisonPhonographParallelReadings[12]?.join(" ")).toContain("Pin 2");
    expect(edisonPhonographParallelReadings[12]?.join(" ")).not.toContain("Pin Z");

    const termInlines = edisonPhonographArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "term" }> =>
          inline.kind === "term",
      );
    });
    for (const sourceTerm of [
      "re-enforce",
      "indenting-point",
      "stereotyped",
      "volute spiral",
      "diaphragmic",
      "Morse register",
      "paraffine",
    ]) {
      const annotation = termInlines.find((inline) => inline.text === sourceTerm);
      expect(annotation?.definition.length).toBeGreaterThan(80);
    }
  });

  test("keeps the canonical record synchronized to the corrected source claim set", () => {
    expect(edisonPhonographPatent.archivalEdition).toBe(edisonPhonographArchivalEdition);
    expect(edisonPhonographPatent.originalTextAsset).toMatchObject({
      url: "/patents/transcripts/us-200521-edison-phonograph-reviewed.txt",
      pageCount: 3,
      kind: "reviewed-transcription",
      sourcePdfSha256: edisonPhonographArchivalEdition.sourcePdfSha256,
    });
    const claims = edisonPhonographArchivalEdition.blocks.filter((block) => block.kind === "claim");
    expect(edisonPhonographPatent.claims.map((claim) => claim.originalText)).toEqual(
      claims.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
    const canonicalRecordSource = readFileSync(
      resolve(process.cwd(), "src/data/patents/edison-phonograph.ts"),
      "utf8",
    );
    expect(canonicalRecordSource).toContain("function manualClaimText");
    expect(canonicalRecordSource).toContain("edisonPhonographArchivalEdition.blocks.find");
    expect(canonicalRecordSource).not.toContain("const MANUALLY_REVIEWED_CLAIM_TEXT");
    expect(edisonPhonographPatent.stats).toMatchObject({ totalClaims: 4, independentClaims: 4 });
  });

  test("pins every published source block to the reviewed ledger", () => {
    const asset = edisonPhonographPatent.originalTextAsset;
    if (!asset?.sourcePdfSha256) {
      throw new Error("US 200,521 is missing a reviewed transcript digest.");
    }
    const transcript = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(transcript, asset.pageCount)).toEqual({ valid: true });
    const sourcePdf = readFileSync(
      `${process.cwd()}/public${edisonPhonographPatent.originalPdfUrl}`,
    );
    expect(createHash("sha256").update(sourcePdf).digest("hex")).toBe(asset.sourcePdfSha256);

    const normalizedTranscript = transcript
      .replace(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm, "")
      .replace(/\s+/g, " ")
      .trim();
    for (const block of edisonPhonographArchivalEdition.blocks) {
      if (block.kind !== "masthead" && block.kind !== "paragraph" && block.kind !== "claim")
        continue;
      const sourceText =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.inlines.map((inline) => inline.text).join("");
      expect(normalizedTranscript).toContain(sourceText.replace(/\s+/g, " ").trim());
    }
  });

  test("pairs every source paragraph with an authored non-lossy reading", () => {
    const paragraphIndexes = edisonPhonographArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(edisonPhonographParallelReadings)
        .map(Number)
        .sort((left, right) => left - right),
    ).toEqual(paragraphIndexes);
    expect(edisonPhonographParallelReadings[26]?.join(" ")).toContain("Figure 3");
    expect(edisonPhonographParallelReadings[26]?.join(" ")).toContain("Figure 4");
  });
});
