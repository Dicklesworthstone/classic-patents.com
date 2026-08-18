import { describe, expect, test } from "bun:test";
import { marconiRadioPatent } from "@/data/patents/marconi-radio";
import { wrightFlyerPatent } from "@/data/patents/wright-flyer";
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
  test("renders only editions that have explicit paragraph companions", () => {
    expect(archivalEditionForPublication(wrightFlyerPatent)).toBe(
      wrightFlyerPatent.archivalEdition,
    );
    expect(archivalEditionForPublication(marconiRadioPatent)).toBeUndefined();
  });
});
