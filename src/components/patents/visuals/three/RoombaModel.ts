import * as THREE from "three";
import { ROOMBA_FURNITURE, ROOMBA_ROOM } from "@/physics/roombaKernel";
import { createLcg } from "@/utils/lcg";

export interface RoombaModel {
  root: THREE.Group;
  mainGroup: THREE.Group;
  sideBrushGroup: THREE.Group;
  leftWheel: THREE.Mesh;
  rightWheel: THREE.Mesh;
  dustPoints: THREE.Points;
  updateTrail: (x: number, z: number) => void;
  updateKinematics: (delta: number, speedMPerS: number, x: number, z: number) => void;
  dispose: () => void;
}

export function buildRoombaModel(): RoombaModel {
  const lcg = createLcg(6594);
  const root = new THREE.Group();
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

  // 1. Roomba Main Cylindrical Body
  const bodyGeo = trackGeo(new THREE.CylinderGeometry(0.17, 0.17, 0.065, 32));
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.position.y = 0.045;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  mainGroup.add(bodyMesh);

  // Silver Trim Top Ring
  const trimGeo = trackGeo(new THREE.TorusGeometry(0.165, 0.008, 8, 32));
  const trimMesh = new THREE.Mesh(trimGeo, silverTrimMat);
  trimMesh.rotation.x = Math.PI / 2;
  trimMesh.position.y = 0.078;
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
  cleanBtn.position.set(0, 0.08, 0);
  bodyMesh.add(cleanBtn);

  const ringGeo = trackGeo(new THREE.RingGeometry(0.035, 0.042, 24));
  const ledRing = new THREE.Mesh(ringGeo, ledRingMat);
  ledRing.rotation.x = -Math.PI / 2;
  ledRing.position.set(0, 0.081, 0);
  bodyMesh.add(ledRing);

  // 4. Front Omnidirectional Caster Wheel
  const casterGeo = trackGeo(new THREE.SphereGeometry(0.018, 16, 16));
  const caster = new THREE.Mesh(casterGeo, rubberTireMat);
  caster.position.set(0.12, 0.018, 0);
  mainGroup.add(caster);

  // 5. Left & Right Spring-Loaded Drive Wheels
  const wheelGeo = trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 20));
  const leftWheel = new THREE.Mesh(wheelGeo, rubberTireMat);
  leftWheel.rotation.z = Math.PI / 2;
  leftWheel.position.set(0, 0.035, 0.12);
  leftWheel.castShadow = true;
  mainGroup.add(leftWheel);

  const rightWheel = new THREE.Mesh(wheelGeo, rubberTireMat);
  rightWheel.rotation.z = Math.PI / 2;
  rightWheel.position.set(0, 0.035, -0.12);
  rightWheel.castShadow = true;
  mainGroup.add(rightWheel);

  // 6. Spinning 3-Arm Edge-Sweeping Side Brush
  const sideBrushGroup = new THREE.Group();
  sideBrushGroup.position.set(0.11, 0.015, 0.12);
  mainGroup.add(sideBrushGroup);

  const hubGeo = trackGeo(new THREE.CylinderGeometry(0.012, 0.012, 0.008, 12));
  const brushHub = new THREE.Mesh(hubGeo, silverTrimMat);
  sideBrushGroup.add(brushHub);

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

  // Obstacle Furniture
  for (const obs of ROOMBA_FURNITURE) {
    const furnGeo = trackGeo(new THREE.BoxGeometry(obs.w, 0.35, obs.h));
    const furnMesh = new THREE.Mesh(furnGeo, wallMat);
    furnMesh.position.set(obs.x, 0.175, obs.y);
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

  const updateKinematics = (
    delta: number,
    speedMPerS: number,
    currentX: number,
    currentZ: number,
  ) => {
    // Spin side brush
    sideBrushGroup.rotation.y += delta * 18.0;

    // Rotate drive wheels
    const wheelRotDelta = (speedMPerS / 0.035) * delta;
    leftWheel.rotation.x += wheelRotDelta;
    rightWheel.rotation.x += wheelRotDelta;

    // Dynamic Dust Cleaning: hide dust particles when Roomba sweeps over them
    const cleanupRadiusSq = 0.18 * 0.18;
    for (let i = 0; i < dustCount; i++) {
      const dx = dustPositions[i * 3] - currentX;
      const dz = dustPositions[i * 3 + 2] - currentZ;
      if (dx * dx + dz * dz < cleanupRadiusSq) {
        dustPositions[i * 3 + 1] = -10; // Hide below floor
      }
    }
    dustGeo.attributes.position.needsUpdate = true;
  };

  return {
    root,
    mainGroup,
    sideBrushGroup,
    leftWheel,
    rightWheel,
    dustPoints,
    updateTrail,
    updateKinematics,
    dispose: () => {
      for (const g of geometriesToDispose) g.dispose();
      for (const m of materialsToDispose) m.dispose();
    },
  };
}
