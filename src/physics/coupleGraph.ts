/**
 * fs-couple edges: one graph, not two independent HUD numbers.
 * Host fallback until a WASM couple module steps. HUD must not say WASM.
 */

import {
  stepEdisonBulb,
  stepGoodyearRubber,
  stepMarconiRadio,
  stepPeltonWheel,
  stepSpencerMicrowave,
} from "./catalogKernels";
import { fermiKeff } from "./fermiKinetics";
import { TESLA_FIELD_POLES } from "./teslaKernel";
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
    const poles = params.poleCount ?? TESLA_FIELD_POLES;
    return [
      {
        from: "stator B",
        to: "shaft ns",
        gain: Number((120 / Math.max(1, poles)).toFixed(3)),
        unit: "rpm / Hz",
        crate: "fs-couple",
        source: "ts-fallback",
      },
      {
        from: "frequency",
        to: "display ω",
        gain: Number(((2 * Math.PI) / 20).toFixed(4)),
        unit: "rad/s / Hz",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-223898-edison-lightbulb" || patentId === "us-223898-edison-lamp") {
    const bulb = stepEdisonBulb({
      voltage: params.voltage ?? params.mainsVoltageV ?? 110,
      filamentLength: params.filamentLength,
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
    const radio = stepMarconiRadio(
      params.aerialHeight ?? 88,
      params.sparkGapMm ?? 10,
      params.coilKv ?? 28,
    );
    return [
      {
        from: "spark train",
        to: "radiated kW",
        gain: Number((radio.peakRfPowerKw / Math.max(0.5, params.sparkGapMm ?? 10)).toFixed(3)),
        unit: "kW / mm",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-2495429-spencer-microwave") {
    const mag = stepSpencerMicrowave(
      (params.anodeVoltage ?? 2200) / 1000,
      params.magneticFieldGauss ?? 1450,
      params.rfWatts ?? 800,
    );
    return [
      {
        from: "B field",
        to: "Hull oscillation",
        gain: mag.isOscillating ? 1 : 0,
        unit: "on/off",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-233692-pelton-wheel") {
    const pelton = stepPeltonWheel({
      headMeters: params.headMeters ?? 450,
      runnerRpm: params.runnerRpm ?? 600,
    });
    return [
      {
        from: "head",
        to: "jet velocity",
        gain: Number((pelton.jetVelocityMps / Math.max(1, params.headMeters ?? 450)).toFixed(4)),
        unit: "m/s / m",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
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
  if (patentId === "us-3633-goodyear-vulcanization" || patentId === "us-3633-goodyear-rubber") {
    const gum = stepGoodyearRubber(params.vulcanizationTempC ?? 145, params.sulfurPct ?? 8);
    return [
      {
        from: "sulfur",
        to: "cross-link density",
        gain: Number((gum.crossLinkDensity / Math.max(0.1, params.sulfurPct ?? 8)).toFixed(4)),
        unit: "1 / %",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  return [];
}
