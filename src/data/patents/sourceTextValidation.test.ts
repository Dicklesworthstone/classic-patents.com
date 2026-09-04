import { describe, expect, it } from "bun:test";
import {
  normalizeReviewedLedgerText,
  validateReviewedTranscription,
  validateReviewedTranscriptionCoverage,
  validateReviewedTranscriptionEditorialIntegrity,
  validateReviewedTranscriptionLiteralCoverage,
  validateReviewedTranscriptionPageAnchors,
  validateSourcePdfTextLayer,
} from "./sourceTextValidation";

describe("reviewed-ledger literal comparison", () => {
  it("bridges page furniture, column numbers, and discretionary line-break hyphens", () => {
    const ledgerClaim = [
      "--- REVIEWED TRANSCRIPTION PAGE 26 OF 26 ---",
      "17. The circuit redirects the robot when the wall occu-",
      "",
      "10",
      "",
      "15",
      "",
      "pies the region and returns toward the non-",
      "colored marker.",
    ].join("\n");
    const authoredClaim =
      "17. The circuit redirects the robot when the wall occupies the region and returns toward the non-colored marker.";

    expect(normalizeReviewedLedgerText(ledgerClaim)).toBe(
      normalizeReviewedLedgerText(authoredClaim),
    );
  });

  it("bridges a repeated patent-number/page-number header across a source-page split", () => {
    const ledger = [
      "--- REVIEWED TRANSCRIPTION PAGE 1 OF 2 ---",
      "The circuit is laid out on the printed circuit",
      "--- REVIEWED TRANSCRIPTION PAGE 2 OF 2 ---",
      "3,858,581",
      "7",
      "board.",
    ].join("\n");

    expect(normalizeReviewedLedgerText(ledger)).toBe(
      normalizeReviewedLedgerText("The circuit is laid out on the printed circuit board."),
    );
  });

  it("bridges a repeated header after page-bound column furniture", () => {
    const ledger = [
      "--- REVIEWED TRANSCRIPTION PAGE 1 OF 2 ---",
      "The circuit is laid out on the printed circuit",
      "--- REVIEWED TRANSCRIPTION PAGE 2 OF 2 ---",
      "",
      "Column 3",
      "",
      "3,858,581",
      "7",
      "board.",
    ].join("\n");

    expect(normalizeReviewedLedgerText(ledger)).toBe(
      normalizeReviewedLedgerText("The circuit is laid out on the printed circuit board."),
    );
  });

  it("bridges a page-number-first patent header at a source-page split", () => {
    const ledger = [
      "--- REVIEWED TRANSCRIPTION PAGE 1 OF 2 ---",
      "Having thus described my invention, what",
      "--- REVIEWED TRANSCRIPTION PAGE 2 OF 2 ---",
      "2                         233,692",
      "I claim as new, and desire to secure by Letters Patent, is—",
    ].join("\n");

    expect(normalizeReviewedLedgerText(ledger)).toBe(
      normalizeReviewedLedgerText(
        "Having thus described my invention, what I claim as new, and desire to secure by Letters Patent, is—",
      ),
    );
  });

  it("preserves a patent-number citation when it occurs in source prose", () => {
    const ledger = [
      "--- REVIEWED TRANSCRIPTION PAGE 1 OF 1 ---",
      "The cited record is US 3,858,581.",
      "7",
      "The following sentence is still part of the source text.",
    ].join("\n");

    expect(normalizeReviewedLedgerText(ledger)).toBe(
      normalizeReviewedLedgerText(
        "The cited record is US 3,858,581. The following sentence is still part of the source text.",
      ),
    );
  });

  it("does not erase punctuation or ordinary words while normalizing layout noise", () => {
    expect(normalizeReviewedLedgerText("Claim: first field; second field.")).toBe(
      "Claim: first field; second field.",
    );
    expect(normalizeReviewedLedgerText("17. A circuit with 10 conductors.")).toBe(
      "17. A circuit with 10 conductors.",
    );
  });

  it("still rejects a substantive word change after layout normalization", () => {
    const ledger = "17. The circuit redirects the robot when the wall occu-\npies the region.";
    const alteredClaim = "17. The circuit stops the robot when the wall occupies the region.";

    expect(normalizeReviewedLedgerText(ledger)).not.toContain(
      normalizeReviewedLedgerText(alteredClaim),
    );
  });
});

