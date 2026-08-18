/**
 * Visitor-facing leftover weaves. Every number is from the shared bus / SI kernels.
 * No CSV, QR, receipts, or invented WASM.
 */

import {
  stepBardeenTransistor,
  stepBellTelephone,
  stepColtRevolver,
  stepCorlissEngine,
  stepDaimlerEngine,
  stepDavenportMotor,
  stepDeLavalSeparator,
  stepEdisonBulb,
  stepEdisonPhonograph,
  stepEinsteinRefrigerator,
  stepEngelbartMouse,
  stepEricssonPropeller,
  stepGatlingGun,
  stepGliddenBarbedWire,
  stepGoodyearRubber,
  stepGrammeDynamo,
  stepHollerithTabulating,
  stepHyattCelluloid,
  stepKevlarContinuum,
  stepLincolnBuoy,
  stepMcCormickReaper,
  stepMorseTelegraph,
  stepNobelDynamite,
  stepNoyceIC,
  stepOttoEngine,
  stepParsonsTurbine,
  stepPasteurFermentation,
  stepPeltonWheel,
  stepSpencerMicrowave,
  stepThomsonWelding,
  stepWhitneyCottonGin,
  stepWozniakApple,
  stepZeppelinAirship,
} from "./catalogKernels";
import { FrankenSimEngine } from "./engine";
import { fermiKeff } from "./fermiKinetics";
import {
  stepCcdWells,
  stepHoweSewingMachine,
  stepMergenthalerLinotype,
  stepOtisElevator,
  stepRenoEscalator,
  stepSholesTypewriter,
} from "./machineKernels";
import { teslaBAt, teslaCoilResonantKhz } from "./teslaKernel";
import { goddardThermo } from "./thermochem";
import { readWrightControls, stepWrightFlyerSi } from "./wrightKernel";

export interface MaterialProbe {
  part: string;
  material: string;
  qty: string;
  value: string;
  unit: string;
  note: string;
}

export interface IntervalGhost {
  label: string;
  min: number;
  max: number;
  live: number;
  unit: string;
}

export interface FidelityField {
  part: string;
  model: string;
  reference: string;
  residual: string;
  unit: string;
}

export interface SmokePolicy {
  allowed: boolean;
  reason: string;
}

export interface SpectralMode {
  n: number;
  freqHz: number;
  amp: number;
  name: string;
}

export interface DatedScenario {
  id: string;
  date: string;
  name: string;
  writes: Record<string, number>;
}

export interface CoupleLink {
  from: string;
  to: string;
  watts: number;
}

export interface KittyHawkResidual {
  liveLiftN: number;
  histLiftN: number;
  liftResidualN: number;
  liveMph: number;
  histMph: number;
  speedResidualMph: number;
}

/** Kitty Hawk, 17 Dec 1903, first powered hop: weight ≈ 750 lbf, airspeed ≈ 30 mph. */
export const KITTY_HAWK = {
  liftN: 3336,
  airspeedMph: 30,
  durationS: 12,
  distanceM: 36.6,
} as const;

