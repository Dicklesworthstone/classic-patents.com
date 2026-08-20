import { stepMultiTouch } from "./multiTouchKernel";

export const multiTouchRegistryEntry = {
  domain: "Human-Computer Interaction & Sensing",
  domainTitle: "Mutual Capacitive Matrix & Gesture Heuristics",
  equationName: "Multi-Touch Affine Transformation & Capacitance Shunt",
  governingEquation:
    "S(t) = \\frac{\\|\\mathbf{p}_2(t) - \\mathbf{p}_1(t)\\|}{\\|\\mathbf{p}_2(0) - \\mathbf{p}_1(0)\\|}, \\quad \\Delta C_m = -\\frac{\\varepsilon_0 \\varepsilon_r A_{finger}}{d}",
  engineMethod: "stepMultiTouch",
  controls: [
    {
      id: "fingerSeparationMm",
      label: "Finger Separation",
      min: 15,
      max: 120,
      step: 5,
      defaultValue: 50,
      unit: "mm",
    },
    {
      id: "fingerCount",
      label: "Touch Contact Count",
      min: 0,
      max: 2,
      step: 1,
      defaultValue: 2,
      unit: "pts",
    },
    {
      id: "touchPressureGrams",
      label: "Contact Force / Area",
      min: 20,
      max: 200,
      step: 10,
      defaultValue: 80,
      unit: "g",
    },
  ],
  computeMetrics: (params: Record<string, number>) => {
    const sep = params.fingerSeparationMm ?? 50;
    const count = params.fingerCount ?? 2;
    const out = stepMultiTouch(
      {
        fingerCount: count,
        fingerSeparationMm: sep,
        touchPressureGrams: params.touchPressureGrams ?? 80,
        gestureVelocityMmS: 15,
      },
      0.0,
    );

    return [
      {
        label: "Scale Factor",
        value: `${out.zoomScale}x`,
        unit: "",
        badgeColor: "cyan" as const,
        progressPct: Math.min(100, (out.zoomScale / 2.5) * 100),
      },
      {
        label: "Capacitance Shunt",
        value: `-${out.mutualCapacitanceDeltaPf.toFixed(2)}`,
        unit: "pF",
        badgeColor: "emerald" as const,
        progressPct: Math.min(100, (out.mutualCapacitanceDeltaPf / 1.5) * 100),
      },
    ];
  },
  pedagogicalInsight:
    "The iPhone multi-touch patent revolutionized modern computing by coupling mutual capacitance row-column scanning with geometric distance heuristics, turning finger divergence into an affine scale transformation (pinch-to-zoom) in real time without stylus or mechanical trackball.",
};
