import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { evaluateArchivalPublicationState } from "@/data/editions/publicationApproval";
import { parsePatentCatalog } from "@/data/patents/schema";
import type { CuratedSpecificationInline } from "@/types/patent";
import { otisElevatorPatent } from "../patents/otis-elevator";
import { otisElevatorArchivalEdition } from "./otisElevatorEdition";
import { otisElevatorParallelReadings } from "./otisElevatorParallelReading";

const isFigureReference = (
  inline: CuratedSpecificationInline,
): inline is Extract<CuratedSpecificationInline, { kind: "reference" }> =>
  inline.kind === "reference" && inline.referenceType === "figure";

describe("otisElevatorArchivalEdition", () => {
  test("pins the reviewed facsimile and presents all four printed claims", () => {
    expect(validateCuratedSpecificationEdition(otisElevatorArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(otisElevatorArchivalEdition.sourcePdfSha256).toBe(
      "c35eb5c999bc20b015ef0d24a3ffb0f194123d780c8a46fabea7f2d52a355d42",
    );
    expect(
      otisElevatorArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((claim) => claim.number),
    ).toEqual([1, 2, 3, 4]);
  });

  test("gives every descriptive paragraph a substantial authored companion and every figure an exact full source sheet", () => {
    const expectedSourceSheet = "/patents/figures/us-31128-otis-elevator/source-sheet-1-v1.png";
    const figureReferences = otisElevatorArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "figure-sheet") return block.description.filter(isFigureReference);
      return "inlines" in block ? block.inlines.filter(isFigureReference) : [];
    });

    for (const [index, block] of otisElevatorArchivalEdition.blocks.entries()) {
      if (block.kind === "paragraph" && otisElevatorParallelReadings[index]) {
        expect(otisElevatorParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(20);
      }
    }

    for (const inline of figureReferences) {
      expect(inline.figurePreviews).toEqual([
        expect.objectContaining({
          src: expectedSourceSheet,
          width: 2320,
          height: 3408,
          alt: expect.stringContaining("Complete unmodified source drawing sheet 1"),
        }),
      ]);
    }

    expect(figureReferences).toHaveLength(8);
    expect(existsSync(resolve(process.cwd(), `public${expectedSourceSheet}`))).toBe(true);
  });

  test("keeps Fig. 3 on the complete sheet that preserves its relation to Figs. 1 and 2", () => {
    const fig3 = otisElevatorArchivalEdition.blocks
      .flatMap((block) =>
        block.kind === "paragraph"
          ? block.inlines.filter(
              (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
                inline.kind === "reference" && inline.referenceType === "figure",
            )
          : [],
      )
      .find((inline) => inline.text === "Fig. 3");

    expect(fig3).toBeDefined();
    if (fig3?.kind !== "reference") {
      throw new Error("Otis Fig. 3 must remain an authored source-figure reference.");
    }

    expect(fig3.figurePreviews).toEqual([
      expect.objectContaining({
        src: "/patents/figures/us-31128-otis-elevator/source-sheet-1-v1.png",
        width: 2320,
        height: 3408,
      }),
    ]);
  });

  test("preserves all prior Otis crops as legacy research assets", () => {
    const legacyAssets = [
      "figure-1-oriented-cw.png",
      "figure-1.png",
      "figure-2-oriented-cw.png",
      "figure-2.png",
      "figure-3-oriented-cw-v2.png",
      "figure-3-oriented-cw-v3.png",
      "figure-3-oriented-cw.png",
      "figure-3.png",
    ];

    for (const filename of legacyAssets) {
      expect(
        existsSync(
          resolve(process.cwd(), "public/patents/figures/us-31128-otis-elevator", filename),
        ),
      ).toBe(true);
    }
  });

  test("keeps the catalogue record in parity with the four-claim source edition", () => {
    expect(otisElevatorPatent.archivalEdition).toBe(otisElevatorArchivalEdition);
    expect(otisElevatorPatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3, 4]);
    expect(otisElevatorPatent.stats).toMatchObject({ totalClaims: 4, independentClaims: 4 });
    expect(otisElevatorPatent.originalTextAsset).toMatchObject({
      kind: "reviewed-transcription",
      pageCount: 3,
      url: "/patents/transcripts/us-31128-otis-elevator-reviewed.txt",
      sourcePdfSha256: otisElevatorArchivalEdition.sourcePdfSha256,
    });

    const editionClaims = otisElevatorArchivalEdition.blocks.filter(
      (b): b is Extract<typeof b, { kind: "claim" }> => b.kind === "claim",
    );
    expect(editionClaims.length).toBe(4);
    for (let i = 0; i < 4; i++) {
      const editionBlock = editionClaims[i];
      const expectedText = editionBlock.inlines.map((inl) => inl.text).join("");
      expect(otisElevatorPatent.claims[i].originalText).toBe(expectedText);
    }
  });

  test("binds canonical reviewed ledger with complete ordered page markers", () => {
    const { existsSync, readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const sourceAsset = otisElevatorPatent.originalTextAsset;
    expect(sourceAsset).toBeDefined();
    const ledgerPath = join(process.cwd(), `public${sourceAsset?.url}`);
    expect(existsSync(ledgerPath)).toBe(true);
    const ledger = readFileSync(ledgerPath, "utf8");
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 3 ---");
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 2 OF 3 ---");
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 3 OF 3 ---");
    expect(ledger).toContain("E. G. OTIS");
  });

  test("provides valid provenance classifications for all Otis controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-31128-otis-elevator"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({ driveCommand: 0, displayRatePct: 60 });
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("passes the catalogue schema with its reviewed transcript metadata", () => {
    expect(parsePatentCatalog([otisElevatorPatent])).toHaveLength(1);
  });

  test("accepts all eight source citations against full-sheet source-pixel evidence", () => {
    const decision = evaluateArchivalPublicationState(otisElevatorPatent);
    expect(decision.isPublished).toBe(true);
    expect(decision.reasonCode).toBe("ACCEPTED");
    expect(decision.state.evidence.ledgerContent.valid).toBe(true);
    expect(decision.state.evidence.ledgerContent.status).toBe("verified");
    expect(decision.figureManifest).toMatchObject({
      requiredFigureCount: 8,
      acceptedFigureCount: 8,
      attestation: {
        acceptedOccurrenceCount: 8,
        matchesEdition: true,
        matchesLocators: true,
      },
    });
    expect(decision.figureManifest.figures.every((figure) => figure.status === "accepted")).toBe(
      true,
    );
  });
});
