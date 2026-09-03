import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  clavelDeltaRobotClaimText,
  clavelDeltaRobotPatent,
} from "@/data/patents/clavel-delta-robot";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionCoverage,
  validateReviewedTranscriptionEditorialIntegrity,
  validateReviewedTranscriptionLiteralCoverage,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";
import type {
  CuratedSpecificationBlock,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";
import { ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS } from "./archivalFigureAcceptance";
import {
  clavelDeltaRobotArchivalEdition,
  clavelDeltaRobotParallelReadings,
} from "./clavelDeltaRobotEdition";
import {
  archivalEditionForPublication,
  evaluateArchivalPublicationState,
} from "./publicationApproval";
import {
  evaluateReviewedLedgerTextEvidence,
  literalLedgerSectionsForEdition,
} from "./reviewedLedgerPublicationEvidence";

const ROOT = process.cwd();
const PATENT_ID = "us-4976582-clavel-delta-robot";
const PDF_PATH = join(ROOT, "public", "patents", "pdfs", `${PATENT_ID}.pdf`);
const LEDGER_PATH = join(ROOT, "public", "patents", "transcripts", `${PATENT_ID}-reviewed.txt`);
const DIGEST = "e11516fed15c0937ee14decea63ff25557b848fb40ab381b29413737a145448e";

const EXPECTED_INDEPENDENT_CLAIMS = [1, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const EXPECTED_DEPENDENCIES: Readonly<Record<number, readonly number[]>> = {
  1: [],
  2: [1],
  3: [2],
  4: [2],
  5: [1],
  6: [5],
  7: [5],
  8: [3, 4, 6, 7],
  9: [3, 4, 6, 7],
  10: [3, 4],
  11: [3, 4],
  12: [3, 4],
  13: [3, 4],
  14: [],
  15: [],
  16: [],
  17: [],
  18: [],
  19: [],
  20: [],
  21: [],
  22: [],
  23: [],
  24: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
  25: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
};

const EXPECTED_FIGURE_ASSETS = {
  "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png": {
    sha256: "77af97db1f0f1cc52ae46200491bcbcb9553d350627a54c7775f9c37fdd0931c",
    width: 5800,
    height: 8520,
  },
  "/patents/figures/us-4976582-clavel-delta-robot/fig-2-source-crop-v1.png": {
    sha256: "2f141c4925b4c3cbc05a90c1c6676d2bbfe511f682dc75d1d5128e72763663ab",
    width: 5800,
    height: 8520,
  },
  "/patents/figures/us-4976582-clavel-delta-robot/fig-3-4-source-crop-v1.png": {
    sha256: "30cd3c71c9ba1064e012251942f003916787d3670e7ed946de55d98c229fd0b9",
    width: 5800,
    height: 8520,
  },
  "/patents/figures/us-4976582-clavel-delta-robot/fig-5-source-crop-v1.png": {
    sha256: "e5355e53e1a58c2529c5cfacd526280a3d8575cb9ae2233b377dac949ff9d100",
    width: 5800,
    height: 8520,
  },
} as const;

type FigureReference = Extract<CuratedSpecificationInline, { kind: "reference" }>;
type TermAnnotation = Extract<CuratedSpecificationInline, { kind: "term" }>;

function inlineGroupsFor(block: CuratedSpecificationBlock): readonly CuratedSpecificationInlines[] {
  switch (block.kind) {
    case "paragraph":
    case "claim":
      return [block.inlines];
    case "figure-sheet":
      return [block.description];
    case "table":
      return [...block.headers, ...block.rows.flat()];
    default:
      return [];
  }
}

function sourceBlockText(block: CuratedSpecificationBlock): string {
  switch (block.kind) {
    case "masthead":
      return block.lines.join(" ");
    case "heading":
    case "equation":
      return block.text;
    case "paragraph":
    case "claim":
      return block.inlines.map((inline) => inline.text).join("");
    case "figure-sheet":
      return block.description.map((inline) => inline.text).join("");
    case "table":
      return [
        block.caption ?? "",
        ...block.headers.flatMap((header) => header.map((inline) => inline.text)),
        ...block.rows.flatMap((row) => row.flatMap((cell) => cell.map((inline) => inline.text))),
      ]
        .filter(Boolean)
        .join(" ");
  }
}

function allSourceInlines(): CuratedSpecificationInline[] {
  return clavelDeltaRobotArchivalEdition.blocks.flatMap((block) => inlineGroupsFor(block).flat());
}

function figureReferences(): FigureReference[] {
  return allSourceInlines().filter(
    (inline): inline is FigureReference =>
      inline.kind === "reference" && inline.referenceType === "figure",
  );
}

describe("US 4,976,582 Clavel Delta Robot archival edition", () => {
  test("pins the complete eleven-page primary facsimile, reviewed ledger, and manual edition", () => {
    expect(validateCuratedSpecificationEdition(clavelDeltaRobotArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(clavelDeltaRobotPatent.archivalEdition).toBe(clavelDeltaRobotArchivalEdition);
    expect(clavelDeltaRobotArchivalEdition.sourcePdfSha256).toBe(DIGEST);
    expect(clavelDeltaRobotPatent.originalTextAsset).toMatchObject({
      url: `/patents/transcripts/${PATENT_ID}-reviewed.txt`,
      pageCount: 11,
      kind: "reviewed-transcription",
      reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
      reviewedAt: "2026-09-02",
      sourcePdfSha256: DIGEST,
    });

    expect(existsSync(PDF_PATH)).toBe(true);
    expect(createHash("sha256").update(readFileSync(PDF_PATH)).digest("hex")).toBe(DIGEST);

    const ledger = readFileSync(LEDGER_PATH, "utf8");
    expect(ledger.startsWith("--- REVIEWED TRANSCRIPTION PAGE 1 OF 11 ---")).toBe(true);
    expect(validateReviewedTranscription(ledger, 11)).toEqual({ valid: true });
    expect(validateReviewedTranscriptionEditorialIntegrity(ledger, 11)).toEqual({ valid: true });
    expect(
      validateReviewedTranscriptionPageAnchors(
        ledger,
        11,
        clavelDeltaRobotPatent.originalTextAsset?.pageAnchors,
      ),
    ).toEqual({ valid: true });
  });

  test("keeps every public source block and legal claim pinned to the reviewed ledger", () => {
    const ledger = readFileSync(LEDGER_PATH, "utf8");
    const literalBlocks = literalLedgerSectionsForEdition(clavelDeltaRobotArchivalEdition);
    const continuousEditionText = clavelDeltaRobotArchivalEdition.blocks
      .map(sourceBlockText)
      .filter((text) => text.length > 0)
      .join(" ");

    expect(literalBlocks).toHaveLength(70);
    expect(validateReviewedTranscriptionLiteralCoverage(ledger, 11, literalBlocks)).toEqual({
      valid: true,
    });
    expect(validateReviewedTranscriptionCoverage(ledger, 11, continuousEditionText)).toEqual({
      valid: true,
    });
    expect(evaluateReviewedLedgerTextEvidence(clavelDeltaRobotPatent, ledger)).toEqual({
      status: "verified",
      valid: true,
      ledgerUrl: `/patents/transcripts/${PATENT_ID}-reviewed.txt`,
      authoredSectionCount: 70,
      coveredSectionCount: 70,
      coverageFraction: 1,
      missingSectionIndexes: [],
      missingClaimNumbers: [],
      error: null,
    });

    const serializedEdition = JSON.stringify(clavelDeltaRobotArchivalEdition);
    expect(serializedEdition).not.toContain("--- REVIEWED TRANSCRIPTION PAGE");
    expect(serializedEdition).not.toContain("Sheet 1 of 4");
    expect(serializedEdition).not.toContain("source-pdf-text-layer");
  });

  test("derives all twenty-five issued claim strings from the manual source edition", () => {
    const editionClaims = clavelDeltaRobotArchivalEdition.blocks.filter(
      (block): block is Extract<CuratedSpecificationBlock, { kind: "claim" }> =>
        block.kind === "claim",
    );
    expect(editionClaims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 25 }, (_, index) => index + 1),
    );
    expect(clavelDeltaRobotPatent.claims).toHaveLength(25);
    expect(clavelDeltaRobotPatent.stats).toEqual({ totalClaims: 25, independentClaims: 11 });
    expect(
      clavelDeltaRobotPatent.claims
        .filter((claim) => claim.isIndependent)
        .map((claim) => claim.number),
    ).toEqual(EXPECTED_INDEPENDENT_CLAIMS);

    for (const claim of clavelDeltaRobotPatent.claims) {
      const editionClaim = editionClaims.find((candidate) => candidate.number === claim.number);
      const editionText = editionClaim?.inlines.map((inline) => inline.text).join("");
      expect(editionText).toBe(claim.originalText);
      expect(claim.dependsOn ?? []).toEqual([...EXPECTED_DEPENDENCIES[claim.number]]);
      expect(claim.plainEnglish.split(/\s+/).length).toBeGreaterThan(30);
      expect(claim.keyInnovations.length).toBeGreaterThan(0);
      for (const parent of claim.dependsOn ?? []) {
        expect(clavelDeltaRobotPatent.claims.some((candidate) => candidate.number === parent)).toBe(
          true,
        );
      }
    }
  });

  test("preserves the original printed claims while displaying the separate certificate of correction", () => {
    const claimText = (number: number) => clavelDeltaRobotClaimText(number);
    const certificateHeading = clavelDeltaRobotArchivalEdition.blocks.find(
      (block) =>
        block.kind === "heading" &&
        "text" in block &&
        typeof block.text === "string" &&
        block.text.includes("CERTIFICATE OF CORRECTION"),
    );
    const certificateText = clavelDeltaRobotArchivalEdition.blocks
      .slice(-4)
      .map(sourceBlockText)
      .join(" ");

    expect(claimText(6)).toContain("axis of fixed portion");
    expect(claimText(6)).not.toContain("axis of the fixed portion");
    expect(claimText(7)).toEndWith("about");
    expect(claimText(7)).not.toContain("an axis defined by the motion of translation");
    expect(claimText(12)).toContain("said at lest one linking means");
    expect(claimText(12)).not.toContain("said at least one linking means");
    expect(claimText(15)).toContain("one of ,the linking means");
    expect(claimText(16)).toContain("element in space, comprising.");
    expect(claimText(16)).not.toContain("element in space, comprising:");
    expect(claimText(20)).toContain("two and only degrees of freedom");

    expect(
      certificateHeading && "text" in certificateHeading ? certificateHeading.text : "",
    ).toContain("CERTIFICATE OF CORRECTION");
    expect(certificateText).toContain(
      "In claim 6, column 5, line 26, before “fixed” please insert --the--.",
    );
    expect(certificateText).toContain(
      "after “about” please insert --an axis defined by the motion of translation.--",
    );
    expect(certificateText).toContain(
      "In claim 15, column 6, line 20, after “of” please delete --,--.",
    );
  });

  test("pins every source-crop occurrence, digest, dimension, and publication acceptance", () => {
    const references = figureReferences();
    expect(references).toHaveLength(15);
    const previewSources = new Set<string>();
    for (const reference of references) {
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toStartWith(`/patents/figures/${PATENT_ID}/`);
        expect(preview.width).toBe(5800);
        expect(preview.height).toBe(8520);
        expect(existsSync(join(ROOT, "public", preview.src.replace(/^\//, "")))).toBe(true);
        previewSources.add(preview.src);
      }
    }
    expect([...previewSources].sort()).toEqual(Object.keys(EXPECTED_FIGURE_ASSETS).sort());

    const attestation = ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[PATENT_ID];
    expect(attestation).toEqual({
      sourcePdfSha256: DIGEST,
      reviewer: "Classic Patents editorial agent (GPT-5.6)",
      reviewedAt: "2026-09-02",
      acceptanceBasis: "independent-figure-review",
      acceptedOccurrenceCount: 15,
      assets: EXPECTED_FIGURE_ASSETS,
    });
    for (const [publicUrl, expected] of Object.entries(EXPECTED_FIGURE_ASSETS)) {
      const sourcePath = join(ROOT, "public", publicUrl.replace(/^\//, ""));
      const bytes = readFileSync(sourcePath);
      expect(bytes.subarray(0, 8).toString("hex"), publicUrl).toBe("89504e470d0a1a0a");
      expect(bytes.readUInt32BE(16), publicUrl).toBe(expected.width);
      expect(bytes.readUInt32BE(20), publicUrl).toBe(expected.height);
      expect(createHash("sha256").update(bytes).digest("hex"), publicUrl).toBe(expected.sha256);
    }

    const decision = evaluateArchivalPublicationState(clavelDeltaRobotPatent);
    expect(decision).toMatchObject({
      isPublished: true,
      status: "published",
      reasonCode: "ACCEPTED",
      reviewerAttestation: {
        completeFacsimileReviewed: true,
        hasCompanionReadings: true,
        structuralValidationPassed: true,
        isQuarantined: false,
      },
      figureManifest: {
        requiredFigureCount: 15,
        acceptedFigureCount: 15,
        attestation: {
          sourcePdfSha256: DIGEST,
          acceptedOccurrenceCount: 15,
          acceptedAssetCount: 4,
          matchesEdition: true,
          matchesLocators: true,
        },
      },
    });
    expect(decision.figureManifest.figures).toHaveLength(15);
    expect(decision.figureManifest.figures.every((figure) => figure.status === "accepted")).toBe(
      true,
    );
    expect(archivalEditionForPublication(clavelDeltaRobotPatent)).toBe(
      clavelDeltaRobotArchivalEdition,
    );
  });

  test("covers every source paragraph with a non-lossy reading and does not invent a patent war", () => {
    const paragraphIndexes = clavelDeltaRobotArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(paragraphIndexes).toHaveLength(33);
    expect(
      Object.keys(clavelDeltaRobotParallelReadings)
        .map(Number)
        .sort((left, right) => left - right),
    ).toEqual(paragraphIndexes);
    const readings = paragraphIndexes.map((index) =>
      clavelDeltaRobotParallelReadings[index]?.join(" ").trim(),
    );
    for (const reading of readings) expect(reading?.length).toBeGreaterThan(40);
    expect(new Set(readings).size).toBe(paragraphIndexes.length);

    const terms = allSourceInlines().filter(
      (inline): inline is TermAnnotation => inline.kind === "term",
    );
    expect(terms.map((term) => term.text)).toEqual([
      "SCARA (Selective Compliance Assembly Robot)",
      "cardan type",
      "deformable space-parallelogram",
    ]);
    for (const term of terms) expect(term.definition.trim().length).toBeGreaterThan(80);

    expect(clavelDeltaRobotPatent.historicalContext.patentWars).toEqual([]);
  });
});
