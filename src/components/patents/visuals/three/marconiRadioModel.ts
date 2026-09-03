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
 * 7. Grounded receiving aerial, chokes, metallic-powder coherer, relay output,
 *    and a mechanically linked trembler that restores the detector.
 */

import * as THREE from "three";
import { createLcg } from "@/utils/lcg";

export interface MarconiRadioModelNodes {
  rootGroup: THREE.Group;
  mast: THREE.Mesh;
  capacityHat: THREE.Mesh;
  aerialWire: THREE.Mesh;
  guyLines: THREE.LineSegments;
  guyLinePositions: Float32Array;
  sparkGapGroup: THREE.Group;
  sparkBalls: THREE.Mesh[];
  sparkPillars: THREE.Mesh[];
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
  receiverGroup: THREE.Group;
  receiverAerial: THREE.Mesh;
  receiverGroundPlate: THREE.Mesh;
  coherer: THREE.Mesh;
  receiverChokes: THREE.Mesh[];
  relayArmature: THREE.Mesh;
  tremblerArmature: THREE.Mesh;
  receiverLamp: THREE.Mesh;
  groundPlate: THREE.Mesh;
  waveRings: THREE.Mesh[];
  waveCount: number;
  mastBaseY: number;
  random: () => number;
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
  detector: THREE.MeshStandardMaterial;
  relay: THREE.MeshStandardMaterial;
  receiverLamp: THREE.MeshStandardMaterial;
}

export interface MarconiRadioModelResult {
  rootGroup: THREE.Group;
  nodes: MarconiRadioModelNodes;
  materials: MarconiRadioMaterials;
  dispose: () => void;
}

export interface MarconiRadioKinematicsState {
  readonly mastStudioScale: number;
  readonly sparkGapStudioHalfSpan: number;
  readonly wavefrontProgress: number;
  readonly sparkActive: boolean;
  readonly waveActive: boolean;
  readonly showEmWavefronts: boolean;
  readonly receiverConducting: boolean;
  readonly relayActive: boolean;
  readonly resetActive: boolean;
  readonly resetPhase: number;
  readonly isCutaway: boolean;
}

const SPARK_PARTICLE_COUNT = 60;
const WAVE_COUNT = 5;

