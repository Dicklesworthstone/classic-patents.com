import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { makinoScaraPatent } from "@/data/patents/makino-scara";
import {
  normalizeLiteralSourceText,
  validateReviewedTranscription,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";
import { makinoScaraArchivalEdition, makinoScaraParallelReadings } from "./makinoScaraEdition";

const ROOT = process.cwd();
const PDF_PATH = join(ROOT, "public/patents/pdfs/us-4341502-makino-scara.pdf");
const LEDGER_PATH = join(ROOT, "public/patents/transcripts/us-4341502-makino-scara-reviewed.txt");
const DIGEST = "0ecad64ed838700e9595b18bc782609ff68fe7c0d7829887b4663554ba24b8b8";

describe("US 4,341,502 Makino Assembly Robot archival edition", () => {
  test("is a complete valid edition pinned to the reviewed facsimile", () => {
    expect(validateCuratedSpecificationEdition(makinoScaraArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(makinoScaraPatent.archivalEdition).toBe(makinoScaraArchivalEdition);
    expect(makinoScaraPatent.originalTextAsset).toMatchObject({
      kind: "reviewed-transcription",
      pageCount: 5,
      sourcePdfSha256: DIGEST,
    });
    expect(existsSync(PDF_PATH)).toBe(true);
    expect(createHash("sha256").update(readFileSync(PDF_PATH)).digest("hex")).toBe(DIGEST);
  });

  test("has all seven printed claims and derives catalogue text from the edition", () => {
    const editionClaims = makinoScaraArchivalEdition.blocks.filter(
      (block) => block.kind === "claim",
    );
    expect(editionClaims.map((claim) => claim.number)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(makinoScaraPatent.claims).toHaveLength(7);
    expect(makinoScaraPatent.stats).toEqual({ totalClaims: 7, independentClaims: 3 });
    expect(
      makinoScaraPatent.claims.filter((claim) => claim.isIndependent).map((claim) => claim.number),
    ).toEqual([1, 3, 6]);

    for (const claim of makinoScaraPatent.claims) {
      const editionClaim = editionClaims.find((candidate) => candidate.number === claim.number);
      expect(editionClaim?.inlines.map((inline) => inline.text).join("")).toBe(claim.originalText);
      expect(claim.plainEnglish.length).toBeGreaterThan(120);
      for (const parent of claim.dependsOn ?? []) {
        expect(makinoScaraPatent.claims.some((candidate) => candidate.number === parent)).toBe(
          true,
        );
      }
    }
  });

  test("has page-complete reviewed ledger anchors and literal edition coverage", () => {
    const ledger = readFileSync(LEDGER_PATH, "utf8");
    expect(validateReviewedTranscription(ledger, 5)).toEqual({ valid: true });
    expect(
      validateReviewedTranscriptionPageAnchors(
        ledger,
        5,
        makinoScaraPatent.originalTextAsset?.pageAnchors,
      ),
    ).toEqual({ valid: true });

    // A continuous edition may cross an original scan page. The reviewed
    // ledger retains page evidence, so remove only its structural markers
    // before literal comparison.
    const normalizedLedger = normalizeLiteralSourceText(
      ledger.replace(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---/g, ""),
    );
    for (const block of makinoScaraArchivalEdition.blocks) {
      const text =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.kind === "paragraph" || block.kind === "claim"
            ? block.inlines.map((inline) => inline.text).join("")
            : "";
      if (text) expect(normalizedLedger).toContain(normalizeLiteralSourceText(text));
    }
  });

  test("pins every source figure crop and every paragraph reading", () => {
    const figures = makinoScaraArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.flatMap((inline) =>
            inline.kind === "reference" && inline.referenceType === "figure"
              ? (inline.figurePreviews ?? [])
              : [],
          )
        : [],
    );
    expect(figures.length).toBeGreaterThanOrEqual(8);
    for (const figure of figures) {
      const path = join(ROOT, "public", figure.src.replace(/^\//, ""));
      expect(existsSync(path)).toBe(true);
      const bytes = readFileSync(path);
      expect(bytes.readUInt32BE(16)).toBe(figure.width);
      expect(bytes.readUInt32BE(20)).toBe(figure.height);
    }

    for (const [index, block] of makinoScaraArchivalEdition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      const reading = makinoScaraParallelReadings[index];
      expect(reading).toBeDefined();
      expect(reading?.join(" ").length).toBeGreaterThan(80);
    }

    const terms = makinoScaraArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph" ? block.inlines.filter((inline) => inline.kind === "term") : [],
    );
    expect(terms.length).toBeGreaterThanOrEqual(3);
    for (const annotation of terms) expect(annotation.definition.length).toBeGreaterThan(80);
  });
});
