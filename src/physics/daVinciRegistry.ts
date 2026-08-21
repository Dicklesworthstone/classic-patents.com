export const daVinciRegistryEntry = {
  domain: "Robotic Tool Interfaces",
  domainTitle: "Compatibility, Calibration, and Engagement Data",
  equationName: "Nominal-to-Measured Tool Offset",
  governingEquation: "\\Delta q_{tool} = q_{measured} - q_{nominal}",
  engineMethod: "stepDaVinci",
  controls: [
    {
      id: "motionScaleRatio",
      label: "Compatibility table entries (illustrative)",
      min: 1,
      max: 10,
      step: 1,
      defaultValue: 3,
      unit: ":1",
    },
    {
      id: "tremorFilterEnabled",
      label: "Compatibility signal present",
      min: 0,
      max: 1,
      step: 1,
      defaultValue: 1,
      unit: "",
    },
    {
      id: "gripAngleDeg",
      label: "End-effector angle (illustrative)",
      min: 0,
      max: 60,
      step: 5,
      defaultValue: 30,
      unit: "°",
    },
    {
      id: "masterInputSpeedMps",
      label: "Drive velocity (illustrative)",
      min: 0.1,
      max: 1.0,
      step: 0.1,
      defaultValue: 0.5,
      unit: "m/s",
    },
  ],
  computeMetrics: (params: Record<string, number>) => {
    const scale = params.motionScaleRatio ?? 3;
    const filterOn = (params.tremorFilterEnabled ?? 1) > 0.5;
    return [
      {
        label: "Compatibility entries",
        value: `${scale}`,
        unit: "",
        badgeColor: "cyan" as const,
        progressPct: (scale / 10) * 100,
      },
      {
        label: "Compatibility signal",
        value: filterOn ? "present" : "absent",
        unit: "",
        badgeColor: filterOn ? "emerald" : "rose",
        progressPct: filterOn ? 100 : 0,
      },
    ];
  },
  pedagogicalInsight:
    "This source-bounded instrument illustrates the patent's tool-boundary data path: a releasable interface can report compatibility and tool-specific calibration information to a processor. Numeric motion and tremor controls are illustrative, not limitations stated by this grant.",
};
