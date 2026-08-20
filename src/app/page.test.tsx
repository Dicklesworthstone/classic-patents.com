import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { allPatents } from "@/data/patents";
import HomePage from "./page";

describe("HomePage component", () => {
  test("renders hero section, stats plaque, and curated patent directory", () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain("Curated Open-Source Historical Patent Museum");
    expect(html).toContain("History&#x27;s Greatest Inventions, Decoded &amp; Simulated.");
    expect(html).toContain(`Explore All ${allPatents.length} Inventions`);
    expect(html).toContain("Wright Flyer");
    expect(html).toContain("Eli Whitney");
  });
});
