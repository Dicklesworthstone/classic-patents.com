/**
 * Source-bounded geometry kernel for de Mestral's US 2,717,437.
 *
 * The grant describes a woven foundation, an auxiliary synthetic pile formed
 * into loops over a heated grooved bar, an off-centre cut that leaves a hook
 * strand and a straight strand, and two pieces of that same hook fabric turned
 * 90 degrees so their hooks interengage. It does not publish the material or
 * test data needed for a fastening-force or energy calculation.
 */

export const MESTRAL_VELCRO_SOURCE_BOUNDARY =
  "US 2,717,437 supplies hook-pile topology and the 90-degree engagement arrangement, but no filament diameter, hook length or density, Young's modulus, tape width, engagement population, force-displacement curve, peel rate, or calibrated thermal-setting law. The controls below are explicitly illustrative geometry controls. Aggregate shear, peel force, release force, thermal-retention percentage, power, and closed energy accounting are refused; no FrankenSim solid/contact WASM module is bound in this browser build.";

export interface MestralVelcroControls {
  /** Reader-selected display diameter; not a dimension printed in the grant. */
  filamentDiameterMm: number;
  /** Reader-selected display hook height; not a dimension printed in the grant. */
  hookLengthMm: number;
  /** Reader-selected display population, quantized to one through five rows. */
  hookDensityPerCm2: number;
  /** Display direction of the externally applied peel-clamp boundary. */
  peelAngleDeg: number;
  /** Normalized source-view peel-front location, not measured travel. */
  peelProgress: number;
  /** Claim-1 topology gate: heated shape-setting occurs before the loop is cut. */
  thermalSettingPresent: number;
  /** Claim-3 topology gate: the raised pile terminates in material-engaging hooks. */
  hookPilePresent: number;
}

export interface MestralVelcroTelemetry {
  /** Exact geometric second moment for the reader-selected circular section. */
  circularSectionSecondMomentM4: number;
  /** Dimensionless d^4/L^3 geometry index, normalized to the default exhibit. */
  relativeBendingGeometryIndex: number;
  /** One through five rows used by both rendered projections. */
  visiblePileRows: number;
  /** Kernel-owned normalized display coordinate shared by every visual face. */
  peelProgress: number;
  /** True only when both source-required topology gates are present. */
  hookInterengagementAvailable: boolean;
  thermalSettingPresent: boolean;
  hookPilePresent: boolean;
  quantitativeFasteningAvailable: false;
  quantitativeEnergyAvailable: false;
  sourceBoundary: string;
}

export const MESTRAL_VELCRO_DEFAULTS: MestralVelcroControls = {
  filamentDiameterMm: 0.2,
  hookLengthMm: 1.8,
  hookDensityPerCm2: 64,
  peelAngleDeg: 90,
  peelProgress: 0.35,
  thermalSettingPresent: 1,
  hookPilePresent: 1,
};

function finiteOr(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function readMestralVelcroControls(params: Record<string, number>): MestralVelcroControls {
  return {
    filamentDiameterMm: clamp(
      finiteOr(
        params.filamentDiameterMm ??
          params.diameter ??
          params.filamentDiameter ??
          params.diameterMm,
        MESTRAL_VELCRO_DEFAULTS.filamentDiameterMm,
      ),
      0.1,
      0.35,
    ),
    hookLengthMm: clamp(
      finiteOr(
        params.hookLengthMm ??
          params.length ??
          params.hookHeight ??
          params.hookLength ??
          params.heightMm,
        MESTRAL_VELCRO_DEFAULTS.hookLengthMm,
      ),
      1,
      3,
    ),
    hookDensityPerCm2: clamp(
      finiteOr(
        params.hookDensityPerCm2 ??
          params.density ??
          params.pileDensity ??
          params.hookDensity ??
          params.densityPerCm2,
        MESTRAL_VELCRO_DEFAULTS.hookDensityPerCm2,
      ),
      20,
      120,
    ),
    peelAngleDeg: clamp(
      finiteOr(
        params.peelAngleDeg ??
          params.angle ??
          params.peelAngle ??
          params.clampAngle ??
          params.angleDeg,
        MESTRAL_VELCRO_DEFAULTS.peelAngleDeg,
      ),
      20,
      160,
    ),
    peelProgress: clamp(
      finiteOr(
        params.peelProgress ??
          params.progress ??
          params.peelFront ??
          params.advance ??
          params.peelAdvance,
        MESTRAL_VELCRO_DEFAULTS.peelProgress,
      ),
      0.05,
      0.95,
    ),
    thermalSettingPresent:
      finiteOr(
        params.thermalSettingPresent ?? params.claim1 ?? params.thermalSetting,
        MESTRAL_VELCRO_DEFAULTS.thermalSettingPresent,
      ) >= 0.5
        ? 1
        : 0,
    hookPilePresent:
      finiteOr(
        params.hookPilePresent ?? params.claim3 ?? params.hookPile,
        MESTRAL_VELCRO_DEFAULTS.hookPilePresent,
      ) >= 0.5
        ? 1
        : 0,
  };
}

export function stepMestralVelcroSi(
  controls: MestralVelcroControls,
  _timeSec = 0,
): MestralVelcroTelemetry {
  const safe = readMestralVelcroControls(controls as unknown as Record<string, number>);
  const diameterM = safe.filamentDiameterMm * 1e-3;
  const circularSectionSecondMomentM4 = (Math.PI * diameterM ** 4) / 64;
  const diameterRatio = safe.filamentDiameterMm / MESTRAL_VELCRO_DEFAULTS.filamentDiameterMm;
  const lengthRatio = safe.hookLengthMm / MESTRAL_VELCRO_DEFAULTS.hookLengthMm;
  const relativeBendingGeometryIndex = diameterRatio ** 4 / lengthRatio ** 3;
  const visiblePileRows = clamp(Math.round(1 + ((safe.hookDensityPerCm2 - 20) / 100) * 4), 1, 5);
  const thermalSettingPresent = safe.thermalSettingPresent >= 0.5;
  const hookPilePresent = safe.hookPilePresent >= 0.5;

  return {
    circularSectionSecondMomentM4,
    relativeBendingGeometryIndex,
    visiblePileRows,
    peelProgress: safe.peelProgress,
    hookInterengagementAvailable: thermalSettingPresent && hookPilePresent,
    thermalSettingPresent,
    hookPilePresent,
    quantitativeFasteningAvailable: false,
    quantitativeEnergyAvailable: false,
    sourceBoundary: MESTRAL_VELCRO_SOURCE_BOUNDARY,
  };
}
