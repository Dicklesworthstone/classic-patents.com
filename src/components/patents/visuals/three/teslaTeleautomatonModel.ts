import * as THREE from "three";

export interface TeslaTeleautomatonModelNodes {
  root: THREE.Group;
  // Hull & Deck
  hullGroup: THREE.Group;
  hullMesh: THREE.Mesh;
  cutawayHullMesh: THREE.Mesh;
  deckHatch: THREE.Mesh;
  // Antenna & Signal Beacons
  antennaMast: THREE.Group;
  antennaGlobe: THREE.Mesh;
  bowSignalLamp: THREE.Mesh;
  sternSignalLamp: THREE.Mesh;
  // Interior Logic & Machinery
  rotatingCoherer: THREE.Group;
  steppingDiskLogic: THREE.Group;
  batteryBank: THREE.Group;
  propulsionMotor: THREE.Group;
  steeringMotor: THREE.Group;
  // Rudder & Propeller
  rudderGroup: THREE.Group;
  propellerGroup: THREE.Group;
  // Wireless RF pulse rings
  rfWaveRings: THREE.Mesh[];
}

export interface TeslaTeleautomatonMaterials {
  copperHull: THREE.MeshStandardMaterial;
  polishedBrass: THREE.MeshStandardMaterial;
  ironMachinery: THREE.MeshStandardMaterial;
  glassCoherer: THREE.MeshStandardMaterial;
  batteryLead: THREE.MeshStandardMaterial;
  lampBulbActive: THREE.MeshStandardMaterial;
  lampBulbIdle: THREE.MeshStandardMaterial;
  rfEnergy: THREE.MeshStandardMaterial;
}

export interface TeslaTeleautomatonModelResult {
  root: THREE.Group;
  nodes: TeslaTeleautomatonModelNodes;
  materials: TeslaTeleautomatonMaterials;
  dispose: () => void;
}

