import { stepEInk } from "./eInkKernel";

export const eInkRegistryEntry = {
  domain: "Optoelectronics & Colloidal Physics",
  domainTitle: "Electrophoretic Particle Dynamics",
  equationName: "Electrophoretic Drift (Pedagogical Mobility Model)",
  governingEquation: "E = \\frac{V}{d},\\quad v_d = \\mu_e E",
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
        label: "Illustrative Surface Response",
        value: `${out.surfaceReflectancePercent}`,
        unit: "%",
        badgeColor: out.surfaceReflectancePercent > 40 ? "cyan" : "indigo",
        progressPct: out.surfaceReflectancePercent,
      },
      {
        label: "Modeled Drift Velocity",
        value: `${out.driftVelocityMms.toFixed(2)}`,
        unit: "mm/s",
        badgeColor: "emerald" as const,
        progressPct: Math.min(100, (out.driftVelocityMms / 2.0) * 100),
      },
    ];
  },
  pedagogicalInsight:
    "The grant’s electrophoretic embodiment moves oppositely charged particles of different colors toward a capsule surface according to field polarity. This shared kernel is a bounded pedagogical mobility model; it does not assert a measured patent value for reflectance, contrast, switching time, or standby power.",
};
