/**
 * marconiRadioModel.ts
 *
 * Museum-Grade Procedural 3D Model for Guglielmo Marconi's 1897 Wireless Radio Telegraphy
 * (US Patent 586,193).
 *
 * Reconstructs the first practical Hertzian-wave wireless telegraphic apparatus:
 * 1. Elevated monopole aerial wire mounted on tall timber mast with copper capacity plate.
 * 2. Augusto Righi 4-sphere spark gap (central oil-immersed spark discharge balls).
 * 3. Ruhmkorff high-voltage induction spark coil with magnetic hammer interrupter.
 * 4. Morse transmitting telegraph key and primary chemical battery jar series.
 * 5. Buried earth ground conduction plate and connection lead.
 * 6. Expanding electromagnetic spherical/toroidal RF wavefronts.
 */

import * as THREE from "three";
import { wave2dFrames, waveFrameRms } from "@/physics/genericWasm";
import { createLcg } from "@/utils/lcg";

const lcg = createLcg(1208);

export interface MarconiRadioModelNodes {
  rootGroup: THREE.Group;
  mast: THREE.Mesh;
  capacityHat: THREE.Mesh;
  aerialWire: THREE.Mesh;
  guyLines: THREE.LineSegments;
  sparkGapGroup: THREE.Group;
  sparkBalls: THREE.Mesh[];
  sparkArc: THREE.Line;
  sparkArcGeo: THREE.BufferGeometry;
  arcPositions: Float32Array;
  sparkPoints: THREE.Points;
  sparkParticleGeo: THREE.BufferGeometry;
  sparkParticlePos: Float32Array;
  sparkCount: number;
  inductionCoilGroup: THREE.Group;
  morseKeyGroup: THREE.Group;
  morseLever: THREE.Mesh;
  groundPlate: THREE.Mesh;
  waveRings: THREE.Mesh[];
  waveCount: number;
  mastBaseY: number;
}

export interface MarconiRadioMaterials {
  brassBalls: THREE.MeshStandardMaterial;
  copperAerial: THREE.MeshStandardMaterial;
  woodMast: THREE.MeshStandardMaterial;
  mahoganyBase: THREE.MeshStandardMaterial;
  coilIron: THREE.MeshStandardMaterial;
  groundEarth: THREE.MeshStandardMaterial;
  sparkArc: THREE.LineBasicMaterial;
  sparkPoints: THREE.PointsMaterial;
  wavefrontMat: THREE.MeshBasicMaterial;
}

export interface MarconiRadioModelResult {
  rootGroup: THREE.Group;
  nodes: MarconiRadioModelNodes;
  materials: MarconiRadioMaterials;
  dispose: () => void;
}

const SPARK_PARTICLE_COUNT = 60;
const WAVE_COUNT = 5;

