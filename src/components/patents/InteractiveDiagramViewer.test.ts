import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { allPatents } from "@/data/patents";
import { wrightFlyerPatent } from "@/data/patents/wright-flyer";
import { resetPatentPhysicsParams, setPatentPhysicsParam } from "@/physics/usePatentPhysics";

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
    expect(source).toContain("shaftPosition = Math.round(params?.shaftPosition ?? 0)");
    expect(source).toContain("sourceFlowVisible ?? 1");
    expect(source).not.toContain("Needle Nozzle");
    expect(source).not.toContain("165° Jet Energy Extraction");
    expect(source).not.toContain("Balanced Crankcase Flywheels");
    expect(source).not.toContain("Hot Tube");
  });

  test("opens Tesla's secondary bond on the same shared Claim 1 state as both model faces", () => {
    const patent = allPatents.find((candidate) => candidate.id === "us-593138-tesla-coil");
    if (!patent) throw new Error("Tesla transformer patent fixture is missing");
    setPatentPhysicsParam(patent.id, "claim1CommonNodeConnected", 0);
    try {
      const html = renderToStaticMarkup(
        React.createElement(InteractiveDiagramViewer, {
          drawings: patent.drawings,
          patentId: patent.id,
          patentNumber: patent.patentNumber,
        }),
      );
      expect(html).toContain(">open</text>");
    } finally {
      resetPatentPhysicsParams(patent.id);
    }
  });

  test("routes AMF Versatran figure variants to one live, source-bounded topology frame", () => {
    const patent = allPatents.find((candidate) => candidate.id === "us-3212649-amf-versatran");
    if (!patent) throw new Error("AMF Versatran patent fixture is missing");

    const source = readFileSync(
      join(process.cwd(), "src/components/patents/InteractiveDiagramViewer.tsx"),
      "utf8",
    );
    expect(source).toContain('"amf-versatran": true');
    expect(source).toContain("FrankenSimEngine.stepAmfVersatranTopology(params)");

    const renderFrame = () =>
      renderToStaticMarkup(
        React.createElement(InteractiveDiagramViewer, {
          drawings: patent.drawings,
          patentId: patent.id,
          patentNumber: patent.patentNumber,
        }),
      );

    resetPatentPhysicsParams(patent.id);
    try {
      const teachFrame = renderFrame();
      setPatentPhysicsParam(patent.id, "columnRotation", 0.5);
      setPatentPhysicsParam(patent.id, "carriageLift", 0.8);
      setPatentPhysicsParam(patent.id, "armTravel", 0.2);
      setPatentPhysicsParam(patent.id, "wristRotation", -0.4);
      setPatentPhysicsParam(patent.id, "wristSwing", 0.4);
      setPatentPhysicsParam(patent.id, "teachReplayMode", 1);
      setPatentPhysicsParam(patent.id, "resolverPhaseOffset", 0.25);
      const playbackFrame = renderFrame();

      expect(playbackFrame).toContain('data-amf-versatran-topology="typed-ts-source-bounded"');
      expect(playbackFrame).toContain('data-amf-versatran-active-claim="8"');
      expect(playbackFrame).toContain(
        'data-amf-versatran-program-mode="automatic-recorded-signal-playback"',
      );
      expect(playbackFrame).toContain("max |e_i| = 0.25");
      expect(playbackFrame).not.toBe(teachFrame);

      setPatentPhysicsParam(patent.id, "claim12PinionGripperEnabled", 0);
      const claim12WithheldFrame = renderFrame();
      expect(claim12WithheldFrame).toContain('data-amf-versatran-claim-12="withheld"');

      setPatentPhysicsParam(patent.id, "claim8RecordPlaybackEnabled", 0);
      const claim8WithheldFrame = renderFrame();
      expect(claim8WithheldFrame).toContain('data-amf-versatran-claim-8="withheld"');
      expect(claim8WithheldFrame).toContain("REPLAY WITHHELD");

      setPatentPhysicsParam(patent.id, "claim1TopologyEnabled", 0);
      const claim1WithheldFrame = renderFrame();
      expect(claim1WithheldFrame).toContain('data-amf-versatran-claim-1="withheld"');
      expect(claim1WithheldFrame).toContain("CLAIM 1 SIX-MOTION TOPOLOGY WITHHELD");
    } finally {
      resetPatentPhysicsParams(patent.id);
    }
  });

  test("routes every Clavel Delta drawing through the shared paired-bar topology kernel", () => {
    const patent = allPatents.find((candidate) => candidate.id === "us-4976582-clavel-delta-robot");
    if (!patent) throw new Error("Clavel Delta robot patent fixture is missing");

    const source = readFileSync(
      join(process.cwd(), "src/components/patents/InteractiveDiagramViewer.tsx"),
      "utf8",
    );
    expect(source).toContain("stepClavelDeltaRobotTopology(params ?? {})");
    for (const svgType of [
      "clavel-delta-robot",
      "clavel-delta-ball-joint",
      "clavel-delta-single-bar",
      "clavel-delta-linear",
    ]) {
      expect(source).toContain(`"${svgType}"`);
    }

    const renderFrame = () =>
      renderToStaticMarkup(
        React.createElement(InteractiveDiagramViewer, {
          drawings: patent.drawings,
          patentId: patent.id,
          patentNumber: patent.patentNumber,
        }),
      );

    resetPatentPhysicsParams(patent.id);
    try {
      const baseline = renderFrame();
      expect(baseline).toContain('data-clavel-delta-robot-topology="typed-ts-source-bounded"');
      expect(baseline).toContain('data-clavel-delta-robot-claim-1="live"');
      expect(baseline).toContain('data-clavel-delta-robot-claim-2="live"');
      expect(baseline).toContain('data-clavel-delta-robot-claim-8="live"');
      expect(source).toContain("FIG. 2 · BALL-AND-SOCKET JOINT ALTERNATIVE");
      expect(source).toContain("FIGS. 3–4 · SINGLE-BAR / CARDAN ALTERNATIVE");
      expect(source).toContain("FIG. 5 · STRAIGHT-GUIDE INPUT ALTERNATIVE");
      expect(source).toContain("data-clavel-delta-figure-2-drive={");
      expect(source).toContain('"claim-9-movable-member"');
      expect(source).toContain("motor 11 is mounted on movable member 8 (Claim 9)");
      expect(source).toContain('{isLinearFigure ? "13" : "2"}');
      expect(source).toContain("ACTUATOR HOUSINGS 13 · TRANSLATING MEMBERS 24");

      const renderOnlyFigure = (figureNumber: string) => {
        const drawing = patent.drawings.find(
          (candidate) => candidate.figureNumber === figureNumber,
        );
        if (!drawing) throw new Error(`Clavel Figure ${figureNumber} fixture is missing`);
        return renderToStaticMarkup(
          React.createElement(InteractiveDiagramViewer, {
            drawings: [drawing],
            patentId: patent.id,
            patentNumber: patent.patentNumber,
          }),
        );
      };
      const figureTwo = renderOnlyFigure("2");
      expect(figureTwo).toContain('data-clavel-delta-figure-2-drive="claim-9-movable-member"');
      expect(figureTwo).toContain("11 ON 8 · CLAIM 9");
      expect(figureTwo).not.toContain(">14</text>");

      const figureFive = renderOnlyFigure("5");
      expect(figureFive).toContain("ACTUATOR HOUSINGS 13 · TRANSLATING MEMBERS 24");
      expect(figureFive).toContain(">13</text>");
      expect(figureFive).toContain(">24</text>");
      expect(figureFive).not.toContain(">2</text>");

      setPatentPhysicsParam(patent.id, "armOneInput", 0.55);
      expect(renderFrame()).not.toBe(baseline);

      setPatentPhysicsParam(patent.id, "claim2PairedBarsEnabled", 0);
      const pairedBarsWithheld = renderFrame();
      expect(pairedBarsWithheld).toContain('data-clavel-delta-robot-claim-2="withheld"');
      expect(pairedBarsWithheld).toContain("CLAIM 2 PAIR WITHHELD");

      setPatentPhysicsParam(patent.id, "claim1TopologyEnabled", 0);
      const topologyWithheld = renderFrame();
      expect(topologyWithheld).toContain('data-clavel-delta-robot-claim-1="withheld"');
      expect(topologyWithheld).toContain("CLAIM 1 PARALLEL-LINKAGE TOPOLOGY WITHHELD");
    } finally {
      resetPatentPhysicsParams(patent.id);
    }
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