export function materialProbe(
  patentId: string,
  calloutLabel: string,
  params: Record<string, number>,
): MaterialProbe | null {
  const label = calloutLabel.toLowerCase();
  if (patentId.includes("wright")) {
    const si = stepWrightFlyerSi(readWrightControls(params));
    if (label.includes("wing") || label.includes("aeroplane") || label.includes("rib")) {
      return {
        part: calloutLabel,
        material: "Pride of the West muslin on spruce ribs",
        qty: "ΔL from warp",
        value: (params.wingWarp ?? 0).toFixed(1),
        unit: "° → N",
        note: `Live lift ${Math.round(si.liftNewtons)} N. Warp ${params.wingWarp ?? 0}° adds ~${Math.round(Math.abs((params.wingWarp ?? 0) * 18.5))} N of differential.`,
      };
    }
    if (label.includes("rudder") || label.includes("vertical")) {
      return {
        part: calloutLabel,
        material: "Spruce twin fins, piano-wire tiller",
        qty: "yaw couple",
        value: si.netYawNm.toFixed(1),
        unit: "N·m",
        note:
          (params.coupled ?? 1) >= 0.5
            ? "Claim 18 rudder linkage: rudder counters adverse yaw."
            : "Uncoupled: this fin is not the warp cable. Adverse yaw dominates.",
      };
    }
    if (label.includes("prop") || label.includes("screw")) {
      return {
        part: calloutLabel,
        material: "Laminated spruce, 8 ft 6 in",
        qty: "thrust vs drag",
        value: Math.round(si.totalDragNewtons).toString(),
        unit: "N",
        note: "Steady level: thrust ≈ total drag in this kernel.",
      };
    }
    return {
      part: calloutLabel,
      material: "Ash / spruce / piano wire",
      qty: "L/D",
      value: si.liftToDrag.toFixed(2),
      unit: "ratio",
      note: `Gross lift ${Math.round(si.liftNewtons)} N at ${params.airspeed ?? 28} mph.`,
    };
  }
  if (patentId.includes("tesla-motor") || patentId.includes("381968")) {
    return {
      part: calloutLabel,
      material: "Laminated iron + cotton-covered copper",
      qty: "n_s",
      value: ((120 * (params.frequency ?? 60)) / 2).toFixed(0),
      unit: "rpm",
      note: "Two-pole field. ns = 120 f / P, P = 2.",
    };
  }
  if (patentId.includes("goddard")) {
    const th = goddardThermo(params.chamberPressure ?? 350, params.expansionRatio ?? 3.5);
    return {
      part: calloutLabel,
      material: "Copper regenerative nozzle, LOX/gasoline",
      qty: "T_e",
      value: th.exhaustTempK.toString(),
      unit: "K",
      note: `v_e ${th.veMps} m/s, I_sp ${th.ispSec} s. Ae/At = ${params.expansionRatio ?? 3.5}.`,
    };
  }
  if (patentId.includes("fermi")) {
    const rod = params.rodWithdrawal ?? 83.5;
    const mod = params.moderatorPurity ?? 99.5;
    const keff = fermiKeff(rod, mod);
    return {
      part: calloutLabel,
      material: "Cadmium in a graphite–uranium lattice",
      qty: "k_eff",
      value: keff.toFixed(4),
      unit: "",
      note: `Rods at ${rod.toFixed(0)}% withdrawn. Delayed-critical band is 0.998–1.002.`,
    };
  }
  if (patentId.includes("howe") || patentId.includes("4750")) {
    const sew = stepHoweSewingMachine(params.crankRpm ?? 240, params.threadTensionGrams ?? 45);
    return {
      part: calloutLabel,
      material: "Eye-pointed needle + boat shuttle, two threads",
      qty: "shear",
      value: sew.lockstitchShearStrengthN.toString(),
      unit: "N",
      note: `${sew.stitchesPerMinute} spm. Needle Y and shuttle X from stepHoweLockstitch.`,
    };
  }
  if (patentId.includes("engelbart") || patentId.includes("3541541")) {
    const mouse = stepEngelbartMouse({
      mouseSpeed: params.mouseSpeed ?? 350,
      wheelRadius: params.wheelRadius ?? 10,
    });
    return {
      part: calloutLabel,
      material: "Orthogonal wooden wheels + potentiometer wipers",
      qty: "ω",
      value: mouse.omegaRadPerS.toFixed(1),
      unit: "rad/s",
      note: `${mouse.dpi} dpi, ${mouse.slewPxPerS} px/s from wheel roll.`,
    };
  }
  if (
    patentId.includes("boyle") ||
    patentId.includes("ccd") ||
    patentId.includes("3923554") ||
    patentId.includes("3858232")
  ) {
    const wells = stepCcdWells(
      1,
      params.incidentLux ?? 850,
      params.clockFreq ?? 2.5,
      params.gateVoltage ?? 8,
    );
    return {
      part: calloutLabel,
      material: "Three-phase MOS polysilicon gates on p-Si",
      qty: "CTE",
      value: (wells.cte * 100).toFixed(4),
      unit: "%",
      note: `${wells.photoElectrons.toLocaleString()} e⁻ in a ${wells.fullWellElectrons.toLocaleString()} e⁻ well.`,
    };
  }
  if (patentId.includes("tesla-coil") || patentId.includes("533367")) {
    const cap = params.primaryCap ?? 45;
    const freqKhz = teslaCoilResonantKhz(cap, params.toploadCapacitancePf);
    const coil = FrankenSimEngine.stepTeslaCoil(
      freqKhz,
      params.inputVoltageKv ?? 15,
      params.sparkGapDistanceMm ?? 12,
      145,
      params.couplingK ?? 0.18,
      params.secondaryTurns ?? 850,
    );
    return {
      part: calloutLabel,
      material: "Air-core dual-tuned LC, spark-gap primary",
      qty: "arc",
      value: coil.streamerLengthInches.toFixed(1),
      unit: "in",
      note: `${coil.secondaryPotentialMv.toFixed(2)} MV at k=${(params.couplingK ?? 0.18).toFixed(2)}.`,
    };
  }
  if (patentId.includes("diesel") || patentId.includes("542846")) {
    const diesel = FrankenSimEngine.stepDieselEngine({
      compressionRatio: params.compRatio ?? params.compressionRatio ?? 18,
      blastAirPressureBar: params.blastAirPressure ?? 65,
      cutoffRatio: params.cutoffRatio ?? 1.6,
    });
    return {
      part: calloutLabel,
      material: "Uncooled cast-iron blast-air injector, 1893 Augsburg",
      qty: "T₂",
      value: diesel.tCompressionC.toString(),
      unit: "°C",
      note: `${diesel.pCompBar} bar. Autoignition ${diesel.isAutoIgnition ? "yes" : "no"}.`,
    };
  }
  if (patentId.includes("kodak") || patentId.includes("388850")) {
    const raw = params.shutterSpeed ?? 0.05;
    const t = raw > 1 ? 1 / raw : raw;
    const kodak = FrankenSimEngine.stepEastmanKodak({
      shutterSpeedSec: t,
      apertureFNumber: params.apertureStop ?? 9,
      subjectDistanceM: params.subjectDist ?? 3,
    });
    return {
      part: calloutLabel,
      material: "57 mm barrel lens, paper roll film",
      qty: "H",
      value: kodak.hyperfocalM.toFixed(2),
      unit: "m",
      note: `EV ${kodak.exposureValueEv}. ${kodak.isInFocus ? "In focus" : "Out of focus"}.`,
    };
  }
  if (patentId.includes("farnsworth") || patentId.includes("1773980")) {
    const anodeKv = (params.anodeVoltage ?? 1500) / 1000;
    const gauss = FrankenSimEngine.farnsworthDeflectionGauss(params.coilCurrent);
    const tv = FrankenSimEngine.stepFarnsworthTv(anodeKv, gauss, params.lightIntensityLux ?? 500);
    return {
      part: calloutLabel,
      material: "Photoelectric dissector + magnetic gyro",
      qty: "r_L",
      value: tv.gyroRadiusMm.toFixed(1),
      unit: "mm",
      note: `β = ${tv.relativisticBeta}. ${tv.electronVelocityMps.toLocaleString()} m/s.`,
    };
  }
  if (patentId.includes("phonograph") || patentId.includes("200521")) {
    const phono = stepEdisonPhonograph({
      mandrelRpm: params.mandrelRpm,
      voiceVolumeDb: params.voiceVolumeDb,
    });
    return {
      part: calloutLabel,
      material: "Tinfoil on brass mandrel, stylus indent",
      qty: "groove",
      value: phono.grooveDepthMicrons.toString(),
      unit: "µm",
      note: `${phono.trackSpeedInPerS} in/s at the 4-inch drum.`,
    };
  }
  if (patentId.includes("noyce") || patentId.includes("2981877")) {
    const ic = stepNoyceIC({
      reverseBias: params.reverseBias,
      oxideThickness: params.oxideThickness,
      clockFrequencyMhz: params.clockFrequencyMhz,
    });
    return {
      part: calloutLabel,
      material: "Planar SiO₂ over p-n junctions",
      qty: "W",
      value: ic.depletionWidthUm.toString(),
      unit: "µm",
      note: `Breakdown margin ${ic.breakdownMarginV} V.`,
    };
  }
  if (patentId.includes("maxim") || patentId.includes("319596")) {
    const maxim = FrankenSimEngine.stepMaximMachineGun({
      firingRateRpm: params.firingRate ?? params.fireRateRpm ?? 600,
      waterJacketLiters: params.waterLevel ?? 4,
      recoilStrokeMm: params.recoilStroke ?? 19,
    });
    return {
      part: calloutLabel,
      material: "Water-jacketed short-recoil toggle lock",
      qty: "F_toggle",
      value: maxim.toggleUnlockForceN.toString(),
      unit: "N",
      note: `Barrel ${maxim.barrelTempC} °C. Evap ${maxim.waterEvapRateGs} g/s. ${maxim.muzzleEnergyJoules} J.`,
    };
  }
  if (patentId.includes("westinghouse") || patentId.includes("124404")) {
    const wh = FrankenSimEngine.stepWestinghouseAirBrake({
      trainPipePressurePsi: params.trainPipePressure ?? params.brakePressurePsi ?? 70,
      carMassTonnes: params.carMass ?? 35,
    });
    return {
      part: calloutLabel,
      material: "Triple valve + 10-inch foundation cylinder",
      qty: "F_shoe",
      value: wh.shoeClampingForceKn.toString(),
      unit: "kN",
      note: `${wh.valveState} at ${wh.brakeCylinderPressurePsi} psi cyl.`,
    };
  }
  if (patentId.includes("lamarr") || patentId.includes("2292387")) {
    const fh = FrankenSimEngine.stepLamarrFrequencyHopping(
      params.channels ?? 88,
      params.hopRate ?? 4,
    );
    return {
      part: calloutLabel,
      material: "88-key player-piano roll + slotted RF",
      qty: "G_p",
      value: fh.processingGainDb.toFixed(1),
      unit: "dB",
      note: `${fh.spreadSpectrumBandwidthMhz.toFixed(1)} MHz hop set. Margin ${fh.antiJammingMarginDb} dB.`,
    };
  }
  if (patentId.includes("bell") || patentId.includes("174465")) {
    const bell = stepBellTelephone({
      voiceAmplitude: params.voiceAmplitude,
      airGap: params.airGap,
    });
    return {
      part: calloutLabel,
      material: "Iron diaphragm over acidulated water",
      qty: "Δi",
      value: bell.modulatedMa.toFixed(2),
      unit: "mA",
      note: `Diaphragm ${bell.diaphragmUm} µm. ${bell.sensitivityMvPerPa} mV/Pa.`,
    };
  }
  if (patentId.includes("marconi")) {
    const h = params.aerialHeight ?? 88;
    return {
      part: calloutLabel,
      material: "Elevated aerial + earth plate",
      qty: "f₀",
      value: (3e8 / (4 * h) / 1000).toFixed(0),
      unit: "kHz",
      note: `Quarter-wave mast ${h} m. Spark is a damped odd-harmonic train.`,
    };
  }
  if (patentId.includes("morse") || patentId.includes("1647")) {
    const morse = stepMorseTelegraph({
      currentMa: params.currentMa,
      wireTurns: params.wireTurns,
      lineVoltageV: params.lineVoltageV,
      lineLengthMiles: params.lineLengthMiles,
      wpmSpeed: params.wpmSpeed,
    });
    return {
      part: calloutLabel,
      material: "Soft-iron horseshoe + paper tape",
      qty: "F",
      value: morse.magneticForceN.toFixed(2),
      unit: "N",
      note: `I² pull ${morse.ampereTurns} A·turns. ${morse.ohmicCurrentMa} mA ohmic · ${morse.wpmSpeed} WPM.`,
    };
  }
  if (patentId.includes("otto-engine") || patentId.includes("194047")) {
    const otto = stepOttoEngine({
      engineRpm: params.engineRpm,
      compressionRatio: params.compressionRatio,
    });
    return {
      part: calloutLabel,
      material: "Slide-valve four-stroke, coal-gas charge",
      qty: "η",
      value: otto.thermalEfficiencyPct.toString(),
      unit: "%",
      note: `Air-standard 1−r^(1−γ). ${otto.brakeHorsepower} BHP. P2 ${otto.peakCompressionBar} bar / P3 ${otto.peakFiringBar} bar.`,
    };
  }
  if (patentId.includes("pelton") || patentId.includes("233692")) {
    const pelton = stepPeltonWheel({
      headMeters: params.headMeters,
      runnerRpm: params.runnerRpm,
    });
    return {
      part: calloutLabel,
      material: "Split bronze bucket, 165° deflection",
      qty: "v_jet",
      value: pelton.jetVelocityMps.toString(),
      unit: "m/s",
      note: `u/v = ${pelton.speedRatio}. η ${pelton.etaPct}% → ${pelton.shaftPowerKw} kW.`,
    };
  }
  if (patentId.includes("gramme") || patentId.includes("120057")) {
    const gramme = stepGrammeDynamo({
      shaftRpm: params.shaftRpm,
      coilSegments: params.coilSegments,
    });
    return {
      part: calloutLabel,
      material: "Toroidal ring armature, two brushes",
      qty: "E",
      value: gramme.emfVolts.toString(),
      unit: "V",
      note: `${gramme.powerWatts} W into the load. Continuous DC from the Gramme ring.`,
    };
  }
  if (patentId.includes("glidden") || patentId.includes("157124")) {
    const wire = stepGliddenBarbedWire({
      wireTensionN: params.wireTensionN,
      twistsPerFoot: params.twistsPerFoot,
      animalPushForceN: params.animalPushForceN,
    });
    return {
      part: calloutLabel,
      material: "Two-strand galvanized line, locked diamond barb",
      qty: "lock",
      value: wire.isLocked ? "held" : "slip",
      unit: "",
      note: `Sag ${wire.sagCm} cm. Barb holds ${wire.barbSlipThresholdN} N. ${wire.tensileStrengthLbs} lb Bessemer · ${wire.productionRateFtPerMin} ft/min.`,
    };
  }
  if (patentId.includes("lincoln") || patentId.includes("6281")) {
    const buoy = stepLincolnBuoy({
      inflationPct: params.inflationPct,
      weightTons: params.weightTons,
      shoalDepth: params.shoalDepth,
    });
    return {
      part: calloutLabel,
      material: "India-rubber bellows under the hull",
      qty: "Δd",
      value: buoy.draftReductionFt.toFixed(2),
      unit: "ft",
      note: `${buoy.liftKn} kN lift. Draft ${buoy.hullDraftFt} ft. Shoal clearance ${buoy.shoalClearanceFt} ft.`,
    };
  }
  if (patentId.includes("einstein") || patentId.includes("1781541")) {
    const frige = stepEinsteinRefrigerator({
      heatInput: params.heatInput,
      totalPressure: params.totalPressure,
      ammoniaRatio: params.ammoniaRatio ?? params.auxiliaryGasRatio,
    });
    return {
      part: calloutLabel,
      material: "NH₃ / butane / water, no moving parts",
      qty: "COP",
      value: frige.cop.toFixed(2),
      unit: "",
      note: `T_evap ${frige.evapTempC} °C, ${frige.coolingWatts} W.`,
    };
  }
  if (patentId.includes("davenport") || patentId.includes("us-132")) {
    const motor = stepDavenportMotor({
      batteryVoltage: params.batteryVoltage,
      loadTorque: params.loadTorque,
    });
    return {
      part: calloutLabel,
      material: "Permanent shoes + split-ring commutator",
      qty: "ω",
      value: motor.shaftRpm.toString(),
      unit: "rpm",
      note: `${motor.shaftPowerW} W shaft. Voltage ${params.batteryVoltage ?? 12} V.`,
    };
  }
  if (patentId.includes("corliss") || patentId.includes("6162")) {
    const corliss = stepCorlissEngine({
      steamPressurePsi: params.steamPressurePsi,
      engineRpm: params.engineRpm,
      cutoffPct: params.cutoffPct,
    });
    return {
      part: calloutLabel,
      material: "Wrist-plate trip gear, dashpot cutoff",
      qty: "IHP",
      value: corliss.indicatedHp.toString(),
      unit: "hp",
      note: `η ${corliss.thermalEfficiencyPct}%. Cutoff is a trip, not a throttle.`,
    };
  }
  if (
    patentId.includes("edison") &&
    (patentId.includes("223898") || patentId.includes("lightbulb"))
  ) {
    const bulb = stepEdisonBulb({
      voltage: params.voltage,
      filamentLength: params.filamentLength,
    });
    return {
      part: calloutLabel,
      material: "Carbonized bamboo in hard vacuum",
      qty: "T",
      value: bulb.filamentTempK.toString(),
      unit: "K",
      note: `${bulb.radiantWatts} W, ${bulb.luminousLmPerW} lm/W, ${bulb.hotResistanceOhm} Ω hot.`,
    };
  }
  if (patentId.includes("sholes") || patentId.includes("79265")) {
    const wpm = params.typingSpeedWpm ?? 45;
    const sholes = stepSholesTypewriter(wpm, 0);
    return {
      part: calloutLabel,
      material: "Up-striking type-basket, 10-pitch platen",
      qty: "f_strike",
      value: sholes.cps.toFixed(1),
      unit: "s⁻¹",
      note: `${wpm} wpm · ${sholes.pitchMm} mm/char Remington pitch.`,
    };
  }
  if (patentId.includes("linotype") || patentId.includes("313224")) {
    const lino = stepMergenthalerLinotype({
      matrixRatePerMin: params.matrixRate,
      spacebandWedgeMm: params.spacebandWedge,
      potTempC: params.potTemp,
    });
    return {
      part: calloutLabel,
      material: "Eutectic type-metal pot + spaceband justifier",
      qty: "cycle",
      value: lino.cycleS.toFixed(1),
      unit: "s",
      note: `Pot ${params.potTemp ?? 260} °C ${lino.isEutecticTemp ? "eutectic" : "off-band"}. ${lino.justificationWidthMm} mm line.`,
    };
  }
  if (patentId.includes("reno") || patentId.includes("470918")) {
    const reno = stepRenoEscalator({
      passengerCount: params.passengerCount,
      inclineAngleDeg: params.inclineAngle,
      velocityMps: params.beltSpeed,
    });
    return {
      part: calloutLabel,
      material: "Hardwood cleats into bronze comb teeth",
      qty: "v",
      value: reno.speedFpm.toString(),
      unit: "fpm",
      note: `${reno.throughputPerHour}/h · ${reno.motorTorqueNm} N·m · ${reno.combPlateClearanceMm} mm comb gap.`,
    };
  }
  if (patentId.includes("otis") || patentId.includes("31128")) {
    const otis = stepOtisElevator({
      cabPayloadKg: params.cabPayload,
      cableTensionPct: params.cableTension,
    });
    return {
      part: calloutLabel,
      material: "Wagon-spring dogs on notched racks",
      qty: "F_arrest",
      value: otis.peakArrestForceKn.toString(),
      unit: "kN",
      note: otis.isPawlEngaged
        ? `Rope gone. Pawls fire in ${otis.pawlEngagementMs} ms, stop in ${otis.stoppingDistanceCm} cm.`
        : `Cable at ${otis.cableTensionPct}%. Pawls stowed.`,
    };
  }
  if (patentId.includes("delaval") || patentId.includes("247804")) {
    const sep = stepDeLavalSeparator({
      bowlRpm: params.bowlRpm ?? params.rotorRpm,
      rawMilkFlowLph: params.rawMilkFlowLph,
    });
    return {
      part: calloutLabel,
      material: "Nested conical discs on a flexible spindle",
      qty: "g",
      value: sep.gForce.toString(),
      unit: "×g",
      note: `${sep.fatYieldPct}% fat yield · cream ${sep.creamFlowLph} L/h.`,
    };
  }
  if (patentId.includes("hyatt") || patentId.includes("105338")) {
    const hyatt = stepHyattCelluloid({
      steamTempC: params.steamTempC ?? params.tempCelsius,
      hydraulicPressureMpa: params.hydraulicPressureMpa,
    });
    return {
      part: calloutLabel,
      material: "Camphor-plasticized nitrocellulose in a steam jacket",
      qty: "η",
      value: hyatt.viscosityPaS.toString(),
      unit: "Pa·s",
      note: hyatt.isMelted
        ? `Charge is plastic — ram can extrude. ρ ${hyatt.consolidationDensityGPerCm3} g/cm³ · ${hyatt.transparencyPct}% clear.`
        : "Below melt — ram just packs powder.",
    };
  }
  if (patentId.includes("gatling") || patentId.includes("36836")) {
    const gat = stepGatlingGun({
      crankRpm: params.crankRpm,
      barrelCount: params.barrelCount,
    });
    return {
      part: calloutLabel,
      material: "Six-barrel cam cluster, gravity hopper",
      qty: "RoF",
      value: gat.roundsPerMin.toString(),
      unit: "rds/min",
      note: `${gat.barrelCoolingIntervalS} s between shots on one barrel.`,
    };
  }
  if (patentId.includes("parsons") || patentId.includes("608969")) {
    const parsons = stepParsonsTurbine({
      rotorRpm: params.rotorRpm,
      inletPressurePsi: params.inletPressurePsi ?? (params.steamPressureBar ?? 12.4) * 14.5038,
    });
    return {
      part: calloutLabel,
      material: "HP/IP/LP reaction drum, 48 blade rows",
      qty: "P",
      value: parsons.shaftPowerKw.toString(),
      unit: "kW",
      note: `${parsons.enthalpyKjKg} kJ/kg at ${parsons.inletMpa} MPa.`,
    };
  }
  if (patentId.includes("ericsson") || patentId.includes("us-588")) {
    const screw = stepEricssonPropeller({
      shaftRpm: params.shaftRpm,
      bladePitchAngleDeg: params.bladePitchAngleDeg,
    });
    return {
      part: calloutLabel,
      material: "Gunmetal hoop + six helical blades",
      qty: "T",
      value: screw.thrustKn.toString(),
      unit: "kN",
      note: `${screw.shipSpeedKnots} kn at ${params.shaftRpm ?? 120} rpm.`,
    };
  }
  if (patentId.includes("pasteur") || patentId.includes("135245")) {
    const vat = stepPasteurFermentation({
      pasteurizationTempC: params.pasteurizationTempC,
      holdTimeMin: params.holdTimeMin,
      wortTempC: params.wortTempC ?? params.tempCelsius,
    });
    return {
      part: calloutLabel,
      material: "Closed tinned vat + gooseneck cotton trap",
      qty: "yeast",
      value: vat.yeastActivityPct.toString(),
      unit: "%",
      note: `${vat.logReduction} log kill on the pasteurizing hold.`,
    };
  }
  if (patentId.includes("thomson") || patentId.includes("347140")) {
    const weld = stepThomsonWelding({
      weldCurrentAmps: params.weldCurrentAmps ?? params.currentAmperes,
      clampPressureMpa: params.clampPressureMpa,
    });
    return {
      part: calloutLabel,
      material: "Single-turn secondary, copper jaws",
      qty: "T",
      value: weld.interfaceTempC.toString(),
      unit: "°C",
      note: `${weld.jouleKw} kW I²R. ${weld.isForged ? "Plastic forge." : "Below forge."}`,
    };
  }
  if (patentId.includes("whitney") || patentId.includes("x72")) {
    const gin = stepWhitneyCottonGin({ crankRpm: params.crankRpm });
    return {
      part: calloutLabel,
      material: "Wire grate + saw cylinder + brush drum",
      qty: "lint",
      value: gin.outputLbsPerDay.toString(),
      unit: "lb/day",
      note: `Saws ${gin.sawRpm} rpm, brush ${gin.brushRpm} rpm.`,
    };
  }
  if (patentId.includes("mccormick") || patentId.includes("x8277")) {
    const reaper = stepMcCormickReaper({ forwardSpeedMph: params.forwardSpeedMph });
    return {
      part: calloutLabel,
      material: "24-inch ground wheel; 30:9 and 27:9 gears; 13-inch to 12-inch reel belt",
      qty: "crank",
      value: reaper.cutterCrankRpm.toString(),
      unit: "rpm",
      note: `${reaper.cutterHz} Hz · ${reaper.groundSpeedMps} m/s. No-slip host kinematic estimate from dimensions printed in US X8277; not a field-capacity measurement.`,
    };
  }
  if (patentId.includes("nobel") || patentId.includes("78317")) {
    const nobel = stepNobelDynamite({
      ngConcentrationPct: params.ngConcentrationPct ?? params.ngConcentration,
      capEnergyJoules: params.capEnergyJoules,
    });
    return {
      part: calloutLabel,
      material: "Kieselguhr + nitroglycerin, fulminate cap",
      qty: "v_d",
      value: nobel.detonationVelocityMps.toString(),
      unit: "m/s",
      note: nobel.isInitiated
        ? "Cap initiated the column."
        : "Cap below initiation — no detonation.",
    };
  }
  if (patentId.includes("zeppelin") || patentId.includes("621195")) {
    const zep = stepZeppelinAirship({
      gasInflation: params.gasInflation,
      flightAlt: params.flightAlt,
      flightSpeedKnots: params.flightSpeedKnots,
      trimWeight: params.trimWeight,
    });
    return {
      part: calloutLabel,
      material: "Aluminum lattice, hydrogen cells",
      qty: "L",
      value: zep.netLiftKn.toString(),
      unit: "kN",
      note: `${zep.hydrogenVolumeM3} m³ H₂. Pitch ${zep.pitchTrimDeg}°.`,
    };
  }
  if (patentId.includes("daimler") || patentId.includes("361931")) {
    const d = stepDaimlerEngine({
      engineRpm: params.engineRpm,
      hotTubeTempC: params.hotTubeTemp,
      differentialSlipAngleDeg: params.turnAngle,
    });
    return {
      part: calloutLabel,
      material: "Enclosed crankcase, platinum hot-tube",
      qty: "BHP",
      value: d.brakeHorsepower.toString(),
      unit: "hp",
      note: `BMEP ${d.bmepBar} bar. Diff ${d.innerWheelRpm}/${d.outerWheelRpm} rpm.`,
    };
  }
  if (patentId.includes("hollerith") || patentId.includes("395781")) {
    const h = stepHollerithTabulating({
      cardsPerMin: params.cardsPerMin,
      supplyVoltageV: params.batteryVolts,
      activeRelays: params.activeRelays,
    });
    return {
      part: calloutLabel,
      material: "Pin press, mercury cups, clock-dial registers",
      qty: "cycle",
      value: h.cycleTimeMs.toString(),
      unit: "ms",
      note: `${h.solenoidForceN} N pin force · τ ${h.inductiveTauMs} ms.`,
    };
  }
  if (patentId.includes("goodyear") || patentId.includes("3633")) {
    const rubber = stepGoodyearRubber(params.vulcanTemp, params.sulfurPct, 30);
    return {
      part: calloutLabel,
      material: "India rubber + sulfur, 135–165 °C window",
      qty: "σ",
      value: rubber.tensileStrengthPsi.toString(),
      unit: "psi",
      note: rubber.isStickyOrBrittle
        ? "Off-window — sticky or brittle."
        : `ν ${rubber.crossLinkDensity} · return ${rubber.elasticReturnPct}%.`,
    };
  }
  if (patentId.includes("wozniak") || patentId.includes("4136359")) {
    const apple = stepWozniakApple({
      crystalFreq: params.crystalFreq,
      ramCapacityKb: params.ramCapacityKb,
    });
    return {
      part: calloutLabel,
      material: "14.318 MHz crystal, Φ1 video / Φ2 CPU",
      qty: "Φ2",
      value: apple.dramWindowNs.toString(),
      unit: "ns",
      note: `CPU ${apple.cpuClockMhz} MHz · color ${apple.colorSubcarrierMhz} MHz. Φ2 duty ${apple.cpuDutyPct}%.`,
    };
  }
  if (patentId.includes("spencer") || patentId.includes("2495429")) {
    const rf = stepSpencerMicrowave(
      (params.anodeVoltage ?? 2200) / 1000,
      params.magneticFieldGauss,
      params.rfPowerSetting,
    );
    return {
      part: calloutLabel,
      material: "Cavity magnetron, Hull cutoff",
      qty: "P_dielectric",
      value: rf.dielectricLossWattsPerDm3.toString(),
      unit: "W/dm³",
      note: rf.isOscillating
        ? `${rf.microwaveFreqMhz} MHz. B > ${rf.hullCutoffGauss} G.`
        : `Below Hull cutoff ${rf.hullCutoffGauss} G — no RF.`,
    };
  }
  if (patentId.includes("kevlar") || patentId.includes("3671542")) {
    const k = stepKevlarContinuum(params.drawRatio, params.impactVelocity);
    return {
      part: calloutLabel,
      material: "PPTA nematic dope, hydrogen-bonded sheets",
      qty: "E",
      value: k.elasticModulusGpa.toString(),
      unit: "GPa",
      note: `${k.tensileStrengthGpa} GPa fiber · ${k.alignmentPct}% align. ${k.tensileStressMpa} MPa at ${k.tensileStrainPct}% strain.`,
    };
  }
  if (patentId.includes("bardeen") || patentId.includes("2569347")) {
    const t = stepBardeenTransistor(
      params.emitterCurrent,
      params.collectorBias,
      params.pointSpacing,
    );
    return {
      part: calloutLabel,
      material: "n-Ge, two phosphor-bronze cat-whiskers",
      qty: "α",
      value: t.currentGainAlpha.toString(),
      unit: "",
      note: `D_p ${t.holeDiffusionCoefficientCm2ps} cm²/s · τ ${t.transitTimeNs} ns.`,
    };
  }
  if (patentId.includes("colt") || patentId.includes("us-138")) {
    const colt = stepColtRevolver({
      chamberPressureMpa: params.chamberPressure,
      cockingAngleDeg: params.cockingAngle,
    });
    return {
      part: calloutLabel,
      material: ".36 Paterson cylinder, folding trigger",
      qty: "v",
      value: colt.muzzleVelocityMps.toString(),
      unit: "m/s",
      note: `Hoop ${colt.hoopStressMpa} MPa. ${colt.isLocked ? "Locked." : "Indexing."}`,
    };
  }
  return null;
}

