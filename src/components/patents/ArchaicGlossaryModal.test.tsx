import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { wrightFlyerPatent } from "@/data/patents/wright-flyer";
import { ArchaicGlossaryModal } from "./ArchaicGlossaryModal";

describe("ArchaicGlossaryModal component", () => {
  test("renders modal dialog, glossary terms, and academic citation formats", () => {
    const html = renderToStaticMarkup(
      <ArchaicGlossaryModal isOpen={true} onClose={() => {}} patent={wrightFlyerPatent} />,
    );

    expect(html).toContain("Archaic Legal Glossary &amp; Citations");
    expect(html).toContain("Historical Patent Glossary");
    expect(html).toContain("Academic Citation (BibTeX / APA)");
    expect(html).toContain("Letters Patent");
    expect(html).toContain("Aeroplane");
    expect(html).toContain("Undulating Current");
    expect(html).toContain("Optically Anisotropic Solution");
  });
});
