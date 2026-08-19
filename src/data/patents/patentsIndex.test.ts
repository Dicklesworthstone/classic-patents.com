import { describe, expect, test } from "bun:test";
import {
  allPatents,
  getAdjacentPatents,
  getFeaturedPatents,
  getPatentById,
  getPatentsByCategory,
  legacyPatentRedirectFor,
  searchPatents,
} from "./index";

describe("Patents Index & Search Helper Methods", () => {
  test("allPatents contains exactly 54 unique patents in chronological grant order", () => {
    expect(allPatents.length).toBe(54);

    const ids = new Set(allPatents.map((p) => p.id));
    expect(ids.size).toBe(54);

    // Verify chronological ordering
    for (let i = 0; i < allPatents.length - 1; i++) {
      expect(allPatents[i].grantDate <= allPatents[i + 1].grantDate).toBe(true);
    }
  });

  test("getPatentById resolves existing patents and returns undefined for unknown ids", () => {
    const wright = getPatentById("us-821393-wright-flyer");
    expect(wright).toBeDefined();
    expect(wright?.title).toBe("Flying-Machine");

    const unknown = getPatentById("non-existent-patent");
    expect(unknown).toBeUndefined();
  });

  test("legacyPatentRedirectFor resolves historical URL aliases", () => {
    expect(legacyPatentRedirectFor("us-533367-tesla-coil")).toBe("us-593138-tesla-coil");
    expect(legacyPatentRedirectFor("us-2569347-bardeen-transistor")).toBe(
      "us-2524035-bardeen-transistor",
    );
    expect(legacyPatentRedirectFor("unknown-alias")).toBeUndefined();
  });

  test("getFeaturedPatents returns a non-empty subset of museum exemplar patents", () => {
    const featured = getFeaturedPatents();
    expect(featured.length).toBeGreaterThanOrEqual(10);
    expect(featured.some((p) => p.id === "us-821393-wright-flyer")).toBe(true);
    expect(featured.some((p) => p.id === "us-381968-tesla-motor")).toBe(true);
  });

  test("getPatentsByCategory filters patents by category correctly", () => {
    const all = getPatentsByCategory("all");
    expect(all.length).toBe(54);

    const electricity = getPatentsByCategory("electricity");
    expect(electricity.length).toBeGreaterThan(0);
    expect(electricity.every((p) => p.category === "electricity")).toBe(true);

    const aviation = getPatentsByCategory("aviation");
    expect(aviation.length).toBeGreaterThan(0);
    expect(aviation.every((p) => p.category === "aviation" || p.category === "aerospace")).toBe(
      true,
    );
  });

  test("getAdjacentPatents returns chronological prev and next navigation neighbors", () => {
    const first = allPatents[0];
    const firstAdj = getAdjacentPatents(first.id);
    expect(firstAdj.prev).toBeNull();
    expect(firstAdj.next).toBeDefined();
    expect(firstAdj.next?.id).toBe(allPatents[1].id);

    const last = allPatents[allPatents.length - 1];
    const lastAdj = getAdjacentPatents(last.id);
    expect(lastAdj.next).toBeNull();
    expect(lastAdj.prev).toBeDefined();
    expect(lastAdj.prev?.id).toBe(allPatents[allPatents.length - 2].id);

    const wrightAdj = getAdjacentPatents("us-821393-wright-flyer");
    expect(wrightAdj.prev).toBeDefined();
    expect(wrightAdj.next).toBeDefined();

    const missingAdj = getAdjacentPatents("unknown-id");
    expect(missingAdj.prev).toBeNull();
    expect(missingAdj.next).toBeNull();
  });

  test("searchPatents queries across titles, numbers, inventors, summaries, and tags", () => {
    const emptySearch = searchPatents("");
    expect(emptySearch.length).toBe(54);

    const teslaSearch = searchPatents("Tesla");
    expect(teslaSearch.length).toBeGreaterThanOrEqual(3);
    expect(teslaSearch.some((p) => p.id === "us-381968-tesla-motor")).toBe(true);

    const numberSearch = searchPatents("821,393");
    expect(numberSearch.length).toBe(1);
    expect(numberSearch[0].id).toBe("us-821393-wright-flyer");

    const keywordSearch = searchPatents("aerodynamic");
    expect(keywordSearch.length).toBeGreaterThan(0);

    const noMatch = searchPatents("xyznonexistentterm12345");
    expect(noMatch.length).toBe(0);
  });
});
