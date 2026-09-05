import { describe, expect, test } from "bun:test";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PatentCatalogProvider } from "@/components/layout/PatentCatalogProvider";
import { toPatentCatalogEntry } from "@/data/patentCatalog";
import { allPatents, getFeaturedPatents } from "@/data/patents";
import HomePage from "./page";

describe("HomePage component", () => {
  test("renders hero section, stats plaque, and curated patent directory", () => {
    const html = renderWithCatalog(<HomePage />);

    expect(html).toContain("Curated Open-Source Historical Patent Museum");
    expect(html).toContain("History&#x27;s Greatest Inventions, Decoded &amp; Simulated.");
    expect(html).toContain(`Explore All ${allPatents.length} Inventions`);
    expect(html).toContain("Wright Flyer");
    expect(html).toContain("Eli Whitney");
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
