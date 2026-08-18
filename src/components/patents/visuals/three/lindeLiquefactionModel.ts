import * as THREE from "three";

export interface LindeLiquefactionModelNodes {
  root: THREE.Group;
  // Cryostat Casing & Insulation
  cryostatGroup: THREE.Group;
  solidCasingMesh: THREE.Mesh;
  cutawayCasingMesh: THREE.Mesh;
  supportLegs: THREE.Mesh[];
  // Counter-Current Triple Concentric Coil Exchanger
  counterCurrentCoilGroup: THREE.Group;
  coilRings: THREE.Mesh[];
  inletSupplyPipe: THREE.Mesh;
  returnRecyclePipe: THREE.Mesh;
  // Joule-Thomson Throttling Needle Valve
  jtValveGroup: THREE.Group;
  jtSpindleRod: THREE.Mesh;
  jtHandwheel: THREE.Mesh;
  jtNeedleNozzle: THREE.Mesh;
  // Liquid Air Dewar & Drain
  dewarVessel: THREE.Mesh;
  liquidAirVolume: THREE.Mesh;
  drainCock: THREE.Mesh;
  // Cryogenic Mist Droplets
  cryogenicMistPoints: THREE.Points;
}

export interface LindeLiquefactionMaterials {
  insulatedWoodLagging: THREE.MeshStandardMaterial;
  polishedBrassValve: THREE.MeshStandardMaterial;
  copperCoilWarm: THREE.MeshStandardMaterial;
  copperCoilCold: THREE.MeshStandardMaterial;
  frostedCryoSteel: THREE.MeshStandardMaterial;
  silveredDewarGlass: THREE.MeshStandardMaterial;
  liquidAirPaleBlue: THREE.MeshStandardMaterial;
  cryoMistParticle: THREE.PointsMaterial;
}

export interface LindeLiquefactionModelResult {
  root: THREE.Group;
  nodes: LindeLiquefactionModelNodes;
  materials: LindeLiquefactionMaterials;
  dispose: () => void;
}

const MIST_COUNT = 140;

