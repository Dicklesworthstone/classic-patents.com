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

  test("binds all 16 active figure citations to complete digest-pinned source sheets", () => {
    const sourceSheet2 = "/patents/figures/us-4341502-makino-scara/source-sheet-2-v1.png";
    const sourceSheet3 = "/patents/figures/us-4341502-makino-scara/source-sheet-3-v1.png";
    const figureOccurrences = makinoScaraArchivalEdition.blocks.flatMap((block, blockIndex) =>
      block.kind === "paragraph"
        ? block.inlines.flatMap((inline, inlineIndex) =>
            inline.kind === "reference" && inline.referenceType === "figure"
              ? [
                  {
                    occurrenceKey: `edition-block-${blockIndex}-group-0-inline-${inlineIndex}`,
                    text: inline.text,
                    previews: inline.figurePreviews,
                  },
                ]
              : [],
          )
        : [],
    );

    expect(
      figureOccurrences.map((occurrence) => [
        occurrence.occurrenceKey,
        occurrence.text,
        occurrence.previews?.[0]?.src,
      ]),
    ).toEqual([
      ["edition-block-11-group-0-inline-0", "FIG. 1", sourceSheet2],
      ["edition-block-11-group-0-inline-2", "FIG. 2", sourceSheet3],
      ["edition-block-11-group-0-inline-4", "FIG. 1", sourceSheet2],
      ["edition-block-11-group-0-inline-6", "FIGS. 3 to 6", sourceSheet3],
      ["edition-block-11-group-0-inline-8", "FIG. 2", sourceSheet3],
      ["edition-block-13-group-0-inline-1", "FIG. 1", sourceSheet2],
      ["edition-block-14-group-0-inline-1", "FIG. 2", sourceSheet3],
      ["edition-block-15-group-0-inline-0", "FIGS. 3 to 6", sourceSheet3],
      ["edition-block-15-group-0-inline-2", "FIG. 3", sourceSheet3],
      ["edition-block-16-group-0-inline-1", "FIG. 4", sourceSheet3],
      ["edition-block-16-group-0-inline-3", "FIG. 5", sourceSheet3],
      ["edition-block-16-group-0-inline-5", "FIG. 3", sourceSheet3],
      ["edition-block-16-group-0-inline-7", "FIG. 4", sourceSheet3],
      ["edition-block-16-group-0-inline-9", "FIG. 3", sourceSheet3],
      ["edition-block-17-group-0-inline-1", "FIG. 6", sourceSheet3],
      ["edition-block-17-group-0-inline-3", "FIG. 4", sourceSheet3],
    ]);
    for (const occurrence of figureOccurrences) {
      expect(occurrence.previews).toHaveLength(1);
      expect(occurrence.previews).toEqual([expect.objectContaining({ width: 2320, height: 3408 })]);
      expect(occurrence.previews?.[0]?.alt).toContain("Complete unmodified source drawing sheet");
    }

    for (const sourceSheet of [
      {
        path: sourceSheet2,
        sha256: "e6ec06f96c767ce5f8a6ff43d912466f6ef3739e31302cc80aac712be2e0155a",
      },
      {
        path: sourceSheet3,
        sha256: "74beb6e9c0c307287bbb8d1b4c797a1d3942f6ddf27cf9e256c0d4757c346398",
      },
    ]) {
      const path = join(ROOT, "public", sourceSheet.path.replace(/^\//, ""));
      expect(existsSync(path)).toBe(true);
      const bytes = readFileSync(path);
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(sourceSheet.sha256);
      expect({ width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }).toEqual({
        width: 2320,
        height: 3408,
      });
    }

    for (const legacyCrop of [
      "fig-1-source-crop-v1.png",
      "fig-2-source-crop-v1.png",
      "fig-3-source-crop-v1.png",
      "fig-4-source-crop-v1.png",
      "fig-5-source-crop-v1.png",
      "fig-6-source-crop-v1.png",
    ]) {
      expect(
        existsSync(join(ROOT, "public/patents/figures/us-4341502-makino-scara", legacyCrop)),
      ).toBe(true);
    }

    const provenance = readFileSync(
      join(ROOT, "docs/provenance/us-4341502-makino-scara.md"),
      "utf8",
    );
    expect(provenance).toContain("## Source-sheet acceptance (2026-09-03)");
    expect(provenance).toContain("The 16 authored active figure references");
    expect(provenance).toContain(
      "e6ec06f96c767ce5f8a6ff43d912466f6ef3739e31302cc80aac712be2e0155a",
    );
    expect(provenance).toContain(
      "74beb6e9c0c307287bbb8d1b4c797a1d3942f6ddf27cf9e256c0d4757c346398",
    );

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

  test("provides valid provenance classifications for all Makino controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const config = PATENT_PHYSICS_REGISTRY["us-4341502-makino-scara"];
    expect(config).toBeDefined();

    for (const ctrl of config.controls) {
      expect(["source-disclosed", "scenario-reader"]).toContain(ctrl.provenance);
    }

    const defaultMetrics = config.computeMetrics({});
    for (const metric of defaultMetrics) {
      expect(["source-disclosed", "scenario-reader"]).toContain(metric.provenance);
    }
  });

  test("wires claim 1 constraint in claimConstraints", () => {
    const {
      CATALOG_CLAIM_CONSTRAINTS,
      applyClaimConstraintModifications,
    } = require("@/physics/claimConstraints");
    const constraints = CATALOG_CLAIM_CONSTRAINTS["us-4341502-makino-scara"];
    expect(constraints).toBeDefined();
    expect(constraints.length).toBeGreaterThanOrEqual(1);

    const claim1 = constraints.find((c: any) => c.claimNumber === 1);
    expect(claim1).toBeDefined();
    expect(claim1?.claimTitle).toBe("Concentric Base Four-Link SCARA Mechanism");

    const activeRes = applyClaimConstraintModifications("us-4341502-makino-scara", {}, { 1: true });
    expect(activeRes.activeFailures.length).toBe(0);

    const invertedRes = applyClaimConstraintModifications(
      "us-4341502-makino-scara",
      {},
      { 1: false },
    );
    expect(invertedRes.activeFailures.length).toBeGreaterThan(0);
    expect(invertedRes.modifiedParams.topologyVariant).toBe(2);
    expect(invertedRes.refusalWarning).toContain("SOURCE BOUNDARY");
  });
});
