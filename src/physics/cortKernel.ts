/**
 * src/physics/cortKernel.ts
 *
 * SI Computational Metallurgy & Rolling Physics Kernel for Henry Cort's 1784
 * Reverberatory Puddling Furnace & Grooved Rolling Mill (GB 1420).
 *
 * Models:
 * 1. Arrhenius surface decarburization kinetics & FeO slag reduction
 * 2. Fe-C phase equilibrium & "Coming to Nature" solidus rise
 * 3. Grooved roll bite geometry, contact length, and hydrostatic squeeze pressure
 * 4. Slag extrusion dynamics and fibrous wrought-iron grain refinement
 */

export interface CortKernelInputs {
  furnaceTemperatureCelsius: number; // 1100–1600 °C
  initialCarbonPercent: number; // 2.5–4.5 % (pig iron charge)
  rabbleStirringRpm: number; // 0–30 RPM (puddler manual rabbling rate)
  puddlingDurationMinutes: number; // 20–180 min
  rollerPassCount: number; // 1–8 passes
  rollerDiameterMm?: number; // default 450 mm
  rollSpeedRpm?: number; // default 30 RPM
  puddleBallMassKg?: number; // default 35 kg (~77 lbs)
}

export interface CortKernelOutputs {
  // Thermodynamic & Chemical States
  currentTemperatureCelsius: number;
  residualCarbonPercent: number;
  carbonRemovedPercent: number;
  decarburizationRatePercentPerMin: number;
  ironMeltingPointCelsius: number;
  isPastyNatureState: boolean; // True when liquidus/solidus exceeds bath temp

  // Slag & Puddle Ball Dynamics
  initialSlagVolumeFractionPercent: number;
  residualSlagVolumeFractionPercent: number;
  slagExpelledKg: number;
  spongeBallMassKg: number;

  // Grooved Rolling Mechanics
  totalAreaReductionRatio: number; // A_0 / A_final
  elongationFactor: number;
  finalBilletWidthMm: number;
  finalBilletHeightMm: number;
  biteContactLengthMm: number;
  rollSeparationForceKn: number;
  hydrostaticSqueezePressureMpa: number;

  // Mechanical Properties of Resulting Wrought Iron
  tensileStrengthMpa: number;
  yieldStrengthMpa: number;
  ductilityElongationPercent: number;
  grainFinenessIndex: number; // ASTM equivalent grain size

  // Productivity Metrics vs Prior Tilt-Hammer Art
  hourlyIronOutputKg: number;
  productionSpeedupVsHammer: number; // ~15x

  // Mill / rabble kinematics the 3D studio drains (no leftover 30 RPM sticker)
  rollSpeedRpm: number;
  rollOmegaRadPerS: number;
  rabbleOmegaRadPerS: number;
}