export function intervalGhosts(patentId: string, params: Record<string, number>): IntervalGhost[] {
  if (patentId.includes("wright")) {
    const si = stepWrightFlyerSi(readWrightControls(params));
    return [
      { label: "Lift", min: 800, max: 2500, live: si.liftNewtons, unit: "N" },
      { label: "Net yaw", min: -40, max: 40, live: si.netYawNm, unit: "N·m" },
    ];
  }
  if (patentId.includes("fermi")) {
    const rod = params.rodWithdrawal ?? 83.5;
    const mod = params.moderatorPurity ?? 99.5;
    const keff = fermiKeff(rod, mod);
    return [{ label: "k_eff", min: 0.85, max: 1.05, live: keff, unit: "" }];
  }
  if (patentId.includes("goddard")) {
    const th = goddardThermo(params.chamberPressure ?? 350, params.expansionRatio ?? 3.5);
    return [{ label: "v_e", min: 1200, max: 2800, live: th.veMps, unit: "m/s" }];
  }
  if (patentId.includes("bell") || patentId.includes("174465")) {
    return [{ label: "Voice", min: 40, max: 95, live: params.voiceAmplitude ?? 75, unit: "dB" }];
  }
  if (
    patentId.includes("edison") &&
    (patentId.includes("223898") || patentId.includes("lightbulb"))
  ) {
    const bulb = stepEdisonBulb({
      voltage: params.voltage,
      filamentLength: params.filamentLength,
    });
    return [{ label: "T_fil", min: 1200, max: 2400, live: bulb.filamentTempK, unit: "K" }];
  }
  if (patentId.includes("otto-engine") || patentId.includes("194047")) {
    const otto = stepOttoEngine({
      engineRpm: params.engineRpm,
      compressionRatio: params.compressionRatio,
    });
    return [{ label: "η", min: 20, max: 60, live: otto.thermalEfficiencyPct, unit: "%" }];
  }
  if (patentId.includes("pelton") || patentId.includes("233692")) {
    const pelton = stepPeltonWheel({
      headMeters: params.headMeters,
      runnerRpm: params.runnerRpm,
    });
    return [{ label: "η", min: 40, max: 93, live: pelton.etaPct, unit: "%" }];
  }
  if (patentId.includes("lincoln") || patentId.includes("6281")) {
    const buoy = stepLincolnBuoy({
      inflationPct: params.inflationPct,
      weightTons: params.weightTons,
      shoalDepth: params.shoalDepth,
    });
    return [{ label: "Clearance", min: -1, max: 4, live: buoy.shoalClearanceFt, unit: "ft" }];
  }
  if (patentId.includes("einstein") || patentId.includes("1781541")) {
    const frige = stepEinsteinRefrigerator({
      heatInput: params.heatInput,
      totalPressure: params.totalPressure,
      ammoniaRatio: params.ammoniaRatio ?? params.auxiliaryGasRatio,
    });
    return [{ label: "COP", min: 0.1, max: 0.4, live: frige.cop, unit: "" }];
  }
  if (patentId.includes("marconi")) {
    return [
      {
        label: "Aerial",
        min: 10,
        max: 120,
        live: params.aerialHeight ?? 88,
        unit: "m",
      },
    ];
  }
  if (patentId.includes("howe") || patentId.includes("4750")) {
    const sew = stepHoweSewingMachine(params.crankRpm ?? 240, params.threadTensionGrams ?? 45);
    return [{ label: "Shear", min: 1, max: 8, live: sew.lockstitchShearStrengthN, unit: "N" }];
  }
  if (patentId.includes("engelbart") || patentId.includes("3541541")) {
    const mouse = stepEngelbartMouse({
      mouseSpeed: params.mouseSpeed ?? 350,
      wheelRadius: params.wheelRadius ?? 10,
    });
    return [{ label: "ω", min: 0, max: 40, live: mouse.omegaRadPerS, unit: "rad/s" }];
  }
  if (
    patentId.includes("boyle") ||
    patentId.includes("ccd") ||
    patentId.includes("3923554") ||
    patentId.includes("3858232")
  ) {
    const wells = stepCcdWells(
      1,
      params.incidentLux ?? 850,
      params.clockFreq ?? 2.5,
      params.gateVoltage ?? 8,
    );
    return [
      {
        label: "Packet",
        min: 0,
        max: wells.fullWellElectrons,
        live: wells.photoElectrons,
        unit: "e⁻",
      },
    ];
  }
  if (patentId.includes("tesla-coil") || patentId.includes("533367")) {
    const cap = params.primaryCap ?? 45;
    const freqKhz = teslaCoilResonantKhz(cap, params.toploadCapacitancePf);
    const coil = FrankenSimEngine.stepTeslaCoil(
      freqKhz,
      params.inputVoltageKv ?? 15,
      params.sparkGapDistanceMm ?? 12,
      145,
      params.couplingK ?? 0.18,
      params.secondaryTurns ?? 850,
    );
    return [{ label: "Arc", min: 0.1, max: 4, live: coil.streamerLengthMeters, unit: "m" }];
  }
  if (patentId.includes("diesel") || patentId.includes("542846")) {
    const diesel = FrankenSimEngine.stepDieselEngine({
      compressionRatio: params.compRatio ?? params.compressionRatio ?? 18,
      blastAirPressureBar: params.blastAirPressure ?? 65,
      cutoffRatio: params.cutoffRatio ?? 1.6,
    });
    return [{ label: "T₂", min: 200, max: 800, live: diesel.tCompressionC, unit: "°C" }];
  }
  if (patentId.includes("kodak") || patentId.includes("388850")) {
    const raw = params.shutterSpeed ?? 0.05;
    const t = raw > 1 ? 1 / raw : raw;
    const kodak = FrankenSimEngine.stepEastmanKodak({
      shutterSpeedSec: t,
      apertureFNumber: params.apertureStop ?? 9,
      subjectDistanceM: params.subjectDist ?? 3,
    });
    return [{ label: "H", min: 1, max: 20, live: kodak.hyperfocalM, unit: "m" }];
  }
  if (patentId.includes("farnsworth") || patentId.includes("1773980")) {
    const anodeKv = (params.anodeVoltage ?? 1500) / 1000;
    const gauss = FrankenSimEngine.farnsworthDeflectionGauss(params.coilCurrent);
    const tv = FrankenSimEngine.stepFarnsworthTv(anodeKv, gauss, params.lightIntensityLux ?? 500);
    return [{ label: "r_L", min: 1, max: 40, live: tv.gyroRadiusMm, unit: "mm" }];
  }
  if (patentId.includes("phonograph") || patentId.includes("200521")) {
    const phono = stepEdisonPhonograph({
      mandrelRpm: params.mandrelRpm,
      voiceVolumeDb: params.voiceVolumeDb,
    });
    return [{ label: "Groove", min: 5, max: 40, live: phono.grooveDepthMicrons, unit: "µm" }];
  }
  if (patentId.includes("noyce") || patentId.includes("2981877")) {
    const ic = stepNoyceIC({
      reverseBias: params.reverseBias,
      oxideThickness: params.oxideThickness,
    });
    return [{ label: "W", min: 0.2, max: 3, live: ic.depletionWidthUm, unit: "µm" }];
  }
  if (patentId.includes("maxim") || patentId.includes("319596")) {
    const maxim = FrankenSimEngine.stepMaximMachineGun({
      firingRateRpm: params.firingRate ?? params.fireRateRpm ?? 600,
      waterJacketLiters: params.waterLevel ?? 4,
      recoilStrokeMm: params.recoilStroke ?? 19,
    });
    return [{ label: "T_b", min: 80, max: 450, live: maxim.barrelTempC, unit: "°C" }];
  }
  if (patentId.includes("westinghouse") || patentId.includes("124404")) {
    const wh = FrankenSimEngine.stepWestinghouseAirBrake({
      trainPipePressurePsi: params.trainPipePressure ?? params.brakePressurePsi ?? 70,
      carMassTonnes: params.carMass ?? 35,
    });
    return [{ label: "Stop", min: 50, max: 1200, live: wh.stoppingDistanceM, unit: "m" }];
  }
  if (patentId.includes("lamarr") || patentId.includes("2292387")) {
    const fh = FrankenSimEngine.stepLamarrFrequencyHopping(
      params.channels ?? 88,
      params.hopRate ?? 4,
    );
    return [{ label: "G_p", min: 10, max: 35, live: fh.processingGainDb, unit: "dB" }];
  }
  if (patentId.includes("sholes") || patentId.includes("79265")) {
    const sholes = stepSholesTypewriter(params.typingSpeedWpm ?? 45, 0);
    return [{ label: "Strike", min: 1, max: 10, live: sholes.cps, unit: "s⁻¹" }];
  }
  if (patentId.includes("linotype") || patentId.includes("313224")) {
    const lino = stepMergenthalerLinotype({
      matrixRatePerMin: params.matrixRate,
      potTempC: params.potTemp,
    });
    return [{ label: "Cycle", min: 5, max: 90, live: lino.cycleS, unit: "s" }];
  }
  if (patentId.includes("reno") || patentId.includes("470918")) {
    const reno = stepRenoEscalator({
      velocityMps: params.beltSpeed,
      inclineAngleDeg: params.inclineAngle,
      passengerCount: params.passengerCount,
    });
    return [
      { label: "Throughput", min: 1000, max: 8000, live: reno.throughputPerHour, unit: "/h" },
    ];
  }
  if (patentId.includes("otis") || patentId.includes("31128")) {
    const otis = stepOtisElevator({
      cabPayloadKg: params.cabPayload,
      cableTensionPct: params.cableTension,
    });
    return [{ label: "Arrest", min: 0, max: 20, live: otis.peakArrestForceKn, unit: "kN" }];
  }
  if (patentId.includes("delaval") || patentId.includes("247804")) {
    const sep = stepDeLavalSeparator({ bowlRpm: params.bowlRpm ?? params.rotorRpm });
    return [{ label: "g", min: 500, max: 12000, live: sep.gForce, unit: "×g" }];
  }
  if (patentId.includes("hyatt") || patentId.includes("105338")) {
    const hyatt = stepHyattCelluloid({
      steamTempC: params.steamTempC ?? params.tempCelsius,
      hydraulicPressureMpa: params.hydraulicPressureMpa,
    });
    return [{ label: "η", min: 80, max: 4000, live: hyatt.viscosityPaS, unit: "Pa·s" }];
  }
  if (patentId.includes("gatling") || patentId.includes("36836")) {
    const gat = stepGatlingGun({ crankRpm: params.crankRpm, barrelCount: params.barrelCount });
    return [{ label: "RoF", min: 60, max: 1200, live: gat.roundsPerMin, unit: "rds/min" }];
  }
  if (patentId.includes("parsons") || patentId.includes("608969")) {
    const parsons = stepParsonsTurbine({
      rotorRpm: params.rotorRpm,
      inletPressurePsi: params.inletPressurePsi ?? (params.steamPressureBar ?? 12.4) * 14.5038,
    });
    return [{ label: "Shaft", min: 1000, max: 20000, live: parsons.shaftPowerKw, unit: "kW" }];
  }
  if (patentId.includes("ericsson") || patentId.includes("us-588")) {
    const screw = stepEricssonPropeller({
      shaftRpm: params.shaftRpm,
      bladePitchAngleDeg: params.bladePitchAngleDeg,
    });
    return [{ label: "Thrust", min: 2, max: 40, live: screw.thrustKn, unit: "kN" }];
  }
  if (patentId.includes("pasteur") || patentId.includes("135245")) {
    const vat = stepPasteurFermentation({
      wortTempC: params.wortTempC ?? params.tempCelsius,
      pasteurizationTempC: params.pasteurizationTempC,
      holdTimeMin: params.holdTimeMin,
    });
    return [{ label: "Yeast", min: 0, max: 100, live: vat.yeastActivityPct, unit: "%" }];
  }
  if (patentId.includes("thomson") || patentId.includes("347140")) {
    const weld = stepThomsonWelding({
      weldCurrentAmps: params.weldCurrentAmps ?? params.currentAmperes,
      clampPressureMpa: params.clampPressureMpa,
    });
    return [{ label: "T_weld", min: 200, max: 1600, live: weld.interfaceTempC, unit: "°C" }];
  }
  if (patentId.includes("whitney") || patentId.includes("x72")) {
    const gin = stepWhitneyCottonGin({ crankRpm: params.crankRpm });
    return [{ label: "Lint", min: 10, max: 90, live: gin.outputLbsPerDay, unit: "lb/day" }];
  }
  if (patentId.includes("mccormick") || patentId.includes("x8277")) {
    const reaper = stepMcCormickReaper({ forwardSpeedMph: params.forwardSpeedMph });
    return [{ label: "Crank", min: 0, max: 700, live: reaper.cutterCrankRpm, unit: "rpm" }];
  }
  if (patentId.includes("nobel") || patentId.includes("78317")) {
    const nobel = stepNobelDynamite({
      ngConcentrationPct: params.ngConcentrationPct ?? params.ngConcentration,
      capEnergyJoules: params.capEnergyJoules,
    });
    return [{ label: "v_d", min: 0, max: 8000, live: nobel.detonationVelocityMps, unit: "m/s" }];
  }
  if (patentId.includes("zeppelin") || patentId.includes("621195")) {
    const zep = stepZeppelinAirship({
      gasInflation: params.gasInflation,
      flightAlt: params.flightAlt,
      flightSpeedKnots: params.flightSpeedKnots,
      trimWeight: params.trimWeight,
    });
    return [{ label: "Lift", min: -20, max: 40, live: zep.netLiftKn, unit: "kN" }];
  }
  if (patentId.includes("daimler") || patentId.includes("361931")) {
    const d = stepDaimlerEngine({
      engineRpm: params.engineRpm,
      hotTubeTempC: params.hotTubeTemp,
      differentialSlipAngleDeg: params.turnAngle,
    });
    return [{ label: "BHP", min: 0.2, max: 2.5, live: d.brakeHorsepower, unit: "hp" }];
  }
  if (patentId.includes("hollerith") || patentId.includes("395781")) {
    const h = stepHollerithTabulating({
      cardsPerMin: params.cardsPerMin,
      supplyVoltageV: params.batteryVolts,
      activeRelays: params.activeRelays,
    });
    return [{ label: "Cycle", min: 200, max: 3000, live: h.cycleTimeMs, unit: "ms" }];
  }
  if (patentId.includes("goodyear") || patentId.includes("3633")) {
    const rubber = stepGoodyearRubber(params.vulcanTemp, params.sulfurPct, 30);
    return [{ label: "σ", min: 200, max: 3200, live: rubber.tensileStrengthPsi, unit: "psi" }];
  }
  if (patentId.includes("wozniak") || patentId.includes("4136359")) {
    const apple = stepWozniakApple({ crystalFreq: params.crystalFreq });
    return [{ label: "Φ2", min: 200, max: 800, live: apple.dramWindowNs, unit: "ns" }];
  }
  if (patentId.includes("spencer") || patentId.includes("2495429")) {
    const rf = stepSpencerMicrowave(
      (params.anodeVoltage ?? 2200) / 1000,
      params.magneticFieldGauss,
      params.rfPowerSetting,
    );
    return [
      { label: "Loss", min: 0, max: 3000, live: rf.dielectricLossWattsPerDm3, unit: "W/dm³" },
    ];
  }
  if (patentId.includes("kevlar") || patentId.includes("3671542")) {
    const k = stepKevlarContinuum(params.drawRatio, params.impactVelocity);
    return [{ label: "E", min: 60, max: 145, live: k.elasticModulusGpa, unit: "GPa" }];
  }
  if (patentId.includes("bardeen") || patentId.includes("2569347")) {
    const t = stepBardeenTransistor(
      params.emitterCurrent,
      params.collectorBias,
      params.pointSpacing,
    );
    return [{ label: "α", min: 0.2, max: 3, live: t.currentGainAlpha, unit: "" }];
  }
  return [];
}

