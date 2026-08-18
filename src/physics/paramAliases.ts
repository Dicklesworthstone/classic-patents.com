/**
 * Private 3D slider names → registry control ids.
 * 3D files keep reverting to local keys; the bus stores the canonical id
 * and expands the alias on read so both faces stay on one number.
 */

export interface ParamAlias {
  canonical: string;
  toCanonical?: (aliasValue: number) => number;
  fromCanonical?: (canonicalValue: number) => number;
}

const same = (canonical: string): ParamAlias => ({ canonical });

/** Per-patent alias map. Not used for peer-WIP Carrier / Linde / Teleautomaton. */
export const PATENT_PARAM_ALIASES: Record<string, Record<string, ParamAlias>> = {
  "us-319596-maxim-machine-gun": { fireRateRpm: same("firingRate") },
  "us-124404-westinghouse-air-brake": { brakePressurePsi: same("trainPipePressure") },
  "us-233692-pelton-water-wheel": { rotorRpm: same("runnerRpm") },
  "us-542846-diesel-engine": { compressionRatio: same("compRatio") },
  "us-347140-thomson-welding": { currentAmperes: same("weldCurrentAmps") },
  "us-105338-hyatt-celluloid": { tempCelsius: same("steamTempC") },
  "us-78317-nobel-dynamite": { ngConcentration: same("ngConcentrationPct") },
  "us-135245-pasteur-fermentation": { tempCelsius: same("wortTempC") },
  "us-247804-delaval-separator": { rotorRpm: same("bowlRpm") },
  "us-200521-edison-phonograph": { cylinderRpm: same("mandrelRpm") },
  "us-x8277-mccormick-reaper": { groundSpeedMph: same("forwardSpeedMph") },
  "us-120057-gramme-dynamo": { rotorRpm: same("shaftRpm") },
  "us-395781-hollerith-tabulating": { tabulatingSpeed: same("cardsPerMin") },
  "us-6162-corliss-steam-engine": {
    boilerPressure: same("steamPressurePsi"),
    boilerPressurePsi: same("steamPressurePsi"),
    cutoffPercentage: same("cutoffPct"),
  },
  "us-79265-sholes-typewriter": { typingWpm: same("typingSpeedWpm") },
  "us-132-davenport-electric-motor": {
    rotorRpm: {
      canonical: "batteryVoltage",
      toCanonical: (rpm) => (rpm / 450) * 12,
      fromCanonical: (volts) => (volts / 12) * 450,
    },
  },
  "us-157124-glidden-barbed-wire": {
    machineRpm: {
      canonical: "twistsPerFoot",
      toCanonical: (rpm) => Math.max(2, Math.min(10, rpm / 24)),
      fromCanonical: (twists) => twists * 24,
    },
  },
  "us-621195-zeppelin-airship": {
    airspeedMph: {
      canonical: "flightSpeedKnots",
      toCanonical: (mph) => mph * 0.868976,
      fromCanonical: (kn) => kn * 1.15078,
    },
  },
  "us-470918-reno-escalator": {
    speedFpm: {
      canonical: "beltSpeed",
      toCanonical: (fpm) => (fpm * 0.3048) / 60,
      fromCanonical: (mps) => (mps * 60) / 0.3048,
    },
  },
  "us-388850-eastman-kodak": {
    shutterSpeed: {
      canonical: "shutterSpeed",
      toCanonical: (v) => (v > 1 ? 1 / v : v),
    },
  },
  "us-313224-mergenthaler-linotype": {
    castingLpm: {
      canonical: "matrixRate",
      toCanonical: (lpm) => lpm * 42,
      fromCanonical: (cpm) => cpm / 42,
    },
  },
  "us-328710-parsons-turbine": {
    steamPressureBar: {
      canonical: "inletPressurePsi",
      toCanonical: (bar) => bar * 14.5038,
      fromCanonical: (psi) => psi / 14.5038,
    },
  },
  "us-3923554-boyle-smith-ccd": { clockSpeedFactor: same("clockFreq") },
};

export function canonicalizeParam(
  patentId: string,
  paramId: string,
  value: number,
): { id: string; value: number } {
  const spec = PATENT_PARAM_ALIASES[patentId]?.[paramId];
  if (!spec) return { id: paramId, value };
  return {
    id: spec.canonical,
    value: spec.toCanonical ? spec.toCanonical(value) : value,
  };
}

export function expandParamAliases(
  patentId: string,
  params: Record<string, number>,
): Record<string, number> {
  const aliases = PATENT_PARAM_ALIASES[patentId];
  if (!aliases) return params;
  const out = { ...params };
  for (const [alias, spec] of Object.entries(aliases)) {
    const canon = out[spec.canonical];
    if (typeof canon === "number") {
      out[alias] = spec.fromCanonical ? spec.fromCanonical(canon) : canon;
    }
  }
  return out;
}
