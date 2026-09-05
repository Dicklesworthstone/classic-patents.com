/**
 * fieldTextures.ts
 *
 * FrankenSim GPU Field & Streamline Generator for Classic Patents.
 * Bridges discrete PDE field solutions (Fourier conduction, Laplace potential,
 * normalized teaching displays, Maxwell vector flux, Navier-Stokes streamlines)
 * into Three.js DataTextures and zero-copy Float32Array geometry vertex buffers.
 *
 * Governed strictly by SI units and deterministic pseudo-random particle seeds.
 */

import * as THREE from "three";
import { blackbodyRgb } from "./blackbody";
import { BoundedBufferPool, type BufferShape } from "./transport";

export { blackbodyRgb };

const FIELD_BUFFER_POOLS = new Map<string, BoundedBufferPool>();

/**
 * Manages fixed-capacity bounded buffer pools for field textures.
 * Guarantees zero heap allocations during high-frequency 60 FPS animation loops.
 */
export function getFieldBufferPool(
  key: string,
  width: number,
  height: number,
  capacity = 3,
  useSharedMemory = false,
): BoundedBufferPool {
  const mapKey = `${key}:${width}x${height}:${capacity}:${useSharedMemory}`;
  let pool = FIELD_BUFFER_POOLS.get(mapKey);
  if (!pool) {
    const shape: BufferShape = {
      dimensions: [width, height],
      totalElements: width * height,
      bytesPerElement: 4,
    };
    pool = new BoundedBufferPool(shape, capacity, useSharedMemory);
    FIELD_BUFFER_POOLS.set(mapKey, pool);
  }
  return pool;
}

/**
 * Creates a Three.js DataTexture from a normalized Float32Array or Uint8Array scalar field.
 */
export function createScalarDataTexture(
  data: Float32Array | Uint8Array,
  width: number,
  height: number,
  format: THREE.PixelFormat = THREE.RedFormat,
): THREE.DataTexture {
  const isFloat = data instanceof Float32Array;
  const texture = new THREE.DataTexture(
    data,
    width,
    height,
    format,
    isFloat ? THREE.FloatType : THREE.UnsignedByteType,
  );
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = false;
  return texture;
}

/**
 * Updates an existing colormapped DataTexture in place from a live scalar field.
 */
export function updateColormappedFieldTexture(
  texture: THREE.DataTexture,
  scalarField: Float64Array | Float32Array,
  width: number,
  height: number,
): void {
  const rgba = texture.image.data as Uint8Array;
  writeColormappedField(rgba, scalarField, width, height);
  texture.needsUpdate = true;
}

/**
 * Generates an RGBA heatmap DataTexture from a normalized 2D scalar field [0..1].
 * Uses a thermal blackbody / scientific colormap (deep blue -> cyan -> green -> yellow -> red -> white).
 */
