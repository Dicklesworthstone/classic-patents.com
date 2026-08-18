const SOURCE_PAGE_MARKER = /^--- SOURCE PDF PAGE (\d+) OF (\d+) ---$/gm;
const REVIEWED_PAGE_MARKER = /^--- REVIEWED TRANSCRIPTION PAGE (\d+) OF (\d+) ---$/gm;

export interface SourceTextValidationResult {
  valid: boolean;
  error?: string;
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
