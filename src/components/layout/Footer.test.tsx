import { describe, expect, mock, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

// Mock next/link
mock.module("next/link", () => ({
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import { Footer } from "./Footer";

describe("Footer component", () => {
  test("renders museum brand, mission, curated masterpiece links, and architecture links", () => {
    const html = renderToStaticMarkup(<Footer />);

    expect(html).toContain("CLASSIC PATENTS");
    expect(html).toContain("Preserving, restoring, and illuminating");
    expect(html).toContain("Curated Masterpieces");
    expect(html).toContain("US 821,393 · Wright Flyer");
    expect(html).toContain("US 381,968 · Tesla AC Motor");
    expect(html).toContain("Mission &amp; Methodology");
    expect(html).toContain("Historical Timeline");
    expect(html).toContain("GitHub Repository");
    expect(html).toContain("MIT Open Source License");
    expect(html).toContain("Curated by Jeffrey Emanuel");
  });
});
