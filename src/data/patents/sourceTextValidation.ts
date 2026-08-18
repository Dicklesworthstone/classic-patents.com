const SOURCE_PAGE_MARKER = /^--- SOURCE PDF PAGE (\d+) OF (\d+) ---$/gm;

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
export function validateSourcePdfTextLayer(
  text: string,
  expectedPageCount: number,
): SourceTextValidationResult {
  if (!Number.isSafeInteger(expectedPageCount) || expectedPageCount < 1) {
    return { valid: false, error: "The catalogue has an invalid source page count." };
  }

  const markers = [...text.matchAll(SOURCE_PAGE_MARKER)];
  if (markers.length !== expectedPageCount) {
    return {
      valid: false,
      error: `The source-text asset has ${markers.length} page marker(s), expected ${expectedPageCount}.`,
    };
  }

  if (markers[0]?.index !== 0) {
    return {
      valid: false,
      error: "The source-text asset does not begin with its first source-page marker.",
    };
  }

  for (const [index, marker] of markers.entries()) {
    const pageNumber = Number.parseInt(marker[1] ?? "", 10);
    const declaredTotal = Number.parseInt(marker[2] ?? "", 10);
    if (pageNumber !== index + 1 || declaredTotal !== expectedPageCount) {
      return {
        valid: false,
        error: `The source-text page ledger is invalid at marker ${index + 1}; expected page ${index + 1} of ${expectedPageCount}.`,
      };
    }
  }

  return { valid: true };
}
