export interface GoddardThermo {
  chamberTempK: number;
  exhaustTempK: number;
  gamma: number;
  ispSec: number;
  veMps: number;
}

/** LOX–gasoline isentropic estimate from chamber pressure and expansion ratio. */
export function goddardThermo(chamberPsi: number, expansionRatio: number): GoddardThermo {
  const gamma = 1.24;
  const pcPa = chamberPsi * 6894.76;
  const chamberTempK = Math.round(2400 + (pcPa / 2.4e6) * 400);
  const peOverPc = 1 / Math.max(1.4, expansionRatio ** 1.15);
  const exhaustTempK = Math.round(chamberTempK * peOverPc ** ((gamma - 1) / gamma));
  const veMps = Math.round(
    Math.sqrt(
      ((2 * gamma) / (gamma - 1)) * 287 * chamberTempK * (1 - peOverPc ** ((gamma - 1) / gamma)),
    ),
  );
  return {
    chamberTempK,
    exhaustTempK,
    gamma,
    ispSec: Number((veMps / 9.80665).toFixed(1)),
    veMps,
  };
}

export interface VulcanKinetics {
  rateRel: number;
  crosslinkMolCm3: number;
  regime: "too-cold" | "cure" | "scorch";
}

/** Arrhenius-ish sulfur cure: peak near 145 °C, collapse above ~180 °C. */
export function vulcanKinetics(tempC: number, sulfurPct: number): VulcanKinetics {
  const tK = tempC + 273.15;
  const arrh = Math.exp(-6500 * (1 / tK - 1 / 418));
  const window = tempC < 110 ? 0.15 : tempC > 175 ? 0.35 : 1;
  const rateRel = arrh * window * (sulfurPct / 8);
  const regime: VulcanKinetics["regime"] =
    tempC < 120 ? "too-cold" : tempC > 170 ? "scorch" : "cure";
  return {
    rateRel,
    crosslinkMolCm3: Number(((sulfurPct / 8) * (regime === "cure" ? 1 : 0.4) * 0.12).toFixed(3)),
    regime,
  };
}
