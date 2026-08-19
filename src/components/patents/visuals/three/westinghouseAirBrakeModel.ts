import * as THREE from "three";
import { westinghouseSparkWheelX, westinghouseSparkWheelZ } from "@/physics/catalogKernels";
import { FrankenSimEngine } from "@/physics/engine";

export interface WestinghouseAirBrakeModelNodes {
  root: THREE.Group;
  // Bogie truck & wheels
  truckGroup: THREE.Group;
  wheelSets: THREE.Group[];
  // Pneumatic system
  trainPipe: THREE.Group;
  auxiliaryReservoir: THREE.Group;
  tripleValve: THREE.Group;
  tripleValvePiston: THREE.Mesh;
  // Brake cylinder & foundation rigging
  brakeCylinderGroup: THREE.Group;
  pistonPushRod: THREE.Group;
  liveBrakeLever: THREE.Group;
  deadBrakeLever: THREE.Group;
  connectingPullRod: THREE.Mesh;
  frontBrakeBeam: THREE.Group;
  rearBrakeBeam: THREE.Group;
  brakeShoes: THREE.Mesh[];
  // Spark & air effects
  frictionSparkPoints: THREE.Points;
}

export interface WestinghouseAirBrakeMaterials {
  castIron: THREE.MeshStandardMaterial;
  chilledWheelSteel: THREE.MeshStandardMaterial;
  paintedBlackIron: THREE.MeshStandardMaterial;
  reservoirSteel: THREE.MeshStandardMaterial;
  tripleValveBronze: THREE.MeshStandardMaterial;
  polishedSteelRod: THREE.MeshStandardMaterial;
  woodTie: THREE.MeshStandardMaterial;
  brakeShoeFriction: THREE.MeshStandardMaterial;
  sparkParticle: THREE.PointsMaterial;
}

export interface WestinghouseAirBrakeModelResult {
  root: THREE.Group;
  nodes: WestinghouseAirBrakeModelNodes;
  materials: WestinghouseAirBrakeMaterials;
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

