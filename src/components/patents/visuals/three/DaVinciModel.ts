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
  cupGroup: THREE.Group;
  updateKinematics: (
    pitchRad: number,
    yawRad: number,
    rollRad: number,
    gripRad: number,
    masterPos: [number, number, number],
  ) => void;
  setCupPose: (
    x: number,
    y: number,
    z: number,
    rotY: number,
    isColliding: boolean,
    isGrasped: boolean,
  ) => void;
  setContactGizmo: (
    x: number,
    y: number,
    z: number,
    nx: number,
    ny: number,
    nz: number,
    active: boolean,
  ) => void;
  setCutaway?: (cutaway: boolean) => void;
  dispose: () => void;
}

export function buildDaVinciModel(): DaVinciModel {
  const root = new THREE.Group();
  root.name = "US 6,331,181 Robotic Surgical Tool Interface Model";
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

  // 1. Surgical Table Presentation Plinth & Sterile Field Drape Base
  const drapeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Surgical blue sterile drape
      roughness: 0.85,
      metalness: 0.05,
    }),
  );
  const tableMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.35,
    }),
  );

  const surgicalTable = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.2, 0.4, 3.2)), tableMat);
  surgicalTable.position.set(0, -1.8, 0);
  surgicalTable.receiveShadow = true;
  root.add(surgicalTable);

  const sterileDrape = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.6, 0.15, 2.8)), drapeMat);
  sterileDrape.position.set(0, -1.5, 0);
  root.add(sterileDrape);

  // Patient Abdominal Trocar Incision Guide Ring
  const trocarGeo = trackGeo(new THREE.TorusGeometry(0.38, 0.045, 16, 32));
  const trocar = new THREE.Mesh(trocarGeo, trocarMat);
  trocar.rotation.x = Math.PI / 2;
  trocar.position.set(0, 0, 0);
  root.add(trocar);

  // Patient Abdomen Dome Contour
  const abdomenGeo = trackGeo(
    new THREE.SphereGeometry(1.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 3),
  );
  const abdomenMesh = new THREE.Mesh(abdomenGeo, drapeMat);
  abdomenMesh.rotation.x = Math.PI;
  abdomenMesh.position.set(0, -0.15, 0);
  root.add(abdomenMesh);

  // 2. Patient-Side Cart Robotic Manipulator Boom Arm
  const boomArmGroup = new THREE.Group();
  root.add(boomArmGroup);

  const boomBase = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.25, 0.32, 1.8, 16)),
    darkTitaniumMat,
  );
  boomBase.position.set(-1.8, -0.8, 0);
  boomArmGroup.add(boomBase);

  const boomLink = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.18, 0.22, 2.2)),
    darkTitaniumMat,
  );
  boomLink.position.set(-0.9, 1.85, 0);
  boomLink.rotation.y = Math.PI / 2;
  boomArmGroup.add(boomLink);

  // 3. Master Surgeon Console Gimbal Handle (Ghost Tracking Gizmo)
  const masterGeo = trackGeo(new THREE.OctahedronGeometry(0.14, 1));
  const masterHandle = new THREE.Mesh(masterGeo, masterGhostMat);
  masterHandle.position.set(0, 1.2, 1.5);
  root.add(masterHandle);

  // 4. Robotic Arm Base Carriage & Instrument Shaft
  const baseGroup = new THREE.Group();
  mainGroup.add(baseGroup);

  const carriageGeo = trackGeo(new THREE.BoxGeometry(0.32, 0.55, 0.38));
  const carriage = new THREE.Mesh(carriageGeo, darkTitaniumMat);
  carriage.position.set(0, 1.85, 0);
  carriage.castShadow = true;
  baseGroup.add(carriage);

  const shaftGeo = trackGeo(new THREE.CylinderGeometry(0.038, 0.038, 2.3, 24));
  const shaft = new THREE.Mesh(shaftGeo, shaftSteelMat);
  shaft.position.set(0, 0.72, 0);
  shaft.castShadow = true;
  baseGroup.add(shaft);

  // 4. Illustrative distal articulation stack. The grant claims tool data,
  // drive interfaces, and calibration memory; it does not fix a commercial
  // EndoWrist name or a universal degree-of-freedom count.
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

  // 7. Interactive Coffee Cup / Specimen Container (Museum-Grade PBR Model)
  const cupGroup = new THREE.Group();
  cupGroup.name = "Robotic Manipulation Coffee Cup";
  root.add(cupGroup);

  const ceramicCupMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // Glazed porcelain white
      roughness: 0.22,
      metalness: 0.08,
    }),
  );

  const coffeeLiquidMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x271406, // Deep roasted coffee
      roughness: 0.12,
      metalness: 0.25,
    }),
  );

  const cupHighlightMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf97316, // Contact stress orange
      emissive: new THREE.Color(0xea580c),
      emissiveIntensity: 0.0,
      roughness: 0.3,
      metalness: 0.1,
    }),
  );

  const graspAuraMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.0,
      wireframe: true,
    }),
  );

  // Outer Cup Cylinder / Truncated Tapered Shell
  const cupOuterGeo = trackGeo(new THREE.CylinderGeometry(0.075, 0.062, 0.13, 32));
  const cupOuterMesh = new THREE.Mesh(cupOuterGeo, ceramicCupMat);
  cupOuterMesh.position.set(0, 0.065, 0);
  cupOuterMesh.castShadow = true;
  cupOuterMesh.receiveShadow = true;
  cupGroup.add(cupOuterMesh);

  // Inner Hollow Cavity (Dark Liquid Surface)
  const liquidGeo = trackGeo(new THREE.CylinderGeometry(0.068, 0.068, 0.005, 32));
  const liquidMesh = new THREE.Mesh(liquidGeo, coffeeLiquidMat);
  liquidMesh.position.set(0, 0.118, 0);
  cupGroup.add(liquidMesh);

  // Curved Ergonomic Handle (Torus)
  const handleGeo = trackGeo(new THREE.TorusGeometry(0.038, 0.011, 16, 24, Math.PI * 1.2));
  const handleMesh = new THREE.Mesh(handleGeo, ceramicCupMat);
  handleMesh.position.set(0.082, 0.065, 0);
  handleMesh.rotation.y = Math.PI / 2;
  handleMesh.rotation.z = -Math.PI * 0.1;
  handleMesh.castShadow = true;
  cupGroup.add(handleMesh);

  // Grasp Aura Ring
  const graspAuraGeo = trackGeo(new THREE.TorusGeometry(0.085, 0.008, 16, 32));
  const graspAuraMesh = new THREE.Mesh(graspAuraGeo, graspAuraMat);
  graspAuraMesh.position.set(0, 0.13, 0);
  graspAuraMesh.rotation.x = Math.PI / 2;
  cupGroup.add(graspAuraMesh);

  // Default cup position on table
  cupGroup.position.set(0.22, -0.15, 0.32);

  // 8. Surgical Training Suture & Target Pad
  const suturePadGroup = new THREE.Group();
  root.add(suturePadGroup);

  const siliconeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf43f5e, // Silicone surgical flesh
      roughness: 0.65,
      metalness: 0.05,
    }),
  );
  const suturePad = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.24, 0.025, 0.24)), siliconeMat);
  suturePad.position.set(-0.35, -0.138, 0.32);
  suturePad.receiveShadow = true;
  suturePadGroup.add(suturePad);

  // 9. Contact Point & Normal Visualizer Gizmo
  const contactGizmoGroup = new THREE.Group();
  contactGizmoGroup.visible = false;
  root.add(contactGizmoGroup);

  const sparkMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0xff3b30,
    }),
  );
  const sparkMesh = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.016, 12, 12)), sparkMat);
  contactGizmoGroup.add(sparkMesh);

  const normalLineMat = trackMat(
    new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      linewidth: 2,
    }),
  );
  const normalLineGeo = trackGeo(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.08, 0),
    ]),
  );
  const normalLine = new THREE.Line(normalLineGeo, normalLineMat);
  contactGizmoGroup.add(normalLine);

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

  const setCupPose = (
    x: number,
    y: number,
    z: number,
    rotY: number,
    isColliding: boolean,
    isGrasped: boolean,
  ) => {
    cupGroup.position.set(x, y, z);
    cupGroup.rotation.y = rotY;

    if (isGrasped) {
      graspAuraMat.opacity = 0.85;
      cupOuterMesh.material = cupHighlightMat;
      cupHighlightMat.emissive.setHex(0x10b981);
      cupHighlightMat.emissiveIntensity = 0.55;
    } else if (isColliding) {
      graspAuraMat.opacity = 0.0;
      cupOuterMesh.material = cupHighlightMat;
      cupHighlightMat.emissive.setHex(0xef4444);
      cupHighlightMat.emissiveIntensity = 0.65;
    } else {
      graspAuraMat.opacity = 0.0;
      cupOuterMesh.material = ceramicCupMat;
    }
  };

  const setContactGizmo = (
    x: number,
    y: number,
    z: number,
    nx: number,
    ny: number,
    nz: number,
    active: boolean,
  ) => {
    contactGizmoGroup.visible = active;
    if (active) {
      contactGizmoGroup.position.set(x, y, z);
      const positions = normalLineGeo.attributes.position as THREE.BufferAttribute;
      positions.setXYZ(0, 0, 0, 0);
      positions.setXYZ(1, nx * 0.08, ny * 0.08, nz * 0.08);
      positions.needsUpdate = true;
    }
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
    cupGroup,
    updateKinematics,
    setCupPose,
    setContactGizmo,
    setCutaway,
    dispose: () => {
      for (const g of geometriesToDispose) g.dispose();
      for (const m of materialsToDispose) m.dispose();
    },
  };
}
