/**
 * kilbyIntegratedCircuitModel.ts
 *
 * Procedural Three.js WebGL Model for Jack Kilby's Monolithic Integrated Circuit
 * (US Patent 3,138,743 - "Miniaturized Electronic Circuits").
 *
 * Implements the complete monolithic solid circuit bar with integrated mesa
 * transistors, bulk semiconductor resistors, p-n junction capacitors, and
 * gold flying wire bonds.
 */

import * as THREE from "three";
import { stepKilbyIntegratedCircuit } from "@/physics/catalogKernels";

export interface KilbyModelOptions {
  substrateMaterial?: "germanium" | "silicon";
  supplyVoltageV?: number;
  resistorWidthUm?: number;
  resistorLengthUm?: number;
  reverseBiasVoltageV?: number;
  baseDriveCurrentUa?: number;
}

export interface KilbyModel {
  group: THREE.Group;
  dieGroup: THREE.Group;
  transistor1Group: THREE.Group;
  transistor2Group: THREE.Group;
  resistorGroup: THREE.Group;
  capacitorGroup: THREE.Group;
  wireBondsGroup: THREE.Group;
  particlePoints: THREE.Points;
  materials: THREE.Material[];
  geometries: THREE.BufferGeometry[];
  update: (timeSec: number, options?: KilbyModelOptions) => void;
  dispose: () => void;
}

