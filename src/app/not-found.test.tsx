import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import NotFound from "./not-found";

describe("NotFound component (404 handler)", () => {
  test("renders 404 notice and links back to catalog and timeline", () => {
    const html = renderToStaticMarkup(<NotFound />);

    expect(html).toContain("Archival Record Unindexed (404)");
    expect(html).toContain("Patent Not Found in Museum Catalog");
    expect(html).toContain("Return to Museum Catalog");
    expect(html).toContain("View Chronological Timeline");
  });
});
