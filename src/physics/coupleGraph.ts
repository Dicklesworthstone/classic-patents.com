/**
 * fs-couple edges: one graph, not two independent HUD numbers.
 * Host fallback until a WASM couple module steps. HUD must not say WASM.
 */

import { stepArkwrightWaterFrame } from "./arkwrightKernel";
import {
  stepDaimlerEngine,
  stepEdisonBulb,
  stepGoodyearRubber,
  stepGrammeDynamo,
  stepMarconiRadio,
  stepOttoEngine,
  stepPeltonWheel,
  stepSpencerMicrowave,
} from "./catalogKernels";
import { fermiKeff } from "./fermiKinetics";
import { TESLA_FIELD_POLES } from "./teslaKernel";
import { stepWattCondenser } from "./wattCondenserKernel";
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
  if (patentId === "us-233692-pelton-water-wheel") {
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
  if (patentId === "us-194047-otto-engine") {
    const cr = params.compressionRatio ?? 4.5;
    const otto = stepOttoEngine({
      engineRpm: params.engineRpm ?? 180,
      compressionRatio: cr,
    });
    const dEta = 0.4 / cr ** 1.4;
    return [
      {
        from: "compression",
        to: "thermal efficiency",
        gain: Number((dEta * 100).toFixed(3)),
        unit: "% / ratio",
        crate: "fs-couple",
        source: "ts-fallback",
      },
      {
        from: "rpm",
        to: "brake hp",
        gain: Number((otto.brakeHorsepower / Math.max(1, params.engineRpm ?? 180)).toFixed(4)),
        unit: "hp / rpm",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-120057-gramme-dynamo") {
    const gramme = stepGrammeDynamo({ shaftRate: params.shaftRate ?? 1 });
    return [
      {
        from: "shaft rate",
        to: "EMF index",
        gain: Number((gramme.inducedEmfIndex / Math.max(0.4, params.shaftRate ?? 1)).toFixed(2)),
        unit: "index / rate",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "gb-931-arkwright-water-frame") {
    const draft = params.totalDraftRatio ?? 6;
    const roving = params.inputRovingCountNe ?? 1;
    const frame = stepArkwrightWaterFrame({
      totalDraftRatio: draft,
      inputRovingCountNe: roving,
    });
    return [
      {
        from: "draft",
        to: "yarn count",
        gain: Number((frame.outputYarnCountNe / Math.max(0.1, draft)).toFixed(3)),
        unit: "Ne / ratio",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "gb-913-watt-separate-condenser") {
    const watt = stepWattCondenser({
      hasSeparateCondenser: (params.hasSeparateCondenser ?? 1) >= 0.5,
      condenserTempC: params.condenserTempC ?? 35,
    });
    return [
      {
        from: "separate condenser",
        to: "Newcomen fuel multiple",
        gain: Number(watt.newcomenFuelMultiplier.toFixed(3)),
        unit: "× coal",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-361931-daimler-engine") {
    const daimler = stepDaimlerEngine({ engineRpm: params.engineRpm ?? 750 });
    return [
      {
        from: "hot-tube rpm",
        to: "brake hp",
        gain: Number((daimler.brakeHorsepower / Math.max(1, params.engineRpm ?? 750)).toFixed(5)),
        unit: "hp / rpm",
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