export function fidelityField(
  patentId: string,
  params: Record<string, number>,
): FidelityField | null {
  if (patentId.includes("wright")) {
    const si = stepWrightFlyerSi(readWrightControls(params));
    return {
      part: "Gross lift vs Kitty Hawk weight",
      model: Math.round(si.liftNewtons).toString(),
      reference: String(KITTY_HAWK.liftN),
      residual: Math.round(si.liftNewtons - KITTY_HAWK.liftN).toString(),
      unit: "N",
    };
  }
  if (patentId.includes("tesla-motor") || patentId.includes("381968")) {
    const ns = (120 * (params.frequency ?? 60)) / 2;
    return {
      part: "Synchronous speed",
      model: ns.toFixed(0),
      reference: "3600",
      residual: (ns - 3600).toFixed(0),
      unit: "rpm",
    };
  }
  if (patentId.includes("pelton") || patentId.includes("233692")) {
    const pelton = stepPeltonWheel({
      headMeters: params.headMeters,
      runnerRpm: params.runnerRpm,
    });
    return {
      part: "Impulse speed ratio u/v",
      model: pelton.speedRatio.toFixed(3),
      reference: "0.500",
      residual: (pelton.speedRatio - 0.5).toFixed(3),
      unit: "",
    };
  }
  if (patentId.includes("otto-engine") || patentId.includes("194047")) {
    const otto = stepOttoEngine({
      engineRpm: params.engineRpm,
      compressionRatio: params.compressionRatio,
    });
    return {
      part: "Air-standard η vs 1876 Deutz shop",
      model: otto.thermalEfficiencyPct.toString(),
      reference: "27",
      residual: (otto.thermalEfficiencyPct - 27).toString(),
      unit: "%",
    };
  }
  if (patentId.includes("howe") || patentId.includes("4750")) {
    const sew = stepHoweSewingMachine(params.crankRpm ?? 240, params.threadTensionGrams ?? 45);
    return {
      part: "Stitch rate vs 1846 Howe shop",
      model: sew.stitchesPerMinute.toString(),
      reference: "250",
      residual: (sew.stitchesPerMinute - 250).toString(),
      unit: "spm",
    };
  }
  if (patentId.includes("engelbart") || patentId.includes("3541541")) {
    const mouse = stepEngelbartMouse({
      mouseSpeed: params.mouseSpeed ?? 350,
      wheelRadius: params.wheelRadius ?? 10,
    });
    return {
      part: "Resolution vs 1968 NLS mouse",
      model: mouse.dpi.toString(),
      reference: "200",
      residual: (mouse.dpi - 200).toString(),
      unit: "dpi",
    };
  }
  if (
    patentId.includes("boyle") ||
    patentId.includes("ccd") ||
    patentId.includes("3923554") ||
    patentId.includes("3858232")
  ) {
    const wells = stepCcdWells(
      1,
      params.incidentLux ?? 850,
      params.clockFreq ?? 2.5,
      params.gateVoltage ?? 8,
    );
    return {
      part: "CTE vs Bell Labs 1969 packet transfer",
      model: wells.cte.toFixed(5),
      reference: "0.99995",
      residual: (wells.cte - 0.99995).toFixed(5),
      unit: "",
    };
  }
  if (patentId.includes("tesla-coil") || patentId.includes("533367")) {
    const cap = params.primaryCap ?? 45;
    const freqKhz = teslaCoilResonantKhz(cap, params.toploadCapacitancePf);
    const coil = FrankenSimEngine.stepTeslaCoil(
      freqKhz,
      params.inputVoltageKv ?? 15,
      params.sparkGapDistanceMm ?? 12,
      145,
      params.couplingK ?? 0.18,
      params.secondaryTurns ?? 850,
    );
    return {
      part: "Streamer vs Colorado Springs 1899",
      model: coil.streamerLengthMeters.toFixed(2),
      reference: "30",
      residual: (coil.streamerLengthMeters - 30).toFixed(2),
      unit: "m",
    };
  }
  if (patentId.includes("diesel") || patentId.includes("542846")) {
    const diesel = FrankenSimEngine.stepDieselEngine({
      compressionRatio: params.compRatio ?? params.compressionRatio ?? 18,
    });
    return {
      part: "Adiabatic T₂ vs 210 °C heavy-oil flash",
      model: diesel.tCompressionC.toString(),
      reference: "210",
      residual: (diesel.tCompressionC - 210).toString(),
      unit: "°C",
    };
  }
  if (patentId.includes("kodak") || patentId.includes("388850")) {
    const raw = params.shutterSpeed ?? 0.05;
    const t = raw > 1 ? 1 / raw : raw;
    const kodak = FrankenSimEngine.stepEastmanKodak({
      shutterSpeedSec: t,
      apertureFNumber: params.apertureStop ?? 9,
    });
    return {
      part: "Hyperfocal vs 1888 Kodak No. 1",
      model: kodak.hyperfocalM.toFixed(2),
      reference: "12",
      residual: (kodak.hyperfocalM - 12).toFixed(2),
      unit: "m",
    };
  }
  if (patentId.includes("noyce") || patentId.includes("2981877")) {
    const ic = stepNoyceIC({ reverseBias: params.reverseBias });
    return {
      part: "Breakdown margin vs 35 V planar oxide",
      model: ic.breakdownMarginV.toString(),
      reference: "30",
      residual: (ic.breakdownMarginV - 30).toFixed(1),
      unit: "V",
    };
  }
  if (patentId.includes("maxim") || patentId.includes("319596")) {
    const maxim = FrankenSimEngine.stepMaximMachineGun({
      firingRateRpm: params.firingRate ?? params.fireRateRpm ?? 600,
      waterJacketLiters: params.waterLevel ?? 4,
      recoilStrokeMm: params.recoilStroke ?? 19,
    });
    return {
      part: "Jacket boil vs 1884 Maxim water-cooled gun",
      model: maxim.barrelTempC.toString(),
      reference: "100",
      residual: (maxim.barrelTempC - 100).toString(),
      unit: "°C",
    };
  }
  if (patentId.includes("westinghouse") || patentId.includes("124404")) {
    const wh = FrankenSimEngine.stepWestinghouseAirBrake({
      trainPipePressurePsi: params.trainPipePressure ?? params.brakePressurePsi ?? 70,
      carMassTonnes: params.carMass ?? 35,
    });
    return {
      part: "Train-pipe charge vs 70 psi running",
      model: wh.trainPipePressurePsi.toString(),
      reference: "70",
      residual: (wh.trainPipePressurePsi - 70).toString(),
      unit: "psi",
    };
  }
  if (patentId.includes("lamarr") || patentId.includes("2292387")) {
    const fh = FrankenSimEngine.stepLamarrFrequencyHopping(
      params.channels ?? 88,
      params.hopRate ?? 4,
    );
    return {
      part: "Hop set vs 88-key piano roll",
      model: fh.channelsCount.toString(),
      reference: "88",
      residual: (fh.channelsCount - 88).toString(),
      unit: "keys",
    };
  }
  return null;
}

