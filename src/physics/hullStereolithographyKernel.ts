/**
 * hullStereolithographyKernel.ts
 *
 * SI computational physics kernel for Charles W. Hull's Stereolithography Apparatus (US Patent 4,575,330).
 *
 * Models the fundamental photopolymerization physics and galvanometer mechanics:
 * 1. Gaussian laser beam irradiance profile: E(x,y) = sqrt(2/pi) * (P_L / (w_0 * v_s)) * exp(-2 y^2 / w_0^2)
 * 2. Beer-Lambert photopolymer absorption law: C_d = D_p * ln(E_max / E_c)
 * 3. Parabolic cured line width: L_w = w_0 * sqrt(2 * ln(E_max / E_c))
 * 4. Interlaminar adhesion ratio: R_adhesion = C_d / delta_z
 * 5. Resin recoating fluid dynamics & viscous meniscus leveling time
 * 6. Typed refusal boundaries for underexposure delamination and overpenetration Z-distortion.
 */

export interface HullStereolithographyControls {
  laserPowerMw: number; // UV laser radiant power (mW) [10..150]
  laserScanSpeedMmS: number; // Galvanometer linear vector scan speed (mm/s) [50..1200]
  beamWaistRadiusUm: number; // Gaussian beam radius w_0 (um) [60..250]
  layerThicknessUm: number; // Sliced layer thickness delta_z (um) [25..250]
  penetrationDepthUm: number; // Resin optical penetration depth D_p (um) [60..250]
  criticalExposureMJCm2: number; // Critical threshold E_c (mJ/cm^2) [4..25]
  resinViscosityCp: number; // Dynamic viscosity of photopolymer (cP) [100..4000]
  elevatorDipSpeedMmS: number; // Elevator z-axis plunge speed (mm/s) [1..25]
  partLayersCount: number; // Sliced layer count in build [1..300]
}

export interface HullStereolithographyTelemetry {
  peakExposureMJCm2: number;
  cureDepthUm: number;
  curedLineWidthUm: number;
  interlayerAdhesionRatio: number;
  isCured: boolean;
  layerBuildTimeSec: number;
  totalBuildTimeMin: number;
  polymerizationConversionPct: number;
  recoatMeniscusSettlingTimeSec: number;
  laserRadiantDoseJ_Cm2: number;
  underexposureRefusal: boolean;
  overpenetrationRefusal: boolean;
  recoatDelayRefusal: boolean;
  refusalReason?: string;
}

export const HULL_SLA_DEFAULT_CONTROLS: HullStereolithographyControls = {
  laserPowerMw: 45.0, // 45 mW UV HeCd / Solid-state laser
  laserScanSpeedMmS: 320.0, // 320 mm/s vector scan velocity
  beamWaistRadiusUm: 110.0, // 110 um spot radius (220 um diameter)
  layerThicknessUm: 100.0, // 100 um (0.1 mm) layer step
  penetrationDepthUm: 140.0, // 140 um optical penetration depth D_p
  criticalExposureMJCm2: 9.2, // 9.2 mJ/cm^2 critical threshold E_c
  resinViscosityCp: 650.0, // 650 cP standard acrylate/epoxy resin
  elevatorDipSpeedMmS: 5.0, // 5 mm/s elevator travel
  partLayersCount: 50, // 50 layers
};

export function readHullStereolithographyControls(
  params?:
    | Partial<HullStereolithographyControls>
    | Record<string, number | boolean | string | undefined>,
): HullStereolithographyControls {
  return {
    laserPowerMw:
      typeof params?.laserPowerMw === "number"
        ? Math.max(5, Math.min(200, params.laserPowerMw))
        : HULL_SLA_DEFAULT_CONTROLS.laserPowerMw,
    laserScanSpeedMmS:
      typeof params?.laserScanSpeedMmS === "number"
        ? Math.max(20, Math.min(2000, params.laserScanSpeedMmS))
        : HULL_SLA_DEFAULT_CONTROLS.laserScanSpeedMmS,
    beamWaistRadiusUm:
      typeof params?.beamWaistRadiusUm === "number"
        ? Math.max(40, Math.min(400, params.beamWaistRadiusUm))
        : HULL_SLA_DEFAULT_CONTROLS.beamWaistRadiusUm,
    layerThicknessUm:
      typeof params?.layerThicknessUm === "number"
        ? Math.max(10, Math.min(400, params.layerThicknessUm))
        : HULL_SLA_DEFAULT_CONTROLS.layerThicknessUm,
    penetrationDepthUm:
      typeof params?.penetrationDepthUm === "number"
        ? Math.max(40, Math.min(400, params.penetrationDepthUm))
        : HULL_SLA_DEFAULT_CONTROLS.penetrationDepthUm,
    criticalExposureMJCm2:
      typeof params?.criticalExposureMJCm2 === "number"
        ? Math.max(2, Math.min(50, params.criticalExposureMJCm2))
        : HULL_SLA_DEFAULT_CONTROLS.criticalExposureMJCm2,
    resinViscosityCp:
      typeof params?.resinViscosityCp === "number"
        ? Math.max(50, Math.min(8000, params.resinViscosityCp))
        : HULL_SLA_DEFAULT_CONTROLS.resinViscosityCp,
    elevatorDipSpeedMmS:
      typeof params?.elevatorDipSpeedMmS === "number"
        ? Math.max(0.5, Math.min(40, params.elevatorDipSpeedMmS))
        : HULL_SLA_DEFAULT_CONTROLS.elevatorDipSpeedMmS,
    partLayersCount:
      typeof params?.partLayersCount === "number"
        ? Math.max(1, Math.min(500, Math.round(params.partLayersCount)))
        : HULL_SLA_DEFAULT_CONTROLS.partLayersCount,
  };
}

