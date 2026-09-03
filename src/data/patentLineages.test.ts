import { describe, expect, test } from "bun:test";
import {
  ALL_PATENT_LINEAGES,
  getLineageAncestryForPatent,
  getLineagesForPatent,
} from "./patentLineages";
import { allPatents, getPatentById } from "./patents";

describe("patentLineages data store", () => {
  test("every patentId referenced in every lineage exists in allPatents", () => {
    const validPatentIds = new Set(allPatents.map((p) => p.id));

    for (const lineage of ALL_PATENT_LINEAGES) {
      expect(lineage.steps.length).toBeGreaterThanOrEqual(3);
      for (const step of lineage.steps) {
        expect(
          validPatentIds.has(step.patentId),
          `Patent ID "${step.patentId}" in lineage "${lineage.id}" must exist in catalog`,
        ).toBe(true);

        const patent = getPatentById(step.patentId);
        expect(patent).toBeDefined();
        if (patent) {
          expect(patent.title.length).toBeGreaterThan(0);
        }
      }
    }
  });

  test("steps within every lineage are strictly in chronological order", () => {
    for (const lineage of ALL_PATENT_LINEAGES) {
      for (let i = 1; i < lineage.steps.length; i++) {
        const prevYear = Number(lineage.steps[i - 1].year);
        const currYear = Number(lineage.steps[i].year);
        expect(
          currYear,
          `Lineage "${lineage.id}" step ${i} (${currYear}) must be >= previous step (${prevYear})`,
        ).toBeGreaterThanOrEqual(prevYear);
      }
    }
  });

  test("getLineagesForPatent finds lineages for Wright Flyer and Tesla Motor", () => {
    const wrightLineages = getLineagesForPatent("us-821393-wright-flyer");
    expect(wrightLineages.length).toBe(1);
    expect(wrightLineages[0].id).toBe("aerospace-flight");

    const teslaLineages = getLineagesForPatent("us-381968-tesla-motor");
    expect(teslaLineages.length).toBe(1);
    expect(teslaLineages[0].id).toBe("electrification-power");
  });

  test("getLineageAncestryForPatent identifies predecessors, current step, and successors", () => {
    const ancestry = getLineageAncestryForPatent("us-821393-wright-flyer");
    expect(ancestry.lineage).toBeDefined();
    expect(ancestry.predecessors.length).toBe(1);
    expect(ancestry.predecessors[0].patentId).toBe("us-621195-zeppelin-airship");
    expect(ancestry.currentStep?.patentId).toBe("us-821393-wright-flyer");
    expect(ancestry.successors.length).toBe(2);
    expect(ancestry.successors[0].patentId).toBe("us-1102653-goddard-rocket");
    expect(ancestry.successors[1].patentId).toBe("us-2318259-sikorsky-helicopter");
  });
});