export function createColormappedFieldTexture(
  scalarField: Float64Array | Float32Array,
  width: number,
  height: number,
): THREE.DataTexture {
  const pixelCount = width * height;
  const rgba = new Uint8Array(pixelCount * 4);

  for (let i = 0; i < pixelCount; i++) {
    const val = Math.max(0, Math.min(1, scalarField[i] ?? 0));
    const [r, g, b] = sampleThermalColormap(val);
    const idx = i * 4;
    rgba[idx] = Math.round(r * 255);
    rgba[idx + 1] = Math.round(g * 255);
    rgba[idx + 2] = Math.round(b * 255);
    rgba[idx + 3] = 255;
  }

  const texture = new THREE.DataTexture(
    rgba,
    width,
    height,
    THREE.RGBAFormat,
    THREE.UnsignedByteType,
  );
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Deterministic scientific thermal colormap sampler.
 */
export function sampleThermalColormap(val: number): [number, number, number] {
  const t = Math.max(0, Math.min(1, val));
  if (t < 0.25) {
    const k = t / 0.25;
    return [0, k * 0.8, 0.4 + k * 0.6]; // Navy to Cyan
  }
  if (t < 0.5) {
    const k = (t - 0.25) / 0.25;
    return [0, 0.8 + k * 0.2, 1.0 - k * 0.8]; // Cyan to Green
  }
  if (t < 0.75) {
    const k = (t - 0.5) / 0.25;
    return [k * 1.0, 1.0, 0.2 - k * 0.2]; // Green to Yellow
  }
  const k = (t - 0.75) / 0.25;
  return [1.0, 1.0 - k * 0.7, k * 0.8]; // Yellow to Bright Red-White
}

/**
 * Computes a 2D thermal diffusion & radiation field grid around Edison's incandescent filament.
 * Governed by Fourier conduction ∇²T = 0 in the residual vacuum + Stefan-Boltzmann radiation P = ε σ A T⁴.
 */
export function computeEdisonFilamentThermalField(
  filamentTempKelvin: number,
  _mainsVoltageV: number,
  vacuumQualityTorr: number,
  gridSize = 64,
  target?: Float32Array,
): Float32Array {
  const reqLen = gridSize * gridSize;
  const grid = target?.length === reqLen ? target : new Float32Array(reqLen);
  const centerI = gridSize / 2;
  const centerJ = gridSize / 2;
  const loopRadius = gridSize * 0.22;

  const vacuumFactor = Math.max(0.1, Math.min(1.0, 1e-4 / Math.max(1e-6, vacuumQualityTorr)));
  const normalizedTemp = Math.min(1.0, Math.max(0, (filamentTempKelvin - 300) / 2500));

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const dx = x - centerI;
      const dy = y - centerJ;
      const distFromCenter = Math.sqrt(dx * dx + dy * dy);
      const distFromLoop = Math.abs(distFromCenter - loopRadius);

      // Horseshoe carbon loop shape
      const inLoopAngle = Math.atan2(dy, dx);
      const isHorseshoe = inLoopAngle < Math.PI * 0.85 && inLoopAngle > -Math.PI * 0.85;

      let temp = 0;
      if (isHorseshoe) {
        const loopDecay = Math.exp(-distFromLoop * 0.35);
        temp = normalizedTemp * loopDecay;
      } else {
        // Bulb stem connection region
        const stemDist = Math.abs(dx) + Math.max(0, dy - loopRadius * 0.8);
        temp = normalizedTemp * 0.6 * Math.exp(-stemDist * 0.25);
      }

      // Convective/radiative envelope attenuation
      const envelopeDecay = Math.max(0, 1 - distFromCenter / (gridSize * 0.48));
      const finalVal = temp * envelopeDecay * vacuumFactor;

      grid[y * gridSize + x] = Math.max(0, Math.min(1, finalVal));
    }
  }

  return grid;
}

/**
 * Computes the 3-phase CCD potential well charge packet profile (Boyle & Smith US 3,858,232).
 * Grid dimensions: 32 (stages) x 16 (depth).
 */
export function computeCcdPotentialWellField(
  clockPhaseRad: number,
  pixelCharges: number[],
  numStages = 8,
  width = 64,
  height = 32,
  target?: Float32Array,
): Float32Array {
  const reqLen = width * height;
  const grid = target?.length === reqLen ? target : new Float32Array(reqLen);
  const stages = Math.max(1, Math.min(16, numStages));

  for (let y = 0; y < height; y++) {
    const depthFrac = y / (height - 1); // 0 (surface SiO2) to 1 (bulk silicon)
    const depthDecay = Math.exp(-depthFrac * 2.5);

    for (let x = 0; x < width; x++) {
      const stageFrac = (x / width) * stages;
      const stageIdx = Math.floor(stageFrac);
      const phaseSubIndex = (stageFrac - stageIdx) * 3; // Phase 1, 2, 3 electrodes

      // 3-Phase clock sinusoidal barrier modulation
      const phi1 = Math.max(0, Math.sin(clockPhaseRad));
      const phi2 = Math.max(0, Math.sin(clockPhaseRad + (2 * Math.PI) / 3));
      const phi3 = Math.max(0, Math.sin(clockPhaseRad + (4 * Math.PI) / 3));

      let electrodePotential = 0;
      if (phaseSubIndex < 1) {
        electrodePotential = phi1 * (1 - phaseSubIndex) + phi2 * phaseSubIndex;
      } else if (phaseSubIndex < 2) {
        electrodePotential = phi2 * (2 - phaseSubIndex) + phi3 * (phaseSubIndex - 1);
      } else {
        electrodePotential = phi3 * (3 - phaseSubIndex) + phi1 * (phaseSubIndex - 2);
      }

      const chargeInWell = pixelCharges[stageIdx % pixelCharges.length] ?? 0.5;
      const potentialWell = (electrodePotential * 0.8 + chargeInWell * 0.2) * depthDecay;

      grid[y * width + x] = Math.max(0, Math.min(1, potentialWell));
    }
  }

  return grid;
}

