import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  davenportElectricMotorArchivalEdition,
  davenportElectricMotorParallelReadings,
} from "@/data/editions/davenportElectricMotorEdition";
import {
  completeArchivalEditionForViewer,
  evaluateArchivalPublicationState,
} from "@/data/editions/publicationApproval";
import { davenportElectricMotorPatent } from "@/data/patents/davenport-electric-motor";
import {
  validateReviewedTranscriptionEditorialIntegrity,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";

function readPngDimensions(bytes: Buffer): { width: number; height: number } {
  expect(bytes.subarray(1, 4).toString("ascii")).toBe("PNG");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

describe("davenportElectricMotorArchivalEdition", () => {
  test("is a complete manual edition pinned to the US 132 facsimile", () => {
    expect(validateCuratedSpecificationEdition(davenportElectricMotorArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(davenportElectricMotorArchivalEdition.sourcePdfSha256).toBe(
      "9147fc5c9d6565aa765198b42e900c90c5c0fe550b9162fe62727f86a5071960",
    );
    expect(
      davenportElectricMotorArchivalEdition.blocks.filter((block) => block.kind === "claim"),
    ).toHaveLength(1);
  });

  test("keeps the drawing sheet and scan pagination out of continuous prose", () => {
    const publicText = JSON.stringify(davenportElectricMotorArchivalEdition.blocks);
    expect(publicText).not.toContain("--- SOURCE PDF PAGE");
    expect(publicText).not.toContain("PAGE 2 OF 3");
    expect(publicText).not.toContain("drawing-sheet-preview.png");
    expect(davenportElectricMotorPatent.filingDate).toBeNull();
    expect(davenportElectricMotorPatent.drawings[0]?.figureNumber).toBe("Unnumbered drawing sheet");
    expect(
      davenportElectricMotorPatent.drawings[0]?.callouts.map((callout) => callout.label),
    ).toEqual(["A", "B, C", "D–I", "K, L", "M–P, Q", "R, V", "S, T"]);
    expect(davenportElectricMotorPatent.stats?.patentWarYears).toBeUndefined();
    expect(davenportElectricMotorPatent.stats?.impactScore).toBeUndefined();
  });

  test("keeps the sole printed claim and its local drawing evidence explicit", () => {
    const claim = davenportElectricMotorArchivalEdition.blocks.find(
      (block) => block.kind === "claim",
    );
    expect(claim?.kind).toBe("claim");
    if (claim?.kind !== "claim") throw new Error("US 132 is missing its sole printed claim.");
    expect(claim.inlines.map((inline) => inline.text).join("")).toBe(
      "Applying magnetic and electro-magnetic power as a moving principle for machinery in the manner above described, or in any other substantially the same in principle.",
    );
    expect(davenportElectricMotorPatent.claims[0]?.originalText).toBe(
      claim.inlines.map((inline) => inline.text).join(""),
    );
    const expectedPreviews = [
      {
        src: "/patents/figures/us-132-davenport-electric-motor/drawing-sheet-source-v1.png",
        width: 2320,
        height: 3408,
        sha256: "f47bf13c2da1b30cb022f54021b375e3a21bf05ff2726246c054374b22e8f09f",
      },
    ] as const;
    const drawingReference = davenportElectricMotorArchivalEdition.blocks
      .flatMap((block) => ("inlines" in block ? block.inlines : []))
      .find((inline) => inline.kind === "reference" && inline.referenceType === "figure");
    expect(drawingReference?.kind).toBe("reference");
    if (drawingReference?.kind !== "reference") {
      throw new Error("US 132 is missing its authored drawing reference.");
    }
    expect(drawingReference.figurePreviews).toEqual(
      expectedPreviews.map(({ sha256: _sha256, ...preview }) => expect.objectContaining(preview)),
    );
    for (const expected of expectedPreviews) {
      const path = join(process.cwd(), "public", expected.src.slice(1));
      expect(existsSync(path)).toBe(true);
      const bytes = readFileSync(path);
      expect(readPngDimensions(bytes)).toEqual({
        width: expected.width,
        height: expected.height,
      });
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(expected.sha256);
    }
    for (const historicalCrop of [
      "drawing-view-1-source-crop-v2.png",
      "drawing-view-2-source-crop-v2.png",
      "drawing-view-3-source-crop-v2.png",
    ]) {
      expect(
        existsSync(
          join(
            process.cwd(),
            "public/patents/figures/us-132-davenport-electric-motor",
            historicalCrop,
          ),
        ),
      ).toBe(true);
    }
    expect(
      readFileSync(
        join(process.cwd(), "docs/provenance/us-132-davenport-electric-motor.md"),
        "utf8",
      ),
    ).toContain("9147fc5c9d6565aa765198b42e900c90c5c0fe550b9162fe62727f86a5071960");
  });

  test("fails closed when the authored formal claim is removed", () => {
    expect(
      validateCuratedSpecificationEdition({
        ...davenportElectricMotorArchivalEdition,
        blocks: davenportElectricMotorArchivalEdition.blocks.filter(
          (block) => block.kind !== "claim",
        ),
      }).valid,
    ).toBe(false);
  });

  test("exports renderer-compatible readings for every authored source paragraph only", () => {
    const sourceBlocks = davenportElectricMotorArchivalEdition.blocks
      .map((block, sourceBlockIndex) => ({ block, sourceBlockIndex }))
      .filter(({ block }) => block.kind === "paragraph");

    const readingIndexes = Object.keys(davenportElectricMotorParallelReadings)
      .map(Number)
      .sort((left, right) => left - right);

    expect(readingIndexes).toHaveLength(sourceBlocks.length);
    expect(readingIndexes).toEqual(sourceBlocks.map(({ sourceBlockIndex }) => sourceBlockIndex));
    expect(
      Object.values(davenportElectricMotorParallelReadings).every(
        (reading) => Array.isArray(reading) && reading.length > 0 && reading.join(" ").length > 80,
      ),
    ).toBe(true);
    expect(davenportElectricMotorParallelReadings[14]).toBeUndefined();
  });

  test("keeps all three visual facsimile pages aligned to their reviewed-ledger sections", () => {
    const sourceAsset = davenportElectricMotorPatent.originalTextAsset;
    if (!sourceAsset) throw new Error("US 132 is missing its reviewed transcription asset.");
    expect(sourceAsset.url).toBe(
      "/patents/transcripts/us-132-davenport-electric-motor-reviewed.txt",
    );
    const ledger = readFileSync(join(process.cwd(), `public${sourceAsset.url}`), "utf8");
    expect(validateReviewedTranscriptionPageAnchors(ledger, 3, sourceAsset.pageAnchors)).toEqual({
      valid: true,
    });
    expect(validateReviewedTranscriptionEditorialIntegrity(ledger, 3)).toEqual({ valid: true });
    expect(ledger).not.toContain("Drawing sheet:");
    expect(ledger).toContain("A, B, C, D, E, F, G, H, I, K, L, M, N, O, P, Q, R, S, T, V");
    expect(ledger).toContain("not confidently legible in the supplied scan");
  });

  test("accepts the full drawing sheet while the complete edition remains reader-visible", () => {
    const decision = evaluateArchivalPublicationState(davenportElectricMotorPatent);

    expect(decision.isPublished).toBe(true);
    expect(decision.reasonCode).toBe("ACCEPTED");
    expect(decision.state.evidence.ledgerContent).toMatchObject({
      status: "verified",
      valid: true,
      ledgerUrl: "/patents/transcripts/us-132-davenport-electric-motor-reviewed.txt",
      coverageFraction: 1,
      missingSectionIndexes: [],
      missingClaimNumbers: [],
    });
    expect(decision.figureManifest).toMatchObject({
      requiredFigureCount: 1,
      acceptedFigureCount: 1,
    });
    expect(completeArchivalEditionForViewer(davenportElectricMotorPatent)).toBe(
      davenportElectricMotorArchivalEdition,
    );
  });

  test("provides valid provenance classifications for all Davenport controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-132-davenport-electric-motor"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({ batteryVoltage: 12, loadTorque: 0.8 });
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("proves Claim 1 constraint matches authentic broad claim and excludes split-ring wording", () => {
    const { CATALOG_CLAIM_CONSTRAINTS } = require("@/physics/claimConstraints");
    const constraints = CATALOG_CLAIM_CONSTRAINTS["us-132-davenport-electric-motor"];
    expect(constraints).toBeDefined();
    expect(constraints.length).toBe(1);
    const c1 = constraints[0];
    expect(c1.activeDescription.toLowerCase()).toContain("moving principle");
    expect(c1.activeDescription.toLowerCase()).not.toContain("split-ring");
    expect(c1.claimTitle.toLowerCase()).not.toContain("split-ring");
  });
});
