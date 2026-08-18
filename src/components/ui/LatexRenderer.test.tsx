import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { LatexRenderer } from "./LatexRenderer";

describe("LatexRenderer", () => {
  test("retains the authored interactive token markup used by colorized equations", () => {
    const html = renderToStaticMarkup(
      <LatexRenderer math={String.raw`\htmlClass{eq-term}{\htmlData{var=lift}{L}}`} />,
    );

    expect(html).toContain("eq-term");
    expect(html).toContain('data-var="lift"');
  });

  test("does not enable active links or external images from formula input", () => {
    const linkHtml = renderToStaticMarkup(
      <LatexRenderer math={String.raw`\href{javascript:alert(1)}{unsafe}`} />,
    );
    const imageHtml = renderToStaticMarkup(
      <LatexRenderer math={String.raw`\includegraphics{javascript:alert(1)}`} />,
    );

    expect(linkHtml).not.toContain('<a href="javascript:alert(1)"');
    expect(imageHtml).not.toContain('<img src="javascript:alert(1)"');
  });

  test("uses a readable visible fallback instead of leaking malformed TeX", () => {
    const malformed = String.raw`\notARealCommand{`;
    const html = renderToStaticMarkup(<LatexRenderer math={malformed} />);

    expect(html).toContain("Mathematical notation unavailable");
    expect(html).not.toContain(malformed);
  });
});