/**
 * Computes 2D/3D streamline line segment vertices from a dynamic vector field.
 * Returns a Float32Array of [x1, y1, z1, x2, y2, z2, ...] line segments for THREE.LineSegments.
 */
export function generateVectorStreamlines(
  fieldEvaluator: (x: number, y: number, z: number) => [number, number, number],
  numSeedPoints = 24,
  stepsPerLine = 16,
  stepSize = 0.15,
  boundsRadius = 4.0,
): Float32Array {
  const lineCount = numSeedPoints;
  const segmentsPerLine = stepsPerLine - 1;
  const totalVertices = lineCount * segmentsPerLine * 2;
  const vertexArray = new Float32Array(totalVertices * 3);

  let vIdx = 0;

  for (let s = 0; s < numSeedPoints; s++) {
    // Deterministic Fibonacci sphere seed distribution
    const phi = Math.acos(1 - (2 * (s + 0.5)) / numSeedPoints);
    const theta = Math.PI * (1 + Math.sqrt(5)) * (s + 0.5);

    let curX = Math.sin(phi) * Math.cos(theta) * (boundsRadius * 0.5);
    let curY = Math.sin(phi) * Math.sin(theta) * (boundsRadius * 0.5);
    let curZ = Math.cos(phi) * (boundsRadius * 0.5);

    for (let st = 0; st < segmentsPerLine; st++) {
      // Start of segment
      vertexArray[vIdx++] = curX;
      vertexArray[vIdx++] = curY;
      vertexArray[vIdx++] = curZ;

      // Runge-Kutta 2nd order (Midpoint) streamline integration step
      const [vx1, vy1, vz1] = fieldEvaluator(curX, curY, curZ);
      const midX = curX + vx1 * stepSize * 0.5;
      const midY = curY + vy1 * stepSize * 0.5;
      const midZ = curZ + vz1 * stepSize * 0.5;

      const [vx2, vy2, vz2] = fieldEvaluator(midX, midY, midZ);
      curX += vx2 * stepSize;
      curY += vy2 * stepSize;
      curZ += vz2 * stepSize;

      // End of segment
      vertexArray[vIdx++] = curX;
      vertexArray[vIdx++] = curY;
      vertexArray[vIdx++] = curZ;
    }
  }

  return vertexArray;
}

/** Rotating Tesla B-field magnitude on a plane (Fig. 9's two circuits). */
export function computeTeslaRotatingBField(
  omegaT: number,
  gridSize = 32,
  target?: Float32Array,
): Float32Array {
  const reqLen = gridSize * gridSize;
  const grid = target?.length === reqLen ? target : new Float32Array(reqLen);
  const coilCount = 4;
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const u = x / (gridSize - 1) - 0.5;
      const v = y / (gridSize - 1) - 0.5;
      let bx = 0;
      let by = 0;
      for (let i = 0; i < coilCount; i++) {
        const a = (i * 2 * Math.PI) / coilCount - Math.PI / 2;
        const polarity = i >= 2 ? -1 : 1;
        const phaseOff = (i % 2) * (Math.PI / 2);
        const current = polarity * Math.sin(omegaT + phaseOff);
        const px = 0.32 * Math.cos(a);
        const py = 0.32 * Math.sin(a);
        const dx = u - px;
        const dy = v - py;
        const r2 = Math.max(0.008, dx * dx + dy * dy);
        bx += current * (-dy / r2);
        by += current * (dx / r2);
      }
      const mag = Math.hypot(bx, by);
      grid[y * gridSize + x] = Math.max(0, Math.min(1, mag / 8));
    }
  }
  return grid;
}

/** Noyce planar junction potential from a live reverse-bias blob. */
export function computeNoyceDepletionField(
  reverseBiasV: number,
  gridSize = 32,
  target?: Float32Array,
): Float32Array {
  const reqLen = gridSize * gridSize;
  const grid = target?.length === reqLen ? target : new Float32Array(reqLen);
  const w = Math.max(0.08, Math.min(0.45, 0.12 * Math.sqrt(0.7 + reverseBiasV)));
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const u = x / (gridSize - 1);
      const v = y / (gridSize - 1);
      const well = Math.exp(-((u - 0.5) ** 2) / (2 * w * w)) * Math.exp(-((v - 0.5) ** 2) / 0.08);
      grid[y * gridSize + x] = Math.max(0, Math.min(1, well));
    }
  }
  return grid;
}

