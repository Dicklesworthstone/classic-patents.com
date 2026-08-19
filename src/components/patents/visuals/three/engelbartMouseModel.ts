/**
 * engelbartMouseModel.ts
 *
 * Museum-Grade Procedural 3D Model for Douglas C. Engelbart's 1964 Computer Mouse
 * (US Patent 3,541,541 - "X-Y Position Indicator for a Display System").
 *
 * Reconstructs the Stanford Research Institute (SRI) NLS wooden prototype mouse:
 * 1. Hand-carved walnut wooden block casing with authentic grain.
 * 2. Stamped metal base plate with wheel apertures and fastener screws.
 * 3. Spring-loaded red tactile microswitch button on front corner (Claim 1).
 * 4. Orthogonal brass knife-edge tracking wheels:
 *    - X-wheel rolling on X-axis and skidding on Y-axis (Claim 2).
 *    - Y-wheel rolling on Y-axis and skidding on X-axis (Claim 3).
 * 5. Potentiometer rotary resolver transducers with internal wipers converting wheel rotation to analog displacement.
 * 6. Rear molded rubber strain-relief boot and trailing electrical cable.
 */

import * as THREE from "three";
import { cyclicSol, cyclicSymmetry } from "@/physics/genericWasm";
import { stepEngelbartResolver } from "@/physics/machineKernels";

export interface EngelbartMouseModelNodes {
  rootGroup: THREE.Group;
  mouseGroup: THREE.Group;
  body: THREE.Mesh;
  basePlate: THREE.Mesh;
  redButton: THREE.Mesh;
  microswitchGroup: THREE.Group;
  switchLeaf: THREE.Mesh;
  xWheelGroup: THREE.Group;
  xWheelRim: THREE.Mesh;
  xPotWiper: THREE.Mesh;
  yWheelGroup: THREE.Group;
  yWheelRim: THREE.Mesh;
  yPotWiper: THREE.Mesh;
  boot: THREE.Mesh;
  cord: THREE.Mesh;
  bearingBlocks?: THREE.Mesh[];
}

export interface EngelbartMouseMaterials {
  woodHousing: THREE.MeshStandardMaterial;
  woodHousingXRay: THREE.MeshPhysicalMaterial;
  brassWheel: THREE.MeshStandardMaterial;
  redButton: THREE.MeshStandardMaterial;
  potentiometer: THREE.MeshStandardMaterial;
  wiperCopper: THREE.MeshStandardMaterial;
  baseMetal: THREE.MeshStandardMaterial;
  rubberBoot: THREE.MeshStandardMaterial;
  cable: THREE.MeshStandardMaterial;
  steelPivot?: THREE.MeshStandardMaterial;
}

export interface EngelbartMouseModelResult {
  rootGroup: THREE.Group;
  nodes: EngelbartMouseModelNodes;
  materials: EngelbartMouseMaterials;
  dispose: () => void;
}

/**
 * Deterministic unit noise for procedural grain generation.
 */
function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

/**
 * Procedural Hand-Carved American Walnut Texture
 */
function createWalnutTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Warm hand-oiled walnut brown
  ctx.fillStyle = "#8a3010";
  ctx.fillRect(0, 0, 512, 512);

  // Walnut longitudinal grain & subtle wood swirl
  for (let i = 0; i < 90; i++) {
    const x = i * 5.8 + (deterministicUnit(i, 0) - 0.5) * 4;
    const alpha = 0.08 + (i % 4 === 0 ? 0.15 : 0.04);
    ctx.strokeStyle = `rgba(50, 16, 6, ${alpha})`;
    ctx.lineWidth = 1.3 + (i % 3) * 0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 14, 160, x - 12, 360, x + 6, 512);
    ctx.stroke();
  }

  // Wood pores & light hand-sanded highlights
  for (let p = 0; p < 280; p++) {
    const px = deterministicUnit(p, 1) * 512;
    const py = deterministicUnit(p, 2) * 512;
    ctx.fillStyle = "rgba(30, 8, 4, 0.28)";
    ctx.fillRect(px, py, 1.8, 5 + deterministicUnit(p, 3) * 7);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildEngelbartMouseModel(): EngelbartMouseModelResult {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometriesToDispose.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materialsToDispose.push(mat);
    return mat;
  };

  const walnutTex = createWalnutTexture();
  if (walnutTex) texturesToDispose.push(walnutTex);

  // Materials
  const materials: EngelbartMouseMaterials = {
    woodHousing: trackMat(
      new THREE.MeshStandardMaterial({
        ...(walnutTex ? { map: walnutTex } : {}),
        color: 0x9a3412,
        roughness: 0.35,
        metalness: 0.05,
      }),
    ),
    woodHousingXRay: trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x9a3412,
        transmission: 0.82,
        opacity: 0.35,
        transparent: true,
        roughness: 0.15,
        ior: 1.4,
      }),
    ),
    brassWheel: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.18,
        metalness: 0.92,
      }),
    ),
    redButton: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.25,
        metalness: 0.1,
      }),
    ),
    potentiometer: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.3,
        metalness: 0.85,
      }),
    ),
    wiperCopper: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xb45309,
        roughness: 0.15,
        metalness: 0.95,
      }),
    ),
    baseMetal: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.85,
        roughness: 0.3,
      }),
    ),
    rubberBoot: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.9,
      }),
    ),
    cable: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.5,
      }),
    ),
    steelPivot: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.12,
        metalness: 0.96,
      }),
    ),
  };

  const mouseGroup = new THREE.Group();
  rootGroup.add(mouseGroup);

  // 1. Carved Walnut Wooden Block Casing
  const bodyGeo = trackGeo(new THREE.BoxGeometry(4.4, 2.3, 6.0));
  const body = new THREE.Mesh(bodyGeo, materials.woodHousing);
  body.position.y = 1.25;
  body.castShadow = true;
  body.receiveShadow = true;
  mouseGroup.add(body);

  // 2. Stamped Metal Base Plate with Fastener Screws
  const basePlate = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.38, 0.12, 5.98)),
    materials.baseMetal,
  );
  basePlate.position.y = 0.12;
  basePlate.receiveShadow = true;
  mouseGroup.add(basePlate);

  // Base Plate Corner Fastener Screws
  [
    [-1.8, -2.5],
    [1.8, -2.5],
    [-1.8, 2.5],
    [1.8, 2.5],
  ].forEach(([sx, sz]) => {
    const screw = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12)),
      materials.baseMetal,
    );
    screw.position.set(sx, 0.06, sz);
    mouseGroup.add(screw);
  });

  // 3. Tactile Button & Microswitch
  const buttonBezel = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.48, 0.52, 0.15, 24)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 })),
  );
  buttonBezel.position.set(1.3, 2.42, -2.0);
  mouseGroup.add(buttonBezel);

  const redButton = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.38, 0.38, 0.45, 24)),
    materials.redButton,
  );
  redButton.position.set(1.3, 2.6, -2.0);
  redButton.castShadow = true;
  mouseGroup.add(redButton);

  const microswitchGroup = new THREE.Group();
  microswitchGroup.position.set(1.3, 1.8, -2.0);
  const switchBox = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.7, 0.5, 0.9)),
    materials.potentiometer,
  );
  microswitchGroup.add(switchBox);

  const switchLeaf = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.3, 0.04, 0.7)),
    materials.wiperCopper,
  );
  switchLeaf.position.set(0, 0.28, 0);
  microswitchGroup.add(switchLeaf);
  mouseGroup.add(microswitchGroup);

  // 4. Rear Rubber Strain Relief Boot & Cable
  const bootGeo = trackGeo(new THREE.ConeGeometry(0.32, 0.8, 16));
  const boot = new THREE.Mesh(bootGeo, materials.rubberBoot);
  boot.rotation.x = -Math.PI / 2;
  boot.position.set(0, 0.6, 3.2);
  mouseGroup.add(boot);

  const cordCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.6, 3.6),
    new THREE.Vector3(0.6, 0.3, 5.0),
    new THREE.Vector3(2.0, 0.1, 6.8),
    new THREE.Vector3(3.8, 0.1, 8.5),
  ]);
  const cordGeo = trackGeo(new THREE.TubeGeometry(cordCurve, 32, 0.12, 10, false));
  const cord = new THREE.Mesh(cordGeo, materials.cable);
  cord.castShadow = true;
  mouseGroup.add(cord);

  // 5. X-Displacement Knife-Edge Wheel & Potentiometer
  const xWheelGroup = new THREE.Group();
  xWheelGroup.position.set(-1.1, 0.25, -0.6);

  // Tapered Knife-Edge Brass Wheel Profile
  const xWheelRim = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.85, 0.85, 0.15, 32)),
    materials.brassWheel,
  );
  xWheelRim.rotation.z = Math.PI / 2;
  xWheelRim.castShadow = true;
  xWheelGroup.add(xWheelRim);

  const xAxle = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 16)),
    materials.steelPivot ||
      trackMat(new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 })),
  );
  xAxle.rotation.z = Math.PI / 2;
  xWheelGroup.add(xAxle);

  const xPotBody = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.6, 0.6, 0.5, 24)),
    materials.potentiometer,
  );
  xPotBody.rotation.z = Math.PI / 2;
  xPotBody.position.x = 0.8;
  xWheelGroup.add(xPotBody);

  const xPotWiper = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.08, 0.45, 0.12)),
    materials.wiperCopper,
  );
  xPotWiper.position.set(0.6, 0.2, 0);
  xWheelGroup.add(xPotWiper);

  mouseGroup.add(xWheelGroup);

  // 6. Y-Displacement Knife-Edge Wheel & Potentiometer
  const yWheelGroup = new THREE.Group();
  yWheelGroup.position.set(0.7, 0.25, 1.2);

  const yWheelRim = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.85, 0.85, 0.15, 32)),
    materials.brassWheel,
  );
  yWheelRim.rotation.x = Math.PI / 2;
  yWheelRim.castShadow = true;
  yWheelGroup.add(yWheelRim);

  const yAxle = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 16)),
    materials.steelPivot ||
      trackMat(new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 })),
  );
  yAxle.rotation.x = Math.PI / 2;
  yWheelGroup.add(yAxle);

  const yPotBody = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.6, 0.6, 0.5, 24)),
    materials.potentiometer,
  );
  yPotBody.rotation.x = Math.PI / 2;
  yPotBody.position.z = -0.8;
  yWheelGroup.add(yPotBody);

  const yPotWiper = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.12, 0.45, 0.08)),
    materials.wiperCopper,
  );
  yPotWiper.position.set(0, 0.2, -0.6);
  yWheelGroup.add(yPotWiper);

  mouseGroup.add(yWheelGroup);

  const nodes: EngelbartMouseModelNodes = {
    rootGroup,
    mouseGroup,
    body,
    basePlate,
    redButton,
    microswitchGroup,
    switchLeaf,
    xWheelGroup,
    xWheelRim,
    xPotWiper,
    yWheelGroup,
    yWheelRim,
    yPotWiper,
    boot,
    cord,
  };

  const dispose = () => {
    for (const m of materialsToDispose) m.dispose();
    for (const g of geometriesToDispose) g.dispose();
    for (const t of texturesToDispose) t.dispose();
  };

  return { rootGroup, nodes, materials, dispose };
}

