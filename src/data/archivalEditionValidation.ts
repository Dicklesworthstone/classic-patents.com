import type {
  CuratedSpecificationBlock,
  CuratedSpecificationEdition,
  CuratedSpecificationInlines,
} from "@/types/patent";

export interface ArchivalEditionValidationResult {
  valid: boolean;
  errors: string[];
}

const SHA_256_HEX = /^[a-f0-9]{64}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isRealIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validateInlines(
  inlines: CuratedSpecificationInlines,
  location: string,
  errors: string[],
): void {
  if (inlines.length === 0) {
    errors.push(`${location} must contain at least one authored inline node.`);
    return;
  }

  for (const [index, inline] of inlines.entries()) {
    const inlineLocation = `${location} inline ${index + 1}`;
    if (!inline.text.trim()) errors.push(`${inlineLocation} has empty text.`);
    if (inline.kind === "term" && !inline.definition.trim()) {
      errors.push(`${inlineLocation} has an empty authored term definition.`);
    }
    if (inline.kind === "reference") {
      if (!inline.href.trim())
        errors.push(`${inlineLocation} has an empty authored reference URL.`);
      if (!inline.label.trim()) {
        errors.push(`${inlineLocation} has an empty authored reference label.`);
      }
    }
  }
}

function validateBlock(
  block: CuratedSpecificationBlock,
  index: number,
  claimNumbers: Set<number>,
  errors: string[],
): void {
  const location = `Block ${index + 1} (${block.kind})`;
  switch (block.kind) {
    case "masthead":
      if (block.lines.length === 0 || block.lines.some((line) => !line.trim())) {
        errors.push(`${location} must have only non-empty authored lines.`);
      }
      return;
    case "heading":
      if (!block.text.trim()) errors.push(`${location} has empty text.`);
      return;
    case "paragraph":
      validateInlines(block.inlines, location, errors);
      return;
    case "claim":
      if (!Number.isSafeInteger(block.number) || block.number < 1) {
        errors.push(`${location} has an invalid claim number.`);
      } else if (claimNumbers.has(block.number)) {
        errors.push(`${location} duplicates claim ${block.number}.`);
      } else {
        claimNumbers.add(block.number);
      }
      validateInlines(block.inlines, location, errors);
      return;
    case "figure-sheet":
      if (!block.figureLabel.trim()) errors.push(`${location} has an empty figure label.`);
      validateInlines(block.description, location, errors);
      return;
    case "table":
      if (block.headers.length === 0) {
        errors.push(`${location} has no authored table headers.`);
      }
      for (const [headerIndex, header] of block.headers.entries()) {
        validateInlines(header, `${location} header ${headerIndex + 1}`, errors);
      }
      if (block.rows.length === 0) errors.push(`${location} has no authored table rows.`);
      for (const [rowIndex, row] of block.rows.entries()) {
        if (row.length !== block.headers.length) {
          errors.push(
            `${location} row ${rowIndex + 1} has ${row.length} cells, expected ${block.headers.length}.`,
          );
        }
        for (const [cellIndex, cell] of row.entries()) {
          validateInlines(cell, `${location} row ${rowIndex + 1} cell ${cellIndex + 1}`, errors);
        }
      }
      return;
    case "equation":
      if (!block.text.trim()) errors.push(`${location} has empty text.`);
      return;
  }
}

/**
 * Validates the authored document contract, independently from Zod's runtime
 * shape parsing. It contains no OCR heuristics and intentionally knows nothing
 * about PDF page boundaries: the public edition is continuous prose.
 */
export function validateCuratedSpecificationEdition(
  edition: CuratedSpecificationEdition,
): ArchivalEditionValidationResult {
  const errors: string[] = [];

  if (edition.kind !== "manual-react-edition") {
    errors.push("The archival edition must be an explicitly manual React edition.");
  }
  if (!SHA_256_HEX.test(edition.sourcePdfSha256)) {
    errors.push("The archival edition must pin a lowercase SHA-256 source-PDF digest.");
  }
  if (!edition.preparedBy.trim()) errors.push("The archival edition must name its preparer.");
  if (!isRealIsoDate(edition.preparedAt)) {
    errors.push("The archival edition must have a real YYYY-MM-DD preparation date.");
  }
  if (edition.completeFacsimileReviewed !== true) {
    errors.push("The archival edition lacks an explicit full-facsimile review attestation.");
  }
  if (edition.blocks.length === 0) {
    errors.push("The archival edition must contain authored document blocks.");
  }

  const claimNumbers = new Set<number>();
  let mastheadCount = 0;
  let paragraphCount = 0;
  for (const [index, block] of edition.blocks.entries()) {
    if (block.kind === "masthead") mastheadCount++;
    if (block.kind === "paragraph") paragraphCount++;
    validateBlock(block, index, claimNumbers, errors);
  }

  if (mastheadCount !== 1) {
    errors.push(`The archival edition must have exactly one masthead, found ${mastheadCount}.`);
  }
  if (paragraphCount === 0) errors.push("The archival edition must include descriptive prose.");
  if (claimNumbers.size === 0) errors.push("The archival edition must include at least one claim.");

  return { valid: errors.length === 0, errors };
}
