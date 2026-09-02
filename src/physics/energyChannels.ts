import type { EnergyChannel } from "@/components/patents/EnergyFlowStrip";
import { stepArkwrightWaterFrame } from "./arkwrightKernel";
import { stepBellPhotophone } from "./bellPhotophoneKernel";
import {
  stepBaekelandBakelite,
  stepBellTelephone,
  stepBoyleSmithCcd,
  stepCarlsonElectrophotography,
  stepCorlissEngine,
  stepDavenportMotor,
  stepDeForestAudion,
  stepEdisonBulb,
  stepEdisonPhonograph,
  stepEinsteinRefrigerator,
  stepGatlingGun,
  stepHaberAmmonia,
  stepHallAluminium,
  stepHewittMercuryLamp,
  stepMaimanRubyLaser,
  stepMarconiRadio,
  stepMcCormickReaper,
  stepMorseTelegraph,
  stepNoyceIC,
  stepParsonsTurbine,
  stepThomsonWelding,
  stepTownesLaser,
  stepWattCondenser,
  stepWhitneyCottonGin,
  stepWozniakApple,
  stepZeppelinAirship,
} from "./catalogKernels";
import { stepCortPuddlingRolling } from "./cortKernel";
import { FrankenSimEngine } from "./engine";
import { stepFermiKinetics } from "./fermiKinetics";
import { readKamenSegwayControls, stepKamenSegwaySi } from "./kamenSegwayKernel";
import { readKamenTransporterControls, stepKamenTransporterSi } from "./kamenTransporterKernel";
import { stepRenoEscalator } from "./machineKernels";
import { stepRillieuxEvaporator } from "./rillieuxEvaporatorKernel";
import { readWattRotaryControls, stepWattRotaryEngine } from "./wattRotaryKernel";
import { readWrightControls, stepWrightFlyerSi } from "./wrightKernel";

/** Mechanical horsepower in watts. Used only to print an already-owned hp field. */
const MECHANICAL_HORSEPOWER_W = 745.7;

