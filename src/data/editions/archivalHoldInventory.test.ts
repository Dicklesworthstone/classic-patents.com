import { describe, expect, test } from "bun:test";
import {
  CATEGORY_REMEDIATION_BEADS,
  formatArchivalHoldInventoryMarkdown,
  generateArchivalHoldInventory,
} from "./archivalHoldInventory";

describe("archival hold inventory and partition contract (3hc.3)", () => {
  const report = generateArchivalHoldInventory();

  test("derives the exact catalogue totals and partition counts", () => {
    expect(report.totalPatents).toBe(103);
    expect(report.acceptedCount).toBe(89);
    expect(report.heldCount).toBe(14);

    // Exact 14-state disjoint reason-code partition (after figure acceptance):
    expect(report.categoryCounts["figure-related"]).toBe(0);
    expect(report.categoryCounts["facsimile-review-related"]).toBe(4);
    expect(report.categoryCounts["ledger-related"]).toBe(0);
    expect(report.categoryCounts["full-specification-related"]).toBe(6);
    expect(report.categoryCounts["claim-parity-related"]).toBe(0);
    expect(report.categoryCounts["reconstruction-quarantine"]).toBe(2);
    expect(report.categoryCounts["primary-facsimile-gap"]).toBe(2);

    const partitionSum =
      report.categoryCounts["figure-related"] +
      report.categoryCounts["facsimile-review-related"] +
      report.categoryCounts["ledger-related"] +
      report.categoryCounts["full-specification-related"] +
      report.categoryCounts["claim-parity-related"] +
      report.categoryCounts["reconstruction-quarantine"] +
      report.categoryCounts["primary-facsimile-gap"];

    expect(partitionSum).toBe(14);
  });

  test("proves every held patent delivers a complete source face in the reader", () => {
    const heldEntries = report.entries.filter((e) => e.category !== "accepted");
    expect(heldEntries.length).toBe(14);

    for (const entry of heldEntries) {
      expect(["edition", "transcript", "facsimile"]).toContain(entry.readerDeliveryMode);
      // A complete pinned facsimile is a real source face, not missing text.
    }

    const editionDeliveries = report.entries.filter(
      (e) => e.readerDeliveryMode === "edition",
    ).length;
    const transcriptDeliveries = report.entries.filter(
      (e) => e.readerDeliveryMode === "transcript",
    ).length;

    expect(editionDeliveries).toBe(89);
    const facsimileDeliveries = report.entries.filter(
      (e) => e.readerDeliveryMode === "facsimile",
    ).length;
    expect(transcriptDeliveries).toBe(12);
    expect(facsimileDeliveries).toBe(2);
    expect(editionDeliveries + transcriptDeliveries + facsimileDeliveries).toBe(103);
    const stackhouse = report.entries.find(
      (e) => e.patentId === "us-4068536-stackhouse-manipulator",
    );
    expect(stackhouse?.category).toBe("full-specification-related");
    expect(stackhouse?.readerDeliveryMode).toBe("transcript");
  });

  test("maps every hold category to its designated remediation task bead", () => {
    expect(CATEGORY_REMEDIATION_BEADS["figure-related"]).toBe(
      "classic-patentscom-source-reader-remediation-3hc.4",
    );
    expect(CATEGORY_REMEDIATION_BEADS["facsimile-review-related"]).toBe(
      "classic-patentscom-source-reader-remediation-3hc.5",
    );
    expect(CATEGORY_REMEDIATION_BEADS["primary-facsimile-gap"]).toBe(
      "classic-patentscom-source-reader-remediation-3hc.5",
    );
    expect(CATEGORY_REMEDIATION_BEADS["ledger-related"]).toBe(
      "classic-patentscom-source-reader-remediation-3hc.6",
    );
    expect(CATEGORY_REMEDIATION_BEADS["full-specification-related"]).toBe(
      "classic-patentscom-source-reader-remediation-3hc.6",
    );
    expect(CATEGORY_REMEDIATION_BEADS["claim-parity-related"]).toBe(
      "classic-patentscom-source-reader-remediation-3hc.6",
    );
    expect(CATEGORY_REMEDIATION_BEADS["reconstruction-quarantine"]).toBe(
      "classic-patentscom-source-reader-remediation-3hc.7",
    );
  });

  test("generates cleanly formatted markdown report containing all held entries", () => {
    const markdown = formatArchivalHoldInventoryMarkdown(report);
    expect(markdown).toContain(
      "# Classic Patents — Internal Archival Hold Inventory & Remediation Map",
    );
    expect(markdown).toContain("Total Catalogue Patents: 103");
    expect(markdown).toContain("Fully Accepted Editions: 89");
    expect(markdown).toContain("Under Remediation Review: 14");
    expect(markdown).toContain("classic-patentscom-source-reader-remediation-3hc.4");
    expect(markdown).toContain("classic-patentscom-source-reader-remediation-3hc.5");
    expect(markdown).toContain("classic-patentscom-source-reader-remediation-3hc.6");
    expect(markdown).toContain("classic-patentscom-source-reader-remediation-3hc.7");
  });
});
