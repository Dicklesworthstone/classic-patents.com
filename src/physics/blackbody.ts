/** Approximate CIE-like RGB from a blackbody temperature in kelvin. */
export function blackbodyRgb(tempKelvin: number): string {
  const t = Math.max(800, Math.min(4000, tempKelvin)) / 100;
  let r: number;
  let g: number;
  let b: number;
  if (t <= 66) {
    r = 255;
    g = 99.47 * Math.log(t) - 161.12;
  } else {
    r = 329.7 * t ** -0.1332;
    g = 288.12 * t ** -0.0755;
  }
  if (t >= 66) {
    b = 255;
  } else if (t <= 19) {
    b = 0;
  } else {
    b = 138.52 * Math.log(t - 10) - 305.04;
  }
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return `rgb(${clamp(r)}, ${clamp(g)}, ${clamp(b)})`;
}
