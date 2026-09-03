import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const SHA256 = /^[a-f0-9]{64}$/;
const CATALOGUE_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type PinnedPdfByteVerificationReason =
  | "VERIFIED"
  | "DIGEST_MISMATCH"
  | "NONCANONICAL_PDF_PATH"
  | "MALFORMED_EXPECTED_DIGEST"
  | "MISSING_PDF"
  | "UNREADABLE_PDF";

export type PinnedPdfByteVerificationAvailability =
  | "verified"
  | "mismatch"
  | "unavailable"
  | "invalid";

export interface PinnedPdfByteVerification {
  readonly patentId: string;
  readonly canonicalPublicPdfUrl: string | null;
  readonly resolvedPdfPath: string | null;
  readonly expectedSha256: string | null;
  readonly actualSha256: string | null;
  readonly availability: PinnedPdfByteVerificationAvailability;
  readonly matchesExpected: boolean;
  readonly reason: PinnedPdfByteVerificationReason;
  readonly fromCache: boolean;
}

export interface VerifyPinnedPdfBytesOptions {
  /** Catalogue id used to derive the only permitted public PDF URL. */
  readonly patentId: string;
  /** Digest declared by the archival edition and reviewed ledger. */
  readonly expectedSha256: string;
  /** Must equal `/patents/pdfs/<patentId>.pdf`; defaults to that value. */
  readonly publicPdfUrl?: string;
  /** Server/build public root. This is injectable solely for isolated tests. */
  readonly publicRoot?: string;
}

interface CachedPdfDigest {
  readonly actualSha256: string;
}

const digestCache = new Map<string, CachedPdfDigest>();

function canonicalPublicPdfUrl(patentId: string): string | null {
  if (!CATALOGUE_ID.test(patentId)) return null;
  return `/patents/pdfs/${patentId}.pdf`;
}

function result(
  options: VerifyPinnedPdfBytesOptions,
  fields: Omit<PinnedPdfByteVerification, "patentId">,
): PinnedPdfByteVerification {
  return { patentId: options.patentId, ...fields };
}

/**
 * Hash the immutable, canonical local facsimile bytes on the server/build side.
 *
 * Only successful byte reads are cached, keyed by the resolved canonical path.
 * This keeps missing or unreadable assets retryable while avoiding repeated PDF
 * hashing during one static build. A fresh process (or the explicit test reset)
 * deliberately re-reads the pinned bytes.
 */
export function verifyPinnedPdfBytesSync(
  options: VerifyPinnedPdfBytesOptions,
): PinnedPdfByteVerification {
  const canonicalUrl = canonicalPublicPdfUrl(options.patentId);
  if (
    !canonicalUrl ||
    (options.publicPdfUrl !== undefined && options.publicPdfUrl !== canonicalUrl)
  ) {
    return result(options, {
      canonicalPublicPdfUrl: canonicalUrl,
      resolvedPdfPath: null,
      expectedSha256: SHA256.test(options.expectedSha256) ? options.expectedSha256 : null,
      actualSha256: null,
      availability: "invalid",
      matchesExpected: false,
      reason: "NONCANONICAL_PDF_PATH",
      fromCache: false,
    });
  }

  if (!SHA256.test(options.expectedSha256)) {
    return result(options, {
      canonicalPublicPdfUrl: canonicalUrl,
      resolvedPdfPath: null,
      expectedSha256: null,
      actualSha256: null,
      availability: "invalid",
      matchesExpected: false,
      reason: "MALFORMED_EXPECTED_DIGEST",
      fromCache: false,
    });
  }

  const publicRoot = resolve(options.publicRoot ?? join(process.cwd(), "public"));
  const resolvedPdfPath = resolve(publicRoot, canonicalUrl.slice(1));
  // `canonicalUrl` is constructed from a conservative id grammar, but retain an
  // explicit containment check as a refusal boundary if this module is refactored.
  if (!resolvedPdfPath.startsWith(`${publicRoot}/`)) {
    return result(options, {
      canonicalPublicPdfUrl: canonicalUrl,
      resolvedPdfPath: null,
      expectedSha256: options.expectedSha256,
      actualSha256: null,
      availability: "invalid",
      matchesExpected: false,
      reason: "NONCANONICAL_PDF_PATH",
      fromCache: false,
    });
  }

  const cached = digestCache.get(resolvedPdfPath);
  let actualSha256: string;
  let fromCache = false;
  if (cached) {
    actualSha256 = cached.actualSha256;
    fromCache = true;
  } else {
    try {
      const metadata = statSync(resolvedPdfPath);
      if (!metadata.isFile()) throw new Error("Pinned PDF path is not a regular file.");
      const bytes = readFileSync(resolvedPdfPath);
      actualSha256 = createHash("sha256").update(bytes).digest("hex");
      digestCache.set(resolvedPdfPath, { actualSha256 });
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? error.code : undefined;
      return result(options, {
        canonicalPublicPdfUrl: canonicalUrl,
        resolvedPdfPath,
        expectedSha256: options.expectedSha256,
        actualSha256: null,
        availability: "unavailable",
        matchesExpected: false,
        reason: code === "ENOENT" ? "MISSING_PDF" : "UNREADABLE_PDF",
        fromCache: false,
      });
    }
  }

  const matchesExpected = actualSha256 === options.expectedSha256;
  return result(options, {
    canonicalPublicPdfUrl: canonicalUrl,
    resolvedPdfPath,
    expectedSha256: options.expectedSha256,
    actualSha256,
    availability: matchesExpected ? "verified" : "mismatch",
    matchesExpected,
    reason: matchesExpected ? "VERIFIED" : "DIGEST_MISMATCH",
    fromCache,
  });
}

/** Async convenience for callers that already operate in an async pipeline. */
export async function verifyPinnedPdfBytes(
  options: VerifyPinnedPdfBytesOptions,
): Promise<PinnedPdfByteVerification> {
  return verifyPinnedPdfBytesSync(options);
}

/** Test-only cache reset for fixture mutation and isolated build-gate tests. */
export function clearPinnedPdfByteVerificationCacheForTests(): void {
  digestCache.clear();
}
