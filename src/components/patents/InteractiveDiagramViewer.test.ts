import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { allPatents } from "@/data/patents";
import { wrightFlyerPatent } from "@/data/patents/wright-flyer";

describe("Interactive Historical Schematic & Drawing Sheets", () => {
  test("ensures every catalog patent with drawings has authentic figures, titles, and captions", () => {
    let totalDrawingsChecked = 0;
    for (const patent of allPatents) {
      expect(patent.drawings).toBeDefined();
      for (const drawing of patent.drawings) {
        totalDrawingsChecked++;
        expect(drawing.figureNumber.trim().length).toBeGreaterThan(0);
        expect(drawing.title.trim().length).toBeGreaterThan(3);
        expect(drawing.caption.trim().length).toBeGreaterThan(5);
        expect(drawing.svgType).toBeDefined();
      }
    }
    expect(totalDrawingsChecked).toBeGreaterThan(50);
  });

  test("Wright Flyer exemplar contains Fig 1 with authentic callout coordinates", () => {
    expect(wrightFlyerPatent.drawings.length).toBeGreaterThanOrEqual(1);
    const fig1 = wrightFlyerPatent.drawings.find((d) => d.figureNumber.includes("1"));
    expect(fig1).toBeDefined();
    expect(fig1?.callouts).toBeDefined();
    expect(fig1?.callouts?.length).toBeGreaterThan(0);

    // Callout labels match facsimile letters/numbers
    const calloutLabels = fig1?.callouts?.map((c) => c.label);
    expect(calloutLabels).toContain("1");
  });

  test("validates callout coordinates stay within [0, 100]% bounding box", () => {
    for (const patent of allPatents) {
      for (const drawing of patent.drawings) {
        if (drawing.callouts) {
          for (const callout of drawing.callouts) {
            expect(callout.x).toBeGreaterThanOrEqual(0);
            expect(callout.x).toBeLessThanOrEqual(100);
            expect(callout.y).toBeGreaterThanOrEqual(0);
            expect(callout.y).toBeLessThanOrEqual(100);
            expect(callout.element.trim().length).toBeGreaterThan(0);
          }
        }
      }
    }
  });
});

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { InteractiveDiagramViewer } from "./InteractiveDiagramViewer";

describe("InteractiveDiagramViewer React rendering", () => {
  test("renders SVG schematics and figure callout pins across all patents", () => {
    let renderedCount = 0;
    for (const patent of allPatents) {
      if (patent.drawings && patent.drawings.length > 0) {
        const html = renderToStaticMarkup(
          React.createElement(InteractiveDiagramViewer, {
            drawings: patent.drawings,
            patentId: patent.id,
            patentNumber: patent.patentNumber,
          }),
        );
        expect(html.length).toBeGreaterThan(100);
        renderedCount++;
      }
    }
    expect(renderedCount).toBeGreaterThanOrEqual(46);
  });

  test("schematic kernels step live physics-bus sliders instead of empty defaults", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/InteractiveDiagramViewer.tsx"),
      "utf8",
    );
    for (const emptyStep of [
      "stepEdisonBulb({})",
      "stepWozniakApple({})",
      "stepEngelbartMouse({})",
      "stepBellTelephone({})",
      "stepLincolnBuoy({})",
      "stepMorseTelegraph({})",
      "stepEinsteinRefrigerator({})",
      "stepMergenthalerLinotype({})",
      "stepMaximMachineGun({})",
      "stepDaimlerEngine({})",
      "stepEastmanKodak({})",
      "stepHollerithTabulating({})",
      "stepRenoEscalator({})",
      "stepZeppelinAirship({})",
      "stepWhitneyCottonGin({})",
      "stepMcCormickReaper({})",
      "stepDavenportMotor({})",
      "stepEricssonPropeller({})",
      "stepCorlissEngine({})",
      "stepGatlingGun({})",
      "stepNobelDynamite({})",
      "stepHyattCelluloid({})",
      "stepGrammeDynamo({})",
      "stepPasteurFermentation({})",
      "stepGliddenBarbedWire({})",
      "stepOttoEngine({})",
      "stepEdisonPhonograph({})",
      "stepPeltonWheel({})",
      "stepDeLavalSeparator({})",
      "stepThomsonWelding({})",
      "stepParsonsTurbine({})",
    ]) {
      expect(source).not.toContain(emptyStep);
    }
    expect(source).toContain("voltage: params?.voltage");
    expect(source).toContain("filamentTempK");
    expect(source).toContain("lineVoltageV: params?.lineVoltageV");
    expect(source).toContain("matrixRatePerMin: params?.matrixRate");
    expect(source).toContain("engineRpm: params?.engineRpm");
  });

  test("keeps the Pasteur schematic on the apparatus printed in US 135,245", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/InteractiveDiagramViewer.tsx"),
      "utf8",
    );
    const pasteurCase = source.slice(
      source.indexOf('case "pasteur-fermentation"'),
      source.indexOf('case "glidden-barbed-wire"'),
    );
    expect(source).toContain('case "pasteur-fermentation-fig-2"');
    expect(source).toContain('[/pasteur-fermentation-fig-2/, "pasteur-fermentation-fig-2"]');
    for (const printedLabel of [
      "water pipe E",
      "M M",
      "gas generator",
      "Introduce boiling-hot wort",
    ])
      expect(pasteurCase).toContain(printedLabel);
    expect(pasteurCase).not.toContain("Boil closed");
    for (const unsupported of ["Swan-Neck", "Anaerobic Fermenter", "Pure Yeast Strain Bed"])
      expect(pasteurCase).not.toContain(unsupported);
  });
});
