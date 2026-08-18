import * as THREE from "three";

export interface CarrierAirConditionerModelNodes {
  root: THREE.Group;
  // Housing & Sump
  housingGroup: THREE.Group;
  solidCasingMesh: THREE.Mesh;
  cutawayCasingMesh: THREE.Mesh;
  sumpTank: THREE.Mesh;
  // Air Flow Dampers
  freshAirDamperLouvers: THREE.Mesh[];
  returnAirDamperLouvers: THREE.Mesh[];
  // Spray Atomizers & Piping
  sprayHeadersGroup: THREE.Group;
  sprayNozzles: THREE.Mesh[];
  recirculatingPump: THREE.Group;
  dewPointThermostatBulb: THREE.Mesh;
  // Eliminator Baffles
  eliminatorBafflesGroup: THREE.Group;
  // Centrifugal Fan
  blowerFanRotor: THREE.Group;
  blowerScrollHousing: THREE.Group;
  // Mist & Droplets
  atomizedMistPoints: THREE.Points;
}

export interface CarrierAirConditionerMaterials {
  galvanizedSteel: THREE.MeshStandardMaterial;
  paintedDarkGreen: THREE.MeshStandardMaterial;
  brassNozzles: THREE.MeshStandardMaterial;
  zincBaffles: THREE.MeshStandardMaterial;
  copperTubing: THREE.MeshStandardMaterial;
  waterSump: THREE.MeshStandardMaterial;
  mistParticle: THREE.PointsMaterial;
}

export interface CarrierAirConditionerModelResult {
  root: THREE.Group;
  nodes: CarrierAirConditionerModelNodes;
  materials: CarrierAirConditionerMaterials;
  dispose: () => void;
}

const MIST_PARTICLE_COUNT = 160;

