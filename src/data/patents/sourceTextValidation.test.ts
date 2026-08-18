import { describe, expect, it } from "bun:test";
import { validateSourcePdfTextLayer } from "./sourceTextValidation";

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
});
