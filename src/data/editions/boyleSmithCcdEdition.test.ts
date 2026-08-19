import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { boyleSmithCcdPatent } from "@/data/patents/boyle-smith-ccd";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  boyleSmithCcdArchivalEdition,
  boyleSmithCcdClaimText,
  boyleSmithCcdClaimTexts,
  boyleSmithCcdFigureSheets,
  boyleSmithCcdParallelReadings,
} from "./boyleSmithCcdEdition";

describe("boyleSmithCcdArchivalEdition", () => {
  test("pins the US 3,858,232 facsimile while keeping the unready manuscript unserved", () => {
    expect(boyleSmithCcdPatent.archivalEdition).toBeUndefined();
    expect(boyleSmithCcdPatent.originalTextAsset).toBeUndefined();
    expect(validateCuratedSpecificationEdition(boyleSmithCcdArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(boyleSmithCcdArchivalEdition.sourcePdfSha256).toBe(
      "769ab5a1dc91d51bfeebea53b082de4d9b712deb41c096cdac41aae4d3142ec2",
    );
    const pdf = readFileSync(`${process.cwd()}/public${boyleSmithCcdPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      boyleSmithCcdArchivalEdition.sourcePdfSha256,
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
    for (const claim of boyleSmithCcdPatent.claims) {
      expect(claim.originalText).toBe(boyleSmithCcdClaimText(claim.number));
    }
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

  test("pairs every prose paragraph with an authored parallel reading", () => {
    const explainableBlocks = boyleSmithCcdArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(boyleSmithCcdParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(explainableBlocks);
    for (const index of explainableBlocks) {
      expect(boyleSmithCcdParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(30);
    }
  });

  test("keeps the page-marked manuscript as private WIP until its source-page mapping is repaired", () => {
    const ledger = readFileSync(
      `${process.cwd()}/public/patents/transcripts/us-3858232-boyle-smith-ccd-reviewed.txt`,
      "utf8",
    );
    expect(validateReviewedTranscription(ledger, 19)).toEqual({ valid: true });
    expect(ledger).toContain("[Drawing Sheet 1:");
    expect(boyleSmithCcdPatent.archivalEdition).toBeUndefined();
    expect(boyleSmithCcdPatent.originalTextAsset).toBeUndefined();
  });
});
