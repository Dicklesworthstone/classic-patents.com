/**
 * Visitor-facing formatting for the ISO `YYYY-MM-DD` dates stored on patent
 * records ("1906-05-22" -> "May 22, 1906"). Citation strings intentionally
 * keep the raw ISO form; use this only for prose/UI displays.
 */
const PATENT_DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export function formatPatentDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  return PATENT_DATE_FORMAT.format(parsed);
}
