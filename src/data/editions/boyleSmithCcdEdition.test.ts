import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { boyleSmithCcdPatent } from "@/data/patents/boyle-smith-ccd";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  boyleSmithCcdArchivalEdition,
  boyleSmithCcdClaimTexts,
  boyleSmithCcdFigureSheets,
  boyleSmithCcdParallelReadings,
} from "./boyleSmithCcdEdition";

describe("boyleSmithCcdArchivalEdition", () => {
  test("pins the reviewed US 3,858,232 facsimile with explicit source nodes", () => {
    if (boyleSmithCcdPatent.archivalEdition)
      expect(boyleSmithCcdPatent.archivalEdition).toBe(boyleSmithCcdArchivalEdition);
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

  test("publishes a reviewed ledger and validates source text", () => {
    const asset = boyleSmithCcdPatent.originalTextAsset;
    expect(asset).toMatchObject({
      url: "/patents/transcripts/us-3858232-boyle-smith-ccd-reviewed.txt",
      pageCount: 19,
      kind: "reviewed-transcription",
      sourcePdfSha256: boyleSmithCcdArchivalEdition.sourcePdfSha256,
    });
    if (!asset) throw new Error("Boyle Smith CCD reviewed transcript asset is missing.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 19)).toEqual({ valid: true });
  });
});
