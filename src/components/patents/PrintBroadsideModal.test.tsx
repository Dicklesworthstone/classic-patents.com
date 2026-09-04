import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { wrightFlyerPatent } from "@/data/patents/wright-flyer";
import { PrintBroadsideModal } from "./PrintBroadsideModal";

describe("PrintBroadsideModal component", () => {
  test("renders closed dialog gracefully with all broadside elements ready", () => {
    const html = renderToStaticMarkup(
      <PrintBroadsideModal isOpen={false} onClose={() => {}} patent={wrightFlyerPatent} />,
    );

    expect(html).toContain("dialog");
    expect(html).toContain("broadside-modal-title");
    expect(html).toContain("Museum Broadside &amp; Archival Print Edition");
    expect(html).toContain("US 821,393");
    expect(html).toContain("FLYING-MACHINE");
    expect(html).toContain("Orville Wright, Wilbur Wright");
    expect(html).toContain("The United States Patent &amp; Trademark Archive");
    expect(html).toContain("Print Broadside / Save PDF");
    expect(html).toContain("Copy Broadside Text");
  });

  test("renders open dialog state and includes mechanism and claims sections", () => {
    const html = renderToStaticMarkup(
      <PrintBroadsideModal isOpen={true} onClose={() => {}} patent={wrightFlyerPatent} />,
    );

    expect(html).toContain("Historical Context &amp; Grant Summary");
    expect(html).toContain("Core Mechanism &amp; Scientific Principles");
    expect(html).toContain("The Granted Legal Monopoly");
    expect(html).toContain("Mechanical Organ Breakdown");
    expect(html).toContain("Letter (8.5×11″)");
    expect(html).toContain("Parchment");
    expect(html).toContain("Blueprint");
    expect(html).toContain("Monochrome");
  });

  test("renders broadside consistently across multiple diverse catalog patents", async () => {
    const { teslaMotorPatent } = await import("@/data/patents/tesla-motor");
    const { edisonBulbPatent } = await import("@/data/patents/edison-lightbulb");
    const { kamenTransporterPatent } = await import("@/data/patents/kamen-transporter");

    for (const p of [teslaMotorPatent, edisonBulbPatent, kamenTransporterPatent]) {
      const html = renderToStaticMarkup(
        <PrintBroadsideModal isOpen={true} onClose={() => {}} patent={p} />,
      );
      expect(html).toContain(p.patentNumber);
      expect(html).toContain(p.title.toUpperCase());
      expect(html).toContain(p.usptoClassification);
      expect(html).toContain("Print Broadside / Save PDF");
    }
  });
});