export function smokePolicy(patentId: string, params: Record<string, number>): SmokePolicy {
  if (patentId.includes("goddard")) {
    const th = goddardThermo(params.chamberPressure ?? 350, params.expansionRatio ?? 3.5);
    if (th.veMps < 800) {
      return { allowed: false, reason: "v_e below sonic throat — no exhaust plume drawn." };
    }
    return {
      allowed: true,
      reason: `Plume from isentropic v_e = ${th.veMps} m/s, T_e = ${th.exhaustTempK} K.`,
    };
  }
  if (patentId.includes("spencer")) {
    const rf = params.rfPowerSetting ?? 800;
    if (rf < 200) {
      return { allowed: false, reason: "RF below magnetron oscillation — no steam drawn." };
    }
    return { allowed: true, reason: `${rf} W dielectric heating of water, not a smoke texture.` };
  }
  return { allowed: true, reason: "No cosmetic plume on this patent." };
}

export function whitneySamples(omegaT: number): { x: number; y: number; bx: number; by: number }[] {
  const { bx, by } = teslaBAt(omegaT, 2);
  const out: { x: number; y: number; bx: number; by: number }[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    out.push({
      x: Math.cos(a),
      y: Math.sin(a),
      bx: -by * Math.sin(a) * 0.25,
      by: bx * Math.cos(a) * 0.25,
    });
  }
  return out;
}

