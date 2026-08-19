import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle component", () => {
  test("renders initial server-side placeholder pulse cleanly", () => {
    const html = renderToStaticMarkup(<ThemeToggle />);
    expect(html).toContain("animate-pulse");
    expect(html).toContain("rounded-xl");
  });
});
