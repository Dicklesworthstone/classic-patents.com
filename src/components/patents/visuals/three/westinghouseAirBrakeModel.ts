import * as THREE from "three";
import { westinghouseSparkWheelX, westinghouseSparkWheelZ } from "@/physics/catalogKernels";
import { FrankenSimEngine } from "@/physics/engine";

export interface WestinghouseAirBrakeModelNodes {
  root: THREE.Group;
  // Bogie truck & wheels
  truckGroup: THREE.Group;
  wheelSets: THREE.Group[];
  // Dual-Pipe pneumatic network (US 124,404)
  pipeB: THREE.Group;
  pipeB1: THREE.Group;
  selectingCockCaseD: THREE.Group;
  selectingCockD1: THREE.Group;
  auxiliaryReceiverD: THREE.Group;
  // Brake cylinder C & foundation rigging
  brakeCylinderC: THREE.Group;
  pistonPushRod: THREE.Group;
  frontBrakeBeam: THREE.Group;
  rearBrakeBeam: THREE.Group;
  brakeShoes: THREE.Mesh[];
  // Automatic accident tripping cock e & triggers
  trippingCockE: THREE.Group;
  derailmentStemI1: THREE.Group;
  couplingCordY: THREE.Group;
  // Pneumatic signalling apparatus
  signalGaugeG2: THREE.Group;
  signalGaugeNeedle: THREE.Mesh;
  alarmWhistleH: THREE.Group;
  // Spark & air effects
  frictionSparkPoints: THREE.Points;
}

export interface WestinghouseAirBrakeMaterials {
  castIron: THREE.MeshStandardMaterial;
  chilledWheelSteel: THREE.MeshStandardMaterial;
  paintedBlackIron: THREE.MeshStandardMaterial;
  reservoirSteel: THREE.MeshStandardMaterial;
  brassCockBronze: THREE.MeshStandardMaterial;
  polishedSteelRod: THREE.MeshStandardMaterial;
  woodTie: THREE.MeshStandardMaterial;
  brakeShoeFriction: THREE.MeshStandardMaterial;
  gaugeDialMat: THREE.MeshStandardMaterial;
  sparkParticle: THREE.PointsMaterial;
}

export interface WestinghouseAirBrakeModelResult {
  root: THREE.Group;
  nodes: WestinghouseAirBrakeModelNodes;
  materials: WestinghouseAirBrakeMaterials;
  setCutaway?: (cutaway: boolean) => void;
  dispose: () => void;
}

