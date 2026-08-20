import { stepEInk } from "./eInkKernel";

export const eInkRegistryEntry = {
  domain: "Optoelectronics & Colloidal Physics",
  domainTitle: "Electrophoretic Particle Dynamics",
  equationName: "Stokes-Einstein Electrophoretic Drift",
  governingEquation: "v = \\mu_e \\cdot E = \\frac{q}{6 \\pi \\eta r_p} \\cdot \\frac{V}{d}",
  engineMethod: "stepEInk",
  controls: [
    {
      id: "electrodeVoltageVolts",
      label: "Electrode Voltage",
      min: -15,
      max: 15,
      step: 1,
      defaultValue: 15,
      unit: "V",
    },
    {
      id: "fluidViscosityCp",
      label: "Fluid Viscosity",
      min: 0.5,
      max: 5.0,
      step: 0.5,
      defaultValue: 2.0,
      unit: "cP",
    },
    {
      id: "particleChargeCoupled",
      label: "Zeta Charge Coupling",
      min: 0.5,
      max: 2.0,
      step: 0.1,
      defaultValue: 1.0,
      unit: "x",
    },
  ],
  computeMetrics: (params: Record<string, number>) => {
    const v = params.electrodeVoltageVolts ?? 15;
    const out = stepEInk(
      {
        electrodeVoltageVolts: v,
        fluidViscosityCp: params.fluidViscosityCp ?? 2.0,
        particleChargeCoupled: params.particleChargeCoupled ?? 1.0,
      },
      1.0,
    );

    return [
      {
        label: "Surface Reflectance",
        value: `${out.surfaceReflectancePercent}`,
        unit: "%",
        badgeColor: out.surfaceReflectancePercent > 40 ? "cyan" : "indigo",
        progressPct: out.surfaceReflectancePercent,
      },
      {
        label: "Drift Velocity",
        value: `${out.driftVelocityMms.toFixed(2)}`,
        unit: "mm/s",
        badgeColor: "emerald" as const,
        progressPct: Math.min(100, (out.driftVelocityMms / 2.0) * 100),
      },
    ];
  },
  pedagogicalInsight:
    "E-Ink achieves bistable, zero-power electronic paper by suspending positively charged white titanium dioxide particles and negatively charged carbon black particles in microcapsules, electrophoretically translating them toward or away from the transparent viewing electrode under an applied electric field.",
};