export function stepCortPuddlingRolling(inputs: CortKernelInputs): CortKernelOutputs {
  const tempC = Math.max(1100, Math.min(1600, inputs.furnaceTemperatureCelsius));
  const tempK = tempC + 273.15;
  const c0 = Math.max(2.5, Math.min(4.5, inputs.initialCarbonPercent));
  const rabbleRpm = Math.max(0, Math.min(30, inputs.rabbleStirringRpm));
  const timeMin = Math.max(1, Math.min(180, inputs.puddlingDurationMinutes));
  const passes = Math.max(1, Math.min(8, Math.round(inputs.rollerPassCount)));
  const rollDiamMm = inputs.rollerDiameterMm ?? 450;
  // GB 1420 names grooved rollers but supplies no rotational speed. This is a
  // visitor-controlled teaching default, not a historical measurement.
  const rollRpm = inputs.rollSpeedRpm ?? 30;
  const rawBallMassKg = inputs.puddleBallMassKg ?? 35;

  // 1. Arrhenius Decarburization Kinetics
  // Rate constant k = A * exp(-E_a / RT) * (1 + beta * rabble_stir)
  const activationEnergyJ = 115000; // J/mol for C oxidation in liquid iron
  const gasConstR = 8.314;
  const preExpA = 12500; // base kinetic prefactor (1/min)
  const stirFactor = 1 + (rabbleRpm / 15) * 1.6;
  const kDecarb = preExpA * Math.exp(-activationEnergyJ / (gasConstR * tempK)) * stirFactor;

  // Asymptotic carbon limit in equilibrium with FeO slag
  const cInf = 0.035; // 0.035% C typical for wrought iron
  const residualCarbon = cInf + (c0 - cInf) * Math.exp(-kDecarb * (timeMin / 60));
  const carbonRemoved = c0 - residualCarbon;
  const decarbRate = (c0 - residualCarbon) / Math.max(0.1, timeMin);

  // 2. Fe-C Phase Equilibrium & "Coming to Nature"
  // Pure iron melts at 1538 °C; eutectic pig iron (4.3% C) melts at 1147 °C.
  // Linearized solidus: T_solidus = 1538 - 88 * %C
  const ironMeltingPointC = 1538 - 88 * residualCarbon;
  const isPastyNatureState = ironMeltingPointC >= tempC;

  // 3. Slag Extrusion Dynamics During Multi-Pass Grooved Rolling
  // Raw sponge ball contains ~16% liquid iron-silicate cinder (fayalite Fe2SiO4)
  const initialSlagPct = 16.0;
  // Each roll pass expels ~42% of remaining liquid slag
  const squeezeEfficiencyPerPass = 0.42;
  const residualSlagPct = initialSlagPct * (1 - squeezeEfficiencyPerPass) ** passes;
  const slagExpelledKg = rawBallMassKg * ((initialSlagPct - residualSlagPct) / 100);
  const spongeBallMassKg = rawBallMassKg - slagExpelledKg;

  // 4. Grooved Roll Geometry & Hydrostatic Compression
  // Initial puddle ball consolidated to ~80x80 mm roughing box
  const h0 = 80;
  const w0 = 80;
  const a0 = h0 * w0;

  // Cumulative reduction per pass (typically ~24% area reduction per pass)
  const areaReductionPerPass = 0.24;
  const totalReductionRatio = 1 / (1 - areaReductionPerPass) ** passes;
  const aFinal = a0 / totalReductionRatio;
  const elongationFactor = totalReductionRatio;

  // Final billet profile dimensions (square / flat)
  const finalBilletWidthMm = Math.sqrt(aFinal * 1.5);
  const finalBilletHeightMm = aFinal / finalBilletWidthMm;

  // Roll bite contact length L_contact = sqrt(R * delta_h)
  const rollRadiusMm = rollDiamMm / 2;
  const deltaHPass1 = h0 * 0.25; // 25% draft on pass 1
  const biteContactLengthMm = Math.sqrt(rollRadiusMm * deltaHPass1);

  // Flow stress of hot wrought iron at 1150 °C: sigma_flow ~ 45 MPa
  const flowStressMpa = 45 * Math.exp(1500 / tempK);
  const hydrostaticSqueezePressureMpa =
    flowStressMpa * (1 + (1.2 * biteContactLengthMm) / (2 * h0));
  // Roll separation force F = P_squeeze * Area_projected
  const projectedAreaMm2 = w0 * biteContactLengthMm;
  const rollSeparationForceKn = (hydrostaticSqueezePressureMpa * projectedAreaMm2) / 1000;

  // 5. Mechanical Properties of Cured Wrought Iron
  // Slag stringers impart fibrous grain structure. Lower residual slag and higher reduction yield higher UTS.
  const tensileStrengthMpa =
    220 + 28 * Math.log(totalReductionRatio) - 4.5 * residualSlagPct + (1 - residualCarbon) * 45;
  const yieldStrengthMpa = tensileStrengthMpa * 0.62;
  const ductilityElongationPercent = Math.max(
    5,
    28 - 0.9 * residualSlagPct + (isPastyNatureState ? 4 : 0),
  );
  const grainFinenessIndex = Math.min(12, 4 + passes * 0.9);

  // 6. Productivity & Industrial Throughput
  // Cort's grooved rolling process produced ~15 tons per 12-hour shift vs 1 ton with forge hammer
  const hourlyIronOutputKg = (spongeBallMassKg * (rollRpm * 0.6 * passes)) / 10;
  // No checked source establishes a speed multiplier. Keep the telemetry
  // neutral rather than repeating the earlier unsupported “15x” claim.
  const productionSpeedupVsHammer = 1.0;
  const rollOmegaRadPerS = (rollRpm * 2 * Math.PI) / 60;
  const rabbleOmegaRadPerS = (rabbleRpm * 2 * Math.PI) / 60;

  return {
    currentTemperatureCelsius: tempC,
    residualCarbonPercent: Number(residualCarbon.toFixed(3)),
    carbonRemovedPercent: Number(carbonRemoved.toFixed(3)),
    decarburizationRatePercentPerMin: Number(decarbRate.toFixed(4)),
    ironMeltingPointCelsius: Math.round(ironMeltingPointC),
    isPastyNatureState,

    initialSlagVolumeFractionPercent: initialSlagPct,
    residualSlagVolumeFractionPercent: Number(residualSlagPct.toFixed(2)),
    slagExpelledKg: Number(slagExpelledKg.toFixed(2)),
    spongeBallMassKg: Number(spongeBallMassKg.toFixed(1)),

    totalAreaReductionRatio: Number(totalReductionRatio.toFixed(2)),
    elongationFactor: Number(elongationFactor.toFixed(2)),
    finalBilletWidthMm: Number(finalBilletWidthMm.toFixed(1)),
    finalBilletHeightMm: Number(finalBilletHeightMm.toFixed(1)),
    biteContactLengthMm: Number(biteContactLengthMm.toFixed(1)),
    rollSeparationForceKn: Number(rollSeparationForceKn.toFixed(1)),
    hydrostaticSqueezePressureMpa: Number(hydrostaticSqueezePressureMpa.toFixed(1)),

    tensileStrengthMpa: Number(tensileStrengthMpa.toFixed(1)),
    yieldStrengthMpa: Number(yieldStrengthMpa.toFixed(1)),
    ductilityElongationPercent: Number(ductilityElongationPercent.toFixed(1)),
    grainFinenessIndex: Number(grainFinenessIndex.toFixed(1)),

    hourlyIronOutputKg: Math.round(hourlyIronOutputKg),
    productionSpeedupVsHammer,

    rollSpeedRpm: rollRpm,
    rollOmegaRadPerS,
    rabbleOmegaRadPerS,
  };
}
