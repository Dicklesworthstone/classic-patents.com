import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fessendenWirelessPatent } from "@/data/patents/fessenden-wireless";
import {
  fessendenWirelessArchivalEdition,
  fessendenWirelessParallelReadings,
  manualFessendenClaimText,
} from "./fessendenWirelessEdition";
import { evaluateReviewedLedgerTextEvidence } from "./reviewedLedgerPublicationEvidence";

const expectedFigureCrops = [
  {
    src: "/patents/figures/us-706737-fessenden-wireless/source-sheet-1-v1.png",
    width: 2320,
    height: 3408,
    sha256: "80ac578d0928cde8a61c09923e343b1d4e1bba5a71e9e3314a33d7ba5f623ef6",
  },
  {
    src: "/patents/figures/us-706737-fessenden-wireless/fig-1-source-crop-v4.png",
    width: 1750,
    height: 405,
    sha256: "021748623e5ecc41a287550c510d7b6e37a77b6c2dcb47325ea374ab43344dec",
  },
  {
    src: "/patents/figures/us-706737-fessenden-wireless/fig-2-source-crop-v10.png",
    width: 700,
    height: 390,
    sha256: "20aae2019f91cfb1181d4f77a3bce8cb33f37c393b859d2591ef58bee824794f",
  },
  {
    src: "/patents/figures/us-706737-fessenden-wireless/fig-2-source-crop-v10-detail-v2.png",
    width: 180,
    height: 400,
    sha256: "5e2c10381fd673b59a21529b5a9e907c9a0da735c7fa4a447be987143a183c4d",
  },
  {
    src: "/patents/figures/us-706737-fessenden-wireless/fig-3-source-crop-v4.png",
    width: 690,
    height: 1300,
    sha256: "bd835c90ef650a9c07cf8237ece32ec7f78d70b5ffacc15d17f141933116b284",
  },
  {
    src: "/patents/figures/us-706737-fessenden-wireless/fig-3-source-crop-v4-detail-v2.png",
    width: 500,
    height: 470,
    sha256: "2ae4e56ff2ac373609d57706eff7d426ab2ac93b8e48c91b2851cd8e247da85d",
  },
  {
    src: "/patents/figures/us-706737-fessenden-wireless/fig-4-source-crop-v4.png",
    width: 500,
    height: 650,
    sha256: "37a48b93d74612b2f89557b702757ea161ba0bfe1108d844db2ff13c670d0b25",
  },
  {
    src: "/patents/figures/us-706737-fessenden-wireless/fig-5-source-crop-v4.png",
    width: 740,
    height: 1250,
    sha256: "0833c08f44ffdc165952d898c60be51f52220ebab5476a3ee197effa96dee89b",
  },
] as const;

