/**
 * Kernel predicates → exact phrases in the original specification.
 * Highlighted on the spec face so an interaction lights the clause it tests.
 */

import { stepFermiKinetics } from "./fermiKinetics";
import { stepTeslaMotorFig9, teslaMotorPhaseHz } from "./teslaKernel";

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
const WATT_ID = "gb-913-watt-separate-condenser";
const ARKWRIGHT_ID = "gb-931-arkwright-water-frame";
const MARCONI_ID = "us-586193-marconi-radio";
const BAEKELAND_ID = "us-942699-baekeland-bakelite";

export function specClausesFor(patentId: string, params: Record<string, number>): SpecClause[] {
  if (patentId === ARKWRIGHT_ID) {
    const draftRatio = params.totalDraftRatio ?? 6.0;
    const clampingWeight = params.rollerClampingWeightKg ?? 3.5;
    const waterWheelRpm = params.waterWheelRpm ?? 180;
    const isHighDraft = draftRatio >= 4.0;
    const isClamped = clampingWeight >= 2.0;
    const isSpinning = waterWheelRpm > 50;

    return [
      {
        id: "differential-rollers",
        phrase:
          "turning with different degrees of velocity, draws out and attenuates the cotton fibers",
        active: isHighDraft,
        tone: isHighDraft ? "held" : "live",
        caption: `Draft Ratio D=${draftRatio.toFixed(1)}×: Front delivery rollers turn faster than feed rollers, attenuating roving mechanically.`,
      },
      {
        id: "weighted-pressing",
        phrase:
          "lead weights and pressing levers, which hang upon the bearings of the upper rollers",
        active: isClamped,
        tone: isClamped ? "held" : "broken",
        caption: `Clamping Weight=${clampingWeight.toFixed(1)} kg: Deadweights prevent fiber slippage between leather top rollers and fluted cylinders.`,
      },
      {
        id: "high-speed-flyers",
        phrase:
          "high-speed steel flyers, having two curved arms with small wire guide loops or eyes",
        active: isSpinning,
        tone: isSpinning ? "held" : "broken",
        caption: `Flyer Speed=${Math.round(waterWheelRpm * 18.5)} RPM: Rapidly revolving flyers impart helical twist, converting roving into warp-grade water twist yarn.`,
      },
      {
        id: "heart-cam-traverse",
        phrase: "heart-wheel or cam... raises and lowers the rail supporting the bobbins",
        active: isSpinning,
        tone: "live",
        caption:
          "Heart-cam continuously oscillates the bobbin rail to wind yarn in uniform cylindrical layers.",
      },
    ];
  }

  if (patentId === WATT_ID) {
    const hasCondenser = (params.hasSeparateCondenser ?? 1) >= 0.5;
    const condTemp = params.condenserTempC ?? 35;
    return [
      {
        id: "cylinder-hot",
        phrase: "kept as hot as the steam that enters it",
        active: hasCondenser,
        tone: hasCondenser ? "held" : "broken",
        caption: hasCondenser
          ? "Principle 1: Concentric steam jacket maintains cylinder walls at boiling temperature (100°C+)."
          : "Newcomen mode: Cylinder is quenched to 35°C on every single stroke, causing 75% fuel waste.",
      },
      {
        id: "separate-condenser",
        phrase: "condensed in vessels distinct from the steam vessels or cylinders",
        active: hasCondenser,
        tone: "live",
        caption: `Principle 2: Separate vessel condenser active at ${condTemp}°C with cold water injection.`,
      },
      {
        id: "air-pump",
        phrase: "drawn out of the steam vessels or condensers by means of pumps",
        active: hasCondenser,
        tone: "live",
        caption:
          "Principle 3: Reciprocating beam air pump evacuates non-condensable gases and water.",
      },
      {
        id: "oil-packing",
        phrase: "employ oils, wax, resinous bodies, fat of animals, quicksilver",
        active: true,
        tone: "held",
        caption: "Principle 7: Piston sealed with tallow and wax to prevent cold water chilling.",
      },
    ];
  }
  if (patentId === WRIGHT_ID) {
    const coupled = (params.coupled ?? 1) >= 0.5;
    return [
      {
        id: "warp",
        phrase: "twisted or warped in opposite directions",
        active: Math.abs(params.wingWarp ?? 0) > 0.5,
        tone: "live",
        caption: "Claim 1 warp is live: opposite tip incidence.",
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
    const fig9 = stepTeslaMotorFig9(teslaMotorPhaseHz(params));
    const energized = fig9.phaseCycleHz > 0;
    return [
      {
        id: "independent-circuits",
        phrase:
          "two or more independent circuits through which alternate currents are passed at proper intervals",
        active: energized,
        tone: "held",
        caption: `Fig. 9 generator at ${fig9.generatorRpm} rpm drives the two collector-ring circuits.`,
      },
      {
        id: "progressive-shift",
        phrase: "a progressive shifting of the magnetism or of the ‘lines of force’",
        active: energized,
        tone: "live",
        caption: `Pole shift ${fig9.poleShiftRpm} rpm; disk D follows at ${fig9.diskRpm} rpm.`,
      },
    ];
  }

  if (patentId === FERMI_ID) {
    const rod = params.rodWithdrawal ?? 83.5;
    const mod = params.moderatorPurity ?? 99.5;
    const keff = stepFermiKinetics(rod, mod).kEffective;
    return [
      {
        id: "critical",
        phrase: "self-sustaining",
        active: keff >= 0.998,
        tone: keff > 1.002 ? "live" : "held",
        caption:
          keff >= 0.998
            ? `k_eff = ${keff.toFixed(4)}: chain reaction holds.`
            : `k_eff = ${keff.toFixed(4)}: subcritical.`,
      },
    ];
  }

  if (patentId === BAEKELAND_ID) {
    const temp = params.curingTempC ?? 130;
    const press = params.autoclavePressurePsi ?? 75;
    const time = params.curingTimeMin ?? 60;
    const isPressurized = press >= 45;
    const isHotEnough = temp >= 110;
    const isCured = isHotEnough && time >= 45;

    return [
      {
        id: "autoclave-pressure",
        phrase:
          "closed vessel in case the temperature exceed 90°-100° C.; without this precaution vapors of formaldehyde and the like escape causing foam and air bubbles",
        active: isPressurized,
        tone: isPressurized ? "held" : "broken",
        caption: `P_autoclave = ${press} psi: Super-atmospheric pressure suppresses boiling of water and formaldehyde, preventing foam and porosity.`,
      },
      {
        id: "infusible-curing",
        phrase:
          "converted into a hard, insoluble and infusible body by the combined action of heat and pressure",
        active: isCured,
        tone: isCured ? "held" : "live",
        caption: `T = ${temp} °C, t = ${time} min: Thermal condensation drives complete 3D covalent crosslinking into insoluble C-stage Bakelite.`,
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
