export type PatentViewMode =
  | "plain-english"
  | "original-spec"
  | "interactive-sim"
  | "schematic-sheet"
  | "pdf-facsimile"
  | "split-view";

const PATENT_VIEW_MODES: readonly PatentViewMode[] = [
  "plain-english",
  "original-spec",
  "interactive-sim",
  "schematic-sheet",
  "pdf-facsimile",
  "split-view",
];

export function isPatentViewMode(value: string | undefined): value is PatentViewMode {
  return !!value && PATENT_VIEW_MODES.includes(value as PatentViewMode);
}

export function viewModeFromSearch(search: string): PatentViewMode | undefined {
  const candidate = new URLSearchParams(search).get("view") ?? undefined;
  return isPatentViewMode(candidate) ? candidate : undefined;
}

/**
 * Next href after a face click. Returns null when `view` is already `mode`
 * so history is not double-pushed. Preserves other query keys and the hash.
 */
export function applyPatentViewToUrl(href: string, mode: PatentViewMode): string | null {
  const url = new URL(href, "https://classic-patents.com");
  if (url.searchParams.get("view") === mode) return null;
  url.searchParams.set("view", mode);
  return `${url.pathname}${url.search}${url.hash}`;
}
