import { describe, expect, mock, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
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

import { allPatents } from "@/data/patents";
import { PatentSearchPalette } from "./PatentSearchPalette";

const PALETTE_SOURCE = readFileSync(
  join(process.cwd(), "src/components/layout/PatentSearchPalette.tsx"),
  "utf8",
);

describe("PatentSearchPalette component", () => {
  test("renders palette markup cleanly before the client opens the dialog", () => {
    const html = renderToStaticMarkup(<PatentSearchPalette onClose={() => {}} />);
    expect(html).toContain("Patent Search Palette");
    expect(html).toContain(`Search all ${allPatents.length} inventions`);
    expect(html).toContain("Wright");
  });

  test("renders search dialog with default curated patents", () => {
    const html = renderToStaticMarkup(<PatentSearchPalette onClose={() => {}} />);
    expect(html).toContain("dialog");
    expect(html).toContain(`Search all ${allPatents.length} inventions`);
    expect(html).toContain("ESC");
  });

  test("labels the source-held Kwolek search result as a record rather than a 3D model", () => {
    expect(PALETTE_SOURCE).toContain('patent.id === "us-3671542-kwolek-kevlar"');
    expect(PALETTE_SOURCE).toContain("Open Source-Bound Record");
  });
});
