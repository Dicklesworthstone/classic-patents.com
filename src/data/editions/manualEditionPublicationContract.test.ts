import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { allPatents } from "@/data/patents";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";

const publicPath = (url: string) => join(process.cwd(), "public", url.replace(/^\//, ""));

/**
 * This is deliberately independent from the older editorial convenience
 * audits. It examines every manual edition selected by the catalogue, then
 * fails a production release unless each one has an accountable, page-complete
 * reviewed-transcription ledger pinned to the same source PDF.
 */
describe("manual-edition publication contract", () => {
  test("does not let a manual edition bypass its reviewed transcript ledger", () => {
    const manualPatents = allPatents.filter((patent) => patent.archivalEdition);
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

      const ledger = validateReviewedTranscription(
        readFileSync(transcriptPath, "utf8"),
        asset.pageCount,
      );
      if (!ledger.valid) {
        violations.push(
          `${patent.id}: ${ledger.error ?? "reviewed-transcription ledger is invalid."}`,
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
