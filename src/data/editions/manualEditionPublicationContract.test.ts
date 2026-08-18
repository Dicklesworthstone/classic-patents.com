import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { archivalEditionForPublication } from "@/components/patents/DualProjectionViewer";
import { allPatents } from "@/data/patents";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionCoverage,
} from "@/data/patents/sourceTextValidation";

const publicPath = (url: string) => join(process.cwd(), "public", url.replace(/^\//, ""));

function sourceTextFromEdition(patent: (typeof allPatents)[number]): string {
  const edition = patent.archivalEdition;
  if (!edition) return "";

  const inlineText = (
    inlines: readonly { kind: string; label?: string; text?: string }[],
  ): string =>
    inlines.map((inline) => (inline.kind === "reference" ? inline.label : inline.text)).join(" ");

  return edition.blocks
    .flatMap((block) => {
      if (block.kind === "masthead") return block.lines;
      if (block.kind === "heading" || block.kind === "equation") return [block.text];
      if (block.kind === "paragraph" || block.kind === "claim") return [inlineText(block.inlines)];
      if (block.kind === "figure-sheet") return [inlineText(block.description)];
      return [inlineText(block.headers.flat()), inlineText(block.rows.flat(2))];
    })
    .join(" ");
}

/**
 * This is deliberately independent from the older editorial convenience
 * audits. It examines every manual edition the visitor-facing renderer
 * actually publishes, then fails a production release unless each one has an
 * accountable, page-complete reviewed-transcription ledger pinned to the same
 * source PDF.
 */
describe("manual-edition publication contract", () => {
  test("does not let a manual edition bypass its reviewed transcript ledger", () => {
    const manualPatents = allPatents.filter((patent) => archivalEditionForPublication(patent));
    expect(manualPatents.length).toBeGreaterThan(0);

    const violations: string[] = [];
    for (const patent of manualPatents) {
      const asset = patent.originalTextAsset;
      if (asset?.kind !== "reviewed-transcription") {
        violations.push(
          `${patent.id}: manual edition lacks a reviewed-transcription asset and pinned review ledger.`,
        );
        continue;
      }

      if (!asset.reviewedBy?.trim() || !asset.reviewedAt?.trim()) {
        violations.push(`${patent.id}: reviewed-transcription lacks reviewer accountability.`);
      }

      const transcriptPath = publicPath(asset.url);
      if (!existsSync(transcriptPath)) {
        violations.push(`${patent.id}: reviewed-transcription file is missing.`);
        continue;
      }

      const transcript = readFileSync(transcriptPath, "utf8");
      const ledger = validateReviewedTranscription(transcript, asset.pageCount);
      if (!ledger.valid) {
        violations.push(
          `${patent.id}: ${ledger.error ?? "reviewed-transcription ledger is invalid."}`,
        );
      }

      const coverage = validateReviewedTranscriptionCoverage(
        transcript,
        asset.pageCount,
        sourceTextFromEdition(patent),
      );
      if (!coverage.valid) {
        violations.push(
          `${patent.id}: ${coverage.error ?? "reviewed-transcription coverage is invalid."}`,
        );
      }

      const sourcePdfPath = publicPath(patent.originalPdfUrl);
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
