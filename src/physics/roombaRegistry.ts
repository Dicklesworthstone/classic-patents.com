export const roombaRegistryEntry = {
  domain: "Robotics",
  domainTitle: "Autonomous Coverage Kinematics",
  equationName: "Differential Drive & State Machine",
  governingEquation:
    "\\begin{cases} v = \\frac{r_{w}}{2}(\\omega_r + \\omega_l) \\\\ \\dot{\\theta} = \\frac{r_{w}}{L}(\\omega_r - \\omega_l) \\end{cases}",
  engineMethod: "stepRoomba",
  controls: [
    {
      id: "wheelSpeedMps",
      label: "Wheel Speed",
      min: 0.1,
      max: 1.0,
      step: 0.1,
      defaultValue: 0.3,
      unit: "m/s",
    },
    {
      id: "turnRateRadSec",
      label: "Turn Rate",
      min: 0.5,
      max: 3.0,
      step: 0.5,
      defaultValue: 1.5,
      unit: "rad/s",
    },
  ],
  computeMetrics: (params: Record<string, number>) => {
    const v = params.wheelSpeedMps ?? 0.3;
    return [
      {
        label: "Linear Velocity",
        value: v.toFixed(2),
        unit: "m/s",
        badgeColor: "emerald" as const,
        progressPct: (v / 1.0) * 100,
      },
    ];
  },
  pedagogicalInsight:
    "The Roomba uses a deterministic spiral algorithm to maximize open-floor coverage, and a randomized bump-and-turn heuristic to escape corners.",
};
