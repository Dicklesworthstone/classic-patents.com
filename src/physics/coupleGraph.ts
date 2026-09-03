/**
 * fs-couple edges: one graph, not two independent HUD numbers.
 * Host fallback until a WASM couple module steps. HUD must not say WASM.
 */

import { stepArkwrightWaterFrame } from "./arkwrightKernel";
import {
  stepBellPhotophone,
  stepEdisonBulb,
  stepGoodyearRubber,
  stepGrammeDynamo,
  stepHaberAmmonia,
  stepMorseTelegraph,
} from "./catalogKernels";
import { fermiKeff } from "./fermiKinetics";
import { stepHoweSewingMachine } from "./machineKernels";
import { stepTeslaMotorFig9, teslaMotorPhaseHz } from "./teslaKernel";
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
    const fig9 = stepTeslaMotorFig9(teslaMotorPhaseHz(params));
    return [
      {
        from: "generator G",
        to: "progressive pole shift",
        gain: Number((fig9.poleShiftRpm / Math.max(1, fig9.phaseCycleHz)).toFixed(3)),
        unit: "rpm / Hz",
        crate: "fs-couple",
        source: "ts-fallback",
      },
      {
        from: "progressive pole shift",
        to: "disk D",
        gain: Number((fig9.diskRpm / Math.max(1, fig9.poleShiftRpm)).toFixed(3)),
        unit: "rpm / rpm",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-223898-edison-lightbulb" || patentId === "us-223898-edison-lamp") {
    const bulb = stepEdisonBulb({
      voltage: params.voltage ?? params.mainsVoltageV ?? 110,
      hotResistanceOhm: params.hotResistanceOhm,
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
    // The grant gives a causal connection, not a numerical transfer gain.
    return [];
  }
  if (patentId === "us-2495429-spencer-microwave") {
    const energyPathActive = (params.rfPowerSetting ?? params.rfWatts ?? 1) > 0;
    return [
      {
        from: "oscillators 10 and 11",
        to: "common wave guide 23 and conveyor region 28",
        gain: energyPathActive ? 1 : 0,
        unit: "on/off",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-233692-pelton-water-wheel") {
    // The source describes a geometric water path, not a numerical
    // head-to-velocity transfer gain.
    return [];
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
    return [
      {
        from: "engine shaft I",
        to: "counter-shaft K",
        gain: 0.5,
        unit: "revolution / revolution",
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
  if (patentId === "us-971501-haber-ammonia") {
    const pAtm = params.pressureAtm ?? 175;
    const haber = stepHaberAmmonia({
      pressureAtm: pAtm,
      temperatureCelsius: params.temperatureCelsius ?? 530,
    });
    return [
      {
        from: "pressure",
        to: "NH3 yield",
        gain: Number((haber.ammoniaYieldPct / Math.max(1, pAtm)).toFixed(4)),
        unit: "% / atm",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-235199-bell-photophone") {
    const dist = params.transmissionDistanceM ?? 213;
    const phone = stepBellPhotophone({
      transmissionDistanceM: dist,
      voiceSplDb: params.voiceSplDb ?? 75,
    });
    return [
      {
        from: "range",
        to: "selenium audio current",
        gain: Number((phone.audioSignalCurrentUa / Math.max(1, dist)).toFixed(4)),
        unit: "µA / m",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  // US 2,981,877 supplies a connected oxide/contact/lead topology, but no
  // numeric cause/effect pair from which an fs-couple gain can be derived.
  if (patentId === "us-2981877-noyce-ic") return [];
  if (patentId === "us-1647-morse-telegraph") {
    const volts = params.lineVoltageV ?? 24;
    const morse = stepMorseTelegraph({ lineVoltageV: volts });
    return [
      {
        from: "line voltage",
        to: "loop current",
        gain: Number((morse.ohmicCurrentMa / Math.max(0.1, volts)).toFixed(3)),
        unit: "mA / V",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-4750-howe-sewing-machine") {
    const rpm = params.crankRpm ?? 240;
    const howe = stepHoweSewingMachine(rpm, params.loopSlackPct ?? 65, params.stitchPitchMm ?? 3.5);
    return [
      {
        from: "main shaft C",
        to: "baster plate H feed",
        gain: Number((howe.clothFeedMmPerS / Math.max(1, rpm)).toFixed(4)),
        unit: "mm/s / rpm",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-361931-daimler-engine") {
    // The source states a mechanical connection and thrust-maintained contact,
    // not a numerical rpm-to-power coupling gain.
    return [];
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
  if (patentId === "us-124404-westinghouse-air-brake") {
    return [
      {
        from: "train-pipe pressure",
        to: "brake shoe clamping force",
        gain: 1.746,
        unit: "kN / psi",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-x72-whitney-cotton-gin") {
    return [
      {
        from: "hand crank",
        to: "saw cylinder",
        gain: 3.5,
        unit: "rpm / rpm",
        crate: "fs-couple",
        source: "ts-fallback",
      },
      {
        from: "hand crank",
        to: "clearer brush cylinder",
        gain: 12.0,
        unit: "rpm / rpm",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-200521-edison-phonograph") {
    return [
      {
        from: "mandrel rotation",
        to: "stylus axial lead feed",
        gain: 0.0423,
        unit: "mm/s / rpm",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  if (patentId === "us-542846-diesel-engine") {
    return [
      {
        from: "crankshaft",
        to: "camshaft side shaft",
        gain: 0.5,
        unit: "rpm / rpm",
        crate: "fs-couple",
        source: "ts-fallback",
      },
    ];
  }
  return [];
}
