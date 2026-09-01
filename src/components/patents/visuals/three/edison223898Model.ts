import * as THREE from "three";
import { blackbodyRgb } from "@/physics/blackbody";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

type SegmentEndpoints = readonly [THREE.Vector3, THREE.Vector3];

export interface Edison223898ConnectivityReceipt {
  filamentToLeftCarbonEnd: number;
  filamentToRightCarbonEnd: number;
  leftCarbonEndToPlatina: number;
  rightCarbonEndToPlatina: number;
  leftPlatinaToClamp: number;
  rightPlatinaToClamp: number;
  leftClampToFeedthrough: number;
  rightClampToFeedthrough: number;
  leftFeedthroughToExternalLead: number;
  rightFeedthroughToExternalLead: number;
  leftExternalLeadToBranchPost: number;
  rightExternalLeadToBranchPost: number;
  neutralPostToHouseBranch: number;
  hotPostToHouseBranch: number;
  houseBranchToClosedSwitch: number;
  closedSwitchToSupply: number;
  leftBracketToReceiverCollar: number;
  rightBracketToReceiverCollar: number;
  leftBracketToWallBoard: number;
  rightBracketToWallBoard: number;
}

export interface Edison223898Model {
  rootGroup: THREE.Group;
  lampGroup: THREE.Group;
  houseContextGroup: THREE.Group;
  glassMesh: THREE.Mesh;
  filamentMesh: THREE.Mesh;
  bulbLight: THREE.PointLight;
  gasPoints: THREE.Points;
  gasPositions: Float32Array;
  gasRestPositions: Float32Array;
  gasCount: number;
  materials: {
    glass: THREE.MeshPhysicalMaterial;
    carbon: THREE.MeshStandardMaterial;
    platinum: THREE.MeshStandardMaterial;
    copper: THREE.MeshStandardMaterial;
    brass: THREE.MeshStandardMaterial;
    gas: THREE.PointsMaterial;
  };
  connectivityReceipt: () => Edison223898ConnectivityReceipt;
  dispose: () => void;
}

const ZERO_GAP_TOLERANCE = 1e-9;

function gap(a: THREE.Vector3, b: THREE.Vector3): number {
  const distance = a.distanceTo(b);
  return distance < ZERO_GAP_TOLERANCE ? 0 : distance;
}

function addTube(
  parent: THREE.Object3D,
  points: readonly THREE.Vector3[],
  radius: number,
  material: THREE.Material,
  geometries: THREE.BufferGeometry[],
  name: string,
  tubularSegments = 32,
): { mesh: THREE.Mesh; endpoints: SegmentEndpoints } {
  const curve = new THREE.CatmullRomCurve3(
    points.map((point) => point.clone()),
    false,
    "centripetal",
  );
  const geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, 10, false);
  geometries.push(geometry);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.castShadow = true;
  parent.add(mesh);
  return {
    mesh,
    endpoints: [curve.getPoint(0), curve.getPoint(1)],
  };
}

function addRod(
  parent: THREE.Object3D,
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  material: THREE.Material,
  geometries: THREE.BufferGeometry[],
  name: string,
): { mesh: THREE.Mesh; endpoints: SegmentEndpoints } {
  const delta = end.clone().sub(start);
  const geometry = new THREE.CylinderGeometry(radius, radius, delta.length(), 16);
  geometries.push(geometry);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.clone().normalize());
  mesh.castShadow = true;
  parent.add(mesh);
  return { mesh, endpoints: [start.clone(), end.clone()] };
}

function addBox(
  parent: THREE.Object3D,
  size: readonly [number, number, number],
  position: readonly [number, number, number],
  material: THREE.Material,
  geometries: THREE.BufferGeometry[],
  name: string,
): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(...size);
  geometries.push(geometry);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

/**
 * US 223,898 Figure 1 as a connected apparatus. The wall bracket and branch
 * wiring are an explicitly interpretive domestic context for the patent's
 * stated "multiple arc" use; the receiver, carbon, clamps, sealed conductors,
 * and external leads follow the printed source topology.
 */
