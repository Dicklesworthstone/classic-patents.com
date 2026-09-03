import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  archivalEditionForPublication,
  completeArchivalEditionForViewer,
  evaluateArchivalPublicationState,
  patentForPublicationViewer,
} from "@/data/editions/publicationApproval";
import { allPatents } from "@/data/patents";
import { whitneyCottonGinPatent } from "@/data/patents/whitney-cotton-gin";
import type { Patent } from "@/types/patent";
import { applyPatentViewToUrl, viewModeFromSearch } from "./patentViewMode";

const VIEWER_SOURCE = readFileSync(
  join(process.cwd(), "src/components/patents/DualProjectionViewer.tsx"),
  "utf8",
);
const PATENT_PAGE_SOURCE = readFileSync(
  join(process.cwd(), "src/app/patents/[id]/page.tsx"),
  "utf8",
);
const E2E_AUDIT_SOURCE = readFileSync(join(process.cwd(), "scripts/e2e-visual-audit.ts"), "utf8");
const THREEJS_AUDIT_SOURCE = readFileSync(
  join(process.cwd(), "scripts/e2e-threejs-visual-audit.ts"),
  "utf8",
);

describe("patent view URL state", () => {
  test("accepts each documented face and ignores unrecognized query values", () => {
    expect(viewModeFromSearch("?view=plain-english")).toBe("plain-english");
    expect(viewModeFromSearch("?view=original-spec")).toBe("original-spec");
    expect(viewModeFromSearch("?view=interactive-sim")).toBe("interactive-sim");
    expect(viewModeFromSearch("?view=schematic-sheet")).toBe("schematic-sheet");
    expect(viewModeFromSearch("?view=pdf-facsimile")).toBe("pdf-facsimile");
    expect(viewModeFromSearch("?view=split-view")).toBe("split-view");
    expect(viewModeFromSearch("?view=unknown")).toBeUndefined();
    expect(viewModeFromSearch("")).toBeUndefined();
  });

  test("writes ?view= on face change, preserves other query keys, and no-ops when already set", () => {
    expect(
      applyPatentViewToUrl(
        "https://classic-patents.com/patents/us-821393-wright-flyer",
        "interactive-sim",
      ),
    ).toBe("/patents/us-821393-wright-flyer?view=interactive-sim");
    expect(
      applyPatentViewToUrl(
        "https://classic-patents.com/patents/us-821393-wright-flyer?theme=blueprint#claim-1",
        "original-spec",
      ),
    ).toBe("/patents/us-821393-wright-flyer?theme=blueprint&view=original-spec#claim-1");
    expect(
      applyPatentViewToUrl(
        "https://classic-patents.com/patents/us-821393-wright-flyer?view=interactive-sim",
        "interactive-sim",
      ),
    ).toBeNull();
  });

  test("keeps client history sync and does not reintroduce the live-checkout state-only setter", () => {
    expect(VIEWER_SOURCE).toContain("applyPatentViewToUrl");
    expect(VIEWER_SOURCE).toContain("window.history.pushState");
    expect(VIEWER_SOURCE).toContain('addEventListener("popstate"');
    expect(VIEWER_SOURCE).toContain("viewModeFromSearch");
    expect(VIEWER_SOURCE).toContain("syncFromLocation");
    expect(VIEWER_SOURCE).toContain('data-testid="dual-projection-viewer"');
    expect(VIEWER_SOURCE).toContain("data-hydrated={hydrated}");
    expect(VIEWER_SOURCE).toContain("useLayoutEffect(() => {");
    expect(VIEWER_SOURCE).toContain("setHydrated(true)");
    expect(VIEWER_SOURCE).not.toMatch(
      /const setViewMode = \(mode: PatentViewMode\) => \{\s*setViewModeState\(mode\);\s*\};/,
    );
    expect(PATENT_PAGE_SOURCE).toContain("patent={viewerPatent}");
    expect(PATENT_PAGE_SOURCE).toContain("archivalPublication={archivalPublicationView}");
    expect(PATENT_PAGE_SOURCE).toContain(
      "data-archival-publication-evidence={JSON.stringify(archivalDiagnostics)}",
    );
    expect(VIEWER_SOURCE).toContain("const archivalSource =");
    expect(VIEWER_SOURCE).toContain("const archivalSource = patent.archivalEdition");
    expect(VIEWER_SOURCE).toContain("archivalParallelReadings ?? {}");
    expect(VIEWER_SOURCE).toContain("reviewedTranscript");
    expect(VIEWER_SOURCE).toContain('data-testid="reviewed-transcript-fallback"');
    expect(VIEWER_SOURCE).not.toContain(
      "archivalPublication.isPublished && patent.archivalEdition",
    );
    expect(VIEWER_SOURCE).not.toContain("evaluateArchivalPublicationState(patent)");
    expect(VIEWER_SOURCE).not.toContain("archivalParallelReadingsFor");
    expect(PATENT_PAGE_SOURCE).not.toContain("searchParams");
    expect(E2E_AUDIT_SOURCE).toContain('searchParams.get("view") === "original-spec"');
    expect(E2E_AUDIT_SOURCE).toContain('searchParams.get("view") === view');
    expect(THREEJS_AUDIT_SOURCE).toContain('action: "original-patent-text"');
    expect(THREEJS_AUDIT_SOURCE).toContain('data-testid="reviewed-transcript-fallback"');
  });

  test("gives the Kwolek route a visual-only boundary without withholding its patent text", () => {
    expect(VIEWER_SOURCE).toContain('patent.id === "us-3671542-kwolek-kevlar"');
    expect(VIEWER_SOURCE).toContain("Visual Model in Preparation");
    expect(VIEWER_SOURCE).toContain("Checked Claim Reading");
    expect(VIEWER_SOURCE).toContain("Complete patent text remains available");
    expect(VIEWER_SOURCE).toContain("data-source-visual-hold={sourceVisualHold || undefined}");
  });
});