export function buildWestinghouseAirBrakeModel(): WestinghouseAirBrakeModelResult {
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

  // Authentic 1872 Railroad Materials
  const materials: WestinghouseAirBrakeMaterials = {
    castIron: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x272e39,
        roughness: 0.65,
        metalness: 0.7,
      }),
    ),
    chilledWheelSteel: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.25,
        metalness: 0.9,
      }),
    ),
    paintedBlackIron: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e2229,
        roughness: 0.5,
        metalness: 0.6,
      }),
    ),
    reservoirSteel: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e3a8a,
        roughness: 0.35,
        metalness: 0.85,
      }),
    ),
    brassCockBronze: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.25,
        metalness: 0.88,
      }),
    ),
    polishedSteelRod: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.15,
        metalness: 0.95,
      }),
    ),
    woodTie: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x3e2723,
        roughness: 0.9,
        metalness: 0.05,
      }),
    ),
    brakeShoeFriction: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x78350f,
        roughness: 0.85,
        metalness: 0.3,
      }),
    ),
    gaugeDialMat: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.3,
        metalness: 0.7,
      }),
    ),
    sparkParticle: trackMat(
      new THREE.PointsMaterial({
        size: 0.4,
        color: 0xffaa00,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      }),
    ),
  };

  // -------------------------------------------------------------
  // 1. Railroad Track Foundation & Cross-Ties
  // -------------------------------------------------------------
  const trackGroup = new THREE.Group();
  root.add(trackGroup);

  // 7 Wooden Cross-Ties (Sleepers)
  for (let i = -3; i <= 3; i++) {
    const tie = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.5, 0.28, 4.4)), materials.woodTie);
    tie.position.set(i * 1.5, -2.45, 0);
    tie.receiveShadow = true;
    trackGroup.add(tie);

    // Steel Tie-Plates
    [-1.435 / 2 - 0.3, 1.435 / 2 + 0.3].forEach((pz) => {
      const plate = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.4, 0.04, 0.35)),
        materials.castIron,
      );
      plate.position.set(i * 1.5, -2.29, pz);
      trackGroup.add(plate);
    });
  }

  // Two Continuous Heavy Steel T-Rails (Standard Gauge 4 ft 8.5 in ~ 1.435m)
  [-1.02, 1.02].forEach((rz) => {
    const railBase = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(11.0, 0.06, 0.32)),
      materials.chilledWheelSteel,
    );
    railBase.position.set(0, -2.26, rz);
    trackGroup.add(railBase);

    const railWeb = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(11.0, 0.24, 0.08)),
      materials.chilledWheelSteel,
    );
    railWeb.position.set(0, -2.11, rz);
    trackGroup.add(railWeb);

    const railHead = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(11.0, 0.12, 0.2)),
      materials.polishedSteelRod,
    );
    railHead.position.set(0, -1.93, rz);
    railHead.receiveShadow = true;
    trackGroup.add(railHead);
  });

  // -------------------------------------------------------------
  // 2. Railroad Car Bogie Truck Frame & Wheels
  // -------------------------------------------------------------
  const truckGroup = new THREE.Group();
  root.add(truckGroup);

  // Transverse Iron Bolster Beam
  const bolster = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.6, 0.45, 3.2)),
    materials.paintedBlackIron,
  );
  bolster.position.set(0, -0.65, 0);
  bolster.castShadow = true;
  truckGroup.add(bolster);

  // Arch-Bar Side Frames
  [-1.35, 1.35].forEach((fz) => {
    const sideFrame = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(5.8, 0.16, 0.15)),
      materials.paintedBlackIron,
    );
    sideFrame.position.set(0, -0.85, fz);
    sideFrame.castShadow = true;
    truckGroup.add(sideFrame);

    [-2.2, 2.2].forEach((jx) => {
      const jBox = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.48, 0.48, 0.35)),
        materials.castIron,
      );
      jBox.position.set(jx, -1.05, fz);
      truckGroup.add(jBox);

      const spring = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 0.35, 12)),
        materials.chilledWheelSteel,
      );
      spring.position.set(jx, -0.7, fz);
      truckGroup.add(spring);
    });
  });

  // Two Wheelsets
  const wheelSets: THREE.Group[] = [];
  [-2.2, 2.2].forEach((wx) => {
    const ws = new THREE.Group();
    ws.position.set(wx, -1.05, 0);

    const axle = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.14, 0.14, 2.8, 16)),
      materials.polishedSteelRod,
    );
    axle.rotation.x = Math.PI / 2;
    axle.castShadow = true;
    ws.add(axle);

    [-1.02, 1.02].forEach((wz) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(0, 0, wz);

      const tread = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.88, 0.88, 0.24, 36)),
        materials.chilledWheelSteel,
      );
      tread.rotation.x = Math.PI / 2;
      tread.castShadow = true;
      wheelGroup.add(tread);

      const flange = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.96, 0.96, 0.06, 36)),
        materials.chilledWheelSteel,
      );
      flange.rotation.x = Math.PI / 2;
      flange.position.z = wz > 0 ? -0.1 : 0.1;
      wheelGroup.add(flange);

      const hub = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.28, 0.28, 0.28, 20)),
        materials.castIron,
      );
      hub.rotation.x = Math.PI / 2;
      wheelGroup.add(hub);

      ws.add(wheelGroup);
    });

    truckGroup.add(ws);
    wheelSets.push(ws);
  });

  // -------------------------------------------------------------
  // 3. Paired Continuous Pipes B & B¹ (Claim 2)
  // -------------------------------------------------------------
  const pipeB = new THREE.Group();
  pipeB.position.set(0, 0.9, 0.7);
  root.add(pipeB);

  const pipeBMesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.05, 0.05, 9.4, 16)),
    materials.castIron,
  );
  pipeBMesh.rotation.z = Math.PI / 2;
  pipeB.add(pipeBMesh);

  const pipeB1 = new THREE.Group();
  pipeB1.position.set(0, 0.9, 0.95);
  root.add(pipeB1);

  const pipeB1Mesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.05, 0.05, 9.4, 16)),
    materials.castIron,
  );
  pipeB1Mesh.rotation.z = Math.PI / 2;
  pipeB1.add(pipeB1Mesh);

  // -------------------------------------------------------------
  // 4. Central Selecting Cock Case d & Rotor Cock d¹ (Claim 3)
  // -------------------------------------------------------------
  const selectingCockCaseD = new THREE.Group();
  selectingCockCaseD.position.set(0, 0.9, 0.825);
  root.add(selectingCockCaseD);

  const caseDMesh = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.45, 0.45, 0.45)),
    materials.brassCockBronze,
  );
  selectingCockCaseD.add(caseDMesh);

  const selectingCockD1 = new THREE.Group();
  const rotorMesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.14, 0.14, 0.52, 16)),
    materials.polishedSteelRod,
  );
  rotorMesh.rotation.x = Math.PI / 2;
  selectingCockD1.add(rotorMesh);

  const handleMesh = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.08, 0.35, 0.08)),
    materials.brassCockBronze,
  );
  handleMesh.position.y = 0.25;
  selectingCockD1.add(handleMesh);
  selectingCockCaseD.add(selectingCockD1);

  // -------------------------------------------------------------
  // 5. Auxiliary Stored Air-Receiver D (Claim 1)
  // -------------------------------------------------------------
  const auxiliaryReceiverD = new THREE.Group();
  auxiliaryReceiverD.position.set(-1.5, 0.5, 0);
  root.add(auxiliaryReceiverD);

  const receiverTank = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.48, 0.48, 2.2, 24)),
    materials.reservoirSteel,
  );
  receiverTank.rotation.z = Math.PI / 2;
  receiverTank.castShadow = true;
  auxiliaryReceiverD.add(receiverTank);

  [-1.1, 1.1].forEach((dx) => {
    const dishEnd = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.48, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2)),
      materials.reservoirSteel,
    );
    dishEnd.rotation.z = dx < 0 ? -Math.PI / 2 : Math.PI / 2;
    dishEnd.position.x = dx;
    auxiliaryReceiverD.add(dishEnd);
  });

  // -------------------------------------------------------------
  // 6. Brake Cylinder C & Foundation Push Rod (Claim 1)
  // -------------------------------------------------------------
  const brakeCylinderC = new THREE.Group();
  brakeCylinderC.position.set(1.4, 0.5, 0);
  root.add(brakeCylinderC);

  const cylBody = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.38, 0.38, 1.5, 24)),
    materials.castIron,
  );
  cylBody.rotation.z = Math.PI / 2;
  cylBody.castShadow = true;
  brakeCylinderC.add(cylBody);

  const pistonPushRod = new THREE.Group();
  pistonPushRod.position.set(0.75, 0, 0);
  const rodMesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 1.1, 16)),
    materials.polishedSteelRod,
  );
  rodMesh.rotation.z = Math.PI / 2;
  pistonPushRod.add(rodMesh);
  brakeCylinderC.add(pistonPushRod);

  // -------------------------------------------------------------
  // 7. Foundation Brake Beams & Cast-Iron Shoes
  // -------------------------------------------------------------
  const frontBrakeBeam = new THREE.Group();
  frontBrakeBeam.position.set(-1.4, -1.05, 0);
  root.add(frontBrakeBeam);

  const rearBrakeBeam = new THREE.Group();
  rearBrakeBeam.position.set(1.4, -1.05, 0);
  root.add(rearBrakeBeam);

  const brakeShoes: THREE.Mesh[] = [];
  [frontBrakeBeam, rearBrakeBeam].forEach((beam, bIdx) => {
    const beamBar = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.12, 0.12, 2.6)),
      materials.paintedBlackIron,
    );
    beam.add(beamBar);

    [-1.02, 1.02].forEach((sz) => {
      const shoe = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.16, 0.45, 0.18)),
        materials.brakeShoeFriction,
      );
      shoe.position.set(bIdx === 0 ? 0.1 : -0.1, 0, sz);
      beam.add(shoe);
      brakeShoes.push(shoe);
    });
  });

  // -------------------------------------------------------------
  // 8. Automatic Accident Tripping Cock e & Triggers (Claim 4)
  // -------------------------------------------------------------
  const trippingCockE = new THREE.Group();
  trippingCockE.position.set(-3.6, 0.2, 0.85);
  root.add(trippingCockE);

  const cockEMesh = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.35, 0.35, 0.35)),
    materials.brassCockBronze,
  );
  trippingCockE.add(cockEMesh);

  // Derailment Tripping Stem i¹ & Head i
  const derailmentStemI1 = new THREE.Group();
  derailmentStemI1.position.set(0, -0.2, 0);
  const stemRod = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 12)),
    materials.polishedSteelRod,
  );
  stemRod.position.y = -0.6;
  derailmentStemI1.add(stemRod);

  const headI = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16)),
    materials.castIron,
  );
  headI.position.y = -1.2;
  derailmentStemI1.add(headI);
  trippingCockE.add(derailmentStemI1);

  // Parted Coupling Cord y
  const couplingCordY = new THREE.Group();
  const cordMesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.015, 0.015, 1.4, 8)),
    materials.brassCockBronze,
  );
  cordMesh.rotation.z = Math.PI / 3;
  cordMesh.position.set(-0.6, 0.3, 0);
  couplingCordY.add(cordMesh);
  trippingCockE.add(couplingCordY);

  // -------------------------------------------------------------
  // 9. Pneumatic Signalling Apparatus (Claim 5)
  // -------------------------------------------------------------
  const signalGaugeG2 = new THREE.Group();
  signalGaugeG2.position.set(3.2, 0.8, 0.4);
  root.add(signalGaugeG2);

  const gaugeDial = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.06, 24)),
    materials.gaugeDialMat,
  );
  gaugeDial.rotation.x = Math.PI / 2;
  signalGaugeG2.add(gaugeDial);

  const signalGaugeNeedle = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.02, 0.18, 0.02)),
    materials.polishedSteelRod,
  );
  signalGaugeNeedle.position.set(0, 0.04, 0.04);
  signalGaugeG2.add(signalGaugeNeedle);

  const alarmWhistleH = new THREE.Group();
  alarmWhistleH.position.set(3.6, 0.8, 0.4);
  const whistleBody = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 0.3, 16)),
    materials.brassCockBronze,
  );
  alarmWhistleH.add(whistleBody);
  root.add(alarmWhistleH);

  // -------------------------------------------------------------
  // 10. Friction Sparks Particle System
  // -------------------------------------------------------------
  const sparkGeo = trackGeo(new THREE.BufferGeometry());
  const sparkPositions = new Float32Array(32 * 3);
  for (let i = 0; i < 32; i++) {
    sparkPositions[i * 3] = 0;
    sparkPositions[i * 3 + 1] = -1.9;
    sparkPositions[i * 3 + 2] = 0;
  }
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
  const frictionSparkPoints = new THREE.Points(sparkGeo, materials.sparkParticle);
  root.add(frictionSparkPoints);

  const nodes: WestinghouseAirBrakeModelNodes = {
    root,
    truckGroup,
    wheelSets,
    pipeB,
    pipeB1,
    selectingCockCaseD,
    selectingCockD1,
    auxiliaryReceiverD,
    brakeCylinderC,
    pistonPushRod,
    frontBrakeBeam,
    rearBrakeBeam,
    brakeShoes,
    trippingCockE,
    derailmentStemI1,
    couplingCordY,
    signalGaugeG2,
    signalGaugeNeedle,
    alarmWhistleH,
    frictionSparkPoints,
  };

  const dispose = () => {
    for (const g of disposableGeometries) {
      g.dispose();
    }
    for (const m of disposableMaterials) {
      m.dispose();
    }
  };

  const setCutaway = (cutaway: boolean) => {
    materials.castIron.transparent = cutaway;
    materials.castIron.opacity = cutaway ? 0.35 : 1.0;
    materials.castIron.needsUpdate = true;
    materials.paintedBlackIron.transparent = cutaway;
    materials.paintedBlackIron.opacity = cutaway ? 0.35 : 1.0;
    materials.paintedBlackIron.needsUpdate = true;
  };

  return { root, nodes, materials, setCutaway, dispose };
}

