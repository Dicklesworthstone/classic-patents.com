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

import { Header } from "./Header";

describe("Header component", () => {
  test("renders navigation bar, brand title, and search shortcut trigger", () => {
    const html = renderToStaticMarkup(<Header />);
    expect(html).toContain("CLASSIC PATENTS");
    expect(html).toContain("Museum Catalog");
    expect(html).toContain("Wright Flyer 3D");
    expect(html).toContain("Tesla AC Motor");
    expect(html).toContain("Timeline");
    expect(html).toContain("Search...");
    expect(html).toContain("⌘K");
  });
});
