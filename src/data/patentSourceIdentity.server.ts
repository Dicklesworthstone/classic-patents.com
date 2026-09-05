import { createHash } from "node:crypto";
import type { Patent } from "@/types/patent";

/** Identifies the authored source version, including its figure URLs. This is
 * not an asset-byte checksum or a claim that the source has been reviewed. */
export function patentSourceIdentity(patent: Patent): string {
  return createHash("sha256")
    .update(
      JSON.stringify({
        id: patent.id,
        pdf: patent.originalPdfUrl,
        ledger: patent.originalTextAsset,
        edition: patent.archivalEdition,
        claims: patent.claims.map((claim) => ({ number: claim.number, text: claim.originalText })),
      }),
    )
    .digest("hex");
}
