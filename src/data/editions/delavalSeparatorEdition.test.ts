import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { evaluateArchivalPublicationState } from "@/data/editions/publicationApproval";
import { delavalSeparatorPatent } from "@/data/patents/delaval-separator";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  delavalSeparatorArchivalEdition,
  delavalSeparatorParallelReadings,
} from "./delavalSeparatorEdition";

const normalized = (value: string) => value.replace(/\s+/g, " ").trim();

describe("US 247,804 manual source edition", () => {
  test("pins the three-sheet source and its four printed claims", () => {
    expect(delavalSeparatorPatent.archivalEdition).toBe(delavalSeparatorArchivalEdition);
    expect(delavalSeparatorPatent.originalTextAsset).toMatchObject({
      url: "/patents/transcripts/us-247804-delaval-separator-reviewed.txt",
      pageCount: 3,
      kind: "reviewed-transcription",
      sourcePdfSha256: "aa9e284bf20a53467a36a3ae648c7ce5bc4b9599837af32281e04b316b5ef187",
    });
    expect(validateCuratedSpecificationEdition(delavalSeparatorArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(
      `${process.cwd()}/public/patents/pdfs/us-247804-delaval-separator.pdf`,
    );
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      delavalSeparatorArchivalEdition.sourcePdfSha256,
    );
    expect(delavalSeparatorPatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3, 4]);
    expect(delavalSeparatorPatent.claims.every((claim) => claim.isIndependent)).toBe(true);
  });

  test("keeps all authored source blocks in its review ledger", () => {
    const asset = delavalSeparatorPatent.originalTextAsset;
    if (!asset) throw new Error("US 247,804 is missing its reviewed source ledger.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 3)).toEqual({ valid: true });
    const normalizedLedger = normalized(
      ledger.replace(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm, ""),
    );
    for (const block of delavalSeparatorArchivalEdition.blocks) {
      if (block.kind !== "masthead" && block.kind !== "paragraph" && block.kind !== "claim") {
        continue;
      }
      const source =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.inlines.map((inline) => inline.text).join("");
      expect(normalizedLedger).toContain(normalized(source));
    }
  });

  test("pairs every source paragraph with a companion and every source figure with a complete local sheet", () => {
    const paragraphIndexes = delavalSeparatorArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(delavalSeparatorParallelReadings)
        .map(Number)
        .sort((left, right) => left - right),
    ).toEqual(paragraphIndexes);

    const references = delavalSeparatorArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });
    for (const number of [1, 2]) {
      expect(
        references.some((reference) =>
          reference.figurePreviews?.some((preview) => preview.alt.includes(`Fig. ${number}`)),
        ),
      ).toBe(true);
    }
    for (const reference of references) {
      for (const preview of reference.figurePreviews ?? []) {
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
        expect(preview).toMatchObject({
          src: "/patents/figures/us-247804-delaval-separator/drawing-sheet-source-v1.png",
          width: 2320,
          height: 3408,
        });
        expect(preview.alt).toContain("Complete unmodified source drawing sheet");
      }
    }

    for (const legacyCrop of ["fig-1-source-crop-v2.png", "fig-2-source-crop-v2.png"]) {
      expect(
        existsSync(
          resolve(process.cwd(), "public/patents/figures/us-247804-delaval-separator", legacyCrop),
        ),
      ).toBe(true);
    }
  });

  test("accepts all four source citations against full-sheet source-pixel evidence", () => {
    const decision = evaluateArchivalPublicationState(delavalSeparatorPatent);
    expect(decision.isPublished).toBe(true);
    expect(decision.reasonCode).toBe("ACCEPTED");
    expect(decision.figureManifest).toMatchObject({
      requiredFigureCount: 4,
      acceptedFigureCount: 4,
    });
    expect(decision.figureManifest.figures.every((figure) => figure.status === "accepted")).toBe(
      true,
    );
  });

  test("removes invented rates, mechanics, and claim count from public data", () => {
    const visibleData = JSON.stringify({
      title: delavalSeparatorPatent.title,
      inventor: delavalSeparatorPatent.inventors,
      filingDate: delavalSeparatorPatent.filingDate,
      summary: delavalSeparatorPatent.summary,
      originalText: delavalSeparatorPatent.originalText,
      plainEnglish: delavalSeparatorPatent.plainEnglishExplanation,
      claims: delavalSeparatorPatent.claims,
      drawings: delavalSeparatorPatent.drawings,
      sourceFace: delavalSeparatorArchivalEdition.blocks,
    });
    expect(visibleData).toContain("Gustaf De Laval");
    expect(visibleData).toContain("1879-07-31");
    expect(visibleData).not.toContain("Carl Gustaf Patrik");
    expect(visibleData).not.toContain("6,000");
    expect(visibleData).not.toContain("4,000 G");
    expect(visibleData).not.toContain("worm gear");
    expect(visibleData).not.toContain("0.5 mm");
    expect(visibleData).not.toContain("$\\");
  });
});