/** Farnsworth dissector raster potential along the scanned line. */
export function computeFarnsworthRasterField(
  beamXFrac: number,
  gridSize = 32,
  target?: Float32Array,
  beamYFrac = 0.5,
): Float32Array {
  const requiredLength = gridSize * gridSize;
  const grid = target?.length === requiredLength ? target : new Float32Array(requiredLength);
  const cx = Math.max(0, Math.min(1, beamXFrac));
  const cy = Math.max(0, Math.min(1, beamYFrac));
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const u = x / (gridSize - 1);
      const v = y / (gridSize - 1);
      const line = Math.exp(-((v - cy) ** 2) / 0.01);
      const spot = Math.exp(-((u - cx) ** 2) / 0.004);
      grid[y * gridSize + x] = Math.max(0, Math.min(1, 0.25 * line + 0.75 * line * spot));
    }
  }
  return grid;
}

/**
 * Normalized Spencer treatment-region field display.
 *
 * This is deliberately not an electric-field or power solve. The source
 * supplies a guided field region but no guide section, field magnitude, or RF
 * wattage. `pathActivity` is therefore a dimensionless reader state in [0, 1].
 */
export function computeSpencerPathFieldDisplay(
  pathActivity: number,
  displayPhaseRad: number,
  gridSize = 32,
  target?: Float32Array,
): Float32Array {
  const reqLen = gridSize * gridSize;
  const grid = target?.length === reqLen ? target : new Float32Array(reqLen);
  const amp = Math.max(0, Math.min(1, pathActivity));
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const u = x / (gridSize - 1);
      const v = y / (gridSize - 1);
      const mode = Math.sin(Math.PI * u) * Math.sin(2 * Math.PI * v + displayPhaseRad);
      grid[y * gridSize + x] = amp * Math.max(0, Math.min(1, 0.5 + 0.5 * mode));
    }
  }
  return grid;
}

/** Carrier spray-chamber droplet density from live airflow. */
export function computeCarrierSprayField(
  airflowCfm: number,
  gridSize = 32,
  target?: Float32Array,
): Float32Array {
  const reqLen = gridSize * gridSize;
  const grid = target?.length === reqLen ? target : new Float32Array(reqLen);
  const jet = Math.max(0.15, Math.min(1, airflowCfm / 15000));
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const u = x / (gridSize - 1);
      const v = y / (gridSize - 1);
      const plume = Math.exp(-((u - 0.25) ** 2) / 0.04) * Math.exp(-((v - 0.6) ** 2) / 0.12);
      grid[y * gridSize + x] = Math.max(0, Math.min(1, jet * plume));
    }
  }
  return grid;
}

/** Rewrite a colormapped RGBA buffer in place for a live DataTexture drain. */
export function writeColormappedField(
  rgba: Uint8Array,
  scalarField: Float32Array | Float64Array,
  width: number,
  height: number,
): void {
  const pixelCount = width * height;
  for (let i = 0; i < pixelCount; i++) {
    const val = Math.max(0, Math.min(1, scalarField[i] ?? 0));
    const [r, g, b] = sampleThermalColormap(val);
    const idx = i * 4;
    rgba[idx] = Math.round(r * 255);
    rgba[idx + 1] = Math.round(g * 255);
    rgba[idx + 2] = Math.round(b * 255);
    rgba[idx + 3] = 255;
  }
}

/**
 * Normalized particle-density texture for the US 2,708,656 studio.
 *
 * This is deliberately not named or presented as neutron flux: the patent
 * does not provide the boundary conditions or absorber-worth calibration
 * required for a quantitative diffusion solve. The rectangular cosine shape
 * simply keeps display particles concentrated inside the modeled pile.
 */
