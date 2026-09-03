import { describe, expect, mock, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

// Mock next/navigation
mock.module("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/patents/us-821393-wright-flyer",
  useRouter: () => ({ push: () => {}, replace: () => {} }),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

import PatentDetailPage, { generateMetadata, generateStaticParams } from "./page";

describe("PatentDetailPage component", () => {
  test("generates static params for all 54 patents and legacy redirect paths", async () => {
    const params = await generateStaticParams();
    expect(params.length).toBeGreaterThanOrEqual(54);
    expect(params.some((p) => p.id === "us-821393-wright-flyer")).toBe(true);
    expect(params.some((p) => p.id === "us-727650-fessenden-wireless")).toBe(true);
  });

  test("generates authentic metadata for Wright Flyer", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ id: "us-821393-wright-flyer" }),
    });
    expect(meta.title).toContain("Wright Flyer");
    expect(meta.title).toContain("US 821,393");
  });

  test("renders complete patent detail page for Wright Flyer", async () => {
    const PageJsx = await PatentDetailPage({
      params: Promise.resolve({ id: "us-821393-wright-flyer" }),
    });
    const html = renderToStaticMarkup(PageJsx);

    expect(html).toContain("US 821,393");
    expect(html).toContain("Wright Flyer");
    expect(html).toContain("Plain English Face");
    expect(html).toContain("Original Patent Text");
    expect(html).toContain('data-archival-publication-state="held"');
    expect(html).toContain("data-archival-publication-evidence=");
    expect(html).toContain("acceptedFigureCount");
  });

  test("handles legacy redirects gracefully", async () => {
    const PageJsx = await PatentDetailPage({
      params: Promise.resolve({ id: "us-533367-tesla-coil" }),
    });
    const html = renderToStaticMarkup(PageJsx);
    expect(html).toContain("This patent record has moved to its verified catalog identity.");
    expect(html).toContain("/patents/us-593138-tesla-coil");
  });

  test("routes the former Fessenden number alias to the source-correct record", async () => {
    const PageJsx = await PatentDetailPage({
      params: Promise.resolve({ id: "us-727650-fessenden-wireless" }),
    });
    const html = renderToStaticMarkup(PageJsx);
    expect(html).toContain("This patent record has moved to its verified catalog identity.");
    expect(html).toContain("/patents/us-706737-fessenden-wireless");
  });
});
