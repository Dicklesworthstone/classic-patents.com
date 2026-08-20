export const daVinciRegistryEntry = {
  domain: "Robotics & Teleoperation",
  domainTitle: "Master-Slave Telepresence & Kinematics",
  equationName: "Scaled Inverse Kinematics & Low-Pass Filtering",
  governingEquation:
    "\\mathbf{x}_{slave}(t) = \\frac{1}{K} \\cdot \\mathcal{F}^{-1}\\{ H_{LPF}(j\\omega) \\cdot \\mathcal{F}\\{\\mathbf{x}_{master}(t)\\} \\}",
  engineMethod: "stepDaVinci",
  controls: [
    {
      id: "motionScaleRatio",
      label: "Motion Scale (Master:Slave)",
      min: 1,
      max: 10,
      step: 1,
      defaultValue: 3,
      unit: ":1",
    },
    {
      id: "tremorFilterEnabled",
      label: "Tremor Filter (8Hz LPF)",
      min: 0,
      max: 1,
      step: 1,
      defaultValue: 1,
      unit: "",
    },
    {
      id: "gripAngleDeg",
      label: "EndoWrist Grip Angle",
      min: 0,
      max: 60,
      step: 5,
      defaultValue: 30,
      unit: "°",
    },
    {
      id: "masterInputSpeedMps",
      label: "Master Velocity",
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
        label: "Motion Scale Ratio",
        value: `${scale}:1`,
        unit: "",
        badgeColor: "cyan" as const,
        progressPct: (scale / 10) * 100,
      },
      {
        label: "Tremor Attenuation",
        value: filterOn ? "94.5" : "0.0",
        unit: "%",
        badgeColor: filterOn ? "emerald" : "rose",
        progressPct: filterOn ? 94.5 : 0,
      },
    ];
  },
  pedagogicalInsight:
    "The Da Vinci master-slave system decouples human macroscopic hand movements from micro-surgical actions via variable motion scaling (up to 10:1) and a digital low-pass filter that eliminates physiological 6-10 Hz hand tremor at the EndoWrist.",
};