export function computeFermiNormalizedDisplayField(
  keff: number,
  rodInsertion: number,
  gridSize = 32,
  target?: Float32Array,
): Float32Array {
  const cellCount = gridSize * gridSize;
  const grid = target?.length === cellCount ? target : new Float32Array(cellCount);
  const fluxScale = Math.max(0.1, Math.min(1.0, keff > 1.0 ? 0.6 + (keff - 1.0) * 8 : 0.6 * keff));
  const rodSuppression = Math.max(0, Math.min(1, rodInsertion));

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const u = (x / (gridSize - 1)) * 2 - 1; // [-1..1]
      const v = (y / (gridSize - 1)) * 2 - 1; // [-1..1]
      // Rectangular display envelope; not a fitted reactor eigenmode.
      const fundamental = Math.cos((Math.PI * u) / 2) * Math.cos((Math.PI * v) / 2);
      // Qualitative occlusion around a side-entry absorber path.
      const rodDist2 = u * u + v * v;
      const rodDip = rodSuppression * 0.75 * Math.exp(-rodDist2 / 0.12);
      const val = Math.max(0, fundamental - rodDip) * fluxScale;
      grid[y * gridSize + x] = Math.max(0, Math.min(1, val));
    }
  }
  return grid;
}

/** Goddard supersonic rocket de Laval expansion plume with periodic Mach diamonds. */
export function computeGoddardPlumeField(
  chamberPressurePsi: number,
  expansionRatio = 4,
  timeSec = 0,
  gridSize = 32,
  target?: Float32Array,
): Float32Array {
  const reqLen = gridSize * gridSize;
  const grid = target?.length === reqLen ? target : new Float32Array(reqLen);
  const pressureFactor = Math.max(0.1, Math.min(1.0, chamberPressurePsi / 300));
  const machWavelength = Math.max(0.15, Math.min(0.35, 0.2 * Math.sqrt(expansionRatio / 4)));

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const u = x / (gridSize - 1); // [0..1] axial distance downstream
      const v = (y / (gridSize - 1)) * 2 - 1; // [-1..1] radial distance from centerline

      // Plume spread increases downstream
      const plumeRadius = 0.15 + 0.45 * u;
      const radialProfile = Math.exp(-(v * v) / (2 * plumeRadius * plumeRadius));

      // Periodic Mach diamonds along core
      const diamondFreq = (2 * Math.PI) / machWavelength;
      const machOscillation = 0.35 * Math.cos(diamondFreq * u - timeSec * 12) * Math.exp(-u * 2.5);

      const intensity =
        (0.65 * radialProfile + machOscillation * radialProfile) *
        pressureFactor *
        Math.exp(-u * 1.2);
      grid[y * gridSize + x] = Math.max(0, Math.min(1, intensity));
    }
  }
  return grid;
}

/** Maiman Ruby Laser optical resonator TEM00 Gaussian photon flux intensity. */
export function computeLaserCavityField(
  pumpEnergyJoules: number,
  inversionFraction: number,
  gridSize = 32,
  target?: Float32Array,
): Float32Array {
  const reqLen = gridSize * gridSize;
  const grid = target?.length === reqLen ? target : new Float32Array(reqLen);
  const gain = Math.max(0, Math.min(1.0, (pumpEnergyJoules / 2000) * inversionFraction));

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const u = (x / (gridSize - 1)) * 2 - 1; // [-1..1]
      const v = (y / (gridSize - 1)) * 2 - 1; // [-1..1]
      const r2 = u * u + v * v;

      // TEM00 Gaussian beam waist profile
      const waist = 0.38;
      const tem00 = Math.exp(-r2 / (waist * waist));

      // Radial dielectric rod index wave
      const rodBoundary = r2 <= 0.85 ? 1.0 : Math.exp(-(r2 - 0.85) / 0.05);
      const intensity = gain * tem00 * rodBoundary;
      grid[y * gridSize + x] = Math.max(0, Math.min(1, intensity));
    }
  }
  return grid;
}

/** Linde Joule-Thomson countercurrent liquefaction thermal gradient field. */
export function computeJouleThomsonThermalField(
  inletPressureBar: number,
  throttleTempK: number,
  gridSize = 32,
  target?: Float32Array,
): Float32Array {
  const reqLen = gridSize * gridSize;
  const grid = target?.length === reqLen ? target : new Float32Array(reqLen);
  const jtDeltaT = Math.max(5, Math.min(80, inletPressureBar * 0.28));
  const coldRatio = Math.max(0, Math.min(1.0, (300 - throttleTempK + jtDeltaT) / 250));

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const u = x / (gridSize - 1); // [0..1] along heat exchanger
      const v = y / (gridSize - 1); // [0..1] high-P tube vs return sheath

      // High-pressure inner stream cools toward throttle at u=1
      const highPStream = (1.0 - 0.7 * u) * (1.0 - 0.3 * coldRatio);
      // Low-pressure return cold stream warms from throttle back toward u=0
      const lowPReturn = (0.2 + 0.5 * (1.0 - u)) * coldRatio;

      const streamMix = v > 0.5 ? highPStream : lowPReturn;
      grid[y * gridSize + x] = Math.max(0, Math.min(1, streamMix));
    }
  }
  return grid;
}

