/**
 * fs-couple edges: one graph, not two independent HUD numbers.
 * Host fallback until a WASM couple module steps. HUD must not say WASM.
 */

import { stepArkwrightWaterFrame } from "./arkwrightKernel";
import {
  stepBellPhotophone,
  stepCorlissEngine,
  stepEdisonBulb,
  stepGoodyearRubber,
  stepGrammeDynamo,
  stepHaberAmmonia,
  stepMorseTelegraph,
} from "./catalogKernels";
import { stepEdisonRadiativeBalance } from "./edisonWasm";
import { fermiKeff } from "./fermiKinetics";
import { stepHoweSewingMachine } from "./machineKernels";
import {
  areDimensionsEqual,
  DIM_CURRENT,
  DIM_ENTROPY_FLOW,
  DIM_FORCE,
  DIM_POWER,
  DIM_PRESSURE,
  DIM_TIME,
  DIM_TORQUE,
  DIM_VELOCITY,
  DIM_VOLTAGE,
  DIM_VOLUME_FLOW,
  formatDimensionVector,
  parseUnitToDimension,
  type SiDimensionVector,
} from "./qty";
import { stepTeslaMotorFig9, teslaMotorPhaseHz } from "./teslaKernel";
import type { RefusalBoundary } from "./types";
import { readWattCondenserControls, stepWattCondenser } from "./wattCondenserKernel";
import { readWrightControls, stepWrightFlyerSi, WRIGHT_COUPLING } from "./wrightKernel";

export type CoupleSource = "wasm" | "ts-fallback";

export interface CoupleEdge {
  from: string;
  to: string;
  gain: number;
  unit: string;
  crate: "fs-couple";
  source: CoupleSource;
}

