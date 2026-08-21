/**
 * fs-couple edges: one graph, not two independent HUD numbers.
 * Host fallback until a WASM couple module steps. HUD must not say WASM.
 */

import { stepEdisonBulb } from "./catalogKernels";
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
  return [];
}
