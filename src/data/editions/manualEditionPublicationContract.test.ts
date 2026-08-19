import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { allPatents } from "@/data/patents";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionCoverage,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";
import { archivalEditionForPublication } from "./publicationApproval";

const publicPath = (url: string) => join(process.cwd(), "public", url.replace(/^\//, ""));

function sourceTextFromEdition(patent: (typeof allPatents)[number]): string {
  const edition = patent.archivalEdition;
  if (!edition) return "";

  const inlineText = (
    inlines: readonly { kind: string; label?: string; text?: string }[],
  ): string => inlines.map((inline) => inline.text ?? "").join(" ");

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

      if (asset.pageAnchors) {
        const anchors = validateReviewedTranscriptionPageAnchors(
          transcript,
          asset.pageCount,
          asset.pageAnchors,
        );
        if (!anchors.valid) {
          violations.push(
            `${patent.id}: ${anchors.error ?? "reviewed-transcription page anchors are invalid."}`,
          );
        }
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

  test("rejects page-summary boilerplate masquerading as a reviewed transcription", () => {
    // A page marker only proves that a ledger has the right number of pages.
    // These patterns describe a page's contents instead of transcribing them;
    // allowing either into a published ledger would recreate the exact failure
    // that made a 58-page source appear complete while omitting its body.
    const summaryPlaceholders = [
      /\bSpecification\s+columns?\s+\d+(?:\s*(?:and|-)\s*\d+)?\s*:\s*Detailed descriptions?\b/i,
      /\bSpecification\s+columns?\s+\d+(?:\s*(?:and|-)\s*\d+)?\s*:\s*Comprehensive technical disclosure\b/i,
    ];
    const violations: string[] = [];

    for (const patent of allPatents.filter((candidate) =>
      archivalEditionForPublication(candidate),
    )) {
      const asset = patent.originalTextAsset;
      if (asset?.kind !== "reviewed-transcription") continue;

      const transcriptPath = publicPath(asset.url);
      if (!existsSync(transcriptPath)) continue;
      const transcript = readFileSync(transcriptPath, "utf8");

      for (const placeholder of summaryPlaceholders) {
        if (placeholder.test(transcript)) {
          violations.push(
            `${patent.id}: reviewed transcription contains page-summary boilerplate (${placeholder.source}).`,
          );
        }
      }
    }

    expect(violations).toEqual([]);
  });

  test("requires a distinct editorial decoder and innovation set for every published claim", () => {
    const violations: string[] = [];

    for (const patent of allPatents.filter((candidate) =>
      archivalEditionForPublication(candidate),
    )) {
      const decoderClaims = new Map<string, number[]>();
      const innovationClaims = new Map<string, number[]>();

      for (const claim of patent.claims) {
        const decoder = claim.plainEnglish.replace(/\s+/g, " ").trim();
        const innovations = claim.keyInnovations
          .map((innovation) => innovation.replace(/\s+/g, " ").trim())
          .join(" | ");

        if (!decoder || !innovations) {
          violations.push(
            `${patent.id}: Claim #${claim.number} lacks authored editorial metadata.`,
          );
          continue;
        }

        decoderClaims.set(decoder, [...(decoderClaims.get(decoder) ?? []), claim.number]);
        innovationClaims.set(innovations, [
          ...(innovationClaims.get(innovations) ?? []),
          claim.number,
        ]);
      }

      for (const [decoder, claimNumbers] of decoderClaims) {
        if (claimNumbers.length > 1) {
          violations.push(
            `${patent.id}: claims ${claimNumbers.join(", ")} reuse the same plain-English decoder (${decoder.slice(0, 80)}…).`,
          );
        }
      }

      for (const [innovations, claimNumbers] of innovationClaims) {
        if (claimNumbers.length > 1) {
          violations.push(
            `${patent.id}: claims ${claimNumbers.join(", ")} reuse the same innovation set (${innovations}).`,
          );
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