export function spectralModes(patentId: string, params: Record<string, number>): SpectralMode[] {
  if (patentId.includes("marconi")) {
    const h = params.aerialHeight ?? 88;
    const f0 = 3e8 / (4 * h);
    return [1, 3, 5, 7, 9].map((n) => ({
      n,
      freqHz: f0 * n,
      amp: 1 / n,
      name: n === 1 ? "λ/4" : `${n} f₀`,
    }));
  }
  if (patentId.includes("tesla-coil") || patentId.includes("533367")) {
    const cap = params.primaryCap ?? 45;
    const f0 = 180e3 * Math.sqrt(45 / Math.max(10, cap));
    return [1, 2, 3].map((n) => ({
      n,
      freqHz: f0 * n,
      amp: n === 1 ? 1 : 0.25 / n,
      name: n === 1 ? "LC tank" : `harmonic ${n}`,
    }));
  }
  return [];
}

export function datedScenarios(patentId: string): DatedScenario[] {
  if (patentId.includes("wright")) {
    return [
      {
        id: "kh-1903-12-17",
        date: "1903-12-17",
        name: "Kitty Hawk first hop",
        writes: { airspeed: 30, wingWarp: 4, elevator: 6, coupled: 1 },
      },
      {
        id: "uncoupled-glider",
        date: "1901",
        name: "1901 glider, no rudder link",
        writes: { airspeed: 24, wingWarp: 12, rudder: 0, coupled: 0 },
      },
    ];
  }
  if (patentId.includes("fermi")) {
    return [
      {
        id: "cp1-1942-12-02",
        date: "1942-12-02",
        name: "CP-1 first critical",
        writes: { rodWithdrawal: 65, moderatorPurity: 99.9 },
      },
    ];
  }
  if (patentId.includes("bell")) {
    return [
      {
        id: "centennial-1876",
        date: "1876-03-10",
        name: "Watson, come here",
        writes: { voiceAmplitude: 78 },
      },
    ];
  }
  if (patentId.includes("goddard")) {
    return [
      {
        id: "auburn-1926-03-16",
        date: "1926-03-16",
        name: "Auburn first liquid hop",
        writes: { chamberPressure: 250, expansionRatio: 3.0 },
      },
    ];
  }
  if (patentId.includes("223898") || patentId.includes("lightbulb")) {
    return [
      {
        id: "menlo-1879-10-21",
        date: "1879-10-21",
        name: "Menlo Park 40-hour lamp",
        writes: { voltage: 110 },
      },
    ];
  }
  if (patentId.includes("marconi")) {
    return [
      {
        id: "poldhu-1901-12-12",
        date: "1901-12-12",
        name: "Poldhu–St John's",
        writes: { aerialHeight: 48, sparkVoltage: 40 },
      },
    ];
  }
  if (patentId.includes("morse") || patentId.includes("1647")) {
    return [
      {
        id: "baltimore-1844-05-24",
        date: "1844-05-24",
        name: "What hath God wrought",
        writes: { currentMa: 65 },
      },
    ];
  }
  if (patentId.includes("otis") || patentId.includes("31128")) {
    return [
      {
        id: "crystal-palace-1854",
        date: "1854-05-23",
        name: "Crystal Palace cut-rope",
        writes: { cableTension: 0, cabPayload: 650 },
      },
    ];
  }
  if (patentId.includes("otto-engine") || patentId.includes("194047")) {
    return [
      {
        id: "deutz-1876",
        date: "1876",
        name: "Deutz four-stroke shop engine",
        writes: { engineRpm: 180, compressionRatio: 4.5 },
      },
    ];
  }
  if (patentId.includes("pelton") || patentId.includes("233692")) {
    return [
      {
        id: "nevada-city-1880",
        date: "1880",
        name: "Nevada City 450 m head",
        writes: { headMeters: 450, runnerRpm: 600 },
      },
    ];
  }
  if (patentId.includes("sholes") || patentId.includes("79265")) {
    return [
      {
        id: "remington-1874",
        date: "1874",
        name: "Remington No. 1 shop rate",
        writes: { typingSpeedWpm: 40 },
      },
    ];
  }
  if (patentId.includes("parsons") || patentId.includes("608969")) {
    return [
      {
        id: "turbinia-1897",
        date: "1897",
        name: "Turbinia Spithead review",
        writes: { rotorRpm: 3000, inletPressurePsi: 180 },
      },
    ];
  }
  if (patentId.includes("pasteur") || patentId.includes("135245")) {
    return [
      {
        id: "lille-1873",
        date: "1873",
        name: "Lille brewery closed vat",
        writes: { wortTempC: 22, pasteurizationTempC: 58, holdTimeMin: 20 },
      },
    ];
  }
  if (patentId.includes("thomson") || patentId.includes("347140")) {
    return [
      {
        id: "lynn-1886",
        date: "1886",
        name: "Lynn bar-butt weld",
        writes: { weldCurrentAmps: 4500, clampPressureMpa: 35 },
      },
    ];
  }
  if (patentId.includes("howe") || patentId.includes("4750")) {
    return [
      {
        id: "cambridge-1846",
        date: "1846-09-10",
        name: "Howe lockstitch shop rate",
        writes: { crankRpm: 250, stitchPitchMm: 2.5, threadTensionGrams: 50 },
      },
    ];
  }
  if (patentId.includes("engelbart") || patentId.includes("3541541")) {
    return [
      {
        id: "sri-1968-12-09",
        date: "1968-12-09",
        name: "Mother of All Demos",
        writes: { mouseSpeed: 140, wheelRadius: 10, cpiResolution: 200 },
      },
    ];
  }
  if (
    patentId.includes("boyle") ||
    patentId.includes("ccd") ||
    patentId.includes("3923554") ||
    patentId.includes("3858232")
  ) {
    return [
      {
        id: "murray-hill-1969",
        date: "1969-10-19",
        name: "Bell Labs CCD announcement",
        writes: { clockFreq: 1.0, gateVoltage: 10, incidentLux: 650 },
      },
    ];
  }
  if (patentId.includes("tesla-coil") || patentId.includes("533367")) {
    return [
      {
        id: "columbia-1891",
        date: "1891-05-20",
        name: "Columbia lecture coil",
        writes: { primaryCap: 45, couplingK: 0.18, inputVoltageKv: 15, sparkGapDistanceMm: 12 },
      },
    ];
  }
  if (patentId.includes("diesel") || patentId.includes("542846")) {
    return [
      {
        id: "augsburg-1893",
        date: "1893",
        name: "Augsburg first fire",
        writes: { compRatio: 18, blastAirPressure: 65, cutoffRatio: 1.6 },
      },
    ];
  }
  if (patentId.includes("kodak") || patentId.includes("388850")) {
    return [
      {
        id: "rochester-1888",
        date: "1888",
        name: "You press the button",
        writes: { shutterSpeed: 0.05, apertureStop: 9, subjectDist: 3 },
      },
    ];
  }
  if (patentId.includes("farnsworth") || patentId.includes("1773980")) {
    return [
      {
        id: "san-francisco-1927",
        date: "1927-09-07",
        name: "First dissector image",
        writes: { anodeVoltage: 1500, coilCurrent: 0.42, lightIntensityLux: 500 },
      },
    ];
  }
  if (patentId.includes("phonograph") || patentId.includes("200521")) {
    return [
      {
        id: "menlo-1877",
        date: "1877-12-06",
        name: "Mary had a little lamb",
        writes: { mandrelRpm: 60, voiceVolumeDb: 75 },
      },
    ];
  }
  if (patentId.includes("noyce") || patentId.includes("2981877")) {
    return [
      {
        id: "fairchild-1959",
        date: "1959-07-30",
        name: "Fairchild planar process",
        writes: { reverseBias: 5, oxideThickness: 0.5 },
      },
    ];
  }
  if (patentId.includes("maxim") || patentId.includes("319596")) {
    return [
      {
        id: "hatton-garden-1884",
        date: "1884",
        name: "Hatton Garden water-jacket trial",
        writes: { firingRate: 600, waterLevel: 4, recoilStroke: 19 },
      },
    ];
  }
  if (patentId.includes("westinghouse") || patentId.includes("124404")) {
    return [
      {
        id: "steubenville-1869",
        date: "1869",
        name: "Steubenville automatic stop",
        writes: { trainPipePressure: 20, carMass: 35 },
      },
    ];
  }
  if (patentId.includes("lamarr") || patentId.includes("2292387")) {
    return [
      {
        id: "filing-1941-06-10",
        date: "1941-06-10",
        name: "Secret Communication System filing",
        writes: { channels: 88, hopRate: 4, isJammingActive: 1 },
      },
    ];
  }
  return [];
}

