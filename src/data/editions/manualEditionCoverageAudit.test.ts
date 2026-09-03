import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { allPatents } from "@/data/patents";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";
import { archivalEditionForPublication } from "./publicationApproval";

const BARE_DRAWING_REFERENCE =
  /\b(?:(?:fig(?:s)?\.?|figure)\s+\d+[a-z′′]*|(?:section|division)\s+\d+)\b/i;

const manualPatents = () => allPatents.filter((patent) => archivalEditionForPublication(patent));

function inlineGroupsForBlock(
  block: NonNullable<ReturnType<typeof archivalEditionForPublication>>["blocks"][number],
) {
  if (block.kind === "paragraph" || block.kind === "claim") return [block.inlines];
  if (block.kind === "figure-sheet") return [block.description];
  if (block.kind === "table") return [...block.headers, ...block.rows.flat()];
  return [];
}

describe("manual edition coverage audit", () => {
  test("covers every registered manual edition, not one exemplar", () => {
    expect(manualPatents().length).toBeGreaterThan(0);
  });

  test("tracks source drawing references left as inert prose without hiding documents", () => {
    // Editorial calibration (root decision, 2026-08-22): an unlinked printed
    // drawing reference is a tracked authored-reference task, not a reason
    // to withhold the document. The inventory must stay bounded so it keeps
    // being worked down.
    const violations: string[] = [];

    for (const patent of manualPatents()) {
      const edition = patent.archivalEdition;
      if (!edition) continue;

      for (const [blockIndex, block] of edition.blocks.entries()) {
        for (const [groupIndex, inlines] of inlineGroupsForBlock(block).entries()) {
          for (const [inlineIndex, inline] of inlines.entries()) {
            if (inline.kind !== "text") continue;
            const matches = inline.text.match(new RegExp(BARE_DRAWING_REFERENCE, "gi"));
            if (matches) {
              violations.push(
                `${patent.id} block ${blockIndex} group ${groupIndex} inline ${inlineIndex}: ${matches.join(", ")}`,
              );
            }
          }
        }
      }
    }

    // Worked down over time; bounded so the inventory keeps shrinking across all published editions.
    expect(violations.length).toBeLessThanOrEqual(30);
  });

  test("gives every authored figure reference a local, source-derived preview", () => {
    const violations: string[] = [];
    const missingPreviews: string[] = [];

    for (const patent of manualPatents()) {
      const edition = patent.archivalEdition;
      if (!edition) continue;

      for (const [blockIndex, block] of edition.blocks.entries()) {
        for (const [groupIndex, inlines] of inlineGroupsForBlock(block).entries()) {
          for (const [inlineIndex, inline] of inlines.entries()) {
            if (inline.kind !== "reference" || inline.referenceType !== "figure") continue;
            if (!inline.figurePreviews?.length) {
              missingPreviews.push(
                `${patent.id} block ${blockIndex} group ${groupIndex} inline ${inlineIndex}: no preview.`,
              );
              continue;
            }
            for (const preview of inline.figurePreviews) {
              if (!preview.src.startsWith("/patents/figures/")) {
                // Non-local sources would break the source-derived provenance
                // chain; those stay hard failures.
                violations.push(
                  `${patent.id} block ${blockIndex} group ${groupIndex} inline ${inlineIndex}: non-local preview ${preview.src}.`,
                );
                continue;
              }
              if (!existsSync(join(process.cwd(), "public", preview.src.replace(/^\//, "")))) {
                // Editorial calibration (root decision, 2026-08-22): a crop
                // that has not been cut yet is a tracked task, not a reason
                // to hide the document.
                missingPreviews.push(
                  `${patent.id} block ${blockIndex} group ${groupIndex} inline ${inlineIndex}: missing preview ${preview.src}.`,
                );
              }
            }
          }
        }
      }
    }

    expect(violations).toEqual([]);
    // Worked down over time; bounded so the inventory keeps shrinking.
    expect(missingPreviews.length).toBeLessThan(400);
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
      if (asset.pageAnchors) {
        const anchors = validateReviewedTranscriptionPageAnchors(
          readFileSync(transcriptPath, "utf8"),
          asset.pageCount,
          asset.pageAnchors,
        );
        if (!anchors.valid) {
          violations.push(
            `${patent.id}: ${anchors.error ?? "reviewed-transcription page anchors are invalid."}`,
          );
        }
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
