import type { ReviewedTranscriptionPageAnchor } from "@/types/patent";

const SOURCE_PAGE_MARKER = /^--- SOURCE PDF PAGE (\d+) OF (\d+) ---$/gm;
const REVIEWED_PAGE_MARKER = /^--- REVIEWED TRANSCRIPTION PAGE (\d+) OF (\d+) ---$/gm;
const REVIEWED_BLANK_FACSIMILE_PAGE = "[BLANK FACSIMILE PAGE: no printed content]";

export interface SourceTextValidationResult {
  valid: boolean;
  error?: string;
}

const reviewedMarkerPattern = new RegExp(REVIEWED_PAGE_MARKER.source, REVIEWED_PAGE_MARKER.flags);

function normalizedLength(value: string): number {
  return value.replace(/[^\p{L}\p{N}]+/gu, "").length;
}

function normalizeAnchorText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * Verifies the page ledger emitted by generate-pdf-text-transcripts.ts.
 *
 * This deliberately validates the complete, ordered sequence rather than
 * merely counting marker-looking lines. A count alone would accept a
 * duplicated, missing, or incorrectly totalled source page.
 */
function validatePageLedger(
  text: string,
  expectedPageCount: number,
  markerPattern: RegExp,
  label: string,
  requirePageContent = false,
): SourceTextValidationResult {
  if (!Number.isSafeInteger(expectedPageCount) || expectedPageCount < 1) {
    return { valid: false, error: "The catalogue has an invalid source page count." };
  }

  const markers = [...text.matchAll(markerPattern)];
  if (markers.length !== expectedPageCount) {
    return {
      valid: false,
      error: `The ${label} has ${markers.length} page marker(s), expected ${expectedPageCount}.`,
    };
  }

  if (markers[0]?.index !== 0) {
    return {
      valid: false,
      error: `The ${label} does not begin with its first page marker.`,
    };
  }

  for (const [index, marker] of markers.entries()) {
    const pageNumber = Number.parseInt(marker[1] ?? "", 10);
    const declaredTotal = Number.parseInt(marker[2] ?? "", 10);
    if (pageNumber !== index + 1 || declaredTotal !== expectedPageCount) {
      return {
        valid: false,
        error: `The ${label} page ledger is invalid at marker ${index + 1}; expected page ${index + 1} of ${expectedPageCount}.`,
      };
    }
  }

  if (requirePageContent) {
    for (const [index, marker] of markers.entries()) {
      const start = (marker.index ?? 0) + marker[0].length;
      const end = markers[index + 1]?.index ?? text.length;
      if (normalizedLength(text.slice(start, end)) === 0) {
        return {
          valid: false,
          error: `The ${label} has no reviewed content for source page ${index + 1}.`,
        };
      }
    }
  }

  return { valid: true };
}

export function validateSourcePdfTextLayer(
  text: string,
  expectedPageCount: number,
): SourceTextValidationResult {
  return validatePageLedger(text, expectedPageCount, SOURCE_PAGE_MARKER, "source-text asset");
}

export function validateReviewedTranscription(
  text: string,
  expectedPageCount: number,
): SourceTextValidationResult {
  return validatePageLedger(
    text,
    expectedPageCount,
    REVIEWED_PAGE_MARKER,
    "reviewed transcription",
    true,
  );
}

/**
 * Validates optional, manually authored facsimile-page anchors.
 *
 * A PDF scan cannot establish editorial fidelity by itself: text extraction
 * is research evidence, not source truth. The editor therefore records a
 * literal phrase seen during visual review and the page's source role. This
 * gate makes that evidence executable by requiring the phrase to appear under
 * the corresponding ledger marker. It catches page shifts without turning
 * OCR or the PDF text layer into an authority.
 */
export function validateReviewedTranscriptionPageAnchors(
  text: string,
  expectedPageCount: number,
  anchors: readonly ReviewedTranscriptionPageAnchor[] | undefined,
): SourceTextValidationResult {
  const ledger = validateReviewedTranscription(text, expectedPageCount);
  if (!ledger.valid) return ledger;

  if (!anchors) {
    return {
      valid: false,
      error: "The reviewed transcription has no manually authored facsimile page anchors.",
    };
  }
  if (anchors.length !== expectedPageCount) {
    return {
      valid: false,
      error: `The reviewed transcription has ${anchors.length} page anchor(s), expected ${expectedPageCount}.`,
    };
  }

  const markers = [...text.matchAll(reviewedMarkerPattern)];
  for (const [index, anchor] of anchors.entries()) {
    const expectedPage = index + 1;
    if (!Number.isSafeInteger(anchor.page) || anchor.page !== expectedPage) {
      return {
        valid: false,
        error: `The reviewed transcription page-anchor ledger is invalid at anchor ${expectedPage}; expected source page ${expectedPage}.`,
      };
    }

    if (!anchor.sourceRelationship.trim()) {
      return {
        valid: false,
        error: `The reviewed transcription source page ${expectedPage} has no source-page relationship.`,
      };
    }

    const marker = markers[index];
    const start = (marker?.index ?? 0) + (marker?.[0].length ?? 0);
    const end = markers[index + 1]?.index ?? text.length;
    const ledgerPage = normalizeAnchorText(text.slice(start, end));
    if (anchor.isBlank) {
      if (ledgerPage !== REVIEWED_BLANK_FACSIMILE_PAGE) {
        return {
          valid: false,
          error: `The reviewed transcription source page ${expectedPage} is declared blank but does not contain only the blank-page receipt.`,
        };
      }
      continue;
    }

    const phrase = normalizeAnchorText(anchor.exactSourceText);
    if (!phrase) {
      return {
        valid: false,
        error: `The reviewed transcription source page ${expectedPage} has an empty exact-source anchor.`,
      };
    }
    if (!ledgerPage.includes(phrase)) {
      return {
        valid: false,
        error: `The reviewed transcription source page ${expectedPage} does not contain its exact-source anchor.`,
      };
    }
  }

  return { valid: true };
}

/**
 * Checks that the reviewed ledger contains enough substantive source text to
 * be a transcription, rather than a page-marker receipt or a set of notes.
 * Patent-local tests still prove exact paragraph and claim parity.
 */
export function validateReviewedTranscriptionCoverage(
  text: string,
  expectedPageCount: number,
  authoredSourceText: string,
): SourceTextValidationResult {
  const ledger = validateReviewedTranscription(text, expectedPageCount);
  if (!ledger.valid) return ledger;

  const authoredLength = normalizedLength(authoredSourceText);
  if (authoredLength === 0) {
    return { valid: false, error: "The authored source reading is empty." };
  }

  const ledgerLength = normalizedLength(text.replace(reviewedMarkerPattern, ""));
  if (ledgerLength < authoredLength * 0.85) {
    return {
      valid: false,
      error:
        "The reviewed transcription is materially shorter than the authored source reading; page notes or a partial ledger cannot be published as a complete transcription.",
    };
  }

  return { valid: true };
}
