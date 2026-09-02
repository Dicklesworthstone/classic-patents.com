import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import type { CuratedSpecificationEdition } from "@/types/patent";
import {
  ARCHIVAL_PUBLICATION_STATE_OVERRIDES,
  evaluateTypedArchivalPublicationState,
} from "./archivalPublicationState";
import { evaluateArchivalPublicationState } from "./publicationApproval";

const DIGEST = "a".repeat(64);

const noClaimsOrDrawingsEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: DIGEST,
  preparedBy: "Classic Patents editorial review",
  preparedAt: "2026-09-02",
  completeFacsimileReviewed: true,
  claimStatus: {
    kind: "no-formal-claims-in-facsimile",
    evidence: "The reviewed primary record contains no separately numbered claims.",
  },
  drawingStatus: {
    kind: "no-drawings-in-facsimile",
    evidence: "The reviewed primary record contains no drawing sheet.",
  },
  blocks: [
    { kind: "masthead", lines: ["TEST PATENT"] },
    { kind: "paragraph", inlines: [{ kind: "text", text: "A reviewed text-only source." }] },
  ],
};

describe("typed archival publication state", () => {
  test("covers every live catalogue id and keeps every recorded audit exception restrictive", () => {
    const catalogueIds = new Set(allPatents.map((patent) => patent.id));
    expect(Object.keys(ARCHIVAL_PUBLICATION_STATE_OVERRIDES).length).toBeGreaterThan(0);

    for (const patent of allPatents) {
      const decision = evaluateArchivalPublicationState(patent);
      expect(decision.state.patentId).toBe(patent.id);
      expect(decision.reasonCode.length).toBeGreaterThan(0);
      expect(decision.state.evidence.evidenceReferences).toContain(patent.id);
    }

    for (const patentId of Object.keys(ARCHIVAL_PUBLICATION_STATE_OVERRIDES)) {
      expect(catalogueIds.has(patentId), `stale override for ${patentId}`).toBe(true);
      const patent = allPatents.find((candidate) => candidate.id === patentId);
      if (!patent) continue;
      expect(evaluateArchivalPublicationState(patent).isPublished).toBe(false);
    }
  });

  test("a restrictive audit override wins over otherwise accepted metadata", () => {
    const wright = allPatents.find((patent) => patent.id === "us-821393-wright-flyer");
    if (!wright) throw new Error("Wright flyer patent not found");

    const decision = evaluateArchivalPublicationState(wright);
    expect(decision.state.kind).toBe("held");
    expect(decision.reasonCode).toBe("AUDIT_FIGURE_ACCEPTANCE_PENDING");
    expect(decision.figureManifest.requiredFigureCount).toBeGreaterThan(0);
    expect(decision.state.evidence.evidenceReferences).toContain("beads:classic-patentscom-971");
  });

  test("does not mistake a no-claims/no-drawings primary record for an incomplete modern claim set", () => {
    const decision = evaluateTypedArchivalPublicationState(
      {
        id: "test-no-claims-or-drawings",
        archivalEdition: noClaimsOrDrawingsEdition,
        originalTextAsset: {
          url: "/patents/transcripts/test-reviewed.txt",
          pageCount: 1,
          kind: "reviewed-transcription",
          reviewedBy: "Classic Patents editorial review",
          reviewedAt: "2026-09-02",
          sourcePdfSha256: DIGEST,
        },
      },
      { hasCompanionReadings: true },
    );

    expect(decision.isPublished).toBe(true);
    expect(decision.state.evidence.claimDisposition).toBe("no-formal-claims");
    expect(decision.state.evidence.drawingDisposition).toBe("no-drawings");
    expect(decision.figureManifest).toEqual({
      requiredFigureCount: 0,
      acceptedFigureCount: 0,
      figures: [],
    });
  });

  test("fails closed immediately when the edition and ledger name different PDFs", () => {
    const decision = evaluateTypedArchivalPublicationState(
      {
        id: "test-digest-mismatch",
        archivalEdition: noClaimsOrDrawingsEdition,
        originalTextAsset: {
          url: "/patents/transcripts/test-reviewed.txt",
          pageCount: 1,
          kind: "reviewed-transcription",
          reviewedBy: "Classic Patents editorial review",
          reviewedAt: "2026-09-02",
          sourcePdfSha256: "b".repeat(64),
        },
      },
      { hasCompanionReadings: true },
    );

    expect(decision.isPublished).toBe(false);
    expect(decision.state.kind).toBe("held");
    expect(decision.reasonCode).toBe("SOURCE_DIGEST_MISMATCH");
  });
});