export function buildMarconiRadioModel(): MarconiRadioModelResult {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometriesToDispose.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materialsToDispose.push(mat);
    return mat;
  };

  // Materials
  const materials: MarconiRadioMaterials = {
    brassBalls: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.1,
        metalness: 0.98,
      }),
    ),
    copperAerial: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xca8a04,
        roughness: 0.25,
        metalness: 0.88,
      }),
    ),
    woodMast: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x78350f,
        roughness: 0.5,
        metalness: 0.05,
      }),
    ),
    mahoganyBase: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x581c87,
        roughness: 0.4,
        metalness: 0.1,
      }),
    ),
    coilIron: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.8,
        metalness: 0.6,
      }),
    ),
    groundEarth: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.6,
        metalness: 0.7,
      }),
    ),
    sparkArc: trackMat(
      new THREE.LineBasicMaterial({
        color: 0x38bdf8,
      }),
    ),
    sparkPoints: trackMat(
      new THREE.PointsMaterial({
        size: 0.28,
        color: 0x67e8f9,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    ),
    wavefrontMat: trackMat(
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      }),
    ),
  };

  // 1. Timber Aerial Mast & Capacity Plate
  const mastBaseY = -3.95;
  const mast = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.18, 0.35, 9.5, 16)),
    materials.woodMast,
  );
  mast.position.set(-3.5, 0.8, 0);
  mast.castShadow = true;
  rootGroup.add(mast);

  const capacityHat = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.2, 1.2, 0.08, 24)),
    materials.copperAerial,
  );
  capacityHat.position.set(-3.5, 5.5, 0);
  rootGroup.add(capacityHat);

  // Aerial Wire
  const aerialWire = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 8.5, 8)),
    materials.copperAerial,
  );
  aerialWire.position.set(-3.2, 0.8, 0);
  aerialWire.castShadow = true;
  rootGroup.add(aerialWire);

  // Mast Guy Wires
  const guyWiresGeo = trackGeo(new THREE.BufferGeometry());
  const guyPositions: number[] = [];
  [-2.2, 2.2].forEach((gz) => {
    guyPositions.push(-3.5, 5.2, 0, -6.5, -3.0, gz);
    guyPositions.push(-3.5, 5.2, 0, -0.5, -3.0, gz);
    guyPositions.push(-3.5, 3.0, 0, -5.5, -3.0, gz * 0.8);
    guyPositions.push(-3.5, 3.0, 0, -1.5, -3.0, gz * 0.8);
  });
  guyWiresGeo.setAttribute("position", new THREE.Float32BufferAttribute(guyPositions, 3));
  const guyLines = new THREE.LineSegments(
    guyWiresGeo,
    trackMat(new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.6 })),
  );
  rootGroup.add(guyLines);

  // 2. Ruhmkorff Induction Spark Coil
  const inductionCoilGroup = new THREE.Group();
  inductionCoilGroup.position.set(0, -2.1, -1.8);
  rootGroup.add(inductionCoilGroup);

  const coilBase = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(3.6, 0.35, 2.4)),
    materials.mahoganyBase,
  );
  coilBase.position.y = -0.7;
  inductionCoilGroup.add(coilBase);

  const inductionCoil = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.65, 0.65, 2.6, 24)),
    materials.coilIron,
  );
  inductionCoil.rotation.z = Math.PI / 2;
  inductionCoilGroup.add(inductionCoil);

  // Primary terminals
  [-1.0, 1.0].forEach((tx) => {
    const term = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 12)),
      materials.brassBalls,
    );
    term.position.set(tx, 0.6, 0);
    inductionCoilGroup.add(term);
  });

  // 3. Morse Transmitting Key
  const morseKeyGroup = new THREE.Group();
  morseKeyGroup.position.set(3.0, -2.4, -0.5);
  rootGroup.add(morseKeyGroup);

  const morseBase = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.4, 0.2, 0.8)),
    materials.mahoganyBase,
  );
  morseKeyGroup.add(morseBase);

  const morseLever = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.2, 0.08, 0.12)),
    materials.brassBalls,
  );
  morseLever.position.set(0, 0.2, 0);
  morseKeyGroup.add(morseLever);

  const morseKnob = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 16)),
    materials.coilIron,
  );
  morseKnob.position.set(0.45, 0.3, 0);
  morseKeyGroup.add(morseKnob);

  // 4. Augusto Righi 4-Sphere Spark Gap (US 586,193 Fig. 1)
  const sparkGapGroup = new THREE.Group();
  sparkGapGroup.position.set(0, -1.8, 0);
  rootGroup.add(sparkGapGroup);

  const sparkBalls: THREE.Mesh[] = [];
  const spherePositions = [-1.2, -0.4, 0.4, 1.2];
  spherePositions.forEach((sx, idx) => {
    const isInner = idx === 1 || idx === 2;
    const radius = isInner ? 0.35 : 0.28;
    const ball = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(radius, 24, 24)),
      materials.brassBalls,
    );
    ball.position.x = sx;
    ball.castShadow = true;
    sparkGapGroup.add(ball);
    sparkBalls.push(ball);

    const pillar = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.08, 0.12, 1.0, 16)),
      materials.coilIron,
    );
    pillar.position.set(sx, -0.6, 0);
    sparkGapGroup.add(pillar);
  });

  // Central Spark Discharge Arc Line
  const sparkArcGeo = trackGeo(new THREE.BufferGeometry());
  const arcPositions = new Float32Array(15 * 3);
  sparkArcGeo.setAttribute("position", new THREE.BufferAttribute(arcPositions, 3));
  const sparkArc = new THREE.Line(sparkArcGeo, materials.sparkArc);
  sparkGapGroup.add(sparkArc);

  // Spark Photon Glow Particles
  const sparkParticleGeo = trackGeo(new THREE.BufferGeometry());
  const sparkParticlePos = new Float32Array(SPARK_PARTICLE_COUNT * 3);
  for (let i = 0; i < SPARK_PARTICLE_COUNT; i++) {
    const idx = i * 3;
    sparkParticlePos[idx] = (lcg() - 0.5) * 0.8;
    sparkParticlePos[idx + 1] = -1.8 + (lcg() - 0.5) * 0.3;
    sparkParticlePos[idx + 2] = (lcg() - 0.5) * 0.4;
  }
  sparkParticleGeo.setAttribute("position", new THREE.BufferAttribute(sparkParticlePos, 3));
  const sparkPoints = new THREE.Points(sparkParticleGeo, materials.sparkPoints);
  rootGroup.add(sparkPoints);

  // 5. Buried Earth Ground Plate
  const groundPlate = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(3.0, 0.08, 3.0)),
    materials.groundEarth,
  );
  groundPlate.position.set(0, -3.2, 0);
  rootGroup.add(groundPlate);

  const groundWire = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8)),
    materials.copperAerial,
  );
  groundWire.position.set(0, -2.5, 0);
  rootGroup.add(groundWire);

  // 6. Expanding Electromagnetic Spherical/Toroidal Wavefronts
  const waveRings: THREE.Mesh[] = [];
  for (let i = 0; i < WAVE_COUNT; i++) {
    const ringGeo = trackGeo(new THREE.RingGeometry(1.2 + i * 1.5, 1.28 + i * 1.5, 48));
    const ring = new THREE.Mesh(ringGeo, materials.wavefrontMat.clone());
    materialsToDispose.push(ring.material as THREE.Material);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(-3.2, 1.0, 0);
    rootGroup.add(ring);
    waveRings.push(ring);
  }

  const nodes: MarconiRadioModelNodes = {
    rootGroup,
    mast,
    capacityHat,
    aerialWire,
    guyLines,
    sparkGapGroup,
    sparkBalls,
    sparkArc,
    sparkArcGeo,
    arcPositions,
    sparkPoints,
    sparkParticleGeo,
    sparkParticlePos,
    sparkCount: SPARK_PARTICLE_COUNT,
    inductionCoilGroup,
    morseKeyGroup,
    morseLever,
    groundPlate,
    waveRings,
    waveCount: WAVE_COUNT,
    mastBaseY,
  };

  const dispose = () => {
    for (const m of materialsToDispose) {
      m.dispose();
    }
    for (const g of geometriesToDispose) {
      g.dispose();
    }
  };

  return { rootGroup, nodes, materials, dispose };
}

