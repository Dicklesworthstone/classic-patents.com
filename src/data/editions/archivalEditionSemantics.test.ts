import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { allPatents } from "@/data/patents";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";

/**
 * A reader must be able to discover a cited source figure or drawing division
 * through an explicit authored reference node. Leaving one in a text node
 * makes it visually inert and, for figures, suppresses its source-crop preview.
 */
const BARE_DRAWING_REFERENCE =
  /\b(?:(?:fig(?:s)?\.?|figure)\s+\d+[a-z′′]*|(?:section|division)\s+\d+)\b/i;

describe("manual archival-edition semantics", () => {
  test("does not leave source drawing references as inert prose", () => {
    const violations: string[] = [];

    for (const patent of allPatents.filter(
      (candidate) => candidate.id === "us-821393-wright-flyer",
    )) {
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

  test("does not publish a manual edition without its reviewed source ledger", () => {
    const violations: string[] = [];

    for (const patent of allPatents) {
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