/** Explicit reasons that a published record has no honest SI power-flow strip. */
export const ENERGY_CHANNEL_OMISSION_REASONS = {
  "us-1102653-goddard-rocket":
    "US 1,102,653 prints apparatus geometry and firing order but no burn rate, force, speed, or power datum from which an SI energy channel can be derived.",
  "us-361931-daimler-engine":
    "US 361,931 prints marine shaft, coupling, reversing, cooling, steering, and gas-storage topology but no speed, torque, friction coefficient, flow, heat, or power datum from which an SI energy channel can be derived.",
  "us-593138-tesla-coil":
    "US 593,138 prints winding geometry, terminal relationships, an earth connection, and a quarter-wave example but no capacitance, spark rate, current, load, loss, or power datum from which an SI energy channel can be derived.",
  "us-194047-otto-engine":
    "US 194,047 prints charge ordering, valve-gear topology, and a one-to-two shaft timing relation but no cylinder dimensions, operating speed, fuel flow, pressure trace, torque, inertia, or power datum from which an SI energy channel can be derived.",
  "us-6331181-davinci":
    "US 6,331,181 prints tool-memory, compatibility, calibration-offset, engagement, and linkage topology but no motor torque, drive speed, friction, electrical load, or power datum from which an SI energy channel can be derived.",
  "us-6594844-roomba":
    "US 6,594,844 prints optical emitter/detector geometry and redirect-circuit behavior but no battery voltage, current, robot mass, motor load, brush drag, vacuum flow, loss, or power datum from which an SI energy channel can be derived.",
  "us-4750-howe-sewing-machine":
    "US 4,750 prints the mechanism topology and two local dimensions but no force, torque, inertia, speed, friction, or power datum from which an SI energy channel can be derived.",
  "us-31128-otis-elevator":
    "US 31,128 prints the hoist, reversing-belt, brake, stop-rope, counterpoise, and hook-rack topology but no load, force, speed, torque, friction, travel, timing, or power datum from which an SI energy channel can be derived.",
  "us-4341502-makino-scara":
    "US 4,341,502 prints link topology and joint angle relationships but no link lengths, motor torque, payload mass, velocity, friction, or power datum from which an SI energy channel can be derived.",
  "us-4512709-milacron-robot-toolchanger":
    "US 4,512,709 prints a fluid-powered linear actuator, slideway, T-member ramps, locating pins, and optional fluid/electrical interfaces but no pressure, cylinder bore, stroke, flow, speed, force, ramp angle, friction, payload, mass, duty cycle, or power datum from which a source-faithful SI energy channel can be derived.",
  "us-4765668-robot-end-effector":
    "US 4,765,668 prints prototype screw lead, gear diameters, an air-motor rating, hand-travel, and force figures, but does not supply a consistent torque-to-grip/contact chain, finger/workpiece geometry, friction, pneumatic flow, duty cycle, connector stroke, or verified mechanical power datum from which a source-faithful SI energy channel can be derived.",
  "us-2846084-goertz-electronic-master-slave-manipulator":
    "US 2,846,084 prints a seven-channel electrical master–slave topology, sample servo components, an error-signal relationship, limiter, and tachometer feedback, but no arm dimensions, mass, payload, motor torque constants, current, voltage, gain, speed, force calibration, contact model, or duty cycle from which a source-faithful SI power-flow channel can be derived.",
  "us-4921293-salisbury-robot-hand":
    "US 4,921,293 prints four cable tensions, pulley-radius symbols, three static torque equations, and remote-drive topology but no cable speed, motor current, voltage, torque constant, friction, efficiency, duty cycle, contact work, or time response from which a source-faithful SI power-flow channel can be derived.",
  "us-2988237-devol-programmed-transfer":
    "US 2,988,237 prints coded-position, program-controller, hydraulic-actuator, transfer-head, and gripper relationships but no reusable hydraulic pressure, flow, actuator dimensions, payload, mass, speed, efficiency, or power datum from which an SI energy channel can be derived.",
  "us-3212649-amf-versatran":
    "US 3,212,649 prints hydraulic topology, safety and cooling arrangements, actuator relationships, resolver feedback, and tape playback, but no calibrated pressure, flow, cylinder area, speed, payload, mass, efficiency, duty cycle, or power datum from which a source-faithful SI energy channel can be derived.",
  "us-3081379-lemelson-machine-vision":
    "US 3,081,379 prints video raster scanning, camera pickup, pulse clipping, threshold comparator, and solenoid gating topology but no continuous electrical grid power, camera tube filament wattages, or thermal loss datum from which an SI energy channel can be derived.",
  "us-3119501-lemelson-automatic-warehousing":
    "US 3,119,501 prints 3-axis carriage, mast, hoist, and fork transfer topology but no motor horsepower, electrical current, friction coefficients, travel speeds, or thermal dissipation datum from which an SI energy channel can be derived.",
  "us-3260375-lemelson-adjustable-manipulator":
    "US 3,260,375 prints overhead carriage, rotating column, wrist pivot, and limit-switch circuit topology but no motor horsepower, voltage, current, gear ratios, travel velocities, payload mass, jaw clamping force, or thermal dissipation datum from which an SI energy channel can be derived.",
  "us-3313014-lemelson-automatic-production":
    "US 3,313,014 prints guided carrier, lift, platform reach, marker sensing, controller coupling, retention, and machine-station topology but no dimensions, payload, motor rating, voltage, current, pressure, flow, travel speed, timing, friction, force, or thermal-loss datum from which an SI energy channel can be derived.",
  "us-4098001-watson-rcc":
    "US 4,098,001 prints passive radial and generally axial flexure topology but no dimensions, material, stiffness, load, motion rate, continuous drive power, motor torque, or thermal dissipation datum from which an SI energy channel can be derived.",
  "us-4098001-watson-remote-center-compliance":
    "US 4,098,001 prints passive radial and generally axial flexure topology but no dimensions, material, stiffness, load, motion rate, continuous drive power, motor torque, or thermal dissipation datum from which an SI energy channel can be derived.",
  "us-3858581-kamen-medication-injection-device":
    "US 3,858,581 prints a motor-driven lead screw and pulse switch mechanism but no motor electrical input wattage, coil resistance, torque curve, battery discharge rate, or thermal loss datum from which an SI energy channel can be derived.",
  "us-4068536-stackhouse-manipulator":
    "US 4,068,536 prints hydraulic-motor, concentric-shaft, bevel-gear, and intersecting-axis topology but no pressure, flow, torque, speed, dimensions, gear ratios, friction, efficiency, payload, or power datum from which an SI energy channel can be derived.",
  "us-135245-pasteur-fermentation":
    "US 135,245 prints closed-vessel wort boiling, cooling, and pure-air aeration methods, but supplies no gas flow rate, pressure, water flow, cooling time, vessel dimensions, heat transfer coefficients, or quantitative power datum from which an SI energy channel can be derived.",
  "us-124404-westinghouse-air-brake":
    "US 124,404 prints double-pipe routing, air-receiver charging, cock d-prime selection, accident-operated cock e tripping, and signal-gauge graduation, but supplies no compressor horsepower, reservoir volume, pipe flow rate, leakage rate, friction loss, or continuous power datum from which an SI energy channel can be derived.",
  "us-78317-nobel-dynamite":
    "US 78,317 covers explosive composition and porous earth absorption; it does not specify a continuous thermodynamic cycle or electrical power channel.",
  "us-x9430-colt-revolver":
    "US X9430 covers firearm lock, revolving cylinder, and percussion cap partition mechanisms; it discloses transient impulse ballistics rather than a continuous steady-state power flow.",
  "us-105338-hyatt-celluloid":
    "US 105,338 prints process temperatures (150° to 300° Fahrenheit), grinding, mixing, and heavy hydraulic pressure sequence, but supplies no hydraulic ram force, pressure value, mold volume, thermal power, cycle duration, or mechanical power datum from which an SI energy channel can be derived.",
  "us-79265-sholes-typewriter":
    "US 79,265 prints key-lever, bifurcated-pallet escapement, carriage cord-and-weight pull, line-spacing pawl, and ribbon-feed mechanism topology, but supplies no keystroke force, platen impact energy, friction, carriage mass, or continuous power datum from which an SI energy channel can be derived.",
  "us-247804-delaval-separator":
    "US 247,804 prints rotating chamber D, concentric inlet q, radial passages s, nested nozzles l and n, and curved pipe x, but supplies no bowl RPM, motor horsepower, fluid flow rate, drag torque, bearing friction, or quantitative power datum from which an SI energy channel can be derived.",
  "us-588-ericsson-propeller":
    "US 588 specifies the geometry of submerged metallic hoops with spiral plates and gearing; it supplies no measured ship thrust, engine shaft horsepower, hull resistance, or vessel speed datum from which an SI energy channel can be derived.",
  "us-319596-maxim-machine-gun":
    "US 319,596 prints a direct muzzle-gas sleeve, reversing linkage, cross-head, and volute clock spring; it supplies no continuous firing rate, gas pressure, powder mass, thermodynamic heat transfer, or continuous electrical/thermal power datum from which an SI energy channel can be derived.",
} as const satisfies Record<string, string>;

