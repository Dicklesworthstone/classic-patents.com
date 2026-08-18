import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { allPatents } from "@/data/patents";

describe("PatentVisualDispatcher coverage", () => {
  const indexSource = readFileSync(
    join(process.cwd(), "src/components/patents/visuals/index.tsx"),
    "utf8",
  );

  test("contains an explicit case for all 54 patents in the library", () => {
    expect(allPatents.length).toBe(54);

    const missingCases: string[] = [];
    for (const patent of allPatents) {
      const casePattern = `case "${patent.id}":`;
      if (!indexSource.includes(casePattern)) {
        missingCases.push(patent.id);
      }
    }

    expect(missingCases).toEqual([]);
  });

  test("routes the corrected Bardeen and Brattain grant, not the unrelated Shockley grant", () => {
    expect(indexSource).toContain('case "us-2524035-bardeen-transistor":');
    expect(indexSource).not.toContain('case "us-2569347-bardeen-transistor":');
  });
});
