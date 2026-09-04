import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { evaluateArchivalPublicationState } from "@/data/editions/publicationApproval";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { sundbackZipperPatent } from "@/data/patents/sundback-zipper";
import {
  sundbackZipperArchivalEdition,
  sundbackZipperParallelReadings,
} from "./sundbackZipperEdition";

describe("US 1,219,881 Gideon Sundback Separable Fastener manual source edition", () => {
  test("pins the five-page Sundback facsimile, filing date, and all eleven printed claims", () => {
    expect(sundbackZipperPatent.archivalEdition).toBe(sundbackZipperArchivalEdition);
    expect(sundbackZipperPatent.filingDate).toBe("1914-08-27");
    expect(sundbackZipperPatent.grantDate).toBe("1917-03-20");
    expect(sundbackZipperArchivalEdition.sourcePdfSha256).toBe(
      "8b73a4db400d449ec6349a07c05b38df6f5bed609562a2c96ba893890a41a3b9",
    );
    expect(validateCuratedSpecificationEdition(sundbackZipperArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${sundbackZipperPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      sundbackZipperArchivalEdition.sourcePdfSha256,
    );
    expect(sundbackZipperPatent.claims.map((claim) => claim.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    ]);
    expect(sundbackZipperPatent.stats).toMatchObject({ totalClaims: 11, independentClaims: 11 });
  });

  test("keeps the typed legal claims exactly synchronized with the public decoders", () => {
    const authoredClaims = sundbackZipperArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof sundbackZipperArchivalEdition.blocks)[number],
        { kind: "claim" }
      > => block.kind === "claim",
    );
    expect(sundbackZipperPatent.claims.map((claim) => claim.originalText)).toEqual(
      authoredClaims.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
    for (const claim of sundbackZipperPatent.claims) {
      expect(claim.plainEnglish.split(/\s+/).length).toBeGreaterThan(25);
      expect(claim.keyInnovations).not.toHaveLength(0);
    }
  });

  test("uses a complete local source sheet for every printed figure citation", () => {
    const references = sundbackZipperArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    expect(references).not.toHaveLength(0);
    for (const reference of references) {
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toStartWith("/patents/figures/us-1219881-sundback-zipper/");
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
        expect(preview).toMatchObject({
          src: "/patents/figures/us-1219881-sundback-zipper/source-sheet-1-v1.png",
          width: 2320,
          height: 3408,
        });
        expect(preview.alt).toContain("Complete source drawing sheet 1 of 1");
      }
    }

    for (let figure = 1; figure <= 9; figure += 1) {
      expect(
        existsSync(
          resolve(
            process.cwd(),
            "public",
            `patents/figures/us-1219881-sundback-zipper/fig-${figure}-source-crop-v1.png`,
          ),
        ),
      ).toBe(true);
    }
  });

  test("accepts every citation against the source-sheet evidence without withholding text", () => {
    const decision = evaluateArchivalPublicationState(sundbackZipperPatent);
    expect(decision.isPublished).toBe(true);
    expect(decision.reasonCode).toBe("ACCEPTED");
    expect(decision.figureManifest).toMatchObject({
      requiredFigureCount: 25,
      acceptedFigureCount: 25,
    });
    expect(decision.figureManifest.figures.every((figure) => figure.status === "accepted")).toBe(
      true,
    );
  });

  test("contains parallel readings for every paragraph index", () => {
    const paragraphIndices = sundbackZipperArchivalEdition.blocks
      .map((block, idx) => (block.kind === "paragraph" ? idx : null))
      .filter((idx): idx is number => idx !== null);

    for (const idx of paragraphIndices) {
      const reading = sundbackZipperParallelReadings[idx];
      expect(reading).toBeDefined();
      expect(reading?.join(" ").length).toBeGreaterThan(30);
    }
  });

  test("validates the reviewed transcription ledger", () => {
    const ledger = readFileSync(
      `${process.cwd()}/public/patents/transcripts/us-1219881-sundback-zipper-reviewed.txt`,
      "utf8",
    );
    const result = validateReviewedTranscription(ledger, 5);
    expect(result.valid).toBe(true);
  });

  test("provides valid provenance classifications for all Sundback controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-1219881-sundback-zipper"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("wires claim 1 and claim 2 constraints in claimConstraints", () => {
    const { applyClaimConstraintModifications } = require("@/physics/claimConstraints");
    const r1 = applyClaimConstraintModifications(
      "us-1219881-sundback-zipper",
      {},
      { 1: false, 2: true },
    );
    expect(r1.modifiedParams.staggerAligned).toBe(0);
    expect(r1.refusalWarning).toContain("STAGGER ALIGNMENT LOSS");

    const r2 = applyClaimConstraintModifications(
      "us-1219881-sundback-zipper",
      {},
      { 1: true, 2: false },
    );
    expect(r2.modifiedParams.socketOverlapRatio).toBe(0.1);
    expect(r2.refusalWarning).toContain("SOCKET NESTING COLLAPSE");
  });
});
