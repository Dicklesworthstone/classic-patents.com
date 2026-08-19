import { describe, expect, it } from "bun:test";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionCoverage,
  validateReviewedTranscriptionPageAnchors,
  validateSourcePdfTextLayer,
} from "./sourceTextValidation";

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