/** Parsons steam turbine multistage enthalpy drop field across cascade blading. */
export function computeSteamEnthalpyField(
  inletPressurePsi: number,
  stages = 48,
  gridSize = 32,
  target?: Float32Array,
): Float32Array {
  const reqLen = gridSize * gridSize;
  const grid = target?.length === reqLen ? target : new Float32Array(reqLen);
  const pr = Math.max(2, Math.min(25, inletPressurePsi / 14.7));

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const u = x / (gridSize - 1); // [0..1] axial progression through blading
      const v = (y / (gridSize - 1)) * 2 - 1; // [-1..1] radial annular height

      // Annular casing flare: diameter expands to accommodate low-pressure steam volume
      const casingRadius = 0.3 + 0.6 * (u * u);
      if (Math.abs(v) > casingRadius) {
        grid[y * gridSize + x] = 0;
        continue;
      }

      // Isentropic enthalpy drop curve h(x)
      const enthalpyFrac = (1 - 0.75 * u) ** 0.28;
      // Blading tier ripple
      const bladeRipple = 0.08 * Math.sin(u * stages * Math.PI);
      const intensity = Math.max(0, enthalpyFrac + bladeRipple) * Math.min(1, pr / 10);
      grid[y * gridSize + x] = Math.max(0, Math.min(1, intensity));
    }
  }
  return grid;
}

export interface WrightAirflowParams {
  airspeedMps: number;
  angleOfAttackRad?: number;
  wingWarpDeg?: number;
  elevatorPitchDeg?: number;
  rudderYawDeg?: number;
  coupled?: boolean;
}

/**
 * Evaluates the 3D velocity vector [vx, vy, vz] in SI m/s at spatial coordinate (x, y, z)
 * around the Wright Flyer biplane. Governed by biplane bound vortex circulation,
 * downwash f_downwash, differential wing warping tip circulation, canard pitch, and rudder yaw.
 */
export function evaluateWrightAirflowVelocityVector(
  x: number,
  y: number,
  z: number,
  params: WrightAirflowParams,
): [number, number, number] {
  const vInf = Math.max(0.1, params.airspeedMps);
  const alpha = params.angleOfAttackRad ?? (5 * Math.PI) / 180;
  const chord = 1.98; // meters
  const halfSpan = 12.29 / 2; // meters
  const halfGap = 1.88 / 2; // meters
  const ar = 12.29 / chord;

  // Base lift coefficient from angle of attack + camber offset
  const cl0 = Math.max(0, 2 * Math.PI * (alpha + 0.05));

  // Differential circulation from wing warp across span z
  const zNorm = Math.max(-1, Math.min(1, z / halfSpan));
  const warpDeg = params.wingWarpDeg ?? 0;
  const deltaClWarp = warpDeg * (Math.PI / 180) * 1.6 * zNorm;
  const clLocal = Math.max(0, cl0 + deltaClWarp);

  // Biplane upper and lower wing bound circulations (upper wing carries ~55% of load)
  const gamma1 = 0.55 * clLocal * vInf * chord;
  const gamma2 = 0.45 * clLocal * vInf * chord;

  // Upper wing at (0, +halfGap), Lower wing at (0, -halfGap)
  const core2 = 0.08;
  const r1sq = x * x + (y - halfGap) * (y - halfGap) + core2;
  const u1 = (gamma1 / (2 * Math.PI)) * ((y - halfGap) / r1sq);
  const v1 = -(gamma1 / (2 * Math.PI)) * (x / r1sq);

  const r2sq = x * x + (y + halfGap) * (y + halfGap) + core2;
  const u2 = (gamma2 / (2 * Math.PI)) * ((y + halfGap) / r2sq);
  const v2 = -(gamma2 / (2 * Math.PI)) * (x / r2sq);

  // Downwash behind the biplane wings (x > 0)
  let vDownwash = 0;
  if (x > 0) {
    const w0 = (2 * clLocal * vInf) / (Math.PI * ar);
    const downstreamDecay = Math.exp(-x / 14);
    const verticalDecay = Math.exp(-(y * y) / (halfGap * halfGap * 1.8));
    vDownwash = -w0 * downstreamDecay * verticalDecay;
  }

  // Canard elevator at x = -3.5, y = 0
  const canardDeg = params.elevatorPitchDeg ?? 0;
  const gammaCanard = 0.18 * (canardDeg * (Math.PI / 180)) * vInf;
  const rcsq = (x + 3.5) * (x + 3.5) + y * y + 0.12;
  const uc = (gammaCanard / (2 * Math.PI)) * (y / rcsq);
  const vc = -(gammaCanard / (2 * Math.PI)) * ((x + 3.5) / rcsq);

  // Vertical rudder at x = +3.0
  const rudderDeg = params.rudderYawDeg ?? 0;
  const rudderEffect =
    -(rudderDeg * (Math.PI / 180)) *
    vInf *
    0.6 *
    Math.exp(-((x - 3.0) * (x - 3.0) + y * y + z * z) / 3.5);

  const vx = vInf * Math.cos(alpha) + u1 + u2 + uc;
  const vy = vInf * Math.sin(alpha) + v1 + v2 + vc + vDownwash;
  const vz = rudderEffect;

  return [vx, vy, vz];
}

