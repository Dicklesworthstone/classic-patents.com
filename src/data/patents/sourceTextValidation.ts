import type { ReviewedTranscriptionPageAnchor } from "@/types/patent";

const SOURCE_PAGE_MARKER = /^--- SOURCE PDF PAGE (\d+) OF (\d+) ---$/gm;
const REVIEWED_PAGE_MARKER = /^--- REVIEWED TRANSCRIPTION PAGE (\d+) OF (\d+) ---$/gm;
/**
 * A repeated patent-number/page-number pair printed immediately after a
 * reviewed-page marker, optionally after the ledger's own `Column N` line.
 * Keeping the marker in this pattern matters: a patent citation followed by a
 * standalone number can be actual source prose in the middle of a ledger
 * page, whereas this position is page furniture.
 */
const REVIEWED_PATENT_PAGE_HEADER_AFTER_MARKER =
  /^(--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---[^\S\r\n]*\r?\n(?:(?:[^\S\r\n]*|[^\S\r\n]*Column \d+[^\S\r\n]*)\r?\n)*)[^\S\r\n]*(?:US\s+)?\d{1,3}(?:,\d{3})+(?:\s+[A-Z]\d?)?[^\S\r\n]*\r?\n[^\S\r\n]*\d+[^\S\r\n]*$/gim;
const REVIEWED_BLANK_FACSIMILE_PAGE = "[BLANK FACSIMILE PAGE: no printed content]";

const REVIEWED_EDITORIAL_SUMMARY_PATTERNS: readonly RegExp[] = [
  /^--- SOURCE PDF PAGE \d+ OF \d+ ---$/gim,
  /^\s*\[(?:drawing(?:\s+(?:sheet|plate))?|facsimile drawing|figures?|figure plate|enrolled drawing|original drawing|restored drawing|sole source drawing|editorial facsimile note|editorial drawing|(?:end\s+)?online-text reconciliation)\b[^\]]*\]\s*$/gim,
  /^\s*drawing sheet\s+\d+(?:\s+of\s+\d+)?(?:\s+contains|\s*[.:])/gim,
  /^\s*(?:visible labels|printed figures)\s*:/gim,
  /^\s*specification page\s+\d+\s*:/gim,
  /^\s*manual cloud reconciliation\b.*$/gim,
  /^\s*status:\s*withheld wip\b.*$/gim,
  /^\s*unpublished working ledger\b.*$/gim,
  /^\s*unresolved glyphs\s*:.*$/gim,
  /^\s*(?:inherited|unreconciled)\b.*\bdraft\b.*$/gim,
  /\bspecification\s+columns?\s+\d+(?:\s*(?:and|-)\s*\d+)?\s*:\s*(?:detailed descriptions?|comprehensive technical disclosure)\b/gim,
];

export interface SourceTextValidationResult {
  valid: boolean;
  error?: string;
}

const reviewedMarkerPattern = new RegExp(REVIEWED_PAGE_MARKER.source, REVIEWED_PAGE_MARKER.flags);

function normalizedLength(value: string): number {
  return value.replace(/[^\p{L}\p{N}]+/gu, "").length;
}

export function normalizeLiteralSourceText(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("en-US")
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

/**
 * Normalizes a reviewed page ledger for literal claim comparison without
 * treating facsimile typography as claim text. Patent scans commonly insert
 * page markers, column-line numbers, and discretionary end-of-line hyphens in
 * the middle of a printed claim. Those artifacts must not make an otherwise
 * present claim look absent. Intra-word hyphens are ignored on both sides
 * because a line-ending hyphen cannot reliably distinguish a compound word
 * from typesetter continuation.
 */
export function normalizeReviewedLedgerText(value: string): string {
  return value
    .replace(REVIEWED_PATENT_PAGE_HEADER_AFTER_MARKER, "$1")
    .replace(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---/g, "")
    .replace(/^\s*Column \d+\s*$/gim, "")
    .replace(/^\s*\d+\s*$/gm, "")
    .replace(/([\p{L}])-\s+([\p{Ll}])/gu, "$1$2")
    .replace(/([\p{L}])-(?=[\p{L}])/gu, "$1")
    .replace(/\s+/g, " ")
    .trim();
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
 * Rejects editorial descriptions and unresolved-glyph notices that stand in
 * for words or drawing matter printed on the facsimile. A reviewed ledger may
 * contain an explicit receipt for a visually confirmed blank page, but it may
 * not replace a nonblank page with prose such as "[Drawing Sheet: Figures
 * 1-6]", "Specification page 18: Claims 1-15", or "UNRESOLVED GLYPHS".
 * Those placeholders describe the source instead of transcribing it and
 * previously allowed two matching abridgements to certify one another as
 * complete.
 */
export function validateReviewedTranscriptionEditorialIntegrity(
  text: string,
  expectedPageCount: number,
): SourceTextValidationResult {
  const ledger = validateReviewedTranscription(text, expectedPageCount);
  if (!ledger.valid) return ledger;

  for (const pattern of REVIEWED_EDITORIAL_SUMMARY_PATTERNS) {
    pattern.lastIndex = 0;
    const match = pattern.exec(text);
    if (match) {
      const summary = normalizeAnchorText(match[0]);
      return {
        valid: false,
        error: `The reviewed transcription substitutes editorial or unresolved material for facsimile content: ${summary}`,
      };
    }
  }

  return { valid: true };
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

  const markers = [
    ...text.matchAll(new RegExp(REVIEWED_PAGE_MARKER.source, REVIEWED_PAGE_MARKER.flags)),
  ];
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

/**
 * Proves that the visitor-facing literal blocks are present in the reviewed
 * ledger, rather than merely comparing the sizes of two unrelated texts.
 * Whitespace, line wrapping, and punctuation are ignored because historical
 * facsimiles routinely split words and clauses across columns or PDF pages;
 * the ordered letters and numbers must still agree.
 */
export function validateReviewedTranscriptionLiteralCoverage(
  text: string,
  expectedPageCount: number,
  authoredSections: readonly string[],
): SourceTextValidationResult {
  const ledger = validateReviewedTranscription(text, expectedPageCount);
  if (!ledger.valid) return ledger;

  const normalizedLedger = normalizeLiteralSourceText(normalizeReviewedLedgerText(text));
  for (const [index, section] of authoredSections.entries()) {
    const normalizedSection = normalizeLiteralSourceText(section);
    if (!normalizedSection) {
      return {
        valid: false,
        error: `The authored source section ${index + 1} is empty.`,
      };
    }
    if (!normalizedLedger.includes(normalizedSection)) {
      return {
        valid: false,
        error: `The reviewed transcription does not contain authored source section ${index + 1}.`,
      };
    }
  }

  return { valid: true };
}