describe("archival publication boundary", () => {
  test("publishes accepted editions and withholds held audit records", () => {
    const acceptedPatent = allPatents.find((patent) => patent.id === "us-78317-nobel-dynamite");
    if (!acceptedPatent) throw new Error("Nobel dynamite patent not found");
    expect(archivalEditionForPublication(acceptedPatent)).toBe(acceptedPatent.archivalEdition);
    // Whitney has an audit hold in ARCHIVAL_PUBLICATION_STATE_OVERRIDES (classic-patentscom-hi0)
    expect(archivalEditionForPublication(whitneyCottonGinPatent)).toBeUndefined();

    const unmappedPatent: Patent = {
      ...acceptedPatent,
      id: "us-unmapped-draft-test",
    };
    expect(archivalEditionForPublication(unmappedPatent)).toBeUndefined();
  });

  test("does not make optional reviewed-ledger page anchors a publication condition", () => {
    const acceptedPatent = allPatents.find((patent) => patent.id === "us-78317-nobel-dynamite");
    if (!acceptedPatent) throw new Error("Nobel dynamite patent not found");
    const asset = acceptedPatent.originalTextAsset;
    if (!asset) {
      throw new Error("Publication fixture requires a reviewed source asset.");
    }

    const withoutOptionalPageAnchors: Patent = {
      ...acceptedPatent,
      originalTextAsset: { ...asset, pageAnchors: undefined },
    };

    expect(archivalEditionForPublication(withoutOptionalPageAnchors)).toBe(
      acceptedPatent.archivalEdition,
    );
  });

  test(
    "releases exactly the records that pass evaluateArchivalPublicationState",
    () => {
      const releasedIds = allPatents
        .filter((patent) => archivalEditionForPublication(patent))
        .map((patent) => patent.id)
        .toSorted();

      const expectedAcceptedIds = allPatents
        .filter((patent) => evaluateArchivalPublicationState(patent).isPublished)
        .map((patent) => patent.id)
        .toSorted();

      expect(releasedIds).toEqual(expectedAcceptedIds);
      expect(releasedIds).not.toHaveLength(0);
    },
    { timeout: 30000 },
  );

  test(
    "returns publishedEdition for all accepted patents",
    () => {
      for (const patent of allPatents) {
        const decision = evaluateArchivalPublicationState(patent);
        if (decision.isPublished) {
          expect(archivalEditionForPublication(patent)).toBe(patent.archivalEdition);
        } else {
          expect(archivalEditionForPublication(patent)).toBeUndefined();
        }
      }
    },
    { timeout: 30000 },
  );

  test("keeps existing held editions readable while retaining ledger metadata server-side", () => {
    const heldDecision = evaluateArchivalPublicationState(whitneyCottonGinPatent);
    const heldProjection = patentForPublicationViewer(whitneyCottonGinPatent, heldDecision);
    expect(heldDecision.isPublished).toBe(false);
    expect(heldProjection.archivalEdition).toBe(whitneyCottonGinPatent.archivalEdition);
    expect(heldProjection.originalTextAsset).toBeUndefined();

    const acceptedPatent = allPatents.find((patent) => patent.id === "us-78317-nobel-dynamite");
    if (!acceptedPatent) throw new Error("Nobel dynamite patent not found");
    const acceptedDecision = evaluateArchivalPublicationState(acceptedPatent);
    const acceptedProjection = patentForPublicationViewer(acceptedPatent, acceptedDecision);
    expect(acceptedDecision.isPublished).toBe(true);
    expect(acceptedProjection.archivalEdition).toBe(acceptedPatent.archivalEdition);
    expect(acceptedProjection.originalTextAsset).toBeUndefined();
  });

  test("preserves stored editions for the viewer even when audit review is pending", () => {
    const fermi = allPatents.find((patent) => patent.id === "us-2708656-fermi-reactor");
    if (!fermi) throw new Error("Fermi reactor patent not found");

    const decision = evaluateArchivalPublicationState(fermi);
    expect(fermi.archivalEdition).toBeDefined();
    expect(completeArchivalEditionForViewer(fermi, decision)).toBe(fermi.archivalEdition);
    expect(patentForPublicationViewer(fermi, decision).archivalEdition).toBe(fermi.archivalEdition);
  });
});
