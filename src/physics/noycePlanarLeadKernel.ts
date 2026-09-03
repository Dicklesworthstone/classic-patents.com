/** Source-bounded geometry kernel for Noyce's US 2,981,877. */
export const NOYCE_PLANAR_LEAD_SOURCE_BOUNDARY =
  "US 2,981,877 supplies surface-reaching dished P-N junctions, retained semiconductor oxide (often one micron or more; elsewhere one to two microns), selected contact windows, C-shaped and discoid contacts, adherent metal strips crossing junctions on the oxide, high-resistivity regions used to reduce shunt capacitance, and reverse-biased junctions used as capacitors. It does not print dopant concentrations, dielectric constants, junction areas, applied volts, leakage, capacitance values, propagation delay, clock frequency, breakdown voltage, or switching energy.";

export interface NoycePlanarLeadControls {
  oxideThicknessUm: number;
  leadStripWidthFraction: number;
  contactGapFraction: number;
  claim1OxideBridgePresent: number;
}

export const NOYCE_PLANAR_LEAD_DEFAULT_CONTROLS: NoycePlanarLeadControls = {
  oxideThicknessUm: 1,
  leadStripWidthFraction: 0.12,
  contactGapFraction: 0.3,
  claim1OxideBridgePresent: 1,
};

export interface NoycePlanarLeadState {
  readonly controls: NoycePlanarLeadControls;
  readonly oxideCrossesJunction: boolean;
  readonly adherentMetalLeadPresent: boolean;
  readonly leadFitsContactGap: boolean;
  readonly contactsRemainSeparated: boolean;
  readonly claim1TopologyComplete: boolean;
  readonly state: "oxide-supported crossing" | "claim-1 oxide bridge withheld";
  readonly quantitativeElectricalPerformanceAvailable: false;
  readonly quantitativeEnergyAvailable: false;
  readonly sourceBoundary: string;
  readonly refusal: { readonly refused: true; readonly reason: string };
}

function finiteOr(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function readNoycePlanarLeadControls(
  params: Partial<NoycePlanarLeadControls> | Record<string, number | undefined>,
): NoycePlanarLeadControls {
  return {
    oxideThicknessUm: clamp(
      finiteOr(params.oxideThicknessUm, NOYCE_PLANAR_LEAD_DEFAULT_CONTROLS.oxideThicknessUm),
      0.5,
      2,
    ),
    leadStripWidthFraction: clamp(
      finiteOr(
        params.leadStripWidthFraction,
        NOYCE_PLANAR_LEAD_DEFAULT_CONTROLS.leadStripWidthFraction,
      ),
      0.08,
      0.28,
    ),
    contactGapFraction: clamp(
      finiteOr(params.contactGapFraction, NOYCE_PLANAR_LEAD_DEFAULT_CONTROLS.contactGapFraction),
      0.15,
      0.45,
    ),
    claim1OxideBridgePresent:
      finiteOr(
        params.claim1OxideBridgePresent,
        NOYCE_PLANAR_LEAD_DEFAULT_CONTROLS.claim1OxideBridgePresent,
      ) >= 0.5
        ? 1
        : 0,
  };
}

export function stepNoycePlanarLeadTopology(
  params: Partial<NoycePlanarLeadControls> | Record<string, number | undefined>,
): NoycePlanarLeadState {
  const controls = readNoycePlanarLeadControls(params);
  const oxideCrossesJunction = controls.claim1OxideBridgePresent === 1;
  const adherentMetalLeadPresent = true;
  const leadFitsContactGap = controls.leadStripWidthFraction < controls.contactGapFraction;
  const contactsRemainSeparated = oxideCrossesJunction && leadFitsContactGap;
  const claim1TopologyComplete = oxideCrossesJunction && contactsRemainSeparated;
  return {
    controls,
    oxideCrossesJunction,
    adherentMetalLeadPresent,
    leadFitsContactGap,
    contactsRemainSeparated,
    claim1TopologyComplete,
    state: claim1TopologyComplete ? "oxide-supported crossing" : "claim-1 oxide bridge withheld",
    quantitativeElectricalPerformanceAvailable: false,
    quantitativeEnergyAvailable: false,
    sourceBoundary: NOYCE_PLANAR_LEAD_SOURCE_BOUNDARY,
    refusal: {
      refused: true,
      reason: `${NOYCE_PLANAR_LEAD_SOURCE_BOUNDARY} This exhibit therefore refuses depletion width, capacitance, propagation delay, maximum clock rate, breakdown margin, leakage, current, power, and transient switching predictions.`,
    },
  };
}
