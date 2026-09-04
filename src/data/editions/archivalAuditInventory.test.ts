import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { buildArchivalAuditInventory } from "./archivalAuditInventory.server";

describe("server-only archival audit inventory", () => {
  test("enumerates every catalogue record and every latent strict-audit figure occurrence", () => {
    const inventory = buildArchivalAuditInventory(allPatents);

    expect(inventory.schemaVersion).toBe("classic-patents.archival-audit-inventory.v1");
    expect(inventory.records).toHaveLength(103);
    expect(inventory.records.map((record) => record.patentId)).toEqual(
      inventory.records.map((record) => record.patentId).toSorted(),
    );
    expect(inventory.summary).toMatchObject({
      catalogueRecordCount: 103,
      acceptedRecordCount: 80,
      nonacceptedRecordCount: 23,
      primaryReasonCounts: {
        figure: 5,
        "facsimile-review": 8,
        ledger: 0,
        "full-specification": 5,
        "claim-parity": 0,
        reconstruction: 3,
        "primary-facsimile": 2,
        other: 0,
      },
      readerDeliveryCounts: { edition: 92, transcript: 11, facsimile: 0 },
      unacceptedFigureOccurrenceCount: 531,
      recordsWithAttestedFiguresMissingLocators: 3,
      recordsMissingFigureAttestationsAndLocators: 11,
    });
  }, 30000);

  test(
    "keeps latent evidence visible even when a stricter override is the primary reason",
    () => {
      const inventory = buildArchivalAuditInventory(allPatents);
      const fermi = inventory.records.find(
        (record) => record.patentId === "us-2708656-fermi-reactor",
      );
      if (!fermi) throw new Error("Fermi reactor is missing from the inventory");

      expect(fermi.strictDecision.reasonCode).toBe("AUDIT_FULL_SPECIFICATION_PENDING");
      expect(fermi.readerDelivery).toBe("transcript");
      expect(fermi.findings.some((finding) => finding.scope === "figure-occurrence")).toBe(true);
      expect(fermi.findings.some((finding) => finding.key.startsWith("ledger:"))).toBe(true);
    },
    { timeout: 30000 },
  );

  test(
    "never turns an internal audit hold into a missing source-reader delivery",
    () => {
      const inventory = buildArchivalAuditInventory(allPatents);
      for (const record of inventory.records) {
        expect(["edition", "transcript", "facsimile"]).toContain(record.readerDelivery);
      }

      const wright = inventory.records.find(
        (record) => record.patentId === "us-821393-wright-flyer",
      );
      if (!wright) throw new Error("Wright Flyer is missing from the inventory");
      expect(wright.strictDecision.isPublished).toBe(true);
      expect(wright.readerDelivery).toBe("edition");
    },
    { timeout: 30000 },
  );

  test(
    "is deterministic and contains no route or client-facing identifiers",
    () => {
      const first = buildArchivalAuditInventory(allPatents);
      const second = buildArchivalAuditInventory(allPatents);
      expect(JSON.stringify(first)).toBe(JSON.stringify(second));
      expect(JSON.stringify(first)).not.toContain("data-archival-publication-");
    },
    { timeout: 30000 },
  );
});
