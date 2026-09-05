import { stepMultiTouch } from "./multiTouchKernel";

export const multiTouchRegistryEntry = {
  domain: "Human-Computer Interaction",
  domainTitle: "Touch-gesture command heuristics",
  equationName: "Initial-Motion Angle Classification",
  governingEquation:
    "\\theta = \\operatorname{atan2}(|\\Delta x|, |\\Delta y|), \\quad S = \\frac{d(t)}{d(0)}",
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
      id: "initialMotionAngleDeg",
      label: "Initial Motion Angle",
      min: 0,
      max: 90,
      step: 1,
      defaultValue: 15,
      unit: "deg from vertical",
    },
  ],
  computeMetrics: (params: Record<string, number>) => {
    const sep = params.fingerSeparationMm ?? 50;
    const count = params.fingerCount ?? 2;
    const out = stepMultiTouch(
      {
        fingerCount: count,
        fingerSeparationMm: sep,
        initialMotionAngleDeg: params.initialMotionAngleDeg ?? 15,
      },
      0.0,
    );

    return [
      {
        label: "Claim 8 scale",
        value: `${out.zoomScale}x`,
        unit: "",
        badgeColor: "cyan" as const,
        progressPct: Math.min(100, (out.zoomScale / 2.5) * 100),
      },
      {
        label: "Command class",
        value: out.gestureMode,
        unit: "",
        badgeColor: "emerald" as const,
        progressPct: 100,
      },
    ];
  },
  pedagogicalInsight:
    "US 7,479,949 claims the command-classification step after contacts are detected: an initial-motion heuristic can distinguish vertical scrolling from two-dimensional translation, while dependent Claim 8 covers pinch zoom. It does not disclose a capacitance sensor construction.",
};
