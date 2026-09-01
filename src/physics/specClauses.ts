/**
 * Kernel predicates → exact phrases in the original specification.
 * Highlighted on the spec face so an interaction lights the clause it tests.
 */

import { stepFermiKinetics } from "./fermiKinetics";
import { stepTeslaMotorFig9, teslaMotorPhaseHz } from "./teslaKernel";

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
    const filamentLength = params.filamentLength ?? 22;
    const isIncandescent = voltage >= 85;

    return [
      {
        id: "high-resistance",
        phrase:
          "high resistance, so as to allow of the practical subdivision of the electric light",
        active: isIncandescent,
        tone: voltage >= 100 ? "live" : "held",
        caption: `V = ${voltage} V: High carbon filament resistance (>100 Ω hot) enables high voltage, low current distribution across parallel circuit branches.`,
      },
      {
        id: "vacuum-preservation",
        phrase: "nearly perfect vacuum",
        active: true,
        tone: "held",
        caption:
          "Sprengel mercury pump vacuum (< 10⁻⁶ atm) prevents carbon oxidation and thermal convection loss at incandescent temperatures.",
      },
      {
        id: "platina-leads",
        phrase: "fine platina wires for leading-wires",
        active: true,
        tone: "held",
        caption:
          "Platinum leads match the thermal expansion coefficient of glass (α ≈ 9×10⁻⁶/K), maintaining the hermetic seal during thermal cycling.",
      },
      {
        id: "spiral-filament",
        phrase: "coiled as a spiral and carbonized",
        active: filamentLength >= 15,
        tone: filamentLength >= 20 ? "live" : "held",
        caption: `L = ${filamentLength} cm: Carbonized spiral thread concentrates radiant surface area while maintaining high path resistance.`,
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
    const cr = params.compressionRatio ?? 4.5;
    const isRunning = rpm >= 60;

    return [
      {
        id: "dispersed-charge",
        phrase:
          "particles of the combustible gaseous mixture are more or less dispersed in an isolated condition in the air or other gas",
        active: true,
        tone: "held",
        caption:
          "Stratified gas-air charge provides progressive combustion wave front without destructive detonation.",
      },
      {
        id: "four-stroke-cycle",
        phrase: "four strokes of the piston required for one complete operation",
        active: isRunning,
        tone: "live",
        caption: `N = ${rpm} RPM (CR = ${cr}:1): Four distinct strokes (intake, compression, power, exhaust) across two crankshaft revolutions.`,
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
    const vinKv = params.inputVoltageKv ?? 15;

    return [
      {
        id: "high-potential-discharge",
        phrase: "developing electrical currents of high potential",
        active: vinKv >= 10,
        tone: "live",
        caption: `Vin = ${vinKv} kV: Resonant step-up transforms tank energy to megavolt RF potential.`,
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
          "Center-fed flat spiral maximizes self-inductance while minimizing inter-turn capacitance and dielectric breakdown.",
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
    return [
      {
        id: "needle",
        phrase: "needle",
        active: rpm > 0,
        tone: "live",
        caption: `Crank=${rpm} RPM: Curved eye-pointed needle carries upper thread through fabric.`,
      },
      {
        id: "shuttle",
        phrase: "shuttle",
        active: rpm > 0,
        tone: "live",
        caption:
          "Reciprocating shuttle passes lower bobbin thread through loop to lock the stitch.",
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
    const tension = params.cableTension ?? 0;
    const isSnapped = tension < 50;
    return [
      {
        id: "pawls",
        phrase: "pawls",
        active: isSnapped,
        tone: isSnapped ? "live" : "held",
        caption: `Cable Tension=${tension} N: Spring-loaded ratchet pawls engage notched guide rails the moment hoist cable snaps.`,
      },
      {
        id: "teeth-racks",
        phrase: "teeth of the racks",
        active: true,
        tone: "held",
        caption: "Hook-formed teeth along vertical racks arrest platform downward motion.",
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
        caption: `Rotor Speed=${rpm} RPM: Spinning centrifugal bowl subjects whole milk to 4,000 g radial acceleration.`,
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
    const rate = params.firingRate ?? 600;
    return [
      {
        id: "sliding-breech-block",
        phrase: "sliding breech-block",
        active: rate > 0,
        tone: "live",
        caption: `Rate of Fire=${rate} RPM: Recoil forces slide breech-block rearward to extract and chamber cartridges automatically.`,
      },
      {
        id: "tubular-piece",
        phrase: "tubular piece",
        active: true,
        tone: "held",
        caption:
          "Muzzle booster cup captures expanding propellant gas to accelerate barrel recoil cycle.",
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
    return [
      {
        id: "robotic-surgical-tool",
        phrase: "robotic surgical tool",
        active: true,
        tone: "held",
        caption:
          "Articulated wrist end-effector inside patient replicates surgeon hand movements with 7 degrees of freedom.",
      },
      {
        id: "processor-which-directs-movement",
        phrase: "processor which directs movement",
        active: ratio >= 1.0,
        tone: "live",
        caption: `Motion Scaling=${ratio}:1: Digital processor scales movements and filters resting hand tremor.`,
      },
    ];
  }

  if (patentId === "us-6594844-roomba") {
    const spiral = params.spiralExpansionRate ?? 1.2;
    return [
      {
        id: "sensor-subsystem",
        phrase: "sensor subsystem",
        active: true,
        tone: "held",
        caption:
          "Infrared cliff emitter-detectors and bumper switches continuously monitor obstacles and drop-offs.",
      },
      {
        id: "robot-housing-which-navigates",
        phrase: "robot housing which navigates",
        active: spiral > 0,
        tone: "live",
        caption: `Spiral Rate=${spiral}: Algorithmic behaviors navigate floor surface with autonomous room coverage.`,
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

  return [];
}
