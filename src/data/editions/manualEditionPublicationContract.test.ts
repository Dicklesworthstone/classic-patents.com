import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { allPatents } from "@/data/patents";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionCoverage,
  validateReviewedTranscriptionEditorialIntegrity,
  validateReviewedTranscriptionLiteralCoverage,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";
import {
  archivalEditionForPublication,
  isArchivalEditionExplicitlyWithheld,
} from "./publicationApproval";

const publicPath = (url: string) => join(process.cwd(), "public", url.replace(/^\//, ""));

function pngDimensions(path: string): { width: number; height: number } | undefined {
  const bytes = readFileSync(path);
  if (bytes.length < 24 || bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    return undefined;
  }
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

const GENERIC_CLAIM_EDITORIAL_PATTERNS: readonly RegExp[] = [
  /\brefinement claim \d+ detailing\b/i,
  /\bclaim \d+ limitation\b/i,
  /\bclaim \d+ refinement\b/i,
  /\b(?:generic|placeholder) (?:claim )?(?:decoder|innovation|explanation|metadata)\b/i,
  /\bthis decoder preserves the source(?:'s|’s) stated\b/i,
  /\bsource limitations retained in full\b/i,
  /\bthe printed combination specifically turns on\b/i,
  /\bwhile the source does not require any unstated\b/i,
];

const BARE_FIGURE_CITATION = /\b(?:Fig(?:s)?\.?|Figures?)\s+(?:\d+|[IVXLC]+)\b/i;

function sourceTextFromEdition(patent: (typeof allPatents)[number]): string {
  const edition = patent.archivalEdition;
  if (!edition) return "";

  const inlineText = (
    inlines: readonly { kind: string; label?: string; text?: string }[],
  ): string => inlines.map((inline) => inline.text ?? "").join("");

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

function literalSectionsFromEdition(patent: (typeof allPatents)[number]): readonly string[] {
  const edition = patent.archivalEdition;
  if (!edition) return [];

  return edition.blocks.flatMap((block) => {
    if (block.kind === "masthead") return block.lines;
    if (block.kind === "paragraph" || block.kind === "claim") {
      return [block.inlines.map((inline) => inline.text).join("")];
    }
    return [];
  });
}

/**
 * This is deliberately independent from the older editorial convenience
 * audits. It examines every manual edition the visitor-facing renderer
 * actually publishes, then fails a production release unless each one has an
 * accountable, page-complete reviewed-transcription ledger pinned to the same
 * source PDF.
 */
describe("manual-edition publication contract", () => {
  test("keeps Pasteur fail-closed until its repaired source face passes final acceptance", () => {
    const pasteur = allPatents.find((patent) => patent.id === "us-135245-pasteur-fermentation");

    expect(pasteur).toBeDefined();
    expect(isArchivalEditionExplicitlyWithheld("us-135245-pasteur-fermentation")).toBe(true);
    expect(pasteur && archivalEditionForPublication(pasteur)).toBeUndefined();
  });

  test("keeps withheld source editions type-safe without publication-state casts", () => {
    const editionDirectory = join(process.cwd(), "src", "data", "editions");
    const violations = readdirSync(editionDirectory)
      .filter((fileName) => /Edition(?:\.test)?\.ts$/.test(fileName))
      .flatMap((fileName) => {
        const source = readFileSync(join(editionDirectory, fileName), "utf8");
        const reasons: string[] = [];
        if (/^\s*\/\/\s*@ts-nocheck\b/m.test(source)) reasons.push("@ts-nocheck");
        if (/completeFacsimileReviewed\s*:\s*false\s+as\s+unknown\s+as\s+true/.test(source)) {
          reasons.push("false-as-true facsimile-review cast");
        }
        return reasons.map((reason) => `${fileName}: ${reason}`);
      });

    expect(violations).toEqual([]);
  });

  test("recognizes numbered claim boilerplate that defeats simple uniqueness checks", () => {
    const boilerplate = [
      "Refinement claim 37 detailing specific mechanical dimensions and layer laminations.",
      "Claim 18 limitation",
      "Claim 22 refinement",
      "Placeholder claim decoder",
      "This decoder preserves the source's stated materials and geometry.",
      "Source limitations retained in full:",
      "The printed combination specifically turns on a mounted pod and a spreading surface.",
      "The claim is limited to its terms, while the source does not require any unstated commercial brand.",
    ];

    for (const text of boilerplate) {
      expect(GENERIC_CLAIM_EDITORIAL_PATTERNS.some((pattern) => pattern.test(text))).toBe(true);
    }
    expect(
      GENERIC_CLAIM_EDITORIAL_PATTERNS.some((pattern) =>
        pattern.test(
          "The container's sealed long edge ruptures under roller pressure and meters the viscous developer across the photosensitive layer.",
        ),
      ),
    ).toBe(false);
    expect(BARE_FIGURE_CITATION.test("as illustrated in Fig. XIV")).toBe(true);
    expect(BARE_FIGURE_CITATION.test("the figures in this section")).toBe(false);
  });

  test("does not let a manual edition bypass its reviewed transcript ledger", () => {
    const manualPatents = allPatents.filter((patent) => archivalEditionForPublication(patent));
    expect(manualPatents.length).toBeGreaterThan(0);

    const violations: string[] = [];
    for (const patent of manualPatents) {
      const publishedEdition = archivalEditionForPublication(patent);
      if (!publishedEdition) continue;

      const editionValidation = validateCuratedSpecificationEdition(publishedEdition);
      if (!editionValidation.valid) {
        violations.push(
          `${patent.id}: visitor-facing archival edition is invalid (${editionValidation.errors.join("; ")}).`,
        );
      }

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

      const editorialIntegrity = validateReviewedTranscriptionEditorialIntegrity(
        transcript,
        asset.pageCount,
      );
      if (!editorialIntegrity.valid) {
        violations.push(
          `${patent.id}: ${editorialIntegrity.error ?? "reviewed-transcription substitutes editorial summaries for facsimile content."}`,
        );
      }

      const literalCoverage = validateReviewedTranscriptionLiteralCoverage(
        transcript,
        asset.pageCount,
        literalSectionsFromEdition(patent),
      );
      if (!literalCoverage.valid) {
        violations.push(
          `${patent.id}: ${literalCoverage.error ?? "reviewed transcription does not contain every authored literal block."}`,
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

  test("requires every printed figure citation to be an authored local preview", () => {
    const violations: string[] = [];

    for (const patent of allPatents.filter((candidate) =>
      archivalEditionForPublication(candidate),
    )) {
      const edition = patent.archivalEdition;
      if (!edition) continue;

      for (const [blockIndex, block] of edition.blocks.entries()) {
        if (
          (block.kind === "heading" || block.kind === "equation") &&
          BARE_FIGURE_CITATION.test(block.text)
        ) {
          violations.push(
            `${patent.id}: block ${blockIndex} leaves a printed figure citation in a non-interactive ${block.kind} block (${block.text.slice(0, 100)}).`,
          );
        }

        const inlineGroups =
          block.kind === "paragraph" || block.kind === "claim"
            ? [block.inlines]
            : block.kind === "figure-sheet"
              ? [block.description]
              : block.kind === "table"
                ? [...block.headers, ...block.rows.flat()]
                : [];

        for (const inlines of inlineGroups) {
          for (const inline of inlines) {
            if (
              BARE_FIGURE_CITATION.test(inline.text) &&
              !(inline.kind === "reference" && inline.referenceType === "figure")
            ) {
              violations.push(
                `${patent.id}: block ${blockIndex} leaves a printed figure citation without a figure reference (${inline.text.slice(0, 100)}).`,
              );
            }
            if (inline.kind !== "reference" || inline.referenceType !== "figure") continue;

            if (!inline.figurePreviews?.length) {
              violations.push(
                `${patent.id}: block ${blockIndex} figure reference ${inline.text} has no preview.`,
              );
              continue;
            }

            for (const preview of inline.figurePreviews) {
              if (!preview.src.startsWith("/patents/figures/")) {
                violations.push(
                  `${patent.id}: block ${blockIndex} figure reference ${inline.text} uses a non-local preview (${preview.src}).`,
                );
                continue;
              }
              const previewPath = publicPath(preview.src);
              if (!existsSync(previewPath)) {
                violations.push(
                  `${patent.id}: block ${blockIndex} figure reference ${inline.text} points to a missing preview (${preview.src}).`,
                );
                continue;
              }
              if (!preview.alt.trim() || preview.width < 1 || preview.height < 1) {
                violations.push(
                  `${patent.id}: block ${blockIndex} figure reference ${inline.text} has incomplete preview metadata (${preview.src}).`,
                );
                continue;
              }

              const actualDimensions = pngDimensions(previewPath);
              if (!actualDimensions) {
                violations.push(
                  `${patent.id}: block ${blockIndex} figure reference ${inline.text} does not point to a valid PNG crop (${preview.src}).`,
                );
                continue;
              }
              if (
                actualDimensions.width !== preview.width ||
                actualDimensions.height !== preview.height
              ) {
                violations.push(
                  `${patent.id}: block ${blockIndex} figure reference ${inline.text} declares ${preview.width}×${preview.height}, but ${preview.src} is ${actualDimensions.width}×${actualDimensions.height}.`,
                );
              }
            }
          }
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

        const decoderWordCount = decoder.split(/\s+/).filter(Boolean).length;
        if (decoderWordCount < 30) {
          violations.push(
            `${patent.id}: Claim #${claim.number} decoder is too short to preserve the legal mechanism (${decoderWordCount} words).`,
          );
        }

        const normalizedDecoder = decoder.replace(/[^\p{L}\p{N}]+/gu, "").toLocaleLowerCase();
        const normalizedClaim = claim.originalText
          .replace(/[^\p{L}\p{N}]+/gu, "")
          .toLocaleLowerCase();
        if (normalizedClaim.length >= 80 && normalizedDecoder.includes(normalizedClaim)) {
          violations.push(
            `${patent.id}: Claim #${claim.number} decoder embeds the original legal claim instead of independently explaining it.`,
          );
        }

        for (const pattern of GENERIC_CLAIM_EDITORIAL_PATTERNS) {
          pattern.lastIndex = 0;
          if (pattern.test(decoder) || pattern.test(innovations)) {
            violations.push(
              `${patent.id}: Claim #${claim.number} uses numbered or placeholder editorial boilerplate (${decoder.slice(0, 100)}…).`,
            );
            break;
          }
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
