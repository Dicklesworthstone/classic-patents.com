import * as THREE from "three";
import { ROOMBA_ENVIRONMENT_PARTS, ROOMBA_ROOM, type RoombaState } from "@/physics/roombaKernel";
import { createLcg } from "@/utils/lcg";

export interface RoombaModel {
  root: THREE.Group;
  mainGroup: THREE.Group;
  sideBrushGroup: THREE.Group;
  leftWheel: THREE.Group;
  rightWheel: THREE.Group;
  opticalSensorGroup: THREE.Group;
  opticalFieldGroup: THREE.Group;
  dustPoints: THREE.Points;
  updateTrail: (x: number, z: number) => void;
  updateKinematics: (state: RoombaState) => void;
  setOpticalSensorEnabled: (enabled: boolean) => void;
  setCutaway?: (cutaway: boolean) => void;
  dispose: () => void;
}

export const ROOMBA_STUDIO_FLOOR_Y = -4.5;

export function buildRoombaModel(): RoombaModel {
  const lcg = createLcg(6594);
  const root = new THREE.Group();
  root.position.y = ROOMBA_STUDIO_FLOOR_Y;
  root.name = "iRobot Roomba Autonomous Vacuum Model";
  const mainGroup = new THREE.Group();
  root.add(mainGroup);

  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materialsToDispose.push(mat);
    return mat;
  };

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometriesToDispose.push(geo);
    return geo;
  };

  // --- Museum-Grade Materials ---
  const bodyMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.65,
    }),
  );

  const silverTrimMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.2,
      metalness: 0.9,
    }),
  );

  const bumperMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7,
      metalness: 0.2,
    }),
  );

  const cleanBtnMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.2,
      metalness: 0.1,
      emissive: new THREE.Color(0x16a34a),
      emissiveIntensity: 0.6,
    }),
  );

  const ledRingMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      roughness: 0.1,
      metalness: 0.1,
      emissive: new THREE.Color(0x22c55e),
      emissiveIntensity: 0.9,
    }),
  );

  const rubberTireMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.9,
      metalness: 0.1,
    }),
  );

  const brushMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.4,
      metalness: 0.3,
    }),
  );

  const emitterMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: new THREE.Color(0x0284c7),
      emissiveIntensity: 0.85,
      roughness: 0.22,
      metalness: 0.18,
    }),
  );

  const detectorMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xa78bfa,
      emissive: new THREE.Color(0x7c3aed),
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.15,
    }),
  );

  const floorMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.85,
      metalness: 0.05,
    }),
  );

  const wallMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.6,
      metalness: 0.15,
    }),
  );

  const upholsteryMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.82, metalness: 0.02 }),
  );

  const furnitureWoodMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.64, metalness: 0.04 }),
  );

  // 1. Roomba Main Cylindrical Body
  const bodyGeo = trackGeo(new THREE.CylinderGeometry(0.17, 0.17, 0.065, 32));
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.name = "Roomba chassis body";
  bodyMesh.position.y = 0.045;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  mainGroup.add(bodyMesh);

  // Silver Trim Top Ring
  const trimGeo = trackGeo(new THREE.TorusGeometry(0.165, 0.008, 8, 32));
  const trimMesh = new THREE.Mesh(trimGeo, silverTrimMat);
  trimMesh.name = "Chassis-supported silver top trim";
  trimMesh.rotation.x = Math.PI / 2;
  // Children of bodyMesh use chassis-local coordinates. Seat the torus on
  // the body's +Y face instead of adding the body's world offset twice.
  trimMesh.position.y = 0.0325;
  bodyMesh.add(trimMesh);

  // 2. Front Floating Tactile Bumper
  const bumperGeo = trackGeo(
    new THREE.CylinderGeometry(0.175, 0.175, 0.055, 32, 1, false, -Math.PI / 2, Math.PI),
  );
  const bumperMesh = new THREE.Mesh(bumperGeo, bumperMat);
  bumperMesh.position.y = 0.042;
  bumperMesh.castShadow = true;
  mainGroup.add(bumperMesh);

  // 3. Central CLEAN Button & LED Status Ring
  const cleanBtnGeo = trackGeo(new THREE.CylinderGeometry(0.032, 0.032, 0.012, 24));
  const cleanBtn = new THREE.Mesh(cleanBtnGeo, cleanBtnMat);
  cleanBtn.name = "Chassis-supported CLEAN button";
  cleanBtn.position.set(0, 0.0385, 0);
  bodyMesh.add(cleanBtn);

  const ringGeo = trackGeo(new THREE.RingGeometry(0.035, 0.042, 24));
  const ledRing = new THREE.Mesh(ringGeo, ledRingMat);
  ledRing.name = "Chassis-supported CLEAN LED ring";
  ledRing.rotation.x = -Math.PI / 2;
  ledRing.position.set(0, 0.033, 0);
  bodyMesh.add(ledRing);

  // 4. Front Omnidirectional Caster Wheel with Swivel Fork Bracket
  const casterWell = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.026, 0.026, 0.03, 16)),
    bumperMat,
  );
  casterWell.position.set(0.12, 0.035, 0);
  mainGroup.add(casterWell);

  const casterFork = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.025, 0.022, 0.028)),
    silverTrimMat,
  );
  casterFork.position.set(0.12, 0.026, 0);
  mainGroup.add(casterFork);

  const casterGeo = trackGeo(new THREE.SphereGeometry(0.016, 16, 16));
  const caster = new THREE.Mesh(casterGeo, rubberTireMat);
  caster.position.set(0.12, 0.016, 0);
  mainGroup.add(caster);

  // Claim 1 optical sensor assembly. The mounting plate overlaps the chassis
  // underside, and both field rays begin at their attached emitter/detector
  // apertures before intersecting at the expected floor region.
  const opticalSensorGroup = new THREE.Group();
  opticalSensorGroup.name = "Claim 1 chassis-mounted optical sensor subsystem";
  opticalSensorGroup.position.set(0.125, 0, -0.065);
  mainGroup.add(opticalSensorGroup);

  const sensorMount = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.06, 0.014, 0.065)),
    bumperMat,
  );
  sensorMount.name = "Optical sensor mounting plate tethered to chassis";
  sensorMount.position.y = 0.014;
  opticalSensorGroup.add(sensorMount);

  const sensorApertureGeo = trackGeo(new THREE.CylinderGeometry(0.009, 0.009, 0.014, 14));
  const emitter = new THREE.Mesh(sensorApertureGeo, emitterMat);
  emitter.name = "Directed photon emitter";
  emitter.position.set(0, 0.007, -0.018);
  opticalSensorGroup.add(emitter);

  const detector = new THREE.Mesh(sensorApertureGeo, detectorMat);
  detector.name = "Photon detector field aperture";
  detector.position.set(0, 0.007, 0.018);
  opticalSensorGroup.add(detector);

  const opticalFieldGroup = new THREE.Group();
  opticalFieldGroup.name = "Intersecting emitter and detector fields";
  opticalSensorGroup.add(opticalFieldGroup);
  const fieldIntersection = new THREE.Vector3(0.02, 0.0008, 0);
  const makeFieldRay = (
    name: string,
    origin: THREE.Vector3,
    color: number,
  ): THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial> => {
    const geometry = trackGeo(
      new THREE.BufferGeometry().setFromPoints([origin, fieldIntersection]),
    );
    const material = trackMat(
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.8 }),
    );
    const ray = new THREE.Line(geometry, material);
    ray.name = name;
    opticalFieldGroup.add(ray);
    return ray;
  };
  makeFieldRay("Directed emission field", emitter.position.clone(), 0x38bdf8);
  makeFieldRay("Intersecting detector field", detector.position.clone(), 0xa78bfa);

  const intersectionMarker = new THREE.Mesh(
    trackGeo(new THREE.RingGeometry(0.012, 0.018, 18)),
    trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xf8fafc,
        transparent: true,
        opacity: 0.72,
        side: THREE.DoubleSide,
      }),
    ),
  );
  intersectionMarker.name = "Finite optical field intersection region";
  intersectionMarker.rotation.x = -Math.PI / 2;
  intersectionMarker.position.copy(fieldIntersection);
  opticalFieldGroup.add(intersectionMarker);

  // 5. Left & Right Spring-Loaded Drive Wheel Modules with Suspension Wells
  for (const wz of [-0.12, 0.12]) {
    const wheelWell = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.08, 0.05, 0.035)), bumperMat);
    wheelWell.position.set(0, 0.045, wz);
    mainGroup.add(wheelWell);
  }

  const wheelGeo = trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 20));
  const leftWheel = new THREE.Group();
  leftWheel.name = "Left drive wheel revolute joint";
  leftWheel.position.set(0, 0.035, 0.12);
  const leftWheelMesh = new THREE.Mesh(wheelGeo, rubberTireMat);
  leftWheelMesh.rotation.x = Math.PI / 2;
  leftWheelMesh.castShadow = true;
  leftWheel.add(leftWheelMesh);
  mainGroup.add(leftWheel);

  const rightWheel = new THREE.Group();
  rightWheel.name = "Right drive wheel revolute joint";
  rightWheel.position.set(0, 0.035, -0.12);
  const rightWheelMesh = new THREE.Mesh(wheelGeo, rubberTireMat);
  rightWheelMesh.rotation.x = Math.PI / 2;
  rightWheelMesh.castShadow = true;
  rightWheel.add(rightWheelMesh);
  mainGroup.add(rightWheel);

  // Main Dual Counter-Rotating Roller Brushes Underbody Cavity (US 6,883,201 Fig 1)
  const rollerCavity = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.07, 0.02, 0.18)), bumperMat);
  rollerCavity.position.set(-0.02, 0.02, 0);
  mainGroup.add(rollerCavity);

  const mainRoller = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.014, 0.014, 0.16, 16)),
    brushMat,
  );
  mainRoller.rotation.x = Math.PI / 2;
  mainRoller.position.set(-0.02, 0.015, 0);
  mainGroup.add(mainRoller);

  // 6. Spinning 3-Arm Edge-Sweeping Side Brush
  const sideBrushGroup = new THREE.Group();
  // Bristle bottoms touch the floor at y=0; an overlapping vertical shaft
  // connects the low brush hub back into the chassis instead of leaving the
  // complete brush assembly suspended below it.
  sideBrushGroup.position.set(0.11, 0.002, 0.12);
  mainGroup.add(sideBrushGroup);

  const hubGeo = trackGeo(new THREE.CylinderGeometry(0.012, 0.012, 0.008, 12));
  const brushHub = new THREE.Mesh(hubGeo, silverTrimMat);
  brushHub.position.y = 0.004;
  sideBrushGroup.add(brushHub);

  const brushShaft = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.005, 0.005, 0.018, 12)),
    silverTrimMat,
  );
  brushShaft.name = "Side-brush hub-to-chassis drive shaft";
  brushShaft.position.y = 0.01;
  sideBrushGroup.add(brushShaft);

  const bristleArmGeo = trackGeo(new THREE.BoxGeometry(0.065, 0.004, 0.006));
  for (let i = 0; i < 3; i++) {
    const arm = new THREE.Mesh(bristleArmGeo, brushMat);
    arm.rotation.y = (i * 2 * Math.PI) / 3;
    arm.position.set(Math.cos(arm.rotation.y) * 0.03, 0, Math.sin(arm.rotation.y) * 0.03);
    sideBrushGroup.add(arm);
  }

  // 7. Floor Room Grid & Walls
  const floorGeo = trackGeo(new THREE.PlaneGeometry(ROOMBA_ROOM.width, ROOMBA_ROOM.height));
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.name = "Shared Roomba room floor seated on studio floor";
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  root.add(floorMesh);

  // Perimeter Walls
  const wallH = 0.25;
  const wallGeos: THREE.BoxGeometry[] = [
    trackGeo(new THREE.BoxGeometry(ROOMBA_ROOM.width, wallH, 0.04)),
    trackGeo(new THREE.BoxGeometry(ROOMBA_ROOM.width, wallH, 0.04)),
    trackGeo(new THREE.BoxGeometry(0.04, wallH, ROOMBA_ROOM.height)),
    trackGeo(new THREE.BoxGeometry(0.04, wallH, ROOMBA_ROOM.height)),
  ];
  const wallPos: [number, number, number][] = [
    [0, wallH / 2, -ROOMBA_ROOM.height / 2],
    [0, wallH / 2, ROOMBA_ROOM.height / 2],
    [-ROOMBA_ROOM.width / 2, wallH / 2, 0],
    [ROOMBA_ROOM.width / 2, wallH / 2, 0],
  ];
  wallGeos.forEach((geo, idx) => {
    const wallMesh = new THREE.Mesh(geo, wallMat);
    wallMesh.position.set(...wallPos[idx]);
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    root.add(wallMesh);
  });

  // Furniture assemblies. Every visible solid drains the same dimensions as
  // the kernel receipt; low legs collide, while elevated tops/seats do not
  // masquerade as floor-to-ceiling blocks.
  for (const part of ROOMBA_ENVIRONMENT_PARTS) {
    const furnGeo = trackGeo(new THREE.BoxGeometry(part.w, part.height, part.h));
    const furnMesh = new THREE.Mesh(
      furnGeo,
      part.assemblyId === "armchair" && part.kind !== "leg" ? upholsteryMat : furnitureWoodMat,
    );
    furnMesh.name = `${part.assemblyId}: ${part.id}`;
    furnMesh.position.set(part.x, part.centerHeight, part.y);
    furnMesh.castShadow = true;
    furnMesh.receiveShadow = true;
    root.add(furnMesh);
  }

  // 8. Dynamic Dust Particle Field on Floor
  const dustCount = 180;
  const dustPositions = new Float32Array(dustCount * 3);
  const dustGeo = trackGeo(new THREE.BufferGeometry());
  for (let i = 0; i < dustCount; i++) {
    dustPositions[i * 3] = (lcg() - 0.5) * (ROOMBA_ROOM.width - 0.4);
    dustPositions[i * 3 + 1] = 0.008;
    dustPositions[i * 3 + 2] = (lcg() - 0.5) * (ROOMBA_ROOM.height - 0.4);
  }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  const dustMat = trackMat(
    new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.025,
      transparent: true,
      opacity: 0.75,
    }),
  );
  const dustPoints = new THREE.Points(dustGeo, dustMat);
  root.add(dustPoints);

  // 9. Cleaning Path Trail
  const maxPoints = 4000;
  const pathPositions = new Float32Array(maxPoints * 3);
  const pathGeo = trackGeo(new THREE.BufferGeometry());
  pathGeo.setAttribute("position", new THREE.BufferAttribute(pathPositions, 3));
  const pathMat = trackMat(
    new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      opacity: 0.75,
      transparent: true,
    }),
  );
  const pathLine = new THREE.Line(pathGeo, pathMat);
  root.add(pathLine);

  let pointCount = 0;
  const updateTrail = (x: number, z: number) => {
    if (pointCount >= maxPoints) return;
    pathPositions[pointCount * 3] = x;
    pathPositions[pointCount * 3 + 1] = 0.005;
    pathPositions[pointCount * 3 + 2] = z;
    pathGeo.attributes.position.needsUpdate = true;
    pathGeo.setDrawRange(0, pointCount + 1);
    pointCount++;
  };

  const updateKinematics = (state: RoombaState) => {
    // Absolute joint coordinates come from the fixed-step kernel. Rendering
    // cadence cannot change wheel/brush pose or reverse-motion direction.
    sideBrushGroup.rotation.y = state.sideBrushAngleRad;
    leftWheel.rotation.z = state.leftWheelAngleRad;
    rightWheel.rotation.z = state.rightWheelAngleRad;
    opticalSensorGroup.visible = state.opticalSensorEnabled;
    opticalFieldGroup.visible = state.opticalSensorEnabled;
    emitterMat.emissiveIntensity = state.opticalSensorEnabled ? 0.85 : 0;
    detectorMat.emissiveIntensity = state.opticalSensorEnabled ? 0.45 : 0;

    // Dynamic Dust Cleaning: hide dust particles when Roomba sweeps over them
    const cleanupRadiusSq = 0.18 * 0.18;
    for (let i = 0; i < dustCount; i++) {
      const dx = dustPositions[i * 3] - state.displayX;
      const dz = dustPositions[i * 3 + 2] - state.displayY;
      if (dx * dx + dz * dz < cleanupRadiusSq) {
        dustPositions[i * 3 + 1] = -10; // Hide below floor
      }
    }
    dustGeo.attributes.position.needsUpdate = true;
  };

  const setOpticalSensorEnabled = (enabled: boolean) => {
    opticalSensorGroup.visible = enabled;
    opticalFieldGroup.visible = enabled;
    emitterMat.emissiveIntensity = enabled ? 0.85 : 0;
    detectorMat.emissiveIntensity = enabled ? 0.45 : 0;
  };

  const setCutaway = (cutaway: boolean) => {
    bodyMat.transparent = cutaway;
    bodyMat.opacity = cutaway ? 0.35 : 1.0;
    bodyMat.needsUpdate = true;
    bumperMat.transparent = cutaway;
    bumperMat.opacity = cutaway ? 0.45 : 1.0;
    bumperMat.needsUpdate = true;
  };

  return {
    root,
    mainGroup,
    sideBrushGroup,
    leftWheel,
    rightWheel,
    opticalSensorGroup,
    opticalFieldGroup,
    dustPoints,
    updateTrail,
    updateKinematics,
    setOpticalSensorEnabled,
    setCutaway,
    dispose: () => {
      for (const g of geometriesToDispose) g.dispose();
      for (const m of materialsToDispose) m.dispose();
    },
  };
}
