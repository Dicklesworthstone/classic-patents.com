import * as THREE from "three";
import { DA_VINCI_TABLE_SURFACE_Y_M } from "@/physics/daVinciKernel";

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
  endEffectorTipAnchor: THREE.Object3D;
  cableLines: THREE.Line[];
  cupGroup: THREE.Group;
  updateArmPose: (
    baseYawRad: number,
    shoulderPitchRad: number,
    elbowPitchRad: number,
    pitchRad: number,
    yawRad: number,
    rollRad: number,
    gripRad: number,
    masterPos: [number, number, number],
    resolvedTip: [number, number, number],
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
  alignEndEffectorTip: (x: number, y: number, z: number) => void;
  connectivityReceipt: () => readonly DaVinciConnectivityGap[];
  setCutaway?: (cutaway: boolean) => void;
  dispose: () => void;
}

export interface DaVinciConnectivityGap {
  interface: string;
  gapMeters: number;
}

/**
 * Normalized exhibit geometry. US 6,331,181 prints linkage topology and joint
 * directions, but not a dimensioned manipulator drawing. These values define
 * only the museum model's internally consistent scale.
 */
export const DA_VINCI_EXHIBIT_GEOMETRY = {
  cartFootY: -1.72,
  cartShoulder: [-1.72, 1.28, 0] as const,
  upperLinkLengthM: 1.35,
  foreLinkLengthM: 1.35,
  carriageHeightM: 0.42,
  shaftLengthM: 1.42,
  distalStackLengthM: 0.36,
} as const;

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

  // --- Shared scene materials ---
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
  surgicalTable.name = "Kernel-aligned surgical table";
  surgicalTable.position.set(0, DA_VINCI_TABLE_SURFACE_Y_M - 0.2, 0);
  surgicalTable.receiveShadow = true;
  root.add(surgicalTable);

  const sterileDrape = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.6, 0.04, 2.8)), drapeMat);
  sterileDrape.name = "Sterile drape at kernel table surface";
  sterileDrape.position.set(0, DA_VINCI_TABLE_SURFACE_Y_M - 0.02, 0);
  root.add(sterileDrape);

  const tableLegGeometry = trackGeo(new THREE.BoxGeometry(0.18, 1.26, 0.18));
  for (const [index, [x, z]] of [
    [-1.7, -1.1],
    [-1.7, 1.1],
    [1.7, -1.1],
    [1.7, 1.1],
  ].entries()) {
    const leg = new THREE.Mesh(tableLegGeometry, tableMat);
    leg.name = `Surgical table support leg ${index + 1}`;
    leg.position.set(x, DA_VINCI_TABLE_SURFACE_Y_M - 1.03, z);
    leg.castShadow = true;
    leg.receiveShadow = true;
    root.add(leg);
  }

  // Patient Abdominal Trocar Incision Guide Ring
  const trocarGeo = trackGeo(new THREE.TorusGeometry(0.38, 0.045, 16, 32));
  const trocar = new THREE.Mesh(trocarGeo, trocarMat);
  trocar.name = "Seated illustrative incision guide ring";
  trocar.userData.constraintMode = "visual-guide-only";
  trocar.rotation.x = Math.PI / 2;
  trocar.position.set(0, 0, 0);
  root.add(trocar);

  // Patient Abdomen Dome Contour
  const abdomenGeo = trackGeo(
    new THREE.SphereGeometry(1.15, 32, 18, 0, Math.PI * 2, 0, Math.PI / 2),
  );
  const abdomenMesh = new THREE.Mesh(abdomenGeo, drapeMat);
  abdomenMesh.name = "Convex patient abdomen training form";
  abdomenMesh.scale.y = 0.14;
  abdomenMesh.position.set(0, DA_VINCI_TABLE_SURFACE_Y_M, 0);
  root.add(abdomenMesh);

  // 2. Patient-side cart and articulated manipulator support, reconstructed
  // from Figs. 2 and 2A. The source establishes a cart, a supported linkage,
  // a tool carriage, and intersecting tool-axis motions. It does not print
  // dimensions, so this is normalized topology rather than a commercial-arm
  // dimensional claim.
  const cartGroup = new THREE.Group();
  cartGroup.name = "Fig. 2 patient-side cart support";
  root.add(cartGroup);

  const cartFoot = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.05, 0.22, 0.92)),
    darkTitaniumMat,
  );
  cartFoot.name = "Cart foundation foot";
  cartFoot.position.set(-1.72, DA_VINCI_EXHIBIT_GEOMETRY.cartFootY, 0);
  cartFoot.castShadow = true;
  cartFoot.receiveShadow = true;
  cartGroup.add(cartFoot);

  const pedestalBottomY = DA_VINCI_EXHIBIT_GEOMETRY.cartFootY + 0.11;
  const shoulderPosition = new THREE.Vector3(...DA_VINCI_EXHIBIT_GEOMETRY.cartShoulder);
  const pedestalHeight = shoulderPosition.y - pedestalBottomY;
  const cartPedestal = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.48, pedestalHeight, 0.48)),
    darkTitaniumMat,
  );
  cartPedestal.name = "Cart pedestal";
  cartPedestal.position.set(
    shoulderPosition.x,
    pedestalBottomY + pedestalHeight / 2,
    shoulderPosition.z,
  );
  cartPedestal.castShadow = true;
  cartGroup.add(cartPedestal);

  const shoulderHub = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.22, 0.22, 0.34, 24)),
    surgicalSteelMat,
  );
  shoulderHub.name = "Manipulator shoulder hub";
  shoulderHub.position.copy(shoulderPosition);
  shoulderHub.rotation.x = Math.PI / 2;
  shoulderHub.castShadow = true;
  cartGroup.add(shoulderHub);

  const linkGeo = trackGeo(new THREE.BoxGeometry(0.22, 1, 0.28));
  const upperArm = new THREE.Mesh(linkGeo, surgicalSteelMat);
  upperArm.name = "Normalized upper support link";
  upperArm.castShadow = true;
  cartGroup.add(upperArm);

  const foreArm = new THREE.Mesh(linkGeo, surgicalSteelMat);
  foreArm.name = "Normalized fore support link";
  foreArm.castShadow = true;
  cartGroup.add(foreArm);

  const elbowHub = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 0.3, 24)),
    surgicalSteelMat,
  );
  elbowHub.name = "Manipulator elbow hub";
  elbowHub.rotation.x = Math.PI / 2;
  elbowHub.castShadow = true;
  cartGroup.add(elbowHub);

  const toolMountHub = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 0.32, 24)),
    surgicalSteelMat,
  );
  toolMountHub.name = "Releasable tool holder mount";
  toolMountHub.rotation.x = Math.PI / 2;
  toolMountHub.castShadow = true;
  cartGroup.add(toolMountHub);

  const cableLoomGeometry = trackGeo(
    new THREE.BufferGeometry().setFromPoints([
      shoulderPosition,
      shoulderPosition,
      shoulderPosition,
    ]),
  );
  const cableLoom = new THREE.Line(cableLoomGeometry, cableMat);
  cableLoom.name = "Connected tool-data and drive loom";
  cartGroup.add(cableLoom);

  // 3. Master Surgeon Console Gimbal Handle (Ghost Tracking Gizmo)
  const masterGeo = trackGeo(new THREE.OctahedronGeometry(0.14, 1));
  const masterHandle = new THREE.Mesh(masterGeo, masterGhostMat);
  masterHandle.position.set(0, 1.2, 1.5);
  root.add(masterHandle);

  // 4. Releasable tool carriage and instrument shaft. The carriage is the
  // distal endpoint of the articulated support above; every child is nested
  // from that load path instead of being translated as an untethered object.
  const baseGroup = new THREE.Group();
  baseGroup.name = "Connected releasable tool carriage";
  mainGroup.add(baseGroup);

  const carriageGeo = trackGeo(
    new THREE.BoxGeometry(0.38, DA_VINCI_EXHIBIT_GEOMETRY.carriageHeightM, 0.44),
  );
  const carriage = new THREE.Mesh(carriageGeo, darkTitaniumMat);
  carriage.name = "Tool holder carriage";
  carriage.position.set(0, 0, 0);
  carriage.castShadow = true;
  baseGroup.add(carriage);

  const shaftTopY = -DA_VINCI_EXHIBIT_GEOMETRY.carriageHeightM / 2;
  const shaftBottomY = shaftTopY - DA_VINCI_EXHIBIT_GEOMETRY.shaftLengthM;
  const shaftGeo = trackGeo(
    new THREE.CylinderGeometry(0.038, 0.038, DA_VINCI_EXHIBIT_GEOMETRY.shaftLengthM, 24),
  );
  const shaft = new THREE.Mesh(shaftGeo, shaftSteelMat);
  shaft.name = "Tool instrument shaft";
  shaft.position.set(0, (shaftTopY + shaftBottomY) / 2, 0);
  shaft.castShadow = true;
  baseGroup.add(shaft);

  // 4. Illustrative distal articulation stack. The grant claims tool data,
  // drive interfaces, and calibration memory; it does not fix a commercial
  // EndoWrist name or a universal degree-of-freedom count.
  // Wrist Pitch Joint
  const wristPitchGroup = new THREE.Group();
  wristPitchGroup.name = "Illustrative distal pitch joint";
  wristPitchGroup.position.set(0, shaftBottomY, 0);
  baseGroup.add(wristPitchGroup);

  const clevisGeo = trackGeo(new THREE.CylinderGeometry(0.046, 0.046, 0.085, 16));
  const clevis = new THREE.Mesh(clevisGeo, surgicalSteelMat);
  clevis.rotation.z = Math.PI / 2;
  clevis.castShadow = true;
  wristPitchGroup.add(clevis);

  // Wrist Yaw Joint
  const wristYawGroup = new THREE.Group();
  wristYawGroup.name = "Illustrative distal yaw joint";
  wristYawGroup.position.set(0, -0.065, 0);
  wristPitchGroup.add(wristYawGroup);

  const yawPulleyGeo = trackGeo(new THREE.SphereGeometry(0.044, 16, 16));
  const yawPulley = new THREE.Mesh(yawPulleyGeo, surgicalSteelMat);
  wristYawGroup.add(yawPulley);

  // Wrist Roll Joint
  const wristRollGroup = new THREE.Group();
  wristRollGroup.name = "Illustrative distal roll joint";
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

  // Centerline seat at the distal jaw tips. The complete connected mechanism
  // is positioned from this anchor to the collision-resolved kernel tip.
  const endEffectorTipAnchor = new THREE.Object3D();
  endEffectorTipAnchor.name = "Collision-resolved end-effector tip";
  endEffectorTipAnchor.position.set(0, -0.22, 0);
  wristRollGroup.add(endEffectorTipAnchor);

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

  // 7. Interactive Coffee Cup / Specimen Container
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
  cupOuterMesh.name = "Cup body seated on kernel table surface";
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
  suturePad.name = "Training pad seated on kernel table surface";
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
      linewidth: 1,
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

  const yAxis = new THREE.Vector3(0, 1, 0);
  const linkDirection = new THREE.Vector3();
  const linkMidpoint = new THREE.Vector3();
  const orientLinkBetween = (mesh: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3) => {
    linkDirection.subVectors(end, start);
    const length = linkDirection.length();
    if (length <= 1e-9) return;
    linkDirection.multiplyScalar(1 / length);
    mesh.position.copy(linkMidpoint.addVectors(start, end).multiplyScalar(0.5));
    mesh.quaternion.setFromUnitVectors(yAxis, linkDirection);
    mesh.scale.set(1, length, 1);
  };

  const direct = new THREE.Vector3();
  const directUnit = new THREE.Vector3();
  const bendDirection = new THREE.Vector3();
  const elbowPosition = new THREE.Vector3();
  const mountPosition = new THREE.Vector3();
  const shoulderWorld = new THREE.Vector3();
  let lastElbowPitchRad = 0;

  const updateSupportLinkage = (elbowPitchRad: number) => {
    root.updateMatrixWorld(true);
    shoulderHub.getWorldPosition(shoulderWorld);
    baseGroup.getWorldPosition(mountPosition);
    direct.subVectors(mountPosition, shoulderWorld);
    const distance = direct.length();
    const upperLength = DA_VINCI_EXHIBIT_GEOMETRY.upperLinkLengthM;
    const foreLength = DA_VINCI_EXHIBIT_GEOMETRY.foreLinkLengthM;
    const maximumReach = upperLength + foreLength;
    const minimumReach = Math.abs(upperLength - foreLength);
    if (distance <= minimumReach + 1e-6 || distance >= maximumReach - 1e-6) {
      throw new Error(
        `Da Vinci exhibit linkage target ${distance.toFixed(6)} m is outside its fixed-link reach`,
      );
    }

    directUnit.copy(direct).multiplyScalar(1 / distance);
    bendDirection
      .set(0, 1, 0)
      .addScaledVector(directUnit, -directUnit.dot(new THREE.Vector3(0, 1, 0)));
    if (bendDirection.lengthSq() < 1e-8) {
      bendDirection
        .set(0, 0, 1)
        .addScaledVector(directUnit, -directUnit.dot(new THREE.Vector3(0, 0, 1)));
    }
    bendDirection.normalize().applyAxisAngle(directUnit, elbowPitchRad);

    const along =
      (upperLength * upperLength - foreLength * foreLength + distance * distance) / (2 * distance);
    const transverse = Math.sqrt(Math.max(0, upperLength * upperLength - along * along));
    elbowPosition
      .copy(shoulderWorld)
      .addScaledVector(directUnit, along)
      .addScaledVector(bendDirection, transverse);

    const shoulderLocal = cartGroup.worldToLocal(shoulderWorld.clone());
    const elbowLocal = cartGroup.worldToLocal(elbowPosition.clone());
    const mountLocal = cartGroup.worldToLocal(mountPosition.clone());
    orientLinkBetween(upperArm, shoulderLocal, elbowLocal);
    orientLinkBetween(foreArm, elbowLocal, mountLocal);
    elbowHub.position.copy(elbowLocal);
    toolMountHub.position.copy(mountLocal);

    const loomPositions = cableLoomGeometry.attributes.position as THREE.BufferAttribute;
    loomPositions.setXYZ(0, shoulderLocal.x, shoulderLocal.y, shoulderLocal.z);
    loomPositions.setXYZ(1, elbowLocal.x, elbowLocal.y, elbowLocal.z);
    loomPositions.setXYZ(2, mountLocal.x, mountLocal.y, mountLocal.z);
    loomPositions.needsUpdate = true;
    root.updateMatrixWorld(true);
  };

  const updateDistalKinematics = (
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

  const currentTipInParent = new THREE.Vector3();
  const targetTipInParent = new THREE.Vector3();
  const alignEndEffectorTip = (x: number, y: number, z: number) => {
    root.updateMatrixWorld(true);
    endEffectorTipAnchor.getWorldPosition(currentTipInParent);
    targetTipInParent.set(x, y, z);
    mainGroup.worldToLocal(currentTipInParent);
    mainGroup.worldToLocal(targetTipInParent);
    baseGroup.position.add(targetTipInParent.sub(currentTipInParent));
    root.updateMatrixWorld(true);
    updateSupportLinkage(lastElbowPitchRad);
  };

  const updateArmPose = (
    baseYawRad: number,
    shoulderPitchRad: number,
    elbowPitchRad: number,
    pitchRad: number,
    yawRad: number,
    rollRad: number,
    gripRad: number,
    masterPos: [number, number, number],
    resolvedTip: [number, number, number],
  ) => {
    lastElbowPitchRad = elbowPitchRad;
    baseGroup.rotation.set(shoulderPitchRad, baseYawRad, 0, "XYZ");
    updateDistalKinematics(pitchRad, yawRad, rollRad, gripRad, masterPos);
    alignEndEffectorTip(...resolvedTip);
  };

  const endpoint = (mesh: THREE.Mesh, localY: number) =>
    mesh.localToWorld(new THREE.Vector3(0, localY, 0));
  const origin = (object: THREE.Object3D) => object.getWorldPosition(new THREE.Vector3());
  const gap = (interfaceName: string, a: THREE.Vector3, b: THREE.Vector3) => ({
    interface: interfaceName,
    gapMeters: a.distanceTo(b),
  });
  const connectivityReceipt = (): readonly DaVinciConnectivityGap[] => {
    root.updateMatrixWorld(true);
    const footTop = cartFoot.localToWorld(new THREE.Vector3(0, 0.11, 0));
    const pedestalBottom = cartPedestal.localToWorld(new THREE.Vector3(0, -pedestalHeight / 2, 0));
    const pedestalTop = cartPedestal.localToWorld(new THREE.Vector3(0, pedestalHeight / 2, 0));
    const shoulder = origin(shoulderHub);
    const upperStart = endpoint(upperArm, -0.5);
    const upperEnd = endpoint(upperArm, 0.5);
    const elbow = origin(elbowHub);
    const foreStart = endpoint(foreArm, -0.5);
    const foreEnd = endpoint(foreArm, 0.5);
    const mount = origin(toolMountHub);
    const carriageMount = origin(baseGroup);
    const carriageBottom = carriage.localToWorld(
      new THREE.Vector3(0, -DA_VINCI_EXHIBIT_GEOMETRY.carriageHeightM / 2, 0),
    );
    const shaftTop = shaft.localToWorld(
      new THREE.Vector3(0, DA_VINCI_EXHIBIT_GEOMETRY.shaftLengthM / 2, 0),
    );
    const shaftBottom = shaft.localToWorld(
      new THREE.Vector3(0, -DA_VINCI_EXHIBIT_GEOMETRY.shaftLengthM / 2, 0),
    );
    const wristPitch = origin(wristPitchGroup);
    const wristYaw = origin(wristYawGroup);
    const wristRoll = origin(wristRollGroup);
    return [
      gap("cart foot -> pedestal", footTop, pedestalBottom),
      gap("pedestal -> shoulder hub", pedestalTop, shoulder),
      gap("shoulder hub -> upper support", shoulder, upperStart),
      gap("upper support -> elbow hub", upperEnd, elbow),
      gap("elbow hub -> fore support", elbow, foreStart),
      gap("fore support -> tool mount", foreEnd, mount),
      gap("tool mount -> releasable carriage", mount, carriageMount),
      gap("carriage -> instrument shaft", carriageBottom, shaftTop),
      gap("instrument shaft -> distal pitch", shaftBottom, wristPitch),
      gap(
        "distal pitch -> distal yaw",
        wristPitchGroup.localToWorld(new THREE.Vector3(0, -0.065, 0)),
        wristYaw,
      ),
      gap(
        "distal yaw -> distal roll",
        wristYawGroup.localToWorld(new THREE.Vector3(0, -0.055, 0)),
        wristRoll,
      ),
      gap("distal roll -> left jaw", wristRoll, origin(leftJawGroup)),
      gap("distal roll -> right jaw", wristRoll, origin(rightJawGroup)),
    ];
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
    endEffectorTipAnchor,
    cableLines,
    cupGroup,
    updateArmPose,
    setCupPose,
    setContactGizmo,
    alignEndEffectorTip,
    connectivityReceipt,
    setCutaway,
    dispose: () => {
      for (const g of geometriesToDispose) g.dispose();
      for (const m of materialsToDispose) m.dispose();
    },
  };
}
