/**
 * Visitor-facing leftover weaves. Every number is from the shared bus / SI kernels.
 * No CSV, QR, receipts, or invented WASM.
 */

import { teslaBAt } from "./teslaKernel";
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
            ? "Claim 1 hip-cradle holds: rudder cancels adverse yaw."
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
  if (patentId.includes("edison")) {
    const v = params.voltage ?? 110;
    const t = Math.round(1200 + (v / 130) * 1150);
    return {
      part: calloutLabel,
      material: "Carbonized bamboo in Sprengel vacuum",
      qty: "T_filament",
      value: t.toString(),
      unit: "K",
      note: "Color is the blackbody at this T, not a texture.",
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
    const keff = 0.85 + (rod / 100) * 0.18 * (mod / 100);
    return [{ label: "k_eff", min: 0.85, max: 1.05, live: keff, unit: "" }];
  }
  if (patentId.includes("goddard")) {
    const th = goddardThermo(params.chamberPressure ?? 350, params.expansionRatio ?? 3.5);
    return [{ label: "v_e", min: 1200, max: 2800, live: th.veMps, unit: "m/s" }];
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
    const load = params.loadTorque ?? 20;
    const pin = 80 + f * 1.2 + load * 8;
    return [{ from: "stator B", to: "shaft", watts: pin * 0.82 }];
  }
  if (patentId.includes("edison")) {
    const v = params.voltage ?? 110;
    const p = (v * v) / 150;
    return [{ from: "I²R", to: "radiation", watts: p }];
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
