import { describe, expect, it } from "bun:test";
import { allPatents } from "@/data/patents";
import {
  archivalEditionForPublication,
  evaluateArchivalPublicationState,
  isArchivalEditionExplicitlyWithheld,
} from "./publicationApproval";

describe("Publication Approval State Machine", () => {
  it("authorizes publication for a verified, non-held exemplar", () => {
    const teslaMotor = allPatents.find((p) => p.id === "us-381968-tesla-motor");
    if (!teslaMotor) throw new Error("Tesla motor patent not found");
    expect(teslaMotor).toBeDefined();

    const decision = evaluateArchivalPublicationState(teslaMotor);
    expect(decision.status).toBe("published");
    expect(decision.isPublished).toBe(true);
    expect(decision.publishedEdition).toBe(teslaMotor.archivalEdition);
    expect(decision.reviewerAttestation.completeFacsimileReviewed).toBe(true);
    expect(decision.reviewerAttestation.hasCompanionReadings).toBe(true);
    expect(decision.reviewerAttestation.structuralValidationPassed).toBe(true);
    expect(decision.figureManifest.acceptedFigureCount).toBe(
      decision.figureManifest.requiredFigureCount,
    );
  });

  it("fail-closes and isolates quarantined patents (e.g. GB 931 Arkwright)", () => {
    const arkwright = allPatents.find((p) => p.id === "gb-931-arkwright-water-frame");
    if (!arkwright) throw new Error("Arkwright patent not found");
    expect(arkwright).toBeDefined();

    expect(isArchivalEditionExplicitlyWithheld("gb-931-arkwright-water-frame")).toBe(true);
    const decision = evaluateArchivalPublicationState(arkwright);
    expect(decision.status).toBe("withheld-reconstruction-quarantine");
    expect(decision.isPublished).toBe(false);
    expect(decision.reasonCode).toBe("FABRICATION_OR_RECONSTRUCTION_QUARANTINE");
    expect(archivalEditionForPublication(arkwright)).toBeUndefined();
  });

  it("identifies facsimile-only records without bound editions", () => {
    const fakePatent = { id: "test-facsimile-only", archivalEdition: undefined };
    const decision = evaluateArchivalPublicationState(fakePatent);
    expect(decision.status).toBe("facsimile-only");
    expect(decision.isPublished).toBe(false);
    expect(decision.reasonCode).toBe("NO_EDITION_BOUND");
  });

  it("withholds unreviewed draft editions fail-closed", () => {
    const unreviewedEdition: any = {
      completeFacsimileReviewed: false,
      blocks: [],
      sourcePdfSha256: "abc",
      claimStatus: "complete",
      totalClaims: 1,
      witnessSignatures: [],
      attorneyOrAgentSignatures: [],
      inventorSignatures: [],
    };
    const fakePatent = { id: "test-unreviewed", archivalEdition: unreviewedEdition };
    const decision = evaluateArchivalPublicationState(fakePatent);
    expect(decision.status).toBe("withheld-pending-review");
    expect(decision.isPublished).toBe(false);
    expect(decision.reasonCode).toBe("PENDING_FACSIMILE_REVIEW");
  });
});
