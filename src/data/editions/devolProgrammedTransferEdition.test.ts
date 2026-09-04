import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { devolProgrammedTransferPatent } from "@/data/patents/devol-programmed-transfer";
import {
  normalizeLiteralSourceText,
  validateReviewedTranscription,
  validateReviewedTranscriptionEditorialIntegrity,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";
import {
  devolProgrammedTransferArchivalEdition,
  devolProgrammedTransferParallelReadings,
} from "./devolProgrammedTransferEdition";

const ROOT = process.cwd();
const PDF_PATH = join(ROOT, "public/patents/pdfs/us-2988237-devol-programmed-transfer.pdf");
const LEDGER_PATH = join(
  ROOT,
  "public/patents/transcripts/us-2988237-devol-programmed-transfer-reviewed.txt",
);
const DIGEST = "9b0ea9729cf6d670a21dfed17264d7b78fa343ab1e98467fc0d3255a5cd03790";

describe("US 2,988,237 Devol Programmed Article Transfer archival edition", () => {
  test("is a complete valid edition pinned to the reviewed facsimile", () => {
    expect(validateCuratedSpecificationEdition(devolProgrammedTransferArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(devolProgrammedTransferPatent.archivalEdition).toBe(
      devolProgrammedTransferArchivalEdition,
    );
    expect(devolProgrammedTransferPatent.originalTextAsset).toMatchObject({
      kind: "reviewed-transcription",
      pageCount: 13,
      sourcePdfSha256: DIGEST,
    });
    expect(existsSync(PDF_PATH)).toBe(true);
    expect(createHash("sha256").update(readFileSync(PDF_PATH)).digest("hex")).toBe(DIGEST);
  });

  test("has all twenty-eight printed claims and dynamically derives catalogue text", () => {
    const editionClaims = devolProgrammedTransferArchivalEdition.blocks.filter(
      (block) => block.kind === "claim",
    );
    expect(editionClaims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 28 }, (_, index) => index + 1),
    );
    expect(devolProgrammedTransferPatent.claims).toHaveLength(28);
    expect(devolProgrammedTransferPatent.stats).toEqual({
      totalClaims: 28,
      independentClaims: 18,
    });
    expect(
      devolProgrammedTransferPatent.claims
        .filter((claim) => claim.isIndependent)
        .map((claim) => claim.number),
    ).toEqual([1, 6, 7, 8, 9, 12, 13, 14, 15, 16, 19, 22, 23, 24, 25, 26, 27, 28]);

    for (const claim of devolProgrammedTransferPatent.claims) {
      const editionClaim = editionClaims.find((candidate) => candidate.number === claim.number);
      expect(editionClaim?.inlines.map((inline) => inline.text).join("")).toBe(claim.originalText);
      expect(claim.plainEnglish.length).toBeGreaterThan(180);
      for (const parent of claim.dependsOn ?? []) {
        expect(
          devolProgrammedTransferPatent.claims.some((candidate) => candidate.number === parent),
        ).toBe(true);
      }
    }
  });

  test("has source-complete reviewed ledger anchors and literal edition coverage", () => {
    const ledger = readFileSync(LEDGER_PATH, "utf8");
    expect(validateReviewedTranscription(ledger, 13)).toEqual({ valid: true });
    expect(validateReviewedTranscriptionEditorialIntegrity(ledger, 13)).toEqual({ valid: true });
    expect(
      validateReviewedTranscriptionPageAnchors(
        ledger,
        13,
        devolProgrammedTransferPatent.originalTextAsset?.pageAnchors,
      ),
    ).toEqual({ valid: true });

    const normalizedLedger = normalizeLiteralSourceText(
      ledger.replace(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---/g, ""),
    );
    for (const block of devolProgrammedTransferArchivalEdition.blocks) {
      const text =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.kind === "paragraph" || block.kind === "claim"
            ? block.inlines.map((inline) => inline.text).join("")
            : "";
      if (text) expect(normalizedLedger).toContain(normalizeLiteralSourceText(text));
    }
  });

  test("pins every complete primary source sheet, term annotation, and paragraph reading", () => {
    const sourceSheets = {
      "/patents/figures/us-2988237-devol-programmed-transfer/source-sheet-1-v1.png": {
        sha256: "840fe1202ca5890bef7e2f19eb1de144576a71909d7e067e227a64b2674b5da4",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-2988237-devol-programmed-transfer/source-sheet-2-v1.png": {
        sha256: "b2d29359ef512cdd3b7fb51835a26730455565af790c88c91bc448d851678207",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-2988237-devol-programmed-transfer/source-sheet-3-v1.png": {
        sha256: "61c5825513ea014d5fc45b25a9e39759be421f485a255f42f178fff99e9ab4a3",
        width: 2320,
        height: 3408,
      },
    } as const;
    const figures = devolProgrammedTransferArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.flatMap((inline) =>
            inline.kind === "reference" && inline.referenceType === "figure"
              ? (inline.figurePreviews ?? [])
              : [],
          )
        : [],
    );
    expect(figures.length).toBeGreaterThanOrEqual(11);
    for (const figure of figures) {
      const path = join(ROOT, "public", figure.src.replace(/^\//, ""));
      expect(existsSync(path)).toBe(true);
      expect(figure.src in sourceSheets).toBe(true);
      const bytes = readFileSync(path);
      expect(bytes.readUInt32BE(16)).toBe(figure.width);
      expect(bytes.readUInt32BE(20)).toBe(figure.height);
    }
    for (const [src, expected] of Object.entries(sourceSheets)) {
      const bytes = readFileSync(join(ROOT, "public", src.replace(/^\//, "")));
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(expected.sha256);
      expect(bytes.readUInt32BE(16)).toBe(expected.width);
      expect(bytes.readUInt32BE(20)).toBe(expected.height);
    }

    for (const [index, block] of devolProgrammedTransferArchivalEdition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      const reading = devolProgrammedTransferParallelReadings[index];
      expect(reading).toBeDefined();
      expect(reading?.join(" ").length).toBeGreaterThan(80);
    }

    const terms = devolProgrammedTransferArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph" ? block.inlines.filter((inline) => inline.kind === "term") : [],
    );
    expect(terms.length).toBeGreaterThanOrEqual(3);
    for (const annotation of terms) expect(annotation.definition.length).toBeGreaterThan(80);
  });

  test("does not invent a patent war for this source-bounded record", () => {
    expect(devolProgrammedTransferPatent.historicalContext.patentWars).toEqual([]);
  });
});
