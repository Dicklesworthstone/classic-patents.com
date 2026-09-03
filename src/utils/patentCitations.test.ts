import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { wrightFlyerPatent } from "@/data/patents/wright-flyer";
import {
  formatAuthorLastFirst,
  formatChicagoAuthors,
  generateApaCitation,
  generateBibtexCitation,
  generateChicagoCitation,
  generateRisCitation,
} from "./patentCitations";

describe("patentCitations utilities", () => {
  describe("formatAuthorLastFirst", () => {
    test("inverts standard First Last to Last, First", () => {
      expect(formatAuthorLastFirst("Orville Wright")).toBe("Wright, Orville");
      expect(formatAuthorLastFirst("Thomas Alva Edison")).toBe("Edison, Thomas Alva");
      expect(formatAuthorLastFirst("Alexander Graham Bell")).toBe("Bell, Alexander Graham");
    });

    test("preserves existing Last, First or single tokens", () => {
      expect(formatAuthorLastFirst("Edison, Thomas")).toBe("Edison, Thomas");
      expect(formatAuthorLastFirst("Cher")).toBe("Cher");
      expect(formatAuthorLastFirst("")).toBe("");
    });
  });

  describe("formatChicagoAuthors", () => {
    test("formats single author", () => {
      expect(formatChicagoAuthors(["Thomas Alva Edison"])).toBe("Edison, Thomas Alva");
    });

    test("formats two authors with 'and'", () => {
      expect(formatChicagoAuthors(["Orville Wright", "Wilbur Wright"])).toBe(
        "Wright, Orville, and Wilbur Wright",
      );
    });

    test("formats three or more authors with Oxford comma and 'and'", () => {
      expect(formatChicagoAuthors(["John Bardeen", "Walter H. Brattain", "William Shockley"])).toBe(
        "Bardeen, John, Walter H. Brattain, and William Shockley",
      );
    });

    test("handles empty array gracefully", () => {
      expect(formatChicagoAuthors([])).toBe("");
    });
  });

  describe("generateBibtexCitation", () => {
    test("generates valid BibTeX for Wright Flyer", () => {
      const bibtex = generateBibtexCitation(wrightFlyerPatent);
      expect(bibtex).toContain("@patent{us-821393-wright-flyer,");
      expect(bibtex).toContain("author    = {Orville Wright and Wilbur Wright}");
      expect(bibtex).toContain("title     = {Flying-Machine}");
      expect(bibtex).toContain("number    = {US 821,393}");
      expect(bibtex).toContain("year      = {1906}");
      expect(bibtex).toContain("month     = {05}");
      expect(bibtex).toContain("day       = {22}");
      expect(bibtex).toContain(
        "url       = {https://classic-patents.com/patents/us-821393-wright-flyer}",
      );
      expect(bibtex).toContain("note      = {Classic Patents Digital Museum}");
    });

    test("generates valid BibTeX for all catalog patents", () => {
      for (const patent of allPatents) {
        const bibtex = generateBibtexCitation(patent);
        expect(bibtex.startsWith(`@patent{${patent.id},`)).toBe(true);
        expect(bibtex).toContain(`title     = {${patent.title}}`);
        expect(bibtex.endsWith("}")).toBe(true);
      }
    });
  });

  describe("generateRisCitation", () => {
    test("generates valid RIS for Wright Flyer", () => {
      const ris = generateRisCitation(wrightFlyerPatent);
      expect(ris).toContain("TY  - PAT");
      expect(ris).toContain("TI  - Flying-Machine");
      expect(ris).toContain("AU  - Wright, Orville");
      expect(ris).toContain("AU  - Wright, Wilbur");
      expect(ris).toContain("PY  - 1906");
      expect(ris).toContain("DA  - 1906/05/22");
      expect(ris).toContain("PB  - U.S. Patent and Trademark Office");
      expect(ris).toContain("M3  - U.S. Patent US 821,393");
      expect(ris).toContain("UR  - https://classic-patents.com/patents/us-821393-wright-flyer");
      expect(ris).toContain("ER  - ");
    });

    test("generates valid RIS for all catalog patents", () => {
      for (const patent of allPatents) {
        const ris = generateRisCitation(patent);
        expect(ris.startsWith("TY  - PAT")).toBe(true);
        expect(ris.endsWith("ER  - ")).toBe(true);
        expect(ris).toContain(`TI  - ${patent.title}`);
        expect(ris).toContain(`M3  - U.S. Patent ${patent.patentNumber}`);
      }
    });
  });

  describe("generateChicagoCitation", () => {
    test("generates valid Chicago citation for Wright Flyer", () => {
      const chicago = generateChicagoCitation(wrightFlyerPatent);
      expect(chicago).toContain("Wright, Orville, and Wilbur Wright. 1906.");
      expect(chicago).toContain('"Flying-Machine."');
      expect(chicago).toContain("U.S. Patent US 821,393");
      expect(chicago).toContain("filed March 23, 1903, and issued May 22, 1906.");
      expect(chicago).toContain("https://classic-patents.com/patents/us-821393-wright-flyer.");
    });

    test("generates valid Chicago citation for all catalog patents", () => {
      for (const patent of allPatents) {
        const chicago = generateChicagoCitation(patent);
        expect(chicago).toContain(patent.title);
        expect(chicago).toContain(patent.patentNumber);
        expect(chicago.endsWith(`https://classic-patents.com/patents/${patent.id}.`)).toBe(true);
      }
    });
  });

  describe("generateApaCitation", () => {
    test("generates valid APA citation for Wright Flyer", () => {
      const apa = generateApaCitation(wrightFlyerPatent);
      expect(apa).toBe(
        "Orville Wright, Wilbur Wright. (1906). Flying-Machine (U.S. Patent No. US 821,393). U.S. Patent and Trademark Office. https://classic-patents.com/patents/us-821393-wright-flyer",
      );
    });
  });
});
