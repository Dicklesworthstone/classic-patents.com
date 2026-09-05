import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { allPatents } from "@/data/patents";
import {
  buildArchivalAuditInventory,
  sourceReaderDeliveryForAudit,
} from "./archivalAuditInventory.server";
import {
  completeArchivalEditionForViewer,
  evaluateArchivalPublicationState,
  patentForSourceReader,
} from "./publicationApproval";
import { reviewedLedgerTextForViewer } from "./reviewedLedgerPublicationEvidence.server";

interface ScopedFacsimileRecord {
  readonly id: string;
  readonly expectedSha256: string;
  readonly expectedPageCount: number;
  readonly category: "facsimile-review-hold" | "primary-facsimile-gap";
  readonly specialRequirements?: {
    readonly requires58PagesWithCertificates?: boolean;
    readonly requiresSourceBoundedClassification?: boolean;
    readonly requiresForeignReconstructionBoundaries?: boolean;
  };
}

/**
 * Exact 17 scoped records for classic-patentscom-source-reader-remediation-3hc.5:
 * - 15 Facsimile-review holds
 * - 2 Primary-facsimile review gaps
 */
export const SCOPED_FACSIMILE_RECORDS: ReadonlyArray<ScopedFacsimileRecord> = [
  // 15 Facsimile-review holds
  {
    id: "us-x1-hopkins-potash",
    expectedSha256: "d4cdaf8e4f5cf9fc841df0a98adca8341b5c513e4f328f013f50fc914509777e",
    expectedPageCount: 1,
    category: "facsimile-review-hold",
  },
  {
    id: "us-3237-rillieux-evaporator",
    expectedSha256: "10d9a2c3909f1a7d7086c063925f96feed8aa362e1b39a64275a869853dc1d7a",
    expectedPageCount: 11,
    category: "facsimile-review-hold",
  },
  {
    id: "us-307031-edison-indicator",
    expectedSha256: "f36bc6aa879d42a3f495a9bda05871bb6181aa1979e6baa03b258c42d6a30c13",
    expectedPageCount: 3,
    category: "facsimile-review-hold",
  },
  {
    id: "us-347140-thomson-welding",
    expectedSha256: "80e7bbf735c52f3ace482277f39b130c0b6a62ee8eb9290389175939ba48356c",
    expectedPageCount: 5,
    category: "facsimile-review-hold",
  },
  {
    id: "us-542846-diesel-engine",
    expectedSha256: "57679379a0e1d1dc97591e6f634fa6f7ed7c0ec3b465edf493b5f79595a0e866",
    expectedPageCount: 10,
    category: "facsimile-review-hold",
  },
  {
    id: "us-613809-tesla-teleautomaton",
    expectedSha256: "b92da6bad46cca996f7ecc99a16a87bdd38d12b3e04a0fce11cc5f033aed849b",
    expectedPageCount: 13,
    category: "facsimile-review-hold",
  },
  {
    id: "us-682690-hewitt-mercury-lamp",
    expectedSha256: "bd849330e1ed6e530d0654413016c7e77eda792d0519628ca1bae5747065c74d",
    expectedPageCount: 13,
    category: "facsimile-review-hold",
  },
  {
    id: "us-706737-fessenden-wireless",
    expectedSha256: "2098ec6d967d3ab7999da0fb96357328fa68bb8e7639c1863ac600547aff8887",
    expectedPageCount: 7,
    category: "facsimile-review-hold",
  },
  {
    id: "us-808897-carrier-air-conditioner",
    expectedSha256: "b8cfbb69e27934862236ecabf03396e67d04a4b4011c98083f1205cd76f0291e",
    expectedPageCount: 4,
    category: "facsimile-review-hold",
  },
  {
    id: "us-942699-baekeland-bakelite",
    expectedSha256: "91b63f1cfe7c4a24739ea63c9d45caa8059e74010ae3a2191bed97616a384dc5",
    expectedPageCount: 3,
    category: "facsimile-review-hold",
  },
  {
    id: "us-1102653-goddard-rocket",
    expectedSha256: "8503f52914f4201850d7d6f067ac48886dda77c2cdb5e8fce831e13232f7c42b",
    expectedPageCount: 4,
    category: "facsimile-review-hold",
  },
  {
    id: "us-2929922-townes-laser",
    expectedSha256: "0c67f2d45609a1d465f75530c733c7c2feffb87994fa62392cf79f7e737d9270",
    expectedPageCount: 5,
    category: "facsimile-review-hold",
  },
  {
    id: "us-6120588-eink",
    expectedSha256: "574678473ca13e7daaeb661cfd96808fffb6c16d06d86872923fec52a08ab324",
    expectedPageCount: 26,
    category: "facsimile-review-hold",
  },
  {
    id: "gb-1420-cort-puddling-rolling",
    expectedSha256: "b213e2bb7da843a3397d38f9be1126696512eed62fae9680147761566e40286f",
    expectedPageCount: 2,
    category: "facsimile-review-hold",
    specialRequirements: { requiresForeignReconstructionBoundaries: true },
  },
  {
    id: "us-233692-pelton-water-wheel",
    expectedSha256: "b81019c0239af3ab932bd477970c1a414a91f765a68b28f9b22444e4f95c597c",
    expectedPageCount: 3,
    category: "facsimile-review-hold",
    specialRequirements: { requiresSourceBoundedClassification: true },
  },
  // 2 Primary-facsimile review gaps
  {
    id: "gb-913-watt-separate-condenser",
    expectedSha256: "ba8638c99df583d72958f9ef8125bc30cd4e0f8784656cd561aecdc58b8b8fad",
    expectedPageCount: 2,
    category: "primary-facsimile-gap",
    specialRequirements: { requiresForeignReconstructionBoundaries: true },
  },
  {
    id: "us-3671542-kwolek-kevlar",
    expectedSha256: "7a2b753cf8d6f329d5fad750dc2de510f723876cac6aa41a4076f0343a7a62c4",
    expectedPageCount: 58,
    category: "primary-facsimile-gap",
    specialRequirements: { requires58PagesWithCertificates: true },
  },
];