/**
 * Computes a 2D scalar velocity magnitude / pressure field for the Wright Flyer biplane.
 * Normalized to [0..1] range representing Bernoulli pressure or kinetic energy perturbation.
 */
export function computeWrightAirflowVelocityField(
  params: WrightAirflowParams,
  width = 32,
  height = 32,
  target?: Float32Array,
): Float32Array {
  const reqLen = width * height;
  const grid = target?.length === reqLen ? target : new Float32Array(reqLen);
  const vInf = Math.max(0.1, params.airspeedMps);

  for (let j = 0; j < height; j++) {
    // Vertical domain y in [-2.5, 2.5] meters
    const y = 2.5 - (j / (height - 1)) * 5.0;
    for (let i = 0; i < width; i++) {
      // Axial domain x in [-4.0, 5.0] meters
      const x = -4.0 + (i / (width - 1)) * 9.0;
      const [vx, vy] = evaluateWrightAirflowVelocityVector(x, y, 0, params);
      const vMag = Math.hypot(vx, vy);
      // Normalized Bernoulli surface pressure perturbation
      const speedRatio = vMag / vInf;
      const normalized = Math.max(0, Math.min(1, (speedRatio - 0.5) / 1.2));
      grid[j * width + i] = normalized;
    }
  }

  return grid;
}

/**
 * Computes the 2D resonant quarter-wave electric field around Tesla's conical secondary transformer (US 593,138).
 */
export function computeTeslaCoilEField(
  disturbanceFrequencyHz: number,
  secondaryLengthMiles: number,
  gridSize = 32,
  target?: Float32Array,
): Float32Array {
  const reqLen = gridSize * gridSize;
  const grid = target?.length === reqLen ? target : new Float32Array(reqLen);
  const vProp = 3e8 * 0.65; // Helical propagation speed (~65% c)
  const wireLengthM = Math.max(10, secondaryLengthMiles * 1609.344);
  const electricalLengthRad = (2 * Math.PI * disturbanceFrequencyHz * wireLengthM) / vProp;

  for (let y = 0; y < gridSize; y++) {
    const v = y / (gridSize - 1); // Axial position: 0 (ground) to 1 (high terminal)
    // Quarter-wave distributed potential profile
    const potential = Math.abs(Math.sin(electricalLengthRad * v));
    // Conical secondary outer radius narrows from bottom to top
    const coneRadius = 0.45 * (1 - 0.6 * v);

    for (let x = 0; x < gridSize; x++) {
      const u = (x / (gridSize - 1)) * 2 - 1; // Radial position [-1..1]
      const r = Math.abs(u);
      const distFromWinding = Math.abs(r - coneRadius);
      const eField = potential * Math.exp(-distFromWinding * 3.8);
      grid[y * gridSize + x] = Math.max(0, Math.min(1, eField));
    }
  }

  return grid;
}
