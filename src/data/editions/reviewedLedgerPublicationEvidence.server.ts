import { readFileSync } from "node:fs";
import { isAbsolute, join, normalize, sep } from "node:path";
import type { Patent } from "@/types/patent";
import {
  evaluateReviewedLedgerTextEvidence,
  NO_REVIEWED_LEDGER_PUBLICATION_EVIDENCE,
  type ReviewedLedgerPublicationEvidence,
} from "./reviewedLedgerPublicationEvidence";

function publicLedgerPath(url: string): string | null {
  if (!url.startsWith("/patents/transcripts/") || !url.endsWith("-reviewed.txt")) return null;
  const relativePath = normalize(url.replace(/^\/+/, ""));
  if (
    isAbsolute(relativePath) ||
    relativePath.startsWith(`..${sep}`) ||
    relativePath.includes(`${sep}..${sep}`)
  ) {
    return null;
  }
  return join(process.cwd(), "public", relativePath);
}

/** Server/build-side loader. No ledger contents or filesystem module reaches the client. */
export function reviewedLedgerPublicationEvidenceFor(
  patent: Pick<Patent, "archivalEdition" | "claims" | "originalTextAsset">,
): ReviewedLedgerPublicationEvidence {
  const asset = patent.originalTextAsset;
  if (!patent.archivalEdition || asset?.kind !== "reviewed-transcription") {
    return {
      ...NO_REVIEWED_LEDGER_PUBLICATION_EVIDENCE,
      status: "missing-reviewed-ledger",
      ledgerUrl: asset?.url ?? null,
      error: "A manual edition requires a reviewed-transcription ledger.",
    };
  }

  const ledgerPath = publicLedgerPath(asset.url);
  if (!ledgerPath) {
    return {
      ...NO_REVIEWED_LEDGER_PUBLICATION_EVIDENCE,
      status: "noncanonical-url",
      ledgerUrl: asset.url,
      error: "The reviewed-transcription URL is not a canonical local reviewed-ledger path.",
    };
  }

  try {
    return evaluateReviewedLedgerTextEvidence(patent, readFileSync(ledgerPath, "utf8"));
  } catch (error) {
    const missing = error instanceof Error && "code" in error && error.code === "ENOENT";
    return {
      ...NO_REVIEWED_LEDGER_PUBLICATION_EVIDENCE,
      status: missing ? "missing-file" : "unreadable-file",
      ledgerUrl: asset.url,
      error: missing
        ? "The reviewed-transcription file is missing."
        : `The reviewed-transcription file could not be read: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
