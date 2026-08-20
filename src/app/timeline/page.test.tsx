import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import TimelinePage from "./page";

describe("TimelinePage component", () => {
  test("renders timeline header, subtitle, and interactive chronology component", () => {
    const html = renderToStaticMarkup(<TimelinePage />);

    expect(html).toContain("Chronological Evolution of Technology");
    expect(html).toContain("Over Two Centuries of Human Ingenuity (1769–1979)");
    expect(html).toContain("All Milestones");
    expect(html).toContain("James Watt");
  });
});
