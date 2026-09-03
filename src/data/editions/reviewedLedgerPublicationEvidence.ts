import {
  normalizeLiteralSourceText,
  normalizeReviewedLedgerText,
  validateReviewedTranscription,
  validateReviewedTranscriptionCoverage,
  validateReviewedTranscriptionEditorialIntegrity,
  validateReviewedTranscriptionLiteralCoverage,
} from "@/data/patents/sourceTextValidation";
import type { CuratedSpecificationEdition, Patent } from "@/types/patent";

export type ReviewedLedgerContentStatus =
  | "verified"
  | "not-applicable"
  | "missing-reviewed-ledger"
  | "noncanonical-url"
  | "missing-file"
  | "unreadable-file"
  | "invalid-page-ledger"
  | "editorial-placeholder"
  | "materially-incomplete"
  | "literal-coverage-incomplete";

export interface ReviewedLedgerPublicationEvidence {
  status: ReviewedLedgerContentStatus;
  valid: boolean;
  ledgerUrl: string | null;
  authoredSectionCount: number;
  coveredSectionCount: number;
  coverageFraction: number;
  missingSectionIndexes: readonly number[];
  missingClaimNumbers: readonly number[];
  error: string | null;
}

export const NO_REVIEWED_LEDGER_PUBLICATION_EVIDENCE: ReviewedLedgerPublicationEvidence = {
  status: "not-applicable",
  valid: false,
  ledgerUrl: null,
  authoredSectionCount: 0,
  coveredSectionCount: 0,
  coverageFraction: 0,
  missingSectionIndexes: [],
  missingClaimNumbers: [],
  error: "Reviewed-ledger content has not been verified.",
};

function inlineText(inlines: readonly { text: string }[]): string {
  return inlines.map((inline) => inline.text).join("");
}

/**
 * Literal public-source sections that must be present in the reviewed ledger.
 * Figure-sheet descriptions and headings can be editorial navigation, so the
 * binding contract follows the AGENTS standard: masthead, specification
 * paragraphs, and every printed claim.
 */
export function literalLedgerSectionsForEdition(
  edition: CuratedSpecificationEdition,
): readonly string[] {
  return edition.blocks.flatMap((block) => {
    if (block.kind === "masthead") return block.lines;
    if (block.kind === "paragraph" || block.kind === "claim") {
      return [inlineText(block.inlines)];
    }
    return [];
  });
}

function coverageDetails(transcript: string, sections: readonly string[]) {
  const normalizedLedger = normalizeLiteralSourceText(normalizeReviewedLedgerText(transcript));
  const missingSectionIndexes = sections.flatMap((section, index) => {
    const normalizedSection = normalizeLiteralSourceText(section);
    return normalizedSection && normalizedLedger.includes(normalizedSection) ? [] : [index];
  });
  const coveredSectionCount = sections.length - missingSectionIndexes.length;
  return {
    authoredSectionCount: sections.length,
    coveredSectionCount,
    coverageFraction: sections.length === 0 ? 0 : coveredSectionCount / sections.length,
    missingSectionIndexes,
  };
}

function missingClaimNumbers(
  patent: Pick<Patent, "claims">,
  transcript: string,
): readonly number[] {
  const normalizedLedger = normalizeLiteralSourceText(normalizeReviewedLedgerText(transcript));
  return patent.claims.flatMap((claim) =>
    normalizedLedger.includes(normalizeLiteralSourceText(claim.originalText)) ? [] : [claim.number],
  );
}

export function evaluateReviewedLedgerTextEvidence(
  patent: Pick<Patent, "archivalEdition" | "claims" | "originalTextAsset">,
  transcript: string,
): ReviewedLedgerPublicationEvidence {
  const edition = patent.archivalEdition;
  const asset = patent.originalTextAsset;
  if (!edition || asset?.kind !== "reviewed-transcription") {
    return {
      ...NO_REVIEWED_LEDGER_PUBLICATION_EVIDENCE,
      status: "missing-reviewed-ledger",
      ledgerUrl: asset?.url ?? null,
      error: "A manual edition requires a reviewed-transcription ledger.",
    };
  }

  const sections = literalLedgerSectionsForEdition(edition);
  const details = coverageDetails(transcript, sections);
  const missingClaims = missingClaimNumbers(patent, transcript);
  const common = {
    ledgerUrl: asset.url,
    ...details,
    missingClaimNumbers: missingClaims,
  };

  const ledger = validateReviewedTranscription(transcript, asset.pageCount);
  if (!ledger.valid) {
    return {
      status: "invalid-page-ledger",
      valid: false,
      ...common,
      error: ledger.error ?? "The reviewed-transcription page ledger is invalid.",
    };
  }

  const integrity = validateReviewedTranscriptionEditorialIntegrity(transcript, asset.pageCount);
  if (!integrity.valid) {
    return {
      status: "editorial-placeholder",
      valid: false,
      ...common,
      error: integrity.error ?? "The reviewed ledger contains editorial placeholder text.",
    };
  }

  const lengthCoverage = validateReviewedTranscriptionCoverage(
    transcript,
    asset.pageCount,
    sections.join(" "),
  );
  if (!lengthCoverage.valid) {
    return {
      status: "materially-incomplete",
      valid: false,
      ...common,
      error: lengthCoverage.error ?? "The reviewed ledger is materially incomplete.",
    };
  }

  const literalCoverage = validateReviewedTranscriptionLiteralCoverage(
    transcript,
    asset.pageCount,
    sections,
  );
  if (!literalCoverage.valid || missingClaims.length > 0) {
    return {
      status: "literal-coverage-incomplete",
      valid: false,
      ...common,
      error:
        literalCoverage.error ??
        `The reviewed ledger is missing printed claim(s): ${missingClaims.join(", ")}.`,
    };
  }

  return {
    status: "verified",
    valid: true,
    ...common,
    error: null,
  };
}
