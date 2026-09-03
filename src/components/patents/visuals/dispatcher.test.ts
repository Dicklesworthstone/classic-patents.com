import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { allPatents } from "@/data/patents";

describe("PatentVisualDispatcher coverage", () => {
  const indexSource = readFileSync(
    join(process.cwd(), "src/components/patents/visuals/index.tsx"),
    "utf8",
  );

  test("contains an explicit case for all patents in the library", () => {
    expect(allPatents.length).toBeGreaterThanOrEqual(55);

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

  test("routes only the source-held Kwolek record to an explicit visual refusal", () => {
    const switchBody = indexSource.split("switch (patentId)")[1] ?? "";
    const kwolekCase = switchBody.match(
      /case "us-3671542-kwolek-kevlar":([\s\S]*?)case "us-3728480-baer-odyssey":/,
    )?.[1];
    expect(kwolekCase).toContain("SourceVisualUnavailable");
    expect(kwolekCase).not.toContain("KwolekKevlar3D");
    expect(kwolekCase).not.toContain("KwolekKevlarSim");

    const interactiveCases = switchBody.replace(kwolekCase ?? "", "");
    expect(interactiveCases).not.toContain("source-crop");
    expect(interactiveCases).not.toContain("Pinned facsimile");
    expect(interactiveCases).not.toContain("SourceVisualUnavailable");

    const groups = switchBody.split(/case "/).slice(1);
    const incomplete: string[] = [];
    for (const group of groups) {
      if (group.startsWith('us-3671542-kwolek-kevlar"')) continue;
      if (group.includes("No interactive physics module")) continue;
      // Fall-through aliases share the next case's 3D/2D return.
      if (!group.includes("return ")) continue;
      if (!group.includes('renderMode === "3d-physics"')) {
        const id = group.slice(0, group.indexOf('"'));
        incomplete.push(id || group.slice(0, 40));
      }
    }
    expect(incomplete).toEqual([]);
  });
});
