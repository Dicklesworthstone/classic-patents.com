import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { lemelsonAdjustableManipulatorPatent } from "@/data/patents/lemelson-adjustable-manipulator";
import {
  normalizeLiteralSourceText,
  validateReviewedTranscription,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";
import {
  lemelsonAdjustableManipulatorArchivalEdition,
  lemelsonAdjustableManipulatorClaimText,
  lemelsonAdjustableManipulatorParallelReadings,
} from "./lemelsonAdjustableManipulatorEdition";

const EXPECTED_PDF_SHA256 = "e7be38b9f72cba77958ddab0422e147a6947056e4d51dddc7559508723cbdf34";
const SOURCE_SHEETS = {
  "/patents/figures/us-3260375-lemelson-adjustable-manipulator/source-sheet-1-v1.png": {
    sha256: "05189d8d8c5efc4ec6fbb8b35078ce43377c2cd94b6de612bd542d9cd03e0887",
    width: 2320,
    height: 3408,
  },
  "/patents/figures/us-3260375-lemelson-adjustable-manipulator/source-sheet-2-v1.png": {
    sha256: "2cb28e4169fd10acfc7d8b607b3dfdd9d4254a539035efb315c6e657f02c7c29",
    width: 2320,
    height: 3408,
  },
  "/patents/figures/us-3260375-lemelson-adjustable-manipulator/source-sheet-3-v1.png": {
    sha256: "75b4e79097a06a99cda9b67d0cfcc84979e8ee592595f58d33f75e1fd6285121",
    width: 2320,
    height: 3408,
  },
} as const;

describe("US 3,260,375 Lemelson Adjustable Manipulator Archival Edition Contract", () => {
  test("pins the complete eleven-page facsimile and reviewed publication boundary", () => {
    const pdfPath = resolve(
      process.cwd(),
      "public/patents/pdfs/us-3260375-lemelson-adjustable-manipulator.pdf",
    );
    expect(existsSync(pdfPath)).toBe(true);
    expect(createHash("sha256").update(readFileSync(pdfPath)).digest("hex")).toBe(
      EXPECTED_PDF_SHA256,
    );
    expect(lemelsonAdjustableManipulatorArchivalEdition.sourcePdfSha256).toBe(EXPECTED_PDF_SHA256);
    expect(
      validateCuratedSpecificationEdition(lemelsonAdjustableManipulatorArchivalEdition),
    ).toEqual({
      valid: true,
      errors: [],
    });
    expect(lemelsonAdjustableManipulatorPatent.archivalEdition).toBe(
      lemelsonAdjustableManipulatorArchivalEdition,
    );
  });

  test("derives every printed claim from the single manual-edition source", () => {
    const sourceClaims = lemelsonAdjustableManipulatorArchivalEdition.blocks.filter(
      (block) => block.kind === "claim",
    );
    expect(sourceClaims.map((block) => block.number)).toEqual([...Array(17)].map((_, i) => i + 1));
    expect(lemelsonAdjustableManipulatorPatent.claims).toHaveLength(17);
    for (const item of lemelsonAdjustableManipulatorPatent.claims) {
      expect(item.originalText).toBe(lemelsonAdjustableManipulatorClaimText(item.number));
      expect(item.plainEnglish.length).toBeGreaterThan(120);
    }
    expect(lemelsonAdjustableManipulatorPatent.stats).toEqual({
      totalClaims: 17,
      independentClaims: 8,
    });
    expect(
      lemelsonAdjustableManipulatorPatent.claims.filter((claim) => claim.isIndependent),
    ).toHaveLength(8);
  });

  test("binds each paragraph to a non-lossy parallel reading", () => {
    const paragraphIndexes = lemelsonAdjustableManipulatorArchivalEdition.blocks
      .map((block, index) => (block.kind === "paragraph" ? index : null))
      .filter((index): index is number => index !== null);
    for (const index of paragraphIndexes) {
      const reading = lemelsonAdjustableManipulatorParallelReadings[index];
      expect(reading, `Missing parallel reading for edition paragraph ${index}`).toBeDefined();
      expect(reading?.join(" ").length).toBeGreaterThan(80);
    }
  });

  test("keeps the ledger page-complete, anchored, and literal to the edition", () => {
    const path = resolve(
      process.cwd(),
      "public/patents/transcripts/us-3260375-lemelson-adjustable-manipulator-reviewed.txt",
    );
    const ledger = readFileSync(path, "utf8");
    expect(validateReviewedTranscription(ledger, 11)).toEqual({ valid: true });
    expect(
      validateReviewedTranscriptionPageAnchors(
        ledger,
        11,
        lemelsonAdjustableManipulatorPatent.originalTextAsset?.pageAnchors,
      ),
    ).toEqual({ valid: true });
    const normalized = normalizeLiteralSourceText(ledger);
    for (const block of lemelsonAdjustableManipulatorArchivalEdition.blocks) {
      const text =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.kind === "paragraph" || block.kind === "claim"
            ? block.inlines.map((inline) => inline.text).join("")
            : "";
      if (text) expect(normalized).toContain(normalizeLiteralSourceText(text));
    }
  });

  test("uses direct native-raster source sheets, term annotations, and an honest historical boundary", () => {
    for (const [asset, expected] of Object.entries(SOURCE_SHEETS)) {
      const sourceSheet = resolve(process.cwd(), "public", asset.replace(/^\//, ""));
      expect(existsSync(sourceSheet)).toBe(true);
      const bytes = readFileSync(sourceSheet);
      expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
      expect(bytes.length).toBeGreaterThan(10000);
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(expected.sha256);
    }
    const figureReferences = lemelsonAdjustableManipulatorArchivalEdition.blocks.flatMap((block) =>
      block.kind === "figure-sheet" || block.kind === "paragraph" || block.kind === "claim"
        ? block.kind === "figure-sheet"
          ? block.description.filter((inline) => inline.kind === "reference")
          : block.inlines.filter((inline) => inline.kind === "reference")
        : [],
    );
    expect(figureReferences.length).toBeGreaterThan(6);
    for (const reference of figureReferences) {
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      for (const preview of reference.figurePreviews ?? []) {
        expect(Object.hasOwn(SOURCE_SHEETS, preview.src)).toBe(true);
        const expected = SOURCE_SHEETS[preview.src as keyof typeof SOURCE_SHEETS];
        expect(preview.width).toBe(expected.width);
        expect(preview.height).toBe(expected.height);
        expect(existsSync(resolve(process.cwd(), "public", preview.src.replace(/^\//, "")))).toBe(
          true,
        );
      }
    }
    const terms = lemelsonAdjustableManipulatorArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph" || block.kind === "claim"
        ? block.inlines.filter((inline) => inline.kind === "term")
        : [],
    );
    expect(terms.map((term) => term.text)).toEqual([
      "positional computing mechanism",
      "lineal actuators",
      "adjustable limit defining means",
    ]);
    for (const term of terms) expect(term.definition.length).toBeGreaterThan(80);
    expect(lemelsonAdjustableManipulatorPatent.historicalContext.patentWars).toEqual([]);
    expect(lemelsonAdjustableManipulatorPatent.historicalContext.aftermath).toContain(
      "No patent-war or deployment claim",
    );
  });
});