function pngDimensions(bytes: Buffer): { width: number; height: number } {
  expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

describe("US 706,737 Reginald A. Fessenden Wireless Telegraphy Archival Edition Publication Contract", () => {
  const root = process.cwd();
  const pdfPath = resolve(root, "public/patents/pdfs/us-706737-fessenden-wireless.pdf");
  const ledgerPath = resolve(
    root,
    "public/patents/transcripts/us-706737-fessenden-wireless-reviewed.txt",
  );

  test("pins the immutable source PDF and matches SHA-256 digest", () => {
    expect(existsSync(pdfPath)).toBe(true);
    const pdfBuf = readFileSync(pdfPath);
    const digest = createHash("sha256").update(pdfBuf).digest("hex");
    expect(digest).toBe(fessendenWirelessArchivalEdition.sourcePdfSha256);
    expect(digest).toBe("2098ec6d967d3ab7999da0fb96357328fa68bb8e7639c1863ac600547aff8887");
  });

  test("pins every served source crop path, dimensions, and SHA-256", () => {
    const figureRefs = fessendenWirelessArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.filter(
            (inline): inline is Extract<typeof inline, { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    const served = figureRefs.flatMap((reference) => reference.figurePreviews ?? []);
    const servedSources = new Set(served.map((preview) => preview.src));
    expect(servedSources).toEqual(new Set(expectedFigureCrops.map((crop) => crop.src)));

    for (const expected of expectedFigureCrops) {
      const cropPath = resolve(root, "public", expected.src.slice(1));
      expect(existsSync(cropPath)).toBe(true);
      const bytes = readFileSync(cropPath);
      expect(bytes.length).toBeGreaterThan(1000);
      expect(pngDimensions(bytes)).toEqual({ width: expected.width, height: expected.height });
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(expected.sha256);

      const previews = served.filter((preview) => preview.src === expected.src);
      expect(previews.length).toBeGreaterThan(0);
      expect(previews.every((preview) => preview.width === expected.width)).toBe(true);
      expect(previews.every((preview) => preview.height === expected.height)).toBe(true);
    }
  });

  test("uses the complete pinned drawing sheet before supplemental Fig. 2 views", () => {
    const figureRefs = fessendenWirelessArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.filter(
            (inline): inline is Extract<typeof inline, { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    const fig2Refs = figureRefs.filter((reference) => reference.text === "Fig. 2");
    expect(fig2Refs).toHaveLength(2);
    const expected = new Set([
      "/patents/figures/us-706737-fessenden-wireless/source-sheet-1-v1.png",
      "/patents/figures/us-706737-fessenden-wireless/fig-2-source-crop-v10.png",
      "/patents/figures/us-706737-fessenden-wireless/fig-2-source-crop-v10-detail-v2.png",
    ]);
    for (const reference of fig2Refs) {
      expect(reference.figurePreviews?.[0]?.src).toBe(
        "/patents/figures/us-706737-fessenden-wireless/source-sheet-1-v1.png",
      );
      expect(new Set((reference.figurePreviews ?? []).map((preview) => preview.src))).toEqual(
        expected,
      );
    }
  });

  test("maps every printed figure occurrence to a semantic preview group without bare citations", () => {
    const figureRefs = fessendenWirelessArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.filter(
            (inline): inline is Extract<typeof inline, { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    expect(figureRefs.map((reference) => reference.text)).toEqual([
      "Figure 1",
      "Fig. 2",
      "Fig. 3",
      "Fig. 4",
      "Fig. 5",
      "Fig. 3",
      "Fig. 5",
      "Fig. 1",
      "Fig. 1",
      "Figs. 3 and 5",
      "Fig. 2",
      "Fig. 5",
      "Fig. 3",
    ]);
    for (const reference of figureRefs) {
      expect(reference.label?.length).toBeGreaterThan(20);
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      expect(reference.figurePreviews?.[0]?.src).toBe(
        "/patents/figures/us-706737-fessenden-wireless/source-sheet-1-v1.png",
      );
      for (const preview of reference.figurePreviews ?? []) {
        expect(existsSync(resolve(root, "public", preview.src.slice(1)))).toBe(true);
        expect(preview.width).toBeGreaterThan(0);
        expect(preview.height).toBeGreaterThan(0);
      }
    }

    const bareFigureCitations = fessendenWirelessArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.filter(
            (inline) => inline.kind === "text" && /\bFig(?:ure)?s?\.?\s*\d/.test(inline.text),
          )
        : [],
    );
    expect(bareFigureCitations).toEqual([]);
  });

  test("confirms reviewed transcript ledger exists and contains all 7 page markers", () => {
    expect(existsSync(ledgerPath)).toBe(true);
    const content = readFileSync(ledgerPath, "utf-8");
    for (let p = 1; p <= 7; p++) {
      expect(content).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${p} OF 7 ---`);
    }
    expect(content).toContain("REGINALD A. FESSENDEN");
    expect(content).toContain("WIRELESS TELEGRAPHY");
    expect(content).toContain("CLω²=1");
    expect(content).toContain("REGINALD A. FESSENDEN,");
    expect(content).toContain("W. B. FEARING,");
    expect(content).toContain("S. C. GRAY.");
  });

  test("exposes the 21 claims actually printed by the pinned facsimile", () => {
    const claimBlocks = fessendenWirelessArchivalEdition.blocks.filter(
      (block) => block.kind === "claim",
    );
    expect(claimBlocks).toHaveLength(21);

    for (let c = 1; c <= 21; c++) {
      const claimText = manualFessendenClaimText(c);
      expect(claimText).toBeDefined();
      expect(claimText.length).toBeGreaterThan(30);
    }

    expect(() => manualFessendenClaimText(22)).toThrow(
      "Claim 22 not found in fessendenWirelessArchivalEdition",
    );

    // The canonical record must remain a projection of the edition nodes.  In
    // particular, do not let a hand-maintained claim table drift from the
    // literal source face while the edition is being reconciled.
    expect(fessendenWirelessPatent.claims).toHaveLength(21);
    for (const number of Array.from({ length: 21 }, (_, index) => index + 1)) {
      const claim = fessendenWirelessPatent.claims.find((candidate) => candidate.number === number);
      expect(claim).toBeDefined();
      expect(claim?.originalText).toBe(manualFessendenClaimText(number));
    }
  });

  test("publishes the candidate edition with its review maturity disclosed", () => {
    expect(Boolean(fessendenWirelessArchivalEdition.completeFacsimileReviewed)).toBe(false);
    expect(fessendenWirelessPatent.archivalEdition).toBe(fessendenWirelessArchivalEdition);
  });

  test("pins the cloud-reconciled resonance equation and semantic figure corrections", () => {
    const sourceText = fessendenWirelessArchivalEdition.blocks
      .flatMap((block) => {
        if (block.kind === "masthead") return block.lines;
        if (block.kind === "paragraph" || block.kind === "claim") {
          return [block.inlines.map((inline) => inline.text).join("")];
        }
        return [];
      })
      .join(" ");
    expect(sourceText).toContain("CLω²=1");

    const figureRefs = fessendenWirelessArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.filter(
            (inline): inline is Extract<typeof inline, { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    expect(figureRefs.length).toBeGreaterThanOrEqual(10);
    expect(
      figureRefs.some((ref) => ref.text === "Fig. 4" && (ref.label?.includes("top plan") ?? false)),
    ).toBe(true);
    expect(
      figureRefs.some(
        (ref) => ref.text === "Fig. 5" && (ref.label?.includes("elevation") ?? false),
      ),
    ).toBe(true);
  });

  test("keeps the canonical drawing inventory aligned with the printed numeral labels", () => {
    const expectedLabels: Record<string, string[]> = {
      "Fig. 1": ["1", "2", "3", "10", "11"],
      "Fig. 2": ["12", "13", "14", "15", "16"],
      "Fig. 3": ["4", "5", "6", "7", "8"],
      "Fig. 4": ["4", "5", "6", "7"],
      "Fig. 5": ["9", "17"],
    };

    for (const drawing of fessendenWirelessPatent.drawings) {
      expect(drawing.callouts.map((callout) => callout.label)).toEqual(
        expectedLabels[drawing.figureNumber],
      );
      expect(new Set(drawing.callouts.map((callout) => callout.id)).size).toBe(
        drawing.callouts.length,
      );
      for (const callout of drawing.callouts) {
        expect(callout.figureRef).toBe(drawing.figureNumber);
        expect(callout.description).toContain(callout.label);
        expect(callout.x).toBeGreaterThanOrEqual(0);
        expect(callout.x).toBeLessThanOrEqual(100);
        expect(callout.y).toBeGreaterThanOrEqual(0);
        expect(callout.y).toBeLessThanOrEqual(100);
      }
    }
  });

  test("keeps the record excerpt literal where the specification identifies its improvements", () => {
    expect(fessendenWirelessPatent.originalText).toContain(
      "of which improvements the following is a specification.",
    );
    expect(fessendenWirelessPatent.originalText).not.toContain(
      "of which the following is a specification.",
    );
  });

  test("does not silently paraphrase source sentences in the archival edition", () => {
    const editionText = fessendenWirelessArchivalEdition.blocks
      .flatMap((block) => {
        if (block.kind === "masthead") return block.lines;
        if (block.kind === "paragraph" || block.kind === "claim") {
          return [block.inlines.map((inline) => inline.text).join("")];
        }
        return [];
      })
      .join(" ");

    expect(editionText).toContain(
      "By thus increasing the capacity and self-induction of either of them the frequency of the electric oscillations in the conductors, and consequently of the waves generated, will be sufficiently low",
    );
    expect(editionText).toContain("which is adjusted normally out of contact with the wire 12");
    expect(editionText).toContain(
      'grounded conductor" is meant a conductor grounded either directly or through a capacity, an inductance, or a resistance, so that the current in the conductor flows through the conductor to ground, and vice versa',
    );
  });

  test("keeps the late continuous-radiation and uniform-conductor passages literal to the ledger", () => {
    const ledger = readFileSync(ledgerPath, "utf-8");
    const evidence = evaluateReviewedLedgerTextEvidence(fessendenWirelessPatent, ledger);
    expect(evidence).toMatchObject({
      status: "verified",
      valid: true,
      authoredSectionCount: 56,
      coveredSectionCount: 56,
      missingSectionIndexes: [],
      missingClaimNumbers: [],
    });

    const editionText = fessendenWirelessArchivalEdition.blocks
      .flatMap((block) => {
        if (block.kind === "masthead") return block.lines;
        if (block.kind === "paragraph" || block.kind === "claim") {
          return [block.inlines.map((inline) => inline.text).join("")];
        }
        return [];
      })
      .join(" ");
    expect(editionText).toContain(
      "for with ten thousand sparks per second exciting a sending-conductor of a periodicity of ninety thousand it is evident",
    );
    expect(editionText).toContain(
      "Thus the radiation will be practically continuous, and the total energy of the first oscillation",
    );
    expect(editionText).toContain(
      "In practice it is found that substantial uniformity of distribution of capacity may be obtained",
    );
  });

  test("keeps the bounded pages 1-3 ledger and edition source-faithful", () => {
    const ledger = readFileSync(ledgerPath, "utf-8");
    const page1 = ledger.split("--- REVIEWED TRANSCRIPTION PAGE 2 OF 7 ---")[0];
    const page2 = ledger
      .split("--- REVIEWED TRANSCRIPTION PAGE 2 OF 7 ---")[1]
      ?.split("--- REVIEWED TRANSCRIPTION PAGE 3 OF 7 ---")[0];
    const page3 = ledger
      .split("--- REVIEWED TRANSCRIPTION PAGE 3 OF 7 ---")[1]
      ?.split("--- REVIEWED TRANSCRIPTION PAGE 4 OF 7 ---")[0];

    expect(page1).toContain("No. 706,737. Patented Aug. 12, 1902.");
    expect(page1).toContain("(Application filed May 29, 1901.)");
    expect(page1).toContain("(No Model.)");
    expect(page1).toContain("FIG. 1. FIG. 2. FIG. 3. FIG. 4. FIG. 5.");
    expect(page2).toContain("The terms sending-conductor and receiving-conductor");
    expect(page2).toContain("transformer-coils, armature-windings, &c.");
    expect(page2).toContain("application No. 62,303, filed May 29, 1901");
    expect(page2).toContain("supporting-rings 5, provided with hubs or central sockets 6");
    expect(page3).toContain("wire 8, in which coils or turns may be formed");
    expect(page2).not.toContain("rapidly-damped wave-train");
    expect(page3).not.toContain("side elevation of an antenna");

    const editionText = fessendenWirelessArchivalEdition.blocks
      .flatMap((block) => {
        if (block.kind === "masthead") return block.lines;
        if (block.kind === "paragraph" || block.kind === "claim") {
          return [block.inlines.map((inline) => inline.text).join("")];
        }
        return [];
      })
      .join(" ");
    expect(editionText).toContain("secured at their ends to supporting-rings 5");
    expect(editionText).toContain("formed of bamboo or other light non-conducting material");
    expect(editionText).not.toContain("rapidly-damped wave-train");
  });

  test("keeps the bounded pages 4-5 ledger and edition source-faithful", () => {
    const ledger = readFileSync(ledgerPath, "utf-8");
    const page4 = ledger
      .split("--- REVIEWED TRANSCRIPTION PAGE 4 OF 7 ---")[1]
      ?.split("--- REVIEWED TRANSCRIPTION PAGE 5 OF 7 ---")[0];
    const page5 = ledger
      .split("--- REVIEWED TRANSCRIPTION PAGE 5 OF 7 ---")[1]
      ?.split("--- REVIEWED TRANSCRIPTION PAGE 6 OF 7 ---")[0];

    expect(page4).toContain("Fifth, it is also essential that all iron magnetically influenced");
    expect(page4).toContain("fixed armature containing no iron");
    expect(page4).toContain("five hundred feet");
    expect(page4).toContain("either Figs. 3 and 5");
    expect(page4).not.toContain("voltage at the top of the sending-conductor is then a maximum");
    expect(page5).toContain("with a swell or enlargement 17");
    expect(page5).toContain('By the term "large capacity" as herein used');
    expect(page5).toContain("localized increase of capacity");
    expect(page5).toContain("CLω²=1");

    const editionText = fessendenWirelessArchivalEdition.blocks
      .flatMap((block) => {
        if (block.kind === "masthead") return block.lines;
        if (block.kind === "paragraph" || block.kind === "claim") {
          return [block.inlines.map((inline) => inline.text).join("")];
        }
        return [];
      })
      .join(" ");
    expect(editionText).toContain("fixed armature containing no iron");
    expect(editionText).toContain("five hundred feet");
    expect(editionText).toContain("with a swell or enlargement 17");
    expect(editionText).toContain("localized increase of capacity");

    const figureRefs = fessendenWirelessArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.filter(
            (inline): inline is Extract<typeof inline, { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    const preferredForms = figureRefs.find((reference) => reference.text === "Figs. 3 and 5");
    expect(preferredForms?.figurePreviews?.length).toBeGreaterThanOrEqual(2);
  });

  test("keeps bounded pages 6-7 claim-complete and attested", () => {
    const ledger = readFileSync(ledgerPath, "utf-8");
    const page6 = ledger
      .split("--- REVIEWED TRANSCRIPTION PAGE 6 OF 7 ---")[1]
      ?.split("--- REVIEWED TRANSCRIPTION PAGE 7 OF 7 ---")[0];
    const page7 = ledger.split("--- REVIEWED TRANSCRIPTION PAGE 7 OF 7 ---")[1];

    expect(page6).toContain("5. In a system for transmission of energy by electromagnetic waves");
    expect(page6).toContain("12. A system for signaling by electromagnetic waves");
    expect(page7).toContain("13. A sending-conductor for electromagnetic waves");
    expect(page7).toContain("21. A system for transmission of energy by electromagnetic waves");
    expect(page7).toContain("In testimony whereof I have hereunto set my hand.");
    expect(page7).toContain("REGINALD A. FESSENDEN,");
    expect(page7).toContain("W. B. FEARING,");
    expect(page7).toContain("S. C. GRAY.");

    const ledgerClaims = ledger
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => /^\d+\.\s/.test(line));
    expect(ledgerClaims).toHaveLength(21);
    expect(ledgerClaims.map((claim) => Number(claim.match(/^(\d+)\./)?.[1]))).toEqual(
      Array.from({ length: 21 }, (_, index) => index + 1),
    );
    for (const claim of ledgerClaims) {
      const number = Number(claim.match(/^(\d+)\./)?.[1]);
      expect(manualFessendenClaimText(number)).toBe(claim);
    }

    const annotatedClaimNumbers = [12, 14, 17, 18];
    for (const number of annotatedClaimNumbers) {
      const block = fessendenWirelessArchivalEdition.blocks.find(
        (candidate) => candidate.kind === "claim" && candidate.number === number,
      );
      expect(block?.kind).toBe("claim");
      expect(
        block?.kind === "claim" && block.inlines.some((inline) => inline.kind === "term"),
      ).toBe(true);
    }
  });

  test("validates parallel readings map covers the archival paragraph blocks", () => {
    const paragraphs = fessendenWirelessArchivalEdition.blocks
      .map((block, idx) => ({ block, idx }))
      .filter(({ block }) => block.kind === "paragraph");

    const keys = Object.keys(fessendenWirelessParallelReadings).map(Number);
    expect(keys.length).toBe(paragraphs.length);

    for (const { idx } of paragraphs) {
      const readings = fessendenWirelessParallelReadings[idx];
      expect(readings).toBeDefined();
      expect(readings?.length).toBeGreaterThan(0);
      expect(readings?.[0]?.length).toBeGreaterThan(20);
    }
  });

  test("provides valid provenance classifications for all Fessenden controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-706737-fessenden-wireless"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("registers explicit energy channel omission reason for Fessenden", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-706737-fessenden-wireless"]).toBeDefined();
    expect(energyChannelsFor("us-706737-fessenden-wireless", {})).toEqual([]);
  });

  test("enforces facsimile review pending audit hold in publication state registry", () => {
    const { evaluateTypedArchivalPublicationState } = require("./archivalPublicationState");
    const decision = evaluateTypedArchivalPublicationState(fessendenWirelessPatent, {
      hasCompanionReadings: true,
    });
    expect(decision.isPublished).toBe(false);
    expect(decision.state.kind).toBe("held");
    expect(decision.reasonCode).toBe("AUDIT_FACSIMILE_REVIEW_PENDING");
  });
});
