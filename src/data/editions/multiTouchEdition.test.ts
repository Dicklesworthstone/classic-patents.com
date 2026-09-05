import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  MULTI_TOUCH_PRESERVED_SOURCE_CROPS,
  manualMultiTouchClaimText,
  multiTouchArchivalEdition,
} from "@/data/editions/multiTouchEdition";
import { multiTouchPatent } from "@/data/patents/multitouch";
import {
  completeArchivalEditionForViewer,
  evaluateArchivalPublicationState,
} from "./publicationApproval";
import { evaluateReviewedLedgerTextEvidence } from "./reviewedLedgerPublicationEvidence";
import { reviewedLedgerTextForViewer } from "./reviewedLedgerPublicationEvidence.server";

const PINNED_SHA256 = "9b29747e60aad27302671e1be32fda99680c474d4e3a5ce0ffc93201460bfe1c";

describe("US 7,479,949 Apple Multi-Touch Heuristics Archival Edition Contract", () => {
  test("preserves a partial editorial draft without presenting it as complete", () => {
    const result = validateCuratedSpecificationEdition(multiTouchArchivalEdition);
    expect(result).toEqual({
      valid: false,
      errors: ["The archival edition must attest that the complete facsimile was reviewed."],
    });
    expect(multiTouchArchivalEdition.completeFacsimileReviewed).toBe(false);
    expect(multiTouchPatent.archivalEdition).toBe(multiTouchArchivalEdition);
    expect(multiTouchPatent.originalTextAsset).toBeDefined();
    expect(completeArchivalEditionForViewer(multiTouchPatent)).toBeUndefined();
    expect(reviewedLedgerTextForViewer(multiTouchPatent)).toStartWith(
      "--- REVIEWED TRANSCRIPTION PAGE 1 OF 364 ---",
    );
  });

  test("pinned PDF SHA-256 matches archival edition", () => {
    expect(multiTouchArchivalEdition.sourcePdfSha256).toBe(PINNED_SHA256);
    const pdfPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "pdfs",
      "us-7479949-multitouch.pdf",
    );
    expect(fs.existsSync(pdfPath)).toBe(true);
    const diskSha = createHash("sha256").update(fs.readFileSync(pdfPath)).digest("hex");
    expect(diskSha).toBe(PINNED_SHA256);
  });

  test("contains all 20 printed claims exactly matching manual claim text", () => {
    const claims = multiTouchArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claims.length).toBe(20);

    for (let i = 1; i <= 20; i++) {
      const claim = claims.find((c) => c.number === i);
      expect(claim).toBeDefined();
      if (claim?.kind !== "claim") throw new Error(`Missing claim ${i}`);
      expect(manualMultiTouchClaimText(i)).toBe(
        claim.inlines.map((inline) => inline.text).join(""),
      );
      expect(
        multiTouchPatent.claims.find((candidate) => candidate.number === i)?.originalText,
      ).toBe(manualMultiTouchClaimText(i));
    }
  });

  test("keeps the active held packet source-bounded and preserves correctly identified crop evidence", () => {
    const figurePreviews = multiTouchArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "paragraph") {
        return block.inlines.flatMap((inline) =>
          inline.kind === "reference" && inline.referenceType === "figure"
            ? (inline.figurePreviews ?? [])
            : [],
        );
      }
      return [];
    });

    expect(figurePreviews).toEqual([]);

    expect(MULTI_TOUCH_PRESERVED_SOURCE_CROPS).toEqual([
      expect.objectContaining({
        figure: "Figure 2",
        sourcePdfPage: 5,
        sourceSheet: "Sheet 3 of 293",
      }),
      expect.objectContaining({
        figure: "Figure 3A",
        sourcePdfPage: 6,
        sourceSheet: "Sheet 4 of 293",
      }),
      expect.objectContaining({
        figure: "Figure 3B",
        sourcePdfPage: 7,
        sourceSheet: "Sheet 5 of 293",
      }),
    ]);

    for (const [index, crop] of MULTI_TOUCH_PRESERVED_SOURCE_CROPS.entries()) {
      const fullPath = path.join(
        process.cwd(),
        "public",
        "patents",
        "figures",
        "us-7479949-multitouch",
        `fig-${index + 1}-source-crop-v1.png`,
      );
      expect(fs.existsSync(fullPath)).toBe(true);
      const buf = fs.readFileSync(fullPath);
      expect(buf.readUInt32BE(16)).toBe(crop.width);
      expect(buf.readUInt32BE(20)).toBe(crop.height);
    }
  });

  test("binds only directly checked front-page metadata and ledger-backed claims", () => {
    const masthead = multiTouchArchivalEdition.blocks.find((block) => block.kind === "masthead");
    expect(masthead?.kind).toBe("masthead");
    if (masthead?.kind !== "masthead") return;
    expect(masthead.lines).toEqual([
      "United States Patent",
      "Jobs et al.",
      "Patent No.: US 7,479,949 B2",
      "Date of Patent: *Jan. 20, 2009",
      "TOUCH SCREEN DEVICE, METHOD, AND GRAPHICAL USER INTERFACE FOR DETERMINING COMMANDS BY APPLYING HEURISTICS",
      "Assignee: Apple Inc., Cupertino, CA (US)",
      "Appl. No.: 12/101,832",
      "Filed: Apr. 11, 2008",
    ]);
    const paragraphIndexes = multiTouchArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(paragraphIndexes).toEqual([1]);
    expect(multiTouchArchivalEdition.blocks[1]).toMatchObject({
      kind: "paragraph",
      inlines: [{ text: "This patent is subject to a terminal disclaimer." }],
    });
    const ledger = reviewedLedgerTextForViewer(multiTouchPatent);
    const evidence = evaluateReviewedLedgerTextEvidence(multiTouchPatent, ledger ?? "");
    expect(evidence).toMatchObject({ valid: true, coverageFraction: 1, missingClaimNumbers: [] });
  });

  test("reviewed transcript ledger exists and contains page markers", () => {
    const transcriptPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "transcripts",
      "us-7479949-multitouch-reviewed.txt",
    );
    expect(fs.existsSync(transcriptPath)).toBe(true);
    const content = fs.readFileSync(transcriptPath, "utf-8");
    const matches = content.match(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF 364 ---/g);
    expect(matches).toBeDefined();
    expect(matches?.length).toBe(364);
  });

  test("does not treat preserved research figures as active source citations", () => {
    const decision = evaluateArchivalPublicationState(multiTouchPatent);
    expect(decision.figureManifest).toMatchObject({
      requiredFigureCount: 0,
      acceptedFigureCount: 0,
    });
    expect(decision.figureManifest.figures).toEqual([]);
  });
});
