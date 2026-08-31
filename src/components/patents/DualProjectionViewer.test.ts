import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ARCHIVAL_PARALLEL_READINGS } from "@/data/editions/parallelReadings";
import { ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS } from "@/data/editions/publicationApproval";
import { allPatents } from "@/data/patents";
import { goodyearRubberPatent } from "@/data/patents/goodyear-rubber";
import { whitneyCottonGinPatent } from "@/data/patents/whitney-cotton-gin";
import type { Patent } from "@/types/patent";
import {
  applyPatentViewToUrl,
  archivalEditionForPublication,
  viewModeFromSearch,
} from "./DualProjectionViewer";

const VIEWER_SOURCE = readFileSync(
  join(process.cwd(), "src/components/patents/DualProjectionViewer.tsx"),
  "utf8",
);
const PATENT_PAGE_SOURCE = readFileSync(
  join(process.cwd(), "src/app/patents/[id]/page.tsx"),
  "utf8",
);
const E2E_AUDIT_SOURCE = readFileSync(join(process.cwd(), "scripts/e2e-visual-audit.ts"), "utf8");

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
    expect(VIEWER_SOURCE).not.toMatch(
      /const setViewMode = \(mode: PatentViewMode\) => \{\s*setViewModeState\(mode\);\s*\};/,
    );
    expect(PATENT_PAGE_SOURCE).toContain(
      "<DualProjectionViewer patent={patent} colorizedEquations={colorizedEquations} />",
    );
    expect(PATENT_PAGE_SOURCE).not.toContain("searchParams");
    expect(E2E_AUDIT_SOURCE).toContain('searchParams.get("view") === "original-spec"');
    expect(E2E_AUDIT_SOURCE).toContain('searchParams.get("view") === view');
  });
});

describe("archival publication boundary", () => {
  test("publishes every authored edition whose companion map exists", () => {
    expect(archivalEditionForPublication(goodyearRubberPatent)).toBe(
      goodyearRubberPatent.archivalEdition,
    );
    // Owner policy (2026-08-21): the former root-QA hold list no longer
    // gates publication — presence with minor omissions beats absence.
    // Whitney now has an authored edition AND a registered companion map.
    expect(archivalEditionForPublication(whitneyCottonGinPatent)).toBe(
      whitneyCottonGinPatent.archivalEdition,
    );
    const unmappedPatent: Patent = {
      ...goodyearRubberPatent,
      id: "us-unmapped-draft-test",
    };
    expect(archivalEditionForPublication(unmappedPatent)).toBeUndefined();
  });

  test("does not make optional reviewed-ledger page anchors a publication condition", () => {
    const asset = goodyearRubberPatent.originalTextAsset;
    if (!asset) {
      throw new Error("Goodyear publication fixture requires a reviewed source asset.");
    }

    const withoutOptionalPageAnchors: Patent = {
      ...goodyearRubberPatent,
      originalTextAsset: { ...asset, pageAnchors: undefined },
    };

    expect(archivalEditionForPublication(withoutOptionalPageAnchors)).toBe(
      goodyearRubberPatent.archivalEdition,
    );
  });

  test("releases exactly the curated companion-reading registry", () => {
    const releasedIds = allPatents
      .filter((patent) => archivalEditionForPublication(patent))
      .map((patent) => patent.id)
      .toSorted();

    const approvedMappedIds = Object.keys(ARCHIVAL_PARALLEL_READINGS)
      .filter((patentId) => {
        const patent = allPatents.find((candidate) => candidate.id === patentId);
        return Boolean(patent?.archivalEdition);
      })
      .toSorted();

    expect(releasedIds).toEqual(approvedMappedIds);
    expect(releasedIds).not.toHaveLength(0);
  });

  test("keeps the retired hold list as a historical record without enforcement", () => {
    // The list must survive as QA history, but nothing on the publication
    // path may consult it again.
    expect(ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS.length).toBeGreaterThan(0);
    for (const patent of allPatents) {
      if (!patent.archivalEdition || !ARCHIVAL_PARALLEL_READINGS[patent.id]) continue;
      expect(archivalEditionForPublication(patent)).toBe(patent.archivalEdition);
    }
  });
});