/**
 * Updates planar position tracking, orthogonal wheel rotation, button clicks, and X-ray mode.
 */
export function updateEngelbartMouseKinematics(
  nodes: EngelbartMouseModelNodes,
  materials: EngelbartMouseMaterials,
  dt: number,
  timeSec: number,
  pathDisplayOmega: number,
  resolverSvgScale: number,
  mouseTrajectory: "figure8" | "circle" | "horizontal" | "vertical",
  wheelRadiusMm: number,
  pulsesPerRev: number,
  isClicking: boolean,
  isXRayMode: boolean,
) {
  // Casing X-Ray Toggle
  nodes.body.material = isXRayMode ? materials.woodHousingXRay : materials.woodHousing;

  // Trajectory computation
  const speed = pathDisplayOmega;
  let posX = 0;
  let posZ = 0;
  let dX = 0;
  let dZ = 0;

  if (mouseTrajectory === "horizontal") {
    posX = Math.sin(timeSec * speed) * 3.5;
    posZ = 0;
    dX = Math.cos(timeSec * speed) * speed * dt * 3.5;
    dZ = 0;
  } else if (mouseTrajectory === "vertical") {
    posX = 0;
    posZ = Math.sin(timeSec * speed) * 3.5;
    dX = 0;
    dZ = Math.cos(timeSec * speed) * speed * dt * 3.5;
  } else if (mouseTrajectory === "circle") {
    posX = Math.cos(timeSec * speed) * 3.0;
    posZ = Math.sin(timeSec * speed) * 3.0;
    dX = -Math.sin(timeSec * speed) * speed * dt * 3.0;
    dZ = Math.cos(timeSec * speed) * speed * dt * 3.0;
  } else {
    // Figure 8
    posX = Math.sin(timeSec * speed) * 3.2;
    posZ = Math.sin(timeSec * speed * 2.0) * 1.8;
    dX = Math.cos(timeSec * speed) * speed * dt * 3.2;
    dZ = Math.cos(timeSec * speed * 2.0) * speed * 2.0 * dt * 1.8;
  }

  nodes.mouseGroup.position.set(posX, 0, posZ);

  const resolved = stepEngelbartResolver(
    dX * resolverSvgScale,
    dZ * resolverSvgScale,
    wheelRadiusMm,
    pulsesPerRev,
  );

  const xy = cyclicSymmetry(4, 0.4);
  const flexX = 1 + 0.2 * cyclicSol(xy, 0);
  const flexY = 1 + 0.2 * cyclicSol(xy, 1);
  nodes.xWheelRim.rotation.x -= resolved.dThetaX * flexX;
  nodes.xPotWiper.rotation.x -= resolved.dThetaX * flexX;
  nodes.yWheelRim.rotation.z += resolved.dThetaY * flexY;
  nodes.yPotWiper.rotation.z += resolved.dThetaY * flexY;

  // Microswitch Button Depress
  nodes.redButton.position.y = isClicking ? 2.44 : 2.6;
  nodes.switchLeaf.rotation.x = isClicking ? 0.08 : 0;
}
