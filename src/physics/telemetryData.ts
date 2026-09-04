import {
  stepBaekelandBakelite,
  stepBellPhotophone,
  stepCarlsonElectrophotography,
  stepDeForestAudion,
  stepFessendenWireless,
  stepHaberAmmonia,
  stepHewittMercuryLamp,
  stepLamarrRecordControl,
  stepLandPolaroidInstantFilm,
  stepRillieuxEvaporator,
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
import { readBaerControls, readBaerOdysseyTapeFrame } from "./baerOdysseyKernel";
import { stepBardeenPointContact } from "./bardeenPointContactKernel";
import {
  DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS,
  readBoyleSmithCcdSourceControls,
  readBoyleSmithCcdTapeFrame,
  resetBoyleSmithCcdTape,
} from "./boyleSmithCcdKernel";
import {
  stepBellTelephone,
  stepCorlissEngine,
  stepDavenportMotor,
  stepDeLavalSeparator,
  stepEdisonBulb,
  stepEdisonPhonograph,
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
  stepOttoEngine,
  stepParsonsTurbine,
  stepPasteurFermentation,
  stepTeslaTeleautomaton,
  stepThomsonWelding,
  stepWhitneyCottonGin,
  stepWozniakApple,
  stepZeppelinAirship,
} from "./catalogKernels";
import { stepClavelDeltaRobotTopology } from "./clavelDeltaRobotKernel";
import { readColtRuntimeControls, stepColtLockwork } from "./coltRevolverKernel";
import { stepCortPuddlingRolling } from "./cortKernel";
import { CRUMP_FDM_DEFAULT_CONTROLS, readCrumpFdmControls, stepCrumpFdmSi } from "./crumpFdmKernel";
import {
  readDaVinciInterfaceControls,
  resolveDaVinciInterfaceTopology,
} from "./daVinciInterfaceTopology";
import { stepDevolProgrammedTransfer } from "./devolProgrammedTransferKernel";
import { readEInkRuntimeControls, readEInkTapeFrame, resetEInkTape } from "./eInkSharedKernel";
import { FrankenSimEngine } from "./engine";
import {
  readFarnsworthTvControls,
  readFarnsworthTvTapeFrame,
  resetFarnsworthTvTape,
} from "./farnsworthTvKernel";
import { NATURAL_URANIUM_U235_PERCENT, stepFermiKinetics } from "./fermiKinetics";
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
  readKamenInjectionTapeFrame,
} from "./kamenInjectionKernel";
import {
  KAMEN_SEGWAY_DEFAULT_CONTROLS,
  readKamenSegwayControls,
  stepKamenSegwaySi,
} from "./kamenSegwayKernel";
import { readKamenTransporterControls } from "./kamenTransporterKernel";
import { stepKamenTransporterPhysics } from "./kamenTransporterWasm";
import {
  KILBY_FIGURE_7_VALUES,
  KILBY_PRINTED_WAFER,
  KILBY_SOURCE_CIRCUIT_DEFAULTS,
  readKilbySourceCircuitControls,
  stepKilbySourceCircuitTopology,
} from "./kilbySourceCircuitKernel";
import { resetLamarrTape } from "./lamarrSharedKernel";
import { stepLemelsonManipulatorTopology } from "./lemelsonAdjustableManipulatorKernel";
import {
  LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS,
  readLemelsonAutomaticProductionControls,
  stepLemelsonAutomaticProductionTopology,
} from "./lemelsonAutomaticProductionKernel";
import {
  readLemelsonMachineVisionControls,
  stepLemelsonMachineVisionTopology,
} from "./lemelsonMachineVisionKernel";
import {
  LEMELSON_WAREHOUSE_DEFAULT_CONTROLS,
  readLemelsonWarehouseControls,
  stepLemelsonWarehouseTopology,
} from "./lemelsonWarehouseKernel";
import {
  stepHoweSewingMachine,
  stepMergenthalerLinotype,
  stepSholesTypewriter,
} from "./machineKernels";
import {
  MAKINO_FRANKENSIM_BOUNDARY,
  MAKINO_FRANKENSIM_OWNER,
  measureMakinoScaraInvariants,
  stepMakinoScaraTopology,
} from "./makinoScaraKernel";
import {
  readMarconiRuntimeControls,
  readMarconiTapeFrame,
  resetMarconiTape,
} from "./marconiSharedKernel";
import {
  MESTRAL_VELCRO_DEFAULTS,
  readMestralVelcroControls,
  stepMestralVelcroSi,
} from "./mestralVelcroKernel";
import {
  readEthernetControls,
  readMetcalfeEthernetTapeFrame,
  resetMetcalfeEthernetTape,
} from "./metcalfeEthernetKernel";
import { stepMilacronRobotToolchanger } from "./milacronRobotToolchangerKernel";
import { stepMultiTouch } from "./multiTouchKernel";
import {
  NOYCE_PLANAR_LEAD_DEFAULT_CONTROLS,
  readNoycePlanarLeadControls,
  stepNoycePlanarLeadTopology,
} from "./noycePlanarLeadKernel";
import { readOtisTopologyControls, stepOtis1861Topology } from "./otisKernel";
import { stepPageRank } from "./pageRankKernel";
import { stepParsonsMarine } from "./parsonsMarineKernel";
import {
  ROBOT_END_EFFECTOR_FRANKENSIM_CONTACT_OWNER,
  ROBOT_END_EFFECTOR_FRANKENSIM_HELICAL_OWNER,
  ROBOT_END_EFFECTOR_FRANKENSIM_PRISMATIC_OWNER,
  ROBOT_END_EFFECTOR_FRANKENSIM_REVOLUTE_OWNER,
  stepRobotEndEffector,
} from "./robotEndEffectorKernel";
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
import { stepSpencerMicrowaveSource } from "./spencerMicrowaveKernel";
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
  readTownesMaserControls,
  stepTownesMaserTopology,
  TOWNES_MASER_DEFAULT_CONTROLS,
} from "./townesMaserKernel";

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
  | "source-derived"
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
  /** Reproject metrics when a stateful fixed-step tape advances. */
  refreshFromRuntimeTape?: boolean;
  /** Reset stateful event/trajectory tape together with baseline controls. */
  resetRuntimeTape?: () => void;
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
        provenance: "scenario-modern",
      },
      {
        id: "exposureFraction",
        label: "Exposure Level",
        min: 0.0,
        max: 1.0,
        step: 0.05,
        defaultValue: 0.6,
        unit: "fraction",
        provenance: "topology-normalized",
      },
      {
        id: "reagentViscosityCp",
        label: "Gel Viscosity",
        min: 1000,
        max: 80000,
        step: 1000,
        defaultValue: 25000,
        unit: "cP",
        provenance: "scenario-modern",
      },
      {
        id: "rollerGapUm",
        label: "Roller Spread Gap",
        min: 10,
        max: 60,
        step: 2,
        defaultValue: 25,
        unit: "µm",
        provenance: "scenario-modern",
      },
      {
        id: "alkaliPh",
        label: "Developer pH",
        min: 10.5,
        max: 13.8,
        step: 0.1,
        defaultValue: 12.6,
        unit: "pH",
        provenance: "scenario-modern",
      },
      {
        id: "claim1Active",
        label: "Claim 1 Attached Product Path",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "on/off",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics: (controls) => {
      const state = stepLandPolaroidInstantFilm({
        developmentTimeSec: controls.developmentTimeSec,
        exposureFraction: controls.exposureFraction,
        reagentViscosityCp: controls.reagentViscosityCp,
        rollerGapUm: controls.rollerGapUm,
        alkaliPh: controls.alkaliPh,
        claim1Active: (controls.claim1Active ?? 1) >= 0.5,
      });

      return [
        {
          label: "Positive Print Density",
          value: `${state.positiveSilverDensity.toFixed(2)}`,
          unit: "D",
          badgeColor: "emerald",
          provenance: "scenario-modern",
        },
        {
          label: "Negative Silver Density",
          value: `${state.negativeSilverDensity.toFixed(2)}`,
          unit: "D",
          badgeColor: "indigo",
          provenance: "scenario-modern",
        },
        {
          label: "Transfer Efficiency",
          value: `${state.transferEfficiencyPercent.toFixed(1)}`,
          unit: "%",
          badgeColor: "cyan",
          provenance: "scenario-modern",
        },
        {
          label: "Diffusion Flux",
          value: `${state.diffusionFluxMolPerM2S.toFixed(4)}`,
          unit: "mol/m²s",
          badgeColor: "amber",
          provenance: "scenario-modern",
        },
        {
          label: "Meniscus Uniformity",
          value: `${state.meniscusSpreadUniformityPercent.toFixed(1)}`,
          unit: "%",
          badgeColor: "rose",
          provenance: "scenario-modern",
        },
        {
          label: "Print Progress",
          value: `${state.printCompletionPercent.toFixed(0)}`,
          unit: "%",
          badgeColor: "cyan",
          progressPct: state.printCompletionPercent,
          provenance: "topology-normalized",
        },
      ];
    },
  },
  "us-3138743-kilby-integrated-circuit": {
    domain: "semiconductor_physics",
    domainTitle: "Source-Bounded Monolithic Semiconductor Circuit Topology",
    equationName: "Bulk Semiconductor Resistance (Geometry Required)",
    governingEquation:
      "R = \\rho \\frac{L}{A} \\quad (\\text{the grant prints }\\rho\\text{ and circuit values, but not each region's }L\\text{ and }A)",
    engineMethod: "Source-Bounded TypeScript Topology Step (Electrical Performance Refused)",
    pedagogicalInsight:
      "Kilby's illustrated multivibrator puts junction transistors, shaped semiconductor resistors, and capacitor regions in one etched germanium wafer, then makes the selected interconnections with alloyed Kovar leads, evaporated contacts, and thermally bonded gold wires. The source construction is shown without inventing an operating point.",
    controls: [
      {
        id: "sectionRevealFraction",
        label: "Semiconductor Section Reveal",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: KILBY_SOURCE_CIRCUIT_DEFAULTS.sectionRevealFraction,
        unit: "fraction",
        provenance: "topology-normalized",
      },
      {
        id: "wireArchFraction",
        label: "Thermally Bonded Wire Arch",
        min: 0.2,
        max: 1,
        step: 0.01,
        defaultValue: KILBY_SOURCE_CIRCUIT_DEFAULTS.wireArchFraction,
        unit: "fraction",
        provenance: "topology-normalized",
      },
      {
        id: "claim1ConductiveMeansPresent",
        label: "Claim 1 Conductive Means",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: KILBY_SOURCE_CIRCUIT_DEFAULTS.claim1ConductiveMeansPresent,
        unit: "",
        provenance: "source-disclosed",
      },
    ],
    computeMetrics: (controls) => {
      const state = stepKilbySourceCircuitTopology(readKilbySourceCircuitControls(controls));

      return [
        {
          label: "Semiconductor Section Reveal",
          value: `${(state.controls.sectionRevealFraction * 100).toFixed(0)}`,
          unit: "% illustrative reveal",
          badgeColor: "cyan",
          progressPct: state.controls.sectionRevealFraction * 100,
          primary: true,
          provenance: "topology-normalized",
        },
        {
          label: "Wire 70 Arch",
          value: state.controls.wireArchFraction.toFixed(2),
          unit: "normalized drawing geometry",
          badgeColor: "amber",
          provenance: "topology-normalized",
        },
        {
          label: "Printed Wafer",
          value: `${KILBY_PRINTED_WAFER.lengthIn.toFixed(3)} × ${KILBY_PRINTED_WAFER.widthIn.toFixed(3)} × ${KILBY_PRINTED_WAFER.thicknessIn.toFixed(4)}`,
          unit: "in",
          badgeColor: "emerald",
          provenance: "source-disclosed",
        },
        {
          label: "Antimony N Layer",
          value: KILBY_PRINTED_WAFER.nLayerDepthMil.toFixed(1),
          unit: "mil",
          badgeColor: "indigo",
          provenance: "source-disclosed",
        },
        {
          label: "Figure 7 Printed Values",
          value: `${KILBY_FIGURE_7_VALUES.r4R5R6R7Ohms} / ${KILBY_FIGURE_7_VALUES.r3R8Ohms} / ${KILBY_FIGURE_7_VALUES.r1R2Ohms} Ω · ${KILBY_FIGURE_7_VALUES.c1C2Microfarads} µF`,
          unit: "",
          badgeColor: "amber",
          provenance: "source-disclosed",
        },
        {
          label: "Claim 1 Conductive Means",
          value: state.claim1TopologyComplete ? "present" : "withheld",
          unit: "",
          badgeColor: state.claim1TopologyComplete ? "emerald" : "rose",
          provenance: "refusal-bounded",
        },
        {
          label: "Electrical Performance",
          value: "refused",
          unit: "",
          badgeColor: "rose",
          provenance: "refusal-bounded",
        },
      ];
    },
  },
  "us-3728480-baer-odyssey": {
    refreshFromRuntimeTape: true,
    domain: "video_electronics",
    domainTitle: "Television Gaming & Raster Coincidence",
    equationName: "NTSC Raster Timing, Monostable RC Spot Delay & Coincidence Gating",
    governingEquation:
      "\\tau_H = R_X C_H \\ln(2),\\quad \\tau_V = R_Y C_V \\ln(2),\\quad V_{\\text{hit}} = V_1(t) \\cdot V_2(t),\\quad s(t) = [A_c + m \\cdot v_{\\text{comp}}(t)] \\cos(2\\pi f_c t)",
    engineMethod:
      "HostKernel.stepBaerOdysseySi (source circuit topology and fixed-step SCR latch; compiled digital-circuit WASM unavailable)",
    pedagogicalInsight:
      "Ralph Baer synthesizes television raster dots without a computer: astable multivibrators establish horizontal/vertical sync, variable RC delays position the rectangular pulses, and the Figure 5E diode network detects overlap between two generated dots before an SCR latches the first generator off.",
    controls: [
      {
        id: "player1PotX",
        label: "Dot 20 Horizontal (Knob 17)",
        min: 0.05,
        max: 0.95,
        step: 0.01,
        defaultValue: 0.25,
        unit: "norm",
        provenance: "scenario-reader",
      },
      {
        id: "player1PotY",
        label: "Dot 20 Vertical (Knob 16)",
        min: 0.05,
        max: 0.95,
        step: 0.01,
        defaultValue: 0.5,
        unit: "norm",
        provenance: "scenario-reader",
      },
      {
        id: "player2PotX",
        label: "Dot 20₁ Horizontal (Knob 17₁)",
        min: 0.05,
        max: 0.95,
        step: 0.01,
        defaultValue: 0.75,
        unit: "norm",
        provenance: "scenario-reader",
      },
      {
        id: "player2PotY",
        label: "Dot 20₁ Vertical (Knob 16₁)",
        min: 0.05,
        max: 0.95,
        step: 0.01,
        defaultValue: 0.5,
        unit: "norm",
        provenance: "scenario-reader",
      },
      {
        id: "englishControl",
        label: "English / Ball Spin",
        min: -1.0,
        max: 1.0,
        step: 0.05,
        defaultValue: 0.0,
        unit: "spin",
        provenance: "scenario-reader",
      },
      {
        id: "ballSpeedMultiplier",
        label: "Ball Speed Multiplier",
        min: 0.5,
        max: 2.5,
        step: 0.1,
        defaultValue: 1.0,
        unit: "x",
        provenance: "scenario-reader",
      },
      {
        id: "rfChannel",
        label: "VHF RF Channel",
        min: 3,
        max: 4,
        step: 1,
        defaultValue: 3,
        unit: "ch",
        provenance: "scenario-reader",
      },
      {
        id: "chromaPhaseDeg",
        label: "Chroma Phase Dial",
        min: 0,
        max: 180,
        step: 5,
        defaultValue: 45,
        unit: "deg",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics(rawParams) {
      const controls = readBaerControls(rawParams as any);
      const metrics = readBaerOdysseyTapeFrame(controls).metrics;
      return [
        {
          label: "Horizontal Sync",
          value: metrics.horizontalSyncFreqHz.toFixed(0),
          unit: "Hz",
          badgeColor: "emerald",
          description: "Astable multivibrator NTSC horizontal line frequency (15.75 kHz)",
          provenance: "source-disclosed",
        },
        {
          label: "Vertical Field Freq",
          value: metrics.verticalFreqHz.toFixed(1),
          unit: "Hz",
          badgeColor: "cyan",
          description: "Vertical sync oscillator field sweep rate (60 Hz)",
          provenance: "source-disclosed",
        },
        {
          label: "Dot 20 Horizontal Delay",
          value: metrics.p1DelayHMicrosec.toFixed(1),
          unit: "µs",
          badgeColor: "indigo",
          description: "Monostable RC delay time controlling dot 20 horizontal position",
          provenance: "scenario-reader",
        },
        {
          label: "Dot 20 Vertical Delay",
          value: metrics.p1DelayVMs.toFixed(2),
          unit: "ms",
          badgeColor: "purple",
          description: "Monostable RC delay time controlling dot 20 vertical position",
          provenance: "scenario-reader",
        },
        {
          label: "Illustrative Receiver Channel",
          value: metrics.rfCarrierFreqMHz.toFixed(2),
          unit: "MHz",
          badgeColor: "amber",
          description:
            "Modern Channel 3/4 frequency scenario; the grant requires a carrier selected for the receiver channel but prints no fixed channel frequency.",
          provenance: "scenario-modern",
        },
        {
          label: "Claim 1 Signal Path",
          value: metrics.claim1TopologyActive ? "CONNECTED" : "WITHHELD",
          unit: "topology",
          badgeColor: metrics.claim1TopologyActive ? "emerald" : "rose",
          description:
            "Control-unit dot generation, raster synchronization, participant manipulation, and direct receiver coupling.",
          provenance: metrics.claim1TopologyActive ? "source-disclosed" : "refusal-bounded",
        },
      ];
    },
  },
  "us-3858232-boyle-smith-ccd": {
    refreshFromRuntimeTape: true,
    resetRuntimeTape: resetBoyleSmithCcdTape,
    domain: "solid_state_optoelectronics",
    domainTitle: "Figure 2 Single-Conductivity Charge-Transfer Topology",
    equationName: "Figure 3 Sequential Pulse-Overlap Condition",
    governingEquation:
      "\\Delta t < 3t_p \\Longleftrightarrow \\frac{t_p}{\\Delta t} > \\frac{1}{3}",
    engineMethod:
      "HostKernel.stepBoyleSmithCcdSource (source topology and fixed-step sequence; compiled lattice/carrier WASM unavailable)",
    pedagogicalInsight:
      "The issued Figure 2 shift register connects every third electrode to one of three conductors. Figure 3 overlaps the sequential pulses so the next potential-energy minimum exists before the former one collapses; the grant does not supply the fabrication and operating values needed for CTE, SNR, carrier-count, or power claims.",
    controls: [
      {
        id: "pulseWidthToStepRatio",
        label: "Pulse Width / Initiation Interval",
        min: 0.2,
        max: 0.8,
        step: 0.01,
        defaultValue: DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS.pulseWidthToStepRatio,
        unit: "t_p / delta-t",
        provenance: "scenario-reader",
      },
      {
        id: "clockStepRateHz",
        label: "Visible Phase-Step Rate",
        min: 0.2,
        max: 2.5,
        step: 0.1,
        defaultValue: DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS.clockStepRateHz,
        unit: "Hz display",
        provenance: "topology-normalized",
      },
      {
        id: "pulseDepthNormalized",
        label: "Relative Potential-Well Depth",
        min: 0.25,
        max: 1,
        step: 0.01,
        defaultValue: DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS.pulseDepthNormalized,
        unit: "normalized",
        provenance: "topology-normalized",
      },
      {
        id: "running",
        label: "Clock Sequence Running",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "boolean",
        provenance: "topology-normalized",
      },
    ],
    computeMetrics: (rawControls: Record<string, number>) => {
      const controls = readBoyleSmithCcdSourceControls(rawControls);
      const metrics = readBoyleSmithCcdTapeFrame(controls).metrics;

      return [
        {
          label: "Figure 3 Active Phase",
          value: `Phi ${metrics.activePhase}`,
          unit: "of 3",
          badgeColor: "cyan",
          provenance: "scenario-reader",
        },
        {
          label: "Printed Input Pattern",
          value: metrics.inputPattern,
          unit: "Figure 3",
          badgeColor: "amber",
          provenance: "source-disclosed",
        },
        {
          label: "Pulse-Overlap Relation",
          value: `${controls.pulseWidthToStepRatio.toFixed(2)} (${metrics.pulseOverlapConditionMet ? "SATISFIED" : "REFUSED"})`,
          unit: "t_p / delta-t > 1/3",
          badgeColor: metrics.pulseOverlapConditionMet ? "emerald" : "rose",
          provenance: "scenario-reader",
        },
        {
          label: "Claim 1 Storage Medium",
          value: metrics.claim1TopologyComplete ? "CONTINUOUS" : "WITHHELD",
          unit: "single conductivity type",
          badgeColor: metrics.claim1TopologyComplete ? "emerald" : "rose",
          provenance: metrics.claim1TopologyComplete ? "source-disclosed" : "refusal-bounded",
        },
        {
          label: "Quantitative CTE / Charge / Power",
          value: "REFUSED",
          unit: "missing operating inputs",
          badgeColor: "rose",
          provenance: "refusal-bounded",
        },
      ];
    },
  },
  "us-4063220-metcalfe-ethernet": {
    refreshFromRuntimeTape: true,
    resetRuntimeTape: resetMetcalfeEthernetTape,
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
        provenance: "scenario-reader",
      },
      {
        id: "dataRateMbps",
        label: "Data Transmission Rate",
        min: 1.0,
        max: 10.0,
        step: 0.1,
        defaultValue: 2.94,
        unit: "Mbps",
        provenance: "source-disclosed",
      },
      {
        id: "stationCount",
        label: "Analytical Contender Estimate",
        min: 2,
        max: 32,
        step: 1,
        defaultValue: 8,
        unit: "nodes",
        provenance: "scenario-reader",
      },
      {
        id: "offeredLoad",
        label: "Analytical Offered Load (G)",
        min: 0.05,
        max: 2.5,
        step: 0.05,
        defaultValue: 0.6,
        unit: "norm",
        provenance: "scenario-reader",
      },
      {
        id: "packetSizeBytes",
        label: "Packet Frame Size",
        min: 64,
        max: 1518,
        step: 32,
        defaultValue: 256,
        unit: "bytes",
        provenance: "scenario-reader",
      },
      {
        id: "triggerCollision",
        label: "Simulate Packet Collision",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        unit: "flag",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics: (controls: Record<string, number>) => {
      const parsedControls = readEthernetControls(controls as any);
      const metrics = readMetcalfeEthernetTapeFrame(parsedControls).metrics;

      return [
        {
          label: "Electromagnetic Wave Speed",
          value: (metrics.propVelocityMps / 1e6).toFixed(1),
          unit: "×10⁶ m/s",
          badgeColor: "cyan",
          description: "Wave velocity in polyethylene dielectric coax (0.66c)",
          provenance: "source-disclosed",
        },
        {
          label: "One-Way Cable Delay",
          value: metrics.oneWayPropDelayNs.toFixed(1),
          unit: "ns",
          badgeColor: "indigo",
          description: "End-to-end signal propagation latency along coaxial bus",
          provenance: "scenario-reader",
        },
        {
          label: "Collision Slot Time",
          value: metrics.slotTimeMicrosec.toFixed(2),
          unit: "µs",
          badgeColor: "purple",
          description: "Round-trip collision detection window (2τ + 2t_tx)",
          provenance: "source-disclosed",
        },
        {
          label: "Manchester Bit Period",
          value: metrics.bitPeriodNs.toFixed(1),
          unit: "ns",
          badgeColor: "amber",
          description: "Clock period for self-clocking phase transitions",
          provenance: "source-disclosed",
        },
        {
          label: "Bus Analog Voltage",
          value: metrics.busVoltageVolts.toFixed(2),
          unit: "V",
          badgeColor: metrics.collisionDetected ? "rose" : "emerald",
          description: "Analog superposition voltage (normal -1.0V, collision -2.0V)",
          provenance: "source-disclosed",
        },
        {
          label: "Channel Utilization Efficiency",
          value: `${metrics.channelEfficiencyPct.toFixed(1)}%`,
          unit: "",
          badgeColor: metrics.channelEfficiencyPct > 50 ? "emerald" : "amber",
          description: "CSMA/CD protocol transmission efficiency",
          provenance: "scenario-reader",
        },
        {
          label: "Useful Data Throughput",
          value: metrics.throughputMbps.toFixed(2),
          unit: "Mbps",
          badgeColor: "emerald",
          description: "Actual delivered bandwidth after backoff and contention",
          provenance: "scenario-reader",
        },
        {
          label: "Terminator Power Dissipation",
          value: metrics.terminatorDissipationMw.toFixed(1),
          unit: "mW",
          badgeColor: "rose",
          description: "Thermal dissipation in 50-ohm end termination resistors",
          provenance: "scenario-reader",
        },
      ];
    },
  },
  "us-2318259-sikorsky-helicopter": {
    domain: "rotary_wing_aerodynamics",
    domainTitle: "Source-Bounded Direct-Lift Rotorcraft Teaching Scenario",
    equationName: "Modern Momentum-Theory Scenario Around the Disclosed Control Topology",
    governingEquation:
      "T_{\\text{main}} = C_T \\rho A (\\Omega R)^2,\\quad v_i = \\sqrt{\\frac{T}{2\\rho A}},\\quad Q_{\\text{main}} = \\frac{T v_i + P_{\\text{profile}}}{\\Omega},\\quad M_{\\text{yaw}} = Q_{\\text{main}} - T_{\\text{tail}} L_{\\text{boom}}",
    engineMethod:
      "stepSikorskyHelicopterSi (deterministic TypeScript scenario; historical SI dynamics refused)",
    pedagogicalInsight:
      "The grant discloses the causal mechanism—collective/cyclic pitch control, positive pitch-to-power correlation, and an orthogonal variable-pitch auxiliary rotor. The displayed forces, speeds, and dimensions come from a clearly labeled modern scenario because the grant does not quantify them.",
    provenance: "scenario-modern",
    controls: [
      {
        id: "collectivePitchDeg",
        label: "Collective Blade Pitch",
        min: 2.0,
        max: 16.0,
        step: 0.5,
        defaultValue: 6.8,
        unit: "deg",
        provenance: "scenario-reader",
      },
      {
        id: "cyclicPitchForwardDeg",
        label: "Longitudinal Cyclic Stick (Pitch)",
        min: -10.0,
        max: 10.0,
        step: 0.5,
        defaultValue: 0.0,
        unit: "deg",
        provenance: "scenario-reader",
      },
      {
        id: "cyclicRollRightDeg",
        label: "Lateral Cyclic Stick (Roll)",
        min: -10.0,
        max: 10.0,
        step: 0.5,
        defaultValue: 0.0,
        unit: "deg",
        provenance: "scenario-reader",
      },
      {
        id: "tailRotorPedalPercent",
        label: "Anti-Torque Rudder Pedals",
        min: -100.0,
        max: 100.0,
        step: 5.0,
        defaultValue: 0.0,
        unit: "%",
        provenance: "scenario-reader",
      },
      {
        id: "engineThrottlePercent",
        label: "Engine Throttle Setting",
        min: 0.0,
        max: 100.0,
        step: 1.0,
        defaultValue: 85.0,
        unit: "%",
        provenance: "scenario-reader",
      },
      {
        id: "engineRunning",
        label: "Engine Ignition / Drive State",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "flag",
        provenance: "scenario-reader",
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
          description: "Modern-scenario aerodynamic lift, not a value printed by the grant",
          provenance: "scenario-reader",
        },
        {
          label: "Main Rotor Torque Reaction",
          value: metrics.mainRotorTorqueNm.toFixed(1),
          unit: "N·m",
          badgeColor: "amber",
          description: "Modern-scenario aerodynamic torque reaction acting on the fuselage",
          provenance: "scenario-reader",
        },
        {
          label: "Tail Rotor Anti-Torque Thrust",
          value: metrics.tailRotorThrustNewtons.toFixed(1),
          unit: "N",
          badgeColor: "cyan",
          description: "Modern-scenario lateral thrust from the disclosed auxiliary rotor topology",
          provenance: "scenario-reader",
        },
        {
          label: "Net Unbalanced Yaw Moment",
          value: metrics.netYawMomentNm.toFixed(1),
          unit: "N·m",
          badgeColor: Math.abs(metrics.netYawMomentNm) < 20 ? "emerald" : "rose",
          description: "Modern-scenario residual yaw moment after auxiliary-rotor action",
          provenance: "scenario-reader",
        },
        {
          label: "Blade Tip Speed",
          value: metrics.tipSpeedMs.toFixed(1),
          unit: "m/s",
          badgeColor: "indigo",
          description: "Modern-scenario blade-tip speed; no rotor RPM is printed by the grant",
          provenance: "scenario-reader",
        },
        {
          label: "Main Rotor Power",
          value: (metrics.mainRotorPowerWatts / 1000.0).toFixed(1),
          unit: "kW",
          badgeColor: "purple",
          description: "Modern-scenario aerodynamic shaft power; historical power is refused",
          provenance: "scenario-reader",
        },
        {
          label: "Induced Downwash Velocity",
          value: metrics.inducedVelocityMs.toFixed(2),
          unit: "m/s",
          badgeColor: "indigo",
          description: "Modern-scenario Rankine-Froude downwash through the normalized rotor disk",
          provenance: "scenario-reader",
        },
        {
          label: "Correlated Engine Throttle",
          value: metrics.effectiveThrottlePercent.toFixed(1),
          unit: "%",
          badgeColor: "emerald",
          description:
            "Scenario value from the source-disclosed positive pitch-to-power linkage relationship",
          provenance: "scenario-reader",
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
        provenance: "scenario-modern",
      },
      {
        id: "flashDurationMs",
        label: "Flash Pulse Duration",
        min: 0.5,
        max: 3.0,
        step: 0.1,
        defaultValue: 1.0,
        unit: "ms",
        provenance: "scenario-modern",
      },
      {
        id: "rodLengthCm",
        label: "Ruby Rod Length",
        min: 2.0,
        max: 10.0,
        step: 0.5,
        defaultValue: 5.0,
        unit: "cm",
        provenance: "scenario-modern",
      },
      {
        id: "outputMirrorReflectivity",
        label: "Output Mirror Reflectivity",
        min: 0.7,
        max: 0.98,
        step: 0.01,
        defaultValue: 0.92,
        unit: "R",
        provenance: "scenario-modern",
      },
      {
        id: "crystalTemperatureKelvin",
        label: "Crystal Temperature",
        min: 100,
        max: 350,
        step: 10,
        defaultValue: 300,
        unit: "K",
        provenance: "scenario-modern",
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
          provenance: "scenario-modern",
        },
        {
          label: "Population Inversion (N2/N1)",
          value: res.populationInversionRatio.toFixed(2),
          unit: "ratio",
          badgeColor: res.populationInversionRatio > 1.0 ? "rose" : "amber",
          progressPct: clampProgress((res.populationInversionRatio / 2.5) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Threshold Pump Energy",
          value: res.thresholdPumpEnergyJoules.toFixed(1),
          unit: "J",
          badgeColor: "cyan",
          progressPct: clampProgress((res.thresholdPumpEnergyJoules / 2000) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Laser Output Pulse Energy",
          value: res.laserPulseEnergyJoules.toFixed(3),
          unit: "J",
          badgeColor: res.laserPulseEnergyJoules > 0 ? "emerald" : "indigo",
          progressPct: clampProgress((res.laserPulseEnergyJoules / 5.0) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Peak Optical Power",
          value: res.laserPeakPowerKw.toFixed(2),
          unit: "kW",
          badgeColor: res.laserPeakPowerKw > 0 ? "rose" : "indigo",
          progressPct: clampProgress((res.laserPeakPowerKw / 100) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Net Round-Trip Gain",
          value: res.netRoundTripGainDb.toFixed(2),
          unit: "dB",
          badgeColor: "indigo",
          progressPct: clampProgress(((res.netRoundTripGainDb + 5) / 15) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Emission Wavelength (R1)",
          value: res.emissionWavelengthNm.toFixed(2),
          unit: "nm",
          badgeColor: "rose",
          progressPct: 100,
          provenance: "source-disclosed",
        },
        {
          label: "Longitudinal Mode Spacing",
          value: res.modeSpacingGhz.toFixed(2),
          unit: "GHz",
          badgeColor: "cyan",
          progressPct: clampProgress((res.modeSpacingGhz / 5.0) * 100),
          provenance: "scenario-modern",
        },
      ];
    },
  },
  "us-2929922-townes-laser": {
    domain: "optics_waves",
    domainTitle: "Open-Resonator Maser Communications Topology",
    equationName: "Source Geometry & End-Assembly Reflectivity Bookkeeping",
    governingEquation:
      "\\frac{L}{D} = \\frac{10\\,\\mathrm{cm}}{1\\,\\mathrm{cm}} = 10 \\quad \\text{and} \\quad R_{\\mathrm{round\\ trip}} = R_1 R_2",
    engineMethod: "Source-Bounded TypeScript Topology Step (Quantitative Optical Output Refused)",
    pedagogicalInsight:
      "The patent is a connected communications system, not a lone modern laser tube: generator 10 feeds a focal-plane mode selector, modulated amplifier 12, and detector 13.",
    controls: [
      {
        id: "pumpExcitationPct",
        label: "Illustrative Pump Excitation",
        min: 0,
        max: 100,
        step: 5,
        defaultValue: TOWNES_MASER_DEFAULT_CONTROLS.pumpExcitationPct,
        unit: "%",
        provenance: "topology-normalized",
      },
      {
        id: "cavityLengthCm",
        label: "Chamber Length",
        min: 5,
        max: 20,
        step: 1,
        defaultValue: TOWNES_MASER_DEFAULT_CONTROLS.cavityLengthCm,
        unit: "cm",
        provenance: "scenario-reader",
        provenanceCitation: "US 2,929,922 describes chamber 14 as typically about 10 cm long.",
      },
      {
        id: "chamberDiameterCm",
        label: "Chamber Diameter",
        min: 0.5,
        max: 2,
        step: 0.1,
        defaultValue: TOWNES_MASER_DEFAULT_CONTROLS.chamberDiameterCm,
        unit: "cm",
        provenance: "scenario-reader",
        provenanceCitation: "US 2,929,922 describes chamber 14 as typically about 1 cm diameter.",
      },
      {
        id: "endReflectivityPct",
        label: "End Assembly Reflectivity",
        min: 90,
        max: 99,
        step: 1,
        defaultValue: TOWNES_MASER_DEFAULT_CONTROLS.endReflectivityPct,
        unit: "%",
        provenance: "scenario-reader",
        provenanceCitation: "US 2,929,922 gives a 97% reflective sapphire-and-gold example.",
      },
      {
        id: "modeApertureOpenPct",
        label: "Illustrative Mode Aperture",
        min: 0,
        max: 100,
        step: 5,
        defaultValue: TOWNES_MASER_DEFAULT_CONTROLS.modeApertureOpenPct,
        unit: "% open",
        provenance: "topology-normalized",
      },
      {
        id: "modulationFieldPct",
        label: "Illustrative Zeeman Field",
        min: 0,
        max: 100,
        step: 5,
        defaultValue: TOWNES_MASER_DEFAULT_CONTROLS.modulationFieldPct,
        unit: "%",
        provenance: "topology-normalized",
      },
    ],
    computeMetrics: (params) => {
      const res = stepTownesMaserTopology(readTownesMaserControls(params));

      return [
        {
          label: "Illustrative Pump Command",
          value: res.controls.pumpExcitationPct.toFixed(0),
          unit: "%",
          badgeColor: "cyan",
          primary: true,
          provenance: "topology-normalized",
        },
        {
          label: "Communications Path",
          value: res.signalPathComplete ? "connected" : "withheld",
          unit: "",
          badgeColor: "indigo",
          provenance: "refusal-bounded",
        },
        {
          label: "Chamber Aspect Ratio",
          value: String(res.chamberAspectRatio),
          unit: "L/D",
          badgeColor: "emerald",
          primary: true,
          provenance: "scenario-reader",
        },
        {
          label: "Round-Trip Reflectivity",
          value: `${(res.readerRoundTripReflectivityFraction * 100).toFixed(2)}%`,
          unit: "%",
          badgeColor: "amber",
          provenance: "scenario-reader",
        },
        {
          label: "Potassium Example Temperature",
          value: String(res.sourcePotassiumTemperatureK),
          unit: "K",
          badgeColor: "purple",
          provenance: "source-disclosed",
        },
        {
          label: "Quantitative Optical Output",
          value: "refused",
          unit: "",
          badgeColor: "rose",
          provenance: "refusal-bounded",
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
        provenance: "scenario-modern",
      },
      {
        id: "exposureLuxSec",
        label: "Optical Exposure",
        min: 0,
        max: 30,
        step: 1,
        defaultValue: 12,
        unit: "lx·s",
        provenance: "scenario-modern",
      },
      {
        id: "layerThicknessUm",
        label: "Photoreceptor Thickness",
        min: 10,
        max: 60,
        step: 5,
        defaultValue: 30,
        unit: "µm",
        provenance: "scenario-modern",
      },
      {
        id: "fuserTemperatureC",
        label: "Fuser Roll Temperature",
        min: 120,
        max: 220,
        step: 5,
        defaultValue: 185,
        unit: "°C",
        provenance: "scenario-modern",
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
          provenance: "scenario-modern",
        },
        {
          label: "Developed Optical Density",
          value: `${res.opticalDensity} OD`,
          unit: "OD",
          badgeColor: "cyan",
          primary: true,
          provenance: "scenario-modern",
        },
        {
          label: "Initial Surface Charge",
          value: `+${res.initialSurfacePotentialV} V`,
          unit: "V",
          badgeColor: "amber",
          provenance: "scenario-modern",
        },
        {
          label: "Toner Mass Density",
          value: `${res.tonerMassDensityMgPerCm2} mg/cm²`,
          unit: "mg/cm²",
          badgeColor: "purple",
          provenance: "scenario-modern",
        },
        {
          label: "Thermal Fusing Quality",
          value: `${res.fuserBondQualityPct}%`,
          unit: "%",
          badgeColor: "rose",
          provenance: "scenario-modern",
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
        provenance: "scenario-modern",
      },
      {
        id: "ballastResistanceOhms",
        label: "Series Ballast Resistance",
        min: 5,
        max: 50,
        step: 1,
        defaultValue: 12,
        unit: "Ω",
        provenance: "scenario-modern",
      },
      {
        id: "tubeLengthCm",
        label: "Arc Tube Length",
        min: 30,
        max: 150,
        step: 5,
        defaultValue: 100,
        unit: "cm",
        provenance: "scenario-modern",
      },
      {
        id: "tubeDiameterMm",
        label: "Tube Diameter",
        min: 15,
        max: 50,
        step: 5,
        defaultValue: 25,
        unit: "mm",
        provenance: "scenario-modern",
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
          provenance: "scenario-modern",
        },
        {
          label: "Luminous Efficacy",
          value: `${res.luminousEfficacyLmPerWatt} lm/W`,
          unit: "lm/W",
          badgeColor: "emerald",
          primary: true,
          provenance: "scenario-modern",
        },
        {
          label: "Arc Tube Voltage",
          value: `${res.arcOperatingVoltageV} V`,
          unit: "V",
          badgeColor: "amber",
          provenance: "scenario-modern",
        },
        {
          label: "Vapor Pressure",
          value: `${res.mercuryVaporPressureMmHg} mmHg`,
          unit: "mmHg",
          badgeColor: "purple",
          provenance: "scenario-modern",
        },
        {
          label: "Total Luminous Flux",
          value: `${res.luminousFluxLumens} lm`,
          unit: "lm",
          badgeColor: "cyan",
          provenance: "scenario-modern",
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
        provenance: "scenario-modern",
      },
      {
        id: "audioModulationPct",
        label: "Audio Modulation",
        min: 10,
        max: 100,
        step: 5,
        defaultValue: 65,
        unit: "%",
        provenance: "scenario-modern",
      },
      {
        id: "antennaTuningUh",
        label: "Antenna Tuning Inductance",
        min: 100,
        max: 1000,
        step: 25,
        defaultValue: 450,
        unit: "µH",
        provenance: "scenario-modern",
      },
      {
        id: "transmissionDistanceKm",
        label: "Transmission Distance",
        min: 5,
        max: 100,
        step: 5,
        defaultValue: 25,
        unit: "km",
        provenance: "scenario-modern",
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
          provenance: "scenario-modern",
        },
        {
          label: "Audio Signal Current",
          value: `${res.audioSignalCurrentMicroamps} µA`,
          unit: "µA",
          badgeColor: "emerald",
          primary: true,
          provenance: "scenario-modern",
        },
        {
          label: "Radiation Resistance",
          value: `${res.radiationResistanceOhms} Ω`,
          unit: "Ω",
          badgeColor: "amber",
          provenance: "scenario-modern",
        },
        {
          label: "Signal-to-Noise Ratio",
          value: `${res.audioSnrDb} dB`,
          unit: "dB",
          badgeColor: "purple",
          provenance: "scenario-modern",
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
        claim1GridPresent: (params.claim1GridPresent ?? 1) >= 0.5,
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
    engineMethod:
      "Phenol-Formaldehyde Thermal Polycondensation Kinetics (Modern Illustrative Scenario)",
    pedagogicalInsight:
      "US 942,699 specifies reacting a phenolic body with formaldehyde, separating water, and heating in a closed vessel under pressure (110–140 °C) to prevent vapor foaming; apparatus names like 'Bakelizer' and numerical kinetics/strength values are modern chemical interpretations.",
    controls: [
      {
        id: "curingTempC",
        label: "Curing Temperature",
        min: 100,
        max: 200,
        step: 5,
        defaultValue: 130,
        unit: "°C",
        provenance: "source-disclosed",
      },
      {
        id: "autoclavePressurePsi",
        label: "Illustrative Autoclave Pressure",
        min: 20,
        max: 200,
        step: 5,
        defaultValue: 100,
        unit: "psi",
        provenance: "scenario-modern",
      },
      {
        id: "catalystPct",
        label: "Illustrative Condensing Agent Dose",
        min: 0.5,
        max: 5.0,
        step: 0.5,
        defaultValue: 2.0,
        unit: "%",
        provenance: "scenario-modern",
      },
      {
        id: "curingTimeMin",
        label: "Illustrative Curing Duration",
        min: 10,
        max: 120,
        step: 5,
        defaultValue: 45,
        unit: "min",
        provenance: "scenario-modern",
      },
    ],
    computeMetrics: (params) => {
      const curingTemp = params.curingTempC ?? 130;
      const res = stepBaekelandBakelite(
        curingTemp,
        params.autoclavePressurePsi ?? 100,
        params.catalystPct ?? 2.0,
        params.curingTimeMin ?? 45,
      );

      return [
        {
          label: "Temperature Operating State",
          value:
            curingTemp >= 110 && curingTemp <= 140
              ? "PRINTED RANGE (110–140 °C)"
              : "OUTSIDE PRINTED RANGE",
          unit: "regime",
          badgeColor: curingTemp >= 110 && curingTemp <= 140 ? "emerald" : "amber",
          primary: true,
          provenance: "source-disclosed",
        },
        {
          label: "Polymer State",
          value: res.resinStage,
          unit: "",
          badgeColor: "emerald",
          provenance: "scenario-modern",
        },
        {
          label: "Crosslink Conversion",
          value: `${Math.round(res.conversionP * 100)}%`,
          unit: "%",
          badgeColor: "cyan",
          provenance: "scenario-modern",
        },
        {
          label: "Tensile Strength",
          value: `${res.tensileStrengthMpa} MPa`,
          unit: "MPa",
          badgeColor: "amber",
          provenance: "scenario-modern",
        },
        {
          label: "Dielectric Strength",
          value: `${res.dielectricBreakdownKvPerMm} kV/mm`,
          unit: "kV/mm",
          badgeColor: "purple",
          provenance: "scenario-modern",
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
  // Source-bounded Figure 3/Figures 7–8 reader. The normalized absorber
  // position is pedagogical and explicitly does not claim reactor calibration.
  "_legacy-unpublished-us-2708656-fermi-reactor": {
    domain: "nuclear_kinetics",
    domainTitle: "Graphite–Natural-Uranium Lattice & Source-Bounded Criticality",
    equationName: "Patent Reproduction Constant Factors",
    governingEquation: "K \\propto p f \\varepsilon \\quad ; \\quad K_{\\text{finite}} = 1",
    engineMethod:
      "stepFermiKinetics (host source reader plus normalized absorber lens; quantitative neutronics refused)",
    controls: [
      {
        id: "rodWithdrawal",
        label: "Normalized Absorber Withdrawal",
        min: 0,
        max: 100,
        step: 0.5,
        defaultValue: 83.5,
        unit: "%",
        provenance: "topology-normalized",
      },
      {
        id: "moderatorPurity",
        label: "Declared Graphite Purity",
        min: 95,
        max: 100,
        step: 0.5,
        defaultValue: 99.5,
        unit: "%",
        provenance: "scenario-modern",
      },
      {
        id: "claim1Active",
        label: "Claim 1 Uranium-Rod Lattice",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "topology",
        provenance: "source-disclosed",
      },
    ],
    computeMetrics: (p) => {
      const rod = p.rodWithdrawal ?? 83.5;
      const mod = p.moderatorPurity ?? 99.5;
      const claim1Active = (p.claim1Active ?? 1) >= 0.5;
      const kinetics = stepFermiKinetics(rod, mod, NATURAL_URANIUM_U235_PERCENT, claim1Active);
      const keff = kinetics.kEffective;

      return [
        {
          label: "Claim 1 lattice",
          value: claim1Active ? "present" : "removed",
          unit: "graphite + natural-U rods",
          badgeColor: claim1Active ? "emerald" : "rose",
          progressPct: claim1Active ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Figure 3 geometry",
          value: claim1Active ? "included" : "not established",
          unit: "K = 1 contour condition",
          badgeColor: claim1Active ? "emerald" : "rose",
          progressPct: claim1Active ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Natural uranium",
          value: NATURAL_URANIUM_U235_PERCENT.toFixed(2),
          unit: "% U-235 reference",
          badgeColor: "amber",
          progressPct: 72,
          provenance: "scenario-modern",
        },
        {
          label: "Normalized k_eff lens",
          value: claim1Active ? keff.toFixed(4) : "refused",
          unit: "not source-calibrated",
          badgeColor: !claim1Active ? "rose" : keff >= 0.998 ? "emerald" : "amber",
          progressPct: claim1Active ? clampProgress((keff / 1.01) * 100) : 0,
          provenance: "topology-normalized",
        },
        {
          label: "Quantitative transient",
          value: "refused",
          unit: "source boundary",
          badgeColor: "amber",
          progressPct: 0,
          provenance: "scenario-modern",
        },
        {
          label: "Declared graphite purity input",
          value: kinetics.moderatorPurityPercent.toFixed(1),
          unit: "% · no calibrated k_eff effect",
          badgeColor: "cyan",
          progressPct: kinetics.moderatorPurityPercent,
          provenance: "scenario-modern",
        },
      ];
    },
    pedagogicalInsight:
      "Claim 1 is the graphite moderator plus geometrically spaced natural-uranium rods whose size and moderator-to-uranium volume ratio lie inside Figure 3's K = 1 contour, with sufficient purity and mass. The absorber travel is a normalized teaching control because the grant does not publish a travel-to-worth calibration.",
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
        provenance: "source-disclosed",
      },
      {
        id: "primarySpinRpm",
        label: "Declared Primary Spin",
        min: 0,
        max: 300,
        step: 5,
        defaultValue: 120,
        unit: "rpm",
        provenance: "scenario-modern",
      },
      {
        id: "gyroSpinRpm",
        label: "Declared Gyroscope Spin",
        min: 0,
        max: 12_000,
        step: 250,
        defaultValue: 6_000,
        unit: "rpm",
        provenance: "scenario-modern",
      },
      {
        id: "auxiliaryReleaseFraction",
        label: "Auxiliary Release from Tube 24",
        min: 0,
        max: 1,
        step: 0.02,
        defaultValue: 0,
        unit: "fraction",
        provenance: "topology-normalized",
      },
      {
        id: "primaryChargeConsumed",
        label: "Primary Charge Substantially Consumed",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        unit: "state",
        provenance: "source-disclosed",
      },
      {
        id: "gyroEnabled",
        label: "Claim 7 Gyroscope Present",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "state",
        provenance: "source-disclosed",
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
          provenance: "source-disclosed",
        },
        {
          label: "Claim 1 Firing Sequence",
          value: result.claim1SequenceSatisfied ? "ordered" : "premature",
          unit: result.auxiliaryNested ? "nested" : "released",
          badgeColor: result.claim1SequenceSatisfied ? "emerald" : "rose",
          progressPct: result.claim1SequenceSatisfied ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Primary Angular Velocity",
          value: result.primaryAngularVelocityRadPerSec.toFixed(2),
          unit: "rad/s",
          badgeColor: "amber",
          progressPct: clampProgress(((p.primarySpinRpm ?? 120) / 300) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Gyroscope Angular Velocity",
          value: result.gyroAngularVelocityRadPerSec.toFixed(1),
          unit: "rad/s",
          badgeColor: "purple",
          progressPct: clampProgress(((p.gyroSpinRpm ?? 6_000) / 12_000) * 100),
          provenance: "scenario-modern",
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
          provenance: "scenario-modern",
        },
      ];
    },
    pedagogicalInsight:
      "The 1914 grant is a solid-charge staged apparatus: frame bearings permit pre-launch spin, an auxiliary rocket remains nested until the main charge is substantially consumed, and a gyroscope ideally prevents the camera support from sharing the rotating head's world rate. RPM values are declared teaching inputs because the source prints no numerical speeds.",
  },
  "us-2524035-bardeen-transistor": {
    domain: "semiconductor_carrier",
    domainTitle: "Source-Reported Point-Contact Amplifier Operating Samples",
    equationName: "Reported Small-Signal Voltage and Power Gain",
    governingEquation:
      "A_v = \\frac{V_{\\text{out}}}{V_{\\text{in}}}, \\qquad G_P = \\frac{P_{\\text{out}}}{P_{\\text{in}}}",
    engineMethod:
      "Source-bounded TypeScript Table I reader; quantitative carrier transport refused",
    provenance: "source-disclosed",
    controls: [
      {
        id: "operatingSample",
        label: "Reported Table I Sample",
        min: 1,
        max: 3,
        step: 1,
        defaultValue: 1,
        unit: "sample",
        provenance: "scenario-reader",
      },
      {
        id: "pointSpacingMils",
        label: "Preferred Contact Spacing",
        min: 1,
        max: 10,
        step: 0.5,
        defaultValue: 2,
        unit: "mils",
        provenance: "scenario-reader",
      },
      {
        id: "claim1Active",
        label: "Claim 1 Contact Path",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "on/off",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics: (p) => {
      const state = stepBardeenPointContact({
        operatingSample: p.operatingSample,
        pointSpacingMils: p.pointSpacingMils,
        claim1Active: (p.claim1Active ?? 1) >= 0.5,
      });

      return [
        {
          label: "Reported Voltage Gain",
          value: state.sample.voltageGainFactor.toFixed(0),
          unit: "×",
          badgeColor: "emerald",
          progressPct: clampProgress((state.sample.voltageGainFactor / 62) * 100),
          provenance: "source-disclosed",
        },
        {
          label: "Reported Power Gain",
          value: state.sample.powerGainFactor.toFixed(0),
          unit: "×",
          badgeColor: "indigo",
          progressPct: clampProgress((state.sample.powerGainFactor / 80) * 100),
          provenance: "source-disclosed",
        },
        {
          label: "Selected Contact Gap",
          value: state.pointSpacingMicrometers.toFixed(1),
          unit: "µm",
          badgeColor: "purple",
          progressPct: clampProgress((state.pointSpacingMils / 10) * 100),
          provenance: "scenario-reader",
        },
        {
          label: "Claim 1 Contact Path",
          value: state.collectorCollectionActive ? "complete" : "removed",
          unit: "",
          badgeColor: state.collectorCollectionActive ? "cyan" : "rose",
          progressPct: state.collectorCollectionActive ? 100 : 0,
          provenance: "scenario-reader",
        },
      ];
    },
    pedagogicalInsight:
      "US 2,524,035 reports three amplifier operating samples and a preferred 1–10 mil spacing between emitter and collector contacts. It explains minority-carrier injection and collection, but does not report mobility, lifetime, transit time, or the complete DC supply power needed for a quantitative transport or energy model.",
  },
  "us-1781541-einstein-refrigerator": {
    domain: "thermodynamics_transport",
    domainTitle: "Dalton Partial Pressure Absorption Cycle & Bubble Pump",
    equationName: "Dalton Evaporative Vaporization & COP",
    governingEquation:
      "P_{\\text{total}} = P_{\\text{NH}_3} + P_{\\text{butane}} + P_{\\text{H}_2\\text{O}} \\quad \\text{and} \\quad \\text{COP} = \\frac{Q_{\\text{evap}}}{Q_{\\text{heat}}}",
    engineMethod: "stepEinsteinRefrigerator (declared illustrative scenario)",
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
        claim1LiftPathPresent: p.claim1LiftPathPresent,
      });
      const evapTemp = frige.evapTempC;
      const cop = frige.cop;
      const coolingWatts = frige.coolingWatts;
      const press = frige.pressureAtm;

      return [
        {
          label: "Evaporator Temp",
          value: frige.operating ? evapTemp.toFixed(1) : "withheld",
          unit: frige.operating ? "°C" : "",
          badgeColor: frige.operating ? (evapTemp < 0 ? "cyan" : "amber") : "rose",
          progressPct: Math.min(100, Math.max(0, (30 - evapTemp) * 2)),
          provenance: "scenario-modern",
        },
        {
          label: "Cooling Power (Qc)",
          value: frige.operating ? coolingWatts.toString() : "refused",
          unit: frige.operating ? "W" : "",
          badgeColor: frige.operating ? "emerald" : "rose",
          progressPct: Math.min(100, (coolingWatts / 120) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Thermodynamic COP",
          value: frige.operating ? cop.toFixed(2) : "refused",
          unit: frige.operating ? "ratio" : "",
          badgeColor: frige.operating ? "indigo" : "rose",
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
    governingEquation: "\\lambda \\lesssim 10\\ \\text{cm}, \\quad c = \\lambda f",
    engineMethod: "stepSpencerMicrowaveSource (source topology + exact c = lambda f reference)",
    controls: [
      {
        id: "rfPowerSetting",
        label: "Source-Path Highlight",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "on/off",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics: (p) => {
      const source = stepSpencerMicrowaveSource(p);

      return [
        {
          label: "Energy Path",
          value: source.energyPathActive ? "active" : "disabled",
          unit: "",
          badgeColor: "cyan",
          progressPct: source.energyPathActive ? 100 : 0,
          provenance: "scenario-reader",
        },
        {
          label: "Wavelength Region",
          value: "about 10 cm or less",
          unit: "source text",
          badgeColor: "emerald",
          progressPct: 100,
          provenance: "source-disclosed",
          provenanceCitation: "US 2,495,429 specification and Claims 4–6",
        },
        {
          label: "Vacuum f at 10 cm",
          value: (source.vacuumFrequencyAtTenCentimetersHz / 1e9).toFixed(3),
          unit: "GHz",
          badgeColor: "purple",
          progressPct: 100,
          provenance: "source-derived",
          provenanceCitation:
            "Derived from the printed ten-centimetre reference using c = lambda f",
        },
        {
          label: "Printed Path",
          value: "10/11 → 24/25 → 23 → 28",
          unit: "source numerals",
          badgeColor: "amber",
          progressPct: 100,
          provenance: "source-disclosed",
        },
        {
          label: "Tube & Cooking SI",
          value: "refused",
          unit: "missing source card",
          badgeColor: "rose",
          progressPct: 0,
          provenance: "refusal-bounded",
          provenanceCitation:
            "US 2,495,429 does not print the parameter card needed for quantitative tube or cooking performance.",
        },
      ];
    },
    pedagogicalInsight:
      "The patent drawing shows two magnetron oscillators, 10 and 11, coupled through coaxial lines 24 and 25 and loops 26 and 27 into common wave guide 23, with food carried transversely by conveyor 28. The grant does not state an operating power, tube voltage, magnetic field, cavity count, or household-oven geometry.",
  },
  "us-2981877-noyce-ic": {
    domain: "semiconductor_carrier",
    domainTitle: "Oxide-Insulated Planar Junction Lead Topology",
    equationName: "Source-Described Insulating Lead Bridge",
    governingEquation:
      "\\text{metal lead} \\;|\\; \\text{retained oxide} \\;|\\; \\text{surface-reaching P-N junction}",
    engineMethod: "Source-Bounded TypeScript Topology Step (Electrical Performance Refused)",
    controls: [
      {
        id: "oxideThicknessUm",
        label: "Oxide Thickness",
        min: 0.5,
        max: 2,
        step: 0.1,
        defaultValue: NOYCE_PLANAR_LEAD_DEFAULT_CONTROLS.oxideThicknessUm,
        unit: "µm",
        provenance: "scenario-reader",
        provenanceCitation:
          "US 2,981,877 describes oxide often one micron or more and elsewhere one to two microns.",
      },
      {
        id: "leadStripWidthFraction",
        label: "Lead Width / Contact Span",
        min: 0.08,
        max: 0.28,
        step: 0.01,
        defaultValue: NOYCE_PLANAR_LEAD_DEFAULT_CONTROLS.leadStripWidthFraction,
        unit: "fraction",
        provenance: "topology-normalized",
      },
    ],
    computeMetrics: (p) => {
      const ic = stepNoycePlanarLeadTopology(readNoycePlanarLeadControls(p));

      return [
        {
          label: "Oxide Thickness",
          value: ic.controls.oxideThicknessUm.toFixed(1),
          unit: "µm",
          badgeColor: "cyan",
          primary: true,
          provenance: "scenario-reader",
        },
        {
          label: "Lead Route",
          value: ic.controls.leadStripWidthFraction.toFixed(2),
          unit: "contact span",
          badgeColor: "amber",
          provenance: "topology-normalized",
        },
        {
          label: "Claim 1 Crossing",
          value: ic.claim1TopologyComplete ? "oxide-supported" : "withheld",
          unit: "",
          badgeColor: "emerald",
          provenance: "refusal-bounded",
        },
        {
          label: "Electrical Performance",
          value: "refused",
          unit: "",
          badgeColor: "rose",
          provenance: "refusal-bounded",
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
    refreshFromRuntimeTape: true,
    resetRuntimeTape: resetMarconiTape,
    domain: "electromagnetics_flux",
    domainTitle: "Source-Bounded Wireless Receiver Contact and Automatic Reset",
    equationName: "Claim 1 Receiver Contact, Local Circuit, and Shaking Sequence",
    governingEquation:
      "\\text{received oscillation} \\rightarrow \\text{imperfect contact conducts} \\rightarrow \\text{local circuit acts} \\rightarrow \\text{shaking means resets contact}",
    engineMethod:
      "createMarconiTransportUpdater (source-bounded fixed-step causal tape; quantitative RF link budget withheld)",
    controls: [
      {
        id: "sparkVoltage",
        label: "Induction Coil Voltage",
        min: 5,
        max: 50,
        step: 1,
        defaultValue: 28,
        unit: "kV",
        provenance: "scenario-reader",
        provenanceCitation:
          "Illustrative apparatus control; US 586,193 supplies no transmitter voltage for a quantitative RF solution.",
      },
      {
        id: "aerialHeight",
        label: "Vertical Aerial Height",
        min: 10,
        max: 120,
        step: 2,
        defaultValue: 88,
        unit: "m",
        provenance: "scenario-reader",
        provenanceCitation:
          "Illustrative display dimension; US 586,193 describes elevated conductors but prints no mast height for this apparatus.",
      },
      {
        id: "sparkGapMm",
        label: "Spark Gap Distance",
        min: 2,
        max: 25,
        step: 1,
        defaultValue: 10,
        unit: "mm",
        provenance: "scenario-reader",
        provenanceCitation:
          "Illustrative geometry control; US 586,193 does not print this spark-gap spacing.",
      },
    ],
    computeMetrics: (p) => {
      const tape = readMarconiTapeFrame(readMarconiRuntimeControls(p));

      return [
        {
          label: "Illustrative Apparatus Inputs",
          value: `${tape.controls.inductionCoilKv} kV · ${tape.controls.aerialHeightMeters} m · ${tape.controls.sparkGapMm} mm`,
          unit: "reader controls",
          badgeColor: "purple",
          progressPct: clampProgress((tape.controls.inductionCoilKv / 50) * 100),
          provenance: "scenario-reader",
          provenanceCitation:
            "Reader-selected display inputs only; US 586,193 supplies none of them as a basis for a quantitative RF link budget.",
        },
        {
          label: "Receiver Sequence",
          value: tape.receiverStage.replaceAll("-", " "),
          unit: "state",
          badgeColor: "cyan",
          progressPct: tape.pulseAgeSec === null ? 0 : clampProgress(tape.wavefrontProgress * 100),
          provenance: "topology-normalized",
          provenanceCitation:
            "The order follows Claim 1's contact, circuit, and shaking means; display timing is normalized and is not a patent measurement.",
        },
        {
          label: "Imperfect Contact",
          value: tape.receiverConducting ? "conducting" : "open",
          unit: "contact state",
          badgeColor: "amber",
          progressPct: tape.receiverConducting ? 100 : 0,
          provenance: "topology-normalized",
          provenanceCitation:
            "Claim 1 names the imperfect contact in the receiver but gives no threshold or resistance for a numerical contact model.",
        },
        {
          label: "Sensitive-Tube Current Limit",
          value: "≤1",
          unit: "mA",
          badgeColor: "emerald",
          progressPct: 100,
          provenance: "source-disclosed",
          provenanceCitation:
            "US 586,193 advises allowing no more than one milliampere through a well-made sensitive tube while active.",
        },
        {
          label: "Single-Cell EMF Limit",
          value: "≤1.5",
          unit: "V",
          badgeColor: "indigo",
          progressPct: 100,
          provenance: "source-disclosed",
          provenanceCitation:
            "US 586,193 warns that more than 1.5 volts from a Leclanché cell may pass current with no transmitted oscillation.",
        },
      ];
    },
    pedagogicalInsight:
      "The source-backed mechanism is a complete causal chain: received oscillations change an imperfect contact, the resulting local-circuit current operates the signal apparatus, and a circuit-actuated shaker restores the contact for the next signal. The grant does not provide a quantitative RF link budget.",
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
        provenance: "scenario-modern",
      },
      {
        id: "polymerConcentrationPct",
        label: "Polymer Concentration",
        min: 5.0,
        max: 25.0,
        step: 0.5,
        defaultValue: 18.5,
        unit: "wt%",
        provenance: "scenario-modern",
      },
      {
        id: "temperatureCelsius",
        label: "Dope Temperature",
        min: 20,
        max: 120,
        step: 1,
        defaultValue: 85,
        unit: "°C",
        provenance: "scenario-modern",
      },
      {
        id: "showHydrogenBonds",
        label: "Show H-Bonds",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "",
        provenance: "topology-normalized",
      },
      {
        id: "isImpactTesting",
        label: "Trigger Impact Test",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        unit: "trigger",
        provenance: "scenario-modern",
      },
      {
        id: "impactVelocity",
        label: "Projectile Impact Velocity",
        min: 150,
        max: 900,
        step: 25,
        defaultValue: 450,
        unit: "m/s",
        provenance: "scenario-modern",
      },
      {
        id: "appliedTension",
        label: "Applied Tensile Strain",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 30,
        unit: "%",
        provenance: "scenario-modern",
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
          provenance: "scenario-modern",
        },
        {
          label: "Sonic Shock Velocity",
          value: vSonic.toLocaleString(),
          unit: "m/s",
          badgeColor: "emerald",
          progressPct: clampProgress((vSonic / 12000) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Tensile Stress",
          value: stressMpa.toLocaleString(),
          unit: "MPa",
          badgeColor: stressMpa < 3600 ? "indigo" : "rose",
          progressPct: clampProgress((stressMpa / 4000) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Elastic Strain",
          value: strainPct,
          unit: "%",
          badgeColor: Number(strainPct) < 3.5 ? "amber" : "rose",
          progressPct: clampProgress((Number(strainPct) / 4.0) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Fiber Strength",
          value: `${kevlar.tensileStrengthGpa} GPa`,
          unit: "σ_ult",
          badgeColor: "emerald",
          progressPct: clampProgress((kevlar.tensileStrengthGpa / 3.6) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Residual Strength",
          value: `${kevlar.residualStrengthGpa} GPa`,
          unit: "σ_res",
          badgeColor: kevlar.residualStrengthGpa < 1.6 ? "rose" : "emerald",
          progressPct: clampProgress((kevlar.residualStrengthGpa / 3.6) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Chain Alignment",
          value: `${kevlar.alignmentPct}%`,
          unit: "align",
          badgeColor: "purple",
          progressPct: clampProgress(kevlar.alignmentPct),
          provenance: "scenario-modern",
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
        provenance: "scenario-reader",
      },
      {
        id: "initialBrixDeg",
        label: "Initial Juice Concentration",
        min: 10,
        max: 20,
        step: 0.5,
        defaultValue: 14,
        unit: "°Bx",
        provenance: "scenario-reader",
      },
      {
        id: "targetBrixDeg",
        label: "Target Syrup Concentration",
        min: 50,
        max: 75,
        step: 1,
        defaultValue: 65,
        unit: "°Bx",
        provenance: "scenario-reader",
      },
      {
        id: "numberOfEffects",
        label: "Evaporator Effects in Series",
        min: 2,
        max: 4,
        step: 1,
        defaultValue: 3,
        unit: "effects",
        provenance: "scenario-reader",
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
          provenance: "scenario-modern",
        },
        {
          label: "Total Water Evaporated",
          value: `${(rill.totalEvaporationKgPerH / 1000).toFixed(2)} t/h`,
          unit: "m_evap",
          badgeColor: "cyan",
          progressPct: clampProgress((rill.totalEvaporationKgPerH / 20000) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Primary Steam Needed",
          value: `${(rill.primarySteamConsumptionKgPerH / 1000).toFixed(2)} t/h`,
          unit: "m_steam",
          badgeColor: "amber",
          progressPct: clampProgress((rill.primarySteamConsumptionKgPerH / 10000) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Fuel Consumption Savings",
          value: `${rill.fuelSavingsPct.toFixed(1)}%`,
          unit: "Savings",
          badgeColor: "emerald",
          progressPct: clampProgress(rill.fuelSavingsPct),
          provenance: "scenario-modern",
        },
        {
          label: "Concentrated Syrup Output",
          value: `${(rill.syrupOutputRateKgPerH / 1000).toFixed(2)} t/h`,
          unit: "m_syrup",
          badgeColor: "indigo",
          progressPct: clampProgress((rill.syrupOutputRateKgPerH / 5000) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Thermal Cascading Efficiency",
          value: `${rill.thermalEfficiencyPct.toFixed(1)}%`,
          unit: "eta_th",
          badgeColor: "purple",
          progressPct: clampProgress(rill.thermalEfficiencyPct),
          provenance: "scenario-modern",
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
          label: "Cure Rate (Modern Model)",
          value: rubber.rateRel.toFixed(2),
          unit: "× 145 °C / 8% S baseline",
          badgeColor: "amber",
          progressPct: clampProgress((rubber.rateRel / 2) * 100),
          provenance: "scenario-modern",
          provenanceCitation:
            "Illustrative Arrhenius-shaped sulfur-cure response normalized at 145 °C and 8% sulfur; not a value printed in US 3,633.",
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
    refreshFromRuntimeTape: true,
    resetRuntimeTape: resetLamarrTape,
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
        provenance: "source-disclosed",
      },
      {
        id: "commandTone",
        label: "Command tone (100 or 500 cycles)",
        min: 100,
        max: 500,
        step: 400,
        defaultValue: 100,
        unit: "cycles",
        provenance: "source-disclosed",
      },
    ],
    computeMetrics: (p) => {
      const state = stepLamarrRecordControl(p);
      const tone = String(state.commandTone);

      return [
        {
          label: "Transmitter record row",
          value: state.transmitterRow,
          unit: "A–G",
          badgeColor: "indigo",
          progressPct: clampProgress((state.recordPosition / 6) * 100),
          provenance: "source-disclosed",
        },
        {
          label: "Receiver match",
          value: !state.recordSynchronizationPresent
            ? "withheld"
            : state.receiverEffective
              ? "D–G"
              : "A–C false",
          unit: "channels",
          badgeColor: state.recordSynchronizationPresent ? "emerald" : "rose",
          progressPct: state.receiverEffective ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Command label",
          value: tone,
          unit: "cycles",
          badgeColor: "cyan",
          progressPct: tone === "500" ? 100 : 20,
          provenance: "source-disclosed",
        },
        {
          label: "Warning lamp 43",
          value: state.warningLampOn ? "on" : "off",
          unit: "row H",
          badgeColor: "amber",
          progressPct: state.warningLampOn ? 100 : 0,
          provenance: "source-disclosed",
        },
      ];
    },
    pedagogicalInsight:
      "The illustrated apparatus advances matched perforated records together. Rows A–G select seven transmitter tuning positions, while the receiver is effective on D–G and deliberately ineffective on A–C; a 100-cycle or 500-cycle command then advances the rudder by one discrete step.",
  },
  "_legacy-unpublished-us-3541541-engelbart-mouse": {
    domain: "mechanical_kinematics",
    domainTitle: "Orthogonal Position-Wheel Kinematics & Source-Bounded Transduction",
    equationName: "Dual Position-Wheel Orthogonal Coordinate Integration",
    governingEquation:
      "\\Delta X = R \\cdot \\Delta \\theta_x \\quad \\text{and} \\quad \\Delta Y = R \\cdot \\Delta \\theta_y \\quad (\\vec{v}_x \\perp \\vec{v}_y)",
    engineMethod: "HostKernel.stepEngelbartMouse (compiled rolling-contact WASM unavailable)",
    controls: [
      {
        id: "mouseSpeed",
        label: "Manual Tracking Speed",
        min: 100,
        max: 800,
        step: 25,
        defaultValue: 350,
        unit: "mm/s",
        provenance: "scenario-modern",
      },
      {
        id: "wheelRadius",
        label: "Illustrative Position-Wheel Radius",
        min: 6,
        max: 18,
        step: 0.5,
        defaultValue: 10.0,
        unit: "mm",
        provenance: "scenario-modern",
      },
      {
        id: "pulsesPerRev",
        label: "Illustrative Incremental-Encoder Pulses per Revolution",
        min: 20,
        max: 400,
        step: 4,
        defaultValue: 200,
        unit: "ppr",
        provenance: "scenario-modern",
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
          label: "Alternative Encoder Resolution",
          value: dpi.toString(),
          unit: "CPI",
          badgeColor: "cyan",
          progressPct: clampProgress((dpi / 350) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Wheel Angular Velocity",
          value: omegaRps,
          unit: "rad/s",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(omegaRps) / 80) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Claim 1 Coordinate Channels",
          value: `${p.orthogonalAxes ?? 2}/2`,
          unit: "axes",
          badgeColor: (p.orthogonalAxes ?? 2) >= 2 ? "indigo" : "rose",
          progressPct: clampProgress(((p.orthogonalAxes ?? 2) / 2) * 100),
          provenance: "source-disclosed",
        },
        {
          label: "Alternative Encoder Pulse Rate",
          value: mouse.pulseRateHz.toString(),
          unit: "counts/s",
          badgeColor: "purple",
          progressPct: clampProgress((mouse.pulseRateHz / 5000) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Pulse Pitch",
          value: `${mouse.mmPerPulse} mm`,
          unit: "Δx",
          badgeColor: "amber",
          progressPct: clampProgress(100),
          provenance: "scenario-modern",
        },
        {
          label: "Counts / mm",
          value: String(mouse.countsPerMm),
          unit: "1/mm",
          badgeColor: "indigo",
          progressPct: Math.min(100, (mouse.countsPerMm / 10) * 100),
          provenance: "scenario-modern",
        },
      ];
    },
    pedagogicalInsight:
      "The preferred embodiment rests on two perpendicular position wheels plus ball-bearing support 54. Each wheel turns a multiturn potentiometer; the grant separately discloses shaft-encoder and incremental-encoder alternatives but prints no wheel dimensions, voltage, resolution, friction, mass, or power datum.",
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
    refreshFromRuntimeTape: true,
    resetRuntimeTape: resetFarnsworthTvTape,
    domain: "semiconductor_carrier",
    domainTitle: "Relativistic Photo-Cathode Lorentz Deflection Dissector Tube",
    equationName: "Lorentz Force Magnetic Scanline Deflection",
    governingEquation:
      "\\vec{F} = -e (\\vec{E} + \\vec{v} \\times \\vec{B}) \\quad \\text{and} \\quad r = \\frac{m_e v}{e B}",
    engineMethod: "createFarnsworthTvTransportUpdater → FrankenSimEngine.stepFarnsworthTv",
    controls: [
      {
        id: "anodeVoltage",
        label: "Anode Accelerating Potential",
        min: 600,
        max: 6000,
        step: 50,
        defaultValue: 1500,
        unit: "V",
        provenance: "scenario-modern",
      },
      {
        id: "coilCurrent",
        label: "Deflection Coils Current",
        min: 0.1,
        max: 0.8,
        step: 0.02,
        defaultValue: 0.42,
        unit: "A",
        provenance: "scenario-modern",
      },
      {
        id: "lightIntensityLux",
        label: "Subject Light Intensity",
        min: 100,
        max: 2000,
        step: 50,
        defaultValue: 500,
        unit: "Lux",
        provenance: "scenario-modern",
      },
      {
        id: "horizontalFreqKhz",
        label: "Horizontal Sweep Rate",
        min: 5,
        max: 30,
        step: 0.25,
        defaultValue: 15.75,
        unit: "kHz",
        provenance: "scenario-modern",
      },
      {
        id: "verticalFreqHz",
        label: "Vertical Sweep Rate",
        min: 30,
        max: 120,
        step: 1,
        defaultValue: 60,
        unit: "Hz",
        provenance: "scenario-modern",
      },
      {
        id: "scanLines",
        label: "Raster Scan Lines",
        min: 30,
        max: 240,
        step: 10,
        defaultValue: 60,
        unit: "Lines",
        provenance: "scenario-modern",
      },
    ],
    computeMetrics: (p) => {
      const controls = readFarnsworthTvControls(p as any);
      const beam = readFarnsworthTvTapeFrame(controls).beamState;
      const hFreq = controls.horizontalFreqKhz;
      const vFreq = controls.verticalFreqHz;
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
          provenance: "scenario-modern",
        },
        {
          label: "Gyro Radius",
          value: beam.gyroRadiusMm.toFixed(1),
          unit: "mm",
          badgeColor: "emerald",
          progressPct: Math.min(100, (beam.gyroRadiusMm / 40) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Derived Raster Lines",
          value: derivedScanLines.toString(),
          unit: "lines",
          badgeColor: "indigo",
          progressPct: clampProgress((derivedScanLines / 600) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Photocathode Current",
          value: photoUa,
          unit: "µA",
          badgeColor: "purple",
          progressPct: Math.min(100, (Number(photoUa) / 90) * 100),
          provenance: "scenario-modern",
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
        provenance: "scenario-reader",
      },
      {
        id: "stitchPitchMm",
        label: "Declared Display Pitch",
        min: 1.0,
        max: 6.0,
        step: 0.1,
        defaultValue: 3.5,
        unit: "mm",
        provenance: "scenario-reader",
      },
      {
        id: "loopSlackPct",
        label: "Displayed Loop Slack",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 65,
        unit: "%",
        provenance: "scenario-reader",
      },
      {
        id: "isCranking",
        label: "Crank Motion",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "",
        provenance: "scenario-reader",
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
          provenance: "scenario-modern",
        },
        {
          label: "Display Shuttle Cycles",
          value: shuttleHz,
          unit: "Hz",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(shuttleHz) / 6) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Display Cloth Feed",
          value: `${sew.clothFeedMmPerS} mm/s`,
          unit: "v_feed",
          badgeColor: "amber",
          progressPct: clampProgress((sew.clothFeedMmPerS / 20) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Display Crank ω",
          value: `${sew.crankOmegaDegPerS}`,
          unit: "deg/s",
          badgeColor: "purple",
          progressPct: Math.min(100, (sew.crankOmegaDegPerS / 2160) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Display Stitch Pitch",
          value: stitchLen,
          unit: "mm",
          badgeColor: "amber",
          progressPct: clampProgress((Number(stitchLen) / 5) * 100),
          provenance: "scenario-reader",
        },
        {
          label: "Loop Clearance",
          value: sew.maximumLoopClearancePct.toString(),
          unit: "%",
          badgeColor: "indigo",
          progressPct: clampProgress(loopSlackPct),
          provenance: "scenario-reader",
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
    domain: "multibody_topology",
    domainTitle: "Source-Ordered Locking, Ratchet, and Cylinder Turning",
    equationName: "Unlock → Ratchet Advance → Lockup",
    governingEquation:
      "p \\uparrow \\Rightarrow r\\;\\text{withdraws} \\Rightarrow d \\to s \\Rightarrow \\text{shackle carries cylinder} \\Rightarrow m\\;\\text{seats }r",
    engineMethod: "stepColtLockwork source-bounded host topology",
    controls: [
      {
        id: "cockingTravelPct",
        label: "Cocking Travel",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 0,
        unit: "% display",
        provenance: "topology-normalized",
      },
      {
        id: "chamberIndex",
        label: "Starting Display Ward",
        min: 1,
        max: 5,
        step: 1,
        defaultValue: 1,
        unit: "display index",
        provenance: "topology-normalized",
      },
    ],
    computeMetrics: (p) => {
      const colt = stepColtLockwork(readColtRuntimeControls(p));
      const ratchetPercent = Math.round(colt.ratchetAdvanceFraction * 100);
      const cylinderPercent = Math.round(colt.cylinderAdvanceFraction * 100);

      return [
        {
          label: "Lockwork Stage",
          value: colt.stage.replaceAll("-", " ").toUpperCase(),
          unit: "source order",
          badgeColor: colt.sourceSequenceClosed ? "emerald" : "amber",
          progressPct: clampProgress(colt.cockingProgress01 * 100),
          provenance: "source-derived",
        },
        {
          label: "Key r",
          value: colt.keySeated ? "SEATED" : "WITHDRAWN",
          unit: "ward state",
          badgeColor: colt.keySeated ? "emerald" : "amber",
          progressPct: clampProgress((1 - colt.keyRetraction01) * 100),
          provenance: "source-disclosed",
        },
        {
          label: "Ratchet Advance",
          value: `${ratchetPercent}%`,
          unit: "display step",
          badgeColor: "cyan",
          progressPct: clampProgress(ratchetPercent),
          provenance: "topology-normalized",
        },
        {
          label: "Cylinder Transfer",
          value: colt.cylinderAndRatchetCoupled ? `${cylinderPercent}%` : "UNCOUPLED",
          unit: "display step",
          badgeColor: colt.cylinderAndRatchetCoupled ? "cyan" : "amber",
          progressPct: clampProgress(cylinderPercent),
          provenance: "source-derived",
        },
        {
          label: "Hammer Release",
          value: colt.safeToReleaseHammer ? "PERMITTED" : "WITHHELD",
          unit: "after lockup",
          badgeColor: colt.safeToReleaseHammer ? "emerald" : "amber",
          progressPct: clampProgress(colt.safeToReleaseHammer ? 100 : 0),
          provenance: "source-disclosed",
        },
        {
          label: "Ballistic Card",
          value: "NOT COMPUTABLE",
          unit: "source boundary",
          badgeColor: "amber",
          progressPct: 0,
          provenance: "refusal-bounded",
          provenanceCitation:
            "US X9430 gives no caliber, pressure, charge, mass, geometry, timing, velocity, force, or material card.",
        },
      ];
    },
    pedagogicalInsight:
      "The exhibit follows the described causal chain: hammer pin p withdraws key r; lifter arm d advances ratchet tooth s; the shackle carries the cylinder; spring m seats the key in the succeeding ward. The source establishes that order, not a force, angle, timing, chamber dimension, or ballistic result.",
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
        provenance: "scenario-reader",
      },
      {
        id: "spacebandWedge",
        label: "Spaceband Justification Wedge",
        min: 2.0,
        max: 12.0,
        step: 0.5,
        defaultValue: 6.5,
        unit: "mm",
        provenance: "scenario-reader",
      },
      {
        id: "potTemp",
        label: "Lead Pot Temperature",
        min: 220,
        max: 300,
        step: 2,
        defaultValue: 260,
        unit: "°C",
        provenance: "scenario-reader",
      },
      {
        id: "lineLengthPicas",
        label: "Column Measure Width",
        min: 8,
        max: 26,
        step: 1,
        defaultValue: 13,
        unit: "picas",
        provenance: "scenario-reader",
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
          provenance: "scenario-modern",
        },
        {
          label: "Lines per Hour",
          value: `${linotype.linesPerHour}`,
          unit: "lph",
          badgeColor: "cyan",
          progressPct: clampProgress((linotype.linesPerHour / 120) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Matrices per Hour",
          value: `${linotype.charsPerHour}`,
          unit: "cph",
          badgeColor: "purple",
          progressPct: clampProgress((linotype.charsPerHour / 4000) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Slug Solidification",
          value: `${solidMs} ms`,
          unit: "t_solid",
          badgeColor: "cyan",
          progressPct: Math.min(100, (solidMs / 600) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Lead-Alloy Hardness",
          value: hardness,
          unit: "HB",
          badgeColor: temp >= linotype.alloyMeltPointC && temp <= 275 ? "emerald" : "amber",
          progressPct: clampProgress(temp >= linotype.alloyMeltPointC && temp <= 275 ? 95 : 60),
          provenance: "scenario-modern",
        },
        {
          label: "Distributor Sorting",
          value: (rate / 60).toFixed(2),
          unit: "Hz",
          badgeColor: "indigo",
          progressPct: clampProgress((rate / 120) * 100),
          provenance: "scenario-modern",
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
          label: "Normalized Breech Travel",
          value: `${((maxim.breechOpenMm / 48) * 100).toFixed(1)}%`,
          unit: "of illustrated cycle",
          badgeColor: "indigo",
          progressPct: clampProgress((maxim.breechOpenMm / 48) * 100),
          provenance: "topology-normalized",
          provenanceCitation:
            "Dimensionless travel through the illustrated linkage cycle; US 319,596 does not print a numerical breech stroke.",
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
        provenance: "source-disclosed",
      },
      {
        id: "coolingPumpEnabled",
        label: "Centrifugal Cooling Pump u",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        unit: "off / on",
        provenance: "source-disclosed",
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
          provenance: "scenario-reader",
        },
        {
          label: "Ahead Contact",
          value: state.aheadCouplingEngaged ? "coupling a / a²" : "open",
          unit: "source labels",
          badgeColor: "cyan",
          progressPct: state.aheadCouplingEngaged ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Astern Contact",
          value: state.asternGearingEngaged ? "disks e¹ / e² with a² / c" : "open",
          unit: "source labels",
          badgeColor: "indigo",
          progressPct: state.asternGearingEngaged ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Cooling Circulation",
          value: state.coolingPumpActive
            ? "fore-and-aft pipes s¹ / s² + pump u"
            : "fore-and-aft pipes s¹ / s²",
          unit: "source alternatives",
          badgeColor: "purple",
          progressPct: state.coolingPumpActive ? 100 : 0,
          provenance: "source-disclosed",
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
        provenance: "scenario-modern",
      },
      {
        id: "batteryVolts",
        label: "Battery Bank Potential",
        min: 6,
        max: 24,
        step: 1,
        defaultValue: 12,
        unit: "V",
        provenance: "scenario-modern",
      },
      {
        id: "activeRelays",
        label: "Parallel Accumulator Relays",
        min: 1,
        max: 40,
        step: 1,
        defaultValue: 16,
        unit: "relays",
        provenance: "scenario-modern",
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
          provenance: "scenario-modern",
        },
        {
          label: "Solenoid Pull Force",
          value: `${forceN} N`,
          unit: "F_mag",
          badgeColor: "emerald",
          progressPct: Math.min(100, (Number(forceN) / 5) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Circuit Time Constant",
          value: `${tauMs} ms`,
          unit: "τ",
          badgeColor: "amber",
          progressPct: clampProgress((Number(tauMs) / 30) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Active Relays",
          value: `${relays}`,
          unit: "relays",
          badgeColor: "purple",
          progressPct: clampProgress((relays / hol.registerDialCount) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Sensing Pins",
          value: `${hol.sensingPinCount}`,
          unit: "pins",
          badgeColor: "indigo",
          progressPct: clampProgress(100),
          provenance: "source-disclosed",
        },
        {
          label: "Census Register Bank",
          value: `${hol.registerDialCount} dials`,
          unit: "dials",
          badgeColor: "cyan",
          progressPct: clampProgress(100),
          provenance: "source-disclosed",
        },
        {
          label: "7-hour Day",
          value: hol.cardsPerDay.toLocaleString(),
          unit: "cards",
          badgeColor: "amber",
          progressPct: clampProgress((hol.cardsPerDay / 30000) * 100),
          provenance: "scenario-modern",
        },
      ];
    },
    pedagogicalInsight:
      "Spring-loaded brass pins pass through card perforations into mercury pools, completing 12V circuits that advance dial accumulators and trigger sorting box lids in parallel.",
  },
  "us-470918-reno-escalator": {
    domain: "mechanical_kinematics",
    domainTitle: "Source-Bounded Endless Conveyor Kinematics",
    equationName: "Traveling Belt and Hand-Rail Speed",
    governingEquation: "v = \\omega R; \\quad 200\\,\\text{ft/min} \\approx 1.016\\,\\text{m/s}",
    engineMethod: "TypeScript host kinematic readout (no Reno WASM step)",
    controls: [
      {
        id: "inclineAngle",
        label: "Incline (source preference ≈25°)",
        min: 20,
        max: 35,
        step: 1,
        defaultValue: 25,
        unit: "°",
        provenance: "scenario-reader",
        provenanceCitation: "The specification proposes an angle of slope of about 25 degrees.",
      },
      {
        id: "beltSpeed",
        label: "Belt speed (source reference 200 ft/min)",
        min: 0.4,
        max: 1.2,
        step: 0.001,
        defaultValue: 1.016,
        unit: "m/s",
        provenance: "scenario-reader",
        provenanceCitation:
          "The specification says the conveyor and hand-rail preferably move at about 200 feet per minute.",
      },
    ],
    computeMetrics: (p) => {
      const v = p.beltSpeed ?? 1.016;
      const inclineDeg = p.inclineAngle ?? 25;
      const speedFpm = Math.round((v * 60) / 0.3048);

      return [
        {
          label: "Selected Belt Speed",
          value: `${speedFpm} ft/min`,
          unit: `${v.toFixed(3)} m/s`,
          badgeColor: "cyan",
          progressPct: clampProgress((v / 1.2) * 100),
          provenance: "scenario-reader",
        },
        {
          label: "Patent Preferred Speed",
          value: "200 ft/min",
          unit: "≈ 1.016 m/s",
          badgeColor: "emerald",
          progressPct: clampProgress((200 / 240) * 100),
          provenance: "source-disclosed",
          provenanceCitation:
            "The specification states that the conveyor and hand-rail preferably move at about 200 feet per minute.",
        },
        {
          label: "Patent Stated Maximum",
          value: "6,000",
          unit: "passengers/h, single file",
          badgeColor: "amber",
          progressPct: clampProgress(75),
          provenance: "source-disclosed",
          provenanceCitation:
            "The specification gives a maximum capacity of six thousand passengers per hour in single file.",
        },
        {
          label: "Preferred Comb Clearance",
          value: "≤ 1/8 in",
          unit: "≤ 3.175 mm",
          badgeColor: "cyan",
          progressPct: clampProgress(64),
          provenance: "source-disclosed",
          provenanceCitation:
            "The specification says clearance between the comb prongs and belt grooves should not exceed one-eighth inch.",
        },
        {
          label: "Selected Incline",
          value: `${inclineDeg.toFixed(0)}°`,
          unit: "source-preference display",
          badgeColor: "indigo",
          progressPct: clampProgress(((inclineDeg - 20) / 15) * 100),
          provenance: "scenario-reader",
          provenanceCitation:
            "The specification proposes an angle of slope of about 25 degrees; the selected value controls the normalized geometric reconstruction.",
        },
      ];
    },
    pedagogicalInsight:
      "Reno describes a hinged, longitudinally grooved belt passing fixed comb fingers, an articulated traveling hand-rail, a preferred speed of about 200 feet per minute, and a stated single-file maximum of 6,000 passengers per hour. The source does not provide a power, torque, or load-curve measurement.",
    provenance: "source-disclosed",
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
        provenance: "scenario-modern",
      },
      {
        id: "blastAirPressure",
        label: "Blast-Air Injector Pressure",
        min: 45,
        max: 85,
        step: 2,
        defaultValue: 65,
        unit: "bar",
        provenance: "scenario-modern",
      },
      {
        id: "cutoffRatio",
        label: "Fuel Cutoff Ratio (rc)",
        min: 1.2,
        max: 2.2,
        step: 0.1,
        defaultValue: 1.6,
        unit: "ratio",
        provenance: "scenario-modern",
      },
      {
        id: "engineRpm",
        label: "Engine Shaft Speed",
        min: 60,
        max: 300,
        step: 10,
        defaultValue: 150,
        unit: "RPM",
        provenance: "scenario-modern",
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
          provenance: "scenario-modern",
        },
        {
          label: "Peak Cylinder Pressure",
          value: `${pComp} bar`,
          unit: "P_comp",
          badgeColor: "cyan",
          progressPct: clampProgress((Number(pComp) / 80) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Brake Thermal Efficiency",
          value: `${brakeEff}%`,
          unit: "η_brake",
          badgeColor: "emerald",
          progressPct: clampProgress((Number(brakeEff) / 50) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Auto-Ignition State",
          value: diesel.isAutoIgnition ? "SELF-IGNITING" : "NO IGNITION",
          unit: "state",
          badgeColor: diesel.isAutoIgnition ? "emerald" : "rose",
          progressPct: clampProgress(diesel.isAutoIgnition ? 100 : 0),
          provenance: "topology-normalized",
        },
        {
          label: "Crank ω",
          value: `${diesel.crankOmegaRadPerS}`,
          unit: "rad/s",
          badgeColor: "cyan",
          progressPct: Math.min(100, (diesel.crankOmegaRadPerS / 30) * 100),
          provenance: "scenario-modern",
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
    pedagogicalInsight:
      "US 613,809 describes sending electrical disturbances through natural media to a sensitive particle receptacle, relay, anchor escapement, and contact cylinder to step local propulsion, steering, and signaling circuits without intermediate wires.",
    controls: [
      {
        id: "pulseCount",
        label: "Transmitter Command Pulses",
        min: 0,
        max: 20,
        step: 1,
        defaultValue: 3,
        unit: "pulses",
        provenance: "source-disclosed",
      },
      {
        id: "rfFrequency",
        label: "Illustrative Carrier Frequency",
        min: 120,
        max: 180,
        step: 2,
        defaultValue: 150,
        unit: "kHz",
        provenance: "scenario-modern",
      },
      {
        id: "rudderAngle",
        label: "Illustrative Rudder Steering Angle",
        min: -35,
        max: 35,
        step: 5,
        defaultValue: 15,
        unit: "°",
        provenance: "scenario-modern",
      },
      {
        id: "propellerThrottlePct",
        label: "Illustrative Motor Throttle",
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 75,
        unit: "%",
        provenance: "scenario-modern",
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
          label: "Command State",
          value: "COMMAND-STEPPED CONTROLLER",
          unit: "topology",
          badgeColor: "emerald",
          primary: true,
          provenance: "source-disclosed",
        },
        {
          label: "Normalized Command Sequence",
          value: tele.steppingDiskIndex.toString(),
          unit: "of 8 illustrated positions",
          badgeColor: "indigo",
          progressPct: clampProgress((tele.steppingDiskIndex / 7) * 100),
          provenance: "topology-normalized",
          provenanceCitation:
            "Illustrative eight-position normalization of the source-described pulse, escapement, and contact-cylinder sequence; not a count printed in US 613,809.",
        },
        {
          label: "Coherer Resistance",
          value: tele.isResonant ? `${tele.cohererOhms} Ω (Conducting)` : "100 kΩ (Open)",
          unit: "R_det",
          badgeColor: tele.isResonant ? "emerald" : "amber",
          progressPct: clampProgress(tele.isResonant ? 95 : 10),
          provenance: "scenario-modern",
        },
        {
          label: "Propulsion Motor",
          value: `${tele.motorThrustN} N`,
          unit: `${Math.round(tele.propellerRpm)} rpm`,
          badgeColor: tele.relayEnergized ? "cyan" : "purple",
          progressPct: clampProgress(tele.motorThrustN),
          provenance: "scenario-modern",
        },
        {
          label: "Turning Radius",
          value: turnRadiusM,
          unit: "R_turn",
          badgeColor: "indigo",
          progressPct: clampProgress(Math.abs(tele.rudderAngleDeg) > 0 ? 70 : 100),
          provenance: "scenario-modern",
        },
        {
          label: "Carrier Resonance",
          value: tele.isResonant ? "LOCKED (150 kHz)" : "DETUNED",
          unit: "resonance",
          badgeColor: tele.isResonant ? "emerald" : "rose",
          progressPct: clampProgress(tele.isResonant ? 100 : 20),
          provenance: "topology-normalized",
        },
      ];
    },
  },
  "us-621195-zeppelin-airship": {
    domain: "aerodynamics_mbd",
    domainTitle: "Multi-Cell Archimedean Buoyancy & Space-Frame Bending",
    equationName: "Net Aerostatic Buoyant Lift & Pitch Trim",
    governingEquation:
      "L_{\\text{buoyant}} = V_{\\text{gas}} g (\\rho_{\\text{air}} - \\rho_{\\text{H}_2}) - W_{\\text{struct}}",
    engineMethod: "FrankenSimEngine.stepZeppelinAirship",
    pedagogicalInsight:
      "US 621,195 claims a rigid compartmented framework with main gas bags, auxiliary maneuvering bags, independent cars with separated motors, rudders, and a movable running weight suspended beneath to adjust longitudinal pitch attitude.",
    controls: [
      {
        id: "trimWeight",
        label: "Keel Sliding Ballast Position",
        min: -15,
        max: 15,
        step: 1,
        defaultValue: 5,
        unit: "m",
        provenance: "source-disclosed",
      },
      {
        id: "gasInflation",
        label: "Illustrative Gas Cell Inflation",
        min: 75,
        max: 100,
        step: 1,
        defaultValue: 95,
        unit: "%",
        provenance: "scenario-modern",
      },
      {
        id: "flightAlt",
        label: "Illustrative Flight Altitude",
        min: 0,
        max: 2000,
        step: 50,
        defaultValue: 300,
        unit: "m",
        provenance: "scenario-modern",
      },
      {
        id: "flightSpeedKnots",
        label: "Illustrative Cruising Airspeed",
        min: 10,
        max: 45,
        step: 1,
        defaultValue: 28,
        unit: "knots",
        provenance: "scenario-modern",
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
          label: "Compartment Trim",
          value: "COMPARTMENTED RIGID HULL",
          unit: "topology",
          badgeColor: "emerald",
          primary: true,
          provenance: "source-disclosed",
        },
        {
          label: "Net Aerostatic Lift",
          value: `${netKn} kN`,
          unit: "L_net",
          badgeColor: Number(netKn) > 0 ? "emerald" : "rose",
          progressPct: clampProgress((Number(netKn) / 40) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Gross Buoyancy",
          value: `${grossKn} kN`,
          unit: "L_gross",
          badgeColor: "cyan",
          progressPct: clampProgress((Number(grossKn) / 140) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Airspeed",
          value: `${zep.flightSpeedMph} mph`,
          unit: "v",
          badgeColor: "amber",
          progressPct: clampProgress((zep.flightSpeedMph / 80) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Pitch Trim Angle",
          value: `${pitchDeg}°`,
          unit: "α_trim",
          badgeColor: "indigo",
          progressPct: clampProgress((Math.abs(Number(pitchDeg)) / 10) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Useful Payload",
          value: `${zep.usefulPayloadKg} kg`,
          unit: "m_pay",
          badgeColor: "amber",
          progressPct: clampProgress((zep.usefulPayloadKg / 5000) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Air Density",
          value: `${zep.ambientAirDensityKgM3.toFixed(3)} kg/m³`,
          unit: "ρ_air",
          badgeColor: "purple",
          progressPct: clampProgress((zep.ambientAirDensityKgM3 / 1.225) * 100),
          provenance: "scenario-modern",
        },
      ];
    },
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
    domain: "thermo_fluid",
    domainTitle: "Wet-Plate Sinuous Air Washer and Droplet Separator",
    equationName: "Inertial Impaction and Sinuous Droplet Separation",
    governingEquation:
      "\\eta_{\\text{sep}} = 1 - \\exp\\left(-N_{\\text{turns}} \\cdot \\mathrm{Stk}\\right) \\quad \\text{and} \\quad \\Delta P = \\frac{1}{2} \\rho v^2 \\sum K_{\\text{loss}}",
    engineMethod: "FrankenSimEngine.stepCarrierAirConditioner",
    pedagogicalInsight:
      "US 808,897 claims fine liquid spray wetting suspended impurities, and repeated turns across upright sinuous plates i to capture dirt and droplets, with rear gutters b and c trapping and draining liquid without carryover.",
    controls: [
      {
        id: "airflowCfm",
        label: "Treated Airflow",
        min: 2000,
        max: 30000,
        step: 500,
        defaultValue: 15000,
        unit: "cfm",
        provenance: "source-disclosed",
      },
      {
        id: "sprayRatePct",
        label: "Spray Nozzle Rate",
        min: 10,
        max: 100,
        step: 5,
        defaultValue: 60,
        unit: "%",
        provenance: "source-disclosed",
      },
      {
        id: "separatorFaces",
        label: "Sinuous Plate Faces / Turns",
        min: 2,
        max: 12,
        step: 1,
        defaultValue: 6,
        unit: "faces",
        provenance: "source-disclosed",
      },
    ],
    computeMetrics: (p) => {
      const carrier = FrankenSimEngine.stepCarrierAirConditioner({
        airflowCfm: p.airflowCfm,
        sprayRatePct: p.sprayRatePct,
        separatorFaces: p.separatorFaces,
      });

      return [
        {
          label: "Separator State",
          value: "WET-SURFACE REMOVAL",
          unit: "topology",
          badgeColor: "cyan",
          primary: true,
          provenance: "source-disclosed",
        },
        {
          label: "Droplet Separation",
          value: `${carrier.dropletSeparationPct}%`,
          unit: "%",
          badgeColor: "emerald",
          progressPct: carrier.dropletSeparationPct,
          provenance: "scenario-modern",
        },
        {
          label: "Impurity Capture",
          value: `${carrier.particleCapturePct}%`,
          unit: "%",
          badgeColor: "amber",
          progressPct: carrier.particleCapturePct,
          provenance: "scenario-modern",
        },
        {
          label: "Wet-Film Coverage",
          value: `${carrier.wetFilmCoveragePct}%`,
          unit: "%",
          badgeColor: "indigo",
          progressPct: carrier.wetFilmCoveragePct,
          provenance: "scenario-modern",
        },
        {
          label: "Separator Pressure Loss",
          value: `${carrier.pressureDropPa} Pa`,
          unit: "Pa",
          badgeColor: "rose",
          progressPct: clampProgress((carrier.pressureDropPa / 120) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Air Flow Power",
          value: `${carrier.airMovementWatts} W`,
          unit: "W",
          badgeColor: "emerald",
          progressPct: clampProgress((carrier.airMovementWatts / 800) * 100),
          provenance: "scenario-modern",
        },
      ];
    },
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
    domainTitle: "Direct-Drive Toothed Cylinder & Crossed-Band Clearer",
    equationName: "Printed Direct Drive plus Declared Clearer Ratio",
    governingEquation:
      "\\theta_{cylinder}=\\theta_{winch},\\quad \\omega_{clearer}=-3\\,\\omega_{cylinder}\\;\\text{(declared whirl scenario)}",
    engineMethod:
      "Source-bounded host kinematics; fs-lbm may shape lint display, but no multibody WASM composition is available.",
    controls: [
      {
        id: "crankRpm",
        label: "Input Shaft Speed",
        min: 20,
        max: 180,
        step: 10,
        defaultValue: 60,
        unit: "RPM",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics: (p) => {
      const gin = stepWhitneyCottonGin({ crankRpm: p.crankRpm });
      const sawRpm = gin.sawRpm;
      const brushRpm = gin.brushRpm;
      const outputLbs = gin.outputLbsPerDay;
      return [
        {
          label: "Toothed Cylinder Speed",
          value: `${sawRpm} RPM`,
          unit: "omega_saw",
          badgeColor: "amber",
          progressPct: clampProgress((sawRpm / 180) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Brush Speed",
          value: `${brushRpm} RPM`,
          unit: "omega_brush",
          badgeColor: "cyan",
          progressPct: clampProgress((brushRpm / 540) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Scenario Clean Fiber Yield",
          value: `${outputLbs} lbs/day`,
          unit: "m_dot",
          badgeColor: "emerald",
          progressPct: clampProgress((outputLbs / 100) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Saw Tip Speed",
          value: `${gin.sawTipSpeedMps} m/s`,
          unit: "v_tip",
          badgeColor: "purple",
          progressPct: clampProgress((gin.sawTipSpeedMps / 12) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "vs Hand Ginning",
          value: `${gin.laborMultiplier}×`,
          unit: "labor",
          badgeColor: "amber",
          progressPct: gin.sourceLaborReductionFraction * 100,
          provenance: "source-disclosed",
        },
      ];
    },
    pedagogicalInsight:
      "Whitney's inclined wire teeth carry cotton through breastwork openings that stop the seeds. A contrary-running, faster four-brush clearer sweeps lint from the teeth; the restored source specifies this topology and a 49/50 water-powered labor reduction, but not an operating speed or throughput.",
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
        label: "Scenario Ground Speed",
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
    computeMetrics: (p) => {
      const rpm = p.shaftRpm ?? 120;
      const angle = p.bladePitchAngleDeg ?? 35;
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
        {
          label: "Illustrative Shaft Motion",
          value: `${rpm} RPM`,
          unit: "model RPM",
          badgeColor: "cyan",
          progressPct: clampProgress(((rpm - 40) / 200) * 100),
          provenance: "scenario-reader",
        },
        {
          label: "Illustrative Plate Angle",
          value: `${angle}°`,
          unit: "model degrees",
          badgeColor: "purple",
          progressPct: clampProgress(((angle - 20) / 35) * 100),
          provenance: "scenario-reader",
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
        provenance: "scenario-reader",
      },
      {
        id: "engineRpm",
        label: "Engine Speed",
        min: 30,
        max: 120,
        step: 5,
        defaultValue: 65,
        unit: "RPM",
        provenance: "scenario-reader",
      },
      {
        id: "cutoffPct",
        label: "Cut-Off Stroke Ratio",
        min: 10,
        max: 60,
        step: 2,
        defaultValue: 25,
        unit: "%",
        provenance: "scenario-reader",
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
          provenance: "scenario-modern",
        },
        {
          label: "Thermal Efficiency",
          value: `${corliss.thermalEfficiencyPct}%`,
          unit: "eta_th",
          badgeColor: "emerald",
          progressPct: clampProgress((corliss.thermalEfficiencyPct / 40) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Boiler Pressure",
          value: `${corliss.boilerMpa} MPa`,
          unit: "P",
          badgeColor: "amber",
          progressPct: clampProgress((corliss.boilerMpa / 1.4) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Expansion Ratio",
          value: `${corliss.expansionRatio}`,
          unit: "r_exp",
          badgeColor: "cyan",
          progressPct: clampProgress((corliss.expansionRatio / 8) * 100),
          provenance: "scenario-modern",
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
        provenance: "scenario-reader",
      },
      {
        id: "twistsPerFoot",
        label: "Helical Twist Rate",
        min: 2,
        max: 10,
        step: 1,
        defaultValue: 5,
        unit: "twists/ft",
        provenance: "scenario-reader",
      },
      {
        id: "animalPushForceN",
        label: "Livestock Push Force",
        min: 20,
        max: 300,
        step: 10,
        defaultValue: 120,
        unit: "N",
        provenance: "scenario-reader",
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
          provenance: "scenario-modern",
        },
        {
          label: "Barb Longitudinal Lock",
          value: isLocked ? "LOCKED (No Slip)" : "SLIPPING (Insufficient Twist)",
          unit: "lock",
          badgeColor: isLocked ? "emerald" : "rose",
          progressPct: clampProgress(isLocked ? 100 : 25),
          provenance: "source-disclosed",
        },
        {
          label: "Bessemer Rating",
          value: `${wire.tensileStrengthLbs} lb`,
          unit: "UTS",
          badgeColor: "amber",
          progressPct: clampProgress(100),
          provenance: "scenario-modern",
        },
        {
          label: "Line Output",
          value: `${wire.productionRateFtPerMin} ft/min`,
          unit: "v_line",
          badgeColor: "cyan",
          progressPct: clampProgress((wire.productionRateFtPerMin / 60) * 100),
          provenance: "scenario-modern",
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
    engineMethod:
      "stepEdisonPhonograph (illustrative display motion only; source-bounded TypeScript helper; no FrankenSim/WASM rate step)",
    controls: [
      {
        id: "mandrelRpm",
        label: "Illustrative Clock-Work Rate",
        min: 40,
        max: 140,
        step: 5,
        defaultValue: 60,
        unit: "model RPM",
        provenance: "scenario-reader",
      },
      {
        id: "voiceVolumeDb",
        label: "Illustrative Diaphragm-Excitation Level",
        min: 40,
        max: 100,
        step: 5,
        defaultValue: 75,
        unit: "model dB",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics: (params) => {
      const phonograph = stepEdisonPhonograph(params);
      const mandrelRpm = params.mandrelRpm ?? 60;
      const voiceVolumeDb = params.voiceVolumeDb ?? 75;
      return [
        {
          label: "Source Helical Groove Pitch",
          value: "10",
          unit: "grooves/in",
          badgeColor: "amber",
          progressPct: clampProgress(100),
          provenance: "source-disclosed",
        },
        {
          label: "Source Shaft Thread Pitch",
          value: "10",
          unit: "threads/in",
          badgeColor: "cyan",
          progressPct: clampProgress(100),
          provenance: "source-disclosed",
        },
        {
          label: "Named Drive",
          value: "Clock-work M or other power",
          unit: "source text",
          badgeColor: "emerald",
          progressPct: clampProgress(100),
          provenance: "source-disclosed",
        },
        {
          label: "Reader Clock-Work Setting",
          value: mandrelRpm.toFixed(0),
          unit: "model RPM",
          badgeColor: "purple",
          progressPct: clampProgress(((mandrelRpm - 40) / 100) * 100),
          provenance: "scenario-reader",
        },
        {
          label: "Illustrative Helical Advance",
          value: phonograph.axialTravelMmPerS.toFixed(3),
          unit: "mm/s reader aid",
          badgeColor: "indigo",
          progressPct: clampProgress((phonograph.axialTravelMmPerS / 6) * 100),
          provenance: "scenario-reader",
        },
        {
          label: "Reader Diaphragm Excitation",
          value: voiceVolumeDb.toFixed(0),
          unit: "model units",
          badgeColor: "rose",
          progressPct: clampProgress(((voiceVolumeDb - 40) / 60) * 100),
          provenance: "scenario-reader",
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
        provenance: "source-disclosed",
      },
      {
        id: "claim1Active",
        label: "Claim 1 Geometry",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "absent / present",
        provenance: "source-disclosed",
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
          provenance: "source-disclosed",
        },
        {
          label: "Stream Division",
          value: claim1Active ? "central apex d" : "claim element removed",
          unit: "source label",
          badgeColor: "amber",
          progressPct: claim1Active ? 100 : 0,
          primary: true,
          provenance: "source-disclosed",
        },
        {
          label: "Curved Bottoms",
          value: "two bottoms c",
          unit: "source label",
          badgeColor: "emerald",
          progressPct: 100,
          provenance: "source-disclosed",
        },
        {
          label: "Discharge",
          value: "flaring sides e",
          unit: "source label",
          badgeColor: "purple",
          progressPct: 100,
          provenance: "source-disclosed",
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
        provenance: "scenario-reader",
        provenanceCitation:
          "Reader-supplied exploratory input; US 235,199 prints no measured range or atmospheric-loss model.",
      },
      {
        id: "voiceSplDb",
        label: "Speaker Vocal Sound Level",
        min: 50,
        max: 95,
        step: 1,
        defaultValue: 75,
        unit: "dB SPL",
        provenance: "scenario-reader",
        provenanceCitation:
          "Reader-supplied exploratory input; US 235,199 prints no sound-pressure calibration.",
      },
      {
        id: "solarIrradianceWPerM2",
        label: "Incident Source Irradiance",
        min: 200,
        max: 1200,
        step: 50,
        defaultValue: 950,
        unit: "W/m²",
        provenance: "scenario-reader",
        provenanceCitation:
          "Reader-supplied exploratory input; US 235,199 prints no source-irradiance measurement.",
      },
      {
        id: "collectorDiameterM",
        label: "Parabolic Collector Diameter",
        min: 0.2,
        max: 1.0,
        step: 0.05,
        defaultValue: 0.5,
        unit: "m",
        provenance: "scenario-reader",
        provenanceCitation:
          "Reader-supplied exploratory input; US 235,199 prints no collector diameter or aperture efficiency.",
      },
    ],
    computeMetrics: (p) => {
      const photo = stepBellPhotophone({
        transmissionDistanceM: p.transmissionDistanceM,
        voiceSplDb: p.voiceSplDb,
        solarIrradianceWPerM2: p.solarIrradianceWPerM2,
        collectorDiameterM: p.collectorDiameterM,
      });
      const scenarioRequest = [
        `${p.transmissionDistanceM ?? 213} m`,
        `${p.voiceSplDb ?? 75} dB SPL`,
        `${p.solarIrradianceWPerM2 ?? 950} W/m²`,
        `${p.collectorDiameterM ?? 0.5} m collector`,
      ].join(" · ");
      return [
        {
          label: "Source Causal Chain",
          value: photo.beamVariationActive ? "VARIED BEAM → SENSITIVE RECEIVER" : "STEADY BEAM",
          unit: "US 235,199 topology",
          badgeColor: "emerald",
          progressPct: clampProgress(photo.beamVariationActive ? 100 : 0),
          provenance: "source-disclosed",
        },
        {
          label: "Reader Scenario Request",
          value: scenarioRequest,
          unit: "not a patent measurement",
          badgeColor: "indigo",
          progressPct: 50,
          provenance: "scenario-reader",
          provenanceCitation: photo.sourceBoundary,
        },
        {
          label: "Quantitative Link Budget",
          value: "WITHHELD — SOURCE INPUTS ABSENT",
          unit: "typed refusal",
          badgeColor: "amber",
          progressPct: 0,
          provenance: "refusal-bounded",
          provenanceCitation: photo.sourceBoundary,
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
        weldCurrentAmps: p.weldCurrentAmps ?? 4500,
        clampPressureMpa: p.clampPressureMpa ?? 35,
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
  "us-608969-parsons-turbine": {
    domain: "thermo_fluid",
    domainTitle: "Marine Steam-Turbine Multi-Shaft Piping & Valve Routing",
    equationName: "Staged Pressure Drop & Multi-Shaft Flow Continuity",
    governingEquation:
      "\\Delta H_{\\text{total}} = \\sum_{i=1}^N \\Delta H_i \\quad \\text{and} \\quad \\dot{m}_{\\text{total}} = \\sum_{k=1}^M \\dot{m}_k",
    engineMethod: "stepParsonsMarine",
    pedagogicalInsight:
      "US 608,969 claims selectable pipe-and-valve combinations to route steam in series at cruising speed or parallel at full power across multiple shafts, with reversing turbines X and Y turning in condenser vacuum during forward motion.",
    controls: [
      {
        id: "routing",
        label: "Piping Configuration",
        min: 0,
        max: 2,
        step: 1,
        defaultValue: 0,
        unit: "mode",
        provenance: "source-disclosed",
      },
      {
        id: "reversing",
        label: "Reversing Valve State",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 0,
        unit: "binary",
        provenance: "source-disclosed",
      },
      {
        id: "throttle",
        label: "Throttle Setting",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 1,
        unit: "ratio",
        provenance: "source-disclosed",
      },
    ],
    computeMetrics: (p) => {
      const routingModes: ("series" | "compound-parallel" | "simple-parallel")[] = [
        "series",
        "compound-parallel",
        "simple-parallel",
      ];
      const routing = routingModes[Math.round(p.routing ?? 0)] ?? "series";
      const reversing = Boolean(p.reversing);
      const throttle = p.throttle ?? 1;
      const state = stepParsonsMarine({ routing, reversing, throttle });

      return [
        {
          label: "Operating Route",
          value: state.routeLabel,
          unit: "topology",
          badgeColor: "cyan",
          primary: true,
          provenance: "source-disclosed",
        },
        {
          label: "Propulsion Direction",
          value: state.directionLabel.toUpperCase(),
          unit: "mode",
          badgeColor: state.directionLabel === "ahead" ? "emerald" : "amber",
          primary: true,
          provenance: "source-disclosed",
        },
        {
          label: "Active Shafts",
          value: `${state.activeShafts}`,
          unit: "shafts",
          badgeColor: "indigo",
          progressPct: (state.activeShafts / 4) * 100,
          provenance: "source-disclosed",
        },
        {
          label: "Active Turbines",
          value: `${state.activeTurbines.length}`,
          unit: "units",
          badgeColor: "emerald",
          progressPct: (state.activeTurbines.length / 8) * 100,
          provenance: "source-disclosed",
        },
        {
          label: "Relative Steam Flow",
          value: `${(state.flowRateRelative * 100).toFixed(0)}%`,
          unit: "%",
          badgeColor: "cyan",
          progressPct: Math.min(100, state.flowRateRelative * 100),
          provenance: "scenario-modern",
        },
      ];
    },
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
        provenance: "scenario-reader",
      },
      {
        id: "condenserTempC",
        label: "Condenser Cistern Temp",
        min: 10,
        max: 60,
        step: 1,
        defaultValue: 35,
        unit: "°C",
        provenance: "scenario-reader",
      },
      {
        id: "cylinderBoreInches",
        label: "Cylinder Bore",
        min: 20,
        max: 72,
        step: 2,
        defaultValue: 38,
        unit: "in",
        provenance: "scenario-reader",
      },
      {
        id: "pistonStrokeFeet",
        label: "Stroke Length",
        min: 4,
        max: 10,
        step: 0.5,
        defaultValue: 6.0,
        unit: "ft",
        provenance: "scenario-reader",
      },
      {
        id: "strokesPerMinute",
        label: "Cadence",
        min: 6,
        max: 24,
        step: 1,
        defaultValue: 14,
        unit: "spm",
        provenance: "scenario-reader",
      },
      {
        id: "hasSeparateCondenser",
        label: "Watt Condenser (vs Newcomen)",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "",
        provenance: "scenario-reader",
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
          provenance: "scenario-modern",
        },
        {
          label: "Condenser Vacuum",
          value: `${watt.vacuumDepthInchesHg.toFixed(1)} inHg (${watt.condenserPressureAbsKpa.toFixed(1)} kPa)`,
          unit: "inHg",
          badgeColor: "cyan",
          progressPct: Math.min(100, (watt.vacuumDepthInchesHg / 29.92) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Thermal Efficiency",
          value: `${watt.thermalEfficiencyPct.toFixed(2)}%`,
          unit: "%",
          badgeColor: "amber",
          progressPct: Math.min(100, (watt.thermalEfficiencyPct / 6.0) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Coal Burn Rate",
          value: `${watt.coalConsumptionKgPerHour.toFixed(1)} kg/hr`,
          unit: "kg/h",
          badgeColor: "rose",
          progressPct: Math.min(100, (watt.coalConsumptionKgPerHour / 150.0) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Mine Water Lift (183m)",
          value: `${Math.round(watt.waterPumpedGallonsPerHour).toLocaleString()} gal/hr`,
          unit: "gph",
          badgeColor: "indigo",
          progressPct: Math.min(100, (watt.waterPumpedM3PerHour / 120.0) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Coal Savings / Year",
          value: `${Math.round(watt.coalSavedTonsPerYear).toLocaleString()} tons`,
          unit: "tons/yr",
          badgeColor: "emerald",
          progressPct: Math.min(100, (watt.coalSavedTonsPerYear / 1500.0) * 100),
          provenance: "scenario-modern",
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
        provenance: "scenario-reader",
      },
      {
        id: "totalDraftRatio",
        label: "Draft Ratio (D)",
        min: 3.0,
        max: 10.0,
        step: 0.5,
        defaultValue: 6.0,
        unit: "×",
        provenance: "scenario-reader",
      },
      {
        id: "rollerClampingWeightKg",
        label: "Roller Pressure Weight",
        min: 1.0,
        max: 6.0,
        step: 0.5,
        defaultValue: 3.5,
        unit: "kg",
        provenance: "scenario-reader",
      },
      {
        id: "stapleLengthMm",
        label: "Cotton Staple Length",
        min: 20,
        max: 38,
        step: 1,
        defaultValue: 28,
        unit: "mm",
        provenance: "scenario-reader",
      },
      {
        id: "inputRovingCountNe",
        label: "Input Roving Count",
        min: 0.5,
        max: 2.0,
        step: 0.1,
        defaultValue: 1.0,
        unit: "Ne",
        provenance: "scenario-reader",
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
          provenance: "scenario-modern",
        },
        {
          label: "Yarn Count (English)",
          value: `${arkwright.outputYarnCountNe.toFixed(1)} Ne`,
          unit: `${arkwright.yarnLinearDensityTex.toFixed(1)} Tex`,
          badgeColor: "amber",
          progressPct: Math.min(100, (arkwright.outputYarnCountNe / 16.0) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Imparted Twist",
          value: `${Math.round(arkwright.twistTurnsPerMeter).toLocaleString()} TPM`,
          unit: `${arkwright.twistTurnsPerInch.toFixed(1)} TPI`,
          badgeColor: "indigo",
          progressPct: Math.min(100, (arkwright.twistTurnsPerMeter / 800.0) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Fiber Parallelization",
          value: `${arkwright.fiberParallelizationPct.toFixed(1)}%`,
          unit: "slip-free",
          badgeColor: "emerald",
          progressPct: arkwright.fiberParallelizationPct,
          provenance: "scenario-modern",
        },
        {
          label: "Yarn Breaking Strength",
          value: `${arkwright.yarnBreakingForceN.toFixed(2)} N`,
          unit: arkwright.isWarpGradeWaterTwist ? "Warp-Grade" : "Weft-Only",
          badgeColor: arkwright.isWarpGradeWaterTwist ? "emerald" : "rose",
          progressPct: Math.min(100, (arkwright.yarnBreakingForceN / 4.0) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Cromford Mill Output",
          value: `${arkwright.millProductionKgPerDay.toFixed(1)} kg/day`,
          unit: "96 spindles",
          badgeColor: "purple",
          progressPct: Math.min(100, (arkwright.millProductionKgPerDay / 15.0) * 100),
          provenance: "scenario-modern",
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
      "N_s(\\omega_s-\\omega_c)+N_p(\\omega_p-\\omega_c)=0 \\quad \\text{and} \\quad \\Delta\\theta_s=2\\pi\\left(1+\\frac{N_p}{N_s}\\right)",
    engineMethod:
      "stepWattRotaryEngine (source-bounded TypeScript closed linkage; fs-mbd holonomic gear constraints unavailable)",
    controls: [
      {
        id: "strokeRateSpm",
        label: "Scenario Beam Stroke Rate",
        min: 10,
        max: 30,
        step: 2,
        defaultValue: 20,
        unit: "SPM",
        provenance: "scenario-reader",
      },
      {
        id: "boilerPressureKpa",
        label: "Scenario Effective Steam Pressure",
        min: 40,
        max: 120,
        step: 5,
        defaultValue: 70,
        unit: "kPa",
        provenance: "scenario-reader",
      },
      {
        id: "gearRatioNpOverNs",
        label: "Planet / Sun Gear Ratio",
        min: 0.5,
        max: 2.0,
        step: 0.25,
        defaultValue: 1.0,
        unit: "ratio",
        provenance: "scenario-reader",
      },
      {
        id: "flywheelMassKg",
        label: "Scenario Flywheel Mass",
        min: 1000,
        max: 6000,
        step: 250,
        defaultValue: 3500,
        unit: "kg",
        provenance: "scenario-reader",
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
          value: `${watt.meanShaftRpm.toFixed(1)} RPM mean`,
          unit: `${watt.speedMultiplier.toFixed(1)}× Speed Multiplier`,
          badgeColor: "amber",
          progressPct: Math.min(100, (watt.meanShaftRpm / 60.0) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Scenario Ideal Shaft Power",
          value: `${watt.meanPowerKw.toFixed(1)} kW`,
          unit: `${watt.indicatedHorsepower.toFixed(1)} hp indicated`,
          badgeColor: "emerald",
          progressPct: Math.min(100, (watt.meanPowerKw / 40.0) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Piston Driving Force",
          value: `${(watt.pistonForceN / 1e3).toFixed(1)} kN`,
          unit: "Single-acting condensing",
          badgeColor: "rose",
          progressPct: Math.min(100, (watt.pistonForceN / 50e3) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Tooth Contact Force",
          value: `${(watt.tangentialToothForceN / 1e3).toFixed(1)} kN`,
          unit: "Pitch line spur mesh",
          badgeColor: "cyan",
          progressPct: Math.min(100, (watt.tangentialToothForceN / 25e3) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Flywheel Kinetic Energy",
          value: `${(watt.flywheelKineticEnergyJ / 1e3).toFixed(1)} kJ`,
          unit: `I = 10,080 kg·m²`,
          badgeColor: "indigo",
          progressPct: Math.min(100, (watt.flywheelKineticEnergyJ / 200e3) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Speed Fluctuation (δ)",
          value: `${(watt.speedFluctuationCoeff * 100).toFixed(1)}%`,
          unit: "Flywheel smoothing",
          badgeColor: "purple",
          progressPct: Math.min(100, (watt.speedFluctuationCoeff / 0.15) * 100),
          provenance: "scenario-modern",
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
        provenance: "scenario-modern",
      },
      {
        id: "initialCarbonPercent",
        label: "Pig Iron Carbon",
        min: 2.8,
        max: 4.5,
        step: 0.1,
        defaultValue: 3.8,
        unit: "% C",
        provenance: "scenario-modern",
      },
      {
        id: "rabbleStirringRpm",
        label: "Rabble Stirring Rate",
        min: 0,
        max: 25,
        step: 5,
        defaultValue: 15,
        unit: "RPM",
        provenance: "scenario-modern",
      },
      {
        id: "puddlingDurationMinutes",
        label: "Puddling Time",
        min: 30,
        max: 150,
        step: 10,
        defaultValue: 90,
        unit: "min",
        provenance: "scenario-modern",
      },
      {
        id: "rollerPassCount",
        label: "Grooved Roll Passes",
        min: 1,
        max: 8,
        step: 1,
        defaultValue: 5,
        unit: "passes",
        provenance: "scenario-modern",
      },
    ],
    computeMetrics: (p) => {
      const cort = stepCortPuddlingRolling({
        furnaceTemperatureCelsius: p.furnaceTemperatureCelsius ?? 1350,
        initialCarbonPercent: p.initialCarbonPercent ?? 3.8,
        rabbleStirringRpm: p.rabbleStirringRpm ?? 15,
        puddlingDurationMinutes: p.puddlingDurationMinutes ?? 90,
        rollerPassCount: p.rollerPassCount ?? 5,
      });

      return [
        {
          label: "Residual Carbon",
          value: `${cort.residualCarbonPercent.toFixed(2)}% C`,
          unit: cort.isPastyNatureState ? "Decarburized Wrought" : "Liquid Pig Iron",
          badgeColor: cort.isPastyNatureState ? "emerald" : "amber",
          progressPct: Math.min(100, (cort.residualCarbonPercent / 4.0) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Iron Melting Point",
          value: `${cort.ironMeltingPointCelsius} °C`,
          unit: `Solidus (+${cort.ironMeltingPointCelsius - 1147} °C rise)`,
          badgeColor: "rose",
          progressPct: Math.min(100, ((cort.ironMeltingPointCelsius - 1100) / 450) * 100),
          provenance: "scenario-modern",
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
          provenance: "scenario-modern",
        },
        {
          label: "Residual Slag Content",
          value: `${cort.residualSlagVolumeFractionPercent.toFixed(1)}%`,
          unit: `Expelled ${cort.slagExpelledKg.toFixed(1)} kg`,
          badgeColor: "indigo",
          progressPct: Math.min(100, (cort.residualSlagVolumeFractionPercent / 16.0) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Tensile Strength",
          value: `${cort.tensileStrengthMpa.toFixed(0)} MPa`,
          unit: `${cort.ductilityElongationPercent.toFixed(0)}% Elongation`,
          badgeColor: "emerald",
          progressPct: Math.min(100, (cort.tensileStrengthMpa / 380.0) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Roll Squeeze Pressure",
          value: `${cort.hydrostaticSqueezePressureMpa.toFixed(0)} MPa`,
          unit: `Separation ${cort.rollSeparationForceKn.toFixed(0)} kN`,
          badgeColor: "amber",
          progressPct: Math.min(100, (cort.hydrostaticSqueezePressureMpa / 300) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Industrial Speedup",
          value: `${cort.productionSpeedupVsHammer}×`,
          unit: `${cort.hourlyIronOutputKg} kg/h vs hammer`,
          badgeColor: "purple",
          progressPct: 100,
          provenance: "scenario-modern",
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
        provenance: "scenario-modern",
      },
      {
        id: "bathTemperatureCelsius",
        label: "Cryolite Bath Temp",
        min: 920,
        max: 1020,
        step: 5,
        defaultValue: 960,
        unit: "°C",
        provenance: "scenario-modern",
      },
      {
        id: "aluminaConcentrationPct",
        label: "Alumina (Al₂O₃) Conc",
        min: 2,
        max: 8,
        step: 0.5,
        defaultValue: 5.5,
        unit: "%",
        provenance: "scenario-modern",
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
          provenance: "scenario-modern",
        },
        {
          label: "Current Efficiency",
          value: `${hall.currentEfficiencyPct.toFixed(1)}%`,
          unit: "η_curr",
          badgeColor: "emerald",
          progressPct: clampProgress(hall.currentEfficiencyPct),
          provenance: "scenario-modern",
        },
        {
          label: "Total Cell Voltage",
          value: `${hall.totalCellVoltage.toFixed(2)} V`,
          unit: "V_cell",
          badgeColor: "amber",
          progressPct: clampProgress((hall.totalCellVoltage / 6) * 100),
          provenance: "scenario-modern",
        },
        {
          label: "Specific Energy",
          value: `${hall.specificEnergyKwhPerKg.toFixed(2)} kWh/kg`,
          unit: "E_spec",
          badgeColor: "purple",
          progressPct: clampProgress((hall.specificEnergyKwhPerKg / 20) * 100),
          provenance: "scenario-modern",
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
    domain: "source_bounded_video_signal_topology",
    domainTitle: "Source-Bound Video Signal Gating & Analysis",
    equationName: "Claim 1 Signal-Path Admission",
    governingEquation: "C = S \\land G \\land A \\land I",
    engineMethod:
      "stepLemelsonMachineVisionTopology (deterministic TypeScript source-bounded signal topology; no calibrated beam velocity, optical responsivity, solenoid force, or response model)",
    controls: [
      {
        id: "scanPathEnabled",
        label: "Electron-beam scan path",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "off/on",
        provenance: "source-disclosed",
      },
      {
        id: "synchronizedGateEnabled",
        label: "Synchronized programming gate",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "off/on",
        provenance: "source-disclosed",
      },
      {
        id: "analyzingCircuitEnabled",
        label: "Analyzing circuit",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "off/on",
        provenance: "source-disclosed",
      },
      {
        id: "inspectionSignalPresent",
        label: "Picture signal at inspection",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "off/on",
        provenance: "source-disclosed",
      },
      {
        id: "referenceSignalMatches",
        label: "Reference comparison",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "difference/match",
        provenance: "source-disclosed",
      },
    ],
    computeMetrics(rawParams) {
      const controls = readLemelsonMachineVisionControls(rawParams);
      const state = stepLemelsonMachineVisionTopology(controls);
      return [
        {
          label: "Scan path",
          value: state.scanPathActive ? "ACTIVE" : "WITHHELD",
          unit: "claim topology",
          badgeColor: "emerald",
          progressPct: state.scanPathActive ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Synchronized gate",
          value: state.synchronizedGateActive ? "PASS" : "WITHHELD",
          unit: "claim topology",
          badgeColor: "cyan",
          progressPct: state.synchronizedGateActive ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Analyzing circuit",
          value: state.analyzingCircuitActive ? "INSPECTING" : "WITHHELD",
          unit: "claim topology",
          badgeColor: "indigo",
          progressPct: state.analyzingCircuitActive ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Inspection signal",
          value: state.inspectionSignalPresent ? "PRESENT" : "WITHHELD",
          unit: "claim topology",
          badgeColor: "amber",
          progressPct: state.inspectionSignalPresent ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Control output",
          value: state.controlOutputReady ? "READY" : "HELD",
          unit: "source topology",
          badgeColor: "purple",
          progressPct: state.controlOutputReady ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Quantitative mechanics",
          value: "WITHHELD",
          unit: "missing source inputs",
          badgeColor: "amber",
          progressPct: 0,
          provenance: "refusal-bounded",
        },
      ];
    },
    pedagogicalInsight:
      "US 3,081,379 connects a scan path, synchronized programming and gating, an analyzing circuit, and a control output. The grant does not establish a calibrated raster rate, image-field dimension, optical response, comparator threshold, coil geometry, force, or actuator response, so this exhibit reports only the printed signal topology.",
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
      const pose = state.displayPose;
      return [
        {
          label: "Carriage Coordinate X",
          value: pose.carriageNormalizedX.toFixed(2),
          unit: "normalized travel",
          badgeColor: "cyan",
          progressPct: clampProgress(((pose.carriageNormalizedX + 1) / 2) * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Tool Display Pose",
          value: `${pose.toolTipX.toFixed(2)}, ${pose.toolTipY.toFixed(2)}, ${pose.toolTipZ.toFixed(2)}`,
          unit: "normalized x / y / z",
          badgeColor: "emerald",
          provenance: "topology-normalized",
        },
        {
          label: "Jaw Closure Command",
          value: state.controls.jawClosure.toFixed(2),
          unit: "normalized closure",
          badgeColor: "rose",
          progressPct: clampProgress(state.controls.jawClosure * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Selected Limit Coordinates",
          value: `${state.controls.stop1Azimuth.toFixed(2)} / ${state.controls.stop2Azimuth.toFixed(2)} · ${state.controls.stop1Elevation.toFixed(2)} / ${state.controls.stop2Elevation.toFixed(2)}`,
          unit: "azimuth / elevation",
          badgeColor: "amber",
          provenance: "topology-normalized",
        },
        {
          label: "Active Relay Phase",
          value: state.sequencer.phaseName.toUpperCase(),
          unit: "state",
          badgeColor: "cyan",
          provenance: "source-disclosed",
        },
        {
          label: "Active Drive Motor",
          value: state.sequencer.activeMotor.toUpperCase(),
          unit: "actuator",
          badgeColor: state.sequencer.activeMotor === "idle" ? "amber" : "emerald",
          provenance: "source-disclosed",
        },
        {
          label: "Limit Switches Tripped",
          value: `${state.sequencer.trippedLimitSwitches.length} TRIPPED`,
          unit: "switches",
          badgeColor: state.sequencer.trippedLimitSwitches.length > 0 ? "rose" : "indigo",
          provenance: "source-disclosed",
        },
        {
          label: "Gripper State",
          value: state.displayPose.gripperState.toUpperCase(),
          unit: "end effector",
          badgeColor: state.displayPose.gripperState === "gripping" ? "emerald" : "indigo",
          progressPct: clampProgress((1 - state.displayPose.jawOpeningFraction) * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Active Claim Scope",
          value: `Claim ${state.activeClaim} ${state.activeClaimStatus}`,
          unit: "legal boundary",
          badgeColor: state.activeClaimStatus === "withheld" ? "rose" : "purple",
          provenance: "source-disclosed",
        },
        {
          label: "Kinematic Refusal",
          value: "REFUSED",
          unit: "boundary active",
          badgeColor: "purple",
          provenance: "refusal-bounded",
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
    engineMethod: `${MAKINO_FRANKENSIM_OWNER} law owner identified; ${MAKINO_FRANKENSIM_BOUNDARY}; stepMakinoScaraTopology supplies exact normalized closure`,
    controls: [
      {
        id: "firstLinkAngleDeg",
        label: "First-link angle θ₁",
        min: -180,
        max: 180,
        step: 1,
        defaultValue: 32,
        unit: "°",
        provenance: "scenario-reader",
      },
      {
        id: "fourthLinkAngleDeg",
        label: "Fourth-link angle θ₂",
        min: -180,
        max: 180,
        step: 1,
        defaultValue: -38,
        unit: "°",
        provenance: "scenario-reader",
      },
      {
        id: "toolAttitudeDeg",
        label: "Tool attitude φ",
        min: -180,
        max: 180,
        step: 1,
        defaultValue: 0,
        unit: "°",
        provenance: "scenario-reader",
      },
      {
        id: "topologyVariant",
        label: "Claim topology",
        min: 1,
        max: 3,
        step: 1,
        defaultValue: 1,
        unit: "claim form",
        provenance: "source-disclosed",
      },
    ],
    computeMetrics: (params) => {
      const pose = stepMakinoScaraTopology(params);
      const invariants = measureMakinoScaraInvariants(pose);
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
          provenance: "source-disclosed",
        },
        {
          label: "First-link Angle",
          value: (pose.firstLinkAngleRad * (180 / Math.PI)).toFixed(0),
          unit: "° θ₁",
          badgeColor: "cyan",
          progressPct: clampProgress(((pose.firstLinkAngleRad * 180) / Math.PI + 180) / 3.6),
          provenance: "scenario-reader",
        },
        {
          label: "Fourth-link Angle",
          value: (pose.fourthLinkAngleRad * (180 / Math.PI)).toFixed(0),
          unit: "° θ₂",
          badgeColor: "amber",
          progressPct: clampProgress(((pose.fourthLinkAngleRad * 180) / Math.PI + 180) / 3.6),
          provenance: "scenario-reader",
        },
        {
          label: "Tool Projection",
          value: `(${pose.tool[0].toFixed(2)}, ${pose.tool[1].toFixed(2)})`,
          unit: "normalized",
          badgeColor: "emerald",
          provenance: "scenario-reader",
        },
        {
          label: "Tool Attitude",
          value: ((pose.toolAttitudeRad * 180) / Math.PI).toFixed(0),
          unit: pose.beltTransmissionAvailable ? "° φ · belts 11/12" : "° · Claim 6 fixed",
          badgeColor: "emerald",
          progressPct: clampProgress(((pose.toolAttitudeRad * 180) / Math.PI + 180) / 3.6),
          provenance: "scenario-reader",
        },
        {
          label: "Fixed-Member Closure",
          value: invariants.fixedMemberError.toExponential(1),
          unit: "normalized error",
          badgeColor: invariants.fixedMemberError < 1e-10 ? "emerald" : "rose",
          progressPct: invariants.fixedMemberError < 1e-10 ? 100 : 0,
          provenance: "source-disclosed",
        },
      ];
    },
    pedagogicalInsight: `The grant supplies a topology and the two driven angles θ₁ and θ₂, plus belt-drive and Y-link claim forms. ${MAKINO_FRANKENSIM_OWNER} owns the vertical revolute joints, but the grant withholds dimensions, masses, payload, torque, stiffness, and servo data while fs-mbd's articulated lane does not close loops. The shared instrument therefore enforces exact normalized member closure and openly refuses SI force or performance telemetry.`,
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
    engineMethod: `stepRobotEndEffector · ${ROBOT_END_EFFECTOR_FRANKENSIM_HELICAL_OWNER} typed mirror; ${ROBOT_END_EFFECTOR_FRANKENSIM_REVOLUTE_OWNER} / ${ROBOT_END_EFFECTOR_FRANKENSIM_PRISMATIC_OWNER} owners identified; ${ROBOT_END_EFFECTOR_FRANKENSIM_CONTACT_OWNER} solve refused`,
    controls: [
      {
        id: "jawOpeningFraction",
        label: "Typical jaw-opening fraction",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 0.52,
        unit: "of 152.4 mm",
        provenance: "scenario-reader",
      },
      {
        id: "gripForceSetpointN",
        label: "Requested grip command",
        min: 0,
        max: 2000,
        step: 25,
        defaultValue: 900,
        unit: "N command (source-max bounded)",
        provenance: "scenario-reader",
      },
      {
        id: "frameRotationDeg",
        label: "Claim 17 frame rotation",
        min: -180,
        max: 180,
        step: 1,
        defaultValue: 0,
        unit: "°",
        provenance: "scenario-reader",
      },
      {
        id: "fingerChangeFraction",
        label: "Claims 13–15 finger change",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 0,
        unit: "retained → fixture",
        provenance: "scenario-reader",
      },
      {
        id: "transverseOffsetFraction",
        label: "Claim 16 transverse stage",
        min: -1,
        max: 1,
        step: 0.05,
        defaultValue: 0,
        unit: "normalized · stroke unprinted",
        provenance: "scenario-reader",
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
          provenance: "source-disclosed",
        },
        {
          label: "Per-Hand Offset",
          value: (state.perHandOffsetM * 1000).toFixed(1),
          unit: "mm · 5 mm/rev lead",
          badgeColor: "emerald",
          progressPct: (state.perHandOffsetM / 0.0762) * 100,
          provenance: "source-disclosed",
        },
        {
          label: "Encoder Phase",
          value: state.encoderCountModulo.toFixed(2),
          unit: "of 8 pegs",
          badgeColor: "amber",
          progressPct: (state.encoderCountModulo / 8) * 100,
          provenance: "source-disclosed",
        },
        {
          label: "Requested Grip",
          value: state.requestedGripForceN.toFixed(0),
          unit: "N · setpoint only",
          badgeColor: "purple",
          progressPct: (state.requestedGripForceN / state.sourceReportedGripForceN) * 100,
          provenance: "scenario-reader",
        },
        {
          label: "Reported Repeatability",
          value: (state.sourceRepeatabilityM * 1000).toFixed(2),
          unit: "mm · source report",
          badgeColor: "indigo",
          progressPct: clampProgress((1 - state.sourceRepeatabilityM / 0.1524) * 100),
          provenance: "source-disclosed",
        },
        {
          label: "Transverse Stage",
          value: state.transverseOffsetNormalized.toFixed(2),
          unit: "normalized · Claim 16",
          badgeColor: "emerald",
          progressPct: (state.transverseOffsetNormalized + 1) * 50,
          provenance: "scenario-reader",
        },
      ];
    },
    pedagogicalInsight: `US 4,765,668 prints an opposed 5 mm-lead ball screw, a typical 6-inch jaw opening, a 43 mm/s maximum hand-travel figure, eight encoder pegs, and 0.05 mm reported repeatability. The shared instrument mirrors ${ROBOT_END_EFFECTOR_FRANKENSIM_HELICAL_OWNER} for exact symmetric displacement and encoder phase, and keeps Claim 16 translation normalized because its stroke is unprinted. Its grip field is a visitor request bounded by the source's 2,000 N prototype maximum: the grant does not supply the material/contact card required by ${ROBOT_END_EFFECTOR_FRANKENSIM_CONTACT_OWNER}, nor enough pneumatic or body data for pressure, payload, power, deflection, or robot-arm dynamics.`,
    enforceConstraints: (params) => ({
      ...params,
      jawOpeningFraction: Math.max(0, Math.min(1, params.jawOpeningFraction ?? 0.52)),
      gripForceSetpointN: Math.max(0, Math.min(2000, params.gripForceSetpointN ?? 900)),
      frameRotationDeg: Math.max(-180, Math.min(180, params.frameRotationDeg ?? 0)),
      fingerChangeFraction: Math.max(0, Math.min(1, params.fingerChangeFraction ?? 0)),
      transverseOffsetFraction: Math.max(-1, Math.min(1, params.transverseOffsetFraction ?? 0)),
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
        provenance: "scenario-reader",
      },
      {
        id: "turnRateRadSec",
        label: "Turn Deflection Rate",
        min: 0.5,
        max: 3.0,
        step: 0.5,
        defaultValue: 1.5,
        unit: "rad/s",
        provenance: "scenario-reader",
      },
      {
        id: "opticalSensorEnabled",
        label: "Claim 1 Optical Redirect Subsystem",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "",
        provenance: "source-disclosed",
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
          provenance: "source-disclosed",
        },
        {
          label: "Surface in Region",
          value: state.surfacePresent ? "PRESENT" : "ABSENT",
          unit: "optical test",
          badgeColor: state.surfacePresent ? "cyan" : "amber",
          progressPct: state.surfacePresent ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Context Drive Speed",
          value: v.toFixed(2),
          unit: "m/s",
          badgeColor: "purple",
          progressPct: clampProgress((v / 1.0) * 100),
          provenance: "scenario-reader",
        },
      ];
    },
    pedagogicalInsight:
      "US 6,594,844 claims a low-cost optical geometry: the emitter and detector fields overlap in a finite region, and the redirect circuit responds when the expected floor or wall does not occupy it. The room motion is a contextual differential-drive demonstrator, not a coverage guarantee.",
  },
  "us-6331181-davinci": {
    domain: "source_bounded_tool_interface_topology",
    domainTitle: "Compatibility, Calibration, and Engagement Data",
    equationName: "Nominal-to-Measured Tool Offset Record",
    governingEquation:
      "\\mathrm{ready}=\\mathrm{compatible}\\land\\mathrm{calibrationRecord}\\land\\mathrm{engagement},\\qquad \\Delta q_{tool}=q_{measured}-q_{nominal}",
    engineMethod:
      "resolveDaVinciInterfaceTopology (source-bounded TypeScript topology; quantitative mechanics refused)",
    controls: [
      {
        id: "compatibilitySignalPresent",
        label: "Compatibility identifier present",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "",
        provenance: "source-disclosed",
      },
      {
        id: "calibrationRecordAvailable",
        label: "Measured calibration record available",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "",
        provenance: "source-disclosed",
      },
      {
        id: "engagementSignalPresent",
        label: "Engagement signal present",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "",
        provenance: "source-disclosed",
      },
    ],
    computeMetrics: (p) => {
      const state = resolveDaVinciInterfaceTopology(readDaVinciInterfaceControls(p));
      return [
        {
          label: "Compatibility identifier",
          value: state.compatibilitySignalPresent ? "present" : "absent",
          unit: "",
          badgeColor: state.compatibilitySignalPresent ? "emerald" : "rose",
          progressPct: state.compatibilitySignalPresent ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Calibration record",
          value: state.calibrationRecordAvailable ? "available" : "missing",
          unit: "",
          badgeColor: state.calibrationRecordAvailable ? "cyan" : "rose",
          progressPct: state.calibrationRecordAvailable ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Engagement",
          value: state.engagementSignalPresent ? "confirmed" : "unconfirmed",
          unit: "",
          badgeColor: state.engagementSignalPresent ? "emerald" : "amber",
          progressPct: state.engagementSignalPresent ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Quantitative mechanics",
          value: "withheld",
          unit: "",
          badgeColor: "amber",
          progressPct: 0,
          provenance: "refusal-bounded",
        },
      ];
    },
    pedagogicalInsight:
      "US 6,331,181 centers tool-boundary data: compatibility, tool type, measured calibration offsets, life information, and engagement signals are transmitted to a processor before or during tool exchange. It does not disclose a universal arm trajectory, contact material model, force, or speed.",
  },
  "us-4512709-milacron-robot-toolchanger": {
    domain: "source_bounded_toolchanger_topology",
    domainTitle: "Registration and Slide-Ramp Capture",
    equationName: "Admission and Capture State Relation",
    governingEquation:
      "q_{reg}^{eff}=q_{reg}^{req}\\;\\text{only if}\\;q_{slide}=0,\\qquad\\mathrm{captured}=\\mathrm{registered}\\land\\mathrm{slideLocked}\\land\\mathrm{TMember}",
    engineMethod:
      "stepMilacronRobotToolchanger · fs-mbd::JointModel::prismatic / fs-contact::normal_patch / fs-tribo::partial_slip owners identified; SI solve refused",
    controls: [
      {
        id: "toolBasePresent",
        label: "Tool base at adapter",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "absent / present",
        provenance: "scenario-reader",
      },
      {
        id: "registrationFraction",
        label: "Pin / bushing registration",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 1,
        unit: "normalized state",
        provenance: "scenario-reader",
      },
      {
        id: "lockingSlideFraction",
        label: "Locking-slide position",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 1,
        unit: "aligned → capture",
        provenance: "scenario-reader",
      },
      {
        id: "claimFourTMember",
        label: "Claim 4 T-member form",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "generic → Claim 4",
        provenance: "scenario-reader",
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
          provenance: "source-disclosed",
        },
        {
          label: "Pin Registration",
          value: state.registrationComplete ? "seated" : "pending",
          unit: "cylindrical + diamond",
          badgeColor: "amber",
          progressPct: state.registrationFraction * 100,
          provenance: "source-disclosed",
        },
        {
          label: "Slide Aperture",
          value: state.apertureAligned ? "aligned" : "offset",
          unit: state.apertureAligned ? "admission / release" : "retention path",
          badgeColor: state.apertureAligned ? "amber" : "emerald",
          progressPct: state.lockingSlideFraction * 100,
          provenance: "source-disclosed",
        },
        {
          label: "Sequence Interlock",
          value: state.registrationMotionBlocked ? "withdrawal blocked" : "admissible",
          unit: state.registrationMotionBlocked ? "align aperture 34 first" : "source order",
          badgeColor: state.registrationMotionBlocked ? "rose" : "emerald",
          progressPct: state.registrationMotionBlocked ? 0 : 100,
          provenance: "source-disclosed",
        },
        {
          label: "Quantitative Mechanics",
          value: "refused",
          unit: "no force / stroke / time data",
          badgeColor: "rose",
          provenance: "refusal-bounded",
        },
      ];
    },
    pedagogicalInsight:
      "US 4,512,709 documents registration on a cylindrical/diamond pin pair, admission through an aligned slide aperture, and capture when the shifted slide ramps bear on a T-member crossbar. A closed slide therefore blocks withdrawal instead of letting the model pass a retained head through solid metal. FrankenSim's generic prismatic-joint and normal-contact owners are identified, but the grant supplies no pressure, bore, stroke, ramp angle, friction, load, or time datum, so the shared instrument refuses performance telemetry.",
  },
  "us-4575330-hull-stereolithography": {
    domain: "additive_manufacturing",
    domainTitle: "Source-Bounded Surface-Lamina Formation & Elevator Topology",
    equationName: "Working-Surface Sequence Constraint",
    governingEquation:
      "q_{\\mathrm{recoat}}=0 \\land s_{\\mathrm{shutter}}=1 \\Rightarrow \\text{spot 27 at surface 23}; \\quad q_{\\mathrm{recoat}}>0 \\Rightarrow s_{\\mathrm{effective}}=0",
    engineMethod:
      "FrankenSimEngine.stepHullStereolithography (source topology; unparameterized owners refused)",
    controls: [
      {
        id: "shutterRequestedOpen",
        label: "Electronic Shutter Request",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: HULL_SLA_DEFAULT_CONTROLS.shutterRequestedOpen,
        unit: "0 closed / 1 open",
        provenance: "topology-normalized",
      },
      {
        id: "scanXFraction",
        label: "Plotter Spot X",
        min: -1,
        max: 1,
        step: 0.05,
        defaultValue: HULL_SLA_DEFAULT_CONTROLS.scanXFraction,
        unit: "normalized",
        provenance: "topology-normalized",
      },
      {
        id: "scanZFraction",
        label: "Plotter Spot Z",
        min: -1,
        max: 1,
        step: 0.05,
        defaultValue: HULL_SLA_DEFAULT_CONTROLS.scanZFraction,
        unit: "normalized",
        provenance: "topology-normalized",
      },
      {
        id: "recoatExcursionFraction",
        label: "Platform Recoating Excursion",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: HULL_SLA_DEFAULT_CONTROLS.recoatExcursionFraction,
        unit: "normalized",
        provenance: "topology-normalized",
      },
      {
        id: "displayLaminaCount",
        label: "Illustrative Integrated Laminae",
        min: 1,
        max: 12,
        step: 1,
        defaultValue: HULL_SLA_DEFAULT_CONTROLS.displayLaminaCount,
        unit: "display layers",
        provenance: "topology-normalized",
      },
    ],
    computeMetrics: (p) => {
      const state = stepHullStereolithographySi(readHullStereolithographyControls(p));
      return [
        {
          label: "Effective Electronic Shutter",
          value: state.shutterOpen ? "open" : "closed",
          unit: state.shutterInterlockActive ? "recoat interlock active" : "source-state",
          badgeColor: state.shutterOpen
            ? "purple"
            : state.shutterInterlockActive
              ? "amber"
              : "cyan",
          provenance: "topology-normalized",
        },
        {
          label: "Spot 27 Position",
          value: `(${state.spotXFraction.toFixed(2)}, ${state.spotZFraction.toFixed(2)})`,
          unit: "normalized plotter travel",
          badgeColor: "cyan",
          provenance: "topology-normalized",
        },
        {
          label: "Platform 29 Position",
          value:
            state.platformDepthFraction <= 0.02
              ? "next-layer working position"
              : "recoating excursion",
          unit: `q=${state.platformDepthFraction.toFixed(2)} normalized`,
          badgeColor: state.platformDepthFraction <= 0.02 ? "emerald" : "amber",
          provenance: "topology-normalized",
        },
        {
          label: "Preferred Lamp Rating",
          value: String(state.printedSourceCard.lampElectricalPowerW),
          unit: "W electrical",
          badgeColor: "amber",
          provenance: "source-disclosed",
          provenanceCitation: "US 4,575,330, preferred Fig. 3 embodiment",
        },
        {
          label: "Preferred Surface UV",
          value: "about 1",
          unit: "W/cm² long-wave UV",
          badgeColor: "purple",
          provenance: "source-disclosed",
          provenanceCitation: "US 4,575,330, preferred Fig. 3 embodiment",
        },
        {
          label: "Quantitative Cure / Motion",
          value: "refused",
          unit: "missing resin and motion cards",
          badgeColor: "rose",
          provenance: "refusal-bounded",
        },
      ];
    },
    pedagogicalInsight:
      "Hull's grant is about forming successive cross-sections at a fixed liquid surface, keeping the growing object on a movable support, and integrating each new lamina with the preceding one. Its preferred working machine used a mercury short-arc lamp, shutter, fiber bundle, lens tube, and digital plotter—not the laser/galvanometer system previously shown here. The relevant FrankenSim prismatic-joint and optical-attenuation owners are identified, but the grant cannot parameterize a motion solve or a photopolymer cure solve, so those numerical outputs remain explicitly refused.",
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
        provenance: "scenario-reader",
      },
      {
        id: "tensionT2N",
        label: "Representative digit tension T₂",
        min: 0,
        max: 40,
        step: 1,
        defaultValue: SALISBURY_HAND_DEFAULT_CONTROLS.tensionT2N,
        unit: "N",
        provenance: "scenario-reader",
      },
      {
        id: "tensionT3N",
        label: "Representative digit tension T₃",
        min: 0,
        max: 40,
        step: 1,
        defaultValue: SALISBURY_HAND_DEFAULT_CONTROLS.tensionT3N,
        unit: "N",
        provenance: "scenario-reader",
      },
      {
        id: "tensionT4N",
        label: "Representative digit tension T₄",
        min: 0,
        max: 40,
        step: 1,
        defaultValue: SALISBURY_HAND_DEFAULT_CONTROLS.tensionT4N,
        unit: "N",
        provenance: "scenario-reader",
      },
      {
        id: "radiusScaleMm",
        label: "Illustrative R₂ scale",
        min: 4,
        max: 20,
        step: 1,
        defaultValue: SALISBURY_HAND_DEFAULT_CONTROLS.radiusScaleMm,
        unit: "mm",
        provenance: "scenario-reader",
      },
      {
        id: "firstIdlerFixed",
        label: "Claim 2 first idler held",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: SALISBURY_HAND_DEFAULT_CONTROLS.firstIdlerFixed ? 1 : 0,
        unit: "0/1",
        provenance: "source-disclosed",
      },
    ],
    computeMetrics: (p) => {
      const controls = readSalisburyRobotHandControls(p);
      const tel = FrankenSimEngine.stepSalisburyRobotHand(controls);
      return [
        {
          label: "Axis 1 source torque",
          value: tel.sourceLawApplicable ? tel.jointTorquesNm[0].toFixed(3) : "withheld",
          unit: tel.sourceLawApplicable ? "N·m" : "Claim 1 route absent",
          badgeColor: tel.sourceLawApplicable ? "indigo" : "rose",
          provenance: "source-disclosed",
        },
        {
          label: "Axis 2 source torque",
          value: tel.sourceLawApplicable ? tel.jointTorquesNm[1].toFixed(3) : "withheld",
          unit: tel.sourceLawApplicable ? "N·m" : "Claim 1 route absent",
          badgeColor: tel.sourceLawApplicable ? "emerald" : "rose",
          provenance: "source-disclosed",
        },
        {
          label: "Axis 3 source torque",
          value: tel.sourceLawApplicable ? tel.jointTorquesNm[2].toFixed(3) : "withheld",
          unit: tel.sourceLawApplicable ? "N·m" : "Claim 1 route absent",
          badgeColor: tel.sourceLawApplicable ? "amber" : "rose",
          provenance: "source-disclosed",
        },
        {
          label: "Connected source topology",
          value: `${tel.claim1RoutingProbe ? tel.digitCount : 0} palm-rooted digits / ${tel.activeJointCoordinates} joints / ${tel.activeCableEndCount} cable ends`,
          unit: "",
          badgeColor: tel.claim1RoutingProbe ? "emerald" : "rose",
          progressPct: tel.claim1RoutingProbe ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Historic dynamics",
          value: "not disclosed",
          unit: "",
          badgeColor: "amber",
          provenance: "refusal-bounded",
        },
      ];
    },
    pedagogicalInsight:
      "Ruoff and Salisbury print three static equations for one digit's Figure 3 route: four measured cable tensions and selected pulley radii combine into three joint torques. fs-mbd::salisbury owns that source law and its three palm-rooted serial revolute chains. The physical hand has three articulated digits, nine joint coordinates, and twelve separately routed cable ends; the exhibit mirrors the representative digit pose across all three. The grant supplies no historic dimensions, dynamics, contact law, grasp force, force-closure result, or stability margin.",
  },
  "us-4976582-clavel-delta-robot": {
    domain: "source_bounded_robot_kinematics",
    domainTitle: "Parallel-Arm and Spatial-Parallelogram Topology",
    equationName: "Normalized Paired-Bar Attitude Constraint",
    governingEquation:
      "\\mathbf{p}^{*}+\\mathbf{a}_i^{*}=\\mathbf{e}_i^{*}+\\mathbf{l}_{i,j}^{*};\\quad\\lVert\\mathbf{l}_{i,a}^{*}\\rVert=\\lVert\\mathbf{l}_{i,b}^{*}\\rVert=L^{*};\\quad\\mathbf{l}_{i,a}^{*}-\\mathbf{l}_{i,b}^{*}=\\mathbf{d}_i^{*}",
    engineMethod:
      "stepClavelDeltaRobotTopology (source-bounded TypeScript normalized closed-chain topology; generic fs-mbd lacks holonomic loop constraints; no FrankenSim/WASM module)",
    controls: [
      {
        id: "armOneInput",
        label: "Control arm 1 input",
        min: -1,
        max: 1,
        step: 0.02,
        defaultValue: 0.12,
        unit: "normalized input",
        provenance: "topology-normalized",
      },
      {
        id: "armTwoInput",
        label: "Control arm 2 input",
        min: -1,
        max: 1,
        step: 0.02,
        defaultValue: -0.18,
        unit: "normalized input",
        provenance: "topology-normalized",
      },
      {
        id: "armThreeInput",
        label: "Control arm 3 input",
        min: -1,
        max: 1,
        step: 0.02,
        defaultValue: 0.06,
        unit: "normalized input",
        provenance: "topology-normalized",
      },
      {
        id: "toolAxisInput",
        label: "Working-member axis input",
        min: -1,
        max: 1,
        step: 0.02,
        defaultValue: 0,
        unit: "normalized rotation",
        provenance: "topology-normalized",
      },
      {
        id: "claim1TopologyEnabled",
        label: "Claim 1 three-actuator topology",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "claim probe",
        provenance: "source-disclosed",
      },
      {
        id: "claim2PairedBarsEnabled",
        label: "Claim 2 paired parallel bars",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "claim probe",
        provenance: "source-disclosed",
      },
      {
        id: "claim8BaseMotorEnabled",
        label: "Claim 8 base tool-axis motor",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "claim probe",
        provenance: "source-disclosed",
      },
    ],
    computeMetrics: (params) => {
      const state = stepClavelDeltaRobotTopology(params);
      const maximumPairedBarError = Math.max(...state.legs.map((leg) => leg.pairedBarVectorError));
      return [
        {
          label: "Claim Topology",
          value: state.topologyVisible ? "VISIBLE" : "WITHHELD",
          unit: state.topologyVisible ? "Claim 1" : "Claim 1 probe",
          badgeColor: state.topologyVisible ? "emerald" : "rose",
          progressPct: state.topologyVisible ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Paired Bars",
          value: state.pairedBarsVisible ? "2 / LEG" : "WITHHELD",
          unit: state.pairedBarsVisible ? "Claim 2" : "Claim 2 probe",
          badgeColor: state.pairedBarsVisible ? "cyan" : "rose",
          progressPct: state.pairedBarsVisible ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Declared bar length",
          value: state.normalizedBarLength.toFixed(3),
          unit: "normalized exhibit length",
          badgeColor: "purple",
          provenance: "topology-normalized",
        },
        {
          label: "Rigid-link closure residual",
          value: state.closureResidual.toExponential(2),
          unit: "normalized construction",
          badgeColor: state.closureResidual < 1e-9 ? "emerald" : "amber",
          progressPct: clampProgress(100 - state.closureResidual * 1e12),
          provenance: "topology-normalized",
        },
        {
          label: "Pair-vector residual",
          value: maximumPairedBarError.toFixed(3),
          unit: "normalized construction",
          badgeColor: maximumPairedBarError < 1e-9 ? "emerald" : "amber",
          progressPct: clampProgress(100 - maximumPairedBarError * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Platform center",
          value: `(${state.platformCenter.map((value) => value.toFixed(2)).join(", ")})`,
          unit: "normalized display",
          badgeColor: "purple",
          provenance: "topology-normalized",
        },
        {
          label: "Physical performance",
          value: "refused",
          unit: "no source dimensions or dynamics",
          badgeColor: "rose",
          provenance: "refusal-bounded",
        },
      ];
    },
    pedagogicalInsight:
      "US 4,976,582 discloses three fixed-support actuators, articulated linking means, and an orientation-preserving movable member; the pictured first form visibly uses two parallel bars per leg. The exhibit solves a declared normalized rigid-link closure so the visible bars do not telescope, but those lengths are not historical measurements. The grant supplies no dimensions, motor data, payload, stiffness, speed, accuracy, or control law, and generic fs-mbd does not own holonomic closed loops; the shared bus therefore exposes topology plus an explicit refusal boundary rather than fictional Delta-robot performance telemetry.",
  },
  "us-5121329-crump-fdm": {
    domain: "thermodynamics",
    domainTitle: "FDM Relative Motion, Reduced Melt-Flow & Thermal Screening",
    equationName: "Metered Deposition, Newtonian Capillary Screen & First-Mode Cooling",
    governingEquation:
      "Q = w h v_{\\text{head}}, \\quad \\Delta P = \\frac{8 \\mu L Q}{\\pi R^4}, \\quad \\tau = \\frac{h^2}{\\pi^2 \\alpha}",
    engineMethod: "fs-flux::capillary + fs-conduction::reduced_slab through fs-crump-wasm",
    controls: [
      {
        id: "nozzleTempC",
        label: "Liquefier Nozzle Temperature",
        min: 140,
        max: 280,
        step: 5,
        defaultValue: CRUMP_FDM_DEFAULT_CONTROLS.nozzleTempC,
        unit: "°C",
        provenance: "scenario-reader",
      },
      {
        id: "printSpeedMmS",
        label: "Toolhead Print Speed",
        min: 10,
        max: 150,
        step: 5,
        defaultValue: CRUMP_FDM_DEFAULT_CONTROLS.printSpeedMmS,
        unit: "mm/s",
        provenance: "scenario-reader",
      },
      {
        id: "layerHeightMm",
        label: "Layer Height (h)",
        min: 0.05,
        max: 0.5,
        step: 0.05,
        defaultValue: CRUMP_FDM_DEFAULT_CONTROLS.layerHeightMm,
        unit: "mm",
        provenance: "scenario-reader",
      },
      {
        id: "roadWidthMm",
        label: "Extruded Road Width (w)",
        min: 0.2,
        max: 1.0,
        step: 0.05,
        defaultValue: CRUMP_FDM_DEFAULT_CONTROLS.roadWidthMm,
        unit: "mm",
        provenance: "scenario-reader",
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
          provenance: "scenario-modern",
        },
        {
          label: "Filament Feed Speed (v_feed)",
          value: tel.filamentFeedSpeedMmS.toFixed(2),
          unit: "mm/s",
          badgeColor: "emerald",
          provenance: "scenario-modern",
        },
        {
          label: "Newtonian Pressure Screen (ΔP)",
          value: tel.nozzlePressureDropMPa.toFixed(3),
          unit: "MPa",
          badgeColor: "amber",
          provenance: "scenario-modern",
        },
        {
          label: "Axial Feed Drive Force",
          value: tel.feedDriveForceN.toFixed(1),
          unit: "N",
          badgeColor: tel.filamentGrindingRefusal ? "rose" : "emerald",
          provenance: "scenario-modern",
        },
        {
          label: "First-Mode Cooling Constant (τ)",
          value: (tel.coolingTimeConstantSec * 1000).toFixed(0),
          unit: "ms",
          badgeColor: "cyan",
          provenance: "scenario-modern",
        },
        {
          label: "Interface Thermal Margin (T_int − Tg)",
          value: tel.interfaceTemperatureMarginC.toFixed(1),
          unit: "°C",
          badgeColor: tel.interfaceAboveGlassTransition ? "emerald" : "rose",
          provenance: "scenario-modern",
        },
      ];
    },
    pedagogicalInsight:
      "Claim 1 covers the broader metered fluid-state head/base/relative-motion apparatus; Claim 2 separately adds heating, and Claim 39 separately claims a substantially planar nozzle bottom maintained at a controlled gap for a shearing or doctor-blade effect. The displayed pressure and cooling values are modern illustrative screens owned by generic FrankenSim laws, not dimensions or performance measurements printed in US 5,121,329.",
  },
  "us-5701965-kamen-transporter": {
    domain: "source_dimensioned_tri_wheel_contact",
    domainTitle: "Source-Dimensioned Tri-Wheel Balance & Stair Contact",
    equationName: "Rigid Three-Wheel Carrier Support Relation",
    governingEquation:
      "x_i=x_c+l\\cos(\\phi+2\\pi i/3),\\quad y_i=y_c+l\\sin(\\phi+2\\pi i/3),\\quad g_i=y_i-r-h(x_i)\\ge 0,\\quad \\rho_i=\\min_k(\\|c_i-q_k\\|-r)\\ge 0",
    engineMethod:
      "fs-kamen-wasm source adapter over fs-mbd::tri_wheel_cluster with typed equation-identical fallback",
    controls: [
      {
        id: "topologyState",
        label: "Claim-reading state",
        min: 0,
        max: 5,
        step: 1,
        defaultValue: 1,
        unit: "state",
        provenance: "source-disclosed",
      },
    ],
    computeMetrics: (p) => {
      const controls = readKamenTransporterControls(p);
      const topology = stepKamenTransporterPhysics(controls, "ts-fallback");
      return [
        {
          label: "Claim-reading state",
          value: topology.stateLabel.toUpperCase(),
          unit: "source topology",
          badgeColor: "emerald",
          progressPct: 100,
          provenance: "source-disclosed",
        },
        {
          label: "Ground-module control",
          value: topology.wheelControlMode.replaceAll("-", " ").toUpperCase(),
          unit: "claim topology",
          badgeColor: topology.wheelControlMode === "topology-withheld" ? "amber" : "cyan",
          progressPct: topology.wheelControlMode === "topology-withheld" ? 0 : 100,
          provenance: "source-disclosed",
        },
        {
          label: "Claim references",
          value: topology.sourceClaimNumbers.map((claim) => `C${claim}`).join(" · "),
          unit: "printed claim relations",
          badgeColor: "indigo",
          progressPct: 100,
          provenance: "source-disclosed",
        },
        {
          label: "Balance-loop relation",
          value: topology.balanceLoopActive ? "PRESENT" : "WITHHELD",
          unit: "source topology",
          badgeColor: topology.balanceLoopActive ? "emerald" : "amber",
          progressPct: topology.balanceLoopActive ? 100 : 0,
          provenance: "source-disclosed",
        },
        {
          label: "Horizontal support contacts",
          value: topology.displayPose.contactWheelIds.join(" + ").toUpperCase(),
          unit: `${topology.displayPose.contactCount} wheel${topology.displayPose.contactCount === 1 ? "" : "s"}`,
          badgeColor: "emerald",
          progressPct: 100,
          provenance: "source-disclosed",
          provenanceCitation: topology.sourceGeometryReceipt,
        },
        {
          label: "Finite-riser contacts",
          value: topology.displayPose.stairActive
            ? topology.displayPose.riserContactCount > 0
              ? topology.displayPose.riserContactWheelIds.join(" + ").toUpperCase()
              : "CLEAR"
            : "NOT ACTIVE",
          unit: topology.displayPose.stairActive
            ? `${topology.displayPose.riserContactCount} tangent wheel${topology.displayPose.riserContactCount === 1 ? "" : "s"}`
            : "level-ground state",
          badgeColor: topology.displayPose.riserContactCount > 0 ? "rose" : "emerald",
          progressPct: 100,
          provenance: "source-disclosed",
          provenanceCitation: topology.sourceGeometryReceipt,
        },
        {
          label: "Nominal source geometry",
          value: "r 3.810 · l 5.581 · h 6.850 · d 10.900",
          unit: "inches · Table 1",
          badgeColor: "cyan",
          progressPct: 100,
          provenance: "source-disclosed",
          provenanceCitation: topology.sourceGeometryReceipt,
        },
        {
          label: "Quantitative dynamics",
          value: "WITHHELD",
          unit: "missing source inputs",
          badgeColor: "amber",
          progressPct: 0,
          provenance: "refusal-bounded",
          provenanceCitation: topology.sourceBoundary,
        },
      ];
    },
    pedagogicalInsight:
      "US 5,701,965 records a three-equal-wheel cluster, nominal wheel/carrier/stair geometry, independently controlled ground wheels, and the ordered balance/transfer/climb sequence. Table 1's z is the upper-wheel tread offset beyond the riser; the lower wheel is one radius before the edge and tangent to the vertical face. The fs-mbd owner resolves all three wheel centers and refuses horizontal-support or finite-riser penetration. It does not forecast vehicle dynamics because the facsimile omits the mass/inertia, motor, controller, sensor, friction, compliance, impact, and contact inputs needed to do so.",
  },
  "us-6302230-kamen-segway": {
    domain: "robotics_locomotion",
    domainTitle: "Inverted Pendulum Dynamic Balancing & Balancing Margin Supervision",
    equationName:
      "Modern Illustrative Inverted-Pendulum Scenario & Source-Disclosed Margin Relation",
    governingEquation:
      "Modern illustrative mechanics: \\tau_{\\text{motor}} = M g L \\sin\\theta + M L \\ddot{x} \\cos\\theta; source relationship (Claim 1): balancing margin is the difference between maximum operating velocity and present velocity.",
    engineMethod: "TypeScript modern illustrative Kamen Segway kernel",
    provenance: "scenario-modern",
    controls: [
      {
        id: "riderPitchDeg",
        label: "Rider Pitch Lean",
        min: -15,
        max: 15,
        step: 0.5,
        defaultValue: KAMEN_SEGWAY_DEFAULT_CONTROLS.riderPitchDeg,
        unit: "°",
        provenance: "scenario-modern",
        provenanceCitation:
          "Reader-set modern illustrative lean input; US 6,302,230 prints no lean-angle range.",
      },
      {
        id: "steeringInput",
        label: "Handlebar Steering Yaw",
        min: -1.0,
        max: 1.0,
        step: 0.1,
        defaultValue: KAMEN_SEGWAY_DEFAULT_CONTROLS.steeringInput,
        unit: "yaw",
        provenance: "scenario-modern",
        provenanceCitation:
          "Reader-set modern illustrative steering input; not a numerical grant value.",
      },
      {
        id: "riderMassKg",
        label: "Rider Body Mass",
        min: 40,
        max: 120,
        step: 5,
        defaultValue: KAMEN_SEGWAY_DEFAULT_CONTROLS.riderMassKg,
        unit: "kg",
        provenance: "scenario-modern",
        provenanceCitation:
          "Reader-set modern illustrative payload input; not a numerical grant value.",
      },
      {
        id: "groundFrictionCoeff",
        label: "Ground Traction (μ)",
        min: 0.15,
        max: 0.95,
        step: 0.05,
        defaultValue: KAMEN_SEGWAY_DEFAULT_CONTROLS.groundFrictionCoeff,
        unit: "μ",
        provenance: "scenario-modern",
        provenanceCitation:
          "Reader-set modern tire-contact scenario; US 6,302,230 names an underlying surface but prints no friction coefficient.",
      },
      {
        id: "speedLimitMS",
        label: "Illustrative Maximum Operating Velocity",
        min: 2.0,
        max: 6.0,
        step: 0.5,
        defaultValue: KAMEN_SEGWAY_DEFAULT_CONTROLS.speedLimitMS,
        unit: "m/s",
        provenance: "scenario-modern",
        provenanceCitation:
          "Reader-set modern illustrative velocity bound; Claim 1 names a maximum operating velocity without printing a number.",
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
            provenance: "refusal-bounded",
            provenanceCitation:
              "Claim 1 states unpowered tipping instability; the kernel deliberately refuses a quantitative counterfactual beyond that source boundary.",
          },
          {
            label: "Pitch Angle",
            value: parsed.riderPitchDeg.toFixed(1),
            unit: "°",
            badgeColor: "rose",
            provenance: "scenario-modern",
            provenanceCitation: "Modern illustrative lean input, not a patent measurement.",
          },
          {
            label: "Demanded Thrust",
            value: Math.abs(tel.driveThrustForceN).toFixed(0),
            unit: "N",
            badgeColor: "rose",
            provenance: "scenario-modern",
            provenanceCitation:
              "Modern illustrative mechanics calculation, not a patent measurement.",
          },
          {
            label: "Max Grip Limit",
            value: tel.maxTractionForceN.toFixed(0),
            unit: "N",
            badgeColor: "amber",
            provenance: "scenario-modern",
            provenanceCitation:
              "Modern illustrative tire-contact calculation, not a patent measurement.",
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
          provenance: "scenario-modern",
          provenanceCitation: "Modern illustrative speed result; Claim 1 gives no numerical speed.",
        },
        {
          label: "Restoring Motor Torque",
          value: tel.motorTorqueNm.toFixed(1),
          unit: "N·m",
          badgeColor: Math.abs(tel.motorTorqueNm) > 100 ? "amber" : "indigo",
          progressPct: clampProgress((Math.abs(tel.motorTorqueNm) / 160.0) * 100),
          provenance: "scenario-modern",
          provenanceCitation: "Modern illustrative torque result; the grant gives no motor rating.",
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
          provenance: "scenario-modern",
          provenanceCitation:
            "Claim 1 discloses the velocity-difference relationship; this normalized percentage and threshold are modern illustrative values.",
        },
        {
          label: "Tactile Ripple Alarm",
          value: tel.claim2RippleWithheld
            ? "CLAIM 2 PATH WITHHELD"
            : tel.tactileAlarmActive
              ? "RIPPLE ACTIVE"
              : "STANDBY",
          unit: "haptic",
          badgeColor: tel.claim2RippleWithheld
            ? "rose"
            : tel.tactileAlarmActive
              ? "rose"
              : "indigo",
          provenance: "source-disclosed",
          provenanceCitation:
            "US 6,302,230 Claim 2: the alarm includes ripple modulation of motorized-drive power output; no frequency or amplitude is printed.",
        },
        {
          label: "Pitch Pushback",
          value: tel.speedPushbackActive ? `+${tel.pitchPushbackDeg.toFixed(1)}° LIMIT` : "OFF",
          unit: "speed limiter",
          badgeColor: tel.speedPushbackActive ? "amber" : "emerald",
          provenance: "scenario-modern",
          provenanceCitation:
            "Modern illustrative speed-limiting behavior; the source does not print a tilt angle or response law.",
        },
      ];
    },
    pedagogicalInsight:
      "US 6,302,230 claims powered automatic balance, a balancing-margin monitor, and an alarm; Claim 2 adds ripple modulation of drive power. The numbers and dynamics shown here are a modern illustrative SI scenario, not performance values reported in the grant.",
  },
  "us-4098001-watson-remote-center-compliance": {
    domain: "robotics_mechanisms",
    domainTitle: "Remote-Center Flexure Topology",
    equationName: "Source-Bounded Remote-Center Geometry",
    governingEquation:
      "\\mathbf{r}_{24},\\mathbf{r}_{26},\\mathbf{r}_{28} \\rightarrow O_{remote}; \\quad \\Delta\\mathbf{x}_{tip} \\approx \\boldsymbol{\\theta} \\times \\mathbf{r}_{tip}",
    engineMethod:
      "stepWatsonRemoteCenterComplianceTopology (source-topology browser pose; fs-solid::Rod owner identified; material, load, and contact inputs absent, so no WASM/SI solve)",
    controls: [
      {
        id: "lateralContactFraction",
        label: "Contact-Guided Sequence",
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
          label: "Figure 4 Translation Phase",
          value: (pose.translationOffset * 100).toFixed(1),
          unit: "% display",
          badgeColor: "cyan",
          progressPct: clampProgress(pose.translationOffset * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Remaining Axis Mismatch",
          value: (pose.remainingAxisMismatch * 100).toFixed(1),
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
      "Watson claims a connected passive stack: fixed machine and lip 54 connect through axial flexures 56/58/60 to ring 22, then radial flexures 24/26/28 connect ring 22 to plate 20 and rod 16 while projecting center 50 to free end 52. Claim 2 adds a torque-resistant member between the fixed machine and tool. fs-solid::Rod owns the relevant flexure law, but the grant supplies no section, material, load, clearance, friction, mass, or timing inputs, so this exhibit reports normalized topology and explicitly refuses an SI solve.",
  },
  "us-4098001-watson-rcc": {
    domain: "robotics_mechanisms",
    domainTitle: "Remote-Center Flexure Topology",
    equationName: "Source-Bounded Remote-Center Geometry",
    governingEquation:
      "\\mathbf{r}_{24},\\mathbf{r}_{26},\\mathbf{r}_{28} \\rightarrow O_{remote}; \\quad \\Delta\\mathbf{x}_{tip} \\approx \\boldsymbol{\\theta} \\times \\mathbf{r}_{tip}",
    engineMethod:
      "stepWatsonRemoteCenterComplianceTopology (source-topology browser pose; fs-solid::Rod owner identified; material, load, and contact inputs absent, so no WASM/SI solve)",
    controls: [
      {
        id: "lateralContactFraction",
        label: "Contact-Guided Sequence",
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
          label: "Figure 4 Translation Phase",
          value: (pose.translationOffset * 100).toFixed(1),
          unit: "% display",
          badgeColor: "cyan",
          progressPct: clampProgress(pose.translationOffset * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Remaining Axis Mismatch",
          value: (pose.remainingAxisMismatch * 100).toFixed(1),
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
      "Watson claims a connected passive stack: fixed machine and lip 54 connect through axial flexures 56/58/60 to ring 22, then radial flexures 24/26/28 connect ring 22 to plate 20 and rod 16 while projecting center 50 to free end 52. Claim 2 adds a torque-resistant member between the fixed machine and tool. fs-solid::Rod owns the relevant flexure law, but the grant supplies no section, material, load, clearance, friction, mass, or timing inputs, so this exhibit reports normalized topology and explicitly refuses an SI solve.",
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
        provenance: "scenario-reader",
      },
      {
        id: "fluidViscosityCp",
        label: "Dielectric Fluid Viscosity",
        min: 0.5,
        max: 5.0,
        step: 0.5,
        defaultValue: 2.0,
        unit: "cP",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics: (p) => {
      const controls = readEInkRuntimeControls(p as any);
      const out = readEInkTapeFrame(controls).state;
      return [
        {
          label: "Surface Reflectance",
          value: `${out.surfaceReflectancePercent}%`,
          unit: "R_top",
          badgeColor: out.surfaceReflectancePercent > 40 ? "cyan" : "indigo",
          progressPct: clampProgress(out.surfaceReflectancePercent),
          provenance: "scenario-modern",
        },
        {
          label: "Electric Field Intensity",
          value: `${out.electricFieldVperUm.toFixed(2)} V/μm`,
          unit: "E",
          badgeColor: "amber",
          progressPct: clampProgress((Math.abs(out.electricFieldVperUm) / 0.3) * 100),
          provenance: "scenario-modern",
        },
      ];
    },
    resetRuntimeTape: resetEInkTape,
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
        provenance: "scenario-reader",
      },
      {
        id: "fingerCount",
        label: "Active Touch Contacts",
        min: 0,
        max: 2,
        step: 1,
        defaultValue: 2,
        unit: "pts",
        provenance: "scenario-reader",
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
          provenance: "scenario-modern",
        },
        {
          label: "Capacitance Shunt",
          value: `-${out.mutualCapacitanceDeltaPf.toFixed(2)} pF`,
          unit: "ΔC_m",
          badgeColor: "emerald",
          progressPct: clampProgress((out.mutualCapacitanceDeltaPf / 1.5) * 100),
          provenance: "scenario-modern",
        },
      ];
    },
    pedagogicalInsight:
      "The iPhone multi-touch architecture converts multi-point mutual capacitance drops into real-time affine transformations, enabling fluid pinch-to-zoom magnification and geometric gesture recognition.",
  },
  "us-2717437-mestral-velcro": {
    domain: "materials_mechanics",
    domainTitle: "Source-Bounded Hook-Pile Geometry & 90° Interengagement",
    equationName: "Circular Filament Section Geometry",
    governingEquation:
      "I = \\frac{\\pi d^4}{64}, \\qquad K_{\\mathrm{geometry,rel}} = \\frac{(d/d_0)^4}{(L/L_0)^3}",
    engineMethod:
      "stepMestralVelcroSi (typed host source-topology/refusal; no FrankenSim WASM module stepped)",
    controls: [
      {
        id: "filamentDiameterMm",
        label: "Illustrative Filament Diameter",
        min: 0.1,
        max: 0.35,
        step: 0.01,
        defaultValue: MESTRAL_VELCRO_DEFAULTS.filamentDiameterMm,
        unit: "mm",
        provenance: "scenario-reader",
        provenanceCitation:
          "Reader-selected exhibit geometry; US 2,717,437 does not print a filament diameter.",
      },
      {
        id: "hookLengthMm",
        label: "Illustrative Hook Height",
        min: 1.0,
        max: 3.0,
        step: 0.1,
        defaultValue: MESTRAL_VELCRO_DEFAULTS.hookLengthMm,
        unit: "mm",
        provenance: "scenario-reader",
        provenanceCitation:
          "Reader-selected exhibit geometry; US 2,717,437 does not print a hook length.",
      },
      {
        id: "hookDensityPerCm2",
        label: "Illustrative Pile Population",
        min: 20,
        max: 120,
        step: 4,
        defaultValue: MESTRAL_VELCRO_DEFAULTS.hookDensityPerCm2,
        unit: "cm⁻²",
        provenance: "scenario-reader",
        provenanceCitation:
          "Reader-selected display population, quantized to one through five rendered rows; it is not a measured density from the grant.",
      },
      {
        id: "peelAngleDeg",
        label: "Applied Clamp Direction",
        min: 15,
        max: 165,
        step: 5,
        defaultValue: MESTRAL_VELCRO_DEFAULTS.peelAngleDeg,
        unit: "deg",
        provenance: "scenario-reader",
        provenanceCitation:
          "Reader-selected direction of the explicitly external peel-clamp boundary; the grant does not publish a peel-test angle.",
      },
      {
        id: "peelProgress",
        label: "Peel Front Advance",
        min: 0.05,
        max: 0.95,
        step: 0.01,
        defaultValue: MESTRAL_VELCRO_DEFAULTS.peelProgress,
        unit: "normalized",
        provenance: "topology-normalized",
        provenanceCitation:
          "Reader-controlled normalized peel-front position shared by the 2D and 3D pedagogical projections; not a historical travel measurement.",
      },
    ],
    computeMetrics: (params: Record<string, number>) => {
      const controls = readMestralVelcroControls(params);
      const tel = stepMestralVelcroSi(controls);
      return [
        {
          label: "Opposed Hook Faces",
          value: tel.hookInterengagementAvailable ? "2" : "withheld",
          unit: "source topology",
          badgeColor: "cyan",
          progressPct: tel.hookInterengagementAvailable ? 100 : 3,
          provenance: "source-disclosed",
          provenanceCitation:
            "Figure 2 and its accompanying text superpose two pieces of the Figure 1 hook fabric with their pile surfaces facing.",
        },
        {
          label: "Relative Face Rotation",
          value: "90°",
          unit: "source topology",
          badgeColor: "emerald",
          progressPct: 50,
          provenance: "source-disclosed",
          provenanceCitation:
            "The specification directs that one of the two fabric pieces receive a 90-degree angular displacement before the pile surfaces are faced together.",
        },
        {
          label: "Rendered Pile Rows",
          value: `${tel.visiblePileRows}`,
          unit: "illustrative",
          badgeColor: "amber",
          progressPct: tel.visiblePileRows * 20,
          provenance: "scenario-reader",
          provenanceCitation:
            "Display population only; this is neither a historical nor a measured hook density.",
        },
        {
          label: "Peel Front Advance",
          value: `${(tel.peelProgress * 100).toFixed(0)}%`,
          unit: "normalized",
          badgeColor: "cyan",
          progressPct: tel.peelProgress * 100,
          provenance: "topology-normalized",
          provenanceCitation:
            "Reader-controlled normalized peel-front position shared by the 2D and 3D pedagogical projections; not a historical travel measurement.",
        },
        {
          label: "Circular Section I",
          value: tel.circularSectionSecondMomentM4.toExponential(2),
          unit: "m⁴",
          badgeColor: "purple",
          provenance: "scenario-reader",
          provenanceCitation:
            "Exact circular-section geometry for the reader-selected illustrative diameter; no material modulus or force is inferred.",
        },
        {
          label: "Relative Bending Geometry",
          value: `${tel.relativeBendingGeometryIndex.toFixed(2)}×`,
          unit: "d⁴/L³ index",
          badgeColor: "indigo",
          progressPct: clampProgress((tel.relativeBendingGeometryIndex / 5) * 100),
          provenance: "scenario-reader",
          provenanceCitation:
            "Dimensionless circular-section geometry sensitivity only. A physical spring rate still requires modulus, boundary, and contact data absent from the grant.",
        },
      ];
    },
    pedagogicalInsight:
      "The 1955 grant's fastening embodiment is hook-to-hook: two pieces of the same raised hook-pile fabric face one another after one piece is turned 90 degrees. The exhibit preserves that topology while refusing forces and energy balances the source cannot calibrate.",
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
        label: "Illustrative Gripper Obstruction",
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
      const channelSignature = pose.masterChannels.map((value) => value.toFixed(2)).join(" · ");
      return [
        {
          label: "Master Channel Commands",
          value: channelSignature,
          unit: "7 normalized channels",
          badgeColor: "cyan",
          provenance: "topology-normalized",
        },
        {
          label: "Illustrative Remote Obstruction",
          value: controls.contactResistance.toFixed(2),
          unit: "fraction of closure withheld",
          badgeColor: "rose",
          progressPct: clampProgress(controls.contactResistance * 100),
          provenance: "scenario-reader",
        },
        {
          label: "Largest Channel Mismatch",
          value: (pose.errorMagnitude * 100).toFixed(0),
          unit: "% normalized",
          badgeColor: pose.errorMagnitude > 0.45 ? "amber" : "cyan",
          progressPct: clampProgress(pose.errorMagnitude * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Reflected Resistance",
          value: (pose.reflectedResistance * 100).toFixed(0),
          unit: "% normalized",
          badgeColor: pose.forceReflectionEnabled ? "emerald" : "indigo",
          progressPct: clampProgress(pose.reflectedResistance * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Servo State",
          value: pose.state.toUpperCase(),
          unit: "source topology",
          badgeColor: pose.forceReflectionEnabled ? "emerald" : "purple",
          provenance: "source-disclosed",
        },
        {
          label: "Feedback / Limiter Path",
          value: `${pose.tachometerDampingEnabled ? "TACHOMETER PRESENT" : "TACHOMETER OMITTED"} · ${pose.limiterEnabled ? "LIMITER PRESENT" : "LIMITER OMITTED"}`,
          unit: "unevaluated source topology",
          badgeColor: pose.limiterEnabled ? "amber" : "indigo",
          provenance: "source-disclosed",
        },
        {
          label: "Claim Probe",
          value: `CLAIM ${pose.activeClaim}`,
          unit: "issued text",
          badgeColor: "cyan",
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
        provenance: "scenario-reader",
      },
      {
        id: "liftFraction",
        label: "Mz Lift Pose",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS.liftFraction,
        unit: "normalized",
        provenance: "scenario-reader",
      },
      {
        id: "reachFraction",
        label: "My Platform Reach",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS.reachFraction,
        unit: "normalized",
        provenance: "scenario-reader",
      },
      {
        id: "stationDetected",
        label: "Marker Sensed",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS.stationDetected,
        unit: "off/on",
        provenance: "scenario-reader",
      },
      {
        id: "stationCoupled",
        label: "Station Contacts Coupled",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS.stationCoupled,
        unit: "off/on",
        provenance: "scenario-reader",
      },
      {
        id: "cycleProgress",
        label: "Ordered Cycle",
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS.cycleProgress,
        unit: "normalized",
        provenance: "scenario-reader",
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
          provenance: "source-disclosed",
        },
        {
          label: "Cycle Phase",
          value: state.phase.toUpperCase(),
          unit: "source topology",
          badgeColor: state.releaseAuthorized ? "amber" : "indigo",
          provenance: "source-disclosed",
        },
        {
          label: "Station Coupling",
          value: state.controllerCoupled ? "CLOSED" : "OPEN",
          unit: "claim probe",
          badgeColor: state.controllerCoupled ? "emerald" : "rose",
          provenance: "source-disclosed",
        },
        {
          label: "Machine Command",
          value: state.machineCommandAuthorized ? "AUTHORIZED" : "REFUSED",
          unit: "source interlock",
          badgeColor: state.machineCommandAuthorized ? "emerald" : "amber",
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
      "US 3,313,014 binds a guided work carrier to marker sensing, retention, portable programme control, station coupling, machine operation, release, and departure. The facsimile does not state dimensions, payload, speed, force, timing, tolerance, motor rating, or process model, so the public exhibit reports only its deterministic normalized topology and interlock.",
  },
  "us-3858581-kamen-medication-injection-device": {
    domain: "mechatronics",
    domainTitle: "Pulse-Counted Lead-Screw Mechanism (Nonclinical)",
    equationName: "Rotation Event and Actuator-State Topology",
    governingEquation:
      "N_{pulse}=n_{turns}; \\quad x=n p; \\quad \\text{motor off when }N_{pulse}=N_{selected}",
    engineMethod:
      "stepKamenInjectionMechanism (typed browser mirror of fs-mbd helical-joint topology; no Kamen WASM export; quantitative delivery refused)",
    controls: [
      {
        id: "selectedPulseCount",
        label: "Selected Screw-Turn Pulses",
        min: 1,
        max: 99,
        step: 1,
        defaultValue: KAMEN_INJECTION_DEFAULT_CONTROLS.selectedPulseCount,
        unit: "events",
        provenance: "source-disclosed",
      },
      {
        id: "displayTurnsPerSecond",
        label: "Museum Display Speed",
        min: 1,
        max: 12,
        step: 1,
        defaultValue: KAMEN_INJECTION_DEFAULT_CONTROLS.displayTurnsPerSecond,
        unit: "display turns/s",
        provenance: "scenario-modern",
      },
      {
        id: "offIntervalDisplaySeconds",
        label: "Motor-Off Display Interval",
        min: 0.5,
        max: 8,
        step: 0.5,
        defaultValue: KAMEN_INJECTION_DEFAULT_CONTROLS.offIntervalDisplaySeconds,
        unit: "display s",
        provenance: "scenario-modern",
      },
      {
        id: "clutchEngaged",
        label: "Claim 3 Clutch",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: Number(KAMEN_INJECTION_DEFAULT_CONTROLS.clutchEngaged),
        unit: "released/engaged",
        provenance: "source-disclosed",
      },
      {
        id: "running",
        label: "Museum Mechanism",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: Number(KAMEN_INJECTION_DEFAULT_CONTROLS.running),
        unit: "paused/running",
        provenance: "scenario-reader",
      },
    ],
    computeMetrics: (p) => {
      const controls = readKamenInjectionControls(p);
      const frame = readKamenInjectionTapeFrame(controls);
      const { metrics } = frame;
      return [
        {
          label: "Follower Position",
          value: (metrics.followerPositionNormalized * 100).toFixed(0),
          unit: "% normalized",
          badgeColor: "cyan",
          progressPct: clampProgress(metrics.followerPositionNormalized * 100),
          provenance: "topology-normalized",
        },
        {
          label: "Screw-Turn Counter",
          value: `${metrics.cyclePulseCount}/${metrics.selectedPulseCount}`,
          unit: "events",
          badgeColor: "amber",
          progressPct: clampProgress(metrics.counterProgress * 100),
          provenance: "source-disclosed",
        },
        {
          label: "Mechanism State",
          value: metrics.phase.toUpperCase(),
          unit: "source topology",
          badgeColor: !metrics.clutchEngaged ? "rose" : metrics.motorPowered ? "emerald" : "indigo",
          provenance: "source-disclosed",
        },
        {
          label: "Joint Owner",
          value: "FS-MBD HELICAL",
          unit: "typed mirror",
          badgeColor: "purple",
          provenance: "topology-normalized",
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
      "US 3,858,581 makes one screw revolution one counted electrical event: motor 24 turns uniform-pitch screw 22, guided follower 18 advances plunger 14, mounted striker 80 closes switch 84, and cascaded counters 114/116 stop the motor at the selected integer. Claim 3's spring clutch can let the motor rotor turn while the screw holds. FrankenSim fs-mbd owns the generic helical-joint law, but the browser uses an explicitly labeled typed mirror because no Kamen-specific WASM export exists. The grant prints no numerical pitch, motor curve, pressure, dose calibration, safe rate, or clinical outcome.",
  },
  "us-4068536-stackhouse-manipulator": {
    domain: "solid_mechanics",
    domainTitle: "Intersecting-Axis Wrist Topology & Concentric Shaft Transmission",
    equationName: "Selected Serial-Axis Display Composition",
    governingEquation:
      "\\mathbf{R}_{display}=\\mathbf{R}_{z}(q_A)\\,\\mathbf{R}_{y}(\\alpha_{AB})\\,\\mathbf{R}_{z}(q_B)\\,\\mathbf{R}_{y}(-\\alpha_{BC})\\,\\mathbf{R}_{z}(q_C),\\quad \\alpha_{AB},\\alpha_{BC}>45^\\circ",
    engineMethod:
      "stepStackhouseSourceTopology (typed browser mirror of fs-mbd revolute-joint forward kinematics; no Stackhouse WASM export; SI dynamics refused)",
    controls: [
      {
        id: "forearmRollDeg",
        label: "Forearm Roll (θ₁)",
        min: -180,
        max: 180,
        step: 1,
        defaultValue: STACKHOUSE_SOURCE_DEFAULT_CONTROLS.forearmRollDeg,
        unit: "°",
        provenance: "topology-normalized",
      },
      {
        id: "intermediateRollDeg",
        label: "Intermediate Oblique Roll (θ₂)",
        min: -180,
        max: 180,
        step: 1,
        defaultValue: STACKHOUSE_SOURCE_DEFAULT_CONTROLS.intermediateRollDeg,
        unit: "°",
        provenance: "topology-normalized",
      },
      {
        id: "toolRollDeg",
        label: "Tool Spin Roll (θ₃)",
        min: -180,
        max: 180,
        step: 1,
        defaultValue: STACKHOUSE_SOURCE_DEFAULT_CONTROLS.toolRollDeg,
        unit: "°",
        provenance: "topology-normalized",
      },
      {
        id: "firstObliqueAngleDeg",
        label: "Selected A–B Obliquity",
        min: 46,
        max: 80,
        step: 1,
        defaultValue: STACKHOUSE_SOURCE_DEFAULT_CONTROLS.firstObliqueAngleDeg,
        unit: "° display",
        provenance: "scenario-reader",
      },
      {
        id: "secondObliqueAngleDeg",
        label: "Selected B–C Obliquity",
        min: 46,
        max: 80,
        step: 1,
        defaultValue: STACKHOUSE_SOURCE_DEFAULT_CONTROLS.secondObliqueAngleDeg,
        unit: "° display",
        provenance: "scenario-reader",
      },
      {
        id: "singleIntersection",
        label: "Preferred Common Point P",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: STACKHOUSE_SOURCE_DEFAULT_CONTROLS.singleIntersection,
        unit: "offset/exact",
        provenance: "scenario-reader",
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
      "US 4,068,536 routes hydraulic motors 9a/9b/9c through spur gears into concentric forearm shafts 15/16/19, then through bevel pairs 17/18, 21/22, and 24/25 into housing shaft 14a, internal shaft 23, and terminal shaft 26. The browser mirrors FrankenSim fs-mbd's serial revolute-joint forward-kinematics law, but no generic articulated WASM constructor is exported here. The preferred axes meet at P, and the printed illustrated oblique angles are only specified as greater than 45 degrees; quantitative dynamics and performance remain refused.",
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
PATENT_PHYSICS_REGISTRY["us-3923554-boyle-smith-ccd"] =
  PATENT_PHYSICS_REGISTRY["us-3858232-boyle-smith-ccd"];
PATENT_PHYSICS_REGISTRY["us-3671542-kwolek-kevlar"] = {
  domain: "source_reading",
  domainTitle: "Source-Bounded Claim Reading",
  equationName: "Printed Polyamide Dope Composition",
  governingEquation:
    "carbocyclic aromatic polyamide + selected liquid medium → optically anisotropic dope",
  engineMethod:
    "Source-bound claim reading; quantitative processing and material-performance model withheld",
  controls: [],
  computeMetrics: () => [
    {
      label: "Claim 1",
      value: "optically anisotropic dope",
      unit: "printed composition",
      badgeColor: "emerald",
      progressPct: 100,
      provenance: "source-disclosed",
    },
    {
      label: "Claim 2",
      value: "> about 98% H₂SO₄",
      unit: "printed narrowing",
      badgeColor: "cyan",
      progressPct: 100,
      provenance: "source-disclosed",
    },
    {
      label: "Visual Model",
      value: "WITHHELD",
      unit: "source boundary",
      badgeColor: "rose",
      progressPct: 0,
      provenance: "refusal-bounded",
    },
  ],
  pedagogicalInsight:
    "The public reading remains at the printed composition claims: an optically anisotropic dope formed from a carbocyclic aromatic polyamide and selected liquid medium, with Claim 2 narrowing the liquid medium to concentrated sulfuric acid. The reviewed source boundary does not license a quantitative processing or material-performance model.",
  provenance: "source-disclosed",
};
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