describe("source-PDF text layer validation", () => {
  it("accepts a complete, ordered page ledger", () => {
    expect(
      validateSourcePdfTextLayer(
        "--- SOURCE PDF PAGE 1 OF 2 ---\n\nFirst page\n\n--- SOURCE PDF PAGE 2 OF 2 ---\n\nSecond page",
        2,
      ),
    ).toEqual({ valid: true });
  });

  it("rejects duplicate or missing source pages even when marker count matches", () => {
    const result = validateSourcePdfTextLayer(
      "--- SOURCE PDF PAGE 1 OF 2 ---\n\nFirst page\n\n--- SOURCE PDF PAGE 1 OF 2 ---\n\nDuplicate page",
      2,
    );
    expect(result.valid).toBeFalse();
    expect(result.error).toContain("ledger");
  });

  it("rejects a mismatched declared total", () => {
    const result = validateSourcePdfTextLayer(
      "--- SOURCE PDF PAGE 1 OF 3 ---\n\nFirst page\n\n--- SOURCE PDF PAGE 2 OF 3 ---\n\nSecond page",
      2,
    );
    expect(result.valid).toBeFalse();
    expect(result.error).toContain("ledger");
  });

  it("requires an explicit page ledger for a reviewed transcription", () => {
    expect(
      validateReviewedTranscription(
        "--- REVIEWED TRANSCRIPTION PAGE 1 OF 1 ---\n\nComplete reviewed text",
        1,
      ),
    ).toEqual({ valid: true });
    expect(validateReviewedTranscription("Complete reviewed text", 1).valid).toBeFalse();
  });

  it("rejects blank reviewed source pages", () => {
    const markerOnly = "--- REVIEWED TRANSCRIPTION PAGE 1 OF 1 ---\n";
    expect(validateReviewedTranscription(markerOnly, 1)).toEqual({
      valid: false,
      error: "The reviewed transcription has no reviewed content for source page 1.",
    });

    expect(
      validateReviewedTranscription(
        "--- REVIEWED TRANSCRIPTION PAGE 1 OF 2 ---\n\nFirst page\n\n--- REVIEWED TRANSCRIPTION PAGE 2 OF 2 ---\n",
        2,
      ),
    ).toEqual({
      valid: false,
      error: "The reviewed transcription has no reviewed content for source page 2.",
    });
  });

  it("rejects materially underfilled reviewed ledgers", () => {
    const source = "A complete archival source reading must remain in the ledger.";
    expect(
      validateReviewedTranscriptionCoverage(
        "--- REVIEWED TRANSCRIPTION PAGE 1 OF 1 ---\na",
        1,
        source,
      ),
    ).toEqual({
      valid: false,
      error:
        "The reviewed transcription is materially shorter than the authored source reading; page notes or a partial ledger cannot be published as a complete transcription.",
    });

    expect(
      validateReviewedTranscriptionCoverage(
        `--- REVIEWED TRANSCRIPTION PAGE 1 OF 1 ---\n${source}`,
        1,
        source,
      ),
    ).toEqual({ valid: true });
  });

  it("rejects a same-sized ledger that does not contain the authored source blocks", () => {
    const ledger = [
      "--- REVIEWED TRANSCRIPTION PAGE 1 OF 1 ---",
      "Completely different words with approximately the same total length.",
    ].join("\n");

    expect(
      validateReviewedTranscriptionLiteralCoverage(ledger, 1, [
        "The patented mechanism moves the armature through the magnetic field.",
      ]),
    ).toEqual({
      valid: false,
      error: "The reviewed transcription does not contain authored source section 1.",
    });
  });

  it("accepts literal source blocks across facsimile line and punctuation differences", () => {
    const ledger = [
      "--- REVIEWED TRANSCRIPTION PAGE 1 OF 1 ---",
      "The patented mechanism moves the arma-",
      "ture through the magnetic field.",
    ].join("\n");

    expect(
      validateReviewedTranscriptionLiteralCoverage(ledger, 1, [
        "The patented mechanism moves the armature through the magnetic field",
      ]),
    ).toEqual({ valid: true });
  });

  it("rejects editorial drawing and specification summaries in a reviewed ledger", () => {
    for (const summary of [
      "--- SOURCE PDF PAGE 1 OF 1 ---",
      "[Drawing Sheet 1: Figures 1-6]",
      "[Facsimile drawing; visible printed labels include A, B, and C.]",
      "[EDITORIAL FACSIMILE NOTE (not source text): visible labels include A and B.]",
      "[EDITORIAL DRAWING-SHEET SUMMARY—NOT SOURCE TRANSCRIPTION: Figures 1-4.]",
      "[ONLINE-TEXT RECONCILIATION - NOT VISUAL FACSIMILE ACCEPTANCE]",
      "[Sole source drawing sheet showing diagrammatic apparatus.]",
      "Drawing sheet 2 of 3. Figures 7-10.",
      "Visible labels: 10, 10a, 10b, N, P, and N OR P.",
      "Printed figures: Fig. 1, Fig. 2, and Fig. 3.",
      "Specification page 18: Claims 1 through 15.",
      "MANUAL CLOUD RECONCILIATION (supersedes the inherited two-column draft below)",
      "STATUS: WITHHELD WIP — editorial drawing-label inventory only.",
      "UNPUBLISHED WORKING LEDGER — facsimile reconciliation is incomplete.",
      "UNRESOLVED GLYPHS: the small drawing numerals are not legible in the cloud source.",
      "UNRECONCILED SOURCE DRAFT - DO NOT PUBLISH",
      "Specification columns 3 and 4: Comprehensive technical disclosure",
    ]) {
      expect(
        validateReviewedTranscriptionEditorialIntegrity(
          `--- REVIEWED TRANSCRIPTION PAGE 1 OF 1 ---\n\n${summary}`,
          1,
        ),
      ).toEqual({
        valid: false,
        error: expect.stringContaining("substitutes editorial or unresolved material"),
      });
    }
  });

  it("accepts literal drawing-sheet text and the explicit blank-page receipt", () => {
    expect(
      validateReviewedTranscriptionEditorialIntegrity(
        [
          "--- REVIEWED TRANSCRIPTION PAGE 1 OF 2 ---",
          "",
          "C. M. HALL. PROCESS OF REDUCING ALUMINIUM BY ELECTROLYSIS.",
          "Fig. 1. A A' B C D P N.",
          "",
          "--- REVIEWED TRANSCRIPTION PAGE 2 OF 2 ---",
          "",
          "[BLANK FACSIMILE PAGE: no printed content]",
        ].join("\n"),
        2,
      ),
    ).toEqual({ valid: true });
  });

  it("rejects content before a source or reviewed page-one marker", () => {
    const source = validateSourcePdfTextLayer(
      "Editorial preface\n\n--- SOURCE PDF PAGE 1 OF 1 ---\n\nSource text",
      1,
    );
    const reviewed = validateReviewedTranscription(
      "Editorial preface\n\n--- REVIEWED TRANSCRIPTION PAGE 1 OF 1 ---\n\nReviewed text",
      1,
    );

    expect(source.valid).toBeFalse();
    expect(source.error).toContain("begin");
    expect(reviewed.valid).toBeFalse();
    expect(reviewed.error).toContain("begin");
  });

  it("rejects a visually authored anchor when its ledger page has shifted", () => {
    const shiftedLedger = [
      "--- REVIEWED TRANSCRIPTION PAGE 1 OF 2 ---",
      "",
      "2 Sheets-Sheet 1",
      "",
      "--- REVIEWED TRANSCRIPTION PAGE 2 OF 2 ---",
      "",
      "UNITED STATES PATENT OFFICE.",
    ].join("\n");

    expect(
      validateReviewedTranscriptionPageAnchors(shiftedLedger, 2, [
        {
          page: 1,
          exactSourceText: "UNITED STATES PATENT OFFICE.",
          sourceRelationship: "Patent-office masthead and opening specification.",
        },
        {
          page: 2,
          exactSourceText: "2 Sheets-Sheet 1",
          sourceRelationship: "Printed drawing sheet 1 of 1.",
        },
      ]),
    ).toEqual({
      valid: false,
      error: "The reviewed transcription source page 1 does not contain its exact-source anchor.",
    });
  });

  it("accepts a complete, manually anchored reviewed ledger", () => {
    const ledger = [
      "--- REVIEWED TRANSCRIPTION PAGE 1 OF 2 ---",
      "",
      "2 Sheets-Sheet 1",
      "",
      "--- REVIEWED TRANSCRIPTION PAGE 2 OF 2 ---",
      "",
      "UNITED STATES PATENT OFFICE.",
    ].join("\n");

    expect(
      validateReviewedTranscriptionPageAnchors(ledger, 2, [
        {
          page: 1,
          exactSourceText: "2 Sheets-Sheet 1",
          sourceRelationship: "Printed drawing sheet 1 of 1.",
        },
        {
          page: 2,
          exactSourceText: "UNITED STATES PATENT OFFICE.",
          sourceRelationship: "Patent-office masthead and opening specification.",
        },
      ]),
    ).toEqual({ valid: true });
  });

  it("permits a visually verified blank facsimile page only with its explicit receipt", () => {
    const ledger = [
      "--- REVIEWED TRANSCRIPTION PAGE 1 OF 2 ---",
      "",
      "UNITED STATES PATENT OFFICE.",
      "",
      "--- REVIEWED TRANSCRIPTION PAGE 2 OF 2 ---",
      "",
      "[BLANK FACSIMILE PAGE: no printed content]",
    ].join("\n");
    const anchors = [
      {
        page: 1,
        exactSourceText: "UNITED STATES PATENT OFFICE.",
        sourceRelationship: "Patent-office masthead.",
      },
      {
        page: 2,
        isBlank: true as const,
        sourceRelationship: "Visually reviewed blank trailing source page.",
      },
    ];

    expect(validateReviewedTranscriptionPageAnchors(ledger, 2, anchors)).toEqual({ valid: true });
    expect(
      validateReviewedTranscriptionPageAnchors(
        ledger.replace("[BLANK FACSIMILE PAGE: no printed content]", "Editorial placeholder"),
        2,
        anchors,
      ),
    ).toEqual({
      valid: false,
      error:
        "The reviewed transcription source page 2 is declared blank but does not contain only the blank-page receipt.",
    });
  });
});
