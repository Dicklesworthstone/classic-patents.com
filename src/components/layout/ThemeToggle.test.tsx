import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle component", () => {
  test("renders a static 44px placeholder matching the mounted button footprint", () => {
    const html = renderToStaticMarkup(<ThemeToggle />);
    expect(html).toContain("w-11 h-11");
    expect(html).toContain("rounded-xl");
  });
});
