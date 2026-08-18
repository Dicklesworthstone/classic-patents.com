import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { farnsworthTvPatent } from "@/data/patents/farnsworth-tv";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { farnsworthTvArchivalEdition, farnsworthTvParallelReadings } from "./farnsworthTvEdition";

describe("US 1,773,980 manual source edition", () => {
  test("pins the inspected 13-page facsimile and its full printed claim sequence", () => {
    expect(validateCuratedSpecificationEdition(farnsworthTvArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${farnsworthTvPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      farnsworthTvArchivalEdition.sourcePdfSha256,
    );
    expect(farnsworthTvPatent.filingDate).toBe("1927-01-07");
    expect(farnsworthTvPatent.claims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 18 }, (_, index) => index + 1),
    );
    expect(farnsworthTvPatent.claims.map((claim) => claim.originalText)).toEqual(
      farnsworthTvArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.inlines.map((inline) => inline.text).join("")),
    );
  });

  test("keeps every printed figure reference on a patent-local source sheet", () => {
    const refs = farnsworthTvArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.flatMap((inline) =>
        inline.kind === "reference" && inline.referenceType === "figure" ? [inline] : [],
      );
    });
    for (const reference of refs) {
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toStartWith("/patents/figures/us-1773980-farnsworth-tv/");
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
        expect(preview.width).toBeLessThan(1392);
        expect(preview.height).toBeLessThan(2045);
      }
    }
  });

  test("covers each authored prose block with a direct companion and has a page-marked ledger", () => {
    const paragraphs = farnsworthTvArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(farnsworthTvParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(paragraphs);
    for (const index of paragraphs)
      expect(farnsworthTvParallelReadings[index].join(" ").length).toBeGreaterThan(40);
    const asset = farnsworthTvPatent.originalTextAsset;
    if (!asset) throw new Error("Farnsworth reviewed ledger asset is missing.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 13)).toEqual({ valid: true });
    for (const block of farnsworthTvArchivalEdition.blocks) {
      if (block.kind === "paragraph" || block.kind === "claim") {
        expect(ledger).toContain(block.inlines.map((inline) => inline.text).join(""));
      }
    }
  });
});
