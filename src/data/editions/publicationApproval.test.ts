import { describe, expect, it } from "bun:test";
import { allPatents } from "@/data/patents";
import {
  archivalEditionForPublication,
  completeArchivalEditionForViewer,
  evaluateArchivalPublicationState,
  isArchivalEditionExplicitlyWithheld,
} from "./publicationApproval";

describe("Publication Approval State Machine", () => {
  it("authorizes publication for a verified, non-held text-only exemplar", () => {
    const nobel = allPatents.find((p) => p.id === "us-78317-nobel-dynamite");
    if (!nobel) throw new Error("Nobel dynamite patent not found");

    const decision = evaluateArchivalPublicationState(nobel);
    expect(decision.status).toBe("published");
    expect(decision.isPublished).toBe(true);
    expect(decision.publishedEdition).toBe(nobel.archivalEdition);
    expect(decision.reviewerAttestation.completeFacsimileReviewed).toBe(true);
    expect(decision.reviewerAttestation.hasCompanionReadings).toBe(true);
    expect(decision.reviewerAttestation.structuralValidationPassed).toBe(true);
    expect(decision.figureManifest.requiredFigureCount).toBe(0);
    expect(decision.figureManifest.acceptedFigureCount).toBe(0);
  });

  it("withholds a crop-attested edition until every occurrence has a source locator", () => {
    const renoEscalator = allPatents.find((p) => p.id === "us-470918-reno-escalator");
    if (!renoEscalator) throw new Error("Reno escalator patent not found");

    const decision = evaluateArchivalPublicationState(renoEscalator);
    expect(decision.status).toBe("withheld-pending-review");
    expect(decision.isPublished).toBe(false);
    expect(decision.reasonCode).toBe("FIGURE_ACCEPTANCE_PENDING");
    expect(decision.figureManifest.requiredFigureCount).toBeGreaterThan(0);
    expect(decision.figureManifest.acceptedFigureCount).toBe(0);
    expect(decision.figureManifest.attestation).toMatchObject({
      matchesEdition: true,
      matchesLocators: false,
    });
  });

  it("fail-closes and isolates quarantined patents (GB 931 Arkwright, GB 1306 Watt, US 4,068,536 Stackhouse)", () => {
    const arkwright = allPatents.find((p) => p.id === "gb-931-arkwright-water-frame");
    if (!arkwright) throw new Error("Arkwright patent not found");
    expect(isArchivalEditionExplicitlyWithheld("gb-931-arkwright-water-frame")).toBe(true);
    const arkwrightDecision = evaluateArchivalPublicationState(arkwright);
    expect(arkwrightDecision.status).toBe("withheld-reconstruction-quarantine");
    expect(arkwrightDecision.isPublished).toBe(false);
    expect(arkwrightDecision.reasonCode).toBe("FABRICATION_OR_RECONSTRUCTION_QUARANTINE");
    expect(archivalEditionForPublication(arkwright)).toBeUndefined();

    const watt = allPatents.find((p) => p.id === "gb-1306-watt-rotary-engine");
    if (!watt) throw new Error("Watt rotary patent not found");
    expect(isArchivalEditionExplicitlyWithheld("gb-1306-watt-rotary-engine")).toBe(true);
    const wattDecision = evaluateArchivalPublicationState(watt);
    expect(wattDecision.status).toBe("withheld-reconstruction-quarantine");
    expect(wattDecision.isPublished).toBe(false);
    expect(wattDecision.reasonCode).toBe("AUDIT_RECONSTRUCTION_QUARANTINE");
    expect(archivalEditionForPublication(watt)).toBeUndefined();

    const stackhouse = allPatents.find((p) => p.id === "us-4068536-stackhouse-manipulator");
    if (!stackhouse) throw new Error("Stackhouse patent not found");
    expect(isArchivalEditionExplicitlyWithheld("us-4068536-stackhouse-manipulator")).toBe(true);
    const stackhouseDecision = evaluateArchivalPublicationState(stackhouse);
    expect(stackhouseDecision.status).toBe("withheld-reconstruction-quarantine");
    expect(stackhouseDecision.isPublished).toBe(false);
    expect(stackhouseDecision.reasonCode).toBe("FABRICATION_OR_RECONSTRUCTION_QUARANTINE");
    expect(archivalEditionForPublication(stackhouse)).toBeUndefined();
  });

  it("identifies facsimile-only records without bound editions", () => {
    const fakePatent = {
      id: "test-facsimile-only",
      archivalEdition: undefined,
      originalPdfUrl: "/patents/pdfs/test-facsimile-only.pdf",
      claims: [],
    };
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
    const fakePatent = {
      id: "test-unreviewed",
      archivalEdition: unreviewedEdition,
      originalPdfUrl: "/patents/pdfs/test-unreviewed.pdf",
      claims: [],
    };
    const decision = evaluateArchivalPublicationState(fakePatent);
    expect(decision.status).toBe("withheld-pending-review");
    expect(decision.isPublished).toBe(false);
    expect(decision.reasonCode).toBe("PENDING_FACSIMILE_REVIEW");
  });

  it("keeps a held fully reviewed edition readable but routes an explicitly unfinished draft to its ledger", () => {
    const heldReviewed = allPatents.find((p) => p.id === "us-2981877-noyce-ic");
    const unfinished = allPatents.find((p) => p.id === "us-2708656-fermi-reactor");
    if (!heldReviewed || !unfinished) {
      throw new Error("Source-reader fixtures are missing from the catalogue.");
    }

    expect(heldReviewed.archivalEdition?.completeFacsimileReviewed).toBe(true);
    expect(completeArchivalEditionForViewer(heldReviewed)).toBe(heldReviewed.archivalEdition);
    expect(unfinished.archivalEdition?.completeFacsimileReviewed).toBe(false);
    expect(completeArchivalEditionForViewer(unfinished)).toBeUndefined();
  });
});
