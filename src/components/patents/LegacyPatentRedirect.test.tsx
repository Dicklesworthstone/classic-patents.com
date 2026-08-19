import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { LegacyPatentRedirect } from "./LegacyPatentRedirect";

describe("LegacyPatentRedirect component", () => {
  test("renders redirection notice with target URL", () => {
    const html = renderToStaticMarkup(<LegacyPatentRedirect targetId="us-821393-wright-flyer" />);

    expect(html).toContain("This patent record has moved to its verified catalog identity.");
    expect(html).toContain("/patents/us-821393-wright-flyer");
  });
});
