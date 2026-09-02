/**
 * Kernel predicates → exact phrases in the original specification.
 * Highlighted on the spec face so an interaction lights the clause it tests.
 */

import { stepAmfVersatranTopology } from "./amfVersatranKernel";
import { INITIAL_BAER_STATE, readBaerControls, stepBaerOdysseySi } from "./baerOdysseyKernel";
import { readCrumpFdmControls, stepCrumpFdmSi } from "./crumpFdmKernel";
import { stepDevolProgrammedTransfer } from "./devolProgrammedTransferKernel";
import { FrankenSimEngine } from "./engine";
import { stepFermiKinetics } from "./fermiKinetics";
import { stepGoertzMasterSlaveTopology } from "./goertzElectronicMasterSlaveManipulatorKernel";
import {
  readHullStereolithographyControls,
  stepHullStereolithographySi,
} from "./hullStereolithographyKernel";
import { readKamenSegwayControls, stepKamenSegwaySi } from "./kamenSegwayKernel";
import { readKamenTransporterControls, stepKamenTransporterSi } from "./kamenTransporterKernel";
import { stepLemelsonManipulatorTopology } from "./lemelsonAdjustableManipulatorKernel";
import { stepLemelsonAutomaticProductionTopology } from "./lemelsonAutomaticProductionKernel";
import {
  readLemelsonMachineVisionControls,
  stepLemelsonMachineVisionSi,
} from "./lemelsonMachineVisionKernel";
import { stepHoweSewingMachine } from "./machineKernels";
import { readMestralVelcroControls, stepMestralVelcroSi } from "./mestralVelcroKernel";
import {
  INITIAL_ETHERNET_STATE,
  readEthernetControls,
  stepMetcalfeEthernetSi,
} from "./metcalfeEthernetKernel";
import { stepMilacronRobotToolchanger } from "./milacronRobotToolchangerKernel";
import { readOtisTopologyControls, stepOtis1861Topology } from "./otisKernel";
import { stepRobotEndEffector } from "./robotEndEffectorKernel";
import { ROOMBA_ROOM, stepRoomba } from "./roombaKernel";
import { readSalisburyRobotHandControls } from "./salisburyRobotHandKernel";
import {
  INITIAL_SIKORSKY_STATE,
  readSikorskyControls,
  stepSikorskyHelicopterSi,
} from "./sikorskyHelicopterKernel";
import { stepStackhouseSourceTopology } from "./stackhouseSourceKernel";
import { readSundbackZipperControls, stepSundbackZipperSi } from "./sundbackZipperKernel";
import { stepTeslaMotorFig9, teslaMotorPhaseHz } from "./teslaKernel";
import { readTeslaTransformerControls, stepTeslaTransformerSi } from "./teslaTransformerKernel";

export interface SpecClause {
  id: string;
  phrase: string;
  active: boolean;
  tone: "held" | "broken" | "live";
  caption: string;
}

const WRIGHT_ID = "us-821393-wright-flyer";
const TESLA_ID = "us-381968-tesla-motor";
const FERMI_ID = "us-2708656-fermi-reactor";
const WATT_ID = "gb-913-watt-separate-condenser";
const ARKWRIGHT_ID = "gb-931-arkwright-water-frame";
const WATT_ROTARY_ID = "gb-1306-watt-rotary-engine";
const CORT_ID = "gb-1420-cort-puddling-rolling";
const FESSENDEN_ID = "us-706737-fessenden-wireless";
const MARCONI_ID = "us-586193-marconi-radio";
const BAEKELAND_ID = "us-942699-baekeland-bakelite";
const HABER_ID = "us-971501-haber-ammonia";
const HEWITT_ID = "us-682690-hewitt-mercury-lamp";
const DE_FOREST_ID = "us-879532-de-forest-audion";
const CARLSON_ID = "us-2297691-carlson-electrophotography";
const TOWNES_ID = "us-2929922-townes-laser";
const MAIMAN_ID = "us-3353115-maiman-ruby-laser";
const BOYLE_SMITH_CCD_ID = "us-3858232-boyle-smith-ccd";
const KILBY_ID = "us-3138743-kilby-integrated-circuit";
const EDISON_LIGHTBULB_ID = "us-223898-edison-lightbulb";
const EDISON_LAMP_LEGACY_ID = "us-223898-edison-lamp";
const BELL_TELEPHONE_ID = "us-174465-bell-telephone";
const MORSE_TELEGRAPH_ID = "us-1647-morse-telegraph";
const GOODYEAR_RUBBER_ID = "us-3633-goodyear-rubber";
const CORLISS_ENGINE_ID = "us-6162-corliss-steam-engine";
const WESTINGHOUSE_BRAKE_ID = "us-124404-westinghouse-air-brake";
const OTTO_ENGINE_ID = "us-194047-otto-engine";
const GODDARD_ROCKET_ID = "us-1102653-goddard-rocket";
const SUNDBACK_ZIPPER_ID = "us-1219881-sundback-zipper";
const MESTRAL_VELCRO_ID = "us-2717437-mestral-velcro";
const KAMEN_TRANSPORTER_ID = "us-5701965-kamen-transporter";
const FARNSWORTH_TV_ID = "us-1773980-farnsworth-tv";
const EINSTEIN_REFRIGERATOR_ID = "us-1781541-einstein-refrigerator";
const LAMARR_FREQUENCY_HOPPING_ID = "us-2292387-lamarr-frequency-hopping";
const SPENCER_MICROWAVE_ID = "us-2495429-spencer-microwave";
const BARDEEN_TRANSISTOR_ID = "us-2524035-bardeen-transistor";
const NOYCE_IC_ID = "us-2981877-noyce-ic";
const KWOLEK_KEVLAR_ID = "us-3671542-kwolek-kevlar";
const PARSONS_TURBINE_ID = "us-608969-parsons-turbine";
const TESLA_COIL_ID = "us-593138-tesla-coil";
const TESLA_TELEAUTOMATON_ID = "us-613809-tesla-teleautomaton";
const GOERTZ_MASTER_SLAVE_ID = "us-2846084-goertz-electronic-master-slave-manipulator";
const AMF_VERSATRAN_ID = "us-3212649-amf-versatran";

