/**
 * Rudolf Diesel Compression-Ignition Engine (US 542,846)
 * Extreme adiabatic compression & constant-pressure combustion.
 * Restored from c289cfe4 per owner directive 2026-08-22 (publish real models).
 */
import { dieselCamWindows, rpmToOmega } from "./catalogKernels";
import { cycleHeatCrate } from "./genericWasm";

export interface DieselEngineStepParams {
  compressionRatio?: number;
  blastAirPressureBar?: number;
  cutoffRatio?: number;
  engineRpm?: number;
}

export function stepDieselEngine(params: DieselEngineStepParams) {

    const r = params.compressionRatio ?? 18;
    const pBlast = params.blastAirPressureBar ?? 65;
    const rc = params.cutoffRatio ?? 1.6;
    const rpm = params.engineRpm ?? 150;
    const gamma = 1.4;
    const tIntakeK = 300;
    const tCompressionK = Math.round(tIntakeK * r ** (gamma - 1));
    const tCompressionC = tCompressionK - 273;
    const pCompBar = Number((1.0 * r ** gamma).toFixed(1));
    const idealEfficiencyPct = Number(
      ((1 - (1 / r ** (gamma - 1)) * ((rc ** gamma - 1) / (gamma * (rc - 1)))) * 100).toFixed(1),
    );
    const brakeEfficiencyPct = Number((idealEfficiencyPct * 0.68).toFixed(1));
    const isAutoIgnition = tCompressionC > 210 && pBlast > pCompBar;
    const crank = rpmToOmega(rpm);

    return {
      tCompressionC,
      pCompBar,
      idealEfficiencyPct,
      brakeEfficiencyPct,
      isAutoIgnition,
      engineRpm: rpm,
      ...cycleHeatCrate(r),
      crankOmegaRadPerS: crank.omegaRadPerS,
      crankOmegaDegPerS: crank.omegaDegPerS,
      governorBallSpread: Number(Math.min(1.4, Math.max(0.4, (rpm / 150) * 0.85)).toFixed(3)),
      pressureNeedleRadPerBar: Number(((Math.PI * 1.4) / 80).toFixed(5)),
      pistonStrokePx: 35,
      cycleWrapDeg: 720,
      crankWrapDeg: 360,
      cycleWrapRad: Math.PI * 4,
      injectionStartDeg: 355,
      injectionEndDeg: 390,
      ...dieselCamWindows(355, 390, 720, 0.5),
      compressionGlowStartDeg: 270,
      compressionGlowEndDeg: 450,
      crankCx: 300,
      crankCy: 260,
      rodOriginY0: 103,
      pistonSvgX: 235,
      pistonSvgY0: 75,
      gasChargeH0: 20,
      flywheelRimR: 65,
      flywheelHubR: 14,
      crankPinR: 7,
      schematicFlywheelCx: 200,
      schematicFlywheelCy: 240,
      schematicFlywheelR: 40,
      schematicCylinderX: 130,
      schematicCylinderY: 30,
      schematicCylinderW: 140,
      schematicCylinderH: 170,
      schematicInjectorX: 185,
      schematicInjectorY: 15,
      schematicInjectorW: 30,
      schematicInjectorH: 30,
      schematicPistonX: 140,
      schematicPistonY: 75,
      schematicPistonW: 120,
      schematicPistonH: 55,
      schematicRodX: 200,
      schematicRodY0: 130,
      schematicRodY1: 230,
    };
  }
