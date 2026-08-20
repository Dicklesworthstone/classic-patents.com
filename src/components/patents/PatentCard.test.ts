import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";

describe("Patent Card & Catalog Directory Navigation", () => {
  test("every patent has valid link targets and display attributes", () => {
    for (const patent of allPatents) {
      expect(patent.id).toBeTruthy();
      expect(/^(us|gb|fr|de)-/.test(patent.id)).toBe(true);
      expect(patent.patentNumber).toBeTruthy();
      expect(patent.shortTitle.trim().length).toBeGreaterThan(0);
      expect(patent.subtitle.trim().length).toBeGreaterThan(0);
      expect(patent.summary.trim().length).toBeGreaterThan(30);
      expect(patent.inventors.length).toBeGreaterThan(0);
      expect(patent.grantDate.trim().length).toBe(10);
      expect(patent.era.trim().length).toBeGreaterThan(0);
    }
  });

  test("chronological order of allPatents is monotonic", () => {
    for (let i = 0; i < allPatents.length - 1; i++) {
      const current = allPatents[i].grantDate;
      const next = allPatents[i + 1].grantDate;
      expect(current <= next).toBe(true);
    }
  });

  test("Wright Flyer exemplar contains accurate card metadata", () => {
    const wright = allPatents.find((p) => p.id === "us-821393-wright-flyer");
    expect(wright).toBeDefined();
    if (!wright) return;

    expect(wright.shortTitle).toContain("Wright Flyer");
    expect(wright.patentNumber).toBe("US 821,393");
    expect(wright.inventors).toContain("Orville Wright");
    expect(wright.inventors).toContain("Wilbur Wright");
    expect(wright.grantDate).toBe("1906-05-22");
    expect(wright.era).toContain("Electrification");
  });
});