export function specClausesFor(patentId: string, params: Record<string, number>): SpecClause[] {
  if (patentId === WATT_ROTARY_ID) {
    const spm = params.strokeRateSpm ?? 20;
    const ratio = params.gearRatioNpOverNs ?? 1.0;
    const pressureKpa = params.boilerPressureKpa ?? 70;
    const isRotating = spm >= 10;
    const isSpeedDoubled = Math.abs(ratio - 1.0) < 0.1;
    const isPowerDelivered = pressureKpa >= 40;

    return [
      {
        id: "sun-wheel",
        phrase: "Sun wheel",
        active: isRotating,
        tone: isRotating ? "held" : "broken",
        caption: `Sun spur wheel keyed fast to the output shaft and flywheel, turning at ${(spm * (1 + ratio)).toFixed(1)} RPM.`,
      },
      {
        id: "planet-wheel",
        phrase: "Planet wheel",
        active: isRotating,
        tone: isRotating ? "held" : "broken",
        caption: `Planet wheel rigidly bolted to connecting rod, orbiting around the sun without rotating on its own axis.`,
      },
      {
        id: "two-complete-revolutions",
        phrase: "two complete revolutions",
        active: isSpeedDoubled,
        tone: isSpeedDoubled ? "live" : "held",
        caption: `Epicyclic gear ratio 1:1 forces the shaft to make exactly 2.0 revolutions per engine beam stroke cycle.`,
      },
      {
        id: "radius-guide-link",
        phrase: "link, radius arm, or circular guiding groove",
        active: isRotating && isPowerDelivered,
        tone: "held",
        caption:
          "Maintains exact pitch-circle center-to-center mesh distance between sun and planet gears throughout the 360° orbit.",
      },
    ];
  }

  if (patentId === CORT_ID) {
    const tempC = params.furnaceTemperatureCelsius ?? 1350;
    const rabbleRpm = params.rabbleStirringRpm ?? 15;
    const passes = params.rollerPassCount ?? 5;
    const isHot = tempC >= 1250;
    const isRabbling = rabbleRpm > 5;
    const isMultiPass = passes >= 3;

    return [
      {
        id: "reverberatory-furnace",
        phrase: "reverberatory or air furnace",
        active: isHot,
        tone: isHot ? "held" : "broken",
        caption: `Furnace Temp=${tempC}°C: Coal flame reverberates from arched roof onto iron bath, isolating sulfur fuel.`,
      },
      {
        id: "rabble-stirring",
        phrase: "constantly stirred, agitated, and worked with an iron paddle or rabble",
        active: isRabbling,
        tone: isRabbling ? "held" : "broken",
        caption: `Rabble Rate=${rabbleRpm} RPM: Continuous mechanical agitation exposes fresh metal to oxidizing gas, burning out carbon.`,
      },
      {
        id: "coming-to-nature",
        phrase: '"comes to nature,"',
        active: isHot && isRabbling,
        tone: "live",
        caption:
          "As carbon drops below 0.1%, melting point rises above furnace heat (1535°C), solidifying pasty iron grains.",
      },
      {
        id: "grooved-rollers",
        phrase:
          "pairs of large chilled cast-iron rollers furnished with corresponding grooves of graduated dimensions",
        active: isMultiPass,
        tone: isMultiPass ? "held" : "live",
        caption: `Grooved Passes=${passes}: Graduated profile passes exert progressive hydrostatic squeeze on the puddle ball.`,
      },
      {
        id: "slag-expulsion",
        phrase: "violently expressing and discharging the liquid iron silicate cinder and slag",
        active: isMultiPass,
        tone: "live",
        caption:
          "Intense roll compression expels liquid silicate slag and welds iron crystals into fibrous wrought bars.",
      },
    ];
  }

  if (patentId === ARKWRIGHT_ID) {
    const draftRatio = params.totalDraftRatio ?? 6.0;
    const clampingWeight = params.rollerClampingWeightKg ?? 3.5;
    const waterWheelRpm = params.waterWheelRpm ?? 180;
    const isHighDraft = draftRatio >= 4.0;
    const isClamped = clampingWeight >= 2.0;
    const isSpinning = waterWheelRpm > 50;

    return [
      {
        id: "differential-rollers",
        phrase:
          "turning with different degrees of velocity, draws out and attenuates the cotton fibers",
        active: isHighDraft,
        tone: isHighDraft ? "held" : "live",
        caption: `Draft Ratio D=${draftRatio.toFixed(1)}×: Front delivery rollers turn faster than feed rollers, attenuating roving mechanically.`,
      },
      {
        id: "weighted-pressing",
        phrase:
          "lead weights and pressing levers, which hang upon the bearings of the upper rollers",
        active: isClamped,
        tone: isClamped ? "held" : "broken",
        caption: `Clamping Weight=${clampingWeight.toFixed(1)} kg: Deadweights prevent fiber slippage between leather top rollers and fluted cylinders.`,
      },
      {
        id: "high-speed-flyers",
        phrase:
          "high-speed steel flyers, having two curved arms with small wire guide loops or eyes",
        active: isSpinning,
        tone: isSpinning ? "held" : "broken",
        caption: `Flyer Speed=${Math.round(waterWheelRpm * 18.5)} RPM: Rapidly revolving flyers impart helical twist, converting roving into warp-grade water twist yarn.`,
      },
      {
        id: "heart-cam-traverse",
        phrase: "heart-wheel or cam... raises and lowers the rail supporting the bobbins",
        active: isSpinning,
        tone: "live",
        caption:
          "Heart-cam continuously oscillates the bobbin rail to wind yarn in uniform cylindrical layers.",
      },
    ];
  }

  if (patentId === WATT_ID) {
    const hasCondenser = (params.hasSeparateCondenser ?? 1) >= 0.5;
    const condTemp = params.condenserTempC ?? 35;
    return [
      {
        id: "cylinder-hot",
        phrase: "kept as hot as the steam that enters it",
        active: hasCondenser,
        tone: hasCondenser ? "held" : "broken",
        caption: hasCondenser
          ? "Principle 1: Concentric steam jacket maintains cylinder walls at boiling temperature (100°C+)."
          : "Newcomen mode: Cylinder is quenched to 35°C on every single stroke, causing 75% fuel waste.",
      },
      {
        id: "separate-condenser",
        phrase: "condensed in vessels distinct from the steam vessels or cylinders",
        active: hasCondenser,
        tone: "live",
        caption: `Principle 2: Separate vessel condenser active at ${condTemp}°C with cold water injection.`,
      },
      {
        id: "air-pump",
        phrase: "drawn out of the steam vessels or condensers by means of pumps",
        active: hasCondenser,
        tone: "live",
        caption:
          "Principle 3: Reciprocating beam air pump evacuates non-condensable gases and water.",
      },
      {
        id: "oil-packing",
        phrase: "employ oils, wax, resinous bodies, fat of animals, quicksilver",
        active: true,
        tone: "held",
        caption: "Principle 7: Piston sealed with tallow and wax to prevent cold water chilling.",
      },
    ];
  }
  if (patentId === WRIGHT_ID) {
    const coupled = (params.coupled ?? 1) >= 0.5;
    return [
      {
        id: "warp",
        phrase: "twisted or warped in opposite directions",
        active: Math.abs(params.wingWarp ?? 0) > 0.5,
        tone: "live",
        caption: "Claim 1 warp is live: opposite tip incidence.",
      },
      {
        id: "adverse-yaw",
        phrase:
          "tends to turn or yaw in a horizontal plane toward the side having the greater angle of incidence",
        active: !coupled && Math.abs(params.wingWarp ?? 0) > 2,
        tone: "broken",
        caption: "Uncoupled warp: adverse yaw clause is what you are seeing.",
      },
      {
        id: "rudder-link",
        phrase: "operatively connect this vertical rudder to the wing-warping mechanism",
        active: coupled,
        tone: "held",
        caption: "Claim 18's rudder linkage follows the cradle-driven rope system.",
      },
      {
        id: "banked-turn",
        phrase:
          "causing the machine to turn in the direction of the lower wing in a coordinated, banked turn",
        active: coupled && Math.abs(params.wingWarp ?? 0) > 2,
        tone: "held",
        caption: "Coupled warp + rudder: coordinated bank.",
      },
    ];
  }

  if (patentId === TESLA_ID) {
    const fig9 = stepTeslaMotorFig9(teslaMotorPhaseHz(params));
    const energized = fig9.phaseCycleHz > 0;
    return [
      {
        id: "independent-circuits",
        phrase:
          "two or more independent circuits through which alternate currents are passed at proper intervals",
        active: energized,
        tone: "held",
        caption: `Fig. 9 generator at ${fig9.generatorRpm} rpm drives the two collector-ring circuits.`,
      },
      {
        id: "progressive-shift",
        phrase: "a progressive shifting of the magnetism or of the ‘lines of force’",
        active: energized,
        tone: "live",
        caption: `Pole shift ${fig9.poleShiftRpm} rpm; disk D follows at ${fig9.diskRpm} rpm.`,
      },
    ];
  }

  if (patentId === FERMI_ID) {
    const rod = params.rodWithdrawal ?? 83.5;
    const mod = params.moderatorPurity ?? 99.5;
    const keff = stepFermiKinetics(rod, mod).kEffective;
    return [
      {
        id: "critical",
        phrase: "self-sustaining",
        active: keff >= 0.998,
        tone: keff > 1.002 ? "live" : "held",
        caption:
          keff >= 0.998
            ? `k_eff = ${keff.toFixed(4)}: chain reaction holds.`
            : `k_eff = ${keff.toFixed(4)}: subcritical.`,
      },
    ];
  }

  if (patentId === KILBY_ID) {
    const vcc = params.supplyVoltageV ?? 6.0;
    const lUm = params.resistorLengthUm ?? 500;
    const wUm = params.resistorWidthUm ?? 50;
    const vr = params.reverseBiasVoltageV ?? 3.0;
    const ib = params.baseDriveCurrentUa ?? 40;

    const isBiased = vcc >= 2.0;
    const isTransistorActive = ib >= 15;
    const isCapacitorActive = vr >= 1.0;

    return [
      {
        id: "monolithic-body",
        phrase:
          "wafer of single-crystal semiconductor material containing a plurality of active and passive circuit components",
        active: isBiased,
        tone: "live",
        caption: `Single crystal bar hosting integrated mesa transistors, bulk resistors, and p-n junction capacitors at V_cc = ${vcc} V.`,
      },
      {
        id: "bulk-resistor",
        phrase: "passive circuit component is an elongated resistor region",
        active: isBiased,
        tone: "live",
        caption: `Aspect ratio L/W = ${(lUm / wUm).toFixed(1)}: Bulk semiconductor path providing calibrated ohmic load resistance.`,
      },
      {
        id: "pn-capacitor",
        phrase: "passive circuit component is a capacitor defined by a p-n junction",
        active: isCapacitorActive,
        tone: isCapacitorActive ? "live" : "broken",
        caption: `V_R = ${vr} V: Reverse-biased depletion transition capacitance providing AC coupling without discrete capacitors.`,
      },
      {
        id: "conductor-interconnects",
        phrase: "conductor means for interconnecting said components into an operative circuit",
        active: isTransistorActive,
        tone: "held",
        caption: `Gold flying wire bonds linking isolated component mesas into a functional bistable flip-flop/oscillator.`,
      },
    ];
  }

  if (patentId === BOYLE_SMITH_CCD_ID) {
    const vGate = params.gateVoltageV ?? 10;
    const isBiased = vGate >= 5;

    return [
      {
        id: "ccd-potential-wells",
        phrase:
          "potential energy minima in a semiconductor for storing discrete packets of minority charge carriers",
        active: isBiased,
        tone: isBiased ? "live" : "broken",
        caption: `Gate Bias V_G=${vGate} V: MOS gate electrodes induce deep potential wells in single-conductivity silicon substrate.`,
      },
      {
        id: "ccd-sequential-transfer",
        phrase:
          "sequentially biasing said plurality of electrodes to translate said charge packets along a continuous channel",
        active: true,
        tone: "live",
        caption: `Three-Phase Clocking: Overlapping pulsed electric fields translate stored photoelectrons from well to well with CTE > 99.99%.`,
      },
      {
        id: "ccd-single-conductivity-channel",
        phrase:
          "said channel consisting essentially of semiconductor material of a single conductivity type",
        active: true,
        tone: "live",
        caption: `Continuous Single-Conductivity Channel: Eliminates isolated p-n junction diffusions, enabling high packing density.`,
      },
      {
        id: "ccd-charge-detection",
        phrase:
          "detecting means coupled to said semiconductor for converting said charge packets into output electrical signals",
        active: true,
        tone: "live",
        caption: `Floating Diffusion Readout Node: Converts transported electron packets into low-noise voltage signals.`,
      },
    ];
  }

  if (patentId === MAIMAN_ID) {
    const pumpJ = params.pumpEnergyJoules ?? 150;
    const r2 = params.outputMirrorReflectivity ?? 0.92;
    const isLasing = pumpJ >= 110;
    const isCoupling = r2 < 0.99;

    return [
      {
        id: "maiman-population-inversion",
        phrase:
          "establish a population inversion between said discrete second energy level and said ground state",
        active: isLasing,
        tone: isLasing ? "live" : "broken",
        caption: `Pump Energy=${pumpJ} J: Flash excitation transfers >50% of ground-state Cr3+ ions into the metastable 2E level, achieving true 3-level population inversion.`,
      },
      {
        id: "maiman-radiationless-transition",
        phrase:
          "from whence they decay without substantial radiation loss to said discrete second energy level",
        active: true,
        tone: "live",
        caption: `Sub-picosecond non-radiative phonon relaxation from green/violet 4F bands into the long-lived (~3 ms) metastable 2E state.`,
      },
      {
        id: "maiman-interferometer-resonator",
        phrase:
          "interferometer means optically coupled to said ruby and tuned to the frequency corresponding to that of the energy difference",
        active: true,
        tone: "live",
        caption: `Fabry-Pérot Resonator: Mutually parallel polished silvered end facets circulate axial 694.3 nm photons through the gain crystal.`,
      },
      {
        id: "maiman-coupling-means",
        phrase:
          "coupling means for extracting the monochromatic coherent light beam from said ruby",
        active: isCoupling,
        tone: isCoupling ? "live" : "held",
        caption: `Output Mirror R2=${(r2 * 100).toFixed(0)}%: Transmits a fraction of the oscillating coherent wavefront as a collimated 694.3 nm pulsed laser beam.`,
      },
    ];
  }

  if (patentId === TOWNES_ID) {
    const pPump = params.pumpPowerWatts ?? 350;
    const r2Pct = params.mirror2ReflectivityPct ?? 94;
    const isLasing = pPump >= 120;
    const isTransmitting = r2Pct < 99.5;

    return [
      {
        id: "population-inversion",
        phrase:
          "pumping means for establishing a population inversion between said first and second states",
        active: isLasing,
        tone: isLasing ? "live" : "broken",
        caption: `Pump Power=${pPump} W: Optical excitation populates upper laser level above ground state, establishing non-equilibrium quantum optical gain.`,
      },
      {
        id: "fabry-perot-reflector-pair",
        phrase:
          "an optical cavity resonator containing said medium, said resonator being bounded by a pair of spaced reflecting surfaces",
        active: true,
        tone: "live",
        caption: `Fabry-Pérot Resonator: Parallel plane mirrors reflect axial standing waves back and forth through the inverted gain medium.`,
      },
      {
        id: "non-reflecting-side-boundaries",
        phrase: "the side boundaries of said resonator being substantially non-reflecting",
        active: true,
        tone: "live",
        caption: `Open Cavity Mode Selection: Non-reflecting open sidewalls discard off-axis modes via high diffraction loss, isolating the fundamental TEM00 mode.`,
      },
      {
        id: "partially-transmitting-output",
        phrase: "at least one of said reflecting surfaces is partially transmitting",
        active: isTransmitting,
        tone: isTransmitting ? "live" : "held",
        caption: `Output Coupler R2=${r2Pct}%: Extracts a collimated, diffraction-limited coherent optical beam while sustaining intra-cavity oscillation.`,
      },
    ];
  }

  if (patentId === CARLSON_ID) {
    const vCorona = params.coronaVoltageKv ?? 6.5;
    const expLux = params.exposureLuxSec ?? 12;
    const tFuser = params.fuserTemperatureC ?? 185;
    const isCharged = vCorona >= 5.0;
    const isDischarged = expLux >= 5;
    const isFused = tFuser >= 150;

    return [
      {
        id: "photoconductive-surface-charge",
        phrase:
          "producing an electric charge on the surface of a photo-conductive insulating layer",
        active: isCharged,
        tone: isCharged ? "live" : "broken",
        caption: `Corona Voltage=${vCorona} kV: High-voltage ionization deposits uniform +${Math.round(vCorona * 100)} V electrostatic potential across photoreceptor surface.`,
      },
      {
        id: "selective-light-discharge",
        phrase:
          "exposing said layer to a light image whereby to effect selective discharge thereof",
        active: isDischarged,
        tone: isDischarged ? "live" : "held",
        caption: `Optical Exposure=${expLux} lx·s: Photons generate electron-hole pairs, dissipating surface charge in illuminated background regions.`,
      },
      {
        id: "electroscopic-powder-deposition",
        phrase: "depositing a finely-divided electroscopic material on said layer",
        active: true,
        tone: "live",
        caption: `Triboelectric Toner Development: Pigmented resin powder particles adhere by Coulomb attraction to the remaining latent electrostatic pattern.`,
      },
      {
        id: "thermal-fusing",
        phrase: "fixed thereon by the application of heat",
        active: isFused,
        tone: isFused ? "live" : "broken",
        caption: `Fuser Temperature=${tFuser}°C: Heated rollers melt thermoplastic toner resin, permanently bonding the image into paper fibers.`,
      },
    ];
  }

  if (patentId === DE_FOREST_ID) {
    const vPlate = params.plateVoltageV ?? 45;
    const vGrid = params.gridBiasVoltageV ?? -1.5;
    const iFilament = params.filamentCurrentA ?? 1.0;
    const isFilamentHot = iFilament >= 0.8;
    const isPlateActive = vPlate >= 20;

    return [
      {
        id: "heated-filament-emission",
        phrase: "filament, preferably of metal... heated, preferably to incandescence",
        active: isFilamentHot,
        tone: isFilamentHot ? "live" : "broken",
        caption: `Filament Current=${iFilament} A: Heated incandescent cathode emits thermionic electron space-charge cloud into vacuum.`,
      },
      {
        id: "interposed-control-grid",
        phrase: "interposed between the members F and b is a grid-shaped member a",
        active: true,
        tone: "live",
        caption: `Grid Bias=${vGrid} V: Intermediate electrostatic grid throttles electron passage with zero input current drain.`,
      },
      {
        id: "blocking-condenser",
        phrase:
          "insert a condenser C in said circuit to prevent the members a and b from becoming electrically charged",
        active: true,
        tone: "held",
        caption: `Grid Condenser C: Blocks DC plate potential from biasing grid while coupling high-frequency RF oscillations.`,
      },
      {
        id: "signal-indicator-output",
        phrase:
          "local receiving circuit, which includes the battery B... and signal indicating device T",
        active: isPlateActive,
        tone: isPlateActive ? "live" : "held",
        caption: `Plate B-Battery=${vPlate} V: High-voltage plate attracts electrons and drives amplified signal into telephone receiver T.`,
      },
    ];
  }

  if (patentId === HEWITT_ID) {
    const vMains = params.mainsVoltageV ?? 110;
    const lenCm = params.tubeLengthCm ?? 100;
    const rBallast = params.ballastResistanceOhms ?? 12;
    const cooling = params.condenserCoolingLevel ?? 1.0;

    const isCommercialVoltage = vMains >= 90 && vMains <= 130;
    const _isBallastStable = rBallast >= 8;
    const isCoolingActive = cooling >= 0.8;

    return [
      {
        id: "cold-cathode-barrier",
        phrase: "initial electrical resistance at the cold cathode surface",
        active: true,
        tone: "held",
        caption: `Mains=${vMains} V: Cold mercury pool work function (4.49 eV) blocks spontaneous conduction at commercial voltages.`,
      },
      {
        id: "higher-potential-starting",
        phrase: "momentary higher potential of several thousand volts",
        active: true,
        tone: "live",
        caption: `Starting Pulse ≈ ${Math.round(1200 + 40 * lenCm)} V: High-voltage inductive kick initiates Townsend breakdown and cathode emission spot.`,
      },
      {
        id: "moderate-potential-operation",
        phrase: "moderate electromotive force (such as 100 to 120 volts)",
        active: isCommercialVoltage,
        tone: isCommercialVoltage ? "held" : "live",
        caption: `Operating Mains=${vMains} V: Once ionized, positive column resistance collapses and conducts multi-ampere arc from standard mains.`,
      },
      {
        id: "condensing-chamber-regulation",
        phrase: "cooling or condensing chamber for the gas or vapor",
        active: isCoolingActive,
        tone: isCoolingActive ? "live" : "broken",
        caption: `Cooling Rate=${cooling}x: Bulbous globe condenses hot mercury vapor and stabilizes internal vapor pressure.`,
      },
    ];
  }

  if (patentId === HABER_ID) {
    const pAtm = params.pressureAtm ?? 175;
    const tempC = params.temperatureCelsius ?? 530;
    const catActivity = params.catalystActivity ?? 1.0;

    const isHighPressure = pAtm >= 100;
    const isWorkingRegime = pAtm >= 150 && tempC >= 480 && tempC <= 600;
    const isCatalyzed = catActivity >= 0.5;

    return [
      {
        id: "osmium-catalyst",
        phrase: "passing gases containing nitrogen and hydrogen over osmium",
        active: isCatalyzed,
        tone: isCatalyzed ? "held" : "broken",
        caption: `Catalyst Activity=${catActivity}x: Active transition-metal contact surface chemisorbs and dissociates the inert N≡N triple bond.`,
      },
      {
        id: "high-pressure-regime",
        phrase: "increased pressure, for instance at from 100 to 200 atmospheres",
        active: isHighPressure,
        tone: isHighPressure ? "held" : "broken",
        caption: `Pressure=${pAtm} atm (${(pAtm * 0.101325).toFixed(1)} MPa): Super-atmospheric compression shifts Le Chatelier equilibrium toward 2-volume NH3 product.`,
      },
      {
        id: "working-parameters",
        phrase:
          "one hundred and seventy-five atmospheres and at a temperature of about five hundred and fifty degrees centigrade",
        active: isWorkingRegime,
        tone: isWorkingRegime ? "live" : "held",
        caption: `P=${pAtm} atm, T=${tempC}°C: The optimal kinetic-thermodynamic compromise balancing catalytic rate and equilibrium conversion.`,
      },
      {
        id: "eight-percent-yield",
        phrase: "yield of eight per cent. by volume of ammonia can easily be obtained",
        active: isHighPressure && isWorkingRegime,
        tone: "live",
        caption:
          "Single-pass equilibrium yield (>8%) enables high-pressure condensation and continuous unreacted gas recirculation.",
      },
    ];
  }

  if (patentId === BAEKELAND_ID) {
    const temp = params.curingTempC ?? 130;
    const press = params.autoclavePressurePsi ?? 75;
    const time = params.curingTimeMin ?? 60;
    const isPressurized = press >= 45;
    const isHotEnough = temp >= 110;
    const isCured = isHotEnough && time >= 45;

    return [
      {
        id: "autoclave-pressure",
        phrase:
          "closed vessel in case the temperature exceed 90°-100° C.; without this precaution vapors of formaldehyde and the like escape causing foam and air bubbles",
        active: isPressurized,
        tone: isPressurized ? "held" : "broken",
        caption: `P_autoclave = ${press} psi: Super-atmospheric pressure suppresses boiling of water and formaldehyde, preventing foam and porosity.`,
      },
      {
        id: "infusible-curing",
        phrase:
          "converted into a hard, insoluble and infusible body by the combined action of heat and pressure",
        active: isCured,
        tone: isCured ? "held" : "live",
        caption: `T = ${temp} °C, t = ${time} min: Thermal condensation drives complete 3D covalent crosslinking into insoluble C-stage Bakelite.`,
      },
    ];
  }

  if (patentId === FESSENDEN_ID) {
    const fCarrier = params.carrierFrequencyKhz ?? 75;
    const mod = params.audioModulationPct ?? 65;
    const lUh = params.antennaTuningUh ?? 450;
    const cPf = 10000;
    const fResonant = 1 / (2 * Math.PI * Math.sqrt(lUh * 1e-6 * cPf * 1e-12)) / 1000;
    const isTuned = Math.abs(fCarrier - fResonant) < 2.5;

    return [
      {
        id: "continuous-radiation",
        phrase: "continuous radiation of electromagnetic waves of substantially uniform strength",
        active: true,
        tone: "live",
        caption: `f_c = ${fCarrier} kHz: Steady sinusoidal continuous-wave carrier emitted without spark decay.`,
      },
      {
        id: "sine-wave",
        phrase:
          "generating in said conductor continuous alternating currents of substantially sinusoidal waveform",
        active: mod <= 100,
        tone: isTuned ? "held" : "live",
        caption: `Resonance ${isTuned ? "LOCKED" : "DETUNED"} (f_0 = ${fResonant.toFixed(1)} kHz): Pure sinusoidal current in low-loss cage antenna.`,
      },
      {
        id: "electrolytic-detector",
        phrase: "electrolytic detector responsive to continuous wave oscillations",
        active: isTuned,
        tone: "live",
        caption:
          "Liquid barretter platinum micro-junction demodulates RF envelope directly into telephone receiver.",
      },
    ];
  }

  if (patentId === EDISON_LIGHTBULB_ID || patentId === EDISON_LAMP_LEGACY_ID) {
    const voltage = params.voltage ?? 110;
    const hotResistanceOhm = params.hotResistanceOhm ?? 145;
    const currentA = voltage / hotResistanceOhm;
    const isSourceHighResistance = hotResistanceOhm >= 100 && hotResistanceOhm <= 500;

    return [
      {
        id: "high-resistance",
        phrase:
          "high resistance, so as to allow of the practical subdivision of the electric light",
        active: isSourceHighResistance,
        tone: isSourceHighResistance ? "live" : "held",
        caption: `Declared R = ${hotResistanceOhm} Ω and V = ${voltage} V give I = ${currentA.toFixed(2)} A. The grant reports 100–500 Ω for its carbonized-thread example and contrasts that range with 1–4 Ω prior practice.`,
      },
      {
        id: "vacuum-preservation",
        phrase: "nearly perfect vacuum",
        active: true,
        tone: "held",
        caption:
          "The source reports a sealed bulb exhausted to one-millionth of an atmosphere (about 7.6×10⁻⁴ Torr), then separately describes exhaustion by a mercury pump and hermetic sealing.",
      },
      {
        id: "platina-leads",
        phrase: "fine platina wires for leading-wires",
        active: true,
        tone: "held",
        caption:
          "Edison says platina can be used because its expansion is nearly the same as glass, allowing fine leading wires to cross the sealed receiver wall.",
      },
      {
        id: "spiral-filament",
        phrase: "coiled as a spiral and carbonized",
        active: true,
        tone: "held",
        caption:
          "The source says a suitably coiled carbon residue can reach 2,000 Ω without exposing more than three-sixteenths of an inch of radiating surface; the display loop remains source topology, not a length measurement.",
      },
    ];
  }

  if (patentId === BELL_TELEPHONE_ID) {
    const voiceAmp = params.voiceAmplitude ?? 75;
    const freqHz = params.acousticFrequencyHz ?? 440;
    const isTransmitting = voiceAmp > 0;

    return [
      {
        id: "undulatory-current",
        phrase:
          "vibratory or undulatory current of electricity in contradistinction to a merely intermittent or pulsatory current",
        active: isTransmitting,
        tone: "live",
        caption: `f = ${freqHz} Hz: Continuous analog current modulation proportional to acoustic sound wave pressure, avoiding pulsed make-and-break.`,
      },
      {
        id: "electrical-undulations",
        phrase: "electrical undulations, similar in form to the vibrations of the air",
        active: isTransmitting,
        tone: "live",
        caption:
          "Acoustic air vibration directly translated to sinusoidal electromotive force via moving iron armature in magnetic field.",
      },
    ];
  }

  if (patentId === MORSE_TELEGRAPH_ID) {
    const currentMa = params.currentMa ?? 65;
    const miles = params.lineLengthMiles ?? 44;
    const hasCurrent = currentMa >= 20;

    return [
      {
        id: "metallic-conductors",
        phrase:
          "circuits of metallic conductors from any known generator of electricity or galvanism",
        active: hasCurrent,
        tone: "held",
        caption: `I = ${currentMa} mA over ${miles} miles: Closed galvanic loop transmitting discrete timed current impulses.`,
      },
      {
        id: "relay-regeneration",
        phrase:
          "produces an additional and original power or current of electricity or galvanism from the battery of said second circuit",
        active: miles >= 30,
        tone: "live",
        caption:
          "Electromagnetic relay closure switches a fresh local battery, overcoming long-distance line attenuation.",
      },
    ];
  }

  if (patentId === GOODYEAR_RUBBER_ID) {
    const tempC = params.vulcanTemp ?? 145;
    const sulfur = params.sulfurPct ?? 8;
    const isVulcanizing = tempC >= 130 && tempC <= 165 && sulfur >= 4;

    return [
      {
        id: "triple-compound",
        phrase:
          "twenty-five parts of india-rubber, five parts of sulphur, and seven parts of white lead",
        active: sulfur >= 4,
        tone: "held",
        caption: `Sulfur ${sulfur}% + lead oxide accelerator: Cross-links polyisoprene chains into resilient 3D elastomer network.`,
      },
      {
        id: "heat-action",
        phrase: "action of heat at a regulated temperature",
        active: isVulcanizing,
        tone: tempC >= 135 && tempC <= 155 ? "live" : "held",
        caption: `T_cure = ${tempC} °C (≈ ${Math.round(tempC * 1.8 + 32)} °F): Optimal thermal activation energy for sulfur radical cross-linking without polymer degradation.`,
      },
    ];
  }

  if (patentId === CORLISS_ENGINE_ID) {
    const rpm = params.engineRpm ?? 65;
    const pressurePsi = params.steamPressurePsi ?? 100;
    const isRunning = rpm >= 30 && pressurePsi >= 40;

    return [
      {
        id: "wrist-plate-motion",
        phrase:
          "communicating motion to the two valves from one rock shaft by connecting each valve with a separate arm or crank wrist of the rocker",
        active: isRunning,
        tone: "live",
        caption: `N = ${rpm} RPM: Oscillating wrist-plate accelerates valve opening and decelerates near closure extremes.`,
      },
      {
        id: "dead-point-dwell",
        phrase: "point of connection of the closed valves shall vibrate near the dead point",
        active: true,
        tone: "held",
        caption:
          "Closed steam valves dwell at wrist-plate dead center, minimizing leakage and reducing frictional wear.",
      },
    ];
  }

  if (patentId === WESTINGHOUSE_BRAKE_ID) {
    const pipePress = params.trainPipePressure ?? 0;
    const resPress = params.reservoirPipePressure ?? 90;
    const trip = params.accidentTrip ?? 0;
    const isBraking = pipePress < 50 || trip > 0;

    return [
      {
        id: "double-pipe-line",
        phrase: "double line of brake-pipes, which may be co-operative or independently operative",
        active: resPress >= 60,
        tone: "held",
        caption: `P_aux = ${resPress} psi: Dual line architecture allows continuous reservoir charging while operating pipe governs brake cylinder.`,
      },
      {
        id: "automatic-fail-safe",
        phrase: "admitted freely to the brake-cylinder, so as automatically to apply the brakes",
        active: isBraking,
        tone: "live",
        caption:
          "Fail-safe trip: Pipe depressurization causes triple valve to vent auxiliary reservoir directly into brake cylinder.",
      },
    ];
  }

  if (patentId === OTTO_ENGINE_ID) {
    const rpm = params.engineRpm ?? 180;
    const chargeGradingPresent = (params.claim1ChargeGradingPresent ?? 1) >= 0.5;
    const isRunning = (params.isRunning ?? 1) >= 0.5;

    return [
      {
        id: "dispersed-charge",
        phrase:
          "particles of the combustible gaseous mixture are more or less dispersed in an isolated condition in the air or other gas",
        active: chargeGradingPresent,
        tone: chargeGradingPresent ? "held" : "broken",
        caption: chargeGradingPresent
          ? "The source-described charge is fuel-rich near ignition and increasingly dispersed through the separate air charge; no numerical flame speed or pressure is inferred."
          : "Claim 1's spatial charge gradient is absent, so the source does not determine a replacement heat-release or pressure trace.",
      },
      {
        id: "four-stroke-cycle",
        phrase: "four strokes of the piston required for one complete operation",
        active: isRunning,
        tone: "live",
        caption: isRunning
          ? `Declared display speed N = ${rpm} RPM: four piston strokes occur across two crankshaft revolutions; US 194,047 prints no operating speed.`
          : "The shared mechanism tape is paused with the four-stroke topology held in its last admitted pose.",
      },
      {
        id: "counter-shaft-ratio",
        phrase: "the slide-crank K² makes one revolution while the engine-shaft makes two",
        active: true,
        tone: "held",
        caption: `The source's exact timing relation gives a displayed counter-shaft rate of ${(rpm / 2).toFixed(1)} RPM from the declared ${rpm} RPM crank input.`,
      },
    ];
  }

  if (patentId === GODDARD_ROCKET_ID) {
    const tubeRatio = params.tubeLengthRatio ?? 4.5;
    const releaseFraction = params.auxiliaryReleaseFraction ?? 0;
    const primaryConsumed = (params.primaryChargeConsumed ?? 0) !== 0;
    const primarySpinRpm = params.primarySpinRpm ?? 120;
    const gyroSpinRpm = params.gyroSpinRpm ?? 6_000;
    const gyroEnabled = (params.gyroEnabled ?? 1) !== 0;
    const gyroOperational = gyroEnabled && gyroSpinRpm > 0;
    const sequenceHeld = releaseFraction === 0 || primaryConsumed;

    return [
      {
        id: "staged-rockets",
        phrase:
          "primary rocket, comprising a combustion chamber and a firing tube, a secondary rocket mounted in said firing tube",
        active: releaseFraction === 0,
        tone: releaseFraction === 0 ? "held" : "live",
        caption:
          releaseFraction === 0
            ? "Auxiliary chamber 25 and tube 26 remain physically nested inside firing tube 24."
            : `Auxiliary release is ${Math.round(releaseFraction * 100)}% through the source firing path.`,
      },
      {
        id: "ordered-auxiliary-firing",
        phrase:
          "means for firing said secondary rocket when the explosive in the primary rocket is substantially consumed",
        active: sequenceHeld,
        tone: sequenceHeld ? "held" : "broken",
        caption: sequenceHeld
          ? "The requested auxiliary state follows the printed substantial-consumption condition."
          : "The auxiliary was released while the primary charge was still marked burning: a visible Claim 1 failure.",
      },
      {
        id: "claim-two-tapered-tube",
        phrase:
          "truncated cone of slight taper and having its length equal to not less than three times its longest diameter",
        active: tubeRatio >= 3,
        tone: tubeRatio >= 3 ? "held" : "broken",
        caption: `Tube 11 is L/D = ${tubeRatio.toFixed(1)}; Claim 2 requires L/D ≥ 3 and supplies no de Laval throat, area ratio, Mach number, or thrust value.`,
      },
      {
        id: "spin-and-gyro-restraint",
        phrase:
          "a gyroscope mounted thereon by which the support may be restrained from rotation with the head",
        active: gyroOperational,
        tone: gyroOperational ? "held" : "broken",
        caption: gyroOperational
          ? `Gyroscope 37 ideally holds support 33 at zero world rate while the declared rocket spin is ${primarySpinRpm.toFixed(0)} rpm.`
          : gyroEnabled
            ? `Gyroscope 37 is present but stopped, so support 33 inherits the declared ${primarySpinRpm.toFixed(0)} rpm head rotation.`
            : `Without gyroscope 37, support 33 inherits the declared ${primarySpinRpm.toFixed(0)} rpm head rotation.`,
      },
    ];
  }

  if (patentId === SUNDBACK_ZIPPER_ID) {
    const controls = readSundbackZipperControls(params);
    const tel = stepSundbackZipperSi(controls);

    return [
      {
        id: "staggered-scoops",
        phrase:
          "interlocking members secured at one end thereto in staggered relation, each member having at the free end a rounded recess on one side and a corresponding projection on the opposite side",
        active: controls.staggerAligned,
        tone: controls.staggerAligned ? "held" : "broken",
        caption: controls.staggerAligned
          ? `Opposing scoops maintain half-pitch stagger (${(tel.toothPitchMm / 2).toFixed(2)} mm offset), enabling clean nested interlock.`
          : "Stagger alignment broken: opposing teeth collide head-to-head at slider throat (Claim 1 violation).",
      },
      {
        id: "sliding-cam-action",
        phrase:
          "means sliding on both stringers for actuating said members to lock and unlock according to its direction of movement",
        active: tel.isLocked,
        tone: tel.isLocked ? "held" : "live",
        caption: tel.isLocked
          ? `Sliding cam has driven ${tel.engagedTeeth} of ${tel.totalTeeth} scoops into positive nested lock (cam normal force: ${tel.wedgeNormalForceN.toFixed(1)} N).`
          : "Slider is disengaged or open.",
      },
      {
        id: "transverse-flex-security",
        phrase:
          "so as to enable the fastener to be bent sharply transversely of its length without opening automatically",
        active: !tel.burstRefusal,
        tone: !tel.burstRefusal ? "held" : "broken",
        caption: !tel.burstRefusal
          ? `Transversely elongated cup geometry holds secure under ${controls.flexAngleDeg}° flex angle (burst limit: ${tel.burstResistanceN.toFixed(1)} N).`
          : `Burst rupture: lateral load exceeds chain limit (${tel.burstResistanceN.toFixed(1)} N).`,
      },
    ];
  }

  if (patentId === MESTRAL_VELCRO_ID) {
    const controls = readMestralVelcroControls(params);
    const tel = stepMestralVelcroSi(controls);
    const isThermallySet = tel.thermalRetentionFraction >= 0.7;
    const isEngaged = controls.engagementRatio > 0.3;
    const isWithinShearLimit = controls.appliedShearForceN <= tel.maxShearCapacity5cm2N;

    return [
      {
        id: "synthetic-raised-pile",
        phrase:
          "raised pile is made of artificial material, while at least part of the threads in said pile is provided near its end with material-engaging means",
        active: isEngaged,
        tone: isEngaged ? "held" : "broken",
        caption: isEngaged
          ? `Synthetic monofilament pile (${controls.hookDensityPerCm2} hooks/cm², d=${controls.filamentDiameterMm} mm) maintains upright elastic spring geometry.`
          : "Engagement ratio too low to establish continuous multi-hook pile contact.",
      },
      {
        id: "thermal-shape-setting",
        phrase:
          "heat the bar 5 before the cutting of the loops 6, so that the thread extending over the bar may assume and retain the shape imparted to it by the latter",
        active: isThermallySet,
        tone: isThermallySet ? "held" : "broken",
        caption: isThermallySet
          ? `Lancet bar temperature (${controls.heatSettingTempC}°C) has thermoformed nylon loops with ${(tel.thermalRetentionFraction * 100).toFixed(1)}% permanent elastic shape memory.`
          : `Insufficient thermal energy (${controls.heatSettingTempC}°C < 135°C): amorphous chains fail to freeze hook curvature upon cutting.`,
      },
      {
        id: "superposed-90-engagement",
        phrase:
          "superpose two pieces of fabric of the type illustrated in Fig. 1, after having imparted to one of the two pieces a 90° angular displacement in respect to the other piece and after turning them so that their pile surfaces face each other, the pile threads 9 of one piece engaging the pile threads 9 of the other piece through the co-operating hooks 4",
        active: isWithinShearLimit,
        tone: isWithinShearLimit ? "held" : "broken",
        caption: isWithinShearLimit
          ? `90° cross-array interlock sustains applied shear (${controls.appliedShearForceN} N <= ${tel.maxShearCapacity5cm2N.toFixed(1)} N max limit; shear stress: ${tel.shearStressCapacityN_Cm2.toFixed(1)} N/cm²).`
          : `Shear slippage: applied load (${controls.appliedShearForceN} N) exceeds maximum friction-hook capacity (${tel.maxShearCapacity5cm2N.toFixed(1)} N).`,
      },
      {
        id: "peeling-anisotropy-yield",
        phrase:
          "in the case of any straining, the fastening arrangement will yield before any damage is inflicted on the fabric",
        active: tel.forceAnisotropyRatio > 5,
        tone: tel.forceAnisotropyRatio > 5 ? "held" : "live",
        caption: `Peel fracture anisotropy active: steady peel requires only ${tel.totalPeelForceN.toFixed(2)} N (anisotropy ratio: ${tel.forceAnisotropyRatio.toFixed(1)}x over shear), peeling cleanly without fiber damage.`,
      },
    ];
  }

  if (patentId === FARNSWORTH_TV_ID) {
    const va = params.anodeVoltage ?? 1500;
    const lux = params.lightIntensityLux ?? 500;
    const hFreq = params.horizontalFreqKhz ?? 15.75;
    const vFreq = params.verticalFreqHz ?? 60;

    return [
      {
        id: "photo-emission",
        phrase:
          "develop an electronic discharge from said plate, in which each portion of the cross section of such electronic discharge will correspond in electrical intensity with the intensity of light",
        active: lux >= 100,
        tone: "live",
        caption: `Illumination = ${lux} Lux: Continuous electron image cloud emitted from photocathode proportional to scene luminance.`,
      },
      {
        id: "aperture-shutter",
        phrase: "electrical shutter is then interposed between said sensitive plate and the anode",
        active: true,
        tone: "held",
        caption: `Va = ${va} V: Fixed aperture dissects electron image as electromagnetic deflection sweeps the cloud across the target pinhole.`,
      },
      {
        id: "all-electronic",
        phrase: "without the necessity of employing any mechanically moving parts",
        active: hFreq >= 5,
        tone: "live",
        caption: `All-electronic raster scan (${hFreq} kHz H, ${vFreq} Hz V) eliminates mechanical Nipkow scanning disks.`,
      },
    ];
  }

  if (patentId === EINSTEIN_REFRIGERATOR_ID) {
    const qIn = params.heatInput ?? 220;
    const pTot = params.totalPressure ?? 15;
    const xNh3 = params.ammoniaRatio ?? 0.65;

    return [
      {
        id: "inert-gas-evaporation",
        phrase: "refrigerant evaporates in the presence of an inert gas",
        active: pTot >= 10,
        tone: "live",
        caption: `P_tot = ${pTot} atm: Butane evaporates into circulating inert gas (ammonia), absorbing latent heat at low partial pressure.`,
      },
      {
        id: "daltons-law",
        phrase: "partial pressure of the refrigerant is reduced thereby",
        active: xNh3 >= 0.5,
        tone: "live",
        caption: `x_NH3 = ${xNh3}: Total pressure remains high (${pTot} atm) while refrigerant partial pressure drops to cooling evaporation point.`,
      },
      {
        id: "ammonia-absorption",
        phrase: "ammonia gas is absorbed by the water, thus freeing the butane",
        active: qIn >= 100,
        tone: "live",
        caption: `Q_in = ${qIn} W: Downstream water absorber strips ammonia gas, causing butane vapor to condense and separate by buoyancy.`,
      },
      {
        id: "isobaric-uniformity",
        phrase:
          "pressure existing in the various members is uniform with the exception of slight pressure differences",
        active: true,
        tone: "held",
        caption:
          "Uniform pressure throughout eliminating mechanical pumps, valves, and moving seals (zero leakage risk).",
      },
    ];
  }

  if (patentId === LAMARR_FREQUENCY_HOPPING_ID) {
    const pos = params.recordPosition ?? 0;

    return [
      {
        id: "synchronized-records",
        phrase:
          "pair of records, one at the transmitting station and one at the receiving station, to run for a length of time ample for the remote control of a device such as a torpedo",
        active: true,
        tone: "held",
        caption: `Position ${pos}: Slaved slotted paper rolls maintain synchronous pseudo-random carrier frequency hopping.`,
      },
      {
        id: "eighty-eight-channels",
        phrase: "88 different carrier frequencies",
        active: true,
        tone: "live",
        caption:
          "88 discrete piano-roll channels spread RF spectrum, rendering radio guidance completely immune to single-frequency jamming.",
      },
    ];
  }

  if (patentId === SPENCER_MICROWAVE_ID) {
    const power = params.rfPowerSetting ?? 1;
    const isRadiating = power > 0;

    return [
      {
        id: "microwave-region",
        phrase: "microwave region",
        active: isRadiating,
        tone: "live",
        caption:
          "Wavelength λ ≈ 10 cm (f ≈ 2.45 GHz): Penetrates dielectric food volume, exciting dipolar water molecules.",
      },
      {
        id: "push-pull",
        phrase: "push-pull operation",
        active: isRadiating,
        tone: "held",
        caption:
          "Dual magnetrons alternate on opposite AC cycles to continuously energize the common waveguide.",
      },
      {
        id: "wave-guide",
        phrase: "wave guide",
        active: isRadiating,
        tone: "held",
        caption:
          "Hollow conductive duct channels microwave power from cavity resonators directly into food treatment zone.",
      },
      {
        id: "cavity-resonator",
        phrase: "cavity resonator",
        active: isRadiating,
        tone: "live",
        caption:
          "Radial anode vanes form resonant microwave cavities whose geometry dictates operating wavelength.",
      },
    ];
  }

  if (patentId === BARDEEN_TRANSISTOR_ID) {
    const ie = params.emitterCurrent ?? 1.5;
    const vc = params.collectorBias ?? -40;
    const sUm = params.pointSpacing ?? 50;

    return [
      {
        id: "hole-carriers",
        phrase:
          "positive carriers are missing or defect electrons, and are denoted by the term holes",
        active: ie > 0.5,
        tone: "live",
        caption: `Ie = ${ie} mA: Emitter injects excess minority hole carriers into N-type germanium surface layer.`,
      },
      {
        id: "forward-emitter",
        phrase: "emitter is normally biased in the direction of easy current flow",
        active: ie > 0,
        tone: "held",
        caption:
          "Forward-biased point contact lowers potential barrier for low-impedance minority hole injection.",
      },
      {
        id: "reverse-collector",
        phrase: "collector is biased in the reverse, or high resistance direction",
        active: vc <= -10,
        tone: "held",
        caption: `Vc = ${vc} V: Reverse bias produces high output impedance and strong electric collection field.`,
      },
      {
        id: "high-fraction-collection",
        phrase:
          "collector is so disposed in relation to the emitter that a large fraction of the emitter current enters the collector",
        active: sUm <= 75,
        tone: sUm <= 50 ? "live" : "held",
        caption: `Spacing = ${sUm} µm (< hole diffusion length): High collector collection efficiency (α ≈ 1.5) provides power and voltage gain.`,
      },
    ];
  }

  if (patentId === NOYCE_IC_ID) {
    const vr = params.reverseBias ?? 5;
    const tox = params.oxideThickness ?? 0.5;

    return [
      {
        id: "passivating-oxide",
        phrase:
          "insulating surface layer consisting essentially of oxide of the same semiconductor extending across the junctions",
        active: tox >= 0.2,
        tone: "held",
        caption: `t_ox = ${tox} µm: Thermally grown SiO2 passivates silicon surface and insulates P-N junction boundaries.`,
      },
      {
        id: "adherent-metal-leads",
        phrase:
          "leads in the form of vacuum-deposited or otherwise formed metal strips extending over and adherent to the insulating oxide layer",
        active: true,
        tone: "live",
        caption:
          "Evaporated aluminum interconnect strips run directly over oxide bridges, interconnecting circuit elements without shorting.",
      },
      {
        id: "dished-junctions",
        phrase:
          "dished, P-N junctions each having an edge extending to said surface and there surrounding and defining an enclosed region of said semiconductor",
        active: vr >= 1,
        tone: "live",
        caption: `VR = ${vr} V: Planar diffused junctions surface-terminate under oxide; reverse bias isolates adjacent component tubs.`,
      },
    ];
  }

  if (patentId === KWOLEK_KEVLAR_ID) {
    const conc = params.polymerConcentrationPct ?? 18.5;
    const draw = params.drawRatio ?? 6.5;

    return [
      {
        id: "anisotropic-dope",
        phrase: "Optically anisotropic dope consisting essentially of",
        active: conc >= 10,
        tone: "live",
        caption: `Concentration = ${conc} wt%: Liquid-crystalline nematic domains form in sulfuric acid spin dope.`,
      },
      {
        id: "viscosity-discontinuity",
        phrase:
          "decrease in viscosity with increasing concentration represented by a sharp discontinuity in the slope of the plot of the dope viscosity vs. polymer concentration curve without the formation of a solid phase",
        active: conc >= 15 && conc <= 22,
        tone: "live",
        caption:
          "Nematic alignment reduces shear viscosity above critical concentration threshold, facilitating extrusion.",
      },
      {
        id: "axial-alignment",
        phrase:
          "liquid-crystalline domains undergo spontaneous, nearly perfect axial alignment, yielding as-spun fibers of exceptionally high tensile modulus",
        active: draw >= 4.0,
        tone: "live",
        caption: `Draw ratio = ${draw}: Spin-stretch elongational flow aligns rigid PPTA rods parallel to filament axis.`,
      },
    ];
  }

  if (patentId === PARSONS_TURBINE_ID) {
    const rpm = params.rotorRpm ?? 3000;
    const pIn = params.inletPressurePsi ?? 180;

    return [
      {
        id: "graduated-expansion",
        phrase: "capacity or volume increases successively from one to four",
        active: pIn >= 100,
        tone: "held",
        caption: `P_inlet = ${pIn} psi: Turbine casing volume increases along the train to accommodate steam expansion.`,
      },
      {
        id: "reconfigurable-plumbing",
        phrase:
          "pipes and valves forming the connection between the turbines to couple them in series in simple parallel or in compound parallel",
        active: true,
        tone: "live",
        caption: `N = ${rpm} RPM: Valve network reconfigures flow from series (cruising economy) to compound-parallel (full combat speed).`,
      },
      {
        id: "vacuum-idling",
        phrase:
          "reversing-turbine running in vacuum while the first-mentioned turbines are running",
        active: true,
        tone: "held",
        caption:
          "Astern reversing turbine is vented to condenser vacuum to eliminate windage resistance during ahead propulsion.",
      },
    ];
  }

  if (patentId === TESLA_COIL_ID) {
    const transformer = stepTeslaTransformerSi(readTeslaTransformerControls(params));
    const commonNodeConnected = (params.claim1CommonNodeConnected ?? 1) >= 0.5;

    return [
      {
        id: "high-potential-purpose",
        phrase: "developing electrical currents of high potential",
        active: true,
        tone: "held",
        caption:
          "The source states the high-potential purpose but does not print excitation, impedance, loss, load, or an absolute output potential; the kernel therefore reports no voltage.",
      },
      {
        id: "primary-secondary-earth-bond",
        phrase:
          "I connect one end of the secondary, or that in proximity to the primary, to earth, and in order to more effectually provide against injury to persons or to the apparatus I also connect it with the primary",
        active: commonNodeConnected,
        tone: commonNodeConnected ? "held" : "broken",
        caption: commonNodeConnected
          ? "The Claim 1 secondary terminal remains electrically bonded to the adjacent primary end and to earth."
          : "The removable bridge is open, visibly breaking the Claim 1 primary / secondary / earth common node without inventing a voltage or damage result.",
      },
      {
        id: "quarter-wave-secondary",
        phrase:
          "a length of secondary which is approximately one-quarter of the wave length of the electrical disturbance",
        active: Math.abs(transformer.quarterWaveErrorDeg) < 0.01,
        tone: Math.abs(transformer.quarterWaveErrorDeg) < 0.01 ? "live" : "broken",
        caption: `βl = ${transformer.electricalLengthDeg.toFixed(1)}°; developed wire = ${transformer.secondaryLengthMiles.toFixed(1)} mi and the current quarter-wave target = ${transformer.quarterWaveLengthMiles.toFixed(2)} mi.`,
      },
      {
        id: "voltage-grading",
        phrase:
          "convolutions of the conductor of the latter will be farther removed from the primary as the liability of injury from the effects of potential increases, the terminal or point of highest potential being the most remote",
        active: true,
        tone: "held",
        caption:
          "Conical or spiral turns place high-voltage output remote from primary, grading dielectric potential stress.",
      },
      {
        id: "flat-spiral",
        phrase:
          "flat spiral, and this form I generally employ, winding the primary on the outside of the secondary and taking off the current from the latter at the center",
        active: true,
        tone: "held",
        caption:
          "The flat-spiral form keeps the high-potential point remote while adjacent turns remain comparatively near one another in potential.",
      },
    ];
  }

  if (patentId === TESLA_TELEAUTOMATON_ID) {
    const rudder = params.rudderAngle ?? 15;
    const throttle = params.propellerThrottlePct ?? 75;
    const rfKhz = params.rfFrequency ?? 150;
    const pulses = params.pulseCount ?? 3;

    return [
      {
        id: "wireless-control",
        phrase:
          "controlling from a distance the operation of the propelling-engines, the steering apparatus, and other mechanism carried by moving bodies or floating vessels",
        active: true,
        tone: "live",
        caption: `Rudder = ${rudder}°, Throttle = ${throttle}%: Wireless remote control of steering and propulsion without umbilical tether.`,
      },
      {
        id: "natural-media-waves",
        phrase:
          "producing waves, impulses, or radiations which are received through the earth, water, or atmosphere",
        active: pulses > 0,
        tone: "live",
        caption: `f_rf = ${rfKhz} kHz: Synchronous RF impulses transmitted through space to tuned receiver.`,
      },
      {
        id: "coherer-escapement",
        phrase: "anchor-escapement",
        active: pulses > 0,
        tone: "held",
        caption:
          "Clockwork anchor escapement turns rotating coherer drum 180° after each RF pulse to decohere oxidized particles.",
      },
    ];
  }

  if (patentId === MARCONI_ID) {
    const h = params.aerialHeight ?? 88;
    return [
      {
        id: "aerial",
        phrase: "elevated",
        active: h >= 30,
        tone: "live",
        caption: `Quarter-wave mast ${h} m; λ ≈ ${Math.round(4 * h)} m.`,
      },
    ];
  }

  if (patentId === "us-x1-hopkins-potash") {
    const t = params.furnaceTempC ?? 850;
    return [
      {
        id: "pearl-ash",
        phrase: "Pearl ash",
        active: t >= 600,
        tone: t >= 600 ? "held" : "broken",
        caption: "Potash raw salts calcined in reverberatory furnace to produce purified pearlash.",
      },
      {
        id: "burning-raw-ashes",
        phrase: "burning the raw Ashes",
        active: true,
        tone: "live",
        caption:
          "Calcination burn oxidizes combustible carbonaceous impurities out of raw wood ashes.",
      },
    ];
  }

  if (patentId === "us-x72-whitney-cotton-gin") {
    const rpm = params.crankRpm ?? 60;
    return [
      {
        id: "breastwork",
        phrase: "breastwork",
        active: true,
        tone: "held",
        caption: "Slotted iron grid bars allow saw teeth to pass while barring larger cottonseeds.",
      },
      {
        id: "cotton",
        phrase: "cotton",
        active: rpm > 0,
        tone: rpm > 0 ? "live" : "held",
        caption: `Crank Speed=${rpm} RPM: Circular teeth rip fibers through breastwork slots.`,
      },
    ];
  }

  if (patentId === "us-x8277-mccormick-reaper") {
    const speed = params.forwardSpeedMph ?? 3.5;
    return [
      {
        id: "blade",
        phrase: "blade",
        active: speed > 0,
        tone: "live",
        caption: `Forward Speed=${speed} mph: Reciprocating sickle blade shears standing grain stalks against guard fingers.`,
      },
      {
        id: "reel",
        phrase: "reel",
        active: speed > 0.5,
        tone: "held",
        caption:
          "Rotating wooden bat reel sweeps grain heads onto the cutter bar and collecting platform.",
      },
    ];
  }

  if (patentId === "us-x9430-colt-revolver") {
    const angle = params.cockingAngle ?? 72;
    return [
      {
        id: "cylinder",
        phrase: "cylinder",
        active: angle >= 30,
        tone: "live",
        caption: `Cocking Angle=${angle}°: Revolving cylinder rotates one chamber position when the hammer is cocked.`,
      },
      {
        id: "hammer",
        phrase: "hammer",
        active: true,
        tone: "held",
        caption: "Central hammer cocks lockwork pawl to index cylinder and compress mainspring.",
      },
    ];
  }

  if (patentId === "us-132-davenport-electric-motor") {
    const v = params.batteryVoltage ?? 12;
    return [
      {
        id: "magnetism",
        phrase: "magnetism",
        active: true,
        tone: "held",
        caption:
          "Fixed permanent stator magnets provide continuous magnetic flux across rotor gap.",
      },
      {
        id: "electro-magnetic",
        phrase: "electro-magnetic",
        active: v > 0,
        tone: "live",
        caption: `Battery Voltage=${v} V: Commutated current energizes rotor electro-magnets to maintain continuous torque.`,
      },
    ];
  }

  if (patentId === "us-588-ericsson-propeller") {
    const rpm = params.shaftRpm ?? 180;
    return [
      {
        id: "propeller",
        phrase: "propeller",
        active: rpm > 0,
        tone: "live",
        caption: `Shaft Speed=${rpm} RPM: Submerged helical blades displace water rearward to produce thrust.`,
      },
      {
        id: "shaft",
        phrase: "shaft",
        active: true,
        tone: "held",
        caption: "Submerged propeller shaft is coupled to steam engine piston rod.",
      },
    ];
  }

  if (patentId === "us-3237-rillieux-evaporator") {
    const effects = params.numberOfEffects ?? 3;
    return [
      {
        id: "evaporation",
        phrase: "evaporation",
        active: effects >= 2,
        tone: "live",
        caption: `Effects=${effects}: Latent heat of steam boiled off from first vessel boils juice in subsequent lower-pressure vessels.`,
      },
      {
        id: "vacuum",
        phrase: "vacuum",
        active: true,
        tone: "held",
        caption: "Staged vacuum levels lower boiling points to prevent syrup carmelization.",
      },
    ];
  }

  if (patentId === "us-4750-howe-sewing-machine") {
    const rpm = params.crankRpm ?? 240;
    const sew = stepHoweSewingMachine(rpm, params.loopSlackPct ?? 65, params.stitchPitchMm ?? 3.5);
    return [
      {
        id: "needle",
        phrase: "needle",
        active: rpm > 0,
        tone: "live",
        caption: `The curved needle remains fixed to arm G; its printed eye is about ${sew.needleEyeFromPointIn} inch from the point. ${rpm} RPM is a declared display cadence.`,
      },
      {
        id: "shuttle",
        phrase: "shuttle",
        active: sew.claim1InterlockPossible,
        tone: sew.claim1InterlockPossible ? "held" : "broken",
        caption: sew.claim1InterlockPossible
          ? "Shuttle K remains in trough I and can pass between the needle and upper thread during the loop-open phase."
          : "Refused: the displayed upper-thread loop does not clear shuttle K, so the claimed interlock cannot be reported.",
      },
      {
        id: "lifting-rod",
        phrase: "lifting rod",
        active: sew.loopSlackPct > 0,
        tone: sew.loopSlackPct > 0 ? "live" : "broken",
        caption: `Rod W supplies ${sew.loopSlackPct}% displayed loop slack; this is a normalized presentation control, not a force measurement from the grant.`,
      },
    ];
  }

  if (patentId === "us-6469-lincoln-buoy") {
    const pct = params.inflationPct ?? 80;
    return [
      {
        id: "buoyant-chambers",
        phrase: "buoyant chambers",
        active: pct > 20,
        tone: pct > 50 ? "held" : "live",
        caption: `Inflation=${pct}%: Expandable bellows chambers on hull sides inflate to increase water displacement.`,
      },
      {
        id: "shoal",
        phrase: "shoal",
        active: true,
        tone: "held",
        caption: "Increased buoyant lift reduces vessel draft to float over shallow river shoals.",
      },
    ];
  }

  if (patentId === "us-31128-otis-elevator") {
    const state = stepOtis1861Topology(readOtisTopologyControls(params));
    return [
      {
        id: "breaking-rope-g",
        phrase: "breaking of the rope G",
        active: !state.ropeGTaut,
        tone: state.ropeGTaut ? "held" : "live",
        caption: state.ropeGTaut
          ? "Rope G remains intact; safety bar F holds the E/f linkage in its running state."
          : "Rope G is broken in the displayed counterfactual; F releases the paired E/f linkage.",
      },
      {
        id: "pawls-teeth-lock",
        phrase: "pawls and teeth to lock together",
        active: state.pawlsFEngaged,
        tone: state.freeFallCounterfactual ? "broken" : state.pawlsFEngaged ? "live" : "held",
        caption: state.freeFallCounterfactual
          ? "Claim 1 hook geometry is inverted, so the kernel refuses to assert a lock."
          : state.pawlsFEngaged
            ? "Platform weight has turned hook pawls f into hook racks C: Claim 1 is satisfied."
            : "Claim 1 geometry remains available while rope G is intact.",
      },
      {
        id: "simultaneous-brake-belt-shift",
        phrase: "simultaneous application of the brake and the shifting of the belts",
        active: state.bothBeltsIdle,
        tone: state.claim3StopInterlockSatisfied ? "held" : "broken",
        caption: state.claim3StopInterlockSatisfied
          ? "A stop moves O/P to idle pulleys J/K while applying brake shoe Z to working pulley L."
          : "Claim 3 is inverted: O/P are idle, but brake Z is disconnected from the stop action.",
      },
      {
        id: "counterpoise-opposite-side",
        phrase: "opposite side from the lifting-rope G",
        active: state.claim4CounterpoiseTopologySatisfied,
        tone: state.claim4CounterpoiseTopologySatisfied ? "held" : "broken",
        caption: state.claim4CounterpoiseTopologySatisfied
          ? "Rope Q is opposite-wound on drum H, so counterpoise R moves opposite platform D."
          : "Claim 4 is inverted: R follows D instead of opposing it.",
      },
    ];
  }

  if (patentId === "us-36836-gatling-gun") {
    const rpm = params.crankRpm ?? 80;
    return [
      {
        id: "barrels",
        phrase: "barrels",
        active: rpm > 0,
        tone: "live",
        caption: `Crank Speed=${rpm} RPM: Revolving cluster of 6 barrels distributes heat across rotating chambers.`,
      },
      {
        id: "carrier",
        phrase: "carrier",
        active: true,
        tone: "held",
        caption:
          "Grooved carrier block feeds cartridges and guides lock plungers through firing cycle.",
      },
    ];
  }

  if (patentId === "us-48475-yale-lock") {
    const ins = params.keyInsertionPct ?? 100;
    const isAligned = ins >= 90;
    return [
      {
        id: "tumblers",
        phrase: "tumblers",
        active: isAligned,
        tone: isAligned ? "held" : "broken",
        caption: `Key Insertion=${ins}%: Pin tumblers align along cylinder shear line to permit plug rotation.`,
      },
      {
        id: "key",
        phrase: "key",
        active: true,
        tone: "live",
        caption:
          "Notched flat key bittings lift individual pin pairs to precisely matching heights.",
      },
    ];
  }

  if (patentId === "us-78317-nobel-dynamite") {
    const ng = params.ngConcentrationPct ?? 75;
    return [
      {
        id: "porous-substance",
        phrase: "porous substance",
        active: true,
        tone: "held",
        caption:
          "Inert porous kieselguhr diatomaceous earth absorbs three times its weight of liquid nitroglycerin.",
      },
      {
        id: "nitro-glycerine",
        phrase: "nitro-glycerine",
        active: ng >= 50,
        tone: "live",
        caption: `NG Concentration=${ng}%: Stabilized explosive paste detonates reliably when initiated by percussion cap.`,
      },
    ];
  }

  if (patentId === "us-79265-sholes-typewriter") {
    const wpm = params.typingSpeedWpm ?? 40;
    return [
      {
        id: "type-bars",
        phrase: "type-bars",
        active: wpm > 0,
        tone: "live",
        caption: `Typing Speed=${wpm} WPM: Radial typebars swing upward to strike paper on platen.`,
      },
      {
        id: "carriage",
        phrase: "carriage",
        active: true,
        tone: "held",
        caption:
          "Spring escapement steps paper carriage one character space leftward after each strike.",
      },
    ];
  }

  if (patentId === "us-105338-hyatt-celluloid") {
    const t = params.steamTempC ?? 125;
    return [
      {
        id: "pyroxyline",
        phrase: "pyroxyline",
        active: t >= 100,
        tone: "held",
        caption:
          "Nitrocellulose pyroxylin solid solution plasticized with camphor forms synthetic thermoplastic.",
      },
      {
        id: "camphor",
        phrase: "camphor",
        active: true,
        tone: "live",
        caption:
          "Solid camphor solvent converts fibrous nitrocellulose into homogeneous moldable resin.",
      },
    ];
  }

  if (patentId === "us-120057-gramme-dynamo") {
    const rpm = params.shaftRpm ?? 900;
    return [
      {
        id: "ring",
        phrase: "ring",
        active: rpm > 0,
        tone: "live",
        caption: `Armature Speed=${rpm} RPM: Continuous toroidal iron ring armature generates non-pulsating DC voltage.`,
      },
      {
        id: "conductors",
        phrase: "conductors",
        active: true,
        tone: "held",
        caption:
          "Helically wound copper conductor coils connect at regular intervals to commutator bars.",
      },
    ];
  }

  if (patentId === "us-135245-pasteur-fermentation") {
    const co2 = params.co2SweepPct ?? 100;
    return [
      {
        id: "wort",
        phrase: "wort",
        active: true,
        tone: "held",
        caption:
          "Boiled hopped wort is cooled and fermented in closed vessels protected from atmospheric spores.",
      },
      {
        id: "expulsion-air",
        phrase: "expulsion of the air",
        active: co2 >= 80,
        tone: "live",
        caption: `CO2 Sweep=${co2}%: Expulsion of atmospheric air prevents contamination by wild yeasts and acidifying bacteria.`,
      },
    ];
  }

  if (patentId === "us-157124-glidden-barbed-wire") {
    const twists = params.twistsPerFoot ?? 6;
    return [
      {
        id: "transverse-spur-wire",
        phrase: "transverse spur-wire",
        active: true,
        tone: "live",
        caption:
          "Short pointed spur wire coiled around primary strand presents sharp defensive thorns.",
      },
      {
        id: "wire-strands",
        phrase: "wire strands",
        active: twists >= 4,
        tone: "held",
        caption: `Twist Density=${twists} twists/ft: Two longitudinal wire strands interlock and clamp barbs securely in place.`,
      },
    ];
  }

  if (patentId === "us-200521-edison-phonograph") {
    const rpm = params.mandrelRpm ?? 60;
    const db = params.voiceVolumeDb ?? 75;
    return [
      {
        id: "cylinder",
        phrase: "cylinder",
        active: rpm > 0,
        tone: "live",
        caption: `Mandrel Speed=${rpm} RPM: Grooved metallic cylinder wrapped in tinfoil advances helically on lead screw.`,
      },
      {
        id: "diaphragm",
        phrase: "diaphragm",
        active: db > 40,
        tone: "live",
        caption: `Sound Volume=${db} dB: Acoustic diaphragm vibrates recording stylus to indent physical sound grooves in foil.`,
      },
    ];
  }

  if (patentId === "us-233692-pelton-water-wheel") {
    const rpm = params.runnerRpm ?? 650;
    return [
      {
        id: "buckets",
        phrase: "buckets",
        active: rpm > 0,
        tone: "live",
        caption: `Runner Speed=${rpm} RPM: Double hemispherical cups reverse water flow 180° to extract maximum kinetic impulse.`,
      },
      {
        id: "apex",
        phrase: "apex",
        active: true,
        tone: "held",
        caption:
          "Central wedge apex splits incoming high-velocity water jet cleanly without splash shock.",
      },
    ];
  }

  if (patentId === "us-235199-bell-photophone") {
    const lux = params.solarIrradianceWPerM2 ?? 850;
    return [
      {
        id: "beam-of-rays",
        phrase: "beam of rays",
        active: lux > 200,
        tone: "live",
        caption: `Solar Irradiance=${lux} W/m²: Sunlight reflected from acoustic mirror diaphragm carries voice waveforms through free space.`,
      },
      {
        id: "sensitive-substance",
        phrase: "sensitive substance",
        active: true,
        tone: "held",
        caption:
          "Crystalline selenium photocell resistance varies with beam intensity to reproduce speech in telephone receiver.",
      },
    ];
  }

  if (patentId === "us-247804-delaval-separator") {
    const rpm = params.bowlRpm ?? 6000;
    return [
      {
        id: "hollow-chamber",
        phrase: "hollow chamber",
        active: rpm > 2000,
        tone: "live",
        caption: `Rotor Speed=${rpm} RPM: Rotating hollow chamber D spins upon vertical shaft i to separate fluids by centrifugal action.`,
      },
      {
        id: "separated-fluids",
        phrase: "separated fluids",
        active: true,
        tone: "held",
        caption:
          "Continuous delivery nozzles discharge separated heavy skim milk and light cream simultaneously.",
      },
    ];
  }

  if (patentId === "us-307031-edison-indicator") {
    const v = params.filamentVoltageV ?? 110;
    return [
      {
        id: "conducting-substance",
        phrase: "conducting substance",
        active: true,
        tone: "held",
        caption: "Platinum plate electrode mounted inside bulb collects thermionic space charge.",
      },
      {
        id: "vacuous-space",
        phrase: "vacuous space",
        active: v >= 90,
        tone: "live",
        caption: `Filament Voltage=${v} V: Thermionic electron current crosses vacuous space to indicate mains voltage variations.`,
      },
    ];
  }

  if (patentId === "us-313224-mergenthaler-linotype") {
    const temp = params.potTemp ?? 260;
    return [
      {
        id: "matrix-bars",
        phrase: "matrix-bars",
        active: true,
        tone: "held",
        caption: "Vertical matrix-bars descend to align intaglio character dies into reading line.",
      },
      {
        id: "printing-bars",
        phrase: "printing-bars",
        active: temp >= 230,
        tone: "live",
        caption: `Metal Pot=${temp}°C: Molten eutectic lead alloy cast against matrix produces solid justified printing slug.`,
      },
    ];
  }

  if (patentId === "us-319596-maxim-machine-gun") {
    const stroke = params.cyclePhaseDeg !== undefined || params.cyclePhase !== undefined;
    return [
      {
        id: "tubular-piece",
        phrase: "sliding tubular piece",
        active: true,
        tone: "held",
        caption:
          "Expanding propellant gases push internal shoulders of sliding tubular piece l forward along fixed barrel B.",
      },
      {
        id: "sliding-breech-block",
        phrase: "sliding breech-block",
        active: stroke,
        tone: "live",
        caption:
          "Cross-head d and crankshaft e draw sliding breech-block C rearward to open the chamber and extract the spent cartridge.",
      },
      {
        id: "crank-shaft",
        phrase: "crank-shaft",
        active: true,
        tone: "held",
        caption:
          "Transverse crankshaft e converts operating rod translation into rotary torque, winding volute return spring k.",
      },
      {
        id: "volute-spring",
        phrase: "spring k",
        active: true,
        tone: "held",
        caption:
          "Frame-anchored volute spring k stores mechanical energy to drive the forward closing and chambering stroke.",
      },
    ];
  }

  if (patentId === "us-347140-thomson-welding") {
    const amps = params.weldCurrentAmps ?? 4500;
    const press = params.clampPressureMpa ?? 35;
    return [
      {
        id: "current",
        phrase: "current",
        active: amps > 1000,
        tone: "live",
        caption: `Weld Current=${amps} A: Heavy low-voltage AC current generates intense Joule I²R heat at abutting faces.`,
      },
      {
        id: "pressure",
        phrase: "pressure",
        active: press > 10,
        tone: "held",
        caption: `Clamp Pressure=${press} MPa: Mechanical forge upset consolidates plasticized interface into atomic weld joint.`,
      },
    ];
  }

  if (patentId === "us-361931-daimler-engine") {
    const selection = Math.max(-1, Math.min(1, Math.round(params.shaftPosition ?? 1)));
    const pumpActive = (params.coolingPumpEnabled ?? 0) > 0.5;
    return [
      {
        id: "propeller",
        phrase: "propeller",
        active: selection !== 0,
        tone: "live",
        caption:
          selection === 1
            ? "Ahead: the sliding shaft places coupling members a and a² in contact; propeller thrust can maintain that contact."
            : selection === -1
              ? "Astern: intermediate disks e¹ and e² engage a² and c so the propeller turns opposite the motor shaft."
              : "Neutral: both source-defined drive paths are open, so the propeller shaft is not driven.",
      },
      {
        id: "friction-coupling",
        phrase: "friction-coupling",
        active: selection === 1,
        tone: "held",
        caption:
          selection === 1
            ? "Coupling members a and a² are in ahead contact."
            : "The ahead coupling members are separated.",
      },
      {
        id: "reversing-gearing",
        phrase: "gearing",
        active: selection === -1,
        tone: "held",
        caption:
          selection === -1
            ? "Disks e¹/e² bridge a² and c for astern rotation."
            : "The astern intermediate disks are clear of the shaft disks.",
      },
      {
        id: "cooling-pipes",
        phrase: "pipes",
        active: true,
        tone: "held",
        caption:
          "Fore and aft pipes s¹ and s² form the source-defined cooling-water path whether or not optional pump u is used.",
      },
      {
        id: "centrifugal-pump",
        phrase: "centrifugal pump",
        active: pumpActive,
        tone: "live",
        caption: pumpActive
          ? "Optional centrifugal pump u augments the connected cooling path."
          : "Optional pump u is idle; the patent's fore-and-aft pipes remain present.",
      },
    ];
  }

  if (patentId === "us-388850-eastman-kodak") {
    return [
      {
        id: "detective-cameras",
        phrase: "detective cameras",
        active: true,
        tone: "held",
        caption:
          "Handheld portable box camera enables spontaneous snapshot photography without tripod.",
      },
      {
        id: "film-holder",
        phrase: "film-holder",
        active: true,
        tone: "live",
        caption: "Integrated roll-film holder holds 100-exposure continuous paper film spool.",
      },
    ];
  }

  if (patentId === "us-395781-hollerith-tabulating") {
    const cpm = params.cardsPerMin ?? 65;
    return [
      {
        id: "circuit-actuating-index-points",
        phrase: "circuit-actuating index-points",
        active: true,
        tone: "held",
        caption:
          "Punched holes in standardized card grid correspond to discrete demographic variables.",
      },
      {
        id: "compiling-statistics",
        phrase: "compiling statistics",
        active: cpm > 0,
        tone: "live",
        caption: `Speed=${cpm} cards/min: Mercury pin press and electro-magnetic dials tabulate census totals automatically.`,
      },
    ];
  }

  if (patentId === "us-400766-hall-aluminium") {
    const amps = params.currentAmperes ?? 1200;
    const temp = params.bathTemperatureCelsius ?? 960;
    return [
      {
        id: "fused-fluoride-salt",
        phrase: "fused fluoride salt",
        active: temp >= 900,
        tone: "held",
        caption: `Bath Temp=${temp}°C: Molten sodium aluminum fluoride cryolite bath dissolves alumina at accessible temperatures.`,
      },
      {
        id: "electric-current",
        phrase: "electric current",
        active: amps > 400,
        tone: "live",
        caption: `Electrolytic Current=${amps} A: Direct electric current reduces Al3+ cations into dense molten aluminium metal.`,
      },
    ];
  }

  if (patentId === "us-470918-reno-escalator") {
    const speed = params.beltSpeed ?? 0.5;
    return [
      {
        id: "endless-belt",
        phrase: "endless belt",
        active: speed > 0,
        tone: "live",
        caption: `Incline Velocity=${speed} m/s: Cleated hardwood continuous conveyor belt carries passengers upward at 25°.`,
      },
      {
        id: "comb",
        phrase: "comb",
        active: true,
        tone: "held",
        caption:
          "Intermeshing stationary comb teeth at landings ensure smooth transfer without catching footwear.",
      },
    ];
  }

  if (patentId === "us-542846-diesel-engine") {
    const cr = params.compressionRatio ?? 14.5;
    return [
      {
        id: "compressing-air",
        phrase: "compressing air",
        active: cr >= 12,
        tone: "live",
        caption: `Compression Ratio=${cr}:1: Pure air compressed past fuel ignition temperature before fuel injection.`,
      },
      {
        id: "converting-the-heat",
        phrase: "converting the heat",
        active: true,
        tone: "held",
        caption:
          "Direct fuel injection sustains controlled isobaric combustion for high thermal efficiency.",
      },
    ];
  }

  if (patentId === "us-621195-zeppelin-airship") {
    return [
      {
        id: "framework",
        phrase: "framework",
        active: true,
        tone: "held",
        caption:
          "Rigid aluminum lattice framework maintains streamlined hull form independent of internal gas pressure.",
      },
      {
        id: "gas-bag",
        phrase: "gas-bag",
        active: true,
        tone: "held",
        caption: "Multiple isolated interior hydrogen cells provide distributed aerostatic lift.",
      },
    ];
  }

  if (patentId === "us-727650-linde-air-liquefaction") {
    const pin = params.inletPressureAtm ?? 200;
    return [
      {
        id: "expanding-it-through-a-suitable-valve",
        phrase: "expanding it through a suitable valve",
        active: pin >= 100,
        tone: "live",
        caption: `Inlet Pressure=${pin} atm: Joule-Thomson throttling expansion produces cumulative cooling.`,
      },
      {
        id: "process-of-refrigerating-air",
        phrase: "process of refrigerating air",
        active: true,
        tone: "held",
        caption:
          "Countercurrent heat exchanger regenerative loop precools incoming gas until liquid air condenses.",
      },
    ];
  }

  if (patentId === "us-808897-carrier-air-conditioner") {
    const spray = params.sprayRatePct ?? 60;
    return [
      {
        id: "upright-plates",
        phrase: "upright plates",
        active: true,
        tone: "held",
        caption:
          "Vertical sinuous baffle plates separate entrained water mist and airborne particulates.",
      },
      {
        id: "air-purifying-apparatus",
        phrase: "air-purifying apparatus",
        active: spray > 20,
        tone: "live",
        caption: `Spray Rate=${spray}%: Water spray chamber washes air and fixes dew-point temperature.`,
      },
    ];
  }

  if (patentId === "us-2543181-land-polaroid") {
    const p = params.podRupturePressurePsi ?? 45;
    return [
      {
        id: "container-holding",
        phrase: "container holding",
        active: p >= 30,
        tone: "live",
        caption: `Pod Pressure=${p} psi: Rupturable reagent pod releases viscous alkaline developer between sheets.`,
      },
      {
        id: "photosensitive-layer",
        phrase: "photosensitive layer",
        active: true,
        tone: "held",
        caption:
          "Exposed silver halide is reduced while unexposed silver diffuses to positive receiver sheet in 60s.",
      },
    ];
  }

  if (patentId === "us-3541541-engelbart-mouse") {
    const speed = params.mouseSpeed ?? 350;
    return [
      {
        id: "display-system",
        phrase: "display system",
        active: speed > 0,
        tone: "live",
        caption: `Mouse Velocity=${speed} mm/s: Orthogonal rolling wheels track 2D desktop coordinates.`,
      },
      {
        id: "computer",
        phrase: "computer",
        active: true,
        tone: "held",
        caption: "Digital resolver converts potentiometer pulse trains into CRT cursor position.",
      },
    ];
  }

  if (patentId === "us-4136359-wozniak-apple") {
    return [
      {
        id: "color-reference",
        phrase: "color reference",
        active: true,
        tone: "held",
        caption:
          "Master 14.31818 MHz crystal divider synthesizes 3.579545 MHz NTSC subcarrier without analog delays.",
      },
      {
        id: "timing-apparatus",
        phrase: "timing apparatus",
        active: true,
        tone: "live",
        caption:
          "Shared two-phase clock interleaves 6502 CPU and video display memory access with zero contention.",
      },
    ];
  }

  if (patentId === "us-6120588-eink") {
    const v = params.electrodeVoltageVolts ?? 15;
    return [
      {
        id: "microcapsule",
        phrase: "microcapsule",
        active: true,
        tone: "held",
        caption:
          "Transparent microcapsules contain oppositely charged white titania and black carbon pigment particles.",
      },
      {
        id: "first-particle-having-a-first-charge",
        phrase: "first particle having a first charge",
        active: v > 2,
        tone: "live",
        caption: `Drive Voltage=${v} V: Electric field drives particles electrophoretically to form bistable reflective image.`,
      },
    ];
  }

  if (patentId === "us-6285999-pagerank") {
    const d = params.dampingFactor ?? 0.85;
    return [
      {
        id: "scoring-a-plurality-of-linked-documents",
        phrase: "scoring a plurality of linked documents",
        active: true,
        tone: "held",
        caption:
          "Recursive link analysis models page authority as principal eigenvector of web link matrix.",
      },
      {
        id: "plurality-of-documents",
        phrase: "plurality of documents",
        active: d > 0.5,
        tone: "live",
        caption: `Damping Factor=${d}: Probability distribution over random surfer navigation vs. teleports.`,
      },
    ];
  }

  if (patentId === "us-6331181-davinci") {
    const ratio = params.motionScaleRatio ?? 3.0;
    const compatibilityPresent = (params.tremorFilterEnabled ?? 1) > 0.5;
    return [
      {
        id: "robotic-surgical-tool",
        phrase: "robotic surgical tool",
        active: true,
        tone: "held",
        caption:
          "The releasable tool carries a proximal interface, a distal end effector, and tool-specific circuitry or memory.",
      },
      {
        id: "processor-which-directs-movement",
        phrase: "processor which directs movement",
        active: compatibilityPresent,
        tone: "live",
        caption: compatibilityPresent
          ? `Compatibility identifier is present; the ${ratio.toFixed(0)}-entry illustrative offset control represents tool-specific data available to the processor.`
          : "Compatibility identifier is absent, so the source-facing processor/tool boundary is not satisfied.",
      },
    ];
  }

  if (patentId === "us-6594844-roomba") {
    const opticalSensorEnabled = (params.opticalSensorEnabled ?? 1) >= 0.5;
    const sensor = stepRoomba({
      wheelSpeedMps: params.wheelSpeedMps ?? 0.3,
      turnRateRadSec: params.turnRateRadSec ?? 1.5,
      roomWidth: ROOMBA_ROOM.width,
      roomHeight: ROOMBA_ROOM.height,
      sensorHeightInches: params.sensorHeightInches,
      wallDistanceInches: params.wallDistanceInches,
      opticalSensorEnabled,
    });
    return [
      {
        id: "intersecting-optical-fields",
        phrase: "first directed field of photons intersects said directed field of emission",
        active: opticalSensorEnabled,
        tone: opticalSensorEnabled ? "held" : "broken",
        caption: opticalSensorEnabled
          ? `Emitter/detector overlap = ${(sensor.surfaceOverlapFraction * 100).toFixed(0)}%; the chassis-mounted fields meet at the modeled finite surface region.`
          : "The optical fields are disabled, so the Claim 1 intersection condition is absent.",
      },
      {
        id: "surface-absence-redirect",
        phrase: "redirects said robot housing when said surface is not present",
        active: opticalSensorEnabled,
        tone: opticalSensorEnabled ? "live" : "broken",
        caption: opticalSensorEnabled
          ? `Surface test=${sensor.surfacePresent ? "PRESENT" : "ABSENT"}; redirect=${sensor.redirectReason}. Mechanical bumper projection is tracked separately.`
          : "Without the optical subsystem, the claimed surface-absence redirect is not available; no coverage consequence is inferred.",
      },
    ];
  }

  if (patentId === KAMEN_TRANSPORTER_ID) {
    const controls = readKamenTransporterControls(params);
    const tel = stepKamenTransporterSi(controls);
    return [
      {
        id: "dynamically-maintaining-stability",
        phrase: "dynamically maintaining stability",
        active: tel.isBalancing && !tel.pitchRefusal,
        tone: tel.pitchRefusal ? "broken" : tel.isBalancing ? "held" : "live",
        caption: tel.pitchRefusal
          ? "Safety Refusal: pitch tilt exceeded maximum dynamic balance envelope (25°)."
          : tel.isBalancing
            ? `Active 2-wheel inverted pendulum equilibrium held (torque=${tel.balanceTorqueNm.toFixed(1)} N·m, speed=${tel.forwardVelocityMs.toFixed(2)} m/s).`
            : "Operating in 4-wheel static stability support mode.",
      },
      {
        id: "cluster-of-wheels",
        phrase: "cluster of wheels",
        active: tel.isClimbing || controls.operatingMode === "stair_climb",
        tone: tel.isClimbing ? "live" : "held",
        caption: `Planetary cluster angle = ${tel.clusterAngleDeg.toFixed(0)}°; ${
          tel.isClimbing
            ? "actively rotating carrier to hoist vehicle over stair risers."
            : "cluster locked for rolling ground contact."
        }`,
      },
    ];
  }

  if (patentId === "us-4341502-makino-scara") {
    const theta1 = params.firstLinkAngleDeg ?? 32;
    const theta4 = params.fourthLinkAngleDeg ?? -38;
    return [
      {
        id: "four-link-mechanism",
        phrase: "four-link mechanism",
        active: true,
        tone: "live",
        caption: `θ1=${theta1}°, θ4=${theta4}°: Parallel-link SCARA configuration maintaining high vertical rigidity with planar compliance.`,
      },
      {
        id: "assembly-robot",
        phrase: "assembly robot",
        active: true,
        tone: "held",
        caption:
          "Selective Compliance Assembly Robot Arm architecture designed for high-speed precision component insertion.",
      },
    ];
  }

  if (patentId === "us-4765668-robot-end-effector") {
    const state = stepRobotEndEffector(params);
    const fingersRetained = state.fingerRetainedFraction > 0.5;
    return [
      {
        id: "left-and-right-hand-threaded",
        phrase: "left and right hand threaded ball screw",
        active: true,
        tone: "live",
        caption: `The shared 5 mm-lead kernel gives a ${(state.jawOpeningM * 1000).toFixed(1)} mm source-typical jaw gap while equal-and-opposite hands preserve the ideal midpoint.`,
      },
      {
        id: "substantially-symmetrical",
        phrase: "substantially symmetrical to said screw mid portion",
        active: Math.abs(state.symmetricMidpointM) < 1e-12,
        tone: "held",
        caption:
          "The display enforces ideal symmetric kinematics only. The source reports repeatability but withholds backlash, stiffness, and loading measurements needed for a physical error budget.",
      },
      {
        id: "removably-mounting-finger",
        phrase: "removably mounting each said finger",
        active: fingersRetained,
        tone: fingersRetained ? "held" : "broken",
        caption: fingersRetained
          ? "Claims 13–15's rail/channel, dovetail, and catch arrangement is represented as a retained finger interface."
          : "Finger-change probe: the source's auxiliary-fixture sequence has released the illustrative fingers; no grasp or contact result is asserted.",
      },
      {
        id: "rotation-signal",
        phrase: "signal indicative of the rotation",
        active: true,
        tone: "live",
        caption: `The source's eight pegs yield an encoder teaching phase of ${state.encoderCountModulo.toFixed(2)} of 8. It is not promoted to a complete servo or repeatability model.`,
      },
    ];
  }

  if (patentId === GOERTZ_MASTER_SLAVE_ID) {
    const pose = stepGoertzMasterSlaveTopology(params);
    const mismatchActive = pose.errorMagnitude > 0.01;
    return [
      {
        id: "seven-types-of-motion",
        phrase: "seven types of motion occurring in one unit are reproduced in the other unit",
        active: true,
        tone: "held",
        caption:
          "The exhibit keeps all seven source-enumerated movements as separate correspondence channels; it does not convert them into an unprovided Cartesian reach, scale, or speed model.",
      },
      {
        id: "error-signal-e",
        phrase: "error signal E proportional in amplitude",
        active: mismatchActive,
        tone: mismatchActive ? "live" : "held",
        caption: `The visible mismatch is ${(pose.errorMagnitude * 100).toFixed(0)}% in a normalized source topology. Its direction is represented structurally, not as an invented voltage or gain.`,
      },
      {
        id: "sense-of-feel",
        phrase: "sense of feel",
        active: pose.forceReflectionEnabled && mismatchActive,
        tone: pose.forceReflectionEnabled && mismatchActive ? "live" : "broken",
        caption: pose.forceReflectionEnabled
          ? "Claim 9 probe: a remote obstruction is shown returning an explicitly normalized resistance cue to the master handle. No force calibration is asserted."
          : "The bilateral reflection probe is off, so remote mismatch is not returned to the master display.",
      },
      {
        id: "tachometers-205",
        phrase: "tachometers 205 are connected in a bridge circuit",
        active: pose.tachometerDampingEnabled,
        tone: pose.tachometerDampingEnabled ? "held" : "broken",
        caption: pose.tachometerDampingEnabled
          ? "Claim 11 probe: the source-described relative-speed path is enabled as a damping topology, without a numerical speed or stability prediction."
          : "The relative-speed damping probe is off; the source’s tachometer bridge relationship is not applied to the normalized display.",
      },
      {
        id: "limiter-210",
        phrase: "limiter 210",
        active: pose.limiterActive,
        tone: pose.limiterActive ? "live" : "held",
        caption: pose.limiterActive
          ? "Claims 10 and 12 probe: the normalized command is clipped at the exhibit boundary, not at a source-derived voltage or motor-speed value."
          : "The source describes limiter 210; it remains inactive until the illustrative mismatch exceeds the normalized display limit.",
      },
    ];
  }

  if (patentId === "us-3119501-lemelson-automatic-warehousing") {
    const railAddress = params.railAddressFraction ?? 0.55;
    const levelAddress = params.levelAddressFraction ?? 0.42;
    const shuttleExtension = params.shuttleExtensionFraction ?? 0.32;
    const automaticAddressing = (params.automaticAddressing ?? 1) >= 0.5;
    return [
      {
        id: "automatic-conveying-system",
        phrase: "automatic conveying system",
        active: automaticAddressing,
        tone: automaticAddressing ? "held" : "broken",
        caption:
          "The source-described rail carrier, vertical carrier, and transverse transfer path are shown as one connected conveying topology.",
      },
      {
        id: "predetermining-counter",
        phrase: "predetermining counter",
        active: automaticAddressing,
        tone: automaticAddressing ? "live" : "broken",
        caption: `Normalized rail/level address cues ${(railAddress * 100).toFixed(0)}% / ${(levelAddress * 100).toFixed(0)}% make the preset-count sequence visible without inventing bay spacing, pulse rate, or stopping tolerance.`,
      },
      {
        id: "sequential-controller",
        phrase: "sequential controller",
        active: automaticAddressing && shuttleExtension > 0.02,
        tone: automaticAddressing ? "live" : "broken",
        caption: `The normalized transfer cue is ${(shuttleExtension * 100).toFixed(0)}%; the exhibit shows stage ordering but makes no timing or throughput prediction.`,
      },
      {
        id: "photoelectric-scanner",
        phrase: "photoelectric scanner",
        active: automaticAddressing,
        tone: automaticAddressing ? "live" : "broken",
        caption:
          "The source's non-contact marker/scanner relationship supplies address events; optical power, sensitivity, noise margin, and precision are not stated.",
      },
    ];
  }

  if (patentId === "us-3081379-lemelson-machine-vision") {
    const controls = readLemelsonMachineVisionControls(params);
    const state = stepLemelsonMachineVisionSi(controls);
    return [
      {
        id: "electron-beam-scanning",
        phrase:
          "means for causing an electron beam to scan an area of an image field in a single frame sweep",
        active: true,
        tone: "live",
        caption: `Raster scan frequency: ${state.metrics.horizontalScanFreqHz} Hz (${controls.scanLineCount} lines @ ${controls.frameRateHz} fps, line duration ${state.metrics.linePeriodUs.toFixed(2)} µs).`,
      },
      {
        id: "gated-analyzing-circuit",
        phrase:
          "analyzing circuit connected to a gating means in the output of a circuit in which said picture signal is generated",
        active: true,
        tone: "live",
        caption: `Threshold comparator level: ${controls.thresholdVoltage.toFixed(2)} V slicing video peak (${state.metrics.videoPeakVoltageV.toFixed(2)} V), pulse width ${state.metrics.pulseWidthUs.toFixed(2)} µs.`,
      },
      {
        id: "dimensional-measurement-slicing",
        phrase:
          "inspecting a predetermined area of said image field by the analysis of that portion of the picture signal",
        active: true,
        tone: state.metrics.isDefective ? "broken" : "live",
        caption: `Measured dimension: ${state.metrics.measuredPartWidthMm.toFixed(1)} mm (nominal ${(controls.nominalPartWidthM * 1000).toFixed(1)} mm, deviation ${state.metrics.dimensionalErrorMm.toFixed(2)} mm, status: ${state.metrics.isDefective ? "DEFECT DETECTED" : "WITHIN TOLERANCE"}).`,
      },
      {
        id: "solenoid-rejection-gate",
        phrase:
          "programming means being synchronized in its operation for automatically operating said gating means",
        active: state.metrics.isDefective,
        tone: state.metrics.isDefective ? "live" : "held",
        caption: `Solenoid reject force: ${state.metrics.solenoidForceN.toFixed(2)} N (response ${state.metrics.gateResponseTimeMs.toFixed(1)} ms, coil current ${controls.gateSolenoidCurrentA.toFixed(1)} A).`,
      },
    ];
  }

  if (patentId === "us-3728480-baer-odyssey") {
    const controls = readBaerControls(params as any);
    const { metrics } = stepBaerOdysseySi(INITIAL_BAER_STATE, controls, 0.016);
    return [
      {
        id: "raster-sync-generation",
        phrase:
          "means for generating synchronizing signals to synchronize the television raster scan",
        active: true,
        tone: "live",
        caption: `NTSC horizontal sweep: ${metrics.horizontalSyncFreqHz} Hz (line period ${metrics.horizontalPeriodMicrosec.toFixed(1)} µs), vertical field: ${metrics.verticalFreqHz} Hz (${metrics.verticalPeriodMs.toFixed(1)} ms).`,
      },
      {
        id: "rc-delay-manipulation",
        phrase: "means for manipulating the position of the 'dots' on the screen of said receiver",
        active: true,
        tone: "live",
        caption: `Player 1 RC delay: ${metrics.p1DelayHMicrosec.toFixed(1)} µs horizontal, ${metrics.p1DelayVMs.toFixed(2)} ms vertical; Player 2: ${metrics.p2DelayHMicrosec.toFixed(1)} µs, ${metrics.p2DelayVMs.toFixed(2)} ms.`,
      },
      {
        id: "coincidence-gating",
        phrase:
          "means for denoting coincidence when a 'dot' generated by said first generator is positioned over a 'dot'",
        active: metrics.coincidenceActive || metrics.lightGunCoincidence,
        tone: metrics.coincidenceActive || metrics.lightGunCoincidence ? "live" : "held",
        caption: metrics.coincidenceActive
          ? `PADDLE-BALL COINCIDENCE ACTIVE: Diode AND gate triggered, horizontal velocity reflected (v_x = ${metrics.ballVx.toFixed(2)} screen/s, English spin = ${controls.englishControl.toFixed(2)}).`
          : `Coincidence gate monitoring scan overlap (Ball at [${metrics.ballX.toFixed(2)}, ${metrics.ballY.toFixed(2)}]).`,
      },
      {
        id: "rf-carrier-coupling",
        phrase:
          "means for directly coupling the generated signals only to said television receiver",
        active: true,
        tone: "live",
        caption: `Modulated VHF Channel ${controls.rfChannel} carrier at ${metrics.rfCarrierFreqMHz.toFixed(2)} MHz, output power ${metrics.rfAntennaPowerNanoWatts.toFixed(1)} nW into 300-ohm antenna twin lead.`,
      },
    ];
  }

  if (patentId === "us-4063220-metcalfe-ethernet") {
    const controls = readEthernetControls(params as any);
    const { metrics } = stepMetcalfeEthernetSi(INITIAL_ETHERNET_STATE, controls, 0.016);
    return [
      {
        id: "carrier-sense-detection",
        phrase:
          "signal detecting means coupled to said receiving means for generating a carrier signal",
        active: metrics.carrierSensed,
        tone: metrics.carrierSensed ? "live" : "held",
        caption: metrics.carrierSensed
          ? `CARRIER SENSED: Coaxial medium busy, deferring transmission (bus voltage: ${metrics.busVoltageVolts.toFixed(1)} V).`
          : `Medium idle (0.0 V quiescent); station clear to transmit Manchester bit frames.`,
      },
      {
        id: "listen-while-talk-collision",
        phrase:
          "collision detecting means coupled to the transmitting means and the receiving means",
        active: metrics.collisionDetected,
        tone: metrics.collisionDetected ? "live" : "held",
        caption: metrics.collisionDetected
          ? `COLLISION DETECTED: Analog superposition voltage ${metrics.busVoltageVolts.toFixed(1)} V <= -1.5 V threshold; differential XOR gate asserted.`
          : `Transceiver monitor clear: transmitted signal matches received line level (${metrics.busVoltageVolts.toFixed(1)} V).`,
      },
      {
        id: "transmission-interruption",
        phrase:
          "means connected to each transceiver and responsive to the presence of said collision signal for interrupting the transmission",
        active: metrics.collisionDetected,
        tone: metrics.collisionDetected ? "live" : "held",
        caption: `Instantaneous transmission abort triggered; broadcasting ${metrics.jamDurationMicrosec.toFixed(1)} µs jam signal across coaxial bus.`,
      },
      {
        id: "binary-exponential-backoff",
        phrase:
          "weighting means connected to receive said random number signal and said count signal for adjusting the mean value of said random number signal",
        active: true,
        tone: "live",
        caption: `Binary Exponential Backoff slot time: ${metrics.slotTimeMicrosec.toFixed(2)} µs (2τ = ${metrics.oneWayPropDelayNs.toFixed(0)} ns round trip delay for ${controls.cableLengthMeters}m coax).`,
      },
    ];
  }

  if (patentId === "us-2318259-sikorsky-helicopter") {
    const controls = readSikorskyControls(params as any);
    const { metrics } = stepSikorskyHelicopterSi(INITIAL_SIKORSKY_STATE, controls, 0.016);
    return [
      {
        id: "collective-throttle-coupling",
        phrase:
          "simultaneously and positively varying the rotor pitch and the power output of said engine",
        active: controls.engineRunning === 1,
        tone: controls.engineRunning === 1 ? "live" : "held",
        caption:
          controls.engineRunning === 1
            ? `COLLECTIVE-THROTTLE CORRELATION ACTIVE: Blade pitch ${controls.collectivePitchDeg.toFixed(1)}° mechanically commands ${metrics.effectiveThrottlePercent.toFixed(1)}% engine throttle, delivering ${(metrics.mainRotorPowerWatts / 1000.0).toFixed(1)} kW.`
            : `Engine stopped (autorotation state); freewheeling sprag clutch disengaged.`,
      },
      {
        id: "anti-torque-tail-rotor",
        phrase:
          "auxiliary rotor having a plane of rotation at right angles to the plane of rotation of said main rotor",
        active: metrics.tailRotorThrustNewtons > 50,
        tone: metrics.tailRotorThrustNewtons > 50 ? "live" : "held",
        caption: `ANTI-TORQUE EQUILIBRIUM: Tail rotor generating ${metrics.tailRotorThrustNewtons.toFixed(1)} N thrust across 4.8m tail boom, balancing ${metrics.mainRotorTorqueNm.toFixed(1)} N·m main rotor torque (net yaw: ${metrics.netYawMomentNm.toFixed(1)} N·m).`,
      },
      {
        id: "universal-blade-connection",
        phrase: "universal connection between the inner end of each blade and said shaft",
        active: metrics.tipSpeedMs > 50,
        tone: "live",
        caption: `Flapping and hunting hinges active; main blade tip velocity ${metrics.tipSpeedMs.toFixed(1)} m/s (Mach ${metrics.tipMachNumber.toFixed(2)}), vertical lift ${metrics.mainRotorThrustNewtons.toFixed(1)} N.`,
      },
      {
        id: "resilient-torque-links",
        phrase:
          "resilient torque transmitting links pivotally secured to said blades and said shaft",
        active: metrics.mainRotorTorqueNm > 50,
        tone: "live",
        caption: `Lead-lag dampers constraining in-plane hunting motions under ${metrics.mainRotorTorqueNm.toFixed(1)} N·m driving torque.`,
      },
    ];
  }

  if (patentId === "us-3260375-lemelson-adjustable-manipulator") {
    const state = stepLemelsonManipulatorTopology(params);
    return [
      {
        id: "overhead-carriage-motion",
        phrase: "carriage movable along a predetermined path",
        active: true,
        tone: "held",
        caption:
          "The specification depicts a carriage guided along the illustrated track relationship; the display supplies no unprinted travel length or positioning accuracy.",
      },
      {
        id: "adjustable-limit-stop",
        phrase: "limit switch means mounted on one of said assemblies",
        active: state.sequencer.stop1Tripped || state.sequencer.stop2Tripped,
        tone: state.sequencer.stop1Tripped || state.sequencer.stop2Tripped ? "live" : "held",
        caption:
          state.sequencer.stop1Tripped || state.sequencer.stop2Tripped
            ? `Normalized switch event: ${state.sequencer.trippedLimitSwitches.join(", ")}. The display makes the selected stop/start relationship visible without inferring relay timing.`
            : "The display is awaiting its selected normalized actuator/limit-switch event; source contact travel and tolerance are not stated.",
      },
      {
        id: "rotational-azimuth-joint",
        phrase: "power means for rotating said first assembly on said second assembly",
        active: state.sequencer.phaseIndex === 2,
        tone: state.sequencer.phaseIndex === 2 ? "live" : "held",
        caption: `Normalized azimuth display coordinate: ${state.controls.columnAzimuth.toFixed(2)}. The procedural ${state.displayPose.azimuthRad.toFixed(2)}-rad scene transform is not a source-measured angle.`,
      },
      {
        id: "pivoting-wrist-joint",
        phrase: "second joint member pivotally secured to said first joint member",
        active: state.sequencer.phaseIndex === 3,
        tone: state.sequencer.phaseIndex === 3 ? "live" : "held",
        caption: `Normalized pivot display coordinate: ${state.controls.wristPivot.toFixed(2)}. The scene transform is illustrative; the grant does not supply a calibrated joint range.`,
      },
      {
        id: "workpiece-seizing-gripper",
        phrase: "article seizing means mounted on said arm assembly",
        active: state.displayPose.gripperState !== "open",
        tone: state.displayPose.gripperState !== "open" ? "live" : "held",
        caption: `The illustrated end member is ${state.displayPose.gripperState.toUpperCase()} in the normalized display. This is not a statement of jaw opening distance, force, or a successful grasp.`,
      },
    ];
  }

  if (patentId === "us-3313014-lemelson-automatic-production") {
    const state = stepLemelsonAutomaticProductionTopology(params);
    return [
      {
        id: "carrier-sensing",
        phrase: "means for sensing the presence of a carrier at a work station",
        active: state.markerMatched,
        tone: state.markerMatched ? "live" : "broken",
        caption: state.markerMatched
          ? "Claim 1 probe: the marker/sensing event is present, allowing the display to enter the selected-station sequence. No sensor precision or timing is asserted."
          : "Without the sensed-station event, the source-bounded display remains in travel and refuses retention or station command.",
      },
      {
        id: "prepositioning-retention",
        phrase: "prepositioning and retention of a carrier at a work station",
        active: state.carrierLocked,
        tone: state.carrierLocked ? "held" : "broken",
        caption: state.carrierLocked
          ? "The carrier is shown retained at a selected station after the marker event; lift and reach remain normalized display poses rather than measured travel or tolerance."
          : "The carrier is not retained: the source sequence has not reached its post-sensing positioning condition.",
      },
      {
        id: "coupling-means",
        phrase: "means for coupling said program controller with said machine means",
        active: state.controllerCoupled,
        tone: state.controllerCoupled ? "live" : "broken",
        caption: state.controllerCoupled
          ? "Claim 7 probe: the portable controller-to-station interface is closed; the display may authorize a machine command only after this source-described condition."
          : "The coupling probe is open, so an arriving carrier never becomes an authorized source-topology station command.",
      },
      {
        id: "release-and-departure",
        phrase: "cause said securing means to release work held at said machine",
        active: state.releaseAuthorized,
        tone: state.releaseAuthorized ? "live" : "held",
        caption: state.releaseAuthorized
          ? "Claim 20 probe: the display has reached release-before-departure. The threshold is an ordering cue, not a source-derived time."
          : "Release remains pending until the selected display cycle reaches its final source-described stage.",
      },
    ];
  }

  if (
    patentId === "us-4098001-watson-rcc" ||
    patentId === "us-4098001-watson-remote-center-compliance"
  ) {
    const contactFraction = params.lateralContactFraction ?? 0.62;
    const mismatchFraction = params.axisMismatchFraction ?? 0.44;
    const isRemoteCenter = (params.remoteCenterTopology ?? 1) >= 0.5;
    const hasAntiTwist = (params.antiTwistConstraint ?? 1) >= 0.5;
    return [
      {
        id: "remote-center-compliance",
        phrase: "remote center compliance system",
        active: isRemoteCenter,
        tone: isRemoteCenter ? "live" : "broken",
        caption: isRemoteCenter
          ? "Claim 1 topology shown: radial elements converge on a point at, near, or beyond the tool end."
          : "Comparison pose only: the remote point has been moved back to the wrist, outside the illustrated Claim 1 arrangement.",
      },
      {
        id: "rotational-elements",
        phrase: "rotational interconnection elements",
        active: isRemoteCenter && mismatchFraction > 0.02,
        tone: "live",
        caption: `Normalized axis-mismatch cue ${(mismatchFraction * 100).toFixed(0)}%: the exhibit makes the source's radial-element orientation legible without inventing torque or stiffness.`,
      },
      {
        id: "translational-elements",
        phrase: "translational interconnection elements",
        active: contactFraction > 0.02,
        tone: "live",
        caption: `Normalized chamfer-contact cue ${(contactFraction * 100).toFixed(0)}%: the connected axial elements move with the intermediate member; no force or dimensional response is asserted.`,
      },
      {
        id: "torque-resistant-means",
        phrase: "torque resistant means",
        active: hasAntiTwist,
        tone: hasAntiTwist ? "held" : "broken",
        caption: hasAntiTwist
          ? "Claim 2 addition shown: the bellows embodiment represents means for preventing operator-axis twist."
          : "Claim 2 probe: the torque-resistant addition is omitted, leaving only Claim 1's topology.",
      },
    ];
  }

  if (patentId === "us-3858581-kamen-medication-injection-device") {
    const pulseCount = params.pulseCount ?? 12;
    const motorRunning = (params.motorRunning ?? 1) >= 0.5;
    return [
      {
        id: "lead-screw",
        phrase: "uniform-pitch lead screw",
        active: true,
        tone: "live",
        caption:
          "Claim 1 lead screw: rotation of the screw advances the syringe plunger axially by a fixed displacement per turn.",
      },
      {
        id: "striker-switch",
        phrase: "radially oriented striker mounted on said lead screw",
        active: motorRunning,
        tone: motorRunning ? "live" : "held",
        caption: `Pulse counting switch active (${pulseCount} pulses recorded): striker trips switch once per screw revolution.`,
      },
      {
        id: "motor-control",
        phrase: "pulse-counting control circuit",
        active: pulseCount > 0,
        tone: "live",
        caption:
          "Claim 1 pulse counter stops the motor upon reaching the predetermined pulse count.",
      },
    ];
  }

  if (patentId === "us-7479949-multitouch") {
    const contacts = params.touchContactCount ?? 2;
    return [
      {
        id: "touch-screen-display",
        phrase: "touch screen display",
        active: contacts > 0,
        tone: "live",
        caption: `Touch Contacts=${contacts}: Mutual capacitive grid detects multiple distinct finger touch locations.`,
      },
      {
        id: "applying-heuristics",
        phrase: "applying heuristics",
        active: true,
        tone: "held",
        caption:
          "Multi-touch gesture engine applies geometric heuristics to disambiguate pinch-zoom, pan, scroll, and tap.",
      },
    ];
  }

  if (patentId === "us-2988237-devol-programmed-transfer") {
    const state = stepDevolProgrammedTransfer(params);
    return [
      {
        id: "magnetic-drum-recording",
        phrase: "magnetic recording member",
        active: true,
        tone: "held",
        caption: `The source stores combinational position symbols for ${state.programPhase}; the display code is pedagogical and does not assert a modern digital coordinate format or storage density.`,
      },
      {
        id: "programmed-article-transfer",
        phrase: "programmed article transfer",
        active: state.coincidence,
        tone: state.coincidence ? "live" : "held",
        caption: `${state.matchingBits}/${state.bitWidth} corresponding code channels agree. The source compares a mechanically coupled position representation with a selected program symbol; it does not disclose robot-joint coordinates or an SI servo model.`,
      },
    ];
  }

  if (patentId === "us-4068536-stackhouse-manipulator") {
    const pose = stepStackhouseSourceTopology(params);
    const preferredPointP = pose.singleIntersection >= 0.5;

    return [
      {
        id: "concentric-drive-shafts",
        phrase: "concentric drive shafts",
        active: true,
        tone: "held",
        caption:
          "The source describes independently rotatable concentric shafts and, in the preferred embodiment, hydraulic motors 9a, 9b, and 9c mounted at the elbow. It prints no torque, speed, or power values.",
      },
      {
        id: "single-point-p",
        phrase: "intersect at a single point, P",
        active: preferredPointP,
        tone: preferredPointP ? "live" : "held",
        caption:
          "The preferred illustrated axes A–A′, B–B′, and C–C′ meet at P. The contrast control shows the source's expressly permitted small deviation, not a measured tolerance.",
      },
      {
        id: "greater-than-hemisphere",
        phrase: "greater than a hemisphere",
        active: pose.firstObliqueAngleDeg > 45 && pose.secondObliqueAngleDeg > 45,
        tone: "held",
        caption: `The selected exhibit angles are ${pose.firstObliqueAngleDeg.toFixed(0)}° and ${pose.secondObliqueAngleDeg.toFixed(0)}°. The patent supplies only the two >45° inequalities and the qualitative sector statement, not exact angles or a steradian value.`,
      },
      {
        id: "orientation-holes",
        phrase: "correspondingly small “holes”",
        active: !preferredPointP,
        tone: preferredPointP ? "held" : "live",
        caption: preferredPointP
          ? "The preferred point-P topology is selected."
          : "The source says small deviations from coincidence may be used but inherently reduce the full orientation range by creating small holes.",
      },
    ];
  }

  if (patentId === "us-4921293-salisbury-robot-hand") {
    const controls = readSalisburyRobotHandControls(params);
    const tel = FrankenSimEngine.stepSalisburyRobotHand(controls);

    return [
      {
        id: "salisbury-connected-arm-hand",
        phrase: "the hand 10 is attached to the terminal end of a robot manipulator arm 12",
        active: true,
        tone: "held",
        caption:
          "Figure 1 supplies a continuous source path: arm 12, end bracket 14, two-axis wrist 16/18, palm 20/24, and three palm-anchored articulated digits.",
      },
      {
        id: "salisbury-four-contiguous-pulleys",
        phrase: "all four pulley sheaves 30′, 30″, 30‴, 30⁗ contiguously on Axis 1",
        active: tel.claim1RoutingProbe,
        tone: tel.claim1RoutingProbe ? "live" : "broken",
        caption: tel.claim1RoutingProbe
          ? `The admitted source topology has 4 cable ends per digit and 12 across the three-digit hand; the representative digit's peak visitor-declared tension is ${Math.max(...tel.tendonTensionsN).toFixed(1)} N.`
          : "The four-cable/three-joint source route was not admitted.",
      },
      {
        id: "salisbury-base-paired-pull",
        phrase: "There is no direct cable connection to the base joint 40 at Axis 1.",
        active: !tel.refused,
        tone: "live",
        caption: `${tel.pullPattern}. The Figure 3 equations currently return τ₁=${tel.jointTorquesNm[0].toFixed(3)}, τ₂=${tel.jointTorquesNm[1].toFixed(3)}, and τ₃=${tel.jointTorquesNm[2].toFixed(3)} N·m.`,
      },
      {
        id: "salisbury-strain-tension",
        phrase:
          "measure the strain on the deflecting member 64, which is a function of the tension on the cable 33",
        active: !tel.refused,
        tone: "live",
        caption:
          "The source discloses two strain-gauge layouts and one sensor per cable, but no calibration curve, range, accuracy, or bandwidth from which to fabricate sensor telemetry.",
      },
      {
        id: "salisbury-radius-boundary",
        phrase:
          "these relations depend upon the actual pulley sizes selected for routing the various cables T₁ through T₄",
        active: true,
        tone: "held",
        caption: `R₂=${(tel.pulleyRadiiM[1] * 1000).toFixed(1)} mm is a visitor-declared study scale. R₁=1.2R₂ and R₃=1.4R₂ preserve the illustrated ordering only; they are not historic dimensions.`,
      },
      {
        id: "salisbury-claim-2-idler",
        phrase: "means to fix the position of said first idler pulley",
        active: tel.claim2IdlerProbe,
        tone: tel.claim2IdlerProbe ? "live" : "broken",
        caption: tel.claim2IdlerProbe
          ? "The Claim 2 teaching predicate holds the first-axis idler while the cable drive engages both it and the outboard drive pulley."
          : "The comparison releases the first idler. This changes only the Claim 2 predicate; it does not fabricate a decoupling error or dynamic failure.",
      },
    ];
  }

  if (patentId === "us-4512709-milacron-robot-toolchanger") {
    const state = stepMilacronRobotToolchanger(params);

    return [
      {
        id: "milacron-locking-slide",
        phrase: "locking slide carried in said slideway and affixed to said rod",
        active: state.lockingSlideEngaged,
        tone: state.lockingSlideEngaged ? "held" : "broken",
        caption: state.lockingSlideEngaged
          ? "The shared source-topology kernel has shifted the slide to its capture state; no historical stroke is asserted."
          : "The aperture remains aligned for admission/release, so the slide has not entered its source-described capture state.",
      },
      {
        id: "milacron-wedge-ramps",
        phrase: "slide ramp surface is bifurcated to form a clearance slot for said stem",
        active: state.claimFourRampCaptured,
        tone: state.claimFourRampCaptured ? "live" : "broken",
        caption: state.claimFourRampCaptured
          ? "Claim 4 probe: the selected T-member crossbar and bifurcated slide are in the documented capture geometry."
          : "Claim 4 is not currently in its selected ramp-and-T capture state; no clamping-force result is inferred.",
      },
      {
        id: "milacron-bistable-failsafe",
        phrase:
          "mechanism should remain in either the locked or unlocked position, in the event of a power failure",
        active: state.toolRetained || state.apertureAligned,
        tone: state.toolRetained || state.apertureAligned ? "held" : "broken",
        caption:
          "The grant states an intended terminal-state tendency after power failure. The exhibit shows only its locked or aperture-aligned configuration and refuses a force, friction, or reliability result.",
      },
      {
        id: "milacron-locating-pins",
        phrase: "pair of locating pins 43,44 secured to and extending from, the front plate 26",
        active: state.registrationComplete,
        tone: state.registrationComplete ? "live" : "broken",
        caption: state.registrationComplete
          ? "The base is seated on the source-described cylindrical and diamond locating pair before retention is tested."
          : "The tool base is not yet registered on its locating pair; no positional tolerance is supplied by the grant.",
      },
    ];
  }

  if (patentId === "us-4575330-hull-stereolithography") {
    const controls = readHullStereolithographyControls(params);
    const tel = stepHullStereolithographySi(controls);

    return [
      {
        id: "hull-layer-by-layer-buildup",
        phrase:
          "each lamina being integrated with the previous lamina to build up the desired three-dimensional object",
        active: tel.isCured && tel.interlayerAdhesionRatio >= 1.0,
        tone: tel.isCured && tel.interlayerAdhesionRatio >= 1.0 ? "held" : "broken",
        caption: `Cure depth is ${tel.cureDepthUm.toFixed(1)} µm vs layer step ${controls.layerThicknessUm} µm (interlayer ratio ${tel.interlayerAdhesionRatio.toFixed(2)}x). Monolithic interlayer adhesion is ${tel.interlayerAdhesionRatio >= 1.0 ? "active" : "delaminated"}.`,
      },
      {
        id: "hull-synergistic-stimulation",
        phrase:
          "application of synergistic stimulation, such as ultraviolet light, to a fluid medium",
        active: tel.isCured,
        tone: tel.isCured ? "live" : "broken",
        caption: `Peak UV exposure E_max is ${tel.peakExposureMJCm2.toFixed(2)} mJ/cm² (critical threshold E_c = ${controls.criticalExposureMJCm2} mJ/cm²). Photopolymerization conversion is ${tel.polymerizationConversionPct.toFixed(1)}%.`,
      },
      {
        id: "hull-galvo-laser-scan",
        phrase: "spot of ultraviolet light 27 generated by source 26 is moved across the surface",
        active: !tel.underexposureRefusal && !tel.overpenetrationRefusal,
        tone: !tel.underexposureRefusal && !tel.overpenetrationRefusal ? "live" : "broken",
        caption: `Scanning vector velocity is ${controls.laserScanSpeedMmS} mm/s with Gaussian beam radius w₀ = ${controls.beamWaistRadiusUm} µm, generating cured line width L_w = ${tel.curedLineWidthUm.toFixed(1)} µm.`,
      },
      {
        id: "hull-elevator-stepping",
        phrase: "elevator 29 then moves down by a predetermined layer thickness",
        active: !tel.recoatDelayRefusal,
        tone: !tel.recoatDelayRefusal ? "live" : "broken",
        caption: `Elevator steps ${controls.layerThicknessUm} µm at ${controls.elevatorDipSpeedMmS} mm/s. Resin viscosity (${controls.resinViscosityCp} cP) yields meniscus settling time of ${tel.recoatMeniscusSettlingTimeSec.toFixed(2)} s.`,
      },
    ];
  }

  if (patentId === "us-5121329-crump-fdm") {
    const controls = readCrumpFdmControls(params);
    const tel = stepCrumpFdmSi(controls);

    return [
      {
        id: "crump-filament-pinch-feed",
        phrase:
          "flexible strand 12 is drawn from supply reel 14 by motor-driven pinch feed rollers",
        active: !tel.filamentGrindingRefusal,
        tone: !tel.filamentGrindingRefusal ? "live" : "broken",
        caption: `Pinch drive applies ${controls.pinchRollerForceN} N normal force yielding ${tel.maxTractionForceN.toFixed(1)} N traction. Required feed force is ${tel.feedDriveForceN.toFixed(1)} N (status: ${tel.filamentGrindingRefusal ? "slipping / grinding" : "positive engagement"}).`,
      },
      {
        id: "crump-heated-liquefier",
        phrase: "temperature-controlled flow passage 20",
        active: !tel.coldNozzleJamRefusal,
        tone: !tel.coldNozzleJamRefusal ? "live" : "broken",
        caption: `Liquefier operates at ${controls.nozzleTempC.toFixed(0)} °C with apparent melt viscosity ${tel.apparentViscosityPaS.toFixed(0)} Pa·s, developing ${tel.nozzlePressureDropMPa.toFixed(3)} MPa capillary pressure drop.`,
      },
      {
        id: "crump-planar-shearing-tip",
        phrase:
          "planar bottom surface of said tip being maintained substantially parallel to said first layer",
        active: controls.layerHeightMm <= controls.nozzleDiameterMm * 0.85,
        tone: controls.layerHeightMm <= controls.nozzleDiameterMm * 0.85 ? "held" : "broken",
        caption: `Gap clearance is ${controls.layerHeightMm} mm below nozzle land (orifice d = ${controls.nozzleDiameterMm} mm). Planar shearing irons bead into aspect ratio ${tel.beadAspectRatio.toFixed(2)}x (road width w = ${controls.roadWidthMm} mm).`,
      },
      {
        id: "crump-interlayer-weld",
        phrase:
          "successive layers of said material of predetermined thickness which build up on each other sequentially as they solidify",
        active: tel.weldQualityRatio >= 0.95,
        tone: tel.weldQualityRatio >= 0.95 ? "held" : "broken",
        caption: `Interface contact temperature is ${tel.interfaceTempC.toFixed(1)} °C (Tg = 105 °C, ratio ${tel.weldQualityRatio.toFixed(2)}x). Cooling time constant is ${(tel.coolingTimeConstantSec * 1000).toFixed(0)} ms.`,
      },
    ];
  }

  if (patentId === "us-6302230-kamen-segway") {
    const controls = readKamenSegwayControls(params);
    const tel = stepKamenSegwaySi(controls);

    return [
      {
        id: "kamen-segway-dynamic-balance",
        phrase:
          "motorized drive arrangement causing, when powered, automatically balanced operation",
        active: !tel.pitchOverturnRefusal && !tel.tractionLossRefusal,
        tone: !tel.pitchOverturnRefusal && !tel.tractionLossRefusal ? "live" : "broken",
        caption: `Dynamic balance active at lean ${controls.riderPitchDeg.toFixed(1)}° (speed ${tel.velocityKmh.toFixed(1)} km/h, restoring torque ${tel.motorTorqueNm.toFixed(1)} N·m). Overturning gravity moment is ${tel.gravityOverturningTorqueNm.toFixed(1)} N·m.`,
      },
      {
        id: "kamen-segway-balancing-margin",
        phrase:
          "balancing margin determined by the difference between the maximum operating velocity and the present velocity",
        active: tel.balancingMarginRatio >= 0.22,
        tone: tel.balancingMarginRatio >= 0.22 ? "held" : "broken",
        caption: `Balancing margin headroom is ${(tel.balancingMarginRatio * 100).toFixed(0)}% (governor limit ${controls.speedLimitMS.toFixed(1)} m/s vs present velocity ${tel.velocityMS.toFixed(2)} m/s).`,
      },
      {
        id: "kamen-segway-ripple-alarm",
        phrase: "ripple modulation of the power output of the motorized drive arrangement",
        active: tel.tactileAlarmActive,
        tone: tel.tactileAlarmActive ? "live" : "held",
        caption: `18 Hz torque ripple modulation is ${tel.tactileAlarmActive ? `ACTIVE (${tel.rippleAlarmAmplitudeNm} N·m haptic shudder amplitude)` : "STANDBY (sufficient margin reserve)"}.`,
      },
      {
        id: "kamen-segway-ground-traction",
        phrase: "propels the user in desired motion over an underlying surface",
        active: !tel.tractionLossRefusal,
        tone: !tel.tractionLossRefusal ? "live" : "broken",
        caption: `Ground friction coefficient μ = ${controls.groundFrictionCoeff.toFixed(2)} provides ${tel.maxTractionForceN.toFixed(0)} N grip vs demanded thrust ${Math.abs(tel.driveThrustForceN).toFixed(0)} N (${tel.tractionLossRefusal ? "WHEEL SLIP REFUSAL" : "firm traction"}).`,
      },
    ];
  }

  if (patentId === AMF_VERSATRAN_ID) {
    const topology = stepAmfVersatranTopology(params);
    const claim1Active = topology.claimProbeStates[1];
    const claim8Active = topology.claimProbeStates[8];
    const claim12Active = topology.claimProbeStates[12];

    return [
      {
        id: "versatran-primary-and-supplemental-motions",
        phrase:
          "vertical, horizontal and rotary motion as well as three dimensional diagonal movements",
        active: claim1Active,
        tone: claim1Active ? "live" : "broken",
        caption: claim1Active
          ? "Normalized primary motions: column " +
            (topology.controls.columnRotation ?? 0).toFixed(2) +
            ", carriage " +
            (topology.controls.carriageLift ?? 0.55).toFixed(2) +
            ", arm " +
            (topology.controls.armTravel ?? 0.55).toFixed(2) +
            ". The grant identifies three basic and three supplemental motions, not a calibrated workspace."
          : "Claim 1's six-actuator combination is withheld on the shared bus, so this exhibit does not represent its complete primary-and-supplemental motion topology.",
      },
      {
        id: "versatran-continuous-path",
        phrase:
          "programmed, it is capable of carrying out not only simple, but also complex movements and operations",
        active: claim8Active && topology.programMode === "automatic-recorded-signal-playback",
        tone: !claim8Active
          ? "broken"
          : topology.programMode === "automatic-recorded-signal-playback"
            ? "live"
            : "held",
        caption: claim8Active
          ? "Mode: " +
            topology.programMode.toUpperCase() +
            " (maximum normalized phase difference: " +
            topology.maximumNormalizedPhaseError.toFixed(3) +
            ")."
          : "Claim 8's programming, recording, and repetitive-playback path is withheld; no automatic replay topology is represented.",
      },
      {
        id: "versatran-teach-in-programming",
        phrase:
          "means for manually operating the prime actuators of the machine through prescribed paths of travel",
        active: claim1Active && topology.programMode === "manual-teach-and-record",
        tone: claim1Active ? "live" : "broken",
        caption: claim1Active
          ? "Separate programming arm and stick provide the source-described manual signal path used while recording the desired sequence."
          : "With Claim 1 withheld, this face does not represent the six-actuator machine that the programming arm is intended to direct.",
      },
      {
        id: "versatran-wrist-and-gripper",
        phrase:
          "work tool or piece. This latter may take the form of a pair of grippers which in accordance with a preferred embodiment of the invention has three degrees of movement, including a wrist action",
        active: claim1Active,
        tone: claim1Active ? "live" : "broken",
        caption: claim1Active
          ? "Normalized supplemental motions: wrist rotation " +
            (topology.controls.wristRotation ?? 0).toFixed(2) +
            ", wrist swing " +
            (topology.controls.wristSwing ?? 0).toFixed(2) +
            ", gripper open fraction " +
            topology.displayPose.gripperOpenFraction.toFixed(2) +
            "."
          : "The supporting Claim 1 machine topology is withheld, so no gripper or wrist motion is asserted by this exhibit.",
      },
      {
        id: "versatran-coupled-pinion-gripper",
        phrase:
          "pinions being cooperatively rotatable in opposite directions and conjointly movable about a vertical axis",
        active: claim12Active,
        tone: claim12Active ? "live" : "broken",
        caption: claim12Active
          ? "Claim 12's normalized probe shows paired engaging pinions counter-rotating for finger opening or closing, with their common member available for the specified conjoint swing; it does not assert a dimensional jaw angle or gripping force."
          : "Claim 12's paired engaging-pinion and conjoint-swing construction is withheld; the remaining generic work tool is not presented as that claimed gripper.",
      },
    ];
  }

  return [];
}
