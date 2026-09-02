import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { join } from "node:path";
import sharp from "sharp";
import { allPatents } from "@/data/patents";
import type { CuratedSpecificationEdition } from "@/types/patent";
import { ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS } from "./archivalFigureAcceptance";
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
      attestation: null,
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

  test("does not infer figure acceptance from a plausible preview path and dimensions", () => {
    const unacceptedFigureEdition: CuratedSpecificationEdition = {
      ...noClaimsOrDrawingsEdition,
      drawingStatus: undefined,
      blocks: [
        { kind: "masthead", lines: ["TEST PATENT"] },
        {
          kind: "paragraph",
          inlines: [
            { kind: "text", text: "The mechanism appears in " },
            {
              kind: "reference",
              text: "Fig. 1",
              href: "#figure-1",
              referenceType: "figure",
              label: "Test figure",
              figurePreviews: [
                {
                  src: "/patents/figures/test/fig-1-source-crop-v1.png",
                  alt: "A plausible but unaccepted source crop",
                  width: 800,
                  height: 600,
                },
              ],
            },
            { kind: "text", text: "." },
          ],
        },
      ],
    };
    const decision = evaluateTypedArchivalPublicationState(
      {
        id: "test-unaccepted-figure",
        archivalEdition: unacceptedFigureEdition,
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

    expect(decision.isPublished).toBe(false);
    expect(decision.state.kind).toBe("candidate");
    expect(decision.reasonCode).toBe("FIGURE_ACCEPTANCE_PENDING");
    expect(decision.figureManifest).toMatchObject({
      requiredFigureCount: 1,
      acceptedFigureCount: 0,
    });
    expect(decision.figureManifest.figures[0]).toMatchObject({
      status: "pending",
      assetSha256: null,
      reviewer: null,
      reviewedAt: null,
      rejectionReason:
        "This figure occurrence has no explicit digest-pinned acceptance attestation.",
    });
    expect(decision.figureManifest.attestation).toBeNull();
  });

  test("fails closed when an accepted edition changes its active crop path", () => {
    const teslaMotor = allPatents.find((patent) => patent.id === "us-381968-tesla-motor");
    if (!teslaMotor?.archivalEdition) throw new Error("Tesla motor edition not found");
    const changedPatent = structuredClone(teslaMotor);
    const reference = changedPatent.archivalEdition?.blocks
      .flatMap((block) => ("inlines" in block ? block.inlines : []))
      .find(
        (inline) =>
          inline.kind === "reference" &&
          inline.referenceType === "figure" &&
          inline.figurePreviews?.length,
      );
    if (reference?.kind !== "reference" || !reference.figurePreviews?.[0]) {
      throw new Error("Tesla motor accepted figure reference not found");
    }
    reference.figurePreviews[0].src =
      "/patents/figures/us-381968-tesla-motor/unreviewed-replacement.png";

    const decision = evaluateTypedArchivalPublicationState(changedPatent, {
      hasCompanionReadings: true,
    });
    expect(decision.isPublished).toBe(false);
    expect(decision.reasonCode).toBe("FIGURE_ACCEPTANCE_PENDING");
    expect(decision.figureManifest.acceptedFigureCount).toBe(0);
  });

  test("pins every explicitly accepted active asset by bytes and dimensions", async () => {
    const catalogueIds = new Set(allPatents.map((patent) => patent.id));
    let assetCount = 0;

    for (const [patentId, attestation] of Object.entries(ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS)) {
      expect(catalogueIds.has(patentId), `stale figure attestation for ${patentId}`).toBe(true);
      const patent = allPatents.find((candidate) => candidate.id === patentId);
      expect(patent?.archivalEdition?.sourcePdfSha256).toBe(attestation.sourcePdfSha256);
      const decision = patent ? evaluateArchivalPublicationState(patent) : undefined;
      expect(decision?.isPublished, `accepted figure attestation is held for ${patentId}`).toBe(
        true,
      );
      expect(decision?.figureManifest.acceptedFigureCount).toBe(
        attestation.acceptedOccurrenceCount,
      );
      expect(decision?.figureManifest.attestation).toEqual({
        sourcePdfSha256: attestation.sourcePdfSha256,
        reviewer: attestation.reviewer,
        reviewedAt: attestation.reviewedAt,
        acceptanceBasis: attestation.acceptanceBasis,
        acceptedOccurrenceCount: attestation.acceptedOccurrenceCount,
        acceptedAssetCount: Object.keys(attestation.assets).length,
        matchesEdition: true,
      });
      expect(
        decision?.figureManifest.figures.every(
          (figure) =>
            figure.status === "accepted" &&
            figure.reviewer === attestation.reviewer &&
            figure.reviewedAt === attestation.reviewedAt &&
            figure.assetSha256 !== null,
        ),
      ).toBe(true);

      for (const [publicUrl, asset] of Object.entries(attestation.assets)) {
        assetCount += 1;
        const path = join(process.cwd(), "public", publicUrl.replace(/^\//, ""));
        const bytes = new Uint8Array(await Bun.file(path).arrayBuffer());
        expect(createHash("sha256").update(bytes).digest("hex"), publicUrl).toBe(asset.sha256);
        const metadata = await sharp(path).metadata();
        expect(metadata.width, publicUrl).toBe(asset.width);
        expect(metadata.height, publicUrl).toBe(asset.height);
      }
    }

    expect(Object.keys(ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS)).toHaveLength(46);
    expect(assetCount).toBe(325);
  });
});
