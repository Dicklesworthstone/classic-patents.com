import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { allPatents } from "@/data/patents";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";

const BARE_DRAWING_REFERENCE =
  /\b(?:(?:fig(?:s)?\.?|figure)\s+\d+[a-z′′]*|(?:section|division)\s+\d+)\b/i;

const manualPatents = () => allPatents.filter((patent) => patent.archivalEdition);

describe("manual edition coverage audit", () => {
  test("covers every registered manual edition, not one exemplar", () => {
    expect(manualPatents().length).toBeGreaterThan(0);
  });

  test("does not leave a source drawing reference as inert prose", () => {
    const violations: string[] = [];

    for (const patent of manualPatents()) {
      const edition = patent.archivalEdition;
      if (!edition) continue;

      for (const [blockIndex, block] of edition.blocks.entries()) {
        if (block.kind !== "paragraph" && block.kind !== "claim") continue;
        for (const [inlineIndex, inline] of block.inlines.entries()) {
          if (inline.kind !== "text") continue;
          const matches = inline.text.match(new RegExp(BARE_DRAWING_REFERENCE, "gi"));
          if (matches) {
            violations.push(
              `${patent.id} block ${blockIndex} inline ${inlineIndex}: ${matches.join(", ")}`,
            );
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });

  test("gives every authored figure reference a local, source-derived preview", () => {
    const violations: string[] = [];

    for (const patent of manualPatents()) {
      const edition = patent.archivalEdition;
      if (!edition) continue;

      for (const [blockIndex, block] of edition.blocks.entries()) {
        if (!("inlines" in block)) continue;
        for (const [inlineIndex, inline] of block.inlines.entries()) {
          if (inline.kind !== "reference" || inline.referenceType !== "figure") continue;
          if (!inline.figurePreviews?.length) {
            violations.push(`${patent.id} block ${blockIndex} inline ${inlineIndex}: no preview.`);
            continue;
          }
          for (const preview of inline.figurePreviews) {
            if (!preview.src.startsWith("/patents/figures/")) {
              violations.push(
                `${patent.id} block ${blockIndex} inline ${inlineIndex}: non-local preview ${preview.src}.`,
              );
              continue;
            }
            if (!existsSync(join(process.cwd(), "public", preview.src.replace(/^\//, "")))) {
              violations.push(
                `${patent.id} block ${blockIndex} inline ${inlineIndex}: missing preview ${preview.src}.`,
              );
            }
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });

  test("does not publish a reviewed manual edition without a valid pinned transcript ledger", () => {
    const violations: string[] = [];

    for (const patent of manualPatents().filter(
      (p) => p.originalTextAsset?.kind === "reviewed-transcription",
    )) {
      const asset = patent.originalTextAsset;
      if (asset?.kind !== "reviewed-transcription") continue;
      if (!asset.reviewedBy?.trim() || !asset.reviewedAt?.trim()) {
        violations.push(`${patent.id}: reviewed-transcription lacks reviewer accountability.`);
      }

      const transcriptPath = join(process.cwd(), "public", asset.url.replace(/^\//, ""));
      if (!existsSync(transcriptPath)) {
        violations.push(`${patent.id}: reviewed-transcription file is missing.`);
        continue;
      }
      const ledger = validateReviewedTranscription(
        readFileSync(transcriptPath, "utf8"),
        asset.pageCount,
      );
      if (!ledger.valid) {
        violations.push(
          `${patent.id}: ${ledger.error ?? "reviewed-transcription ledger is invalid."}`,
        );
      }

      const sourcePdfPath = join(process.cwd(), "public", patent.originalPdfUrl.replace(/^\//, ""));
      if (!asset.sourcePdfSha256 || !existsSync(sourcePdfPath)) {
        violations.push(
          `${patent.id}: reviewed-transcription lacks a verifiable source-PDF digest.`,
        );
        continue;
      }
      const sourceDigest = createHash("sha256").update(readFileSync(sourcePdfPath)).digest("hex");
      if (asset.sourcePdfSha256 !== sourceDigest) {
        violations.push(
          `${patent.id}: reviewed-transcription digest does not match its source PDF.`,
        );
      }
    }

    expect(violations).toEqual([]);
  });
});
