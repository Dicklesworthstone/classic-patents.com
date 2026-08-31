/**
 * baekelandBakeliteModel.ts
 *
 * Procedural 3D WebGL Model for Leo Hendrik Baekeland's 1909 Bakelite Synthetic Polymer
 * (US Patent 942,699 - "Method of Making Insoluble Products of Phenol and Formaldehyde").
 *
 * Procedurally models:
 * 1. Editorial closed-vessel model: cast-iron pressure vessel with a steam-jacket analogue,
 *    bolted door flange, and pipe manifold. The source names a closed vessel under pressure,
 *    not a specific apparatus.
 * 2. Hydraulic Mold Press: Inner compression mold cavity with upper clamping ram.
 * 3. Editorial specimen state: modern visual interpretation of the source's hard, insoluble,
 *    and infusible body.
 * 4. Modern molecular interpretation: deterministic spatial network, not a source drawing.
 * 5. Pressure & Temperature Gauges: Bourdon tube pressure dial and bimetallic temperature dial.
 */

import * as THREE from "three";
import { stepBaekelandBakelite } from "@/physics/catalogKernels";

export interface BaekelandBakeliteModelNodes {
  rootGroup: THREE.Group;
  autoclaveShell: THREE.Mesh;
  cutawayShell: THREE.Mesh;
  doorFlangeGroup: THREE.Group;
  ramGroup: THREE.Group;
  moldGroup: THREE.Group;
  bakeliteSpecimen: THREE.Mesh;
  molecularNetworkGroup: THREE.Group;
  pressureNeedle: THREE.Mesh;
  tempNeedle: THREE.Mesh;
  bubbleParticlesGroup: THREE.Group;
  calloutsGroup: THREE.Group;
}

export interface BaekelandBakeliteMaterials {
  castIron: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  steelJacket: THREE.MeshStandardMaterial;
  steamPipe: THREE.MeshStandardMaterial;
  bakeliteResin: THREE.MeshPhysicalMaterial;
  phenolRing: THREE.MeshStandardMaterial;
  methyleneBond: THREE.MeshStandardMaterial;
  gaugeDial: THREE.MeshStandardMaterial;
  needleMat: THREE.MeshStandardMaterial;
  voidBubble: THREE.MeshStandardMaterial;
}

export interface BaekelandBakeliteModelResult {
  rootGroup: THREE.Group;
  nodes: BaekelandBakeliteModelNodes;
  materials: BaekelandBakeliteMaterials;
  update: (controls: Record<string, number>, timeSec: number) => void;
  setCutaway: (enabled: boolean) => void;
  setCalloutsVisible: (visible: boolean) => void;
}