/**
 * Updates Marconi radio spark discharge, electromagnetic wave propagation, and cutaway.
 */
export function updateMarconiRadioKinematics(
  nodes: MarconiRadioModelNodes,
  materials: MarconiRadioMaterials,
  _dt: number,
  timeSec: number,
  _aerialHeightMeters: number,
  _resonantFreqMhz: number,
  waveOpacityBase: number,
  wavePhaseRate: number,
  mastStudioScale: number,
  isSparking: boolean,
  showEmWavefronts: boolean,
  isCutaway: boolean,
) {
  // 1. Aerial Mast Height Scaling
  const mastScale = mastStudioScale;
  nodes.mast.scale.y = mastScale;
  nodes.mast.position.y = nodes.mastBaseY + 4.75 * mastScale;
  nodes.capacityHat.position.y = nodes.mastBaseY + 9.5 * mastScale;
  nodes.aerialWire.scale.y = mastScale;
  nodes.aerialWire.position.y = nodes.mastBaseY + 4.75 * mastScale;

  // 2. Spark Gap Arc & Glow Dynamics
  if (isSparking) {
    nodes.sparkPoints.visible = true;
    nodes.sparkArc.visible = lcg() > 0.15;

    const aPos = nodes.arcPositions;
    for (let i = 0; i < 15; i++) {
      const t = i / 14;
      const idx = i * 3;
      aPos[idx] = -0.4 + t * 0.8;
      aPos[idx + 1] = (lcg() - 0.5) * 0.12;
      aPos[idx + 2] = (lcg() - 0.5) * 0.12;
    }
    nodes.sparkArcGeo.attributes.position.needsUpdate = true;

    const sPos = nodes.sparkParticlePos;
    for (let i = 0; i < nodes.sparkCount; i++) {
      const idx = i * 3;
      sPos[idx] = (lcg() - 0.5) * 0.8;
      sPos[idx + 1] = -1.8 + (lcg() - 0.5) * 0.3;
      sPos[idx + 2] = (lcg() - 0.5) * 0.4;
    }
    nodes.sparkParticleGeo.attributes.position.needsUpdate = true;

    // Morse lever key tap
    nodes.morseLever.rotation.z = Math.sin(timeSec * 8) * 0.08;
  } else {
    nodes.sparkPoints.visible = false;
    nodes.sparkArc.visible = false;
    nodes.morseLever.rotation.z = 0;
  }

  // 3. Electromagnetic Wavefront Propagation
  const wave = wave2dFrames(16, 24, 2);
  const waveFrame = Math.floor(timeSec * Math.max(0.1, wavePhaseRate) * 4) % 24;
  const waveEnergy = waveFrameRms(wave, 16, 24, waveFrame);
  for (let i = 0; i < nodes.waveCount; i++) {
    const ring = nodes.waveRings[i];
    if (ring) {
      ring.visible = showEmWavefronts && isSparking;
      const wavePhase = (timeSec * wavePhaseRate + i * 0.7) % 3.0;
      ring.scale.setScalar(1.0 + wavePhase * 0.6 * (1 + waveEnergy));
      (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(
        0,
        (waveOpacityBase - wavePhase * 0.24) * (0.35 + waveEnergy * 2),
      );
    }
  }

  // 4. Cutaway Base Transparency
  materials.mahoganyBase.opacity = isCutaway ? 0.35 : 1.0;
  materials.mahoganyBase.transparent = isCutaway;
}