export function stepHullStereolithographySi(
  controls: HullStereolithographyControls,
): HullStereolithographyTelemetry {
  const P_L_Watts = controls.laserPowerMw * 1e-3;
  const v_s_m_s = controls.laserScanSpeedMmS * 1e-3;
  const w_0_m = controls.beamWaistRadiusUm * 1e-6;
  const w_0_cm = w_0_m * 100;
  const v_s_cm_s = v_s_m_s * 100;

  // 1. Peak centerline exposure: E_max = sqrt(2/pi) * (P_L / (w_0 * v_s)) in J/cm^2 -> mJ/cm^2
  const factor = Math.sqrt(2 / Math.PI);
  const E_max_J_cm2 = factor * (P_L_Watts / (w_0_cm * v_s_cm_s));
  const peakExposureMJCm2 = E_max_J_cm2 * 1000;

  const isCured = peakExposureMJCm2 > controls.criticalExposureMJCm2;

  // 2. Cure Depth via Beer-Lambert Law: C_d = D_p * ln(E_max / E_c)
  let cureDepthUm = 0;
  let curedLineWidthUm = 0;
  let conversionPct = 0;

  if (isCured) {
    const exposureRatio = peakExposureMJCm2 / controls.criticalExposureMJCm2;
    cureDepthUm = controls.penetrationDepthUm * Math.log(exposureRatio);
    curedLineWidthUm = 2 * controls.beamWaistRadiusUm * Math.sqrt(0.5 * Math.log(exposureRatio));
    conversionPct = Math.min(96, 55 + 32 * (1 - Math.exp(-0.8 * Math.log(exposureRatio))));
  }

  // 3. Interlayer Adhesion
  const interlayerAdhesionRatio = cureDepthUm / Math.max(1, controls.layerThicknessUm);

  // 4. Fluid Mechanics: Recoating & Meniscus Leveling Time
  // Time = elevator travel + fluid settling (scales with viscosity and vat width)
  const travelTimeSec = (controls.layerThicknessUm * 1e-3 * 2) / controls.elevatorDipSpeedMmS;
  const recoatMeniscusSettlingTimeSec = (controls.resinViscosityCp / 1000) * 1.8 + travelTimeSec;

  // 5. Scan Time per Layer (nominal 200 mm vector contour per layer)
  const nominalVectorLengthMm = 250;
  const scanTimeSec = nominalVectorLengthMm / controls.laserScanSpeedMmS;
  const layerBuildTimeSec = scanTimeSec + recoatMeniscusSettlingTimeSec;
  const totalBuildTimeMin = (layerBuildTimeSec * controls.partLayersCount) / 60;

  // 6. Refusal Boundaries
  let underexposureRefusal = false;
  let overpenetrationRefusal = false;
  let recoatDelayRefusal = false;
  let refusalReason: string | undefined;

  if (!isCured || interlayerAdhesionRatio < 1.0) {
    underexposureRefusal = true;
    refusalReason = `Underexposure delamination: Cure depth (${cureDepthUm.toFixed(1)} µm) is less than layer step (${controls.layerThicknessUm} µm). Layers will separate.`;
  } else if (interlayerAdhesionRatio > 2.8) {
    overpenetrationRefusal = true;
    refusalReason = `Overpenetration Z-distortion: Cure depth (${cureDepthUm.toFixed(1)} µm) exceeds 2.8x layer thickness, causing uncontrolled deep polymerization.`;
  } else if (recoatMeniscusSettlingTimeSec > 15) {
    recoatDelayRefusal = true;
    refusalReason = `High resin viscosity (${controls.resinViscosityCp} cP) prevents timely surface recoating, causing air bubble voids.`;
  }

  return {
    peakExposureMJCm2,
    cureDepthUm,
    curedLineWidthUm,
    interlayerAdhesionRatio,
    isCured,
    layerBuildTimeSec,
    totalBuildTimeMin,
    polymerizationConversionPct: isCured ? conversionPct : 0,
    recoatMeniscusSettlingTimeSec,
    laserRadiantDoseJ_Cm2: E_max_J_cm2,
    underexposureRefusal,
    overpenetrationRefusal,
    recoatDelayRefusal,
    refusalReason,
  };
}

export function stepHullStereolithography(
  params: Record<
    string,
    number | boolean | string
  > = HULL_SLA_DEFAULT_CONTROLS as unknown as Record<string, number | boolean | string>,
): HullStereolithographyTelemetry {
  return stepHullStereolithographySi(readHullStereolithographyControls(params));
}
