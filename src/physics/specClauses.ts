/**
 * Kernel predicates → phrases in the original specification.
 * Highlighted on the spec face so a slider change lights the clause it tests.
 */

import { fermiKeff } from "./fermiKinetics";

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
const MARCONI_ID = "us-586193-marconi-radio";

export function specClausesFor(patentId: string, params: Record<string, number>): SpecClause[] {
  if (patentId === WRIGHT_ID) {
    const coupled = (params.coupled ?? 1) >= 0.5;
    return [
      {
        id: "warp",
        phrase: "twisted or warped in opposite directions",
        active: Math.abs(params.wingWarp ?? 0) > 0.5,
        tone: "live",
        caption: "Claim 1 warp is live — opposite tip incidence.",
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
    const poles = params.poles ?? 2;
    const freq = params.frequency ?? 60;
    return [
      {
        id: "rotating-field",
        phrase: "rotating magnetic field",
        active: freq > 0,
        tone: "live",
        caption: `Stator B is rotating at ${freq} Hz.`,
      },
      {
        id: "polyphase",
        phrase: "two or more alternating currents having a phase difference",
        active: freq > 0,
        tone: poles === 2 ? "held" : "live",
        caption:
          poles === 2
            ? "Two-pole field — ns = 120 f / P matches the patent figure."
            : `${poles}-pole field: synchronous speed is 120 f / P.`,
      },
    ];
  }

  if (patentId === FERMI_ID) {
    const rod = params.rodWithdrawal ?? 83.5;
    const mod = params.moderatorPurity ?? 99.5;
    const keff = fermiKeff(rod, mod);
    return [
      {
        id: "critical",
        phrase: "self-sustaining",
        active: keff >= 0.998,
        tone: keff > 1.002 ? "live" : "held",
        caption:
          keff >= 0.998
            ? `k_eff = ${keff.toFixed(4)} — chain reaction holds.`
            : `k_eff = ${keff.toFixed(4)} — subcritical.`,
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
