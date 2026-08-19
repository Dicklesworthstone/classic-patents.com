import { describe, expect, test } from "bun:test";
import { parsePatentCatalog, patentSchema } from "./schema";
import { wrightFlyerPatent } from "./wright-flyer";

describe("Patent Zod Schema & Catalog Parser", () => {
  test("successfully validates the Wright Flyer reference patent", () => {
    const parsed = patentSchema.safeParse(wrightFlyerPatent);
    expect(parsed.success).toBe(true);

    const catalog = parsePatentCatalog([wrightFlyerPatent]);
    expect(catalog.length).toBe(1);
    expect(catalog[0].id).toBe("us-821393-wright-flyer");
  });

  test("rejects invalid ISO dates (e.g. February 30 or bad formatting)", () => {
    const invalidDatePatent = {
      ...wrightFlyerPatent,
      grantDate: "1906-02-30",
    };

    const parsed = patentSchema.safeParse(invalidDatePatent);
    expect(parsed.success).toBe(false);
  });

  test("rejects filing dates that occur after grant date", () => {
    const anachronisticPatent = {
      ...wrightFlyerPatent,
      filingDate: "1910-01-01",
      grantDate: "1906-05-22",
    };

    expect(() => parsePatentCatalog([anachronisticPatent])).toThrow(
      "filingDate is after grantDate",
    );
  });

  test("rejects zero claims unless explicit no-formal-claims-in-facsimile attestation is set", () => {
    const noClaimsPatent = {
      ...wrightFlyerPatent,
      claims: [],
      archivalEdition: undefined,
    };

    const parsed = patentSchema.safeParse(noClaimsPatent);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.some((issue) => issue.path.includes("claims"))).toBe(true);
    }
  });

  test("rejects claims when no-formal-claims-in-facsimile attestation is active", () => {
    const conflictingPatent = {
      ...wrightFlyerPatent,
      claims: wrightFlyerPatent.claims,
      archivalEdition: wrightFlyerPatent.archivalEdition
        ? {
            ...wrightFlyerPatent.archivalEdition,
            claimStatus: {
              kind: "no-formal-claims-in-facsimile" as const,
              evidence: "Facsimile has no formal claims",
            },
          }
        : undefined,
    };

    const parsed = patentSchema.safeParse(conflictingPatent);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.some((issue) => issue.message.includes("claims conflict"))).toBe(
        true,
      );
    }
  });

  test("rejects empty patent titles, missing summaries, and malformed URLs", () => {
    const emptyTitlePatent = {
      ...wrightFlyerPatent,
      title: "",
      googlePatentsUrl: "not-a-valid-url",
    };

    const parsed = patentSchema.safeParse(emptyTitlePatent);
    expect(parsed.success).toBe(false);
  });
});
