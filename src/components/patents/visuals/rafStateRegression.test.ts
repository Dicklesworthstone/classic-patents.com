import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const SNAPSHOT_CONTRACTS = [
  ["DavenportMotorSim.tsx", "rotorAngleRef", "setRotorAngleDeg"],
  ["McCormickReaperSim.tsx", "phaseRef", "setPhase"],
  ["PasteurFermentationSim.tsx", "timerSecondsRef", "setTimerSeconds"],
  ["RenoEscalatorSim.tsx", "treadOffsetRef", "setTreadOffset"],
  ["StackhouseManipulatorSim.tsx", "animTimeRef", "setAnimTime"],
  ["TeslaMotorSim.tsx", "angleRef", "setAngle"],
  ["GatlingGunSim.tsx", "clusterAngleRef", "setClusterAngleDeg"],
  ["EricssonPropellerSim.tsx", "angleRef", "setAngleDeg"],
  ["MaximMachineGunSim.tsx", "cyclePhaseRef", "setCyclePhase"],
  ["ParsonsTurbineSim.tsx", "flowPhaseRef", "setFlowPhase"],
  ["WattSeparateCondenserSim.tsx", "animTimeRef", "setAnimTime"],
  ["EdisonPhonographSim.tsx", "cylinderAngleRef", "setCylinderAngleDeg"],
  ["DeLavalSeparatorSim.tsx", "angleRef", "setAngleDeg"],
  ["CorlissEngineSim.tsx", "crankAngleRef", "setCrankAngleDeg"],
  ["GrammeDynamoSim.tsx", "angleRef", "setAngleDeg"],
] as const;

function sourceFor(fileName: string) {
  return readFileSync(join(process.cwd(), "src/components/patents/visuals", fileName), "utf8");
}

describe("2D rAF presentation ownership", () => {
  test("keeps the audited simulator fleet out of direct React rAF state updates", () => {
    for (const [fileName, phaseRef, setter] of SNAPSHOT_CONTRACTS) {
      const source = sourceFor(fileName);

      expect(source).toContain(`const ${phaseRef} = useRef(0);`);
      expect(source).toContain("const UI_SNAPSHOT_INTERVAL_MS = 80;");
      expect(source).toContain("lastUiSnapshot");
      expect(source).toContain("requestAnimationFrame");
      expect(source).toContain(`${setter}(`);
      // This was the direct 60 Hz React-update shape found by the audit. The
      // rAF now advances a ref and only publishes a bounded snapshot.
      expect(source).not.toMatch(new RegExp(`${setter}\\(\\s*\\((?:prev|previous|t)\\)\\s*=>`));
    }
  });

  test("uses an imperative pipe pulse rather than React state for the air brake", () => {
    const source = sourceFor("WestinghouseAirBrakeSim.tsx");

    expect(source).toContain("const pulseRef = useRef(0);");
    expect(source).toContain("operatingPipePulseRef.current?.setAttribute");
    expect(source).not.toContain("setPulseAnim");
  });

  test("keeps the large Tesla schematic viewer on the same bounded snapshot contract", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/InteractiveDiagramViewer.tsx"),
      "utf8",
    );

    expect(source).toContain("const teslaOmegaRef = useRef(0);");
    expect(source).toContain("const UI_SNAPSHOT_INTERVAL_MS = 80;");
    expect(source).toContain("lastUiSnapshot");
    expect(source).not.toMatch(/setTeslaOmegaDeg\(\s*\(prev\)\s*=>/);
  });

  test("keeps Watt Rotary on the route-level owner without a private rAF loop", () => {
    const source = sourceFor("WattRotaryEngineSim.tsx");

    expect(source).toContain('useFrankenSimPhysics("gb-1306-watt-rotary-engine"');
    expect(source).toContain("getWattRotaryTapeFrame()?.telemetry");
    expect(source).not.toContain("requestAnimationFrame");
  });

  test("keeps Hopkins Potash on the route-level owner without a private rAF loop", () => {
    const source = sourceFor("HopkinsPotashSim.tsx");

    expect(source).toContain('useFrankenSimPhysics("us-x1-hopkins-potash"');
    expect(source).toContain("getHopkinsTapeFrame()");
    expect(source).not.toContain("requestAnimationFrame");
  });

  test("keeps Whitney Cotton Gin on the route-level owner without a private rAF loop", () => {
    const source = sourceFor("WhitneyCottonGinSim.tsx");

    expect(source).toContain('useFrankenSimPhysics("us-x72-whitney-cotton-gin"');
    expect(source).toContain("getWhitneyTapeFrame()");
    expect(source).not.toContain("requestAnimationFrame");
  });

  test("keeps the Otis loop stable while controls change", () => {
    const source = sourceFor("OtisHoistingApparatusSim.tsx");

    expect(source).toContain("const UI_SNAPSHOT_INTERVAL_MS = 80;");
    expect(source).toContain("useRef<OtisAnimationControls | null>(null)");
    expect(source).toContain("liveControlsRef.current = readAnimationControls(");
    expect(source).not.toContain("if (liveControlsRef.current === null)");
    expect(source).toContain("const controls = liveControlsRef.current;");
    expect(source).toContain("lastUiSnapshot");
    expect(source).toContain("}, [onscreenRef]);");
    expect(source).not.toContain(
      "}, [claimStates, displayRatePct, driveCommand, onscreenRef, ropeGIntact, stopRopePulled]);",
    );
  });

  test("does not evaluate kernel-source readers or empty control defaults on every render", () => {
    const lazyStateContracts = [
      ["DaimlerEngineSim.tsx", "useState(daimlerKernelSource)", "useState(daimlerKernelSource())"],
      [
        "three/SalisburyRobotHand3D.tsx",
        "useState<SalisburyKernelSource>(salisburyKernelSource)",
        "useState<SalisburyKernelSource>(salisburyKernelSource())",
      ],
      ["three/WrightFlyer3D.tsx", "useState(flyerKernelSource)", "useState(flyerKernelSource())"],
      ["three/WrightFlyer3D.tsx", "useState(flyerAeroSource)", "useState(flyerAeroSource())"],
    ] as const;

    for (const [fileName, lazyInitializer, eagerInitializer] of lazyStateContracts) {
      const source = sourceFor(fileName);
      expect(source).toContain(lazyInitializer);
      expect(source).not.toContain(eagerInitializer);
    }

    const mestralSource = sourceFor("MestralVelcroSim.tsx");
    expect(mestralSource).toContain("const EMPTY_MESTRAL_VELCRO_CONTROLS");
    expect(mestralSource).toContain("initialControls = EMPTY_MESTRAL_VELCRO_CONTROLS");
    expect(mestralSource).not.toContain("initialControls = {}");
  });

  test("keeps Goddard's source pose ref-owned between bounded React snapshots", () => {
    const source = sourceFor("Goddard1914ApparatusSim.tsx");

    expect(source).toContain("const elapsedSecondsRef = useRef(0);");
    expect(source).toContain("const UI_SNAPSHOT_INTERVAL_MS = 80;");
    expect(source).toContain("const controlsRef = useRef(controls);");
    expect(source).toContain("projectGoddardPose(");
    expect(source).toContain("lastUiSnapshot");
    expect(source).toContain("}, [onscreenRef]);");
    expect(source).not.toContain("setElapsedSeconds((elapsed)");
  });

  test("limits the continuously updated Segway margin bar to its changing properties", () => {
    const source = sourceFor("KamenSegwaySim.tsx");

    expect(source).toContain("transition-[width,background-color]");
    expect(source).not.toContain("transition-all");
  });
});
