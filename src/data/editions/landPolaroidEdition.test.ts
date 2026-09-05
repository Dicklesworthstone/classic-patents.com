import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { landPolaroidPatent } from "@/data/patents/land-polaroid";
import {
  landPolaroidArchivalEdition,
  landPolaroidParallelReadings,
  manualLandClaimText,
} from "./landPolaroidEdition";
import {
  archivalEditionForPublication,
  isArchivalEditionExplicitlyWithheld,
} from "./publicationApproval";
import { evaluateReviewedLedgerTextEvidence } from "./reviewedLedgerPublicationEvidence";

const reviewedLedger = readFileSync(
  new URL(
    "../../../public/patents/transcripts/us-2543181-land-polaroid-reviewed.txt",
    import.meta.url,
  ),
  "utf8",
);

function normalizeClaimText(text: string): string {
  return text
    .replace(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF 32 ---/g, "")
    .replace(/-\s+(?=[a-z])/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function reconstructLedgerClaims(): {
  numbers: number[];
  textByNumber: Map<number, string>;
} {
  const numbers: number[] = [];
  const textByNumber = new Map<number, string>();
  let currentNumber: number | undefined;
  let currentParts: string[] = [];

  const flush = () => {
    if (currentNumber === undefined) return;
    textByNumber.set(currentNumber, currentParts.join(" "));
  };

  for (const line of reviewedLedger.split(/\r?\n/)) {
    const claimHeader = line.match(/^(\d+)\.\s+(.+)$/);
    if (claimHeader) {
      flush();
      currentNumber = Number(claimHeader[1]);
      numbers.push(currentNumber);
      currentParts = [claimHeader[2]];
      continue;
    }
    if (line.trim() === "EDWIN H. LAND." || line.startsWith("REFERENCES CITED")) {
      flush();
      currentNumber = undefined;
      break;
    }
    if (currentNumber !== undefined && !line.startsWith("--- REVIEWED TRANSCRIPTION PAGE ")) {
      const trimmed = line.trim();
      if (trimmed) currentParts.push(trimmed);
    }
  }
  flush();
  return { numbers, textByNumber };
}

describe("US 2,543,181 Edwin Land Polaroid published manual archival edition", () => {
  it("pins the draft to the correct PDF and serves it as the public source face", () => {
    expect(landPolaroidArchivalEdition.kind).toBe("manual-react-edition");
    expect(landPolaroidArchivalEdition.sourcePdfSha256).toBe(
      "4ee20338289f545608f472c50aa6ba8a7134f08fa377f1887e81f1e9bb5d4013",
    );
    expect(landPolaroidArchivalEdition.completeFacsimileReviewed).toBe(false);
    // Owner recalibration (2026-08-22): complete original texts publish even
    // with minor imperfections; holds are reserved for fabricated content.
    expect(isArchivalEditionExplicitlyWithheld(landPolaroidPatent.id)).toBe(false);
    expect(archivalEditionForPublication(landPolaroidPatent)).toBeUndefined();
    expect(landPolaroidPatent.archivalEdition).toBe(landPolaroidArchivalEdition);
    expect(landPolaroidPatent.originalTextAsset).toBeDefined();
  });

  it("retains all 116 staged claim nodes without treating them as reviewed publication text", () => {
    for (let c = 1; c <= 116; c++) {
      const claimText = manualLandClaimText(c);
      expect(claimText).toBeDefined();
      expect(claimText.length).toBeGreaterThan(10);
    }
  });

  it("makes every authored source block and claim literally available in the reviewed ledger", () => {
    const evidence = evaluateReviewedLedgerTextEvidence(landPolaroidPatent, reviewedLedger);
    expect(evidence.status).toBe("verified");
    expect(evidence.valid).toBe(true);
    expect(evidence.coverageFraction).toBe(1);
    expect(evidence.missingSectionIndexes).toEqual([]);
    expect(evidence.missingClaimNumbers).toEqual([]);
  });

  it("has exactly one ledger header per printed claim and matches the edition text", () => {
    const { numbers, textByNumber } = reconstructLedgerClaims();
    expect(numbers).toHaveLength(116);
    expect(new Set(numbers).size).toBe(116);
    expect(numbers).toEqual(Array.from({ length: 116 }, (_, index) => index + 1));

    for (let claimNumber = 1; claimNumber <= 116; claimNumber++) {
      const ledgerText = textByNumber.get(claimNumber);
      expect(ledgerText).toBeDefined();
      expect(normalizeClaimText(ledgerText ?? "")).toBe(
        normalizeClaimText(manualLandClaimText(claimNumber)),
      );
    }
  });

  it("provides distinct claim-specific decoders and concrete innovation signatures", () => {
    const claims = landPolaroidPatent.claims;
    expect(claims).toHaveLength(116);
    expect(claims.every((claim) => !claim.plainEnglish.startsWith("Refinement claim"))).toBe(true);
    expect(new Set(claims.map((claim) => claim.plainEnglish)).size).toBe(116);
    expect(new Set(claims.map((claim) => claim.keyInnovations.join(" | "))).size).toBe(116);

    const anchors: ReadonlyArray<readonly [number, string]> = [
      [1, "attached"],
      [21, "solution"],
      [35, "sheetlike"],
      [47, "silver halide"],
      [68, "film-forming colloid"],
      [79, "spreading"],
      [93, "sodium carboxymethyl cellulose"],
      [106, "dispensing passage"],
      [114, "hydroquinone"],
      [116, "adhesively secured"],
    ];
    for (const [number, anchor] of anchors) {
      const claim = claims.find((candidate) => candidate.number === number);
      expect(claim?.originalText.toLowerCase().replace(/-/g, " ")).toContain(
        anchor.toLowerCase().replace(/-/g, " "),
      );
      expect(claim?.plainEnglish.toLowerCase().replace(/-/g, " ")).toContain(
        anchor.toLowerCase().replace(/-/g, " "),
      );
    }
  });

  it("records every printed figure citation in the reconciled drawing list as an authored reference", () => {
    const references = landPolaroidArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.filter((inline) => inline.kind === "reference")
        : [],
    );
    expect(references.map((reference) => reference.text)).toEqual([
      "Figure 1",
      "Fig. 2",
      "Fig. 1",
      "Fig. 3",
      "Fig. 2",
      "Fig. 4",
      "Fig. 2",
      "Fig. 5",
      "Fig. 4",
      "Fig. 6",
      "Fig. 5",
      "Fig. 5",
      "Fig. 7",
      "Fig. 2",
      "Fig. 8",
      "Fig. 5",
      "Fig. 9",
      "Fig. 2",
      "Fig. 10",
      "Fig. 9",
      "Fig. 11",
      "Fig. 12",
      "Fig. 11",
      "Fig. 13",
      "Fig. 14",
      "Fig. 15",
      "Fig. 14",
      "Fig. 16",
      "Fig. 15",
      "Fig. 17",
      "Fig. 18",
      "Fig. 19",
      "Fig. 20",
      "Fig. 19",
      "Fig. 21",
      "Fig. 22",
      "Fig. 23",
      "Fig. 24",
      "Fig. 1",
      "Fig. 1",
      "Fig. 1",
      "Fig. 2",
      "Fig. 1",
      "Fig. 1",
      "Fig. 3",
      "1",
      "3",
      "4",
      "Fig. 9",
      "Fig. 9",
      "Fig. 9",
      "Fig. 10",
      "Fig. 11",
      "1",
      "3",
      "Fig. 3",
      "Fig. 12",
      "Fig. 11",
      "Fig. 11",
      "Fig. 11",
      "Fig. 13",
      "Figs. 14 to 17",
      "Fig. 14",
      "Fig. 14",
      "Figs. 14 and 15",
      "Fig. 16",
      "Fig. 17",
      "Fig. 14",
      "Fig. 18",
      "Fig. 20",
      "Fig. 18",
      "Fig. 20",
      "Fig. 21",
      "Fig. 22",
      "Fig. 14",
      "Fig. 21",
      "Fig. 23",
      "Fig. 24",
      "Fig. 23",
    ]);
    expect(references.every((reference) => reference.figurePreviews === undefined)).toBe(true);
  });

  it("covers every edition paragraph with exactly one current-index companion", () => {
    const paragraphIndexes = landPolaroidArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    const companionIndexes = Object.keys(landPolaroidParallelReadings)
      .map(Number)
      .sort((a, b) => a - b);
    expect(companionIndexes).toEqual(paragraphIndexes);
    for (const paragraphIndex of paragraphIndexes) {
      const reading = landPolaroidParallelReadings[paragraphIndex];
      expect(reading).toBeDefined();
      expect(reading?.join(" ").trim().length).toBeGreaterThan(40);
    }
  });

  it("retains the final inventor and references-cited formal matter in the edition and ledger", () => {
    const formalText = landPolaroidArchivalEdition.blocks
      .flatMap((block) => {
        if (block.kind === "paragraph") return block.inlines.map((inline) => inline.text);
        if (block.kind === "heading") return [block.text];
        return [];
      })
      .join("\n");
    expect(formalText).toContain("EDWIN H. LAND.");
    expect(formalText).toContain("REFERENCES CITED");
    expect(formalText).toContain("2,197,994 Butement — Apr. 23, 1940");
    expect(formalText).toContain("879,995 France — Mar. 5, 1942");
    expect(reviewedLedger).toContain("EDWIN H. LAND.");
    expect(reviewedLedger).toContain("REFERENCES CITED");
    expect(reviewedLedger).toContain("2,197,994 Butement — Apr. 23, 1940");
    expect(reviewedLedger).toContain("879,995 France — Mar. 5, 1942");
  });

  it("preserves the source's full diazonium introductory sentence", () => {
    const paragraphText = landPolaroidArchivalEdition.blocks
      .filter((block) => block.kind === "paragraph")
      .flatMap((block) => block.inlines.map((inline) => inline.text))
      .join("\n");
    expect(paragraphText).toContain(
      "The products of the present invention may be used in conjunction with, or may comprise as elements thereof, diazonium photosensitive layers.",
    );
    expect(paragraphText).toContain(
      "For example, a photosensitive product may be formed by having the physical structure of the photosensitive element 310 of",
    );
    expect(reviewedLedger).toContain(
      "The products of the present invention may be used in conjunction with, or may comprise as elements thereof, diazonium photosensitive layers.",
    );
  });

  it("retains the resolved Example 2 sodium-sulfite quantity", () => {
    const paragraphText = landPolaroidArchivalEdition.blocks
      .filter((block) => block.kind === "paragraph")
      .flatMap((block) => block.inlines.map((inline) => inline.text))
      .join("\n");
    expect(paragraphText).toContain("sodium sulfite — 7.0 grams");
    expect(reviewedLedger).toContain("sodium sulfite — 7.0 grams");
  });

  it("retains the literal visible drawing-sheet labels and signature matter for pages 1–8", () => {
    const drawingSheetMarkers = [
      "8 Sheets—Sheet 1.",
      "8 Sheets—Sheet 2.",
      "8 Sheets—Sheet 3.",
      "8 Sheets—Sheet 4.",
      "8 Sheets—Sheet 5.",
      "8 Sheets—Sheet 6.",
      "8 Sheets—Sheet 7.",
      "8 Sheets—Sheet 8.",
      "Permeable Anti-Halation Coating",
      "Ruptured Retaining Wall",
      "Opaque Barrier",
      "Frangible Container",
      "[handwritten signature: Edwin H. Land]",
      "[handwritten signature: Donald P. Brown]",
    ];
    for (const marker of drawingSheetMarkers) {
      expect(reviewedLedger).toContain(marker);
    }

    const figureSheets = landPolaroidArchivalEdition.blocks
      .filter((block) => block.kind === "figure-sheet")
      .map((block) => block.figureLabel);
    expect(figureSheets).toEqual([
      "FIGURES 1–4",
      "FIGURES 5–8",
      "FIGURES 9–10",
      "FIGURES 11–13",
      "FIGURES 14–17",
      "FIGURES 18–22",
      "FIGURES 23–24",
    ]);
  });

  it("provides valid provenance classifications for all Land controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-2543181-land-polaroid"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  it("registers explicit energy channel omission reason for Land Polaroid", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-2543181-land-polaroid"]).toBeDefined();
    expect(energyChannelsFor("us-2543181-land-polaroid", {})).toEqual([]);
  });

  it("enforces full specification pending audit hold in publication state registry", () => {
    const { evaluateTypedArchivalPublicationState } = require("./archivalPublicationState");
    const decision = evaluateTypedArchivalPublicationState(landPolaroidPatent, {
      hasCompanionReadings: true,
    });
    expect(decision.isPublished).toBe(false);
    expect(decision.state.kind).toBe("held");
    expect(decision.reasonCode).toBe("AUDIT_FULL_SPECIFICATION_PENDING");
  });
});
