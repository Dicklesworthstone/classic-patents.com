import {
  stepBaekelandBakelite,
  stepBellPhotophone,
  stepCarlsonElectrophotography,
  stepDeForestAudion,
  stepFessendenWireless,
  stepHaberAmmonia,
  stepHewittMercuryLamp,
  stepKilbyIntegratedCircuit,
  stepLandPolaroidInstantFilm,
  stepRillieuxEvaporator,
  stepTownesLaser,
  stepYaleLock,
} from "./catalogKernels";

/**
 * telemetryData.ts
 *
 * Domain-specific FrankenSim SI Physics Telemetry Registry with live reactive computational models.
 * Supplies authentic mathematical governing laws, real SI physical units,
 * interactive parameter controllers, and 60-FPS computed telemetry states for every classic patent.
 */

import { stepAmfVersatranTopology } from "./amfVersatranKernel";
import { stepArkwrightWaterFrame } from "./arkwrightKernel";
import { INITIAL_BAER_STATE, readBaerControls, stepBaerOdysseySi } from "./baerOdysseyKernel";
import {
  stepBellTelephone,
  stepBoyleSmithCcd,
  stepCorlissEngine,
  stepDavenportMotor,
  stepDeLavalSeparator,
  stepEdisonBulb,
  stepEinsteinRefrigerator as stepEinsteinRefrigeratorSi,
  stepEngelbartMouse,
  stepGatlingGun,
  stepGliddenBarbedWire,
  stepGrammeDynamo,
  stepHallAluminium,
  stepHyattCelluloid,
  stepLincolnBuoy as stepLincolnBuoySi,
  stepMaimanRubyLaser,
  stepMcCormickReaper,
  stepMorseTelegraph,
  stepNobelDynamite,
  stepNoyceIC,
  stepOttoEngine,
  stepParsonsTurbine,
  stepPasteurFermentation,
  stepTeslaTeleautomaton,
  stepThomsonWelding,
  stepWhitneyCottonGin,
  stepWozniakApple,
  stepZeppelinAirship,
  voltsToKv,
} from "./catalogKernels";
import { stepCortPuddlingRolling } from "./cortKernel";
import { CRUMP_FDM_DEFAULT_CONTROLS, readCrumpFdmControls, stepCrumpFdmSi } from "./crumpFdmKernel";
import { readDaVinciControls } from "./daVinciKernel";
import { stepDevolProgrammedTransfer } from "./devolProgrammedTransferKernel";
import { stepEInk } from "./eInkKernel";
import { FrankenSimEngine } from "./engine";
import { stepFermiKinetics } from "./fermiKinetics";
import {
  GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS,
  readGoertzMasterSlaveControls,
  stepGoertzMasterSlaveTopology,
} from "./goertzElectronicMasterSlaveManipulatorKernel";
import { stepHopkinsPotash } from "./hopkinsPotashKernel";
import {
  HULL_SLA_DEFAULT_CONTROLS,
  readHullStereolithographyControls,
  stepHullStereolithographySi,
} from "./hullStereolithographyKernel";
import {
  KAMEN_INJECTION_DEFAULT_CONTROLS,
  readKamenInjectionControls,
  stepKamenInjectionMechanism,
} from "./kamenInjectionKernel";
import {
  KAMEN_SEGWAY_DEFAULT_CONTROLS,
  readKamenSegwayControls,
  stepKamenSegwaySi,
} from "./kamenSegwayKernel";
import {
  KAMEN_TRANSPORTER_DEFAULT_CONTROLS,
  readKamenTransporterControls,
  stepKamenTransporterSi,
} from "./kamenTransporterKernel";
import { stepLemelsonManipulatorTopology } from "./lemelsonAdjustableManipulatorKernel";
import {
  LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS,
  readLemelsonAutomaticProductionControls,
  stepLemelsonAutomaticProductionTopology,
} from "./lemelsonAutomaticProductionKernel";
import {
  readLemelsonMachineVisionControls,
  stepLemelsonMachineVisionSi,
} from "./lemelsonMachineVisionKernel";
import {
  LEMELSON_WAREHOUSE_DEFAULT_CONTROLS,
  readLemelsonWarehouseControls,
  stepLemelsonWarehouseTopology,
} from "./lemelsonWarehouseKernel";
import {
  stepHoweSewingMachine,
  stepMergenthalerLinotype,
  stepRenoEscalator,
  stepSholesTypewriter,
} from "./machineKernels";
import { stepMakinoScaraTopology } from "./makinoScaraKernel";
import {
  MESTRAL_VELCRO_DEFAULTS,
  readMestralVelcroControls,
  stepMestralVelcroSi,
} from "./mestralVelcroKernel";
import {
  INITIAL_ETHERNET_STATE,
  readEthernetControls,
  stepMetcalfeEthernetSi,
} from "./metcalfeEthernetKernel";
import { stepMilacronRobotToolchanger } from "./milacronRobotToolchangerKernel";
import { stepMultiTouch } from "./multiTouchKernel";
import { readOtisTopologyControls, stepOtis1861Topology } from "./otisKernel";
import { stepPageRank } from "./pageRankKernel";
import { stepRobotEndEffector } from "./robotEndEffectorKernel";
import { ROOMBA_ROOM, stepRoomba } from "./roombaKernel";
import {
  readSalisburyRobotHandControls,
  SALISBURY_HAND_DEFAULT_CONTROLS,
} from "./salisburyRobotHandKernel";
import {
  INITIAL_SIKORSKY_STATE,
  readSikorskyControls,
  stepSikorskyHelicopterSi,
} from "./sikorskyHelicopterKernel";
import {
  readStackhouseSourceControls,
  STACKHOUSE_SOURCE_DEFAULT_CONTROLS,
  stepStackhouseSourceTopology,
} from "./stackhouseSourceKernel";
import {
  readSundbackZipperControls,
  SUNDBACK_ZIPPER_DEFAULT_CONTROLS,
  stepSundbackZipperSi,
} from "./sundbackZipperKernel";
import { readTeslaTransformerControls, stepTeslaTransformerSi } from "./teslaTransformerKernel";
import { goddardNozzleMatch } from "./thermochem";

import {
  readWatsonRemoteCenterComplianceControls,
  stepWatsonRemoteCenterComplianceTopology,
  WATSON_REMOTE_CENTER_COMPLIANCE_DEFAULT_CONTROLS,
} from "./watsonRemoteCenterComplianceKernel";
import { stepWattCondenser } from "./wattCondenserKernel";
import { stepWattRotaryEngine } from "./wattRotaryKernel";
import { readWrightControls, stepWrightFlyerSi, WRIGHT_COUPLING } from "./wrightKernel";

export type MetricProvenanceClassification =
  | "source-disclosed"
  | "scenario-modern"
  | "scenario-reader"
  | "topology-normalized"
  | "refusal-bounded";

export interface PhysicsControl {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  provenance?: MetricProvenanceClassification;
  provenanceCitation?: string;
}

export interface PhysicsMetric {
  label: string;
  value: string;
  unit: string;
  badgeColor: "cyan" | "emerald" | "amber" | "indigo" | "rose" | "purple";
  progressPct?: number; // 0 to 100 for live graphic meter
  provenance?: MetricProvenanceClassification;
  provenanceCitation?: string;
}

export function clampProgress(pct: number): number {
  return Math.min(100, Math.max(0, pct));
}

export interface PatentPhysicsMetadata {
  domain: string;
  domainTitle: string;
  equationName: string;
  governingEquation: string;
  engineMethod: string;
  controls: PhysicsControl[];
  computeMetrics: (params: Record<string, number>) => PhysicsMetric[];
  pedagogicalInsight: string;
  provenance?: MetricProvenanceClassification;
  enforceConstraints?: (
    params: Record<string, number>,
    key: string,
    value: number,
  ) => Record<string, number>;
}

export const PATENT_PHYSICS_REGISTRY: Record<string, PatentPhysicsMetadata> = {
  "us-2543181-land-polaroid": {
    domain: "chemistry",
    domainTitle: "Chemical Physics & Diffusion Transfer",
    equationName: "Fickian Diffusion & Silver Thiosulfate Complexation",
    governingEquation:
      "J = -D \\frac{\\partial C}{\\partial x} \\quad \\text{and} \\quad \\text{AgBr} + 2\\text{S}_2\\text{O}_3^{2-} \\rightleftharpoons [\\text{Ag}(\\text{S}_2\\text{O}_3)_2]^{3-}",
    engineMethod: "Fickian Diffusion Transfer Reversal & Competitive Redox Kinetics",
    pedagogicalInsight:
      "Edwin Land's 1947 breakthrough combined negative development and positive image formation into a single 60-second in-camera diffusion process, transferring unexposed silver halide to a receiving sheet via a viscous reagent pod.",
    controls: [
      {
        id: "developmentTimeSec",
        label: "Processing Time",
        min: 0,
        max: 60,
        step: 1,
        defaultValue: 30,
        unit: "s",
      },
      {
        id: "exposureFraction",
        label: "Exposure Level",
        min: 0.0,
        max: 1.0,
        step: 0.05,
        defaultValue: 0.6,
        unit: "fraction",
      },
      {
        id: "reagentViscosityCp",
        label: "Gel Viscosity",
        min: 1000,
        max: 80000,
        step: 1000,
        defaultValue: 25000,
        unit: "cP",
      },
      {
        id: "rollerGapUm",
        label: "Roller Spread Gap",
        min: 10,
        max: 60,
        step: 2,
        defaultValue: 25,
        unit: "µm",
      },
      {
        id: "alkaliPh",
        label: "Developer pH",
        min: 10.5,
        max: 13.8,
        step: 0.1,
        defaultValue: 12.6,
        unit: "pH",
      },
    ],
    computeMetrics: (controls) => {
      const state = stepLandPolaroidInstantFilm({
        developmentTimeSec: controls.developmentTimeSec,
        exposureFraction: controls.exposureFraction,
        reagentViscosityCp: controls.reagentViscosityCp,
        rollerGapUm: controls.rollerGapUm,
        alkaliPh: controls.alkaliPh,
      });

      return [
        {
          label: "Positive Print Density",
          value: `${state.positiveSilverDensity.toFixed(2)}`,
          unit: "D",
          badgeColor: "emerald",
        },
        {
          label: "Negative Silver Density",
          value: `${state.negativeSilverDensity.toFixed(2)}`,
          unit: "D",
          badgeColor: "indigo",
        },
        {
          label: "Transfer Efficiency",
          value: `${state.transferEfficiencyPercent.toFixed(1)}`,
          unit: "%",
          badgeColor: "cyan",
        },
        {
          label: "Diffusion Flux",
          value: `${state.diffusionFluxMolPerM2S.toFixed(4)}`,
          unit: "mol/m²s",
          badgeColor: "amber",
        },
        {
          label: "Meniscus Uniformity",
          value: `${state.meniscusSpreadUniformityPercent.toFixed(1)}`,
          unit: "%",
          badgeColor: "rose",
        },
        {
          label: "Print Progress",
          value: `${state.printCompletionPercent.toFixed(0)}`,
          unit: "%",
          badgeColor: "emerald",
        },
      ];
    },
  },
  "us-3138743-kilby-integrated-circuit": {
    domain: "semiconductor_physics",
    domainTitle: "Monolithic Integrated Circuit Solid-State Electronics",
    equationName: "Semiconductor Bulk Sheet Resistance & P-N Transition Capacitance",
    governingEquation:
      "R_{\\text{bulk}} = \\frac{\\rho L}{W t} \\quad \\text{and} \\quad C_j = A \\sqrt{\\frac{q \\varepsilon_s N_d}{2 (V_{\\text{bi}} + V_R)}}",
    engineMethod: "Bulk Semiconductor Mesa Resistor & P-N Junction Depletion RC Dynamics",
    pedagogicalInsight:
      "By carving resistors out of the crystal bulk and capacitors out of reverse-biased p-n junctions, an entire electronic circuit functions without discrete components or hand-soldered wires.",
    controls: [
      {
        id: "supplyVoltageV",
        label: "Supply Voltage (+Vcc)",
        min: 1.5,
        max: 12.0,
        step: 0.5,
        defaultValue: 6.0,
        unit: "V",
      },
      {
        id: "resistorLengthUm",
        label: "Resistor Path Length",
        min: 100,
        max: 2000,
        step: 50,
        defaultValue: 500,
        unit: "µm",
      },
      {
        id: "resistorWidthUm",
        label: "Resistor Path Width",
        min: 15,
        max: 150,
        step: 5,
        defaultValue: 50,
        unit: "µm",
      },
      {
        id: "reverseBiasVoltageV",
        label: "Capacitor Reverse Bias",
        min: 0.5,
        max: 10.0,
        step: 0.5,
        defaultValue: 3.0,
        unit: "V",
      },
      {
        id: "baseDriveCurrentUa",
        label: "BJT Base Drive Current",
        min: 5,
        max: 150,
        step: 5,
        defaultValue: 40,
        unit: "µA",
      },
    ],
    computeMetrics: (controls) => {
      const state = stepKilbyIntegratedCircuit({
        substrateMaterial: "germanium",
        supplyVoltageV: controls.supplyVoltageV ?? 6.0,
        resistorLengthUm: controls.resistorLengthUm ?? 500,
        resistorWidthUm: controls.resistorWidthUm ?? 50,
        reverseBiasVoltageV: controls.reverseBiasVoltageV ?? 3.0,
        baseDriveCurrentUa: controls.baseDriveCurrentUa ?? 40,
      });

      return [
        {
          label: "Collector Load Resistor",
          value: `${state.collectorLoadResistanceOhms}`,
          unit: "Ω",
          badgeColor: "indigo",
          description:
            "Bulk semiconductor resistance calculated from aspect ratio and sheet resistivity",
        },
        {
          label: "P-N Junction Capacitance",
          value: `${state.junctionCapacitancePf}`,
          unit: "pF",
          badgeColor: "rose",
          description: "Depletion layer transition capacitance under applied reverse bias",
        },
        {
          label: "Collector Current",
          value: `${state.collectorCurrentMa}`,
          unit: "mA",
          badgeColor: "emerald",
          description: "Bipolar transistor amplified collector switching current",
        },
        {
          label: "Propagation Delay",
          value: `${state.propagationDelayNs}`,
          unit: "ns",
          badgeColor: "cyan",
          description: "Monolithic solid circuit RC switching propagation delay",
        },
        {
          label: "Phase-Shift Osc. Frequency",
          value: `${state.phaseShiftOscillatorFrequencyKhz}`,
          unit: "kHz",
          badgeColor: "amber",
          description: "Resonant sinusoidal frequency of the integrated RC feedback oscillator",
        },
        {
          label: "Packing Density",
          value: `${(state.componentDensityPerCuFt / 1e6).toFixed(1)}`,
          unit: "M parts/ft³",
          badgeColor: "amber",
          description: "Calculated volumetric component packing density",
        },
      ];
    },
  },
  "us-3728480-baer-odyssey": {
    domain: "video_electronics",
    domainTitle: "Television Gaming & Raster Coincidence",
    equationName: "NTSC Raster Timing, Monostable RC Spot Delay & Coincidence Gating",
    governingEquation:
      "\\tau_H = R_X C_H \\ln(2),\\quad \\tau_V = R_Y C_V \\ln(2),\\quad V_{\\text{hit}} = V_1(t) \\cdot V_2(t),\\quad s(t) = [A_c + m \\cdot v_{\\text{comp}}(t)] \\cos(2\\pi f_c t)",
    engineMethod: "stepBaerOdysseySi (NTSC sync synthesis, RC pulse timing, collision logic)",
    pedagogicalInsight:
      "Ralph Baer synthesizes television raster dots without a computer: astable multivibrators establish horizontal/vertical sync, variable RC delays slice position pulses through AND gates, and diode coincidence detects player-ball contact in real time.",
    controls: [
      {
        id: "player1PotX",
        label: "Player 1 Horizontal Pos",
        min: 0.05,
        max: 0.45,
        step: 0.01,
        defaultValue: 0.15,
        unit: "norm",
      },
      {
        id: "player1PotY",
        label: "Player 1 Vertical Pos",
        min: 0.05,
        max: 0.95,
        step: 0.01,
        defaultValue: 0.5,
        unit: "norm",
      },
      {
        id: "player2PotX",
        label: "Player 2 Horizontal Pos",
        min: 0.55,
        max: 0.95,
        step: 0.01,
        defaultValue: 0.85,
        unit: "norm",
      },
      {
        id: "player2PotY",
        label: "Player 2 Vertical Pos",
        min: 0.05,
        max: 0.95,
        step: 0.01,
        defaultValue: 0.5,
        unit: "norm",
      },
      {
        id: "englishControl",
        label: "English / Ball Spin",
        min: -1.0,
        max: 1.0,
        step: 0.05,
        defaultValue: 0.0,
        unit: "spin",
      },
      {
        id: "ballSpeedMultiplier",
        label: "Ball Speed Multiplier",
        min: 0.5,
        max: 2.5,
        step: 0.1,
        defaultValue: 1.0,
        unit: "x",
      },
      {
        id: "rfChannel",
        label: "VHF RF Channel",
        min: 3,
        max: 4,
        step: 1,
        defaultValue: 3,
        unit: "ch",
      },
      {
        id: "chromaPhaseDeg",
        label: "Chroma Phase Dial",
        min: 0,
        max: 180,
        step: 5,
        defaultValue: 45,
        unit: "deg",
      },
    ],
    computeMetrics(rawParams) {
      const controls = readBaerControls(rawParams as any);
      const { metrics } = stepBaerOdysseySi(INITIAL_BAER_STATE, controls, 0.016);
      return [
        {
          label: "Horizontal Sync",
          value: metrics.horizontalSyncFreqHz.toFixed(0),
          unit: "Hz",
          badgeColor: "emerald",
          description: "Astable multivibrator NTSC horizontal line frequency (15.75 kHz)",
        },
        {
          label: "Vertical Field Freq",
          value: metrics.verticalFreqHz.toFixed(1),
          unit: "Hz",
          badgeColor: "cyan",
          description: "Vertical sync oscillator field sweep rate (60 Hz)",
        },
        {
          label: "P1 Horizontal Delay",
          value: metrics.p1DelayHMicrosec.toFixed(1),
          unit: "µs",
          badgeColor: "indigo",
          description: "Monostable RC delay time controlling player 1 horizontal position",
        },
        {
          label: "P1 Vertical Delay",
          value: metrics.p1DelayVMs.toFixed(2),
          unit: "ms",
          badgeColor: "purple",
          description: "Monostable RC delay time controlling player 1 vertical position",
        },
        {
          label: "RF Carrier Freq",
          value: metrics.rfCarrierFreqMHz.toFixed(2),
          unit: "MHz",
          badgeColor: "amber",
          description: "VHF television channel RF carrier frequency modulated with composite video",
        },
        {
          label: "Antenna RF Power",
          value: metrics.rfAntennaPowerNanoWatts.toFixed(1),
          unit: "nW",
          badgeColor: "rose",
          description: "Incidental radiation power coupled to 300-ohm television antenna terminals",
        },
      ];
    },
  },
  "us-3858232-boyle-smith-ccd": {
    domain: "solid_state_optoelectronics",
    domainTitle: "Charge-Coupled Device MOS Potential Wells & Serial Charge Translation",
    equationName: "MOS Surface Potential Depletion & Charge Transfer Efficiency",
    governingEquation:
      "\\psi_s = V_G - V_{\\text{FB}} + V_0 - \\sqrt{2 (V_G - V_{\\text{FB}}) V_0 + V_0^2} \\quad \\text{and} \\quad \\text{CTE} = 1 - \\exp\\left(-\\frac{\\pi^2 D_n t_{\\text{transfer}}}{4 L_{\\text{gate}}^2}\\right)",
    engineMethod:
      "FrankenSimEngine.stepBoyleSmithCcd: MOS Gate Depletion, Photoelectron Integration, 3-Phase Clocked Potential Well Translation",
    pedagogicalInsight:
      "Clocked gate voltages create movable electrostatic potential wells in single-conductivity silicon. Photons generate electron packets that are sequentially transferred from well to well with >99.999% efficiency.",
    controls: [
      {
        id: "gateVoltageV",
        label: "Gate Clock Voltage",
        min: 5,
        max: 15,
        step: 0.5,
        defaultValue: 10,
        unit: "V",
      },
      {
        id: "clockFrequencyMhz",
        label: "3-Phase Clock Frequency",
        min: 0.5,
        max: 20,
        step: 0.5,
        defaultValue: 5.0,
        unit: "MHz",
      },
      {
        id: "incidentLux",
        label: "Incident Light Intensity",
        min: 10,
        max: 2000,
        step: 10,
        defaultValue: 250,
        unit: "lux",
      },
      {
        id: "integrationTimeMs",
        label: "Integration Exposure Time",
        min: 1.0,
        max: 100.0,
        step: 1.0,
        defaultValue: 16.7,
        unit: "ms",
      },
      {
        id: "temperatureKelvin",
        label: "Sensor Temperature",
        min: 200,
        max: 350,
        step: 5,
        defaultValue: 300,
        unit: "K",
      },
    ],
    computeMetrics: (controls: Record<string, number>) => {
      const res = stepBoyleSmithCcd({
        gateVoltageV: controls.gateVoltageV,
        clockFrequencyMhz: controls.clockFrequencyMhz,
        incidentLux: controls.incidentLux,
        integrationTimeMs: controls.integrationTimeMs,
        temperatureKelvin: controls.temperatureKelvin,
      });

      return [
        {
          label: "Surface Depletion Potential (psi_s)",
          value: res.surfacePotentialV.toFixed(2),
          unit: "V",
          badgeColor: "cyan",
          progressPct: clampProgress((res.surfacePotentialV / 15) * 100),
        },
        {
          label: "Full Well Storage Capacity",
          value: res.fullWellCapacityElectrons.toLocaleString(),
          unit: "e-",
          badgeColor: "indigo",
          progressPct: clampProgress((res.fullWellCapacityElectrons / 300000) * 100),
        },
        {
          label: "Stored Photoelectron Packet",
          value: res.totalCollectedElectrons.toLocaleString(),
          unit: "e-",
          badgeColor: res.totalCollectedElectrons > 0 ? "emerald" : "indigo",
          progressPct: clampProgress(res.wellFillPercentage),
        },
        {
          label: "Well Fill Factor",
          value: `${res.wellFillPercentage.toFixed(1)}%`,
          unit: "",
          badgeColor: res.isSaturated ? "rose" : "emerald",
          progressPct: clampProgress(res.wellFillPercentage),
        },
        {
          label: "Charge Transfer Efficiency (CTE)",
          value: `${res.ctePct.toFixed(4)}%`,
          unit: "",
          badgeColor: res.ctePct > 99.99 ? "emerald" : "amber",
          progressPct: clampProgress(res.ctePct),
        },
        {
          label: "Signal-to-Noise Ratio (SNR)",
          value: res.snrDb.toFixed(1),
          unit: "dB",
          badgeColor: res.snrDb > 20 ? "emerald" : "amber",
          progressPct: clampProgress((res.snrDb / 60) * 100),
        },
        {
          label: "Thermal Dark Electrons",
          value: res.darkElectrons.toLocaleString(),
          unit: "e-",
          badgeColor: "amber",
          progressPct: clampProgress((res.darkElectrons / 5000) * 100),
        },
        {
          label: "Depletion Depth",
          value: res.depletionDepthUm.toFixed(2),
          unit: "um",
          badgeColor: "cyan",
          progressPct: clampProgress((res.depletionDepthUm / 10) * 100),
        },
      ];
    },
  },
  "us-4063220-metcalfe-ethernet": {
    domain: "networking_electrodynamics",
    domainTitle: "Ethernet Coaxial CSMA/CD & Binary Exponential Backoff",
    equationName:
      "Electromagnetic Wave Propagation, CSMA/CD Channel Efficiency & Exponential Backoff Delay",
    governingEquation:
      "v = \\frac{c}{\\sqrt{\\epsilon_r}},\\quad T_{\\text{slot}} = \\frac{2L}{v} + 2 t_{\\text{tx}},\\quad \\eta = \\frac{1}{1 + 2 a e G},\\quad T_{\\text{backoff}} = r \\cdot T_{\\text{slot}},\\quad r \\in [0, 2^{\\min(n, 10)} - 1]",
    engineMethod:
      "stepMetcalfeEthernetSi (coaxial wave delay, analog collision voltage, BEB timer)",
    pedagogicalInsight:
      "Ethernet treats the shared coaxial cable as an ether: transceivers sense carrier before sending, compare transmitted vs received voltage instantaneously via XOR gates to detect collisions during transmission, and execute truncated binary exponential backoff to dynamically stabilize network contention.",
    controls: [
      {
        id: "cableLengthMeters",
        label: "Coaxial Cable Length",
        min: 10,
        max: 1000,
        step: 10,
        defaultValue: 500,
        unit: "m",
      },
      {
        id: "dataRateMbps",
        label: "Data Transmission Rate",
        min: 1.0,
        max: 10.0,
        step: 0.1,
        defaultValue: 2.94,
        unit: "Mbps",
      },
      {
        id: "stationCount",
        label: "Active Contending Stations",
        min: 2,
        max: 32,
        step: 1,
        defaultValue: 8,
        unit: "nodes",
      },
      {
        id: "offeredLoad",
        label: "Offered Traffic Load (G)",
        min: 0.05,
        max: 2.5,
        step: 0.05,
        defaultValue: 0.6,
        unit: "norm",
      },
      {
        id: "packetSizeBytes",
        label: "Packet Frame Size",
        min: 64,
        max: 1518,
        step: 32,
        defaultValue: 256,
        unit: "bytes",
      },
      {
        id: "triggerCollision",
        label: "Simulate Packet Collision",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        unit: "flag",
      },
    ],
    computeMetrics: (controls: Record<string, number>) => {
      const parsedControls = readEthernetControls(controls as any);
      const { metrics } = stepMetcalfeEthernetSi(INITIAL_ETHERNET_STATE, parsedControls, 0.016);

      return [
        {
          label: "Electromagnetic Wave Speed",
          value: (metrics.propVelocityMps / 1e6).toFixed(1),
          unit: "×10⁶ m/s",
          badgeColor: "cyan",
          description: "Wave velocity in polyethylene dielectric coax (0.66c)",
        },
        {
          label: "One-Way Cable Delay",
          value: metrics.oneWayPropDelayNs.toFixed(1),
          unit: "ns",
          badgeColor: "indigo",
          description: "End-to-end signal propagation latency along coaxial bus",
        },
        {
          label: "Collision Slot Time",
          value: metrics.slotTimeMicrosec.toFixed(2),
          unit: "µs",
          badgeColor: "purple",
          description: "Round-trip collision detection window (2τ + 2t_tx)",
        },
        {
          label: "Manchester Bit Period",
          value: metrics.bitPeriodNs.toFixed(1),
          unit: "ns",
          badgeColor: "amber",
          description: "Clock period for self-clocking phase transitions",
        },
        {
          label: "Bus Analog Voltage",
          value: metrics.busVoltageVolts.toFixed(2),
          unit: "V",
          badgeColor: metrics.collisionDetected ? "rose" : "emerald",
          description: "Analog superposition voltage (normal -1.0V, collision -2.0V)",
        },
        {
          label: "Channel Utilization Efficiency",
          value: `${metrics.channelEfficiencyPct.toFixed(1)}%`,
          unit: "",
          badgeColor: metrics.channelEfficiencyPct > 50 ? "emerald" : "amber",
          description: "CSMA/CD protocol transmission efficiency",
        },
        {
          label: "Useful Data Throughput",
          value: metrics.throughputMbps.toFixed(2),
          unit: "Mbps",
          badgeColor: "emerald",
          description: "Actual delivered bandwidth after backoff and contention",
        },
        {
          label: "Terminator Power Dissipation",
          value: metrics.terminatorDissipationMw.toFixed(1),
          unit: "mW",
          badgeColor: "rose",
          description: "Thermal dissipation in 50-ohm end termination resistors",
        },
      ];
    },
  },
  "us-2318259-sikorsky-helicopter": {
    domain: "rotary_wing_aerodynamics",
    domainTitle: "Direct-Lift Helicopter Aerodynamics & Anti-Torque Equilibrium",
    equationName:
      "Rankine-Froude Momentum Thrust, Torque Balance & Collective-Throttle Correlation",
    governingEquation:
      "T_{\\text{main}} = C_T \\rho A (\\Omega R)^2,\\quad v_i = \\sqrt{\\frac{T}{2\\rho A}},\\quad Q_{\\text{main}} = \\frac{T v_i + P_{\\text{profile}}}{\\Omega},\\quad M_{\\text{yaw}} = Q_{\\text{main}} - T_{\\text{tail}} L_{\\text{boom}}",
    engineMethod:
      "stepSikorskyHelicopterSi (blade element aerodynamics, swashplate feathering, tail anti-torque equilibrium)",
    pedagogicalInsight:
      "A helicopter's overhead main rotor produces vertical lift and horizontal propulsion via cyclic blade pitch tilting, while generating a strong reactive torque that would spin the fuselage. The vertical tail rotor generates an opposing lateral thrust moment that precisely counterbalances main rotor torque and provides directional yaw maneuvering.",
    controls: [
      {
        id: "collectivePitchDeg",
        label: "Collective Blade Pitch",
        min: 2.0,
        max: 16.0,
        step: 0.5,
        defaultValue: 9.5,
        unit: "deg",
      },
      {
        id: "cyclicPitchForwardDeg",
        label: "Longitudinal Cyclic Stick (Pitch)",
        min: -10.0,
        max: 10.0,
        step: 0.5,
        defaultValue: 0.0,
        unit: "deg",
      },
      {
        id: "cyclicRollRightDeg",
        label: "Lateral Cyclic Stick (Roll)",
        min: -10.0,
        max: 10.0,
        step: 0.5,
        defaultValue: 0.0,
        unit: "deg",
      },
      {
        id: "tailRotorPedalPercent",
        label: "Anti-Torque Rudder Pedals",
        min: -100.0,
        max: 100.0,
        step: 5.0,
        defaultValue: 0.0,
        unit: "%",
      },
      {
        id: "engineThrottlePercent",
        label: "Engine Throttle Setting",
        min: 0.0,
        max: 100.0,
        step: 1.0,
        defaultValue: 85.0,
        unit: "%",
      },
      {
        id: "engineRunning",
        label: "Engine Ignition / Drive State",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "flag",
      },
    ],
    computeMetrics: (controls: Record<string, number>) => {
      const parsedControls = readSikorskyControls(controls as any);
      const { metrics } = stepSikorskyHelicopterSi(INITIAL_SIKORSKY_STATE, parsedControls, 0.016);

      return [
        {
          label: "Main Rotor Thrust",
          value: metrics.mainRotorThrustNewtons.toFixed(1),
          unit: "N",
          badgeColor: "emerald",
          description: "Total aerodynamic vertical lift generated by main rotor blades",
        },
        {
          label: "Main Rotor Torque Reaction",
          value: metrics.mainRotorTorqueNm.toFixed(1),
          unit: "N·m",
          badgeColor: "amber",
          description: "Newtonian aerodynamic torque reaction acting on fuselage",
        },
        {
          label: "Tail Rotor Anti-Torque Thrust",
          value: metrics.tailRotorThrustNewtons.toFixed(1),
          unit: "N",
          badgeColor: "cyan",
          description: "Lateral thrust force generated by vertical tail rotor",
        },
        {
          label: "Net Unbalanced Yaw Moment",
          value: metrics.netYawMomentNm.toFixed(1),
          unit: "N·m",
          badgeColor: Math.abs(metrics.netYawMomentNm) < 20 ? "emerald" : "rose",
          description: "Residual yaw torque driving fuselage angular acceleration",
        },
        {
          label: "Blade Tip Speed",
          value: metrics.tipSpeedMs.toFixed(1),
          unit: "m/s",
          badgeColor: "indigo",
          description: "Linear velocity at main blade tips (Mach number)",
        },
        {
          label: "Main Rotor Power",
          value: (metrics.mainRotorPowerWatts / 1000.0).toFixed(1),
          unit: "kW",
          badgeColor: "purple",
          description: "Total aerodynamic shaft power required for hover",
        },
        {
          label: "Induced Downwash Velocity",
          value: metrics.inducedVelocityMs.toFixed(2),
          unit: "m/s",
          badgeColor: "indigo",
          description: "Rankine-Froude momentum downwash through rotor disk",
        },
        {
          label: "Correlated Engine Throttle",
          value: metrics.effectiveThrottlePercent.toFixed(1),
          unit: "%",
          badgeColor: "emerald",
          description: "Mechanical linkage automatic throttle compensation",
        },
      ];
    },
  },
  "us-3353115-maiman-ruby-laser": {
    domain: "quantum_optics",
    domainTitle: "Solid-State Three-Level Laser & Optical Pumping Kinetics",
    equationName: "Three-Level Rate Equations & Fabry-Pérot Threshold Inversion",
    governingEquation:
      "Delta N_{\\text{th}} = \frac{1}{\\sigma_{21} L} left[ alpha L + \frac{1}{2} lnleft(\frac{1}{R_1 R_2}\right) \right] quad \text{and} quad P_{\\text{peak}} = eta_{\\text{slope}} \frac{E_{\\text{pump}} - E_{\\text{th}}}{\\tau_{\\text{pulse}}}",
    engineMethod:
      "Xenon Flash Optical Pumping, Metastable Phonon Relaxation & Coherent Resonator Feedback",
    pedagogicalInsight:
      "High-power pulsed xenon flash discharge excites ground-state chromium ions into broad green/violet pump bands, which decay non-radiatively in picoseconds to the metastable 2E state, establishing population inversion and 694.3 nm stimulated emission.",
    controls: [
      {
        id: "pumpEnergyJoules",
        label: "Flash Pump Energy",
        min: 50,
        max: 500,
        step: 10,
        defaultValue: 150,
        unit: "J",
      },
      {
        id: "flashDurationMs",
        label: "Flash Pulse Duration",
        min: 0.5,
        max: 3.0,
        step: 0.1,
        defaultValue: 1.0,
        unit: "ms",
      },
      {
        id: "rodLengthCm",
        label: "Ruby Rod Length",
        min: 2.0,
        max: 10.0,
        step: 0.5,
        defaultValue: 5.0,
        unit: "cm",
      },
      {
        id: "outputMirrorReflectivity",
        label: "Output Mirror Reflectivity",
        min: 0.7,
        max: 0.98,
        step: 0.01,
        defaultValue: 0.92,
        unit: "R",
      },
      {
        id: "crystalTemperatureKelvin",
        label: "Crystal Temperature",
        min: 100,
        max: 350,
        step: 10,
        defaultValue: 300,
        unit: "K",
      },
    ],
    computeMetrics: (controls: Record<string, number>) => {
      const res = stepMaimanRubyLaser({
        pumpEnergyJoules: controls.pumpEnergyJoules,
        flashDurationMs: controls.flashDurationMs,
        rodLengthCm: controls.rodLengthCm,
        outputMirrorReflectivity: controls.outputMirrorReflectivity,
        crystalTemperatureKelvin: controls.crystalTemperatureKelvin,
      });

      return [
        {
          label: "Lasing Status",
          value: res.isLasing
            ? "ACTIVE (STIMULATED EMISSION)"
            : "BELOW THRESHOLD (FLUORESCENCE ONLY)",
          unit: "",
          badgeColor: res.isLasing ? "rose" : "amber",
          progressPct: res.isLasing ? 100 : 30,
        },
        {
          label: "Population Inversion (N2/N1)",
          value: res.populationInversionRatio.toFixed(2),
          unit: "ratio",
          badgeColor: res.populationInversionRatio > 1.0 ? "rose" : "amber",
          progressPct: clampProgress((res.populationInversionRatio / 2.5) * 100),
        },
        {
          label: "Threshold Pump Energy",
          value: res.thresholdPumpEnergyJoules.toFixed(1),
          unit: "J",
          badgeColor: "cyan",
          progressPct: clampProgress((res.thresholdPumpEnergyJoules / 2000) * 100),
        },
        {
          label: "Laser Output Pulse Energy",
          value: res.laserPulseEnergyJoules.toFixed(3),
          unit: "J",
          badgeColor: res.laserPulseEnergyJoules > 0 ? "emerald" : "indigo",
          progressPct: clampProgress((res.laserPulseEnergyJoules / 5.0) * 100),
        },
        {
          label: "Peak Optical Power",
          value: res.laserPeakPowerKw.toFixed(2),
          unit: "kW",
          badgeColor: res.laserPeakPowerKw > 0 ? "rose" : "indigo",
          progressPct: clampProgress((res.laserPeakPowerKw / 100) * 100),
        },
        {
          label: "Net Round-Trip Gain",
          value: res.netRoundTripGainDb.toFixed(2),
          unit: "dB",
          badgeColor: "indigo",
          progressPct: clampProgress(((res.netRoundTripGainDb + 5) / 15) * 100),
        },
        {
          label: "Emission Wavelength (R1)",
          value: res.emissionWavelengthNm.toFixed(2),
          unit: "nm",
          badgeColor: "rose",
          progressPct: 100,
        },
        {
          label: "Longitudinal Mode Spacing",
          value: res.modeSpacingGhz.toFixed(2),
          unit: "GHz",
          badgeColor: "cyan",
          progressPct: clampProgress((res.modeSpacingGhz / 5.0) * 100),
        },
      ];
    },
  },
  "us-2929922-townes-laser": {
    domain: "quantum_optics",
    domainTitle: "Stimulated Emission & Fabry-Pérot Open Resonator Lasers",
    equationName: "Schawlow-Townes Threshold Gain & Einstein Rate Equations",
    governingEquation:
      "g_{\\text{th}} = \\alpha + \\frac{1}{2L} \\ln\\left(\\frac{1}{R_1 R_2}\\right) \\quad \\text{and} \\quad P_{\\text{out}} = \\eta (P_p - P_{\\text{th}})",
    engineMethod: "Optical Pumping Population Inversion & Fabry-Pérot Standing-Wave Mode Feedback",
    pedagogicalInsight:
      "Opening the sides of the cavity eliminates chaotic off-axis modes via diffraction loss, allowing only axial plane waves to build up into a pure, phase-locked coherent laser beam.",
    controls: [
      {
        id: "pumpPowerWatts",
        label: "Optical Pump Power",
        min: 50,
        max: 1000,
        step: 25,
        defaultValue: 350,
        unit: "W",
      },
      {
        id: "cavityLengthCm",
        label: "Resonator Cavity Length",
        min: 5,
        max: 100,
        step: 5,
        defaultValue: 25,
        unit: "cm",
      },
      {
        id: "mirror2ReflectivityPct",
        label: "Output Mirror Reflectivity",
        min: 80,
        max: 99.5,
        step: 0.5,
        defaultValue: 94,
        unit: "%",
      },
      {
        id: "beamDiameterMm",
        label: "Aperture Diameter",
        min: 2,
        max: 25,
        step: 1,
        defaultValue: 8,
        unit: "mm",
      },
    ],
    computeMetrics: (params) => {
      const res = stepTownesLaser({
        pumpPowerWatts: params.pumpPowerWatts ?? 350,
        cavityLengthCm: params.cavityLengthCm ?? 25,
        mirror2ReflectivityPct: params.mirror2ReflectivityPct ?? 94,
        beamDiameterMm: params.beamDiameterMm ?? 8,
      });

      return [
        {
          label: "Laser Output Power",
          value: `${res.laserOutputPowerWatts} W`,
          unit: "W",
          badgeColor: "cyan",
          primary: true,
        },
        {
          label: "Threshold Gain",
          value: `${res.thresholdGainPerCm} cm⁻¹`,
          unit: "cm⁻¹",
          badgeColor: "emerald",
          primary: true,
        },
        {
          label: "Intracavity Power",
          value: `${res.intraCavityPowerWatts} W`,
          unit: "W",
          badgeColor: "amber",
        },
        {
          label: "Beam Divergence",
          value: `${res.beamDivergenceMrad} mrad`,
          unit: "mrad",
          badgeColor: "purple",
        },
        {
          label: "Fresnel Number",
          value: `${res.fresnelNumber}`,
          unit: "",
          badgeColor: "rose",
        },
      ];
    },
  },

  "us-2297691-carlson-electrophotography": {
    domain: "semiconductor",
    domainTitle: "Photoconductive Latent Imaging & Electrostatic Xerography",
    equationName: "Photo-Induced Discharge & Triboelectric Coulomb Adhesion",
    governingEquation:
      "V(t) = V_0 \\exp\\left(-\\frac{\\sigma t}{\\epsilon_0 \\epsilon_r}\\right) \\quad \\text{and} \\quad F_e = \\frac{q_{\\text{toner}} \\sigma_s}{\\epsilon_0 \\epsilon_r}",
    engineMethod: "Corona Townsend Avalanche Charging & Photoconductive Carrier Drift Discharge",
    pedagogicalInsight:
      "Photons excite electron-hole pairs across the selenium bandgap, rapidly discharging illuminated areas while dark areas retain hundreds of volts to electrostatically pull dry resin powder onto the drum.",
    controls: [
      {
        id: "coronaVoltageKv",
        label: "Corona Grid Voltage",
        min: 4.0,
        max: 8.0,
        step: 0.25,
        defaultValue: 6.5,
        unit: "kV",
      },
      {
        id: "exposureLuxSec",
        label: "Optical Exposure",
        min: 0,
        max: 30,
        step: 1,
        defaultValue: 12,
        unit: "lx·s",
      },
      {
        id: "layerThicknessUm",
        label: "Photoreceptor Thickness",
        min: 10,
        max: 60,
        step: 5,
        defaultValue: 30,
        unit: "µm",
      },
      {
        id: "fuserTemperatureC",
        label: "Fuser Roll Temperature",
        min: 120,
        max: 220,
        step: 5,
        defaultValue: 185,
        unit: "°C",
      },
    ],
    computeMetrics: (params) => {
      const res = stepCarlsonElectrophotography({
        coronaVoltageKv: params.coronaVoltageKv ?? 6.5,
        exposureLuxSec: params.exposureLuxSec ?? 12,
        layerThicknessUm: params.layerThicknessUm ?? 30,
        fuserTemperatureC: params.fuserTemperatureC ?? 185,
      });

      return [
        {
          label: "Surface Contrast Potential",
          value: `${res.contrastPotentialV} V`,
          unit: "V",
          badgeColor: "emerald",
          primary: true,
        },
        {
          label: "Developed Optical Density",
          value: `${res.opticalDensity} OD`,
          unit: "OD",
          badgeColor: "cyan",
          primary: true,
        },
        {
          label: "Initial Surface Charge",
          value: `+${res.initialSurfacePotentialV} V`,
          unit: "V",
          badgeColor: "amber",
        },
        {
          label: "Toner Mass Density",
          value: `${res.tonerMassDensityMgPerCm2} mg/cm²`,
          unit: "mg/cm²",
          badgeColor: "purple",
        },
        {
          label: "Thermal Fusing Quality",
          value: `${res.fuserBondQualityPct}%`,
          unit: "%",
          badgeColor: "rose",
        },
      ];
    },
  },

  "us-682690-hewitt-mercury-lamp": {
    domain: "plasma_optics",
    domainTitle: "Mercury-Vapor Arc Discharge & Cathode-Spot Plasma",
    equationName: "Townsend Avalanche & Positive Column Field Gradient",
    governingEquation:
      "E_z = \\frac{C}{R} \\left(\\frac{p}{I}\\right)^n \\quad \\text{and} \\quad \\eta = \\frac{\\Phi_v}{P_e}",
    engineMethod: "Cathode-Spot Electron Emission & Nottingham Negative Resistance Arc Dynamics",
    pedagogicalInsight:
      "Unlike incandescent filaments that waste 95% of energy as infrared heat, the low-pressure mercury arc emits directly in discrete spectral lines, achieving unprecedented luminous efficacy above 70 lm/W.",
    controls: [
      {
        id: "mainsVoltageV",
        label: "DC Supply Voltage",
        min: 60,
        max: 200,
        step: 5,
        defaultValue: 110,
        unit: "V",
      },
      {
        id: "ballastResistanceOhms",
        label: "Series Ballast Resistance",
        min: 5,
        max: 50,
        step: 1,
        defaultValue: 12,
        unit: "Ω",
      },
      {
        id: "tubeLengthCm",
        label: "Arc Tube Length",
        min: 30,
        max: 150,
        step: 5,
        defaultValue: 100,
        unit: "cm",
      },
      {
        id: "tubeDiameterMm",
        label: "Tube Diameter",
        min: 15,
        max: 50,
        step: 5,
        defaultValue: 25,
        unit: "mm",
      },
    ],
    computeMetrics: (params) => {
      const res = stepHewittMercuryLamp({
        mainsVoltageV: params.mainsVoltageV ?? 110,
        ballastResistanceOhms: params.ballastResistanceOhms ?? 12,
        tubeLengthCm: params.tubeLengthCm ?? 100,
        tubeDiameterMm: params.tubeDiameterMm ?? 25,
      });

      return [
        {
          label: "Arc Current",
          value: `${res.arcCurrentAmperes} A`,
          unit: "A",
          badgeColor: "cyan",
          primary: true,
        },
        {
          label: "Luminous Efficacy",
          value: `${res.luminousEfficacyLmPerWatt} lm/W`,
          unit: "lm/W",
          badgeColor: "emerald",
          primary: true,
        },
        {
          label: "Arc Tube Voltage",
          value: `${res.arcOperatingVoltageV} V`,
          unit: "V",
          badgeColor: "amber",
        },
        {
          label: "Vapor Pressure",
          value: `${res.mercuryVaporPressureMmHg} mmHg`,
          unit: "mmHg",
          badgeColor: "purple",
        },
        {
          label: "Total Luminous Flux",
          value: `${res.luminousFluxLumens} lm`,
          unit: "lm",
          badgeColor: "cyan",
        },
      ];
    },
  },

  "us-706737-fessenden-wireless": {
    domain: "electromagnetics",
    domainTitle: "Continuous-Wave Wireless Telegraphy & Barretter Detection",
    equationName: "Continuous-Wave Modulation & Electrolytic Demodulation",
    governingEquation:
      "P_{\\text{rad}} = 80 \\pi^2 \\left(\\frac{h_{\\text{eff}}}{\\lambda}\\right)^2 I_0^2 \\quad \\text{and} \\quad \\Delta R = \\frac{\\alpha P_{\\text{rf}}}{G_{\\text{th}}}",
    engineMethod: "Continuous High-Frequency Alternator & Liquid Barretter RF Demodulator",
    pedagogicalInsight:
      "By replacing spark gaps with pure sinusoidal continuous waves, Fessenden enabled sharp frequency tuning and continuous voice/audio modulation without acoustic spark hiss.",
    controls: [
      {
        id: "carrierFrequencyKhz",
        label: "Carrier Frequency",
        min: 20,
        max: 150,
        step: 5,
        defaultValue: 75,
        unit: "kHz",
      },
      {
        id: "audioModulationPct",
        label: "Audio Modulation",
        min: 10,
        max: 100,
        step: 5,
        defaultValue: 65,
        unit: "%",
      },
      {
        id: "antennaTuningUh",
        label: "Antenna Tuning Inductance",
        min: 100,
        max: 1000,
        step: 25,
        defaultValue: 450,
        unit: "µH",
      },
      {
        id: "transmissionDistanceKm",
        label: "Transmission Distance",
        min: 5,
        max: 100,
        step: 5,
        defaultValue: 25,
        unit: "km",
      },
    ],
    computeMetrics: (params) => {
      const res = stepFessendenWireless({
        carrierFrequencyKhz: params.carrierFrequencyKhz ?? 75,
        audioModulationPct: params.audioModulationPct ?? 65,
        antennaTuningUh: params.antennaTuningUh ?? 450,
        transmissionDistanceKm: params.transmissionDistanceKm ?? 25,
      });

      return [
        {
          label: "Radiated RF Power",
          value: `${res.radiatedPowerWatts} W`,
          unit: "W",
          badgeColor: "cyan",
          primary: true,
        },
        {
          label: "Audio Signal Current",
          value: `${res.audioSignalCurrentMicroamps} µA`,
          unit: "µA",
          badgeColor: "emerald",
          primary: true,
        },
        {
          label: "Radiation Resistance",
          value: `${res.radiationResistanceOhms} Ω`,
          unit: "Ω",
          badgeColor: "amber",
        },
        {
          label: "Signal-to-Noise Ratio",
          value: `${res.audioSnrDb} dB`,
          unit: "dB",
          badgeColor: "purple",
        },
      ];
    },
  },

  "us-879532-de-forest-audion": {
    domain: "electromagnetism",
    domainTitle: "Thermionic Triode Vacuum Tube & Electrostatic Grid Control",
    equationName: "Child-Langmuir Triode Equation & Transconductance",
    governingEquation:
      "I_p = G \\left(V_g + \\frac{V_p}{\\mu}\\right)^{3/2} \\quad \\text{and} \\quad A_v = \\frac{\\mu R_L}{r_p + R_L}",
    engineMethod:
      "Richardson-Dushman Thermionic Emission & Child-Langmuir Space-Charge Triode Load Line",
    pedagogicalInsight:
      "US 879,532 claims the physical placement of an interposed grid-shaped member between a heated filament and plate to increase oscillation detector sensitiveness; numerical tube parameters (μ = 12, Child-Langmuir currents) are modern illustrative vacuum tube values.",
    controls: [
      {
        id: "plateVoltageV",
        label: "B-Battery Plate Voltage",
        min: 10,
        max: 120,
        step: 5,
        defaultValue: 45,
        unit: "V",
        provenance: "scenario-modern",
      },
      {
        id: "gridBiasVoltageV",
        label: "Grid Bias Voltage",
        min: -6.0,
        max: 2.0,
        step: 0.25,
        defaultValue: -1.5,
        unit: "V",
        provenance: "scenario-modern",
      },
      {
        id: "filamentCurrentA",
        label: "Filament Heating Current",
        min: 0.5,
        max: 1.5,
        step: 0.1,
        defaultValue: 1.0,
        unit: "A",
        provenance: "scenario-modern",
      },
      {
        id: "gridSignalAmplitudeMv",
        label: "Input RF Signal",
        min: 10,
        max: 200,
        step: 5,
        defaultValue: 50,
        unit: "mV",
        provenance: "scenario-modern",
      },
      {
        id: "loadResistanceKOhms",
        label: "Plate Load Resistance",
        min: 5,
        max: 50,
        step: 5,
        defaultValue: 20,
        unit: "kΩ",
        provenance: "scenario-modern",
      },
    ],
    computeMetrics: (params) => {
      const res = stepDeForestAudion({
        plateVoltageV: params.plateVoltageV ?? 45,
        gridBiasVoltageV: params.gridBiasVoltageV ?? -1.5,
        filamentCurrentA: params.filamentCurrentA ?? 1.0,
        gridSignalAmplitudeMv: params.gridSignalAmplitudeMv ?? 50,
        loadResistanceKOhms: params.loadResistanceKOhms ?? 20,
      });

      return [
        {
          label: "Detector Configuration",
          value: "INTERPOSED GRID MEMBER a",
          badgeColor: "emerald",
          unit: "topology",
          primary: true,
          provenance: "source-disclosed",
        },
        {
          label: "Illustrative Voltage Gain",
          value: `${res.voltageGain}x`,
          badgeColor: "emerald",
          unit: "x",
          provenance: "scenario-modern",
        },
        {
          label: "Illustrative Output Signal",
          value: `${res.outputSignalMv} mV`,
          badgeColor: "cyan",
          unit: "mV",
          provenance: "scenario-modern",
        },
        {
          label: "Illustrative Plate Current",
          value: `${res.plateCurrentMa} mA`,
          badgeColor: "amber",
          unit: "mA",
          provenance: "scenario-modern",
        },
        {
          label: "Illustrative Transconductance",
          value: `${res.dynamicTransconductanceMicromhos} µmhos`,
          badgeColor: "purple",
          unit: "µmhos",
          provenance: "scenario-modern",
        },
        {
          label: "Illustrative Power Gain",
          value: `${res.powerGainDb} dB`,
          badgeColor: "rose",
          unit: "dB",
          provenance: "scenario-modern",
        },
      ];
    },
  },

  "us-942699-baekeland-bakelite": {
    domain: "thermodynamics",
    domainTitle: "Phenolic Polycondensation Kinetics & Autoclave Polymerization",
    equationName: "Arrhenius Gelation & Crosslink Density Kinetics",
    governingEquation:
      "k = A \\exp\\left(-\\frac{E_a}{R T}\\right) \\quad \\text{and} \\quad \\sigma_t = \\sigma_0 \\cdot \\rho_x^{1/2}",
    engineMethod: "Bakelizer High-Pressure Condensation & Three-Dimensional Resite Crosslinking",
    pedagogicalInsight:
      "By applying 100+ psi pneumatic counter-pressure inside the Bakelizer autoclave, Baekeland prevented volatile reaction water and formaldehyde from boiling into foam, curing the first fully synthetic thermosetting resin.",
    controls: [
      {
        id: "curingTempC",
        label: "Autoclave Temperature",
        min: 100,
        max: 200,
        step: 5,
        defaultValue: 150,
        unit: "°C",
      },
      {
        id: "autoclavePressurePsi",
        label: "Autoclave Pressure",
        min: 20,
        max: 200,
        step: 5,
        defaultValue: 100,
        unit: "psi",
      },
      {
        id: "catalystPct",
        label: "Base Catalyst",
        min: 0.5,
        max: 5.0,
        step: 0.5,
        defaultValue: 2.0,
        unit: "%",
      },
      {
        id: "curingTimeMin",
        label: "Cure Duration",
        min: 10,
        max: 120,
        step: 5,
        defaultValue: 45,
        unit: "min",
      },
    ],
    computeMetrics: (params) => {
      const res = stepBaekelandBakelite(
        params.curingTempC ?? 150,
        params.autoclavePressurePsi ?? 100,
        params.catalystPct ?? 2.0,
        params.curingTimeMin ?? 45,
      );

      return [
        {
          label: "Polymer State",
          value: res.resinStage,
          unit: "",
          badgeColor: "emerald",
          primary: true,
        },
        {
          label: "Crosslink Conversion",
          value: `${Math.round(res.conversionP * 100)}%`,
          unit: "%",
          badgeColor: "cyan",
          primary: true,
        },
        {
          label: "Tensile Strength",
          value: `${res.tensileStrengthMpa} MPa`,
          unit: "MPa",
          badgeColor: "amber",
        },
        {
          label: "Dielectric Strength",
          value: `${res.dielectricBreakdownKvPerMm} kV/mm`,
          unit: "kV/mm",
          badgeColor: "purple",
        },
      ];
    },
  },

  "us-971501-haber-ammonia": {
    domain: "thermodynamics",
    domainTitle: "High-Pressure Catalytic Ammonia Synthesis & Chemical Equilibrium",
    equationName: "Haber Equilibrium Constant & Le Chatelier Conversion",
    governingEquation:
      "K_p(T) = \\frac{P_{\\text{NH}_3}^2}{P_{\\text{N}_2} \\cdot P_{\\text{H}_2}^3} \\quad \\text{and} \\quad \\Delta H_{298} = -92.4 \\text{ kJ/mol}",
    engineMethod: "Le Chatelier High-Pressure Equilibrium & Catalytic Chemical Kinetics",
    pedagogicalInsight:
      "Operating at 175 atmospheres and ~550°C (the example reported in US 971,501) balances high-pressure equilibrium yield with catalytic reaction kinetics.",
    controls: [
      {
        id: "pressureAtm",
        label: "Reactor Pressure",
        min: 50,
        max: 300,
        step: 10,
        defaultValue: 175,
        unit: "atm",
        provenance: "scenario-reader",
      },
      {
        id: "temperatureCelsius",
        label: "Bed Temperature",
        min: 350,
        max: 650,
        step: 10,
        defaultValue: 530,
        unit: "°C",
        provenance: "scenario-reader",
      },
      {
        id: "feedFlowRateMolesPerSec",
        label: "Feed Gas Flow",
        min: 10,
        max: 150,
        step: 5,
        defaultValue: 50,
        unit: "mol/s",
        provenance: "scenario-reader",
      },
      {
        id: "catalystActivity",
        label: "Catalyst Activity",
        min: 0.5,
        max: 2.0,
        step: 0.1,
        defaultValue: 1.0,
        unit: "x",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics: (params) => {
      const res = stepHaberAmmonia({
        pressureAtm: params.pressureAtm ?? 175,
        temperatureCelsius: params.temperatureCelsius ?? 530,
        feedFlowRateMolesPerSec: params.feedFlowRateMolesPerSec ?? 50,
        catalystActivity: params.catalystActivity ?? 1.0,
      });

      return [
        {
          label: "Ammonia Conversion Yield",
          value: `${res.ammoniaYieldPct}%`,
          unit: "%",
          badgeColor: "emerald",
          primary: true,
          provenance: "scenario-modern",
        },
        {
          label: "Hourly Production Rate",
          value: `${res.ammoniaProductionKgPerHour} kg/h`,
          unit: "kg/h",
          badgeColor: "cyan",
          primary: true,
          provenance: "scenario-modern",
        },
        {
          label: "Equilibrium Conversion",
          value: `${res.equilibriumAmmoniaPct}%`,
          unit: "%",
          badgeColor: "amber",
          provenance: "scenario-modern",
        },
        {
          label: "Reaction Heat Generated",
          value: `${res.reactionHeatGeneratedKw} kW`,
          unit: "kW",
          badgeColor: "purple",
          provenance: "scenario-modern",
        },
      ];
    },
  },

  "us-821393-wright-flyer": {
    domain: "aerodynamics_mbd",
    domainTitle: "6-DoF Aerodynamics & Lie-Group Multibody Dynamics",
    equationName: "Prandtl Induced Drag & Wing Warping Differential",
    governingEquation:
      "C_{D_i} = \\frac{C_L^2}{\\pi \\cdot \\text{AR} \\cdot e} \\quad \\text{and} \\quad \\Delta L = \\frac{1}{2} \\rho v^2 S \\cdot \\Delta C_L",
    engineMethod: "FrankenSimEngine.stepWrightFlyer",
    controls: [
      {
        id: "airspeed",
        label: "Gross Airspeed",
        min: 15,
        max: 45,
        step: 0.5,
        defaultValue: 28,
        unit: "mph",
      },
      {
        id: "wingWarp",
        label: "Wing Warp Deflection",
        min: -15,
        max: 15,
        step: 0.5,
        defaultValue: 0,
        unit: "°",
      },
      {
        id: "rudder",
        label: "Rudder Deflection",
        min: -25,
        max: 25,
        step: 0.5,
        defaultValue: 0,
        unit: "°",
      },
      {
        id: "elevator",
        label: "Canard Elevator",
        min: -15,
        max: 15,
        step: 0.5,
        defaultValue: 0,
        unit: "°",
      },
      {
        id: "coupled",
        label: "Claim 18 rudder linkage",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "",
      },
    ],
    computeMetrics: (p) => {
      const si = stepWrightFlyerSi(readWrightControls(p));
      return [
        {
          label: "Gross Lift",
          value: Math.round(si.liftNewtons).toLocaleString(),
          unit: "N",
          badgeColor: "emerald",
          progressPct: Math.min(100, (si.liftNewtons / 2500) * 100),
        },
        {
          label: "Induced Drag",
          value: si.inducedDragNewtons.toFixed(1),
          unit: "N",
          badgeColor: "amber",
          progressPct: Math.min(100, (si.inducedDragNewtons / 150) * 100),
        },
        {
          label: "Lift-to-Drag (L/D)",
          value: si.liftToDrag.toFixed(2),
          unit: "ratio",
          badgeColor: "indigo",
          progressPct: Math.min(100, (si.liftToDrag / 10) * 100),
        },
        {
          label: "Net Yaw",
          value: si.netYawNm >= 0 ? `+${si.netYawNm.toFixed(1)}` : si.netYawNm.toFixed(1),
          unit: "N·m",
          badgeColor: si.adverseYawDominant ? "rose" : "cyan",
          progressPct: clampProgress(100 - Math.abs(si.netYawNm) * 4),
        },
      ];
    },
    pedagogicalInsight:
      "Helical wing warping creates differential lift across wing tips; the mechanical coupling to the vertical rudder counteracts adverse yaw induced by differential vortex drag.",
    enforceConstraints: (params, key, value) => {
      const updated = { ...params, [key]: value };
      if (updated.coupled === 1) {
        if (key === "wingWarp" || key === "coupled") {
          // Same Claim 18 constant the kernel uses, so badge and sim agree.
          updated.rudder = Number((updated.wingWarp * WRIGHT_COUPLING).toFixed(1));
        }
      }
      return updated;
    },
  },
  "us-381968-tesla-motor": {
    domain: "electromagnetics_flux",
    domainTitle: "Progressive Magnetic Poles in Tesla's Fig. 9 Apparatus",
    equationName: "Resultant Magnetizing Forces",
    governingEquation: "\\mathbf{B}_{\\mathrm{net}} = \\mathbf{B}_{B} + \\mathbf{B}_{B'}",
    engineMethod: "FrankenSimEngine.stepTeslaMotorFig9",
    controls: [
      {
        id: "frequency",
        label: "Generator phase-cycle rate (teaching model)",
        min: 20,
        max: 120,
        step: 1,
        defaultValue: 60,
        unit: "Hz",
      },
      {
        id: "acHum",
        label: "Live AC Hum Audio",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        unit: "on/off",
      },
    ],
    computeMetrics: (p) => {
      const f = p.frequency ?? 60;
      const apparatus = FrankenSimEngine.stepTeslaMotorFig9(f);

      return [
        {
          label: "Generator rotation",
          value: apparatus.generatorRpm.toLocaleString(),
          unit: "RPM",
          badgeColor: "cyan",
          progressPct: Math.min(100, (apparatus.generatorRpm / 7200) * 100),
        },
        {
          label: "Pole shift around ring",
          value: apparatus.poleShiftRpm.toLocaleString(),
          unit: "RPM",
          badgeColor: "emerald",
          progressPct: Math.min(100, (apparatus.poleShiftRpm / 7200) * 100),
        },
        {
          label: "Fig. 9 disk relation",
          value: apparatus.diskRpm.toLocaleString(),
          unit: "RPM",
          badgeColor: "amber",
          progressPct: Math.min(100, (apparatus.diskRpm / 7200) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "The source's Fig. 9 model routes two generator circuits through collector rings and brushes to corresponding motor-coil pairs. Their changing magnetizing forces progressively shift the ring poles; Tesla says disk D follows the moving points of greatest attraction.",
  },
  // Preserved non-public model. The exact route is constrained to a
  // source-reading guide until its 58-page scholarly edition is accepted.
  "_legacy-unpublished-us-2708656-fermi-reactor": {
    domain: "nuclear_kinetics",
    domainTitle: "6-Group Delayed Neutron Point Kinetics & Criticality",
    equationName: "Point Kinetics Differential Equation",
    governingEquation:
      "\\frac{dn}{dt} = \\frac{\\rho - \\beta}{\\Lambda} n + \\sum_{i=1}^6 \\lambda_i C_i \\quad \\text{with} \\quad k_{\\text{eff}} = 1.0000",
    engineMethod: "FrankenSimEngine.stepFermiReactor",
    controls: [
      {
        id: "rodWithdrawal",
        label: "Cadmium Rod Withdrawal",
        min: 0,
        max: 100,
        step: 0.5,
        defaultValue: 83.5,
        unit: "%",
      },
      {
        id: "moderatorPurity",
        label: "Graphite Moderator Purity",
        min: 80,
        max: 100,
        step: 0.5,
        defaultValue: 99.5,
        unit: "%",
      },
      {
        id: "fuelEnrichmentPct",
        label: "Uranium-235 Enrichment",
        min: 0.5,
        max: 1.2,
        step: 0.01,
        defaultValue: 0.72,
        unit: "%",
      },
    ],
    computeMetrics: (p) => {
      const rod = p.rodWithdrawal ?? 83.5;
      const mod = p.moderatorPurity ?? 99.5;
      const enrich = p.fuelEnrichmentPct ?? 0.72;
      const kinetics = stepFermiKinetics(rod, mod, enrich);
      const keff = kinetics.kEffective;
      const rhoDollars = kinetics.reactivityDollars;
      const thermalPower = kinetics.thermalPowerWatts;
      const flux = (thermalPower * 3.2e7).toExponential(2);

      return [
        {
          label: "Multiplication (keff)",
          value: keff.toFixed(4),
          unit: "critical",
          badgeColor: keff > 1.005 ? "rose" : keff >= 0.998 ? "emerald" : "amber",
          progressPct: Math.min(100, (keff / 1.05) * 100),
        },
        {
          label: "Reactivity (ρ)",
          value: rhoDollars >= 0 ? `+${rhoDollars.toFixed(2)}` : rhoDollars.toFixed(2),
          unit: "$",
          badgeColor: rhoDollars > 1 ? "rose" : "amber",
          progressPct: Math.min(100, Math.max(0, (rhoDollars + 2) * 25)),
        },
        {
          label: "Reactor Period",
          value:
            kinetics.reactorPeriodSeconds > 0
              ? `${kinetics.reactorPeriodSeconds.toFixed(1)} s`
              : "subcritical",
          unit: "T",
          badgeColor: kinetics.reactorPeriodSeconds > 0 ? "amber" : "cyan",
          progressPct:
            kinetics.reactorPeriodSeconds > 0
              ? Math.min(100, 100 / kinetics.reactorPeriodSeconds)
              : 0,
        },
        {
          label: "Geiger Interval",
          value: `${kinetics.geigerIntervalMs} ms`,
          unit: "Δt",
          badgeColor: "purple",
          progressPct: clampProgress((kinetics.geigerIntervalMs / 800) * 100),
        },
        {
          label: "Neutron Display",
          value: `${kinetics.neutronDisplaySpeed}`,
          unit: "u/s",
          badgeColor: "cyan",
          progressPct: Math.min(100, (kinetics.neutronDisplaySpeed / 6) * 100),
        },
        {
          label: "Thermal Power",
          value: thermalPower.toLocaleString(),
          unit: "W",
          badgeColor: "purple",
          progressPct: Math.min(100, (thermalPower / 1000) * 100),
        },
        {
          label: "Thermal Flux",
          value: flux,
          unit: "n/(cm²·s)",
          badgeColor: "cyan",
          progressPct: Math.min(100, (thermalPower / 500) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Delayed neutron emission fractions (β = 0.0065) expand the reactor period from milliseconds to dozens of seconds, allowing cadmium control rods to maintain sub-prompt criticality safely.",
  },
  "us-1155986-goddard-rocket": {
    domain: "thermodynamics_transport",
    domainTitle: "Supersonic Isentropic de Laval Expansion & Thrust Kinetics",
    equationName: "Nozzle Exhaust Velocity & Specific Impulse",
    governingEquation:
      "v_e = \\sqrt{\\frac{2\\gamma}{\\gamma - 1} R T_c \\left[1 - \\left(\\frac{P_e}{P_c}\\right)^{\\frac{\\gamma - 1}{\\gamma}}\\right]} \\quad \\text{and} \\quad F = \\dot{m} v_e",
    engineMethod:
      "FrankenSimEngine.stepGoddardRocket (dedicated interpretive WASM after load; validated TypeScript fallback; liquid-nozzle model is adjacent to US 1,102,653)",
    controls: [
      {
        id: "chamberPressure",
        label: "Chamber Pressure (Pc)",
        min: 100,
        max: 600,
        step: 10,
        defaultValue: 350,
        unit: "psi",
      },
      {
        id: "expansionRatio",
        label: "Nozzle Expansion Ratio (Ae/At)",
        min: 2.0,
        max: 8.0,
        step: 0.1,
        defaultValue: 3.5,
        unit: "ratio",
      },
      {
        id: "flightAltitudeMiles",
        label: "Flight Altitude",
        min: 0,
        max: 200,
        step: 1,
        defaultValue: 18,
        unit: "mi",
      },
    ],
    computeMetrics: (p) => {
      const pc = p.chamberPressure ?? 350;
      const ar = p.expansionRatio ?? 3.5;
      const flow = p.fuelFlowRateKgs ?? 1.8;
      const throat = p.throatAreaCm2 ?? 4.2;

      const res = FrankenSimEngine.stepGoddardRocket(pc, flow, throat, ar);
      const match = goddardNozzleMatch(p.flightAltitudeMiles ?? 18, ar);
      const mach = res.machExit;
      const ve = res.exhaustVelocityMps;
      const isp = res.specificImpulseSec.toFixed(1);
      const thrust = res.thrustNewtons;

      return [
        {
          label: "Exit Mach Number",
          value: mach.toFixed(2),
          unit: "Mach",
          badgeColor: "cyan",
          progressPct: Math.min(100, (mach / 4.0) * 100),
        },
        {
          label: "Exhaust Velocity",
          value: ve.toLocaleString(),
          unit: "m/s",
          badgeColor: "emerald",
          progressPct: Math.min(100, (ve / 3000) * 100),
        },
        {
          label: "Thrust",
          value: `${thrust} N (${res.thrustLbf} lbf)`,
          unit: "F",
          badgeColor: "amber",
          progressPct: Math.min(100, (thrust / 4000) * 100),
        },
        {
          label: "Specific Impulse (Isp)",
          value: isp,
          unit: "s",
          badgeColor: "amber",
          progressPct: Math.min(100, (Number(isp) / 300) * 100),
        },
        {
          label: "Thrust Force (F)",
          value: thrust.toLocaleString(),
          unit: "N",
          badgeColor: "indigo",
          progressPct: Math.min(100, (thrust / 800) * 100),
        },
        {
          label: "Nozzle Match",
          value: `${match.optimalEpsilon}:1`,
          unit: "ε*",
          badgeColor: "cyan",
          progressPct: clampProgress(match.expansionEfficiencyPct),
        },
        {
          label: "Optimum Ae/At",
          value: Math.min(
            25,
            Math.max(3, 3.5 * Math.exp((p.flightAltitudeMiles ?? 18) / 12)),
          ).toFixed(1),
          unit: "ε*",
          badgeColor: "purple",
          progressPct: Math.min(
            100,
            (Math.min(25, 3.5 * Math.exp((p.flightAltitudeMiles ?? 18) / 12)) / 25) * 100,
          ),
        },
      ];
    },
    pedagogicalInsight:
      "Converging-diverging de Laval nozzle geometry accelerates subsonic combustion gases past the sonic throat ($M=1$) into supersonic exhaust, transferring thermal enthalpy into axial kinetic momentum.",
  },
  "us-1102653-goddard-rocket": {
    domain: "mechanical_kinematics",
    domainTitle: "Source-Bounded Rigid-Body Spin, Staging Sequence, and Gyro Isolation",
    equationName: "Claim 2 Geometry and Torque-Free Spin Kinematics",
    governingEquation:
      "\\omega = \\frac{2\\pi N}{60}, \\qquad L \\ge 3D, \\qquad \\omega_{\\mathrm{support}} = 0 \\; \\text{(ideal, spinning gyro)}",
    engineMethod:
      "FrankenSimEngine.stepGoddardApparatus (fs-mbd torque-free rigid-body WASM after load; typed TypeScript fallback; source-bounded no-thrust model)",
    controls: [
      {
        id: "tubeLengthRatio",
        label: "Tapered Tube Length / Diameter",
        min: 1.5,
        max: 6,
        step: 0.1,
        defaultValue: 4.5,
        unit: "L/D",
      },
      {
        id: "primarySpinRpm",
        label: "Declared Primary Spin",
        min: 0,
        max: 300,
        step: 5,
        defaultValue: 120,
        unit: "rpm",
      },
      {
        id: "gyroSpinRpm",
        label: "Declared Gyroscope Spin",
        min: 0,
        max: 12_000,
        step: 250,
        defaultValue: 6_000,
        unit: "rpm",
      },
      {
        id: "auxiliaryReleaseFraction",
        label: "Auxiliary Release from Tube 24",
        min: 0,
        max: 1,
        step: 0.02,
        defaultValue: 0,
        unit: "fraction",
      },
      {
        id: "primaryChargeConsumed",
        label: "Primary Charge Substantially Consumed",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        unit: "state",
      },
      {
        id: "gyroEnabled",
        label: "Claim 7 Gyroscope Present",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "state",
      },
    ],
    computeMetrics: (p) => {
      const result = FrankenSimEngine.stepGoddardApparatus(
        0,
        p.primarySpinRpm ?? 120,
        p.gyroSpinRpm ?? 6_000,
        p.tubeLengthRatio ?? 4.5,
        p.auxiliaryReleaseFraction ?? 0,
        (p.primaryChargeConsumed ?? 0) !== 0,
        (p.gyroEnabled ?? 1) !== 0,
      );
      return [
        {
          label: "Claim 2 Tapered-Tube Ratio",
          value: result.tubeLengthRatio.toFixed(1),
          unit: result.claim2Satisfied ? "L/D · PASS" : "L/D · FAIL",
          badgeColor: result.claim2Satisfied ? "emerald" : "rose",
          progressPct: clampProgress((result.tubeLengthRatio / 6) * 100),
        },
        {
          label: "Claim 1 Firing Sequence",
          value: result.claim1SequenceSatisfied ? "ordered" : "premature",
          unit: result.auxiliaryNested ? "nested" : "released",
          badgeColor: result.claim1SequenceSatisfied ? "emerald" : "rose",
          progressPct: result.claim1SequenceSatisfied ? 100 : 0,
        },
        {
          label: "Primary Angular Velocity",
          value: result.primaryAngularVelocityRadPerSec.toFixed(2),
          unit: "rad/s",
          badgeColor: "amber",
          progressPct: clampProgress(((p.primarySpinRpm ?? 120) / 300) * 100),
        },
        {
          label: "Gyroscope Angular Velocity",
          value: result.gyroAngularVelocityRadPerSec.toFixed(1),
          unit: "rad/s",
          badgeColor: "purple",
          progressPct: clampProgress(((p.gyroSpinRpm ?? 6_000) / 12_000) * 100),
        },
        {
          label: "Instrument Support World Rate",
          value: result.cameraSupportAngularVelocityRadPerSec.toFixed(2),
          unit: "rad/s",
          badgeColor: result.cameraSupportAngularVelocityRadPerSec === 0 ? "emerald" : "rose",
          progressPct: clampProgress(
            (result.cameraSupportAngularVelocityRadPerSec /
              Math.max(1, result.primaryAngularVelocityRadPerSec)) *
              100,
          ),
        },
      ];
    },
    pedagogicalInsight:
      "The 1914 grant is a solid-charge staged apparatus: frame bearings permit pre-launch spin, an auxiliary rocket remains nested until the main charge is substantially consumed, and a gyroscope ideally prevents the camera support from sharing the rotating head's world rate. RPM values are declared teaching inputs because the source prints no numerical speeds.",
  },
  "us-2524035-bardeen-transistor": {
    domain: "semiconductor_carrier",
    domainTitle: "Point-Contact Minority Carrier Injection & Hole Diffusion",
    equationName: "Einstein Diffusion & Current Gain Alpha",
    governingEquation:
      "D_p = \\frac{k_B T}{q} \\mu_p \\quad \\text{and} \\quad \\alpha = \\gamma \\cdot \\beta = \\frac{\\Delta I_c}{\\Delta I_e} \\approx 1.8",
    engineMethod: "FrankenSimEngine.stepBardeenTransistor",
    controls: [
      {
        id: "emitterCurrent",
        label: "Emitter Current (Ie)",
        min: 0.5,
        max: 8.0,
        step: 0.1,
        defaultValue: 1.5,
        unit: "mA",
      },
      {
        id: "collectorBias",
        label: "Collector Reverse Bias",
        min: -80,
        max: -10,
        step: 1,
        defaultValue: -40,
        unit: "V",
      },
      {
        id: "pointSpacing",
        label: "Whiskers Contact Spacing",
        min: 15,
        max: 150,
        step: 5,
        defaultValue: 50,
        unit: "µm",
      },
    ],
    computeMetrics: (p) => {
      const ie = p.emitterCurrent ?? 1.5;
      const spacing = p.pointSpacing ?? 50;
      const semi = FrankenSimEngine.stepBardeenTransistor(ie, p.collectorBias ?? -40, spacing);
      const transitTimeNs = semi.clockPeriodNs;
      const alpha = semi.currentGainAlpha ?? 1.0;
      const powerGainDb = semi.powerGainDb.toFixed(1);
      const ic = semi.collectorCurrentMa.toFixed(2);

      return [
        {
          label: "Current Gain (α)",
          value: alpha.toFixed(2),
          unit: "ratio",
          badgeColor: alpha >= 1.0 ? "emerald" : "amber",
          progressPct: Math.min(100, (alpha / 2.5) * 100),
        },
        {
          label: "Hole Transit Time",
          value: transitTimeNs.toFixed(1),
          unit: "ns",
          badgeColor: "cyan",
          progressPct: Math.min(100, (transitTimeNs / 30) * 100),
        },
        {
          label: "Collector Current",
          value: ic,
          unit: "mA",
          badgeColor: "purple",
          progressPct: Math.min(100, (Number(ic) / 10) * 100),
        },
        {
          label: "Power Amplification",
          value: `${powerGainDb}`,
          unit: "dB",
          badgeColor: "indigo",
          progressPct: Math.min(100, (Number(powerGainDb) / 25) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Forward-biased emitter phosphor-bronze point injects minority carrier holes into n-type germanium base; reverse-biased collector placed 50 µm away sweeps them across the barrier for net power gain.",
  },
  "us-1781541-einstein-refrigerator": {
    domain: "thermodynamics_transport",
    domainTitle: "Dalton Partial Pressure Absorption Cycle & Bubble Pump",
    equationName: "Dalton Evaporative Vaporization & COP",
    governingEquation:
      "P_{\\text{total}} = P_{\\text{NH}_3} + P_{\\text{butane}} + P_{\\text{H}_2\\text{O}} \\quad \\text{and} \\quad \\text{COP} = \\frac{Q_{\\text{evap}}}{Q_{\\text{heat}}}",
    engineMethod: "FrankenSimEngine.stepEinsteinRefrigerator",
    controls: [
      {
        id: "heatInput",
        label: "Generator Heat Input",
        min: 80,
        max: 500,
        step: 5,
        defaultValue: 220,
        unit: "W",
        provenance: "scenario-reader",
      },
      {
        id: "totalPressure",
        label: "System Total Pressure",
        min: 6,
        max: 22,
        step: 0.5,
        defaultValue: 15.0,
        unit: "atm",
        provenance: "scenario-reader",
      },
      {
        id: "ammoniaRatio",
        label: "Ammonia Mole Fraction",
        min: 0.4,
        max: 0.9,
        step: 0.01,
        defaultValue: 0.65,
        unit: "x_NH₃",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics: (p) => {
      const frige = stepEinsteinRefrigeratorSi({
        heatInput: p.heatInput,
        totalPressure: p.totalPressure,
        ammoniaRatio: p.ammoniaRatio ?? p.auxiliaryGasRatio,
      });
      const evapTemp = frige.evapTempC;
      const cop = frige.cop;
      const coolingWatts = frige.coolingWatts;
      const press = frige.pressureAtm;

      return [
        {
          label: "Evaporator Temp",
          value: evapTemp.toFixed(1),
          unit: "°C",
          badgeColor: evapTemp < 0 ? "cyan" : "amber",
          progressPct: Math.min(100, Math.max(0, (30 - evapTemp) * 2)),
          provenance: "scenario-modern",
        },
        {
          label: "Cooling Power (Qc)",
          value: coolingWatts.toString(),
          unit: "W",
          badgeColor: "emerald",
          progressPct: Math.min(100, (coolingWatts / 120) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Thermodynamic COP",
          value: cop.toFixed(2),
          unit: "ratio",
          badgeColor: "indigo",
          progressPct: Math.min(100, (cop / 0.5) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Total System Pressure",
          value: press.toFixed(1),
          unit: "atm",
          badgeColor: "purple",
          progressPct: clampProgress((press / 25) * 100),
          provenance: "scenario-reader",
        },
      ];
    },
    pedagogicalInsight:
      "A sealed ternary mixture operates at uniform pressure with no moving mechanical parts: introduced butane gas lowers ammonia partial pressure, triggering endothermic evaporative cooling.",
  },
  "us-2495429-spencer-microwave": {
    domain: "electromagnetics",
    domainTitle: "Dual-Magnetron Guided Food-Treatment Apparatus",
    equationName: "Source-Stated Microwave Wavelength Region",
    governingEquation: "\\lambda \\lesssim 10\\ \\text{cm}",
    engineMethod: "Source-bounded TypeScript apparatus state; no quantitative tube model",
    controls: [
      {
        id: "rfPowerSetting",
        label: "Illustrative Energy Path",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "on/off",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics: (p) => {
      const energyPathActive = (p.rfPowerSetting ?? 1) > 0;

      return [
        {
          label: "Energy Path",
          value: energyPathActive ? "active" : "disabled",
          unit: "",
          badgeColor: "cyan",
          progressPct: energyPathActive ? 100 : 0,
          provenance: "scenario-reader",
        },
        {
          label: "Oscillators",
          value: "10 and 11",
          unit: "source numerals",
          badgeColor: "emerald",
          progressPct: 100,
          provenance: "source-disclosed",
        },
        {
          label: "Common Guide",
          value: "23",
          unit: "source numeral",
          badgeColor: "purple",
          progressPct: 100,
          provenance: "source-disclosed",
        },
        {
          label: "Conveyor",
          value: "28",
          unit: "source numeral",
          badgeColor: "amber",
          progressPct: 100,
          provenance: "source-disclosed",
        },
      ];
    },
    pedagogicalInsight:
      "The patent drawing shows two magnetron oscillators, 10 and 11, coupled through coaxial lines 24 and 25 and loops 26 and 27 into common wave guide 23, with food carried transversely by conveyor 28. The grant does not state an operating power, tube voltage, magnetic field, cavity count, or household-oven geometry.",
  },
  "us-2981877-noyce-ic": {
    domain: "semiconductor_carrier",
    domainTitle: "Planar PN Barrier Depletion & Monolithic Silicon Interconnects",
    equationName: "Depletion Region Barrier Capacitance",
    governingEquation:
      "W = \\sqrt{\\frac{2\\varepsilon_s (V_{bi} + V_R)}{q}\\left(\\frac{1}{N_A} + \\frac{1}{N_D}\\right)}",
    engineMethod: "FrankenSimEngine.stepNoyceIC",
    controls: [
      {
        id: "reverseBias",
        label: "Reverse Bias Voltage (VR)",
        min: 1,
        max: 20,
        step: 0.5,
        defaultValue: 5.0,
        unit: "V",
        provenance: "scenario-modern",
      },
      {
        id: "oxideThickness",
        label: "SiO2 Oxide Thickness",
        min: 0.2,
        max: 1.2,
        step: 0.05,
        defaultValue: 0.5,
        unit: "µm",
        provenance: "scenario-modern",
      },
      {
        id: "clockFrequencyMhz",
        label: "Clock Frequency",
        min: 1,
        max: 50,
        step: 1,
        defaultValue: 10,
        unit: "MHz",
        provenance: "scenario-modern",
      },
    ],
    computeMetrics: (p) => {
      const ic = stepNoyceIC({
        reverseBias: p.reverseBias,
        oxideThickness: p.oxideThickness,
        clockFrequencyMhz: p.clockFrequencyMhz,
      });
      const w = ic.depletionWidthUm.toFixed(2);
      const propDelay = ic.propDelayNs.toFixed(2);
      const cap = ic.junctionCapPfPerMm2.toFixed(1);

      return [
        {
          label: "Depletion Barrier (W)",
          value: w,
          unit: "µm",
          badgeColor: "cyan",
          progressPct: (Number(w) / 2.5) * 100,
          provenance: "scenario-modern",
        },
        {
          label: "Junction Capacitance",
          value: cap,
          unit: "pF/mm²",
          badgeColor: "amber",
          progressPct: (Number(cap) / 60) * 100,
          provenance: "scenario-modern",
        },
        {
          label: "Propagation Delay (tpd)",
          value: propDelay,
          unit: "ns",
          badgeColor: "emerald",
          progressPct: (Number(propDelay) / 3.0) * 100,
          provenance: "scenario-modern",
        },
        {
          label: "Breakdown Margin",
          value: ic.breakdownMarginV.toFixed(1),
          unit: "V",
          badgeColor: "indigo",
          progressPct: (ic.breakdownMarginV / 35) * 100,
          provenance: "scenario-modern",
        },
      ];
    },
    pedagogicalInsight:
      "Surface oxide passivation electrically insulates individual diffused transistor regions while vapor-deposited aluminum film leads unite components directly on a single monolithic silicon crystal.",
  },
  "us-223898-edison-lightbulb": {
    domain: "thermodynamics_transport",
    domainTitle: "Declared High-Vacuum Gray-Body Steady Balance",
    equationName: "Joule-to-Stefan-Boltzmann Gray-Body Balance",
    governingEquation:
      "\\frac{V^2}{R_{\\text{declared}}} = \\varepsilon \\sigma (\\pi d_{\\text{source}} L_{\\text{declared}})(T^4 - T_0^4)",
    engineMethod: "fs-conduction incandescent radiative balance",
    controls: [
      {
        id: "voltage",
        label: "Applied Terminal Voltage",
        min: 40,
        max: 130,
        step: 1,
        defaultValue: 110,
        unit: "V",
      },
      {
        id: "hotResistanceOhm",
        label: "Declared Hot Resistance",
        min: 100,
        max: 500,
        step: 5,
        defaultValue: 145,
        unit: "Ω",
      },
    ],
    computeMetrics: (p) => {
      const bulb = stepEdisonBulb({
        voltage: p.voltage,
        hotResistanceOhm: p.hotResistanceOhm,
      });
      const tempK = bulb.filamentTempK;
      const res = bulb.hotResistanceOhm;
      const powerWatts = bulb.radiantWatts;

      return [
        {
          label: "Filament Temperature",
          value: tempK.toLocaleString(),
          unit: "K",
          badgeColor: "amber",
          progressPct: clampProgress((tempK / 2500) * 100),
        },
        {
          label: "Radiant Output Power",
          value: powerWatts.toFixed(1),
          unit: "W",
          badgeColor: "emerald",
          progressPct: clampProgress((powerWatts / 120) * 100),
        },
        {
          label: "Hot Resistance",
          value: res.toString(),
          unit: "Ω",
          badgeColor: "indigo",
          progressPct: clampProgress((res / 200) * 100),
        },
        {
          label: "Filament Current",
          value: bulb.currentAmps.toFixed(2),
          unit: "A",
          badgeColor: "amber",
          progressPct: clampProgress((bulb.currentAmps / 2) * 100),
        },
        {
          label: "Radiative Closure",
          value: bulb.radiativeEnergyClosure.toExponential(1),
          unit: "relative",
          badgeColor: "purple",
          progressPct: clampProgress(100 - bulb.radiativeEnergyClosure * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Evacuating the glass globe to one-millionth of an atmosphere prevents oxygen combustion and dramatically suppresses convective heat transfer, enabling a high-resistance carbonized thread to glow incandescently.",
  },
  "us-174465-bell-telephone": {
    domain: "electromagnetics_flux",
    domainTitle: "Variable Resistance Acoustic Diaphragm Speech Undulation",
    equationName: "Diaphragm Acoustic Pressure to Resistance Transfer",
    governingEquation:
      "i(t) = \\frac{E}{R_0 + \\Delta R \\sin(\\omega t)} \\approx I_0 + \\Delta I \\sin(\\omega t)",
    engineMethod: "FrankenSimEngine.stepBellTelephone",
    controls: [
      {
        id: "voiceAmplitude",
        label: "Voice Sound Pressure",
        min: 40,
        max: 95,
        step: 1,
        defaultValue: 75,
        unit: "dB",
      },
      {
        id: "acousticFrequencyHz",
        label: "Voice Frequency",
        min: 200,
        max: 800,
        step: 10,
        defaultValue: 440,
        unit: "Hz",
      },
      {
        id: "airGap",
        label: "Diaphragm Magnetic Gap",
        min: 0.1,
        max: 0.8,
        step: 0.05,
        defaultValue: 0.35,
        unit: "mm",
      },
      {
        id: "batteryVoltage",
        label: "Battery Voltage",
        min: 1,
        max: 12,
        step: 0.5,
        defaultValue: 6,
        unit: "V",
      },
      {
        id: "liquidConductivity",
        label: "Acidulated Water Conductivity",
        min: 0.2,
        max: 3,
        step: 0.1,
        defaultValue: 1.2,
        unit: "S",
      },
    ],
    computeMetrics: (p) => {
      const bell = stepBellTelephone({
        voiceAmplitude: p.voiceAmplitude,
        airGap: p.airGap,
        batteryVoltage: p.batteryVoltage,
        liquidConductivity: p.liquidConductivity,
        acousticFrequencyHz: p.acousticFrequencyHz,
      });
      const displMicrons = bell.diaphragmUm.toFixed(2);
      const modCurrent = bell.modulatedMa.toFixed(2);
      const sens = bell.sensitivityMvPerPa.toFixed(1);

      return [
        {
          label: "Diaphragm Deflection",
          value: displMicrons,
          unit: "µm",
          badgeColor: "cyan",
          progressPct: clampProgress((Number(displMicrons) / 5) * 100),
        },
        {
          label: "Modulated Signal",
          value: modCurrent,
          unit: "mA",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(modCurrent) / 20) * 100),
        },
        {
          label: "Transduction Sensitivity",
          value: sens,
          unit: "mV/Pa",
          badgeColor: "amber",
          progressPct: clampProgress((Number(sens) / 40) * 100),
        },
        {
          label: "Voice Tone",
          value: (p.acousticFrequencyHz ?? 440).toString(),
          unit: "Hz",
          badgeColor: "indigo",
          progressPct: clampProgress((((p.acousticFrequencyHz ?? 440) - 200) / 600) * 100),
        },
        {
          label: "Liquid R₀",
          value: `${bell.baseResistanceOhms}`,
          unit: "Ω",
          badgeColor: "purple",
          progressPct: Math.min(100, (bell.baseResistanceOhms / 80) * 100),
        },
        {
          label: "Bias Current",
          value: `${bell.currentBaselineMa}`,
          unit: "mA",
          badgeColor: "cyan",
          progressPct: Math.min(100, (bell.currentBaselineMa / 200) * 100),
        },
        {
          label: "Display ω",
          value: `${bell.acousticDisplayOmegaRadPerS}`,
          unit: "rad/s",
          badgeColor: "amber",
          progressPct: Math.min(100, (bell.acousticDisplayOmegaRadPerS / 200) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Vibrating iron diaphragm modulates the air gap of an electromagnet, producing an undulating continuous electrical current whose instantaneous voltage mimics human vocal acoustic waveforms.",
  },
  // Preserved, non-public legacy model. The source-reviewed US 586,193 route
  // is held below until an independently accepted visual can support it.
  "_legacy-unpublished-us-586193-marconi-radio": {
    domain: "electromagnetics_flux",
    domainTitle: "Spark-Gap Resonant Damped Wave Oscillations & Aerial Radiation",
    equationName: "Monopole Radiation Resistance & Resonant Frequency",
    governingEquation:
      "f_0 = \\frac{1}{2\\pi \\sqrt{L C}} \\quad \\text{and} \\quad R_{\\text{rad}} = 36.56\\ \\Omega \\quad (\\lambda = 4h)",
    engineMethod: "FrankenSimEngine.stepMarconiRadio",
    controls: [
      {
        id: "sparkVoltage",
        label: "Induction Coil Voltage",
        min: 5,
        max: 50,
        step: 1,
        defaultValue: 28,
        unit: "kV",
      },
      {
        id: "aerialHeight",
        label: "Vertical Aerial Height",
        min: 10,
        max: 120,
        step: 2,
        defaultValue: 88,
        unit: "m",
      },
      {
        id: "sparkGapMm",
        label: "Spark Gap Distance",
        min: 2,
        max: 25,
        step: 1,
        defaultValue: 10,
        unit: "mm",
      },
    ],
    computeMetrics: (p) => {
      const v = p.sparkVoltage ?? 28;
      const h = p.aerialHeight ?? 88;
      const radio = FrankenSimEngine.stepMarconiRadio(h, p.sparkGapMm ?? 10, v);
      const freqKhz = radio.resonantFreqKhz;

      return [
        {
          label: "Resonant Frequency",
          value: freqKhz.toString(),
          unit: "kHz",
          badgeColor: "cyan",
          progressPct: clampProgress((freqKhz / 2500) * 100),
        },
        {
          label: "Peak RF Power",
          value: radio.peakRfPowerKw.toString(),
          unit: "kW",
          badgeColor: "amber",
          progressPct: Math.min(100, (radio.peakRfPowerKw / 80) * 100),
        },
        {
          label: "Radiation Resistance",
          value: radio.radiationResistanceOhms.toFixed(1),
          unit: "Ω",
          badgeColor: "emerald",
          progressPct: clampProgress(75),
        },
        {
          label: "Estimated Range",
          value: radio.maxRangeMiles.toString(),
          unit: "mi",
          badgeColor: "indigo",
          progressPct: Math.min(100, (radio.maxRangeMiles / 200) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Connecting one terminal of an elevated vertical antenna to the spark gap and the other directly to the conductive earth turns the system into an asymmetric quarter-wave Hertzian radiator.",
  },
  "us-1647-morse-telegraph": {
    domain: "electromagnetics_flux",
    domainTitle: "Solenoid Core Inductance & Armature Magnetic Force",
    equationName: "Electromagnetic Solenoid Attraction Force",
    governingEquation:
      "F_{\\text{mag}} = \\frac{B^2 A}{2\\mu_0} = \\frac{\\mu_0 N^2 I^2 A}{2 g^2} \\quad \\text{and} \\quad \\tau = \\frac{L}{R}",
    engineMethod: "FrankenSimEngine.stepMorseTelegraph",
    controls: [
      {
        id: "currentMa",
        label: "Telegraph Line Current",
        min: 20,
        max: 120,
        step: 2,
        defaultValue: 65,
        unit: "mA",
      },
      {
        id: "wireTurns",
        label: "Electromagnet Coil Turns",
        min: 500,
        max: 2000,
        step: 50,
        defaultValue: 1200,
        unit: "turns",
      },
      {
        id: "lineVoltageV",
        label: "Line Voltage",
        min: 6,
        max: 48,
        step: 1,
        defaultValue: 24,
        unit: "V",
      },
      {
        id: "lineLengthMiles",
        label: "Line Distance",
        min: 10,
        max: 150,
        step: 5,
        defaultValue: 44,
        unit: "Mi",
      },
      {
        id: "wpmSpeed",
        label: "Words Per Minute",
        min: 5,
        max: 35,
        step: 1,
        defaultValue: 20,
        unit: "WPM",
      },
    ],
    computeMetrics: (p) => {
      const morse = stepMorseTelegraph({
        currentMa: p.currentMa,
        wireTurns: p.wireTurns,
        lineVoltageV: p.lineVoltageV,
        lineLengthMiles: p.lineLengthMiles,
        wpmSpeed: p.wpmSpeed,
      });
      const forceN = morse.magneticForceN.toFixed(2);
      const tauMs = morse.timeConstantMs.toFixed(1);

      return [
        {
          label: "Magnetic Pull Force",
          value: forceN,
          unit: "N",
          badgeColor: Number(forceN) >= 2 ? "emerald" : "amber",
          progressPct: clampProgress((Number(forceN) / 10) * 100),
        },
        {
          label: "Time Constant (τ)",
          value: tauMs,
          unit: "ms",
          badgeColor: "cyan",
          progressPct: clampProgress((Number(tauMs) / 30) * 100),
        },
        {
          label: "Ampere-Turns (NI)",
          value: morse.ampereTurns.toString(),
          unit: "A·turns",
          badgeColor: "indigo",
          progressPct: clampProgress((morse.ampereTurns / 200) * 100),
        },
        {
          label: "Stylus Emboss Pressure",
          value: `${morse.stylusKpa}`,
          unit: "kPa",
          badgeColor: "purple",
          progressPct: clampProgress((morse.stylusKpa / 250) * 100),
        },
        {
          label: "Ohmic Loop Current",
          value: `${morse.ohmicCurrentMa} mA`,
          unit: "I_ohm",
          badgeColor: "cyan",
          progressPct: clampProgress((morse.ohmicCurrentMa / 80) * 100),
        },
        {
          label: "PARIS Unit",
          value: `${morse.unitDurationMs} ms`,
          unit: "t_unit",
          badgeColor: "amber",
          progressPct: clampProgress((morse.unitDurationMs / 240) * 100),
        },
        {
          label: "Dit / Dah",
          value: `${morse.ditMs} / ${morse.dahMs}`,
          unit: "ms",
          badgeColor: "purple",
          progressPct: clampProgress((morse.ditMs / 240) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Direct electrical current passes through a soft iron horse-shoe electromagnet, overcoming mechanical spring tension to draw down the armature lever and press an embossed stylus into moving paper tape.",
  },
  // Preserved, non-public legacy model. US 3,671,542 is held below until its
  // 58-page source edition is manually authored; do not route this simulation
  // or its numerical material claims to the corrected public patent id.
  "_legacy-unpublished-us-3671542-kwolek-kevlar": {
    domain: "continuum_elasticity",
    domainTitle: "Liquid-Crystalline Poly-Aramid Hydrogen-Bonded Lattice",
    equationName: "Tensile Modulus & Sonic Dispersion Velocity",
    governingEquation:
      "v_{\\text{sound}} = \\sqrt{\\frac{E}{\\rho}} \\quad \\text{and} \\quad \\sigma_{\\text{max}} = E \\cdot \\varepsilon_{\\text{rupture}}",
    engineMethod: "FrankenSimEngine.stepKevlarContinuum",
    controls: [
      {
        id: "drawRatio",
        label: "Filament Draw Orientation Ratio",
        min: 2.0,
        max: 9.0,
        step: 0.2,
        defaultValue: 6.5,
        unit: "ratio",
      },
      {
        id: "polymerConcentrationPct",
        label: "Polymer Concentration",
        min: 5.0,
        max: 25.0,
        step: 0.5,
        defaultValue: 18.5,
        unit: "wt%",
      },
      {
        id: "temperatureCelsius",
        label: "Dope Temperature",
        min: 20,
        max: 120,
        step: 1,
        defaultValue: 85,
        unit: "°C",
      },
      {
        id: "showHydrogenBonds",
        label: "Show H-Bonds",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "",
      },
      {
        id: "isImpactTesting",
        label: "Trigger Impact Test",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        unit: "trigger",
      },
      {
        id: "impactVelocity",
        label: "Projectile Impact Velocity",
        min: 150,
        max: 900,
        step: 25,
        defaultValue: 450,
        unit: "m/s",
      },
      {
        id: "appliedTension",
        label: "Applied Tensile Strain",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 30,
        unit: "%",
      },
    ],
    computeMetrics: (p) => {
      const kevlar = FrankenSimEngine.stepKevlarContinuum(
        p.drawRatio ?? 6.5,
        p.impactVelocity ?? 450,
        p.appliedTension ?? 30,
      );
      const eGpa = kevlar.elasticModulusGpa;
      const vSonic = kevlar.sonicVelocityMps;
      const strainPct = kevlar.tensileStrainPct.toFixed(2);
      const stressMpa = kevlar.tensileStressMpa;

      return [
        {
          label: "Elastic Modulus (E)",
          value: Math.round(eGpa).toString(),
          unit: "GPa",
          badgeColor: "cyan",
          progressPct: clampProgress((eGpa / 150) * 100),
        },
        {
          label: "Sonic Shock Velocity",
          value: vSonic.toLocaleString(),
          unit: "m/s",
          badgeColor: "emerald",
          progressPct: clampProgress((vSonic / 12000) * 100),
        },
        {
          label: "Tensile Stress",
          value: stressMpa.toLocaleString(),
          unit: "MPa",
          badgeColor: stressMpa < 3600 ? "indigo" : "rose",
          progressPct: clampProgress((stressMpa / 4000) * 100),
        },
        {
          label: "Elastic Strain",
          value: strainPct,
          unit: "%",
          badgeColor: Number(strainPct) < 3.5 ? "amber" : "rose",
          progressPct: clampProgress((Number(strainPct) / 4.0) * 100),
        },
        {
          label: "Fiber Strength",
          value: `${kevlar.tensileStrengthGpa} GPa`,
          unit: "σ_ult",
          badgeColor: "emerald",
          progressPct: clampProgress((kevlar.tensileStrengthGpa / 3.6) * 100),
        },
        {
          label: "Residual Strength",
          value: `${kevlar.residualStrengthGpa} GPa`,
          unit: "σ_res",
          badgeColor: kevlar.residualStrengthGpa < 1.6 ? "rose" : "emerald",
          progressPct: clampProgress((kevlar.residualStrengthGpa / 3.6) * 100),
        },
        {
          label: "Chain Alignment",
          value: `${kevlar.alignmentPct}%`,
          unit: "align",
          badgeColor: "purple",
          progressPct: clampProgress(kevlar.alignmentPct),
        },
      ];
    },
    pedagogicalInsight:
      "All-trans rigid rod aromatic poly-p-phenylene terephthalamide chains align in parallel liquid-crystalline domains, transferring impact kinetic energy along transverse hydrogen-bonded sheets at Mach 28.",
  },
  "us-3237-rillieux-evaporator": {
    domain: "thermodynamics",
    domainTitle: "Multi-Effect Vacuum Evaporation & Latent Heat Cascading",
    equationName: "Rillieux Multi-Effect Steam Economy & Latent Heat Transfer",
    governingEquation:
      "S = \\frac{\\dot{m}_{\\text{evap,total}}}{\\dot{m}_{\\text{steam}}} = \\sum_{i=1}^N \\frac{U_i A_i \\Delta T_i}{\\dot{m}_{\\text{steam}} h_{fg,i}} \\approx N \\cdot \\eta_{\\text{th}}",
    engineMethod: "FrankenSimEngine.stepRillieuxEvaporator",
    controls: [
      {
        id: "juiceFeedRateKgPerH",
        label: "Raw Cane Juice Feed Rate",
        min: 2000,
        max: 25000,
        step: 500,
        defaultValue: 10000,
        unit: "kg/h",
      },
      {
        id: "initialBrixDeg",
        label: "Initial Juice Concentration",
        min: 10,
        max: 20,
        step: 0.5,
        defaultValue: 14,
        unit: "°Bx",
      },
      {
        id: "targetBrixDeg",
        label: "Target Syrup Concentration",
        min: 50,
        max: 75,
        step: 1,
        defaultValue: 65,
        unit: "°Bx",
      },
      {
        id: "numberOfEffects",
        label: "Evaporator Effects in Series",
        min: 2,
        max: 4,
        step: 1,
        defaultValue: 3,
        unit: "effects",
      },
    ],
    computeMetrics: (p) => {
      const rill = stepRillieuxEvaporator({
        juiceFeedRateKgPerH: p.juiceFeedRateKgPerH,
        initialBrixDeg: p.initialBrixDeg,
        targetBrixDeg: p.targetBrixDeg,
        numberOfEffects: p.numberOfEffects,
      });
      return [
        {
          label: "Steam Economy Ratio",
          value: `${rill.steamEconomyRatio.toFixed(2)} kg/kg`,
          unit: "S_economy",
          badgeColor: "emerald",
          progressPct: clampProgress((rill.steamEconomyRatio / 4.0) * 100),
        },
        {
          label: "Total Water Evaporated",
          value: `${(rill.totalEvaporationKgPerH / 1000).toFixed(2)} t/h`,
          unit: "m_evap",
          badgeColor: "cyan",
          progressPct: clampProgress((rill.totalEvaporationKgPerH / 20000) * 100),
        },
        {
          label: "Primary Steam Needed",
          value: `${(rill.primarySteamConsumptionKgPerH / 1000).toFixed(2)} t/h`,
          unit: "m_steam",
          badgeColor: "amber",
          progressPct: clampProgress((rill.primarySteamConsumptionKgPerH / 10000) * 100),
        },
        {
          label: "Fuel Consumption Savings",
          value: `${rill.fuelSavingsPct.toFixed(1)}%`,
          unit: "Savings",
          badgeColor: "emerald",
          progressPct: clampProgress(rill.fuelSavingsPct),
        },
        {
          label: "Concentrated Syrup Output",
          value: `${(rill.syrupOutputRateKgPerH / 1000).toFixed(2)} t/h`,
          unit: "m_syrup",
          badgeColor: "indigo",
          progressPct: clampProgress((rill.syrupOutputRateKgPerH / 5000) * 100),
        },
        {
          label: "Thermal Cascading Efficiency",
          value: `${rill.thermalEfficiencyPct.toFixed(1)}%`,
          unit: "eta_th",
          badgeColor: "purple",
          progressPct: clampProgress(rill.thermalEfficiencyPct),
        },
      ];
    },
    pedagogicalInsight:
      "Norbert Rillieux's 1843 specification connects a pressure evaporator to a vacuum pan so vapor from the first pan supplies heat to the second, and uses a differential thermometer to regulate syrup concentration. The host SI model exposes mass balance and latent-heat reuse as a modern teaching model; its feed, Brix, and effect-count values are not measurements printed in the grant.",
  },
  "us-3633-goodyear-rubber": {
    domain: "continuum_elasticity",
    domainTitle: "Disulfide Polymer Cross-Linking & Entropic Elasticity",
    equationName: "Disulfide Cross-Link Kinetics & Entropic Restoring Force",
    governingEquation:
      "f = -T \\left(\\frac{\\partial S}{\\partial L}\\right)_T = n k_B T \\left(\\lambda - \\frac{1}{\\lambda^2}\\right)",
    engineMethod: "FrankenSimEngine.stepGoodyearRubber",
    controls: [
      {
        id: "vulcanTemp",
        label: "Vulcanization Temperature",
        min: 110,
        max: 190,
        step: 2,
        defaultValue: 145,
        unit: "°C",
      },
      {
        id: "sulfurPct",
        label: "Sulfur Content Fraction",
        min: 2,
        max: 14,
        step: 0.5,
        defaultValue: 8.0,
        unit: "%",
      },
      {
        id: "specimenTempC",
        label: "Specimen Temperature",
        min: -20,
        max: 100,
        step: 1,
        defaultValue: 35,
        unit: "°C",
      },
      {
        id: "appliedTensileStretch",
        label: "Tensile Stretch (λ)",
        min: 1.0,
        max: 2.5,
        step: 0.05,
        defaultValue: 1.8,
        unit: "λ",
      },
    ],
    computeMetrics: (p) => {
      const rubber = FrankenSimEngine.stepGoodyearRubber(
        p.vulcanTemp ?? 145,
        p.sulfurPct ?? 8.0,
        30,
        p.appliedTensileStretch ?? 1.8,
        p.specimenTempC ?? 35,
      );
      const crossLink = rubber.crossLinkDensity.toFixed(3);
      const tensilePsi = rubber.tensileStrengthPsi;
      const returnPct = rubber.elasticReturnPct;

      return [
        {
          label: "Process Thermal Stability",
          value: rubber.isStickyOrBrittle ? "Uncured / Plastic" : "Cured Resilient",
          unit: "state",
          badgeColor: rubber.isStickyOrBrittle ? "rose" : "emerald",
          progressPct: clampProgress(rubber.isStickyOrBrittle ? 30 : 95),
          provenance: "source-disclosed",
        },
        {
          label: "Cross-Link Density (Model)",
          value: crossLink,
          unit: "mol/cm³",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(crossLink) / 1.5) * 100),
          provenance: "scenario-modern",
          provenanceCitation: "Modern sulfur crosslink kinetics model.",
        },
        {
          label: "Tensile Strength (Model)",
          value: tensilePsi.toLocaleString(),
          unit: "psi",
          badgeColor: "cyan",
          progressPct: clampProgress((tensilePsi / 3500) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Elastic Return (Model)",
          value: returnPct.toString(),
          unit: "%",
          badgeColor: "indigo",
          progressPct: clampProgress(returnPct),
          provenance: "scenario-modern",
        },
        {
          label: "Glass Transition (Model)",
          value: `${rubber.glassTransitionTempC} °C`,
          unit: "°C",
          badgeColor: "amber",
          progressPct: clampProgress(((rubber.glassTransitionTempC + 60) / 120) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "True Stress (Model)",
          value: `${rubber.trueStressMpa}`,
          unit: "MPa",
          badgeColor: "indigo",
          progressPct: Math.min(100, (rubber.trueStressMpa / 30) * 100),
          provenance: "scenario-modern",
        },
      ];
    },
    pedagogicalInsight:
      "Heating raw polyisoprene rubber with sulfur forms covalent disulfide bridges between entangled polymer chains, transforming thermally plastic gum into resilient, temperature-stable entropic elastomer.",
  },
  "us-6469-lincoln-buoy": {
    domain: "continuum_elasticity",
    domainTitle: "Pneumatic Expandable Buoyancy & Riverbed Shoal Navigation",
    equationName: "Archimedes Buoyant Lift & Hydrostatic Draft Reduction",
    governingEquation:
      "\\Delta F_b = \\rho_{\\text{water}} \\cdot g \\cdot \\Delta V_{\\text{air}} \\quad \\text{and} \\quad \\Delta d = \\frac{\\Delta F_b}{\\rho g A_{\\text{waterplane}}}",
    engineMethod: "FrankenSimEngine.stepLincolnBuoy",
    pedagogicalInsight:
      "US 6,469 claims the combination of expansible side chambers, sliding spars D fixed to chamber bottoms, and a main shaft C with ropes/pulleys to expand chambers into the water to lessen vessel draft; numerical tonnage and draft values are illustrative hydrostatic parameters.",
    controls: [
      {
        id: "inflationPct",
        label: "Chamber Expansion / Inflation",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 75,
        unit: "%",
        provenance: "source-disclosed",
      },
      {
        id: "weightTons",
        label: "Illustrative Steamboat Displacement",
        min: 200,
        max: 600,
        step: 10,
        defaultValue: 380,
        unit: "T",
        provenance: "scenario-modern",
      },
      {
        id: "shoalDepth",
        label: "Illustrative Shoal Water Depth",
        min: 2.0,
        max: 12.0,
        step: 0.1,
        defaultValue: 3.5,
        unit: "ft",
        provenance: "scenario-modern",
      },
    ],
    computeMetrics: (p) => {
      const buoy = stepLincolnBuoySi({
        inflationPct: p.inflationPct,
        weightTons: p.weightTons,
        shoalDepth: p.shoalDepth,
      });
      const volM3 = buoy.displacedVolumeM3.toFixed(1);
      const liftKn = buoy.liftKn;
      const draftRedFt = buoy.draftReductionFt.toFixed(2);
      const clearanceFt = buoy.shoalClearanceFt.toFixed(2);

      return [
        {
          label: "Chamber Operating State",
          value: (p.inflationPct ?? 75) > 10 ? "EXPANDED DISPLACEMENT" : "CONTRACTED STOWED",
          badgeColor: "emerald",
          unit: "topology",
          primary: true,
          provenance: "source-disclosed",
        },
        {
          label: "Buoyant Lift Force",
          value: liftKn.toString(),
          unit: "kN",
          badgeColor: "cyan",
          progressPct: clampProgress((liftKn / 450) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Draft Reduction",
          value: draftRedFt,
          unit: "ft",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(draftRedFt) / 3.0) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Shoal Keel Clearance",
          value: `${clearanceFt}`,
          unit: "ft",
          badgeColor: Number(clearanceFt) > 0 ? "emerald" : "rose",
          progressPct: Math.min(100, Math.max(0, (Number(clearanceFt) + 1.5) * 35)),
          provenance: "scenario-modern",
        },
        {
          label: "Displaced Air Volume",
          value: volM3,
          unit: "m³",
          badgeColor: "indigo",
          progressPct: clampProgress((Number(volM3) / 45) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Hull Draft",
          value: `${buoy.hullDraftFt} ft`,
          unit: "d",
          badgeColor: "amber",
          progressPct: clampProgress((buoy.hullDraftFt / 8) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Waterplane Area",
          value: `${buoy.waterplaneAreaSqFt} ft²`,
          unit: "A_wp",
          badgeColor: "cyan",
          progressPct: clampProgress(100),
          provenance: "scenario-modern",
        },
      ];
    },
  },
  // Preserved source-bound model. Publication remains held pending independent
  // figure-crop review; metrics describe only the illustrated record system.
  "_legacy-unpublished-us-2292387-lamarr-frequency-hopping": {
    domain: "electromagnetics_flux",
    domainTitle: "Synchronized record-controlled radio tuning",
    equationName: "Record position and receiver matching",
    governingEquation:
      "r_tx(t) = r_rx(t),\\quad r_tx \\in \\{A, B, C, D, E, F, G\\},\\quad r_rx \\in \\{D, E, F, G\\}",
    engineMethod: "stepLamarrFrequencyHopping (source-controlled Lamarr record model)",
    controls: [
      {
        id: "recordPosition",
        label: "Matched record position",
        min: 0,
        max: 6,
        step: 1,
        defaultValue: 0,
        unit: "row",
      },
      {
        id: "commandTone",
        label: "Command tone (100 or 500 cycles)",
        min: 100,
        max: 500,
        step: 400,
        defaultValue: 100,
        unit: "cycles",
      },
    ],
    computeMetrics: (p) => {
      const position = Math.max(0, Math.min(6, Math.round(p.recordPosition ?? 0)));
      const row = "ABCDEFG"[position] ?? "A";
      const receiverTuned = position >= 3;
      const tone = p.commandTone === 500 ? "500" : "100";

      return [
        {
          label: "Transmitter record row",
          value: row,
          unit: "A–G",
          badgeColor: "indigo",
          progressPct: clampProgress((position / 6) * 100),
        },
        {
          label: "Receiver match",
          value: receiverTuned ? "D–G" : "A–C false",
          unit: "channels",
          badgeColor: "emerald",
          progressPct: receiverTuned ? 100 : 0,
        },
        {
          label: "Command label",
          value: tone,
          unit: "cycles",
          badgeColor: "cyan",
          progressPct: tone === "500" ? 100 : 20,
        },
        {
          label: "Warning lamp 43",
          value: receiverTuned ? "off" : "on",
          unit: "row H",
          badgeColor: "amber",
          progressPct: receiverTuned ? 0 : 100,
        },
      ];
    },
    pedagogicalInsight:
      "The illustrated apparatus advances matched perforated records together. Rows A–G select seven transmitter tuning positions, while the receiver is effective on D–G and deliberately ineffective on A–C; a 100-cycle or 500-cycle command then advances the rudder by one discrete step.",
  },
  "_legacy-unpublished-us-3541541-engelbart-mouse": {
    domain: "continuum_elasticity",
    domainTitle: "Orthogonal Coordinate Resolver Kinematics & Potentiometer D/A",
    equationName: "Dual Knife-Edge Orthogonal Coordinate Integration",
    governingEquation:
      "\\Delta X = R \\cdot \\Delta \\theta_x \\quad \\text{and} \\quad \\Delta Y = R \\cdot \\Delta \\theta_y \\quad (\\vec{v}_x \\perp \\vec{v}_y)",
    engineMethod: "FrankenSimEngine.stepEngelbartMouse",
    controls: [
      {
        id: "mouseSpeed",
        label: "Manual Tracking Speed",
        min: 100,
        max: 800,
        step: 25,
        defaultValue: 350,
        unit: "mm/s",
      },
      {
        id: "wheelRadius",
        label: "Knife-Edge Wheel Radius",
        min: 6,
        max: 18,
        step: 0.5,
        defaultValue: 10.0,
        unit: "mm",
      },
      {
        id: "pulsesPerRev",
        label: "Resolver Pulses per Revolution",
        min: 20,
        max: 400,
        step: 4,
        defaultValue: 200,
        unit: "ppr",
      },
    ],
    computeMetrics: (p) => {
      const mouse = stepEngelbartMouse({
        mouseSpeed: p.mouseSpeed,
        wheelRadius: p.wheelRadius,
        pulsesPerRev: p.pulsesPerRev,
      });
      const omegaRps = mouse.omegaRadPerS.toFixed(1);
      const dpi = mouse.dpi;

      return [
        {
          label: "Coordinate Resolution",
          value: dpi.toString(),
          unit: "DPI",
          badgeColor: "cyan",
          progressPct: clampProgress((dpi / 350) * 100),
        },
        {
          label: "Wheel Angular Velocity",
          value: omegaRps,
          unit: "rad/s",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(omegaRps) / 80) * 100),
        },
        {
          label: "Resolver Orthogonality",
          value: "90.0",
          unit: "deg",
          badgeColor: "indigo",
          progressPct: clampProgress(100),
        },
        {
          label: "Tracking Slew Rate",
          value: mouse.slewPxPerS.toString(),
          unit: "px/s",
          badgeColor: "purple",
          progressPct: Math.min(100, (mouse.slewPxPerS / 3000) * 100),
        },
        {
          label: "Pulse Pitch",
          value: `${mouse.mmPerPulse} mm`,
          unit: "Δx",
          badgeColor: "amber",
          progressPct: clampProgress(100),
        },
        {
          label: "Counts / mm",
          value: String(mouse.countsPerMm),
          unit: "1/mm",
          badgeColor: "indigo",
          progressPct: Math.min(100, (mouse.countsPerMm / 10) * 100),
        },
        {
          label: "Pulse Rate",
          value: String(mouse.pulseRateHz),
          unit: "Hz",
          badgeColor: "cyan",
          progressPct: Math.min(100, (mouse.pulseRateHz / 2000) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Two sharp metal wheels mounted at right angles roll independently across the desk: each wheel turns a variable potentiometer wiper, decomposing continuous 2D planar motion into orthogonal $(X, Y)$ signals.",
  },
  "us-1219881-sundback-zipper": {
    domain: "mechanical_kinematics",
    domainTitle: "Interlocking Scoop Cam Kinematics, Bending Flexibility & Burst Resistance",
    equationName: "Cam Wedge Normal Force Resolution & Interlocking Shear Resistance",
    governingEquation:
      "F_{\\text{engage}} = \\frac{F_{\\text{pull}}}{2\\sin\\theta + \\mu}, \\qquad F_{\\text{burst}} = 2 N_{\\text{engaged}} A_{\\text{shear}} \\tau_{\\text{max}} \\cos(\\theta_{\\text{flex}})",
    engineMethod: "FrankenSimEngine.stepSundbackZipper",
    controls: [
      {
        id: "sliderPositionPct",
        label: "Slider Position",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: SUNDBACK_ZIPPER_DEFAULT_CONTROLS.sliderPositionPct,
        unit: "%",
        provenance: "scenario-reader",
      },
      {
        id: "pullForceN",
        label: "Pull Tab Force",
        min: 1,
        max: 50,
        step: 1,
        defaultValue: SUNDBACK_ZIPPER_DEFAULT_CONTROLS.pullForceN,
        unit: "N",
        provenance: "scenario-modern",
      },
      {
        id: "lateralTensionN",
        label: "Transverse Tension",
        min: 0,
        max: 200,
        step: 5,
        defaultValue: SUNDBACK_ZIPPER_DEFAULT_CONTROLS.lateralTensionN,
        unit: "N",
        provenance: "scenario-modern",
      },
      {
        id: "flexAngleDeg",
        label: "Bending / Folding Angle",
        min: 0,
        max: 180,
        step: 5,
        defaultValue: SUNDBACK_ZIPPER_DEFAULT_CONTROLS.flexAngleDeg,
        unit: "deg",
        provenance: "scenario-reader",
      },
      {
        id: "toothDensityTpi",
        label: "Tooth Density",
        min: 8,
        max: 14,
        step: 1,
        defaultValue: SUNDBACK_ZIPPER_DEFAULT_CONTROLS.toothDensityTpi,
        unit: "TPI",
        provenance: "scenario-modern",
      },
      {
        id: "staggerAligned",
        label: "Claim 1 Stagger Alignment",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "state",
        provenance: "source-disclosed",
      },
    ],
    computeMetrics: (p: Record<string, number | boolean>): PhysicsMetric[] => {
      const controls = readSundbackZipperControls(p);
      const tel = stepSundbackZipperSi(controls);
      return [
        {
          label: "Engaged Scoops",
          value: `${tel.engagedTeeth} / ${tel.totalTeeth}`,
          unit: "teeth",
          badgeColor: "cyan",
          progressPct: tel.engagementFraction * 100,
          provenance: "source-disclosed",
        },
        {
          label: "Cam Wedge Force",
          value: tel.wedgeNormalForceN.toFixed(1),
          unit: "N",
          badgeColor: "emerald",
          progressPct: clampProgress((tel.wedgeNormalForceN / 60) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Burst Resistance",
          value: tel.burstResistanceN.toFixed(1),
          unit: "N",
          badgeColor: tel.burstRefusal ? "rose" : "amber",
          progressPct: clampProgress((tel.burstResistanceN / 300) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Tape Core Strain",
          value: tel.tapeStrainPct.toFixed(1),
          unit: "%",
          badgeColor: tel.tapeStrainPct > 8 ? "rose" : "indigo",
          progressPct: clampProgress((tel.tapeStrainPct / 12) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Lock Status",
          value: tel.burstRefusal
            ? "RUPTURE"
            : tel.isStalled
              ? "COLLISION"
              : tel.isLocked
                ? "SECURE LOCK"
                : "OPEN",
          unit: "state",
          badgeColor:
            tel.burstRefusal || tel.isStalled ? "rose" : tel.isLocked ? "emerald" : "amber",
          provenance: "source-disclosed",
        },
      ];
    },
    pedagogicalInsight:
      "Identical metal scoops with convex upper projections and concave lower pockets are offset by half a tooth pitch ($p/2$) along corded fabric tapes. Squeezing the teeth together through a converging Y-cam causes each scoop to nest positively inside the hollow socket of its opposing neighbor, providing extreme transverse burst strength while allowing 180° folding flexibility.",
  },
  "us-1773980-farnsworth-tv": {
    domain: "semiconductor_carrier",
    domainTitle: "Relativistic Photo-Cathode Lorentz Deflection Dissector Tube",
    equationName: "Lorentz Force Magnetic Scanline Deflection",
    governingEquation:
      "\\vec{F} = -e (\\vec{E} + \\vec{v} \\times \\vec{B}) \\quad \\text{and} \\quad r = \\frac{m_e v}{e B}",
    engineMethod: "FrankenSimEngine.stepFarnsworthTV",
    controls: [
      {
        id: "anodeVoltage",
        label: "Anode Accelerating Potential",
        min: 600,
        max: 6000,
        step: 50,
        defaultValue: 1500,
        unit: "V",
      },
      {
        id: "coilCurrent",
        label: "Deflection Coils Current",
        min: 0.1,
        max: 0.8,
        step: 0.02,
        defaultValue: 0.42,
        unit: "A",
      },
      {
        id: "lightIntensityLux",
        label: "Subject Light Intensity",
        min: 100,
        max: 2000,
        step: 50,
        defaultValue: 500,
        unit: "Lux",
      },
      {
        id: "horizontalFreqKhz",
        label: "Horizontal Sweep Rate",
        min: 5,
        max: 30,
        step: 0.25,
        defaultValue: 15.75,
        unit: "kHz",
      },
      {
        id: "verticalFreqHz",
        label: "Vertical Sweep Rate",
        min: 30,
        max: 120,
        step: 1,
        defaultValue: 60,
        unit: "Hz",
      },
      {
        id: "scanLines",
        label: "Raster Scan Lines",
        min: 30,
        max: 240,
        step: 10,
        defaultValue: 60,
        unit: "Lines",
      },
    ],
    computeMetrics: (p) => {
      const v = p.anodeVoltage ?? 1500;
      const i = p.coilCurrent ?? 0.42;
      const hFreq = p.horizontalFreqKhz ?? 15.75;
      const vFreq = p.verticalFreqHz ?? 60;
      const lux = p.lightIntensityLux ?? 500;
      const gauss = FrankenSimEngine.farnsworthDeflectionGauss(i);
      const beam = FrankenSimEngine.stepFarnsworthTv(voltsToKv(v), gauss, lux);
      const beamVelocity = beam.electronVelocityMegaMps.toFixed(1);
      const derivedScanLines = Math.round((hFreq * 1000) / vFreq);
      const photoUa = beam.photocathodeCurrentUa.toFixed(1);

      return [
        {
          label: "Electron Beam Speed",
          value: `${beamVelocity} × 10⁶`,
          unit: "m/s",
          badgeColor: "cyan",
          progressPct: clampProgress((Number(beamVelocity) / 35) * 100),
        },
        {
          label: "Gyro Radius",
          value: beam.gyroRadiusMm.toFixed(1),
          unit: "mm",
          badgeColor: "emerald",
          progressPct: Math.min(100, (beam.gyroRadiusMm / 40) * 100),
        },
        {
          label: "Derived Raster Lines",
          value: derivedScanLines.toString(),
          unit: "lines",
          badgeColor: "indigo",
          progressPct: clampProgress((derivedScanLines / 600) * 100),
        },
        {
          label: "Photocathode Current",
          value: photoUa,
          unit: "µA",
          badgeColor: "purple",
          progressPct: Math.min(100, (Number(photoUa) / 90) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "An optical image focused onto a potassium hydride photo-cathode emits a continuous electron image; orthogonal electromagnetic deflection coils sweep the entire electron cloud past an anode aperture.",
  },
  "us-4136359-wozniak-apple": {
    domain: "semiconductor_carrier",
    domainTitle: "Two-Phase Non-Conflicting DRAM Bus Arbitration & Video Sync",
    equationName: "Time-Multiplexed CPU vs. Video Scanline Bus Access",
    governingEquation:
      "\\text{Bus Access} = \\begin{cases} \\text{6502 CPU Read/Write} & \\phi_1 = 1 \\\\ \\text{Video Scanline Fetch} & \\phi_2 = 1 \\end{cases} \\quad (f_{\\text{master}} = 14.31818\\ \\text{MHz})",
    engineMethod: "FrankenSimEngine.stepWozniakApple",
    controls: [
      {
        id: "crystalFreq",
        label: "Master Quartz Crystal",
        min: 7.0,
        max: 28.0,
        step: 0.1,
        defaultValue: 14.318,
        unit: "MHz",
      },
      {
        id: "ramCapacityKb",
        label: "RAM Capacity",
        min: 4,
        max: 48,
        step: 4,
        defaultValue: 48,
        unit: "KB",
      },
    ],
    computeMetrics: (p) => {
      const apple = stepWozniakApple({
        crystalFreq: p.crystalFreq,
        ramCapacityKb: p.ramCapacityKb,
      });
      const cpuClock = apple.cpuClockMhz.toFixed(3);
      const colorSubcarrier = apple.colorSubcarrierMhz.toFixed(3);
      const dramWindow = apple.dramWindowNs.toFixed(1);

      return [
        {
          label: "Microprocessor Clock",
          value: cpuClock,
          unit: "MHz",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(cpuClock) / 1.5) * 100),
        },
        {
          label: "NTSC Color Burst",
          value: colorSubcarrier,
          unit: "MHz",
          badgeColor: "purple",
          progressPct: clampProgress((Number(colorSubcarrier) / 4.5) * 100),
        },
        {
          label: "DRAM Access Window",
          value: dramWindow,
          unit: "ns",
          badgeColor: "cyan",
          progressPct: clampProgress((Number(dramWindow) / 600) * 100),
        },
        {
          label: "Bus Contention Wait",
          value: "0",
          unit: "cycles",
          badgeColor: "indigo",
          progressPct: clampProgress(100),
        },
        {
          label: "Demo Tick",
          value: `${apple.busTickIntervalMs} ms`,
          unit: "Δt",
          badgeColor: "amber",
          progressPct: clampProgress(100),
        },
        {
          label: "Visual Φ2",
          value: `${apple.phi2DisplayHz}`,
          unit: "Hz",
          badgeColor: "purple",
          progressPct: clampProgress((apple.phi2DisplayHz / 8) * 100),
        },
        {
          label: "Φ2 CPU Duty",
          value: `${apple.cpuDutyPct}%`,
          unit: "duty",
          badgeColor: "emerald",
          progressPct: clampProgress(apple.cpuDutyPct),
        },
      ];
    },
    pedagogicalInsight:
      "A master 14.318 MHz crystal divides down to interleave 6502 CPU memory access during clock phase $\\phi_1$ and video display fetch during phase $\\phi_2$, eliminating video flicker with zero wait-state contention.",
  },
  "us-4750-howe-sewing-machine": {
    domain: "continuum_elasticity",
    domainTitle: "Eye-Pointed Needle & Reciprocating Shuttle Lockstitch Kinematics",
    equationName: "Lockstitch Loop Interlocking Kinematics",
    governingEquation:
      "x_K(\\theta_C)=-A\\cos\\theta_C,\\qquad \\text{pass}=\\bigl(\\lambda_{loop}\\ge\\lambda_{min}\\bigr)",
    engineMethod: "FrankenSimEngine.stepHoweSewingMachine",
    controls: [
      {
        id: "crankRpm",
        label: "Declared Display Crank",
        min: 60,
        max: 420,
        step: 10,
        defaultValue: 240,
        unit: "RPM",
      },
      {
        id: "stitchPitchMm",
        label: "Declared Display Pitch",
        min: 1.0,
        max: 6.0,
        step: 0.1,
        defaultValue: 3.5,
        unit: "mm",
      },
      {
        id: "loopSlackPct",
        label: "Displayed Loop Slack",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 65,
        unit: "%",
      },
      {
        id: "isCranking",
        label: "Crank Motion",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "",
      },
    ],
    computeMetrics: (p) => {
      const rpm = p.crankRpm ?? 240;
      const feed = p.stitchPitchMm ?? 3.5;
      const loopSlackPct = p.loopSlackPct ?? 65;
      const sew = stepHoweSewingMachine(rpm, loopSlackPct, feed);
      const shuttleHz = sew.stitchFrequencyHz.toFixed(2);
      const stitchLen = feed.toFixed(1);

      return [
        {
          label: "Display Cadence",
          value: sew.stitchesPerMinute.toString(),
          unit: "SPM",
          badgeColor: "cyan",
          progressPct: clampProgress((sew.stitchesPerMinute / 350) * 100),
        },
        {
          label: "Display Shuttle Cycles",
          value: shuttleHz,
          unit: "Hz",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(shuttleHz) / 6) * 100),
        },
        {
          label: "Display Cloth Feed",
          value: `${sew.clothFeedMmPerS} mm/s`,
          unit: "v_feed",
          badgeColor: "amber",
          progressPct: clampProgress((sew.clothFeedMmPerS / 20) * 100),
        },
        {
          label: "Display Crank ω",
          value: `${sew.crankOmegaDegPerS}`,
          unit: "deg/s",
          badgeColor: "purple",
          progressPct: Math.min(100, (sew.crankOmegaDegPerS / 2160) * 100),
        },
        {
          label: "Display Stitch Pitch",
          value: stitchLen,
          unit: "mm",
          badgeColor: "amber",
          progressPct: clampProgress((Number(stitchLen) / 5) * 100),
        },
        {
          label: "Loop Clearance",
          value: sew.maximumLoopClearancePct.toString(),
          unit: "%",
          badgeColor: "indigo",
          progressPct: clampProgress(loopSlackPct),
        },
      ];
    },
    pedagogicalInsight:
      "One shaft orders the curved eye-pointed needle on arm G, lifting-rod W, shuttle K in trough I, and pinned baster-plate H. Cadence, pitch, travel, and clearance are declared display parameters because US 4,750 does not print historical operating values for them.",
  },
  "us-593138-tesla-coil": {
    domain: "electromagnetics_flux",
    domainTitle: "Distributed-Wave Transformer Geometry",
    equationName: "Source-Described Quarter-Wave Secondary",
    governingEquation: "\\lambda=v/f; \\quad \\beta l=2\\pi f l/v; \\quad l_{1/4}=v/(4f)",
    engineMethod: "stepTeslaTransformerSi / fs-flux quarter-wave WASM",
    controls: [
      {
        id: "disturbanceFrequencyHz",
        label: "Electrical Disturbance Frequency",
        min: 500,
        max: 1500,
        step: 25,
        defaultValue: 925,
        unit: "Hz",
      },
      {
        id: "secondaryLengthMiles",
        label: "Developed Secondary Wire Length",
        min: 25,
        max: 75,
        step: 1,
        defaultValue: 50,
        unit: "mi",
      },
      {
        id: "claim1CommonNodeConnected",
        label: "Claim 1 Primary / Secondary / Earth Node",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "",
      },
    ],
    computeMetrics: (p) => {
      const res = stepTeslaTransformerSi(readTeslaTransformerControls(p));

      return [
        {
          label: "Electrical Length",
          value: res.electricalLengthDeg.toFixed(1),
          unit: "deg",
          badgeColor: "purple",
          progressPct: clampProgress((res.electricalLengthDeg / 180) * 100),
        },
        {
          label: "Quarter-Wave Target",
          value: res.quarterWaveLengthMiles.toFixed(2),
          unit: "mi",
          badgeColor: "cyan",
          progressPct: clampProgress((res.quarterWaveLengthMiles / 100) * 100),
        },
        {
          label: "Wire-Length Error",
          value: res.lengthErrorMiles.toFixed(2),
          unit: "mi",
          badgeColor: "amber",
          progressPct: clampProgress(Math.abs(res.lengthErrorMiles) * 4),
        },
        {
          label: "Absolute Potential",
          value: "UNDERDETERMINED",
          unit: "source boundary",
          badgeColor: "emerald",
          progressPct: 0,
        },
      ];
    },
    pedagogicalInsight:
      "US 593,138 prints a checkable example: at 925 Hz and 185,000 mi/s, the wavelength is 200 mi and the quarter-wave secondary is 50 mi. The shared fs-flux kernel computes that distributed-wave geometry; it does not invent voltage, coupling, loss, Q, or discharge length.",
  },
  "us-x9430-colt-revolver": {
    domain: "continuum_elasticity",
    domainTitle: "Pawl-Ratchet Angular Discretization & Internal Ballistic Hoop Stress",
    equationName: "Hoop Stress Limit & 72° Cylinder Indexing",
    governingEquation:
      "\\sigma_{\\text{hoop}} = \\frac{P_{\\text{combustion}} \\cdot r}{t} \\quad \\text{and} \\quad \\Delta \\theta = \\frac{360^\\circ}{N_{\\text{chambers}}} = 72^\\circ",
    engineMethod: "FrankenSimEngine.stepColtRevolver",
    controls: [
      {
        id: "chamberPressure",
        label: "Black Powder Combustion Peak Pressure",
        min: 40,
        max: 140,
        step: 5,
        defaultValue: 85,
        unit: "MPa",
      },
      {
        id: "cockingAngle",
        label: "Hammer Cocking Arc Angle",
        min: 0,
        max: 45,
        step: 1,
        defaultValue: 45,
        unit: "deg",
      },
    ],
    computeMetrics: (p) => {
      const colt = FrankenSimEngine.stepColtRevolver({
        chamberPressureMpa: p.chamberPressure ?? 85,
        cockingAngleDeg: p.cockingAngle ?? 45,
      });
      const hoopStressMpa = colt.hoopStressMpa.toFixed(1);
      const indexAngleDeg = colt.indexAngleDeg.toFixed(1);
      const isLocked = colt.isLocked;
      const muzzleVelocityMps = colt.muzzleVelocityMps;
      const powderGrains = colt.powderGrains;

      return [
        {
          label: "Cylinder Hoop Stress (Model)",
          value: hoopStressMpa,
          unit: "MPa",
          badgeColor: Number(hoopStressMpa) < 180 ? "emerald" : "amber",
          progressPct: clampProgress((Number(hoopStressMpa) / 250) * 100),
          provenance: "scenario-modern",
          provenanceCitation:
            "Modern thin-walled cylinder hoop stress equation under black powder combustion.",
        },
        {
          label: "Cylinder Index Rotation",
          value: `${indexAngleDeg}°`,
          unit: "deg (72° step)",
          badgeColor: "cyan",
          progressPct: clampProgress((Number(indexAngleDeg) / 72) * 100),
          provenance: "source-disclosed",
        },
        {
          label: "Muzzle Exit Velocity (Model)",
          value: muzzleVelocityMps.toString(),
          unit: "m/s",
          badgeColor: "amber",
          progressPct: clampProgress((muzzleVelocityMps / 360) * 100),
          provenance: "scenario-modern",
          provenanceCitation: "Internal ballistics expansion estimate.",
        },
        {
          label: "Cylinder Bolt Lock",
          value: isLocked ? "LOCKED" : "INDEXING",
          unit: "detent",
          badgeColor: isLocked ? "emerald" : "amber",
          progressPct: clampProgress(isLocked ? 100 : 30),
          provenance: "source-disclosed",
        },
        {
          label: "Muzzle Energy (Model)",
          value: `${colt.muzzleEnergyJoules} J`,
          unit: "J",
          badgeColor: "purple",
          progressPct: clampProgress((colt.muzzleEnergyJoules / 400) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Powder Charge (Scenario)",
          value: `${powderGrains} gr`,
          unit: "grains",
          badgeColor: "amber",
          progressPct: clampProgress((powderGrains / 60) * 100),
          provenance: "scenario-reader",
        },
      ];
    },
    pedagogicalInsight:
      "Drawing back the hammer with the thumb lifts the pawl to advance the ratchet 72 degrees, while simultaneously withdrawing and re-engaging the perimeter bolt to lock the next chamber directly into concentric alignment with the stationary rifled barrel.",
  },
  "us-31128-otis-elevator": {
    domain: "multibody_topology",
    domainTitle: "Connected Hoist, Reversing-Belt, Brake, and Hook-Rack Topology",
    equationName: "Claimed Discrete Interlocks and Opposite Counterpoise Motion",
    governingEquation:
      "\\neg G_{\\text{taut}} \\land C_1 \\Rightarrow f \\hookrightarrow C; \\quad \\text{stop} \\Rightarrow (O,P) \\to (J,K) \\land Z \\dashv L; \\quad dq_R=-dq_D",
    engineMethod: "stepOtis1861Topology / fs-otis-wasm",
    controls: [
      {
        id: "driveCommand",
        label: "Drive Command (P / Idle / O)",
        min: -1,
        max: 1,
        step: 1,
        defaultValue: 0,
        unit: "state",
        provenance: "scenario-reader",
      },
      {
        id: "displayRatePct",
        label: "Declared Display Rate",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 60,
        unit: "%",
        provenance: "scenario-reader",
      },
      {
        id: "ropeGIntegrityPct",
        label: "Displayed Rope G Integrity",
        min: 0,
        max: 100,
        step: 100,
        defaultValue: 100,
        unit: "%",
        provenance: "scenario-reader",
      },
      {
        id: "stopRopePulled",
        label: "Stop Rope U",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        unit: "%",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics: (p) => {
      const otis = stepOtis1861Topology(readOtisTopologyControls(p));
      return [
        {
          label: "Operating Mode",
          value: otis.mechanismMode,
          unit: "state",
          badgeColor: otis.freeFallCounterfactual ? "rose" : "emerald",
          progressPct: otis.freeFallCounterfactual ? 0 : 100,
          provenance: "source-disclosed",
        },
        {
          label: "Belt O / P",
          value: otis.straightBeltOWorking
            ? "O working"
            : otis.crossBeltPWorking
              ? "P working"
              : "J/K idle",
          unit: "topology",
          badgeColor: "cyan",
          progressPct: otis.bothBeltsIdle ? 0 : 100,
          provenance: "source-disclosed",
        },
        {
          label: "Brake Shoe Z",
          value: otis.brakeZEngaged ? "ON L" : "RELEASED",
          unit: "interlock",
          badgeColor: otis.brakeZEngaged ? "emerald" : "purple",
          progressPct: otis.brakeZEngaged ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Hooks f / Racks C",
          value: otis.pawlsFEngaged ? "LOCKED" : "CLEAR",
          unit: "Claim 1",
          badgeColor: otis.pawlsFEngaged ? "amber" : "emerald",
          progressPct: otis.pawlsFEngaged ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Counterpoise Q / R",
          value: otis.claim4CounterpoiseTopologySatisfied ? "OPPOSED TO D" : "INVERTED",
          unit: "Claim 4",
          badgeColor: otis.claim4CounterpoiseTopologySatisfied ? "emerald" : "rose",
          progressPct: otis.claim4CounterpoiseTopologySatisfied ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Platform D",
          value: `${Math.round(otis.platformPositionNormalized * 100)}%`,
          unit: "declared display coordinate",
          badgeColor: "cyan",
          progressPct: clampProgress(otis.platformPositionNormalized * 100),
          provenance: "topology-normalized",
        },
      ];
    },
    pedagogicalInsight:
      "The 1861 grant is a whole hoisting system: straight belt O raises, crossed belt P lowers, shipper S and rope T idle both belts while shoe Z brakes working pulley L, rope Q counterpoises D, and a failed lifting rope G lets platform weight lock hook pawls f into racks C. The source provides topology—not load, force, timing, stopping distance, or power.",
  },
  // Retained non-serving later-Linotype model. The exact US 313,224 route is
  // assigned a source-reading guide below until its full manual edition passes QA.
  "_legacy-unpublished-us-313224-mergenthaler-linotype": {
    domain: "materials_kinetics",
    domainTitle: "Binary Matrix Keyway Demultiplexing & Eutectic Solidification",
    equationName: "7-Bit Binary Matrix Address & Solidification Time",
    governingEquation:
      "B = \\sum_{i=0}^6 b_i 2^i \\quad \\text{and} \\quad t_{\\text{solid}} = C \\left(\\frac{V}{A}\\right)^2 \\left(T_{\\text{pour}} - T_{\\text{mold}}\\right)",
    engineMethod: "FrankenSimEngine.stepMergenthalerLinotype",
    controls: [
      {
        id: "matrixRate",
        label: "Keyboard Typesetting Speed",
        min: 20,
        max: 120,
        step: 5,
        defaultValue: 60,
        unit: "char/min",
      },
      {
        id: "spacebandWedge",
        label: "Spaceband Justification Wedge",
        min: 2.0,
        max: 12.0,
        step: 0.5,
        defaultValue: 6.5,
        unit: "mm",
      },
      {
        id: "potTemp",
        label: "Lead Pot Temperature",
        min: 220,
        max: 300,
        step: 2,
        defaultValue: 260,
        unit: "°C",
      },
      {
        id: "lineLengthPicas",
        label: "Column Measure Width",
        min: 8,
        max: 26,
        step: 1,
        defaultValue: 13,
        unit: "picas",
      },
    ],
    computeMetrics: (p) => {
      const rate = p.matrixRate ?? 60;
      const wedge = p.spacebandWedge ?? 6.5;
      const temp = p.potTemp ?? 260;
      const linotype = stepMergenthalerLinotype({
        matrixRatePerMin: rate,
        spacebandWedgeMm: wedge,
        potTempC: temp,
      });
      const justWidth = linotype.justificationWidthMm.toFixed(1);
      const solidMs = linotype.solidificationTimeMs;
      const hardness = linotype.isEutecticTemp ? "24 HB (Optimal)" : "18 HB (Sub-optimal)";

      return [
        {
          label: "Justified Line Width",
          value: `${justWidth} mm`,
          unit: "width",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(justWidth) / 140) * 100),
        },
        {
          label: "Lines per Hour",
          value: `${linotype.linesPerHour}`,
          unit: "lph",
          badgeColor: "cyan",
          progressPct: clampProgress((linotype.linesPerHour / 120) * 100),
        },
        {
          label: "Matrices per Hour",
          value: `${linotype.charsPerHour}`,
          unit: "cph",
          badgeColor: "purple",
          progressPct: clampProgress((linotype.charsPerHour / 4000) * 100),
        },
        {
          label: "Slug Solidification",
          value: `${solidMs} ms`,
          unit: "t_solid",
          badgeColor: "cyan",
          progressPct: Math.min(100, (solidMs / 600) * 100),
        },
        {
          label: "Lead-Alloy Hardness",
          value: hardness,
          unit: "HB",
          badgeColor: temp >= linotype.alloyMeltPointC && temp <= 275 ? "emerald" : "amber",
          progressPct: clampProgress(temp >= linotype.alloyMeltPointC && temp <= 275 ? 95 : 60),
        },
        {
          label: "Distributor Sorting",
          value: (rate / 60).toFixed(2),
          unit: "Hz",
          badgeColor: "indigo",
          progressPct: clampProgress((rate / 120) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Wedge-shaped two-part spacebands expand between words until the composed line locks tightly against fixed column jaws, while a binary keyway rail sorts recirculating brass matrices back into 90 magazine channels.",
  },
  "us-319596-maxim-machine-gun": {
    domain: "multibody_topology",
    domainTitle: "Muzzle-Gas Expansion Sleeve & Direction-Reversing Breech Linkage",
    equationName: "Muzzle Gas Impulse & Crankshaft Cross-Head Kinematics",
    governingEquation:
      "x_{\\text{breech}}(\\theta) = r_{\\text{crank}} (1 - \\cos\\theta), \\quad \\dot{x}_{\\text{rods}} = -\\left(\\frac{L_2}{L_1}\\right) \\dot{x}_{\\text{sleeve}}, \\quad U_{\\text{spring}} = \\frac{1}{2} k_\\theta \\theta_{\\text{wind}}^2",
    engineMethod: "FrankenSimEngine.stepMaximMachineGun",
    controls: [
      {
        id: "cyclePhase",
        label: "Kinematic Mechanism Phase",
        min: 0,
        max: 360,
        step: 5,
        defaultValue: 0,
        unit: "deg",
        provenance: "scenario-reader",
      },
      {
        id: "gasImpulsePct",
        label: "Muzzle Gas Expansion Pressure (Scenario)",
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 75,
        unit: "%",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics: (p) => {
      const maxim = FrankenSimEngine.stepMaximMachineGun({
        cyclePhaseDeg: p.cyclePhase ?? (p.firingRate !== undefined ? 0 : 0),
        gasImpulsePct: p.gasImpulsePct ?? 75,
      });

      return [
        {
          label: "Barrel Mounting",
          value: "FIXED BARREL B",
          unit: "mount",
          badgeColor: "emerald",
          progressPct: clampProgress(100),
          provenance: "source-disclosed",
        },
        {
          label: "Muzzle Sleeve State",
          value:
            maxim.sleeveForwardMm > 1
              ? `FORWARD (${maxim.sleeveForwardMm.toFixed(1)} mm)`
              : "IN BATTERY",
          unit: "sleeve l",
          badgeColor: maxim.sleeveForwardMm > 1 ? "amber" : "emerald",
          progressPct: clampProgress((maxim.sleeveForwardMm / 24) * 100),
          provenance: "source-disclosed",
        },
        {
          label: "Breech-Block Position",
          value: maxim.breechOpenMm > 2 ? `OPEN (${maxim.breechOpenMm.toFixed(1)} mm)` : "CLOSED",
          unit: "block C",
          badgeColor: maxim.breechOpenMm > 2 ? "cyan" : "emerald",
          progressPct: clampProgress((maxim.breechOpenMm / 48) * 100),
          provenance: "source-disclosed",
        },
        {
          label: "Reversing Levers",
          value: `${maxim.leverAngleDeg.toFixed(1)}°`,
          unit: "deg",
          badgeColor: "purple",
          progressPct: clampProgress((maxim.leverAngleDeg / 18) * 100),
          provenance: "source-disclosed",
        },
        {
          label: "Volute Return Spring",
          value:
            maxim.springWoundPct > 5 ? `WOUND (${maxim.springWoundPct.toFixed(0)}%)` : "UNWOUND",
          unit: "spring k",
          badgeColor: maxim.springWoundPct > 5 ? "amber" : "emerald",
          progressPct: clampProgress(maxim.springWoundPct),
          provenance: "source-disclosed",
        },
        {
          label: "Firing & Sear Mechanism",
          value: maxim.searState,
          unit: "sear h",
          badgeColor: maxim.searState === "COCKED" ? "amber" : "emerald",
          progressPct: clampProgress(maxim.searState === "COCKED" ? 100 : 30),
          provenance: "source-disclosed",
        },
      ];
    },
    pedagogicalInsight:
      "Expanding muzzle gases push sleeve l forward along fixed barrel B. Reversing levers n and rods c′ invert this forward displacement into rearward travel of cross-head d and breech-block C, winding volute spring k to power the forward return stroke.",
  },
  "us-361931-daimler-engine": {
    domain: "mechanical_transport",
    domainTitle: "Marine Ahead/Astern Coupling and Cooling Arrangement",
    equationName: "Source-Stated Sliding-Shaft Drive Selection",
    governingEquation:
      "x_b > 0 \\Rightarrow a\\,a^2\\;\\text{engaged}; \\qquad x_b < 0 \\Rightarrow e^{\\prime},e^2\\;\\text{engage}\\;a^2,c",
    engineMethod:
      "FrankenSimEngine.stepDaimlerMarineApparatus (fs-mbd prismatic-joint WASM after load; typed TypeScript fallback; normalized source topology only)",
    controls: [
      {
        id: "shaftPosition",
        label: "Longitudinal Propeller-Shaft Position",
        min: -1,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "astern / neutral / ahead",
      },
      {
        id: "coolingPumpEnabled",
        label: "Centrifugal Cooling Pump u",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        unit: "off / on",
      },
    ],
    computeMetrics: (p) => {
      const shaftPosition = Math.max(-1, Math.min(1, Math.round(p.shaftPosition ?? 1)));
      const coolingPumpEnabled = (p.coolingPumpEnabled ?? 0) > 0;
      const state = FrankenSimEngine.stepDaimlerMarineApparatus(shaftPosition, coolingPumpEnabled);
      const driveState = state.aheadCouplingEngaged
        ? "ahead"
        : state.asternGearingEngaged
          ? "astern"
          : "neutral";

      return [
        {
          label: "Drive Selection",
          value: driveState,
          unit: "reader control",
          badgeColor: driveState === "neutral" ? "amber" : "emerald",
          progressPct: driveState === "ahead" ? 100 : driveState === "astern" ? 0 : 50,
        },
        {
          label: "Ahead Contact",
          value: state.aheadCouplingEngaged ? "coupling a / a²" : "open",
          unit: "source labels",
          badgeColor: "cyan",
          progressPct: state.aheadCouplingEngaged ? 100 : 0,
        },
        {
          label: "Astern Contact",
          value: state.asternGearingEngaged ? "disks e¹ / e² with a² / c" : "open",
          unit: "source labels",
          badgeColor: "indigo",
          progressPct: state.asternGearingEngaged ? 100 : 0,
        },
        {
          label: "Cooling Circulation",
          value: state.coolingPumpActive
            ? "fore-and-aft pipes s¹ / s² + pump u"
            : "fore-and-aft pipes s¹ / s²",
          unit: "source alternatives",
          badgeColor: "purple",
          progressPct: state.coolingPumpActive ? 100 : 0,
        },
      ];
    },
    pedagogicalInsight:
      "US 361,931 is a marine-installation patent: longitudinal propeller-shaft movement selects an ahead friction coupling or an astern reversing train, while the grant separately describes steering, thrust support, outside-water cooling, starting, and high-to-low-pressure gas storage. It prints no motor speed, power, efficiency, or road-vehicle differential.",
  },
  "us-388850-eastman-kodak": {
    domain: "optics_waves",
    domainTitle: "Hyperfocal Fixed-Focus Optics & Logarithmic Exposure Law",
    equationName: "Hyperfocal Distance & Exposure Value (EV)",
    governingEquation:
      "H = \\frac{f^2}{N \\cdot c} + f \\quad \\text{and} \\quad \\text{EV} = \\log_2\\left(\\frac{N^2}{t}\\right)",
    engineMethod: "FrankenSimEngine.stepEastmanKodak",
    controls: [
      {
        id: "shutterSpeed",
        label: "Barrel Shutter Speed",
        min: 0.01,
        max: 0.1,
        step: 0.01,
        defaultValue: 0.05,
        unit: "s",
        provenance: "scenario-reader",
      },
      {
        id: "apertureStop",
        label: "Lens Aperture (f-number)",
        min: 8,
        max: 16,
        step: 1,
        defaultValue: 9,
        unit: "f/#",
        provenance: "scenario-reader",
      },
      {
        id: "subjectDist",
        label: "Subject Distance",
        min: 0.5,
        max: 8.0,
        step: 0.2,
        defaultValue: 3.0,
        unit: "m",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics: (p) => {
      const raw = p.shutterSpeed ?? 0.05;
      const t = raw > 1 ? 1 / raw : raw;
      const kodak = FrankenSimEngine.stepEastmanKodak({
        shutterSpeedSec: t,
        apertureFNumber: p.apertureStop ?? 9,
        subjectDistanceM: p.subjectDist ?? 3.0,
      });

      return [
        {
          label: "Hyperfocal Point",
          value: `${kodak.hyperfocalM.toFixed(2)} m`,
          unit: "H",
          badgeColor: "emerald",
          progressPct: clampProgress((kodak.hyperfocalM / 15) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Near Focus Limit",
          value: `${kodak.dofNearM.toFixed(2)} m`,
          unit: "D_near",
          badgeColor: "cyan",
          progressPct: clampProgress((kodak.dofNearM / 5) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Exposure Value (EV)",
          value: `EV ${kodak.exposureValueEv.toFixed(2)}`,
          unit: "EV",
          badgeColor: "indigo",
          progressPct: clampProgress((kodak.exposureValueEv / 15) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Focus Status",
          value: kodak.isInFocus ? "SHARP (IN FOCUS)" : "BLURRED (TOO CLOSE)",
          unit: "status",
          badgeColor: kodak.isInFocus ? "emerald" : "rose",
          progressPct: clampProgress(kodak.isInFocus ? 100 : 25),
          provenance: "scenario-modern",
        },
        {
          label: "Fixed Doublet",
          value: `${kodak.focalLengthMm} mm`,
          unit: "f",
          badgeColor: "amber",
          progressPct: clampProgress(100),
          provenance: "scenario-modern",
        },
        {
          label: "Circular Frame",
          value: `${kodak.filmFormatInches} in`,
          unit: "format",
          badgeColor: "cyan",
          progressPct: clampProgress(100),
          provenance: "scenario-modern",
        },
        {
          label: "Shutter Flash",
          value: `${kodak.flashDisplayMs} ms`,
          unit: "t_shut",
          badgeColor: "amber",
          progressPct: Math.min(100, (kodak.flashDisplayMs / 200) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Barrel ω",
          value: `${kodak.barrelOmegaRadPerS}`,
          unit: "rad/s",
          badgeColor: "cyan",
          progressPct: Math.min(100, (kodak.barrelOmegaRadPerS / 700) * 100),
          provenance: "scenario-modern",
        },
      ];
    },
    pedagogicalInsight:
      "A fixed 57mm f/9 doublet set at its hyperfocal distance renders everything from 1.2 meters to optical infinity in sharp focus, eliminating viewfinders and focusing bellows.",
  },
  // Retained non-serving tabulator performance model. The exact US 395,781
  // route receives the source-reading guide below pending full editorial QA.
  "_legacy-unpublished-us-395781-hollerith-tabulating": {
    domain: "electromagnetics_flux",
    domainTitle: "Punched Card Matrix Logic & Electromagnetic Solenoid Accumulators",
    equationName: "Electromagnetic Solenoid Force & Inductive Time Constant",
    governingEquation:
      "F_{\\text{mag}} = \\frac{(N I)^2 \\mu_0 A}{2 g^2} \\quad \\text{and} \\quad \\tau = \\frac{L}{R}",
    engineMethod: "FrankenSimEngine.stepHollerithTabulating",
    controls: [
      {
        id: "cardsPerMin",
        label: "Tabulating Feed Speed",
        min: 20,
        max: 90,
        step: 5,
        defaultValue: 60,
        unit: "cards/min",
      },
      {
        id: "batteryVolts",
        label: "Battery Bank Potential",
        min: 6,
        max: 24,
        step: 1,
        defaultValue: 12,
        unit: "V",
      },
      {
        id: "activeRelays",
        label: "Parallel Accumulator Relays",
        min: 1,
        max: 40,
        step: 1,
        defaultValue: 16,
        unit: "relays",
      },
    ],
    computeMetrics: (p) => {
      const hol = FrankenSimEngine.stepHollerithTabulating({
        cardsPerMin: p.cardsPerMin ?? 60,
        supplyVoltageV: p.batteryVolts ?? 12,
        activeRelays: p.activeRelays ?? 16,
      });
      const cycleMs = hol.cycleTimeMs;
      const forceN = hol.solenoidForceN.toFixed(2);
      const tauMs = hol.inductiveTauMs.toFixed(1);
      const relays = p.activeRelays ?? 16;

      return [
        {
          label: "Reading Cycle Time",
          value: `${cycleMs} ms`,
          unit: "t_cycle",
          badgeColor: "cyan",
          progressPct: clampProgress((cycleMs / 3000) * 100),
        },
        {
          label: "Solenoid Pull Force",
          value: `${forceN} N`,
          unit: "F_mag",
          badgeColor: "emerald",
          progressPct: Math.min(100, (Number(forceN) / 5) * 100),
        },
        {
          label: "Circuit Time Constant",
          value: `${tauMs} ms`,
          unit: "τ",
          badgeColor: "amber",
          progressPct: clampProgress((Number(tauMs) / 30) * 100),
        },
        {
          label: "Active Relays",
          value: `${relays}`,
          unit: "relays",
          badgeColor: "purple",
          progressPct: clampProgress((relays / hol.registerDialCount) * 100),
        },
        {
          label: "Sensing Pins",
          value: `${hol.sensingPinCount}`,
          unit: "pins",
          badgeColor: "indigo",
          progressPct: clampProgress(100),
        },
        {
          label: "Census Register Bank",
          value: `${hol.registerDialCount} dials`,
          unit: "dials",
          badgeColor: "cyan",
          progressPct: clampProgress(100),
        },
        {
          label: "7-hour Day",
          value: hol.cardsPerDay.toLocaleString(),
          unit: "cards",
          badgeColor: "amber",
          progressPct: clampProgress((hol.cardsPerDay / 30000) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Spring-loaded brass pins pass through card perforations into mercury pools, completing 12V circuits that advance dial accumulators and trigger sorting box lids in parallel.",
  },
  "us-470918-reno-escalator": {
    domain: "continuum_elasticity",
    domainTitle: "Inclined Passenger Throughput & Comb-Plate Safety Extraction",
    equationName: "Continuous Transit Throughput & Motor Drive Torque",
    governingEquation:
      "\\dot{N}_{\\text{pass}} = \\frac{v \\cdot w_{\\text{step}}}{L_{\\text{pass}}} \\quad \\text{and} \\quad \\tau = \\frac{R}{\\eta} \\sum m_i g (\\sin\\theta + \\mu \\cos\\theta)",
    engineMethod: "FrankenSimEngine.stepRenoEscalator",
    controls: [
      {
        id: "passengerCount",
        label: "Live Passenger Load",
        min: 0,
        max: 60,
        step: 2,
        defaultValue: 30,
        unit: "riders",
      },
      {
        id: "inclineAngle",
        label: "Truss Incline Angle",
        min: 20,
        max: 35,
        step: 1,
        defaultValue: 25,
        unit: "°",
      },
      {
        id: "beltSpeed",
        label: "Linear Tread Velocity",
        min: 0.3,
        max: 0.75,
        step: 0.05,
        defaultValue: 0.45,
        unit: "m/s",
      },
    ],
    computeMetrics: (p) => {
      const count = p.passengerCount ?? 30;
      const angle = p.inclineAngle ?? 25;
      const v = p.beltSpeed ?? 0.45;
      const reno = stepRenoEscalator({
        passengerCount: count,
        inclineAngleDeg: angle,
        velocityMps: v,
      });
      const throughput = reno.throughputPerHour;
      const torque = reno.motorTorqueNm;
      const powerKw = reno.motorPowerKw.toFixed(2);

      return [
        {
          label: "Hourly Throughput",
          value: `${throughput.toLocaleString()}/hr`,
          unit: "passengers",
          badgeColor: "emerald",
          progressPct: clampProgress((throughput / 10000) * 100),
        },
        {
          label: "Drive Motor Torque",
          value: `${torque} N·m`,
          unit: "τ_motor",
          badgeColor: "indigo",
          progressPct: clampProgress((torque / 6000) * 100),
        },
        {
          label: "Motor Power Draw",
          value: `${powerKw} kW`,
          unit: "P_elec",
          badgeColor: "amber",
          progressPct: clampProgress((Number(powerKw) / 10) * 100),
        },
        {
          label: "Comb-Plate Clearance",
          value: `${reno.combPlateClearanceMm} mm`,
          unit: "δ_gap",
          badgeColor: "cyan",
          progressPct: clampProgress(80),
        },
      ];
    },
    pedagogicalInsight:
      "Longitudinally grooved treads pass smoothly under stationary comb-plate fingers with sub-millimeter clearance, lifting footwear off the incline without danger of pinching.",
  },
  "_legacy-unpublished-us-542846-diesel-engine": {
    domain: "thermodynamics_transport",
    domainTitle: "Adiabatic Compression Auto-Ignition & Constant-Pressure Expansion",
    equationName: "Adiabatic Temperature Rise & Diesel Cycle Efficiency",
    governingEquation:
      "T_2 = T_1 r^{\\gamma - 1} \\quad \\text{and} \\quad \\eta = 1 - \\frac{1}{r^{\\gamma - 1}} \\left[\\frac{r_c^\\gamma - 1}{\\gamma (r_c - 1)}\\right]",
    engineMethod: "FrankenSimEngine.stepDieselEngine",
    controls: [
      {
        id: "compRatio",
        label: "Compression Ratio (r)",
        min: 12,
        max: 22,
        step: 0.5,
        defaultValue: 18,
        unit: ":1",
      },
      {
        id: "blastAirPressure",
        label: "Blast-Air Injector Pressure",
        min: 45,
        max: 85,
        step: 2,
        defaultValue: 65,
        unit: "bar",
      },
      {
        id: "cutoffRatio",
        label: "Fuel Cutoff Ratio (rc)",
        min: 1.2,
        max: 2.2,
        step: 0.1,
        defaultValue: 1.6,
        unit: "ratio",
      },
      {
        id: "engineRpm",
        label: "Engine Shaft Speed",
        min: 60,
        max: 300,
        step: 10,
        defaultValue: 150,
        unit: "RPM",
      },
    ],
    computeMetrics: (p) => {
      const diesel = FrankenSimEngine.stepDieselEngine({
        compressionRatio: p.compRatio ?? 18,
        blastAirPressureBar: p.blastAirPressure ?? 65,
        cutoffRatio: p.cutoffRatio ?? 1.6,
        engineRpm: p.engineRpm ?? 150,
      });
      const tCompC = diesel.tCompressionC;
      const pComp = diesel.pCompBar.toFixed(1);
      const brakeEff = diesel.brakeEfficiencyPct.toFixed(1);

      return [
        {
          label: "Compression Temperature",
          value: `${tCompC} °C`,
          unit: "T_comp",
          badgeColor: tCompC > 210 ? "emerald" : "amber",
          progressPct: clampProgress((tCompC / 800) * 100),
        },
        {
          label: "Peak Cylinder Pressure",
          value: `${pComp} bar`,
          unit: "P_comp",
          badgeColor: "cyan",
          progressPct: clampProgress((Number(pComp) / 80) * 100),
        },
        {
          label: "Brake Thermal Efficiency",
          value: `${brakeEff}%`,
          unit: "η_brake",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(brakeEff) / 50) * 100),
        },
        {
          label: "Auto-Ignition State",
          value: diesel.isAutoIgnition ? "SELF-IGNITING" : "NO IGNITION",
          unit: "state",
          badgeColor: diesel.isAutoIgnition ? "emerald" : "rose",
          progressPct: clampProgress(diesel.isAutoIgnition ? 100 : 0),
        },
        {
          label: "Crank ω",
          value: `${diesel.crankOmegaRadPerS}`,
          unit: "rad/s",
          badgeColor: "cyan",
          progressPct: Math.min(100, (diesel.crankOmegaRadPerS / 30) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Compressing pure air to 18:1 generates 680°C heat, causing atomized fuel droplets injected under high pressure to self-ignite instantaneously and expand at constant pressure.",
  },
  "us-613809-tesla-teleautomaton": {
    domain: "electromagnetics_flux",
    domainTitle: "Tuned RF Resonant Tank & Coherer Logic State Machine",
    equationName: "LC Resonant Frequency & Coherer Demodulation",
    governingEquation:
      "f_0 = \\frac{1}{2\\pi \\sqrt{L C}} \\quad \\text{and} \\quad R_{\\text{coherer}} \\xrightarrow{E_{\\text{RF}}} 50\\,\\Omega",
    engineMethod: "FrankenSimEngine.stepTeslaTeleautomaton",
    controls: [
      {
        id: "rfFrequency",
        label: "RF Transmitter Frequency",
        min: 120,
        max: 180,
        step: 2,
        defaultValue: 150,
        unit: "kHz",
      },
      {
        id: "rudderAngle",
        label: "Rudder Steering Angle",
        min: -35,
        max: 35,
        step: 5,
        defaultValue: 15,
        unit: "°",
      },
      {
        id: "pulseCount",
        label: "RF Pulse Count",
        min: 0,
        max: 20,
        step: 1,
        defaultValue: 3,
        unit: "pulses",
      },
      {
        id: "propellerThrottlePct",
        label: "Electric Motor Throttle",
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 75,
        unit: "%",
      },
    ],
    computeMetrics: (p) => {
      const tele = stepTeslaTeleautomaton({
        rfFrequency: p.rfFrequency,
        rudderAngle: p.rudderAngle,
        propellerThrottlePct: p.propellerThrottlePct,
        pulseCount: p.pulseCount,
      });
      const turnRadiusM = tele.turningRadiusM < 900 ? `${tele.turningRadiusM} m` : "Straight";

      return [
        {
          label: "Coherer Resistance",
          value: tele.isResonant ? `${tele.cohererOhms} Ω (Conducting)` : "100 kΩ (Open)",
          unit: "R_det",
          badgeColor: tele.isResonant ? "emerald" : "amber",
          progressPct: clampProgress(tele.isResonant ? 95 : 10),
        },
        {
          label: "Propulsion Motor",
          value: `${tele.motorThrustN} N`,
          unit: `${Math.round(tele.propellerRpm)} rpm`,
          badgeColor: tele.relayEnergized ? "cyan" : "purple",
          progressPct: clampProgress(tele.motorThrustN),
        },
        {
          label: "Turning Radius",
          value: turnRadiusM,
          unit: "R_turn",
          badgeColor: "indigo",
          progressPct: clampProgress(Math.abs(tele.rudderAngleDeg) > 0 ? 70 : 100),
        },
        {
          label: "Carrier Resonance",
          value: tele.isResonant ? "LOCKED (150 kHz)" : "DETUNED",
          unit: "resonance",
          badgeColor: tele.isResonant ? "emerald" : "rose",
          progressPct: clampProgress(tele.isResonant ? 100 : 20),
        },
      ];
    },
    pedagogicalInsight:
      "Tuned RF waves trigger metal filings in the coherer to fuse and drop resistance, stepping a motorized rotary commutator drum that decodes commands into propulsion and steering.",
  },
  "us-621195-zeppelin-airship": {
    domain: "aerodynamics_mbd",
    domainTitle: "Multi-Cell Archimedean Buoyancy & Space-Frame Bending",
    equationName: "Net Aerostatic Buoyant Lift & Pitch Trim",
    governingEquation:
      "L_{\\text{buoyant}} = V_{\\text{gas}} g (\\rho_{\\text{air}} - \\rho_{\\text{H}_2}) - W_{\\text{struct}}",
    engineMethod: "FrankenSimEngine.stepZeppelinAirship",
    controls: [
      {
        id: "gasInflation",
        label: "Hydrogen Cell Inflation",
        min: 75,
        max: 100,
        step: 1,
        defaultValue: 95,
        unit: "%",
      },
      {
        id: "flightAlt",
        label: "Flight Altitude",
        min: 0,
        max: 2000,
        step: 50,
        defaultValue: 300,
        unit: "m",
      },
      {
        id: "trimWeight",
        label: "Keel Sliding Ballast Position",
        min: -15,
        max: 15,
        step: 1,
        defaultValue: 5,
        unit: "m",
      },
      {
        id: "flightSpeedKnots",
        label: "Cruising Airspeed",
        min: 10,
        max: 45,
        step: 1,
        defaultValue: 28,
        unit: "knots",
      },
    ],
    computeMetrics: (p) => {
      const zep = stepZeppelinAirship({
        gasInflation: p.gasInflation,
        flightAlt: p.flightAlt,
        flightSpeedKnots: p.flightSpeedKnots,
        trimWeight: p.trimWeight,
      });
      const grossKn = zep.grossBuoyancyKn.toFixed(1);
      const netKn = zep.netLiftKn.toFixed(1);
      const pitchDeg = zep.pitchTrimDeg.toFixed(1);

      return [
        {
          label: "Net Aerostatic Lift",
          value: `${netKn} kN`,
          unit: "L_net",
          badgeColor: Number(netKn) > 0 ? "emerald" : "rose",
          progressPct: clampProgress((Number(netKn) / 40) * 100),
        },
        {
          label: "Gross Buoyancy",
          value: `${grossKn} kN`,
          unit: "L_gross",
          badgeColor: "cyan",
          progressPct: clampProgress((Number(grossKn) / 140) * 100),
        },
        {
          label: "Airspeed",
          value: `${zep.flightSpeedMph} mph`,
          unit: "v",
          badgeColor: "amber",
          progressPct: clampProgress((zep.flightSpeedMph / 80) * 100),
        },
        {
          label: "Pitch Trim Angle",
          value: `${pitchDeg}°`,
          unit: "α_trim",
          badgeColor: "indigo",
          progressPct: clampProgress((Math.abs(Number(pitchDeg)) / 10) * 100),
        },
        {
          label: "Useful Payload",
          value: `${zep.usefulPayloadKg} kg`,
          unit: "m_pay",
          badgeColor: "amber",
          progressPct: clampProgress((zep.usefulPayloadKg / 5000) * 100),
        },
        {
          label: "Air Density",
          value: `${zep.ambientAirDensityKgM3.toFixed(3)} kg/m³`,
          unit: "ρ_air",
          badgeColor: "purple",
          progressPct: clampProgress((zep.ambientAirDensityKgM3 / 1.225) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Seventeen independent hydrogen gas cells enclosed inside a rigid duralumin space-frame provide 125 kN of aerostatic lift, protected from solar radiation and wind deformation.",
  },
  "us-727650-linde-air-liquefaction": {
    domain: "thermodynamics_transport",
    domainTitle: "Linde’s counter-current low-temperature apparatus",
    equationName: "Printed temperature-drop relation and regenerative flow path",
    governingEquation: "T - T' = \\frac{(p^2 - p'^2)(289)}{4T^2}",
    engineMethod: "FrankenSimEngine.stepLindeAirLiquefaction",
    controls: [
      {
        id: "inletPressureAtm",
        label: "Compressor Discharge Pressure (p)",
        min: 50,
        max: 200,
        step: 5,
        defaultValue: 75,
        unit: "atm",
        provenance: "source-disclosed",
      },
      {
        id: "coolerOutletC",
        label: "Pre-Cooler Temperature (t³)",
        min: -10,
        max: 25,
        step: 1,
        defaultValue: 10,
        unit: "°C",
        provenance: "source-disclosed",
      },
    ],
    computeMetrics: (p) => {
      const pHigh = p.inletPressureAtm ?? 75;
      const pLow = 25;
      const tCooler = p.coolerOutletC ?? 10;
      const deltaP = pHigh - pLow;
      return [
        {
          label: "High-pressure p",
          value: `${pHigh} atm`,
          unit: "p",
          badgeColor: "cyan",
          progressPct: clampProgress(((pHigh - 50) / 150) * 100),
          provenance: "source-disclosed",
        },
        {
          label: "Low-pressure p′",
          value: `${pLow} atm`,
          unit: "p′",
          badgeColor: "indigo",
          progressPct: clampProgress((pLow / 50) * 100),
          provenance: "source-disclosed",
        },
        {
          label: "Pre-cooler Outlet t³",
          value: `${tCooler} °C`,
          unit: "t³",
          badgeColor: "amber",
          progressPct: clampProgress(((tCooler + 10) / 35) * 100),
          provenance: "source-disclosed",
        },
        {
          label: "Expansion Drop Δp",
          value: `${deltaP} atm`,
          unit: "Δp",
          badgeColor: "emerald",
          progressPct: clampProgress((deltaP / 150) * 100),
          provenance: "source-disclosed",
        },
      ];
    },
    pedagogicalInsight:
      "The grant sends compressed air from C through cooler K and the inner tube of G′ to regulating valve R′ in vessel V′. The returning low-pressure gas travels through the outer annular channel of G′ to the compressor suction, so it cools the incoming stream. The stated 75-atmosphere and 25-atmosphere example is historical source data, not a visitor-adjustable plant model.",
  },
  "us-808897-carrier-air-conditioner": {
    domain: "thermodynamics_transport",
    domainTitle: "Wet-Spray Dew-Point Separation and Sensible Reheat",
    equationName: "Magnus dew point and spray-limited humidity ratio",
    governingEquation:
      "T_{dp} = \\frac{b\\,\\alpha}{a-\\alpha},\\quad \\alpha=\\frac{a T}{b+T}+\\ln(\\mathrm{RH})",
    engineMethod: "FrankenSimEngine.stepCarrierAirConditioner",
    controls: [
      {
        id: "inletTempC",
        label: "Inlet dry-bulb",
        min: 25,
        max: 42,
        step: 1,
        defaultValue: 35,
        unit: "°C",
      },
      {
        id: "inletRhPct",
        label: "Inlet relative humidity",
        min: 40,
        max: 95,
        step: 5,
        defaultValue: 75,
        unit: "%",
      },
      {
        id: "sprayWaterTempC",
        label: "Spray-water temperature",
        min: 4,
        max: 18,
        step: 1,
        defaultValue: 8,
        unit: "°C",
      },
      {
        id: "reheatTempC",
        label: "Reheat supply temperature",
        min: 18,
        max: 26,
        step: 1,
        defaultValue: 22,
        unit: "°C",
      },
      {
        id: "airflowCfm",
        label: "Treated airflow",
        min: 2000,
        max: 30000,
        step: 500,
        defaultValue: 15000,
        unit: "cfm",
      },
    ],
    computeMetrics: (p) => {
      const carrier = FrankenSimEngine.stepCarrierAirConditioner({
        inletTempC: p.inletTempC,
        inletRhPct: p.inletRhPct,
        sprayWaterTempC: p.sprayWaterTempC,
        reheatTempC: p.reheatTempC,
        airflowCfm: p.airflowCfm,
      });
      const c = carrier as {
        dewPointInC?: number;
        moistureRemovedGPerKg?: number;
        finalRhPct?: number;
        coolingWatts?: number;
      };
      const dewPoint = c.dewPointInC ?? 15.0;
      const moistureRemoved = c.moistureRemovedGPerKg ?? 0;
      const finalRh = c.finalRhPct ?? 50;
      const coolingWatts = c.coolingWatts ?? 0;
      return [
        {
          label: "Inlet dew point",
          value: dewPoint.toFixed(1),
          unit: "°C",
          badgeColor: "cyan",
          progressPct: clampProgress((dewPoint / 30) * 100),
        },
        {
          label: "Moisture extracted",
          value: moistureRemoved.toFixed(1),
          unit: "g/kg",
          badgeColor: "amber",
          progressPct: clampProgress((moistureRemoved / 20) * 100),
        },
        {
          label: "Leaving RH",
          value: `${finalRh}`,
          unit: "%",
          badgeColor: "emerald",
          progressPct: finalRh,
        },
        {
          label: "Latent sink",
          value: coolingWatts.toLocaleString(),
          unit: "W",
          badgeColor: "indigo",
          progressPct: clampProgress((coolingWatts / 200000) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "A spray colder than the inlet dew point condenses water on the wet plate faces; rear gutters keep that liquid out of the leaving stream. Reheat then sets the dry-bulb without adding moisture, so leaving RH is spray saturation referred to the reheat temperature.",
  },
  "us-124404-westinghouse-air-brake": {
    domain: "thermo_fluid",
    domainTitle: "Double-Pipe Trainline Pneumatics, Automatic Trip Cocks & Coded Signalling",
    equationName: "Boyle's Expansion Equilibrium & Coded Pressure-Index Signalling",
    governingEquation:
      "P_{\\text{cyl}} = P_D \\cdot \\frac{V_D}{V_D + V_C} \\quad \\text{and} \\quad \\text{Index Graduation } N = 1 + \\left\\lfloor \\frac{\\Delta P_{\\text{signal}}}{\\Delta P_{\\text{step}}} \\right\\rfloor",
    engineMethod: "FrankenSimEngine.stepWestinghouseAirBrake",
    controls: [
      {
        id: "trainPipePressure",
        label: "Locomotive Operating Pipe Pressure (Pipe B)",
        min: 0,
        max: 80,
        step: 5,
        defaultValue: 0,
        unit: "psi",
      },
      {
        id: "reservoirPipePressure",
        label: "Auxiliary Charging Pipe Pressure (Pipe B¹)",
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 90,
        unit: "psi",
      },
      {
        id: "selectingCockPosition",
        label: "Selecting Cock d¹ Role Assignment",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        unit: "pos",
      },
      {
        id: "accidentTrip",
        label: "Automatic Tripping Cock e State",
        min: 0,
        max: 2,
        step: 1,
        defaultValue: 0,
        unit: "mode",
      },
      {
        id: "signalPulsePressure",
        label: "Conductor Signalling Pulse (Loop n, n¹)",
        min: 0,
        max: 2.5,
        step: 0.5,
        defaultValue: 0,
        unit: "psi",
      },
    ],
    computeMetrics: (p) => {
      const tripModes = ["running", "tripped_derailment", "tripped_parting"] as const;
      const tripCockState = tripModes[p.accidentTrip ?? 0] ?? "running";
      const selectingCockState = (p.selectingCockPosition ?? 0) === 1 ? "reversed" : "normal";

      const wh = FrankenSimEngine.stepWestinghouseAirBrake({
        trainPipePressurePsi: p.trainPipePressure ?? 0,
        reservoirPipePressurePsi: p.reservoirPipePressure ?? 90,
        selectingCockState,
        tripCockState,
        signalPulsePressurePsi: p.signalPulsePressure ?? 0,
      });

      const cylPsi = wh.brakeCylinderPressurePsi;
      const pistonThrustKn = wh.shoeClampingForceKn.toFixed(1);
      const isEmergency = wh.valveState === "EMERGENCY";

      return [
        {
          label: "Brake Cylinder Pressure (C)",
          value: `${cylPsi} psi`,
          unit: "P_cyl",
          badgeColor: cylPsi > 30 ? "rose" : cylPsi > 5 ? "amber" : "emerald",
          progressPct: clampProgress((cylPsi / 80) * 100),
        },
        {
          label: "Auxiliary Receiver (D)",
          value: `${wh.receiverPressurePsi} psi`,
          unit: "P_res",
          badgeColor: "cyan",
          progressPct: clampProgress((wh.receiverPressurePsi / 100) * 100),
        },
        {
          label: "Shoe Clamping Force",
          value: `${pistonThrustKn} kN`,
          unit: "F_clamp",
          badgeColor: Number(pistonThrustKn) > 40 ? "rose" : "amber",
          progressPct: clampProgress((Number(pistonThrustKn) / 85) * 100),
        },
        {
          label: "Selecting Cock d¹ (Case d)",
          value: wh.isSelectingCockReversed
            ? "Position 2 (B¹ → Brake, B → Charge)"
            : "Position 1 (B → Brake, B¹ → Charge)",
          unit: "pos",
          badgeColor: "indigo",
          progressPct: wh.isSelectingCockReversed ? 100 : 0,
        },
        {
          label: "Accident Tripping Cock e",
          value: wh.isTripped
            ? wh.isDerailmentTripped
              ? "TRIPPED (Stem i¹)"
              : "TRIPPED (Cord y)"
            : "ARMED (Normal)",
          unit: "state",
          badgeColor: wh.isTripped ? "rose" : "emerald",
          progressPct: wh.isTripped ? 100 : 0,
        },
        {
          label: "Signalling Index (Fig. 4)",
          value: wh.signalMessage,
          unit: "signal",
          badgeColor: wh.signalIndexStep > 1 ? "amber" : "emerald",
          progressPct: (wh.signalIndexStep / 5) * 100,
        },
        {
          label: "Alarm Whistle (h)",
          value: wh.alarmWhistleActive ? "BLASTING" : "QUIET",
          unit: "audio",
          badgeColor: wh.alarmWhistleActive ? "amber" : "emerald",
          progressPct: wh.alarmWhistleActive ? 100 : 0,
        },
        {
          label: "Braking Mode",
          value: isEmergency
            ? "EMERGENCY (Receiver D Equalized)"
            : cylPsi > 5
              ? "SERVICE (Locomotive Operating Line)"
              : "RELEASED (Clear Track)",
          unit: "mode",
          badgeColor: isEmergency ? "rose" : cylPsi > 5 ? "amber" : "emerald",
          progressPct: clampProgress(isEmergency ? 100 : cylPsi > 5 ? 50 : 10),
        },
      ];
    },
    pedagogicalInsight:
      "US 124,404 establishes a double line of continuous pipes (B and B¹). Selecting cock d¹ allows the engineer to reverse the pipe roles at will. When an accident occurs (derailment stem i¹ striking ties or parted coupling cord y pulling cock e), three-way cock e automatically vents stored air from car receiver D into brake cylinder C, applying fail-safe emergency braking without requiring locomotive intervention.",
  },
  "us-x72-whitney-cotton-gin": {
    domain: "aerodynamics_mbd",
    domainTitle: "Rotary Kinematics & Solid-State Fiber Separation",
    equationName: "Centrifugal Separation & Circular Shear Kinematics",
    governingEquation:
      "v_t = \\omega \\cdot r \\quad \\text{and} \\quad \\dot{m} = \\rho \\cdot A \\cdot v",
    engineMethod: "FrankenSimEngine.stepWhitneyCottonGin",
    controls: [
      {
        id: "crankRpm",
        label: "Hand Crank Speed",
        min: 60,
        max: 360,
        step: 10,
        defaultValue: 180,
        unit: "RPM",
      },
    ],
    computeMetrics: (p) => {
      const gin = stepWhitneyCottonGin({ crankRpm: p.crankRpm });
      const sawRpm = gin.sawRpm;
      const brushRpm = gin.brushRpm;
      const outputLbs = gin.outputLbsPerDay;
      return [
        {
          label: "Saw Cylinder Speed",
          value: `${sawRpm} RPM`,
          unit: "omega_saw",
          badgeColor: "amber",
          progressPct: clampProgress((sawRpm / 1260) * 100),
        },
        {
          label: "Brush Speed",
          value: `${brushRpm} RPM`,
          unit: "omega_brush",
          badgeColor: "cyan",
          progressPct: clampProgress((brushRpm / 4320) * 100),
        },
        {
          label: "Daily Clean Fiber Yield",
          value: `${outputLbs} lbs/day`,
          unit: "m_dot",
          badgeColor: "emerald",
          progressPct: clampProgress((outputLbs / 100) * 100),
        },
        {
          label: "Saw Tip Speed",
          value: `${gin.sawTipSpeedMps} m/s`,
          unit: "v_tip",
          badgeColor: "purple",
          progressPct: clampProgress((gin.sawTipSpeedMps / 12) * 100),
        },
        {
          label: "vs Hand Ginning",
          value: `${gin.laborMultiplier}×`,
          unit: "labor",
          badgeColor: "amber",
          progressPct: Math.min(100, gin.laborMultiplier),
        },
      ];
    },
    pedagogicalInsight:
      "Whitney's saw teeth hook fiber through narrow 2.8mm grate slots that block green seeds. The high-speed counter-rotating brush cylinder removes lint continuously via centrifugal airflow.",
  },
  "us-x8277-mccormick-reaper": {
    domain: "mechanical_kinematics",
    domainTitle: "Ground-Wheel Gear-Train Kinematics",
    equationName: "Printed Wheel, Gear, and Pulley Ratios",
    governingEquation:
      "n_{\\mathrm{wheel}} = \\frac{v}{\\pi(2\\,\\mathrm{ft})},\\quad n_{\\mathrm{crank}} = n_{\\mathrm{wheel}}\\left(\\frac{30}{9}\\right)\\left(\\frac{27}{9}\\right),\\quad n_{\\mathrm{reel}} = n_{\\mathrm{wheel}}\\left(\\frac{13}{12}\\right)",
    engineMethod:
      "Host no-slip estimate from dimensions printed in US X8277; no WASM kernel is loaded.",
    controls: [
      {
        id: "forwardSpeedMph",
        label: "Horse Ground Speed",
        min: 1.0,
        max: 5.0,
        step: 0.2,
        defaultValue: 2.5,
        unit: "MPH",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics: (p) => {
      const reaper = stepMcCormickReaper({ forwardSpeedMph: p.forwardSpeedMph });
      return [
        {
          label: "24-inch Ground Wheel",
          value: `${reaper.groundWheelRpm} RPM`,
          unit: "n_wheel",
          badgeColor: "amber",
          provenance: "scenario-modern",
        },
        {
          label: "30:9 × 27:9 Crank",
          value: `${reaper.cutterCrankRpm} RPM`,
          unit: "n_crank",
          badgeColor: "cyan",
          provenance: "scenario-modern",
        },
        {
          label: "13-inch to 12-inch Reel Belt",
          value: `${reaper.reelRpm} RPM`,
          unit: "n_reel",
          badgeColor: "emerald",
          provenance: "scenario-modern",
        },
        {
          label: "Ground Speed",
          value: `${reaper.groundSpeedMps} m/s`,
          unit: "v",
          badgeColor: "cyan",
          provenance: "scenario-reader",
        },
        {
          label: "Cutter Frequency",
          value: `${reaper.cutterHz} Hz`,
          unit: "f_cut",
          badgeColor: "purple",
          provenance: "scenario-modern",
        },
      ];
    },
    pedagogicalInsight:
      "At the selected ground speed, the readout follows the wheel diameter, tooth counts, and pulley diameters stated in the specification. It illustrates motion transmission only; the patent does not establish a crop yield, a field capacity, or a measured cutting rate.",
  },
  "us-132-davenport-electric-motor": {
    domain: "electromagnetics_flux",
    domainTitle: "Permanent Magnet Stator & Commutated Rotor Torque",
    equationName: "Lorentz Force & Commutated Armature Torque",
    governingEquation:
      "\\tau = 2 \\cdot N \\cdot I \\cdot B \\cdot r \\cdot l \\cdot \\sin(\\theta)",
    engineMethod: "FrankenSimEngine.stepDavenportMotor",
    controls: [
      {
        id: "batteryVoltage",
        label: "Galvanic Battery Voltage",
        min: 4,
        max: 24,
        step: 1,
        defaultValue: 12,
        unit: "V",
        provenance: "scenario-reader",
      },
      {
        id: "loadTorque",
        label: "Mechanical Load Torque",
        min: 0.2,
        max: 2.5,
        step: 0.1,
        defaultValue: 0.8,
        unit: "N·m",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics: (p) => {
      const motor = stepDavenportMotor({
        batteryVoltage: p.batteryVoltage,
        loadTorque: p.loadTorque,
      });
      const rpm = motor.shaftRpm;
      const powerW = motor.shaftPowerW;
      return [
        {
          label: "Motor Speed",
          value: `${rpm} RPM`,
          unit: "omega",
          badgeColor: "cyan",
          progressPct: clampProgress((rpm / 900) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Shaft Power Output",
          value: `${powerW} W`,
          unit: "P_out",
          badgeColor: "amber",
          progressPct: clampProgress((powerW / 120) * 100),
          provenance: "scenario-modern",
        },
      ];
    },
    pedagogicalInsight:
      "Davenport's fixed copper contact plates and revolving magnet wires reverse the polarity of the cross-arm electromagnets every half revolution, producing continuous rotation against stationary field magnets.",
  },
  "us-588-ericsson-propeller": {
    domain: "aerodynamics_mbd",
    domainTitle: "Source-Bounded Spiral-Plate and Gear Arrangement",
    equationName: "Printed Helical Development and Opposed Motion",
    governingEquation: "P = 3D; shaft b turns contrary to shaft a and at a lower speed",
    engineMethod: "FrankenSimEngine.stepEricssonPropeller (illustrative display motion only)",
    controls: [
      {
        id: "shaftRpm",
        label: "Illustrative Shaft Motion",
        min: 40,
        max: 240,
        step: 10,
        defaultValue: 120,
        unit: "model RPM",
        provenance: "scenario-reader",
      },
      {
        id: "bladePitchAngleDeg",
        label: "Illustrative Plate Angle",
        min: 20,
        max: 55,
        step: 1,
        defaultValue: 35,
        unit: "model degrees",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics: (_p) => {
      return [
        {
          label: "Source Spiral Advance",
          value: "3",
          unit: "diameters per turn",
          badgeColor: "emerald",
          progressPct: clampProgress(100),
          provenance: "source-disclosed",
        },
        {
          label: "Source Shaft Relation",
          value: "b opposite a",
          unit: "lower stated speed",
          badgeColor: "purple",
          progressPct: clampProgress(100),
          provenance: "source-disclosed",
        },
        {
          label: "Source Casing Clearance",
          value: "about 1/8",
          unit: "inch",
          badgeColor: "amber",
          progressPct: clampProgress(100),
          provenance: "source-disclosed",
        },
      ];
    },
    pedagogicalInsight:
      "US 588 supplies a plate-development rule, the opposed direction and unequal speeds of its concentric shafts, and about one eighth of an inch of clearance in the three-part gear drum. The controls animate reader-aid motion only; the grant prints no shaft rate, propeller dimensions, vessel speed, thrust, slip, efficiency, or torque balance.",
  },
  "us-6162-corliss-steam-engine": {
    domain: "aerodynamics_mbd",
    domainTitle: "Thermodynamics & Variable Cut-Off Steam Valve Gear",
    equationName: "Rankine Thermodynamic Expansion & Indicated Power",
    governingEquation:
      "P_{\\text{IHP}} = \\frac{p_{\\text{mep}} \\cdot L \\cdot A \\cdot N}{33000}",
    engineMethod: "FrankenSimEngine.stepCorlissEngine",
    controls: [
      {
        id: "steamPressurePsi",
        label: "Boiler Steam Pressure",
        min: 40,
        max: 180,
        step: 5,
        defaultValue: 100,
        unit: "PSI",
      },
      {
        id: "engineRpm",
        label: "Engine Speed",
        min: 30,
        max: 120,
        step: 5,
        defaultValue: 65,
        unit: "RPM",
      },
    ],
    computeMetrics: (p) => {
      const corliss = stepCorlissEngine({
        steamPressurePsi: p.steamPressurePsi,
        engineRpm: p.engineRpm,
        cutoffPct: p.cutoffPct,
      });
      const ihp = corliss.indicatedHp;
      return [
        {
          label: "Indicated Horsepower",
          value: `${ihp} IHP`,
          unit: "P_ind",
          badgeColor: "amber",
          progressPct: clampProgress((ihp / 500) * 100),
        },
        {
          label: "Thermal Efficiency",
          value: `${corliss.thermalEfficiencyPct}%`,
          unit: "eta_th",
          badgeColor: "emerald",
          progressPct: clampProgress((corliss.thermalEfficiencyPct / 40) * 100),
        },
        {
          label: "Boiler Pressure",
          value: `${corliss.boilerMpa} MPa`,
          unit: "P",
          badgeColor: "amber",
          progressPct: clampProgress((corliss.boilerMpa / 1.4) * 100),
        },
        {
          label: "Expansion Ratio",
          value: `${corliss.expansionRatio}`,
          unit: "r_exp",
          badgeColor: "cyan",
          progressPct: clampProgress((corliss.expansionRatio / 8) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "The central oscillating wrist-plate trips the admission valves closed instantaneously via pneumatic dashpots, allowing steam to expand adiabatically without throttling loss.",
  },
  "us-36836-gatling-gun": {
    domain: "aerodynamics_mbd",
    domainTitle: "Kinematics & Rotary Cam-Driven Cyclic Action",
    equationName: "Cyclic Fire Rate & Spiral Cam Kinematics",
    governingEquation:
      "\\text{RPM}_{\\text{fire}} = N_{\\text{barrels}} \\cdot \\text{RPM}_{\\text{crank}}",
    engineMethod: "FrankenSimEngine.stepGatlingGun",
    controls: [
      {
        id: "crankRpm",
        label: "Hand Crank Rotation Rate",
        min: 20,
        max: 120,
        step: 5,
        defaultValue: 60,
        unit: "RPM",
        provenance: "scenario-reader",
      },
      {
        id: "barrelCount",
        label: "Revolving Barrel Cluster Count",
        min: 4,
        max: 10,
        step: 2,
        defaultValue: 6,
        unit: "barrels",
        provenance: "scenario-modern",
      },
    ],
    computeMetrics: (p) => {
      const gatling = stepGatlingGun({ crankRpm: p.crankRpm, barrelCount: p.barrelCount });
      const rof = gatling.roundsPerMin;
      return [
        {
          label: "Co-Rotating Assembly",
          value: "LOCKED ON SHAFT N",
          unit: "assembly",
          badgeColor: "emerald",
          progressPct: clampProgress(100),
          provenance: "source-disclosed",
        },
        {
          label: "Rate of Fire",
          value: `${rof} rounds/min`,
          unit: "ROF",
          badgeColor: "rose",
          progressPct: clampProgress((rof / 1200) * 100),
          provenance: "scenario-reader",
        },
        {
          label: "Barrel Cooling Interval",
          value: `${gatling.barrelCoolingIntervalS.toFixed(2)} s`,
          unit: "t_cool",
          badgeColor: "cyan",
          progressPct: clampProgress(80),
          provenance: "scenario-modern",
        },
        {
          label: "Cocking Ring Action",
          value: "INCLINED PLANES P",
          unit: "cam",
          badgeColor: "amber",
          progressPct: clampProgress(100),
          provenance: "source-disclosed",
        },
        {
          label: "Cycle Interval",
          value: `${gatling.cycleTimeMs} ms`,
          unit: "t_cyc",
          badgeColor: "purple",
          progressPct: clampProgress((gatling.cycleTimeMs / 400) * 100),
          provenance: "scenario-reader",
        },
      ];
    },
    pedagogicalInsight:
      "Lock-cylinder D, grooved carrier C, and circular plate F fasten firmly to main shaft N to co-rotate barrels E, while stationary ring P inclined planes cock and release lock-hammers b.",
  },
  "us-48475-yale-lock": {
    domain: "solid_mechanics",
    domainTitle: "Mechanical Shear-Line Kinematics & Pin-Tumbler Dynamics",
    equationName: "Shear-Line Boundary Condition & Restorative Spring Force",
    governingEquation:
      "\\Delta y_i = |y_{\\text{key},i} - y_{\\text{shear},i}| \\le \\delta_{\\text{tol}}, \\quad F_s = \\sum_{i=1}^5 k_s (L_0 - \\Delta x_i)",
    engineMethod: "FrankenSimEngine.stepYaleLock",
    controls: [
      {
        id: "keyInsertion",
        label: "Key Blade Insertion Depth",
        min: 0.0,
        max: 1.0,
        step: 0.05,
        defaultValue: 1.0,
        unit: "fraction",
        provenance: "scenario-reader",
      },
      {
        id: "appliedTorqueNm",
        label: "Turning Torque on Plug",
        min: 0.0,
        max: 0.5,
        step: 0.02,
        defaultValue: 0.15,
        unit: "N·m",
        provenance: "scenario-modern",
      },
    ],
    computeMetrics: (p) => {
      const yale = stepYaleLock({
        keyInsertion: p.keyInsertion,
        appliedTorqueNm: p.appliedTorqueNm,
      });
      return [
        {
          label: "Shear Line Alignment",
          value: yale.isUnlocked ? "Aligned (Shear Cleared)" : "Misaligned (Pins Blocked)",
          unit: "Status",
          badgeColor: yale.isUnlocked ? "emerald" : "rose",
          progressPct: yale.isUnlocked
            ? 100
            : clampProgress(100 - (yale.maxShearErrorMm / 4.0) * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Max Pin Shear Error",
          value: `${yale.maxShearErrorMm.toFixed(3)} mm`,
          unit: "Δy_max",
          badgeColor: yale.maxShearErrorMm < 0.1 ? "emerald" : "rose",
          progressPct: clampProgress(Math.max(0, 100 - (yale.maxShearErrorMm / 3.0) * 100)),
          provenance: "scenario-modern",
        },
        {
          label: "Plug Rotation Angle",
          value: `${yale.plugAngleDeg.toFixed(1)}°`,
          unit: "θ_plug",
          badgeColor: "cyan",
          progressPct: clampProgress((yale.plugAngleDeg / 360) * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Bolt Extension / Deadlock",
          value: `${yale.boltExtensionMm.toFixed(1)} mm ${yale.isDeadlocked ? "(Deadlocked)" : ""}`,
          unit: "x_bolt",
          badgeColor: yale.isDeadlocked ? "emerald" : "amber",
          progressPct: clampProgress((yale.boltExtensionMm / 18.0) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Pin Spring Force",
          value: `${yale.totalSpringForceN.toFixed(2)} N`,
          unit: "F_spring",
          badgeColor: "amber",
          progressPct: clampProgress((yale.totalSpringForceN / 5.0) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Theoretical Combinations",
          value: "7,776 (6⁵)",
          unit: "perms",
          badgeColor: "indigo",
          progressPct: 92,
          provenance: "scenario-modern",
        },
      ];
    },
    pedagogicalInsight:
      "Linus Yale Jr.'s 1865 breakthrough separated the heavy locking bolt mechanism from the compact key-cylinder. By utilizing a miniature flat serrated key to elevate split pin tumblers to a precise cylindrical shear line, the mechanism reduced key mass by 90% while dramatically expanding cryptographic permutation security.",
  },
  "us-78317-nobel-dynamite": {
    domain: "solid_mechanics",
    domainTitle: "Explosive Detonation & Porous Matrix Stabilization",
    equationName: "Chapman-Jouguet Detonation Velocity",
    governingEquation: "D = \\sqrt{2 \\cdot (\\gamma^2 - 1) \\cdot q}",
    engineMethod: "FrankenSimEngine.stepNobelDynamite",
    controls: [
      {
        id: "ngConcentrationPct",
        label: "Nitroglycerin Matrix Absorption",
        min: 50,
        max: 85,
        step: 5,
        defaultValue: 75,
        unit: "%",
      },
      {
        id: "capEnergyJoules",
        label: "Blasting Cap Shock Energy",
        min: 0.2,
        max: 3.0,
        step: 0.2,
        defaultValue: 1.2,
        unit: "J",
      },
    ],
    computeMetrics: (p) => {
      const nobel = stepNobelDynamite({
        ngConcentrationPct: p.ngConcentrationPct,
        capEnergyJoules: p.capEnergyJoules,
      });
      const vDet = nobel.detonationVelocityMps;
      const isInitiated = nobel.isInitiated;
      return [
        {
          label: "Detonation Velocity",
          value: isInitiated ? `${vDet} m/s` : "0 m/s (Sub-threshold)",
          unit: "D_CJ",
          badgeColor: isInitiated ? "rose" : "amber",
          progressPct: clampProgress(isInitiated ? (vDet / 8500) * 100 : 0),
        },
        {
          label: "Kieselguhr Cushion",
          value: `${nobel.cushionFactor}×`,
          unit: "vs free NG",
          badgeColor: "emerald",
          progressPct: Math.min(100, (nobel.cushionFactor / 7) * 100),
        },
        {
          label: "Blast Overpressure",
          value: `${nobel.blastOverpressureGpa} GPa`,
          unit: "P_CJ",
          badgeColor: "rose",
          progressPct: clampProgress((nobel.blastOverpressureGpa / 8) * 100),
        },
        {
          label: "Specific Energy",
          value: `${nobel.energyMjPerKg} MJ/kg`,
          unit: "Q",
          badgeColor: "amber",
          progressPct: clampProgress((nobel.energyMjPerKg / 6.3) * 100),
        },
        {
          label: "Dough State",
          value: nobel.isSensitiveUnsafe ? "EXUDING" : "STABLE",
          unit: "state",
          badgeColor: nobel.isSensitiveUnsafe ? "rose" : "emerald",
          progressPct: clampProgress(nobel.isSensitiveUnsafe ? 20 : 90),
        },
        {
          label: "20 cm Transit",
          value: `${nobel.chargeTransitUs} µs`,
          unit: "t_CJ",
          badgeColor: "cyan",
          progressPct: Math.min(100, (nobel.chargeTransitUs / 40) * 100),
        },
        {
          label: "Visible Flash",
          value: `${nobel.flashDisplayMs} ms`,
          unit: "t_flash",
          badgeColor: "amber",
          progressPct: clampProgress((nobel.flashDisplayMs / 400) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Porous silicious earth absorbs liquid nitro-glycerine to form a compressible powder, retaining the explosive charge in the bore-hole while the percussion-cap explosion provides the initial shock required to explode the powder.",
  },
  "us-79265-sholes-typewriter": {
    domain: "mechanism_kinematics",
    domainTitle: "Source-Constrained Type-Bar and Carriage Demonstration",
    equationName: "Key, Ratchet, and Carriage Sequence",
    governingEquation:
      "A key raises bar T; lever H alternately releases ratchet I; the weighted carriage advances one serration while the type-bar returns to cushion q.",
    engineMethod: "Source-constrained TypeScript display cycle; no measured rate or pitch",
    controls: [
      {
        id: "typingSpeedWpm",
        label: "Demonstration Cadence",
        min: 10,
        max: 120,
        step: 5,
        defaultValue: 40,
        unit: "strokes/min",
      },
    ],
    computeMetrics: (p) => {
      const sholes = stepSholesTypewriter(p.typingSpeedWpm ?? 40, 0);
      return [
        {
          label: "Demonstration Events",
          value: sholes.eventsPerSecond.toFixed(1),
          unit: "strokes/s",
          badgeColor: "amber",
          progressPct: clampProgress((sholes.eventsPerSecond / 2) * 100),
        },
        {
          label: "Key Cycle",
          value: `${Math.round(sholes.keyCyclePct * 100)}%`,
          unit: "relative",
          badgeColor: "emerald",
          progressPct: clampProgress(sholes.keyCyclePct * 100),
        },
        {
          label: "Ratchet State",
          value: sholes.ratchetReleasePct > 0 ? "releasing" : "held",
          unit: "state",
          badgeColor: "cyan",
          progressPct: clampProgress(sholes.ratchetReleasePct * 100),
        },
      ];
    },
    pedagogicalInsight:
      "US 79,265 describes direct key action under radial type-bars, a self-adjusting platen, an alternating-fork ratchet, separate transverse line motion, and a ribbon feed. It does not state a keyboard arrangement, pitch, bar count, throw angle, or collision model.",
  },
  "us-105338-hyatt-celluloid": {
    domain: "solid_mechanics",
    domainTitle: "Thermoplastic Rheology & Hydraulic Injection",
    equationName: "Arrhenius Viscosity & Hydraulic Ram Extrusion",
    governingEquation: "\\eta(T) = \\eta_0 \\cdot \\exp\\left(\\frac{E_a}{R \\cdot T}\\right)",
    engineMethod: "FrankenSimEngine.stepHyattCelluloid",
    controls: [
      {
        id: "steamTempC",
        label: "Steam Jacket Temperature",
        min: 70,
        max: 160,
        step: 5,
        defaultValue: 95,
        unit: "°C",
      },
      {
        id: "hydraulicPressureMpa",
        label: "Hydraulic Ram Pressure",
        min: 4,
        max: 25,
        step: 1,
        defaultValue: 10,
        unit: "MPa",
      },
    ],
    computeMetrics: (p) => {
      const hyatt = stepHyattCelluloid({
        steamTempC: p.steamTempC,
        hydraulicPressureMpa: p.hydraulicPressureMpa,
      });
      const visc = hyatt.viscosityPaS;
      const isMelted = hyatt.isMelted;
      return [
        {
          label: "Melt Viscosity",
          value: `${visc} Pa·s`,
          unit: "eta",
          badgeColor: "amber",
          progressPct: Math.min(100, (visc / 2000) * 100),
        },
        {
          label: "Plasticity State",
          value: isMelted ? "FLUID INJECTION" : "RIGID SOLID",
          unit: "phase",
          badgeColor: isMelted ? "emerald" : "rose",
          progressPct: clampProgress(isMelted ? 100 : 20),
        },
        {
          label: "Consolidation Density",
          value: `${hyatt.consolidationDensityGPerCm3} g/cm³`,
          unit: "rho",
          badgeColor: "cyan",
          progressPct: clampProgress(((hyatt.consolidationDensityGPerCm3 - 1.2) / 0.2) * 100),
        },
        {
          label: "Transparency",
          value: `${hyatt.transparencyPct}%`,
          unit: "clear",
          badgeColor: "purple",
          progressPct: clampProgress(hyatt.transparencyPct),
        },
      ];
    },
    pedagogicalInsight:
      "Camphor plasticizes nitrocellulose into the first synthetic thermoplastic. The steam-jacketed cylinder heats the mass to $120^\\circ\\text{C}$ where hydraulic pressure forces it into precision split molds.",
  },
  "us-120057-gramme-dynamo": {
    domain: "electromagnetics_flux",
    domainTitle: "Continuous-current collection from an endless ring winding",
    equationName: "Faraday induction with sequential junction collection",
    governingEquation:
      "For a fixed construction, induced e.m.f. scales with angular speed: E is proportional to omega. The patent does not state the values needed to calculate volts.",
    engineMethod:
      "Normalized source-faithful collection model; not a measured or WASM electrical rating",
    controls: [
      {
        id: "shaftRate",
        label: "Illustrative shaft-rate factor",
        min: 0.4,
        max: 1.6,
        step: 0.1,
        defaultValue: 1,
        unit: "relative",
        provenance: "topology-normalized",
      },
    ],
    computeMetrics: (p) => {
      const gramme = stepGrammeDynamo({ shaftRate: p.shaftRate });
      return [
        {
          label: "Induced e.m.f. (illustrative)",
          value: `${gramme.inducedEmfIndex}`,
          unit: "relative index",
          badgeColor: "cyan",
          progressPct: clampProgress((gramme.inducedEmfIndex / 160) * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Printed joined bobbins",
          value: `${gramme.printedJunctionCount}`,
          unit: "junctions",
          badgeColor: "amber",
          progressPct: clampProgress(100),
          provenance: "source-disclosed",
        },
        {
          label: "Collection continuity (idealized)",
          value: `${gramme.collectionContinuityPct}%`,
          unit: "overlap",
          badgeColor: "emerald",
          progressPct: clampProgress(gramme.collectionContinuityPct),
          provenance: "topology-normalized",
        },
      ];
    },
    pedagogicalInsight:
      "The continuous ring joins many small bobbins end to end. As rotation changes which junctions meet the collecting rubbers, contributions hand off in sequence. The patent describes that continuity but does not give a voltage, resistance, load, or speed from which to calculate a historical output.",
  },
  "us-135245-pasteur-fermentation": {
    domain: "thermal_transport",
    domainTitle: "Gas Displacement & External Water-Spray Cooling",
    equationName: "Source Sequence With Printed Yeast-Addition Band",
    governingEquation:
      "\\text{boiling wort} \\rightarrow \\text{CO}_2\\text{ sweep} \\rightarrow \\text{external spray cooling} \\rightarrow T=20\\text{--}22.5^{\\circ}\\mathrm{C}",
    engineMethod: "Source-bounded TypeScript reader state; no quantitative process model",
    controls: [
      {
        id: "co2SweepPct",
        label: "CO₂ Sweep Progress (Reader Aid)",
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 100,
        unit: "%",
      },
      {
        id: "sprayCoveragePct",
        label: "Exterior Spray Coverage (Reader Aid)",
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 100,
        unit: "%",
      },
      {
        id: "wortTempC",
        label: "Yeast-Addition Temperature",
        min: 20,
        max: 22.5,
        step: 0.25,
        defaultValue: 21.25,
        unit: "°C",
      },
    ],
    computeMetrics: (p) => {
      const pasteur = stepPasteurFermentation({
        co2SweepPct: p.co2SweepPct,
        sprayCoveragePct: p.sprayCoveragePct,
        wortTempC: p.wortTempC,
      });
      return [
        {
          label: "CO₂ sweep",
          value: `${pasteur.co2SweepPct}%`,
          unit: "reader control",
          badgeColor: pasteur.co2SweepPct === 100 ? "emerald" : "amber",
          progressPct: pasteur.co2SweepPct,
        },
        {
          label: "Spray coverage",
          value: `${pasteur.sprayCoveragePct}%`,
          unit: "reader control",
          badgeColor: pasteur.sprayCoveragePct === 100 ? "emerald" : "amber",
          progressPct: pasteur.sprayCoveragePct,
        },
        {
          label: "Printed yeast band",
          value: `${pasteur.wortTempC} °C`,
          unit: "20–22.5 °C",
          badgeColor: pasteur.withinPrintedYeastBand ? "emerald" : "amber",
          progressPct: clampProgress(((pasteur.wortTempC - 20) / 2.5) * 100),
        },
        {
          label: "Sequence state",
          value: pasteur.readyForYeast ? "Ready for yeast" : "Process incomplete",
          unit: "source sequence",
          badgeColor: pasteur.readyForYeast ? "emerald" : "amber",
          progressPct: pasteur.readyForYeast ? 100 : 50,
        },
      ];
    },
    pedagogicalInsight:
      "US 135,245 confines boiling-hot wort, uses carbonic-acid gas to expel contained air, cools the vessel exterior with water spray, and adds yeast at the printed 16°–18° Réaumur band. It states no pasteurization hold, microbial kill rate, pressure, ABV, or shelf-life measurement.",
  },
  "us-157124-glidden-barbed-wire": {
    domain: "solid_mechanics",
    domainTitle: "Elastic Continuum Mechanics & Torsional Wire Locking",
    equationName: "Hooke Tensile Stress & Helical Wire Twist",
    governingEquation:
      "\\sigma = E \\cdot \\epsilon = \\frac{F}{A} \\quad \\text{and} \\quad \\theta_{\\text{twist}} = \\frac{T \\cdot L}{J \\cdot G}",
    engineMethod: "FrankenSimEngine.stepGliddenBarbedWire",
    controls: [
      {
        id: "wireTensionN",
        label: "Line Wire Tension",
        min: 200,
        max: 1200,
        step: 50,
        defaultValue: 650,
        unit: "N",
      },
      {
        id: "twistsPerFoot",
        label: "Helical Twist Rate",
        min: 2,
        max: 10,
        step: 1,
        defaultValue: 5,
        unit: "twists/ft",
      },
      {
        id: "animalPushForceN",
        label: "Livestock Push Force",
        min: 20,
        max: 300,
        step: 10,
        defaultValue: 120,
        unit: "N",
      },
    ],
    computeMetrics: (p) => {
      const wire = stepGliddenBarbedWire({
        wireTensionN: p.wireTensionN,
        twistsPerFoot: p.twistsPerFoot,
        animalPushForceN: p.animalPushForceN,
      });
      const sagCm = wire.sagCm;
      const isLocked = wire.isLocked;
      return [
        {
          label: "Span Sag",
          value: `${sagCm} cm`,
          unit: "delta_y",
          badgeColor: sagCm < 5 ? "emerald" : "amber",
          progressPct: Math.min(100, (sagCm / 15) * 100),
        },
        {
          label: "Barb Longitudinal Lock",
          value: isLocked ? "LOCKED (No Slip)" : "SLIPPING (Insufficient Twist)",
          unit: "lock",
          badgeColor: isLocked ? "emerald" : "rose",
          progressPct: clampProgress(isLocked ? 100 : 25),
        },
        {
          label: "Bessemer Rating",
          value: `${wire.tensileStrengthLbs} lb`,
          unit: "UTS",
          badgeColor: "amber",
          progressPct: clampProgress(100),
        },
        {
          label: "Line Output",
          value: `${wire.productionRateFtPerMin} ft/min`,
          unit: "v_line",
          badgeColor: "cyan",
          progressPct: clampProgress((wire.productionRateFtPerMin / 60) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Coiling the short spur wire around a single core strand and twisting a second line wire around it locks the barb permanently in place against longitudinal slipping or livestock pressure.",
  },
  "us-194047-otto-engine": {
    domain: "thermodynamics_transport",
    domainTitle: "Graded-Charge Gas Engine & Four-Stroke Valve Gear",
    equationName: "Source Timing Topology with a Declared Air-Standard Lens",
    governingEquation:
      "\\omega_K=\\omega_I/2; \\quad \\eta_{ideal}=1-r^{1-\\gamma} \\;\\text{(modern declared analysis)}",
    engineMethod: "fs-mbd source topology + explicitly declared air-standard analysis",
    controls: [
      {
        id: "engineRpm",
        label: "Crankshaft Speed",
        min: 60,
        max: 320,
        step: 10,
        defaultValue: 180,
        unit: "RPM",
      },
      {
        id: "compressionRatio",
        label: "Declared Analysis Compression Ratio",
        min: 3.0,
        max: 8.0,
        step: 0.5,
        defaultValue: 4.5,
        unit: ":1",
      },
      {
        id: "claim1ChargeGradingPresent",
        label: "Claim 1 Graded Separate Charge",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "",
      },
    ],
    computeMetrics: (p) => {
      const otto = stepOttoEngine({ engineRpm: p.engineRpm, compressionRatio: p.compressionRatio });
      const rpm = p.engineRpm ?? 180;
      return [
        {
          label: "Counter-Shaft K",
          value: `${(rpm / 2).toFixed(1)} RPM`,
          unit: "ω_K = ω_I / 2",
          badgeColor: "amber",
          progressPct: clampProgress((rpm / 320) * 100),
        },
        {
          label: "Modern Ideal Efficiency",
          value: `${otto.thermalEfficiencyPct}%`,
          unit: "declared r; not measured",
          badgeColor: "emerald",
          progressPct: clampProgress(otto.thermalEfficiencyPct),
        },
        {
          label: "Source Pressure Trace",
          value: "NOT PRINTED",
          unit: "refused",
          badgeColor: "cyan",
          progressPct: 0,
        },
        {
          label: "Source Power",
          value: "NOT PRINTED",
          unit: "refused",
          badgeColor: "rose",
          progressPct: 0,
        },
      ];
    },
    pedagogicalInsight:
      "US 194,047 claims a spatially graded charge and the machinery that admits, compresses, ignites, and exhausts it over four strokes. The source fixes the one-to-two counter-shaft relation but supplies no operating speed, compression ratio, pressure trace, fuel flow, or power measurement; the ideal-efficiency slider is a clearly labeled modern analysis input.",
  },
  "us-200521-edison-phonograph": {
    domain: "solid_mechanics",
    domainTitle: "Source-Bounded Diaphragm Recording and Helical Advance",
    equationName: "Source-Specified Recording Chain",
    governingEquation:
      "sound vibration → diaphragm and hard point → marks on yielding material → recovered diaphragm motion",
    engineMethod: "FrankenSimEngine.stepEdisonPhonograph (illustrative display motion only)",
    controls: [
      {
        id: "mandrelRpm",
        label: "Illustrative Clock-Work Rate",
        min: 40,
        max: 140,
        step: 5,
        defaultValue: 60,
        unit: "model RPM",
      },
      {
        id: "voiceVolumeDb",
        label: "Illustrative Diaphragm-Excitation Level",
        min: 40,
        max: 100,
        step: 5,
        defaultValue: 75,
        unit: "model dB",
      },
    ],
    computeMetrics: () => {
      return [
        {
          label: "Source Helical Groove Pitch",
          value: "10",
          unit: "grooves/in",
          badgeColor: "amber",
          progressPct: clampProgress(100),
        },
        {
          label: "Source Shaft Thread Pitch",
          value: "10",
          unit: "threads/in",
          badgeColor: "cyan",
          progressPct: clampProgress(100),
        },
        {
          label: "Named Drive",
          value: "Clock-work M or other power",
          unit: "source text",
          badgeColor: "emerald",
          progressPct: clampProgress(100),
        },
      ];
    },
    pedagogicalInsight:
      "The source describes a diaphragm with a hard indenting point marking metallic foil, paper, or another yielding material on a cylinder. Its ten-groove-per-inch helix and matching ten-thread-per-inch shaft move the cylinder endwise while it turns. The controls animate reader-aid motion only; the grant prints no rate, dimension, diaphragm material, or audio bandwidth.",
  },
  "us-233692-pelton-water-wheel": {
    domain: "fluid_mechanics",
    domainTitle: "Source-Bounded Divided-Bucket Water Path",
    equationName: "Claimed Bucket Geometry Sequence",
    governingEquation:
      "\\text{stream} \\rightarrow b \\rightarrow d \\rightarrow c_{\\mathrm{left/right}} \\rightarrow e_{\\mathrm{left/right}}",
    engineMethod: "Source-bounded TypeScript apparatus state; no quantitative turbine model",
    controls: [
      {
        id: "sourceFlowVisible",
        label: "Show Source Water Path",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "off / on",
      },
      {
        id: "claim1Active",
        label: "Claim 1 Geometry",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "absent / present",
      },
    ],
    computeMetrics: (p) => {
      const sourceFlowVisible = (p.sourceFlowVisible ?? 1) > 0;
      const claim1Active = (p.claim1Active ?? 1) > 0;
      return [
        {
          label: "Source Water Path",
          value: sourceFlowVisible ? "shown" : "hidden",
          unit: "reader control",
          badgeColor: "cyan",
          progressPct: sourceFlowVisible ? 100 : 0,
        },
        {
          label: "Stream Division",
          value: claim1Active ? "central apex d" : "claim element removed",
          unit: "source label",
          badgeColor: "amber",
          progressPct: claim1Active ? 100 : 0,
        },
        {
          label: "Curved Bottoms",
          value: "two bottoms c",
          unit: "source label",
          badgeColor: "emerald",
          progressPct: 100,
        },
        {
          label: "Discharge",
          value: "flaring sides e",
          unit: "source label",
          badgeColor: "purple",
          progressPct: 100,
        },
      ];
    },
    pedagogicalInsight:
      "The sole claim protects a specific bucket combination: sloping front b admits the stream without face impact, apex d divides it, two curved bottoms c redirect the portions, and flaring sides e discharge them laterally. The grant prints no head, flow, speed, cup quantity, turning angle, efficiency, force, or output wattage.",
  },
  "us-235199-bell-photophone": {
    domain: "telecom",
    domainTitle: "Free-Space Optical Wireless Transmission & Photoconductive Demodulation",
    equationName: "Selenium Photoconductivity Power Law & Free-Space Irradiance",
    governingEquation:
      "E_{\\text{recv}} = \\frac{P_0 e^{-\\alpha d}}{\\frac{\\pi}{4} D_{\\text{spot}}^2(d)}, \\quad R_{\\text{se}} = \\frac{R_{\\text{dark}}}{1 + \\beta \\sqrt{P_{\\text{cell}}}}",
    engineMethod: "FrankenSimEngine.stepBellPhotophone",
    controls: [
      {
        id: "transmissionDistanceM",
        label: "Wireless Transmission Distance",
        min: 10,
        max: 500,
        step: 10,
        defaultValue: 213,
        unit: "m",
        provenance: "scenario-modern",
      },
      {
        id: "voiceSplDb",
        label: "Speaker Vocal Sound Level",
        min: 50,
        max: 95,
        step: 1,
        defaultValue: 75,
        unit: "dB SPL",
        provenance: "scenario-modern",
      },
      {
        id: "solarIrradianceWPerM2",
        label: "Incident Source Irradiance",
        min: 200,
        max: 1200,
        step: 50,
        defaultValue: 950,
        unit: "W/m²",
        provenance: "scenario-modern",
      },
      {
        id: "collectorDiameterM",
        label: "Parabolic Collector Diameter",
        min: 0.2,
        max: 1.0,
        step: 0.05,
        defaultValue: 0.5,
        unit: "m",
        provenance: "scenario-modern",
      },
    ],
    computeMetrics: (p) => {
      const photo = stepBellPhotophone({
        transmissionDistanceM: p.transmissionDistanceM,
        voiceSplDb: p.voiceSplDb,
        solarIrradianceWPerM2: p.solarIrradianceWPerM2,
        collectorDiameterM: p.collectorDiameterM,
      });
      return [
        {
          label: "Concentrated Optical Power",
          value: `${photo.concentratedPowerMw.toFixed(2)} mW`,
          unit: "P_cell",
          badgeColor: "amber",
          progressPct: clampProgress((photo.concentratedPowerMw / 50.0) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Selenium Cell Resistance",
          value: `${photo.seleniumOperatingResistanceKOhms.toFixed(1)} kΩ`,
          unit: "R_se",
          badgeColor: "emerald",
          progressPct: clampProgress(
            Math.max(0, 100 - (photo.seleniumOperatingResistanceKOhms / 180.0) * 100),
          ),
          provenance: "scenario-modern",
        },
        {
          label: "Audio AC Signal Current",
          value: `${photo.audioSignalCurrentUa.toFixed(2)} µA`,
          unit: "i_audio",
          badgeColor: "cyan",
          progressPct: clampProgress((photo.audioSignalCurrentUa / 15.0) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Reproduced Sound Level",
          value: `${photo.reproducedAudioSplDb.toFixed(1)} dB SPL`,
          unit: "SPL_out",
          badgeColor: photo.reproducedAudioSplDb >= 45 ? "emerald" : "amber",
          progressPct: clampProgress((photo.reproducedAudioSplDb / 85.0) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Optical Modulation Depth",
          value: `${(photo.modulationDepth * 100).toFixed(1)}%`,
          unit: "m_opt",
          badgeColor: "indigo",
          progressPct: clampProgress(photo.modulationDepth * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Optical Link SNR",
          value: `${photo.linkSnrDb.toFixed(1)} dB`,
          unit: "SNR",
          badgeColor: photo.linkSnrDb >= 20 ? "emerald" : "rose",
          progressPct: clampProgress((photo.linkSnrDb / 50.0) * 100),
          provenance: "scenario-modern",
        },
      ];
    },
    pedagogicalInsight:
      "Alexander Graham Bell and Charles Sumner Tainter's Photophone (1880) was the world's first wireless optical communication system. By vibrating a flexible mirror diaphragm with human speech, parallel sunlight was modulated in divergence and focused onto a crystalline selenium cell 213 meters away, reproducing articulate speech without wires 16 years before Marconi's radio.",
  },
  "us-247804-delaval-separator": {
    domain: "aerodynamics_mbd",
    domainTitle: "Centrifugal Dynamics & Multi-Phase Fluid Separation",
    equationName: "Centrifugal Acceleration & Stokes Separation Velocity",
    governingEquation:
      "a_c = \\omega^2 \\cdot r \\quad \\text{and} \\quad v_r = \\frac{d^2 \\cdot (\\rho_{\\text{skim}} - \\rho_{\\text{fat}}) \\cdot \\omega^2 \\cdot r}{18 \\cdot \\mu}",
    engineMethod: "FrankenSimEngine.stepDeLavalSeparator",
    controls: [
      {
        id: "bowlRpm",
        label: "Centrifuge Bowl Speed",
        min: 2000,
        max: 9000,
        step: 250,
        defaultValue: 6500,
        unit: "RPM",
      },
      {
        id: "rawMilkFlowLph",
        label: "Raw Milk Feed Rate",
        min: 100,
        max: 600,
        step: 25,
        defaultValue: 300,
        unit: "L/h",
      },
    ],
    computeMetrics: (p) => {
      const sep = stepDeLavalSeparator({ bowlRpm: p.bowlRpm, rawMilkFlowLph: p.rawMilkFlowLph });
      const g = sep.gForce;
      const yieldFat = sep.fatYieldPct;
      const creamFlow = sep.creamFlowLph;
      return [
        {
          label: "Centrifugal G-Force",
          value: `${g.toLocaleString()} g`,
          unit: "a_c",
          badgeColor: "rose",
          progressPct: clampProgress((g / 11000) * 100),
        },
        {
          label: "Fat Separation Yield",
          value: `${yieldFat}%`,
          unit: "yield",
          badgeColor: "emerald",
          progressPct: clampProgress(Number(yieldFat)),
        },
        {
          label: "Bowl ω",
          value: `${sep.bowlOmegaRadPerS}`,
          unit: "rad/s",
          badgeColor: "amber",
          progressPct: Math.min(100, (sep.bowlOmegaRadPerS / 1000) * 100),
        },
        {
          label: "Display ω",
          value: `${sep.displayOmegaDegPerS} °/s`,
          unit: "ω×0.15",
          badgeColor: "cyan",
          progressPct: Math.min(100, (sep.displaySlowdown / 0.2) * 100),
        },
        {
          label: "Cream Discharge Rate",
          value: `${creamFlow} L/h`,
          unit: "Q_cream",
          badgeColor: "cyan",
          progressPct: clampProgress((creamFlow / 75) * 100),
        },
        {
          label: "Skim Discharge Rate",
          value: `${sep.skimFlowLph} L/h`,
          unit: "Q_skim",
          badgeColor: "purple",
          progressPct: clampProgress((sep.skimFlowLph / 300) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Mounted upon a flexible upper bearing spindle, rotating hollow chamber D separates compound fluid by centrifugal action, discharging the denser fluid through outer curved pipe X and nozzle l while the lighter fluid overflows through central nozzle n into separate annular receivers G and H.",
  },
  "us-347140-thomson-welding": {
    domain: "electromagnetics_flux",
    domainTitle: "Electric Resistance Joule Heating & Solid-State Fusion",
    equationName: "Joule Heating & Upset Forge Welding",
    governingEquation: "Q = I^2 \\cdot R_{\\text{contact}} \\cdot t",
    engineMethod: "FrankenSimEngine.stepThomsonWelding",
    controls: [
      {
        id: "weldCurrentAmps",
        label: "Secondary Welding Current",
        min: 1000,
        max: 6000,
        step: 100,
        defaultValue: 4500,
        unit: "A",
        provenance: "scenario-reader",
      },
      {
        id: "clampPressureMpa",
        label: "Mechanical Upset Pressure",
        min: 10,
        max: 60,
        step: 5,
        defaultValue: 35,
        unit: "MPa",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics: (p) => {
      const weld = stepThomsonWelding({
        weldCurrentAmps: p.weldCurrentAmps,
        clampPressureMpa: p.clampPressureMpa,
      });
      const kw = weld.jouleKw;
      const tempC = weld.interfaceTempC;
      const isForged = weld.isForged;
      return [
        {
          label: "Joule Heat Rate",
          value: `${kw} kW`,
          unit: "P_joule",
          badgeColor: "rose",
          progressPct: clampProgress((kw / 8) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Interface Temperature",
          value: `${tempC}°C`,
          unit: "T_weld",
          badgeColor: tempC >= 1150 ? "amber" : "cyan",
          progressPct: Math.min(100, (tempC / 1500) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Solid-State Weld Quality",
          value: isForged ? "SOLID FORGE WELD" : "COLD / UNFORGED",
          unit: "fusion",
          badgeColor: isForged ? "emerald" : "rose",
          progressPct: clampProgress(isForged ? 100 : 30),
          provenance: "scenario-modern",
        },
        {
          label: "Upset Burr",
          value: `${weld.upsetBurrWidthMm} mm`,
          unit: "w_burr",
          badgeColor: "amber",
          progressPct: clampProgress((weld.upsetBurrWidthMm / 6) * 100),
          provenance: "scenario-modern",
        },
      ];
    },
    pedagogicalInsight:
      "A massive single-turn copper secondary bar steps AC down to 1.5V at 2,500A. Localized resistance at the abutted joint heats steel to plastic fusion temperature where an upset screw welds the bond.",
  },
  "us-328710-parsons-turbine": {
    domain: "aerodynamics_mbd",
    domainTitle: "Multi-Stage Axial Steam Expansion & Reaction Blading",
    equationName: "Reaction Turbine Enthalpy Drop & Stage Expansion",
    governingEquation:
      "\\Delta h_{\\text{stage}} = \\frac{1}{2} \\cdot (v_1^2 - v_2^2) + \\frac{1}{2} \\cdot (w_2^2 - w_1^2)",
    engineMethod: "FrankenSimEngine.stepParsonsTurbine",
    controls: [
      {
        id: "rotorRpm",
        label: "Turbine Rotor Speed",
        min: 1000,
        max: 6000,
        step: 100,
        defaultValue: 3000,
        unit: "RPM",
      },
      {
        id: "inletPressurePsi",
        label: "Boiler Inlet Steam Pressure",
        min: 60,
        max: 300,
        step: 10,
        defaultValue: 180,
        unit: "psi",
      },
    ],
    computeMetrics: (p) => {
      const parsons = stepParsonsTurbine({
        rotorRpm: p.rotorRpm,
        inletPressurePsi: p.inletPressurePsi,
      });
      const kw = parsons.shaftPowerKw;
      return [
        {
          label: "Shaft Power Output",
          value: `${kw.toLocaleString()} kW`,
          unit: "P_shaft",
          badgeColor: "emerald",
          progressPct: clampProgress((kw / 25000) * 100),
        },
        {
          label: "Inlet Pressure",
          value: `${parsons.inletMpa.toFixed(2)} MPa`,
          unit: "P_inlet",
          badgeColor: "amber",
          progressPct: clampProgress(((p.inletPressurePsi ?? 180) / 300) * 100),
        },
        {
          label: "Reaction Expansion",
          value: `${parsons.stageCount} Compound Stages`,
          unit: "stages",
          badgeColor: "cyan",
          progressPct: clampProgress(100),
        },
        {
          label: "Blade Speed Ratio",
          value: `${parsons.steamBladeSpeedRatio} u/c`,
          unit: "u/c",
          badgeColor: "purple",
          progressPct: clampProgress((parsons.steamBladeSpeedRatio / 0.8) * 100),
        },
        {
          label: "Blade u",
          value: `${parsons.bladeSpeedMps} m/s`,
          unit: "u",
          badgeColor: "amber",
          progressPct: Math.min(100, (parsons.bladeSpeedMps / 200) * 100),
        },
        {
          label: "Display ω",
          value: `${parsons.displayOmegaDegPerS} °/s`,
          unit: "ω×0.08",
          badgeColor: "cyan",
          progressPct: Math.min(100, (parsons.displaySlowdown / 0.2) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Parsons divided high-pressure steam expansion across multiple expanding annular rows of reaction blades, keeping tip velocity manageable while directly driving high-speed electrical alternators.",
  },
  "gb-913-watt-separate-condenser": {
    domain: "thermodynamics",
    domainTitle: "Thermodynamic Steam Cycles & Separate Condenser",
    equationName: "Thermal Efficiency & In-Cylinder Quench Reduction",
    engineMethod: "stepWattCondenser",
    governingEquation:
      "\\eta_{\\text{th}} = \\frac{W_{\\text{net}}}{Q_{\\text{in}}} = \\frac{\\text{IMEP} \\cdot V_{\\text{disp}}}{Q_{\\text{steam}} + Q_{\\text{quench}}}",
    controls: [
      {
        id: "boilerPressurePsi",
        label: "Boiler Gauge Pressure",
        min: 0.5,
        max: 10.0,
        step: 0.5,
        defaultValue: 3.0,
        unit: "psi",
      },
      {
        id: "condenserTempC",
        label: "Condenser Cistern Temp",
        min: 10,
        max: 60,
        step: 1,
        defaultValue: 35,
        unit: "°C",
      },
      {
        id: "cylinderBoreInches",
        label: "Cylinder Bore",
        min: 20,
        max: 72,
        step: 2,
        defaultValue: 38,
        unit: "in",
      },
      {
        id: "pistonStrokeFeet",
        label: "Stroke Length",
        min: 4,
        max: 10,
        step: 0.5,
        defaultValue: 6.0,
        unit: "ft",
      },
      {
        id: "strokesPerMinute",
        label: "Cadence",
        min: 6,
        max: 24,
        step: 1,
        defaultValue: 14,
        unit: "spm",
      },
      {
        id: "hasSeparateCondenser",
        label: "Watt Condenser (vs Newcomen)",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "",
      },
    ],
    computeMetrics: (p) => {
      const watt = stepWattCondenser({
        boilerPressurePsi: p.boilerPressurePsi,
        condenserTempC: p.condenserTempC,
        cylinderBoreInches: p.cylinderBoreInches,
        pistonStrokeFeet: p.pistonStrokeFeet,
        strokesPerMinute: p.strokesPerMinute,
        hasSeparateCondenser: (p.hasSeparateCondenser ?? 1) > 0.5,
        hasSteamJacket: true,
      });

      return [
        {
          label: "Indicated Power",
          value: `${watt.indicatedHorsepower.toFixed(1)} hp (${watt.indicatedPowerKw.toFixed(1)} kW)`,
          unit: "hp",
          badgeColor: "emerald",
          progressPct: Math.min(100, (watt.indicatedHorsepower / 50.0) * 100),
        },
        {
          label: "Condenser Vacuum",
          value: `${watt.vacuumDepthInchesHg.toFixed(1)} inHg (${watt.condenserPressureAbsKpa.toFixed(1)} kPa)`,
          unit: "inHg",
          badgeColor: "cyan",
          progressPct: Math.min(100, (watt.vacuumDepthInchesHg / 29.92) * 100),
        },
        {
          label: "Thermal Efficiency",
          value: `${watt.thermalEfficiencyPct.toFixed(2)}%`,
          unit: "%",
          badgeColor: "amber",
          progressPct: Math.min(100, (watt.thermalEfficiencyPct / 6.0) * 100),
        },
        {
          label: "Coal Burn Rate",
          value: `${watt.coalConsumptionKgPerHour.toFixed(1)} kg/hr`,
          unit: "kg/h",
          badgeColor: "rose",
          progressPct: Math.min(100, (watt.coalConsumptionKgPerHour / 150.0) * 100),
        },
        {
          label: "Mine Water Lift (183m)",
          value: `${Math.round(watt.waterPumpedGallonsPerHour).toLocaleString()} gal/hr`,
          unit: "gph",
          badgeColor: "indigo",
          progressPct: Math.min(100, (watt.waterPumpedM3PerHour / 120.0) * 100),
        },
        {
          label: "Coal Savings / Year",
          value: `${Math.round(watt.coalSavedTonsPerYear).toLocaleString()} tons`,
          unit: "tons/yr",
          badgeColor: "emerald",
          progressPct: Math.min(100, (watt.coalSavedTonsPerYear / 1500.0) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "By condensing steam in an external cold chamber while keeping the main working cylinder continuously hot via a steam jacket, Watt eliminated Newcomen's massive cyclic thermal quench penalty, reducing fuel consumption by over 75%.",
  },
  "gb-931-arkwright-water-frame": {
    domain: "mechanics",
    domainTitle: "Differential Roller Drafting & Flyer Twist Kinetics",
    equationName: "Draft Attenuation, Flyer Twist, and Yarn Tenacity",
    governingEquation:
      "D = \\frac{v_{\\text{delivery}}}{v_{\\text{feed}}} = \\frac{r_4 \\omega_4}{r_1 \\omega_1} \\quad \\text{and} \\quad \\text{TPM} = \\frac{\\Omega_{\\text{flyer}}}{v_{\\text{delivery}}}",
    engineMethod: "stepArkwrightWaterFrame",
    controls: [
      {
        id: "waterWheelRpm",
        label: "Water Wheel Speed",
        min: 60,
        max: 260,
        step: 10,
        defaultValue: 180,
        unit: "RPM",
      },
      {
        id: "totalDraftRatio",
        label: "Draft Ratio (D)",
        min: 3.0,
        max: 10.0,
        step: 0.5,
        defaultValue: 6.0,
        unit: "×",
      },
      {
        id: "rollerClampingWeightKg",
        label: "Roller Pressure Weight",
        min: 1.0,
        max: 6.0,
        step: 0.5,
        defaultValue: 3.5,
        unit: "kg",
      },
      {
        id: "stapleLengthMm",
        label: "Cotton Staple Length",
        min: 20,
        max: 38,
        step: 1,
        defaultValue: 28,
        unit: "mm",
      },
      {
        id: "inputRovingCountNe",
        label: "Input Roving Count",
        min: 0.5,
        max: 2.0,
        step: 0.1,
        defaultValue: 1.0,
        unit: "Ne",
      },
    ],
    computeMetrics: (p) => {
      const arkwright = stepArkwrightWaterFrame({
        waterWheelRpm: p.waterWheelRpm,
        totalDraftRatio: p.totalDraftRatio,
        rollerClampingWeightKg: p.rollerClampingWeightKg,
        stapleLengthMm: p.stapleLengthMm,
        inputRovingCountNe: p.inputRovingCountNe,
      });

      return [
        {
          label: "Flyer Spindle Speed",
          value: `${Math.round(arkwright.flyerSpindleRpm).toLocaleString()} RPM`,
          unit: `${arkwright.spindleOmegaRadPerSec.toFixed(0)} rad/s`,
          badgeColor: "cyan",
          progressPct: Math.min(100, (arkwright.flyerSpindleRpm / 4500.0) * 100),
        },
        {
          label: "Yarn Count (English)",
          value: `${arkwright.outputYarnCountNe.toFixed(1)} Ne`,
          unit: `${arkwright.yarnLinearDensityTex.toFixed(1)} Tex`,
          badgeColor: "amber",
          progressPct: Math.min(100, (arkwright.outputYarnCountNe / 16.0) * 100),
        },
        {
          label: "Imparted Twist",
          value: `${Math.round(arkwright.twistTurnsPerMeter).toLocaleString()} TPM`,
          unit: `${arkwright.twistTurnsPerInch.toFixed(1)} TPI`,
          badgeColor: "indigo",
          progressPct: Math.min(100, (arkwright.twistTurnsPerMeter / 800.0) * 100),
        },
        {
          label: "Fiber Parallelization",
          value: `${arkwright.fiberParallelizationPct.toFixed(1)}%`,
          unit: "slip-free",
          badgeColor: "emerald",
          progressPct: arkwright.fiberParallelizationPct,
        },
        {
          label: "Yarn Breaking Strength",
          value: `${arkwright.yarnBreakingForceN.toFixed(2)} N`,
          unit: arkwright.isWarpGradeWaterTwist ? "Warp-Grade" : "Weft-Only",
          badgeColor: arkwright.isWarpGradeWaterTwist ? "emerald" : "rose",
          progressPct: Math.min(100, (arkwright.yarnBreakingForceN / 4.0) * 100),
        },
        {
          label: "Cromford Mill Output",
          value: `${arkwright.millProductionKgPerDay.toFixed(1)} kg/day`,
          unit: "96 spindles",
          badgeColor: "purple",
          progressPct: Math.min(100, (arkwright.millProductionKgPerDay / 15.0) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Arkwright's differential drawing rollers stretched roving into fine, parallel fibers without hand human touch, while the high-velocity flyer imparted intense helical twist, creating the world's first industrial warp-grade all-cotton yarn.",
  },
  "gb-1306-watt-rotary-engine": {
    domain: "thermodynamics",
    domainTitle: "Rotary Steam Engine & Epicyclic Gearing",
    equationName: "Epicyclic Speed Multiplication & Instantaneous Shaft Torque",
    governingEquation:
      "\\omega_{\\text{shaft}} = \\omega_{\\text{beam}} \\left(1 + \\frac{N_{\\text{planet}}}{N_{\\text{sun}}}\\right) = 2 \\cdot \\omega_{\\text{beam}} \\quad \\text{and} \\quad \\tau = \\frac{1}{2} F_{\\text{rod}} r_s \\sin(\\theta)",
    engineMethod: "stepWattRotaryEngine",
    controls: [
      {
        id: "strokeRateSpm",
        label: "Beam Stroke Rate",
        min: 10,
        max: 30,
        step: 2,
        defaultValue: 20,
        unit: "SPM",
      },
      {
        id: "boilerPressureKpa",
        label: "Effective Steam Pressure",
        min: 40,
        max: 120,
        step: 5,
        defaultValue: 70,
        unit: "kPa",
      },
      {
        id: "gearRatioNpOverNs",
        label: "Planet / Sun Gear Ratio",
        min: 0.5,
        max: 2.0,
        step: 0.25,
        defaultValue: 1.0,
        unit: "ratio",
      },
      {
        id: "flywheelMassKg",
        label: "Flywheel Mass",
        min: 1000,
        max: 6000,
        step: 250,
        defaultValue: 3500,
        unit: "kg",
      },
    ],
    computeMetrics: (p) => {
      const watt = stepWattRotaryEngine({
        strokeRateSpm: p.strokeRateSpm,
        boilerPressureKpa: p.boilerPressureKpa,
        gearRatioNpOverNs: p.gearRatioNpOverNs,
        flywheelMassKg: p.flywheelMassKg,
      });

      return [
        {
          label: "Driveshaft Speed",
          value: `${watt.shaftRpm.toFixed(1)} RPM`,
          unit: `${watt.speedMultiplier.toFixed(1)}× Speed Multiplier`,
          badgeColor: "amber",
          progressPct: Math.min(100, (watt.shaftRpm / 60.0) * 100),
        },
        {
          label: "Indicated Shaft Power",
          value: `${watt.meanPowerKw.toFixed(1)} kW`,
          unit: `${watt.brakeHorsepower.toFixed(1)} hp`,
          badgeColor: "emerald",
          progressPct: Math.min(100, (watt.meanPowerKw / 40.0) * 100),
        },
        {
          label: "Piston Driving Force",
          value: `${(watt.pistonForceN / 1e3).toFixed(1)} kN`,
          unit: "Single-acting condensing",
          badgeColor: "rose",
          progressPct: Math.min(100, (watt.pistonForceN / 50e3) * 100),
        },
        {
          label: "Tooth Contact Force",
          value: `${(watt.tangentialToothForceN / 1e3).toFixed(1)} kN`,
          unit: "Pitch line spur mesh",
          badgeColor: "cyan",
          progressPct: Math.min(100, (watt.tangentialToothForceN / 25e3) * 100),
        },
        {
          label: "Flywheel Kinetic Energy",
          value: `${(watt.flywheelKineticEnergyJ / 1e3).toFixed(1)} kJ`,
          unit: `I = 10,080 kg·m²`,
          badgeColor: "indigo",
          progressPct: Math.min(100, (watt.flywheelKineticEnergyJ / 200e3) * 100),
        },
        {
          label: "Speed Fluctuation (δ)",
          value: `${(watt.speedFluctuationCoeff * 100).toFixed(1)}%`,
          unit: "Flywheel smoothing",
          badgeColor: watt.speedFluctuationCoeff < 0.2 ? "emerald" : "amber",
          progressPct: Math.max(0, 100 - watt.speedFluctuationCoeff * 200),
        },
      ];
    },
    pedagogicalInsight:
      "Watt's Sun and Planet epicyclic gearing doubled the rotational output speed of the engine driveshaft without extra gears. Bolting the planet wheel rigidly to the connecting rod forced the central sun wheel to make two complete revolutions for every single reciprocating double-stroke of the walking beam.",
  },
  "gb-1420-cort-puddling-rolling": {
    domain: "metallurgy",
    domainTitle: "Reverberatory Decarburization & Grooved Roll Extrusion",
    equationName: "Arrhenius Decarburization, Solidus Elevation, and Hydrostatic Slag Squeeze",
    governingEquation:
      "\\frac{d[\\text{C}]}{dt} = -k_0 e^{-\\frac{E_a}{RT}} (1 + \\beta \\omega_{\\text{rabble}}) [\\text{C}] \\quad \\text{and} \\quad P_{\\text{roll}} = \\sigma_{\\text{flow}} \\left(1 + \\frac{1.2 L_{\\text{bite}}}{2 h}\\right)",
    engineMethod: "stepCortPuddlingRolling",
    controls: [
      {
        id: "furnaceTemperatureCelsius",
        label: "Furnace Temperature",
        min: 1150,
        max: 1550,
        step: 25,
        defaultValue: 1350,
        unit: "°C",
      },
      {
        id: "initialCarbonPercent",
        label: "Pig Iron Carbon",
        min: 2.8,
        max: 4.5,
        step: 0.1,
        defaultValue: 3.8,
        unit: "% C",
      },
      {
        id: "rabbleStirringRpm",
        label: "Rabble Stirring Rate",
        min: 0,
        max: 25,
        step: 5,
        defaultValue: 15,
        unit: "RPM",
      },
      {
        id: "puddlingDurationMinutes",
        label: "Puddling Time",
        min: 30,
        max: 150,
        step: 10,
        defaultValue: 90,
        unit: "min",
      },
      {
        id: "rollerPassCount",
        label: "Grooved Roll Passes",
        min: 1,
        max: 8,
        step: 1,
        defaultValue: 5,
        unit: "passes",
      },
    ],
    computeMetrics: (p) => {
      const cort = stepCortPuddlingRolling({
        furnaceTemperatureCelsius: p.furnaceTemperatureCelsius,
        initialCarbonPercent: p.initialCarbonPercent,
        rabbleStirringRpm: p.rabbleStirringRpm,
        puddlingDurationMinutes: p.puddlingDurationMinutes,
        rollerPassCount: p.rollerPassCount,
      });

      return [
        {
          label: "Residual Carbon",
          value: `${cort.residualCarbonPercent.toFixed(2)}% C`,
          unit: cort.isPastyNatureState ? "Decarburized Wrought" : "Liquid Pig Iron",
          badgeColor: cort.isPastyNatureState ? "emerald" : "amber",
          progressPct: Math.min(100, (cort.residualCarbonPercent / 4.0) * 100),
        },
        {
          label: "Iron Melting Point",
          value: `${cort.ironMeltingPointCelsius} °C`,
          unit: `Solidus (+${cort.ironMeltingPointCelsius - 1147} °C rise)`,
          badgeColor: "rose",
          progressPct: Math.min(100, ((cort.ironMeltingPointCelsius - 1100) / 450) * 100),
        },
        {
          label: "State of Charge",
          value: cort.isPastyNatureState ? "Spongy / Nature" : "Molten Fluid",
          unit: `${((cort.carbonRemovedPercent * 100) / (p.initialCarbonPercent ?? 3.8)).toFixed(0)}% removed`,
          badgeColor: cort.isPastyNatureState ? "emerald" : "cyan",
          progressPct: Math.min(
            100,
            (cort.carbonRemovedPercent / (p.initialCarbonPercent ?? 3.8)) * 100,
          ),
        },
        {
          label: "Residual Slag Content",
          value: `${cort.residualSlagVolumeFractionPercent.toFixed(1)}%`,
          unit: `Expelled ${cort.slagExpelledKg.toFixed(1)} kg`,
          badgeColor: "indigo",
          progressPct: Math.min(100, (cort.residualSlagVolumeFractionPercent / 16.0) * 100),
        },
        {
          label: "Tensile Strength",
          value: `${cort.tensileStrengthMpa.toFixed(0)} MPa`,
          unit: `${cort.ductilityElongationPercent.toFixed(0)}% Elongation`,
          badgeColor: "emerald",
          progressPct: Math.min(100, (cort.tensileStrengthMpa / 380.0) * 100),
        },
        {
          label: "Industrial Speedup",
          value: `${cort.productionSpeedupVsHammer}×`,
          unit: `${cort.hourlyIronOutputKg} kg/h vs hammer`,
          badgeColor: "purple",
          progressPct: 100,
        },
      ];
    },
    pedagogicalInsight:
      "Cort's reverberatory furnace decarbonized pig iron by sweeping coal flames over the bath without sulfur contamination. As carbon escaped, the iron's melting point rose above furnace heat—causing it to solidify into pasty 'nature' grains that grooved rollers welded into fibrous wrought iron bars in a single heat.",
  },
  "us-x1-hopkins-potash": {
    domain: "thermochemistry",
    domainTitle: "Potash Calcination & Leaching Kinetics",
    equationName: "Thermal Decarbonization & Potash Mass Balance",
    engineMethod: "stepHopkinsPotash",
    governingEquation:
      "m_{\\text{potash}} = m_{\\text{raw}} \\cdot \\eta_{\\text{calc}} \\cdot \\frac{M_{\\text{K}_2\\text{CO}_3}}{M_{\\text{ash}}}",
    controls: [
      {
        id: "roastTempC",
        label: "Furnace Temp",
        min: 500,
        max: 950,
        step: 25,
        defaultValue: 750,
        unit: "°C",
        provenance: "scenario-reader",
      },
      {
        id: "roastTimeHours",
        label: "Roasting Time",
        min: 0.5,
        max: 6.0,
        step: 0.5,
        defaultValue: 2.5,
        unit: "hrs",
        provenance: "scenario-reader",
      },
      {
        id: "ashBatchKg",
        label: "Raw Ash Batch",
        min: 50,
        max: 500,
        step: 25,
        defaultValue: 200,
        unit: "kg",
        provenance: "scenario-reader",
      },
      {
        id: "waterTempC",
        label: "Water Temp",
        min: 20,
        max: 100,
        step: 5,
        defaultValue: 80,
        unit: "°C",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics: (p) => {
      const hopkins = stepHopkinsPotash({
        roastTempC: p.roastTempC,
        roastTimeHours: p.roastTimeHours,
        ashBatchKg: p.ashBatchKg,
        waterTempC: p.waterTempC,
      });
      return [
        {
          label: "Pearl Ash Yield",
          value: `${hopkins.pearlAshYieldKg.toFixed(1)} kg`,
          unit: "K₂CO₃",
          badgeColor: "emerald",
          progressPct: clampProgress((hopkins.pearlAshYieldKg / 50) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Carbon Combustion",
          value: `${hopkins.decarbonizationPct.toFixed(1)}%`,
          unit: "η_comb",
          badgeColor: "amber",
          progressPct: clampProgress(hopkins.decarbonizationPct),
          provenance: "scenario-modern",
        },
        {
          label: "Potash Purity",
          value: `${hopkins.pearlAshPurityPct.toFixed(1)}%`,
          unit: "purity",
          badgeColor: "cyan",
          progressPct: clampProgress(hopkins.pearlAshPurityPct),
          provenance: "scenario-modern",
        },
        {
          label: "Dissolved K₂CO₃",
          value: `${hopkins.leyConcentrationGpl.toFixed(1)} g/L`,
          unit: "conc",
          badgeColor: "purple",
          progressPct: clampProgress((hopkins.leyConcentrationGpl / 200) * 100),
          provenance: "scenario-modern",
        },
      ];
    },
    pedagogicalInsight:
      "Samuel Hopkins burned raw wood ashes before leaching to incinerate combustible organic impurities, doubling pearl ash yield and producing high-purity potassium carbonate.",
  },
  "us-400766-hall-aluminium": {
    domain: "materials_nanotech",
    domainTitle: "Hall-Héroult Molten Salt Electrolysis & Cryolite Dissolution",
    equationName: "Faraday's Law of Electrolysis & Cell Voltage",
    governingEquation:
      "m_{\\text{Al}} = \\frac{I \\cdot t \\cdot M}{z \\cdot F} \\eta_{\\text{curr}} \\quad \\text{and} \\quad V_{\\text{cell}} = E_{\\text{rev}} + \\eta + I R_{\\text{bath}}",
    engineMethod: "FrankenSimEngine.stepHallAluminium",
    controls: [
      {
        id: "currentAmperes",
        label: "Cell DC Current",
        min: 100000,
        max: 500000,
        step: 10000,
        defaultValue: 300000,
        unit: "A",
      },
      {
        id: "bathTemperatureCelsius",
        label: "Cryolite Bath Temp",
        min: 920,
        max: 1020,
        step: 5,
        defaultValue: 960,
        unit: "°C",
      },
      {
        id: "aluminaConcentrationPct",
        label: "Alumina (Al₂O₃) Conc",
        min: 2,
        max: 8,
        step: 0.5,
        defaultValue: 5.5,
        unit: "%",
      },
    ],
    computeMetrics: (p) => {
      const hall = stepHallAluminium({
        currentAmperes: p.currentAmperes,
        bathTemperatureCelsius: p.bathTemperatureCelsius,
        aluminaConcentrationPct: p.aluminaConcentrationPct,
      });
      return [
        {
          label: "Al Production Rate",
          value: `${hall.aluminiumProductionRateKgPerHour.toFixed(1)} kg/h`,
          unit: "m_Al",
          badgeColor: "cyan",
          progressPct: clampProgress((hall.aluminiumProductionRateKgPerHour / 160) * 100),
        },
        {
          label: "Current Efficiency",
          value: `${hall.currentEfficiencyPct.toFixed(1)}%`,
          unit: "η_curr",
          badgeColor: "emerald",
          progressPct: clampProgress(hall.currentEfficiencyPct),
        },
        {
          label: "Total Cell Voltage",
          value: `${hall.totalCellVoltage.toFixed(2)} V`,
          unit: "V_cell",
          badgeColor: "amber",
          progressPct: clampProgress((hall.totalCellVoltage / 6) * 100),
        },
        {
          label: "Specific Energy",
          value: `${hall.specificEnergyKwhPerKg.toFixed(2)} kWh/kg`,
          unit: "E_spec",
          badgeColor: "purple",
          progressPct: clampProgress((hall.specificEnergyKwhPerKg / 20) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Charles Martin Hall discovered that dissolving alumina in molten cryolite lowers the smelting melting point by over 1000 °C, enabling high-yield electrochemical reduction of pure aluminium at industrial scale.",
  },
  "us-307031-edison-indicator": {
    domain: "electromagnetism",
    domainTitle: "Incandescent-Lamp Vacuum Circuit Topology",
    equationName: "Source-Stated Internal-to-External Circuit Path",
    governingEquation:
      "\\text{internal terminal} \\rightarrow \\text{external apparatus} \\rightarrow \\text{lamp circuit}",
    engineMethod: "Source-bounded TypeScript circuit state; no quantitative emission model",
    controls: [
      {
        id: "plateBiasPolarity",
        label: "External Connection",
        min: -1,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "source polarity",
        provenance: "source-disclosed",
      },
    ],
    computeMetrics: (p) => {
      const positiveSide = (p.plateBiasPolarity ?? 1) > 0;
      return [
        {
          label: "Internal Terminal",
          value: "in vacuous globe",
          unit: "source text",
          badgeColor: "cyan",
          progressPct: 100,
          provenance: "source-disclosed",
        },
        {
          label: "External Connection",
          value: positiveSide ? "positive side" : "other side",
          unit: "reader comparison",
          badgeColor: positiveSide ? "emerald" : "indigo",
          progressPct: positiveSide ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Illustrated Apparatus",
          value: "galvanometer",
          unit: "source text",
          badgeColor: "indigo",
          progressPct: 100,
          provenance: "source-disclosed",
        },
        {
          label: "Printed Conductors",
          value: "1 and 2",
          unit: "figure labels",
          badgeColor: "amber",
          progressPct: 100,
          provenance: "source-disclosed",
        },
      ];
    },
    pedagogicalInsight:
      "The grant places one circuit terminal inside an incandescent lamp's vacuous globe and connects the other terminal externally, in some claims specifically to the positive side, so electrical apparatus in that circuit can indicate or control the lamp system. It prints no operating voltage, vacuum pressure, temperature, current, or sensitivity.",
  },
  "us-6285999-pagerank": {
    domain: "network_dynamics",
    domainTitle: "Markov Chain Stationary Distributions & Link Centrality",
    equationName: "PageRank Stationary Probability Distribution",
    governingEquation:
      "PR(u) = \\frac{\\alpha}{N} + (1-\\alpha) \\sum_{v \\in B_u} \\frac{PR(v)}{L(v)}",
    engineMethod: "stepPageRank",
    controls: [
      {
        id: "dampingFactor",
        label: "Link-follow probability (1−α)",
        min: 0.0,
        max: 1.0,
        step: 0.05,
        defaultValue: 0.85,
        unit: "",
      },
    ],
    computeMetrics: (p) => {
      const out = stepPageRank({ dampingFactor: p.dampingFactor ?? 0.85 });
      const maxRank = Math.max(...out.ranks);
      return [
        {
          label: "Max Node Centrality",
          value: maxRank.toFixed(3),
          unit: "PR",
          badgeColor: "cyan",
          progressPct: clampProgress(maxRank * 100),
        },
        {
          label: "Random Jump Probability",
          value: `${((1 - (p.dampingFactor ?? 0.85)) * 100).toFixed(1)}%`,
          unit: "α",
          badgeColor: "amber",
          progressPct: clampProgress((1 - (p.dampingFactor ?? 0.85)) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "The patent calls α the random-jump probability and assigns each backlink source a normalized contribution through 1−α; repeated application approaches a steady-state score vector when the iteration converges.",
  },
  "us-2988237-devol-programmed-transfer": {
    domain: "source_bounded_programmed_transfer_control",
    domainTitle: "Program-Drum Code Coincidence",
    equationName: "Coded Position Matching and Anticipation",
    governingEquation:
      "d_H(c_{program},c_{encoder})=0;\\quad \\text{advance sensing}\\rightarrow\\text{true-position sensing}",
    engineMethod: "stepDevolProgrammedTransfer (source-bounded TypeScript code-state)",
    controls: [
      {
        id: "recordedSlot",
        label: "Recorded program slot",
        min: 0,
        max: 255,
        step: 1,
        defaultValue: 11,
        unit: "code",
      },
      {
        id: "sensedSlot",
        label: "Sensed encoder slot",
        min: 0,
        max: 255,
        step: 1,
        defaultValue: 3,
        unit: "code",
      },
      {
        id: "bitWidth",
        label: "Code bit width",
        min: 2,
        max: 8,
        step: 1,
        defaultValue: 6,
        unit: "bits",
      },
      {
        id: "anticipationEnabled",
        label: "Claim 8 anticipatory sensing",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "off/on",
      },
      {
        id: "recordingMode",
        label: "Claim 5 record / replay",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        unit: "replay/record",
      },
      {
        id: "gripperClosed",
        label: "Claim 6 article gripper",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        unit: "open/seizing",
      },
    ],
    computeMetrics: (params) => {
      const state = stepDevolProgrammedTransfer(params);
      return [
        {
          label: "Code Agreement",
          value: `${state.matchingBits}/${state.bitWidth}`,
          unit: "matching bits",
          badgeColor: state.coincidence ? "emerald" : "amber",
          progressPct: (state.matchingBits / state.bitWidth) * 100,
        },
        {
          label: "Hamming Distance",
          value: String(state.hammingDistance),
          unit: "unequal bits",
          badgeColor: state.hammingDistance === 0 ? "emerald" : "rose",
          progressPct: (state.hammingDistance / state.bitWidth) * 100,
        },
        {
          label: "Traversal State",
          value: state.traversalMode.replaceAll("-", " ").toUpperCase(),
          unit: "coded control",
          badgeColor: "indigo",
        },
        {
          label: "Sensing Relationship",
          value: state.sensingRelationship.replaceAll("-", " ").toUpperCase(),
          unit: "Claim 8 state",
          badgeColor: state.coincidence ? "emerald" : "cyan",
        },
        {
          label: "Program / Gripper",
          value: `${state.programPhase.toUpperCase()} · ${state.gripperState.toUpperCase()}`,
          unit: "function code",
          badgeColor: "purple",
        },
      ];
    },
    pedagogicalInsight:
      "US 2,988,237 claims a program controller, a mechanically coupled position representation, and coincidence-based control, plus record/replay and anticipatory sensing forms. It supplies an illustrative one-sixteenth-inch code increment but no transfer-head geometry, payload, hydraulic pressure, speed, braking law, or controller gain. This shared instrument deliberately reports discrete code state and refuses SI kinematics, forces, rates, and contact performance.",
  },
  "us-3212649-amf-versatran": {
    domain: "source_bounded_robot_kinematics",
    domainTitle: "Hydraulic Manipulator & Resolver–Tape Replay",
    equationName: "Normalized Resolver–Tape Phase Comparison",
    governingEquation: "e_i = \\operatorname{wrap}(\\phi_{T,i} - \\phi_{R,i})",
    engineMethod:
      "stepAmfVersatranTopology (source-bounded TypeScript topology; no FrankenSim/WASM module)",
    controls: [
      {
        id: "columnRotation",
        label: "Column rotation",
        min: -1,
        max: 1,
        step: 0.05,
        defaultValue: 0,
        unit: "normalized turn",
      },
      {
        id: "carriageLift",
        label: "Vertical carriage lift",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0.55,
        unit: "normalized travel",
      },
      {
        id: "armTravel",
        label: "Horizontal arm travel",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0.55,
        unit: "normalized travel",
      },
      {
        id: "wristRotation",
        label: "Wrist rotation about arm axis",
        min: -1,
        max: 1,
        step: 0.05,
        defaultValue: 0,
        unit: "normalized rotation",
      },
      {
        id: "wristSwing",
        label: "Wrist swing about central vertical axis",
        min: -1,
        max: 1,
        step: 0.05,
        defaultValue: 0,
        unit: "normalized swing",
      },
      {
        id: "gripperOperation",
        label: "Gripper operation",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0.25,
        unit: "open..closed",
      },
      {
        id: "teachReplayMode",
        label: "Mode (0=Teach, 1=Replay)",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        unit: "teach/replay",
      },
      {
        id: "resolverPhaseOffset",
        label: "Resolver phase offset",
        min: -1,
        max: 1,
        step: 0.05,
        defaultValue: 0,
        unit: "normalized phase",
      },
      {
        id: "claim1TopologyEnabled",
        label: "Claim 1 six-motion topology",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "claim probe",
      },
      {
        id: "claim8RecordPlaybackEnabled",
        label: "Claim 8 record/playback path",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "claim probe",
      },
      {
        id: "claim12PinionGripperEnabled",
        label: "Claim 12 pinion gripper",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "claim probe",
      },
    ],
    computeMetrics: (params) => {
      const state = stepAmfVersatranTopology(params);
      const comparison = state.comparisonChannels[2];
      return [
        {
          label: "Program Mode",
          value: !state.claimProbeStates[8]
            ? "REPLAY PATH WITHHELD"
            : state.programMode === "automatic-recorded-signal-playback"
              ? "TAPE REPLAY"
              : "MANUAL TEACH",
          unit: "operational state",
          badgeColor:
            state.programMode === "automatic-recorded-signal-playback" ? "emerald" : "cyan",
        },
        {
          label: "Six-Motion Pose",
          value: state.claimProbeStates[1]
            ? [
                `C ${state.controls.columnRotation.toFixed(2)}`,
                `V ${state.controls.carriageLift.toFixed(2)}`,
                `A ${state.controls.armTravel.toFixed(2)}`,
                `R ${state.controls.wristRotation.toFixed(2)}`,
                `S ${state.controls.wristSwing.toFixed(2)}`,
                `G ${state.controls.gripperOperation.toFixed(2)}`,
              ].join(" · ")
            : "CLAIM 1 TOPOLOGY WITHHELD",
          unit: "normalized display",
          badgeColor: state.claimProbeStates[1] ? "cyan" : "rose",
        },
        {
          label: "Arm Travel",
          value: state.controls.armTravel.toFixed(2),
          unit: "normalized travel",
          badgeColor: "indigo",
          progressPct: clampProgress(state.controls.armTravel * 100),
        },
        {
          label: "Tracking State",
          value: state.trackingState.toUpperCase(),
          unit: "phase sync",
          badgeColor: state.maximumNormalizedPhaseError === 0 ? "emerald" : "amber",
        },
        {
          label: "Max Phase Error",
          value: state.maximumNormalizedPhaseError.toFixed(3),
          unit: "normalized phase",
          badgeColor: state.maximumNormalizedPhaseError > 0.1 ? "rose" : "indigo",
        },
        {
          label: "Tape Command Phase",
          value: comparison ? comparison.recordedSignalPhase.toFixed(3) : "WITHHELD",
          unit: "normalized phase · arm channel",
          badgeColor: comparison ? "amber" : "purple",
        },
        {
          label: "Resolver Feedback Phase",
          value: comparison ? comparison.feedbackSignalPhase.toFixed(3) : "WITHHELD",
          unit: "normalized phase · arm channel",
          badgeColor: comparison ? "cyan" : "purple",
        },
        {
          label: "Signed Phase Error",
          value: comparison ? comparison.normalizedPhaseError.toFixed(3) : "WITHHELD",
          unit: "normalized phase · arm channel",
          badgeColor:
            comparison && Math.abs(comparison.normalizedPhaseError) > 0.1 ? "rose" : "indigo",
        },
        {
          label: "Active Claim Scope",
          value: state.claimProbeStates[state.activeClaim]
            ? `Claim ${state.activeClaim}`
            : `Claim ${state.activeClaim} withheld`,
          unit: "legal boundary",
          badgeColor: "purple",
        },
        {
          label: "Hydraulic Refusal",
          value: "REFUSED",
          unit: "boundary active",
          badgeColor: "purple",
        },
      ];
    },
    pedagogicalInsight:
      "US 3,212,649 discloses a column, carriage, arm, wrist rotation, wrist swing, gripper operation, tape recording/playback, and resolver/error-detector paths. This shared instrument reports only normalized exhibit topology and phase comparison; it refuses unprinted dimensions, pressure, flow, payload, gain, timing, and performance values.",
  },
  "us-3081379-lemelson-machine-vision": {
    domain: "optical_electronics",
    domainTitle: "Television Raster Scanning & Machine Vision",
    equationName: "Video Line Scan Dimensional Slicing & Defect Detection",
    governingEquation:
      "f_H = N_L \\cdot f_F,\\quad v_{\\text{scan}} = \\frac{W_{\\text{target}}}{T_{\\text{active}}},\\quad L_{\\text{meas}} = v_{\\text{scan}} \\cdot \\tau_{\\text{pulse}},\\quad F_{\\text{mag}} = \\frac{(N I)^2 \\mu_0 A_p}{2 g^2}",
    engineMethod: "stepLemelsonMachineVisionSi (analytical SI optical signal & solenoid dynamics)",
    controls: [
      {
        id: "scanLineCount",
        label: "Raster scan lines",
        min: 100,
        max: 1200,
        step: 25,
        defaultValue: 525,
        unit: "lines",
      },
      {
        id: "frameRateHz",
        label: "Frame rate",
        min: 10,
        max: 120,
        step: 5,
        defaultValue: 30,
        unit: "Hz",
      },
      {
        id: "targetWidthM",
        label: "Field of view width",
        min: 0.05,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.2,
        unit: "m",
      },
      {
        id: "illuminationLux",
        label: "Illumination level",
        min: 100,
        max: 10000,
        step: 100,
        defaultValue: 1500,
        unit: "lux",
      },
      {
        id: "thresholdVoltage",
        label: "Threshold comparator level",
        min: 0.05,
        max: 1.0,
        step: 0.05,
        defaultValue: 0.45,
        unit: "V",
      },
      {
        id: "nominalPartWidthM",
        label: "Nominal part width",
        min: 0.01,
        max: 0.5,
        step: 0.005,
        defaultValue: 0.08,
        unit: "m",
      },
      {
        id: "actualPartWidthM",
        label: "Actual part width",
        min: 0.01,
        max: 0.5,
        step: 0.001,
        defaultValue: 0.082,
        unit: "m",
      },
      {
        id: "conveyorSpeedMPerS",
        label: "Conveyor speed",
        min: 0.01,
        max: 2.0,
        step: 0.05,
        defaultValue: 0.25,
        unit: "m/s",
      },
      {
        id: "gateSolenoidCurrentA",
        label: "Solenoid coil current",
        min: 0.1,
        max: 10.0,
        step: 0.1,
        defaultValue: 2.5,
        unit: "A",
      },
    ],
    computeMetrics(rawParams) {
      const controls = readLemelsonMachineVisionControls(rawParams);
      const state = stepLemelsonMachineVisionSi(controls);
      return [
        {
          id: "horizontalScanFreqHz",
          label: "Horizontal Scan Freq (f_H)",
          value: state.metrics.horizontalScanFreqHz.toFixed(0),
          unit: "Hz",
          precision: 0,
          badgeColor: "emerald",
        },
        {
          id: "linePeriodUs",
          label: "Line Duration (T_H)",
          value: state.metrics.linePeriodUs.toFixed(2),
          unit: "µs",
          precision: 2,
          badgeColor: "cyan",
        },
        {
          id: "scanBeamVelocityMPerS",
          label: "Beam Scan Velocity (v_scan)",
          value: state.metrics.scanBeamVelocityMPerS.toFixed(1),
          unit: "m/s",
          precision: 1,
          badgeColor: "indigo",
        },
        {
          id: "pulseWidthUs",
          label: "Detected Pulse Width (τ)",
          value: state.metrics.pulseWidthUs.toFixed(2),
          unit: "µs",
          precision: 2,
          badgeColor: "amber",
        },
        {
          id: "measuredPartWidthMm",
          label: "Measured Width (L_meas)",
          value: state.metrics.measuredPartWidthMm.toFixed(1),
          unit: "mm",
          precision: 1,
          badgeColor: "emerald",
        },
        {
          id: "dimensionalErrorMm",
          label: "Dimensional Deviation (ΔL)",
          value: state.metrics.dimensionalErrorMm.toFixed(2),
          unit: "mm",
          precision: 2,
          badgeColor: state.defectDetected ? "rose" : "indigo",
        },
        {
          id: "solenoidForceN",
          label: "Reject Solenoid Force (F_mag)",
          value: state.metrics.solenoidForceN.toFixed(2),
          unit: "N",
          precision: 2,
          badgeColor: "purple",
        },
        {
          id: "gateResponseTimeMs",
          label: "Gate Trip Response (t_act)",
          value: state.metrics.gateResponseTimeMs.toFixed(1),
          unit: "ms",
          precision: 1,
          badgeColor: "cyan",
        },
      ];
    },
    pedagogicalInsight:
      "US 3,081,379 discloses using television raster lines to scan manufactured parts on a conveyor, converting photometric light patterns into electrical video waveforms, slicing with threshold gates, and converting pulse duration into dimension metrics to trigger high-speed sorting gates.",
  },
  "us-3260375-lemelson-adjustable-manipulator": {
    domain: "source_bounded_robot_kinematics",
    domainTitle: "Overhead Adjustable Manipulator Topology",
    equationName: "Sequential Limit-Switch Position Control",
    governingEquation:
      "\\mathbf{p}^{*}_{tool}=\\mathbf{p}^{*}_{carriage}+\\mathbf{R}_z(\\theta^{*})(\\mathbf{d}^{*}_{column}+\\mathbf{R}_y(\\phi^{*})\\mathbf{l}^{*}_{arm});\\quad\\text{tripped}^{*}=\\mathbb{I}(|q^{*}-q^{*}_{stop}|<\\epsilon^{*})\\;\\text{(all starred quantities are normalized display values)}",
    engineMethod: "stepLemelsonManipulatorTopology (source-bounded TypeScript topology)",
    controls: [
      {
        id: "carriagePosition",
        label: "Carriage position x",
        min: -1,
        max: 1,
        step: 0.05,
        defaultValue: 0.15,
        unit: "normalized travel",
      },
      {
        id: "columnElevation",
        label: "Column elevation z",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0.65,
        unit: "normalized stroke",
      },
      {
        id: "columnAzimuth",
        label: "Column azimuth θ",
        min: -1,
        max: 1,
        step: 0.05,
        defaultValue: 0.25,
        unit: "normalized angle",
      },
      {
        id: "wristPivot",
        label: "Wrist pivot φ",
        min: -1,
        max: 1,
        step: 0.05,
        defaultValue: -0.2,
        unit: "normalized angle",
      },
      {
        id: "jawClosure",
        label: "Jaw closure",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0.45,
        unit: "closure fraction",
      },
      {
        id: "cyclePhase",
        label: "Sequential phase",
        min: 0,
        max: 5,
        step: 1,
        defaultValue: 2,
        unit: "relay state",
      },
      {
        id: "stop1Azimuth",
        label: "Stop 1 azimuth limit",
        min: -1,
        max: 1,
        step: 0.05,
        defaultValue: -0.75,
        unit: "limit position",
      },
      {
        id: "stop2Azimuth",
        label: "Stop 2 azimuth limit",
        min: -1,
        max: 1,
        step: 0.05,
        defaultValue: 0.75,
        unit: "limit position",
      },
      {
        id: "stop1Elevation",
        label: "Stop 1 vertical limit",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0.15,
        unit: "normalized limit position",
      },
      {
        id: "stop2Elevation",
        label: "Stop 2 vertical limit",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0.85,
        unit: "normalized limit position",
      },
    ],
    computeMetrics: (params) => {
      const state = stepLemelsonManipulatorTopology(params);
      return [
        {
          label: "Active Relay Phase",
          value: state.sequencer.phaseName.toUpperCase(),
          unit: "state",
          badgeColor: "cyan",
        },
        {
          label: "Active Drive Motor",
          value: state.sequencer.activeMotor.toUpperCase(),
          unit: "actuator",
          badgeColor: state.sequencer.activeMotor === "idle" ? "amber" : "emerald",
        },
        {
          label: "Limit Switches Tripped",
          value: `${state.sequencer.trippedLimitSwitches.length} TRIPPED`,
          unit: "switches",
          badgeColor: state.sequencer.trippedLimitSwitches.length > 0 ? "rose" : "indigo",
        },
        {
          label: "Gripper State",
          value: state.displayPose.gripperState.toUpperCase(),
          unit: "end effector",
          badgeColor: state.displayPose.gripperState === "gripping" ? "emerald" : "indigo",
          progressPct: clampProgress((1 - state.displayPose.jawOpeningFraction) * 100),
        },
        {
          label: "Active Claim Scope",
          value: `Claim ${state.activeClaim}`,
          unit: "legal boundary",
          badgeColor: "purple",
        },
        {
          label: "Kinematic Refusal",
          value: "REFUSED",
          unit: "boundary active",
          badgeColor: "purple",
        },
      ];
    },
    pedagogicalInsight:
      "US 3,260,375 describes a track-guided manipulator, relatively movable columns and arms, article-seizing means, and adjustable limit-switch control. The shared kernel makes only a deterministic normalized display topology and selected switch-event states; it explicitly refuses unprinted dimensions, motor dynamics, forces, speeds, timing, and controller performance.",
  },
  "us-4341502-makino-scara": {
    domain: "source_bounded_robot_kinematics",
    domainTitle: "Four-Link Assembly-Robot Topology",
    equationName: "Planar Closed-Chain Configuration",
    governingEquation:
      "\\sum_{i=1}^{4}\\mathbf{r}_i=\\mathbf{0};\\quad\\mathbf{p}_{tool}=f(\\theta_1,\\theta_2;\\text{four-link topology})",
    engineMethod: "stepMakinoScaraTopology (source-bounded TypeScript geometry)",
    controls: [
      {
        id: "firstLinkAngleDeg",
        label: "First-link angle θ₁",
        min: -180,
        max: 180,
        step: 1,
        defaultValue: 32,
        unit: "°",
      },
      {
        id: "fourthLinkAngleDeg",
        label: "Fourth-link angle θ₂",
        min: -180,
        max: 180,
        step: 1,
        defaultValue: -38,
        unit: "°",
      },
      {
        id: "toolAttitudeDeg",
        label: "Tool attitude φ",
        min: -180,
        max: 180,
        step: 1,
        defaultValue: 0,
        unit: "°",
      },
      {
        id: "topologyVariant",
        label: "Claim topology",
        min: 1,
        max: 3,
        step: 1,
        defaultValue: 1,
        unit: "claim form",
      },
    ],
    computeMetrics: (params) => {
      const pose = stepMakinoScaraTopology(params);
      const topologyLabel =
        pose.topology === "claim-1-concentric"
          ? "CONCENTRIC"
          : pose.topology === "claim-3-offset"
            ? "OFFSET"
            : "Y-LINK";
      return [
        {
          label: "Independent Claim",
          value: `CLAIM ${pose.independentClaim}`,
          unit: topologyLabel,
          badgeColor: "purple",
          progressPct: (pose.independentClaim / 6) * 100,
        },
        {
          label: "First-link Angle",
          value: (pose.firstLinkAngleRad * (180 / Math.PI)).toFixed(0),
          unit: "° θ₁",
          badgeColor: "cyan",
          progressPct: clampProgress(((pose.firstLinkAngleRad * 180) / Math.PI + 180) / 3.6),
        },
        {
          label: "Fourth-link Angle",
          value: (pose.fourthLinkAngleRad * (180 / Math.PI)).toFixed(0),
          unit: "° θ₂",
          badgeColor: "amber",
          progressPct: clampProgress(((pose.fourthLinkAngleRad * 180) / Math.PI + 180) / 3.6),
        },
        {
          label: "Tool Projection",
          value: `(${pose.tool[0].toFixed(2)}, ${pose.tool[1].toFixed(2)})`,
          unit: "normalized",
          badgeColor: "emerald",
        },
      ];
    },
    pedagogicalInsight:
      "The grant supplies a topology and the two driven angles θ₁ and θ₂, plus belt-drive and Y-link claim forms. It does not provide a length, payload, torque, stiffness, or servo law. The shared instrument therefore renders a normalized loop-closure configuration and openly refuses SI force or performance telemetry.",
    enforceConstraints: (params) => ({
      ...params,
      topologyVariant: Math.max(1, Math.min(3, Math.round(params.topologyVariant ?? 1))),
    }),
  },
  "us-4765668-robot-end-effector": {
    domain: "source_bounded_end_effector_kinematics",
    domainTitle: "Opposed-Thread Gripper Kinematics",
    equationName: "Symmetric Ball-Screw Jaw Opening",
    governingEquation: "g=\\ell\\theta/\\pi;\\quad x_L=+g/2;\\quad x_R=-g/2",
    engineMethod: "stepRobotEndEffector (source-bounded TypeScript kinematics)",
    controls: [
      {
        id: "jawOpeningFraction",
        label: "Typical jaw-opening fraction",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 0.52,
        unit: "of 152.4 mm",
      },
      {
        id: "gripForceSetpointN",
        label: "Source-labelled grip setpoint",
        min: 0,
        max: 2000,
        step: 25,
        defaultValue: 900,
        unit: "N (not contact force)",
      },
      {
        id: "frameRotationDeg",
        label: "Claim 17 frame rotation",
        min: -180,
        max: 180,
        step: 1,
        defaultValue: 0,
        unit: "°",
      },
      {
        id: "fingerChangeFraction",
        label: "Claims 13–15 finger change",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 0,
        unit: "retained → fixture",
      },
    ],
    computeMetrics: (params) => {
      const state = stepRobotEndEffector(params);
      return [
        {
          label: "Jaw Opening",
          value: (state.jawOpeningM * 1000).toFixed(1),
          unit: "mm · source typical",
          badgeColor: "cyan",
          progressPct: (state.jawOpeningM / 0.1524) * 100,
        },
        {
          label: "Per-Hand Offset",
          value: (state.perHandOffsetM * 1000).toFixed(1),
          unit: "mm · 5 mm/rev lead",
          badgeColor: "emerald",
          progressPct: (state.perHandOffsetM / 0.0762) * 100,
        },
        {
          label: "Encoder Phase",
          value: state.encoderCountModulo.toFixed(2),
          unit: "of 8 pegs",
          badgeColor: "amber",
          progressPct: (state.encoderCountModulo / 8) * 100,
        },
        {
          label: "Requested Grip",
          value: state.requestedGripForceN.toFixed(0),
          unit: "N · setpoint only",
          badgeColor: "purple",
          progressPct: (state.requestedGripForceN / state.sourceReportedGripForceN) * 100,
        },
        {
          label: "Reported Repeatability",
          value: (state.sourceRepeatabilityM * 1000).toFixed(2),
          unit: "mm · source report",
          badgeColor: "indigo",
          progressPct: clampProgress((1 - state.sourceRepeatabilityM / 0.1524) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "US 4,765,668 prints an opposed 5 mm-lead ball screw, a typical 6-inch jaw opening, a 43 mm/s maximum hand-travel figure, eight encoder pegs, and 0.05 mm reported repeatability. The shared instrument calculates only the symmetric screw and encoder relationships. Its grip field is deliberately a bounded source-labelled setpoint: the grant does not supply workpiece/finger geometry, friction, pneumatic transfer, payload, or connector stroke for contact, pressure, or robot-arm dynamics.",
    enforceConstraints: (params) => ({
      ...params,
      jawOpeningFraction: Math.max(0, Math.min(1, params.jawOpeningFraction ?? 0.52)),
      gripForceSetpointN: Math.max(0, Math.min(2000, params.gripForceSetpointN ?? 900)),
      frameRotationDeg: Math.max(-180, Math.min(180, params.frameRotationDeg ?? 0)),
      fingerChangeFraction: Math.max(0, Math.min(1, params.fingerChangeFraction ?? 0)),
    }),
  },
  "us-6594844-roomba": {
    domain: "autonomous_robotics",
    domainTitle: "Finite-Region Optical Obstacle Detection",
    equationName: "Intersecting Emitter / Detector Fields & Differential Drive",
    governingEquation:
      "\\mathcal{R}=\\Omega_{emit}\\cap\\Omega_{detect}; \\quad v=(v_R+v_L)/2; \\quad \\omega=(v_R-v_L)/b",
    engineMethod: "stepRoomba",
    controls: [
      {
        id: "wheelSpeedMps",
        label: "Drive Speed",
        min: 0.1,
        max: 1.0,
        step: 0.1,
        defaultValue: 0.3,
        unit: "m/s",
      },
      {
        id: "turnRateRadSec",
        label: "Turn Deflection Rate",
        min: 0.5,
        max: 3.0,
        step: 0.5,
        defaultValue: 1.5,
        unit: "rad/s",
      },
      {
        id: "opticalSensorEnabled",
        label: "Claim 1 Optical Redirect Subsystem",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "",
      },
    ],
    computeMetrics: (p) => {
      const v = p.wheelSpeedMps ?? 0.3;
      const state = stepRoomba({
        wheelSpeedMps: v,
        turnRateRadSec: p.turnRateRadSec ?? 1.5,
        roomWidth: ROOMBA_ROOM.width,
        roomHeight: ROOMBA_ROOM.height,
        sensorHeightInches: p.sensorHeightInches,
        opticalSensorEnabled: (p.opticalSensorEnabled ?? 1) >= 0.5,
      });
      return [
        {
          label: "Optical Field Overlap",
          value: (state.surfaceOverlapFraction * 100).toFixed(0),
          unit: "%",
          badgeColor: "emerald",
          progressPct: clampProgress(state.surfaceOverlapFraction * 100),
        },
        {
          label: "Surface in Region",
          value: state.surfacePresent ? "PRESENT" : "ABSENT",
          unit: "optical test",
          badgeColor: state.surfacePresent ? "cyan" : "amber",
          progressPct: state.surfacePresent ? 100 : 0,
        },
        {
          label: "Context Drive Speed",
          value: v.toFixed(2),
          unit: "m/s",
          badgeColor: "purple",
          progressPct: clampProgress((v / 1.0) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "US 6,594,844 claims a low-cost optical geometry: the emitter and detector fields overlap in a finite region, and the redirect circuit responds when the expected floor or wall does not occupy it. The room motion is a contextual differential-drive demonstrator, not a coverage guarantee.",
  },
  "us-6331181-davinci": {
    domain: "medical_robotics",
    domainTitle: "Compatibility, Calibration, and Engagement Data",
    equationName: "Nominal-to-Measured Tool Offset",
    governingEquation: "\\Delta q_{tool} = q_{measured} - q_{nominal}",
    engineMethod: "FrankenSimEngine.stepDaVinci",
    controls: [
      {
        id: "motionScaleRatio",
        label: "Compatibility table entries (illustrative)",
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 3,
        unit: ":1",
      },
      {
        id: "tremorFilterEnabled",
        label: "Compatibility signal present",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "",
      },
      {
        id: "gripAngleDeg",
        label: "End-effector angle (illustrative)",
        min: 0,
        max: 60,
        step: 5,
        defaultValue: 30,
        unit: "°",
      },
      {
        id: "masterInputSpeedMps",
        label: "Drive velocity (illustrative)",
        min: 0.2,
        max: 1.5,
        step: 0.05,
        defaultValue: 0.5,
        unit: "m/s",
      },
    ],
    computeMetrics: (p) => {
      const controls = readDaVinciControls(p);
      const state = FrankenSimEngine.stepDaVinci(controls, 1);
      return [
        {
          label: "Illustrative offset scale",
          value: `${controls.motionScaleRatio}:1`,
          unit: "",
          badgeColor: "cyan",
          progressPct: clampProgress((controls.motionScaleRatio / 10) * 100),
        },
        {
          label: "Compatibility signal",
          value: state.compatibilitySignalPercent > 0 ? "present" : "absent",
          unit: "",
          badgeColor: state.compatibilitySignalPercent > 0 ? "emerald" : "rose",
          progressPct: state.compatibilitySignalPercent,
        },
        {
          label: "End-effector angle",
          value: ((state.gripRad * 180) / Math.PI).toFixed(0),
          unit: "°",
          badgeColor: "amber",
          progressPct: clampProgress((controls.gripAngleDeg / 60) * 100),
        },
        {
          label: "Illustrative tip clearance",
          value: state.obstacleDistanceMm.toFixed(1),
          unit: "mm",
          badgeColor: state.isCupContact ? "rose" : "emerald",
          progressPct: clampProgress((state.obstacleDistanceMm / 150) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "US 6,331,181 centers tool-boundary data: compatibility, tool type, measured calibration offsets, life information, and engagement signals are transmitted to a processor before or during tool exchange.",
  },
  "us-4512709-milacron-robot-toolchanger": {
    domain: "source_bounded_toolchanger_topology",
    domainTitle: "Registration and Slide-Ramp Capture",
    equationName: "Admission and Capture State Relation",
    governingEquation:
      "\\mathrm{captured}=\\mathrm{basePresent}\\land\\mathrm{registered}\\land\\mathrm{slideLocked}\\land\\mathrm{TMember}",
    engineMethod: "stepMilacronRobotToolchanger (source-bounded TypeScript topology)",
    controls: [
      {
        id: "toolBasePresent",
        label: "Tool base at adapter",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "absent / present",
      },
      {
        id: "registrationFraction",
        label: "Pin / bushing registration",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 1,
        unit: "normalized state",
      },
      {
        id: "lockingSlideFraction",
        label: "Locking-slide position",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 1,
        unit: "aligned → capture",
      },
      {
        id: "claimFourTMember",
        label: "Claim 4 T-member form",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "generic → Claim 4",
      },
    ],
    computeMetrics: (rawParams) => {
      const state = stepMilacronRobotToolchanger(rawParams);
      return [
        {
          label: "Engagement State",
          value: state.phase.replaceAll("-", " "),
          unit: "source topology",
          badgeColor: "cyan",
          progressPct: state.toolRetained ? 100 : state.registrationComplete ? 60 : 20,
        },
        {
          label: "Pin Registration",
          value: state.registrationComplete ? "seated" : "pending",
          unit: "cylindrical + diamond",
          badgeColor: "amber",
          progressPct: state.registrationFraction * 100,
        },
        {
          label: "Slide Aperture",
          value: state.apertureAligned ? "aligned" : "offset",
          unit: state.apertureAligned ? "admission / release" : "retention path",
          badgeColor: state.apertureAligned ? "amber" : "emerald",
          progressPct: state.lockingSlideFraction * 100,
        },
        {
          label: "Quantitative Mechanics",
          value: "refused",
          unit: "no force / stroke / time data",
          badgeColor: "rose",
        },
      ];
    },
    pedagogicalInsight:
      "US 4,512,709 documents registration on a cylindrical/diamond pin pair, admission through an aligned slide aperture, and capture when the shifted slide ramps bear on a T-member crossbar. The grant supplies no pressure, bore, stroke, ramp angle, friction, load, or time datum, so the shared instrument reports only that source-supported state sequence and refuses performance telemetry.",
  },
  "us-4575330-hull-stereolithography": {
    domain: "additive_manufacturing",
    domainTitle: "Ultraviolet Photopolymerization Kinetics & Laser Galvanometer Slicing",
    equationName: "Beer-Lambert Curing Depth & Gaussian Exposure Law",
    governingEquation:
      "C_d = D_p \\ln\\left( \\frac{E_{\\text{max}}}{E_c} \\right) \\quad \\text{with} \\quad E_{\\text{max}} = \\sqrt{\\frac{2}{\\pi}} \\frac{P_L}{w_0 v_s}",
    engineMethod: "FrankenSimEngine.stepHullStereolithography",
    controls: [
      {
        id: "laserPowerMw",
        label: "Laser Radiant Power",
        min: 10,
        max: 120,
        step: 5,
        defaultValue: HULL_SLA_DEFAULT_CONTROLS.laserPowerMw,
        unit: "mW",
      },
      {
        id: "laserScanSpeedMmS",
        label: "Galvo Vector Scan Speed",
        min: 50,
        max: 1000,
        step: 25,
        defaultValue: HULL_SLA_DEFAULT_CONTROLS.laserScanSpeedMmS,
        unit: "mm/s",
      },
      {
        id: "layerThicknessUm",
        label: "Elevator Layer Step Δz",
        min: 25,
        max: 200,
        step: 5,
        defaultValue: HULL_SLA_DEFAULT_CONTROLS.layerThicknessUm,
        unit: "µm",
      },
      {
        id: "beamWaistRadiusUm",
        label: "Gaussian Spot Radius w₀",
        min: 50,
        max: 200,
        step: 5,
        defaultValue: HULL_SLA_DEFAULT_CONTROLS.beamWaistRadiusUm,
        unit: "µm",
      },
      {
        id: "resinViscosityCp",
        label: "Resin Dynamic Viscosity",
        min: 100,
        max: 2500,
        step: 50,
        defaultValue: HULL_SLA_DEFAULT_CONTROLS.resinViscosityCp,
        unit: "cP",
      },
    ],
    computeMetrics: (p) => {
      const controls = readHullStereolithographyControls(p);
      const state = stepHullStereolithographySi(controls);
      return [
        {
          label: "Peak Centerline Exposure E_max",
          value: state.peakExposureMJCm2.toFixed(2),
          unit: "mJ/cm²",
          badgeColor: state.isCured ? "emerald" : "rose",
          progressPct: clampProgress((state.peakExposureMJCm2 / 30) * 100),
        },
        {
          label: "Curing Depth C_d",
          value: state.cureDepthUm.toFixed(1),
          unit: "µm",
          badgeColor:
            state.interlayerAdhesionRatio >= 1.0 && state.interlayerAdhesionRatio <= 2.2
              ? "emerald"
              : state.interlayerAdhesionRatio < 1.0
                ? "rose"
                : "amber",
          progressPct: clampProgress((state.cureDepthUm / 300) * 100),
        },
        {
          label: "Cured Line Width L_w",
          value: state.curedLineWidthUm.toFixed(1),
          unit: "µm",
          badgeColor: "cyan",
          progressPct: clampProgress((state.curedLineWidthUm / 400) * 100),
        },
        {
          label: "Interlayer Adhesion Ratio",
          value: state.interlayerAdhesionRatio.toFixed(2),
          unit: "x",
          badgeColor:
            state.interlayerAdhesionRatio >= 1.15 && state.interlayerAdhesionRatio <= 1.8
              ? "emerald"
              : "amber",
          progressPct: clampProgress((state.interlayerAdhesionRatio / 2.5) * 100),
        },
        {
          label: "Gel Conversion Degree α",
          value: state.polymerizationConversionPct.toFixed(1),
          unit: "%",
          badgeColor: state.polymerizationConversionPct >= 70 ? "emerald" : "amber",
          progressPct: clampProgress(state.polymerizationConversionPct),
        },
        {
          label: "Layer Recoat Settling Time",
          value: state.recoatMeniscusSettlingTimeSec.toFixed(2),
          unit: "s",
          badgeColor: state.recoatMeniscusSettlingTimeSec <= 4 ? "emerald" : "amber",
          progressPct: clampProgress((state.recoatMeniscusSettlingTimeSec / 10) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "US 4,575,330 established that 3D additive manufacturing relies on controlling radiant exposure E(x,y) to exceed critical threshold E_c while tuning cure depth C_d to exceed layer step Δz for monolithic interlayer polymer cross-linking.",
  },
  "us-4921293-salisbury-robot-hand": {
    domain: "robotics_manipulation",
    domainTitle: "Source-Bounded Cable Transmission & Articulated-Joint Topology",
    equationName: "Figure 3 Four-Tension / Three-Torque Map",
    governingEquation:
      "\\tau_1=-T_1R_1+T_2R_2+T_3R_2-T_4R_1,\\quad \\tau_2=T_1R_3+T_2R_2-T_3R_2-T_4R_3,\\quad \\tau_3=T_2R_2-T_3R_2",
    engineMethod: "FrankenSimEngine.stepSalisburyRobotHand",
    controls: [
      {
        id: "tensionT1N",
        label: "Representative digit tension T₁",
        min: 0,
        max: 40,
        step: 1,
        defaultValue: SALISBURY_HAND_DEFAULT_CONTROLS.tensionT1N,
        unit: "N",
      },
      {
        id: "tensionT2N",
        label: "Representative digit tension T₂",
        min: 0,
        max: 40,
        step: 1,
        defaultValue: SALISBURY_HAND_DEFAULT_CONTROLS.tensionT2N,
        unit: "N",
      },
      {
        id: "tensionT3N",
        label: "Representative digit tension T₃",
        min: 0,
        max: 40,
        step: 1,
        defaultValue: SALISBURY_HAND_DEFAULT_CONTROLS.tensionT3N,
        unit: "N",
      },
      {
        id: "tensionT4N",
        label: "Representative digit tension T₄",
        min: 0,
        max: 40,
        step: 1,
        defaultValue: SALISBURY_HAND_DEFAULT_CONTROLS.tensionT4N,
        unit: "N",
      },
      {
        id: "radiusScaleMm",
        label: "Illustrative R₂ scale",
        min: 4,
        max: 20,
        step: 1,
        defaultValue: SALISBURY_HAND_DEFAULT_CONTROLS.radiusScaleMm,
        unit: "mm",
      },
      {
        id: "firstIdlerFixed",
        label: "Claim 2 first idler held",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: SALISBURY_HAND_DEFAULT_CONTROLS.firstIdlerFixed ? 1 : 0,
        unit: "0/1",
      },
    ],
    computeMetrics: (p) => {
      const controls = readSalisburyRobotHandControls(p);
      const tel = FrankenSimEngine.stepSalisburyRobotHand(controls);
      return [
        {
          label: "Axis 1 source torque",
          value: tel.jointTorquesNm[0].toFixed(3),
          unit: "N·m",
          badgeColor: "indigo",
        },
        {
          label: "Axis 2 source torque",
          value: tel.jointTorquesNm[1].toFixed(3),
          unit: "N·m",
          badgeColor: "emerald",
        },
        {
          label: "Axis 3 source torque",
          value: tel.jointTorquesNm[2].toFixed(3),
          unit: "N·m",
          badgeColor: "amber",
        },
        {
          label: "Connected source topology",
          value: `${tel.digitCount} palm-rooted digits / ${tel.scalarJointCoordinates} joints / ${tel.cableEndCount} cable ends`,
          unit: "",
          badgeColor: tel.claim1RoutingProbe ? "emerald" : "rose",
          progressPct: tel.claim1RoutingProbe ? 100 : 0,
        },
        {
          label: "Historic dynamics",
          value: "not disclosed",
          unit: "",
          badgeColor: "amber",
        },
      ];
    },
    pedagogicalInsight:
      "Ruoff and Salisbury print three static equations for one digit's Figure 3 route: four measured cable tensions and selected pulley radii combine into three joint torques. The physical hand has three articulated digits, nine joint coordinates, and twelve separately routed cable ends; the exhibit mirrors the representative digit pose across all three. The grant supplies no historic dimensions, dynamics, contact law, grasp force, force-closure result, or stability margin.",
  },
  "us-5121329-crump-fdm": {
    domain: "thermodynamics",
    domainTitle: "Fused Deposition Modeling (FDM) Melt Flow & Thermal Solidification",
    equationName: "Poiseuille Capillary Flow, Feed Kinematics, & Thermal Cooling",
    governingEquation:
      "Q = w h v_{\\text{head}}, \\quad \\Delta P = \\frac{8 \\mu L Q}{\\pi R^4}, \\quad \\tau = \\frac{h^2}{\\pi^2 \\alpha}",
    engineMethod: "FrankenSimEngine.stepCrumpFdm",
    controls: [
      {
        id: "nozzleTempC",
        label: "Liquefier Nozzle Temperature",
        min: 160,
        max: 290,
        step: 5,
        defaultValue: CRUMP_FDM_DEFAULT_CONTROLS.nozzleTempC,
        unit: "°C",
      },
      {
        id: "printSpeedMmS",
        label: "Toolhead Print Speed",
        min: 10,
        max: 150,
        step: 5,
        defaultValue: CRUMP_FDM_DEFAULT_CONTROLS.printSpeedMmS,
        unit: "mm/s",
      },
      {
        id: "layerHeightMm",
        label: "Layer Height (h)",
        min: 0.05,
        max: 0.5,
        step: 0.05,
        defaultValue: CRUMP_FDM_DEFAULT_CONTROLS.layerHeightMm,
        unit: "mm",
      },
      {
        id: "roadWidthMm",
        label: "Extruded Road Width (w)",
        min: 0.2,
        max: 1.0,
        step: 0.05,
        defaultValue: CRUMP_FDM_DEFAULT_CONTROLS.roadWidthMm,
        unit: "mm",
      },
    ],
    computeMetrics: (params) => {
      const controls = readCrumpFdmControls(params);
      const tel = stepCrumpFdmSi(controls);
      return [
        {
          label: "Volumetric Flow Rate (Q)",
          value: tel.volumetricFlowRateMm3S.toFixed(2),
          unit: "mm³/s",
          badgeColor: "cyan",
        },
        {
          label: "Filament Feed Speed (v_feed)",
          value: tel.filamentFeedSpeedMmS.toFixed(2),
          unit: "mm/s",
          badgeColor: "emerald",
        },
        {
          label: "Nozzle Pressure Drop (ΔP)",
          value: tel.nozzlePressureDropMPa.toFixed(3),
          unit: "MPa",
          badgeColor: "amber",
        },
        {
          label: "Axial Feed Drive Force",
          value: tel.feedDriveForceN.toFixed(1),
          unit: "N",
          badgeColor: tel.filamentGrindingRefusal ? "rose" : "emerald",
        },
        {
          label: "Cooling Time Constant (τ)",
          value: (tel.coolingTimeConstantSec * 1000).toFixed(0),
          unit: "ms",
          badgeColor: "cyan",
        },
        {
          label: "Interlayer Weld Quality (T_int/Tg)",
          value: tel.weldQualityRatio.toFixed(2),
          unit: "x",
          badgeColor: tel.poorAdhesionRefusal ? "rose" : "emerald",
        },
      ];
    },
    pedagogicalInsight:
      "US 5,121,329 established that FDM extrusion relies on using solid filament as a piston pump into a heated liquefier, where the flat nozzle tip irons extruded beads into a planar road (w/h ≈ 2.25) while conducting heat into the substrate to freeze dimensions in ~50 ms.",
  },
  "us-5701965-kamen-transporter": {
    domain: "robotics_locomotion",
    domainTitle: "Inverted Pendulum Dynamic Balancing & Cluster Stair-Climbing Kinematics",
    equationName: "Inverted Pendulum Dynamic Equilibrium & Motor Torque",
    governingEquation:
      "I \\ddot{\\theta} = m g h \\sin\\theta - \\tau_{\\text{motor}} - F_{\\text{traction}} h \\cos\\theta \\quad \\text{and} \\quad \\tau_{\\text{motor}} = K_p \\theta + K_d \\dot{\\theta} + K_v (v_{\\text{cmd}} - v)",
    engineMethod: "FrankenSimEngine.stepKamenTransporter",
    controls: [
      {
        id: "riderPitchLeanDeg",
        label: "Rider Pitch Lean",
        min: -15,
        max: 15,
        step: 1,
        defaultValue: KAMEN_TRANSPORTER_DEFAULT_CONTROLS.riderPitchLeanDeg,
        unit: "°",
      },
      {
        id: "velocityCommandMs",
        label: "Velocity Command",
        min: -2.0,
        max: 4.0,
        step: 0.2,
        defaultValue: KAMEN_TRANSPORTER_DEFAULT_CONTROLS.velocityCommandMs,
        unit: "m/s",
      },
      {
        id: "yawSteering",
        label: "Yaw Steering Differential",
        min: -1.0,
        max: 1.0,
        step: 0.1,
        defaultValue: KAMEN_TRANSPORTER_DEFAULT_CONTROLS.yawSteering,
        unit: "",
      },
      {
        id: "riderMassKg",
        label: "Rider Payload Mass",
        min: 40,
        max: 120,
        step: 5,
        defaultValue: KAMEN_TRANSPORTER_DEFAULT_CONTROLS.riderMassKg,
        unit: "kg",
      },
    ],
    computeMetrics: (p) => {
      const controls = readKamenTransporterControls(p);
      const tel = stepKamenTransporterSi(controls);
      return [
        {
          label: "Pitch Angle",
          value: tel.pitchAngleDeg.toFixed(1),
          unit: "°",
          badgeColor: tel.pitchRefusal
            ? "rose"
            : Math.abs(tel.pitchAngleDeg) > 10
              ? "amber"
              : "emerald",
          progressPct: clampProgress((Math.abs(tel.pitchAngleDeg) / 25) * 100),
        },
        {
          label: "Balancing Torque",
          value: tel.balanceTorqueNm.toFixed(1),
          unit: "N·m",
          badgeColor: Math.abs(tel.balanceTorqueNm) > 80 ? "amber" : "cyan",
          progressPct: clampProgress((Math.abs(tel.balanceTorqueNm) / 120) * 100),
        },
        {
          label: "Linear Speed",
          value: tel.forwardVelocityMs.toFixed(2),
          unit: "m/s",
          badgeColor: "indigo",
          progressPct: clampProgress((Math.abs(tel.forwardVelocityMs) / 5.0) * 100),
        },
        {
          label: "Stability Margin",
          value: (tel.stabilityMargin * 100).toFixed(0),
          unit: "%",
          badgeColor:
            tel.stabilityMargin > 0.6 ? "emerald" : tel.stabilityMargin > 0.2 ? "amber" : "rose",
          progressPct: clampProgress(tel.stabilityMargin * 100),
        },
        {
          label: "Operating State",
          value: tel.pitchRefusal
            ? "UNSTABLE RUNAWAY"
            : tel.isClimbing
              ? "STAIR CLIMB"
              : tel.isBalancing
                ? "2-WHEEL BALANCE"
                : "4-WHEEL STANDARD",
          unit: "state",
          badgeColor: tel.pitchRefusal ? "rose" : tel.isBalancing ? "emerald" : "amber",
        },
      ];
    },
    pedagogicalInsight:
      "Dean Kamen's dynamic stabilization continuously drives the wheels underneath the vehicle center of gravity in response to detected pitch tilt $\\theta$ and pitch angular rate $\\dot{\\theta}$. When the rider leans forward, the inverted pendulum equation commands restorative motor torque $\\tau = K_p \\theta + K_d \\dot{\\theta}$ that balances the vehicle while creating smooth forward acceleration.",
  },
  "us-6302230-kamen-segway": {
    domain: "robotics_locomotion",
    domainTitle: "Inverted Pendulum Dynamic Balancing & Balancing Margin Supervision",
    equationName: "Euler-Lagrange Dynamic Balance, State Feedback, & Acceleration Margin",
    governingEquation:
      "\\tau_{\\text{motor}} = M g L \\sin\\theta + M L \\ddot{x} \\cos\\theta, \\quad \\text{Margin} = 1 - \\frac{|v|}{v_{\\text{max}}} - \\frac{|\\tau|}{\\tau_{\\text{max}}}",
    engineMethod: "FrankenSimEngine.stepKamenSegway",
    controls: [
      {
        id: "riderPitchDeg",
        label: "Rider Pitch Lean",
        min: -15,
        max: 15,
        step: 0.5,
        defaultValue: KAMEN_SEGWAY_DEFAULT_CONTROLS.riderPitchDeg,
        unit: "°",
      },
      {
        id: "steeringInput",
        label: "Handlebar Steering Yaw",
        min: -1.0,
        max: 1.0,
        step: 0.1,
        defaultValue: KAMEN_SEGWAY_DEFAULT_CONTROLS.steeringInput,
        unit: "yaw",
      },
      {
        id: "riderMassKg",
        label: "Rider Body Mass",
        min: 40,
        max: 120,
        step: 5,
        defaultValue: KAMEN_SEGWAY_DEFAULT_CONTROLS.riderMassKg,
        unit: "kg",
      },
      {
        id: "groundFrictionCoeff",
        label: "Ground Traction (μ)",
        min: 0.15,
        max: 0.95,
        step: 0.05,
        defaultValue: KAMEN_SEGWAY_DEFAULT_CONTROLS.groundFrictionCoeff,
        unit: "μ",
      },
      {
        id: "speedLimitMS",
        label: "Speed Governor Limit",
        min: 2.0,
        max: 6.0,
        step: 0.5,
        defaultValue: KAMEN_SEGWAY_DEFAULT_CONTROLS.speedLimitMS,
        unit: "m/s",
      },
    ],
    computeMetrics: (controls) => {
      const parsed = readKamenSegwayControls(controls);
      const tel = stepKamenSegwaySi(parsed);

      if (tel.refusalReason) {
        return [
          {
            label: "Physical Refusal",
            value: tel.refusalReason,
            unit: "",
            badgeColor: "rose",
            progressPct: 0,
          },
          {
            label: "Pitch Angle",
            value: parsed.riderPitchDeg.toFixed(1),
            unit: "°",
            badgeColor: "rose",
          },
          {
            label: "Demanded Thrust",
            value: Math.abs(tel.driveThrustForceN).toFixed(0),
            unit: "N",
            badgeColor: "rose",
          },
          {
            label: "Max Grip Limit",
            value: tel.maxTractionForceN.toFixed(0),
            unit: "N",
            badgeColor: "amber",
          },
        ];
      }

      return [
        {
          label: "Forward Velocity",
          value: tel.velocityKmh.toFixed(1),
          unit: "km/h",
          badgeColor: tel.speedPushbackActive ? "amber" : "cyan",
          progressPct: clampProgress((Math.abs(tel.velocityMS) / parsed.speedLimitMS) * 100),
        },
        {
          label: "Restoring Motor Torque",
          value: tel.motorTorqueNm.toFixed(1),
          unit: "N·m",
          badgeColor: Math.abs(tel.motorTorqueNm) > 100 ? "amber" : "indigo",
          progressPct: clampProgress((Math.abs(tel.motorTorqueNm) / 160.0) * 100),
        },
        {
          label: "Balancing Margin",
          value: (tel.balancingMarginRatio * 100).toFixed(0),
          unit: "%",
          badgeColor:
            tel.balancingMarginRatio > 0.45
              ? "emerald"
              : tel.balancingMarginRatio > 0.22
                ? "amber"
                : "rose",
          progressPct: clampProgress(tel.balancingMarginRatio * 100),
        },
        {
          label: "Tactile Ripple Alarm",
          value: tel.tactileAlarmActive ? "ACTIVE (18 Hz)" : "STANDBY",
          unit: "haptic",
          badgeColor: tel.tactileAlarmActive ? "rose" : "indigo",
        },
        {
          label: "Pitch Pushback",
          value: tel.speedPushbackActive ? `+${tel.pitchPushbackDeg.toFixed(1)}° LIMIT` : "OFF",
          unit: "speed limiter",
          badgeColor: tel.speedPushbackActive ? "amber" : "emerald",
        },
      ];
    },
    pedagogicalInsight:
      "Dean Kamen's Segway (US 6,302,230) stabilizes an inverted pendulum by continuously accelerating two coaxial drive wheels forward beneath the rider's center of gravity. Crucially, the balancing margin monitor tracks available acceleration headroom, triggering speed tiltback and 18 Hz tactile motor ripple vibration through the platform before torque saturation occurs.",
  },
  "us-4098001-watson-remote-center-compliance": {
    domain: "robotics_mechanisms",
    domainTitle: "Remote-Center Flexure Topology",
    equationName: "Source-Bounded Remote-Center Geometry",
    governingEquation:
      "\\mathbf{r}_{24},\\mathbf{r}_{26},\\mathbf{r}_{28} \\rightarrow O_{remote}; \\quad \\Delta\\mathbf{x}_{tip} \\approx \\boldsymbol{\\theta} \\times \\mathbf{r}_{tip}",
    engineMethod:
      "stepWatsonRemoteCenterComplianceTopology (normalized host topology; quantitative SI model refused)",
    controls: [
      {
        id: "lateralContactFraction",
        label: "Chamfer Contact Position",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: WATSON_REMOTE_CENTER_COMPLIANCE_DEFAULT_CONTROLS.lateralContactFraction,
        unit: "normalized",
        provenance: "scenario-reader",
      },
      {
        id: "axisMismatchFraction",
        label: "Initial Axis Mismatch",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: WATSON_REMOTE_CENTER_COMPLIANCE_DEFAULT_CONTROLS.axisMismatchFraction,
        unit: "normalized",
        provenance: "scenario-reader",
      },
      {
        id: "remoteCenterTopology",
        label: "Claim 1 Remote-Center Topology",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: WATSON_REMOTE_CENTER_COMPLIANCE_DEFAULT_CONTROLS.remoteCenterTopology,
        unit: "off/on",
        provenance: "source-disclosed",
      },
      {
        id: "antiTwistConstraint",
        label: "Claim 2 Torque-Resistant Means",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: WATSON_REMOTE_CENTER_COMPLIANCE_DEFAULT_CONTROLS.antiTwistConstraint,
        unit: "off/on",
        provenance: "source-disclosed",
      },
    ],
    computeMetrics: (p) => {
      const controls = readWatsonRemoteCenterComplianceControls(p);
      const pose = stepWatsonRemoteCenterComplianceTopology(controls);
      return [
        {
          label: "Illustrated Translation",
          value: (pose.translationOffset * 100).toFixed(0),
          unit: "% display",
          badgeColor: "cyan",
          progressPct: clampProgress(pose.translationOffset * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Remaining Axis Mismatch",
          value: (pose.remainingAxisMismatch * 100).toFixed(0),
          unit: "% normalized",
          badgeColor: "amber",
          progressPct: clampProgress(pose.remainingAxisMismatch * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Remote Center",
          value: pose.remoteCenterTopology ? "AT TOOL END" : "LOCAL CONTRAST",
          unit: "source geometry",
          badgeColor: pose.remoteCenterTopology ? "emerald" : "amber",
          provenance: "source-disclosed",
        },
        {
          label: "Quantitative SI Prediction",
          value: "REFUSED",
          unit: "missing source inputs",
          badgeColor: "rose",
          provenance: "refusal-bounded",
        },
      ];
    },
    pedagogicalInsight:
      "Watson claims a connected passive stack: at least three radial rotational elements project a virtual center to the tool end, while separate generally axial elements permit translation; Claim 2 adds torque-resistant means. The grant supplies no dimensions, material, stiffness, force, clearance, friction, mass, or timing, so this exhibit reports normalized geometry and explicitly refuses an SI performance prediction.",
  },
  "us-4098001-watson-rcc": {
    domain: "robotics_mechanisms",
    domainTitle: "Remote-Center Flexure Topology",
    equationName: "Source-Bounded Remote-Center Geometry",
    governingEquation:
      "\\mathbf{r}_{24},\\mathbf{r}_{26},\\mathbf{r}_{28} \\rightarrow O_{remote}; \\quad \\Delta\\mathbf{x}_{tip} \\approx \\boldsymbol{\\theta} \\times \\mathbf{r}_{tip}",
    engineMethod:
      "stepWatsonRemoteCenterComplianceTopology (normalized host topology; quantitative SI model refused)",
    controls: [
      {
        id: "lateralContactFraction",
        label: "Chamfer Contact Position",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: WATSON_REMOTE_CENTER_COMPLIANCE_DEFAULT_CONTROLS.lateralContactFraction,
        unit: "normalized",
        provenance: "scenario-reader",
      },
      {
        id: "axisMismatchFraction",
        label: "Initial Axis Mismatch",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: WATSON_REMOTE_CENTER_COMPLIANCE_DEFAULT_CONTROLS.axisMismatchFraction,
        unit: "normalized",
        provenance: "scenario-reader",
      },
      {
        id: "remoteCenterTopology",
        label: "Claim 1 Remote-Center Topology",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: WATSON_REMOTE_CENTER_COMPLIANCE_DEFAULT_CONTROLS.remoteCenterTopology,
        unit: "off/on",
        provenance: "source-disclosed",
      },
      {
        id: "antiTwistConstraint",
        label: "Claim 2 Anti-Twist Constraint",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: WATSON_REMOTE_CENTER_COMPLIANCE_DEFAULT_CONTROLS.antiTwistConstraint,
        unit: "off/on",
        provenance: "source-disclosed",
      },
    ],
    computeMetrics: (p) => {
      const controls = readWatsonRemoteCenterComplianceControls(p);
      const pose = stepWatsonRemoteCenterComplianceTopology(controls);
      return [
        {
          label: "Illustrated Translation",
          value: (pose.translationOffset * 100).toFixed(0),
          unit: "% display",
          badgeColor: "cyan",
          progressPct: clampProgress(pose.translationOffset * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Remaining Axis Mismatch",
          value: (pose.remainingAxisMismatch * 100).toFixed(0),
          unit: "% normalized",
          badgeColor: "amber",
          progressPct: clampProgress(pose.remainingAxisMismatch * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Remote Center",
          value: pose.remoteCenterTopology ? "AT TOOL END" : "LOCAL CONTRAST",
          unit: "source geometry",
          badgeColor: pose.remoteCenterTopology ? "emerald" : "amber",
          provenance: "source-disclosed",
        },
        {
          label: "Quantitative SI Prediction",
          value: "REFUSED",
          unit: "missing source inputs",
          badgeColor: "rose",
          provenance: "refusal-bounded",
        },
      ];
    },
    pedagogicalInsight:
      "Watson claims a connected passive stack: at least three radial rotational elements project a virtual center to the tool end, while separate generally axial elements permit translation; Claim 2 adds torque-resistant means. The grant supplies no dimensions, material, stiffness, force, clearance, friction, mass, or timing, so this exhibit reports normalized geometry and explicitly refuses an SI performance prediction.",
  },
  "us-6120588-eink": {
    domain: "colloidal_physics",
    domainTitle: "Electrophoretic Particle Mobility & Optical Contrast",
    equationName: "Stokes-Einstein Electrophoretic Drift",
    governingEquation: "v = \\mu_e \\cdot E = \\frac{q}{6 \\pi \\eta r_p} \\cdot \\frac{V}{d}",
    engineMethod: "stepEInk",
    controls: [
      {
        id: "electrodeVoltageVolts",
        label: "Electrode Potential",
        min: -15,
        max: 15,
        step: 1,
        defaultValue: 15,
        unit: "V",
      },
      {
        id: "fluidViscosityCp",
        label: "Dielectric Fluid Viscosity",
        min: 0.5,
        max: 5.0,
        step: 0.5,
        defaultValue: 2.0,
        unit: "cP",
      },
    ],
    computeMetrics: (p) => {
      const v = p.electrodeVoltageVolts ?? 15;
      const out = stepEInk(
        {
          electrodeVoltageVolts: v,
          fluidViscosityCp: p.fluidViscosityCp ?? 2.0,
          particleChargeCoupled: 1.0,
        },
        1.0,
      );
      return [
        {
          label: "Surface Reflectance",
          value: `${out.surfaceReflectancePercent}%`,
          unit: "R_top",
          badgeColor: out.surfaceReflectancePercent > 40 ? "cyan" : "indigo",
          progressPct: clampProgress(out.surfaceReflectancePercent),
        },
        {
          label: "Electric Field Intensity",
          value: `${out.electricFieldVperUm.toFixed(2)} V/μm`,
          unit: "E",
          badgeColor: "amber",
          progressPct: clampProgress((Math.abs(out.electricFieldVperUm) / 0.3) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "E-Ink achieves bistable electronic paper by electrophoretically driving charged titanium dioxide white particles and carbon black pigment particles through a dielectric fluid inside microcapsules.",
  },
  "us-7479949-multitouch": {
    domain: "hci_sensing",
    domainTitle: "Mutual Capacitance Matrices & Gesture Affine Transformations",
    equationName: "Multi-Touch Affine Scaling & Mutual Capacitance Shunt",
    governingEquation:
      "S(t) = \\frac{\\|\\mathbf{p}_2(t) - \\mathbf{p}_1(t)\\|}{\\|\\mathbf{p}_2(0) - \\mathbf{p}_1(0)\\|}, \\quad \\Delta C_m = -\\frac{\\varepsilon_0 \\varepsilon_r A_{finger}}{d}",
    engineMethod: "stepMultiTouch",
    controls: [
      {
        id: "fingerSeparationMm",
        label: "Finger Separation Distance",
        min: 15,
        max: 120,
        step: 5,
        defaultValue: 50,
        unit: "mm",
      },
      {
        id: "fingerCount",
        label: "Active Touch Contacts",
        min: 0,
        max: 2,
        step: 1,
        defaultValue: 2,
        unit: "pts",
      },
    ],
    computeMetrics: (p) => {
      const sep = p.fingerSeparationMm ?? 50;
      const count = p.fingerCount ?? 2;
      const out = stepMultiTouch(
        {
          fingerCount: count,
          fingerSeparationMm: sep,
          touchPressureGrams: 80,
          gestureVelocityMmS: 15,
        },
        0.0,
      );
      return [
        {
          label: "Affine Scale Factor",
          value: `${out.zoomScale.toFixed(2)}x`,
          unit: "S",
          badgeColor: "cyan",
          progressPct: clampProgress((out.zoomScale / 2.5) * 100),
        },
        {
          label: "Capacitance Shunt",
          value: `-${out.mutualCapacitanceDeltaPf.toFixed(2)} pF`,
          unit: "ΔC_m",
          badgeColor: "emerald",
          progressPct: clampProgress((out.mutualCapacitanceDeltaPf / 1.5) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "The iPhone multi-touch architecture converts multi-point mutual capacitance drops into real-time affine transformations, enabling fluid pinch-to-zoom magnification and geometric gesture recognition.",
  },
  "us-2717437-mestral-velcro": {
    domain: "materials_mechanics",
    domainTitle: "Thermoplastic Polyamide Cantilever Mechanics & Peeling Anisotropy",
    equationName: "Euler-Bernoulli Monofilament Bending & Kendall Peeling Anisotropy",
    governingEquation:
      "\\delta = \\frac{F L^3}{3 E I}, \\qquad F_{\\text{peel}} = \\frac{w G_c}{1 - \\cos\\theta}, \\qquad \\frac{F_{\\text{shear}}}{F_{\\text{peel}}} \\gg 10",
    engineMethod: "FrankenSimEngine.stepMestralVelcro",
    controls: [
      {
        id: "filamentDiameterMm",
        label: "Monofilament Diameter",
        min: 0.1,
        max: 0.35,
        step: 0.01,
        defaultValue: MESTRAL_VELCRO_DEFAULTS.filamentDiameterMm,
        unit: "mm",
        provenance: "scenario-reader",
      },
      {
        id: "hookLengthMm",
        label: "Hook Length",
        min: 1.0,
        max: 3.0,
        step: 0.1,
        defaultValue: MESTRAL_VELCRO_DEFAULTS.hookLengthMm,
        unit: "mm",
        provenance: "scenario-reader",
      },
      {
        id: "hookDensityPerCm2",
        label: "Hook Density",
        min: 20,
        max: 120,
        step: 4,
        defaultValue: MESTRAL_VELCRO_DEFAULTS.hookDensityPerCm2,
        unit: "cm⁻²",
        provenance: "scenario-reader",
      },
      {
        id: "peelAngleDeg",
        label: "Peeling Angle",
        min: 15,
        max: 165,
        step: 5,
        defaultValue: MESTRAL_VELCRO_DEFAULTS.peelAngleDeg,
        unit: "deg",
        provenance: "scenario-reader",
      },
      {
        id: "heatSettingTempC",
        label: "Lancet Bar Temp",
        min: 100,
        max: 200,
        step: 5,
        defaultValue: MESTRAL_VELCRO_DEFAULTS.heatSettingTempC,
        unit: "°C",
        provenance: "scenario-reader",
      },
      {
        id: "appliedShearForceN",
        label: "Shear Load",
        min: 0,
        max: 100,
        step: 5,
        defaultValue: MESTRAL_VELCRO_DEFAULTS.appliedShearForceN,
        unit: "N",
        provenance: "scenario-reader",
      },
      {
        id: "appliedPeelRateMmS",
        label: "Peel Rate",
        min: 2,
        max: 40,
        step: 2,
        defaultValue: MESTRAL_VELCRO_DEFAULTS.appliedPeelRateMmS,
        unit: "mm/s",
        provenance: "scenario-reader",
      },
      {
        id: "engagementRatio",
        label: "Engagement Ratio",
        min: 0.2,
        max: 1.0,
        step: 0.05,
        defaultValue: MESTRAL_VELCRO_DEFAULTS.engagementRatio,
        unit: "ratio",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics: (params: Record<string, number>) => {
      const controls = readMestralVelcroControls(params);
      const tel = stepMestralVelcroSi(controls);
      return [
        {
          label: "Single Hook Force",
          value: `${(tel.singleHookReleaseForceN * 1000).toFixed(1)} mN`,
          unit: "F_hook",
          badgeColor: "cyan",
          progressPct: clampProgress((tel.singleHookReleaseForceN / 0.1) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "In-Plane Shear Capacity",
          value: `${tel.shearStressCapacityN_Cm2.toFixed(1)} N/cm²`,
          unit: "τ_max",
          badgeColor: "emerald",
          progressPct: clampProgress((tel.shearStressCapacityN_Cm2 / 80) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Peel Force (1-in Tape)",
          value: `${tel.totalPeelForceN.toFixed(2)} N`,
          unit: "F_peel",
          badgeColor: "amber",
          progressPct: clampProgress((tel.totalPeelForceN / 8) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Shear/Peel Anisotropy",
          value: `${tel.forceAnisotropyRatio.toFixed(1)}x`,
          unit: "α_aniso",
          badgeColor: "purple",
          progressPct: clampProgress((tel.forceAnisotropyRatio / 40) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Shape Retention",
          value: `${(tel.thermalRetentionFraction * 100).toFixed(1)}%`,
          unit: "ϕ_set",
          badgeColor: "indigo",
          progressPct: clampProgress(tel.thermalRetentionFraction * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Peeling Power",
          value: `${(tel.peelDisengagementPowerWatts * 1000).toFixed(1)} mW`,
          unit: "P_peel",
          badgeColor: "rose",
          progressPct: clampProgress((tel.peelDisengagementPowerWatts / 0.1) * 100),
          provenance: "scenario-modern",
        },
      ];
    },
    pedagogicalInsight:
      "George de Mestral's hook-and-loop fastener achieves extreme mechanical anisotropy: thousands of microscopic cantilever hooks act in parallel to resist massive in-plane shear sliding, yet peel open effortlessly with minimal force because fracture energy localizes along a single line of deflecting hooks.",
  },
  "us-2846084-goertz-electronic-master-slave-manipulator": {
    domain: "robotics_teleoperation",
    domainTitle: "Bilateral Teleoperation & Force-Reflecting Servo Topology",
    equationName: "Synchro Position Error with Relative-Speed Feedback",
    governingEquation:
      "E \\propto q_m-q_s, \\qquad V_t\\propto\\dot q_m-\\dot q_s, \\qquad E_{drive}=\\operatorname{limit}(E-kV_t)",
    engineMethod:
      "stepGoertzMasterSlaveTopology (deterministic TypeScript source-bound topology; no FrankenSim WASM module stepped)",
    controls: [
      {
        id: "horizontalArmPivot",
        label: "Horizontal Arm Pivot · Axis 113b",
        min: -1,
        max: 1,
        step: 0.01,
        defaultValue: GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.horizontalArmPivot,
        unit: "normalized",
      },
      {
        id: "horizontalArmRoll",
        label: "Horizontal Arm Roll",
        min: -1,
        max: 1,
        step: 0.01,
        defaultValue: GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.horizontalArmRoll,
        unit: "normalized",
      },
      {
        id: "verticalArmPivot",
        label: "Vertical Arm Pivot · Axis 126",
        min: -1,
        max: 1,
        step: 0.01,
        defaultValue: GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.verticalArmPivot,
        unit: "normalized",
      },
      {
        id: "verticalArmRoll",
        label: "Vertical Arm Roll",
        min: -1,
        max: 1,
        step: 0.01,
        defaultValue: GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.verticalArmRoll,
        unit: "normalized",
      },
      {
        id: "toolAxis171",
        label: "Tool Pivot · Axis 171",
        min: -1,
        max: 1,
        step: 0.01,
        defaultValue: GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.toolAxis171,
        unit: "normalized",
      },
      {
        id: "toolAxis172",
        label: "Tool Pivot · Axis 172",
        min: -1,
        max: 1,
        step: 0.01,
        defaultValue: GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.toolAxis172,
        unit: "normalized",
      },
      {
        id: "gripperClosure",
        label: "Tool Closure",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.gripperClosure,
        unit: "normalized",
      },
      {
        id: "contactResistance",
        label: "Remote Contact Resistance",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.contactResistance,
        unit: "illustrative normalized state",
      },
      {
        id: "forceReflectionEnabled",
        label: "Claim 9 Force Reflection",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.forceReflectionEnabled,
        unit: "off/on",
      },
      {
        id: "tachometerDampingEnabled",
        label: "Claim 11 Tachometer Path",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.tachometerDampingEnabled,
        unit: "off/on",
      },
      {
        id: "limiterEnabled",
        label: "Claims 10/12 Limiter",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.limiterEnabled,
        unit: "off/on",
      },
    ],
    computeMetrics: (params) => {
      const controls = readGoertzMasterSlaveControls(params);
      const pose = stepGoertzMasterSlaveTopology(controls);
      return [
        {
          label: "Largest Channel Mismatch",
          value: (pose.errorMagnitude * 100).toFixed(0),
          unit: "% normalized",
          badgeColor: pose.errorMagnitude > 0.45 ? "amber" : "cyan",
          progressPct: clampProgress(pose.errorMagnitude * 100),
        },
        {
          label: "Reflected Resistance",
          value: (pose.reflectedResistance * 100).toFixed(0),
          unit: "% normalized",
          badgeColor: pose.forceReflectionEnabled ? "emerald" : "indigo",
          progressPct: clampProgress(pose.reflectedResistance * 100),
        },
        {
          label: "Servo State",
          value: pose.state.toUpperCase(),
          unit: "source topology",
          badgeColor: pose.limiterActive ? "amber" : "purple",
        },
        {
          label: "Claim Probe",
          value: `CLAIM ${pose.activeClaim}`,
          unit: "issued text",
          badgeColor: "cyan",
        },
        {
          label: "Quantitative SI Prediction",
          value: "REFUSED",
          unit: "missing source inputs",
          badgeColor: "rose",
        },
      ];
    },
    pedagogicalInsight:
      "US 2,846,084 gives a seven-channel bilateral teleoperation topology: a synchro error signal is proportional to the mismatch between corresponding master and slave positions, motors act to reduce that mismatch, and remote resistance can return to the master handle. The facsimile does not establish arm dimensions, force calibration, payload, motor constants, controller gains, or bandwidth, so the exhibit explicitly remains normalized and does not claim a WASM or SI performance step.",
  },
  "us-3119501-lemelson-automatic-warehousing": {
    domain: "industrial_automation",
    domainTitle: "Marker-Addressed Warehouse Topology",
    equationName: "Preset-Count Position Event Sequence",
    governingEquation:
      "c_{next}=c_{now}-1; \\quad c=0 \\Rightarrow \\text{stop current stage / begin the next source-described stage}",
    engineMethod:
      "stepLemelsonWarehouseTopology (normalized host topology; quantitative SI model refused)",
    controls: [
      {
        id: "railAddressFraction",
        label: "Rail Address",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: LEMELSON_WAREHOUSE_DEFAULT_CONTROLS.railAddressFraction,
        unit: "normalized",
        provenance: "scenario-reader",
      },
      {
        id: "levelAddressFraction",
        label: "Vertical Address",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: LEMELSON_WAREHOUSE_DEFAULT_CONTROLS.levelAddressFraction,
        unit: "normalized",
        provenance: "scenario-reader",
      },
      {
        id: "shuttleExtensionFraction",
        label: "Shuttle Extension",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: LEMELSON_WAREHOUSE_DEFAULT_CONTROLS.shuttleExtensionFraction,
        unit: "normalized",
        provenance: "scenario-reader",
      },
      {
        id: "automaticAddressing",
        label: "Preset-Count Addressing",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: LEMELSON_WAREHOUSE_DEFAULT_CONTROLS.automaticAddressing,
        unit: "off/on",
        provenance: "source-disclosed",
      },
    ],
    computeMetrics: (p) => {
      const controls = readLemelsonWarehouseControls(p);
      const pose = stepLemelsonWarehouseTopology(controls);
      return [
        {
          label: "Rail Address",
          value: (pose.carrierX * 100).toFixed(0),
          unit: "% normalized",
          badgeColor: "cyan",
          progressPct: clampProgress(pose.carrierX * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Vertical Address",
          value: (pose.carrierY * 100).toFixed(0),
          unit: "% normalized",
          badgeColor: "emerald",
          progressPct: clampProgress(pose.carrierY * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Shuttle Extension",
          value: (pose.shuttleZ * 100).toFixed(0),
          unit: "% normalized",
          badgeColor: "purple",
          progressPct: clampProgress(pose.shuttleZ * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Addressing State",
          value: pose.addressState.toUpperCase(),
          unit: "source topology",
          badgeColor: pose.automaticAddressing ? "amber" : "indigo",
          provenance: "source-disclosed",
        },
        {
          label: "Quantitative Performance",
          value: "REFUSED",
          unit: "missing source inputs",
          badgeColor: "rose",
          provenance: "refusal-bounded",
        },
      ];
    },
    pedagogicalInsight:
      "US 3,119,501 joins rail travel, vertical position, lateral transfer, bay markers, scanning relays, and preset counting relays. The facsimile does not state geometry, payload, speed, motor power, timing, or sensor precision, so the public model remains a normalized source topology rather than a performance simulation.",
  },
  "us-3313014-lemelson-automatic-production": {
    domain: "industrial_automation",
    domainTitle: "Carrier-to-Station Production-Control Topology",
    equationName: "Marker, Retention, Coupling, and Release Interlock",
    governingEquation:
      "m_{recognized}\\land r_{retained}\\land c_{coupled}\\Rightarrow u_{machine};\\quad p_{cycle}\\geq0.8\\Rightarrow u_{release}",
    engineMethod:
      "stepLemelsonAutomaticProductionTopology (deterministic TypeScript source-bounded topology; no FrankenSim WASM module stepped)",
    controls: [
      {
        id: "carrierAddressFraction",
        label: "Carrier Address",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS.carrierAddressFraction,
        unit: "normalized",
      },
      {
        id: "liftFraction",
        label: "Mz Lift Pose",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS.liftFraction,
        unit: "normalized",
      },
      {
        id: "reachFraction",
        label: "My Platform Reach",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS.reachFraction,
        unit: "normalized",
      },
      {
        id: "stationDetected",
        label: "Marker Sensed",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS.stationDetected,
        unit: "off/on",
      },
      {
        id: "stationCoupled",
        label: "Station Contacts Coupled",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS.stationCoupled,
        unit: "off/on",
      },
      {
        id: "cycleProgress",
        label: "Ordered Cycle",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS.cycleProgress,
        unit: "normalized",
      },
    ],
    computeMetrics: (params) => {
      const controls = readLemelsonAutomaticProductionControls(params);
      const state = stepLemelsonAutomaticProductionTopology(controls);
      return [
        {
          label: "Carrier Address",
          value: (state.carrierAddressFraction * 100).toFixed(0),
          unit: "% normalized",
          badgeColor: "cyan",
          progressPct: clampProgress(state.carrierAddressFraction * 100),
        },
        {
          label: "Cycle Phase",
          value: state.phase.toUpperCase(),
          unit: "source topology",
          badgeColor: state.releaseAuthorized ? "amber" : "indigo",
        },
        {
          label: "Station Coupling",
          value: state.controllerCoupled ? "CLOSED" : "OPEN",
          unit: "claim probe",
          badgeColor: state.controllerCoupled ? "emerald" : "rose",
        },
        {
          label: "Machine Command",
          value: state.machineCommandAuthorized ? "AUTHORIZED" : "REFUSED",
          unit: "source interlock",
          badgeColor: state.machineCommandAuthorized ? "emerald" : "amber",
        },
        {
          label: "Quantitative Performance",
          value: "REFUSED",
          unit: "missing source inputs",
          badgeColor: "rose",
        },
      ];
    },
    pedagogicalInsight:
      "US 3,313,014 binds a guided work carrier to marker sensing, retention, portable programme control, station coupling, machine operation, release, and departure. The facsimile does not state dimensions, payload, speed, force, timing, tolerance, motor rating, or process model, so the public exhibit reports only its deterministic normalized topology and interlock.",
  },
  "us-3858581-kamen-medication-injection-device": {
    domain: "mechatronics",
    domainTitle: "Pulse-Counted Lead-Screw Mechanism (Nonclinical)",
    equationName: "Rotation Event and Actuator-State Topology",
    governingEquation:
      "N_{pulse}=n_{turns}; \\quad x=n p; \\quad \\text{state}=f(\\text{counter},\\text{motor circuit},\\text{clutch path})",
    engineMethod:
      "stepKamenInjectionMechanism (normalized nonclinical host topology; quantitative delivery model refused)",
    controls: [
      {
        id: "leadScrewTurnFraction",
        label: "Lead-Screw Rotation",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: KAMEN_INJECTION_DEFAULT_CONTROLS.leadScrewTurnFraction,
        unit: "normalized",
        provenance: "scenario-reader",
      },
      {
        id: "counterTargetFraction",
        label: "Pulse-Counter Target",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: KAMEN_INJECTION_DEFAULT_CONTROLS.counterTargetFraction,
        unit: "normalized",
        provenance: "scenario-reader",
      },
      {
        id: "motorCircuitClosed",
        label: "Motor Circuit",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: KAMEN_INJECTION_DEFAULT_CONTROLS.motorCircuitClosed,
        unit: "open/closed",
        provenance: "source-disclosed",
      },
      {
        id: "reliefPathShown",
        label: "Clutch Relief Path",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: KAMEN_INJECTION_DEFAULT_CONTROLS.reliefPathShown,
        unit: "hidden/shown",
        provenance: "source-disclosed",
      },
    ],
    computeMetrics: (p) => {
      const controls = readKamenInjectionControls(p);
      const pose = stepKamenInjectionMechanism(controls);
      return [
        {
          label: "Lead-Screw Position",
          value: (pose.plungerPosition * 100).toFixed(0),
          unit: "% normalized",
          badgeColor: "cyan",
          progressPct: clampProgress(pose.plungerPosition * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Counter Progress",
          value: (pose.pulseProgress * 100).toFixed(0),
          unit: "% normalized",
          badgeColor: "amber",
          progressPct: clampProgress(pose.pulseProgress * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Mechanism State",
          value: pose.motorState.toUpperCase(),
          unit: "source topology",
          badgeColor: pose.reliefPathShown
            ? "rose"
            : pose.motorCircuitClosed
              ? "emerald"
              : "indigo",
          provenance: "source-disclosed",
        },
        {
          label: "Claim Probe",
          value: `CLAIM ${pose.activeClaim}`,
          unit: "source claim",
          badgeColor: "purple",
          provenance: "source-disclosed",
        },
        {
          label: "Clinical Delivery Prediction",
          value: "REFUSED",
          unit: "not in source",
          badgeColor: "rose",
          provenance: "refusal-bounded",
        },
      ];
    },
    pedagogicalInsight:
      "US 3,858,581 ties a uniform-pitch lead screw to a striker-operated pulse switch and counter-controlled motor state. The source lacks a dose, volume-per-pulse calibration, pressure, patient condition, delivery rate, or clinical outcome, so this is explicitly a nonclinical mechanism exhibit.",
  },
  "us-4068536-stackhouse-manipulator": {
    domain: "solid_mechanics",
    domainTitle: "Intersecting-Axis Wrist Topology & Concentric Shaft Transmission",
    equationName: "Selected Serial-Axis Display Composition",
    governingEquation:
      "\\mathbf{R}_{display}=\\mathbf{R}_{z}(q_A)\\,\\mathbf{R}_{y}(\\alpha_{AB})\\,\\mathbf{R}_{z}(q_B)\\,\\mathbf{R}_{y}(-\\alpha_{BC})\\,\\mathbf{R}_{z}(q_C),\\quad \\alpha_{AB},\\alpha_{BC}>45^\\circ",
    engineMethod: "stepStackhouseSourceTopology (normalized host geometry; SI dynamics refused)",
    controls: [
      {
        id: "forearmRollDeg",
        label: "Forearm Roll (θ₁)",
        min: -180,
        max: 180,
        step: 1,
        defaultValue: STACKHOUSE_SOURCE_DEFAULT_CONTROLS.forearmRollDeg,
        unit: "°",
      },
      {
        id: "intermediateRollDeg",
        label: "Intermediate Oblique Roll (θ₂)",
        min: -180,
        max: 180,
        step: 1,
        defaultValue: STACKHOUSE_SOURCE_DEFAULT_CONTROLS.intermediateRollDeg,
        unit: "°",
      },
      {
        id: "toolRollDeg",
        label: "Tool Spin Roll (θ₃)",
        min: -180,
        max: 180,
        step: 1,
        defaultValue: STACKHOUSE_SOURCE_DEFAULT_CONTROLS.toolRollDeg,
        unit: "°",
      },
      {
        id: "firstObliqueAngleDeg",
        label: "Selected A–B Obliquity",
        min: 46,
        max: 80,
        step: 1,
        defaultValue: STACKHOUSE_SOURCE_DEFAULT_CONTROLS.firstObliqueAngleDeg,
        unit: "° display",
      },
      {
        id: "secondObliqueAngleDeg",
        label: "Selected B–C Obliquity",
        min: 46,
        max: 80,
        step: 1,
        defaultValue: STACKHOUSE_SOURCE_DEFAULT_CONTROLS.secondObliqueAngleDeg,
        unit: "° display",
      },
      {
        id: "singleIntersection",
        label: "Preferred Common Point P",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: STACKHOUSE_SOURCE_DEFAULT_CONTROLS.singleIntersection,
        unit: "offset/exact",
      },
    ],
    computeMetrics: (params) => {
      const controls = readStackhouseSourceControls(params);
      const pose = stepStackhouseSourceTopology(controls);
      return [
        {
          label: "Selected Display Bend",
          value: pose.bendAngleDeg.toFixed(1),
          unit: "° display",
          badgeColor: "cyan",
          progressPct: clampProgress((pose.bendAngleDeg / 180) * 100),
        },
        {
          label: "Selected Display Azimuth",
          value: pose.azimuthAngleDeg.toFixed(1),
          unit: "° display",
          badgeColor: "indigo",
        },
        {
          label: "Axis Intersection",
          value: pose.singleIntersection >= 0.5 ? "POINT P" : "OFFSET CONTRAST",
          unit: "source topology",
          badgeColor: pose.singleIntersection >= 0.5 ? "emerald" : "amber",
        },
        {
          label: "Printed Oblique Condition",
          value: ">45° / >45°",
          unit: "source inequality",
          badgeColor: "emerald",
        },
        {
          label: "Orientation-Hole State",
          value: pose.singleIntersection >= 0.5 ? "PREFERRED" : "SOURCE-WARNED",
          unit: "qualitative",
          badgeColor: pose.singleIntersection >= 0.5 ? "emerald" : "rose",
        },
        {
          label: "SI Dynamics / Performance",
          value: "REFUSED",
          unit: "missing source inputs",
          badgeColor: "rose",
        },
      ];
    },
    pedagogicalInsight:
      "US 4,068,536 routes three elbow-mounted hydraulic-motor inputs through concentric forearm shafts, bevel gears, a second concentric-shaft set, and terminal shaft 26. The preferred axes meet at P, and the printed illustrated oblique angles are only specified as greater than 45 degrees; quantitative performance is therefore refused.",
  },
};

// Aliases for standard catalog IDs without suffix
PATENT_PHYSICS_REGISTRY["us-6285999"] = PATENT_PHYSICS_REGISTRY["us-6285999-pagerank"];
PATENT_PHYSICS_REGISTRY["us-6594844"] = PATENT_PHYSICS_REGISTRY["us-6594844-roomba"];
PATENT_PHYSICS_REGISTRY["us-6331181"] = PATENT_PHYSICS_REGISTRY["us-6331181-davinci"];
PATENT_PHYSICS_REGISTRY["us-6120588"] = PATENT_PHYSICS_REGISTRY["us-6120588-eink"];
PATENT_PHYSICS_REGISTRY["us-7479949"] = PATENT_PHYSICS_REGISTRY["us-7479949-multitouch"];

// Catalog page ids share the same kernel seats as their leftover/legacy keys.
// The 3D/2D instruments write these ids; the badge must not stay on sourceFocus.
PATENT_PHYSICS_REGISTRY["us-608969-parsons-turbine"] =
  PATENT_PHYSICS_REGISTRY["us-328710-parsons-turbine"];
PATENT_PHYSICS_REGISTRY["us-3923554-boyle-smith-ccd"] =
  PATENT_PHYSICS_REGISTRY["us-3858232-boyle-smith-ccd"];
PATENT_PHYSICS_REGISTRY["us-3671542-kwolek-kevlar"] =
  PATENT_PHYSICS_REGISTRY["_legacy-unpublished-us-3671542-kwolek-kevlar"];
PATENT_PHYSICS_REGISTRY["us-586193-marconi-radio"] =
  PATENT_PHYSICS_REGISTRY["_legacy-unpublished-us-586193-marconi-radio"];
PATENT_PHYSICS_REGISTRY["us-2292387-lamarr-frequency-hopping"] =
  PATENT_PHYSICS_REGISTRY["_legacy-unpublished-us-2292387-lamarr-frequency-hopping"];
PATENT_PHYSICS_REGISTRY["us-2708656-fermi-reactor"] =
  PATENT_PHYSICS_REGISTRY["_legacy-unpublished-us-2708656-fermi-reactor"];
PATENT_PHYSICS_REGISTRY["us-3541541-engelbart-mouse"] =
  PATENT_PHYSICS_REGISTRY["_legacy-unpublished-us-3541541-engelbart-mouse"];
PATENT_PHYSICS_REGISTRY["us-313224-mergenthaler-linotype"] =
  PATENT_PHYSICS_REGISTRY["_legacy-unpublished-us-313224-mergenthaler-linotype"];
PATENT_PHYSICS_REGISTRY["us-395781-hollerith-tabulating"] =
  PATENT_PHYSICS_REGISTRY["_legacy-unpublished-us-395781-hollerith-tabulating"];
PATENT_PHYSICS_REGISTRY["us-542846-diesel-engine"] =
  PATENT_PHYSICS_REGISTRY["_legacy-unpublished-us-542846-diesel-engine"];