export function buildCarrierAirConditionerModel(): CarrierAirConditionerModelResult {
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

  // Authentic 1906 Willis Carrier Industrial Air Conditioning Materials
  const materials: CarrierAirConditionerMaterials = {
    galvanizedSteel: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x64748b,
        roughness: 0.45,
        metalness: 0.75,
      }),
    ),
    paintedDarkGreen: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e3a29, // Historic Buffalo Forge industrial green
        roughness: 0.5,
        metalness: 0.55,
      }),
    ),
    brassNozzles: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.2,
        metalness: 0.9,
      }),
    ),
    zincBaffles: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.35,
        metalness: 0.8,
      }),
    ),
    copperTubing: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xb87333,
        roughness: 0.28,
        metalness: 0.92,
      }),
    ),
    waterSump: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.65,
        roughness: 0.1,
        metalness: 0.2,
      }),
    ),
    mistParticle: trackMat(
      new THREE.PointsMaterial({
        size: 0.25,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      }),
    ),
  };

  // -------------------------------------------------------------
  // 1. Structural Base & Sloped Water Collection Sump
  // -------------------------------------------------------------
  const housingGroup = new THREE.Group();
  root.add(housingGroup);

  // Structural angle-iron support legs
  const legPositions = [
    [-3.8, 1.6],
    [-3.8, -1.6],
    [-1.2, 1.6],
    [-1.2, -1.6],
    [1.4, 1.6],
    [1.4, -1.6],
  ];
  for (const [lx, lz] of legPositions) {
    const leg = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.12, 0.9, 0.12)),
      materials.paintedDarkGreen,
    );
    leg.position.set(lx, -1.65, lz);
    housingGroup.add(leg);
  }

  // Water Sump Basin (Bottom of washer)
  const sumpTank = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.8, 0.5, 3.4)),
    materials.paintedDarkGreen,
  );
  sumpTank.position.set(-1.2, -1.15, 0);
  sumpTank.castShadow = true;
  housingGroup.add(sumpTank);

  // Water Surface in Sump
  const waterSurface = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(5.6, 3.2)),
    materials.waterSump,
  );
  waterSurface.rotation.x = -Math.PI / 2;
  waterSurface.position.set(-1.2, -0.92, 0);
  housingGroup.add(waterSurface);

  // -------------------------------------------------------------
  // 2. Galvanized Washer Tunnel (Solid vs Cutaway Modes)
  // -------------------------------------------------------------
  // Solid Full Casing (Outer Galvanized Box)
  const solidCasingMesh = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.6, 2.6, 3.2)),
    materials.galvanizedSteel,
  );
  solidCasingMesh.position.set(-1.2, 0.4, 0);
  solidCasingMesh.castShadow = true;
  solidCasingMesh.visible = false;
  housingGroup.add(solidCasingMesh);

  // Cutaway Casing (Open front with structural angle framing)
  const cutawayCasingMesh = new THREE.Group() as unknown as THREE.Mesh;
  const cutawayTop = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.6, 0.08, 3.2)),
    materials.galvanizedSteel,
  );
  cutawayTop.position.set(-1.2, 1.7, 0);
  housingGroup.add(cutawayTop);

  const cutawayBack = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.6, 2.6, 0.08)),
    materials.galvanizedSteel,
  );
  cutawayBack.position.set(-1.2, 0.4, -1.56);
  housingGroup.add(cutawayBack);

  // -------------------------------------------------------------
  // 3. Intake Air Mixing Louver Dampers
  // -------------------------------------------------------------
  const freshAirDamperLouvers: THREE.Mesh[] = [];
  const returnAirDamperLouvers: THREE.Mesh[] = [];

  // Fresh air louvers (intake at -4.0)
  for (let d = 0; d < 5; d++) {
    const louver = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.04, 0.38, 2.8)),
      materials.zincBaffles,
    );
    louver.position.set(-4.0, -0.6 + d * 0.45, 0);
    louver.rotation.z = Math.PI / 6;
    housingGroup.add(louver);
    freshAirDamperLouvers.push(louver);
  }

  // -------------------------------------------------------------
  // 4. Atomizing Spray Header Trees & Swirl Nozzles (US 808,897)
  // -------------------------------------------------------------
  const sprayHeadersGroup = new THREE.Group();
  sprayHeadersGroup.position.set(0, 0, 0);
  root.add(sprayHeadersGroup);

  const sprayNozzles: THREE.Mesh[] = [];

  // Two vertical spray header rows (Counter-flow & Parallel-flow)
  [-2.6, -1.4].forEach((hx, bankIdx) => {
    [-1.0, 0.0, 1.0].forEach((hz) => {
      // Vertical supply standpipe
      const pipe = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 2.4, 12)),
        materials.copperTubing,
      );
      pipe.position.set(hx, 0.35, hz);
      sprayHeadersGroup.add(pipe);

      // 4 Atomizing Nozzles per pipe
      for (let n = 0; n < 4; n++) {
        const ny = -0.55 + n * 0.6;
        const nozzle = new THREE.Mesh(
          trackGeo(new THREE.ConeGeometry(0.05, 0.16, 8)),
          materials.brassNozzles,
        );
        // First bank sprays against incoming air (counter-flow -X), second bank with air (+X)
        nozzle.rotation.z = bankIdx === 0 ? -Math.PI / 2 : Math.PI / 2;
        nozzle.position.set(bankIdx === 0 ? hx - 0.12 : hx + 0.12, ny, hz);
        sprayHeadersGroup.add(nozzle);
        sprayNozzles.push(nozzle);
      }
    });
  });

  // Centrifugal Recirculating Water Pump & Piping
  const recirculatingPump = new THREE.Group();
  recirculatingPump.position.set(-2.0, -1.35, 1.8);
  root.add(recirculatingPump);

  const pumpVolute = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.35, 0.35, 0.28, 16)),
    materials.paintedDarkGreen,
  );
  pumpVolute.rotation.z = Math.PI / 2;
  recirculatingPump.add(pumpVolute);

  const pumpMotor = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.25, 0.25, 0.6, 16)),
    materials.paintedDarkGreen,
  );
  pumpMotor.rotation.z = Math.PI / 2;
  pumpMotor.position.set(0.45, 0, 0);
  recirculatingPump.add(pumpMotor);

  // Thermostatic Dew-Point Sensing Bulb at washer exit
  const dewPointThermostatBulb = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 12)),
    materials.copperTubing,
  );
  dewPointThermostatBulb.position.set(1.4, 0.4, 0);
  root.add(dewPointThermostatBulb);

  // -------------------------------------------------------------
  // 5. Zig-Zag Mist Eliminator Baffle Plates (Claim 3)
  // -------------------------------------------------------------
  const eliminatorBafflesGroup = new THREE.Group();
  eliminatorBafflesGroup.position.set(0.6, 0.4, 0);
  root.add(eliminatorBafflesGroup);

  // 14 Closely-spaced corrugated chevron baffle plates
  for (let b = 0; b < 14; b++) {
    const bz = -1.3 + b * 0.2;
    // Multi-bend corrugated plate
    const bafflePlate = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.7, 2.3, 0.03)),
      materials.zincBaffles,
    );
    bafflePlate.rotation.y = Math.PI / 4;
    bafflePlate.position.set(0, 0, bz);
    eliminatorBafflesGroup.add(bafflePlate);
  }

  // -------------------------------------------------------------
  // 6. Forward-Curved Centrifugal "Sirocco" Blower Fan
  // -------------------------------------------------------------
  const blowerScrollHousing = new THREE.Group();
  blowerScrollHousing.position.set(3.2, 0.4, 0);
  root.add(blowerScrollHousing);

  // Heavy sheet-metal scroll casing
  const scrollMesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.6, 1.6, 2.2, 28)),
    materials.paintedDarkGreen,
  );
  scrollMesh.rotation.x = Math.PI / 2;
  scrollMesh.castShadow = true;
  blowerScrollHousing.add(scrollMesh);

  // Rectangular Discharge Duct
  const dischargeDuct = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.2, 1.6, 2.2)),
    materials.galvanizedSteel,
  );
  dischargeDuct.position.set(1.4, 0.8, 0);
  blowerScrollHousing.add(dischargeDuct);

  // Squirrel-Cage Fan Impeller Rotor
  const blowerFanRotor = new THREE.Group();
  blowerScrollHousing.add(blowerFanRotor);

  const fanShaft = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 2.8, 16)),
    materials.galvanizedSteel,
  );
  fanShaft.rotation.x = Math.PI / 2;
  blowerFanRotor.add(fanShaft);

  // 24 Forward-curved steel blades
  for (let f = 0; f < 24; f++) {
    const angle = (f * Math.PI * 2) / 24;
    const blade = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.04, 0.35, 1.8)),
      materials.zincBaffles,
    );
    blade.position.set(Math.cos(angle) * 1.3, Math.sin(angle) * 1.3, 0);
    blade.rotation.z = angle + 0.3; // Forward curve tilt
    blowerFanRotor.add(blade);
  }

  // -------------------------------------------------------------
  // 7. Atomized Mist Particles (Dynamic Flow Simulation)
  // -------------------------------------------------------------
  const mistGeo = trackGeo(new THREE.BufferGeometry());
  const mistPositions = new Float32Array(MIST_PARTICLE_COUNT * 3);

  // Deterministic initial seed
  for (let i = 0; i < MIST_PARTICLE_COUNT; i++) {
    const hashX = Math.sin(i * 13.123);
    const hashY = Math.cos(i * 37.456);
    const hashZ = Math.sin(i * 59.789);
    mistPositions[i * 3 + 0] = -3.2 + (hashX + 1) * 1.8; // between -3.2 and 0.4
    mistPositions[i * 3 + 1] = -0.6 + (hashY + 1) * 1.0; // height
    mistPositions[i * 3 + 2] = hashZ * 1.3; // width
  }

  mistGeo.setAttribute("position", new THREE.BufferAttribute(mistPositions, 3));
  const atomizedMistPoints = new THREE.Points(mistGeo, materials.mistParticle);
  root.add(atomizedMistPoints);

  const nodes: CarrierAirConditionerModelNodes = {
    root,
    housingGroup,
    solidCasingMesh,
    cutawayCasingMesh,
    sumpTank,
    freshAirDamperLouvers,
    returnAirDamperLouvers,
    sprayHeadersGroup,
    sprayNozzles,
    recirculatingPump,
    dewPointThermostatBulb,
    eliminatorBafflesGroup,
    blowerFanRotor,
    blowerScrollHousing,
    atomizedMistPoints,
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
 * Updates fan rotor speed, damper angles, and mist particle advection across washer.
 */
export function updateCarrierAirConditionerKinematics(
  nodes: CarrierAirConditionerModelNodes,
  materials: CarrierAirConditionerMaterials,
  dt: number,
  airflowCfm: number,
  _sprayWaterTempC: number,
  showMist: boolean,
  cutawayMode: boolean,
) {
  // 1. Blower Fan Impeller Rotation
  const fanOmega = (airflowCfm / 15000) * 14.0; // rad/s
  nodes.blowerFanRotor.rotation.z -= fanOmega * dt;

  // 2. Cutaway Visibility
  nodes.solidCasingMesh.visible = !cutawayMode;

  // 3. Modulating Dampers Angle (Opens more with higher CFM)
  const damperAngle = (airflowCfm / 25000) * (Math.PI / 3);
  nodes.freshAirDamperLouvers.forEach((louver) => {
    louver.rotation.z = damperAngle;
  });

  // 4. Mist Droplets Advection & Psychrometric Saturation
  materials.mistParticle.opacity = showMist ? 0.75 : 0.0;

  if (showMist) {
    const pos = nodes.atomizedMistPoints.geometry.attributes.position.array as Float32Array;
    const speed = (airflowCfm / 15000) * 3.2;

    for (let i = 0; i < MIST_PARTICLE_COUNT; i++) {
      const idx = i * 3;
      pos[idx] += speed * dt;

      // If particle reaches eliminator baffles (+0.4), it is captured or recycled to intake
      if (pos[idx] > 0.4) {
        const hashX = Math.sin((i + dt * 100) * 13.123);
        const hashY = Math.cos((i + dt * 100) * 37.456);
        const hashZ = Math.sin((i + dt * 100) * 59.789);
        pos[idx] = -3.2 + (hashX + 1) * 0.4;
        pos[idx + 1] = -0.6 + (hashY + 1) * 1.0;
        pos[idx + 2] = hashZ * 1.3;
      }
    }
    nodes.atomizedMistPoints.geometry.attributes.position.needsUpdate = true;
  }
}
