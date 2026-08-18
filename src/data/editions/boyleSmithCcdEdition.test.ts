import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { boyleSmithCcdPatent } from "@/data/patents/boyle-smith-ccd";
import {
  boyleSmithCcdArchivalEdition,
  boyleSmithCcdClaimTexts,
  boyleSmithCcdFigureSheets,
} from "./boyleSmithCcdEdition";

describe("boyleSmithCcdArchivalEdition", () => {
  test("pins the reviewed US 3,858,232 facsimile with explicit source nodes", () => {
    expect(validateCuratedSpecificationEdition(boyleSmithCcdArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(boyleSmithCcdArchivalEdition.sourcePdfSha256).toBe(
      "769ab5a1dc91d51bfeebea53b082de4d9b712deb41c096cdac41aae4d3142ec2",
    );
    expect(boyleSmithCcdArchivalEdition.completeFacsimileReviewed).toBe(true);
  });

  test("corrects identity and preserves every printed claim", () => {
    expect(boyleSmithCcdPatent.id).toBe("us-3858232-boyle-smith-ccd");
    expect(boyleSmithCcdPatent.patentNumber).toBe("US 3,858,232");
    expect(boyleSmithCcdPatent.title).toBe("Information Storage Devices");
    expect(boyleSmithCcdPatent.originalPdfUrl).toBe("/patents/pdfs/us-3858232-boyle-smith-ccd.pdf");
    expect(boyleSmithCcdPatent.claims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 32 }, (_, index) => index + 1),
    );
    expect(boyleSmithCcdClaimTexts).toHaveLength(32);
    expect(boyleSmithCcdPatent.stats).toMatchObject({
      totalClaims: 32,
      independentClaims: 7,
    });
  });

  test("provides a local source crop and preview for every printed figure", () => {
    expect(boyleSmithCcdFigureSheets).toHaveLength(22);
    for (const [id] of boyleSmithCcdFigureSheets) {
      for (const suffix of ["", "-preview"]) {
        const file = `us-3858232-boyle-smith-ccd-fig-${id}${suffix}.png`;
        expect(existsSync(resolve(process.cwd(), "public/patents/figures", file))).toBe(true);
      }
    }
  });
});
