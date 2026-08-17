/** Coarse SI dimension tag for the live HUD. Not a full unit algebra. */
export function qtyDimension(unit: string): string {
  const u = unit.trim().toLowerCase();
  if (u === "n" || u === "lbf") return "ML/T²";
  if (u === "n·m" || u === "n.m" || u === "nm") return "ML²/T²";
  if (u === "w") return "ML²/T³";
  if (u === "j") return "ML²/T²";
  if (u === "v") return "ML²/IT³";
  if (u === "a" || u === "ma" || u === "µa") return "I";
  if (u === "ω" || u === "ohm" || u === "Ω") return "ML²/I²T³";
  if (u === "k" || u === "°c") return "Θ";
  if (u === "m/s" || u === "mph") return "L/T";
  if (u === "hz" || u === "khz" || u === "mhz" || u === "rpm") return "1/T";
  if (u === "s" || u === "ms" || u === "ns" || u === "ps") return "T";
  if (u === "m" || u === "mm" || u === "µm" || u === "cm" || u === "ft") return "L";
  if (u === "kg" || u === "g") return "M";
  if (u === "pa" || u === "kpa" || u === "mpa" || u === "psi" || u === "atm" || u === "torr")
    return "M/LT²";
  if (u === "db" || u === "sones") return "1";
  return "1";
}