  // Authentic 1870s Railroad Materials
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
        color: 0x334155,
        roughness: 0.4,
        metalness: 0.8,
      }),
    ),
    tripleValveBronze: trackMat(
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

    // Steel Tie-Plates & Spikes
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
    // Rail Base Flange
    const railBase = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(11.0, 0.06, 0.32)),
      materials.chilledWheelSteel,
    );
    railBase.position.set(0, -2.26, rz);
    trackGroup.add(railBase);

    // Rail Web
    const railWeb = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(11.0, 0.24, 0.08)),
      materials.chilledWheelSteel,
    );
    railWeb.position.set(0, -2.11, rz);
    trackGroup.add(railWeb);

    // Rail Head (Polished contact crown)
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

  // Arch-Bar Side Frames (Left & Right)
  [-1.35, 1.35].forEach((fz) => {
    const sideFrame = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(5.8, 0.16, 0.15)),
      materials.paintedBlackIron,
    );
    sideFrame.position.set(0, -0.85, fz);
    sideFrame.castShadow = true;
    truckGroup.add(sideFrame);

    // Journal Boxes & Brass Lids at Axle Ends
    [-2.2, 2.2].forEach((jx) => {
      const jBox = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.48, 0.48, 0.35)),
        materials.castIron,
      );
      jBox.position.set(jx, -1.05, fz);
      truckGroup.add(jBox);

      // Helical Coil Springs above journal
      const spring = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 0.35, 12)),
        materials.chilledWheelSteel,
      );
      spring.position.set(jx, -0.7, fz);
      truckGroup.add(spring);
    });
  });

  // Two Wheelsets (Axles + 33-inch Chilled Cast-Iron Flanged Wheels)
  const wheelSets: THREE.Group[] = [];
  [-2.2, 2.2].forEach((wx) => {
    const ws = new THREE.Group();
    ws.position.set(wx, -1.05, 0);

    // Turned Steel Axle
    const axle = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.14, 0.14, 2.8, 16)),
      materials.polishedSteelRod,
    );
    axle.rotation.x = Math.PI / 2;
    axle.castShadow = true;
    ws.add(axle);

    // Twin Chilled Flanged Wheels (33" dia ~ 0.84m)
    [-1.02, 1.02].forEach((wz) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(0, 0, wz);

      // Wheel Tread Rim with 1:20 Conical Taper
      const tread = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.88, 0.88, 0.24, 36)),
        materials.chilledWheelSteel,
      );
      tread.rotation.x = Math.PI / 2;
      tread.castShadow = true;
      wheelGroup.add(tread);

      // Outer Safety Flange
      const flange = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.96, 0.96, 0.06, 36)),
        materials.chilledWheelSteel,
      );
      flange.rotation.x = Math.PI / 2;
      flange.position.z = wz > 0 ? -0.1 : 0.1;
      wheelGroup.add(flange);

      // Dished Hub Plate
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
  // 3. Continuous Train Pipe (Brake Pipe) & Gladhand Couplings
  // -------------------------------------------------------------
  const trainPipe = new THREE.Group();
  trainPipe.position.set(0, 0.9, 0.85);
  root.add(trainPipe);

  // Main 1.25" Steel Air Pipe running length of car
  const pipeMesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 9.4, 16)),
    materials.castIron,
  );
  pipeMesh.rotation.z = Math.PI / 2;
  trainPipe.add(pipeMesh);

  // Flexible End Hoses & Cast Gladhand Couplings
  [-4.7, 4.7].forEach((hx) => {
    const hose = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 12)),
      materials.paintedBlackIron,
    );
    hose.position.set(hx, -0.3, 0);
    hose.rotation.z = hx > 0 ? -0.4 : 0.4;
    trainPipe.add(hose);

    const gladhand = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.12, 0.15, 0.1)),
      materials.castIron,
    );
    gladhand.position.set(hx > 0 ? hx + 0.15 : hx - 0.15, -0.6, 0);
    trainPipe.add(gladhand);
  });

  // -------------------------------------------------------------
  // 4. Auxiliary Air Reservoir (Pressure Vessel)
  // -------------------------------------------------------------
  const auxiliaryReservoir = new THREE.Group();
  auxiliaryReservoir.position.set(-1.6, 0.85, -0.2);
  root.add(auxiliaryReservoir);

  // Cylindrical Riveted Tank
  const tankBody = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.65, 0.65, 2.6, 24)),
    materials.reservoirSteel,
  );
  tankBody.rotation.z = Math.PI / 2;
  tankBody.castShadow = true;
  auxiliaryReservoir.add(tankBody);

  // Dished Hemispherical End Caps
  [-1.3, 1.3].forEach((cx) => {
    const cap = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.65, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2)),
      materials.reservoirSteel,
    );
    cap.rotation.z = cx > 0 ? -Math.PI / 2 : Math.PI / 2;
    cap.position.set(cx, 0, 0);
    auxiliaryReservoir.add(cap);
  });

  // Mounting Iron Straps
  [-0.8, 0.8].forEach((sx) => {
    const strap = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.67, 0.04, 8, 24)),
      materials.paintedBlackIron,
    );
    strap.rotation.y = Math.PI / 2;
    strap.position.set(sx, 0, 0);
    auxiliaryReservoir.add(strap);
  });

  // -------------------------------------------------------------
  // 5. The Westinghouse Automatic Triple-Valve Body (US 124,404)
  // -------------------------------------------------------------
  const tripleValve = new THREE.Group();
  tripleValve.position.set(-0.2, 0.85, 0.35);
  root.add(tripleValve);

  // Cast Bronze Valve Body with Port Bosses
  const valveMain = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.24, 0.28, 0.8, 16)),
    materials.tripleValveBronze,
  );
  valveMain.castShadow = true;
  tripleValve.add(valveMain);

  const valveSlideChest = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.35, 0.45, 0.3)),
    materials.tripleValveBronze,
  );
  valveSlideChest.position.set(0.15, 0.05, 0);
  tripleValve.add(valveSlideChest);

  // Internal Triple Valve Piston Indicator
  const tripleValvePiston = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16)),
    materials.polishedSteelRod,
  );
  tripleValvePiston.position.set(0, 0.1, 0);
  tripleValve.add(tripleValvePiston);

  // Interconnecting Copper Air Pipes
  const pipeToReservoir = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 12)),
    materials.tripleValveBronze,
  );
  pipeToReservoir.rotation.z = Math.PI / 2;
  pipeToReservoir.position.set(-0.6, 0.15, -0.2);
  tripleValve.add(pipeToReservoir);

  // -------------------------------------------------------------
  // 6. Brake Cylinder, Push Rod & Foundation Brake Rigging
  // -------------------------------------------------------------
  const brakeCylinderGroup = new THREE.Group();
  brakeCylinderGroup.position.set(1.4, 0.85, -0.2);
  root.add(brakeCylinderGroup);

  // Cast-Iron Brake Cylinder Barrel (10" Bore)
  const brakeCyl = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.55, 0.55, 1.8, 24)),
    materials.castIron,
  );
  brakeCyl.rotation.z = Math.PI / 2;
  brakeCyl.castShadow = true;
  brakeCylinderGroup.add(brakeCyl);

  // Cylinder Flanged Mounting Lugs & Pressure Head
  const cylHead = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.62, 0.62, 0.15, 24)),
    materials.castIron,
  );
  cylHead.rotation.z = Math.PI / 2;
  cylHead.position.set(-0.9, 0, 0);
  brakeCylinderGroup.add(cylHead);

  // Piston Push Rod that moves out during application
  const pistonPushRod = new THREE.Group();
  pistonPushRod.position.set(0.9, 0, 0);
  brakeCylinderGroup.add(pistonPushRod);

  const rodShaft = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 1.4, 16)),
    materials.polishedSteelRod,
  );
  rodShaft.rotation.z = Math.PI / 2;
  rodShaft.position.set(0.7, 0, 0);
  pistonPushRod.add(rodShaft);

  // Foundation Brake Levers (Live & Dead Cylinder Levers)
  const liveBrakeLever = new THREE.Group();
  liveBrakeLever.position.set(2.4, 0.85, -0.2);
  root.add(liveBrakeLever);

  const liveLeverArm = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.1, 1.6, 0.12)),
    materials.castIron,
  );
  liveLeverArm.position.set(0, -0.3, 0);
  liveLeverArm.castShadow = true;
  liveBrakeLever.add(liveLeverArm);

  const deadBrakeLever = new THREE.Group();
  deadBrakeLever.position.set(0.4, 0.85, -0.2);
  root.add(deadBrakeLever);

  const deadLeverArm = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.1, 1.6, 0.12)),
    materials.castIron,
  );
  deadLeverArm.position.set(0, -0.3, 0);
  deadLeverArm.castShadow = true;
  deadBrakeLever.add(deadLeverArm);

  // Connecting Pull Rod between Levers
  const connectingPullRod = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.0, 0.06, 0.06)),
    materials.polishedSteelRod,
  );
  connectingPullRod.position.set(1.4, 0.45, -0.2);
  root.add(connectingPullRod);

  // -------------------------------------------------------------
  // 7. Trussed Brake Beams & 4 Curved Friction Brake Shoes
  // -------------------------------------------------------------
  const frontBrakeBeam = new THREE.Group();
  frontBrakeBeam.position.set(-1.4, -1.05, 0);
  root.add(frontBrakeBeam);

  const rearBrakeBeam = new THREE.Group();
  rearBrakeBeam.position.set(1.4, -1.05, 0);
  root.add(rearBrakeBeam);

  // Steel Truss Beams
  [frontBrakeBeam, rearBrakeBeam].forEach((beam) => {
    const mainBar = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.14, 0.14, 2.6)),
      materials.castIron,
    );
    mainBar.castShadow = true;
    beam.add(mainBar);
  });

  // 4 Cast-Iron Brake Shoes (pressing on the 4 wheel treads)
  const brakeShoes: THREE.Mesh[] = [];
  const buildShoe = (beam: THREE.Group, zPos: number, isFront: boolean) => {
    const shoe = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.15, 0.42, 0.22)),
      materials.brakeShoeFriction,
    );
    shoe.position.set(isFront ? -0.12 : 0.12, 0, zPos);
    shoe.castShadow = true;
    beam.add(shoe);
    brakeShoes.push(shoe);
  };

  buildShoe(frontBrakeBeam, -1.02, true);
  buildShoe(frontBrakeBeam, 1.02, true);
  buildShoe(rearBrakeBeam, -1.02, false);
  buildShoe(rearBrakeBeam, 1.02, false);

  // -------------------------------------------------------------
  // 8. Friction Spark Particle Points
  // -------------------------------------------------------------
  const sparkGeo = trackGeo(new THREE.BufferGeometry());
  const sparkPositions = new Float32Array(30 * 3);
  for (let i = 0; i < 30; i++) {
    sparkPositions[i * 3 + 0] = -1.4;
    sparkPositions[i * 3 + 1] = -1.05;
    sparkPositions[i * 3 + 2] = -1.02;
  }
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
  const frictionSparkPoints = new THREE.Points(sparkGeo, materials.sparkParticle);
  root.add(frictionSparkPoints);

  const nodes: WestinghouseAirBrakeModelNodes = {
    root,
    truckGroup,
    wheelSets,
    trainPipe,
    auxiliaryReservoir,
    tripleValve,
    tripleValvePiston,
    brakeCylinderGroup,
    pistonPushRod,
    liveBrakeLever,
    deadBrakeLever,
    connectingPullRod,
    frontBrakeBeam,
    rearBrakeBeam,
    brakeShoes,
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

  return { root, nodes, materials, dispose };
}

