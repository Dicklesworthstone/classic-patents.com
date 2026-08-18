const SOURCE_PAGE_MARKER = /^--- SOURCE PDF PAGE (\d+) OF (\d+) ---$/gm;
const REVIEWED_PAGE_MARKER = /^--- REVIEWED TRANSCRIPTION PAGE (\d+) OF (\d+) ---$/gm;

export interface SourceTextValidationResult {
  valid: boolean;
  error?: string;
}

const reviewedMarkerPattern = new RegExp(REVIEWED_PAGE_MARKER.source, REVIEWED_PAGE_MARKER.flags);

function normalizedLength(value: string): number {
  return value.replace(/[^\p{L}\p{N}]+/gu, "").length;
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
  );
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
