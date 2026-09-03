/** Source-bounded construction kernel for Kilby's US 3,138,743. */
export const KILBY_SOURCE_BOUNDARY =
  "US 3,138,743 prints a 0.200 inch by 0.080 inch, 0.0025 inch thick 3 ohm-cm p-type germanium wafer; an approximately 0.7 mil antimony-diffused n-type surface layer; alloyed gold-plated Kovar leads 50; evaporated-gold contact areas 51–54; aluminum emitter areas 56; etched slots and mesa areas 60; thermally bonded gold wires 70; and the Figure 7 values 400 ohms, 1.8 kilohms, 3 kilohms, and 50 microfarads. It does not print a supply voltage, transistor gain, device junction area, impurity-density gradient, operating current, measured frequency, switching delay, power, or thermal operating point.";

export const KILBY_PRINTED_WAFER = {
  lengthIn: 0.2,
  widthIn: 0.08,
  thicknessIn: 0.0025,
  resistivityOhmCm: 3,
  nLayerDepthMil: 0.7,
  lengthMm: 5.08,
  widthMm: 2.032,
  thicknessMm: 0.0635,
  nLayerDepthMm: 0.01778,
} as const;

export const KILBY_FIGURE_7_VALUES = {
  r1R2Ohms: 3000,
  r3R8Ohms: 1800,
  r4R5R6R7Ohms: 400,
  c1C2Microfarads: 50,
} as const;

export interface KilbySourceCircuitControls {
  sectionRevealFraction: number;
  wireArchFraction: number;
  claim1ConductiveMeansPresent: number;
}

export const KILBY_SOURCE_CIRCUIT_DEFAULTS: KilbySourceCircuitControls = {
  sectionRevealFraction: 0,
  wireArchFraction: 0.55,
  claim1ConductiveMeansPresent: 1,
};

export interface KilbySourceCircuitState {
  readonly controls: KilbySourceCircuitControls;
  readonly activeComponentsIntegralToWafer: true;
  readonly passiveComponentsIntegralToWafer: true;
  readonly etchedIsolationPresent: true;
  readonly conductiveMeansPresent: boolean;
  readonly claim1TopologyComplete: boolean;
  readonly quantitativeCircuitPerformanceAvailable: false;
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

export function readKilbySourceCircuitControls(
  params: Partial<KilbySourceCircuitControls> | Record<string, number | undefined>,
): KilbySourceCircuitControls {
  return {
    sectionRevealFraction: clamp(
      finiteOr(params.sectionRevealFraction, KILBY_SOURCE_CIRCUIT_DEFAULTS.sectionRevealFraction),
      0,
      1,
    ),
    wireArchFraction: clamp(
      finiteOr(params.wireArchFraction, KILBY_SOURCE_CIRCUIT_DEFAULTS.wireArchFraction),
      0.2,
      1,
    ),
    claim1ConductiveMeansPresent:
      finiteOr(
        params.claim1ConductiveMeansPresent,
        KILBY_SOURCE_CIRCUIT_DEFAULTS.claim1ConductiveMeansPresent,
      ) >= 0.5
        ? 1
        : 0,
  };
}

export function stepKilbySourceCircuitTopology(
  params: Partial<KilbySourceCircuitControls> | Record<string, number | undefined>,
): KilbySourceCircuitState {
  const controls = readKilbySourceCircuitControls(params);
  const conductiveMeansPresent = controls.claim1ConductiveMeansPresent === 1;
  return {
    controls,
    activeComponentsIntegralToWafer: true,
    passiveComponentsIntegralToWafer: true,
    etchedIsolationPresent: true,
    conductiveMeansPresent,
    claim1TopologyComplete: conductiveMeansPresent,
    quantitativeCircuitPerformanceAvailable: false,
    quantitativeEnergyAvailable: false,
    sourceBoundary: KILBY_SOURCE_BOUNDARY,
    refusal: {
      refused: true,
      reason: `${KILBY_SOURCE_BOUNDARY} This exhibit therefore refuses transistor current, gain, depletion width, calculated capacitance, oscillation frequency, propagation delay, clock rate, switching power, and heat.`,
    },
  };
}
