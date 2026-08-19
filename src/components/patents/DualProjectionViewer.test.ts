import { describe, expect, test } from "bun:test";
import { ARCHIVAL_PARALLEL_READINGS } from "@/data/editions/parallelReadings";
import { isArchivalEditionExplicitlyWithheld } from "@/data/editions/publicationApproval";
import { allPatents } from "@/data/patents";
import { lamarrPatent } from "@/data/patents/lamarr-frequency-hopping";
import { mergenthalerLinotypePatent } from "@/data/patents/mergenthaler-linotype";
import type { Patent } from "@/types/patent";
import { archivalEditionForPublication, viewModeFromSearch } from "./DualProjectionViewer";

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
});

describe("archival publication boundary", () => {
  test("renders only editions with approved explicit paragraph companions", () => {
    expect(archivalEditionForPublication(lamarrPatent)).toBe(lamarrPatent.archivalEdition);
    expect(isArchivalEditionExplicitlyWithheld(mergenthalerLinotypePatent.id)).toBe(true);
    expect(archivalEditionForPublication(mergenthalerLinotypePatent)).toBeUndefined();
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
