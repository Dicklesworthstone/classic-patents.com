/**
 * archivalHoldInventory.ts
 *
 * Deterministic, server-side inventory of publication audit states and evidence requirements.
 *
 * This report classifies all catalogue records into their audit reason-code partitions
 * and links each hold to its remediation evidence and owning Bead.
 *
 * CRITICAL ARCHITECTURAL INVARIANT:
 * This inventory is strictly an internal editorial and CI quality-gate tracking instrument.
 * It NEVER drives visitor source visibility or withholds patent text from the reader.
 */

import type { Patent } from "@/types/patent";
import { allPatents } from "../patents";
import {
  ARCHIVAL_PUBLICATION_STATE_OVERRIDES,
  type ArchivalPublicationReasonCode,
  type ArchivalPublicationStateKind,
} from "./archivalPublicationState";
import {
  completeArchivalEditionForViewer,
  evaluateArchivalPublicationState,
  patentForSourceReader,
} from "./publicationApproval";
import { reviewedLedgerTextForViewer } from "./reviewedLedgerPublicationEvidence.server";

export type HoldCategoryPartition =
  | "figure-related"
  | "facsimile-review-related"
  | "ledger-related"
  | "full-specification-related"
  | "claim-parity-related"
  | "reconstruction-quarantine"
  | "primary-facsimile-gap"
  | "accepted";

export const CATEGORY_REMEDIATION_BEADS: Record<HoldCategoryPartition, string> = {
  "figure-related": "classic-patentscom-source-reader-remediation-3hc.4",
  "facsimile-review-related": "classic-patentscom-source-reader-remediation-3hc.5",
  "primary-facsimile-gap": "classic-patentscom-source-reader-remediation-3hc.5",
  "ledger-related": "classic-patentscom-source-reader-remediation-3hc.6",
  "full-specification-related": "classic-patentscom-source-reader-remediation-3hc.6",
  "claim-parity-related": "classic-patentscom-source-reader-remediation-3hc.6",
  "reconstruction-quarantine": "classic-patentscom-source-reader-remediation-3hc.7",
  accepted: "none",
};

export function categorizeHoldReason(reasonCode: string): HoldCategoryPartition {
  switch (reasonCode) {
    case "ACCEPTED":
      return "accepted";
    case "FIGURE_ACCEPTANCE_PENDING":
    case "AUDIT_FIGURE_ACCEPTANCE_PENDING":
      return "figure-related";
    case "AUDIT_FACSIMILE_REVIEW_PENDING":
    case "PENDING_FACSIMILE_REVIEW":
      return "facsimile-review-related";
    case "AUDIT_LEDGER_ACCEPTANCE_PENDING":
    case "MISSING_REVIEWED_LEDGER":
    case "MISSING_LEDGER_REVIEWER":
    case "MISSING_LEDGER_REVIEW_DATE":
    case "LEDGER_CONTENT_COVERAGE_INCOMPLETE":
      return "ledger-related";
    case "AUDIT_FULL_SPECIFICATION_PENDING":
      return "full-specification-related";
    case "AUDIT_CLAIM_PARITY_PENDING":
      return "claim-parity-related";
    case "AUDIT_RECONSTRUCTION_QUARANTINE":
    case "FABRICATION_OR_RECONSTRUCTION_QUARANTINE":
      return "reconstruction-quarantine";
    case "AUDIT_PRIMARY_FACSIMILE_PENDING":
      return "primary-facsimile-gap";
    default:
      return "figure-related";
  }
}

export interface ArchivalHoldInventoryEntry {
  patentId: string;
  patentNumber: string;
  title: string;
  editorialStatus: ArchivalPublicationStateKind;
  reasonCode: ArchivalPublicationReasonCode;
  category: HoldCategoryPartition;
  storedEditionState: "reviewed" | "unreviewed" | "none";
  readerDeliveryMode: "edition" | "transcript" | "facsimile";
  owningBead: string;
  remediationCategoryBead: string;
  evidenceSummary: string;
}

export interface ArchivalHoldInventoryReport {
  generatedAt: string;
  totalPatents: number;
  acceptedCount: number;
  heldCount: number;
  categoryCounts: Record<HoldCategoryPartition, number>;
  entries: ArchivalHoldInventoryEntry[];
}