export function buildEdison223898Model(): Edison223898Model {
  const rootGroup = new THREE.Group();
  rootGroup.name = "US 223898 connected lamp and domestic branch context";
  const lampGroup = new THREE.Group();
  lampGroup.name = "Figure 1 lamp apparatus";
  const houseContextGroup = new THREE.Group();
  houseContextGroup.name = "Interpretive domestic parallel-branch context";
  rootGroup.add(houseContextGroup, lampGroup);

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    transmission: 0.94,
    transparent: true,
    opacity: 0.72,
    roughness: 0.05,
    ior: 1.5,
    thickness: 0.05,
    side: THREE.DoubleSide,
  });
  const carbon = new THREE.MeshStandardMaterial({
    color: 0x201510,
    emissive: new THREE.Color(0xff6b1a),
    emissiveIntensity: 0,
    roughness: 0.72,
    metalness: 0.04,
  });
  const platinum = new THREE.MeshStandardMaterial({
    color: 0xdbe4ea,
    metalness: 0.88,
    roughness: 0.19,
  });
  const copper = new THREE.MeshStandardMaterial({
    color: 0xa84d22,
    metalness: 0.82,
    roughness: 0.3,
  });
  const brass = new THREE.MeshStandardMaterial({
    color: 0xb88635,
    metalness: 0.8,
    roughness: 0.27,
  });
  const darkBrass = new THREE.MeshStandardMaterial({
    color: 0x655027,
    metalness: 0.68,
    roughness: 0.4,
  });
  const porcelain = new THREE.MeshStandardMaterial({
    color: 0xe8e1cf,
    roughness: 0.75,
    metalness: 0,
  });
  const wood = new THREE.MeshStandardMaterial({
    color: 0x63391f,
    roughness: 0.7,
    metalness: 0,
  });
  const plaster = new THREE.MeshStandardMaterial({
    color: 0xd7c7aa,
    roughness: 0.94,
    metalness: 0,
  });
  const clothWire = new THREE.MeshStandardMaterial({
    color: 0x28231d,
    roughness: 0.92,
    metalness: 0,
  });
  materials.push(
    glass,
    carbon,
    platinum,
    copper,
    brass,
    darkBrass,
    porcelain,
    wood,
    plaster,
    clothWire,
  );

  // The wall reaches the shared studio floor: no floating room backdrop.
  addBox(houseContextGroup, [12, 9.6, 0.24], [0, 0.3, -3.25], plaster, geometries, "room wall");
  addBox(
    houseContextGroup,
    [12, 0.34, 0.42],
    [0, -4.34, -3.05],
    wood,
    geometries,
    "floor-connected baseboard",
  );
  addBox(
    houseContextGroup,
    [6.4, 2.25, 0.28],
    [0, -2.95, -3.02],
    wood,
    geometries,
    "lamp branch mounting board",
  );

  // Source Figure 1: an all-glass exhausted receiver, not a later screw bulb.
  const envelopePoints = [
    new THREE.Vector2(0.68, -2.15),
    new THREE.Vector2(0.7, -1.55),
    new THREE.Vector2(1.45, -1.25),
    new THREE.Vector2(2.35, -0.35),
    new THREE.Vector2(2.72, 0.9),
    new THREE.Vector2(2.56, 2.3),
    new THREE.Vector2(1.78, 3.45),
    new THREE.Vector2(0.55, 4.05),
    new THREE.Vector2(0.08, 4.18),
  ];
  const glassGeometry = new THREE.LatheGeometry(envelopePoints, 72);
  geometries.push(glassGeometry);
  const glassMesh = new THREE.Mesh(glassGeometry, glass);
  glassMesh.name = "all-glass exhausted receiver";
  glassMesh.castShadow = true;
  lampGroup.add(glassMesh);

  const pipGeometry = new THREE.CylinderGeometry(0.055, 0.09, 0.42, 16);
  geometries.push(pipGeometry);
  const pip = new THREE.Mesh(pipGeometry, glass);
  pip.name = "hermetically sealed exhaust tube m";
  pip.position.set(0, 4.31, 0);
  lampGroup.add(pip);

  // Glass holder and flared seal are continuous with the receiver neck.
  const stemGeometry = new THREE.CylinderGeometry(0.5, 0.57, 2.25, 32);
  geometries.push(stemGeometry);
  const stem = new THREE.Mesh(stemGeometry, glass);
  stem.name = "glass holder and conductor seal";
  stem.position.set(0, -1.05, 0);
  lampGroup.add(stem);

  const flareGeometry = new THREE.SphereGeometry(0.68, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2);
  geometries.push(flareGeometry);
  const flare = new THREE.Mesh(flareGeometry, glass);
  flare.name = "flared glass holder crown";
  flare.position.set(0, 0.05, 0);
  lampGroup.add(flare);

  const bulbLight = new THREE.PointLight(0xff9b45, 0, 26, 1.8);
  bulbLight.name = "filament radiance light";
  bulbLight.position.set(0, 1.65, 0.3);
  rootGroup.add(bulbLight);

  const filamentLeft = new THREE.Vector3(-0.62, 0.74, 0.12);
  const filamentRight = new THREE.Vector3(0.62, 0.74, 0.12);
  const filament = addTube(
    lampGroup,
    [
      filamentLeft,
      new THREE.Vector3(-0.92, 1.35, 0.12),
      new THREE.Vector3(-0.78, 2.3, 0.12),
      new THREE.Vector3(0, 2.62, 0.12),
      new THREE.Vector3(0.78, 2.3, 0.12),
      new THREE.Vector3(0.92, 1.35, 0.12),
      filamentRight,
    ],
    0.045,
    carbon,
    geometries,
    "coiled high-resistance carbon filament a",
    80,
  );
  const filamentMesh = filament.mesh;

  const leftPlatinaTop = new THREE.Vector3(-0.4, 0.16, 0.08);
  const rightPlatinaTop = new THREE.Vector3(0.4, 0.16, 0.08);
  const leftCarbon = addTube(
    lampGroup,
    [filamentLeft, new THREE.Vector3(-0.7, 0.45, 0.1), leftPlatinaTop],
    0.105,
    carbon,
    geometries,
    "thickened carbon contact c",
  );
  const rightCarbon = addTube(
    lampGroup,
    [filamentRight, new THREE.Vector3(0.7, 0.45, 0.1), rightPlatinaTop],
    0.105,
    carbon,
    geometries,
    "thickened carbon contact c prime",
  );

  const leftClampTop = new THREE.Vector3(-0.31, -0.43, 0.04);
  const rightClampTop = new THREE.Vector3(0.31, -0.43, 0.04);
  const leftPlatina = addTube(
    lampGroup,
    [leftPlatinaTop, new THREE.Vector3(-0.38, -0.08, 0.06), leftClampTop],
    0.038,
    platinum,
    geometries,
    "platina wire d",
  );
  const rightPlatina = addTube(
    lampGroup,
    [rightPlatinaTop, new THREE.Vector3(0.38, -0.08, 0.06), rightClampTop],
    0.038,
    platinum,
    geometries,
    "platina wire d prime",
  );

  const clampGeometry = new THREE.CylinderGeometry(0.13, 0.13, 0.26, 20);
  geometries.push(clampGeometry);
  const leftClampCenter = new THREE.Vector3(-0.31, -0.56, 0.04);
  const rightClampCenter = new THREE.Vector3(0.31, -0.56, 0.04);
  for (const [name, position] of [
    ["clamp h", leftClampCenter],
    ["clamp h prime", rightClampCenter],
  ] as const) {
    const mesh = new THREE.Mesh(clampGeometry, platinum);
    mesh.name = name;
    mesh.position.copy(position);
    lampGroup.add(mesh);
  }
  const leftClampBottom = new THREE.Vector3(-0.31, -0.69, 0.04);
  const rightClampBottom = new THREE.Vector3(0.31, -0.69, 0.04);
  const leftFeedthroughBottom = new THREE.Vector3(-0.27, -2.46, 0.02);
  const rightFeedthroughBottom = new THREE.Vector3(0.27, -2.46, 0.02);
  const leftFeedthrough = addTube(
    lampGroup,
    [leftClampBottom, new THREE.Vector3(-0.29, -1.45, 0.03), leftFeedthroughBottom],
    0.035,
    copper,
    geometries,
    "sealed leading wire x",
  );
  const rightFeedthrough = addTube(
    lampGroup,
    [rightClampBottom, new THREE.Vector3(0.29, -1.45, 0.03), rightFeedthroughBottom],
    0.035,
    copper,
    geometries,
    "sealed leading wire x prime",
  );

  const leftExternalBottom = new THREE.Vector3(-0.27, -3.28, 0.02);
  const rightExternalBottom = new THREE.Vector3(0.27, -3.28, 0.02);
  const leftExternal = addRod(
    lampGroup,
    leftFeedthroughBottom,
    leftExternalBottom,
    0.045,
    copper,
    geometries,
    "external copper lead e",
  );
  const rightExternal = addRod(
    lampGroup,
    rightFeedthroughBottom,
    rightExternalBottom,
    0.045,
    copper,
    geometries,
    "external copper lead e prime",
  );

  // Receiver collar and two continuous brackets physically carry the lamp.
  const collarGeometry = new THREE.TorusGeometry(0.71, 0.085, 16, 48);
  geometries.push(collarGeometry);
  const collar = new THREE.Mesh(collarGeometry, brass);
  collar.name = "receiver support collar";
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, -2.03, 0);
  lampGroup.add(collar);
  const leftCollarAnchor = new THREE.Vector3(-0.71, -2.03, 0);
  const rightCollarAnchor = new THREE.Vector3(0.71, -2.03, 0);
  const leftWallAnchor = new THREE.Vector3(-1.55, -2.35, -2.84);
  const rightWallAnchor = new THREE.Vector3(1.55, -2.35, -2.84);
  const leftBracket = addTube(
    houseContextGroup,
    [leftWallAnchor, new THREE.Vector3(-1.45, -2.18, -1.35), leftCollarAnchor],
    0.11,
    darkBrass,
    geometries,
    "left wall-to-receiver bracket",
    40,
  );
  const rightBracket = addTube(
    houseContextGroup,
    [rightWallAnchor, new THREE.Vector3(1.45, -2.18, -1.35), rightCollarAnchor],
    0.11,
    darkBrass,
    geometries,
    "right wall-to-receiver bracket",
    40,
  );
  addBox(
    houseContextGroup,
    [0.52, 0.52, 0.22],
    [-1.55, -2.35, -2.88],
    darkBrass,
    geometries,
    "left bracket wall shoe",
  );
  addBox(
    houseContextGroup,
    [0.52, 0.52, 0.22],
    [1.55, -2.35, -2.88],
    darkBrass,
    geometries,
    "right bracket wall shoe",
  );

  // Porcelain branch posts sit on the wooden board; conductors land on their
  // brass caps. This domestic context demonstrates the stated multiple-arc use.
  const leftPostFront = new THREE.Vector3(-2.35, -3.33, -2.55);
  const rightPostFront = new THREE.Vector3(2.35, -3.33, -2.55);
  const postGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.54, 24);
  geometries.push(postGeometry);
  for (const [name, endpoint] of [
    ["neutral porcelain branch post", leftPostFront],
    ["hot porcelain branch post", rightPostFront],
  ] as const) {
    const post = new THREE.Mesh(postGeometry, porcelain);
    post.name = name;
    post.rotation.x = Math.PI / 2;
    post.position.set(endpoint.x, endpoint.y, -2.82);
    houseContextGroup.add(post);
    const capGeometry = new THREE.SphereGeometry(0.13, 16, 12);
    geometries.push(capGeometry);
    const cap = new THREE.Mesh(capGeometry, brass);
    cap.name = `${name} brass cap`;
    cap.position.copy(endpoint);
    houseContextGroup.add(cap);
  }

  const leftBranchLead = addTube(
    rootGroup,
    [leftExternalBottom, new THREE.Vector3(-0.7, -3.72, -1.2), leftPostFront],
    0.06,
    clothWire,
    geometries,
    "lamp neutral branch conductor",
    44,
  );
  const rightBranchLead = addTube(
    rootGroup,
    [rightExternalBottom, new THREE.Vector3(0.7, -3.72, -1.2), rightPostFront],
    0.06,
    clothWire,
    geometries,
    "lamp switched-hot branch conductor",
    44,
  );

  const neutralSupplyTop = new THREE.Vector3(-4.72, 5.1, -3.02);
  const neutralHouseBranch = addTube(
    houseContextGroup,
    [leftPostFront, new THREE.Vector3(-4.72, -3.33, -3.02), neutralSupplyTop],
    0.07,
    clothWire,
    geometries,
    "house neutral supply conductor",
    64,
  );

  const lowerSwitchContact = new THREE.Vector3(3.72, -2.35, -2.55);
  const upperSwitchContact = new THREE.Vector3(3.72, -1.45, -2.55);
  const hotHouseBranch = addTube(
    houseContextGroup,
    [rightPostFront, new THREE.Vector3(3.05, -3.28, -2.75), lowerSwitchContact],
    0.07,
    clothWire,
    geometries,
    "house hot branch conductor",
    36,
  );
  const contactGeometry = new THREE.SphereGeometry(0.14, 16, 12);
  geometries.push(contactGeometry);
  for (const [name, position] of [
    ["lower switch contact", lowerSwitchContact],
    ["upper switch contact", upperSwitchContact],
  ] as const) {
    const contact = new THREE.Mesh(contactGeometry, brass);
    contact.name = name;
    contact.position.copy(position);
    houseContextGroup.add(contact);
  }
  const closedSwitch = addRod(
    houseContextGroup,
    lowerSwitchContact,
    upperSwitchContact,
    0.075,
    brass,
    geometries,
    "closed knife switch",
  );
  const hotSupplyTop = new THREE.Vector3(4.72, 5.1, -3.02);
  const hotSupply = addTube(
    houseContextGroup,
    [upperSwitchContact, new THREE.Vector3(4.72, -1.45, -3.02), hotSupplyTop],
    0.07,
    clothWire,
    geometries,
    "house hot supply conductor",
    56,
  );

  // Sparse deterministic particles make the vacuum legible without pretending
  // that eighty visible spheres represent the physical molecular population.
  const lcg = createLcg(223898);
  const gasCount = 48;
  const gasPositions = new Float32Array(gasCount * 3);
  const gasRestPositions = new Float32Array(gasCount * 3);
  for (let i = 0; i < gasCount; i++) {
    const index = i * 3;
    const radius = 0.35 + lcg() * 1.95;
    const theta = lcg() * Math.PI * 2;
    const y = -0.7 + lcg() * 3.9;
    gasPositions[index] = radius * Math.cos(theta);
    gasPositions[index + 1] = y;
    gasPositions[index + 2] = radius * Math.sin(theta);
  }
  gasRestPositions.set(gasPositions);
  const gasGeometry = new THREE.BufferGeometry();
  geometries.push(gasGeometry);
  gasGeometry.setAttribute("position", new THREE.BufferAttribute(gasPositions, 3));
  const glowTexture = createGlowPointTexture();
  textures.push(glowTexture);
  const gas = new THREE.PointsMaterial({
    size: 0.12,
    map: glowTexture,
    color: 0x93a7b8,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });
  materials.push(gas);
  const gasPoints = new THREE.Points(gasGeometry, gas);
  gasPoints.name = "illustrative sparse residual-gas markers";
  lampGroup.add(gasPoints);

  const connectivityReceipt = (): Edison223898ConnectivityReceipt => ({
    filamentToLeftCarbonEnd: gap(filament.endpoints[0], leftCarbon.endpoints[0]),
    filamentToRightCarbonEnd: gap(filament.endpoints[1], rightCarbon.endpoints[0]),
    leftCarbonEndToPlatina: gap(leftCarbon.endpoints[1], leftPlatina.endpoints[0]),
    rightCarbonEndToPlatina: gap(rightCarbon.endpoints[1], rightPlatina.endpoints[0]),
    leftPlatinaToClamp: gap(leftPlatina.endpoints[1], leftClampTop),
    rightPlatinaToClamp: gap(rightPlatina.endpoints[1], rightClampTop),
    leftClampToFeedthrough: gap(leftClampBottom, leftFeedthrough.endpoints[0]),
    rightClampToFeedthrough: gap(rightClampBottom, rightFeedthrough.endpoints[0]),
    leftFeedthroughToExternalLead: gap(leftFeedthrough.endpoints[1], leftExternal.endpoints[0]),
    rightFeedthroughToExternalLead: gap(rightFeedthrough.endpoints[1], rightExternal.endpoints[0]),
    leftExternalLeadToBranchPost: gap(leftExternal.endpoints[1], leftBranchLead.endpoints[0]),
    rightExternalLeadToBranchPost: gap(rightExternal.endpoints[1], rightBranchLead.endpoints[0]),
    neutralPostToHouseBranch: gap(leftBranchLead.endpoints[1], neutralHouseBranch.endpoints[0]),
    hotPostToHouseBranch: gap(rightBranchLead.endpoints[1], hotHouseBranch.endpoints[0]),
    houseBranchToClosedSwitch: gap(hotHouseBranch.endpoints[1], closedSwitch.endpoints[0]),
    closedSwitchToSupply: gap(closedSwitch.endpoints[1], hotSupply.endpoints[0]),
    leftBracketToReceiverCollar: gap(leftBracket.endpoints[1], leftCollarAnchor),
    rightBracketToReceiverCollar: gap(rightBracket.endpoints[1], rightCollarAnchor),
    leftBracketToWallBoard: gap(leftBracket.endpoints[0], leftWallAnchor),
    rightBracketToWallBoard: gap(rightBracket.endpoints[0], rightWallAnchor),
  });

  const dispose = () => {
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    for (const texture of textures) texture.dispose();
  };

  return {
    rootGroup,
    lampGroup,
    houseContextGroup,
    glassMesh,
    filamentMesh,
    bulbLight,
    gasPoints,
    gasPositions,
    gasRestPositions,
    gasCount,
    materials: { glass, carbon, platinum, copper, brass, gas },
    connectivityReceipt,
    dispose,
  };
}

