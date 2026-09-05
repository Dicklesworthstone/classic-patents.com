import { describe, expect, test } from "bun:test";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PatentCatalogProvider } from "@/components/layout/PatentCatalogProvider";
import { toPatentCatalogEntry } from "@/data/patentCatalog";
import { allPatents, getFeaturedPatents } from "@/data/patents";
import { EraFilterBar } from "./EraFilterBar";

describe("EraFilterBar component", () => {
  test("renders search bar, result counter, and all category filter pills with counts", () => {
    const html = renderWithCatalog(
      <EraFilterBar
        selectedCategory="all"
        onSelectCategory={() => {}}
        searchQuery=""
        onSearchChange={() => {}}
        resultCount={54}
      />,
    );

    expect(html).toContain("patent-catalog-search");
    expect(html).toContain("54");
    expect(html).toContain("All Masterpieces");
    expect(html).toContain("Aviation &amp; Aerospace");
    expect(html).toContain("Electricity &amp; AC");
    expect(html).toContain("Telecommunications");
    expect(html).toContain("Computing &amp; Silicon");
    expect(html).toContain("Materials Science");
    expect(html).toContain("Optics &amp; Imaging");
  });

  test("highlights active category pill when selected", () => {
    const html = renderWithCatalog(
      <EraFilterBar
        selectedCategory="aviation"
        onSelectCategory={() => {}}
        searchQuery="Wright"
        onSearchChange={() => {}}
        resultCount={1}
      />,
    );

    expect(html).toContain('value="Wright"');
    expect(html).toContain("Clear search query");
  });
});

function renderWithCatalog(children: ReactNode) {
  return renderToStaticMarkup(
    <PatentCatalogProvider
      catalog={{
        patents: allPatents.map(toPatentCatalogEntry),
        featuredIds: getFeaturedPatents().map((patent) => patent.id),
      }}
    >
      {children}
    </PatentCatalogProvider>,
  );
}
