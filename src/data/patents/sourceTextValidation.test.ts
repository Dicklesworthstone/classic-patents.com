import { describe, expect, it } from "bun:test";
import { validateReviewedTranscription, validateSourcePdfTextLayer } from "./sourceTextValidation";

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
});