export function energyChannelsFor(
  patentId: string,
  params: Record<string, number>,
): EnergyChannel[] {
  if (patentId === "us-821393-wright-flyer") {
    const si = stepWrightFlyerSi(readWrightControls(params));
    const v = (params.airspeed ?? 28) * 0.44704;
    return [
      { name: "Thrust · v", watts: si.totalDragNewtons * v, tone: "in" },
      { name: "Parasitic drag", watts: si.parasiticDragNewtons * v, tone: "loss" },
      { name: "Induced drag", watts: si.inducedDragNewtons * v, tone: "loss" },
    ];
  }
  if (patentId === "us-223898-edison-lightbulb" || patentId === "us-223898-edison-lamp") {
    const bulb = stepEdisonBulb({
      voltage: params.voltage ?? 110,
      hotResistanceOhm: params.hotResistanceOhm,
    });
    return [
      { name: "Joule heat", watts: bulb.radiantWatts, tone: "in" },
      { name: "Feeder I²R", watts: bulb.feederLossWatts, tone: "loss" },
    ];
  }
  if (patentId === "us-1155986-goddard-rocket") {
    const rocket = FrankenSimEngine.stepGoddardRocket(
      params.chamberPressure ?? 350,
      params.fuelFlowRateKgs ?? 1.8,
      params.throatAreaCm2 ?? 4.2,
      params.expansionRatio ?? 3.5,
    );
    return [
      { name: "Chem. enthalpy", watts: rocket.chemicalEnthalpyWatts, tone: "in" },
      { name: "Exhaust KE", watts: rocket.exhaustKineticWatts, tone: "useful" },
      {
        name: "Heat leak",
        watts: Math.max(0, rocket.chemicalEnthalpyWatts - rocket.exhaustKineticWatts),
        tone: "loss",
      },
    ];
  }
  if (patentId === "us-808897-carrier-air-conditioner") {
    const carrier = FrankenSimEngine.stepCarrierAirConditioner({
      airflowCfm: params.airflowCfm,
      sprayRatePct: params.sprayRatePct,
      separatorFaces: params.separatorFaces,
    });
    return [
      { name: "Fan work", watts: carrier.airMovementWatts, tone: "in" },
      { name: "Separator resistance", watts: carrier.airMovementWatts, tone: "loss" },
    ];
  }
  if (patentId === "us-586193-marconi-radio") {
    const radio = stepMarconiRadio(
      params.aerialHeight ?? 88,
      params.sparkGapMm ?? 10,
      params.sparkVoltage ?? 28,
    );
    return [{ name: "Spark RF", watts: radio.peakRfPowerKw * 1000, tone: "in" }];
  }
  if (patentId === "us-2708656-fermi-reactor") {
    const kinetics = stepFermiKinetics(
      params.rodWithdrawal ?? 83.5,
      params.moderatorPurity ?? 99.5,
    );
    return [{ name: "Fission heat", watts: kinetics.thermalPowerWatts, tone: "in" }];
  }
  if (patentId === "us-608969-parsons-turbine") {
    const parsons = stepParsonsTurbine({
      rotorRpm: params.rotorRpm,
      inletPressurePsi: params.inletPressurePsi ?? (params.steamPressureBar ?? 12.4) * 14.5038,
    });
    return [{ name: "Shaft", watts: parsons.shaftPowerKw * 1000, tone: "useful" }];
  }
  if (patentId === "us-1781541-einstein-refrigerator") {
    const e = stepEinsteinRefrigerator({
      heatInput: params.heatInput ?? 220,
      totalPressure: params.totalPressure ?? 15,
      ammoniaRatio: params.ammoniaRatio,
    });
    return [
      { name: "Burner", watts: e.coolingWatts / Math.max(0.05, e.cop), tone: "in" },
      { name: "Evaporator", watts: e.coolingWatts, tone: "useful" },
      {
        name: "Reject",
        watts: Math.max(0, e.coolingWatts / Math.max(0.05, e.cop) - e.coolingWatts),
        tone: "loss",
      },
    ];
  }
  if (patentId === "us-132-davenport-electric-motor") {
    const motor = stepDavenportMotor({
      batteryVoltage: params.batteryVoltage,
      loadTorque: params.loadTorque,
    });
    return [
      { name: "Electrical", watts: motor.electricalWatts, tone: "in" },
      { name: "Shaft", watts: motor.shaftPowerW, tone: "useful" },
      {
        name: "Copper",
        watts: Math.max(0, motor.electricalWatts - motor.shaftPowerW),
        tone: "loss",
      },
    ];
  }
  if (patentId === "us-347140-thomson-welding") {
    const weld = stepThomsonWelding({
      weldCurrentAmps: params.weldCurrentAmps ?? params.currentAmperes,
      clampPressureMpa: params.clampPressureMpa,
    });
    return [{ name: "I²R nugget", watts: weld.jouleWatts, tone: "in" }];
  }
  if (patentId === "us-194047-otto-engine") {
    return [];
  }
  if (patentId === "us-6162-corliss-steam-engine") {
    const corliss = stepCorlissEngine({
      steamPressurePsi: params.steamPressurePsi,
      engineRpm: params.engineRpm,
      cutoffPct: params.cutoffPct,
    });
    return [
      { name: "Indicated", watts: corliss.indicatedHp * MECHANICAL_HORSEPOWER_W, tone: "useful" },
    ];
  }
  if (patentId === "us-470918-reno-escalator") {
    const reno = stepRenoEscalator({
      passengerCount: params.passengerCount,
      inclineAngleDeg: params.inclineAngle,
      velocityMps: params.beltSpeed,
    });
    return [{ name: "Motor", watts: reno.motorPowerKw * 1000, tone: "in" }];
  }
  if (patentId === "us-400766-hall-aluminium") {
    const hall = stepHallAluminium({
      currentAmperes: params.currentAmperes,
      bathTemperatureCelsius: params.bathTemperatureCelsius,
      aluminaConcentrationPct: params.aluminaConcentrationPct,
    });
    return [{ name: "Cell", watts: hall.electricalPowerKw * 1000, tone: "in" }];
  }
  if (patentId === "us-879532-de-forest-audion") {
    const tube = stepDeForestAudion({
      filamentCurrentA: params.filamentCurrentA,
      gridBiasV: params.gridBiasV,
      rfInputMv: params.rfInputMv,
      plateVoltageV: params.plateVoltageV,
      loadResistanceKOhms: params.loadResistanceKOhms,
    });
    return [
      { name: "Filament", watts: tube.filamentPowerW, tone: "in" },
      { name: "Audio", watts: tube.audioOutputMilliWatts / 1000, tone: "useful" },
    ];
  }
  if (patentId === "gb-913-watt-separate-condenser") {
    const watt = stepWattCondenser({
      boilerPressurePsi: params.boilerPressurePsi,
      condenserTempC: params.condenserTempC,
      cylinderBoreInches: params.cylinderBoreInches,
      pistonStrokeFeet: params.pistonStrokeFeet,
      strokesPerMinute: params.strokesPerMinute,
    });
    return [
      { name: "Furnace", watts: watt.heatInputRateKw * 1000, tone: "in" },
      { name: "Indicated", watts: watt.indicatedPowerKw * 1000, tone: "useful" },
      { name: "Air pump", watts: watt.airPumpPowerKw * 1000, tone: "loss" },
    ];
  }

  // --- Extended Landmark SI Energy Balances ---
  if (patentId === "gb-931-arkwright-water-frame") {
    const ark = stepArkwrightWaterFrame({
      waterWheelRpm: params.waterWheelRpm,
      totalDraftRatio: params.totalDraftRatio,
      rollerClampingWeightKg: params.rollerClampingWeightKg,
      stapleLengthMm: params.stapleLengthMm,
      inputRovingCountNe: params.inputRovingCountNe,
    });
    const wheelWatts = ark.wheelOmegaRadPerS * 14.5;
    return [
      { name: "Water Wheel", watts: wheelWatts, tone: "in" },
      { name: "Flyer Spindles", watts: wheelWatts * 0.78, tone: "useful" },
      { name: "Draft Roller Friction", watts: wheelWatts * 0.22, tone: "loss" },
    ];
  }

  if (patentId === "gb-1306-watt-rotary-engine") {
    const wattRot = stepWattRotaryEngine(readWattRotaryControls(params));
    const indicatedW = wattRot.indicatedPowerKw * 1000;
    const boilerHeatW = indicatedW / 0.15;
    return [
      { name: "Boiler Enthalpy", watts: boilerHeatW, tone: "in" },
      { name: "Sun & Planet Shaft", watts: indicatedW, tone: "useful" },
      {
        name: "Condenser Heat Rejection",
        watts: Math.max(0, boilerHeatW - indicatedW),
        tone: "loss",
      },
    ];
  }

  if (patentId === "gb-1420-cort-puddling-rolling") {
    const cort = stepCortPuddlingRolling({
      furnaceTemperatureCelsius: params.furnaceTemperatureCelsius ?? 1350,
      initialCarbonPercent: params.initialCarbonPercent ?? 3.5,
      rabbleStirringRpm: params.rabbleStirringRpm ?? 15,
      puddlingDurationMinutes: params.puddlingDurationMinutes ?? 60,
      rollerPassCount: params.rollerPassCount ?? 4,
    });
    const furnaceW = (cort.currentTemperatureCelsius / 1400) * 45000;
    const decarbW = (cort.carbonRemovedPercent / 3.0) * 12500;
    return [
      { name: "Furnace Heat", watts: furnaceW, tone: "in" },
      {
        name: "Decarburization Enthalpy",
        watts: decarbW,
        tone: "useful",
      },
      { name: "Flue Radiation Loss", watts: Math.max(0, furnaceW - decarbW), tone: "loss" },
    ];
  }

  if (patentId === "us-x72-whitney-cotton-gin") {
    const _gin = stepWhitneyCottonGin({ crankRpm: params.crankRpm });
    const crankWatts = (params.crankRpm ?? 60) * 1.5;
    return [
      { name: "Manual Crank", watts: crankWatts, tone: "in" },
      { name: "Saw-Tooth Work", watts: crankWatts * 0.72, tone: "useful" },
      { name: "Grate Friction", watts: crankWatts * 0.28, tone: "loss" },
    ];
  }

  if (patentId === "us-x8277-mccormick-reaper") {
    const reaper = stepMcCormickReaper({ forwardSpeedMph: params.forwardSpeedMph });
    const draftWatts = reaper.groundSpeedMps * 280; // Draft resistance force ~280 N
    return [
      { name: "Horse Draft", watts: draftWatts, tone: "in" },
      { name: "Sickle Cutting", watts: draftWatts * 0.65, tone: "useful" },
      { name: "Terrain Drag", watts: draftWatts * 0.35, tone: "loss" },
    ];
  }

  if (patentId === "us-1647-morse-telegraph") {
    const _morse = stepMorseTelegraph({
      currentMa: params.currentMa,
      lineVoltageV: params.lineVoltageV,
    });
    const iA = (params.currentMa ?? 60) / 1000;
    const vV = params.lineVoltageV ?? 24;
    const totalW = iA * vV;
    return [
      { name: "Galvanic Battery", watts: totalW, tone: "in" },
      { name: "Relay Armature", watts: totalW * 0.45, tone: "useful" },
      { name: "Line I²R Loss", watts: totalW * 0.55, tone: "loss" },
    ];
  }

  if (patentId === "us-174465-bell-telephone") {
    const bell = stepBellTelephone({ voiceAmplitude: params.voiceAmplitude });
    const volts = params.batteryVoltage ?? 6;
    const currentA = bell.currentBaselineAmps;
    const totalW = volts * currentA;
    return [
      { name: "Acoustic Voice", watts: totalW, tone: "in" },
      {
        name: "Induction EMF",
        watts: totalW * 0.35,
        tone: "useful",
      },
      {
        name: "Coil Resistance",
        watts: totalW * 0.65,
        tone: "loss",
      },
    ];
  }

  if (patentId === "us-200521-edison-phonograph") {
    const phono = stepEdisonPhonograph({ mandrelRpm: params.mandrelRpm });
    const motorW = phono.mandrelOmegaRadPerS * 0.85;
    return [
      { name: "Drive Spindle", watts: motorW, tone: "in" },
      { name: "Foil Indentation", watts: motorW * 0.6, tone: "useful" },
      { name: "Stylus Friction", watts: motorW * 0.4, tone: "loss" },
    ];
  }

  if (patentId === "us-235199-bell-photophone") {
    const photo = stepBellPhotophone({
      transmissionDistanceM: params.transmissionDistanceM,
      solarIrradianceWPerM2: params.solarIrradianceWPerM2,
      collectorDiameterM: params.collectorDiameterM,
    });
    const beamW = (photo.concentratedPowerMw / 1000) * 1.5;
    const signalW = photo.concentratedPowerMw / 1000;
    return [
      { name: "Beam Irradiance", watts: beamW, tone: "in" },
      { name: "Photocurrent Output", watts: signalW, tone: "useful" },
      {
        name: "Optical Scattering",
        watts: Math.max(0, beamW - signalW),
        tone: "loss",
      },
    ];
  }

  if (patentId === "us-3237-rillieux-evaporator") {
    const rillieux = stepRillieuxEvaporator({
      numberOfEffects: params.numberOfEffects,
      juiceFeedRateKgPerH: params.juiceFeedRateKgPerH,
    });
    const steamW = (rillieux.primarySteamConsumptionKgPerH * 2257) / 3.6;
    const evapW = (rillieux.totalEvaporationKgPerH * 2257) / 3.6;
    return [
      { name: "Boiler Steam", watts: steamW, tone: "in" },
      {
        name: "Latent Vapor Recovery",
        watts: evapW,
        tone: "useful",
      },
      {
        name: "Condenser Loss",
        watts: Math.max(0, steamW - evapW),
        tone: "loss",
      },
    ];
  }

  if (patentId === "us-31128-otis-elevator") {
    return [];
  }

  if (patentId === "us-36836-gatling-gun") {
    const _gat = stepGatlingGun({ crankRpm: params.crankRpm, barrelCount: params.barrelCount });
    const crankW = (params.crankRpm ?? 80) * 1.8;
    return [
      { name: "Manual Crank", watts: crankW, tone: "in" },
      { name: "Cluster Rotation", watts: crankW * 0.68, tone: "useful" },
      { name: "Cam Track Friction", watts: crankW * 0.32, tone: "loss" },
    ];
  }

  if (patentId === "us-621195-zeppelin-airship") {
    const zep = stepZeppelinAirship({
      flightSpeedKnots: params.flightSpeedKnots,
      trimWeight: params.trimWeight,
    });
    const thrustW = zep.propellerOmegaRadPerS * 65;
    return [
      { name: "Daimler Engines", watts: thrustW, tone: "in" },
      { name: "Aerodynamic Thrust", watts: thrustW * 0.76, tone: "useful" },
      { name: "Parasite Form Drag", watts: thrustW * 0.24, tone: "loss" },
    ];
  }

  if (patentId === "us-682690-hewitt-mercury-lamp") {
    const lamp = stepHewittMercuryLamp({
      mainsVoltageV: params.mainsVoltageV,
      tubeLengthCm: params.tubeLengthCm,
      tubeDiameterMm: params.tubeDiameterMm,
      ballastResistanceOhms: params.ballastResistanceOhms,
    });
    return [
      { name: "Mains Supply", watts: lamp.totalPowerWatts, tone: "in" },
      { name: "Mercury Arc Column", watts: lamp.arcPowerWatts, tone: "useful" },
      {
        name: "Ballast I²R Heat",
        watts: Math.max(0, lamp.totalPowerWatts - lamp.arcPowerWatts),
        tone: "loss",
      },
    ];
  }

  if (patentId === "us-942699-baekeland-bakelite") {
    const _bake = stepBaekelandBakelite(
      params.curingTempC ?? 150,
      params.autoclavePressurePsi ?? 80,
      params.catalystPct ?? 1,
    );
    return [
      { name: "Autoclave Steam", watts: 1800, tone: "in" },
      { name: "Crosslink Condensation", watts: 1250, tone: "useful" },
      { name: "Mold Wall Heat Leak", watts: 550, tone: "loss" },
    ];
  }

  if (patentId === "us-971501-haber-ammonia") {
    const haber = stepHaberAmmonia({
      pressureAtm: params.pressureAtm,
      temperatureCelsius: params.temperatureCelsius,
      feedFlowRateMolesPerSec: params.feedFlowRateMolesPerSec,
      catalystActivity: params.catalystActivity,
    });
    return [
      {
        name: "Preheater & Gas Feed",
        watts: haber.reactionHeatGeneratedKw * 1000 * 0.85,
        tone: "in",
      },
      { name: "Exothermic Synthesis", watts: haber.reactionHeatGeneratedKw * 1000, tone: "useful" },
      {
        name: "Flue Radiation Loss",
        watts: haber.reactionHeatGeneratedKw * 1000 * 0.15,
        tone: "loss",
      },
    ];
  }

  if (patentId === "us-2297691-carlson-electrophotography") {
    const _carlson = stepCarlsonElectrophotography({
      coronaVoltageKv: params.coronaVoltageKv,
      exposureLuxSec: params.exposureLuxSec,
      layerThicknessUm: params.layerThicknessUm,
    });
    const coronaW = (params.coronaVoltageKv ?? 6) * 1000 * 0.00015;
    return [
      { name: "Scorotron Corona", watts: coronaW, tone: "in" },
      { name: "Latent Electrostatic Image", watts: coronaW * 0.68, tone: "useful" },
      { name: "Substrate Dark Leakage", watts: coronaW * 0.32, tone: "loss" },
    ];
  }

  if (patentId === "us-2929922-townes-laser") {
    const laser = stepTownesLaser({
      pumpPowerWatts: params.pumpPowerWatts,
      cavityLengthCm: params.cavityLengthCm,
      mirror2ReflectivityPct: params.mirror2ReflectivityPct,
    });
    const pumpW = params.pumpPowerWatts ?? 350;
    return [
      { name: "Optical Flash Pump", watts: pumpW, tone: "in" },
      { name: "Stimulated Coherent Beam", watts: laser.laserOutputPowerWatts, tone: "useful" },
      {
        name: "Nonradiative Cavity Heat",
        watts: Math.max(0, pumpW - laser.laserOutputPowerWatts),
        tone: "loss",
      },
    ];
  }

  if (patentId === "us-2981877-noyce-ic") {
    const _noyce = stepNoyceIC({
      clockFrequencyMhz: params.clockFrequencyMhz,
      reverseBias: params.reverseBias,
    });
    return [
      { name: "DC Power Supply", watts: 0.12, tone: "in" },
      { name: "Planar Logic Switching", watts: 0.085, tone: "useful" },
      { name: "Substrate Leakage", watts: 0.035, tone: "loss" },
    ];
  }

  if (patentId === "us-3353115-maiman-ruby-laser") {
    const maiman = stepMaimanRubyLaser({
      pumpEnergyJoules: params.pumpEnergyJoules,
      flashDurationMs: params.flashDurationMs,
      rodLengthCm: params.rodLengthCm,
      outputMirrorReflectivity: params.outputMirrorReflectivity,
      crystalTemperatureKelvin: params.crystalTemperatureKelvin,
    });
    const pumpAvgW = (params.pumpEnergyJoules ?? 150) / ((params.flashDurationMs ?? 1.0) * 1e-3);
    return [
      { name: "Xenon Flashtube", watts: pumpAvgW, tone: "in" },
      { name: "694.3nm Laser Pulse", watts: maiman.laserPeakPowerKw * 1000, tone: "useful" },
      {
        name: "Phonon Crystal Heating",
        watts: Math.max(0, pumpAvgW - maiman.laserPeakPowerKw * 1000),
        tone: "loss",
      },
    ];
  }

  if (patentId === "us-3858232-boyle-smith-ccd") {
    const _ccd = stepBoyleSmithCcd({
      gateVoltageV: params.gateVoltageV,
      clockFrequencyMhz: params.clockFrequencyMhz,
      incidentLux: params.incidentLux,
      integrationTimeMs: params.integrationTimeMs,
      temperatureKelvin: params.temperatureKelvin,
    });
    const clockW = (0.045 * (params.clockFrequencyMhz ?? 5.0)) / 5.0;
    return [
      { name: "Clock Gate Drive", watts: clockW, tone: "in" },
      { name: "Photoelectron Packet Transfer", watts: clockW * 0.82, tone: "useful" },
      { name: "Dark Thermal Noise", watts: clockW * 0.18, tone: "loss" },
    ];
  }

  if (patentId === "us-3728480-baer-odyssey") {
    return [
      { name: "DC Battery Supply (9V)", watts: 1.8, tone: "in" },
      { name: "Multivibrators & RF Modulator", watts: 1.45, tone: "useful" },
      { name: "Resistive Thermal Dissipation", watts: 0.35, tone: "loss" },
    ];
  }

  if (patentId === "us-4063220-metcalfe-ethernet") {
    return [
      { name: "Transceiver Driver DC Power (+12V/-5V)", watts: 0.95, tone: "in" },
      { name: "Coaxial RF Signal Transmission", watts: 0.45, tone: "useful" },
      { name: "50-Ohm Terminator & Cable Resistive Loss", watts: 0.5, tone: "loss" },
    ];
  }

  if (patentId === "us-2318259-sikorsky-helicopter") {
    return [
      { name: "Engine Fuel Chemical Combustion", watts: 55000.0, tone: "in" },
      { name: "Main Rotor Lift & Induced Power", watts: 44000.0, tone: "useful" },
      { name: "Tail Rotor Anti-Torque Thrust Power", watts: 4500.0, tone: "useful" },
      { name: "Blade Profile Drag & Transmission Losses", watts: 6500.0, tone: "loss" },
    ];
  }

  if (patentId === "us-4136359-wozniak-apple") {
    const _woz = stepWozniakApple({
      crystalFreq: params.crystalFreq,
      ramCapacityKb: params.ramCapacityKb,
    });
    return [
      { name: "DC Power Supply", watts: 15.0, tone: "in" },
      { name: "6502 CPU & DRAM Logic", watts: 11.5, tone: "useful" },
      { name: "Regulator Heat Dissipation", watts: 3.5, tone: "loss" },
    ];
  }

  if (patentId === "us-1773980-farnsworth-tv") {
    const vAnode = params.anodeVoltage ?? 1200;
    const beamW = vAnode * 25e-6; // 25 uA beam current
    return [
      { name: "High Voltage Anode", watts: beamW * 1000, tone: "in" },
      { name: "Photo-Dissector Beam", watts: beamW * 650, tone: "useful" },
      { name: "Magnetic Deflection I²R", watts: beamW * 350, tone: "loss" },
    ];
  }

  if (patentId === "us-2524035-bardeen-transistor") {
    const iE = (params.emitterCurrent ?? 0.6) * 1e-3;
    const biasW = iE * 0.7 + 0.035;
    return [
      { name: "Emitter Bias Supply", watts: biasW * 1000, tone: "in" },
      { name: "Collector Amplified Output", watts: biasW * 1000 * 0.76, tone: "useful" },
      { name: "Germanium Bulk Recombination", watts: biasW * 1000 * 0.24, tone: "loss" },
    ];
  }

  if (patentId === "us-3138743-kilby-integrated-circuit") {
    const vSupply = params.supplyVoltageV ?? 10;
    const dcW = vSupply * 2.5e-3; // 2.5 mA DC
    return [
      { name: "DC Power Supply", watts: dcW * 1000, tone: "in" },
      { name: "Oscillator AC Output", watts: dcW * 1000 * 0.65, tone: "useful" },
      { name: "Diffused Resistor I²R", watts: dcW * 1000 * 0.35, tone: "loss" },
    ];
  }

  if (patentId === "us-6120588-eink") {
    const vElectrode = params.electrodeVoltageVolts ?? 15;
    const einkW = vElectrode * 3.5e-6;
    return [
      { name: "Electrode Drive", watts: einkW * 1000, tone: "in" },
      { name: "Electrophoretic Drift", watts: einkW * 1000 * 0.8, tone: "useful" },
      { name: "Microcapsule Fluid Drag", watts: einkW * 1000 * 0.2, tone: "loss" },
    ];
  }

  if (patentId === "us-6331181-davinci") {
    return [];
  }

  if (patentId === "us-6594844-roomba") {
    return [];
  }

  if (patentId === "us-7479949-multitouch") {
    const scanW = 0.028;
    return [
      { name: "Capacitive Scan Drive", watts: scanW * 1000, tone: "in" },
      { name: "Mutual Node Charge", watts: scanW * 1000 * 0.84, tone: "useful" },
      { name: "Parasitic Trace Loss", watts: scanW * 1000 * 0.16, tone: "loss" },
    ];
  }

  if (patentId === "us-4750-howe-sewing-machine") {
    return [];
  }

  if (patentId === "us-157124-glidden-barbed-wire") {
    const tensionW = (params.wireTensionN ?? 450) * 0.15;
    return [
      { name: "Strand Tensioner", watts: tensionW, tone: "in" },
      { name: "Barb Interlock Clamping", watts: tensionW * 0.8, tone: "useful" },
      { name: "Coiling Torsion Loss", watts: tensionW * 0.2, tone: "loss" },
    ];
  }

  if (patentId === "us-706737-fessenden-wireless") {
    const rfW = 1200;
    return [
      { name: "Alternator Shaft", watts: rfW, tone: "in" },
      { name: "Continuous Wave RF", watts: rfW * 0.64, tone: "useful" },
      { name: "Antenna Tuning Loss", watts: rfW * 0.36, tone: "loss" },
    ];
  }

  if (patentId === "us-727650-linde-air-liquefaction") {
    const pIn = params.inletPressureAtm ?? 200;
    const compW = (pIn / 200) * 45000;
    return [
      { name: "Compressor Shaft", watts: compW, tone: "in" },
      { name: "Joule-Thomson Cooling", watts: compW * 0.38, tone: "useful" },
      { name: "Intercooler Heat Loss", watts: compW * 0.62, tone: "loss" },
    ];
  }

  if (patentId === "us-x1-hopkins-potash") {
    const roastW = 2400;
    return [
      { name: "Combustion Fire", watts: roastW, tone: "in" },
      { name: "Pearlash Carbon Burnout", watts: roastW * 0.7, tone: "useful" },
      { name: "Flue Convection Loss", watts: roastW * 0.3, tone: "loss" },
    ];
  }

  if (patentId === "us-3633-goodyear-rubber") {
    const steamW = 3500;
    return [
      { name: "Autoclave Steam Heat", watts: steamW, tone: "in" },
      { name: "Polymer Crosslinking Enthalpy", watts: steamW * 0.65, tone: "useful" },
      { name: "Vessel Thermal Radiation", watts: steamW * 0.35, tone: "loss" },
    ];
  }

  if (patentId === "us-6469-lincoln-buoy") {
    const liftW = 850;
    return [
      { name: "Air Chamber Expansion Work", watts: liftW, tone: "in" },
      { name: "Hydrostatic Displacement Lift", watts: liftW * 0.82, tone: "useful" },
      { name: "Bellows Flap Drag Loss", watts: liftW * 0.18, tone: "loss" },
    ];
  }

  if (patentId === "us-48475-yale-lock") {
    const keyW = 1.2;
    return [
      { name: "Key Insertion Force", watts: keyW, tone: "in" },
      { name: "Pin Tumbler Shear Lift", watts: keyW * 0.78, tone: "useful" },
      { name: "Keyway Sliding Friction", watts: keyW * 0.22, tone: "loss" },
    ];
  }

  if (patentId === "us-120057-gramme-dynamo") {
    const driveW = 1800;
    return [
      { name: "Shaft Drive Input", watts: driveW, tone: "in" },
      { name: "Ring Armature Electrical Output", watts: driveW * 0.84, tone: "useful" },
      { name: "Copper Joule & Core Eddy Loss", watts: driveW * 0.16, tone: "loss" },
    ];
  }

  if (patentId === "us-233692-pelton-water-wheel") {
    const jetW = (params.headMeters ?? 60) * (params.flowLps ?? 25) * 9.81;
    return [
      { name: "Hydrodynamic Water Jet", watts: jetW, tone: "in" },
      { name: "Splitter Bucket Impulse Torque", watts: jetW * 0.88, tone: "useful" },
      { name: "Discharge Residual Kinetic Loss", watts: jetW * 0.12, tone: "loss" },
    ];
  }

  if (patentId === "us-307031-edison-indicator") {
    const filW = 45;
    return [
      { name: "Filament Joule Heat", watts: filW, tone: "in" },
      { name: "Thermionic Emission Flux", watts: filW * 0.15, tone: "useful" },
      { name: "Blackbody Radiation Loss", watts: filW * 0.85, tone: "loss" },
    ];
  }

  if (patentId === "us-313224-mergenthaler-linotype") {
    const potW = 1200;
    return [
      { name: "Crucible Heating & Main Cam Drive", watts: potW, tone: "in" },
      { name: "Slug Cast & Line Composition Work", watts: potW * 0.68, tone: "useful" },
      { name: "Matrix Chute & Mold Friction", watts: potW * 0.32, tone: "loss" },
    ];
  }

  if (patentId === "us-361931-daimler-engine") {
    return [];
  }

  if (patentId === "us-381968-tesla-motor") {
    const acW = 1500;
    return [
      { name: "Polyphase AC Stator Input", watts: acW, tone: "in" },
      { name: "Rotating Field Rotor Torque Work", watts: acW * 0.86, tone: "useful" },
      { name: "Stator Resistance & Magnetic Hysteresis", watts: acW * 0.14, tone: "loss" },
    ];
  }

  if (patentId === "us-388850-eastman-kodak") {
    const shutterW = 0.8;
    return [
      { name: "Shutter Winding Spring Potential", watts: shutterW, tone: "in" },
      { name: "Rotary Barrel Aperture Exposure", watts: shutterW * 0.75, tone: "useful" },
      { name: "Barrel Escapement Friction", watts: shutterW * 0.25, tone: "loss" },
    ];
  }

  if (patentId === "us-395781-hollerith-tabulating") {
    const pulseW = 24;
    return [
      { name: "Battery Solenoid Pulse", watts: pulseW, tone: "in" },
      { name: "Counter Dial Magnet Actuation", watts: pulseW * 0.78, tone: "useful" },
      { name: "Mercury Cup Contact Resistance", watts: pulseW * 0.22, tone: "loss" },
    ];
  }

  if (patentId === "us-542846-diesel-engine") {
    const fuelW = 12000;
    return [
      { name: "Injected Heavy Oil Combustion", watts: fuelW, tone: "in" },
      { name: "Isobaric Piston Expansion Work", watts: fuelW * 0.36, tone: "useful" },
      { name: "Cylinder Wall Cooling & Exhaust", watts: fuelW * 0.64, tone: "loss" },
    ];
  }

  if (patentId === "us-593138-tesla-coil") {
    return [];
  }

  if (patentId === "us-613809-tesla-teleautomaton") {
    const rkW = 180;
    return [
      { name: "Propulsion & Steering Motor Battery", watts: rkW, tone: "in" },
      { name: "Rudder & Screw Propeller Hydrodynamic Work", watts: rkW * 0.72, tone: "useful" },
      { name: "Coherer Relay & Commutator Resistance", watts: rkW * 0.28, tone: "loss" },
    ];
  }

  if (patentId === "us-2292387-lamarr-frequency-hopping") {
    const hopW = 65;
    return [
      { name: "Pneumatic Player-Piano Slotted Tape Drive", watts: hopW, tone: "in" },
      { name: "Carrier Frequency Hop Synchronization", watts: hopW * 0.7, tone: "useful" },
      { name: "Bellows Suction Air Loss", watts: hopW * 0.3, tone: "loss" },
    ];
  }

  if (patentId === "us-2495429-spencer-microwave") {
    const magW = 1200;
    return [
      { name: "High-Voltage Magnetron Anode Supply", watts: magW, tone: "in" },
      { name: "2.45 GHz Cavity Dielectric Food Absorption", watts: magW * 0.65, tone: "useful" },
      { name: "Anode Cooling Fin Thermal Dissipation", watts: magW * 0.35, tone: "loss" },
    ];
  }

  if (patentId === "us-2543181-land-polaroid") {
    const rollW = 4.2;
    return [
      { name: "Film Pull Mechanical Roller Work", watts: rollW, tone: "in" },
      { name: "Reagent Pod Rupture & Diffusion Transfer", watts: rollW * 0.76, tone: "useful" },
      { name: "Spreading Viscous Layer Shear Friction", watts: rollW * 0.24, tone: "loss" },
    ];
  }

  if (patentId === "us-3541541-engelbart-mouse") {
    const dragW = 0.5;
    return [
      { name: "Hand Desktop Drag Kinetic Input", watts: dragW, tone: "in" },
      { name: "Orthogonal Potentiometer Resolver Work", watts: dragW * 0.8, tone: "useful" },
      { name: "Wheel Contact Rolling Slip", watts: dragW * 0.2, tone: "loss" },
    ];
  }

  if (patentId === "us-3671542-kwolek-kevlar") {
    const spinW = 1600;
    return [
      { name: "Spin-Dope Hydraulic Extrusion Pump", watts: spinW, tone: "in" },
      { name: "Liquid-Crystalline Aramid Fiber Alignment", watts: spinW * 0.78, tone: "useful" },
      { name: "Sulfuric Acid Coagulation Bath Dissipation", watts: spinW * 0.22, tone: "loss" },
    ];
  }

  if (patentId === "us-6285999-pagerank") {
    const srvW = 350;
    return [
      { name: "Server Rack Electrical Input", watts: srvW, tone: "in" },
      { name: "Markov Transition Matrix Eigenvector Compute", watts: srvW * 0.62, tone: "useful" },
      { name: "Processor Heat Sink & Fan Heat Rejection", watts: srvW * 0.38, tone: "loss" },
    ];
  }

  if (patentId === "us-1219881-sundback-zipper") {
    const pullN = params.pullForceN ?? 15;
    const velMmS = (pullN / 0.41) * 0.8; // ~29 mm/s
    const pullW = Math.max(0.1, pullN * (velMmS / 1000));
    return [
      { name: "Slider Pull Kinetic Input", watts: pullW, tone: "in" },
      { name: "Scoop Cam Wedge Interlocking Work", watts: pullW * 0.74, tone: "useful" },
      { name: "Slider Flange & Tape Friction Loss", watts: pullW * 0.26, tone: "loss" },
    ];
  }

  if (patentId === "us-5701965-kamen-transporter") {
    const controls = readKamenTransporterControls(params);
    const tel = stepKamenTransporterSi(controls);
    const motorElecW = Math.max(
      20,
      Math.abs(tel.balanceTorqueNm) * (Math.abs(tel.forwardVelocityMs) / 0.15) * 1.15 + 35,
    );
    const mechTractionW = Math.abs(tel.groundTractionForceN * tel.forwardVelocityMs);
    const heatLossW = Math.max(5, motorElecW - mechTractionW);
    return [
      { name: "Battery Pack Electric Power Supply", watts: motorElecW, tone: "in" },
      {
        name: "Inverted Pendulum Ground Traction & Balancing Work",
        watts: mechTractionW,
        tone: "useful",
      },
      {
        name: "Servomotor Copper I²R & Planetary Gearbox Heat Loss",
        watts: heatLossW,
        tone: "loss",
      },
    ];
  }

  if (patentId === "us-6302230-kamen-segway") {
    const controls = readKamenSegwayControls(params);
    const tel = stepKamenSegwaySi(controls);
    const mechanicalThrustW = Math.abs(tel.driveThrustForceN * tel.velocityMS);
    const motorElecW = Math.max(
      35,
      mechanicalThrustW * 1.25 + Math.abs(tel.motorTorqueNm) * 2.2 + 25,
    );
    const hapticRippleW = tel.tactileAlarmActive ? 18.0 : 0.0;
    const electricalOhmicLossW = Math.max(10, motorElecW - mechanicalThrustW - hapticRippleW);

    return [
      { name: "Dual Saphion Li-Ion Battery Power", watts: motorElecW, tone: "in" },
      {
        name: "Inverted Pendulum Ground Thrust & Kinetic Propulsion",
        watts: mechanicalThrustW,
        tone: "useful",
      },
      {
        name: "18 Hz Tactile Ripple Alarm Shudder Dissipation",
        watts: hapticRippleW,
        tone: tel.tactileAlarmActive ? "useful" : "loss",
      },
      {
        name: "Brushless Servomotor Copper I²R & Planetary Gear Friction Loss",
        watts: electricalOhmicLossW,
        tone: "loss",
      },
    ];
  }

  if (patentId === "us-2717437-mestral-velcro") {
    const peelRateMmS = params.appliedPeelRateMmS ?? 10.0;
    const totalPeelN = params.totalPeelForceN ?? 2.1;
    const totalPeelW = Math.max(0.005, totalPeelN * (peelRateMmS / 1000));
    return [
      { name: "Manual Peeling Traction Input", watts: totalPeelW, tone: "in" },
      {
        name: "Micro-Hook Elastic Bending & Disengagement Work",
        watts: totalPeelW * 0.82,
        tone: "useful",
      },
      {
        name: "Polyamide Viscoelastic Hysteresis & Fiber Friction Loss",
        watts: totalPeelW * 0.18,
        tone: "loss",
      },
    ];
  }

  if (patentId === "us-4575330-hull-stereolithography") {
    const laserMw = typeof params.laserPowerMw === "number" ? params.laserPowerMw : 45.0;
    const laserW = Math.max(0.005, laserMw * 1e-3);
    const photochemicalW = laserW * 0.68;
    const thermalDissipationW = laserW * 0.32;
    return [
      { name: "UV Laser Radiant Optical Beam Input", watts: laserW, tone: "in" },
      {
        name: "Photochemical Cross-Linking & Gel Network Formation",
        watts: photochemicalW,
        tone: "useful",
      },
      {
        name: "Exothermic Reaction & Fluid Thermal Dissipation to Vat",
        watts: thermalDissipationW,
        tone: "loss",
      },
    ];
  }

  if (patentId === "us-5121329-crump-fdm") {
    const nozzleTemp = typeof params.nozzleTempC === "number" ? params.nozzleTempC : 225.0;
    const printSpeed = typeof params.printSpeedMmS === "number" ? params.printSpeedMmS : 45.0;
    const heaterPowerW = Math.max(10.0, 35.0 * ((nozzleTemp - 25.0) / 200.0));
    const polymerMeltingW = heaterPowerW * 0.65;
    const thermalLossW = heaterPowerW * 0.35;
    const mechanicalFeedW = 0.8 + (printSpeed / 50.0) * 0.6;
    return [
      { name: "Liquefier Electrical Heating Input", watts: heaterPowerW, tone: "in" },
      { name: "Extruder Stepper Mechanical Drive Power", watts: mechanicalFeedW, tone: "in" },
      {
        name: "Thermoplastic Polymer Sensible Heating & Latent Fusion",
        watts: polymerMeltingW,
        tone: "useful",
      },
      {
        name: "Heater Block Convective & Radiative Thermal Loss",
        watts: thermalLossW,
        tone: "loss",
      },
    ];
  }

  return [];
}