/**
 * Updates wheel rotation, triple valve shift, cylinder piston stroke, and brake shoe clamping.
 */
export function updateWestinghouseAirBrakeKinematics(
  nodes: WestinghouseAirBrakeModelNodes,
  materials: WestinghouseAirBrakeMaterials,
  wheelAngle: number,
  clampingRatio: number, // 0 (released) to 1 (full emergency clamp)
  wheelSpeedRadPerS: number,
) {
  const wh = FrankenSimEngine.stepWestinghouseAirBrake({});

  // 1. Wheelsets Rotation
  nodes.wheelSets.forEach((ws) => {
    ws.rotation.z = wheelAngle;
  });

  // 2. Triple Valve Piston Shift
  // When clamped, triple valve drops down to connect auxiliary reservoir to cylinder
  nodes.tripleValvePiston.position.y = wh.tripleValveHomeY - clampingRatio * wh.tripleValveStroke;

  // 3. Brake Cylinder Piston Stroke
  const currentPush = clampingRatio * wh.maxPushStroke;
  nodes.pistonPushRod.position.x = wh.pistonHomeX + currentPush;

  // 4. Foundation Brake Levers & Rigging
  const leverAngle = clampingRatio * wh.leverAngleAmp;
  nodes.liveBrakeLever.rotation.z = -leverAngle;
  nodes.deadBrakeLever.rotation.z = leverAngle;

  // 5. Brake Beams & Shoes Clamping Movement
  // Front beam moves +X toward front wheel, rear beam moves -X toward rear wheel
  const beamClampTravel = clampingRatio * wh.beamClampTravel;
  nodes.frontBrakeBeam.position.x = wh.frontBeamHomeX + beamClampTravel;
  nodes.rearBrakeBeam.position.x = wh.rearBeamHomeX - beamClampTravel;

  // 6. Friction Spark Effect
  const isSparking =
    clampingRatio > wh.sparkClampThreshold && wheelSpeedRadPerS > wh.sparkWheelSpeedThreshold;
  materials.sparkParticle.opacity = isSparking
    ? Math.min(1.0, clampingRatio * wh.sparkOpacityScale)
    : 0;

  if (isSparking) {
    const pos = nodes.frictionSparkPoints.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < 30; i++) {
      const wheelIndex = i % wh.sparkWheelCount;
      const wx = westinghouseSparkWheelX(wheelIndex, wh.sparkWheelXNear, wh.sparkWheelXFar);
      const wz = westinghouseSparkWheelZ(wheelIndex, wh.sparkWheelZNear, wh.sparkWheelZFar);
      const hash1 = Math.sin(i * 78.233 + wheelAngle * 3.0);
      const hash2 = Math.cos(i * 45.197 + wheelAngle * 2.5);
      const hash3 = Math.sin(i * 12.989 + wheelAngle * 4.0);
      pos[i * 3 + 0] = wx + hash1 * wh.sparkJitterXY;
      pos[i * 3 + 1] = wh.sparkY + hash2 * wh.sparkJitterXY;
      pos[i * 3 + 2] = wz + hash3 * wh.sparkJitterZ;
    }
    nodes.frictionSparkPoints.geometry.attributes.position.needsUpdate = true;
  }
}