export function buildTeslaTeleautomatonModel(): TeslaTeleautomatonModelResult {
  const root = new THREE.Group();
  const disposableGeometries: THREE.BufferGeometry[] = [];
  const disposableMaterials: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    disposableGeometries.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    disposableMaterials.push(mat);
    return mat;
  };

  // Authentic 1898 Tesla Robotic Teleautomaton Materials
  const materials: TeslaTeleautomatonMaterials = {
    copperHull: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xb87333,
        roughness: 0.35,
        metalness: 0.85,
      }),
    ),
    polishedBrass: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.22,
        metalness: 0.9,
      }),
    ),
    ironMachinery: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.55,
        metalness: 0.7,
      }),
    ),
    glassCoherer: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.1,
      }),
    ),
    batteryLead: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.7,
        metalness: 0.4,
      }),
    ),
    lampBulbActive: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x38bdf8,
        emissiveIntensity: 1.0,
        roughness: 0.1,
      }),
    ),
    lampBulbIdle: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.3,
        metalness: 0.2,
      }),
    ),
    rfEnergy: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.0,
        emissive: 0x0284c7,
        emissiveIntensity: 0.9,
      }),
    ),
  };

  // -------------------------------------------------------------
  // 1. Heavy Copper & Zinc Submersible Torpedo Hull
  // -------------------------------------------------------------
  const hullGroup = new THREE.Group();
  root.add(hullGroup);

  // Solid Hull Profile (Lathe geometry along X axis)
  const hullSpline: THREE.Vector2[] = [
    new THREE.Vector2(0.01, 3.8), // Bow tip
    new THREE.Vector2(0.35, 3.5),
    new THREE.Vector2(0.72, 2.8),
    new THREE.Vector2(0.88, 1.2), // Midships beam
    new THREE.Vector2(0.88, -1.2),
    new THREE.Vector2(0.65, -2.6),
    new THREE.Vector2(0.3, -3.5),
    new THREE.Vector2(0.08, -3.8), // Stern boss
  ];

  const solidHullGeo = trackGeo(new THREE.LatheGeometry(hullSpline, 32));
  solidHullGeo.rotateZ(Math.PI / 2);
  const hullMesh = new THREE.Mesh(solidHullGeo, materials.copperHull);
  hullMesh.castShadow = true;
  hullGroup.add(hullMesh);

  // Cutaway Hull (Half shell to inspect interior teleautomaton mechanisms)
  const cutawayHullGeo = trackGeo(new THREE.LatheGeometry(hullSpline, 32, 0, Math.PI));
  cutawayHullGeo.rotateZ(Math.PI / 2);
  cutawayHullGeo.rotateX(Math.PI / 2);
  const cutawayHullMesh = new THREE.Mesh(cutawayHullGeo, materials.copperHull);
  cutawayHullMesh.visible = false;
  hullGroup.add(cutawayHullMesh);

  // Watertight Deck Coaming & Removable Service Hatch
  const deckHatch = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.4, 0.12, 0.9)),
    materials.polishedBrass,
  );
  deckHatch.position.set(0, 0.88, 0);
  hullGroup.add(deckHatch);

  // Heavy Lead Keel Ballast Bar
  const keelBallast = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.2, 0.22, 0.25)),
    materials.batteryLead,
  );
  keelBallast.position.set(0, -0.95, 0);
  hullGroup.add(keelBallast);

  // -------------------------------------------------------------
  // 2. Wireless Radio Antenna Mast & Signal Beacon Stanchions
  // -------------------------------------------------------------
  const antennaMast = new THREE.Group();
  antennaMast.position.set(0, 0.9, 0);
  hullGroup.add(antennaMast);

  // Vertical Tubular Antenna Rod
  const mastRod = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.035, 0.04, 2.6, 12)),
    materials.polishedBrass,
  );
  mastRod.position.set(0, 1.3, 0);
  antennaMast.add(mastRod);

  // Terminal Capacitive Brass Globe at Antenna Tip
  const antennaGlobe = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.18, 20, 20)),
    materials.lampBulbActive,
  );
  antennaGlobe.position.set(0, 2.6, 0);
  antennaMast.add(antennaGlobe);

  // Fore & Aft Signaling Light Masts
  const bowSignalLamp = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.1, 16, 16)),
    materials.lampBulbActive,
  );
  bowSignalLamp.position.set(2.2, 1.4, 0);
  hullGroup.add(bowSignalLamp);

  const bowStanchion = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8)),
    materials.polishedBrass,
  );
  bowStanchion.position.set(2.2, 1.05, 0);
  hullGroup.add(bowStanchion);

  const sternSignalLamp = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.1, 16, 16)),
    materials.lampBulbActive,
  );
  sternSignalLamp.position.set(-2.2, 1.4, 0);
  hullGroup.add(sternSignalLamp);

  const sternStanchion = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8)),
    materials.polishedBrass,
  );
  sternStanchion.position.set(-2.2, 1.05, 0);
  hullGroup.add(sternStanchion);

  // -------------------------------------------------------------
  // 3. Radio Coherer & Rotating Decoherer Mechanism (US 613,809)
  // -------------------------------------------------------------
  const rotatingCoherer = new THREE.Group();
  rotatingCoherer.position.set(0.6, 0.35, 0);
  hullGroup.add(rotatingCoherer);

  // Glass Coherer Tube with Metallic Filings
  const cohererTube = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 0.7, 16)),
    materials.glassCoherer,
  );
  cohererTube.rotation.z = Math.PI / 2;
  rotatingCoherer.add(cohererTube);

  const brassEndCaps1 = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 16)),
    materials.polishedBrass,
  );
  brassEndCaps1.rotation.z = Math.PI / 2;
  brassEndCaps1.position.set(-0.35, 0, 0);
  rotatingCoherer.add(brassEndCaps1);

  const brassEndCaps2 = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 16)),
    materials.polishedBrass,
  );
  brassEndCaps2.rotation.z = Math.PI / 2;
  brassEndCaps2.position.set(0.35, 0, 0);
  rotatingCoherer.add(brassEndCaps2);

  // -------------------------------------------------------------
  // 4. Stepping-Disk Multi-State Logic Multiplexer
  // -------------------------------------------------------------
  const steppingDiskLogic = new THREE.Group();
  steppingDiskLogic.position.set(0, 0.35, 0);
  hullGroup.add(steppingDiskLogic);

  // Rotary Pin Drum / Stepping Disc
  const drumMesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.32, 0.32, 0.22, 24)),
    materials.polishedBrass,
  );
  drumMesh.rotation.x = Math.PI / 2;
  steppingDiskLogic.add(drumMesh);

  // Contact Pegs around circumference
  for (let p = 0; p < 8; p++) {
    const pAngle = (p * Math.PI * 2) / 8;
    const peg = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.02, 0.02, 0.08, 8)),
      materials.polishedBrass,
    );
    peg.position.set(Math.cos(pAngle) * 0.34, Math.sin(pAngle) * 0.34, 0);
    peg.rotation.z = pAngle;
    steppingDiskLogic.add(peg);
  }

  // -------------------------------------------------------------
  // 5. Submerged Lead-Acid Battery Bank (Accumulator Cells)
  // -------------------------------------------------------------
  const batteryBank = new THREE.Group();
  batteryBank.position.set(-0.9, -0.3, 0);
  hullGroup.add(batteryBank);

  // 6 Lead-Acid Jar Cells in Oak Crates
  for (let b = 0; b < 6; b++) {
    const bx = -0.6 + (b % 3) * 0.6;
    const bz = b < 3 ? -0.22 : 0.22;
    const cell = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.48, 0.55, 0.36)),
      materials.batteryLead,
    );
    cell.position.set(bx, 0, bz);
    batteryBank.add(cell);
  }

  // -------------------------------------------------------------
  // 6. Main Electric Propulsion Motor & Reduction Gearbox
  // -------------------------------------------------------------
  const propulsionMotor = new THREE.Group();
  propulsionMotor.position.set(-2.0, -0.25, 0);
  hullGroup.add(propulsionMotor);

  // Cylindrical DC Motor Field Frame
  const motorStator = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.38, 0.38, 0.85, 20)),
    materials.ironMachinery,
  );
  motorStator.rotation.z = Math.PI / 2;
  motorStator.castShadow = true;
  propulsionMotor.add(motorStator);

  // Commutator & Brush Rigging
  const commutator = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.16, 0.16, 0.22, 16)),
    materials.polishedBrass,
  );
  commutator.rotation.z = Math.PI / 2;
  commutator.position.set(0.45, 0, 0);
  propulsionMotor.add(commutator);

  // -------------------------------------------------------------
  // 7. Electric Steering Motor & Worm Gear
  // -------------------------------------------------------------
  const steeringMotor = new THREE.Group();
  steeringMotor.position.set(-2.8, 0.3, 0);
  hullGroup.add(steeringMotor);

  const steerStator = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.2, 0.2, 0.45, 16)),
    materials.ironMachinery,
  );
  steerStator.rotation.x = Math.PI / 2;
  steeringMotor.add(steerStator);

  // -------------------------------------------------------------
  // 8. 3-Blade Screw Propeller & Spade Rudder
  // -------------------------------------------------------------
  const propellerGroup = new THREE.Group();
  propellerGroup.position.set(-3.95, -0.4, 0);
  hullGroup.add(propellerGroup);

  // Propeller Hub
  const propHub = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.09, 0.09, 0.24, 16)),
    materials.polishedBrass,
  );
  propHub.rotation.z = Math.PI / 2;
  propellerGroup.add(propHub);

  // 3 Curved Hydrodynamic Blades
  for (let b = 0; b < 3; b++) {
    const bAngle = (b * Math.PI * 2) / 3;
    const blade = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.06, 0.55, 0.14)),
      materials.polishedBrass,
    );
    blade.position.set(0, Math.cos(bAngle) * 0.3, Math.sin(bAngle) * 0.3);
    blade.rotation.x = bAngle;
    blade.rotation.y = 0.4; // Pitch angle
    propellerGroup.add(blade);
  }

  // Steerable Spade Rudder
  const rudderGroup = new THREE.Group();
  rudderGroup.position.set(-4.2, -0.4, 0);
  hullGroup.add(rudderGroup);

  const rudderStock = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 12)),
    materials.polishedBrass,
  );
  rudderStock.position.set(0, 0.3, 0);
  rudderGroup.add(rudderStock);

  const rudderBlade = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.65, 0.8, 0.05)),
    materials.polishedBrass,
  );
  rudderBlade.position.set(-0.32, 0, 0);
  rudderBlade.castShadow = true;
  rudderGroup.add(rudderBlade);

  // -------------------------------------------------------------
  // 9. Wireless RF Electromagnetic Wave Particle Rings
  // -------------------------------------------------------------
  const rfWaveRings: THREE.Mesh[] = [];
  for (let w = 0; w < 4; w++) {
    const ring = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.5 + w * 0.6, 0.03, 8, 32)),
      materials.rfEnergy,
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 3.5, 0);
    root.add(ring);
    rfWaveRings.push(ring);
  }

  const nodes: TeslaTeleautomatonModelNodes = {
    root,
    hullGroup,
    hullMesh,
    cutawayHullMesh,
    deckHatch,
    antennaMast,
    antennaGlobe,
    bowSignalLamp,
    sternSignalLamp,
    rotatingCoherer,
    steppingDiskLogic,
    batteryBank,
    propulsionMotor,
    steeringMotor,
    rudderGroup,
    propellerGroup,
    rfWaveRings,
  };

  const dispose = () => {
    for (const g of disposableGeometries) {
      g.dispose();
    }
    for (const m of disposableMaterials) {
      m.dispose();
    }
  };

  return { root, nodes, materials, dispose };
}

