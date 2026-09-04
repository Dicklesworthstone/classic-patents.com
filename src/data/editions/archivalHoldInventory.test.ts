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
    expect(report.acceptedCount).toBe(35);
    expect(report.heldCount).toBe(68);

    // Exact 68-state disjoint reason-code partition (after figure acceptance in 3hc.4):
    expect(report.categoryCounts["figure-related"]).toBe(48);
    expect(report.categoryCounts["facsimile-review-related"]).toBe(10);
    expect(report.categoryCounts["ledger-related"]).toBe(0);
    expect(report.categoryCounts["full-specification-related"]).toBe(5);
    expect(report.categoryCounts["claim-parity-related"]).toBe(0);
    expect(report.categoryCounts["reconstruction-quarantine"]).toBe(3);
    expect(report.categoryCounts["primary-facsimile-gap"]).toBe(2);

    const partitionSum =
      report.categoryCounts["figure-related"] +
      report.categoryCounts["facsimile-review-related"] +
      report.categoryCounts["ledger-related"] +
      report.categoryCounts["full-specification-related"] +
      report.categoryCounts["claim-parity-related"] +
      report.categoryCounts["reconstruction-quarantine"] +
      report.categoryCounts["primary-facsimile-gap"];

    expect(partitionSum).toBe(68);
  });

  test("proves every held patent delivers a complete source face in the reader", () => {
    const heldEntries = report.entries.filter((e) => e.category !== "accepted");
    expect(heldEntries.length).toBe(68);

    for (const entry of heldEntries) {
      expect(["edition", "transcript", "facsimile"]).toContain(entry.readerDeliveryMode);
      // No entry may ever withhold text or deliver empty/missing face
      expect(entry.readerDeliveryMode).not.toBe("facsimile"); // all 86 deliver edition or transcript
    }

    const editionDeliveries = report.entries.filter(
      (e) => e.readerDeliveryMode === "edition",
    ).length;
    const transcriptDeliveries = report.entries.filter(
      (e) => e.readerDeliveryMode === "transcript",
    ).length;

    expect(editionDeliveries).toBe(89);
    expect(transcriptDeliveries).toBe(14);
    expect(editionDeliveries + transcriptDeliveries).toBe(103);
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
    expect(markdown).toContain("Fully Accepted Editions: 35");
    expect(markdown).toContain("Under Remediation Review: 68");
    expect(markdown).toContain("classic-patentscom-source-reader-remediation-3hc.4");
    expect(markdown).toContain("classic-patentscom-source-reader-remediation-3hc.5");
    expect(markdown).toContain("classic-patentscom-source-reader-remediation-3hc.6");
    expect(markdown).toContain("classic-patentscom-source-reader-remediation-3hc.7");
  });
});
