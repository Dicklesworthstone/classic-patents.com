import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PinnedPdfFacsimile } from "./PinnedPdfFacsimile";

describe("PinnedPdfFacsimile", () => {
  test("keeps the separate pinned facsimile and recovery controls available before PDF.js starts", () => {
    const html = renderToStaticMarkup(
      <PinnedPdfFacsimile
        patentNumber="US 821,393"
        pdfUrl="/patents/pdfs/us-821393-wright-flyer.pdf"
        previewUrl="/patents/facsimile-pages/us-821393-wright-flyer/page-1.png"
      />,
    );

    expect(html).toContain('data-testid="pinned-pdf-renderer"');
    expect(html).toContain('data-testid="pinned-pdf-preview"');
    expect(html).toContain('data-testid="pinned-pdf-canvas"');
    expect(html).toContain('href="/patents/pdfs/us-821393-wright-flyer.pdf"');
    expect(html).toContain("Open PDF");
    expect(html).toContain("Download");
    expect(html).toContain("Loading the complete pinned original patent document.");
  });
});