export function coupleLinks(patentId: string, params: Record<string, number>): CoupleLink[] {
  if (patentId.includes("wright")) {
    const si = stepWrightFlyerSi(readWrightControls(params));
    const v = (params.airspeed ?? 28) * 0.44704;
    return [
      { from: "thrust · v", to: "induced drag", watts: si.inducedDragNewtons * v },
      { from: "warp ΔL", to: "adverse yaw", watts: Math.abs(si.adverseYawNm) * 2 },
    ];
  }
  if (patentId.includes("tesla-motor") || patentId.includes("381968")) {
    const f = params.frequency ?? 60;
    const load = params.loadTorque ?? 38.5;
    const em = FrankenSimEngine.stepTeslaMotor(f, 2, load);
    const rotorRpm = em.synchronousRpm * (1 - em.slipFraction);
    const pout = (load * (rotorRpm * 2 * Math.PI)) / 60;
    return [{ from: "stator B", to: "shaft", watts: pout }];
  }
  if (patentId.includes("223898") || patentId.includes("lightbulb")) {
    const bulb = stepEdisonBulb({
      voltage: params.voltage ?? 110,
      filamentLength: params.filamentLength,
    });
    return [{ from: "I²R", to: "radiation", watts: bulb.radiantWatts }];
  }
  if (patentId.includes("tesla-coil") || patentId.includes("533367")) {
    const cap = params.primaryCap ?? 45;
    const freqKhz = teslaCoilResonantKhz(cap, params.toploadCapacitancePf);
    const coil = FrankenSimEngine.stepTeslaCoil(
      freqKhz,
      params.inputVoltageKv ?? 15,
      params.sparkGapDistanceMm ?? 12,
      145,
      params.couplingK ?? 0.18,
      params.secondaryTurns ?? 850,
    );
    const watts = (params.inputVoltageKv ?? 15) * 20;
    return [{ from: "primary spark", to: `${coil.streamerLengthInches.toFixed(0)} in arc`, watts }];
  }
  if (
    patentId.includes("boyle") ||
    patentId.includes("ccd") ||
    patentId.includes("3923554") ||
    patentId.includes("3858232")
  ) {
    const wells = stepCcdWells(
      1,
      params.incidentLux ?? 850,
      params.clockFreq ?? 2.5,
      params.gateVoltage ?? 8,
    );
    return [{ from: "photons", to: "well packet", watts: wells.photoElectrons * 1.6e-19 * 1e12 }];
  }
  if (patentId.includes("howe") || patentId.includes("4750")) {
    const sew = stepHoweSewingMachine(params.crankRpm ?? 240, params.threadTensionGrams ?? 45);
    return [
      {
        from: "flywheel",
        to: "lockstitch",
        watts: sew.stitchFrequencyHz * sew.lockstitchShearStrengthN * 0.003,
      },
    ];
  }
  return [];
}

export function kittyHawkResidual(params: Record<string, number>): KittyHawkResidual {
  const si = stepWrightFlyerSi(readWrightControls(params));
  const liveMph = params.airspeed ?? 28;
  return {
    liveLiftN: si.liftNewtons,
    histLiftN: KITTY_HAWK.liftN,
    liftResidualN: si.liftNewtons - KITTY_HAWK.liftN,
    liveMph,
    histMph: KITTY_HAWK.airspeedMph,
    speedResidualMph: liveMph - KITTY_HAWK.airspeedMph,
  };
}

export const NAMED_RINGS = [
  { name: "A440", hz: 440 },
  { name: "C5", hz: 523 },
  { name: "Ahoy ~300", hz: 300 },
  { name: "Watson 400", hz: 400 },
] as const;

export function mmsResidual(
  patentId: string,
  params: Record<string, number>,
): FidelityField | null {
  return fidelityField(patentId, params);
}
