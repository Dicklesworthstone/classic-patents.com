import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { EraFilterBar } from "./EraFilterBar";

describe("EraFilterBar component", () => {
  test("renders search bar, result counter, and all category filter pills with counts", () => {
    const html = renderToStaticMarkup(
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
    const html = renderToStaticMarkup(
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
