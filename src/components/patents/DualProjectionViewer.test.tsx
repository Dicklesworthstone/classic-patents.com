import { describe, expect, mock, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
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
import { patentForSourceReader } from "@/data/editions/publicationApproval";
import { reviewedLedgerTextForViewer } from "@/data/editions/reviewedLedgerPublicationEvidence.server";
import { fermiReactorPatent } from "@/data/patents/fermi-reactor";
import { kwolekKevlarPatent } from "@/data/patents/kwolek-kevlar";
import { noyceIcPatent } from "@/data/patents/noyce-ic";
import { stackhouseManipulatorPatent } from "@/data/patents/stackhouse-manipulator-source-bounded";
import { wrightFlyerPatent } from "@/data/patents/wright-flyer";
import { DualProjectionViewer } from "./DualProjectionViewer";

describe("DualProjectionViewer component", () => {
  test("renders navigation projection tabs and default plain-English face", () => {
    const html = renderToStaticMarkup(
      <DualProjectionViewer
        patent={wrightFlyerPatent}
        archivalParallelReadings={undefined}
        colorizedEquations={getColorizedEquationsForPatent(wrightFlyerPatent.id)}
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
        archivalParallelReadings={archivalParallelReadingsFor(noyceIcPatent.id)}
        colorizedEquations={getColorizedEquationsForPatent(noyceIcPatent.id)}
        initialView="original-spec"
      />,
    );

    expect(originalHtml).toContain('data-source-delivery="edition"');
    expect(originalHtml).not.toContain("AUDIT_FIGURE_ACCEPTANCE_PENDING");
    expect(originalHtml).toContain("In brief, the present invention utilizes");
    expect(originalHtml).toContain("A semiconductor device comprising");
    expect(originalHtml).not.toContain('data-testid="held-archival-edition-notice"');
  });

  test("uses an existing held edition in the split-source face", () => {
    const splitHtml = renderToStaticMarkup(
      <DualProjectionViewer
        patent={noyceIcPatent}
        archivalParallelReadings={archivalParallelReadingsFor(noyceIcPatent.id)}
        colorizedEquations={getColorizedEquationsForPatent(noyceIcPatent.id)}
        initialView="split-view"
      />,
    );

    expect(splitHtml).toContain("Face 2: Complete Archival Source Text");
    expect(splitHtml).toContain("In brief, the present invention utilizes");
    expect(splitHtml).not.toContain('data-testid="held-archival-edition-notice"');
  });

  test("renders a complete patent transcript as text when no structured edition exists", () => {
    const reviewedTranscript = readFileSync(
      join(process.cwd(), "public/patents/transcripts/us-821393-wright-flyer-reviewed.txt"),
      "utf8",
    );
    const patentWithoutEdition = { ...wrightFlyerPatent, archivalEdition: undefined };

    const originalHtml = renderToStaticMarkup(
      <DualProjectionViewer
        patent={patentWithoutEdition}
        reviewedTranscript={reviewedTranscript}
        colorizedEquations={getColorizedEquationsForPatent(wrightFlyerPatent.id)}
        initialView="original-spec"
      />,
    );
    const splitHtml = renderToStaticMarkup(
      <DualProjectionViewer
        patent={patentWithoutEdition}
        reviewedTranscript={reviewedTranscript}
        colorizedEquations={getColorizedEquationsForPatent(wrightFlyerPatent.id)}
        initialView="split-view"
      />,
    );

    for (const html of [originalHtml, splitHtml]) {
      expect(html).toContain("Complete patent transcript");
      expect(html).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 10 ---");
      expect(html).toContain("Be it known that we, ORVILLE WRIGHT and WILBUR WRIGHT");
      expect(html).not.toContain('data-testid="held-archival-edition-notice"');
      expect(html).not.toContain('data-testid="pinned-pdf-facsimile"');
    }
  });

  test("renders the complete pinned facsimile inline when no text edition or ledger is available", () => {
    const patentWithoutTextReader = {
      ...wrightFlyerPatent,
      archivalEdition: undefined,
      originalTextAsset: undefined,
    };

    const html = renderToStaticMarkup(
      <DualProjectionViewer
        patent={patentWithoutTextReader}
        colorizedEquations={getColorizedEquationsForPatent(wrightFlyerPatent.id)}
        initialView="original-spec"
      />,
    );

    expect(html).toContain('data-testid="source-facsimile-fallback"');
    expect(html).toContain(
      "Complete patent text is available in this pinned primary-source facsimile.",
    );
    expect(html).toContain("<object");
    expect(html).toContain('type="application/pdf"');
    expect(html).not.toContain('data-testid="source-text-excerpt"');
  });

  test("uses Stackhouse's pinned facsimile rather than its quarantined legacy transcript", () => {
    const patent = patentForSourceReader(stackhouseManipulatorPatent);
    const transcript = reviewedLedgerTextForViewer(stackhouseManipulatorPatent);
    expect(transcript).toBeUndefined();

    const html = renderToStaticMarkup(
      <DualProjectionViewer
        patent={patent}
        reviewedTranscript={transcript}
        colorizedEquations={getColorizedEquationsForPatent(stackhouseManipulatorPatent.id)}
        initialView="original-spec"
      />,
    );

    expect(html).toContain('data-source-delivery="facsimile"');
    expect(html).toContain('data-testid="source-facsimile-fallback"');
    expect(html).toContain('href="/patents/pdfs/us-4068536-stackhouse-manipulator.pdf"');
    expect(html).not.toContain("linear invertible matrix transformation");
    expect(html).not.toContain("solid angle of 2*pi steradians");
  });

  test("renders the complete locally available Kwolek instrument despite its editorial hold", () => {
    const transcript = reviewedLedgerTextForViewer(kwolekKevlarPatent);
    expect(transcript).toStartWith("--- REVIEWED TRANSCRIPTION PAGE 1 OF 58 ---");

    const html = renderToStaticMarkup(
      <DualProjectionViewer
        patent={kwolekKevlarPatent}
        reviewedTranscript={transcript}
        colorizedEquations={getColorizedEquationsForPatent(kwolekKevlarPatent.id)}
        initialView="original-spec"
      />,
    );

    expect(html).toContain("Complete patent transcript");
    expect(html).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 58 ---");
    expect(html).toContain("What is claimed is:");
    expect(html).not.toContain('data-testid="held-archival-edition-notice"');
  });

  test("renders Fermi's complete reviewed transcript rather than calling its unfinished draft complete", () => {
    const patent = patentForSourceReader(fermiReactorPatent);
    const transcript = reviewedLedgerTextForViewer(fermiReactorPatent);

    expect(fermiReactorPatent.archivalEdition).toBeDefined();
    expect(fermiReactorPatent.archivalEdition?.completeFacsimileReviewed).toBe(false);
    expect(patent.archivalEdition).toBeUndefined();
    expect(transcript).toStartWith("--- REVIEWED TRANSCRIPTION PAGE 1 OF 58 ---");

    const html = renderToStaticMarkup(
      <DualProjectionViewer
        patent={patent}
        reviewedTranscript={transcript}
        colorizedEquations={getColorizedEquationsForPatent(fermiReactorPatent.id)}
        initialView="original-spec"
      />,
    );

    expect(html).toContain("Complete patent transcript");
    expect(html).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 58 ---");
    expect(html).toContain("NEUTRONIC REACTOR");
    expect(html).not.toContain('data-testid="held-archival-edition-notice"');
  });
});