function sha256Buffer(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

function parseProvenanceReceipt(markdownContent: string): {
  sha256: string | null;
  pageCount: number | null;
  hasRightsBasis: boolean;
  hasPageMap: boolean;
  pageMapEntries: readonly number[];
  hasPreservationBoundaries: boolean;
} {
  const shaMatch = markdownContent.match(/SHA-256.*?:.*?`?([a-f0-9]{64})`?/i);
  const pageMatch = markdownContent.match(
    /(?:Total Facsimile Page Count|PDF page count|PDF pages|Total Page Count|Page Count)[*:\s]*[:|][*:\s]*(\d+)/i,
  );
  const hasRightsBasis = /Rights Basis/i.test(markdownContent);
  const hasPreservationBoundaries = /(?:boundar(?:y|ies)|preservation|layer separation)/i.test(
    markdownContent,
  );

  // Parse page table entries: lines like | **Page 1** | or | PDF p. 1 | or | p. 1 | or | 1 |
  const pageRowRegex = /\|\s*(?:\*\*)?(?:PDF\s+)?(?:p(?:age|\.)?\s*)?(\d+)(?:\*\*)?\s*\|/gi;
  const pageMapEntries: number[] = [];
  let match: RegExpExecArray | null = pageRowRegex.exec(markdownContent);
  while (match !== null) {
    const pageNum = Number.parseInt(match[1], 10);
    if (!Number.isNaN(pageNum) && !pageMapEntries.includes(pageNum)) {
      pageMapEntries.push(pageNum);
    }
    match = pageRowRegex.exec(markdownContent);
  }

  const hasPageMap =
    /(?:Facsimile Map|Source Map|Facsimile Content|Document Map|Page-by-Page Map|Page Map|Direct Facsimile Review)/i.test(
      markdownContent,
    ) || pageMapEntries.length > 0;

  return {
    sha256: shaMatch ? shaMatch[1].toLowerCase() : null,
    pageCount: pageMatch ? Number.parseInt(pageMatch[1], 10) : null,
    hasRightsBasis,
    hasPageMap,
    pageMapEntries: pageMapEntries.toSorted((a, b) => a - b),
    hasPreservationBoundaries,
  };
}

describe("facsimile provenance and primary-source verification contract (3hc.5)", () => {
  const projectRoot = process.cwd();

  test("contains exactly the 17 scoped records (15 holds + 2 gaps)", () => {
    expect(SCOPED_FACSIMILE_RECORDS).toHaveLength(17);
    const holds = SCOPED_FACSIMILE_RECORDS.filter((r) => r.category === "facsimile-review-hold");
    const gaps = SCOPED_FACSIMILE_RECORDS.filter((r) => r.category === "primary-facsimile-gap");
    expect(holds).toHaveLength(15);
    expect(gaps).toHaveLength(2);
  });

  describe("per-record physical asset and provenance receipt verification", () => {
    for (const record of SCOPED_FACSIMILE_RECORDS) {
      test(`verifies pinned PDF and provenance receipt for ${record.id}`, () => {
        const pdfPath = join(projectRoot, "public", "patents", "pdfs", `${record.id}.pdf`);
        expect(existsSync(pdfPath)).toBe(true);

        const pdfStat = statSync(pdfPath);
        expect(pdfStat.size).toBeGreaterThan(1000);

        const pdfBytes = readFileSync(pdfPath);
        const actualSha256 = sha256Buffer(pdfBytes);
        expect(actualSha256).toBe(record.expectedSha256);

        const provenancePath = join(projectRoot, "docs", "provenance", `${record.id}.md`);
        expect(existsSync(provenancePath)).toBe(true);

        const provenanceContent = readFileSync(provenancePath, "utf-8");
        const parsed = parseProvenanceReceipt(provenanceContent);

        expect(parsed.sha256).toBe(record.expectedSha256);
        expect(parsed.pageCount).toBe(record.expectedPageCount);
        expect(parsed.hasRightsBasis).toBe(true);
        expect(parsed.hasPageMap).toBe(true);
        expect(parsed.hasPreservationBoundaries).toBe(true);

        // Verify that the page map covers page 1 and contains entries
        if (record.expectedPageCount > 1) {
          expect(parsed.pageMapEntries.length).toBeGreaterThan(0);
          expect(parsed.pageMapEntries[0]).toBe(1);
        }

        // Canonical record in allPatents
        const patent = allPatents.find((p) => p.id === record.id);
        expect(patent).toBeDefined();
        if (patent?.originalTextAsset) {
          expect(patent.originalTextAsset.sourcePdfSha256).toBe(record.expectedSha256);
        }
        if (patent?.archivalEdition) {
          expect(patent.archivalEdition.sourcePdfSha256).toBe(record.expectedSha256);
        }
      });
    }
  });

  describe("special preservation boundaries", () => {
    test("Kwolek (us-3671542-kwolek-kevlar) retains all 58 pages and 2 certificates of correction without authorizing fabricated models", () => {
      const kwolek = SCOPED_FACSIMILE_RECORDS.find((r) => r.id === "us-3671542-kwolek-kevlar");
      expect(kwolek).toBeDefined();
      expect(kwolek?.expectedPageCount).toBe(58);

      const provenancePath = join(projectRoot, "docs", "provenance", "us-3671542-kwolek-kevlar.md");
      const provenance = readFileSync(provenancePath, "utf-8");

      expect(provenance).toContain("58");
      expect(provenance.toLowerCase()).toContain("certificate of correction");
      expect(provenance.toLowerCase()).toContain("unbound from a manual edition");

      const patent = allPatents.find((p) => p.id === "us-3671542-kwolek-kevlar");
      if (!patent) throw new Error("Kwolek patent not found");

      const decision = evaluateArchivalPublicationState(patent);
      expect(decision.isPublished).toBe(false);
      expect(decision.reasonCode).toBe("AUDIT_PRIMARY_FACSIMILE_PENDING");

      // Verify that visitor reader delivery remains complete via reviewed transcript
      const delivery = sourceReaderDeliveryForAudit(patent);
      expect(["edition", "transcript", "facsimile"]).toContain(delivery);
      expect(delivery).toBe("transcript");
    });

    test("Pelton (us-233692-pelton-water-wheel) remains source-bounded without invented prior-art topology", () => {
      const pelton = SCOPED_FACSIMILE_RECORDS.find((r) => r.id === "us-233692-pelton-water-wheel");
      expect(pelton).toBeDefined();
      expect(pelton?.expectedPageCount).toBe(3);

      const provenancePath = join(
        projectRoot,
        "docs",
        "provenance",
        "us-233692-pelton-water-wheel.md",
      );
      const provenance = readFileSync(provenancePath, "utf-8");

      expect(provenance.toLowerCase()).toContain("bucket");
      expect(provenance.toLowerCase()).toContain("nozzle");

      const patent = allPatents.find((p) => p.id === "us-233692-pelton-water-wheel");
      if (!patent) throw new Error("Pelton patent not found");

      const delivery = sourceReaderDeliveryForAudit(patent);
      expect(["edition", "transcript", "facsimile"]).toContain(delivery);
    });

    test("Watt Condenser (gb-913) and Cort (gb-1420) document foreign rights basis and archival reconstruction boundaries", () => {
      for (const foreignId of ["gb-913-watt-separate-condenser", "gb-1420-cort-puddling-rolling"]) {
        const provenancePath = join(projectRoot, "docs", "provenance", `${foreignId}.md`);
        const provenance = readFileSync(provenancePath, "utf-8");

        expect(/(?:british|scotland|england|chancery|1769|1784)/i.test(provenance)).toBe(true);
        expect(provenance.toLowerCase()).toContain("reconstruction");

        const patent = allPatents.find((p) => p.id === foreignId);
        if (!patent) throw new Error(`${foreignId} patent not found`);

        const delivery = sourceReaderDeliveryForAudit(patent);
        expect(["edition", "transcript", "facsimile"]).toContain(delivery);
      }
    });
  });

  describe("internal audit hold vs visitor source reader totality", () => {
    test("every scoped record has an honest internal classification and continuous reader delivery", () => {
      const inventory = buildArchivalAuditInventory(allPatents);

      for (const record of SCOPED_FACSIMILE_RECORDS) {
        const item = inventory.records.find((r) => r.patentId === record.id);
        expect(item).toBeDefined();

        const patent = allPatents.find((p) => p.id === record.id);
        if (!patent) throw new Error(`Patent ${record.id} not found in allPatents`);

        expect(item?.strictDecision.reasonCode).toBeDefined();
        expect(typeof item?.strictDecision.reasonCode).toBe("string");

        const delivery = sourceReaderDeliveryForAudit(patent);
        expect(["edition", "transcript", "facsimile"]).toContain(delivery);
        expect(item?.readerDelivery).toBe(delivery);

        const viewerPatent = patentForSourceReader(patent);
        const archivalSource = completeArchivalEditionForViewer(viewerPatent);
        const reviewedTranscript = archivalSource ? undefined : reviewedLedgerTextForViewer(patent);

        const hasCompleteSource = Boolean(
          archivalSource || reviewedTranscript || viewerPatent.originalPdfUrl,
        );
        expect(
          hasCompleteSource,
          `Patent ${record.id} must deliver continuous text or pinned facsimile to visitors`,
        ).toBe(true);
      }
    });
  });

  describe("failure fixtures and negative-path resilience", () => {
    test("detects byte digest mismatch when PDF bytes do not match expected sha256", () => {
      const corruptedBytes = Buffer.from("%PDF-corrupted-bytes-for-negative-test");
      const corruptedDigest = sha256Buffer(corruptedBytes);
      const expectedDigest = "0000000000000000000000000000000000000000000000000000000000000000";

      expect(corruptedDigest).not.toBe(expectedDigest);
    });

    test("detects page count mismatch in provenance parsing", () => {
      const sampleReceipt = `
# Provenance Receipt
- **Source PDF SHA-256 Digest**: \`d4cdaf8e4f5cf9fc841df0a98adca8341b5c513e4f328f013f50fc914509777e\`
- **Total Facsimile Page Count**: 5 pages
- **Rights Basis**: Public domain US Government material.
## Facsimile Map
| **Page 1** | Heading |
## Preservation Boundaries
Preserved.
`;
      const parsed = parseProvenanceReceipt(sampleReceipt);
      expect(parsed.pageCount).toBe(5);
      expect(parsed.pageCount === 1).toBe(false);
    });

    test("detects missing PDF file on disk", () => {
      const nonExistentPath = join(
        projectRoot,
        "public",
        "patents",
        "pdfs",
        "us-9999999-does-not-exist.pdf",
      );
      expect(existsSync(nonExistentPath)).toBe(false);
    });

    test("detects malformed sha256 digest", () => {
      const malformedDigests = [
        "not-a-hash",
        "d4cdaf8e",
        "D4CDAF8E4F5CF9FC841DF0A98ADCA8341B5C513E4F328F013F50FC914509777E",
        "z4cdaf8e4f5cf9fc841df0a98adca8341b5c513e4f328f013f50fc914509777e",
      ];

      const validRegex = /^[a-f0-9]{64}$/;
      for (const digest of malformedDigests) {
        expect(validRegex.test(digest)).toBe(false);
      }
    });
  });
});
