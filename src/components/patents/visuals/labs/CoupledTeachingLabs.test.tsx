import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import {
  createInitialMechanicalChainState,
  executeCoupledLabReplay,
  stepMechanicalChainLab,
} from "@/physics/coupleGraph";
import { CoupledTeachingLabs } from "./CoupledTeachingLabs";

describe("CoupledTeachingLabs component", () => {
  test("renders Mechanical Rotary Chain lab by default with authentic components and evidence boundary", () => {
    const html = renderToStaticMarkup(
      <CoupledTeachingLabs initialLabId="mechanical-rotary-chain" />,
    );

    // Header & Framework badges
    expect(html).toContain("Coupled Teaching Laboratories");
    expect(html).toContain("fs-couple · Multi-Patent V2");
    expect(html).toContain('data-testid="coupled-teaching-labs"');
    expect(html).toContain('aria-label="Coupled Teaching Laboratories Simulator"');

    // Evidence Boundary & Composition Disclosure
    expect(html).toContain("Educational Composition &amp; Evidence Boundary");
    expect(html).toContain("Corliss Steam Engine US 6,469");
    expect(html).toContain("Arkwright Water Frame GB 931");
    expect(html).toContain("Howe Sewing Machine US 4,750");

    // 3 Mechanical Components with linked museum paths
    expect(html).toContain("Corliss Steam Engine");
    expect(html).toContain("Arkwright Water Frame");
    expect(html).toContain("Howe Lockstitch Sewing Machine");
    expect(html).toContain("/patents/us-6469-corliss-engine");
    expect(html).toContain("/patents/gb-931-arkwright-water-frame");
    expect(html).toContain("/patents/us-4750-howe-sewing-machine");

    // 2 Junction Clutches
    expect(html).toContain("Clutch Engaged");
    expect(html).toContain("Transferred:");

    // Energy Conservation & Passivity Ledger
    expect(html).toContain("Energy Conservation &amp; Passivity Ledger (SI Measured Residuals)");
    expect(html).toContain("Input Power");
    expect(html).toContain("Dissipated");
    expect(html).toContain("Measured Residual (R)");
    expect(html).toContain("PASSIVE");
    expect(html).toContain("CONSERVED");

    // Fault injection button
    expect(html).toContain("Inject Non-Passive Fault");

    // Accessible table toggle
    expect(html).toContain("Show Accessible Text-Only Telemetry Table");
  });

  test("renders Electrical Power Chain lab when selected with authentic electrical components", () => {
    const html = renderToStaticMarkup(
      <CoupledTeachingLabs initialLabId="electrical-power-chain" />,
    );

    // Evidence Boundary for Electrical Composition
    expect(html).toContain("Gramme Dynamo US 120,057");
    expect(html).toContain("Tesla Transformer US 593,138");
    expect(html).toContain("Edison Lamp US 223,898");

    // 3 Electrical Components with linked museum paths
    expect(html).toContain("Gramme Ring Dynamo");
    expect(html).toContain("Tesla Electrical Transformer");
    expect(html).toContain("Edison Incandescent Electric Lamp");
    expect(html).toContain("/patents/us-120057-gramme-dynamo");
    expect(html).toContain("/patents/us-593138-tesla-coil");
    expect(html).toContain("/patents/us-223898-edison-lightbulb");

    // 2 Junction Switches
    expect(html).toContain("Switch Closed");

    // Electrical telemetry items
    expect(html).toContain("terminal Voltage V");
    expect(html).toContain("filament Temp K");

    // Energy Conservation & Passivity Ledger
    expect(html).toContain("Energy Conservation &amp; Passivity Ledger (SI Measured Residuals)");
    expect(html).toContain("PASSIVE");
    expect(html).toContain("CONSERVED");
  });

  test("displays Refusal Boundary alert when non-passive fault is active in stepper output", () => {
    const faultParams = {
      steamPressurePsi: 100,
      engineRpm: 65,
      cutoffPct: 25,
      totalDraftRatio: 6.0,
      rollerClampingWeightKg: 3.5,
      loopSlackPct: 65,
      stitchPitchMm: 3.5,
      clutch1Connected: true,
      clutch2Connected: true,
      injectedFault: "negative_dissipation" as const,
    };

    const initial = createInitialMechanicalChainState(faultParams);
    const steppedFault = stepMechanicalChainLab(initial, faultParams, [], 0.05);

    expect(steppedFault.energy.refusal).toBeDefined();
    expect(steppedFault.energy.refusal?.isRefused).toBe(true);
    expect(steppedFault.energy.isPassive).toBe(false);
    expect(steppedFault.energy.injectedEnergyError).toBe(true);
    expect(steppedFault.energy.refusal?.reason).toContain("UNPHYSICAL_ENERGY_INJECTION");
  });

  test("deterministic replay produces bit-exact trajectories across multiple independent runs", () => {
    const mechActions = [
      {
        tick: 2,
        type: "toggle_connection" as const,
        targetId: "clutch-engine-to-water-frame",
        value: false,
      },
      {
        tick: 5,
        type: "toggle_connection" as const,
        targetId: "clutch-engine-to-water-frame",
        value: true,
      },
    ];
    const mechParams = {
      steamPressurePsi: 90,
      engineRpm: 60,
      cutoffPct: 25,
      totalDraftRatio: 5.5,
      rollerClampingWeightKg: 3.0,
      loopSlackPct: 60,
      stitchPitchMm: 3.2,
      clutch1Connected: true,
      clutch2Connected: true,
    };

    const runA = executeCoupledLabReplay("mechanical-rotary-chain", mechParams, mechActions, 10);
    const runB = executeCoupledLabReplay("mechanical-rotary-chain", mechParams, mechActions, 10);

    expect(runA.length).toBe(11);
    expect(runB.length).toBe(11);
    for (let i = 0; i < 11; i++) {
      expect(runA[i].clock.tick).toBe(runB[i].clock.tick);
      expect(runA[i].energy.measuredResidualWatts).toBe(runB[i].energy.measuredResidualWatts);
      expect(runA[i].energy.totalInputPowerWatts).toBe(runB[i].energy.totalInputPowerWatts);
      expect(runA[i].connections[0].transferredPowerWatts).toBe(
        runB[i].connections[0].transferredPowerWatts,
      );
    }
  });

  test("accessible text-only telemetry table contains complete port state", () => {
    const html = renderToStaticMarkup(
      <CoupledTeachingLabs
        initialLabId="mechanical-rotary-chain"
        defaultShowTextOnlyTable={true}
      />,
    );

    // Screen reader accessible elements
    expect(html).toContain('aria-label="Coupled Teaching Laboratories Simulator"');
    expect(html).toContain("Play continuous simulation");
    expect(html).toContain("Step (50ms)");
    expect(html).toContain("Reset");
    expect(html).toContain("Verify Replay");

    // Table elements
    expect(html).toContain("<table");
    expect(html).toContain("Component");
    expect(html).toContain("Patent");
    expect(html).toContain("Input Port");
    expect(html).toContain("Output Port");
    expect(html).toContain("State");
    expect(html).toContain("Evidence Boundary");
    expect(html).toContain("Corliss Steam Engine");
    expect(html).toContain("US 6,469");
    expect(html).toContain("None (Prime Mover)");
    expect(html).toContain("Arkwright Water Frame");
    expect(html).toContain("GB 931");
    expect(html).toContain("Howe Lockstitch Sewing Machine");
    expect(html).toContain("US 4,750");
    expect(html).toContain("None (Load)");
  });
});
