import { readFileSync } from "node:fs";
import { isAbsolute, join, normalize, sep } from "node:path";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
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

/**
 * Returns the reviewed, page-complete transcript for the reader only when it
 * is the canonical local reviewed ledger. This intentionally does not depend
 * on publication approval or secondary editorial checks: those checks can
 * identify work still to do, but they must not turn already-readable patent
 * text into an empty source face.
 *
 * This is server-only. The caller passes the resulting plain string to the
 * reader; it never exposes source-asset metadata or a filesystem path to the
 * client.
 */
function fallbackTranscriptUrlForPatent(id: string | undefined): string | undefined {
  // Catalogue ids are authored data, but keep the derived local path narrow so
  // this viewer loader never turns an arbitrary string into a filesystem read.
  if (!id || !/^(?:us|gb)-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) return undefined;
  return `/patents/transcripts/${id}-reviewed.txt`;
}

function declaredTranscriptPageCount(transcript: string): number | undefined {
  const firstMarker = transcript.match(/^--- REVIEWED TRANSCRIPTION PAGE 1 OF (\d+) ---/);
  const pageCount = Number(firstMarker?.[1]);
  return Number.isSafeInteger(pageCount) && pageCount > 0 ? pageCount : undefined;
}

export function reviewedLedgerTextForViewer(
  patent: Pick<Patent, "id" | "originalTextAsset">,
): string | undefined {
  const asset = patent.originalTextAsset;
  const ledgerUrl =
    asset?.kind === "reviewed-transcription"
      ? asset.url
      : fallbackTranscriptUrlForPatent(patent.id);
  if (!ledgerUrl) return undefined;

  const ledgerPath = publicLedgerPath(ledgerUrl);
  if (!ledgerPath) return undefined;

  try {
    const transcript = readFileSync(ledgerPath, "utf8");
    const pageCount = declaredTranscriptPageCount(transcript);
    if (!pageCount || !validateReviewedTranscription(transcript, pageCount).valid) {
      return undefined;
    }
    return transcript;
  } catch {
    return undefined;
  }
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
