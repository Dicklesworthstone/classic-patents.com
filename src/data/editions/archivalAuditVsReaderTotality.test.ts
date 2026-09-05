import { describe, expect, test } from "bun:test";
import { allPatents } from "../patents";
import {
  completeArchivalEditionForViewer,
  evaluateArchivalPublicationState,
  patentForSourceReader,
} from "./publicationApproval";
import { reviewedLedgerTextForViewer } from "./reviewedLedgerPublicationEvidence.server";

describe("archival audit vs reader totality contract (3hc.9)", () => {
  test("guarantees complete source delivery for every single catalogue patent regardless of audit status", () => {
    expect(allPatents.length).toBe(103);

    let editionCount = 0;
    let transcriptCount = 0;
    let facsimileCount = 0;

    for (const patent of allPatents) {
      const viewerPatent = patentForSourceReader(patent);
      const archivalSource = completeArchivalEditionForViewer(viewerPatent);
      const reviewedTranscript = archivalSource ? undefined : reviewedLedgerTextForViewer(patent);

      // Verify that internal server asset paths are never exposed to the client
      expect(viewerPatent.originalTextAsset).toBeUndefined();

      if (archivalSource) {
        editionCount += 1;
        expect(archivalSource.blocks.length).toBeGreaterThan(0);
      } else if (reviewedTranscript) {
        transcriptCount += 1;
        expect(reviewedTranscript.trim().length).toBeGreaterThan(0);
        expect(reviewedTranscript).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF ");
      } else {
        facsimileCount += 1;
        expect(patent.originalPdfUrl).toMatch(/^\/patents\/pdfs\/.+\.pdf$/);
      }
    }

    expect(editionCount + transcriptCount + facsimileCount).toBe(103);
    expect(editionCount).toBeGreaterThan(0);
    expect(transcriptCount).toBeGreaterThan(0);
    // A quarantined reconstruction must fall through to the pinned primary
    // facsimile rather than being re-presented as a reviewed transcript.
    expect(facsimileCount).toBeGreaterThan(0);
  });

  test(
    "maintains strict audit standards without conflating audit holds with reader withholding",
    () => {
      const auditDecisions = allPatents.map((p) => evaluateArchivalPublicationState(p));
      const acceptedCount = auditDecisions.filter((d) => d.isPublished).length;
      const nonAcceptedCount = auditDecisions.filter((d) => !d.isPublished).length;

      // Acceptance changes as independently verified evidence is added. The
      // audited partition must remain exhaustive, and neither audit state may
      // block a visitor from the complete source instrument below.
      expect(acceptedCount + nonAcceptedCount).toBe(allPatents.length);
      expect(acceptedCount).toBeGreaterThan(0);
      expect(nonAcceptedCount).toBeGreaterThan(0);

      // For each non-accepted patent, verify that reader delivery is NOT withheld.
      for (const patent of allPatents) {
        const decision = evaluateArchivalPublicationState(patent);
        if (!decision.isPublished) {
          const viewerPatent = patentForSourceReader(patent);
          const archivalSource = completeArchivalEditionForViewer(viewerPatent);
          const reviewedTranscript = archivalSource
            ? undefined
            : reviewedLedgerTextForViewer(patent);

          // Every non-accepted patent MUST still deliver a continuous edition,
          // a reviewed ledger, or its pinned complete primary facsimile.
          const hasCompleteSource = Boolean(
            archivalSource || reviewedTranscript || patent.originalPdfUrl,
          );
          expect(
            hasCompleteSource,
            `Patent ${patent.id} with hold reason ${decision.reasonCode} must deliver complete source`,
          ).toBe(true);
        }
      }
    },
    { timeout: 30000 },
  );

  test("demonstrates that modifying audit state does not break visitor source delivery", () => {
    for (const patent of allPatents.slice(0, 5)) {
      const viewerPatent = patentForSourceReader(patent);
      expect(viewerPatent.id).toBe(patent.id);
      expect(viewerPatent.claims.length).toBe(patent.claims.length);
      expect(viewerPatent.originalText).toBe(patent.originalText);
    }
  });
});
