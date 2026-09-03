import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { evaluateReviewedLedgerTextEvidence } from "@/data/editions/reviewedLedgerPublicationEvidence";
import { hullStereolithographyPatent } from "@/data/patents/hull-stereolithography";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  hullStereolithographyArchivalEdition,
  hullStereolithographyParallelReadings,
} from "./hullStereolithographyEdition";

const normalizeSourceText = (value: string) => value.replace(/\s+/g, " ").trim();

describe("US 4,575,330 Charles W. Hull Stereolithography manual source edition", () => {
  test("pins the sixteen-page Hull facsimile, filing date, and all 47 printed claims", () => {
    expect(hullStereolithographyPatent.archivalEdition).toBe(hullStereolithographyArchivalEdition);
    expect(hullStereolithographyPatent.filingDate).toBe("1984-08-08");
    expect(hullStereolithographyPatent.grantDate).toBe("1986-03-11");
    expect(hullStereolithographyArchivalEdition.sourcePdfSha256).toBe(
      "5dc2211b18f88883ee92394917154d57d102b73c26a4744332cbf0d89b1db1c7",
    );
    expect(validateCuratedSpecificationEdition(hullStereolithographyArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(
      `${process.cwd()}/public${hullStereolithographyPatent.originalPdfUrl}`,
    );
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      hullStereolithographyArchivalEdition.sourcePdfSha256,
    );
    expect(hullStereolithographyPatent.claims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 47 }, (_, i) => i + 1),
    );
    expect(hullStereolithographyPatent.stats).toMatchObject({
      totalClaims: 47,
      independentClaims: 5,
    });
  });

  test("keeps the typed legal claims exactly synchronized with the public decoders", () => {
    const authoredClaims = hullStereolithographyArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof hullStereolithographyArchivalEdition.blocks)[number],
        { kind: "claim" }
      > => block.kind === "claim",
    );
    expect(hullStereolithographyPatent.claims.map((claim) => claim.originalText)).toEqual(
      authoredClaims.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
    for (const claim of hullStereolithographyPatent.claims) {
      expect(claim.plainEnglish.split(/\s+/).length).toBeGreaterThan(10);
      expect(claim.keyInnovations).not.toHaveLength(0);
    }
  });

  test("uses an authored local source crop for every printed figure citation", () => {
    const references = hullStereolithographyArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : block.kind === "figure-sheet"
          ? block.description.filter(
              (
                inline,
              ): inline is Extract<(typeof block.description)[number], { kind: "reference" }> =>
                inline.kind === "reference" && inline.referenceType === "figure",
            )
          : [],
    );
    expect(references.length).toBeGreaterThanOrEqual(8);
    for (const ref of references) {
      expect(ref.figurePreviews).toBeDefined();
      expect(ref.figurePreviews?.length).toBeGreaterThan(0);
      for (const preview of ref.figurePreviews ?? []) {
        const fullPath = resolve(process.cwd(), `public${preview.src}`);
        expect(existsSync(fullPath)).toBe(true);
      }
    }
  });

  test("contains parallel readings for every paragraph index", () => {
    const paragraphIndices = hullStereolithographyArchivalEdition.blocks
      .map((block, idx) => (block.kind === "paragraph" ? idx : null))
      .filter((idx): idx is number => idx !== null);

    const readingKeys = Object.keys(hullStereolithographyParallelReadings)
      .map(Number)
      .sort((a, b) => a - b);
    expect(readingKeys).toEqual(paragraphIndices);
    for (const paragraphs of Object.values(hullStereolithographyParallelReadings)) {
      expect(paragraphs.length).toBeGreaterThan(0);
      for (const pText of paragraphs) {
        expect(pText.length).toBeGreaterThan(40);
      }
    }
  });

  test("pins a page-complete literal ledger and rejects a missing printed claim", () => {
    const ledgerPath = resolve(
      process.cwd(),
      `public${hullStereolithographyPatent.originalTextAsset?.url}`,
    );
    expect(existsSync(ledgerPath)).toBe(true);
    const ledgerText = readFileSync(ledgerPath, "utf8");
    const validation = validateReviewedTranscription(ledgerText, 16);
    expect(validation.valid).toBe(true);

    const evidence = evaluateReviewedLedgerTextEvidence(hullStereolithographyPatent, ledgerText);
    expect(evidence).toMatchObject({
      status: "verified",
      valid: true,
      coverageFraction: 1,
      missingSectionIndexes: [],
      missingClaimNumbers: [],
    });

    const pageAnchors = hullStereolithographyPatent.originalTextAsset?.pageAnchors ?? [];
    expect(pageAnchors).toHaveLength(16);
    for (const anchor of pageAnchors) {
      const marker = `--- REVIEWED TRANSCRIPTION PAGE ${anchor.page} OF 16 ---`;
      const start = ledgerText.indexOf(marker);
      const nextMarker = `--- REVIEWED TRANSCRIPTION PAGE ${anchor.page + 1} OF 16 ---`;
      const end = ledgerText.indexOf(nextMarker, start + marker.length);
      const pageText = ledgerText.slice(start, end === -1 ? undefined : end);
      expect(start).toBeGreaterThanOrEqual(0);
      if (!anchor.isBlank) {
        expect(pageText).toContain(anchor.exactSourceText);
      }
    }

    const normalizedLedger = normalizeSourceText(ledgerText);
    for (let c = 1; c <= 47; c++) {
      expect(normalizedLedger.includes(`${c}.`)).toBe(true);
    }

    const finalPrintedClaim = hullStereolithographyPatent.claims.find(
      (claim) => claim.number === 47,
    );
    expect(finalPrintedClaim).toBeDefined();
    const missingClaimLedger = ledgerText.replace(
      finalPrintedClaim?.originalText ?? "",
      "47. [Intentionally removed for mutation test.]",
    );
    const missingClaimEvidence = evaluateReviewedLedgerTextEvidence(
      hullStereolithographyPatent,
      missingClaimLedger,
    );
    expect(missingClaimEvidence.valid).toBe(false);
    expect(missingClaimEvidence.missingClaimNumbers).toContain(47);
  });

  test("provides valid provenance classifications for all Hull controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-4575330-hull-stereolithography"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
    expect(entry.controls.map((control: { id: string }) => control.id)).toEqual([
      "shutterRequestedOpen",
      "scanXFraction",
      "scanZFraction",
      "recoatExcursionFraction",
      "displayLaminaCount",
    ]);
    expect(metrics.some((metric: { value: string }) => metric.value === "refused")).toBe(true);
    expect(JSON.stringify({ controls: entry.controls, metrics })).not.toMatch(
      /mJ\/cm|cure depth|conversion degree|galvo vector/i,
    );
  });

  test("keeps figure metadata and the equation card pinned to the actual grant", () => {
    expect(hullStereolithographyPatent.drawings.map((drawing) => drawing.figureNumber)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
    ]);
    expect(hullStereolithographyPatent.drawings[0].title).toContain("Method Flow");
    expect(hullStereolithographyPatent.drawings[1].title).toContain("Process Flow");
    expect(hullStereolithographyPatent.drawings[2].caption).toContain("mercury");
    expect(hullStereolithographyPatent.drawings[6].caption).toContain("hinge member 42");
    expect(hullStereolithographyPatent.drawings[7].caption).toContain("rotated 90 degrees");
    expect(JSON.stringify(hullStereolithographyPatent.drawings)).not.toMatch(
      /helium-cadmium|galvanometer|chemical jet|vertical shaft 30/i,
    );

    const equations = ALL_COLORIZED_EQUATIONS["us-4575330-hull-stereolithography"];
    expect(equations).toHaveLength(1);
    expect(equations[0].id).toBe("hull-source-working-surface-sequence");
    expect(equations[0].claimRef).toBe(2);
    expect(JSON.stringify(equations)).not.toMatch(/C_d|E_c|peak laser|cure depth law/i);
  });

  test("wires claim 1 and claim 2 constraints in claimConstraints", () => {
    const { applyClaimConstraintModifications } = require("@/physics/claimConstraints");
    const r1 = applyClaimConstraintModifications(
      "us-4575330-hull-stereolithography",
      {},
      { 1: false, 2: true },
    );
    expect(r1.modifiedParams.displayLaminaCount).toBe(1);
    expect(r1.modifiedParams.recoatExcursionFraction).toBe(0);
    expect(r1.refusalWarning).toContain("CLAIM 1 TOPOLOGY REMOVED");

    const r2 = applyClaimConstraintModifications(
      "us-4575330-hull-stereolithography",
      {},
      { 1: true, 2: false },
    );
    expect(r2.modifiedParams.shutterRequestedOpen).toBe(0);
    expect(r2.refusalWarning).toContain("CLAIM 2 TOPOLOGY REMOVED");
  });
});
