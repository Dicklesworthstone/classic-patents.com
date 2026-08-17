/**
 * Shared step buffers for CCD wells, Howe lockstitch, and Engelbart wheels.
 * Components must draw these values rather than inventing a second formula.
 */

export function stepCcdWells(
  phase: 1 | 2 | 3,
  lux: number,
  clockMhz: number,
): {
  wells: [number, number, number];
  photoElectrons: number;
  cte: number;
} {
  const cte = Math.max(0.999, 0.99995 - clockMhz * 1e-5);
  const photoElectrons = Math.round((lux / 1000) * 45000);
  const wells: [number, number, number] = [0, 0, 0];
  const idx = phase - 1;
  wells[idx] = photoElectrons;
  const residual = photoElectrons * (1 - cte);
  wells[(idx + 2) % 3] += residual;
  return { wells, photoElectrons, cte };
}

export function stepHoweLockstitch(crankDeg: number): {
  needleY: number;
  shuttleX: number;
  loopOpen: boolean;
  loopWidth: number;
} {
  const rad = (crankDeg * Math.PI) / 180;
  const loopOpen = crankDeg > 80 && crankDeg < 220;
  return {
    needleY: Math.sin(rad) * 45,
    shuttleX: Math.cos(rad) * 60,
    loopOpen,
    loopWidth: loopOpen ? Math.sin((crankDeg - 80) * (Math.PI / 140)) * 24 : 0,
  };
}

export function stepEngelbartResolver(
  dxSvg: number,
  dySvg: number,
  wheelRadiusMm: number,
  pulsesPerRev: number,
): { dThetaX: number; dThetaY: number; pulsesX: number; pulsesY: number } {
  const mmPerSvg = 0.25;
  const dxMm = dxSvg * mmPerSvg;
  const dyMm = dySvg * mmPerSvg;
  const circ = 2 * Math.PI * wheelRadiusMm;
  const dThetaX = circ > 0 ? (dxMm / circ) * 2 * Math.PI : 0;
  const dThetaY = circ > 0 ? (dyMm / circ) * 2 * Math.PI : 0;
  const pulsesX = Math.round((dThetaX / (2 * Math.PI)) * pulsesPerRev);
  const pulsesY = Math.round((dThetaY / (2 * Math.PI)) * pulsesPerRev);
  return { dThetaX, dThetaY, pulsesX, pulsesY };
}
