import type { Patent } from "@/types/patent";
import { formatPatentDate } from "./patentDate";

/**
 * Formats an inventor's full name ("Orville Wright") into "Last, First" ("Wright, Orville").
 * Handles multi-word given names ("Thomas Alva Edison" -> "Edison, Thomas Alva").
 */
export function formatAuthorLastFirst(name: string): string {
  const trimmed = name.trim();
  if (!trimmed || trimmed.includes(",")) return trimmed;
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return trimmed;
  const lastName = parts[parts.length - 1];
  const givenNames = parts.slice(0, -1).join(" ");
  return `${lastName}, ${givenNames}`;
}

/**
 * Formats a list of inventors according to Chicago Manual of Style (Notes & Bibliography):
 * - 1 author: "Edison, Thomas Alva."
 * - 2 authors: "Wright, Orville, and Wilbur Wright."
 * - 3+ authors: "Bardeen, John, Walter H. Brattain, and William Shockley."
 */
export function formatChicagoAuthors(inventors: string[]): string {
  if (inventors.length === 0) return "";
  if (inventors.length === 1) return formatAuthorLastFirst(inventors[0]);
  if (inventors.length === 2) {
    return `${formatAuthorLastFirst(inventors[0])}, and ${inventors[1]}`;
  }
  const first = formatAuthorLastFirst(inventors[0]);
  const middle = inventors.slice(1, -1).join(", ");
  const last = inventors[inventors.length - 1];
  return `${first}, ${middle}, and ${last}`;
}

/**
 * Generates a pristine BibTeX citation entry for a patent.
 */
export function generateBibtexCitation(patent: Patent): string {
  const inventorNamesBibtex = patent.inventors.join(" and ");
  const [year, month, day] = patent.grantDate.split("-");

  return `@patent{${patent.id},
  author    = {${inventorNamesBibtex}},
  title     = {${patent.title}},
  number    = {${patent.patentNumber}},
  year      = {${year}},
  month     = {${month}},
  day       = {${day}},
  url       = {https://classic-patents.com/patents/${patent.id}},
  note      = {Classic Patents Digital Museum}
}`;
}

/**
 * Generates an APA 7th edition reference citation for a patent.
 */
export function generateApaCitation(patent: Patent): string {
  const inventorNamesApa = patent.inventors.join(", ");
  const year = patent.grantDate.split("-")[0];

  return `${inventorNamesApa}. (${year}). ${patent.title} (U.S. Patent No. ${patent.patentNumber}). U.S. Patent and Trademark Office. https://classic-patents.com/patents/${patent.id}`;
}

/**
 * Generates an RIS citation string compatible with Zotero, Mendeley, EndNote, and RefWorks.
 */
export function generateRisCitation(patent: Patent): string {
  const [year, month, day] = patent.grantDate.split("-");
  const lines: string[] = ["TY  - PAT", `TI  - ${patent.title}`];

  for (const inventor of patent.inventors) {
    lines.push(`AU  - ${formatAuthorLastFirst(inventor)}`);
  }

  lines.push(
    `PY  - ${year}`,
    `DA  - ${year}/${month}/${day}`,
    "PB  - U.S. Patent and Trademark Office",
    `M3  - U.S. Patent ${patent.patentNumber}`,
    `UR  - https://classic-patents.com/patents/${patent.id}`,
    "ER  - ",
  );

  return lines.join("\n");
}

/**
 * Generates a Chicago Manual of Style citation for a patent.
 */
export function generateChicagoCitation(patent: Patent): string {
  const authors = formatChicagoAuthors(patent.inventors);
  const year = patent.grantDate.split("-")[0];
  const grantDateFormatted = formatPatentDate(patent.grantDate);
  const filingPart = patent.filingDate ? `filed ${formatPatentDate(patent.filingDate)}, and ` : "";

  return `${authors}. ${year}. "${patent.title}." U.S. Patent ${patent.patentNumber}, ${filingPart}issued ${grantDateFormatted}. https://classic-patents.com/patents/${patent.id}.`;
}

/**
 * Triggers a browser download of the citation text file with appropriate filename and MIME type.
 */
export function downloadCitationFile(
  filename: string,
  content: string,
  mimeType = "text/plain;charset=utf-8",
): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
