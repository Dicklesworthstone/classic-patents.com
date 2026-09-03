import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { generateChicagoCitation, generateRisCitation } from "@/utils/patentCitations";

describe("Archaic Legal Glossary & Academic Citation Engine", () => {
  test("generates valid BibTeX entries for every catalog patent", () => {
    for (const patent of allPatents) {
      const inventorNamesBibtex = patent.inventors.join(" and ");
      const [year, month, day] = patent.grantDate.split("-");

      const bibtex = `@patent{${patent.id},
  author    = {${inventorNamesBibtex}},
  title     = {${patent.title}},
  number    = {${patent.patentNumber}},
  year      = {${year}},
  month     = {${month}},
  day       = {${day}},
  url       = {https://classic-patents.com/patents/${patent.id}},
  note      = {Classic Patents Digital Museum}
}`;

      expect(bibtex).toContain(`@patent{${patent.id}`);
      expect(bibtex).toContain(`author    = {${inventorNamesBibtex}}`);
      expect(bibtex).toContain(`title     = {${patent.title}}`);
      expect(bibtex).toContain(`number    = {${patent.patentNumber}}`);
      expect(bibtex).toContain(`year      = {${year}}`);
      expect(bibtex).toContain(`url       = {https://classic-patents.com/patents/${patent.id}}`);
    }
  });

  test("generates valid APA reference citations for every catalog patent", () => {
    for (const patent of allPatents) {
      const inventorNamesApa = patent.inventors.join(", ");
      const year = patent.grantDate.split("-")[0];

      const apa = `${inventorNamesApa}. (${year}). ${patent.title} (U.S. Patent No. ${patent.patentNumber}). U.S. Patent and Trademark Office. https://classic-patents.com/patents/${patent.id}`;

      expect(apa).toContain(inventorNamesApa);
      expect(apa).toContain(`(${year})`);
      expect(apa).toContain(patent.title);
      expect(apa).toContain(`(U.S. Patent No. ${patent.patentNumber})`);
      expect(apa).toContain(`https://classic-patents.com/patents/${patent.id}`);
    }
  });

  test("generates valid RIS reference citations for every catalog patent", () => {
    for (const patent of allPatents) {
      const ris = generateRisCitation(patent);
      expect(ris.startsWith("TY  - PAT")).toBe(true);
      expect(ris.endsWith("ER  - ")).toBe(true);
      expect(ris).toContain(`TI  - ${patent.title}`);
      expect(ris).toContain(`M3  - U.S. Patent ${patent.patentNumber}`);
      expect(ris).toContain(`UR  - https://classic-patents.com/patents/${patent.id}`);
    }
  });

  test("generates valid Chicago Manual of Style citations for every catalog patent", () => {
    for (const patent of allPatents) {
      const chicago = generateChicagoCitation(patent);
      expect(chicago).toContain(patent.title);
      expect(chicago).toContain(patent.patentNumber);
      expect(chicago.endsWith(`https://classic-patents.com/patents/${patent.id}.`)).toBe(true);
    }
  });

  test("Wright Flyer exemplar produces pristine academic citation strings", () => {
    const wright = allPatents.find((p) => p.id === "us-821393-wright-flyer");
    expect(wright).toBeDefined();
    if (!wright) return;

    expect(wright.inventors).toEqual(["Orville Wright", "Wilbur Wright"]);
    expect(wright.grantDate).toBe("1906-05-22");
    expect(wright.patentNumber).toBe("US 821,393");
    expect(wright.title).toBe("Flying-Machine");

    const bibtexAuthor = wright.inventors.join(" and ");
    expect(bibtexAuthor).toBe("Orville Wright and Wilbur Wright");

    const apaAuthor = wright.inventors.join(", ");
    expect(apaAuthor).toBe("Orville Wright, Wilbur Wright");

    const ris = generateRisCitation(wright);
    expect(ris).toContain("AU  - Wright, Orville\nAU  - Wright, Wilbur");

    const chicago = generateChicagoCitation(wright);
    expect(chicago).toContain(
      'Wright, Orville, and Wilbur Wright. 1906. "Flying-Machine." U.S. Patent US 821,393',
    );
  });
});