export function generateArchivalHoldInventory(
  patents: readonly Patent[] = allPatents,
): ArchivalHoldInventoryReport {
  const entries: ArchivalHoldInventoryEntry[] = [];
  const categoryCounts: Record<HoldCategoryPartition, number> = {
    "figure-related": 0,
    "facsimile-review-related": 0,
    "ledger-related": 0,
    "full-specification-related": 0,
    "claim-parity-related": 0,
    "reconstruction-quarantine": 0,
    "primary-facsimile-gap": 0,
    accepted: 0,
  };

  for (const patent of patents) {
    const decision = evaluateArchivalPublicationState(patent);
    const category = categorizeHoldReason(decision.reasonCode);
    categoryCounts[category] += 1;

    const viewerPatent = patentForSourceReader(patent);
    const archivalSource = completeArchivalEditionForViewer(viewerPatent);
    // The evidence evaluator returns an object even when no ledger exists.
    // Count what the source reader can actually deliver.
    const hasLedger = Boolean(reviewedLedgerTextForViewer(patent));
    const readerDeliveryMode = archivalSource ? "edition" : hasLedger ? "transcript" : "facsimile";

    const storedEditionState = !patent.archivalEdition
      ? "none"
      : patent.archivalEdition.completeFacsimileReviewed
        ? "reviewed"
        : "unreviewed";

    const override = ARCHIVAL_PUBLICATION_STATE_OVERRIDES[patent.id];
    const owningBead = override?.auditIssue ?? CATEGORY_REMEDIATION_BEADS[category];
    const remediationCategoryBead = CATEGORY_REMEDIATION_BEADS[category];

    entries.push({
      patentId: patent.id,
      patentNumber: patent.patentNumber,
      title: patent.shortTitle,
      editorialStatus: decision.state.kind,
      reasonCode: decision.reasonCode,
      category,
      storedEditionState,
      readerDeliveryMode,
      owningBead,
      remediationCategoryBead,
      evidenceSummary: decision.explanation,
    });
  }

  // Stably sort entries chronologically / by patentId
  entries.sort((a, b) => a.patentId.localeCompare(b.patentId));

  return {
    generatedAt: new Date().toISOString(),
    totalPatents: patents.length,
    acceptedCount: categoryCounts.accepted,
    heldCount: patents.length - categoryCounts.accepted,
    categoryCounts,
    entries,
  };
}

export function formatArchivalHoldInventoryMarkdown(report: ArchivalHoldInventoryReport): string {
  const lines: string[] = [
    "# Classic Patents — Internal Archival Hold Inventory & Remediation Map",
    "",
    `Generated at: ${report.generatedAt}`,
    `Total Catalogue Patents: ${report.totalPatents}`,
    `Fully Accepted Editions: ${report.acceptedCount}`,
    `Under Remediation Review: ${report.heldCount}`,
    "",
    "## Disjoint Hold Category Partition",
    "",
    "| Hold Category | Count | Primary Remediation Bead |",
    "| --- | --- | --- |",
    `| Figure-related crop acceptance | ${report.categoryCounts["figure-related"]} | \`${CATEGORY_REMEDIATION_BEADS["figure-related"]}\` |`,
    `| Facsimile review pending | ${report.categoryCounts["facsimile-review-related"]} | \`${CATEGORY_REMEDIATION_BEADS["facsimile-review-related"]}\` |`,
    `| Primary facsimile gap | ${report.categoryCounts["primary-facsimile-gap"]} | \`${CATEGORY_REMEDIATION_BEADS["primary-facsimile-gap"]}\` |`,
    `| Ledger verification pending | ${report.categoryCounts["ledger-related"]} | \`${CATEGORY_REMEDIATION_BEADS["ledger-related"]}\` |`,
    `| Full specification review | ${report.categoryCounts["full-specification-related"]} | \`${CATEGORY_REMEDIATION_BEADS["full-specification-related"]}\` |`,
    `| Claim parity evidence | ${report.categoryCounts["claim-parity-related"]} | \`${CATEGORY_REMEDIATION_BEADS["claim-parity-related"]}\` |`,
    `| Reconstruction quarantine | ${report.categoryCounts["reconstruction-quarantine"]} | \`${CATEGORY_REMEDIATION_BEADS["reconstruction-quarantine"]}\` |`,
    `| **Total Non-Accepted Records** | **${report.heldCount}** | |`,
    "",
    "## Detailed Patent Audit Ledger",
    "",
    "| Patent ID | Number | Status | Reason Code | Category | Reader Mode | Remediation Task |",
    "| --- | --- | --- | --- | --- | --- | --- |",
  ];

  for (const entry of report.entries) {
    if (entry.category === "accepted") continue;
    lines.push(
      `| \`${entry.patentId}\` | ${entry.patentNumber} | ${entry.editorialStatus} | \`${entry.reasonCode}\` | ${entry.category} | **${entry.readerDeliveryMode}** | \`${entry.owningBead}\` |`,
    );
  }

  lines.push("");
  return lines.join("\n");
}