export function buildLindeLiquefactionModel(): LindeLiquefactionModelResult {
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

  // Authentic 1895 Carl von Linde Materials
  const materials: LindeLiquefactionMaterials = {
    insulatedWoodLagging: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x4a3728, // Insulated mahogany wood casing
        roughness: 0.6,
        metalness: 0.1,
      }),
    ),
    polishedBrassValve: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.22,
        metalness: 0.9,
      }),
    ),
    copperCoilWarm: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xb87333,
        roughness: 0.3,
        metalness: 0.9,
      }),
    ),
    copperCoilCold: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8, // Cryogenic frosted copper
        roughness: 0.25,
        metalness: 0.85,
      }),
    ),
    frostedCryoSteel: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.2,
        metalness: 0.95,
      }),
    ),
    silveredDewarGlass: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        transparent: true,
        opacity: 0.55,
        roughness: 0.1,
        metalness: 0.3,
      }),
    ),
    liquidAirPaleBlue: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0284c7, // Pale blue liquid oxygen/nitrogen mix
        transparent: true,
        opacity: 0.85,
        roughness: 0.05,
        metalness: 0.1,
      }),
    ),
    cryoMistParticle: trackMat(
      new THREE.PointsMaterial({
        size: 0.3,
        color: 0x7dd3fc,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      }),
    ),
  };

  // -------------------------------------------------------------
  // 1. Heavy Insulated Cryostat Column Housing
  // -------------------------------------------------------------
  const cryostatGroup = new THREE.Group();
  root.add(cryostatGroup);

  // Structural Cast-Iron Tripod Legs
  const supportLegs: THREE.Mesh[] = [];
  for (let l = 0; l < 3; l++) {
    const lAngle = (l * Math.PI * 2) / 3;
    const leg = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.08, 0.12, 1.6, 12)),
      materials.frostedCryoSteel,
    );
    leg.position.set(Math.cos(lAngle) * 1.3, -2.6, Math.sin(lAngle) * 1.3);
    leg.rotation.z = Math.cos(lAngle) * 0.15;
    leg.rotation.x = -Math.sin(lAngle) * 0.15;
    leg.receiveShadow = true;
    cryostatGroup.add(leg);
    supportLegs.push(leg);
  }

  // Solid Insulated Outer Barrel Casing
  const solidCasingMesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.4, 1.4, 4.6, 32)),
    materials.insulatedWoodLagging,
  );
  solidCasingMesh.position.set(0, 0.4, 0);
  solidCasingMesh.castShadow = true;
  solidCasingMesh.visible = false;
  cryostatGroup.add(solidCasingMesh);

  // Cutaway Half Casing (To view the nested coaxial heat exchanger coils)
  const cutawayCasingGeo = trackGeo(
    new THREE.CylinderGeometry(1.4, 1.4, 4.6, 32, 1, false, 0, Math.PI),
  );
  cutawayCasingGeo.rotateY(Math.PI / 2);
  const cutawayCasingMesh = new THREE.Mesh(cutawayCasingGeo, materials.insulatedWoodLagging);
  cutawayCasingMesh.position.set(0, 0.4, 0);
  cutawayCasingMesh.castShadow = true;
  cryostatGroup.add(cutawayCasingMesh);

  // Heavy Brass Flange Rings at Top & Bottom of Column
  [-1.9, 2.7].forEach((fy) => {
    const flange = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.48, 1.48, 0.15, 32)),
      materials.polishedBrassValve,
    );
    flange.position.set(0, fy, 0);
    cryostatGroup.add(flange);
  });

  // -------------------------------------------------------------
  // 2. Counter-Current Triple Concentric Tube Heat Exchanger (Claim 2)
  // -------------------------------------------------------------
  const counterCurrentCoilGroup = new THREE.Group();
  root.add(counterCurrentCoilGroup);

  const coilRings: THREE.Mesh[] = [];
  const coilTurns = 18;

  // Helical spiral coil with color gradient from warm copper (top) to frosted cryo-blue (bottom)
  for (let c = 0; c < coilTurns; c++) {
    const fraction = c / (coilTurns - 1);
    const coilMat = fraction < 0.5 ? materials.copperCoilWarm : materials.copperCoilCold;

    const ring = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.95, 0.08, 12, 36)), coilMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 2.3 - c * 0.22, 0);
    counterCurrentCoilGroup.add(ring);
    coilRings.push(ring);
  }

  // High-Pressure Supply Pipe (200 bar inlet at top)
  const inletSupplyPipe = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 12)),
    materials.copperCoilWarm,
  );
  inletSupplyPipe.position.set(-1.2, 2.8, 0);
  inletSupplyPipe.rotation.z = Math.PI / 4;
  counterCurrentCoilGroup.add(inletSupplyPipe);

  // Low-Pressure Cold Return Gas Pipe (1 bar recycle to compressor)
  const returnRecyclePipe = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.09, 0.09, 1.2, 12)),
    materials.copperCoilCold,
  );
  returnRecyclePipe.position.set(1.2, 2.8, 0);
  returnRecyclePipe.rotation.z = -Math.PI / 4;
  counterCurrentCoilGroup.add(returnRecyclePipe);

  // -------------------------------------------------------------
  // 3. Joule-Thomson Needle Throttling Expansion Valve (Claim 1)
  // -------------------------------------------------------------
  const jtValveGroup = new THREE.Group();
  jtValveGroup.position.set(0, -1.6, 0);
  root.add(jtValveGroup);

  // Valve Body Casting
  const jtBody = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.6, 16)),
    materials.polishedBrassValve,
  );
  jtValveGroup.add(jtBody);

  // Conical Throttling Needle Orifice (R-Ventil)
  const jtNeedleNozzle = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(0.12, 0.35, 12)),
    materials.polishedBrassValve,
  );
  jtNeedleNozzle.rotation.x = Math.PI;
  jtNeedleNozzle.position.set(0, -0.4, 0);
  jtValveGroup.add(jtNeedleNozzle);

  // Long Valve Spindle Rod reaching up through center to top
  const jtSpindleRod = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 4.8, 12)),
    materials.frostedCryoSteel,
  );
  jtSpindleRod.position.set(0, 2.3, 0);
  jtValveGroup.add(jtSpindleRod);

  // Top Operating Handwheel (for needle adjustment)
  const jtHandwheel = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.38, 0.05, 8, 24)),
    materials.polishedBrassValve,
  );
  jtHandwheel.rotation.x = Math.PI / 2;
  jtHandwheel.position.set(0, 4.7, 0);
  jtValveGroup.add(jtHandwheel);

  // -------------------------------------------------------------
  // 4. Cryogenic Liquid Air Receiver Dewar Vessel
  // -------------------------------------------------------------
  const dewarVessel = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.75, 0.75, 0.9, 24)),
    materials.silveredDewarGlass,
  );
  dewarVessel.position.set(0, -2.25, 0);
  root.add(dewarVessel);

  // Boiling Liquid Air Pool at -194.5 C
  const liquidAirVolume = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.68, 0.68, 0.5, 24)),
    materials.liquidAirPaleBlue,
  );
  liquidAirVolume.position.set(0, -2.4, 0);
  root.add(liquidAirVolume);

  // Bottom Liquid Air Drain Cock & Sampling Spigot
  const drainCock = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 12)),
    materials.polishedBrassValve,
  );
  drainCock.position.set(0, -2.85, 0);
  root.add(drainCock);

  // -------------------------------------------------------------
  // 5. Cryogenic Expanding Mist & Condensation Jet
  // -------------------------------------------------------------
  const mistGeo = trackGeo(new THREE.BufferGeometry());
  const mistPositions = new Float32Array(MIST_COUNT * 3);

  for (let i = 0; i < MIST_COUNT; i++) {
    const r = Math.sqrt((i + 1) / MIST_COUNT) * 0.55;
    const a = i * 2.39996; // Golden angle
    mistPositions[i * 3 + 0] = Math.cos(a) * r;
    mistPositions[i * 3 + 1] = -1.7 - (i / MIST_COUNT) * 0.6;
    mistPositions[i * 3 + 2] = Math.sin(a) * r;
  }

  mistGeo.setAttribute("position", new THREE.BufferAttribute(mistPositions, 3));
  const cryogenicMistPoints = new THREE.Points(mistGeo, materials.cryoMistParticle);
  root.add(cryogenicMistPoints);

  const nodes: LindeLiquefactionModelNodes = {
    root,
    cryostatGroup,
    solidCasingMesh,
    cutawayCasingMesh,
    supportLegs,
    counterCurrentCoilGroup,
    coilRings,
    inletSupplyPipe,
    returnRecyclePipe,
    jtValveGroup,
    jtSpindleRod,
    jtHandwheel,
    jtNeedleNozzle,
    dewarVessel,
    liquidAirVolume,
    drainCock,
    cryogenicMistPoints,
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
 * Updates Joule-Thomson expansion jet, handwheel throttle angle, and mist advection.
 */
export function updateLindeLiquefactionKinematics(
  nodes: LindeLiquefactionModelNodes,
  materials: LindeLiquefactionMaterials,
  dt: number,
  timeSec: number,
  inletPressureBar: number,
  showMist: boolean,
  cutawayMode: boolean,
) {
  // 1. Handwheel Throttle Rotation
  nodes.jtHandwheel.rotation.z = Math.sin(timeSec * 0.4) * 0.2;

  // 2. Cutaway Visibility
  nodes.solidCasingMesh.visible = !cutawayMode;
  nodes.cutawayCasingMesh.visible = cutawayMode;

  // 3. Liquid Air Pool gentle boiling slosh
  nodes.liquidAirVolume.scale.y = 1.0 + Math.sin(timeSec * 3.0) * 0.04;

  // 4. Joule-Thomson Cryogenic Expanding Jet
  materials.cryoMistParticle.opacity = showMist
    ? Math.min(0.95, (inletPressureBar / 200) * 0.85)
    : 0.0;

  if (showMist) {
    const pos = nodes.cryogenicMistPoints.geometry.attributes.position.array as Float32Array;
    const jetSpeed = (inletPressureBar / 200) * 1.6;

    for (let i = 0; i < MIST_COUNT; i++) {
      const idx = i * 3;
      pos[idx + 1] -= jetSpeed * dt;

      // Reset mist particles when they reach dewar bottom
      if (pos[idx + 1] < -2.5) {
        const r = Math.sqrt((i + 1) / MIST_COUNT) * 0.4;
        const a = (i + timeSec * 10) * 2.39996;
        pos[idx + 0] = Math.cos(a) * r;
        pos[idx + 1] = -1.7;
        pos[idx + 2] = Math.sin(a) * r;
      }
    }
    nodes.cryogenicMistPoints.geometry.attributes.position.needsUpdate = true;
  }
}
