/**
 * fessendenWirelessModel.ts
 *
 * Procedural Three.js WebGL hierarchy for Reginald Fessenden's 1902 Continuous-Wave
 * Wireless Transmitter, Low-Loss Cylindrical Cage Antenna, and Liquid Barretter Detector (US 706,737).
 *
 * Implements strict deterministic physics replay without external GLTF/GLB models.
 */

import * as THREE from "three";

export interface FessendenWirelessModelNodes {
  root: THREE.Group;
  alternatorRotor: THREE.Group;
  tuningCoil: THREE.Group;
  cageAntenna: THREE.Group;
  cageWires: THREE.Mesh[];
  waveRings: THREE.Mesh[];
  electrolyticCup: THREE.Group;
  wollastonElectrode: THREE.Mesh;
  thermalSparkGlow: THREE.Mesh;
  telephoneHeadset: THREE.Group;
  materials: THREE.Material[];
  setCutaway?: (cutaway: boolean) => void;
}

export function buildFessendenWirelessModel(): FessendenWirelessModelNodes {
  const root = new THREE.Group();
  root.name = "fessenden-wireless-root";

  const materials: THREE.Material[] = [];

  // Materials
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x4a2e18,
    roughness: 0.8,
    metalness: 0.1,
  });
  materials.push(woodMat);

  const castIronMat = new THREE.MeshStandardMaterial({
    color: 0x24272c,
    roughness: 0.6,
    metalness: 0.8,
  });
  materials.push(castIronMat);

  const copperMat = new THREE.MeshStandardMaterial({
    color: 0xc86d3b,
    roughness: 0.3,
    metalness: 0.9,
  });
  materials.push(copperMat);

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.35,
    metalness: 0.85,
  });
  materials.push(brassMat);

  const porcelainMat = new THREE.MeshStandardMaterial({
    color: 0xededed,
    roughness: 0.2,
    metalness: 0.1,
  });
  materials.push(porcelainMat);

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x99ddff,
    roughness: 0.1,
    metalness: 0.1,
    transmission: 0.85,
    transparent: true,
    opacity: 0.7,
  });
  materials.push(glassMat);

  const acidMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.75,
  });
  materials.push(acidMat);

  const wireMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.4,
    metalness: 0.8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.4,
  });
  materials.push(wireMat);

  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xfbbf24,
    transparent: true,
    opacity: 0.8,
  });
  materials.push(glowMat);

  const waveMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.3,
    wireframe: true,
  });
  materials.push(waveMat);

  // 1. Ground Plane & Operating Bench
  const bench = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.2, 3.0), woodMat);
  bench.position.set(0, -0.1, 0);
  root.add(bench);

  // 2. High-Frequency RF Alternator (Left Side: x = -1.8)
  const alternatorGroup = new THREE.Group();
  alternatorGroup.name = "rf-alternator-assembly";
  alternatorGroup.position.set(-1.8, 0.4, 0);

  // Base bedplate
  const bedplate = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 0.9), castIronMat);
  alternatorGroup.add(bedplate);

  // Bearing pedestals
  const pedestal1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.3), castIronMat);
  pedestal1.position.set(-0.45, 0.25, 0);
  alternatorGroup.add(pedestal1);

  const pedestal2 = pedestal1.clone();
  pedestal2.position.set(0.45, 0.25, 0);
  alternatorGroup.add(pedestal2);

  // Stator magnetic ring
  const stator = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.12, 16, 32), castIronMat);
  stator.position.set(0, 0.35, 0);
  alternatorGroup.add(stator);

  // Alternator Rotor (Rotating multi-tooth inductor core)
  const alternatorRotor = new THREE.Group();
  alternatorRotor.name = "alternator-rotor";
  alternatorRotor.position.set(0, 0.35, 0);

  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.1, 16), brassMat);
  shaft.rotation.z = Math.PI / 2;
  alternatorRotor.add(shaft);

  // Rotor teeth disc
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.15, 24), brassMat);
  disc.rotation.z = Math.PI / 2;
  alternatorRotor.add(disc);

  // Pole teeth (16 radial teeth)
  for (let i = 0; i < 16; i++) {
    const toothAngle = (i * Math.PI) / 8;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.04), copperMat);
    tooth.position.set(0, Math.sin(toothAngle) * 0.34, Math.cos(toothAngle) * 0.34);
    alternatorRotor.add(tooth);
  }
  alternatorGroup.add(alternatorRotor);
  root.add(alternatorGroup);

  // 3. Series Tuning Loading Inductance Coil (Coil 2: x = -0.6)
  const tuningCoil = new THREE.Group();
  tuningCoil.name = "tuning-coil-assembly";
  tuningCoil.position.set(-0.6, 0.4, 0);

  const coilBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.08, 24), woodMat);
  tuningCoil.add(coilBase);

  // Helical copper winding turns
  for (let i = 0; i < 8; i++) {
    const turn = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.02, 12, 24), copperMat);
    turn.rotation.x = Math.PI / 2;
    turn.position.y = 0.1 + i * 0.08;
    tuningCoil.add(turn);
  }

  // Slider contact rod
  const sliderRod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 12), brassMat);
  sliderRod.position.set(0.28, 0.45, 0);
  tuningCoil.add(sliderRod);
  root.add(tuningCoil);

  // 4. Low-Loss Cylindrical Cage Antenna (Figs. 3 & 4: x = 0.5)
  const cageAntenna = new THREE.Group();
  cageAntenna.name = "cylindrical-cage-antenna";
  cageAntenna.position.set(0.5, 0.1, 0);

  // Base insulator collar (6)
  const baseInsulator = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.22, 0.3, 16),
    porcelainMat,
  );
  baseInsulator.position.y = 0.15;
  cageAntenna.add(baseInsulator);

  // Central supporting mast (7)
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.2, 16), woodMat);
  mast.position.y = 1.75;
  cageAntenna.add(mast);

  // Circular spreader hoops (5) at multiple elevations
  const hoopElevations = [0.6, 1.4, 2.2, 3.0];
  const cageRadius = 0.45;
  for (const yElev of hoopElevations) {
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(cageRadius, 0.012, 12, 32), brassMat);
    hoop.rotation.x = Math.PI / 2;
    hoop.position.y = yElev;
    cageAntenna.add(hoop);

    // Radial spokes (6)
    for (let s = 0; s < 4; s++) {
      const spokeAngle = (s * Math.PI) / 2;
      const spoke = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, cageRadius * 2, 8),
        brassMat,
      );
      spoke.rotation.z = Math.PI / 2;
      spoke.rotation.y = spokeAngle;
      spoke.position.y = yElev;
      cageAntenna.add(spoke);
    }
  }

  // 12 Vertical Bronze Radiating Wires (4)
  const cageWires: THREE.Mesh[] = [];
  const numWires = 12;
  for (let w = 0; w < numWires; w++) {
    const wireAngle = (w * 2 * Math.PI) / numWires;
    const wireX = Math.cos(wireAngle) * cageRadius;
    const wireZ = Math.sin(wireAngle) * cageRadius;

    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 2.4, 8), wireMat);
    wire.position.set(wireX, 1.8, wireZ);
    cageAntenna.add(wire);
    cageWires.push(wire);
  }

  // Bottom feeder convergence wires (8)
  for (let w = 0; w < numWires; w++) {
    const wireAngle = (w * 2 * Math.PI) / numWires;
    const wireX = Math.cos(wireAngle) * cageRadius;
    const wireZ = Math.sin(wireAngle) * cageRadius;

    const leadGeom = new THREE.CylinderGeometry(0.005, 0.005, 0.45, 8);
    const lead = new THREE.Mesh(leadGeom, copperMat);
    lead.position.set(wireX / 2, 0.4, wireZ / 2);
    lead.lookAt(0, 0.25, 0);
    lead.rotateX(Math.PI / 2);
    cageAntenna.add(lead);
  }
  root.add(cageAntenna);

  // 5. Radiating Continuous Electromagnetic Wavefronts
  const waveRings: THREE.Mesh[] = [];
  for (let r = 0; r < 5; r++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.8 + r * 0.5, 0.02, 12, 32), waveMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0.5, 1.8, 0);
    root.add(ring);
    waveRings.push(ring);
  }

  // 6. Receiver Station & Liquid Barretter (Right Side: x = 1.9)
  const electrolyticCup = new THREE.Group();
  electrolyticCup.name = "liquid-barretter-detector";
  electrolyticCup.position.set(1.9, 0.2, 0);

  // Heavy brass base plate
  const cupBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.05, 24), brassMat);
  electrolyticCup.add(cupBase);

  // Glass acid vessel (13)
  const cupGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.25, 24), glassMat);
  cupGlass.position.y = 0.15;
  electrolyticCup.add(cupGlass);

  // Dilute nitric acid fluid
  const acidFluid = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.16, 24), acidMat);
  acidFluid.position.y = 0.11;
  electrolyticCup.add(acidFluid);

  // Micro-manipulator micrometer screw pillar
  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45, 12), brassMat);
  pillar.position.set(0.16, 0.25, 0);
  electrolyticCup.add(pillar);

  const thumbScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 16), brassMat);
  thumbScrew.position.set(0.16, 0.48, 0);
  electrolyticCup.add(thumbScrew);

  // Wollaston platinum fine-wire electrode (14)
  const wollastonElectrode = new THREE.Mesh(
    new THREE.CylinderGeometry(0.004, 0.004, 0.22, 8),
    porcelainMat,
  );
  wollastonElectrode.position.set(0, 0.26, 0);
  electrolyticCup.add(wollastonElectrode);

  // Thermal ionization point glow
  const thermalSparkGlow = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 12), glowMat);
  thermalSparkGlow.position.set(0, 0.15, 0);
  electrolyticCup.add(thermalSparkGlow);
  root.add(electrolyticCup);

  // 7. Telephone Headset Receiver (16: x = 2.4)
  const telephoneHeadset = new THREE.Group();
  telephoneHeadset.name = "telephone-headset-receiver";
  telephoneHeadset.position.set(2.4, 0.15, 0.4);

  // Headband spring arc
  const headband = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.01, 8, 24, Math.PI), castIronMat);
  headband.rotation.z = Math.PI / 2;
  headband.position.y = 0.22;
  telephoneHeadset.add(headband);

  // Dual earpieces
  const ear1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 20), castIronMat);
  ear1.position.set(0, 0.05, -0.22);
  ear1.rotation.x = Math.PI / 2;
  telephoneHeadset.add(ear1);

  const ear2 = ear1.clone();
  ear2.position.set(0, 0.05, 0.22);
  telephoneHeadset.add(ear2);

  // Brass binding terminals
  const term1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.04, 8), brassMat);
  term1.position.set(0, 0.12, -0.22);
  telephoneHeadset.add(term1);

  const term2 = term1.clone();
  term2.position.set(0, 0.12, 0.22);
  telephoneHeadset.add(term2);

  root.add(telephoneHeadset);

  const setCutaway = (cutaway: boolean) => {
    castIronMat.transparent = cutaway;
    castIronMat.opacity = cutaway ? 0.35 : 1.0;
    castIronMat.needsUpdate = true;
    woodMat.transparent = cutaway;
    woodMat.opacity = cutaway ? 0.45 : 1.0;
    woodMat.needsUpdate = true;
  };

  return {
    root,
    alternatorRotor,
    tuningCoil,
    cageAntenna,
    cageWires,
    waveRings,
    electrolyticCup,
    wollastonElectrode,
    thermalSparkGlow,
    telephoneHeadset,
    materials,
    setCutaway,
  };
}