/**
 * Updates boat pitch/roll buoyancy, propeller spin, rudder steering angle, and RF pulse animation.
 */
export function updateTeslaTeleautomatonKinematics(
  nodes: TeslaTeleautomatonModelNodes,
  materials: TeslaTeleautomatonMaterials,
  dt: number,
  timeSec: number,
  propellerRpm: number,
  rudderAngleDeg: number,
  showRadioWaves: boolean,
  cutawayMode: boolean,
) {
  // 1. Aquatic Wave Buoyancy Motion (Pitch, Roll, Heave)
  const heaveY = Math.sin(timeSec * 1.5) * 0.06;
  const rollZ = Math.sin(timeSec * 1.2) * 0.04;
  const pitchX = Math.cos(timeSec * 1.0) * 0.025;

  nodes.hullGroup.position.y = heaveY;
  nodes.hullGroup.rotation.z = pitchX;
  nodes.hullGroup.rotation.x = rollZ;

  // 2. Propeller Spin
  const propOmega = (propellerRpm * 2 * Math.PI) / 60;
  nodes.propellerGroup.rotation.x += propOmega * dt;

  // 3. Rudder Steering Articulation
  const rudderRad = (rudderAngleDeg * Math.PI) / 180;
  nodes.rudderGroup.rotation.y = rudderRad;

  // 4. Decoherer & Stepping Disk Kinematics
  nodes.rotatingCoherer.rotation.x += dt * 1.5;
  nodes.steppingDiskLogic.rotation.z = Math.floor(timeSec * 0.8) * (Math.PI / 4);

  // 5. Cutaway Shell Toggle
  nodes.hullMesh.visible = !cutawayMode;
  nodes.cutawayHullMesh.visible = cutawayMode;

  // 6. Wireless RF Electromagnetic Wave Propagation
  if (showRadioWaves) {
    materials.rfEnergy.opacity = 0.85;
    nodes.rfWaveRings.forEach((ring, i) => {
      const phase = (timeSec * 2.0 + i * 0.5) % 2.0;
      const scale = 1.0 + phase * 1.8;
      ring.scale.set(scale, scale, scale);
      ring.position.y = 3.5 + phase * 0.8;
    });
  } else {
    materials.rfEnergy.opacity = 0.0;
  }
}
