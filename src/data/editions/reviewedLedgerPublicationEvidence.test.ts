import { describe, expect, test } from "bun:test";
import type { CuratedSpecificationEdition, Patent } from "@/types/patent";
import {
  evaluateReviewedLedgerTextEvidence,
  literalLedgerSectionsForEdition,
} from "./reviewedLedgerPublicationEvidence";
import { reviewedLedgerPublicationEvidenceFor } from "./reviewedLedgerPublicationEvidence.server";

const PAGE_MARKER = "--- REVIEWED TRANSCRIPTION PAGE 1 OF 1 ---";
const CLAIM_TEXT = "I claim the coupled arm and its electrically driven contact.";

const edition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "a".repeat(64),
  preparedBy: "Classic Patents test editor",
  preparedAt: "2026-09-02",
  completeFacsimileReviewed: true,
  blocks: [
    { kind: "masthead", lines: ["UNITED STATES PATENT OFFICE."] },
    {
      kind: "paragraph",
      inlines: [{ kind: "text", text: "An electro-magnetic apparatus couples both arms." }],
    },
    { kind: "claim", number: 1, inlines: [{ kind: "text", text: CLAIM_TEXT }] },
  ],
};

function fixture(overrides: Partial<Pick<Patent, "archivalEdition" | "originalTextAsset">> = {}) {
  return {
    archivalEdition: edition,
    originalTextAsset: {
      url: "/patents/transcripts/test-reviewed.txt",
      pageCount: 1,
      kind: "reviewed-transcription" as const,
      reviewedBy: "Test editor",
      reviewedAt: "2026-09-02",
      sourcePdfSha256: "a".repeat(64),
    },
    claims: [{ number: 1, originalText: CLAIM_TEXT }] as Patent["claims"],
    ...overrides,
  };
}

const COMPLETE_TRANSCRIPT = `${PAGE_MARKER}

UNITED STATES PATENT OFFICE.
An electro-\nmagnetic apparatus couples both arms.
${CLAIM_TEXT}`;

describe("reviewed-ledger publication evidence", () => {
  test("verifies page structure, every literal source section, and printed claims", () => {
    expect(literalLedgerSectionsForEdition(edition)).toHaveLength(3);
    expect(evaluateReviewedLedgerTextEvidence(fixture(), COMPLETE_TRANSCRIPT)).toEqual({
      status: "verified",
      valid: true,
      ledgerUrl: "/patents/transcripts/test-reviewed.txt",
      authoredSectionCount: 3,
      coveredSectionCount: 3,
      coverageFraction: 1,
      missingSectionIndexes: [],
      missingClaimNumbers: [],
      error: null,
    });
  });

  test("classifies malformed page markers before content coverage", () => {
    const evidence = evaluateReviewedLedgerTextEvidence(
      fixture(),
      COMPLETE_TRANSCRIPT.replace("PAGE 1 OF 1", "PAGE 1 OF 2"),
    );
    expect(evidence.status).toBe("invalid-page-ledger");
    expect(evidence.valid).toBe(false);
    expect(evidence.error).toContain("expected page 1 of 1");
  });

  test("rejects editorial drawing summaries even when all literal sections are present", () => {
    const evidence = evaluateReviewedLedgerTextEvidence(
      fixture(),
      `${COMPLETE_TRANSCRIPT}\n[DRAWING SHEET]`,
    );
    expect(evidence.status).toBe("editorial-placeholder");
    expect(evidence.coverageFraction).toBe(1);
    expect(evidence.error).toContain("substitutes editorial");
  });

  test("distinguishes materially short ledgers from same-length wrong text", () => {
    const short = evaluateReviewedLedgerTextEvidence(fixture(), `${PAGE_MARKER}\nArm.`);
    expect(short.status).toBe("materially-incomplete");
    expect(short.coveredSectionCount).toBe(0);

    const wrongLiteral = evaluateReviewedLedgerTextEvidence(
      fixture(),
      `${PAGE_MARKER}\n${"unrelated source words ".repeat(20)}`,
    );
    expect(wrongLiteral.status).toBe("literal-coverage-incomplete");
    expect(wrongLiteral.coverageFraction).toBe(0);
    expect(wrongLiteral.missingSectionIndexes).toEqual([0, 1, 2]);
    expect(wrongLiteral.missingClaimNumbers).toEqual([1]);
  });

  test("reports the exact missing edition section and canonical claim number", () => {
    const withoutClaim = COMPLETE_TRANSCRIPT.replace(
      CLAIM_TEXT,
      "Different claim wording. ".repeat(6),
    );
    const evidence = evaluateReviewedLedgerTextEvidence(fixture(), withoutClaim);
    expect(evidence.status).toBe("literal-coverage-incomplete");
    expect(evidence.missingSectionIndexes).toEqual([2]);
    expect(evidence.missingClaimNumbers).toEqual([1]);
    expect(evidence.coverageFraction).toBeCloseTo(2 / 3);
  });

  test("server loader rejects noncanonical and missing ledger paths without throwing", () => {
    const noncanonical = reviewedLedgerPublicationEvidenceFor(
      fixture({
        originalTextAsset: {
          ...fixture().originalTextAsset,
          url: "/etc/passwd",
        } as Patent["originalTextAsset"],
      }),
    );
    expect(noncanonical.status).toBe("noncanonical-url");

    const missing = reviewedLedgerPublicationEvidenceFor(
      fixture({
        originalTextAsset: {
          ...fixture().originalTextAsset,
          url: "/patents/transcripts/does-not-exist-reviewed.txt",
        } as Patent["originalTextAsset"],
      }),
    );
    expect(missing.status).toBe("missing-file");
    expect(missing.error).toBe("The reviewed-transcription file is missing.");
  });
});