export function articulateFessendenWireless(
  nodes: FessendenWirelessModelNodes,
  params: {
    timeSec?: number;
    carrierFrequencyKhz?: number;
    radiatedPowerWatts?: number;
    audioModulationPct?: number;
    isResonant?: boolean;
    waveRingDisplayRate?: number;
    headsetDisplayOmegaRadPerS?: number;
    audioEnvelopeOmegaRadPerS?: number;
  },
) {
  const timeSec = params.timeSec ?? 1.0;
  const carrierFrequencyKhz = params.carrierFrequencyKhz ?? 50;
  const radiatedPowerWatts = params.radiatedPowerWatts ?? 500;
  const audioModulationPct = params.audioModulationPct ?? 70;
  const isResonant = params.isResonant ?? true;
  const waveRingDisplayRate = params.waveRingDisplayRate ?? 0.8;
  const headsetDisplayOmegaRadPerS = params.headsetDisplayOmegaRadPerS ?? 1256.64;
  const audioEnvelopeOmegaRadPerS = params.audioEnvelopeOmegaRadPerS ?? 2513.27;

  // 1. Rotate alternator rotor in synchronization with carrier frequency
  nodes.alternatorRotor.rotation.x = (timeSec * carrierFrequencyKhz * 0.3) % (Math.PI * 2);

  // 2. Pulse cage antenna wire emission with sinusoidal RF current
  const rfPhase = (timeSec * carrierFrequencyKhz * 0.5) % (Math.PI * 2);
  const powerFactor = radiatedPowerWatts / 1000;
  const wireGlow = 0.2 + 0.8 * powerFactor * Math.abs(Math.sin(rfPhase));

  for (let i = 0; i < nodes.cageWires.length; i++) {
    const wire = nodes.cageWires[i];
    const wireMat = wire.material as THREE.MeshStandardMaterial;
    if (wireMat.emissive) {
      if (isResonant) {
        wireMat.emissive.setHex(0x10b981);
        wireMat.emissiveIntensity = wireGlow;
      } else {
        wireMat.emissive.setHex(0xf59e0b);
        wireMat.emissiveIntensity = wireGlow * 0.5;
      }
    }
  }

  // 3. Expand concentric Poynting wave rings outward
  for (let r = 0; r < nodes.waveRings.length; r++) {
    const ring = nodes.waveRings[r];
    const ringPhase = (timeSec * waveRingDisplayRate + r / nodes.waveRings.length) % 1;
    const ringScale = 0.5 + ringPhase * 2.5;
    ring.scale.set(ringScale, ringScale, ringScale);

    const waveMat = ring.material as THREE.MeshBasicMaterial;
    if (waveMat) {
      waveMat.opacity = Math.sin(ringPhase * Math.PI) * 0.45 * powerFactor;
      waveMat.color.setHex(isResonant ? 0x38bdf8 : 0xf59e0b);
    }
  }

  // 4. Modulate thermal barretter point glow
  const audioEnvelope =
    1 + (audioModulationPct / 100) * Math.sin(timeSec * audioEnvelopeOmegaRadPerS);
  const glowScale = Math.max(0.2, powerFactor * audioEnvelope * 1.5);
  nodes.thermalSparkGlow.scale.set(glowScale, glowScale, glowScale);

  const sparkMat = nodes.thermalSparkGlow.material as THREE.MeshBasicMaterial;
  if (sparkMat) {
    sparkMat.opacity = Math.min(1.0, 0.4 + powerFactor * 0.6);
  }

  // 5. Telephone headset acoustic micro-vibration
  if (radiatedPowerWatts > 50) {
    nodes.telephoneHeadset.position.y =
      0.15 + Math.sin(timeSec * headsetDisplayOmegaRadPerS) * 0.003 * (audioModulationPct / 100);
  }
}
