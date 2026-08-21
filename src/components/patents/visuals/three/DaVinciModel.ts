import * as THREE from "three";

export interface DaVinciModel {
  root: THREE.Group;
  mainGroup: THREE.Group;
  masterHandle: THREE.Mesh;
  baseGroup: THREE.Group;
  wristPitchGroup: THREE.Group;
  wristYawGroup: THREE.Group;
  wristRollGroup: THREE.Group;
  leftJawGroup: THREE.Group;
  rightJawGroup: THREE.Group;
  cableLines: THREE.Line[];
  updateKinematics: (
    pitchRad: number,
    yawRad: number,
    rollRad: number,
    gripRad: number,
    masterPos: [number, number, number],
  ) => void;
  setCutaway?: (cutaway: boolean) => void;
  dispose: () => void;
}

export function buildDaVinciModel(): DaVinciModel {
  const root = new THREE.Group();
  root.name = "Intuitive Surgical Da Vinci EndoWrist Robotic System";
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
  const surgicalSteelMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.92,
      roughness: 0.18,
    }),
  );

  const darkTitaniumMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.75,
      roughness: 0.35,
    }),
  );

  const shaftSteelMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.12,
    }),
  );

  const jawMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.88,
      roughness: 0.22,
    }),
  );

  const masterGhostMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.5,
      wireframe: true,
      emissive: new THREE.Color(0x059669),
      emissiveIntensity: 0.3,
    }),
  );

  const trocarMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xef4444,
      metalness: 0.35,
      roughness: 0.55,
      emissive: new THREE.Color(0xdc2626),
      emissiveIntensity: 0.2,
    }),
  );

  const cableMat = trackMat(
    new THREE.LineBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.75,
    }),
  );

  // 1. Patient Abdominal Trocar Incision Guide Ring
  const trocarGeo = trackGeo(new THREE.TorusGeometry(0.38, 0.045, 16, 32));
  const trocar = new THREE.Mesh(trocarGeo, trocarMat);
  trocar.rotation.x = Math.PI / 2;
  trocar.position.set(0, 0, 0);
  root.add(trocar);

  // 2. Master Surgeon Console Gimbal Handle (Ghost Tracking Gizmo)
  const masterGeo = trackGeo(new THREE.OctahedronGeometry(0.14, 1));
  const masterHandle = new THREE.Mesh(masterGeo, masterGhostMat);
  masterHandle.position.set(0, 1.2, 1.5);
  root.add(masterHandle);

  // 3. Robotic Arm Base Carriage & Instrument Shaft
  const baseGroup = new THREE.Group();
  mainGroup.add(baseGroup);

  const carriageGeo = trackGeo(new THREE.BoxGeometry(0.24, 0.45, 0.28));
  const carriage = new THREE.Mesh(carriageGeo, darkTitaniumMat);
  carriage.position.set(0, 1.85, 0);
  carriage.castShadow = true;
  baseGroup.add(carriage);

  const shaftGeo = trackGeo(new THREE.CylinderGeometry(0.038, 0.038, 2.3, 24));
  const shaft = new THREE.Mesh(shaftGeo, shaftSteelMat);
  shaft.position.set(0, 0.72, 0);
  shaft.castShadow = true;
  baseGroup.add(shaft);

  // 4. EndoWrist 7-Degree-of-Freedom Articulation Stack
  // Wrist Pitch Joint
  const wristPitchGroup = new THREE.Group();
  wristPitchGroup.position.set(0, -0.42, 0);
  baseGroup.add(wristPitchGroup);

  const clevisGeo = trackGeo(new THREE.CylinderGeometry(0.046, 0.046, 0.085, 16));
  const clevis = new THREE.Mesh(clevisGeo, surgicalSteelMat);
  clevis.rotation.z = Math.PI / 2;
  clevis.castShadow = true;
  wristPitchGroup.add(clevis);

  // Wrist Yaw Joint
  const wristYawGroup = new THREE.Group();
  wristYawGroup.position.set(0, -0.065, 0);
  wristPitchGroup.add(wristYawGroup);

  const yawPulleyGeo = trackGeo(new THREE.SphereGeometry(0.044, 16, 16));
  const yawPulley = new THREE.Mesh(yawPulleyGeo, surgicalSteelMat);
  wristYawGroup.add(yawPulley);

  // Wrist Roll Joint
  const wristRollGroup = new THREE.Group();
  wristRollGroup.position.set(0, -0.055, 0);
  wristYawGroup.add(wristRollGroup);

  const rollCollarGeo = trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 0.05, 16));
  const rollCollar = new THREE.Mesh(rollCollarGeo, surgicalSteelMat);
  wristRollGroup.add(rollCollar);

  // 5. Opposing Micro-Forceps Surgical Grasping Jaws
  const leftJawGroup = new THREE.Group();
  wristRollGroup.add(leftJawGroup);

  const jawGeo = trackGeo(new THREE.ConeGeometry(0.026, 0.22, 4));
  jawGeo.rotateX(Math.PI);

  const leftJaw = new THREE.Mesh(jawGeo, jawMat);
  leftJaw.position.set(0.016, -0.11, 0);
  leftJaw.castShadow = true;
  leftJawGroup.add(leftJaw);

  const rightJawGroup = new THREE.Group();
  wristRollGroup.add(rightJawGroup);

  const rightJaw = new THREE.Mesh(jawGeo, jawMat);
  rightJaw.position.set(-0.016, -0.11, 0);
  rightJaw.castShadow = true;
  rightJawGroup.add(rightJaw);

  // 6. Miniature Stainless Steel Drive Cables
  const cableLines: THREE.Line[] = [];
  const cableGeo1 = trackGeo(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0.025, 0.2, 0),
      new THREE.Vector3(0.018, -0.04, 0),
    ]),
  );
  const cable1 = new THREE.Line(cableGeo1, cableMat);
  wristPitchGroup.add(cable1);
  cableLines.push(cable1);

  const cableGeo2 = trackGeo(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.025, 0.2, 0),
      new THREE.Vector3(-0.018, -0.04, 0),
    ]),
  );
  const cable2 = new THREE.Line(cableGeo2, cableMat);
  wristPitchGroup.add(cable2);
  cableLines.push(cable2);

  const updateKinematics = (
    pitchRad: number,
    yawRad: number,
    rollRad: number,
    gripRad: number,
    masterPos: [number, number, number],
  ) => {
    wristPitchGroup.rotation.x = pitchRad;
    wristYawGroup.rotation.z = yawRad;
    wristRollGroup.rotation.y = rollRad;
    leftJawGroup.rotation.z = gripRad * 0.5;
    rightJawGroup.rotation.z = -gripRad * 0.5;
    masterHandle.position.set(...masterPos);
  };

  const setCutaway = (cutaway: boolean) => {
    shaftSteelMat.transparent = cutaway;
    shaftSteelMat.opacity = cutaway ? 0.35 : 1.0;
    shaftSteelMat.needsUpdate = true;
    darkTitaniumMat.transparent = cutaway;
    darkTitaniumMat.opacity = cutaway ? 0.45 : 1.0;
    darkTitaniumMat.needsUpdate = true;
  };

  return {
    root,
    mainGroup,
    masterHandle,
    baseGroup,
    wristPitchGroup,
    wristYawGroup,
    wristRollGroup,
    leftJawGroup,
    rightJawGroup,
    cableLines,
    updateKinematics,
    setCutaway,
    dispose: () => {
      for (const g of geometriesToDispose) g.dispose();
      for (const m of materialsToDispose) m.dispose();
    },
  };
}
