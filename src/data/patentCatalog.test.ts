import { describe, expect, test } from "bun:test";
import {
  filterPatentCategory,
  searchPatentCatalog,
  toPatentCatalogEntry,
  toPatentTimelineContext,
} from "./patentCatalog";
import { allPatents, getFeaturedPatents } from "./patents";

const catalog = allPatents.map(toPatentCatalogEntry);

describe("server-derived navigation catalogue", () => {
  test("preserves every record and its display fields without archival payloads", () => {
    expect(catalog.map((patent) => patent.id)).toEqual(allPatents.map((patent) => patent.id));
    for (const [index, entry] of catalog.entries()) {
      const source = allPatents[index];
      expect(entry.shortTitle).toBe(source.shortTitle);
      expect(entry.summary).toBe(source.summary);
      expect(entry.grantDate).toBe(source.grantDate);
      expect(entry.inventors).toEqual(source.inventors);
      for (const key of [
        "claims",
        "archivalEdition",
        "originalText",
        "originalTextAsset",
        "drawings",
        "plainEnglishExplanation",
        "historicalContext",
      ]) {
        expect(key in entry).toBe(false);
      }
      const context = toPatentTimelineContext(source);
      expect(context.problemStatement).toBe(source.historicalContext.problemStatement);
      expect(context.breakthroughInsight).toBe(source.historicalContext.breakthroughInsight);
      expect(context.civilizationalImpact).toBe(source.historicalContext.civilizationalImpact);
      expect(Object.keys(context)).toHaveLength(3);
    }
    expect(
      getFeaturedPatents().every((featured) => catalog.some((patent) => patent.id === featured.id)),
    ).toBe(true);
  });

  test("finds all records by id, punctuation-free grant number and every searchable field", () => {
    for (const patent of catalog) {
      const queries = [
        patent.id,
        patent.patentNumber.replace(/[^a-z0-9]/gi, ""),
        patent.title,
        patent.shortTitle,
        patent.subtitle,
        patent.inventorLocation,
        patent.summary,
        patent.category,
        patent.era,
        ...patent.inventors,
        ...(patent.tags ?? []),
      ];
      for (const query of queries) {
        if (!query) continue;
        expect(
          searchPatentCatalog(catalog, `  ${query.toUpperCase()}  `).map((result) => result.id),
        ).toContain(patent.id);
      }
    }
    expect(searchPatentCatalog(catalog, "821,393").map((patent) => patent.id)).toEqual([
      "us-821393-wright-flyer",
    ]);
    expect(searchPatentCatalog(catalog, "GB913").map((patent) => patent.id)).toEqual([
      "gb-913-watt-separate-condenser",
    ]);
    expect(searchPatentCatalog(catalog, "4976582").map((patent) => patent.id)).toEqual([
      "us-4976582-clavel-delta-robot",
    ]);
    expect(searchPatentCatalog(catalog, "not-a-real-patent-999999999")).toHaveLength(0);
    expect(searchPatentCatalog(catalog, "   ")).toEqual(catalog);
  });

  test("preserves chronology through search and category filters, including aerospace", () => {
    for (const category of new Set(["all", ...catalog.map((patent) => patent.category)])) {
      const filtered = filterPatentCategory(catalog, category);
      expect(filtered.map((patent) => patent.id)).toEqual(
        allPatents
          .filter(
            (patent) =>
              category === "all" ||
              patent.category === category ||
              (category === "aviation" && patent.category === "aerospace"),
          )
          .map((patent) => patent.id),
      );
      expect(searchPatentCatalog(filtered, "US").map((patent) => patent.id)).toEqual(
        searchPatentCatalog(catalog, "US")
          .filter((patent) => filtered.includes(patent))
          .map((patent) => patent.id),
      );
    }
    expect(filterPatentCategory(catalog, "unknown-category")).toHaveLength(0);
  });
});