export function buildBaekelandBakeliteModel(): BaekelandBakeliteModelResult {
  const rootGroup = new THREE.Group();
  rootGroup.name = "BaekelandBakelite_Root";

  // Materials
  const materials: BaekelandBakeliteMaterials = {
    castIron: new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.8,
      roughness: 0.4,
    }),
    brass: new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.85,
      roughness: 0.25,
    }),
    steelJacket: new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.6,
      roughness: 0.5,
    }),
    steamPipe: new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.2,
    }),
    bakeliteResin: new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      metalness: 0.1,
      roughness: 0.15,
      transmission: 0.6,
      thickness: 1.2,
      ior: 1.6,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    }),
    phenolRing: new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      metalness: 0.3,
      roughness: 0.3,
    }),
    methyleneBond: new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.5,
      roughness: 0.2,
      transparent: true,
      opacity: 0.3,
    }),
    gaugeDial: new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.8,
    }),
    needleMat: new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.3,
    }),
    voidBubble: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
    }),
  };

  // 1. Autoclave Main Pressure Cylinder (Length: 3.2m, Radius: 0.9m)
  const autoclaveGroup = new THREE.Group();
  autoclaveGroup.name = "Autoclave_Vessel";
  rootGroup.add(autoclaveGroup);

  const shellGeo = new THREE.CylinderGeometry(0.9, 0.9, 3.2, 32, 1, false);
  const autoclaveShell = new THREE.Mesh(shellGeo, materials.castIron);
  autoclaveShell.rotation.z = Math.PI / 2;
  autoclaveShell.position.set(0, 1.3, 0);
  autoclaveGroup.add(autoclaveShell);

  // Cutaway shell (half-cylinder for cutaway observation)
  const cutawayGeo = new THREE.CylinderGeometry(0.9, 0.9, 3.2, 32, 1, false, 0, Math.PI);
  const cutawayShell = new THREE.Mesh(cutawayGeo, materials.castIron);
  cutawayShell.rotation.z = Math.PI / 2;
  cutawayShell.rotation.y = Math.PI / 2;
  cutawayShell.position.set(0, 1.3, 0);
  cutawayShell.visible = false;
  autoclaveGroup.add(cutawayShell);

  // Outer Steam Jacket Casing
  const jacketGeo = new THREE.CylinderGeometry(1.05, 1.05, 2.6, 32);
  const steamJacket = new THREE.Mesh(jacketGeo, materials.steelJacket);
  steamJacket.rotation.z = Math.PI / 2;
  steamJacket.position.set(0, 1.3, 0);
  autoclaveGroup.add(steamJacket);

  // Heavy Bolted Door Flange on Front End
  const doorFlangeGroup = new THREE.Group();
  doorFlangeGroup.position.set(1.6, 1.3, 0);
  autoclaveGroup.add(doorFlangeGroup);

  const doorRingGeo = new THREE.TorusGeometry(0.92, 0.12, 16, 32);
  const doorRing = new THREE.Mesh(doorRingGeo, materials.castIron);
  doorRing.rotation.y = Math.PI / 2;
  doorFlangeGroup.add(doorRing);

  // 12 Perimeter Locking Bolts
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const boltGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.25, 8);
    const bolt = new THREE.Mesh(boltGeo, materials.brass);
    bolt.rotation.z = Math.PI / 2;
    bolt.position.set(0.08, Math.sin(angle) * 0.92, Math.cos(angle) * 0.92);
    doorFlangeGroup.add(bolt);
  }

  // Foundation Bedplate & Concrete Floor Piers
  const foundationGroup = new THREE.Group();
  rootGroup.add(foundationGroup);

  const floorPlinth = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.35, 3.2), materials.castIron);
  floorPlinth.position.set(0, -1.2, 0);
  floorPlinth.receiveShadow = true;
  foundationGroup.add(floorPlinth);

  // Vessel Base Supports (Cradle Legs & Uprights)
  const legMat = materials.castIron;
  for (const xPos of [-1.1, 1.1]) {
    const legGeo = new THREE.BoxGeometry(0.35, 1.4, 2.0);
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(xPos, -0.35, 0);
    leg.castShadow = true;
    foundationGroup.add(leg);
  }

  // Steam Supply & Condensate Floor Manifold Pipes
  const pipeMat = materials.steamPipe;
  const steamSupplyPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 16), pipeMat);
  steamSupplyPipe.position.set(-1.4, 0.2, 1.1);
  foundationGroup.add(steamSupplyPipe);

  const returnPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 16), pipeMat);
  returnPipe.position.set(1.4, 0.2, -1.1);
  foundationGroup.add(returnPipe);

  // 2. Hydraulic Mold Press Chamber (Inside Autoclave)
  const moldGroup = new THREE.Group();
  moldGroup.position.set(0, 1.3, 0);
  rootGroup.add(moldGroup);

  // Lower Die Block
  const lowerDieGeo = new THREE.BoxGeometry(0.8, 0.35, 0.8);
  const lowerDie = new THREE.Mesh(lowerDieGeo, materials.castIron);
  lowerDie.position.set(0, -0.2, 0);
  moldGroup.add(lowerDie);

  // Mold Cavity (Bakelite Specimen)
  const specimenGeo = new THREE.BoxGeometry(0.5, 0.25, 0.5);
  const bakeliteSpecimen = new THREE.Mesh(specimenGeo, materials.bakeliteResin);
  bakeliteSpecimen.position.set(0, 0.05, 0);
  moldGroup.add(bakeliteSpecimen);

  // Upper Clamping Ram
  const ramGroup = new THREE.Group();
  ramGroup.position.set(0, 0.35, 0);
  moldGroup.add(ramGroup);

  const upperDieGeo = new THREE.BoxGeometry(0.8, 0.25, 0.8);
  const upperDie = new THREE.Mesh(upperDieGeo, materials.castIron);
  ramGroup.add(upperDie);

  const pistonRodGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 16);
  const pistonRod = new THREE.Mesh(pistonRodGeo, materials.steamPipe);
  pistonRod.position.set(0, 0.4, 0);
  ramGroup.add(pistonRod);

  // Bubble particles inside mold cavity for foamy state
  const bubbleParticlesGroup = new THREE.Group();
  bubbleParticlesGroup.position.set(0, 0.05, 0);
  moldGroup.add(bubbleParticlesGroup);

  for (let i = 0; i < 30; i++) {
    const r = 0.015 + (i % 5) * 0.008;
    const bubbleGeo = new THREE.SphereGeometry(r, 8, 8);
    const bubble = new THREE.Mesh(bubbleGeo, materials.voidBubble);
    bubble.position.set(Math.sin(i * 1.7) * 0.2, Math.cos(i * 2.3) * 0.08, Math.sin(i * 3.1) * 0.2);
    bubbleParticlesGroup.add(bubble);
  }

  // 3. Top Mounted Pipe Manifold & Gauges
  const pipeManifold = new THREE.Group();
  pipeManifold.position.set(0, 2.3, 0);
  rootGroup.add(pipeManifold);

  // Pressure Gauge
  const pGaugeBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.08, 24),
    materials.brass,
  );
  pGaugeBody.rotation.x = Math.PI / 2;
  pGaugeBody.position.set(-0.5, 0.4, 0);
  pipeManifold.add(pGaugeBody);

  const pDial = new THREE.Mesh(new THREE.CircleGeometry(0.19, 24), materials.gaugeDial);
  pDial.position.set(-0.5, 0.4, 0.045);
  pipeManifold.add(pDial);

  const pNeedleGeo = new THREE.BoxGeometry(0.02, 0.15, 0.01);
  pNeedleGeo.translate(0, 0.06, 0);
  const pressureNeedle = new THREE.Mesh(pNeedleGeo, materials.needleMat);
  pressureNeedle.position.set(-0.5, 0.4, 0.05);
  pipeManifold.add(pressureNeedle);

  // Temperature Gauge
  const tGaugeBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.08, 24),
    materials.brass,
  );
  tGaugeBody.rotation.x = Math.PI / 2;
  tGaugeBody.position.set(0.5, 0.4, 0);
  pipeManifold.add(tGaugeBody);

  const tDial = new THREE.Mesh(new THREE.CircleGeometry(0.19, 24), materials.gaugeDial);
  tDial.position.set(0.5, 0.4, 0.045);
  pipeManifold.add(tDial);

  const tNeedleGeo = new THREE.BoxGeometry(0.02, 0.15, 0.01);
  tNeedleGeo.translate(0, 0.06, 0);
  const tempNeedle = new THREE.Mesh(tNeedleGeo, materials.needleMat);
  tempNeedle.position.set(0.5, 0.4, 0.05);
  pipeManifold.add(tempNeedle);

  // 4. 3D Macromolecular Crosslink Lattice (Floating Pedagogical Visualization)
  const molecularNetworkGroup = new THREE.Group();
  molecularNetworkGroup.name = "Molecular_Crosslinks";
  molecularNetworkGroup.position.set(0, 3.4, 0);
  rootGroup.add(molecularNetworkGroup);

  const ringGeo = new THREE.TorusGeometry(0.12, 0.03, 8, 6); // Benzene hexagon
  const bondGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);

  const ringPositions: THREE.Vector3[] = [];
  for (let ix = -1; ix <= 1; ix++) {
    for (let iy = 0; iy <= 1; iy++) {
      for (let iz = -1; iz <= 1; iz++) {
        const ring = new THREE.Mesh(ringGeo, materials.phenolRing);
        const pos = new THREE.Vector3(ix * 0.6, iy * 0.5, iz * 0.6);
        ring.position.copy(pos);
        ring.rotation.x = Math.PI / 4;
        ring.rotation.y = (ix + iz) * 0.4;
        molecularNetworkGroup.add(ring);
        ringPositions.push(pos);
      }
    }
  }

  // Interconnecting methylene crosslinks
  for (let i = 0; i < ringPositions.length - 1; i++) {
    for (let j = i + 1; j < ringPositions.length; j++) {
      const p1 = ringPositions[i];
      const p2 = ringPositions[j];
      const dist = p1.distanceTo(p2);
      if (dist < 0.75) {
        const bond = new THREE.Mesh(bondGeo, materials.methyleneBond);
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        bond.position.copy(mid);
        bond.scale.set(1, dist / 0.4, 1);
        bond.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3().subVectors(p2, p1).normalize(),
        );
        molecularNetworkGroup.add(bond);
      }
    }
  }

  // 5. Callouts
  const calloutsGroup = new THREE.Group();
  calloutsGroup.name = "Bakelite_Callouts";
  rootGroup.add(calloutsGroup);

  const nodes: BaekelandBakeliteModelNodes = {
    rootGroup,
    autoclaveShell,
    cutawayShell,
    doorFlangeGroup,
    ramGroup,
    moldGroup,
    bakeliteSpecimen,
    molecularNetworkGroup,
    pressureNeedle,
    tempNeedle,
    bubbleParticlesGroup,
    calloutsGroup,
  };

  const update = (controls: Record<string, number>, timeSec: number) => {
    const tempC = controls.curingTempC ?? 130;
    const pressPsi = controls.autoclavePressurePsi ?? 75;
    const catPct = controls.catalystPct ?? 1.5;
    const timeMin = controls.curingTimeMin ?? 60;
    const filler = controls.fillerPct ?? 45;

    const sim = stepBaekelandBakelite(tempC, pressPsi, catPct, timeMin, filler);

    // Update gauge needles
    // Pressure gauge: 0 to 120 psi mapped to angle
    pressureNeedle.rotation.z = -(pressPsi / 120) * Math.PI * 1.5 + 0.75 * Math.PI;
    // Temp gauge: 50 to 200 °C mapped to angle
    tempNeedle.rotation.z = -((tempC - 50) / 150) * Math.PI * 1.5 + 0.75 * Math.PI;

    // Update resin material
    if (sim.resinStage.startsWith("C-stage")) {
      if (sim.isFoamingSuppressed) {
        // Pristine deep amber/brown Bakelite
        materials.bakeliteResin.color.setHex(0x5c2b0e);
        materials.bakeliteResin.roughness = 0.1;
        materials.bakeliteResin.transmission = 0.2;
      } else {
        // Porous mustard yellow foamed Bakelite
        materials.bakeliteResin.color.setHex(0xb45309);
        materials.bakeliteResin.roughness = 0.7;
        materials.bakeliteResin.transmission = 0.05;
      }
    } else if (sim.resinStage.startsWith("B-stage")) {
      materials.bakeliteResin.color.setHex(0xd97706);
      materials.bakeliteResin.roughness = 0.3;
      materials.bakeliteResin.transmission = 0.4;
    } else {
      materials.bakeliteResin.color.setHex(0xf59e0b);
      materials.bakeliteResin.roughness = 0.15;
      materials.bakeliteResin.transmission = 0.7;
    }

    // Toggle bubble visibility
    bubbleParticlesGroup.visible = !sim.isFoamingSuppressed;

    // Update molecular network opacity & rotation
    materials.methyleneBond.opacity = Math.max(0.1, sim.crosslinkDensity / 1.85);
    molecularNetworkGroup.rotation.y = timeSec * sim.networkDisplayOmegaRadPerS;

    // Clamping ram stroke
    ramGroup.position.y = 0.35 - (pressPsi / 120) * 0.06;
  };

  const setCutaway = (enabled: boolean) => {
    autoclaveShell.visible = !enabled;
    cutawayShell.visible = enabled;
    steamJacket.visible = !enabled;
  };

  const setCalloutsVisible = (visible: boolean) => {
    calloutsGroup.visible = visible;
  };

  return {
    rootGroup,
    nodes,
    materials,
    update,
    setCutaway,
    setCalloutsVisible,
  };
}
