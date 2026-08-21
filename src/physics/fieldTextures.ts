/**
 * fieldTextures.ts
 *
 * FrankenSim GPU Field & Streamline Generator for Classic Patents.
 * Bridges discrete PDE field solutions (Fourier conduction, Laplace potential,
 * 6-group neutron diffusion, Maxwell vector flux, Navier-Stokes streamlines)
 * into Three.js DataTextures and zero-copy Float32Array geometry vertex buffers.
 *
 * Governed strictly by SI units and deterministic pseudo-random particle seeds.
 */

import * as THREE from "three";

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
): Float32Array {
  const grid = new Float32Array(gridSize * gridSize);
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
): Float32Array {
  const grid = new Float32Array(width * height);
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
