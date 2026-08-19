import type { EnergyChannel } from "@/components/patents/EnergyFlowStrip";
import {
  stepCorlissEngine,
  stepDaimlerEngine,
  stepDavenportMotor,
  stepEdisonBulb,
  stepEinsteinRefrigerator,
  stepMarconiRadio,
  stepOttoEngine,
  stepParsonsTurbine,
  stepPeltonWheel,
  stepThomsonWelding,
} from "./catalogKernels";

import { FrankenSimEngine } from "./engine";
import { stepFermiKinetics } from "./fermiKinetics";
import { readWrightControls, stepWrightFlyerSi } from "./wrightKernel";

/** Mechanical horsepower in watts. Used only to print an already-owned hp field. */
const MECHANICAL_HORSEPOWER_W = 745.7;

export function energyChannelsFor(
  patentId: string,
  params: Record<string, number>,
): EnergyChannel[] {
  if (patentId === "us-821393-wright-flyer") {
    const si = stepWrightFlyerSi(readWrightControls(params));
    const v = (params.airspeed ?? 28) * 0.44704;
    const powerInd = si.inducedDragNewtons * v;
    const powerLift = si.liftNewtons * v * 0.08;
    return [
      { name: "Thrust · v", watts: si.totalDragNewtons * v, tone: "in" },
      { name: "Lift work", watts: powerLift, tone: "useful" },
      { name: "Induced drag", watts: powerInd, tone: "loss" },
    ];
  }
  if (patentId === "us-223898-edison-lightbulb") {
    const bulb = stepEdisonBulb({
      voltage: params.voltage ?? 110,
      filamentLength: params.filamentLength,
    });
    const p = bulb.radiantWatts;
    const vis = p * Math.min(0.08, bulb.luminousLmPerW / 40);
    return [
      { name: "Joule heat", watts: p, tone: "in" },
      { name: "Visible", watts: vis, tone: "useful" },
      { name: "IR + cond.", watts: p - vis, tone: "loss" },
    ];
  }
  if (patentId === "us-1102653-goddard-rocket") {
    const rocket = FrankenSimEngine.stepGoddardRocket(
      params.chamberPressure ?? 350,
      params.fuelFlowRateKgs ?? 1.8,
      params.throatAreaCm2 ?? 4.2,
      params.expansionRatio ?? 3.5,
    );
    return [
      { name: "Chem. enthalpy", watts: rocket.chemicalEnthalpyWatts, tone: "in" },
      { name: "Exhaust KE", watts: rocket.exhaustKineticWatts, tone: "useful" },
    ];
  }
  if (patentId === "us-808897-carrier-air-conditioner") {
    const carrier = FrankenSimEngine.stepCarrierAirConditioner({
      inletTempC: params.inletTempC,
      inletRhPct: params.inletRhPct,
      sprayWaterTempC: params.sprayWaterTempC,
      reheatTempC: params.reheatTempC,
      airflowCfm: params.airflowCfm,
    });
    return [{ name: "Latent sink", watts: carrier.coolingWatts, tone: "useful" }];
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
  if (patentId === "us-3671542-kwolek-kevlar") {
    return [];
  }
  if (patentId === "us-2292387-lamarr-frequency-hopping") {
    return [];
  }
  if (patentId === "us-313224-mergenthaler-linotype") {
    return [];
  }
  if (patentId === "us-395781-hollerith-tabulating") {
    return [];
  }
  if (patentId === "us-542846-diesel-engine") {
    return [];
  }
  if (patentId === "us-3541541-engelbart-mouse") {
    return [];
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
  if (patentId === "us-381968-tesla-motor") {
    // US 381,968 gives apparatus relations but no source values for power,
    // current, or losses. Do not fabricate an energy-flow display.
    return [];
  }
  if (patentId === "us-593138-tesla-coil") {
    // The interpretive coil step owns kV, streamer length, and a 0–1 toneEnergy.
    // It does not own a watt.
    return [];
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
    const otto = stepOttoEngine({
      engineRpm: params.engineRpm,
      compressionRatio: params.compressionRatio,
    });
    return [
      { name: "Brake", watts: otto.brakeHorsepower * MECHANICAL_HORSEPOWER_W, tone: "useful" },
    ];
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
  if (patentId === "us-361931-daimler-engine") {
    const daimler = stepDaimlerEngine({
      engineRpm: params.engineRpm,
      hotTubeTempC: params.hotTubeTemp,
      differentialSlipAngleDeg: params.turnAngle,
    });
    return [
      { name: "Brake", watts: daimler.brakeHorsepower * MECHANICAL_HORSEPOWER_W, tone: "useful" },
    ];
  }
  if (patentId === "us-233692-pelton-water-wheel") {
    const pelton = stepPeltonWheel({
      headMeters: params.headMeters,
      runnerRpm: params.runnerRpm,
    });
    return [{ name: "Shaft", watts: pelton.shaftPowerKw * 1000, tone: "useful" }];
  }
  return [];
}
