import type { Patent } from "@/types/patent";

/** The searchable, filterable and visible fields needed outside a patent's reader. */
export type PatentCatalogEntry = Pick<
  Patent,
  | "id"
  | "patentNumber"
  | "title"
  | "shortTitle"
  | "subtitle"
  | "inventors"
  | "inventorLocation"
  | "grantDate"
  | "era"
  | "category"
  | "categoryLabel"
  | "summary"
  | "tags"
>;

export type PatentTimelineContext = Pick<
  Patent["historicalContext"],
  "problemStatement" | "breakthroughInsight" | "civilizationalImpact"
>;

// Explicit projection: spreading a Patent here would serialize its full edition.
export function toPatentCatalogEntry(patent: Patent): PatentCatalogEntry {
  return {
    id: patent.id,
    patentNumber: patent.patentNumber,
    title: patent.title,
    shortTitle: patent.shortTitle,
    subtitle: patent.subtitle,
    inventors: patent.inventors,
    inventorLocation: patent.inventorLocation,
    grantDate: patent.grantDate,
    era: patent.era,
    category: patent.category,
    categoryLabel: patent.categoryLabel,
    summary: patent.summary,
    ...(patent.tags ? { tags: patent.tags } : {}),
  };
}

export function toPatentTimelineContext(patent: Patent): PatentTimelineContext {
  const { problemStatement, breakthroughInsight, civilizationalImpact } = patent.historicalContext;
  return { problemStatement, breakthroughInsight, civilizationalImpact };
}

export function filterPatentCategory<T extends PatentCatalogEntry>(
  patents: readonly T[],
  category: string,
): readonly T[] {
  if (category === "all") return patents;
  if (category === "aviation") {
    return patents.filter((p) => p.category === "aviation" || p.category === "aerospace");
  }
  return patents.filter((p) => p.category === category);
}

export function searchPatentCatalog<T extends PatentCatalogEntry>(
  patents: readonly T[],
  query: string,
): readonly T[] {
  const q = query.toLowerCase().trim();
  if (!q) return patents;
  const qAlphaNum = q.replace(/[^0-9a-zA-Z]/g, "");

  return patents.filter((p) => {
    const pNumberAlphaNum = p.patentNumber.replace(/[^0-9a-zA-Z]/g, "").toLowerCase();
    const matchesNumber =
      p.patentNumber.toLowerCase().includes(q) ||
      (qAlphaNum.length >= 3 && pNumberAlphaNum.includes(qAlphaNum));

    return (
      p.id.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.shortTitle.toLowerCase().includes(q) ||
      (p.subtitle ? p.subtitle.toLowerCase().includes(q) : false) ||
      matchesNumber ||
      p.inventors.some((inv) => inv.toLowerCase().includes(q)) ||
      p.inventorLocation.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.era.toLowerCase().includes(q) ||
      p.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  });
}
