import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { kilbyIntegratedCircuitPatent } from "../patents/kilby-integrated-circuit";
import {
  kilbyIntegratedCircuitArchivalEdition,
  kilbyIntegratedCircuitParallelReadings,
  kilbyIntegratedCircuitSourcePreviewPlan,
  manualKilbyClaimText,
} from "./kilbyIntegratedCircuitEdition";

describe("US 3,138,743 Jack S. Kilby Monolithic Integrated Circuit Archival Edition Publication Contract", () => {
  const rootDir = process.cwd();
  const pdfPath = join(rootDir, "public/patents/pdfs/us-3138743-kilby-integrated-circuit.pdf");
  const transcriptPath = join(
    rootDir,
    "public/patents/transcripts/us-3138743-kilby-integrated-circuit-reviewed.txt",
  );
  const editionPath = join(rootDir, "src/data/editions/kilbyIntegratedCircuitEdition.ts");

  test("serves the published edition in the public record", () => {
    // Owner recalibration (2026-08-22): complete original texts publish even
    // with minor imperfections; holds are reserved for fabricated content.
    expect(kilbyIntegratedCircuitPatent.archivalEdition).toBe(
      kilbyIntegratedCircuitArchivalEdition,
    );
    expect(kilbyIntegratedCircuitPatent.originalTextAsset).toBeDefined();
    expect(kilbyIntegratedCircuitArchivalEdition.completeFacsimileReviewed).toBe(true);
  });

  test("validates the complete archival edition", () => {
    const result = validateCuratedSpecificationEdition(kilbyIntegratedCircuitArchivalEdition);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  test("keeps claims as direct authored edition nodes without an indexed claim array", () => {
    const editionSource = readFileSync(editionPath, "utf-8");
    expect(editionSource).not.toContain("sourceClaimTexts");
    expect(editionSource).not.toContain(".map((value, index)");
  });

  test("matches the cryptographic SHA-256 digest of the pinned 9-page USPTO facsimile PDF", () => {
    expect(existsSync(pdfPath)).toBe(true);
    const buffer = readFileSync(pdfPath);
    const computedDigest = createHash("sha256").update(buffer).digest("hex");

    expect(kilbyIntegratedCircuitArchivalEdition.sourcePdfSha256).toBe(
      "e523c17aaef78f727181d87c427be3edf10f964bed20b90ef07a8099a1c18eef",
    );
    expect(computedDigest).toBe(kilbyIntegratedCircuitArchivalEdition.sourcePdfSha256);
  });

  test("pins and validates the 9-page reviewed ledger transcript", () => {
    expect(existsSync(transcriptPath)).toBe(true);
    const transcript = readFileSync(transcriptPath, "utf-8");

    for (let page = 1; page <= 9; page++) {
      expect(transcript).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${page} OF 9 ---`);
    }
    expect(transcript).not.toContain("STATUS: WITHHELD WIP");
    expect(transcript).not.toContain("Visible labels:");
    expect(transcript).toContain("10, 10a, 10b");
    expect(transcript).toContain("T1, T2, R1–R8, C1–C4");
    expect(transcript).toContain("T1, T2, R1–R8, C1, C2");
    expect(transcript).toContain("Fig. 8a. Fig. 8b. Fig. 8c.");
  });

  test("verifies all referenced source figure crops exist on disk", () => {
    for (const block of kilbyIntegratedCircuitArchivalEdition.blocks) {
      const inlines =
        block.kind === "figure-sheet" ? block.description : "inlines" in block ? block.inlines : [];
      for (const inline of inlines) {
        if (inline.kind === "reference" && inline.figurePreviews) {
          for (const prev of inline.figurePreviews) {
            const cropPath = join(rootDir, "public", prev.src.replace(/^\//, ""));
            expect(existsSync(cropPath)).toBe(true);
          }
        }
      }
    }
  });

  test("requires every printed figure occurrence to be an authored reference", () => {
    for (const block of kilbyIntegratedCircuitArchivalEdition.blocks) {
      const inlines =
        block.kind === "figure-sheet" ? block.description : "inlines" in block ? block.inlines : [];
      for (const inline of inlines) {
        if (/\bFIGURES?\s+\d|\bFig\.\s+\d/i.test(inline.text)) {
          expect(inline.kind).toBe("reference");
          if (inline.kind === "reference") {
            expect(inline.referenceType).toBe("figure");
          }
        }
      }
    }
  });

  test("binds every printed figure to an upright complete primary drawing sheet", () => {
    const serializedEdition = JSON.stringify(kilbyIntegratedCircuitArchivalEdition);
    for (const groupedCrop of ["page-1.png", "page-2.png", "page-3.png"]) {
      expect(serializedEdition).not.toContain(groupedCrop);
    }
    expect(kilbyIntegratedCircuitSourcePreviewPlan).toHaveLength(14);
    expect(
      kilbyIntegratedCircuitSourcePreviewPlan
        .filter((entry) => entry.figure.startsWith("Fig. 8"))
        .map((entry) => entry.figure),
    ).toEqual(["Fig. 8a", "Fig. 8b", "Fig. 8c"]);
    expect(
      kilbyIntegratedCircuitSourcePreviewPlan.every(
        (entry) => entry.orientation === "upright" && !entry.isolated && entry.completeSourceSheet,
      ),
    ).toBe(true);
    for (const entry of kilbyIntegratedCircuitSourcePreviewPlan) {
      expect(entry.targetSrc).toContain("source-sheet-");
      expect(entry.targetSrc).toContain(`source-sheet-${entry.page}-v1.png`);
    }
  });

  test("binds every authored Fig. 1 and Fig. 2 occurrence to their full source sheet", () => {
    const references = kilbyIntegratedCircuitArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.flatMap((inline) =>
            inline.kind === "reference" &&
            inline.referenceType === "figure" &&
            ["Fig. 1", "FIGURE 1", "Fig. 2", "FIGURE 2"].includes(inline.text)
              ? [inline]
              : [],
          )
        : [],
    );
    expect(references).toHaveLength(7);
    expect(
      new Set(
        references.map((reference) =>
          reference.kind === "reference" ? reference.figurePreviews?.[0]?.src : undefined,
        ),
      ),
    ).toEqual(
      new Set(["/patents/figures/us-3138743-kilby-integrated-circuit/source-sheet-1-v1.png"]),
    );
  });

  test("exposes all 25 printed claims via dynamic single-source lookup", () => {
    for (let c = 1; c <= 25; c++) {
      const textVal = manualKilbyClaimText(c);
      expect(textVal).toBeDefined();
      expect(textVal.length).toBeGreaterThan(20);
    }
  });

  test("keeps every catalogue decoder and dependency tied to the exact edition claim node", () => {
    const claimNumbers = new Set(
      kilbyIntegratedCircuitArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.number),
    );
    expect(kilbyIntegratedCircuitPatent.claims).toHaveLength(25);
    for (const claim of kilbyIntegratedCircuitPatent.claims) {
      expect(claim.originalText).toBe(manualKilbyClaimText(claim.number));
      expect(claim.plainEnglish.length).toBeGreaterThan(180);
      expect(claim.keyInnovations.length).toBeGreaterThanOrEqual(3);
      for (const dependency of claim.dependsOn ?? []) {
        expect(claimNumbers.has(dependency)).toBe(true);
      }
      if (claim.isIndependent) {
        expect(claim.dependsOn).toBeUndefined();
      }
    }
  });

  test("validates parallel readings map covers the archival paragraph blocks", () => {
    const paragraphIndexes = kilbyIntegratedCircuitArchivalEdition.blocks
      .map((block, idx) => (block.kind === "paragraph" ? idx : null))
      .filter((idx): idx is number => idx !== null);

    for (const idx of paragraphIndexes) {
      const readings = kilbyIntegratedCircuitParallelReadings[idx];
      expect(readings).toBeDefined();
      expect(readings?.length).toBeGreaterThan(0);
      expect(readings?.[0].trim().length).toBeGreaterThan(40);
    }
  });

  test("provides valid provenance classifications for all Kilby controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-3138743-kilby-integrated-circuit"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("accepts the complete review with all figure evidence", () => {
    const { evaluateArchivalPublicationState } = require("./publicationApproval");
    const decision = evaluateArchivalPublicationState(kilbyIntegratedCircuitPatent);
    expect(decision.isPublished).toBe(true);
    expect(decision.state.kind).toBe("accepted");
    expect(decision.reasonCode).toBe("ACCEPTED");
    expect(decision.figureManifest.acceptedFigureCount).toBe(47);
  });
});
