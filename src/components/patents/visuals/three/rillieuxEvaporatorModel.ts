import * as THREE from "three";
import type { RillieuxEvaporatorState } from "@/physics/rillieuxEvaporatorKernel";

export interface RillieuxEvaporatorModelNodes {
  group: THREE.Group;
  vessels: THREE.Group[];
  tubeBundles: THREE.Group[];
  vaporTrunks: THREE.Mesh[];
  condenserGroup: THREE.Group;
  boilingParticles: THREE.Points;
  syrupPipes: THREE.Group;
  condensateDrains: THREE.Group;
  manometers: THREE.Group;
  materials: THREE.Material[];
  geometries: THREE.BufferGeometry[];
  update: (state: RillieuxEvaporatorState, timeSec: number) => void;
  setCutaway?: (cutaway: boolean) => void;
  dispose: () => void;
}

export function createRillieuxEvaporatorModel(): RillieuxEvaporatorModelNodes {
  const group = new THREE.Group();
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const vessels: THREE.Group[] = [];
  const tubeBundles: THREE.Group[] = [];
  const vaporTrunks: THREE.Mesh[] = [];
  const shells: THREE.Mesh[] = [];

  // PBR Materials
  const castIronMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.8,
    roughness: 0.35,
  });
  materials.push(castIronMat);

  const cutawayCastIronMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.8,
    roughness: 0.35,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
  });
  materials.push(cutawayCastIronMat);

  const copperMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.85,
    roughness: 0.25,
  });
  materials.push(copperMat);

  const polishedBrassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.9,
    roughness: 0.2,
  });
  materials.push(polishedBrassMat);

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    transmission: 0.85,
    opacity: 0.7,
    transparent: true,
    roughness: 0.1,
  });
  materials.push(glassMat);

  const mercuryMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.95,
    roughness: 0.1,
  });
  materials.push(mercuryMat);

  const juiceMats = [
    new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.75,
      roughness: 0.1,
    }),
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.8,
      roughness: 0.1,
    }),
    new THREE.MeshStandardMaterial({
      color: 0x78350f,
      transparent: true,
      opacity: 0.9,
      roughness: 0.1,
    }),
  ];
  for (const m of juiceMats) {
    materials.push(m);
  }

  const steamGlowMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
  });
  materials.push(steamGlowMat);

  const masonryBaseMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.9,
  });
  materials.push(masonryBaseMat);

  // Masonry Foundation Plinth
  const plinthGeo = new THREE.BoxGeometry(16.0, 0.4, 6.0);
  geometries.push(plinthGeo);
  const plinthMesh = new THREE.Mesh(plinthGeo, masonryBaseMat);
  plinthMesh.position.y = -2.2;
  group.add(plinthMesh);

  // 1. THREE HORIZONTAL EVAPORATING VESSELS (Effects 1, 2, 3)
  const numVessels = 3;
  const spacing = 4.2;

  for (let i = 0; i < numVessels; i++) {
    const vesselGroup = new THREE.Group();
    const posX = (i - 1) * spacing;
    vesselGroup.position.set(posX, 0, 0);

    // Vessel Cradle Supports (Brick/Iron piers)
    for (const cz of [-1.2, 1.2]) {
      const pierGeo = new THREE.BoxGeometry(0.6, 1.2, 0.8);
      geometries.push(pierGeo);
      const pierMesh = new THREE.Mesh(pierGeo, castIronMat);
      pierMesh.position.set(0, -1.5, cz);
      vesselGroup.add(pierMesh);
    }

    // Main Horizontal Cylindrical Boiler Shell (L = 3.6, R = 1.4)
    const shellGeo = new THREE.CylinderGeometry(1.4, 1.4, 3.6, 32);
    shellGeo.rotateX(Math.PI / 2);
    geometries.push(shellGeo);
    const shellMesh = new THREE.Mesh(shellGeo, castIronMat);
    vesselGroup.add(shellMesh);
    shells.push(shellMesh);

    // End Caps (Flanged Hemispheres)
    for (const capZ of [-1.8, 1.8]) {
      const capGeo = new THREE.SphereGeometry(1.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      if (capZ < 0) capGeo.rotateX(Math.PI);
      geometries.push(capGeo);
      const capMesh = new THREE.Mesh(capGeo, castIronMat);
      capMesh.position.z = capZ;
      vesselGroup.add(capMesh);
      shells.push(capMesh);
    }

    // Upper Vapor Dome (Vertical cylinder on top)
    const domeGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 24);
    geometries.push(domeGeo);
    const domeMesh = new THREE.Mesh(domeGeo, castIronMat);
    domeMesh.position.set(0, 1.6, 0);
    vesselGroup.add(domeMesh);

    // Internal Submerged Copper Tube Bundle (Visible through side cutaway)
    const tubeGroup = new THREE.Group();
    tubeGroup.position.set(0, -0.4, 0);

    const tubeGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.2, 12);
    tubeGeo.rotateX(Math.PI / 2);
    geometries.push(tubeGeo);

    // Grid of 18 copper tubes
    for (let tx = -0.6; tx <= 0.6; tx += 0.3) {
      for (let ty = -0.4; ty <= 0.2; ty += 0.3) {
        const tubeMesh = new THREE.Mesh(tubeGeo, copperMat);
        tubeMesh.position.set(tx, ty, 0);
        tubeGroup.add(tubeMesh);
      }
    }
    vesselGroup.add(tubeGroup);
    tubeBundles.push(tubeGroup);

    // Boiling Juice Liquid Surface (Half cylinder inside vessel)
    const juiceGeo = new THREE.CylinderGeometry(
      1.35,
      1.35,
      3.4,
      24,
      1,
      false,
      Math.PI / 2,
      Math.PI,
    );
    juiceGeo.rotateX(Math.PI / 2);
    geometries.push(juiceGeo);
    const juiceMesh = new THREE.Mesh(juiceGeo, juiceMats[i]);
    juiceMesh.position.y = -0.1;
    vesselGroup.add(juiceMesh);

    // Sight Glass & Thermometer on Front
    const sightGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 16);
    geometries.push(sightGeo);
    const sightMesh = new THREE.Mesh(sightGeo, glassMat);
    sightMesh.position.set(0.8, 0, 1.85);
    vesselGroup.add(sightMesh);

    group.add(vesselGroup);
    vessels.push(vesselGroup);
  }

  // 2. OVERHEAD COPPER VAPOR CROSSOVER TRUNKS (Connecting Domes to Next Stage)
  for (let i = 0; i < numVessels - 1; i++) {
    const startX = (i - 1) * spacing;
    const endX = i * spacing;

    // Overhead U-pipe
    const trunkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(startX, 2.2, 0),
      new THREE.Vector3(startX, 3.0, 0),
      new THREE.Vector3((startX + endX) / 2, 3.2, 0),
      new THREE.Vector3(endX, 3.0, -1.0),
      new THREE.Vector3(endX, 0.5, -1.8),
    ]);
    const trunkGeo = new THREE.TubeGeometry(trunkCurve, 32, 0.22, 16, false);
    geometries.push(trunkGeo);
    const trunkMesh = new THREE.Mesh(trunkGeo, copperMat);
    group.add(trunkMesh);
    vaporTrunks.push(trunkMesh);
  }

  // 3. INTERCONNECTING SYRUP PIPES & BRASS REGULATOR COCKS (Cascading Juice 1 -> 2 -> 3)
  const syrupPipes = new THREE.Group();
  for (let i = 0; i < numVessels - 1; i++) {
    const startX = (i - 1) * spacing + 0.8;
    const endX = i * spacing - 0.8;
    const pipeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(startX, -1.1, 1.4),
      new THREE.Vector3((startX + endX) / 2, -1.4, 1.6),
      new THREE.Vector3(endX, -1.1, 1.4),
    ]);
    const pipeGeo = new THREE.TubeGeometry(pipeCurve, 16, 0.05, 8, false);
    geometries.push(pipeGeo);
    syrupPipes.add(new THREE.Mesh(pipeGeo, copperMat));

    // Brass cock valve handle
    const valveGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 12);
    geometries.push(valveGeo);
    const valveMesh = new THREE.Mesh(valveGeo, polishedBrassMat);
    valveMesh.position.set((startX + endX) / 2, -1.3, 1.6);
    syrupPipes.add(valveMesh);
  }
  group.add(syrupPipes);

  // 4. CONDENSATE DRAIN PIPES UNDER EACH EFFECT
  const condensateDrains = new THREE.Group();
  for (let i = 0; i < numVessels; i++) {
    const posX = (i - 1) * spacing;
    const drainGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8);
    geometries.push(drainGeo);
    const drainMesh = new THREE.Mesh(drainGeo, castIronMat);
    drainMesh.position.set(posX, -1.8, -1.4);
    condensateDrains.add(drainMesh);
  }
  group.add(condensateDrains);

  // 5. MERCURY U-TUBE VACUUM MANOMETERS
  const manometers = new THREE.Group();
  for (let i = 0; i < numVessels; i++) {
    const posX = (i - 1) * spacing;
    const manoGeo = new THREE.BoxGeometry(0.12, 0.6, 0.08);
    geometries.push(manoGeo);
    const manoMesh = new THREE.Mesh(manoGeo, polishedBrassMat);
    manoMesh.position.set(posX - 0.9, 0.6, 1.85);
    manometers.add(manoMesh);

    const tubeU = new THREE.CylinderGeometry(0.02, 0.02, 0.45, 8);
    geometries.push(tubeU);
    const tubeMesh = new THREE.Mesh(tubeU, mercuryMat);
    tubeMesh.position.set(posX - 0.9, 0.6, 1.89);
    manometers.add(tubeMesh);
  }
  group.add(manometers);

  // 6. ENGINE EXHAUST & WEIGHTED REGULATOR VALVE (Left)
  const exhaustCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-7.2, 0, 0),
    new THREE.Vector3(-6.0, 2.0, 0),
    new THREE.Vector3(-4.2, 2.0, -1.8),
    new THREE.Vector3(-4.2, 0.5, -1.8),
  ]);
  const exhaustGeo = new THREE.TubeGeometry(exhaustCurve, 24, 0.25, 16, false);
  geometries.push(exhaustGeo);
  const exhaustMesh = new THREE.Mesh(exhaustGeo, polishedBrassMat);
  group.add(exhaustMesh);

  // 7. BAROMETRIC CONDENSER & VACUUM WATER COLUMN (Right)
  const condenserGroup = new THREE.Group();
  condenserGroup.position.set(6.4, 1.5, 0);

  // Condenser Vessel
  const condVesselGeo = new THREE.CylinderGeometry(0.7, 0.5, 2.4, 24);
  geometries.push(condVesselGeo);
  const condVesselMesh = new THREE.Mesh(condVesselGeo, castIronMat);
  condenserGroup.add(condVesselMesh);

  // Barometric Fall Pipe (Water leg down to hot well)
  const legGeo = new THREE.CylinderGeometry(0.12, 0.12, 4.0, 16);
  geometries.push(legGeo);
  const legMesh = new THREE.Mesh(legGeo, castIronMat);
  legMesh.position.y = -2.6;
  condenserGroup.add(legMesh);

  // Hot Well Sump Tank
  const sumpGeo = new THREE.BoxGeometry(1.2, 0.8, 1.2);
  geometries.push(sumpGeo);
  const sumpMesh = new THREE.Mesh(sumpGeo, masonryBaseMat);
  sumpMesh.position.y = -3.8;
  condenserGroup.add(sumpMesh);

  // Vapor Trunk from Effect 3 to Condenser
  const lastVesselX = spacing;
  const condTrunkCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(lastVesselX, 2.2, 0),
    new THREE.Vector3(lastVesselX, 3.2, 0),
    new THREE.Vector3(5.5, 3.2, 0),
    new THREE.Vector3(6.4, 2.6, 0),
  ]);
  const condTrunkGeo = new THREE.TubeGeometry(condTrunkCurve, 24, 0.22, 16, false);
  geometries.push(condTrunkGeo);
  const condTrunkMesh = new THREE.Mesh(condTrunkGeo, copperMat);
  group.add(condTrunkMesh);

  group.add(condenserGroup);

  // 8. DYNAMIC BOILING STEAM BUBBLE PARTICLES
  const bubbleCount = 90;
  const bubblePositions = new Float32Array(bubbleCount * 3);
  for (let b = 0; b < bubbleCount; b++) {
    const vesselIdx = b % 3;
    const rx = (Math.sin((b + 1) * 19.34) * 43758.5453) % 1;
    const ry = (Math.sin((b + 1) * 71.12) * 43758.5453) % 1;
    const rz = (Math.sin((b + 1) * 43.89) * 43758.5453) % 1;
    const vx = (vesselIdx - 1) * spacing + (Math.abs(rx) - 0.5) * 1.6;
    const vy = -0.8 + Math.abs(ry) * 0.9;
    const vz = (Math.abs(rz) - 0.5) * 1.6;
    bubblePositions[b * 3] = vx;
    bubblePositions[b * 3 + 1] = vy;
    bubblePositions[b * 3 + 2] = vz;
  }
  const bubbleGeo = new THREE.BufferGeometry();
  geometries.push(bubbleGeo);
  bubbleGeo.setAttribute("position", new THREE.BufferAttribute(bubblePositions, 3));
  const bubbleMat = new THREE.PointsMaterial({
    color: 0xfef08a,
    size: 0.05,
    transparent: true,
    opacity: 0.75,
  });
  materials.push(bubbleMat);
  const boilingParticles = new THREE.Points(bubbleGeo, bubbleMat);
  group.add(boilingParticles);

  // Update loop
  const update = (state: RillieuxEvaporatorState, timeSec: number) => {
    // Thermal vibration and boiling bubbling
    const boilSpeed = state.boilDisplayOmegaRadPerS;
    tubeBundles.forEach((tb, idx) => {
      const eff = state.effects[idx];
      const intensity = eff ? eff.heatTransferKw / 2000.0 : 1.0;
      tb.position.y = -0.4 + Math.sin(timeSec * boilSpeed + idx) * 0.015 * intensity;
    });

    // Boiling bubble motion in each vessel
    const bPos = bubbleGeo.attributes.position;
    for (let b = 0; b < bubbleCount; b++) {
      let by = bPos.getY(b) + 0.012 * (boilSpeed / 5.0);
      if (by > 0.3) {
        by = -0.8;
      }
      bPos.setY(b, by);
    }
    bPos.needsUpdate = true;
  };

  const dispose = () => {
    for (const g of geometries) {
      g.dispose();
    }
    for (const m of materials) {
      m.dispose();
    }
  };

  const setCutaway = (cutaway: boolean) => {
    const mat = cutaway ? cutawayCastIronMat : castIronMat;
    shells.forEach((s) => {
      s.material = mat;
    });
  };

  return {
    group,
    vessels,
    tubeBundles,
    vaporTrunks,
    condenserGroup,
    boilingParticles,
    syrupPipes,
    condensateDrains,
    manometers,
    materials,
    geometries,
    update,
    setCutaway,
    dispose,
  };
}