export function createKilbyIntegratedCircuitModel(options: KilbyModelOptions = {}): KilbyModel {
  const group = new THREE.Group();
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];

  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };
  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };

  // 1. Materials
  // Substrate header (Gold-plated Kovar metal tab)
  const headerMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.25,
    }),
  );

  // Single-crystal Germanium / Silicon Die
  const dieMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.75,
      roughness: 0.35,
    }),
  );

  // Mesa Transistor active collector-base material
  const transistorMesaMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x059669,
      metalness: 0.5,
      roughness: 0.4,
    }),
  );

  // Emitter alloyed dot material
  const emitterDotMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.15,
      emissive: new THREE.Color(0xf59e0b),
      emissiveIntensity: 0.2,
    }),
  );

  // Bulk Resistor semiconductor mesa
  const resistorMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x4338ca,
      metalness: 0.4,
      roughness: 0.5,
    }),
  );

  // P-N Junction Capacitor mesa
  const capacitorMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x86198f,
      metalness: 0.5,
      roughness: 0.45,
    }),
  );

  // Depletion layer glow material
  const depletionGlowMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0xe879f9,
      transparent: true,
      opacity: 0.7,
      wireframe: true,
    }),
  );

  // Gold flying wire material
  const goldWireMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.95,
      roughness: 0.2,
    }),
  );

  // Gold bonding ball material
  const goldBallMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2,
    }),
  );

  // 2. Base Header Tab
  const headerGroup = new THREE.Group();
  const headerGeo = trackGeo(new THREE.BoxGeometry(10.0, 0.4, 4.0));
  const headerMesh = new THREE.Mesh(headerGeo, headerMat);
  headerMesh.position.y = -0.2;
  headerGroup.add(headerMesh);

  // Header pins
  const pinGeo = trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 2.5, 12));
  const pinPositions = [-4.0, -2.0, 0, 2.0, 4.0];
  for (const px of pinPositions) {
    const pin = new THREE.Mesh(pinGeo, headerMat);
    pin.position.set(px, -1.5, 0);
    headerGroup.add(pin);
  }
  group.add(headerGroup);

  // 3. Monolithic Germanium Die
  const dieGroup = new THREE.Group();
  // Realistic dimensions scaled: 0.200" x 0.080" x 0.010" -> 8.0 x 0.4 x 3.0
  const dieGeo = trackGeo(new THREE.BoxGeometry(8.0, 0.4, 3.0));
  const dieMesh = new THREE.Mesh(dieGeo, dieMat);
  dieMesh.position.y = 0.2;
  dieGroup.add(dieMesh);
  group.add(dieGroup);

  // 4. Mesa Transistor 1
  const transistor1Group = new THREE.Group();
  const t1MesaGeo = trackGeo(new THREE.BoxGeometry(1.2, 0.3, 1.2));
  const t1Mesa = new THREE.Mesh(t1MesaGeo, transistorMesaMat);
  t1Mesa.position.set(-1.8, 0.55, 0);
  transistor1Group.add(t1Mesa);

  const t1EmitterGeo = trackGeo(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16));
  const t1Emitter = new THREE.Mesh(t1EmitterGeo, emitterDotMat);
  t1Emitter.position.set(-1.8, 0.75, -0.25);
  transistor1Group.add(t1Emitter);
  group.add(transistor1Group);

  // 5. Mesa Transistor 2
  const transistor2Group = new THREE.Group();
  const t2Mesa = new THREE.Mesh(t1MesaGeo, transistorMesaMat);
  t2Mesa.position.set(1.8, 0.55, 0);
  transistor2Group.add(t2Mesa);

  const t2Emitter = new THREE.Mesh(t1EmitterGeo, emitterDotMat);
  t2Emitter.position.set(1.8, 0.75, -0.25);
  transistor2Group.add(t2Emitter);
  group.add(transistor2Group);

  // 6. Bulk Resistor Mesas
  const resistorGroup = new THREE.Group();
  // Resistor 1 (Left Collector Load)
  const r1Geo = trackGeo(new THREE.BoxGeometry(1.6, 0.25, 0.6));
  const r1Mesh = new THREE.Mesh(r1Geo, resistorMat);
  r1Mesh.position.set(-3.2, 0.52, 0.8);
  resistorGroup.add(r1Mesh);

  // Resistor 2 (Right Collector Load)
  const r2Mesh = new THREE.Mesh(r1Geo, resistorMat);
  r2Mesh.position.set(3.2, 0.52, 0.8);
  resistorGroup.add(r2Mesh);

  // Resistor 3 & 4 (Base Biasing Resistors)
  const rBaseGeo = trackGeo(new THREE.BoxGeometry(1.4, 0.25, 0.5));
  const r3Mesh = new THREE.Mesh(rBaseGeo, resistorMat);
  r3Mesh.position.set(-3.2, 0.52, -0.8);
  resistorGroup.add(r3Mesh);

  const r4Mesh = new THREE.Mesh(rBaseGeo, resistorMat);
  r4Mesh.position.set(3.2, 0.52, -0.8);
  resistorGroup.add(r4Mesh);
  group.add(resistorGroup);

  // 7. P-N Junction Capacitor Mesas
  const capacitorGroup = new THREE.Group();
  const c1Geo = trackGeo(new THREE.BoxGeometry(1.0, 0.3, 1.0));
  const c1Mesh = new THREE.Mesh(c1Geo, capacitorMat);
  c1Mesh.position.set(0, 0.55, 0.6);
  capacitorGroup.add(c1Mesh);

  const c1GlowGeo = trackGeo(new THREE.BoxGeometry(1.05, 0.35, 1.05));
  const c1Glow = new THREE.Mesh(c1GlowGeo, depletionGlowMat);
  c1Glow.position.set(0, 0.55, 0.6);
  capacitorGroup.add(c1Glow);
  group.add(capacitorGroup);

  // 8. Gold Flying Wire Bonds (Catenary curve tubes)
  const wireBondsGroup = new THREE.Group();

  const createWireBond = (p1: THREE.Vector3, p2: THREE.Vector3, peakHeight: number) => {
    const mid = new THREE.Vector3()
      .addVectors(p1, p2)
      .multiplyScalar(0.5)
      .add(new THREE.Vector3(0, peakHeight, 0));
    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
    const wireGeo = trackGeo(new THREE.TubeGeometry(curve, 20, 0.035, 8, false));
    const wireMesh = new THREE.Mesh(wireGeo, goldWireMat);
    wireBondsGroup.add(wireMesh);

    // Ball bonds at terminals
    const ballGeo = trackGeo(new THREE.SphereGeometry(0.08, 12, 12));
    const b1 = new THREE.Mesh(ballGeo, goldBallMat);
    b1.position.copy(p1);
    const b2 = new THREE.Mesh(ballGeo, goldBallMat);
    b2.position.copy(p2);
    wireBondsGroup.add(b1);
    wireBondsGroup.add(b2);
  };

  // Wire 1: R1 to T1 Collector
  createWireBond(new THREE.Vector3(-2.4, 0.65, 0.8), new THREE.Vector3(-1.8, 0.7, 0.3), 0.8);

  // Wire 2: T1 Collector to Capacitor C1
  createWireBond(new THREE.Vector3(-1.8, 0.7, 0.3), new THREE.Vector3(-0.4, 0.7, 0.6), 1.0);

  // Wire 3: Capacitor C1 to T2 Base
  createWireBond(new THREE.Vector3(0.4, 0.7, 0.6), new THREE.Vector3(1.8, 0.7, 0.1), 0.9);

  // Wire 4: R2 to T2 Collector
  createWireBond(new THREE.Vector3(2.4, 0.65, 0.8), new THREE.Vector3(1.8, 0.7, 0.3), 0.8);

  // Wire 5: T1 Emitter to Ground Header
  createWireBond(new THREE.Vector3(-1.8, 0.75, -0.25), new THREE.Vector3(-2.0, 0.0, -1.8), 0.7);

  // Wire 6: T2 Emitter to Ground Header
  createWireBond(new THREE.Vector3(1.8, 0.75, -0.25), new THREE.Vector3(2.0, 0.0, -1.8), 0.7);

  group.add(wireBondsGroup);

  // 9. Charge Carrier Particles (Drift electrons)
  const particleCount = 120;
  const particleGeo = trackGeo(new THREE.BufferGeometry());
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = Math.sin(i * 99) * 3.5;
    particlePositions[i * 3 + 1] = 0.4 + Math.sin(i * 33) * 0.1;
    particlePositions[i * 3 + 2] = Math.cos(i * 77) * 1.2;
  }
  particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = trackMat(
    new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.12,
      transparent: true,
      opacity: 0.8,
    }),
  );
  const particlePoints = new THREE.Points(particleGeo, particleMat);
  group.add(particlePoints);

  // 10. Update function
  const update = (timeSec: number, opt?: KilbyModelOptions) => {
    const currentOpt = { ...options, ...opt };
    const state = stepKilbyIntegratedCircuit({
      substrateMaterial: currentOpt.substrateMaterial ?? "germanium",
      supplyVoltageV: currentOpt.supplyVoltageV ?? 6.0,
      resistorWidthUm: currentOpt.resistorWidthUm ?? 50.0,
      resistorLengthUm: currentOpt.resistorLengthUm ?? 500.0,
      reverseBiasVoltageV: currentOpt.reverseBiasVoltageV ?? 3.0,
      baseDriveCurrentUa: currentOpt.baseDriveCurrentUa ?? 40.0,
    });

    // Update capacitor depletion glow scale
    const depScale = Math.max(0.5, Math.min(2.0, state.depletionWidthUm / 1.5));
    c1Glow.scale.set(1.0, depScale, 1.0);

    // Update transistor emitter glow with live switching
    const pulse = 0.5 + 0.5 * Math.sin(timeSec * 6.0);
    emitterDotMat.emissiveIntensity = 0.1 + 0.6 * pulse * (state.collectorCurrentMa / 10.0);

    // Update drift electron particle positions
    const posAttr = particleGeo.getAttribute("position") as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      let px = array[i * 3];
      px += 0.03 * (state.collectorCurrentMa / 5.0);
      if (px > 3.8) px = -3.8;
      array[i * 3] = px;
    }
    posAttr.needsUpdate = true;
  };

  // 11. Dispose function
  const dispose = () => {
    for (const g of geometries) {
      g.dispose();
    }
    for (const m of materials) {
      m.dispose();
    }
  };

  return {
    group,
    dieGroup,
    transistor1Group,
    transistor2Group,
    resistorGroup,
    capacitorGroup,
    wireBondsGroup,
    particlePoints,
    materials,
    geometries,
    update,
    dispose,
  };
}
