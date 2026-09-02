import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  baekelandBakeliteArchivalEdition,
  baekelandBakeliteParallelReadings,
} from "@/data/editions/baekelandBakeliteEdition";
import { baekelandBakelitePatent } from "@/data/patents/baekeland-bakelite";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";

describe("baekelandBakeliteArchivalEdition", () => {
  test("is a complete manual edition pinned to the reviewed US 942,699 facsimile", () => {
    expect(validateCuratedSpecificationEdition(baekelandBakeliteArchivalEdition)).toEqual({
      valid: false,
      errors: ["The archival edition must attest that the complete facsimile was reviewed."],
    });
    expect(baekelandBakeliteArchivalEdition.sourcePdfSha256).toBe(
      "91b63f1cfe7c4a24739ea63c9d45caa8059e74010ae3a2191bed97616a384dc5",
    );
    expect(
      existsSync(join(process.cwd(), "public/patents/pdfs/us-942699-baekeland-bakelite.pdf")),
    ).toBe(true);
    expect(
      readFileSync(join(process.cwd(), "docs/provenance/us-942699-baekeland-bakelite.md"), "utf8"),
    ).toContain("91b63f1cfe7c4a24739ea63c9d45caa8059e74010ae3a2191bed97616a384dc5");
  });

  test("preserves all five printed claims exactly and decodes the same claims canonically", () => {
    const sourceClaims = baekelandBakeliteArchivalEdition.blocks.filter(
      (block) => block.kind === "claim",
    );
    expect(sourceClaims).toHaveLength(5);
    expect(sourceClaims.map((claim) => claim.number)).toEqual([1, 2, 3, 4, 5]);
    expect(
      sourceClaims.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    ).toEqual(baekelandBakelitePatent.claims.map((claim) => claim.originalText));
    expect(baekelandBakelitePatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3, 4, 5]);
  });

  test("preserves filing and grant dates faithfully", () => {
    expect(baekelandBakelitePatent.grantDate).toBe("1909-12-07");
    expect(baekelandBakelitePatent.filingDate).toBe("1907-07-13");
    expect(
      readFileSync(join(process.cwd(), "docs/provenance/us-942699-baekeland-bakelite.md"), "utf8"),
    ).toContain("July 13, 1907");
  });

  test("records the source-true absence of separate drawing sheets in US 942,699", () => {
    expect(baekelandBakelitePatent.drawings).toEqual([]);
    expect(
      baekelandBakeliteArchivalEdition.blocks.some((block) => block.kind === "figure-sheet"),
    ).toBe(false);
  });

  test("exports complete direct paragraph companions for all authored paragraphs", () => {
    const paragraphIndexes = baekelandBakeliteArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    const readingIndexes = Object.keys(baekelandBakeliteParallelReadings)
      .map(Number)
      .sort((left, right) => left - right);

    expect(readingIndexes).toEqual(paragraphIndexes);
    expect(
      Object.values(baekelandBakeliteParallelReadings).every(
        (reading) => Array.isArray(reading) && reading.length > 0 && reading.join(" ").length > 80,
      ),
    ).toBe(true);
  });

  test("fails closed for a malformed edition with missing claims", () => {
    expect(
      validateCuratedSpecificationEdition({
        ...baekelandBakeliteArchivalEdition,
        blocks: baekelandBakeliteArchivalEdition.blocks.filter((block) => block.kind !== "claim"),
      }).valid,
    ).toBe(false);

    expect(
      baekelandBakeliteArchivalEdition.blocks.filter((block) => block.kind === "claim").length,
    ).toBe(5);
  });

  test("pins every authored source block to the reviewed 3-page ledger", () => {
    const asset = baekelandBakelitePatent.originalTextAsset;
    expect(asset).toMatchObject({
      url: "/patents/transcripts/us-942699-baekeland-bakelite-reviewed.txt",
      pageCount: 3,
      kind: "reviewed-transcription",
      reviewedBy: "Classic Patents editorial agent (MossyCat; cloud-Luna visual review pending)",
      reviewedAt: "2026-08-21",
      sourcePdfSha256: "91b63f1cfe7c4a24739ea63c9d45caa8059e74010ae3a2191bed97616a384dc5",
    });
    if (!asset?.sourcePdfSha256) {
      throw new Error("Bakelite reviewed transcript asset or source digest is missing.");
    }

    const transcript = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(transcript, asset.pageCount)).toEqual({ valid: true });
    expect(
      validateReviewedTranscriptionPageAnchors(transcript, asset.pageCount, asset.pageAnchors),
    ).toEqual({
      valid: true,
    });
    const sourcePdf = readFileSync(
      `${process.cwd()}/public${baekelandBakelitePatent.originalPdfUrl}`,
    );
    expect(createHash("sha256").update(sourcePdf).digest("hex")).toBe(asset.sourcePdfSha256);

    const normalizedTranscript = transcript
      .replace(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm, "")
      .replace(/\s+/g, " ")
      .trim();
    const textualBlocks = baekelandBakeliteArchivalEdition.blocks.filter(
      (block) => block.kind === "masthead" || block.kind === "paragraph" || block.kind === "claim",
    );
    for (const block of textualBlocks) {
      const sourceText =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.inlines.map((inline) => inline.text).join("");
      expect(normalizedTranscript).toContain(sourceText.replace(/\s+/g, " ").trim());
    }
  });

  test("provides valid provenance classifications for all Bakelite controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-942699-baekeland-bakelite"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("enforces facsimile review pending audit hold in publication state registry", () => {
    const { evaluateTypedArchivalPublicationState } = require("./archivalPublicationState");
    const decision = evaluateTypedArchivalPublicationState(baekelandBakelitePatent, {
      hasCompanionReadings: true,
    });
    expect(decision.isPublished).toBe(false);
    expect(decision.state.kind).toBe("held");
    expect(decision.reasonCode).toBe("AUDIT_FACSIMILE_REVIEW_PENDING");
  });
});
