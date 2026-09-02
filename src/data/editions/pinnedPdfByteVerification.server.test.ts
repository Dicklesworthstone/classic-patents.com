import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  clearPinnedPdfByteVerificationCacheForTests,
  verifyPinnedPdfBytes,
} from "./pinnedPdfByteVerification.server";

function sha256(bytes: string): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function fixturePublicRoot(patentId: string, bytes: string): string {
  const root = mkdtempSync(join(tmpdir(), "classic-patents-pinned-pdf-"));
  const pdfDirectory = join(root, "patents", "pdfs");
  mkdirSync(pdfDirectory, { recursive: true });
  writeFileSync(join(pdfDirectory, `${patentId}.pdf`), bytes);
  return root;
}

describe("verifyPinnedPdfBytes", () => {
  test("hashes the canonical PDF and caches a successful verified read", async () => {
    clearPinnedPdfByteVerificationCacheForTests();
    const patentId = "us-123-example";
    const bytes = "%PDF-test-one";
    const publicRoot = fixturePublicRoot(patentId, bytes);

    const first = await verifyPinnedPdfBytes({
      patentId,
      expectedSha256: sha256(bytes),
      publicRoot,
    });
    const second = await verifyPinnedPdfBytes({
      patentId,
      expectedSha256: sha256(bytes),
      publicRoot,
    });

    expect(first).toMatchObject({
      canonicalPublicPdfUrl: `/patents/pdfs/${patentId}.pdf`,
      expectedSha256: sha256(bytes),
      actualSha256: sha256(bytes),
      availability: "verified",
      matchesExpected: true,
      reason: "VERIFIED",
      fromCache: false,
    });
    expect(second.fromCache).toBe(true);
    expect(second.actualSha256).toBe(sha256(bytes));
  });

  test("reports changed fixture bytes as a digest mismatch after an explicit fresh build-gate read", async () => {
    clearPinnedPdfByteVerificationCacheForTests();
    const patentId = "us-124-changed-fixture";
    const originalBytes = "%PDF-original";
    const changedBytes = "%PDF-changed";
    const publicRoot = fixturePublicRoot(patentId, originalBytes);
    const pdfPath = join(publicRoot, "patents", "pdfs", `${patentId}.pdf`);

    expect(
      (
        await verifyPinnedPdfBytes({
          patentId,
          expectedSha256: sha256(originalBytes),
          publicRoot,
        })
      ).availability,
    ).toBe("verified");

    writeFileSync(pdfPath, changedBytes);
    clearPinnedPdfByteVerificationCacheForTests();
    const changed = await verifyPinnedPdfBytes({
      patentId,
      expectedSha256: sha256(originalBytes),
      publicRoot,
    });

    expect(changed).toMatchObject({
      actualSha256: sha256(changedBytes),
      availability: "mismatch",
      matchesExpected: false,
      reason: "DIGEST_MISMATCH",
      fromCache: false,
    });
  });

  test("does not share cached digests between canonical paths", async () => {
    clearPinnedPdfByteVerificationCacheForTests();
    const patentId = "us-125-cache-isolation";
    const leftBytes = "%PDF-left";
    const rightBytes = "%PDF-right";
    const leftRoot = fixturePublicRoot(patentId, leftBytes);
    const rightRoot = fixturePublicRoot(patentId, rightBytes);

    const left = await verifyPinnedPdfBytes({
      patentId,
      expectedSha256: sha256(leftBytes),
      publicRoot: leftRoot,
    });
    const right = await verifyPinnedPdfBytes({
      patentId,
      expectedSha256: sha256(rightBytes),
      publicRoot: rightRoot,
    });

    expect(left.fromCache).toBe(false);
    expect(right.fromCache).toBe(false);
    expect(left.actualSha256).toBe(sha256(leftBytes));
    expect(right.actualSha256).toBe(sha256(rightBytes));
  });

  test("refuses noncanonical requested paths and malformed expected digests before disk access", async () => {
    clearPinnedPdfByteVerificationCacheForTests();
    const patentId = "us-126-refusal";
    const publicRoot = fixturePublicRoot(patentId, "%PDF-refusal");

    const noncanonical = await verifyPinnedPdfBytes({
      patentId,
      expectedSha256: sha256("%PDF-refusal"),
      publicPdfUrl: "/patents/pdfs/other.pdf",
      publicRoot,
    });
    const malformedDigest = await verifyPinnedPdfBytes({
      patentId,
      expectedSha256: "UPPERCASE-NOT-A-DIGEST",
      publicRoot,
    });
    const malformedId = await verifyPinnedPdfBytes({
      patentId: "../escape",
      expectedSha256: sha256("%PDF-refusal"),
      publicRoot,
    });

    expect(noncanonical).toMatchObject({
      availability: "invalid",
      reason: "NONCANONICAL_PDF_PATH",
      resolvedPdfPath: null,
    });
    expect(malformedDigest).toMatchObject({
      availability: "invalid",
      reason: "MALFORMED_EXPECTED_DIGEST",
      expectedSha256: null,
      resolvedPdfPath: null,
    });
    expect(malformedId).toMatchObject({
      availability: "invalid",
      reason: "NONCANONICAL_PDF_PATH",
      canonicalPublicPdfUrl: null,
    });
  });

  test("keeps missing and unreadable canonical assets unavailable and uncached", async () => {
    clearPinnedPdfByteVerificationCacheForTests();
    const patentId = "us-127-missing";
    const publicRoot = mkdtempSync(join(tmpdir(), "classic-patents-pinned-pdf-missing-"));
    const expectedSha256 = sha256("missing");

    const missing = await verifyPinnedPdfBytes({ patentId, expectedSha256, publicRoot });
    mkdirSync(join(publicRoot, "patents", "pdfs", `${patentId}.pdf`), { recursive: true });
    const unreadable = await verifyPinnedPdfBytes({ patentId, expectedSha256, publicRoot });

    expect(missing).toMatchObject({
      availability: "unavailable",
      reason: "MISSING_PDF",
      actualSha256: null,
      fromCache: false,
    });
    expect(unreadable).toMatchObject({
      availability: "unavailable",
      reason: "UNREADABLE_PDF",
      actualSha256: null,
      fromCache: false,
    });
  });
});
