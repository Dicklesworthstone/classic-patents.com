import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { goddardRocketPatent } from "@/data/patents/goddard-rocket";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionLiteralCoverage,
} from "@/data/patents/sourceTextValidation";
import {
  goddardRocketArchivalEdition,
  goddardRocketParallelReadings,
} from "./goddardRocketEdition";
import {
  evaluateReviewedLedgerTextEvidence,
  literalLedgerSectionsForEdition,
} from "./reviewedLedgerPublicationEvidence";

describe("goddardRocketArchivalEdition", () => {
  test("pins the reviewed four-page US 1,102,653 facsimile and all eight printed claims", () => {
    expect(validateCuratedSpecificationEdition(goddardRocketArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(goddardRocketArchivalEdition.sourcePdfSha256).toBe(
      "8503f52914f4201850d7d6f067ac48886dda77c2cdb5e8fce831e13232f7c42b",
    );
    expect(goddardRocketArchivalEdition.completeFacsimileReviewed).toBe(true);
    expect(
      goddardRocketArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.number),
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test("maps every visitor-reachable figure citation to the complete pinned source drawing sheet", async () => {
    const serialized = JSON.stringify(goddardRocketArchivalEdition.blocks);
    expect(serialized).not.toContain("SOURCE PDF PAGE");
    expect(serialized).not.toContain("pdftotext");
    expect(serialized).not.toContain("ocr");

    const expectedPreview = {
      src: "/patents/figures/us-1102653-goddard-rocket/sheet-1-1.png",
      width: 2320,
      height: 3408,
      sha256: "65f586e211296f66aacd648922ce102b0804d280de2d4a4e4f31237b3774c0ed",
    } as const;
    const expectedPreviewProjection = {
      src: expectedPreview.src,
      width: expectedPreview.width,
      height: expectedPreview.height,
    };

    const sourceFigureReferences = goddardRocketArchivalEdition.blocks.flatMap((block) => {
      const inlines =
        block.kind === "figure-sheet"
          ? block.description
          : block.kind === "paragraph" || block.kind === "claim"
            ? block.inlines
            : [];
      return inlines.filter(
        (inline) => inline.kind === "reference" && inline.referenceType === "figure",
      );
    });

    expect(
      sourceFigureReferences.map((reference) => {
        if (reference.kind !== "reference" || reference.referenceType !== "figure") {
          throw new Error("Goddard source figure reference inventory is malformed.");
        }
        return [
          reference.text,
          reference.figurePreviews?.map(({ src, width, height }) => ({ src, width, height })),
        ];
      }),
    ).toEqual([
      ["Figs. 1 through 5", [expectedPreviewProjection]],
      ["Figure 1", [expectedPreviewProjection]],
      ["Fig. 2", [expectedPreviewProjection]],
      ["Figs. 3 and 4", [expectedPreviewProjection]],
      ["Fig. 1", [expectedPreviewProjection]],
      ["Fig. 5", [expectedPreviewProjection]],
      ["Fig. 1", [expectedPreviewProjection]],
      ["Fig. 3", [expectedPreviewProjection]],
      ["Fig. 5", [expectedPreviewProjection]],
      ["Fig. 3", [expectedPreviewProjection]],
      ["Fig. 1", [expectedPreviewProjection]],
    ]);

    const file = Bun.file(`public${expectedPreview.src}`);
    expect(await file.exists()).toBe(true);
    const bytes = new Uint8Array(await file.arrayBuffer());
    expect([...bytes.slice(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
    expect({
      width: new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(16),
      height: new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(20),
    }).toEqual({ width: expectedPreview.width, height: expectedPreview.height });
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(expectedPreview.sha256);
  });

  test("turns every source figure citation into an authored preview node", () => {
    const bareFigureReference = /\b(?:fig(?:s)?\.?|figure)\s+\d+/i;

    for (const block of goddardRocketArchivalEdition.blocks) {
      if (block.kind !== "paragraph" && block.kind !== "claim") continue;
      for (const inline of block.inlines) {
        if (inline.kind === "text") expect(inline.text).not.toMatch(bareFigureReference);
      }
    }
  });

  test("defines period technical terms at their exact source occurrences", () => {
    const terms = goddardRocketArchivalEdition.blocks.flatMap((block) => {
      if (block.kind !== "paragraph") return [];
      return block.inlines.filter((inline) => inline.kind === "term");
    });

    expect(terms.map((term) => term.text)).toEqual([
      "combustion chamber",
      "truncated cone",
      "backwardly curved tubes or recesses",
      "key",
      "firing tube",
      "gyroscope",
      "three-phase induction motor",
    ]);
    for (const term of terms) expect(term.definition.split(/\s+/).length).toBeGreaterThan(8);
  });

  test("provides a complete-coverage, non-lossy companion for every source paragraph", () => {
    for (const [index, block] of goddardRocketArchivalEdition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      const reading = goddardRocketParallelReadings[index];
      expect(reading?.join(" ").trim().length).toBeGreaterThan(20);
      const sourceWords = block.inlines
        .map((inline) => inline.text)
        .join(" ")
        .trim()
        .split(/\s+/).length;
      const readingWords = reading?.join(" ").trim().split(/\s+/).length ?? 0;
      if (sourceWords >= 100) expect(readingWords / sourceWords).toBeGreaterThanOrEqual(0.3);
    }
  });

  test("preserves complete source claim-comparison evidence", async () => {
    const editionClaims = goddardRocketArchivalEdition.blocks.filter(
      (block) => block.kind === "claim",
    );
    expect(goddardRocketPatent.id).toBe("us-1102653-goddard-rocket");
    expect(goddardRocketPatent.patentNumber).toBe("US 1,102,653");
    expect(goddardRocketPatent.archivalEdition).toBe(goddardRocketArchivalEdition);
    expect(goddardRocketPatent.originalTextAsset).toBeDefined();
    expect(goddardRocketPatent.stats).toEqual({ totalClaims: 8, independentClaims: 8 });
    expect(goddardRocketPatent.claims).toHaveLength(8);
    for (const claim of editionClaims) {
      const decoder = goddardRocketPatent.claims.find(
        (candidate) => candidate.number === claim.number,
      );
      expect(decoder?.originalText).toBe(claim.inlines.map((inline) => inline.text).join(""));
      expect(decoder?.plainEnglish.split(/\s+/).length).toBeGreaterThan(20);
    }

    const transcript = await Bun.file(
      "public/patents/transcripts/us-1102653-goddard-rocket-reviewed.txt",
    ).text();
    expect(validateReviewedTranscription(transcript, 4)).toEqual({ valid: true });
    for (const claim of editionClaims) {
      expect(transcript).toContain(claim.inlines.map((inline) => inline.text).join(""));
    }
  });

  test("pins every literal source section to the reviewed ledger", async () => {
    const transcript = await Bun.file(
      "public/patents/transcripts/us-1102653-goddard-rocket-reviewed.txt",
    ).text();
    const literalSections = literalLedgerSectionsForEdition(goddardRocketArchivalEdition);

    expect(literalSections).toHaveLength(39);
    expect(validateReviewedTranscriptionLiteralCoverage(transcript, 4, literalSections)).toEqual({
      valid: true,
    });
    expect(evaluateReviewedLedgerTextEvidence(goddardRocketPatent, transcript)).toMatchObject({
      status: "verified",
      valid: true,
      authoredSectionCount: 39,
      coveredSectionCount: 39,
      coverageFraction: 1,
      missingSectionIndexes: [],
      missingClaimNumbers: [],
      error: null,
    });
  });

  test("provides valid provenance classifications for all Goddard controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-1102653-goddard-rocket"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("registers explicit energy channel omission reason for Goddard", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-1102653-goddard-rocket"]).toBeDefined();
    expect(energyChannelsFor("us-1102653-goddard-rocket", {})).toEqual([]);
  });

  test("retains both complete source-reading layers regardless of archival-audit disposition", () => {
    const { evaluateTypedArchivalPublicationState } = require("./archivalPublicationState");
    const decision = evaluateTypedArchivalPublicationState(goddardRocketPatent, {
      hasCompanionReadings: true,
    });
    expect(decision).toBeDefined();
    expect(goddardRocketPatent.archivalEdition).toBe(goddardRocketArchivalEdition);
    expect(goddardRocketPatent.originalTextAsset?.url).toBe(
      "/patents/transcripts/us-1102653-goddard-rocket-reviewed.txt",
    );
  });
});