export function updateWestinghouseAirBrakeKinematics(
  model: WestinghouseAirBrakeModelResult,
  params: {
    trainPipePressurePsi?: number;
    reservoirPipePressurePsi?: number;
    selectingCockState?: "normal" | "reversed";
    tripCockState?: "running" | "tripped_derailment" | "tripped_parting";
    signalPulsePressurePsi?: number;
  },
  _dt: number,
) {
  const wh = FrankenSimEngine.stepWestinghouseAirBrake(params);
  const { nodes, materials } = model;

  // 1. Selecting Cock d¹ rotation (0° normal vs 90° reversed)
  nodes.selectingCockD1.rotation.y = THREE.MathUtils.degToRad(wh.cockD1AngleDeg);

  // 2. Tripping Cock e rotation (0° armed vs 90° tripped)
  nodes.trippingCockE.rotation.y = THREE.MathUtils.degToRad(wh.cockEAngleDeg);
  nodes.derailmentStemI1.position.y = wh.isDerailmentTripped ? 0.15 : 0;
  nodes.couplingCordY.position.x = wh.isUncouplingTripped ? -0.2 : 0;

  // 3. Brake Cylinder Piston Stroke
  const pushStroke = wh.clampRatio * wh.maxPushStroke;
  nodes.pistonPushRod.position.x = 0.75 + pushStroke;

  // 4. Brake Beams & Shoes Clamping Travel
  const clampTravel = wh.clampRatio * wh.beamClampTravel;
  nodes.frontBrakeBeam.position.x = -1.4 + clampTravel;
  nodes.rearBrakeBeam.position.x = 1.4 - clampTravel;

  // 5. Signalling Index Dial Needle Rotation (1 to 5)
  const needleAngle = -THREE.MathUtils.degToRad(120 - (wh.signalIndexStep - 1) * 60);
  nodes.signalGaugeNeedle.rotation.z = needleAngle;

  // 6. Whistle Steam Glow
  if (wh.alarmWhistleActive) {
    materials.brassCockBronze.emissive = new THREE.Color(0xd97706);
    materials.brassCockBronze.emissiveIntensity = 0.4;
  } else {
    materials.brassCockBronze.emissive = new THREE.Color(0x000000);
    materials.brassCockBronze.emissiveIntensity = 0;
  }

  // 7. Friction Sparks
  const isClamped = wh.brakeCylinderPressurePsi > 15;
  if (isClamped) {
    materials.sparkParticle.opacity = 0.85;
    const pos = nodes.frictionSparkPoints.geometry.attributes.position;
    if (pos) {
      const arr = pos.array as Float32Array;
      for (let i = 0; i < 32; i++) {
        const wheelIdx = i % 4;
        const wx = westinghouseSparkWheelX(wheelIdx);
        const wz = westinghouseSparkWheelZ(wheelIdx);
        arr[i * 3] = wx + ((i * 13) % 17) * 0.01;
        arr[i * 3 + 1] = -1.9 + ((i * 7) % 11) * 0.01;
        arr[i * 3 + 2] = wz + ((i * 5) % 13) * 0.01;
      }
      pos.needsUpdate = true;
    }
  } else {
    materials.sparkParticle.opacity = 0;
  }
}