export function buildMarconiRadioModel(): MarconiRadioModelResult {
  const rootGroup = new THREE.Group();
  const random = createLcg(1208);
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
    detector: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.5,
        metalness: 0.8,
      }),
    ),
    relay: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x64748b,
        roughness: 0.55,
        metalness: 0.7,
      }),
    ),
    receiverLamp: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x7c2d12,
        emissive: 0x7c2d12,
        emissiveIntensity: 0.15,
        roughness: 0.35,
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
  const guyLinePositions = new Float32Array(guyPositions);
  guyWiresGeo.setAttribute("position", new THREE.BufferAttribute(guyLinePositions, 3));
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
  const sparkPillars: THREE.Mesh[] = [];
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
    sparkPillars.push(pillar);
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
    sparkParticlePos[idx] = (random() - 0.5) * 0.8;
    sparkParticlePos[idx + 1] = -1.8 + (random() - 0.5) * 0.3;
    sparkParticlePos[idx + 2] = (random() - 0.5) * 0.4;
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

  const conductorMaterial = trackMat(
    new THREE.LineBasicMaterial({ color: 0xca8a04, transparent: true, opacity: 0.9 }),
  );
  const addConductor = (name: string, points: THREE.Vector3[]) => {
    const geometry = trackGeo(new THREE.BufferGeometry().setFromPoints(points));
    const conductor = new THREE.Line(geometry, conductorMaterial);
    conductor.name = name;
    rootGroup.add(conductor);
  };
  addConductor("Aerial-to-spark conductor", [
    new THREE.Vector3(-3.2, -3.45, 0),
    new THREE.Vector3(-3.2, -2.4, 0),
    new THREE.Vector3(-1.2, -1.8, 0),
  ]);
  addConductor("Spark-to-earth conductor", [
    new THREE.Vector3(1.2, -1.8, 0),
    new THREE.Vector3(1.2, -2.65, 0),
    new THREE.Vector3(0, -3.15, 0),
  ]);

  // 6. Receiver: coherer -> relay local circuit -> trembler reset.  The
  // patent's detector is a variable-resistance metallic-powder contact; this
  // visual keeps its signal and reset circuits visibly separate from the
  // transmitter while connecting every causal stage with conductors.
  const receiverGroup = new THREE.Group();
  receiverGroup.name = "coherer_receiver_and_reset";
  receiverGroup.position.set(6.5, -2.1, 0);
  rootGroup.add(receiverGroup);

  const receiverBase = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(3.4, 0.25, 2.2)),
    materials.mahoganyBase,
  );
  receiverBase.position.y = -0.75;
  receiverGroup.add(receiverBase);

  // Receiver RF path. The left electrode rises to an insulated elevated
  // conductor; the right electrode returns to its own earth plate. These are
  // the two physically separate stations printed in the long-distance claims.
  const receiverAerial = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 4.5, 8)),
    materials.copperAerial,
  );
  receiverAerial.name = "receiver_insulated_elevated_conductor";
  receiverAerial.position.set(-2.2, 3.2, 0);
  receiverGroup.add(receiverAerial);
  const receiverMast = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.11, 0.22, 6.63, 12)),
    materials.woodMast,
  );
  receiverMast.name = "receiver_aerial_support_mast";
  receiverMast.position.set(-2.45, 2.135, 0);
  receiverGroup.add(receiverMast);
  const receiverCapacityPlate = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.72, 0.72, 0.06, 20)),
    materials.copperAerial,
  );
  receiverCapacityPlate.name = "receiver_elevated_metal_plate";
  receiverCapacityPlate.position.set(-2.2, 5.45, 0);
  receiverGroup.add(receiverCapacityPlate);

  const receiverGroundPlate = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.45, 0.07, 1.5)),
    materials.groundEarth,
  );
  receiverGroundPlate.name = "receiver_earth_connection";
  receiverGroundPlate.position.set(-0.15, -1.22, 0);
  receiverGroup.add(receiverGroundPlate);

  const coherer = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.17, 0.17, 1.25, 16)),
    materials.detector,
  );
  coherer.name = "metallic_powder_coherer_detector";
  coherer.rotation.z = Math.PI / 2;
  coherer.position.set(-0.85, 0, 0);
  receiverGroup.add(coherer);

  for (const x of [-1.55, -0.15]) {
    const electrode = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.065, 0.065, 0.38, 12)),
      materials.brassBalls,
    );
    electrode.position.set(x, 0, 0);
    receiverGroup.add(electrode);
  }

  const receiverChokes: THREE.Mesh[] = [];
  for (const x of [-1.82, 0.12]) {
    const choke = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.14, 0.045, 8, 18)),
      materials.copperAerial,
    );
    choke.name = x < 0 ? "receiver_aerial_choking_coil" : "receiver_earth_choking_coil";
    choke.rotation.y = Math.PI / 2;
    choke.position.set(x, 0, 0);
    receiverGroup.add(choke);
    receiverChokes.push(choke);
  }

  const relayCore = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.42, 0.48, 0.72)),
    materials.relay,
  );
  relayCore.position.set(0.55, 0, 0);
  receiverGroup.add(relayCore);
  const relayArmature = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.82, 0.07, 0.12)),
    materials.brassBalls,
  );
  relayArmature.name = "local_circuit_relay_armature";
  relayArmature.position.set(0.72, 0.35, 0);
  receiverGroup.add(relayArmature);

  const tremblerCore = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.32, 0.4, 0.58)),
    materials.relay,
  );
  tremblerCore.position.set(1.35, 0, 0);
  receiverGroup.add(tremblerCore);
  const tremblerArmature = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.64, 0.055, 0.1)),
    materials.brassBalls,
  );
  tremblerArmature.name = "coherer_trembler_reset";
  tremblerArmature.position.set(1.35, 0.3, 0);
  receiverGroup.add(tremblerArmature);

  const receiverLamp = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.19, 16, 16)),
    materials.receiverLamp,
  );
  receiverLamp.name = "receiver_local_circuit_indicator";
  receiverLamp.position.set(0.65, 0.65, 0);
  receiverGroup.add(receiverLamp);

  const localBattery = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.55, 0.48, 0.62)),
    materials.coilIron,
  );
  localBattery.name = "receiver_local_battery";
  localBattery.position.set(0.2, -0.38, 0);
  receiverGroup.add(localBattery);

  const receiverConductorMaterial = trackMat(
    new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9 }),
  );
  const addReceiverConductor = (name: string, points: THREE.Vector3[]) => {
    const geometry = trackGeo(new THREE.BufferGeometry().setFromPoints(points));
    const conductor = new THREE.Line(geometry, receiverConductorMaterial);
    conductor.name = name;
    receiverGroup.add(conductor);
  };
  addReceiverConductor("receiver_aerial_to_coherer", [
    new THREE.Vector3(-1.55, 0, 0),
    new THREE.Vector3(-1.82, 0, 0),
    new THREE.Vector3(-2.2, 0, 0),
    new THREE.Vector3(-2.2, 0.95, 0),
  ]);
  addReceiverConductor("coherer_to_receiver_earth", [
    new THREE.Vector3(-0.15, 0, 0),
    new THREE.Vector3(0.12, 0, 0),
    new THREE.Vector3(0.12, -1.185, 0),
    new THREE.Vector3(-0.15, -1.185, 0),
  ]);
  addReceiverConductor("coherer_to_relay_local_circuit", [
    new THREE.Vector3(-0.15, -0.12, 0.18),
    new THREE.Vector3(0.2, -0.12, 0.18),
    new THREE.Vector3(0.34, 0, 0.18),
  ]);
  addReceiverConductor("relay_to_local_battery", [
    new THREE.Vector3(0.55, -0.24, 0.18),
    new THREE.Vector3(0.2, -0.24, 0.18),
  ]);
  addReceiverConductor("local_battery_to_coherer", [
    new THREE.Vector3(-0.08, -0.38, 0.18),
    new THREE.Vector3(-1.55, -0.38, 0.18),
    new THREE.Vector3(-1.55, -0.12, 0.18),
  ]);
  addReceiverConductor("relay_to_trembler_reset", [
    new THREE.Vector3(0.95, 0.25, 0),
    new THREE.Vector3(1.35, 0.25, 0),
    new THREE.Vector3(1.35, 0.05, 0),
  ]);
  addReceiverConductor("trembler_tapper_linkage", [
    new THREE.Vector3(1.03, 0.3, 0),
    new THREE.Vector3(0.15, 0.3, 0),
    new THREE.Vector3(-0.15, 0.17, 0),
  ]);

  // 7. Expanding electromagnetic wavefronts from the transmitter aerial.
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
    guyLinePositions,
    sparkGapGroup,
    sparkBalls,
    sparkPillars,
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
    receiverGroup,
    receiverAerial,
    receiverGroundPlate,
    coherer,
    receiverChokes,
    relayArmature,
    tremblerArmature,
    receiverLamp,
    groundPlate,
    waveRings,
    waveCount: WAVE_COUNT,
    mastBaseY,
    random,
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
  state: MarconiRadioKinematicsState,
) {
  const {
    mastStudioScale,
    sparkGapStudioHalfSpan,
    wavefrontProgress,
    sparkActive,
    waveActive,
    showEmWavefronts,
    receiverConducting,
    relayActive,
    resetActive,
    resetPhase,
    isCutaway,
  } = state;
  // 1. Aerial Mast Height Scaling
  const mastScale = mastStudioScale;
  nodes.mast.scale.y = mastScale;
  nodes.mast.position.y = nodes.mastBaseY + 4.75 * mastScale;
  nodes.capacityHat.position.y = nodes.mastBaseY + 9.5 * mastScale;
  nodes.aerialWire.scale.y = mastScale;
  nodes.aerialWire.position.y = nodes.mastBaseY + 4.75 * mastScale;
  const topRelativeHeights = [9.15, 9.15, 6.95, 6.95, 9.15, 9.15, 6.95, 6.95];
  for (let segment = 0; segment < topRelativeHeights.length; segment += 1) {
    const offset = segment * 6;
    nodes.guyLinePositions[offset] = -3.5;
    nodes.guyLinePositions[offset + 1] = nodes.mastBaseY + topRelativeHeights[segment] * mastScale;
    nodes.guyLinePositions[offset + 2] = 0;
  }
  nodes.guyLines.geometry.attributes.position.needsUpdate = true;

  // 2. Spark Gap Arc & Glow Dynamics
  const innerHalfSpan = Math.max(0.37, Math.min(0.55, sparkGapStudioHalfSpan));
  nodes.sparkBalls[1].position.x = -innerHalfSpan;
  nodes.sparkBalls[2].position.x = innerHalfSpan;
  nodes.sparkPillars[1].position.x = -innerHalfSpan;
  nodes.sparkPillars[2].position.x = innerHalfSpan;
  const dischargeHalfSpan = innerHalfSpan - 0.35;
  if (sparkActive) {
    nodes.sparkPoints.visible = true;
    nodes.sparkArc.visible = nodes.random() > 0.15;

    const aPos = nodes.arcPositions;
    for (let i = 0; i < 15; i++) {
      const t = i / 14;
      const idx = i * 3;
      aPos[idx] = -dischargeHalfSpan + t * dischargeHalfSpan * 2;
      aPos[idx + 1] = (nodes.random() - 0.5) * 0.12;
      aPos[idx + 2] = (nodes.random() - 0.5) * 0.12;
    }
    nodes.sparkArcGeo.attributes.position.needsUpdate = true;

    const sPos = nodes.sparkParticlePos;
    for (let i = 0; i < nodes.sparkCount; i++) {
      const idx = i * 3;
      sPos[idx] = (nodes.random() - 0.5) * dischargeHalfSpan * 2;
      sPos[idx + 1] = -1.8 + (nodes.random() - 0.5) * 0.3;
      sPos[idx + 2] = (nodes.random() - 0.5) * 0.4;
    }
    nodes.sparkParticleGeo.attributes.position.needsUpdate = true;

    // A fired pulse means the key is visibly depressed. The source supplies no
    // calibrated oscillation rate, so this is a discrete state, not an RF clock.
    nodes.morseLever.rotation.z = -0.12;
  } else {
    nodes.sparkPoints.visible = false;
    nodes.sparkArc.visible = false;
    nodes.morseLever.rotation.z = 0;
  }

  // The shared fixed-step tape owns this causal sequence. The model only
  // projects coherer conduction, local relay output, and mechanical reset.
  const detector = materials.detector;
  detector.emissive.setHex(receiverConducting ? 0x0e7490 : 0x000000);
  detector.emissiveIntensity = receiverConducting ? 0.8 : 0;
  nodes.relayArmature.rotation.z = relayActive ? -0.16 : 0;
  nodes.tremblerArmature.rotation.z = resetActive ? Math.sin(resetPhase * Math.PI * 4) * 0.22 : 0;
  const lampMaterial = materials.receiverLamp;
  lampMaterial.emissive.setHex(relayActive ? 0xf59e0b : 0x7c2d12);
  lampMaterial.emissiveIntensity = relayActive ? 1.2 : 0.15;

  // 3. Electromagnetic Wavefront Propagation
  const normalizedWavefront = Math.max(0, Math.min(1, wavefrontProgress));
  for (let i = 0; i < nodes.waveCount; i++) {
    const ring = nodes.waveRings[i];
    if (ring) {
      ring.visible = showEmWavefronts && waveActive && normalizedWavefront >= i * 0.04;
      ring.scale.setScalar(0.8 + normalizedWavefront * 1.15);
      (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(
        0.08,
        0.42 - normalizedWavefront * 0.26 - i * 0.025,
      );
    }
  }

  // 4. Cutaway Base Transparency
  materials.mahoganyBase.opacity = isCutaway ? 0.35 : 1.0;
  materials.mahoganyBase.transparent = isCutaway;
}
