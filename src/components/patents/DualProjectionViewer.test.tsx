import { describe, expect, mock, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

// Mock next/navigation
mock.module("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/patents/us-821393-wright-flyer",
  useRouter: () => ({ push: () => {}, replace: () => {} }),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

import { getColorizedEquationsForPatent } from "@/data/colorizedEquations";
import { archivalParallelReadingsFor } from "@/data/editions/parallelReadings";
import { evaluateArchivalPublicationState } from "@/data/editions/publicationApproval";
import { noyceIcPatent } from "@/data/patents/noyce-ic";
import { wrightFlyerPatent } from "@/data/patents/wright-flyer";
import { DualProjectionViewer } from "./DualProjectionViewer";

describe("DualProjectionViewer component", () => {
  test("renders navigation projection tabs and default plain-English face", () => {
    const html = renderToStaticMarkup(
      <DualProjectionViewer
        patent={wrightFlyerPatent}
        archivalPublication={evaluateArchivalPublicationState(wrightFlyerPatent)}
        archivalParallelReadings={undefined}
        colorizedEquations={getColorizedEquationsForPatent(wrightFlyerPatent.id)}
        hasRawSourceText={false}
        initialView="plain-english"
      />,
    );

    expect(html).toContain("Plain English Face");
    expect(html).toContain("Original Patent Text");
    expect(html).toContain("Interactive 3D Simulator");
    expect(html).toContain("Schematic &amp; Pins");
    expect(html).toContain("Full Original PDF");
    expect(html).toContain("Dual Split-Screen");
    expect(html).toContain("Print Broadside");
    expect(html).toContain('data-testid="dual-projection-viewer"');
    expect(html).toContain('data-hydrated="false"');
  });

  test("renders an existing held edition instead of gating its complete patent text", () => {
    const originalHtml = renderToStaticMarkup(
      <DualProjectionViewer
        patent={noyceIcPatent}
        archivalPublication={evaluateArchivalPublicationState(noyceIcPatent)}
        archivalParallelReadings={archivalParallelReadingsFor(noyceIcPatent.id)}
        colorizedEquations={getColorizedEquationsForPatent(noyceIcPatent.id)}
        hasRawSourceText={false}
        initialView="original-spec"
      />,
    );

    expect(originalHtml).toContain('data-archival-publication-state="held"');
    expect(originalHtml).toContain("AUDIT_FIGURE_ACCEPTANCE_PENDING");
    expect(originalHtml).toContain("In brief, the present invention utilizes");
    expect(originalHtml).toContain("A semiconductor device comprising");
    expect(originalHtml).not.toContain('data-testid="held-archival-edition-notice"');
  });

  test("uses an existing held edition in the split-source face", () => {
    const splitHtml = renderToStaticMarkup(
      <DualProjectionViewer
        patent={noyceIcPatent}
        archivalPublication={evaluateArchivalPublicationState(noyceIcPatent)}
        archivalParallelReadings={archivalParallelReadingsFor(noyceIcPatent.id)}
        colorizedEquations={getColorizedEquationsForPatent(noyceIcPatent.id)}
        hasRawSourceText={false}
        initialView="split-view"
      />,
    );

    expect(splitHtml).toContain("Face 2: Complete Archival Source Text");
    expect(splitHtml).toContain("In brief, the present invention utilizes");
    expect(splitHtml).not.toContain('data-testid="held-archival-edition-notice"');
  });
});
