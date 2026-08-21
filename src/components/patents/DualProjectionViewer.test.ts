import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ARCHIVAL_PARALLEL_READINGS } from "@/data/editions/parallelReadings";
import { isArchivalEditionExplicitlyWithheld } from "@/data/editions/publicationApproval";
import { allPatents } from "@/data/patents";
import { lamarrPatent } from "@/data/patents/lamarr-frequency-hopping";
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
    expect(PATENT_PAGE_SOURCE).toContain("<DualProjectionViewer patent={patent} />");
    expect(PATENT_PAGE_SOURCE).not.toContain("searchParams");
    expect(E2E_AUDIT_SOURCE).toContain('searchParams.get("view") === "original-spec"');
    expect(E2E_AUDIT_SOURCE).toContain('searchParams.get("view") === view');
  });
});

describe("archival publication boundary", () => {
  test("renders only editions with approved explicit paragraph companions", () => {
    expect(archivalEditionForPublication(lamarrPatent)).toBe(lamarrPatent.archivalEdition);
    expect(isArchivalEditionExplicitlyWithheld(whitneyCottonGinPatent.id)).toBe(true);
    expect(archivalEditionForPublication(whitneyCottonGinPatent)).toBeUndefined();
    const unmappedPatent: Patent = {
      ...lamarrPatent,
      id: "us-unmapped-draft-test",
    };
    expect(archivalEditionForPublication(unmappedPatent)).toBeUndefined();
  });

  test("does not make optional reviewed-ledger page anchors a publication condition", () => {
    const asset = lamarrPatent.originalTextAsset;
    if (!asset) {
      throw new Error("Lamarr publication fixture requires a reviewed source asset.");
    }

    const withoutOptionalPageAnchors: Patent = {
      ...lamarrPatent,
      originalTextAsset: { ...asset, pageAnchors: undefined },
    };

    expect(archivalEditionForPublication(withoutOptionalPageAnchors)).toBe(
      lamarrPatent.archivalEdition,
    );
  });

  test("releases exactly the curated companion-reading registry", () => {
    const releasedIds = allPatents
      .filter((patent) => archivalEditionForPublication(patent))
      .map((patent) => patent.id)
      .toSorted();

    expect(releasedIds).toEqual(Object.keys(ARCHIVAL_PARALLEL_READINGS).toSorted());
    expect(releasedIds).not.toHaveLength(0);
  });
});
