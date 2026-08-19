import { describe, expect, mock, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

// Mock next/navigation
mock.module("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
  useRouter: () => ({ push: () => {}, replace: () => {} }),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

import { PatentSearchPalette } from "./PatentSearchPalette";

describe("PatentSearchPalette component", () => {
  test("renders closed dialog state cleanly", () => {
    const html = renderToStaticMarkup(<PatentSearchPalette isOpen={false} onClose={() => {}} />);
    expect(html).toContain("Patent Search Palette");
    expect(html).toContain("Search all 54 inventions");
    expect(html).toContain("Wright");
  });

  test("renders search dialog with default curated patents", () => {
    const html = renderToStaticMarkup(<PatentSearchPalette isOpen={true} onClose={() => {}} />);
    expect(html).toContain("dialog");
    expect(html).toContain("Search all 54 inventions");
    expect(html).toContain("ESC");
  });
});
