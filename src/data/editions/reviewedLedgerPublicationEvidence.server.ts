import { readFileSync } from "node:fs";
import { isAbsolute, join, normalize, sep } from "node:path";
import type { Patent } from "@/types/patent";
import { ARCHIVAL_PUBLICATION_STATE_OVERRIDES } from "./archivalPublicationState";
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

function isKnownReconstructedTranscript(id: string | undefined): boolean {
  if (!id) return false;
  const reasonCode = ARCHIVAL_PUBLICATION_STATE_OVERRIDES[id]?.reasonCode;
  return (
    reasonCode === "FABRICATION_OR_RECONSTRUCTION_QUARANTINE" ||
    reasonCode === "AUDIT_RECONSTRUCTION_QUARANTINE"
  );
}

export function reviewedLedgerTextForViewer(
  patent: Pick<Patent, "id" | "originalTextAsset">,
): string | undefined {
  const asset = patent.originalTextAsset;
  // A derived legacy filename is only a convenience for records whose local
  // transcript remains usable source evidence. A known reconstruction is not
  // a ledger at all: its page must fall through to the already-pinned PDF.
  // This is a source-integrity choice, never an access gate.
  if (!asset && isKnownReconstructedTranscript(patent.id)) return undefined;
  const ledgerUrl =
    asset?.kind === "reviewed-transcription"
      ? asset.url
      : fallbackTranscriptUrlForPatent(patent.id);
  if (!ledgerUrl) return undefined;

  const ledgerPath = publicLedgerPath(ledgerUrl);
  if (!ledgerPath) return undefined;

  try {
    const transcript = readFileSync(ledgerPath, "utf8");
    // Validation remains part of the internal publication-evidence pipeline
    // below. It must never suppress a readable local primary-source transcript
    // from the visitor's source face: a malformed page marker is a repair task,
    // not a reason to hide the legal instrument.
    return transcript.trim().length > 0 ? transcript : undefined;
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
