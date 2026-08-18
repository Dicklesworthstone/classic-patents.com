import { describe, expect, test } from "bun:test";
import type { CuratedSpecificationEdition } from "@/types/patent";
import { validateCuratedSpecificationEdition } from "./archivalEditionValidation";

function validEdition(): CuratedSpecificationEdition {
  return {
    kind: "manual-react-edition",
    sourcePdfSha256: "a".repeat(64),
    preparedBy: "Classic Patents editorial agent",
    preparedAt: "2026-08-17",
    completeFacsimileReviewed: true,
    blocks: [
      { kind: "masthead", lines: ["UNITED STATES PATENT OFFICE", "EXAMPLE PATENT"] },
      {
        kind: "paragraph",
        inlines: [
          { kind: "text", text: "Be it known that this is an authored archival edition. " },
          {
            kind: "term",
            text: "aeroplane",
            definition: "A historical term for a lifting wing surface.",
          },
        ],
      },
      {
        kind: "claim",
        number: 1,
        inlines: [{ kind: "text", text: "A machine substantially as described." }],
      },
    ],
  };
}

describe("validateCuratedSpecificationEdition", () => {
  test("accepts a complete continuous authored edition", () => {
    expect(validateCuratedSpecificationEdition(validEdition())).toEqual({
      valid: true,
      errors: [],
    });
  });

  test("rejects missing provenance and a missing full-facsimile attestation", () => {
    const edition = validEdition();
    edition.sourcePdfSha256 = "not-a-digest";
    edition.completeFacsimileReviewed = false as true;

    const result = validateCuratedSpecificationEdition(edition);
    expect(result.valid).toBe(false);
    expect(result.errors.join("\n")).toContain("SHA-256");
    expect(result.errors.join("\n")).toContain("full-facsimile review attestation");
  });

  test("rejects duplicate claims and malformed authored table rows", () => {
    const edition = validEdition();
    edition.blocks.push({
      kind: "claim",
      number: 1,
      inlines: [{ kind: "text", text: "A duplicate claim." }],
    });
    edition.blocks.push({
      kind: "table",
      headers: [[{ kind: "text", text: "One" }], [{ kind: "text", text: "Two" }]],
      rows: [[[{ kind: "text", text: "Only one cell" }]]],
    });

    const result = validateCuratedSpecificationEdition(edition);
    expect(result.valid).toBe(false);
    expect(result.errors.join("\n")).toContain("duplicates claim 1");
    expect(result.errors.join("\n")).toContain("has 1 cells, expected 2");
  });

  test("permits zero claim blocks only with explicit reviewed-facsimile evidence", () => {
    const edition = validEdition();
    edition.blocks = edition.blocks.filter((block) => block.kind !== "claim");
    edition.claimStatus = {
      kind: "no-formal-claims-in-facsimile",
      evidence:
        "The complete reviewed facsimile presents description, drawings, and signatures but no separately numbered claim clause.",
    };

    expect(validateCuratedSpecificationEdition(edition)).toEqual({ valid: true, errors: [] });
  });

  test("rejects a bare zero-claim edition and contradictory claim status", () => {
    const missingEvidence = validEdition();
    missingEvidence.blocks = missingEvidence.blocks.filter((block) => block.kind !== "claim");
    expect(validateCuratedSpecificationEdition(missingEvidence).errors.join("\n")).toContain(
      "explicit no-formal-claims attestation",
    );

    const contradictory = validEdition();
    contradictory.claimStatus = {
      kind: "no-formal-claims-in-facsimile",
      evidence: "The source has no numbered claims.",
    };
    expect(validateCuratedSpecificationEdition(contradictory).errors.join("\n")).toContain(
      "cannot contain claim blocks",
    );
  });

  test("validates drawingStatus evidence when present", () => {
    const edition = validEdition();
    edition.drawingStatus = {
      kind: "no-drawings-in-facsimile",
      evidence:
        "The historical Letters Patent grant is a continuous text-only instrument without drawing sheets.",
    };
    expect(validateCuratedSpecificationEdition(edition)).toEqual({ valid: true, errors: [] });

    const emptyEvidence = validEdition();
    emptyEvidence.drawingStatus = {
      kind: "no-drawings-in-facsimile",
      evidence: "   ",
    };
    expect(validateCuratedSpecificationEdition(emptyEvidence).errors.join("\n")).toContain(
      "A no-drawings edition must state its facsimile evidence.",
    );
  });
});