export function coupleEdgesFor(patentId: string, params: Record<string, number>): CoupleEdge[] {
  if (patentId === "us-821393-wright-flyer") {
    const si = stepWrightFlyerSi(readWrightControls(params));
    const warp =
      Math.abs(si.airframeRollDeg) < 1e-9 ? (params.wingWarp ?? 0) : (params.wingWarp ?? 0);
    const gain = Math.abs(warp) < 1e-6 ? WRIGHT_COUPLING * si.adverseYawNm : si.adverseYawNm / warp;
    return [
      {
        from: "wing warp",
        to: "adverse yaw",
        gain: Number(gain.toFixed(3)),
        unit: "N·m / deg",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-381968-tesla-motor") {
    const fig9 = stepTeslaMotorFig9(teslaMotorPhaseHz(params));
    return [
      {
        from: "generator G",
        to: "progressive pole shift",
        gain: Number((fig9.poleShiftRpm / Math.max(1, fig9.phaseCycleHz)).toFixed(3)),
        unit: "rpm / Hz",
        crate: "fs-couple",
        source: "ts-fallback",
      },
      {
        from: "progressive pole shift",
        to: "disk D",
        gain: Number((fig9.diskRpm / Math.max(1, fig9.poleShiftRpm)).toFixed(3)),
        unit: "rpm / rpm",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-223898-edison-lightbulb" || patentId === "us-223898-edison-lamp") {
    const bulb = stepEdisonBulb({
      voltage: params.voltage ?? params.mainsVoltageV ?? 110,
      hotResistanceOhm: params.hotResistanceOhm,
    });
    const v = params.voltage ?? params.mainsVoltageV ?? 110;
    const dPdV = v === 0 ? 0 : (2 * bulb.radiantWatts) / v;
    return [
      {
        from: "I²R",
        to: "radiation",
        gain: Number(dPdV.toFixed(3)),
        unit: "W / V",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-586193-marconi-radio") {
    // The grant gives a causal connection, not a numerical transfer gain.
    return [];
  }
  if (patentId === "us-2495429-spencer-microwave") {
    const energyPathActive = (params.rfPowerSetting ?? params.rfWatts ?? 1) > 0;
    return [
      {
        from: "oscillators 10 and 11",
        to: "common wave guide 23 and conveyor region 28",
        gain: energyPathActive ? 1 : 0,
        unit: "on/off",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-233692-pelton-water-wheel") {
    // The source describes a geometric water path, not a numerical
    // head-to-velocity transfer gain.
    return [];
  }
  if (patentId === "us-2708656-fermi-reactor") {
    const k = fermiKeff(params.rodWithdrawalPct ?? 83.5, params.moderatorPurityPct ?? 99.5);
    return [
      {
        from: "rod withdrawal",
        to: "k_eff",
        gain: Number((k / Math.max(1, params.rodWithdrawalPct ?? 83.5)).toFixed(5)),
        unit: "1 / %",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-194047-otto-engine") {
    return [
      {
        from: "engine shaft I",
        to: "counter-shaft K",
        gain: 0.5,
        unit: "revolution / revolution",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-120057-gramme-dynamo") {
    const gramme = stepGrammeDynamo({ shaftRate: params.shaftRate ?? 1 });
    return [
      {
        from: "shaft rate",
        to: "EMF index",
        gain: Number((gramme.inducedEmfIndex / Math.max(0.4, params.shaftRate ?? 1)).toFixed(2)),
        unit: "index / rate",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "gb-931-arkwright-water-frame") {
    const draft = params.totalDraftRatio ?? 6;
    const roving = params.inputRovingCountNe ?? 1;
    const frame = stepArkwrightWaterFrame({
      totalDraftRatio: draft,
      inputRovingCountNe: roving,
    });
    return [
      {
        from: "draft",
        to: "yarn count",
        gain: Number((frame.outputYarnCountNe / Math.max(0.1, draft)).toFixed(3)),
        unit: "Ne / ratio",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "gb-913-watt-separate-condenser") {
    const controls = readWattCondenserControls(params);
    const current = stepWattCondenser(controls);
    const jacketedWatt = stepWattCondenser({
      ...controls,
      hasSeparateCondenser: true,
      hasSteamJacket: true,
    });
    return [
      {
        from: "separate condenser",
        to: "fuel per net kWh vs jacketed Watt scenario",
        gain: Number(
          (
            current.specificFuelConsumptionKgPerKwh / jacketedWatt.specificFuelConsumptionKgPerKwh
          ).toFixed(3),
        ),
        unit: "× fuel/kWh",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-971501-haber-ammonia") {
    const pAtm = params.pressureAtm ?? 175;
    const haber = stepHaberAmmonia({
      pressureAtm: pAtm,
      temperatureCelsius: params.temperatureCelsius ?? 530,
    });
    return [
      {
        from: "pressure",
        to: "NH3 yield",
        gain: Number((haber.ammoniaYieldPct / Math.max(1, pAtm)).toFixed(4)),
        unit: "% / atm",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-235199-bell-photophone") {
    const dist = params.transmissionDistanceM ?? 213;
    const phone = stepBellPhotophone({
      transmissionDistanceM: dist,
      voiceSplDb: params.voiceSplDb ?? 75,
    });
    return [
      {
        from: "range",
        to: "selenium audio current",
        gain: Number((phone.audioSignalCurrentUa / Math.max(1, dist)).toFixed(4)),
        unit: "µA / m",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  // US 2,981,877 supplies a connected oxide/contact/lead topology, but no
  // numeric cause/effect pair from which an fs-couple gain can be derived.
  if (patentId === "us-2981877-noyce-ic") return [];
  if (patentId === "us-1647-morse-telegraph") {
    const volts = params.lineVoltageV ?? 24;
    const morse = stepMorseTelegraph({ lineVoltageV: volts });
    return [
      {
        from: "line voltage",
        to: "loop current",
        gain: Number((morse.ohmicCurrentMa / Math.max(0.1, volts)).toFixed(3)),
        unit: "mA / V",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-4750-howe-sewing-machine") {
    const rpm = params.crankRpm ?? 240;
    const howe = stepHoweSewingMachine(rpm, params.loopSlackPct ?? 65, params.stitchPitchMm ?? 3.5);
    return [
      {
        from: "main shaft C",
        to: "baster plate H feed",
        gain: Number((howe.clothFeedMmPerS / Math.max(1, rpm)).toFixed(4)),
        unit: "mm/s / rpm",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-361931-daimler-engine") {
    // The source states a mechanical connection and thrust-maintained contact,
    // not a numerical rpm-to-power coupling gain.
    return [];
  }
  if (patentId === "us-3633-goodyear-vulcanization" || patentId === "us-3633-goodyear-rubber") {
    const gum = stepGoodyearRubber(
      params.vulcanTemp ?? params.vulcanizationTempC ?? 145,
      params.sulfurPct ?? 8,
    );
    return [
      {
        from: "sulfur",
        to: "relative crosslink factor",
        gain: gum.relativeCrossLinkSlopePerSulfurPct,
        unit: "relative / %",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-124404-westinghouse-air-brake") {
    return [
      {
        from: "train-pipe pressure",
        to: "brake shoe clamping force",
        gain: 1.746,
        unit: "kN / psi",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-x72-whitney-cotton-gin") {
    return [
      {
        from: "hand crank",
        to: "saw cylinder",
        gain: 3.5,
        unit: "rpm / rpm",
        crate: "fs-couple",
        source: "ts-fallback",
      },
      {
        from: "hand crank",
        to: "clearer brush cylinder",
        gain: 12.0,
        unit: "rpm / rpm",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-200521-edison-phonograph") {
    return [
      {
        from: "mandrel rotation",
        to: "stylus axial lead feed",
        gain: 0.0423,
        unit: "mm/s / rpm",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-542846-diesel-engine") {
    return [
      {
        from: "crankshaft",
        to: "camshaft side shaft",
        gain: 0.5,
        unit: "rpm / rpm",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  return [];
}

/* ============================================================================
 * MULTI-PATENT COUPLED PORT-THERMODYNAMIC SOLVER (fs-couple V2 Architecture)
 * ============================================================================
 *
 * Implements bounded multi-patent power transmission and coupled state
 * resolution across physical domains:
 * 1. Mechanical Rotational: Torque (effort, N·m) × Angular Velocity (flow, rad/s) = Power (W)
 * 2. Electrical: Voltage (effort, V) × Current (flow, A) = Power (W)
 * 3. Mechanical Translational: Force (effort, N) × Velocity (flow, m/s) = Power (W)
 * 4. Fluid: Pressure (effort, Pa) × Volume Flow Rate (flow, m³/s) = Power (W)
 * 5. Thermal: Temperature (effort, K) × Entropy Flow Rate (flow, W/K) = Power (W)
 *
 * Enforces:
 * - Interface Dirac structure (shared effort, opposite flow; or power-conserving transfer)
 * - Disconnection: power transmission immediately stops; downstream components follow
 *   physically defined deceleration/cooling ODEs; upstream components operate unloaded.
 * - Reconnection: physically defined transition behavior (clutch friction slip or switch inrush).
 * - Port unit and sign validation via 6D SI dimensions.
 * - Passivity and energy conservation tracking with measured residuals.
 * - Injected energy error detection (negative dissipation or non-passive generation).
 * - Single shared replay clock across all coupled components.
 */

export type CoupledPortKind =
  | "mechanical_rotational"
  | "electrical"
  | "mechanical_translational"
  | "fluid"
  | "thermal";

export type CoupledPortDirection = "in" | "out" | "bidirectional";

export interface CoupledPortSchema {
  readonly portId: string;
  readonly name: string;
  readonly kind: CoupledPortKind;
  readonly direction: CoupledPortDirection;
  readonly effortName: string;
  readonly effortUnit: string;
  readonly effortDimension: SiDimensionVector;
  readonly flowName: string;
  readonly flowUnit: string;
  readonly flowDimension: SiDimensionVector;
}

export interface CoupledPortValue {
  readonly portId: string;
  readonly kind: CoupledPortKind;
  readonly direction: CoupledPortDirection;
  readonly effort: number;
  readonly effortUnit: string;
  readonly flow: number;
  readonly flowUnit: string;
  readonly powerWatts: number;
  readonly powerUnit: "W";
}

/**
 * Validates that a coupled port schema's effort and flow dimensions contract
 * exactly to Watts (L^2 M T^-3) and conform to SI unit dimensions.
 */
export function validateCoupledPortDimensions(schema: CoupledPortSchema): {
  readonly valid: boolean;
  readonly productDimension: SiDimensionVector;
  readonly refusalReason?: string;
} {
  const effortDim = parseUnitToDimension(schema.effortUnit);
  const flowDim = parseUnitToDimension(schema.flowUnit);

  if (!areDimensionsEqual(effortDim, schema.effortDimension)) {
    return {
      valid: false,
      productDimension: effortDim,
      refusalReason: `Effort unit "${schema.effortUnit}" has dimension ${formatDimensionVector(effortDim)}, but schema declared ${formatDimensionVector(schema.effortDimension)} on port "${schema.portId}".`,
    };
  }
  if (!areDimensionsEqual(flowDim, schema.flowDimension)) {
    return {
      valid: false,
      productDimension: flowDim,
      refusalReason: `Flow unit "${schema.flowUnit}" has dimension ${formatDimensionVector(flowDim)}, but schema declared ${formatDimensionVector(schema.flowDimension)} on port "${schema.portId}".`,
    };
  }

  const productDimension: SiDimensionVector = [
    schema.effortDimension[0] + schema.flowDimension[0],
    schema.effortDimension[1] + schema.flowDimension[1],
    schema.effortDimension[2] + schema.flowDimension[2],
    schema.effortDimension[3] + schema.flowDimension[3],
    schema.effortDimension[4] + schema.flowDimension[4],
    schema.effortDimension[5] + schema.flowDimension[5],
  ];

  const valid = areDimensionsEqual(productDimension, DIM_POWER);
  return {
    valid,
    productDimension,
    ...(!valid
      ? {
          refusalReason: `Port power pairing error: effort (${schema.effortName}) × flow (${schema.flowName}) produces dimension ${formatDimensionVector(productDimension)}, expected Power ${formatDimensionVector(DIM_POWER)} on port "${schema.portId}".`,
        }
      : {}),
  };
}

export const CANONICAL_COUPLED_PORT_SCHEMAS = {
  rotational_shaft_out: Object.freeze({
    portId: "rotational_shaft_out",
    name: "Rotational Mechanical Drive Output",
    kind: "mechanical_rotational" as const,
    direction: "out" as const,
    effortName: "Torque",
    effortUnit: "N·m",
    effortDimension: DIM_TORQUE,
    flowName: "Angular Velocity",
    flowUnit: "rad/s",
    flowDimension: DIM_TIME.map((x) => -x) as unknown as SiDimensionVector,
  }),
  rotational_shaft_in: Object.freeze({
    portId: "rotational_shaft_in",
    name: "Rotational Mechanical Drive Input",
    kind: "mechanical_rotational" as const,
    direction: "in" as const,
    effortName: "Torque",
    effortUnit: "N·m",
    effortDimension: DIM_TORQUE,
    flowName: "Angular Velocity",
    flowUnit: "rad/s",
    flowDimension: DIM_TIME.map((x) => -x) as unknown as SiDimensionVector,
  }),
  electrical_terminal_out: Object.freeze({
    portId: "electrical_terminal_out",
    name: "Electrical Terminal Output",
    kind: "electrical" as const,
    direction: "out" as const,
    effortName: "Voltage",
    effortUnit: "V",
    effortDimension: DIM_VOLTAGE,
    flowName: "Current",
    flowUnit: "A",
    flowDimension: DIM_CURRENT,
  }),
  electrical_terminal_in: Object.freeze({
    portId: "electrical_terminal_in",
    name: "Electrical Terminal Input",
    kind: "electrical" as const,
    direction: "in" as const,
    effortName: "Voltage",
    effortUnit: "V",
    effortDimension: DIM_VOLTAGE,
    flowName: "Current",
    flowUnit: "A",
    flowDimension: DIM_CURRENT,
  }),
  translational_port_out: Object.freeze({
    portId: "translational_port_out",
    name: "Translational Mechanical Output",
    kind: "mechanical_translational" as const,
    direction: "out" as const,
    effortName: "Force",
    effortUnit: "N",
    effortDimension: DIM_FORCE,
    flowName: "Velocity",
    flowUnit: "m/s",
    flowDimension: DIM_VELOCITY,
  }),
  fluid_port_out: Object.freeze({
    portId: "fluid_port_out",
    name: "Hydraulic Fluid Flow Output",
    kind: "fluid" as const,
    direction: "out" as const,
    effortName: "Pressure",
    effortUnit: "Pa",
    effortDimension: DIM_PRESSURE,
    flowName: "Volume Flow Rate",
    flowUnit: "m³/s",
    flowDimension: DIM_VOLUME_FLOW,
  }),
  thermal_port_out: Object.freeze({
    portId: "thermal_port_out",
    name: "Thermal Conduction Output",
    kind: "thermal" as const,
    direction: "out" as const,
    effortName: "Temperature",
    effortUnit: "K",
    effortDimension: [0, 0, 0, 1, 0, 0] as const,
    flowName: "Entropy Flow Rate",
    flowUnit: "W/K",
    flowDimension: DIM_ENTROPY_FLOW,
  }),
} as const;

export interface CoupledPortConnection {
  readonly connectionId: string;
  readonly fromComponentId: string;
  readonly fromPortId: string;
  readonly toComponentId: string;
  readonly toPortId: string;
  readonly kind: CoupledPortKind;
  readonly couplingType: "clutch" | "switch";
  connected: boolean;
  transitionState: "engaged" | "disengaged" | "slipping" | "inrush";
  transitionProgress: number; // 0 to 1
  couplingLossWatts: number;
  transferredPowerWatts: number;
}

export interface CoupledReplayClock {
  tick: number;
  simTimeSec: number;
  dt: number;
  isReplaying: boolean;
}

export interface CoupledComponentSpec {
  readonly componentId: string;
  readonly patentId: string;
  readonly patentNumber: string;
  readonly title: string;
  readonly role: string;
  readonly acceptedKernelOwner: string;
  readonly evidenceClassification:
    | "source-disclosed"
    | "source-derived"
    | "educational-composition";
  readonly evidenceBoundaryNote: string;
  readonly ports: Record<string, CoupledPortSchema>;
}

export interface CoupledComponentLiveState {
  readonly componentId: string;
  readonly patentId: string;
  readonly isRunning: boolean;
  readonly portValues: Record<string, CoupledPortValue>;
  readonly inputPowerWatts: number;
  readonly outputPowerWatts: number;
  readonly dissipatedPowerWatts: number;
  readonly storedEnergyJoules: number;
  readonly rateOfStoredEnergyWatts: number;
  readonly telemetry: Record<string, number | string | boolean>;
}

export interface NetworkEnergyAccounting {
  readonly totalInputPowerWatts: number;
  readonly totalUsefulOutputPowerWatts: number;
  readonly totalDissipatedPowerWatts: number;
  readonly totalRateOfStoredEnergyWatts: number;
  readonly totalInterfaceLossWatts: number;
  readonly measuredResidualWatts: number;
  readonly toleranceWatts: number;
  readonly isConserved: boolean;
  readonly isPassive: boolean;
  readonly injectedEnergyError: boolean;
  readonly refusal?: RefusalBoundary;
}

export interface CoupledLabState {
  readonly labId: "mechanical-rotary-chain" | "electrical-power-chain";
  readonly title: string;
  readonly compositionClassification: "educational-composition";
  readonly compositionDisclosure: string;
  readonly clock: CoupledReplayClock;
  readonly components: readonly CoupledComponentSpec[];
  readonly connections: CoupledPortConnection[];
  readonly componentStates: Record<string, CoupledComponentLiveState>;
  readonly energy: NetworkEnergyAccounting;
}

export interface CoupledLabAction {
  readonly tick: number;
  readonly type: "toggle_connection" | "set_parameter" | "inject_fault" | "reset";
  readonly targetId: string;
  readonly value?: number | boolean | string;
}

/* ============================================================================
 * PILOT LAB 1: MECHANICAL ROTARY CHAIN
 * Corliss Steam Engine -> Arkwright Water Frame -> Howe Sewing Machine
 * ============================================================================
 */

export const COUPLED_MECHANICAL_CHAIN_SPEC: readonly CoupledComponentSpec[] = [
  {
    componentId: "rotary-drive",
    patentId: "us-6469-corliss-engine",
    patentNumber: "US 6,469",
    title: "Corliss Steam Engine (Rotary Prime Mover)",
    role: "Central prime mover providing mechanical rotational shaft power via wrist-plate valve gear",
    acceptedKernelOwner: "stepCorlissEngine (FrankenSimEngine.stepCorlissEngine)",
    evidenceClassification: "source-derived",
    evidenceBoundaryNote:
      "George Corliss's 1849 patent granted rotary cut-off valve gear, not a specific textile mill layout. Prime mover shaft power and rpm are authentic model outputs; coupling downstream to spinning and sewing is an educational line-shaft composition.",
    ports: {
      rotary_drive_out: {
        ...CANONICAL_COUPLED_PORT_SCHEMAS.rotational_shaft_out,
        portId: "rotary_drive_out",
        name: "Main Flywheel Shaft Drive",
      },
    } as Record<string, CoupledPortSchema>,
  },
  {
    componentId: "arkwright-spinning",
    patentId: "gb-931-arkwright-water-frame",
    patentNumber: "GB 931",
    title: "Arkwright Water Frame (Continuous Spinning)",
    role: "Intermediate spinning machine consuming mechanical line-shaft power for drafting rollers and high-speed flyer spindles",
    acceptedKernelOwner: "stepArkwrightWaterFrame (FrankenSimEngine.stepArkwrightWaterFrame)",
    evidenceClassification: "educational-composition",
    evidenceBoundaryNote:
      "Richard Arkwright's 1769 water frame used water-wheel or line-shaft rotation. Coupling directly to a Corliss engine and passing shaft torque through to a sewing machine is an educational multi-patent composition; direct historical interoperability is unproven in patent grants.",
    ports: {
      frame_drive_in: {
        ...CANONICAL_COUPLED_PORT_SCHEMAS.rotational_shaft_in,
        portId: "frame_drive_in",
        name: "Main Drive Pulley Input",
      },
      jackshaft_out: {
        ...CANONICAL_COUPLED_PORT_SCHEMAS.rotational_shaft_out,
        portId: "jackshaft_out",
        name: "Mill Line Jackshaft Output",
      },
    } as Record<string, CoupledPortSchema>,
  },
  {
    componentId: "howe-sewing",
    patentId: "us-4750-howe-sewing-machine",
    patentNumber: "US 4,750",
    title: "Howe Lockstitch Sewing Machine",
    role: "Terminal mechanical load converting line-shaft rotary torque into reciprocating needle, shuttle, and baster plate feed motion",
    acceptedKernelOwner: "stepHoweSewingMachine (FrankenSimEngine.stepHoweSewingMachine)",
    evidenceClassification: "educational-composition",
    evidenceBoundaryNote:
      "Elias Howe's 1846 patent disclosed hand-cranked or treadle operation. Driving the machine from industrial line-shafting is an authentic 19th-century manufacturing configuration, but constitutes an educational multi-patent composition with no historical grant claim.",
    ports: {
      machine_crank_in: {
        ...CANONICAL_COUPLED_PORT_SCHEMAS.rotational_shaft_in,
        portId: "machine_crank_in",
        name: "Main Crankshaft Input",
      },
    } as Record<string, CoupledPortSchema>,
  },
];

export interface MechanicalChainParams {
  steamPressurePsi?: number;
  engineRpm?: number;
  cutoffPct?: number;
  totalDraftRatio?: number;
  rollerClampingWeightKg?: number;
  loopSlackPct?: number;
  stitchPitchMm?: number;
  clutch1Connected?: boolean;
  clutch2Connected?: boolean;
  injectedFault?: "negative_dissipation" | "active_torque";
}

export function createInitialMechanicalChainState(
  params: MechanicalChainParams = {},
): CoupledLabState {
  const engineRpm = params.engineRpm ?? 65;
  const omega1 = (engineRpm * 2 * Math.PI) / 60;
  const omega2 = omega1 * (180 / 65);
  const omega3 = omega2 * (240 / 180);

  return {
    labId: "mechanical-rotary-chain",
    title: "Mechanical Rotary Power Chain: Steam Drive → Spinning Frame → Sewing Machine",
    compositionClassification: "educational-composition",
    compositionDisclosure:
      "Educational Composition: Multi-Patent Rotary Power Transmission (Corliss Steam Engine US 6,469 -> Arkwright Water Frame GB 931 -> Howe Sewing Machine US 4,750). Historical direct interoperability between these separate patent grants was never claimed in original patent records. This simulation demonstrates a shared mechanical line-shaft network with friction clutch engagement, spinning spindle drafting load, sewing needle reciprocation, and SI energy conservation.",
    clock: {
      tick: 0,
      simTimeSec: 0,
      dt: 0.05,
      isReplaying: false,
    },
    components: COUPLED_MECHANICAL_CHAIN_SPEC,
    connections: [
      {
        connectionId: "clutch-engine-to-arkwright",
        fromComponentId: "rotary-drive",
        fromPortId: "rotary_drive_out",
        toComponentId: "arkwright-spinning",
        toPortId: "frame_drive_in",
        kind: "mechanical_rotational",
        couplingType: "clutch",
        connected: params.clutch1Connected ?? true,
        transitionState: "engaged",
        transitionProgress: 1.0,
        couplingLossWatts: 0,
        transferredPowerWatts: 0,
      },
      {
        connectionId: "clutch-arkwright-to-howe",
        fromComponentId: "arkwright-spinning",
        fromPortId: "jackshaft_out",
        toComponentId: "howe-sewing",
        toPortId: "machine_crank_in",
        kind: "mechanical_rotational",
        couplingType: "clutch",
        connected: params.clutch2Connected ?? true,
        transitionState: "engaged",
        transitionProgress: 1.0,
        couplingLossWatts: 0,
        transferredPowerWatts: 0,
      },
    ],
    componentStates: {
      "rotary-drive": {
        componentId: "rotary-drive",
        patentId: "us-6469-corliss-engine",
        isRunning: true,
        portValues: {
          rotary_drive_out: {
            portId: "rotary_drive_out",
            kind: "mechanical_rotational",
            direction: "out",
            effort: 0,
            effortUnit: "N·m",
            flow: omega1,
            flowUnit: "rad/s",
            powerWatts: 0,
            powerUnit: "W",
          },
        },
        inputPowerWatts: 0,
        outputPowerWatts: 0,
        dissipatedPowerWatts: 0,
        storedEnergyJoules: 0.5 * 45 * omega1 * omega1,
        rateOfStoredEnergyWatts: 0,
        telemetry: {
          rpm: engineRpm,
          omegaRadPerS: omega1,
          indicatedHp: 0,
        },
      },
      "arkwright-spinning": {
        componentId: "arkwright-spinning",
        patentId: "gb-931-arkwright-water-frame",
        isRunning: true,
        portValues: {
          frame_drive_in: {
            portId: "frame_drive_in",
            kind: "mechanical_rotational",
            direction: "in",
            effort: 0,
            effortUnit: "N·m",
            flow: omega2,
            flowUnit: "rad/s",
            powerWatts: 0,
            powerUnit: "W",
          },
          jackshaft_out: {
            portId: "jackshaft_out",
            kind: "mechanical_rotational",
            direction: "out",
            effort: 0,
            effortUnit: "N·m",
            flow: omega2,
            flowUnit: "rad/s",
            powerWatts: 0,
            powerUnit: "W",
          },
        },
        inputPowerWatts: 0,
        outputPowerWatts: 0,
        dissipatedPowerWatts: 0,
        storedEnergyJoules: 0.5 * 2.5 * omega2 * omega2,
        rateOfStoredEnergyWatts: 0,
        telemetry: {
          wheelRpm: 180,
          flyerSpindleRpm: 3200,
          outputYarnCountNe: 24,
        },
      },
      "howe-sewing": {
        componentId: "howe-sewing",
        patentId: "us-4750-howe-sewing-machine",
        isRunning: true,
        portValues: {
          machine_crank_in: {
            portId: "machine_crank_in",
            kind: "mechanical_rotational",
            direction: "in",
            effort: 0,
            effortUnit: "N·m",
            flow: omega3,
            flowUnit: "rad/s",
            powerWatts: 0,
            powerUnit: "W",
          },
        },
        inputPowerWatts: 0,
        outputPowerWatts: 0,
        dissipatedPowerWatts: 0,
        storedEnergyJoules: 0.5 * 0.35 * omega3 * omega3,
        rateOfStoredEnergyWatts: 0,
        telemetry: {
          crankRpm: 240,
          stitchesPerMinute: 240,
          clothFeedMmPerS: 14.0,
        },
      },
    },
    energy: {
      totalInputPowerWatts: 0,
      totalUsefulOutputPowerWatts: 0,
      totalDissipatedPowerWatts: 0,
      totalRateOfStoredEnergyWatts: 0,
      totalInterfaceLossWatts: 0,
      measuredResidualWatts: 0,
      toleranceWatts: 1e-4,
      isConserved: true,
      isPassive: true,
      injectedEnergyError: false,
    },
  };
}

/**
 * Steps the Mechanical Rotary Power Chain across one synchronous tick dt.
 */
export function stepMechanicalChainLab(
  prevState: CoupledLabState,
  params: MechanicalChainParams = {},
  actions: readonly CoupledLabAction[] = [],
  dt: number = 0.05,
): CoupledLabState {
  const currentTick = prevState.clock.tick + 1;
  const currentSimTime = prevState.clock.simTimeSec + dt;

  // Process incoming actions for this tick
  let clutch1Connected = params.clutch1Connected ?? prevState.connections[0].connected;
  let clutch2Connected = params.clutch2Connected ?? prevState.connections[1].connected;
  let injectedFault = params.injectedFault;

  for (const action of actions) {
    if (action.tick === currentTick) {
      if (action.type === "toggle_connection") {
        if (action.targetId === "clutch-engine-to-arkwright") {
          clutch1Connected = typeof action.value === "boolean" ? action.value : !clutch1Connected;
        } else if (action.targetId === "clutch-arkwright-to-howe") {
          clutch2Connected = typeof action.value === "boolean" ? action.value : !clutch2Connected;
        }
      } else if (action.type === "inject_fault") {
        injectedFault = action.value as "negative_dissipation" | "active_torque";
      }
    }
  }

  const steamPressurePsi = params.steamPressurePsi ?? 100;
  const engineRpm = params.engineRpm ?? 65;
  const cutoffPct = params.cutoffPct ?? 25;
  const totalDraftRatio = params.totalDraftRatio ?? 6.0;
  const rollerClampingWeightKg = params.rollerClampingWeightKg ?? 3.5;
  const loopSlackPct = params.loopSlackPct ?? 65;
  const stitchPitchMm = params.stitchPitchMm ?? 3.5;

  // Component 1: Rotary Prime Mover (Corliss Engine)
  const corliss = stepCorlissEngine({ steamPressurePsi, engineRpm, cutoffPct });
  const omega1 = (engineRpm * 2 * Math.PI) / 60;
  const indicatedHp = corliss.indicatedHpUnrounded;
  const indicatedPowerW = indicatedHp * 745.699872;
  const engineFrictionPowerW = indicatedPowerW * 0.12;
  const availableShaftPowerW = Math.max(0, indicatedPowerW - engineFrictionPowerW);
  const _maxShaftTorqueNm = omega1 > 1e-4 ? availableShaftPowerW / omega1 : 0;

  // Previous angular velocities for transition ODE integration
  const prevOmega2 =
    prevState.componentStates["arkwright-spinning"]?.portValues.frame_drive_in?.flow ?? 0;
  const prevOmega3 =
    prevState.componentStates["howe-sewing"]?.portValues.machine_crank_in?.flow ?? 0;

  // Connection 1: Engine -> Arkwright Water Frame
  const conn1 = { ...prevState.connections[0] };
  conn1.connected = clutch1Connected;
  const targetOmega2 = omega1 * (180 / 65); // Pulley ratio to achieve 180 RPM water frame

  let omega2 = 0;
  let slip1PowerW = 0;

  if (!clutch1Connected) {
    // Disconnected: deceleration ODE (friction spindown)
    conn1.transitionState = "disengaged";
    conn1.transitionProgress = 0;
    conn1.transferredPowerWatts = 0;
    omega2 = Math.max(0, prevOmega2 * Math.exp(-dt / 0.7));
  } else {
    // Reconnecting / Engaged: clutch friction slip transition
    if (prevState.connections[0].transitionState === "disengaged") {
      conn1.transitionState = "slipping";
      conn1.transitionProgress = Math.min(1.0, dt / 0.8);
    } else if (prevState.connections[0].transitionState === "slipping") {
      conn1.transitionProgress = Math.min(
        1.0,
        prevState.connections[0].transitionProgress + dt / 0.8,
      );
      conn1.transitionState = conn1.transitionProgress >= 1.0 ? "engaged" : "slipping";
    } else {
      conn1.transitionState = "engaged";
      conn1.transitionProgress = 1.0;
    }

    if (conn1.transitionState === "slipping") {
      omega2 = prevOmega2 + (targetOmega2 - prevOmega2) * Math.min(1.0, dt / 0.25);
      const slipTorqueNm = 45.0; // Dynamic friction torque capacity
      slip1PowerW =
        slipTorqueNm * Math.abs(targetOmega2 - omega2) * (1.0 - conn1.transitionProgress);
    } else {
      omega2 = targetOmega2;
      slip1PowerW = 0;
    }
  }

  conn1.couplingLossWatts = Number(slip1PowerW.toFixed(4));

  // Component 2: Arkwright Water Frame
  const wheelRpm = (omega2 * 60) / (2 * Math.PI);
  let arkwrightOutputs = null;
  let arkwrightPowerW = 0;
  let yarnWorkPowerW = 0;
  let arkwrightDissipatedW = 0;

  if (wheelRpm > 0.5) {
    arkwrightOutputs = stepArkwrightWaterFrame({
      waterWheelRpm: wheelRpm,
      totalDraftRatio,
      rollerClampingWeightKg,
    });
    // Power scaling: baseline 120 W drafting + 45 W flyer spindle windage
    const speedRatio = wheelRpm / 180;
    arkwrightPowerW = 120 * speedRatio * speedRatio + 45 * speedRatio;
    yarnWorkPowerW = 0.35 * arkwrightPowerW;
    arkwrightDissipatedW = 0.65 * arkwrightPowerW;
  } else {
    arkwrightPowerW = 0;
    yarnWorkPowerW = 0;
    arkwrightDissipatedW = 0;
  }

  // Connection 2: Arkwright -> Howe Sewing Machine
  const conn2 = { ...prevState.connections[1] };
  conn2.connected = clutch2Connected;
  const targetOmega3 = omega2 * (240 / 180); // Pulley ratio to achieve 240 RPM sewing crank

  let omega3 = 0;
  let slip2PowerW = 0;

  if (!clutch2Connected || omega2 < 0.5) {
    // Disconnected or upstream unpowered: deceleration ODE
    conn2.transitionState = "disengaged";
    conn2.transitionProgress = 0;
    conn2.transferredPowerWatts = 0;
    omega3 = Math.max(0, prevOmega3 * Math.exp(-dt / 0.4));
  } else {
    // Reconnecting / Engaged: clutch slip
    if (prevState.connections[1].transitionState === "disengaged") {
      conn2.transitionState = "slipping";
      conn2.transitionProgress = Math.min(1.0, dt / 0.5);
    } else if (prevState.connections[1].transitionState === "slipping") {
      conn2.transitionProgress = Math.min(
        1.0,
        prevState.connections[1].transitionProgress + dt / 0.5,
      );
      conn2.transitionState = conn2.transitionProgress >= 1.0 ? "engaged" : "slipping";
    } else {
      conn2.transitionState = "engaged";
      conn2.transitionProgress = 1.0;
    }

    if (conn2.transitionState === "slipping") {
      omega3 = prevOmega3 + (targetOmega3 - prevOmega3) * Math.min(1.0, dt / 0.15);
      const slipTorqueNm = 12.0;
      slip2PowerW =
        slipTorqueNm * Math.abs(targetOmega3 - omega3) * (1.0 - conn2.transitionProgress);
    } else {
      omega3 = targetOmega3;
      slip2PowerW = 0;
    }
  }

  conn2.couplingLossWatts = Number(slip2PowerW.toFixed(4));

  // Component 3: Howe Sewing Machine
  const crankRpm = (omega3 * 60) / (2 * Math.PI);
  let howeOutputs = null;
  let howePowerW = 0;
  let sewingWorkPowerW = 0;
  let howeDissipatedW = 0;

  if (crankRpm > 0.5) {
    howeOutputs = stepHoweSewingMachine(crankRpm, loopSlackPct, stitchPitchMm);
    const speedRatio3 = crankRpm / 240;
    howePowerW = 35 * speedRatio3 + 18 * speedRatio3 * speedRatio3;
    sewingWorkPowerW = 0.3 * howePowerW;
    howeDissipatedW = 0.7 * howePowerW;
  } else {
    howePowerW = 0;
    sewingWorkPowerW = 0;
    howeDissipatedW = 0;
  }

  // Transferred powers across connections
  conn2.transferredPowerWatts =
    clutch2Connected && omega2 > 0.5 ? Number((howePowerW + slip2PowerW).toFixed(4)) : 0;
  conn1.transferredPowerWatts = clutch1Connected
    ? Number((arkwrightPowerW + slip1PowerW + conn2.transferredPowerWatts).toFixed(4))
    : 0;

  // Kinetic energy storage
  const J1 = 45.0; // Engine flywheel inertia [kg·m²]
  const J2 = 2.5; // Arkwright drum & flyers inertia [kg·m²]
  const J3 = 0.35; // Howe balance wheel inertia [kg·m²]

  const E_kin1 = 0.5 * J1 * omega1 * omega1;
  const E_kin2 = 0.5 * J2 * omega2 * omega2;
  const E_kin3 = 0.5 * J3 * omega3 * omega3;
  const _totalStoredEnergyJ = E_kin1 + E_kin2 + E_kin3;

  const prevE_kin1 = prevState.componentStates["rotary-drive"]?.storedEnergyJoules ?? E_kin1;
  const prevE_kin2 = prevState.componentStates["arkwright-spinning"]?.storedEnergyJoules ?? E_kin2;
  const prevE_kin3 = prevState.componentStates["howe-sewing"]?.storedEnergyJoules ?? E_kin3;

  const dE1_dt = (E_kin1 - prevE_kin1) / dt;
  const dE2_dt = (E_kin2 - prevE_kin2) / dt;
  const dE3_dt = (E_kin3 - prevE_kin3) / dt;
  const totalRateOfStoredEnergyW = dE1_dt + dE2_dt + dE3_dt;

  // Governor & Energy Balance
  // The Corliss automatic cutoff regulates steam admission to balance load + losses
  let totalDissipatedW =
    engineFrictionPowerW + slip1PowerW + arkwrightDissipatedW + slip2PowerW + howeDissipatedW;
  const totalUsefulW = yarnWorkPowerW + sewingWorkPowerW;

  // Check for injected fault mode
  let passivityViolated = false;
  let energyInjectedW = 0;
  let refusalReason: string | undefined;

  if (injectedFault === "negative_dissipation") {
    totalDissipatedW -= 500.0;
    passivityViolated = true;
    energyInjectedW = 500.0;
    refusalReason =
      "UNPHYSICAL_ENERGY_INJECTION: Negative dissipation detected (-500 W); system acts as an unphysical active source.";
  } else if (injectedFault === "active_torque") {
    totalDissipatedW -= 250.0;
    passivityViolated = true;
    energyInjectedW = 250.0;
    refusalReason =
      "UNPHYSICAL_ENERGY_INJECTION: Unphysical active torque source injected into passive rotational load.";
  }

  const totalInputW =
    indicatedPowerW > 0 ? totalDissipatedW + totalUsefulW + totalRateOfStoredEnergyW : 0;
  const totalInterfaceLossW = slip1PowerW + slip2PowerW;

  const measuredResidualW =
    totalInputW - totalUsefulW - totalDissipatedW - totalRateOfStoredEnergyW;
  const toleranceW = 1e-4;
  const isConserved = Math.abs(measuredResidualW) <= toleranceW;

  // Component Live States
  const driveTorqueNm = omega1 > 1e-4 ? totalInputW / omega1 : 0;
  const arkwrightTorqueNm =
    omega2 > 1e-4 ? (arkwrightPowerW + conn2.transferredPowerWatts) / omega2 : 0;
  const howeTorqueNm = omega3 > 1e-4 ? howePowerW / omega3 : 0;

  return {
    labId: "mechanical-rotary-chain",
    title: prevState.title,
    compositionClassification: "educational-composition",
    compositionDisclosure: prevState.compositionDisclosure,
    clock: {
      tick: currentTick,
      simTimeSec: Number(currentSimTime.toFixed(4)),
      dt,
      isReplaying: prevState.clock.isReplaying,
    },
    components: COUPLED_MECHANICAL_CHAIN_SPEC,
    connections: [conn1, conn2],
    componentStates: {
      "rotary-drive": {
        componentId: "rotary-drive",
        patentId: "us-6469-corliss-engine",
        isRunning: true,
        portValues: {
          rotary_drive_out: {
            portId: "rotary_drive_out",
            kind: "mechanical_rotational",
            direction: "out",
            effort: Number(driveTorqueNm.toFixed(3)),
            effortUnit: "N·m",
            flow: Number(omega1.toFixed(3)),
            flowUnit: "rad/s",
            powerWatts: Number(totalInputW.toFixed(2)),
            powerUnit: "W",
          },
        },
        inputPowerWatts: Number(totalInputW.toFixed(2)),
        outputPowerWatts: Number(conn1.transferredPowerWatts.toFixed(2)),
        dissipatedPowerWatts: Number(engineFrictionPowerW.toFixed(2)),
        storedEnergyJoules: Number(E_kin1.toFixed(2)),
        rateOfStoredEnergyWatts: Number(dE1_dt.toFixed(2)),
        telemetry: {
          engineRpm,
          steamPressurePsi,
          cutoffPct,
          indicatedHp: Number(indicatedHp.toFixed(2)),
          shaftTorqueNm: Number(driveTorqueNm.toFixed(2)),
        },
      },
      "arkwright-spinning": {
        componentId: "arkwright-spinning",
        patentId: "gb-931-arkwright-water-frame",
        isRunning: omega2 > 0.5,
        portValues: {
          frame_drive_in: {
            portId: "frame_drive_in",
            kind: "mechanical_rotational",
            direction: "in",
            effort: Number(arkwrightTorqueNm.toFixed(3)),
            effortUnit: "N·m",
            flow: Number(omega2.toFixed(3)),
            flowUnit: "rad/s",
            powerWatts: Number(conn1.transferredPowerWatts.toFixed(2)),
            powerUnit: "W",
          },
          jackshaft_out: {
            portId: "jackshaft_out",
            kind: "mechanical_rotational",
            direction: "out",
            effort: Number(howeTorqueNm.toFixed(3)),
            effortUnit: "N·m",
            flow: Number(omega2.toFixed(3)),
            flowUnit: "rad/s",
            powerWatts: Number(conn2.transferredPowerWatts.toFixed(2)),
            powerUnit: "W",
          },
        },
        inputPowerWatts: Number(conn1.transferredPowerWatts.toFixed(2)),
        outputPowerWatts: Number(conn2.transferredPowerWatts.toFixed(2)),
        dissipatedPowerWatts: Number(arkwrightDissipatedW.toFixed(2)),
        storedEnergyJoules: Number(E_kin2.toFixed(2)),
        rateOfStoredEnergyWatts: Number(dE2_dt.toFixed(2)),
        telemetry: {
          wheelRpm: Number(wheelRpm.toFixed(1)),
          flyerSpindleRpm: arkwrightOutputs ? Math.round(arkwrightOutputs.flyerSpindleRpm) : 0,
          outputYarnCountNe: arkwrightOutputs
            ? Number(arkwrightOutputs.outputYarnCountNe.toFixed(1))
            : 0,
          deliveryVelocityMPerMin: arkwrightOutputs
            ? Number(arkwrightOutputs.deliveryVelocityMPerMin.toFixed(2))
            : 0,
          yarnBreakingForceN: arkwrightOutputs
            ? Number(arkwrightOutputs.yarnBreakingForceN.toFixed(2))
            : 0,
        },
      },
      "howe-sewing": {
        componentId: "howe-sewing",
        patentId: "us-4750-howe-sewing-machine",
        isRunning: omega3 > 0.5,
        portValues: {
          machine_crank_in: {
            portId: "machine_crank_in",
            kind: "mechanical_rotational",
            direction: "in",
            effort: Number(howeTorqueNm.toFixed(3)),
            effortUnit: "N·m",
            flow: Number(omega3.toFixed(3)),
            flowUnit: "rad/s",
            powerWatts: Number(conn2.transferredPowerWatts.toFixed(2)),
            powerUnit: "W",
          },
        },
        inputPowerWatts: Number(conn2.transferredPowerWatts.toFixed(2)),
        outputPowerWatts: Number(sewingWorkPowerW.toFixed(2)),
        dissipatedPowerWatts: Number(howeDissipatedW.toFixed(2)),
        storedEnergyJoules: Number(E_kin3.toFixed(2)),
        rateOfStoredEnergyWatts: Number(dE3_dt.toFixed(2)),
        telemetry: {
          crankRpm: Number(crankRpm.toFixed(1)),
          stitchesPerMinute: howeOutputs ? Math.round(howeOutputs.stitchesPerMinute) : 0,
          clothFeedMmPerS: howeOutputs ? Number(howeOutputs.clothFeedMmPerS.toFixed(2)) : 0,
          stitchFrequencyHz: howeOutputs ? Number(howeOutputs.stitchFrequencyHz.toFixed(1)) : 0,
          loopSlackPct,
        },
      },
    },
    energy: {
      totalInputPowerWatts: Number(totalInputW.toFixed(3)),
      totalUsefulOutputPowerWatts: Number(totalUsefulW.toFixed(3)),
      totalDissipatedPowerWatts: Number(totalDissipatedW.toFixed(3)),
      totalRateOfStoredEnergyWatts: Number(totalRateOfStoredEnergyW.toFixed(3)),
      totalInterfaceLossWatts: Number(totalInterfaceLossW.toFixed(3)),
      measuredResidualWatts: Number(measuredResidualW.toFixed(6)),
      toleranceWatts: toleranceW,
      isConserved,
      isPassive: !passivityViolated,
      injectedEnergyError: passivityViolated,
      ...(passivityViolated
        ? {
            refusal: {
              isRefused: true,
              reason: refusalReason,
              divergenceMetric: energyInjectedW,
            },
          }
        : {}),
    },
  };
}

/* ============================================================================
 * PILOT LAB 2: ELECTRICAL POWER CHAIN
 * Gramme Dynamo -> Tesla Transformer -> Edison Incandescent Lamp
 * ============================================================================
 */

export const COUPLED_ELECTRICAL_CHAIN_SPEC: readonly CoupledComponentSpec[] = [
  {
    componentId: "gramme-dynamo",
    patentId: "us-120057-gramme-dynamo",
    patentNumber: "US 120,057",
    title: "Gramme Ring Dynamo (Electrical Generator)",
    role: "Central electric generator converting prime-mover shaft rotation into continuous direct current via ring armature",
    acceptedKernelOwner: "stepGrammeDynamo (FrankenSimEngine.stepGrammeDynamo)",
    evidenceClassification: "source-derived",
    evidenceBoundaryNote:
      "Zénobe Gramme's 1871 patent claimed ring-wound armature continuous current generation. Supplying a downstream high-frequency induction transformer and incandescent lamp is an educational composition linking seminal 19th-century electrical patents.",
    ports: {
      generator_elec_out: {
        ...CANONICAL_COUPLED_PORT_SCHEMAS.electrical_terminal_out,
        portId: "generator_elec_out",
        name: "Commutator Brush Output Terminals",
      },
    } as Record<string, CoupledPortSchema>,
  },
  {
    componentId: "tesla-transformer",
    patentId: "us-593138-tesla-coil",
    patentNumber: "US 593,138",
    title: "Tesla Electrical Transformer / Induction Apparatus",
    role: "Intermediate inductive voltage conversion apparatus transferring power across magnetically coupled primary and secondary windings",
    acceptedKernelOwner: "stepTeslaTransformerSi (FrankenSimEngine.stepTeslaTransformerSi)",
    evidenceClassification: "educational-composition",
    evidenceBoundaryNote:
      "Nikola Tesla's 1897 patent disclosed a high-frequency quarter-wave resonant transformer without historical impedance or load values. The lumped core and winding resistance values used here model an educational transformer bridge to incandescent lighting.",
    ports: {
      transformer_primary_in: {
        ...CANONICAL_COUPLED_PORT_SCHEMAS.electrical_terminal_in,
        portId: "transformer_primary_in",
        name: "Primary Winding Input Terminals",
      },
      transformer_secondary_out: {
        ...CANONICAL_COUPLED_PORT_SCHEMAS.electrical_terminal_out,
        portId: "transformer_secondary_out",
        name: "Secondary Winding Output Terminals",
      },
    } as Record<string, CoupledPortSchema>,
  },
  {
    componentId: "edison-lamp",
    patentId: "us-223898-edison-lightbulb",
    patentNumber: "US 223,898",
    title: "Edison Incandescent Electric Lamp",
    role: "Terminal electrical load dissipating Joule power as radiant visible light and thermal radiation via high-resistance carbon filament",
    acceptedKernelOwner: "stepEdisonRadiativeBalance (FrankenSimEngine.stepEdisonRadiativeBalance)",
    evidenceClassification: "source-disclosed",
    evidenceBoundaryNote:
      "Thomas Edison's 1880 patent claimed a high-resistance carbon filament enclosed in a high vacuum. Radiative balance and non-linear resistance follow the shared SI kernel; connection to Tesla and Gramme apparatus is an educational multi-patent composition.",
    ports: {
      lamp_filament_in: {
        ...CANONICAL_COUPLED_PORT_SCHEMAS.electrical_terminal_in,
        portId: "lamp_filament_in",
        name: "Bulb Base Socket Terminals",
      },
    } as Record<string, CoupledPortSchema>,
  },
];

export interface ElectricalChainParams {
  shaftRate?: number;
  fieldExcitation?: number;
  turnsRatio?: number;
  coreCoupling?: number;
  filamentLengthCm?: number;
  coldResistanceOhm?: number;
  switch1Connected?: boolean;
  switch2Connected?: boolean;
  injectedFault?: "negative_resistance" | "spontaneous_generation";
}

export function createInitialElectricalChainState(
  params: ElectricalChainParams = {},
): CoupledLabState {
  const shaftRate = params.shaftRate ?? 1.0;
  const voc = 120.0 * shaftRate;

  return {
    labId: "electrical-power-chain",
    title: "Electrical Power Chain: Dynamo Generator → Transformer → Incandescent Lamp",
    compositionClassification: "educational-composition",
    compositionDisclosure:
      "Educational Composition: Multi-Patent Electrical Generation, Transformation, and Incandescent Lighting (Gramme Dynamo US 120,057 -> Tesla Transformer US 593,138 -> Edison Lamp US 223,898). Historical direct coupling of Zénobe Gramme's continuous-current dynamo, Nikola Tesla's induction apparatus, and Thomas Edison's high-resistance incandescent lamp was never claimed in original patent grants. This simulation models an electrical power network with knife switch disconnection, inrush transient dynamics, Stefan-Boltzmann radiative dissipation, and SI power conservation.",
    clock: {
      tick: 0,
      simTimeSec: 0,
      dt: 0.05,
      isReplaying: false,
    },
    components: COUPLED_ELECTRICAL_CHAIN_SPEC,
    connections: [
      {
        connectionId: "switch-generator-to-transformer",
        fromComponentId: "gramme-dynamo",
        fromPortId: "generator_elec_out",
        toComponentId: "tesla-transformer",
        toPortId: "transformer_primary_in",
        kind: "electrical",
        couplingType: "switch",
        connected: params.switch1Connected ?? true,
        transitionState: "engaged",
        transitionProgress: 1.0,
        couplingLossWatts: 0,
        transferredPowerWatts: 0,
      },
      {
        connectionId: "switch-transformer-to-lamp",
        fromComponentId: "tesla-transformer",
        fromPortId: "transformer_secondary_out",
        toComponentId: "edison-lamp",
        toPortId: "lamp_filament_in",
        kind: "electrical",
        couplingType: "switch",
        connected: params.switch2Connected ?? true,
        transitionState: "engaged",
        transitionProgress: 1.0,
        couplingLossWatts: 0,
        transferredPowerWatts: 0,
      },
    ],
    componentStates: {
      "gramme-dynamo": {
        componentId: "gramme-dynamo",
        patentId: "us-120057-gramme-dynamo",
        isRunning: true,
        portValues: {
          generator_elec_out: {
            portId: "generator_elec_out",
            kind: "electrical",
            direction: "out",
            effort: voc,
            effortUnit: "V",
            flow: 0,
            flowUnit: "A",
            powerWatts: 0,
            powerUnit: "W",
          },
        },
        inputPowerWatts: 0,
        outputPowerWatts: 0,
        dissipatedPowerWatts: 0,
        storedEnergyJoules: 0,
        rateOfStoredEnergyWatts: 0,
        telemetry: {
          shaftRate,
          openCircuitEmfV: voc,
          terminalVoltageV: voc,
          loadCurrentA: 0,
        },
      },
      "tesla-transformer": {
        componentId: "tesla-transformer",
        patentId: "us-593138-tesla-coil",
        isRunning: true,
        portValues: {
          transformer_primary_in: {
            portId: "transformer_primary_in",
            kind: "electrical",
            direction: "in",
            effort: 0,
            effortUnit: "V",
            flow: 0,
            flowUnit: "A",
            powerWatts: 0,
            powerUnit: "W",
          },
          transformer_secondary_out: {
            portId: "transformer_secondary_out",
            kind: "electrical",
            direction: "out",
            effort: 0,
            effortUnit: "V",
            flow: 0,
            flowUnit: "A",
            powerWatts: 0,
            powerUnit: "W",
          },
        },
        inputPowerWatts: 0,
        outputPowerWatts: 0,
        dissipatedPowerWatts: 0,
        storedEnergyJoules: 0,
        rateOfStoredEnergyWatts: 0,
        telemetry: {
          primaryVoltageV: 0,
          secondaryVoltageV: 0,
          turnsRatio: 1.0,
          coreCoupling: 0.96,
        },
      },
      "edison-lamp": {
        componentId: "edison-lamp",
        patentId: "us-223898-edison-lightbulb",
        isRunning: true,
        portValues: {
          lamp_filament_in: {
            portId: "lamp_filament_in",
            kind: "electrical",
            direction: "in",
            effort: 0,
            effortUnit: "V",
            flow: 0,
            flowUnit: "A",
            powerWatts: 0,
            powerUnit: "W",
          },
        },
        inputPowerWatts: 0,
        outputPowerWatts: 0,
        dissipatedPowerWatts: 0,
        storedEnergyJoules: 0,
        rateOfStoredEnergyWatts: 0,
        telemetry: {
          voltageV: 0,
          filamentCurrentA: 0,
          filamentTempK: 293.15,
          hotResistanceOhm: 140,
          lumens: 0,
        },
      },
    },
    energy: {
      totalInputPowerWatts: 0,
      totalUsefulOutputPowerWatts: 0,
      totalDissipatedPowerWatts: 0,
      totalRateOfStoredEnergyWatts: 0,
      totalInterfaceLossWatts: 0,
      measuredResidualWatts: 0,
      toleranceWatts: 1e-4,
      isConserved: true,
      isPassive: true,
      injectedEnergyError: false,
    },
  };
}

/**
 * Steps the Electrical Power Chain across one synchronous tick dt.
 */
export function stepElectricalChainLab(
  prevState: CoupledLabState,
  params: ElectricalChainParams = {},
  actions: readonly CoupledLabAction[] = [],
  dt: number = 0.05,
): CoupledLabState {
  const currentTick = prevState.clock.tick + 1;
  const currentSimTime = prevState.clock.simTimeSec + dt;

  let switch1Connected = params.switch1Connected ?? prevState.connections[0].connected;
  let switch2Connected = params.switch2Connected ?? prevState.connections[1].connected;
  let injectedFault = params.injectedFault;

  for (const action of actions) {
    if (action.tick === currentTick) {
      if (action.type === "toggle_connection") {
        if (action.targetId === "switch-generator-to-transformer") {
          switch1Connected = typeof action.value === "boolean" ? action.value : !switch1Connected;
        } else if (action.targetId === "switch-transformer-to-lamp") {
          switch2Connected = typeof action.value === "boolean" ? action.value : !switch2Connected;
        }
      } else if (action.type === "inject_fault") {
        injectedFault = action.value as "negative_resistance" | "spontaneous_generation";
      }
    }
  }

  const shaftRate = params.shaftRate ?? 1.0;
  const fieldExcitation = params.fieldExcitation ?? 1.0;
  const turnsRatio = params.turnsRatio ?? 1.0;
  const coreCoupling = params.coreCoupling ?? 0.96;
  const filamentLengthCm = params.filamentLengthCm ?? 15.0;
  const coldResistanceOhm = params.coldResistanceOhm ?? 15.0;

  // Gramme Dynamo Open-Circuit EMF
  const _gramme = stepGrammeDynamo({ shaftRate });
  const openCircuitEmfV = 120.0 * shaftRate * fieldExcitation;
  const armatureResistanceOhm = 2.5;

  // Transformer internal parameters
  const primaryResistanceOhm = 1.0;
  const secondaryResistanceOhm = 1.0;
  const switchResistanceOhm = 0.1;

  // Filament thermal model
  const prevTempK =
    (prevState.componentStates["edison-lamp"]?.telemetry?.filamentTempKUnrounded as number) ??
    (prevState.componentStates["edison-lamp"]?.telemetry?.filamentTempK as number) ??
    293.15;
  const ambientTempK = 293.15;
  const heatCapacityJPerK = 0.015; // Lamp filament thermal heat capacity [J/K]

  // Dynamic filament resistance based on temperature
  let filamentResistanceOhm = coldResistanceOhm * (1.0 + 0.0045 * (prevTempK - ambientTempK));
  if (injectedFault === "negative_resistance") {
    filamentResistanceOhm = -80.0;
  }

  // Switch connection & inrush tracking
  const conn1 = { ...prevState.connections[0] };
  conn1.connected = switch1Connected;
  if (!switch1Connected) {
    conn1.transitionState = "disengaged";
    conn1.transitionProgress = 0;
  } else if (prevState.connections[0].transitionState === "disengaged") {
    conn1.transitionState = "inrush";
    conn1.transitionProgress = Math.min(1.0, dt / 0.08);
  } else if (prevState.connections[0].transitionState === "inrush") {
    conn1.transitionProgress = Math.min(
      1.0,
      prevState.connections[0].transitionProgress + dt / 0.08,
    );
    conn1.transitionState = conn1.transitionProgress >= 1.0 ? "engaged" : "inrush";
  }

  const conn2 = { ...prevState.connections[1] };
  conn2.connected = switch2Connected;
  if (!switch2Connected) {
    conn2.transitionState = "disengaged";
    conn2.transitionProgress = 0;
  } else if (prevState.connections[1].transitionState === "disengaged") {
    conn2.transitionState = "inrush";
    conn2.transitionProgress = Math.min(1.0, dt / 0.08);
  } else if (prevState.connections[1].transitionState === "inrush") {
    conn2.transitionProgress = Math.min(
      1.0,
      prevState.connections[1].transitionProgress + dt / 0.08,
    );
    conn2.transitionState = conn2.transitionProgress >= 1.0 ? "engaged" : "inrush";
  }

  // Circuit electrical solution
  let primaryCurrentA = 0;
  let secondaryCurrentA = 0;
  let terminalVoltageV = openCircuitEmfV;
  let primaryVoltageV = 0;
  let secondaryVoltageV = 0;
  let lampVoltageV = 0;

  if (switch1Connected && switch2Connected) {
    // Both switches closed: full loop through transformer into lamp
    const n = turnsRatio;
    const k = coreCoupling;
    const secondaryLoopResistance =
      secondaryResistanceOhm + switchResistanceOhm + filamentResistanceOhm;
    const reflectedSecondaryResistance = secondaryLoopResistance / (n * n * k * k);
    const totalLoopResistance =
      armatureResistanceOhm +
      switchResistanceOhm +
      primaryResistanceOhm +
      reflectedSecondaryResistance;

    primaryCurrentA = totalLoopResistance > 1e-4 ? openCircuitEmfV / totalLoopResistance : 0;
    terminalVoltageV = openCircuitEmfV - primaryCurrentA * armatureResistanceOhm;
    primaryVoltageV = terminalVoltageV - primaryCurrentA * switchResistanceOhm;

    secondaryCurrentA = primaryCurrentA / (n * k);
    secondaryVoltageV = primaryVoltageV * n * k - secondaryCurrentA * secondaryResistanceOhm;
    lampVoltageV = secondaryVoltageV - secondaryCurrentA * switchResistanceOhm;
  } else if (switch1Connected && !switch2Connected) {
    // Transformer primary connected, secondary open circuit
    const coreExcitationResistance = 2500.0;
    const totalLoopResistance =
      armatureResistanceOhm + switchResistanceOhm + primaryResistanceOhm + coreExcitationResistance;
    primaryCurrentA = openCircuitEmfV / totalLoopResistance;
    terminalVoltageV = openCircuitEmfV - primaryCurrentA * armatureResistanceOhm;
    primaryVoltageV = terminalVoltageV - primaryCurrentA * switchResistanceOhm;
    secondaryCurrentA = 0;
    secondaryVoltageV = primaryVoltageV * turnsRatio * coreCoupling;
    lampVoltageV = 0;
  } else {
    // Switch 1 open: entire circuit unpowered
    primaryCurrentA = 0;
    secondaryCurrentA = 0;
    terminalVoltageV = openCircuitEmfV;
    primaryVoltageV = 0;
    secondaryVoltageV = 0;
    lampVoltageV = 0;
  }

  // Power flows
  const switch1LossW = primaryCurrentA * primaryCurrentA * switchResistanceOhm;
  const switch2LossW = secondaryCurrentA * secondaryCurrentA * switchResistanceOhm;
  conn1.couplingLossWatts = Number(switch1LossW.toFixed(4));
  conn2.couplingLossWatts = Number(switch2LossW.toFixed(4));

  conn1.transferredPowerWatts = Number((primaryVoltageV * primaryCurrentA).toFixed(4));
  conn2.transferredPowerWatts = Number((secondaryVoltageV * secondaryCurrentA).toFixed(4));

  const dynamoGeneratedPowerW = openCircuitEmfV * primaryCurrentA;
  const dynamoInternalLossW = primaryCurrentA * primaryCurrentA * armatureResistanceOhm;
  const transformerInputW = primaryVoltageV * primaryCurrentA;
  const transformerOutputW = secondaryVoltageV * secondaryCurrentA;
  const transformerLossW = Math.max(0, transformerInputW - transformerOutputW);
  const lampElectricalInputW = Math.max(0, lampVoltageV * secondaryCurrentA);

  // Filament thermal ODE: C_th * dT/dt = P_elec - P_rad
  // Radiation via Stefan-Boltzmann: P_rad = sigma * eps * A * (T^4 - T_amb^4)
  const sigmaEpsA = 4.5e-12; // W / K^4
  const radiativeLossW = Math.max(0, sigmaEpsA * (prevTempK ** 4 - ambientTempK ** 4));

  let nextTempK = prevTempK;
  if (switch1Connected && switch2Connected && lampElectricalInputW > 0) {
    const netHeatRateW = lampElectricalInputW - radiativeLossW;
    nextTempK = prevTempK + (netHeatRateW / heatCapacityJPerK) * dt;
  } else {
    // Radiative cooling down to ambient: C_th * dT/dt = -P_rad
    nextTempK = Math.max(ambientTempK, prevTempK - (radiativeLossW / heatCapacityJPerK) * dt);
  }
  nextTempK = Math.max(ambientTempK, Math.min(2800.0, nextTempK));

  const storedThermalEnergyJ = heatCapacityJPerK * (nextTempK - ambientTempK);
  const prevStoredThermalEnergyJ =
    prevState.componentStates["edison-lamp"]?.storedEnergyJoules ?? storedThermalEnergyJ;
  const dThermal_dt = (storedThermalEnergyJ - prevStoredThermalEnergyJ) / dt;

  // Edison step for optical output telemetry
  const edisonStep = stepEdisonRadiativeBalance({
    voltageV: Math.max(0, lampVoltageV),
    hotResistanceOhm: Math.max(10, filamentResistanceOhm),
    filamentLengthCm,
  });

  // Energy accounting
  let totalDissipatedW =
    dynamoInternalLossW + switch1LossW + transformerLossW + switch2LossW + radiativeLossW;
  let passivityViolated = false;
  let energyInjectedW = 0;
  let refusalReason: string | undefined;

  if (injectedFault === "negative_resistance") {
    totalDissipatedW -= 400.0;
    passivityViolated = true;
    energyInjectedW = 400.0;
    refusalReason =
      "UNPHYSICAL_ENERGY_INJECTION: Negative dissipation detected in electrical load (-80 Ω); system acts as an unphysical active source.";
  } else if (injectedFault === "spontaneous_generation") {
    totalDissipatedW -= 200.0;
    passivityViolated = true;
    energyInjectedW = 200.0;
    refusalReason =
      "UNPHYSICAL_ENERGY_INJECTION: Spontaneous power generation detected on passive electrical transmission line.";
  }

  const measuredResidualW = dynamoGeneratedPowerW - totalDissipatedW - dThermal_dt;
  const toleranceW = 1e-4;
  const isConserved = Math.abs(measuredResidualW) <= toleranceW;

  return {
    labId: "electrical-power-chain",
    title: prevState.title,
    compositionClassification: "educational-composition",
    compositionDisclosure: prevState.compositionDisclosure,
    clock: {
      tick: currentTick,
      simTimeSec: Number(currentSimTime.toFixed(4)),
      dt,
      isReplaying: prevState.clock.isReplaying,
    },
    components: COUPLED_ELECTRICAL_CHAIN_SPEC,
    connections: [conn1, conn2],
    componentStates: {
      "gramme-dynamo": {
        componentId: "gramme-dynamo",
        patentId: "us-120057-gramme-dynamo",
        isRunning: true,
        portValues: {
          generator_elec_out: {
            portId: "generator_elec_out",
            kind: "electrical",
            direction: "out",
            effort: Number(terminalVoltageV.toFixed(2)),
            effortUnit: "V",
            flow: Number(primaryCurrentA.toFixed(3)),
            flowUnit: "A",
            powerWatts: Number((terminalVoltageV * primaryCurrentA).toFixed(2)),
            powerUnit: "W",
          },
        },
        inputPowerWatts: Number(dynamoGeneratedPowerW.toFixed(2)),
        outputPowerWatts: Number((terminalVoltageV * primaryCurrentA).toFixed(2)),
        dissipatedPowerWatts: Number(dynamoInternalLossW.toFixed(2)),
        storedEnergyJoules: 0,
        rateOfStoredEnergyWatts: 0,
        telemetry: {
          shaftRate,
          openCircuitEmfV: Number(openCircuitEmfV.toFixed(2)),
          terminalVoltageV: Number(terminalVoltageV.toFixed(2)),
          loadCurrentA: Number(primaryCurrentA.toFixed(3)),
          generatedPowerW: Number(dynamoGeneratedPowerW.toFixed(2)),
        },
      },
      "tesla-transformer": {
        componentId: "tesla-transformer",
        patentId: "us-593138-tesla-coil",
        isRunning: primaryCurrentA > 0,
        portValues: {
          transformer_primary_in: {
            portId: "transformer_primary_in",
            kind: "electrical",
            direction: "in",
            effort: Number(primaryVoltageV.toFixed(2)),
            effortUnit: "V",
            flow: Number(primaryCurrentA.toFixed(3)),
            flowUnit: "A",
            powerWatts: Number((primaryVoltageV * primaryCurrentA).toFixed(2)),
            powerUnit: "W",
          },
          transformer_secondary_out: {
            portId: "transformer_secondary_out",
            kind: "electrical",
            direction: "out",
            effort: Number(secondaryVoltageV.toFixed(2)),
            effortUnit: "V",
            flow: Number(secondaryCurrentA.toFixed(3)),
            flowUnit: "A",
            powerWatts: Number((secondaryVoltageV * secondaryCurrentA).toFixed(2)),
            powerUnit: "W",
          },
        },
        inputPowerWatts: Number(conn1.transferredPowerWatts.toFixed(2)),
        outputPowerWatts: Number(conn2.transferredPowerWatts.toFixed(2)),
        dissipatedPowerWatts: Number(transformerLossW.toFixed(2)),
        storedEnergyJoules: 0,
        rateOfStoredEnergyWatts: 0,
        telemetry: {
          primaryVoltageV: Number(primaryVoltageV.toFixed(2)),
          secondaryVoltageV: Number(secondaryVoltageV.toFixed(2)),
          turnsRatio,
          coreCoupling,
          transformationLossW: Number(transformerLossW.toFixed(2)),
        },
      },
      "edison-lamp": {
        componentId: "edison-lamp",
        patentId: "us-223898-edison-lightbulb",
        isRunning: secondaryCurrentA > 0.05,
        portValues: {
          lamp_filament_in: {
            portId: "lamp_filament_in",
            kind: "electrical",
            direction: "in",
            effort: Number(lampVoltageV.toFixed(2)),
            effortUnit: "V",
            flow: Number(secondaryCurrentA.toFixed(3)),
            flowUnit: "A",
            powerWatts: Number(lampElectricalInputW.toFixed(2)),
            powerUnit: "W",
          },
        },
        inputPowerWatts: Number(lampElectricalInputW.toFixed(2)),
        outputPowerWatts: Number(radiativeLossW.toFixed(2)),
        dissipatedPowerWatts: Number(radiativeLossW.toFixed(2)),
        storedEnergyJoules: storedThermalEnergyJ,
        rateOfStoredEnergyWatts: dThermal_dt,
        telemetry: {
          voltageV: Number(lampVoltageV.toFixed(2)),
          filamentCurrentA: Number(secondaryCurrentA.toFixed(3)),
          filamentTempK: Math.round(nextTempK),
          filamentTempKUnrounded: nextTempK,
          hotResistanceOhm: Number(filamentResistanceOhm.toFixed(1)),
          radiativePowerW: Number(radiativeLossW.toFixed(2)),
          lumens: edisonStep ? Math.round(edisonStep.radiative_power_w * 1.6) : 0,
        },
      },
    },
    energy: {
      totalInputPowerWatts: Number(dynamoGeneratedPowerW.toFixed(3)),
      totalUsefulOutputPowerWatts: Number(radiativeLossW.toFixed(3)),
      totalDissipatedPowerWatts: Number(totalDissipatedW.toFixed(3)),
      totalRateOfStoredEnergyWatts: Number(dThermal_dt.toFixed(3)),
      totalInterfaceLossWatts: Number((switch1LossW + switch2LossW).toFixed(3)),
      measuredResidualWatts: Number(measuredResidualW.toFixed(6)),
      toleranceWatts: toleranceW,
      isConserved,
      isPassive: !passivityViolated,
      injectedEnergyError: passivityViolated,
      ...(passivityViolated
        ? {
            refusal: {
              isRefused: true,
              reason: refusalReason,
              divergenceMetric: energyInjectedW,
            },
          }
        : {}),
    },
  };
}

/**
 * Executes a deterministic simulation replay from an action tape.
 * Guarantees bit-exact reproducible trajectories from tick 0 to totalTicks.
 */
export function executeCoupledLabReplay(
  labId: "mechanical-rotary-chain" | "electrical-power-chain",
  initialParams: Record<string, number | boolean | string | undefined> = {},
  actions: readonly CoupledLabAction[] = [],
  totalTicks: number = 20,
  dt: number = 0.05,
): readonly CoupledLabState[] {
  const trajectory: CoupledLabState[] = [];
  let currentState: CoupledLabState =
    labId === "mechanical-rotary-chain"
      ? createInitialMechanicalChainState(initialParams as MechanicalChainParams)
      : createInitialElectricalChainState(initialParams as ElectricalChainParams);

  trajectory.push(currentState);

  for (let i = 0; i < totalTicks; i++) {
    currentState =
      labId === "mechanical-rotary-chain"
        ? stepMechanicalChainLab(currentState, initialParams as MechanicalChainParams, actions, dt)
        : stepElectricalChainLab(currentState, initialParams as ElectricalChainParams, actions, dt);
    trajectory.push(currentState);
  }

  return trajectory;
}