/** Update blackbody glow, cutaway visibility, and bounded residual-gas motion. */
export function updateEdison223898Model(
  model: Edison223898Model,
  dt: number,
  timeSec: number,
  incandescenceIntensity: number,
  filamentTempKelvin: number,
  thermalJitterPerS: number,
  filamentEmissiveScale: number,
  bulbLightScale: number,
  vacuumTorr: number,
  showGasMolecules: boolean,
  isCutaway: boolean,
  glowThreshold = 0.05,
  gasPhaseOmega = 2,
  gasYOmega = 1.3,
  gasZOmega = 0.7,
): { incandescenceIntensity: number; glowColor: THREE.Color } {
  const isGlowing = incandescenceIntensity > glowThreshold;
  const glowColor = new THREE.Color(blackbodyRgb(filamentTempKelvin));

  model.materials.carbon.color.copy(isGlowing ? glowColor : new THREE.Color(0x201510));
  model.materials.carbon.emissive.copy(glowColor);
  model.materials.carbon.emissiveIntensity = isGlowing
    ? incandescenceIntensity * filamentEmissiveScale
    : 0;
  model.bulbLight.color.copy(glowColor);
  model.bulbLight.intensity = isGlowing ? incandescenceIntensity * bulbLightScale : 0;

  // The markers oscillate about immutable rest positions instead of drifting
  // through the receiver after long runtimes.
  const showGas = showGasMolecules && vacuumTorr > 1e-5;
  model.gasPoints.visible = showGas;
  if (showGas) {
    const amplitude = Math.min(0.06, thermalJitterPerS * Math.max(dt, 1 / 240) * 0.12);
    for (let i = 0; i < model.gasCount; i++) {
      const index = i * 3;
      const phase = timeSec * gasPhaseOmega + i * 0.73;
      model.gasPositions[index] = model.gasRestPositions[index] + Math.sin(phase) * amplitude;
      model.gasPositions[index + 1] =
        model.gasRestPositions[index + 1] + Math.cos(phase * gasYOmega) * amplitude;
      model.gasPositions[index + 2] =
        model.gasRestPositions[index + 2] + Math.sin(phase * gasZOmega) * amplitude;
    }
    model.gasPoints.geometry.attributes.position.needsUpdate = true;
  }

  model.materials.glass.opacity = isCutaway ? 0.18 : 0.72;
  model.materials.copper.transparent = isCutaway;
  model.materials.copper.opacity = isCutaway ? 0.7 : 1;
  return { incandescenceIntensity, glowColor };
}
