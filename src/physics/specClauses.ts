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

  return [];
}
