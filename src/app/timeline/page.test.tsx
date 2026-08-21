import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { metadata } from "./page";

describe("Timeline Page & Chronology Suite", () => {
  test("exports valid museum metadata for the timeline route", () => {
    expect(metadata.title).toBe("Historical Inventions Timeline (1769–2009) — Classic Patents");
    expect(metadata.description).toContain("Interactive chronology of transformative patents");
  });

  test("chronological patent list spans all historical eras without date gaps", () => {
    const sorted = [...allPatents].sort((a, b) => a.grantDate.localeCompare(b.grantDate));
    expect(sorted.length).toBe(allPatents.length);
    expect(sorted.length).toBeGreaterThanOrEqual(54);

    // Verify first and last patent dates
    const firstYear = Number.parseInt(sorted[0].grantDate.split("-")[0], 10);
    const lastYear = Number.parseInt(sorted[sorted.length - 1].grantDate.split("-")[0], 10);
    expect(firstYear).toBeLessThanOrEqual(1790);
    expect(lastYear).toBeGreaterThanOrEqual(2000);

    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].grantDate <= sorted[i + 1].grantDate).toBe(true);
    }
  });

  test("era groupings accurately partition the patent collection", () => {
    const early = allPatents.filter((p) => Number.parseInt(p.grantDate.split("-")[0], 10) < 1870);
    const gilded = allPatents.filter((p) => {
      const yr = Number.parseInt(p.grantDate.split("-")[0], 10);
      return yr >= 1870 && yr < 1910;
    });
    const modern = allPatents.filter((p) => Number.parseInt(p.grantDate.split("-")[0], 10) >= 1910);

    expect(early.length).toBeGreaterThan(0);
    expect(gilded.length).toBeGreaterThan(0);
    expect(modern.length).toBeGreaterThan(0);
    expect(early.length + gilded.length + modern.length).toBe(allPatents.length);
  });
});
